import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
import path from "path";

interface WaitlistEntry {
  id: string;
  receivedAt: string;
  ip: string;
  kit: string;
  lengths: string[];
  name: string;
  email: string;
  phone?: string;
  metres?: string;
  priceSensible?: string;
  priceTooMuch?: string;
  installer: string;
}

function escapeHtml(v: string): string {
  return v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function validateEntry(body: Record<string, unknown>): string | null {
  if (typeof body.name !== "string" || body.name.trim().length < 2) return "Name is required.";
  if (typeof body.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email))
    return "A valid email address is required.";
  if (typeof body.kit !== "string" || body.kit.trim().length === 0)
    return "Please select a kit.";
  if (typeof body.installer !== "string" || body.installer.trim().length === 0)
    return "Please indicate your installer status.";
  return null;
}

async function saveEntry(entry: WaitlistEntry): Promise<void> {
  const dataDir = path.join(process.cwd(), "data");
  const filePath = path.join(dataDir, "waitlist.json");
  await mkdir(dataDir, { recursive: true });
  let existing: WaitlistEntry[] = [];
  try {
    existing = JSON.parse(await readFile(filePath, "utf-8"));
  } catch { existing = []; }
  existing.push(entry);
  await writeFile(filePath, JSON.stringify(existing, null, 2), "utf-8");
}

async function sendNotification(entry: WaitlistEntry): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "hello@orenara.com";
  if (!apiKey || !adminEmail) return;

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#333">
      <h2 style="color:#15171C;border-bottom:2px solid #D9A05B;padding-bottom:12px">
        New DIY Kit Waitlist Registration
      </h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:8px 0;color:#666;width:180px">Name</td><td style="padding:8px 0;font-weight:600">${escapeHtml(entry.name)}</td></tr>
        <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0"><a href="mailto:${encodeURIComponent(entry.email)}">${escapeHtml(entry.email)}</a></td></tr>
        <tr><td style="padding:8px 0;color:#666">Phone</td><td style="padding:8px 0">${entry.phone ? escapeHtml(entry.phone) : "—"}</td></tr>
        <tr><td style="padding:8px 0;color:#666">Kit</td><td style="padding:8px 0;font-weight:600;color:#D9A05B">${escapeHtml(entry.kit)}</td></tr>
        <tr><td style="padding:8px 0;color:#666">Lengths interested in</td><td style="padding:8px 0">${entry.lengths.map(escapeHtml).join(", ") || "—"}</td></tr>
        <tr><td style="padding:8px 0;color:#666">Approx. metres</td><td style="padding:8px 0">${entry.metres ? escapeHtml(entry.metres) + "m" : "—"}</td></tr>
        <tr><td style="padding:8px 0;color:#666">Price expectation</td><td style="padding:8px 0">${entry.priceSensible ? "$" + escapeHtml(entry.priceSensible) : "—"}</td></tr>
        <tr><td style="padding:8px 0;color:#666">Too expensive at</td><td style="padding:8px 0">${entry.priceTooMuch ? "$" + escapeHtml(entry.priceTooMuch) : "—"}</td></tr>
        <tr><td style="padding:8px 0;color:#666">Installer status</td><td style="padding:8px 0">${escapeHtml(entry.installer)}</td></tr>
      </table>
      <p style="margin-top:24px;font-size:12px;color:#999">Received ${entry.receivedAt} · ID: ${entry.id}</p>
    </div>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: `Orenara Kits <${fromEmail}>`,
      to: [adminEmail],
      reply_to: entry.email,
      subject: `Kit Waitlist — ${entry.name} — ${entry.kit}`.slice(0, 200),
      html,
    }),
  });
  if (!res.ok) console.error("[Orenara] Waitlist notification failed:", await res.text());
}

async function sendConfirmation(entry: WaitlistEntry): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "hello@orenara.com";
  if (!apiKey) return;

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#333">
      <h2 style="color:#15171C;border-bottom:2px solid #D9A05B;padding-bottom:12px">You're on the list.</h2>
      <p style="line-height:1.7">Hi ${escapeHtml(entry.name)},</p>
      <p style="line-height:1.7">
        You've registered your interest in the <strong>${escapeHtml(entry.kit)}</strong> — we'll email you
        the moment kits go live, likely September 2026.
      </p>
      <p style="line-height:1.7">
        No payment has been taken. This is registration only — you're not locked into anything.
      </p>
      <p style="line-height:1.7">
        In the meantime, if you have questions about the system or want to discuss a custom-quoted
        version, reply to this email and we'll come back to you within 1–2 business days.
      </p>
      <p style="margin-top:24px;color:#666">— Orenara<br>orenara.com.au</p>
    </div>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: `Orenara <${fromEmail}>`,
      to: [entry.email],
      subject: "You're on the Orenara kit waitlist",
      html,
    }),
  });
  if (!res.ok) console.error("[Orenara] Waitlist confirmation failed:", await res.text());
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await req.json();
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const validationError = validateEntry(body);
  if (validationError) return NextResponse.json({ error: validationError }, { status: 422 });

  const entry: WaitlistEntry = {
    id: `wl_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    receivedAt: new Date().toISOString(),
    ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown",
    kit: (body.kit as string).trim(),
    lengths: Array.isArray(body.lengths) ? (body.lengths as string[]).filter(s => typeof s === "string") : [],
    name: (body.name as string).trim(),
    email: (body.email as string).trim().toLowerCase(),
    phone: typeof body.phone === "string" && body.phone.trim() ? body.phone.trim() : undefined,
    metres: typeof body.metres === "string" && body.metres.trim() ? body.metres.trim() : undefined,
    priceSensible: typeof body.priceSensible === "string" && body.priceSensible.trim() ? body.priceSensible.trim() : undefined,
    priceTooMuch: typeof body.priceTooMuch === "string" && body.priceTooMuch.trim() ? body.priceTooMuch.trim() : undefined,
    installer: (body.installer as string).trim(),
  };

  try { await saveEntry(entry); } catch (err) { console.error("[Orenara] Waitlist save failed:", err); }
  try { await sendNotification(entry); } catch (err) { console.error("[Orenara] Waitlist notification failed:", err); }
  try { await sendConfirmation(entry); } catch (err) { console.error("[Orenara] Waitlist confirmation failed:", err); }

  return NextResponse.json({ success: true }, { status: 200 });
}
