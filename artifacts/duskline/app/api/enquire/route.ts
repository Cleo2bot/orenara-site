import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
import path from "path";

interface EnquiryData {
  name: string;
  email: string;
  phone?: string;
  suburb: string;
  kit: string;
  timeline: string;
  message?: string;
}

interface StoredEnquiry extends EnquiryData {
  id: string;
  receivedAt: string;
  ip: string;
}

function validateEnquiry(body: Partial<EnquiryData>): string | null {
  if (!body.name || body.name.trim().length < 2) return "Name is required.";
  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) return "A valid email address is required.";
  if (!body.suburb || body.suburb.trim().length < 2) return "Suburb/State is required.";
  if (!body.kit) return "Please select a kit.";
  if (!body.timeline) return "Please select a project timeline.";
  return null;
}

async function saveToFile(enquiry: StoredEnquiry): Promise<void> {
  const dataDir = path.join(process.cwd(), "data");
  const filePath = path.join(dataDir, "submissions.json");

  await mkdir(dataDir, { recursive: true });

  let existing: StoredEnquiry[] = [];
  try {
    const content = await readFile(filePath, "utf-8");
    existing = JSON.parse(content);
  } catch {
    existing = [];
  }

  existing.push(enquiry);
  await writeFile(filePath, JSON.stringify(existing, null, 2), "utf-8");
}

async function sendEmailNotification(enquiry: StoredEnquiry): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "enquiries@duskline.com.au";

  if (!apiKey || !adminEmail) {
    console.log("[Duskline] No RESEND_API_KEY or ADMIN_NOTIFICATION_EMAIL set — skipping email notification.");
    return;
  }

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #15171C; border-bottom: 2px solid #F5B25C; padding-bottom: 12px;">New Duskline Enquiry</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; color: #666; width: 140px;">Name</td><td style="padding: 8px 0; font-weight: 600;">${enquiry.name}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;"><a href="mailto:${enquiry.email}">${enquiry.email}</a></td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Phone</td><td style="padding: 8px 0;">${enquiry.phone || "—"}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Suburb / State</td><td style="padding: 8px 0;">${enquiry.suburb}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Kit interest</td><td style="padding: 8px 0; font-weight: 600; color: #D4913A;">${enquiry.kit}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Timeline</td><td style="padding: 8px 0;">${enquiry.timeline}</td></tr>
        ${enquiry.message ? `<tr><td style="padding: 8px 0; color: #666; vertical-align: top;">Message</td><td style="padding: 8px 0;">${enquiry.message.replace(/\n/g, "<br>")}</td></tr>` : ""}
      </table>
      <p style="margin-top: 24px; font-size: 12px; color: #999;">Received ${enquiry.receivedAt} · ID: ${enquiry.id}</p>
    </div>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Duskline Enquiries <${fromEmail}>`,
      to: [adminEmail],
      reply_to: enquiry.email,
      subject: `New Enquiry — ${enquiry.name} — ${enquiry.kit}`,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[Duskline] Resend API error:", err);
  } else {
    console.log("[Duskline] Notification email sent to", adminEmail);
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: Partial<EnquiryData>;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const validationError = validateEnquiry(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 422 });
  }

  const enquiry: StoredEnquiry = {
    id: `enq_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    receivedAt: new Date().toISOString(),
    ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown",
    name: body.name!.trim(),
    email: body.email!.trim().toLowerCase(),
    phone: body.phone?.trim() || undefined,
    suburb: body.suburb!.trim(),
    kit: body.kit!,
    timeline: body.timeline!,
    message: body.message?.trim() || undefined,
  };

  console.log("[Duskline] New enquiry:", { id: enquiry.id, name: enquiry.name, kit: enquiry.kit });

  await saveToFile(enquiry);

  try {
    await sendEmailNotification(enquiry);
  } catch (err) {
    console.error("[Duskline] Email notification failed (non-fatal):", err);
  }

  return NextResponse.json(
    { success: true, message: "Enquiry received. We'll be in touch within 1–2 business days." },
    { status: 200 }
  );
}
