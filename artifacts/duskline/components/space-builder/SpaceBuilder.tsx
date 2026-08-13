"use client";

import React, { useState, useId, useCallback, useRef } from "react";
import Link from "next/link";
import {
  calculateKitPricing,
  fmtAUD,
  MIN_ORDER_INC_GST,
} from "../../lib/kits-data";
import {
  packDriversForRuns,
  zoneStripType,
  QuoteRunInput,
  PART_NUMBERS,
  PART_LABELS,
  StripType,
} from "../../lib/quoteCalc";

/* ──────────────────────────────────────────────────── types */
export type ItemType = "pool" | "path" | "stair" | "box";

export interface PoolSides {
  top: boolean;
  bottom: boolean;
  left: boolean;
  right: boolean;
}

export interface BuildItem {
  id: string;
  type: ItemType;
  name: string;
  metres: string;          // raw input — path/stair/box only; pool uses poolL/poolW
  shape: "straight" | "curved";
  steps?: string;          // stair only — step count, cosmetic
  // pool-specific
  poolL?: string;          // length (long dimension) in metres
  poolW?: string;          // width (short dimension) in metres
  poolMount?: "coping" | "recessed";
  poolTileWidth?: string;  // mm; only relevant when recessed, default "600"
  poolSides?: PoolSides;   // which sides are included in the run
  // channel + install config (all item types)
  material?: "aluminium" | "stainless";
  profile?: "straight" | "flex";
  connectorEntry?: "direct" | "side" | "bottom" | "l-shape";
  trim?: boolean;
  submerged?: boolean;
}

let _seq = 0;
function nextId(type: ItemType) { return `${type}-${++_seq}`; }

const TYPE_CONFIG: Record<ItemType, {
  label: string;
  defaultName: string;
  defaultShape: "straight" | "curved";
  defaultSteps?: string;
  hint: string;
  defaultMaterial: "aluminium" | "stainless";
  defaultProfile: "straight" | "flex";
}> = {
  pool:  { label: "Pool",   defaultName: "Pool",   defaultShape: "curved",   hint: "Total perimeter (m)", defaultMaterial: "stainless", defaultProfile: "flex" },
  path:  { label: "Path",   defaultName: "Path",   defaultShape: "straight", hint: "Total run length (m)", defaultMaterial: "aluminium", defaultProfile: "flex" },
  stair: { label: "Stairs", defaultName: "Stairs", defaultShape: "straight", defaultSteps: "8", hint: "Tread width per step (m)", defaultMaterial: "aluminium", defaultProfile: "straight" },
  box:   { label: "Zone",   defaultName: "Zone",   defaultShape: "straight", hint: "Total run length (m)", defaultMaterial: "aluminium", defaultProfile: "straight" },
};

const CONNECTOR_LABELS: Record<"direct" | "side" | "bottom" | "l-shape", string> = {
  direct:    "Direct entry",
  side:      "Side entry",
  bottom:    "Bottom entry",
  "l-shape": "L-shape",
};

/** Warranty terms — keyed off per-item `submerged` flag, not item type. */
const WARRANTY_YEARS = { submerged: 2, standard: 3 } as const;

/* ──────────────────────────────────────────────────── SVG schematics
 * Each SVG is 200×120. Strip shown as warm amber, structure as ink/15.
 * These are schematic — communicate what the item IS at a glance.
 */
function PoolSchematic({
  poolL, poolW, mount, tileWidthMm, sides,
}: {
  poolL: number; poolW: number;
  mount: "coping" | "recessed";
  tileWidthMm: number;
  sides: PoolSides;
}) {
  const hasSize = poolL > 0 && poolW > 0;
  // Pool body in SVG space
  const px = 26, py = 13, pw = 148, ph = 80;
  const inset = 11; // visual inset representing recessed channel setback

  // Coping: strip runs right on the pool edge
  const copingPaths: Record<keyof PoolSides, string> = {
    top:    `M ${px} ${py} L ${px+pw} ${py}`,
    bottom: `M ${px} ${py+ph} L ${px+pw} ${py+ph}`,
    left:   `M ${px} ${py} L ${px} ${py+ph}`,
    right:  `M ${px+pw} ${py} L ${px+pw} ${py+ph}`,
  };
  // Recessed: strip runs on inner offset track
  const recessedPaths: Record<keyof PoolSides, string> = {
    top:    `M ${px+inset} ${py+inset} L ${px+pw-inset} ${py+inset}`,
    bottom: `M ${px+inset} ${py+ph-inset} L ${px+pw-inset} ${py+ph-inset}`,
    left:   `M ${px+inset} ${py+inset} L ${px+inset} ${py+ph-inset}`,
    right:  `M ${px+pw-inset} ${py+inset} L ${px+pw-inset} ${py+ph-inset}`,
  };
  const paths = mount === "recessed" ? recessedPaths : copingPaths;

  // Derived label
  let label = "Enter pool dimensions";
  if (hasSize) {
    // Recessed: channel extends PAST each corner by one tile-width on each end,
    // so the run is LONGER than the pool dimension, not shorter.
    // Correct: poolL + 2×tile. Wrong (bug): poolL − 2×tile.
    const tileM = mount === "recessed" ? tileWidthMm / 1000 : 0;
    const longRun  = +(poolL + 2 * tileM).toFixed(2);
    const shortRun = +(poolW + 2 * tileM).toFixed(2);
    const total = +((sides.top ? longRun : 0) + (sides.bottom ? longRun : 0)
                  + (sides.left ? shortRun : 0) + (sides.right ? shortRun : 0)).toFixed(1);
    const n = Object.values(sides).filter(Boolean).length;
    label = `${poolL}×${poolW}m · ${n} side${n !== 1 ? "s" : ""} · ${total}m total`;
  }

  return (
    <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* pool body */}
      <rect x={px} y={py} width={pw} height={ph} rx="3"
        fill="rgba(15,17,19,0.04)" stroke="rgba(15,17,19,0.12)" strokeWidth="1"/>
      {/* recessed: true pool edge as faint dashed reference */}
      {mount === "recessed" && (
        <rect x={px} y={py} width={pw} height={ph} rx="3"
          fill="none" stroke="rgba(15,17,19,0.18)" strokeWidth="1" strokeDasharray="4 3"/>
      )}
      {/* water texture */}
      <line x1="62" y1="49" x2="110" y2="49" stroke="rgba(15,17,19,0.07)" strokeWidth="1" strokeLinecap="round"/>
      <line x1="74" y1="60" x2="132" y2="60" stroke="rgba(15,17,19,0.07)" strokeWidth="1" strokeLinecap="round"/>
      {/* LED strips — one segment per included side */}
      {(["top","bottom","left","right"] as const).map(side =>
        sides[side] ? (
          <path key={side} d={paths[side]} stroke="var(--ember)" strokeWidth="3" strokeLinecap="round" opacity="0.85"/>
        ) : (
          <path key={side} d={paths[side]} stroke="rgba(15,17,19,0.10)" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3"/>
        )
      )}
      <text x="100" y="112" textAnchor="middle" fontSize="8" fill="rgba(15,17,19,0.3)" fontFamily="sans-serif">{label}</text>
    </svg>
  );
}

