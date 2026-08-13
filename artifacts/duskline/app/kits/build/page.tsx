"use client";

import React, { useState, useId, useCallback, useRef } from "react";
import Link from "next/link";
import {
  calculateKitPricing,
  fmtAUD,
  MIN_ORDER_INC_GST,
} from "../../../lib/kits-data";
import {
  packDriversForRuns,
  zoneStripType,
  QuoteRunInput,
  PART_NUMBERS,
  PART_LABELS,
  StripType,
} from "../../../lib/quoteCalc";

/* ──────────────────────────────────────────────────── types */
type ItemType = "pool" | "path" | "stair" | "box";

interface BuildItem {
  id: string;
  type: ItemType;
  name: string;
  metres: string;          // raw input value — parse on use
  shape: "straight" | "curved";
  steps?: string;          // stair only — step count, cosmetic
}

let _seq = 0;
function nextId(type: ItemType) { return `${type}-${++_seq}`; }

const TYPE_CONFIG: Record<ItemType, {
  label: string;
  defaultName: string;
  defaultShape: "straight" | "curved";
  defaultSteps?: string;
  hint: string;
}> = {
  pool:  { label: "Pool",   defaultName: "Pool",   defaultShape: "curved",   hint: "Total perimeter (m)" },
  path:  { label: "Path",   defaultName: "Path",   defaultShape: "straight", hint: "Total run length (m)" },
  stair: { label: "Stairs", defaultName: "Stairs", defaultShape: "straight", defaultSteps: "8", hint: "Tread width per step (m)" },
  box:   { label: "Zone",   defaultName: "Zone",   defaultShape: "straight", hint: "Total run length (m)" },
};

/* ──────────────────────────────────────────────────── SVG schematics
 * Each SVG is 200×120. Strip shown as warm amber, structure as ink/15.
 * These are schematic — communicate what the item IS at a glance.
 */
