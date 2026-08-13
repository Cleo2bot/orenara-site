"use client";

import React, { useState, useId, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  KITS,
  KitDef,
  ChannelMaterial,
  ChannelProfile,
  ConnectorEntry,
  getLengthMetres,
  roundTo10cm,
  calculateKitPricing,
  fmtAUD,
  CONNECTOR_ENTRY_LABELS,
  MIN_ORDER_INC_GST,
} from "../../../lib/kits-data";
import {
  calculateRunConfig,
  PART_NUMBERS,
  PART_LABELS,
} from "../../../lib/quoteCalc";

/* ─────────────────────────────────────────── shared atoms */
const inputCls =
  "w-full bg-bone-tile border border-bone-line text-ink rounded-xs px-3 py-2.5 text-sm placeholder:text-ink/35 focus:outline-none focus:border-ink/40 transition-colors";
const labelCls =
  "block text-[9px] font-spec tracking-widest text-ink/45 uppercase mb-2";
const chipBase =
  "px-3 py-1.5 text-sm font-spec border rounded-xs transition-colors cursor-pointer";
const chipOn  = "bg-ink border-ink text-bone";
const chipOff = "bg-transparent border-bone-line text-ink/60 hover:border-ink/30 hover:text-ink";
const chipDisabled =
  "bg-transparent border-bone-line/40 text-ink/20 cursor-not-allowed";

