export const DRIVER_RATED_WATTS = 150; // LTSYS LM-150-24-G1A2F
export const STRIP_WATTS_PER_METRE = 10; // Comi SF17 spec
export const SAFETY_DERATE = 0.8; // don't run drivers at 100% continuously
export const MAX_RUN_PER_DRIVER = (DRIVER_RATED_WATTS * SAFETY_DERATE) / STRIP_WATTS_PER_METRE; // 12 metres

export type ZoneShape = "straight" | "curved";

export const PART_NUMBERS = {
  strip: "DL-STRIP-24V-WW",
  flexibleTrack: "DL-TRK-FLEX",
  rigidChannel: "DL-TRK-RIGID",
  driver: "DL-DRV-150W",
  dimmer: "DL-DIM-010V",
  plug: "DL-PLG-240V",
  kits: {
    "Pathway Kit": "DL-KIT-PATH",
    "Pergola Kit": "DL-KIT-PERG",
    "Pool & Water Feature Kit": "DL-KIT-POOL",
    "Custom Zone Kit": "DL-KIT-CUST",
  },
} as const;

export const PART_LABELS = {
  strip: "Strip, 24V, warm white",
  flexibleTrack: "Flexible Segmented Track (per metre)",
  rigidChannel: "Rigid Channel (per metre)",
  driver: "Driver, 150W, 0-10V",
  dimmer: "Dimmer, 0-10V wall control",
  plug: "240V Plug & Power Cable",
} as const;

export function getKitPartNumber(kitName: string): string | undefined {
  return (PART_NUMBERS.kits as Record<string, string>)[kitName];
}

export interface QuoteRunInput {
  lengthMetres: number;
  shape: ZoneShape;
}

export interface QuoteZoneInput {
  name: string;
  runs: QuoteRunInput[];
  note?: string;
}

export interface QuoteRunCalculated extends QuoteRunInput {
  mountingType: "Rigid Channel" | "Flexible Segmented Track";
}

export interface QuoteZoneCalculated {
  name: string;
  note?: string;
  runs: QuoteRunCalculated[];
  totalLengthMetres: number;
  driversNeeded: number;
  dimmersNeeded: number;
  plugsNeeded: number;
  rigidChannelMetres: number;
  flexibleTrackMetres: number;
}

export interface QuoteTotals {
  stripMetres: number;
  drivers: number;
  dimmers: number;
  plugs: number;
  rigidChannelMetres: number;
  flexibleTrackMetres: number;
}

function isValidRun(run: QuoteRunInput): boolean {
  return Number.isFinite(run.lengthMetres) && run.lengthMetres > 0;
}

export function calculateZone(zone: QuoteZoneInput): QuoteZoneCalculated {
  const validRuns = zone.runs.filter(isValidRun);

  const totalLengthMetres = validRuns.reduce((sum, r) => sum + r.lengthMetres, 0);
  const driversNeeded = totalLengthMetres > 0 ? Math.ceil(totalLengthMetres / MAX_RUN_PER_DRIVER) : 0;

  const rigidChannelMetres = validRuns
    .filter((r) => r.shape === "straight")
    .reduce((sum, r) => sum + r.lengthMetres, 0);
  const flexibleTrackMetres = validRuns
    .filter((r) => r.shape === "curved")
    .reduce((sum, r) => sum + r.lengthMetres, 0);

  const runs: QuoteRunCalculated[] = validRuns.map((r) => ({
    ...r,
    mountingType: r.shape === "curved" ? "Flexible Segmented Track" : "Rigid Channel",
  }));

  return {
    name: zone.name,
    note: zone.note,
    runs,
    totalLengthMetres,
    driversNeeded,
    dimmersNeeded: driversNeeded,
    plugsNeeded: driversNeeded,
    rigidChannelMetres,
    flexibleTrackMetres,
  };
}

export function calculateTotals(zones: QuoteZoneCalculated[]): QuoteTotals {
  return zones.reduce(
    (acc, z) => ({
      stripMetres: acc.stripMetres + z.totalLengthMetres,
      drivers: acc.drivers + z.driversNeeded,
      dimmers: acc.dimmers + z.dimmersNeeded,
      plugs: acc.plugs + z.plugsNeeded,
      rigidChannelMetres: acc.rigidChannelMetres + z.rigidChannelMetres,
      flexibleTrackMetres: acc.flexibleTrackMetres + z.flexibleTrackMetres,
    }),
    { stripMetres: 0, drivers: 0, dimmers: 0, plugs: 0, rigidChannelMetres: 0, flexibleTrackMetres: 0 }
  );
}

export function formatZoneSummary(name: string, runs: QuoteRunInput[]): string | null {
  const validRuns = runs.filter(isValidRun);
  if (validRuns.length === 0) return null;

  const parts = validRuns.map((r) => `${r.lengthMetres}m ${r.shape}`);
  const total = validRuns.reduce((sum, r) => sum + r.lengthMetres, 0);

  if (validRuns.length === 1) {
    return `${name} — ${parts[0]}`;
  }

  return `${name} — ${parts.join(" + ")} (${total}m total)`;
}

export const ZONE_PLACEHOLDER_NAMES = [
  "Garden path",
  "Patio",
  "Pool surround",
  "Pergola beam",
  "Driveway edge",
];

export function nextZonePlaceholder(index: number): string {
  const base = ZONE_PLACEHOLDER_NAMES[index % ZONE_PLACEHOLDER_NAMES.length];
  const cycle = Math.floor(index / ZONE_PLACEHOLDER_NAMES.length);
  return cycle > 0 ? `${base} ${cycle + 1}` : base;
}
