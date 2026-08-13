import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
import path from "path";
import { calculateRunConfig } from "@/lib/quoteCalc";
import { getLengthMetres } from "@/lib/kits-data";

interface ReviewPayload {
  kit: string;
  kitId: string;
  length: string;
  name: string;
  email: string;
  phone?: string;
  suburb?: string;
  notes?: string;
}

function validateReview(body: unknown): ReviewPayload | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  if (
    typeof b.kit !== "string" ||
    typeof b.kitId !== "string" ||
    typeof b.length !== "string" ||
    typeof b.name !== "string" ||
    typeof b.email !== "string"
  )
    return null;
  if (!b.email.includes("@")) return null;
  if (!b.name.trim() || !b.kit.trim() || !b.length.trim()) return null;
  return {
    kit: b.kit as string,
    kitId: b.kitId as string,
    length: b.length as string,
    name: b.name as string,
    email: b.email as string,
    phone: typeof b.phone === "string" ? b.phone : undefined,
    suburb: typeof b.suburb === "string" ? b.suburb : undefined,
    notes: typeof b.notes === "string" ? b.notes : undefined,
  };
}

async function appendLog(payload: ReviewPayload) {
  try {
    const dir = path.join(process.cwd(), "data");
    await mkdir(dir, { recursive: true });
    const file = path.join(dir, "kit-reviews.jsonl");
    const existing = await readFile(file, "utf8").catch(() => "");
    await writeFile(
      file,
      existing + JSON.stringify({ ...payload, ts: new Date().toISOString() }) + "\n"
    );
  } catch {
    // non-fatal — log only
  }
}

async function sendEmail(payload: ReviewPayload) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;

  const metres = getLengthMetres(payload.length);
  const config = calculateRunConfig(metres);

  const configHtml = `
    <p style="margin: 0 0 4px;">
      <strong>Strip type:</strong> ${config.stripType === "cc" ? "CC (constant-current, OR-SF-16CC)" : "Mono (OR-SF-16M)"}
    </p>
    <p style="margin: 0 0 4px;">
      <strong>Physical runs:</strong> ${config.physicalRuns.map((r) => `${r.toFixed(1)}m`).join(" + ")}
    </p>
    <p style="margin: 0 0 4px;">
      <strong>Drivers:</strong> ${config.driversNeeded}
    </p>
  `;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, sans-serif; color: #0F1113; background: #fff; margin: 0; padding: 0;">
  <div style="max-width: 560px; margin: 0 auto; padding: 32px 24px;">
    <p style="font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #888; margin: 0 0 24px;">
      ORENARA — Kit Review Request
    </p>
    <h1 style="font-size: 20px; font-weight: 400; margin: 0 0 24px; border-bottom: 1px solid #eee; padding-bottom: 16px;">
      ${payload.name} — ${payload.kit} / ${payload.length}
    </h1>

    <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 24px;">
      <tr><td style="padding: 5px 0; color: #666; width: 120px;">Kit</td><td style="padding: 5px 0; font-weight: 500;">${payload.kit}</td></tr>
      <tr><td style="padding: 5px 0; color: #666;">Length</td><td style="padding: 5px 0; font-weight: 500;">${payload.length}</td></tr>
      <tr><td style="padding: 5px 0; color: #666;">Name</td><td style="padding: 5px 0;">${payload.name}</td></tr>
      <tr><td style="padding: 5px 0; color: #666;">Email</td><td style="padding: 5px 0;">${payload.email}</td></tr>
      ${payload.phone ? `<tr><td style="padding: 5px 0; color: #666;">Phone</td><td style="padding: 5px 0;">${payload.phone}</td></tr>` : ""}
      ${payload.suburb ? `<tr><td style="padding: 5px 0; color: #666;">Suburb</td><td style="padding: 5px 0;">${payload.suburb}</td></tr>` : ""}
    </table>

    ${payload.notes ? `
    <div style="background: #f8f8f8; border: 1px solid #eee; border-radius: 4px; padding: 14px 16px; margin-bottom: 24px; font-size: 14px; color: #444; line-height: 1.6;">
      ${payload.notes}
    </div>
    ` : ""}

    <div style="border: 1px solid #eee; border-radius: 4px; padding: 16px; font-size: 13px;">
      <p style="font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: #999; margin: 0 0 10px;">
        System config — ${payload.length} run
      </p>
      ${configHtml}
    </div>
  </div>
</body>
</html>`.trim();

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Orenara Kits <kits@orenara.com>",
      to: ["enquiries@orenara.com"],
      reply_to: payload.email,
      subject: `Kit review — ${payload.name} — ${payload.kit} ${payload.length}`,
      html,
    }),
  });
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const payload = validateReview(body);
  if (!payload) {
    return NextResponse.json({ error: "Required fields missing" }, { status: 422 });
  }

  await appendLog(payload);
  await sendEmail(payload).catch(() => {});

  return NextResponse.json({ ok: true });
}
