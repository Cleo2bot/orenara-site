import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
import path from "path";
import {
  calculateRunConfig,
  PART_NUMBERS,
  PART_LABELS,
} from "@/lib/quoteCalc";
import {
  getLengthMetres,
  calculateKitPricing,
  fmtAUD,
  CONNECTOR_ENTRY_LABELS,
} from "@/lib/kits-data";

/* ------------------------------------------------------------------ types */
type SubmissionType = "review" | "confirm" | "email_quote";

interface ZoneEntry {
  name: string;
  type: string;
  metres?: string;
  material?: string;
  profile?: string;
  connectorEntry?: string;
  trim?: boolean;
  // pool-specific
  poolL?: string;
  poolW?: string;
  poolMount?: string;
  poolTileWidth?: string;
  poolSides?: Record<string, boolean>;
  // stair-specific
  steps?: string;
}

interface KitConfig {
  kit: string;
  kitId: string;
  length: string;
  zones?: ZoneEntry[];
  // legacy single-zone fields (kept for backward compat)
  channelMaterial?: string;
  channelProfile?: string;
  connectorEntry?: string;
  trim?: boolean;
}

interface ContactInfo {
  name?: string;
  email: string;
  phone?: string;
  suburb?: string;
  notes?: string;
}

interface SubmissionPayload extends KitConfig, ContactInfo {
  type: SubmissionType;
}

/* ------------------------------------------------------------------ validation */
function validate(body: unknown): SubmissionPayload | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  if (typeof b.type !== "string") return null;
  if (typeof b.email !== "string" || !b.email.includes("@")) return null;
  if (typeof b.kit !== "string" || !b.kit.trim()) return null;
  const type = b.type as SubmissionType;
  // confirm and review require name
  if ((type === "confirm" || type === "review") && typeof b.name !== "string") return null;
  return {
    type,
    kit: (b.kit as string),
    kitId: typeof b.kitId === "string" ? b.kitId : "",
    length: typeof b.length === "string" ? b.length : "",
    zones: Array.isArray(b.zones) ? (b.zones as ZoneEntry[]) : undefined,
    channelMaterial: typeof b.channelMaterial === "string" ? b.channelMaterial : undefined,
    channelProfile: typeof b.channelProfile === "string" ? b.channelProfile : undefined,
    connectorEntry: typeof b.connectorEntry === "string" ? b.connectorEntry : undefined,
    trim: typeof b.trim === "boolean" ? b.trim : false,
    name: typeof b.name === "string" ? b.name : undefined,
    email: b.email as string,
    phone: typeof b.phone === "string" && b.phone.trim() ? b.phone : undefined,
    suburb: typeof b.suburb === "string" && b.suburb.trim() ? b.suburb : undefined,
    notes: typeof b.notes === "string" && b.notes.trim() ? b.notes : undefined,
  };
}

/* ------------------------------------------------------------------ order ref */
async function nextOrderRef(): Promise<string> {
  const file = path.join(process.cwd(), "data", "kit-orders.jsonl");
  const existing = await readFile(file, "utf8").catch(() => "");
  const count = existing.trim() ? existing.trim().split("\n").length : 0;
  return `OR-ORD-${(count + 1).toString().padStart(4, "0")}`;
}

/* ------------------------------------------------------------------ logging */
async function appendLog(
  filename: string,
  record: object
): Promise<void> {
  try {
    const dir = path.join(process.cwd(), "data");
    await mkdir(dir, { recursive: true });
    const file = path.join(dir, filename);
    const existing = await readFile(file, "utf8").catch(() => "");
    await writeFile(
      file,
      existing + JSON.stringify({ ...record, ts: new Date().toISOString() }) + "\n"
    );
  } catch {
    // non-fatal
  }
}

/* ------------------------------------------------------------------ email helpers */

/** Render one zone row (per-area breakdown for multi-area builds). */
function zoneRow(z: ZoneEntry, idx: number): string {
  const materialLabel = z.material === "stainless" ? "Stainless 316L" : "Aluminium";
  const profileLabel  = z.profile === "flex" ? "Flex" : "Straight";
  const connLabel     = CONNECTOR_ENTRY_LABELS[z.connectorEntry ?? "bottom"] ?? z.connectorEntry ?? "Bottom";
  const trimNote      = z.trim ? " · trim allowance" : "";
  const isPool        = z.type === "pool";

  let desc = "";
  if (isPool) {
    const mount = z.poolMount === "recessed" ? "Recessed" : "Coping";
    desc = `Pool · ${mount}${z.poolL && z.poolW ? ` · ${z.poolL}×${z.poolW}m` : ""}`;
  } else {
    desc = `${z.type.charAt(0).toUpperCase()}${z.type.slice(1)} · ${z.metres ?? "?"}m`;
  }

  return `<tr>
    <td style="padding:5px 0;color:#555;vertical-align:top;font-size:12px;width:24px;">${idx + 1}.</td>
    <td style="padding:5px 0;vertical-align:top;">
      <span style="font-weight:500;font-size:13px;">${z.name}</span>
      <span style="color:#888;font-size:12px;"> — ${desc}</span><br>
      <span style="color:#999;font-size:11px;">${materialLabel} · ${profileLabel} · ${connLabel} entry${trimNote}</span>
    </td>
  </tr>`;
}

