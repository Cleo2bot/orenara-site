export interface RunInput {
  label: string;
  lengthMetres: number;
}

export interface LineItemDraft {
  partNumber: string;
  description: string;
  qty: string;
  unit: string;
  isGenerated: boolean;
  sortOrder: number;
}

const STRIP_SUFFIX: Record<string, string> = {
  "2700K": "WW",
  "3000K": "WW",
  "4000K": "NW",
  "5700K": "CW",
  TBC: "TBC",
};

const CHANNEL_DESC: Record<string, string> = {
  "OR-CHN-RGD": "Channel — rigid, straight runs",
  "OR-CHN-FLX": "Channel — segmented, curves",
  "OR-CHN-SS": "Channel — stainless, recessed or submerged",
};

const DRIVER_MAX_METRES = 12.0;

export function packDrivers(runs: RunInput[]): number {
  if (runs.length === 0) return 0;
  let driverCount = 0;
  let currentLoad = 0;
  for (const run of runs) {
    if (currentLoad + run.lengthMetres > DRIVER_MAX_METRES) {
      driverCount++;
      currentLoad = run.lengthMetres;
    } else {
      currentLoad += run.lengthMetres;
    }
  }
  return driverCount + 1;
}

export function deriveBOM(
  runs: RunInput[],
  colourTemp: string,
  channelType: string
): LineItemDraft[] {
  if (runs.length === 0) return [];

  const suffix = STRIP_SUFFIX[colourTemp] ?? "TBC";
  const stripPartNum = `OR-STRIP-24V-${suffix}`;
  const items: LineItemDraft[] = [];
  let order = 0;

  for (const run of runs) {
    items.push({
      partNumber: stripPartNum,
      description: `Factory-sealed submersible run — ${run.label}, ${run.lengthMetres}m`,
      qty: String(run.lengthMetres),
      unit: "l/m",
      isGenerated: true,
      sortOrder: order++,
    });
  }

  const driverCount = packDrivers(runs);

  items.push({
    partNumber: "OR-DRV-150W",
    description: "Driver — Mean Well HLG-150H-24B, 24V DC, 150W, IP67",
    qty: String(driverCount),
    unit: "ea",
    isGenerated: true,
    sortOrder: order++,
  });

  items.push({
    partNumber: "OR-CON-IP68",
    description: "IP68 connector and end cap set",
    qty: String(runs.length),
    unit: "set",
    isGenerated: true,
    sortOrder: order++,
  });

  if (channelType !== "none") {
    const totalMetres = runs.reduce((s, r) => s + r.lengthMetres, 0);
    items.push({
      partNumber: channelType,
      description: CHANNEL_DESC[channelType] ?? channelType,
      qty: String(Math.ceil(totalMetres)),
      unit: "m",
      isGenerated: true,
      sortOrder: order++,
    });
  }

  items.push({
    partNumber: "OR-PLG-240V",
    description: "Mains plug — 240V",
    qty: String(driverCount),
    unit: "ea",
    isGenerated: true,
    sortOrder: order++,
  });

  return items;
}
