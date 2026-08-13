import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
import path from "path";
import { PART_NUMBERS, PART_LABELS, getKitPartNumber, type StripType } from "@/lib/quoteCalc";

interface QuoteRunPayload {
  lengthMetres: number;
  shape: "straight" | "curved";
  mountingType: string;
}

interface QuoteZonePayload {
  name: string;
  note?: string;
  runs: QuoteRunPayload[];
  totalLengthMetres: number;
  stripType?: StripType;
  driversNeeded: number;
  dimmersNeeded: number;
  plugsNeeded: number;
  connectorSetsNeeded?: number;
  rigidChannelMetres: number;
  flexibleTrackMetres: number;
}

interface QuoteTotalsPayload {
  stripMetres: number;
  drivers: number;
  dimmers: number;
  plugs: number;
  connectorSets?: number;
  rigidChannelMetres: number;
  flexibleTrackMetres: number;
}

interface EnquiryData {
  name: string;
  email: string;
  phone?: string;
  suburb: string;
  kit: string;
  timeline: string;
  message?: string;
  zones?: QuoteZonePayload[];
  totals?: QuoteTotalsPayload;
}

interface StoredEnquiry extends EnquiryData {
  id: string;
  receivedAt: string;
  ip: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function validateRuns(runs: unknown): string | null {
  if (!Array.isArray(runs) || runs.length === 0) return "Each zone needs at least one run.";

  for (const r of runs) {
    if (typeof r !== "object" || r === null) return "Invalid run data.";
    const run = r as Partial<QuoteRunPayload>;
    if (typeof run.lengthMetres !== "number" || !Number.isFinite(run.lengthMetres) || run.lengthMetres <= 0) {
      return "Each run needs a length greater than 0.";
    }
    if (run.shape !== "straight" && run.shape !== "curved") return "Each run needs a valid shape.";
    if (typeof run.mountingType !== "string" || run.mountingType.trim().length === 0) {
      return "Invalid run mounting type.";
    }
  }

  return null;
}

function validateZones(zones: unknown): string | null {
  if (!Array.isArray(zones)) return "Zones must be a list.";
  if (zones.length === 0) return "Add at least one zone before sending.";

  for (const z of zones) {
    if (typeof z !== "object" || z === null) return "Invalid zone data.";
    const zone = z as Partial<QuoteZonePayload>;
    if (typeof zone.name !== "string" || zone.name.trim().length === 0) return "Each zone needs a name.";

    const runsError = validateRuns(zone.runs);
    if (runsError) return runsError;

    if (
      typeof zone.totalLengthMetres !== "number" ||
      !Number.isFinite(zone.totalLengthMetres) ||
      zone.totalLengthMetres <= 0
    ) {
      return "Each zone needs a total run length greater than 0.";
    }
    if (typeof zone.driversNeeded !== "number" || zone.driversNeeded < 0) return "Invalid zone driver count.";
    if (typeof zone.dimmersNeeded !== "number" || zone.dimmersNeeded < 0) return "Invalid zone dimmer count.";
    if (typeof zone.plugsNeeded !== "number" || zone.plugsNeeded < 0) return "Invalid zone plug count.";
    if (typeof zone.rigidChannelMetres !== "number" || zone.rigidChannelMetres < 0) {
      return "Invalid zone rigid channel metres.";
    }
    if (typeof zone.flexibleTrackMetres !== "number" || zone.flexibleTrackMetres < 0) {
      return "Invalid zone flexible track metres.";
    }
    if (zone.note !== undefined && typeof zone.note !== "string") return "Invalid zone note.";
  }

  return null;
}

function validateTotals(totals: unknown): string | null {
  if (typeof totals !== "object" || totals === null) return "Invalid totals data.";
  const t = totals as Partial<QuoteTotalsPayload>;
  const numericFields: (keyof QuoteTotalsPayload)[] = [
    "stripMetres",
    "drivers",
    "dimmers",
    "plugs",
    "rigidChannelMetres",
    "flexibleTrackMetres",
  ];
  for (const field of numericFields) {
    if (typeof t[field] !== "number" || !Number.isFinite(t[field]) || (t[field] as number) < 0) {
      return "Invalid totals data.";
    }
  }
  return null;
}

function validateEnquiry(body: Partial<EnquiryData>): string | null {
  if (typeof body.name !== "string" || body.name.trim().length < 2) return "Name is required.";
  if (typeof body.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return "A valid email address is required.";
  }
  if (body.phone !== undefined && typeof body.phone !== "string") return "Invalid phone number.";
  if (typeof body.suburb !== "string" || body.suburb.trim().length < 2) return "Suburb/State is required.";
  if (typeof body.kit !== "string" || body.kit.trim().length === 0) return "Please select a kit.";
  if (typeof body.timeline !== "string" || body.timeline.trim().length === 0) return "Please select a project timeline.";
  if (body.message !== undefined && typeof body.message !== "string") return "Invalid message.";
  if (body.zones !== undefined) {
    const zonesError = validateZones(body.zones);
    if (zonesError) return zonesError;
  }
  if (body.totals !== undefined) {
    const totalsError = validateTotals(body.totals);
    if (totalsError) return totalsError;
  }
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

function mountingPartNumber(shape: "straight" | "curved"): string {
  return shape === "curved" ? PART_NUMBERS.flexibleTrack : PART_NUMBERS.rigidChannel;
}

function stripPartNumber(stripType?: StripType): string {
  return stripType === "cc" ? PART_NUMBERS.stripCC : PART_NUMBERS.stripMono;
}

function stripPartLabel(stripType?: StripType): string {
  return stripType === "cc" ? PART_LABELS.stripCC : PART_LABELS.stripMono;
}

async function sendEmailNotification(enquiry: StoredEnquiry): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  // Email domain intentionally orenara.com (Resend-verified); site canonical is orenara.com.au.
  // DNS + Resend domain verification for orenara.com must be completed manually before go-live.
  const fromEmail = process.env.RESEND_FROM_EMAIL || "hello@orenara.com";

  if (!apiKey || !adminEmail) {
    console.log("[Orenara] No RESEND_API_KEY or ADMIN_NOTIFICATION_EMAIL set — skipping email notification.");
    return;
  }

  const hasZones = !!enquiry.zones && enquiry.zones.length > 0;

  const zoneRowsHtml = hasZones
    ? enquiry.zones!
        .map((z) => {
          const runsHtml = z.runs
            .map(
              (r) =>
                `${r.lengthMetres}m ${escapeHtml(r.shape)} — ${escapeHtml(r.mountingType)} (${mountingPartNumber(r.shape)})`
            )
            .join("<br>");
          const noteRow = z.note
            ? `<tr><td colspan="4" style="padding: 2px 0 10px; color: #999; font-size: 12px; font-style: italic;">Note: ${escapeHtml(z.note)}</td></tr>`
            : "";
          return `
            <tr>
              <td style="padding: 8px 0; border-top: 1px solid #eee; font-weight: 600; vertical-align: top;">${escapeHtml(z.name)}</td>
              <td style="padding: 8px 0; border-top: 1px solid #eee; vertical-align: top;">${runsHtml} (${z.totalLengthMetres}m total)</td>
              <td style="padding: 8px 0; border-top: 1px solid #eee; vertical-align: top;">${z.totalLengthMetres}m ${stripPartLabel(z.stripType)} (${stripPartNumber(z.stripType)})<br>${z.driversNeeded}x ${PART_LABELS.driver} (${PART_NUMBERS.driver})<br>${z.plugsNeeded}x ${PART_LABELS.plug} (${PART_NUMBERS.plug})</td>
            </tr>
            ${noteRow}
          `;
        })
        .join("")
    : "";

  const totalsHtml =
    hasZones && enquiry.totals
      ? `
        <div style="margin-top: 24px; padding: 16px; background: #f7f5f0; border-radius: 6px;">
          <p style="margin: 0 0 10px; font-weight: 700; color: #15171C;">Totals</p>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            ${(() => {
              const monoM = (enquiry.zones ?? []).filter(z => z.stripType !== "cc").reduce((s, z) => s + z.totalLengthMetres, 0);
              const ccM   = (enquiry.zones ?? []).filter(z => z.stripType === "cc").reduce((s, z) => s + z.totalLengthMetres, 0);
              const rows = [];
              if (monoM > 0) rows.push(`<tr><td style="padding: 3px 0; color: #666;">${PART_LABELS.stripMono} (${PART_NUMBERS.stripMono})</td><td style="padding: 3px 0; font-weight: 600; text-align: right;">${monoM}m</td></tr>`);
              if (ccM   > 0) rows.push(`<tr><td style="padding: 3px 0; color: #666;">${PART_LABELS.stripCC} (${PART_NUMBERS.stripCC})</td><td style="padding: 3px 0; font-weight: 600; text-align: right;">${ccM}m</td></tr>`);
              if (rows.length === 0) rows.push(`<tr><td style="padding: 3px 0; color: #666;">${PART_LABELS.stripMono} (${PART_NUMBERS.stripMono})</td><td style="padding: 3px 0; font-weight: 600; text-align: right;">${enquiry.totals?.stripMetres ?? 0}m</td></tr>`);
              return rows.join("");
            })()}
            <tr><td style="padding: 3px 0; color: #666;">${PART_LABELS.driver} (${PART_NUMBERS.driver})</td><td style="padding: 3px 0; font-weight: 600; text-align: right;">${enquiry.totals.drivers}</td></tr>
            <tr><td style="padding: 3px 0; color: #666;">${PART_LABELS.dimmer} (${PART_NUMBERS.dimmer})</td><td style="padding: 3px 0; font-weight: 600; text-align: right;">${enquiry.totals.dimmers}</td></tr>
            <tr><td style="padding: 3px 0; color: #666;">${PART_LABELS.plug} (${PART_NUMBERS.plug})</td><td style="padding: 3px 0; font-weight: 600; text-align: right;">${enquiry.totals.plugs}</td></tr>
            <tr><td style="padding: 3px 0; color: #666;">${PART_LABELS.rigidChannel} (${PART_NUMBERS.rigidChannel})</td><td style="padding: 3px 0; font-weight: 600; text-align: right;">${enquiry.totals.rigidChannelMetres}m</td></tr>
            <tr><td style="padding: 3px 0; color: #666;">${PART_LABELS.flexibleTrack} (${PART_NUMBERS.flexibleTrack})</td><td style="padding: 3px 0; font-weight: 600; text-align: right;">${enquiry.totals.flexibleTrackMetres}m</td></tr>
          </table>
        </div>
      `
      : "";

  const zoneSectionHtml = hasZones
    ? `
      <div style="margin-top: 28px;">
        <h3 style="color: #15171C; border-bottom: 2px solid #F5B25C; padding-bottom: 8px; font-size: 16px;">Quote Builder — Zone Breakdown</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          ${zoneRowsHtml}
        </table>
        ${totalsHtml}
      </div>
    `
    : "";

  const kitPartNumber = getKitPartNumber(enquiry.kit);
  const kitLabel = kitPartNumber ? `${escapeHtml(enquiry.kit)} (${kitPartNumber})` : escapeHtml(enquiry.kit);

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #15171C; border-bottom: 2px solid #F5B25C; padding-bottom: 12px;">${hasZones ? "New Orenara Quote Builder Enquiry" : "New Orenara Enquiry"}</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; color: #666; width: 140px;">Name</td><td style="padding: 8px 0; font-weight: 600;">${escapeHtml(enquiry.name)}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;"><a href="mailto:${encodeURIComponent(enquiry.email)}">${escapeHtml(enquiry.email)}</a></td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Phone</td><td style="padding: 8px 0;">${enquiry.phone ? escapeHtml(enquiry.phone) : "—"}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Suburb / State</td><td style="padding: 8px 0;">${escapeHtml(enquiry.suburb)}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Kit interest</td><td style="padding: 8px 0; font-weight: 600; color: #D4913A;">${kitLabel}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Timeline</td><td style="padding: 8px 0;">${escapeHtml(enquiry.timeline)}</td></tr>
        ${enquiry.message ? `<tr><td style="padding: 8px 0; color: #666; vertical-align: top;">Message</td><td style="padding: 8px 0;">${escapeHtml(enquiry.message).replace(/\n/g, "<br>")}</td></tr>` : ""}
      </table>
      ${zoneSectionHtml}
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
      from: `Orenara Enquiries <${fromEmail}>`,
      to: [adminEmail],
      reply_to: enquiry.email,
      subject: hasZones
        ? `New Quote Builder Enquiry — ${enquiry.name} — ${enquiry.zones!.length} zone${enquiry.zones!.length === 1 ? "" : "s"}`.slice(0, 200)
        : `New Enquiry — ${enquiry.name} — ${enquiry.kit}`.slice(0, 200),
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[Orenara] Resend API error:", err);
  } else {
    console.log("[Orenara] Notification email sent to", adminEmail);
  }
}

