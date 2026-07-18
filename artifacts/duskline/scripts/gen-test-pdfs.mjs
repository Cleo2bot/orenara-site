/**
 * Generates three test PDFs to verify the new QuotePDF layout.
 * Run from artifacts/duskline: node scripts/gen-test-pdfs.mjs
 */
import { register } from "node:module";
import { pathToFileURL } from "node:url";
register("ts-node/esm", pathToFileURL("./"));

const { renderToBuffer } = await import("@react-pdf/renderer");
const { createElement } = await import("react");
const { QuotePDFDoc, registerFonts } = await import("../lib/admin/QuotePDF.js");

registerFonts();

const ABN = "12 345 678 901";
const WARRANTY_RESIDENTIAL = "System warranty: 3 years (2 years for submerged runs)";
const WARRANTY_COMMERCIAL  = "System warranty: 2 years (submerged application)";

const LEAD_TIME = "Every system is built to order — allow up to 20 business days from order confirmation.";

/** Shared base props */
const base = {
  createdAt:  new Date("2025-07-18"),
  validUntil: new Date("2025-08-01"),
  abn: ABN,
  customerPhone: "0412 345 678",
  customerSuburb: "Noosa Heads",
  customerState: "QLD",
};

// ── SHAPE 1: 2-line residential ───────────────────────────────
const shape1 = createElement(QuotePDFDoc, {
  ...base,
  quoteNumber:   "OR-Q-0001",
  customerType:  "residential",
  customerName:  "Sarah Mitchell",
  customerEmail: "sarah.mitchell@email.com",
  projectLabel:  "Pool perimeter — Mitchell Residence",
  systemPrice:   "4200",
  warrantyLine:  WARRANTY_RESIDENTIAL,
  lineItems: [
    { partNumber: "OR-STRIP-24V-WW", description: "LED Strip, 24V warm white — 14m",          qty: "14", unit: "m",   imagePath: null },
    { partNumber: "OR-KIT-POOL",     description: "Pool & Water Feature Kit (complete)",       qty: "1",  unit: "kit", imagePath: null },
  ],
});

// ── SHAPE 2: 4-line residential (real DB quote data shape) ────
const shape2 = createElement(QuotePDFDoc, {
  ...base,
  quoteNumber:   "OR-Q-0024",
  customerType:  "residential",
  customerName:  "Alex Johnson",
  customerEmail: "alex.johnson@email.com",
  customerSuburb: "East Village",
  customerState:  "NSW",
  projectLabel:  "Pool perimeter — East Village",
  systemPrice:   "5720",
  warrantyLine:  WARRANTY_RESIDENTIAL,
  lineItems: [
    { partNumber: "OR-STRIP-24V-WW", description: "LED Strip, 24V warm white — IP68 fully submersible, 24V DC, 10W/m, dot-free diffusion, dimmable 0–10V", qty: "18", unit: "m",   imagePath: null },
    { partNumber: "OR-TRK-FLEX",     description: "Flexible Segmented Track — horizontal bend, pool/water feature",                                         qty: "18", unit: "m",   imagePath: null },
    { partNumber: "OR-DRV-150W",     description: "Driver, 150W — IP67 rated, 0–10V dim input, 240V mains feed",                                          qty: "2",  unit: "ea",  imagePath: null },
    { partNumber: "OR-DIM-010V",     description: "Dimmer, 0–10V wall control — touch panel, scene presets, wireless pairing",                             qty: "2",  unit: "ea",  imagePath: null },
    { partNumber: "OR-PLG-240V",     description: "240V Plug & Power Cable — AU/NZ plug, 1.5m, weatherproof outdoor-rated",                               qty: "2",  unit: "ea",  imagePath: null },
  ],
});

// ── SHAPE 3: commercial, multi-run + option line ──────────────
const shape3 = createElement(QuotePDFDoc, {
  ...base,
  quoteNumber:   "OR-Q-0031",
  customerType:  "commercial",
  customerName:  "Coastal Interiors Pty Ltd",
  customerEmail: "orders@coastalinteriors.com.au",
  customerSuburb: "Surfers Paradise",
  customerState:  "QLD",
  projectLabel:  "Zone A: Pool + Zone B: Pathway + Zone C: Alfresco (multi-run)",
  systemPrice:   "18400",
  warrantyLine:  WARRANTY_COMMERCIAL,
  lineItems: [
    { partNumber: "OR-STRIP-24V-WW", description: "LED Strip, 24V warm white — Zone A pool perimeter run 1 (12m)",        qty: "12", unit: "m",   imagePath: null },
    { partNumber: "OR-STRIP-24V-WW", description: "LED Strip, 24V warm white — Zone A pool perimeter run 2 (9m)",         qty: "9",  unit: "m",   imagePath: null },
    { partNumber: "OR-STRIP-24V-WW", description: "LED Strip, 24V warm white — Zone B pathway edges (22m)",               qty: "22", unit: "m",   imagePath: null },
    { partNumber: "OR-STRIP-24V-WW", description: "LED Strip, 24V warm white — Zone C alfresco overhead (14m)",           qty: "14", unit: "m",   imagePath: null },
    { partNumber: "OR-TRK-FLEX",     description: "Flexible Segmented Track — Zone A curved pool edge",                   qty: "21", unit: "m",   imagePath: null },
    { partNumber: "OR-TRK-RIGID",    description: "Rigid Channel — Zone C alfresco straight runs",                        qty: "14", unit: "m",   imagePath: null },
    { partNumber: "OR-DRV-150W",     description: "Driver, 150W — 1 per zone (×3 zones)",                                 qty: "3",  unit: "ea",  imagePath: null },
    { partNumber: "OR-DIM-010V",     description: "Dimmer, 0–10V wall control — 1 per driver",                            qty: "3",  unit: "ea",  imagePath: null },
    { partNumber: "OR-PLG-240V",     description: "240V Plug & Power Cable",                                              qty: "3",  unit: "ea",  imagePath: null },
    { partNumber: "OR-KIT-CUSTOM",   description: "Custom Zone Kit (complete) — 3 zones, pre-specced bundle",             qty: "1",  unit: "kit", imagePath: null },
    { partNumber: "OR-OPT-EXP",      description: "OPTION: expedite to 10 business days — available on request",         qty: "1",  unit: "opt", imagePath: null },
  ],
});

import { writeFileSync } from "node:fs";

async function save(element, filename) {
  const buf = await renderToBuffer(element);
  const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  writeFileSync(filename, Buffer.from(ab));
  console.log(`✓ ${filename} (${Math.round(buf.byteLength / 1024)} KB)`);
}

await save(shape1, "/tmp/test-quote-1-residential-2line.pdf");
await save(shape2, "/tmp/test-quote-2-residential-5line.pdf");
await save(shape3, "/tmp/test-quote-3-commercial-11line.pdf");
console.log("done");
