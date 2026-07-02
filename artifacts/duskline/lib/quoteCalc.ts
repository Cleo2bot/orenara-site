export const DRIVER_RATED_WATTS = 150; // LTSYS LM-150-24-G1A2F
export const STRIP_WATTS_PER_METRE = 10; // Comi SF17 spec
export const SAFETY_DERATE = 0.8; // don't run drivers at 100% continuously
export const MAX_RUN_PER_DRIVER = (DRIVER_RATED_WATTS * SAFETY_DERATE) / STRIP_WATTS_PER_METRE; // 12 metres

export type ZoneShape = "straight" | "curved";

export interface QuoteZoneInput {
  name: string;
  lengthMetres: number;
  shape: ZoneShape;
  note?: string;
}

export interface QuoteZoneCalculated extends QuoteZoneInput {
  driversNeeded: number;
  dimmersNeeded: number;
  plugsNeeded: number;
  mountingType: "Rigid Channel" | "Flexible Segmented Track";
  channelMetres: number;
}

export interface QuoteTotals {
  stripMetres: number;
  drivers: number;
  dimmers: number;
  plugs: number;
  rigidChannelMetres: number;
  flexibleTrackMetres: number;
}

export function calculateZone(zone: QuoteZoneInput): QuoteZoneCalculated {
  const length = Number.isFinite(zone.lengthMetres) && zone.lengthMetres > 0 ? zone.lengthMetres : 0;
  const driversNeeded = length > 0 ? Math.ceil(length / MAX_RUN_PER_DRIVER) : 0;

  return {
    ...zone,
    lengthMetres: length,
    driversNeeded,
    dimmersNeeded: driversNeeded,
    plugsNeeded: driversNeeded,
    mountingType: zone.shape === "curved" ? "Flexible Segmented Track" : "Rigid Channel",
    channelMetres: length,
  };
}

export function calculateTotals(zones: QuoteZoneCalculated[]): QuoteTotals {
  return zones.reduce(
    (acc, z) => ({
      stripMetres: acc.stripMetres + z.lengthMetres,
      drivers: acc.drivers + z.driversNeeded,
      dimmers: acc.dimmers + z.dimmersNeeded,
      plugs: acc.plugs + z.plugsNeeded,
      rigidChannelMetres: acc.rigidChannelMetres + (z.shape === "straight" ? z.channelMetres : 0),
      flexibleTrackMetres: acc.flexibleTrackMetres + (z.shape === "curved" ? z.channelMetres : 0),
    }),
    { stripMetres: 0, drivers: 0, dimmers: 0, plugs: 0, rigidChannelMetres: 0, flexibleTrackMetres: 0 }
  );
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
