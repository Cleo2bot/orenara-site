export const DRIVER_RATED_WATTS = 150; // LTSYS LM-150-24-G1A2F
export const STRIP_WATTS_PER_METRE = 10; // SF16 spec
export const SAFETY_DERATE = 0.8; // don't run drivers at 100% continuously
export const MAX_RUN_PER_DRIVER = (DRIVER_RATED_WATTS * SAFETY_DERATE) / STRIP_WATTS_PER_METRE; // 12 metres

// Strip feed-length ceilings (single-feed, centre-fed doubles these)
export const MONO_MAX_SINGLE_FEED = 10; // metres — standard mono strip
export const CC_MAX_SINGLE_FEED = 15;   // metres — CC strip (reference; driver cap of 12m is the binding constraint)

// The effective max physical-run length per strip type:
// mono: 10m (strip feed limit is tighter than 12m driver limit)
// cc:   12m (driver limit is tighter than 15m CC feed limit)
export const MAX_PHYSICAL_RUN_MONO = MONO_MAX_SINGLE_FEED; // 10m
export const MAX_PHYSICAL_RUN_CC   = MAX_RUN_PER_DRIVER;   // 12m

export type StripType = "mono" | "cc";
export type ZoneShape = "straight" | "curved";

export const PART_NUMBERS = {
  stripMono: "OR-STRIP-24V-WW",  // standard mono strip, single-colour
  stripCC:   "OR-SF-16CC",        // CC (constant-current) strip for runs > 10m
  /** @deprecated use stripMono or stripCC */
  strip: "OR-STRIP-24V-WW",
  flexibleTrack: "OR-TRK-FLEX",
  rigidChannel: "OR-TRK-RIGID",
  driver: "OR-DRV-150W",
  dimmer: "OR-DIM-010V",
  plug: "OR-PLG-240V",
  connectorSet: "OR-CON-IP68",
  kits: {
    "Pathway Kit": "OR-KIT-PATH",
    "Pergola Kit": "OR-KIT-PERG",
    "Pool & Water Feature Kit": "OR-KIT-POOL",
    "Custom Zone Kit": "OR-KIT-CUST",
  },
} as const;

export const PART_LABELS = {
  stripMono: "Strip, 24V, warm white (mono)",
  stripCC:   "Strip, 24V, CC (constant current)",
  /** @deprecated use stripMono or stripCC */
  strip: "Strip, 24V, warm white",
  flexibleTrack: "Flexible Segmented Track (per metre)",
  rigidChannel: "Rigid Channel (per metre)",
  driver: "Driver, 150W, 0-10V",
  dimmer: "Dimmer, 0-10V wall control",
  plug: "240V Plug & Power Cable",
  connectorSet: "IP68 connector + end-cap set",
} as const;

export function getKitPartNumber(kitName: string): string | undefined {
  return (PART_NUMBERS.kits as Record<string, string>)[kitName];
}

// ---------------------------------------------------------------------------
// Shared run-config calculation — single source of truth used by both the
// public Quote Builder (Phase 1) and the catalog tier table (Phase 2).
// Calling convention: metres in → { stripType, physicalRuns, driversNeeded }
// ---------------------------------------------------------------------------

export interface RunConfig {
  stripType: StripType;
  /** Lengths of each independently-fed physical run (each ≤ maxPhysicalRun). */
  physicalRuns: number[];
  /** One driver per physical run. */
  driversNeeded: number;
}

/**
 * Given a total run length, calculate the strip type, physical run split,
 * and driver count.  This is the canonical calculation that Phase 2's
 * catalog tier table must call rather than maintain its own copy of the rules.
 *
 * Rules enforced:
 *   - Standard mono strip: max 10m per physical run (single-feed ceiling).
 *   - CC strip (> 10m total): max 12m per physical run (driver cap is binding).
 *   - 80% derate is baked into MAX_RUN_PER_DRIVER (12m).
 *   - Every physical run is independently fed; no run spans multiple drivers.
 *   - Runs split evenly for catalog defaults (real geometry takes priority on site).
 */
export function calculateRunConfig(totalMetres: number): RunConfig {
  if (totalMetres <= 0) {
    return { stripType: "mono", physicalRuns: [], driversNeeded: 0 };
  }

  const stripType: StripType = totalMetres > MONO_MAX_SINGLE_FEED ? "cc" : "mono";
  const maxPerRun = stripType === "mono" ? MAX_PHYSICAL_RUN_MONO : MAX_PHYSICAL_RUN_CC;
  const numRuns = Math.ceil(totalMetres / maxPerRun);
  const physicalRuns = splitEvenly(totalMetres, numRuns);

  return { stripType, physicalRuns, driversNeeded: numRuns };
}

/** Split `total` metres into `count` even sub-runs, last absorbs rounding. */
function splitEvenly(total: number, count: number): number[] {
  if (count <= 0) return [];
  const base = parseFloat((total / count).toFixed(2));
  const runs: number[] = [];
  let remaining = total;
  for (let i = 0; i < count; i++) {
    if (i === count - 1) {
      runs.push(parseFloat(remaining.toFixed(2)));
    } else {
      runs.push(base);
      remaining = parseFloat((remaining - base).toFixed(2));
    }
  }
  return runs;
}

// ---------------------------------------------------------------------------
// Quote Builder interfaces
// ---------------------------------------------------------------------------

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
  stripType: StripType;
  driversNeeded: number;
  dimmersNeeded: number;
  plugsNeeded: number;
  connectorSetsNeeded: number;
  rigidChannelMetres: number;
  flexibleTrackMetres: number;
}