function PathSchematic({ metres, shape }: { metres: number; shape: "straight" | "curved" }) {
  const label = metres > 0 ? `${metres}m` : "run length";
  return (
    <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {shape === "curved" ? (
        <>
          {/* ground surface */}
          <path d="M18 80 C55 35 145 95 182 48" stroke="rgba(15,17,19,0.10)" strokeWidth="14" strokeLinecap="round"/>
          {/* LED strip */}
          <path d="M18 80 C55 35 145 95 182 48" stroke="var(--ember)" strokeWidth="3" strokeLinecap="round" opacity="0.85"/>
        </>
      ) : (
        <>
          {/* ground surface */}
          <line x1="18" y1="65" x2="182" y2="65" stroke="rgba(15,17,19,0.10)" strokeWidth="14" strokeLinecap="round"/>
          {/* LED strip */}
          <line x1="18" y1="65" x2="182" y2="65" stroke="var(--ember)" strokeWidth="3" strokeLinecap="round" opacity="0.85"/>
        </>
      )}
      {/* label */}
      <text x="100" y="110" textAnchor="middle" fontSize="9" fill="rgba(15,17,19,0.3)" fontFamily="sans-serif">{label}</text>
    </svg>
  );
}

function StairSchematic({ treadWidth, steps }: { treadWidth: number; steps: number }) {
  const n = Math.max(2, Math.min(steps, 8));
  const stepW = 140 / n;
  const stepH = 60 / n;
  const startX = 30;
  const startY = 90;
  // build stair body path
  let d = `M ${startX} ${startY}`;
  for (let i = 0; i < n; i++) {
    d += ` L ${startX + i * stepW} ${startY - i * stepH}`;
    d += ` L ${startX + (i + 1) * stepW} ${startY - i * stepH}`;
  }
  // strip on each nosing — each is a separate physical run
  let stripD = "";
  for (let i = 0; i < n; i++) {
    const x1 = startX + i * stepW;
    const x2 = startX + (i + 1) * stepW;
    const y = startY - i * stepH;
    stripD += `M ${x1} ${y} L ${x2} ${y} `;
  }
  const totalM = treadWidth > 0 ? +(treadWidth * steps).toFixed(1) : 0;
  const label = treadWidth > 0
    ? `${treadWidth}m × ${steps} steps = ${totalM}m`
    : `${steps} steps`;
  return (
    <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* stair body */}
      <path d={d} stroke="rgba(15,17,19,0.14)" strokeWidth="1.5" fill="rgba(15,17,19,0.04)" strokeLinejoin="miter"/>
      {/* LED strip on each nosing — one segment per physical run */}
      <path d={stripD} stroke="var(--ember)" strokeWidth="3" strokeLinecap="round" opacity="0.85"/>
      <text x="100" y="112" textAnchor="middle" fontSize="9" fill="rgba(15,17,19,0.3)" fontFamily="sans-serif">{label}</text>
    </svg>
  );
}

function BoxSchematic({ metres }: { metres: number }) {
  const label = metres > 0 ? `${metres}m` : "run length";
  return (
    <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* zone rectangle */}
      <rect x="22" y="20" width="156" height="72" rx="3" fill="rgba(15,17,19,0.04)" stroke="rgba(15,17,19,0.12)" strokeWidth="1" strokeDasharray="5 3"/>
      {/* LED strip on top edge */}
      <line x1="22" y1="20" x2="178" y2="20" stroke="var(--ember)" strokeWidth="3.5" strokeLinecap="round" opacity="0.85"/>
      {/* label */}
      <text x="100" y="110" textAnchor="middle" fontSize="9" fill="rgba(15,17,19,0.3)" fontFamily="sans-serif">{label}</text>
    </svg>
  );
}

function ItemSchematic({ item }: { item: BuildItem }) {
  const m = parseFloat(item.metres);
  const metres = isNaN(m) || m <= 0 ? 0 : m;
  const steps = parseInt(item.steps ?? "8") || 8;
  switch (item.type) {
    case "pool":  return <PoolSchematic
      poolL={parseFloat(item.poolL ?? "0") || 0}
      poolW={parseFloat(item.poolW ?? "0") || 0}
      mount={item.poolMount ?? "coping"}
      tileWidthMm={parseFloat(item.poolTileWidth ?? "600") || 600}
      sides={item.poolSides ?? { top: true, bottom: true, left: true, right: true }}
    />;
    case "path":  return <PathSchematic  metres={metres} shape={item.shape}/>;
    case "stair": return <StairSchematic treadWidth={metres} steps={steps}/>;
    case "box":   return <BoxSchematic   metres={metres}/>;
  }
}

/* ──────────────────────────────────────────────────── atoms */
const inputCls =
  "bg-bone-tile border border-bone-line text-ink rounded-xs px-2.5 py-2 text-sm placeholder:text-ink/30 focus:outline-none focus:border-ink/40 transition-colors";
const labelCls =
  "block text-[8px] font-spec tracking-widest text-ink/40 uppercase mb-1.5";
const chipBase =
  "px-2.5 py-1 text-xs font-spec border rounded-xs transition-colors cursor-pointer";
const chipOn  = "bg-ink border-ink text-bone";
const chipOff = "bg-transparent border-bone-line text-ink/55 hover:border-ink/30 hover:text-ink";

