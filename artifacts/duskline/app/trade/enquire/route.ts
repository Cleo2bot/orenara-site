import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
import path from "path";

interface TradeEnquiryData {
  name: string;
  business: string;
  email: string;
  phone?: string;
  suburb: string;
  colourGlow: string;
  lengths: string;
  deadline: string;
  details?: string;
}

interface StoredTradeEnquiry extends TradeEnquiryData {
  id: string;
  receivedAt: string;
  ip: string;
  source: "trade";
}

const COLOUR_OPTIONS = [
  "Standard warm glow",
  "Custom colour (RGB/CCT) — specify below",
  "Not sure yet",
];

const DEADLINE_OPTIONS = [
  "Standard 20 business days is fine",
  "I have a hard deadline — specify below",
];

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function validateEnquiry(body: Partial<TradeEnquiryData>): string | null {
  if (!body.name || body.name.trim().length < 2) return "Name is required.";
  if (!body.business || body.business.trim().length < 2) return "Business / trade is required.";
  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) return "A valid email address is required.";
  if (!body.suburb || body.suburb.trim().length < 2) return "Site delivery suburb / postcode is required.";
  if (!body.colourGlow || !COLOUR_OPTIONS.includes(body.colourGlow)) return "Please select a colour / glow.";
  if (!body.lengths || body.lengths.trim().length < 1) return "Approximate lengths / quantity is required.";
  if (!body.deadline || !DEADLINE_OPTIONS.includes(body.deadline)) return "Please select a deadline option.";
  return null;
}

async function saveToFile(enquiry: StoredTradeEnquiry): Promise<void> {
  const dataDir = path.join(process.cwd(), "data");
  const filePath = path.join(dataDir, "submissions.json");

  await mkdir(dataDir, { recursive: true });

  let existing: unknown[] = [];
  try {
    const content = await readFile(filePath, "utf-8");
    existing = JSON.parse(content);
    if (!Array.isArray(existing)) existing = [];
  } catch {
    existing = [];
  }

  existing.push(enquiry);
  await writeFile(filePath, JSON.stringify(existing, null, 2), "utf-8");
}

async function sendEmailNotification(enquiry: StoredTradeEnquiry): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  // Email domain intentionally orenara.com (Resend-verified); site canonical is orenara.com.au.
  // DNS + Resend domain verification for orenara.com must be completed manually before go-live.
  const fromEmail = process.env.RESEND_FROM_EMAIL || "hello@orenara.com";

  if (!apiKey || !adminEmail) {
    console.log("[Orenara] No RESEND_API_KEY or ADMIN_NOTIFICATION_EMAIL set — skipping trade email notification.");
    return;
  }

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #15171C; border-bottom: 2px solid #F5B25C; padding-bottom: 12px;">New Orenara TRADE Enquiry</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; color: #666; width: 160px;">Name</td><td style="padding: 8px 0; font-weight: 600;">${escapeHtml(enquiry.name)}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Business / trade</td><td style="padding: 8px 0; font-weight: 600;">${escapeHtml(enquiry.business)}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;"><a href="mailto:${encodeURIComponent(enquiry.email)}">${escapeHtml(enquiry.email)}</a></td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Phone</td><td style="padding: 8px 0;">${enquiry.phone ? escapeHtml(enquiry.phone) : "—"}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Site suburb / postcode</td><td style="padding: 8px 0;">${escapeHtml(enquiry.suburb)}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Colour / glow</td><td style="padding: 8px 0; font-weight: 600; color: #D4913A;">${escapeHtml(enquiry.colourGlow)}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Lengths / quantity</td><td style="padding: 8px 0;">${escapeHtml(enquiry.lengths)}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Deadline</td><td style="padding: 8px 0; font-weight: 600;">${escapeHtml(enquiry.deadline)}</td></tr>
        ${enquiry.details ? `<tr><td style="padding: 8px 0; color: #666; vertical-align: top;">Additional details</td><td style="padding: 8px 0;">${escapeHtml(enquiry.details).replace(/\n/g, "<br>")}</td></tr>` : ""}
      </table>
      <p style="margin-top: 24px; font-size: 12px; color: #999;">Source: TRADE · Received ${enquiry.receivedAt} · ID: ${enquiry.id}</p>
    </div>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Orenara Trade <${fromEmail}>`,
      to: [adminEmail],
      reply_to: enquiry.email,
      subject: `New TRADE Enquiry — ${enquiry.name} — ${enquiry.business}`,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[Orenara] Resend API error (trade):", err);
  } else {
    console.log("[Orenara] Trade notification email sent to", adminEmail);
  }
}

async function sendCustomerConfirmation(enquiry: StoredTradeEnquiry): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  // Email domain intentionally orenara.com (Resend-verified); site canonical is orenara.com.au.
  const fromEmail = process.env.RESEND_FROM_EMAIL || "hello@orenara.com";

  if (!apiKey) {
    console.log("[Orenara] No RESEND_API_KEY set — skipping trade customer confirmation email.");
    return;
  }

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #15171C; border-bottom: 2px solid #F5B25C; padding-bottom: 12px;">Trade enquiry received</h2>
      <p style="line-height: 1.7;">Hi ${escapeHtml(enquiry.name)},</p>
      <p style="line-height: 1.7;">Got it — we'll come back to you within 24 hours with a firm price and a confirmed delivery date.</p>
      <p style="line-height: 1.7;">Every system is built to order — allow up to 20 business days from order confirmation.</p>
      <p style="line-height: 1.7;">Orenara is supply-only; installation is arranged by you or your electrician.</p>
      <p style="margin-top: 24px; color: #666;">— Orenara Trade<br>orenara.com.au</p>
    </div>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Orenara Trade <${fromEmail}>`,
      to: [enquiry.email],
      subject: "Trade enquiry received — Orenara",
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[Orenara] Resend API error (trade customer confirmation):", err);
  } else {
    console.log("[Orenara] Trade customer confirmation email sent to", enquiry.email);
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: Partial<TradeEnquiryData>;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const validationError = validateEnquiry(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 422 });
  }

  const enquiry: StoredTradeEnquiry = {
    id: `trade_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    receivedAt: new Date().toISOString(),
    ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown",
    source: "trade",
    name: body.name!.trim(),
    business: body.business!.trim(),
    email: body.email!.trim().toLowerCase(),
    phone: body.phone?.trim() || undefined,
    suburb: body.suburb!.trim(),
    colourGlow: body.colourGlow!,
    lengths: body.lengths!.trim(),
    deadline: body.deadline!,
    details: body.details?.trim() || undefined,
  };

  console.log("[Orenara] New TRADE enquiry:", { id: enquiry.id, name: enquiry.name, business: enquiry.business });

  try {
    await saveToFile(enquiry);
  } catch (err) {
    console.error("[Orenara] Could not persist trade enquiry to disk (non-fatal, expected on read-only hosts like Vercel):", err);
  }

  try {
    await sendEmailNotification(enquiry);
  } catch (err) {
    console.error("[Orenara] Trade email notification failed (non-fatal):", err);
  }

  try {
    await sendCustomerConfirmation(enquiry);
  } catch (err) {
    console.error("[Orenara] Trade customer confirmation email failed (non-fatal):", err);
  }

  return NextResponse.json(
    { success: true, message: "Trade enquiry received. We'll come back to you within 24 hours." },
    { status: 200 }
  );
}