function configBlock(p: SubmissionPayload): string {
  const metres = p.length ? getLengthMetres(p.length) : null;
  if (!metres) return "";

  const runCfg = calculateRunConfig(metres);
  const stripPart =
    runCfg.stripType === "cc" ? PART_NUMBERS.stripCC : PART_NUMBERS.stripMono;
  const stripLabel =
    runCfg.stripType === "cc" ? PART_LABELS.stripCC : PART_LABELS.stripMono;
  const pricing = calculateKitPricing(metres);

  // Per-area breakdown — shown when zones payload is present
  const zonesSection = p.zones && p.zones.length > 0
    ? `<table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:16px;">
         <tr><td colspan="2" style="padding:4px 0 8px;color:#666;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;">Areas configured</td></tr>
         ${p.zones.map((z, i) => zoneRow(z, i)).join("")}
       </table>`
    : (() => {
        // Legacy single-zone format (fallback)
        const connLabel     = CONNECTOR_ENTRY_LABELS[p.connectorEntry ?? "bottom"] ?? p.connectorEntry ?? "Bottom";
        const materialLabel = p.channelMaterial === "stainless" ? "Stainless 316L" : "Aluminium";
        const profileLabel  = p.channelProfile === "flex" ? "Flex" : "Straight";
        return `<table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:16px;">
          <tr><td style="padding:4px 0;color:#666;width:140px;">Kit</td><td style="padding:4px 0;font-weight:500;">${p.kit}</td></tr>
          <tr><td style="padding:4px 0;color:#666;">Length</td><td style="padding:4px 0;font-weight:500;">${p.length}</td></tr>
          <tr><td style="padding:4px 0;color:#666;">Channel</td><td style="padding:4px 0;">${materialLabel} · ${profileLabel}</td></tr>
          <tr><td style="padding:4px 0;color:#666;">Connector entry</td><td style="padding:4px 0;">${connLabel}</td></tr>
          ${p.trim ? `<tr><td style="padding:4px 0;color:#666;">Trim on site</td><td style="padding:4px 0;">Yes — spare connector set included</td></tr>` : ""}
        </table>`;
      })();

  return `
    <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:16px;">
      <tr><td style="padding:4px 0;color:#666;width:140px;">Kit</td><td style="padding:4px 0;font-weight:500;">${p.kit}</td></tr>
      <tr><td style="padding:4px 0;color:#666;">Total</td><td style="padding:4px 0;font-weight:500;">${p.length}</td></tr>
    </table>
    ${zonesSection}
    <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:16px;">
      <tr><td style="padding:4px 0;color:#666;">Strip</td><td style="padding:4px 0;">${stripLabel} (${stripPart})</td></tr>
      <tr><td style="padding:4px 0;color:#666;">Runs</td><td style="padding:4px 0;">${runCfg.physicalRuns.map(r=>`${r.toFixed(1)}m`).join(" + ")} (${runCfg.physicalRuns.length}× independently fed)</td></tr>
      <tr><td style="padding:4px 0;color:#666;">Drivers</td><td style="padding:4px 0;">${runCfg.driversNeeded}× ${PART_NUMBERS.driver}</td></tr>
    </table>
    <table style="width:100%;border-collapse:collapse;font-size:13px;border-top:1px solid #eee;padding-top:10px;margin-bottom:16px;">
      ${pricing.minimumApplied
        ? `<tr><td style="padding:4px 0;color:#666;">Minimum order</td><td style="padding:4px 0;font-weight:600;">${fmtAUD(pricing.totalIncGST)} inc GST</td></tr>
           <tr><td colspan="2" style="padding:2px 0;font-size:11px;color:#999;">Minimum order applied — quoted run (${fmtAUD(pricing.subtotalIncGST)} inc GST) is below the $500 floor.</td></tr>`
        : `<tr><td style="padding:4px 0;color:#666;">${p.length} × ${fmtAUD(pricing.pricePerMetre)}/m inc GST</td><td style="padding:4px 0;">${fmtAUD(pricing.subtotalIncGST)}</td></tr>
           <tr><td style="padding:4px 0;color:#666;font-weight:600;">Total</td><td style="padding:4px 0;font-weight:600;">${fmtAUD(pricing.totalIncGST)} inc GST</td></tr>`
      }
    </table>
  `;
}