function PoolSchematic({ metres, shape }: { metres: number; shape: "straight" | "curved" }) {
  const rx = shape === "curved" ? 18 : 2;
  const label = metres > 0 ? `${metres}m perimeter` : "perimeter";
  return (
    <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* pool body */}
      <rect x="22" y="18" width="156" height="76" rx={rx} fill="rgba(15,17,19,0.04)" stroke="rgba(15,17,19,0.12)" strokeWidth="1"/>
      {/* LED strip on coping */}
      <rect x="22" y="18" width="156" height="76" rx={rx} fill="none"
        stroke="var(--ember)" strokeWidth="3" strokeLinecap="round"
        strokeDasharray={metres > 0 ? "none" : "6 4"}
        opacity="0.85"/>
      {/* water texture lines */}
      <line x1="50" y1="56" x2="100" y2="56" stroke="rgba(15,17,19,0.08)" strokeWidth="1" strokeLinecap="round"/>
      <line x1="60" y1="65" x2="130" y2="65" stroke="rgba(15,17,19,0.08)" strokeWidth="1" strokeLinecap="round"/>
      <line x1="50" y1="74" x2="90" y2="74" stroke="rgba(15,17,19,0.08)" strokeWidth="1" strokeLinecap="round"/>
      {/* label */}
      <text x="100" y="110" textAnchor="middle" fontSize="9" fill="rgba(15,17,19,0.3)" fontFamily="sans-serif">{label}</text>
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
    case "pool":  return <PoolSchematic  metres={metres} shape={item.shape}/>;
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
  const [editingName, setEditingName] = useState(false);
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
        {/* length — always full width, always primary */}
        <div>
          <label className={labelCls}>{cfg.hint}</label>
          <div className="relative">
            <input
              type="number"
              value={item.metres}
              onChange={e => onChange(item.id, { metres: e.target.value })}
              min={0.5}
              max={40}
              step={0.5}
              placeholder="e.g. 12"
              className={`${inputCls} w-full pr-7`}
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-ink/35">m</span>
          </div>
        </div>

        {/* shape — pool and path only */}
        {(item.type === "pool" || item.type === "path") && (
          <div>
            <label className={labelCls}>Profile</label>
            <div className="flex gap-2">
              {(["straight", "curved"] as const).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onChange(item.id, { shape: s })}
                  className={`${chipBase} ${item.shape === s ? chipOn : chipOff}`}
                >
                  {s === "straight" ? "Straight" : "Curved"}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* steps — stair only, secondary below metres */}
        {item.type === "stair" && (
          <div>
            <label className={labelCls}>Steps (cosmetic — affects schematic only)</label>
            <input
              type="number"
              value={item.steps ?? "8"}
              onChange={e => onChange(item.id, { steps: e.target.value })}
              min={2}
              max={20}
              step={1}
              className={`${inputCls} w-32`}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────── DriverSummary */
function DriverSummary({
  runs,
  stripType,
  totalDrivers,
}: {
  runs: QuoteRunInput[];
  stripType: StripType;
  totalDrivers: number;
}) {
  if (runs.length === 0) return null;
  const stripPart  = stripType === "cc" ? PART_NUMBERS.stripCC  : PART_NUMBERS.stripMono;
  const stripLabel = stripType === "cc" ? PART_LABELS.stripCC   : PART_LABELS.stripMono;

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
}: {
  items: BuildItem[];
  totalMetres: number;
  totalDrivers: number;
  stripType: StripType;
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
    ...(it.steps ? { steps: it.steps } : {}),
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
          kit: "Build Your Space",
          kitId: "build",
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
          kit: "Build Your Space",
          kitId: "build",
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
        Build Your Space
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

/* ──────────────────────────────────────────────────── Page */
export default function BuildPage() {
  const [items, setItems] = useState<BuildItem[]>([]);
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
        ...(cfg.defaultSteps ? { steps: cfg.defaultSteps } : {}),
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
  // Stairs expand into N separate runs of tread_width each — each tread is
  // an independently-fed physical run with its own connector set, matching
  // how multi-tread jobs actually ship. All other item types produce one run.
  const validRuns: QuoteRunInput[] = items.flatMap(item => {
    const m = parseFloat(item.metres);
    if (isNaN(m) || m <= 0) return [];
    if (item.type === "stair") {
      const stepCount = Math.max(1, parseInt(item.steps ?? "8") || 8);
      return Array.from({ length: stepCount }, () => ({
        lengthMetres: m,          // m = tread width per step
        shape: item.shape,
      }));
    }
    return [{ lengthMetres: m, shape: item.shape }];
  });

  const totalMetres   = +validRuns.reduce((s, r) => s + r.lengthMetres, 0).toFixed(2);
  const stripType     = validRuns.length > 0 ? zoneStripType(validRuns) : "mono";
  const totalDrivers  = validRuns.length > 0 ? packDriversForRuns(validRuns, stripType) : 0;

  return (
    <div className="min-h-screen bg-bone">

      {/* nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bone/90 backdrop-blur-md border-b border-bone-line">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
          <Link href="/" className="font-display text-sm tracking-[0.25em] text-ink/60 hover:text-ink transition-colors flex-shrink-0">ORENARA</Link>
          <div className="hidden sm:flex items-center gap-6 text-xs text-ink/50">
            <Link href="/kits" className="hover:text-ink transition-colors">Kits</Link>
            <Link href="/quote-builder" className="hover:text-ink transition-colors">Quote builder</Link>
            <Link href="/trade" className="hover:text-ink transition-colors">Trade</Link>
          </div>
        </div>
      </nav>

      {/* page header */}
      <div className="pt-14">
        <div className="max-w-6xl mx-auto px-6 pt-10 pb-8 border-b border-bone-line">
          <Link href="/kits" className="inline-flex items-center gap-1.5 text-ink/40 hover:text-ink text-xs font-spec tracking-wider mb-4 transition-colors">
            <span>←</span> All kits
          </Link>
          <h1 className="font-display text-3xl sm:text-4xl text-ink mb-2">Build Your Space</h1>
          <p className="text-ink/55 max-w-xl leading-relaxed">
            Add the areas you want to light. Each item is priced as part of one job — all runs share a single driver calculation.
          </p>
        </div>
      </div>

      {/* main */}
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
              />
            </div>
          </div>

        </div>
      </div>

      {/* footer — extra bottom padding on mobile to clear the fixed CTA bar */}
      <footer className="bg-bone-tile border-t border-bone-line mt-16 pb-20 lg:pb-0">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <Link href="/" className="font-display text-sm tracking-[0.25em] text-ink/50 hover:text-ink transition-colors">ORENARA</Link>
          <div className="flex items-center gap-6 text-xs text-ink/40">
            <Link href="/kits" className="hover:text-ink/60 transition-colors">← All kits</Link>
            <Link href="/terms" className="hover:text-ink/60 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-ink/60 transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>

      {/* ── Mobile bottom CTA bar — hidden lg+ where sticky right panel takes over */}
      {(() => {
        const pricing = totalMetres > 0 ? calculateKitPricing(totalMetres) : null;
        return (
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
        );
      })()}
    </div>
  );
}