export interface QuoteTotals {
  stripMetres: number;
  drivers: number;
  dimmers: number;
  plugs: number;
  connectorSets: number;
  rigidChannelMetres: number;
  flexibleTrackMetres: number;
}

function isValidRun(run: QuoteRunInput): boolean {
  return Number.isFinite(run.lengthMetres) && run.lengthMetres > 0;
}

/**
 * Determine strip type for a zone based on individual run lengths.
 * CC strip is required if any single user-entered run exceeds the mono feed ceiling.
 */
export function zoneStripType(runs: QuoteRunInput[]): StripType {
  return runs.some((r) => r.lengthMetres > MONO_MAX_SINGLE_FEED) ? "cc" : "mono";
}

/**
 * Driver packing — respects the 12m-per-driver rule with correct run splitting.
 *
 * Fixes the previous bug where a single run > 12m (e.g. 35m) was assigned to
 * one driver load and the return value was wrong.
 *
 * Algorithm:
 *   1. Pre-split any user-entered run that exceeds maxPerRun into sub-runs
 *      of ≤ maxPerRun.  Each sub-run is an independently-fed physical piece.
 *   2. Greedy first-fit: pack sub-runs into drivers; open a new driver when
 *      the current one would exceed MAX_RUN_PER_DRIVER.
 *   3. Return total driver count.
 *
 * The 80% derate is already baked into MAX_RUN_PER_DRIVER (12m) — it is
 * applied per physical sub-run, never pooled across sub-runs.
 */
export function packDriversForRuns(
  runs: QuoteRunInput[],
  stripType: StripType = "cc"
): number {
  if (runs.length === 0) return 0;

  const maxPerRun =
    stripType === "mono" ? MAX_PHYSICAL_RUN_MONO : MAX_PHYSICAL_RUN_CC;

  // Step 1 — pre-split any run longer than maxPerRun into physical sub-runs
  const physicalSubRuns: number[] = [];
  for (const run of runs) {
    if (!isValidRun(run)) continue;
    if (run.lengthMetres <= maxPerRun) {
      physicalSubRuns.push(run.lengthMetres);
    } else {
      const subCount = Math.ceil(run.lengthMetres / maxPerRun);
      const subLen = run.lengthMetres / subCount;
      for (let i = 0; i < subCount; i++) {
        physicalSubRuns.push(subLen);
      }
    }
  }

  if (physicalSubRuns.length === 0) return 0;

  // Step 2 — greedy first-fit: bin capacity = MAX_RUN_PER_DRIVER (12m)
  let driverCount = 0;
  let currentLoad = 0;
  const EPS = 0.001; // float comparison tolerance
  for (const subLen of physicalSubRuns) {
    if (currentLoad + subLen > MAX_RUN_PER_DRIVER + EPS) {
      driverCount++;
      currentLoad = subLen;
    } else {
      currentLoad += subLen;
    }
  }
  return driverCount + 1;
}

export function calculateZone(zone: QuoteZoneInput): QuoteZoneCalculated {
  const validRuns = zone.runs.filter(isValidRun);
  const totalLengthMetres = validRuns.reduce((sum, r) => sum + r.lengthMetres, 0);

  // Strip type: CC if any single run exceeds the mono single-feed ceiling
  const stripType = zoneStripType(validRuns);
  const maxPerRun =
    stripType === "mono" ? MAX_PHYSICAL_RUN_MONO : MAX_PHYSICAL_RUN_CC;

  const driversNeeded = packDriversForRuns(validRuns, stripType);

  // Connector sets = total physical sub-runs (each independently fed)
  // A user-entered run longer than maxPerRun splits into ceil(len/maxPerRun) sub-runs,
  // each needing its own connector set.
  const connectorSetsNeeded = validRuns.reduce(
    (sum, r) => sum + Math.ceil(r.lengthMetres / maxPerRun),
    0
  );

  const rigidChannelMetres = validRuns
    .filter((r) => r.shape === "straight")
    .reduce((sum, r) => sum + r.lengthMetres, 0);
  const flexibleTrackMetres = validRuns
    .filter((r) => r.shape === "curved")
    .reduce((sum, r) => sum + r.lengthMetres, 0);

  const runs: QuoteRunCalculated[] = validRuns.map((r) => ({
    ...r,
    mountingType:
      r.shape === "curved" ? "Flexible Segmented Track" : "Rigid Channel",
  }));

  return {
    name: zone.name,
    note: zone.note,
    runs,
    totalLengthMetres,
    stripType,
    driversNeeded,
    dimmersNeeded: driversNeeded,
    plugsNeeded: driversNeeded,
    connectorSetsNeeded,
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
      connectorSets: acc.connectorSets + z.connectorSetsNeeded,
      rigidChannelMetres: acc.rigidChannelMetres + z.rigidChannelMetres,
      flexibleTrackMetres:
        acc.flexibleTrackMetres + z.flexibleTrackMetres,
    }),
    {
      stripMetres: 0,
      drivers: 0,
      dimmers: 0,
      plugs: 0,
      connectorSets: 0,
      rigidChannelMetres: 0,
      flexibleTrackMetres: 0,
    }
  );
}

export function formatZoneSummary(
  name: string,
  runs: QuoteRunInput[]
): string | null {
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
