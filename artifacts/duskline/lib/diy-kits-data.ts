/* ------------------------------------------------------------------ types */
export type KitId = "pool" | "stair" | "patio" | "path";

export interface KitContent { label: string; detail: string }
export interface InstallStep { step: string; desc: string }
export interface ColorOption { name: string; cct?: string; note?: string }

export interface KitDef {
  id: KitId;
  name: string;
  tagline: string;
  application: string;
  channel: string;
  channelBadge: string;
  channelNote?: string;
  lengths: string[];
  image: string;
  idealFor: string[];
  difficulty: string;
  difficultyDetail: string;
  kitContents: KitContent[];
  howItInstalls: InstallStep[];
  colorOptions?: ColorOption[];
}

/* ------------------------------------------------------------------ data */
export const KITS: KitDef[] = [
  {
    id: "pool",
    name: "Pool Surround Kit",
    tagline: "Pool coping & pond edges",
    application:
      "For permanent submersion: tile-flush coping, lap-pool edges, infinity-edge channels, pond surrounds.",
    channel: "Stainless 316L",
    channelBadge: "STAINLESS 316L",
    channelNote:
      "Only stainless — aluminium corrodes in chlorinated and salt water.",
    lengths: ["3m", "5m", "8m", "10m"],
    image: "/images/kits/kit-pool-overhead.jpg",
    colorOptions: [
      { name: "Warm white", cct: "2700K" },
      { name: "Bright white", cct: "4000K" },
      { name: "RGBW", note: "Full colour + warm white in one strip" },
    ],
    idealFor: [
      "Pool coping and tile-flush edges",
      "Lap pool and infinity pool perimeters",
      "Raised garden pond surrounds",
      "Water features and fountains",
    ],
    difficulty: "Straightforward",
    difficultyDetail:
      "2–4 hours for most coping runs. No waterproofing — connectors are sealed at the factory.",
    kitContents: [
      {
        label: "IP68 silicone strip",
        detail:
          "SF16 series — sealed end-to-end, pre-cut to your length. Choose 2700K warm white, 4000K bright white, or RGBW.",
      },
      {
        label: "316L stainless channel",
        detail:
          "Marine-grade with frosted PC diffuser — rated for permanent immersion and pool chemicals",
      },
      {
        label: "Factory IP68 connectors",
        detail:
          "Moulded directly onto the strip ends — nothing to assemble, nothing to waterproof",
      },
      {
        label: "IP67 LED driver",
        detail:
          "HLG-150H-24B · Mean Well · 24V DC · sized for your run · weatherproof enclosure · Australian plug included",
      },
      {
        label: "240V Australian plug",
        detail:
          "2m lead — runs to a weatherproof GPO near pool equipment",
      },
      {
        label: "Stainless fixings + guide",
        detail:
          "316L screws and a one-page install sheet covering coping, silicone bed and GPO placement",
      },
    ],
    howItInstalls: [
      {
        step: "Set the channel",
        desc: "Lay the stainless channel on a silicone bed along the coping edge. Screw through pre-drilled holes with supplied fixings.",
      },
      {
        step: "Clip in the strip",
        desc: "The silicone strip presses into the channel and is retained by the diffuser clip — no tools, no wiring.",
      },
      {
        step: "Route the lead",
        desc: "Run the 2-pin IP68 lead from the channel to your weatherproof driver enclosure near pool equipment.",
      },
      {
        step: "Plug in and go",
        desc: "Driver plugs into any weatherproof GPO. Strip comes on immediately — no commissioning needed.",
      },
    ],
  },
  {
    id: "stair",
    name: "Stair Kit",
    tagline: "Step edges & stair nosing",
    application:
      "A clean line of light along every step nosing — external garden stairs, internal treads, deck steps, and ramps.",
    channel: "Aluminium",
    channelBadge: "ALUMINIUM",
    lengths: ["2m", "3m", "5m"],
    image: "/images/gallery/orenara-travertine-steps-pool.webp",
    idealFor: [
      "External garden and pool stairs",
      "Internal tread and step nosing",
      "Deck and timber step edges",
      "Ramp and disabled-access edges",
    ],
    difficulty: "Easy",
    difficultyDetail:
      "1–2 hours for a typical flight. One channel per step, all pre-cut. Link cables connect each step to a single driver.",
    kitContents: [
      {
        label: "IP68 silicone strip",
        detail:
          "SF16 series — pre-cut per step length, 2700K warm white, sealed end-to-end",
      },
      {
        label: "Anodised aluminium channel",
        detail:
          "Surface-mount recessed profile with frosted diffuser — sits flush under the nosing overhang",
      },
      {
        label: "IP68 link cables",
        detail:
          "Connect each step's channel to the next — no exposed joins, no tape joints",
      },
      {
        label: "Factory IP68 connectors",
        detail:
          "Moulded on — push-lock to link cables, nothing to solder or seal",
      },
      {
        label: "IP67 LED driver",
        detail:
          "HLG-150H-24B · Mean Well · 24V DC · single driver powers the whole run · weatherproof enclosure · Australian plug",
      },
      {
        label: "Stainless fixings + guide",
        detail:
          "Per-step screw positions and cable routing on the install sheet",
      },
    ],
    howItInstalls: [
      {
        step: "Fix the channels",
        desc: "Screw or adhesive-mount one channel on each step nosing — typically under the overhang for a recessed look.",
      },
      {
        step: "Clip strips in",
        desc: "Pre-cut strips press into each channel and are retained by the diffuser — no tools needed.",
      },
      {
        step: "Connect link cables",
        desc: "Push-lock IP68 cables daisy-chain each step to the next, ending at the driver position.",
      },
      {
        step: "Plug in",
        desc: "Single driver at the base or top of the flight plugs into a weatherproof GPO. All steps come on together.",
      },
    ],
  },
  {
    id: "patio",
    name: "Patio Kit",
    tagline: "Alfresco edges & pergola fascia",
    application:
      "Continuous warm light along pergola beams, deck edges, alfresco perimeters and BBQ surrounds — built for covered outdoor living.",
    channel: "Aluminium",
    channelBadge: "ALUMINIUM",
    lengths: ["3m", "5m", "8m", "10m"],
    image: "/images/kits/kit-patio.jpg",
    idealFor: [
      "Pergola fascia and beam edges",
      "Alfresco perimeter wall bases",
      "Deck edge and fascia board",
      "BBQ surrounds and outdoor kitchens",
    ],
    difficulty: "Easy",
    difficultyDetail:
      "1–4 hours depending on run length. Straight aluminium channel — no bends, screws every 500mm.",
    kitContents: [
      {
        label: "IP68 silicone strip",
        detail:
          "SF16 series — pre-cut to your length, 2700K warm white, sealed",
      },
      {
        label: "Surface-mount aluminium channel",
        detail:
          "Flat-back profile with frosted diffuser — screws direct to timber, masonry or steel fascia",
      },
      {
        label: "Factory IP68 connectors",
        detail:
          "Moulded on both ends — plug-and-lock to driver lead, nothing to seal",
      },
      {
        label: "IP67 LED driver",
        detail:
          "HLG-150H-24B · Mean Well · 24V DC · sized for your run · weatherproof enclosure · Australian plug",
      },
      {
        label: "240V Australian plug",
        detail:
          "2m lead — routes to nearest GPO, typically inside the alfresco or on an exterior wall",
      },
      {
        label: "Stainless fixings + guide",
        detail:
          "Self-tapping screws for timber pergola, masonry anchors for rendered walls",
      },
    ],
    howItInstalls: [
      {
        step: "Mark and fix the channel",
        desc: "Screw the channel to the fascia edge or wall base every 500mm with supplied fixings — 10 minutes per run.",
      },
      {
        step: "Press in the strip",
        desc: "Strip clicks into the channel and is retained by the diffuser clip. No adhesive needed.",
      },
      {
        step: "Connect the driver lead",
        desc: "2-pin IP68 lead plugs from the strip end to the driver. Mount driver in a sheltered spot under the pergola roof.",
      },
      {
        step: "Plug in",
        desc: "Australian plug to any standard GPO — inside or weatherproof exterior. Done.",
      },
    ],
  },
  {
    id: "path",
    name: "Path Kit",
    tagline: "Garden paths & curved edges",
    application:
      "Follows curves without cuts — designed for garden paths, driveway borders, retaining walls and landscape edges that bend.",
    channel: "Flexible Aluminium",
    channelBadge: "FLEXIBLE ALUMINIUM",
    channelNote:
      "Segmented aluminium channel bends to follow curves — no notching or cutting required.",
    lengths: ["2m", "3m", "5m"],
    image: "/images/gallery/orenara-curved-path-pool-dusk.webp",
    idealFor: [
      "Curved garden paths and walkways",
      "Driveway edge borders",
      "Retaining wall cap edges",
      "Landscape and garden bed borders",
    ],
    difficulty: "Easy",
    difficultyDetail:
      "1–2 hours. The flexible channel bends by hand — no cuts, no mitre joints, no special tools.",
    kitContents: [
      {
        label: "IP68 silicone strip",
        detail:
          "SF16 series — pre-cut, 2700K warm white, sealed end-to-end",
      },
      {
        label: "Flexible segmented aluminium channel",
        detail:
          "Segments pivot to follow any curve radius — bends by hand, diffuser included",
      },
      {
        label: "Factory IP68 connectors",
        detail: "Moulded on both ends — plug-lock to driver lead",
      },
      {
        label: "IP67 LED driver",
        detail:
          "HLG-150H-24B · Mean Well · 24V DC · sized for your run · weatherproof enclosure · Australian plug included",
      },
      {
        label: "Stainless fixings + guide",
        detail:
          "Peg anchors for garden bed edges, self-tappers for retaining walls, cable routing tips",
      },
    ],
    howItInstalls: [
      {
        step: "Bend the channel",
        desc: "Flex the segmented channel by hand to match your path curve. Segments pivot — no cuts, no heat gun.",
      },
      {
        step: "Anchor it down",
        desc: "Peg or screw the channel to the edge every 300–400mm using the supplied fixings.",
      },
      {
        step: "Press in the strip",
        desc: "Strip clicks into the curved channel — fits because both the strip and channel flex together.",
      },
      {
        step: "Connect and plug in",
        desc: "IP68 lead to driver, driver to a weatherproof GPO nearby. Done in under two hours.",
      },
    ],
  },
];