function contactBlock(p: SubmissionPayload): string {
  return `
    <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:16px;">
      ${p.name ? `<tr><td style="padding:4px 0;color:#666;width:80px;">Name</td><td style="padding:4px 0;">${p.name}</td></tr>` : ""}
      <tr><td style="padding:4px 0;color:#666;">Email</td><td style="padding:4px 0;">${p.email}</td></tr>
      ${p.phone ? `<tr><td style="padding:4px 0;color:#666;">Phone</td><td style="padding:4px 0;">${p.phone}</td></tr>` : ""}
      ${p.suburb ? `<tr><td style="padding:4px 0;color:#666;">Suburb</td><td style="padding:4px 0;">${p.suburb}</td></tr>` : ""}
    </table>
    ${p.notes ? `<div style="background:#f8f8f8;border:1px solid #eee;border-radius:4px;padding:12px 14px;font-size:13px;color:#444;line-height:1.6;margin-bottom:16px;">${p.notes}</div>` : ""}
  `;
}

function wrapHtml(title: string, body: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,sans-serif;color:#0F1113;background:#fff;margin:0;padding:0;">
<div style="max-width:560px;margin:0 auto;padding:32px 24px;">
<p style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#888;margin:0 0 20px;">ORENARA</p>
<h1 style="font-size:18px;font-weight:400;margin:0 0 20px;border-bottom:1px solid #eee;padding-bottom:14px;">${title}</h1>
${body}
</div></body></html>`;
}

async function sendToOrenara(p: SubmissionPayload, orderRef?: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;

  const typeLabel =
    p.type === "confirm" ? "Order confirmation request" :
    p.type === "email_quote" ? "Quote email request" : "Review request";

  const subject = orderRef
    ? `${orderRef} — ${p.name ?? p.email} — ${p.kit} ${p.length}`
    : `Kit ${p.type} — ${p.name ?? p.email} — ${p.kit} ${p.length}`;

  const html = wrapHtml(
    orderRef ? `${orderRef} · ${p.kit} ${p.length}` : `${typeLabel} · ${p.kit} ${p.length}`,
    `
      ${orderRef ? `<p style="font-size:12px;background:#f4f1ec;border:1px solid #e8e4de;border-radius:4px;padding:10px 14px;margin-bottom:18px;"><strong>Order reference: ${orderRef}</strong></p>` : ""}
      ${contactBlock(p)}
      ${configBlock(p)}
    `
  );

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Orenara Kits <kits@orenara.com>",
      to: ["enquiries@orenara.com"],
      reply_to: p.email,
      subject,
      html,
    }),
  });
}

async function sendConfirmToCustomer(p: SubmissionPayload, orderRef: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;

  const html = wrapHtml(
    `Order received — ${orderRef}`,
    `
      <p style="font-size:14px;line-height:1.7;color:#555;margin:0 0 20px;">
        Thanks ${p.name} — we've received your order request and will be in touch within one business day to confirm availability and arrange an invoice.
      </p>
      ${configBlock(p)}
      <p style="font-size:12px;color:#888;margin:20px 0 0;">
        If anything looks wrong, just reply to this email.
      </p>
    `
  );

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Orenara <hello@orenara.com>",
      to: [p.email],
      subject: `Your Orenara order — ${orderRef}`,
      html,
    }),
  });
}

async function sendQuoteToCustomer(p: SubmissionPayload): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;

  const html = wrapHtml(
    `Your Orenara quote — ${p.kit} ${p.length}`,
    `
      <p style="font-size:14px;line-height:1.7;color:#555;margin:0 0 20px;">
        Here's the system configuration and pricing for the build you were looking at.
      </p>
      ${configBlock(p)}
      <p style="font-size:13px;color:#555;margin:16px 0;">
        Ready to confirm? Reply to this email or go back to
        <a href="https://orenara.com/kits/${p.kitId}" style="color:#0F1113;">orenara.com/kits/${p.kitId}</a>.
      </p>
    `
  );

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Orenara <hello@orenara.com>",
      to: [p.email],
      subject: `Your Orenara quote — ${p.kit} ${p.length}`,
      html,
    }),
  });
}

/* ------------------------------------------------------------------ handler */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const payload = validate(body);
  if (!payload) {
    return NextResponse.json({ error: "Required fields missing or invalid" }, { status: 422 });
  }

  if (payload.type === "confirm") {
    const orderRef = await nextOrderRef();
    await appendLog("kit-orders.jsonl", { ...payload, orderRef });
    await Promise.all([
      sendToOrenara(payload, orderRef).catch(() => {}),
      sendConfirmToCustomer(payload, orderRef).catch(() => {}),
    ]);
    return NextResponse.json({ ok: true, orderRef });
  }

  if (payload.type === "email_quote") {
    await appendLog("kit-quote-emails.jsonl", payload);
    await sendQuoteToCustomer(payload).catch(() => {});
    return NextResponse.json({ ok: true });
  }

  // type === "review"
  await appendLog("kit-reviews.jsonl", payload);
  await sendToOrenara(payload).catch(() => {});
  return NextResponse.json({ ok: true });
}
