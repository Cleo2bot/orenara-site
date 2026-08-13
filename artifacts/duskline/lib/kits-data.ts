/* ------------------------------------------------------------------ types */
export type KitId = "pool-surround" | "stair" | "patio" | "path";
export type ChannelMaterial = "aluminium" | "stainless";
export type ChannelProfile = "straight" | "flex";
export type ConnectorEntry = "direct" | "side" | "bottom" | "l-shape";

export interface KitDef {
  id: KitId;
  name: string;
  tagline: string;
  application: string;
  channel: string;
  channelBadge: string;
  channelNote?: string;
  defaultMaterial: ChannelMaterial;
  defaultProfile: ChannelProfile;
  customLengthMin: number; // metres
  customLengthMax: number; // metres
  lengths: string[];       // preset length-ladder chips
  image: string;
  idealFor: string[];
}

/* ------------------------------------------------------------------ data */
export const KITS: KitDef[] = [
  {
    id: "pool-surround",
    name: "Pool Surround",
    tagline: "Pool coping & pond edges",
    application:
      "For permanent submersion: tile-flush coping, lap-pool edges, infinity-edge channels, pond surrounds.",
    channel: "Stainless 316L",
    channelBadge: "STAINLESS 316L",
    channelNote:
      "Only stainless — aluminium corrodes in chlorinated and salt water.",
    defaultMaterial: "stainless",
    defaultProfile: "flex",
    customLengthMin: 3,
    customLengthMax: 40,
    lengths: ["5m", "10m", "15m", "20m", "25m", "30m", "35m", "40m"],
    image: "/images/kits/kit-pool-overhead.jpg",
    idealFor: [
      "Pool coping and tile-flush edges",
      "Lap pool and infinity pool perimeters",
      "Raised garden pond surrounds",
      "Water features and fountains",
    ],
  },
  {
    id: "stair",
    name: "Stair",
    tagline: "Step edges & stair nosing",
    application:
      "A clean line of light along every step nosing — external garden stairs, internal treads, deck steps, and ramps.",
    channel: "Aluminium",
    channelBadge: "ALUMINIUM",
    defaultMaterial: "aluminium",
    defaultProfile: "straight",
    customLengthMin: 1,
    customLengthMax: 12,
    lengths: ["2m", "3m", "5m", "8m"],
    image: "/images/gallery/orenara-travertine-steps-pool.webp",
    idealFor: [
      "External garden and pool stairs",
      "Internal tread and step nosing",
      "Deck and timber step edges",
      "Ramp and disabled-access edges",
    ],
  },
  {
    id: "patio",
    name: "Patio",
    tagline: "Alfresco edges & pergola fascia",
    application:
      "Continuous warm light along pergola beams, deck edges, alfresco perimeters and BBQ surrounds — built for covered outdoor living.",
    channel: "Aluminium",
    channelBadge: "ALUMINIUM",
    defaultMaterial: "aluminium",
    defaultProfile: "straight",
    customLengthMin: 3,
    customLengthMax: 25,
    lengths: ["5m", "10m", "15m", "20m", "25m"],
    image: "/images/kits/kit-patio.jpg",
    idealFor: [
      "Pergola fascia and beam edges",
      "Alfresco perimeter wall bases",
      "Deck edge and fascia board",
      "BBQ surrounds and outdoor kitchens",
    ],
  },
  {
    id: "path",
    name: "Path",
    tagline: "Garden paths & curved edges",
    application:
      "Follows curves without cuts — designed for garden paths, driveway borders, retaining walls and landscape edges that bend.",
    channel: "Flexible Aluminium",
    channelBadge: "FLEXIBLE ALUMINIUM",
    channelNote:
      "Segmented aluminium channel bends to follow curves — no notching or cutting required.",
    defaultMaterial: "aluminium",
    defaultProfile: "flex",
    customLengthMin: 5,
    customLengthMax: 40,
    lengths: ["10m", "15m", "20m", "25m", "30m", "35m", "40m"],
    image: "/images/gallery/orenara-curved-path-pool-dusk.webp",
    idealFor: [
      "Curved garden paths and walkways",
      "Driveway edge borders",
      "Retaining wall cap edges",
      "Landscape and garden bed borders",
    ],
  },
];