/* ──────────────────────────────────────────────────── ItemCard */
interface ItemCardProps {
  item: BuildItem;
  index: number;
  onChange: (id: string, patch: Partial<BuildItem>) => void;
  onRemove: (id: string) => void;
}

function ItemCard({ item, index, onChange, onRemove }: ItemCardProps) {
  const cfg = TYPE_CONFIG[item.type];
  const [editingName,   setEditingName]   = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  function startEditName() {
    setEditingName(true);
    setTimeout(() => nameInputRef.current?.select(), 0);
  }

  return (
    <div className="rounded-xs border border-bone-line bg-bone-tile">
      {/* card header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <span className="font-spec text-[8px] tracking-widest text-ink/30 uppercase w-5 flex-shrink-0">{index + 1}</span>
        {editingName ? (
          <input
            ref={nameInputRef}
            type="text"
            value={item.name}
            onChange={e => onChange(item.id, { name: e.target.value })}
            onBlur={() => setEditingName(false)}
            onKeyDown={e => { if (e.key === "Enter") setEditingName(false); }}
            className="flex-1 bg-transparent border-b border-ink/30 text-sm text-ink font-display focus:outline-none py-0.5"
          />
        ) : (
          <button
            onClick={startEditName}
            className="flex-1 text-left text-sm text-ink font-display hover:text-ink/70 transition-colors truncate"
            title="Click to rename"
          >
            {item.name || cfg.defaultName}
          </button>
        )}
        <span className="font-spec text-[8px] tracking-widest text-ink/25 uppercase flex-shrink-0">{cfg.label}</span>
        <button
          onClick={() => onRemove(item.id)}
          className="flex-shrink-0 text-ink/25 hover:text-ink/60 transition-colors"
          aria-label="Remove"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* SVG schematic */}
      <div className="mx-4 mb-3 h-[100px] bg-bone rounded-xs overflow-hidden">
        <ItemSchematic item={item}/>
      </div>

      {/* fields */}
      <div className="px-4 pb-4 space-y-3">
        {item.type === "pool" ? (
          /* ── Pool: W×L dimensions, mount type, side toggles */
          <>
            {/* common size presets */}
            <div>
              <label className={labelCls}>Common sizes (L × W)</label>
              <div className="flex flex-wrap gap-1.5">
                {(["6×4","7×4","6×3","8×4","10×4"] as const).map(preset => {
                  const [pl, pw] = preset.split("×");
                  const active = item.poolL === pl && item.poolW === pw;
                  return (
                    <button key={preset} type="button"
                      onClick={() => onChange(item.id, { poolL: pl, poolW: pw })}
                      className={`${chipBase} ${active ? chipOn : chipOff}`}>
                      {preset}m
                    </button>
                  );
                })}
              </div>
            </div>

            {/* custom dimensions */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={labelCls}>Length (m)</label>
                <div className="relative">
                  <input type="number" value={item.poolL ?? ""}
                    onChange={e => onChange(item.id, { poolL: e.target.value })}
                    min={2} max={30} step={0.5} placeholder="e.g. 7"
                    className={`${inputCls} w-full pr-7`}/>
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-ink/35">m</span>
                </div>
              </div>
              <div>
                <label className={labelCls}>Width (m)</label>
                <div className="relative">
                  <input type="number" value={item.poolW ?? ""}
                    onChange={e => onChange(item.id, { poolW: e.target.value })}
                    min={2} max={20} step={0.5} placeholder="e.g. 4"
                    className={`${inputCls} w-full pr-7`}/>
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-ink/35">m</span>
                </div>
              </div>
            </div>

            {/* mount type */}
            <div>
              <label className={labelCls}>Channel mount</label>
              <div className="flex gap-2">
                {(["coping","recessed"] as const).map(mt => (
                  <button key={mt} type="button"
                    onClick={() => onChange(item.id, { poolMount: mt })}
                    className={`${chipBase} ${(item.poolMount ?? "coping") === mt ? chipOn : chipOff}`}>
                    {mt === "coping" ? "Coping" : "Recessed"}
                  </button>
                ))}
              </div>
              {(item.poolMount ?? "coping") === "recessed" && (
                <div className="mt-2.5">
                  <label className={labelCls}>Tile width (mm)</label>
                  <input type="number" value={item.poolTileWidth ?? "600"}
                    onChange={e => onChange(item.id, { poolTileWidth: e.target.value })}
                    min={50} max={1200} step={50}
                    className={`${inputCls} w-28`}/>
                  <p className="text-[10px] text-ink/40 mt-1 leading-relaxed">
                    Strip sets back from the pool edge by this amount at each corner.
                  </p>
                </div>
              )}
            </div>

            {/* per-side toggles */}
            <div>
              <label className={labelCls}>Include sides</label>
              <div className="flex flex-wrap gap-1.5">
                {(["Top","Bottom","Left","Right"] as const).map(side => {
                  const k = side.toLowerCase() as keyof PoolSides;
                  const defaultSides: PoolSides = { top: true, bottom: true, left: true, right: true };
                  const poolSides = item.poolSides ?? defaultSides;
                  return (
                    <button key={side} type="button"
                      onClick={() => onChange(item.id, { poolSides: { ...poolSides, [k]: !poolSides[k] } })}
                      className={`${chipBase} ${poolSides[k] ? chipOn : chipOff}`}>
                      {side}
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-ink/40 mt-1.5 leading-relaxed">
                Exclude a side for spas, feature walls, or inaccessible edges.
              </p>
            </div>
          </>
        ) : (
          /* ── Generic fields: path / stair / box */
          <>
            {/* run length — primary */}
            <div>
              <label className={labelCls}>{cfg.hint}</label>
              <div className="relative">
                <input type="number" value={item.metres}
                  onChange={e => onChange(item.id, { metres: e.target.value })}
                  min={0.5} max={40} step={0.5} placeholder="e.g. 12"
                  className={`${inputCls} w-full pr-7`}/>
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-ink/35">m</span>
              </div>
            </div>

            {/* shape — path only */}
            {item.type === "path" && (
              <div>
                <label className={labelCls}>Profile</label>
                <div className="flex gap-2">
                  {(["straight","curved"] as const).map(s => (
                    <button key={s} type="button"
                      onClick={() => onChange(item.id, { shape: s })}
                      className={`${chipBase} ${item.shape === s ? chipOn : chipOff}`}>
                      {s === "straight" ? "Straight" : "Curved"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* steps — stair only */}
            {item.type === "stair" && (
              <div>
                <label className={labelCls}>Steps (cosmetic — affects schematic only)</label>
                <input type="number" value={item.steps ?? "8"}
                  onChange={e => onChange(item.id, { steps: e.target.value })}
                  min={2} max={20} step={1} className={`${inputCls} w-32`}/>
              </div>
            )}
          </>
        )}

        {/* ── Shared: material, profile, advanced (connector entry + trim) */}
        <div className="pt-2 border-t border-bone-line space-y-3">

          {/* material */}
          {(() => {
            // submerged overrides type-based defaults: pool is always submerged;
            // other types may also be submerged (pool steps, water-feature edges).
            const isSubmerged = item.submerged ?? (item.type === "pool");
            const effectiveMaterial = isSubmerged
              ? "stainless"
              : (item.material ?? TYPE_CONFIG[item.type].defaultMaterial);
            return (
              <div>
                <label className={labelCls}>Channel material</label>
                <div className="flex gap-2">
                  <button type="button"
                    onClick={() => { if (!isSubmerged) onChange(item.id, { material: "aluminium" }); }}
                    disabled={isSubmerged}
                    className={`${chipBase} ${effectiveMaterial === "aluminium" ? chipOn : chipOff} disabled:opacity-40 disabled:cursor-not-allowed`}>
                    Aluminium
                  </button>
                  <button type="button"
                    onClick={() => { if (!isSubmerged) onChange(item.id, { material: "stainless" }); }}
                    disabled={isSubmerged}
                    className={`${chipBase} ${effectiveMaterial === "stainless" ? chipOn : chipOff} disabled:opacity-100 disabled:cursor-default`}>
                    Stainless 316L
                  </button>
                </div>
                <p className="text-[10px] text-ink/45 mt-1.5 leading-relaxed">
                  {isSubmerged
                    ? "Only stainless — aluminium corrodes in permanent water contact."
                    : "Use stainless 316L for permanent water contact — pool coping, water features, ponds."}
                </p>
              </div>
            );
          })()}

          {/* profile */}
          <div>
            <label className={labelCls}>Channel profile</label>
            <div className="flex gap-2">
              {(["straight", "flex"] as const).map(p => (
                <button key={p} type="button"
                  onClick={() => onChange(item.id, { profile: p })}
                  className={`${chipBase} ${(item.profile ?? TYPE_CONFIG[item.type].defaultProfile) === p ? chipOn : chipOff}`}>
                  {p === "straight" ? "Straight" : "Flex"}
                </button>
              ))}
            </div>
          </div>

          {/* advanced — connector entry + trim */}
          <div>
            <button
              type="button"
              onClick={() => setAdvancedOpen(v => !v)}
              className="flex items-center gap-1.5 text-[9px] font-spec tracking-widest text-ink/40 uppercase hover:text-ink/70 transition-colors"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                className={`transition-transform ${advancedOpen ? "rotate-90" : ""}`}>
                <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Advanced
            </button>
            {advancedOpen && (
              <div className="mt-2.5 space-y-3 pl-3 border-l border-bone-line">
                {/* submerged toggle — pool items are always submerged; non-pool items may be (entry steps, water-feature edges) */}
                {item.type !== "pool" && (
                  <div>
                    <label className={labelCls}>Installation environment</label>
                    <div
                      className="flex items-start gap-2.5 cursor-pointer"
                      onClick={() => {
                        const next = !(item.submerged ?? false);
                        onChange(item.id, {
                          submerged: next,
                          material:  next ? "stainless" : TYPE_CONFIG[item.type].defaultMaterial,
                          ...(next ? { trim: false } : {}),
                        });
                      }}
                    >
                      <div className={`flex-shrink-0 mt-0.5 w-4 h-4 rounded-[2px] border transition-colors ${item.submerged ? "bg-ink border-ink" : "border-bone-line hover:border-ink/40"}`}>
                        {item.submerged && (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M3.5 8l3 3 6-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-ink font-display">Submerged installation</p>
                        <p className="text-[10px] text-ink/40 leading-relaxed">
                          Pool entry steps, water-feature edges, or any permanently wet run.
                          Forces stainless · field trimming not permitted.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* connector entry */}
                <div>
                  <label className={labelCls}>Connector entry</label>
                  <div className="flex flex-wrap gap-1.5">
                    {(["direct", "side", "bottom", "l-shape"] as const).map(ce => {
                      const isSubmerged = item.submerged ?? (item.type === "pool");
                      const effectiveMaterial = isSubmerged ? "stainless" : (item.material ?? TYPE_CONFIG[item.type].defaultMaterial);
                      const isStainless = effectiveMaterial === "stainless";
                      const lshapeDisabled = ce === "l-shape" && isStainless;
                      const current = item.connectorEntry ?? "bottom";
                      // If current is l-shape but stainless is active, treat as if bottom is selected
                      const effective = (current === "l-shape" && isStainless) ? "bottom" : current;
                      const active = !lshapeDisabled && effective === ce;
                      return (
                        <button key={ce} type="button"
                          disabled={lshapeDisabled}
                          onClick={() => !lshapeDisabled && onChange(item.id, { connectorEntry: ce })}
                          title={lshapeDisabled ? "L-shape not available in stainless 316L" : undefined}
                          className={`${chipBase} ${active ? chipOn : chipOff} disabled:opacity-30 disabled:cursor-not-allowed`}>
                          {CONNECTOR_LABELS[ce]}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-ink/35 mt-1 leading-relaxed">
                    Bottom entry covers most installations. Confirm with your electrician.
                  </p>
                </div>
                {/* trim — forbidden for any submerged item (pool or otherwise); trimming breaks IP68 seal */}
                {(item.submerged ?? item.type === "pool") ? (
                  <div className="rounded-xs border border-bone-line bg-bone-card px-3 py-2.5">
                    <p className="text-xs text-ink font-display mb-0.5">No on-site trimming</p>
                    <p className="text-[10px] text-ink/50 leading-relaxed">
                      Submerged channels are factory-sealed IP68. Field trimming breaks the
                      submersion seal and voids the warranty — order the calculated length.
                    </p>
                  </div>
                ) : (
                  <div className="flex items-start gap-2.5">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={item.trim ?? false}
                      onClick={() => onChange(item.id, { trim: !(item.trim ?? false) })}
                      className={`flex-shrink-0 mt-0.5 w-4 h-4 rounded-[2px] border transition-colors ${item.trim ? "bg-ink border-ink" : "border-bone-line hover:border-ink/40"}`}
                    >
                      {item.trim && (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M3.5 8l3 3 6-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                    <div>
                      <p className="text-xs text-ink font-display">Trim allowance</p>
                      <p className="text-[10px] text-ink/40 leading-relaxed">
                        Adds one spare connector set. Cuts must land on a valid 10cm mark.
                      </p>
                    </div>
                  </div>
                )}

                {/* warranty term — derived from submerged flag */}
                <p className="text-[10px] text-ink/35 leading-relaxed pt-1 border-t border-bone-line">
                  {(item.submerged ?? item.type === "pool")
                    ? `${WARRANTY_YEARS.submerged}-year warranty (submerged · IP68 sealed)`
                    : `${WARRANTY_YEARS.standard}-year warranty (standard outdoor)`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────── DriverSummary */
function DriverSummary({
  runs,
  stripType,
  totalDrivers,
  connectorSets,
  hasTrim,
}: {
  runs: QuoteRunInput[];
  stripType: StripType;
  totalDrivers: number;
  connectorSets: number;
  hasTrim: boolean;
}) {
  if (runs.length === 0) return null;
  const stripPart  = stripType === "cc" ? PART_NUMBERS.stripCC  : PART_NUMBERS.stripMono;
  const stripLabel = stripType === "cc" ? PART_LABELS.stripCC   : PART_LABELS.stripMono;
  const totalConnectors = connectorSets + (hasTrim ? 1 : 0);

  return (
    <div className="rounded-xs border border-bone-line bg-bone-tile p-5">
      <p className="font-spec text-[8px] tracking-widest text-ink/35 uppercase mb-4">
        System — all zones combined
      </p>
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-ink font-display">Strip</p>
            <p className="text-xs text-ink/50 mt-0.5">{stripLabel}</p>
          </div>
          <span className="font-spec text-[9px] tracking-wider text-ink/40 flex-shrink-0 mt-0.5">{stripPart}</span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-ink font-display">
              {connectorSets === 1 ? "1 run" : `${connectorSets} independently-fed runs`}
              {hasTrim ? " + trim spare" : ""}
            </p>
            <p className="text-xs text-ink/50 mt-0.5">{PART_LABELS.connectorSet}</p>
          </div>
          <span className="font-spec text-[9px] tracking-wider text-ink/40 flex-shrink-0 mt-0.5">
            {PART_NUMBERS.connectorSet}{totalConnectors > 1 ? ` ×${totalConnectors}` : ""}
          </span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-ink font-display">
              {totalDrivers === 1 ? "1 driver" : `${totalDrivers} drivers`}
            </p>
            <p className="text-xs text-ink/50 mt-0.5">LM-150-24 · 80% derate · 150W rated</p>
          </div>
          <span className="font-spec text-[9px] tracking-wider text-ink/40 flex-shrink-0 mt-0.5">
            {PART_NUMBERS.driver}{totalDrivers > 1 ? ` ×${totalDrivers}` : ""}
          </span>
        </div>
        {stripType === "cc" && (
          <p className="text-[10px] text-ink/45 leading-relaxed pt-2 border-t border-bone-line">
            One or more runs exceed 10m — CC strip (OR-SF-16CC) required across the whole job for consistent brightness.
          </p>
        )}
        {hasTrim && (
          <p className="text-[10px] text-ink/45 leading-relaxed pt-2 border-t border-bone-line">
            Trim allowance: cuts must land on a valid 10cm mark. One spare connector set included.
          </p>
        )}
        <p className="text-[10px] text-ink/35 leading-relaxed pt-2 border-t border-bone-line">
          Driver grouping is confirmed on site by your electrician based on cable-run geometry.
        </p>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────── BuildPricingPanel */
type FormState = "idle" | "submitting" | "success" | "error";
type PanelMode = "idle" | "confirm";

function BuildPricingPanel({
  items,
  totalMetres,
  totalDrivers,
  stripType,
  kitName,
  kitId,
}: {
  items: BuildItem[];
  totalMetres: number;
  totalDrivers: number;
  stripType: StripType;
  kitName: string;
  kitId: string;
}) {
  const formId = useId();
  const pricing = totalMetres > 0 ? calculateKitPricing(totalMetres) : null;
  const [showExGST,  setShowExGST]  = useState(false);
  const [panelMode,  setPanelMode]  = useState<PanelMode>("idle");
  const [emailOpen,  setEmailOpen]  = useState(false);
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [phone,   setPhone]   = useState("");
  const [suburb,  setSuburb]  = useState("");
  const [notes,   setNotes]   = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [formError, setFormError] = useState("");
  const [orderRef,  setOrderRef]  = useState("");
  const [quoteEmail, setQuoteEmail] = useState("");
  const [quoteState, setQuoteState] = useState<FormState>("idle");

  // Summarise zones for the email payload
  const zonesPayload = items.map(it => ({
    name: it.name,
    type: it.type,
    metres: it.metres,
    shape: it.shape,
    material:       it.material       ?? TYPE_CONFIG[it.type].defaultMaterial,
    profile:        it.profile        ?? TYPE_CONFIG[it.type].defaultProfile,
    connectorEntry: it.connectorEntry ?? "bottom",
    trim:           it.trim           ?? false,
    submerged:      it.submerged      ?? (it.type === "pool"),
    ...(it.steps ? { steps: it.steps } : {}),
    ...(it.type === "pool" ? {
      poolL:         it.poolL    ?? "",
      poolW:         it.poolW    ?? "",
      poolMount:     it.poolMount ?? "coping",
      poolTileWidth: it.poolTileWidth ?? "600",
      poolSides:     it.poolSides ?? { top: true, bottom: true, left: true, right: true },
    } : {}),
  }));

  async function submitConfirm(e: React.FormEvent) {
    e.preventDefault();
    setFormState("submitting");
    setFormError("");
    try {
      const res = await fetch("/kits/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "confirm",
          kit: kitName,
          kitId,
          length: `${totalMetres}m total`,
          zones: zonesPayload,
          name, email,
          phone:  phone  || undefined,
          suburb: suburb || undefined,
          notes:  notes  || undefined,
        }),
      });
      const data = await res.json().catch(() => ({})) as { ok?: boolean; orderRef?: string; error?: string };
      if (res.ok && data.ok) {
        setOrderRef(data.orderRef ?? "");
        setFormState("success");
      } else {
        setFormError(data.error ?? "Something went wrong — please try again.");
        setFormState("error");
      }
    } catch {
      setFormError("Network error — please check your connection.");
      setFormState("error");
    }
  }

  async function submitQuoteEmail(e: React.FormEvent) {
    e.preventDefault();
    setQuoteState("submitting");
    try {
      const res = await fetch("/kits/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "email_quote",
          kit: kitName,
          kitId,
          length: `${totalMetres}m total`,
          zones: zonesPayload,
          email: quoteEmail,
        }),
      });
      if (res.ok) setQuoteState("success");
      else setQuoteState("error");
    } catch {
      setQuoteState("error");
    }
  }

  return (
    <div className="rounded-xs border border-bone-line bg-bone-tile p-6">
      <p className="font-spec text-[8px] tracking-widest text-ink/40 uppercase mb-1">
        {kitName}
      </p>
      {totalMetres > 0 && (
        <p className="font-spec text-[8px] tracking-widest text-ink/30 mb-4">
          {totalMetres.toFixed(1)}m total · {totalDrivers} driver{totalDrivers !== 1 ? "s" : ""}
        </p>
      )}

      {/* pricing */}
      {!pricing ? (
        <div className="py-6 text-center border border-dashed border-bone-line rounded-xs mb-4">
          <p className="text-sm text-ink/40">Add items to see pricing.</p>
        </div>
      ) : (
        <div className="mb-5 space-y-1.5">
          {!pricing.minimumApplied && (
            <div className="flex justify-between text-xs text-ink/55">
              <span>{totalMetres.toFixed(1)}m × {fmtAUD(pricing.pricePerMetre)}/m inc GST</span>
              <span>{fmtAUD(pricing.subtotalIncGST)}</span>
            </div>
          )}
          {/* total row with ex-GST toggle */}
          <div className="flex justify-between items-baseline border-t border-bone-line pt-2 mt-2 gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-ink font-display">
                {pricing.minimumApplied
                  ? "Minimum order applied"
                  : showExGST
                  ? "Total ex GST"
                  : "Total inc GST"}
              </span>
              {!pricing.minimumApplied && (
                <button
                  onClick={() => setShowExGST(v => !v)}
                  className="font-spec text-[7px] tracking-widest uppercase text-ink/35 hover:text-ink/60 border border-bone-line hover:border-ink/25 rounded-xs px-1.5 py-0.5 transition-colors"
                >
                  {showExGST ? "inc GST" : "ex GST"}
                </button>
              )}
            </div>
            <span className="font-display text-xl text-ink flex-shrink-0">
              {fmtAUD(showExGST && !pricing.minimumApplied
                ? pricing.totalExGST
                : pricing.totalIncGST)}
            </span>
          </div>
          {showExGST && !pricing.minimumApplied && (
            <div className="flex justify-between text-xs text-ink/40">
              <span>+ {fmtAUD(pricing.gst)} GST (10%)</span>
              <span>= {fmtAUD(pricing.totalIncGST)} inc GST</span>
            </div>
          )}
          {pricing.minimumApplied && (
            <p className="text-[10px] text-ink/40 leading-relaxed">
              Minimum self-serve order is {fmtAUD(MIN_ORDER_INC_GST)} inc GST.
              Your {totalMetres.toFixed(1)}m total ({fmtAUD(pricing.subtotalIncGST)} inc GST) falls below this threshold.
            </p>
          )}
        </div>
      )}

      {/* CTAs / confirm form */}
      {panelMode === "confirm" ? (
        formState === "success" ? (
          <div className="py-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-ink/25 mb-3">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M4 10l4 4 8-8" stroke="#0F1113" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="font-display text-base text-ink mb-1">{orderRef} submitted.</p>
            <p className="text-xs text-ink/55 leading-relaxed">
              Confirmation sent to {email}. We'll be in touch within one business day.
            </p>
          </div>
        ) : (
          <form onSubmit={submitConfirm} className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <button type="button" onClick={() => setPanelMode("idle")} className="text-ink/40 hover:text-ink transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <p className="font-display text-sm text-ink">Confirm &amp; request invoice</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor={`${formId}-name`} className={labelCls}>Name</label>
                <input id={`${formId}-name`} type="text" value={name} onChange={e=>setName(e.target.value)} required autoComplete="name" className={`${inputCls} w-full`} placeholder="Full name"/>
              </div>
              <div>
                <label htmlFor={`${formId}-suburb`} className={labelCls}>Suburb</label>
                <input id={`${formId}-suburb`} type="text" value={suburb} onChange={e=>setSuburb(e.target.value)} className={`${inputCls} w-full`} placeholder="e.g. Mosman"/>
              </div>
            </div>
            <div>
              <label htmlFor={`${formId}-email`} className={labelCls}>Email</label>
              <input id={`${formId}-email`} type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email" className={`${inputCls} w-full`} placeholder="you@example.com"/>
            </div>
            <div>
              <label htmlFor={`${formId}-phone`} className={labelCls}>Phone (optional)</label>
              <input id={`${formId}-phone`} type="tel" value={phone} onChange={e=>setPhone(e.target.value)} autoComplete="tel" className={`${inputCls} w-full`} placeholder="04xx xxx xxx"/>
            </div>
            <div>
              <label htmlFor={`${formId}-notes`} className={labelCls}>Notes (optional)</label>
              <textarea id={`${formId}-notes`} value={notes} onChange={e=>setNotes(e.target.value)} rows={2} className={`${inputCls} w-full resize-none`} placeholder="Any extra context…"/>
            </div>
            {formError && <p className="text-xs text-ink/70 bg-bone-card border border-bone-line rounded-xs px-3 py-2">{formError}</p>}
            <button type="submit" disabled={formState === "submitting" || !pricing} className="w-full bg-ink text-bone font-spec text-[10px] tracking-widest uppercase px-4 py-3 rounded-xs hover:bg-ink/90 transition-colors disabled:opacity-50">
              {formState === "submitting" ? "Submitting…" : "Confirm & request invoice"}
            </button>
            <p className="text-[10px] text-ink/35 text-center">No payment now — we'll send an invoice.</p>
          </form>
        )
      ) : (
        pricing && (
          <div className="space-y-2.5">
            <button
              onClick={() => setPanelMode("confirm")}
              className="w-full bg-ink text-bone font-spec text-[10px] tracking-widest uppercase px-4 py-3.5 rounded-xs hover:bg-ink/90 transition-colors"
            >
              Confirm &amp; request invoice
            </button>

            <button
              onClick={() => setEmailOpen(v => !v)}
              className="w-full bg-transparent border border-bone-line text-ink/60 font-spec text-[10px] tracking-widest uppercase px-4 py-2.5 rounded-xs hover:border-ink/30 hover:text-ink transition-colors"
            >
              Email me this quote instead
            </button>

            {emailOpen && (
              quoteState === "success" ? (
                <p className="text-xs text-ink/60 text-center py-1">Quote sent to {quoteEmail}.</p>
              ) : (
                <form onSubmit={submitQuoteEmail} className="flex gap-2 mt-1">
                  <input
                    type="email"
                    value={quoteEmail}
                    onChange={e => setQuoteEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    className={`${inputCls} flex-1`}
                  />
                  <button
                    type="submit"
                    disabled={quoteState === "submitting"}
                    className="flex-shrink-0 bg-ink text-bone font-spec text-[9px] tracking-widest uppercase px-4 py-2 rounded-xs hover:bg-ink/90 transition-colors disabled:opacity-50"
                  >
                    {quoteState === "submitting" ? "…" : "Send"}
                  </button>
                </form>
              )
            )}

            <div className="pt-1">
              <Link href="/kits#review" className="block w-full text-center text-xs text-ink/40 hover:text-ink/60 transition-colors">
                Request review instead →
              </Link>
            </div>
          </div>
        )
      )}

      {!pricing && panelMode === "idle" && (
        <p className="text-[10px] text-ink/35 text-center mt-2">Add at least one item to confirm.</p>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────── AddButton */
function AddButton({ type, onClick }: { type: ItemType; onClick: () => void }) {
  const cfg = TYPE_CONFIG[type];
  const icons: Record<ItemType, React.ReactNode> = {
    pool:  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="5" width="14" height="10" rx="3" stroke="currentColor" strokeWidth="1.5"/></svg>,
    path:  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 14 C7 6 13 14 17 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    stair: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 16 L3 12 L8 12 L8 8 L13 8 L13 4 L17 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    box:   <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="6" width="14" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2"/></svg>,
  };
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 px-5 py-4 bg-bone-tile border border-bone-line rounded-xs hover:border-ink/25 hover:bg-bone transition-colors text-ink/55 hover:text-ink group"
    >
      <span className="transition-colors">{icons[type]}</span>
      <span className="font-spec text-[9px] tracking-widest uppercase">{cfg.label}</span>
    </button>
  );
}

/* ──────────────────────────────────────────────────── makeInitialItem */
/**
 * Build a well-formed BuildItem for pre-seeding SpaceBuilder from a kit slug page.
 * Uses TYPE_CONFIG defaults so kit pages don't need to duplicate them.
 */
export function makeInitialItem(type: ItemType, overrides?: Partial<BuildItem>): BuildItem {
  const cfg = TYPE_CONFIG[type];
  return {
    id: `${type}-0`,
    type,
    name: cfg.defaultName,
    metres: "",
    shape: cfg.defaultShape,
    material: cfg.defaultMaterial,
    profile:  cfg.defaultProfile,
    connectorEntry: "bottom",
    trim: false,
    submerged: type === "pool",   // pool items are always submerged; others default to surface
    ...(cfg.defaultSteps ? { steps: cfg.defaultSteps } : {}),
    ...(type === "pool" ? {
      poolL: "", poolW: "",
      poolMount: "coping" as const,
      poolTileWidth: "600",
      poolSides: { top: true, bottom: true, left: true, right: true },
    } : {}),
    ...overrides,
  };
}

/* ──────────────────────────────────────────────────── SpaceBuilder */
export interface SpaceBuilderProps {
  /** Seed items to pre-populate the canvas — used by kit slug pages. */
  initialItems?: BuildItem[];
  /** Display name used in the pricing panel header and email payloads. */
  kitName?: string;
  /** Identifier sent in review/confirm submissions. */
  kitId?: string;
}

export default function SpaceBuilder({
  initialItems = [],
  kitName = "Build Your Space",
  kitId = "build",
}: SpaceBuilderProps) {
  const [items, setItems] = useState<BuildItem[]>(() => initialItems);
  const panelRef = useRef<HTMLDivElement>(null);

  const addItem = useCallback((type: ItemType) => {
    const cfg = TYPE_CONFIG[type];
    setItems(prev => [
      ...prev,
      {
        id:     nextId(type),
        type,
        name:   `${cfg.defaultName} ${prev.filter(i => i.type === type).length + 1 > 1 ? prev.filter(i => i.type === type).length + 1 : ""}`.trim(),
        metres: "",
        shape:  cfg.defaultShape,
        material:       cfg.defaultMaterial,
        profile:        cfg.defaultProfile,
        connectorEntry: "bottom" as const,
        trim:           false,
        submerged:      type === "pool",
        ...(cfg.defaultSteps ? { steps: cfg.defaultSteps } : {}),
        ...(type === "pool" ? {
          poolL: "", poolW: "",
          poolMount: "coping" as const,
          poolTileWidth: "600",
          poolSides: { top: true, bottom: true, left: true, right: true },
        } : {}),
      },
    ]);
  }, []);

  const updateItem = useCallback((id: string, patch: Partial<BuildItem>) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...patch } : item));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  // Derive shared computation from all valid items.
  // Pool → per-side QuoteRunInputs (4 sides max, split at >12m).
  // Stairs → N runs of tread_width each (each tread is its own physical run).
  // Path/box → one flat run each.
  const validRuns: QuoteRunInput[] = items.flatMap(item => {
    if (item.type === "pool") {
      const l = parseFloat(item.poolL ?? "0");
      const w = parseFloat(item.poolW ?? "0");
      if (isNaN(l) || l <= 0 || isNaN(w) || w <= 0) return [];
      const mount  = item.poolMount ?? "coping";
      const tileM  = mount === "recessed" ? (parseFloat(item.poolTileWidth ?? "600") || 600) / 1000 : 0;
      const sides  = item.poolSides ?? { top: true, bottom: true, left: true, right: true };
      // Recessed: channel EXTENDS past each corner by one tile-width (same formula as PoolSchematic label).
      // Correct: l + 2×tile. Bug was l − 2×tile (shorter, not longer).
      const sideLens = {
        top:    +(l + 2 * tileM).toFixed(3),
        bottom: +(l + 2 * tileM).toFixed(3),
        left:   +(w + 2 * tileM).toFixed(3),
        right:  +(w + 2 * tileM).toFixed(3),
      };
      return (["top","bottom","left","right"] as const).flatMap(side => {
        if (!sides[side]) return [];
        const len = sideLens[side];
        if (len <= 0) return [];
        // Split sides longer than 12m into equal-length segments
        if (len > 12) {
          const n = Math.ceil(len / 12);
          const seg = +(len / n).toFixed(2);
          return Array.from({ length: n }, () => ({ lengthMetres: seg, shape: "straight" as const }));
        }
        return [{ lengthMetres: len, shape: "straight" as const }];
      });
    }
    const m = parseFloat(item.metres);
    if (isNaN(m) || m <= 0) return [];
    if (item.type === "stair") {
      const stepCount = Math.max(1, parseInt(item.steps ?? "8") || 8);
      return Array.from({ length: stepCount }, () => ({
        lengthMetres: m,   // m = tread width per step
        shape: item.shape,
      }));
    }
    return [{ lengthMetres: m, shape: item.shape }];
  });

  const totalMetres     = +validRuns.reduce((s, r) => s + r.lengthMetres, 0).toFixed(2);
  const stripType       = validRuns.length > 0 ? zoneStripType(validRuns) : "mono";
  const totalDrivers    = validRuns.length > 0 ? packDriversForRuns(validRuns, stripType) : 0;
  // One connector set per independently-fed physical run; trim items add one spare each
  const connectorSets   = validRuns.length;
  const hasTrim         = items.some(i => i.trim);
  const pricing         = totalMetres > 0 ? calculateKitPricing(totalMetres) : null;

  return (
    <>
      {/* main — two-column canvas + pricing */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="lg:grid lg:grid-cols-[1fr_340px] lg:gap-10">

          {/* ── left — canvas */}
          <div>

            {/* add buttons */}
            <div className="mb-6">
              <p className="font-spec text-[8px] tracking-widest text-ink/35 uppercase mb-3">Add an area</p>
              <div className="flex flex-wrap gap-2">
                {(["pool", "path", "stair", "box"] as ItemType[]).map(type => (
                  <AddButton key={type} type={type} onClick={() => addItem(type)}/>
                ))}
              </div>
            </div>

            {/* item cards */}
            {items.length === 0 ? (
              <div className="rounded-xs border border-dashed border-bone-line bg-bone-tile/50 py-16 text-center">
                <p className="text-sm text-ink/35 mb-1">No areas added yet.</p>
                <p className="text-xs text-ink/25">Use the buttons above to add a pool, path, staircase, or custom zone.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item, i) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    index={i}
                    onChange={updateItem}
                    onRemove={removeItem}
                  />
                ))}
              </div>
            )}

            {/* driver summary — only when items have valid lengths */}
            {validRuns.length > 0 && (
              <div className="mt-6">
                <DriverSummary
                  runs={validRuns}
                  stripType={stripType}
                  totalDrivers={totalDrivers}
                  connectorSets={connectorSets}
                  hasTrim={hasTrim}
                />
              </div>
            )}

            {/* compliance note */}
            {items.length > 0 && (
              <div className="mt-6 rounded-xs border border-bone-line bg-bone-card px-5 py-4">
                <p className="text-xs text-ink/55 leading-relaxed">
                  <strong className="text-ink/70 font-display">Installation note.</strong>{" "}
                  All electrical work must be carried out by a licensed electrician in line with AS/NZS 3000.
                  Orenara supplies the finished system; your electrician connects it to mains.
                </p>
              </div>
            )}
          </div>

          {/* ── right — sticky pricing panel (desktop) */}
          <div className="mt-10 lg:mt-0">
            <div ref={panelRef} className="lg:sticky lg:top-20">
              <BuildPricingPanel
                items={items}
                totalMetres={totalMetres}
                totalDrivers={totalDrivers}
                stripType={stripType}
                kitName={kitName}
                kitId={kitId}
              />
            </div>
          </div>

        </div>
      </div>

      {/* ── Mobile bottom CTA bar — hidden lg+ where sticky right panel takes over */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-bone border-t border-bone-line">
        <div className="px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] flex items-center gap-3">
          <div className="flex-1 min-w-0">
            {pricing ? (
              <>
                <p className="font-display text-lg text-ink leading-none">{fmtAUD(pricing.totalIncGST)}</p>
                <p className="font-spec text-[8px] tracking-widest text-ink/40 mt-0.5 uppercase">
                  {pricing.minimumApplied ? "Minimum order" : "Total inc GST"}
                </p>
              </>
            ) : (
              <p className="text-sm text-ink/40">
                {items.length === 0 ? "Add areas to price" : "Enter lengths to price"}
              </p>
            )}
          </div>
          <button
            onClick={() => panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="flex-shrink-0 bg-ink text-bone font-spec text-[10px] tracking-widest uppercase px-5 py-3 rounded-xs hover:bg-ink/90 transition-colors"
          >
            {pricing ? "Confirm →" : "See options →"}
          </button>
        </div>
      </div>
    </>
  );
}