export const BOX_ITEMS = [
  {
    label: "Sealed IP68 strip",
    detail: "Cut to your exact length. Factory-sealed, dot-free silicone.",
    tag: "Strip",
  },
  {
    label: "Matched channel",
    detail: "Aluminium or stainless. Frosted diffuser included.",
    tag: "Channel",
  },
  {
    label: "Factory connectors",
    detail: "Moulded onto the strip ends. Nothing for you to assemble.",
    tag: "Connectors",
  },
  {
    label: "Sized driver",
    detail: "IP67 rated, 24V DC. Correct wattage for your run length.",
    tag: "Driver",
  },
  {
    label: "240V Australian plug",
    detail: "2m lead. Standard GPO — no electrician required.",
    tag: "Plug",
  },
  {
    label: "Fixings + install guide",
    detail: "Stainless screws, anchors, and a one-page install sheet.",
    tag: "Guide",
  },
];

export const TRUST_POINTS = [
  {
    label: "IP68 submersible",
    detail: "Rated for permanent immersion — not just splash-proof.",
  },
  {
    label: "Factory-sealed connectors",
    detail: "Pressure-tested before dispatch. Nothing for you to waterproof.",
  },
  {
    label: "No field termination",
    detail:
      "Every connection is made at our factory. Zero DIY sealing required.",
  },
  {
    label: "Same components",
    detail:
      "Identical strip, connectors and channel to our custom-quoted systems.",
  },
];