export const TRUST_POINTS = [
  {
    label: "Warranty ownership",
    detail:
      "3 years on standard installations, 2 years on permanent submersion. Orenara owns the IP68 seal — if it fails, we fix it, not your electrician.",
  },
  {
    label: "Factory-sealed connectors",
    detail:
      "Pressure-tested before dispatch. Every connection is made before it leaves our facility.",
  },
  {
    label: "No field splicing",
    detail:
      "Strip is factory-sealed end to end. If you trim to length on site, a factory-matched snap end cap fits by hand — no crimping, no factory equipment.",
  },
  {
    label: "Same components",
    detail:
      "Identical strip, connectors and channel to our custom-quoted systems.",
  },
];

/* ------------------------------------------------------------------ helpers */
export function getKitById(id: KitId): KitDef | undefined {
  return KITS.find((k) => k.id === id);
}

/** Parse "15m" → 15 */
export function getLengthMetres(lengthStr: string): number {
  return parseFloat(lengthStr.replace("m", ""));
}

/** Round to nearest 10cm (0.1m) — valid cut precision for both mono and CC */
export function roundTo10cm(metres: number): number {
  return Math.round(metres * 10) / 10;
}

/* ------------------------------------------------------------------ pricing
 * IMPORTANT: $139/m, $149/m, and the $500 floor are ALL inc-GST amounts.
 * Do NOT multiply them by 1.1 — that would apply GST twice.
 * totalIncGST = metres × pricePerMetre (already inc GST).
 */
export const PRICE_PER_METRE_10M      = 139;  // $139/m inc GST at ≤10m
export const PRICE_PER_METRE_STANDARD = 149;  // $149/m inc GST at >10m
export const MIN_ORDER_INC_GST        = 500;  // $500 inc-GST floor (self-serve)

export interface KitPricing {
  metres: number;
  pricePerMetre: number;    // inc GST
  subtotalIncGST: number;   // metres × pricePerMetre, before floor
  totalIncGST: number;      // final total inc GST (after floor)
  totalExGST: number;       // totalIncGST ÷ 1.1 — for trade "+GST" display
  gst: number;              // totalIncGST − totalExGST
  minimumApplied: boolean;
}

export function getPricePerMetre(metres: number): number {
  return metres <= 10 ? PRICE_PER_METRE_10M : PRICE_PER_METRE_STANDARD;
}

export function calculateKitPricing(metres: number): KitPricing {
  const pricePerMetre  = getPricePerMetre(metres);
  const subtotalIncGST = +(metres * pricePerMetre).toFixed(2);
  const minimumApplied = subtotalIncGST < MIN_ORDER_INC_GST;
  const totalIncGST    = minimumApplied ? MIN_ORDER_INC_GST : subtotalIncGST;
  // Derive ex-GST by dividing the inc-GST total — never multiply an inc-GST
  // figure by 1.1, that applies GST twice.
  const totalExGST     = +( totalIncGST / 1.1).toFixed(2);
  const gst            = +(totalIncGST - totalExGST).toFixed(2);
  return {
    metres,
    pricePerMetre,
    subtotalIncGST,
    totalIncGST,
    totalExGST,
    gst,
    minimumApplied,
  };
}

/** AUD formatted string: 1234.5 → "$1,234.50" */
export function fmtAUD(n: number): string {
  return n.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
  });
}

export const CONNECTOR_ENTRY_LABELS: Record<string, string> = {
  direct: "Direct",
  side:   "Side",
  bottom: "Bottom (default)",
  "l-shape": "L-shape",
};