async function sendCustomerConfirmation(enquiry: StoredEnquiry): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  // Email domain intentionally orenara.com (Resend-verified); site canonical is orenara.com.au.
  const fromEmail = process.env.RESEND_FROM_EMAIL || "hello@orenara.com";

  if (!apiKey) {
    console.log("[Orenara] No RESEND_API_KEY set — skipping customer confirmation email.");
    return;
  }

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #15171C; border-bottom: 2px solid #F5B25C; padding-bottom: 12px;">Enquiry received</h2>
      <p style="line-height: 1.7;">Hi ${escapeHtml(enquiry.name)},</p>
      <p style="line-height: 1.7;">Thanks for your enquiry. We've received it and we'll come back to you within 1–2 business days with pricing and a confirmed delivery schedule.</p>
      <p style="line-height: 1.7;">Every system is built to order — allow up to 20 business days from order confirmation.</p>
      <p style="line-height: 1.7;">Orenara supplies the system only; installation is arranged by you or your electrician.</p>
      <p style="margin-top: 24px; color: #666;">— Orenara<br>orenara.com.au</p>
    </div>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Orenara <${fromEmail}>`,
      to: [enquiry.email],
      subject: "We've received your enquiry — Orenara",
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[Orenara] Resend API error (customer confirmation):", err);
  } else {
    console.log("[Orenara] Customer confirmation email sent to", enquiry.email);
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: Partial<EnquiryData>;

  try {
    const parsed: unknown = await req.json();
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }
    body = parsed as Partial<EnquiryData>;
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
    zones: body.zones && body.zones.length > 0 ? body.zones : undefined,
    totals: body.totals,
  };

  console.log("[Orenara] New enquiry:", { id: enquiry.id, name: enquiry.name, kit: enquiry.kit });

  try {
    await saveToFile(enquiry);
  } catch (err) {
    console.error("[Orenara] Could not persist enquiry to disk (non-fatal, expected on read-only hosts like Vercel):", err);
  }

  try {
    await sendEmailNotification(enquiry);
  } catch (err) {
    console.error("[Orenara] Email notification failed (non-fatal):", err);
  }

  try {
    await sendCustomerConfirmation(enquiry);
  } catch (err) {
    console.error("[Orenara] Customer confirmation email failed (non-fatal):", err);
  }

  return NextResponse.json(
    { success: true, message: "Enquiry received. We'll be in touch within 1–2 business days." },
    { status: 200 }
  );
}
