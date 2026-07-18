import { PART_NUMBERS } from "./quoteCalc";

export interface KitSpecRow {
  item: string;
  partNumber: string;
  details: string;
}

export interface Kit {
  slug: string;
  name: string;
  image: string;
  tagline: string;
  description: string;
  specs: string[];
  note: string | null;
  accent: boolean;
  longDescription: string;
  specTable: KitSpecRow[];
}

export const kits: Kit[] = [
  {
    slug: "pathway-kit",
    name: "Pathway Kit",
    image: "/images/gallery/orenara-curved-retaining-path.webp",
    tagline: "Garden edges, walkways, water features",
    description:
      "Designed for ground-level and near-ground applications. Fully flexible strip with horizontal-bend capability. Pairs with an RCM-compliant 24V driver and 0–10V dimmer.",
    specs: ["IP68 rated", "0–10V dimming", "RCM compliant", "Driver & dimmer included"],
    note: null,
    accent: false,
    longDescription:
      "The Pathway Kit is built for ground-level and near-ground runs — garden edges, stepping paths, low retaining walls. The flexible segmented track allows tight horizontal bends around garden beds and curved paths without cutting or splicing the strip, and every component in the kit is rated for continuous outdoor exposure.",
    specTable: [
      { item: "LED Strip, 24V warm white", partNumber: PART_NUMBERS.strip, details: "IP68 fully submersible, 24V DC, 10W/m, dot-free diffusion, sealed end caps, dimmable 0–10V" },
      { item: "Flexible Segmented Track", partNumber: PART_NUMBERS.flexibleTrack, details: "Horizontal bend, ground-level mount" },
      { item: "Driver, 150W", partNumber: PART_NUMBERS.driver, details: "150W, IP67 rated, 0–10V dim input, 240V mains feed" },
      { item: "Dimmer, 0–10V wall control", partNumber: PART_NUMBERS.dimmer, details: "Wall-mounted touch panel, scene presets, wireless pairing, 1 per driver" },
      { item: "240V Plug & Power Cable", partNumber: PART_NUMBERS.plug, details: "AU/NZ plug, pre-wired, 1.5m, weatherproof outdoor-rated cable" },
      { item: "Pathway Kit (complete)", partNumber: PART_NUMBERS.kits["Pathway Kit"], details: "Pre-specced bundle — quote for exact quantities" },
    ],
  },
  {
    slug: "pergola-kit",
    name: "Pergola Kit",
    image: "/images/gallery/orenara-courtyard-patio.webp",
    tagline: "Overhead structural runs, BBQ and alfresco zones",
    description:
      "Built for overhead installation in structural channels. High-output 24V strip with consistent colour temperature. Suitable for spans up to 10m per run from a single driver.",
    specs: ["IP68 rated", "0–10V dimming", "RCM compliant", "Driver & dimmer included"],
    note: null,
    accent: false,
    longDescription:
      "The Pergola Kit is designed for overhead structural mounting — rafters, beams, alfresco roof lines. It uses a rigid aluminium channel for a clean, straight installation line and consistent light diffusion across long spans, with the strip, driver, and dimmer matched for reliable colour temperature over the full run.",
    specTable: [
      { item: "LED Strip, 24V warm white", partNumber: PART_NUMBERS.strip, details: "IP68 fully submersible, 24V DC, 10W/m, dot-free diffusion, sealed end caps, dimmable 0–10V" },
      { item: "Rigid Channel", partNumber: PART_NUMBERS.rigidChannel, details: "Straight runs, overhead/structural mount" },
      { item: "Driver, 150W", partNumber: PART_NUMBERS.driver, details: "150W, IP67 rated, 0–10V dim input, 240V mains feed" },
      { item: "Dimmer, 0–10V wall control", partNumber: PART_NUMBERS.dimmer, details: "Wall-mounted touch panel, scene presets, wireless pairing, 1 per driver" },
      { item: "240V Plug & Power Cable", partNumber: PART_NUMBERS.plug, details: "AU/NZ plug, pre-wired, 1.5m, weatherproof outdoor-rated cable" },
      { item: "Pergola Kit (complete)", partNumber: PART_NUMBERS.kits["Pergola Kit"], details: "Pre-specced bundle — quote for exact quantities" },
    ],
  },
  {
    slug: "pool-water-feature-kit",
    name: "Pool & Water Feature Kit",
    image: "/images/gallery/orenara-curved-travertine-pool.webp",
    tagline: "Fully submersible runs",
    description:
      "Our most demanding application. Fully submersible — rated for permanent water contact (IP68). For pool edges, water features, and submerged elements. Sealed to 1.5m/30min per EN60529.",
    specs: ["IP68 rated (submersible)", "0–10V dimming", "RCM compliant", "Driver & dimmer included"],
    note: "For electrical work near water, all installation must be performed by a licensed electrician per AS/NZS 3000.",
    accent: true,
    longDescription:
      "The Pool & Water Feature Kit is our most demanding configuration, sealed for permanent submersion (1.5m/30min per EN60529) around pool edges, water features, and other submerged elements. All electrical work near water must be carried out by a licensed electrician in line with AS/NZS 3000.",
    specTable: [
      { item: "LED Strip, 24V warm white (submersible)", partNumber: PART_NUMBERS.strip, details: "IP68 fully submersible, 24V DC, 10W/m, dot-free diffusion, sealed end caps, dimmable 0–10V, sealed to 1.5m/30min per EN60529" },
      { item: "Flexible Segmented Track", partNumber: PART_NUMBERS.flexibleTrack, details: "Curved edges around pool/water feature" },
      { item: "Driver, 150W", partNumber: PART_NUMBERS.driver, details: "150W, IP67 rated, 0–10V dim input, 240V mains feed" },
      { item: "Dimmer, 0–10V wall control", partNumber: PART_NUMBERS.dimmer, details: "Wall-mounted touch panel, scene presets, wireless pairing, 1 per driver" },
      { item: "240V Plug & Power Cable", partNumber: PART_NUMBERS.plug, details: "AU/NZ plug, pre-wired, 1.5m, weatherproof outdoor-rated cable" },
      { item: "Pool & Water Feature Kit (complete)", partNumber: PART_NUMBERS.kits["Pool & Water Feature Kit"], details: "Pre-specced bundle — quote for exact quantities" },
    ],
  },
  {
    slug: "custom-zone-kit",
    name: "Custom Zone Kit",
    image: "/images/gallery/orenara-step-edge-night.webp",
    tagline: "Larger or multi-zone properties",
    description:
      "Multiple zones, extended runs, or architectural applications that need a spec conversation before quoting. Tell us about your space and we'll come back with a detailed breakdown.",
    specs: ["Multi-zone capable", "0–10V dimming", "RCM compliant", "Spec on enquiry"],
    note: null,
    accent: false,
    longDescription:
      "The Custom Zone Kit covers larger properties, multiple lighting zones, or architectural applications that don't fit a single pre-specced kit. Use the Quote Builder to lay out each zone's run length and shape — we'll work out the drivers, dimmers, and mounting track and come back with a detailed breakdown.",
    specTable: [
      { item: "LED Strip, 24V warm white", partNumber: PART_NUMBERS.strip, details: "IP68 fully submersible, 24V DC, 10W/m, dot-free diffusion, sealed end caps, dimmable 0–10V" },
      { item: "Flexible Segmented Track", partNumber: PART_NUMBERS.flexibleTrack, details: "For curved runs within a zone" },
      { item: "Rigid Channel", partNumber: PART_NUMBERS.rigidChannel, details: "For straight runs within a zone" },
      { item: "Driver, 150W", partNumber: PART_NUMBERS.driver, details: "150W, IP67 rated, 0–10V dim input, 240V mains feed" },
      { item: "Dimmer, 0–10V wall control", partNumber: PART_NUMBERS.dimmer, details: "Wall-mounted touch panel, scene presets, wireless pairing, 1 per driver" },
      { item: "240V Plug & Power Cable", partNumber: PART_NUMBERS.plug, details: "AU/NZ plug, pre-wired, 1.5m, weatherproof outdoor-rated cable" },
      { item: "Custom Zone Kit (complete)", partNumber: PART_NUMBERS.kits["Custom Zone Kit"], details: "Configured per zone — use the Quote Builder for an exact breakdown" },
    ],
  },
];

export function getKitBySlug(slug: string): Kit | undefined {
  return kits.find((k) => k.slug === slug);
}
