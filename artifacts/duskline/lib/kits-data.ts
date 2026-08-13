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
      "Orenara owns the IP68 seal. If it fails under warranty, we fix it — not your electrician.",
  },
  {
    label: "Factory-sealed connectors",
    detail:
      "Pressure-tested before dispatch. Every connection is made before it leaves our facility.",
  },
  {
    label: "No field termination",
    detail:
      "Nothing is joined, cut or sealed on-site. Your electrician installs a finished system.",
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

/* ------------------------------------------------------------------ pricing */
export const PRICE_PER_METRE_10M = 139;        // $139/m at the 10m tier
export const PRICE_PER_METRE_STANDARD = 149;   // $149/m at 15m–40m tiers
export const MIN_ORDER_EX_GST = 500;           // $500 floor (self-serve only)
export const GST_RATE = 0.10;

export interface KitPricing {
  metres: number;
  pricePerMetre: number;
  subtotalExGST: number;   // metres × pricePerMetre (before floor)
  effectiveExGST: number;  // after $500 floor
  gst: number;
  totalIncGST: number;
  minimumApplied: boolean;
}

export function getPricePerMetre(metres: number): number {
  return metres <= 10 ? PRICE_PER_METRE_10M : PRICE_PER_METRE_STANDARD;
}

export function calculateKitPricing(metres: number): KitPricing {
  const pricePerMetre = getPricePerMetre(metres);
  const subtotalExGST = +(metres * pricePerMetre).toFixed(2);
  const minimumApplied = subtotalExGST < MIN_ORDER_EX_GST;
  const effectiveExGST = minimumApplied ? MIN_ORDER_EX_GST : subtotalExGST;
  const gst = +(effectiveExGST * GST_RATE).toFixed(2);
  const totalIncGST = +(effectiveExGST + gst).toFixed(2);
  return {
    metres,
    pricePerMetre,
    subtotalExGST,
    effectiveExGST,
    gst,
    totalIncGST,
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
