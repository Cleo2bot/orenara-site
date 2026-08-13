/* ------------------------------------------------------------------ types */
export type KitId = "pool-surround" | "stair" | "patio" | "path";

export interface KitDef {
  id: KitId;
  name: string;
  tagline: string;
  application: string;
  channel: string;
  channelBadge: string;
  channelNote?: string;
  lengths: string[]; // pre-defined tier ladder, metres as strings ("10m", "15m", ...)
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

export function getKitById(id: KitId): KitDef | undefined {
  return KITS.find((k) => k.id === id);
}

export function getLengthMetres(lengthStr: string): number {
  return parseFloat(lengthStr.replace("m", ""));
}