/* ─────────────────────────────────────────── tier config display */
function TierConfig({
  metres,
  trim,
}: {
  metres: number;
  trim: boolean;
}) {
  const config = calculateRunConfig(metres);
  const stripPart  = config.stripType === "cc" ? PART_NUMBERS.stripCC  : PART_NUMBERS.stripMono;
  const stripLabel = config.stripType === "cc" ? PART_LABELS.stripCC   : PART_LABELS.stripMono;
  const connectorCount = config.physicalRuns.length + (trim ? 1 : 0);

  return (
    <div className="rounded-xs border border-bone-line bg-bone-tile p-5">
      <p className="font-spec text-[8px] tracking-widest text-ink/35 uppercase mb-4">
        System configuration — {metres}m run{trim ? " + spare" : ""}
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
              {config.physicalRuns.length === 1 ? "1 run" : `${config.physicalRuns.length} independently-fed runs`}
            </p>
            <p className="text-xs text-ink/50 mt-0.5">
              {config.physicalRuns.map((r) => `${r.toFixed(1)}m`).join(" + ")}
            </p>
          </div>
          <span className="font-spec text-[9px] tracking-wider text-ink/40 flex-shrink-0 mt-0.5">
            {PART_NUMBERS.connectorSet}{connectorCount > 1 ? ` ×${connectorCount}` : ""}
          </span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-ink font-display">
              {config.driversNeeded === 1 ? "1 driver" : `${config.driversNeeded} drivers`}
            </p>
            <p className="text-xs text-ink/50 mt-0.5">LM-150-24 · 80% derate · 150W rated</p>
          </div>
          <span className="font-spec text-[9px] tracking-wider text-ink/40 flex-shrink-0 mt-0.5">
            {PART_NUMBERS.driver}{config.driversNeeded > 1 ? ` ×${config.driversNeeded}` : ""}
          </span>
        </div>

        {config.stripType === "cc" && (
          <p className="text-[10px] text-ink/45 leading-relaxed pt-2 border-t border-bone-line">
            Runs over 10m use CC strip — the constant-current SF16 variant ensures consistent brightness over the full run length.
          </p>
        )}
        {trim && (
          <p className="text-[10px] text-ink/45 leading-relaxed pt-2 border-t border-bone-line">
            Trim allowance: cuts must land on a valid 10cm mark. One spare connector set included.
          </p>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────── pricing panel */
type PanelMode = "idle" | "confirm" | "email_quote";
type FormState = "idle" | "submitting" | "success" | "error";

function PricingPanel({
  kit,
  metres,
  channelMaterial,
  channelProfile,
  connectorEntry,
  trim,
}: {
  kit: KitDef;
  metres: number | null;
  channelMaterial: ChannelMaterial;
  channelProfile: ChannelProfile;
  connectorEntry: ConnectorEntry;
  trim: boolean;
}) {
  const formId = useId();
  const pricing = metres !== null ? calculateKitPricing(metres) : null;
  const [showExGST, setShowExGST] = useState(false);
  const [panelMode, setPanelMode] = useState<PanelMode>("idle");
  const [emailOpen, setEmailOpen] = useState(false);

  // contact form
  const [name,   setName]   = useState("");
  const [email,  setEmail]  = useState("");
  const [phone,  setPhone]  = useState("");
  const [suburb, setSuburb] = useState("");
  const [notes,  setNotes]  = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [formError, setFormError] = useState("");
  const [orderRef, setOrderRef] = useState("");

  // email quote form
  const [quoteEmail, setQuoteEmail] = useState("");
  const [quoteState, setQuoteState] = useState<FormState>("idle");

  // Reset panel when kit config changes
  useEffect(() => {
    setPanelMode("idle");
    setEmailOpen(false);
    setFormState("idle");
    setOrderRef("");
    setQuoteState("idle");
  }, [metres, channelMaterial, channelProfile, connectorEntry, trim]);

  const basePayload = {
    kit: kit.name,
    kitId: kit.id,
    length: metres !== null ? `${metres}m` : "",
    channelMaterial,
    channelProfile,
    connectorEntry,
    trim,
  };

  async function submitConfirm(e: React.FormEvent) {
    e.preventDefault();
    setFormState("submitting");
    setFormError("");
    try {
      const res = await fetch("/kits/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "confirm", ...basePayload, name, email, phone: phone || undefined, suburb: suburb || undefined, notes: notes || undefined }),
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
        body: JSON.stringify({ type: "email_quote", ...basePayload, email: quoteEmail }),
      });
      if (res.ok) setQuoteState("success");
      else setQuoteState("error");
    } catch {
      setQuoteState("error");
    }
  }

  const summaryParts = [
    channelMaterial === "stainless" ? "Stainless" : "Aluminium",
    channelProfile === "flex" ? "Flex" : "Straight",
    CONNECTOR_ENTRY_LABELS[connectorEntry]?.replace(" (default)", ""),
    trim ? "Trim" : null,
  ].filter(Boolean).join(" · ");

  return (
    <div className="rounded-xs border border-bone-line bg-bone-tile p-6">
      {/* header */}
      <p className="font-spec text-[8px] tracking-widest text-ink/40 uppercase mb-1">
        {kit.name}{metres ? ` · ${metres}m` : ""}
      </p>
      {summaryParts && (
        <p className="font-spec text-[8px] tracking-widest text-ink/30 mb-4">{summaryParts}</p>
      )}

      {/* pricing */}
      {!pricing ? (
        <div className="py-6 text-center border border-dashed border-bone-line rounded-xs mb-4">
          <p className="text-sm text-ink/40">Select a length to see pricing.</p>
        </div>
      ) : (
        <div className="mb-5 space-y-1.5">
          {!pricing.minimumApplied && (
            <div className="flex justify-between text-xs text-ink/55">
              <span>{metres}m × {fmtAUD(pricing.pricePerMetre)}/m inc GST</span>
              <span>{fmtAUD(pricing.subtotalIncGST)}</span>
            </div>
          )}
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
              Minimum self-serve order is {fmtAUD(MIN_ORDER_INC_GST)} inc GST. Your {metres}m run
              ({fmtAUD(pricing.subtotalIncGST)} inc GST) falls below this threshold.
            </p>
          )}
        </div>
      )}

      {/* confirm form */}
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
                <input id={`${formId}-name`} type="text" value={name} onChange={e=>setName(e.target.value)} required autoComplete="name" className={inputCls} placeholder="Full name"/>
              </div>
              <div>
                <label htmlFor={`${formId}-suburb`} className={labelCls}>Suburb</label>
                <input id={`${formId}-suburb`} type="text" value={suburb} onChange={e=>setSuburb(e.target.value)} className={inputCls} placeholder="e.g. Mosman"/>
              </div>
            </div>
            <div>
              <label htmlFor={`${formId}-email`} className={labelCls}>Email</label>
              <input id={`${formId}-email`} type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email" className={inputCls} placeholder="you@example.com"/>
            </div>
            <div>
              <label htmlFor={`${formId}-phone`} className={labelCls}>Phone (optional)</label>
              <input id={`${formId}-phone`} type="tel" value={phone} onChange={e=>setPhone(e.target.value)} autoComplete="tel" className={inputCls} placeholder="04xx xxx xxx"/>
            </div>
            <div>
              <label htmlFor={`${formId}-notes`} className={labelCls}>Notes (optional)</label>
              <textarea id={`${formId}-notes`} value={notes} onChange={e=>setNotes(e.target.value)} rows={2} className={`${inputCls} resize-none`} placeholder="Any extra context…"/>
            </div>
            {formError && <p className="text-xs text-ink/70 bg-bone-card border border-bone-line rounded-xs px-3 py-2">{formError}</p>}
            <button type="submit" disabled={formState === "submitting" || !pricing} className="w-full bg-ink text-bone font-spec text-[10px] tracking-widest uppercase px-4 py-3 rounded-xs hover:bg-ink/90 transition-colors disabled:opacity-50">
              {formState === "submitting" ? "Submitting…" : "Confirm & request invoice"}
            </button>
            <p className="text-[10px] text-ink/35 text-center">No payment now — we'll send an invoice.</p>
          </form>
        )
      ) : (
        /* CTA buttons */
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
              <Link
                href="/kits#review"
                className="block w-full text-center text-xs text-ink/40 hover:text-ink/60 transition-colors"
              >
                Request review instead →
              </Link>
            </div>
          </div>
        )
      )}

      {!pricing && panelMode === "idle" && (
        <p className="text-[10px] text-ink/35 text-center mt-2">Select a length above to confirm.</p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────── page inner */
function KitPageInner({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const kit = KITS.find((k) => k.id === slug);

  const initialLength = (() => {
    const param = searchParams.get("length");
    if (param && kit?.lengths.includes(param)) return getLengthMetres(param);
    return null;
  })();

  const [selectedChip, setSelectedChip]       = useState<string | null>(
    searchParams.get("length") && kit?.lengths.includes(searchParams.get("length")!) ? searchParams.get("length")! : null
  );
  const [customInput, setCustomInput]         = useState<string>("");
  const [channelMaterial, setChannelMaterial] = useState<ChannelMaterial>(kit?.defaultMaterial ?? "aluminium");
  const [channelProfile, setChannelProfile]   = useState<ChannelProfile>(kit?.defaultProfile ?? "straight");
  const [connectorEntry, setConnectorEntry]   = useState<ConnectorEntry>("bottom");
  const [trim, setTrim]                       = useState<boolean>(false);
  const customInputRef = useRef<HTMLInputElement>(null);
  const panelRef       = useRef<HTMLDivElement>(null);

  // Auto-switch L-shape → bottom when stainless selected
  useEffect(() => {
    if (channelMaterial === "stainless" && connectorEntry === "l-shape") {
      setConnectorEntry("bottom");
    }
  }, [channelMaterial, connectorEntry]);

  if (!kit) {
    return (
      <div className="min-h-screen bg-bone flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-2xl text-ink mb-4">Kit not found.</p>
          <Link href="/kits" className="text-ink/60 hover:text-ink text-sm underline">Back to kits</Link>
        </div>
      </div>
    );
  }

  // Effective metres — custom input takes priority over chip
  const parsedCustom = parseFloat(customInput.trim());
  const hasValidCustom = customInput.trim() !== "" && !isNaN(parsedCustom) && parsedCustom > 0;
  const rawMetres = hasValidCustom ? parsedCustom : (selectedChip ? getLengthMetres(selectedChip) : null);
  const effectiveMetres: number | null = rawMetres !== null ? rawMetres : null;
  const roundedMetres: number | null = effectiveMetres !== null ? roundTo10cm(effectiveMetres) : null;
  const isInRange = roundedMetres !== null && roundedMetres >= kit.customLengthMin && roundedMetres <= kit.customLengthMax;
  const validMetres: number | null = isInRange ? roundedMetres : null;

  function selectChip(l: string) {
    setSelectedChip(l === selectedChip ? null : l);
    setCustomInput("");
  }

  function handleCustomChange(v: string) {
    setCustomInput(v);
    setSelectedChip(null);
  }

  function handleCustomBlur() {
    if (hasValidCustom) {
      const rounded = roundTo10cm(parsedCustom);
      setCustomInput(String(rounded));
    }
  }

  const connectorOptions: { id: ConnectorEntry; label: string }[] = [
    { id: "direct",   label: "Direct" },
    { id: "side",     label: "Side" },
    { id: "bottom",   label: "Bottom" },
    { id: "l-shape",  label: "L-shape" },
  ];

  const lengthError = hasValidCustom && !isInRange
    ? `Enter a length between ${kit.customLengthMin}m and ${kit.customLengthMax}m.`
    : null;

  return (
    <div className="min-h-screen bg-bone">

      {/* nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bone/90 backdrop-blur-md border-b border-bone-line">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
          <Link href="/" className="font-display text-sm tracking-[0.25em] text-ink/60 hover:text-ink transition-colors flex-shrink-0">ORENARA</Link>
          <div className="hidden sm:flex items-center gap-6 text-xs text-ink/50">
            <Link href="/kits" className="hover:text-ink transition-colors">Kits</Link>
            <Link href="/kits/build" className="hover:text-ink transition-colors">Build your space</Link>
            <Link href="/trade" className="hover:text-ink transition-colors">Trade</Link>
          </div>
        </div>
      </nav>

      {/* hero */}
      <div className="pt-14">
        <div className="relative w-full aspect-[21/9] overflow-hidden bg-ink">
          <Image src={kit.image} alt={kit.name} fill className="object-cover img-treated opacity-60" priority sizes="100vw"/>
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent"/>
          <div className="absolute bottom-0 left-0 right-0 max-w-6xl mx-auto px-6 pb-8">
            <Link href="/kits" className="inline-flex items-center gap-1.5 text-bone/50 hover:text-bone text-xs font-spec tracking-wider mb-4 transition-colors">
              <span>←</span> All kits
            </Link>
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <span className="font-spec text-[8px] tracking-widest uppercase bg-bone/15 border border-bone/20 text-bone/70 px-2.5 py-1 rounded-xs backdrop-blur-sm">
                {kit.channelBadge}
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl text-bone leading-tight">{kit.name}</h1>
          </div>
        </div>
      </div>

      {/* main */}
      <div className="max-w-6xl mx-auto px-6 py-12 lg:py-16">
        <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-12">

          {/* ── left column */}
          <div className="space-y-8">

            {/* application */}
            <div>
              <p className="font-spec text-[9px] tracking-widest text-ink/40 uppercase mb-2">Application</p>
              <p className="text-ink/70 leading-relaxed max-w-2xl">{kit.application}</p>
              {kit.channelNote && (
                <p className="text-xs text-ink/50 leading-relaxed italic mt-2">{kit.channelNote}</p>
              )}
            </div>

            {/* ── channel selector */}
            <div>
              <p className="font-spec text-[9px] tracking-widest text-ink/40 uppercase mb-3">Channel</p>
              <div className="grid grid-cols-2 gap-4">
                {/* material */}
                <div>
                  <p className={labelCls}>Material</p>
                  <div className="flex gap-2 flex-wrap">
                    {(["aluminium", "stainless"] as ChannelMaterial[]).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setChannelMaterial(m)}
                        className={`${chipBase} ${channelMaterial === m ? chipOn : chipOff}`}
                      >
                        {m === "aluminium" ? "Aluminium" : "Stainless"}
                      </button>
                    ))}
                  </div>
                  {channelMaterial === "stainless" && (
                    <p className="text-[10px] text-ink/45 leading-relaxed mt-2 italic">
                      SF16/stainless compatibility unconfirmed — confirm with us before finalising.
                    </p>
                  )}
                </div>
                {/* profile */}
                <div>
                  <p className={labelCls}>Profile</p>
                  <div className="flex gap-2 flex-wrap">
                    {(["straight", "flex"] as ChannelProfile[]).map((pr) => (
                      <button
                        key={pr}
                        type="button"
                        onClick={() => setChannelProfile(pr)}
                        className={`${chipBase} ${channelProfile === pr ? chipOn : chipOff}`}
                      >
                        {pr === "straight" ? "Straight" : "Flex"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── length selector */}
            <div>
              <p className="font-spec text-[9px] tracking-widest text-ink/40 uppercase mb-3">Length</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {kit.lengths.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => selectChip(l)}
                    className={`${chipBase} ${selectedChip === l && !hasValidCustom ? chipOn : chipOff}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-[160px]">
                  <input
                    ref={customInputRef}
                    type="number"
                    value={customInput}
                    onChange={(e) => handleCustomChange(e.target.value)}
                    onBlur={handleCustomBlur}
                    min={kit.customLengthMin}
                    max={kit.customLengthMax}
                    step={0.1}
                    className={`${inputCls} pr-8`}
                    placeholder={`Custom (${kit.customLengthMin}–${kit.customLengthMax})`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink/40">m</span>
                </div>
                <span className="text-xs text-ink/35">Rounded to nearest 10cm</span>
              </div>
              {lengthError && (
                <p className="text-xs text-ink/60 mt-1.5">{lengthError}</p>
              )}
              {hasValidCustom && isInRange && roundedMetres !== parsedCustom && (
                <p className="text-[10px] text-ink/40 mt-1.5">Rounded to {roundedMetres}m (nearest 10cm cut mark).</p>
              )}
            </div>

            {/* ── tier config */}
            {validMetres !== null ? (
              <TierConfig metres={validMetres} trim={trim} />
            ) : (
              <div className="rounded-xs border border-dashed border-bone-line bg-bone-tile/50 p-5">
                <p className="text-sm text-ink/35 text-center">
                  {lengthError ? lengthError : "Select or enter a length to see the system configuration."}
                </p>
              </div>
            )}

            {/* ── connector entry */}
            <div>
              <p className="font-spec text-[9px] tracking-widest text-ink/40 uppercase mb-1">Connector entry</p>
              <p className="text-[10px] text-ink/40 leading-relaxed mb-3">
                How the power lead enters the channel. Bottom entry is the standard for most installs.
              </p>
              <div className="flex flex-wrap gap-2">
                {connectorOptions.map(({ id, label }) => {
                  const disabled = id === "l-shape" && channelMaterial === "stainless";
                  return (
                    <button
                      key={id}
                      type="button"
                      disabled={disabled}
                      onClick={() => !disabled && setConnectorEntry(id)}
                      title={disabled ? "L-shape entry not confirmed for SF17 stainless" : undefined}
                      className={`${chipBase} ${
                        disabled
                          ? chipDisabled
                          : connectorEntry === id
                          ? chipOn
                          : chipOff
                      }`}
                    >
                      {label === "Bottom" ? "Bottom (default)" : label}
                    </button>
                  );
                })}
              </div>
              {channelMaterial === "stainless" && (
                <p className="text-[10px] text-ink/40 leading-relaxed mt-2 italic">
                  L-shape entry is not confirmed available for SF17 stainless — greyed out until confirmed.
                </p>
              )}
            </div>

            {/* ── trim checkbox */}
            <div className="flex items-start gap-3 rounded-xs border border-bone-line bg-bone-tile p-4">
              <div className="flex-shrink-0 mt-0.5">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={trim}
                  onClick={() => setTrim((v) => !v)}
                  className={`w-4 h-4 rounded-[2px] border transition-colors flex items-center justify-center flex-shrink-0 ${
                    trim ? "bg-ink border-ink" : "bg-transparent border-bone-line/60"
                  }`}
                >
                  {trim && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </div>
              <div>
                <p className="text-sm text-ink font-display leading-none mb-1">I might trim this on site</p>
                <p className="text-xs text-ink/55 leading-relaxed">
                  Cuts must land on a valid 10cm mark. A spare IP68 connector set is included — trimming removes the factory connector on that end, so one spare is needed.
                </p>
              </div>
            </div>

            {/* ── what's included */}
            <div>
              <p className="font-spec text-[9px] tracking-widest text-ink/40 uppercase mb-4">What's included</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    label: "IP68 silicone strip",
                    detail: validMetres && validMetres > 10
                      ? `SF16 CC variant (OR-SF-16CC) — required for runs over 10m`
                      : `SF16 mono (OR-SF-16M) — warm white`,
                  },
                  {
                    label: `${channelMaterial === "stainless" ? "Stainless 316L" : "Aluminium"} channel`,
                    detail: `${channelProfile === "flex" ? "Flexible segmented" : "Rigid"} profile · frosted PC diffuser`,
                  },
                  {
                    label: validMetres ? `${calculateRunConfig(validMetres).driversNeeded}× IP67 driver` : "IP67 driver(s)",
                    detail: "LM-150-24 · 24V DC · 80% derated",
                  },
                  {
                    label: `Factory IP68 connectors${trim ? " + spare" : ""}`,
                    detail: `Moulded onto strip ends · pressure-tested before dispatch${trim ? " · 1 spare included for on-site trim" : ""}`,
                  },
                ].map((item) => (
                  <div key={item.label} className="rounded-xs border border-bone-line bg-bone-tile p-4">
                    <p className="font-display text-sm text-ink mb-1">{item.label}</p>
                    <p className="text-xs text-ink/55 leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── ideal for */}
            <div>
              <p className="font-spec text-[9px] tracking-widest text-ink/40 uppercase mb-3">Ideal for</p>
              <ul className="space-y-2">
                {kit.idealFor.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm text-ink/65">
                    <span className="w-1 h-1 rounded-full bg-ink/30 flex-shrink-0 mt-2"/>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* multi-zone cross-link */}
            <div className="rounded-xs border border-bone-line bg-bone-tile/60 px-5 py-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-ink font-display">Multiple areas?</p>
                <p className="text-xs text-ink/55 mt-0.5 leading-relaxed">
                  Pool, path, and stairs together — all priced in one job.
                </p>
              </div>
              <Link
                href="/kits/build"
                className="flex-shrink-0 font-spec text-[9px] tracking-widest uppercase border border-ink/25 text-ink/60 px-4 py-2 rounded-xs hover:bg-ink hover:text-bone hover:border-ink transition-colors whitespace-nowrap"
              >
                Build your space →
              </Link>
            </div>

            {/* compliance note */}
            <div className="rounded-xs border border-bone-line bg-bone-card px-5 py-4">
              <p className="text-xs text-ink/55 leading-relaxed">
                <strong className="text-ink/70 font-display">Installation note.</strong>{" "}
                All electrical work must be carried out by a licensed electrician in line with AS/NZS 3000.
                Orenara supplies the finished system; your electrician connects it to mains.
              </p>
            </div>
          </div>

          {/* ── right column — sticky pricing panel (desktop) */}
          <div className="mt-10 lg:mt-0">
            <div ref={panelRef} className="lg:sticky lg:top-20">
              <PricingPanel
                kit={kit}
                metres={validMetres}
                channelMaterial={channelMaterial}
                channelProfile={channelProfile}
                connectorEntry={connectorEntry}
                trim={trim}
              />
            </div>
          </div>

        </div>
      </div>

      {/* footer — extra bottom padding on mobile to clear the fixed CTA bar */}
      <footer className="bg-bone-tile border-t border-bone-line pb-20 lg:pb-0">
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
        const pricing = validMetres !== null ? calculateKitPricing(validMetres) : null;
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
                  <p className="text-sm text-ink/40">Select a length to price</p>
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

export default function KitSlugPage({ params }: { params: { slug: string } }) {
  return <KitPageInner slug={params.slug} />;
}
