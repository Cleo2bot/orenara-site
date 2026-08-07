"use client";

import React, { useState, useRef, useEffect, useId } from "react";
import Image from "next/image";
import Link from "next/link";

/* ------------------------------------------------------------------ types */
type KitId = "pool" | "stair" | "patio" | "path";
type FormState = "idle" | "submitting" | "success" | "error";
type Control = "fixed" | "dimmer";

interface KitContent { label: string; detail: string }
interface InstallStep { step: string; desc: string }

interface KitDef {
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
}

/* ------------------------------------------------------------------ data */
const KITS: KitDef[] = [
  {
    id: "pool",
    name: "Pool Surround Kit",
    tagline: "Pool coping & pond edges",
    application: "For permanent submersion: tile-flush coping, lap-pool edges, infinity-edge channels, pond surrounds.",
    channel: "Stainless 316L",
    channelBadge: "STAINLESS 316L",
    channelNote: "Only stainless — aluminium corrodes in chlorinated and salt water.",
    lengths: ["3m", "5m", "8m", "10m"],
    image: "/images/gallery/orenara-curved-travertine-pool.webp",
    idealFor: ["Pool coping and tile-flush edges", "Lap pool and infinity pool perimeters", "Raised garden pond surrounds", "Water features and fountains"],
    difficulty: "Straightforward",
    difficultyDetail: "2–4 hours for most coping runs. No waterproofing — connectors are sealed at the factory.",
    kitContents: [
      { label: "IP68 silicone strip", detail: "SF16 series — sealed end-to-end, pre-cut to your length, 2700K warm white" },
      { label: "316L stainless channel", detail: "Marine-grade with frosted PC diffuser — rated for permanent immersion and pool chemicals" },
      { label: "Factory IP68 connectors", detail: "Moulded directly onto the strip ends — nothing to assemble, nothing to waterproof" },
      { label: "IP67 LED driver", detail: "Sized for your run, 24V DC, weatherproof enclosure, Australian plug included" },
      { label: "240V Australian plug", detail: "2m lead — runs to a weatherproof GPO near pool equipment" },
      { label: "Stainless fixings + guide", detail: "316L screws and a one-page install sheet covering coping, silicone bed and GPO placement" },
    ],
    howItInstalls: [
      { step: "Set the channel", desc: "Lay the stainless channel on a silicone bed along the coping edge. Screw through pre-drilled holes with supplied fixings." },
      { step: "Clip in the strip", desc: "The silicone strip presses into the channel and is retained by the diffuser clip — no tools, no wiring." },
      { step: "Route the lead", desc: "Run the 2-pin IP68 lead from the channel to your weatherproof driver enclosure near pool equipment." },
      { step: "Plug in and go", desc: "Driver plugs into any weatherproof GPO. Strip comes on immediately — no commissioning needed." },
    ],
  },
  {
    id: "stair",
    name: "Stair Kit",
    tagline: "Step edges & stair nosing",
    application: "A clean line of light along every step nosing — external garden stairs, internal treads, deck steps, and ramps.",
    channel: "Aluminium",
    channelBadge: "ALUMINIUM",
    lengths: ["2m", "3m", "5m"],
    image: "/images/gallery/orenara-travertine-steps-pool.webp",
    idealFor: ["External garden and pool stairs", "Internal tread and step nosing", "Deck and timber step edges", "Ramp and disabled-access edges"],
    difficulty: "Easy",
    difficultyDetail: "1–2 hours for a typical flight. One channel per step, all pre-cut. Link cables connect each step to a single driver.",
    kitContents: [
      { label: "IP68 silicone strip", detail: "SF16 series — pre-cut per step length, 2700K warm white, sealed end-to-end" },
      { label: "Anodised aluminium channel", detail: "Surface-mount recessed profile with frosted diffuser — sits flush under the nosing overhang" },
      { label: "IP68 link cables", detail: "Connect each step's channel to the next — no exposed joins, no tape joints" },
      { label: "Factory IP68 connectors", detail: "Moulded on — push-lock to link cables, nothing to solder or seal" },
      { label: "IP67 LED driver", detail: "Single driver powers the whole run, 24V, weatherproof enclosure, Australian plug" },
      { label: "Stainless fixings + guide", detail: "Per-step screw positions and cable routing on the install sheet" },
    ],
    howItInstalls: [
      { step: "Fix the channels", desc: "Screw or adhesive-mount one channel on each step nosing — typically under the overhang for a recessed look." },
      { step: "Clip strips in", desc: "Pre-cut strips press into each channel and are retained by the diffuser — no tools needed." },
      { step: "Connect link cables", desc: "Push-lock IP68 cables daisy-chain each step to the next, ending at the driver position." },
      { step: "Plug in", desc: "Single driver at the base or top of the flight plugs into a weatherproof GPO. All steps come on together." },
    ],
  },
  {
    id: "patio",
    name: "Patio Kit",
    tagline: "Alfresco edges & pergola fascia",
    application: "Continuous warm light along pergola beams, deck edges, alfresco perimeters and BBQ surrounds — built for covered outdoor living.",
    channel: "Aluminium",
    channelBadge: "ALUMINIUM",
    lengths: ["3m", "5m", "8m", "10m"],
    image: "/images/kits/kit-patio.jpg",
    idealFor: ["Pergola fascia and beam edges", "Alfresco perimeter wall bases", "Deck edge and fascia board", "BBQ surrounds and outdoor kitchens"],
    difficulty: "Easy",
    difficultyDetail: "1–4 hours depending on run length. Straight aluminium channel — no bends, screws every 500mm.",
    kitContents: [
      { label: "IP68 silicone strip", detail: "SF16 series — pre-cut to your length, 2700K warm white, sealed" },
      { label: "Surface-mount aluminium channel", detail: "Flat-back profile with frosted diffuser — screws direct to timber, masonry or steel fascia" },
      { label: "Factory IP68 connectors", detail: "Moulded on both ends — plug-and-lock to driver lead, nothing to seal" },
      { label: "IP67 LED driver", detail: "Sized for your run, 24V, weatherproof enclosure, Australian plug" },
      { label: "240V Australian plug", detail: "2m lead — routes to nearest GPO, typically inside the alfresco or on an exterior wall" },
      { label: "Stainless fixings + guide", detail: "Self-tapping screws for timber pergola, masonry anchors for rendered walls" },
    ],
    howItInstalls: [
      { step: "Mark and fix the channel", desc: "Screw the channel to the fascia edge or wall base every 500mm with supplied fixings — 10 minutes per run." },
      { step: "Press in the strip", desc: "Strip clicks into the channel and is retained by the diffuser clip. No adhesive needed." },
      { step: "Connect the driver lead", desc: "2-pin IP68 lead plugs from the strip end to the driver. Mount driver in a sheltered spot under the pergola roof." },
      { step: "Plug in", desc: "Australian plug to any standard GPO — inside or weatherproof exterior. Done." },
    ],
  },
  {
    id: "path",
    name: "Path Kit",
    tagline: "Garden paths & curved edges",
    application: "Follows curves without cuts — designed for garden paths, driveway borders, retaining walls and landscape edges that bend.",
    channel: "Flexible Aluminium",
    channelBadge: "FLEXIBLE ALUMINIUM",
    channelNote: "Segmented aluminium channel bends to follow curves — no notching or cutting required.",
    lengths: ["2m", "3m", "5m"],
    image: "/images/gallery/orenara-curved-path-pool-dusk.webp",
    idealFor: ["Curved garden paths and walkways", "Driveway edge borders", "Retaining wall cap edges", "Landscape and garden bed borders"],
    difficulty: "Easy",
    difficultyDetail: "1–2 hours. The flexible channel bends by hand — no cuts, no mitre joints, no special tools.",
    kitContents: [
      { label: "IP68 silicone strip", detail: "SF16 series — pre-cut, 2700K warm white, sealed end-to-end" },
      { label: "Flexible segmented aluminium channel", detail: "Segments pivot to follow any curve radius — bends by hand, diffuser included" },
      { label: "Factory IP68 connectors", detail: "Moulded on both ends — plug-lock to driver lead" },
      { label: "IP67 LED driver", detail: "24V, weatherproof, sized for your run, Australian plug included" },
      { label: "Stainless fixings + guide", detail: "Peg anchors for garden bed edges, self-tappers for retaining walls, cable routing tips" },
    ],
    howItInstalls: [
      { step: "Bend the channel", desc: "Flex the segmented channel by hand to match your path curve. Segments pivot — no cuts, no heat gun." },
      { step: "Anchor it down", desc: "Peg or screw the channel to the edge every 300–400mm using the supplied fixings." },
      { step: "Press in the strip", desc: "Strip clicks into the curved channel — fits because both the strip and channel flex together." },
      { step: "Connect and plug in", desc: "IP68 lead to driver, driver to a weatherproof GPO nearby. Done in under two hours." },
    ],
  },
];

const BOX_ITEMS = [
  { label: "Sealed IP68 strip", detail: "Cut to your exact length. Factory-sealed, dot-free silicone.", tag: "Strip" },
  { label: "Matched channel", detail: "Aluminium or stainless. Frosted diffuser included.", tag: "Channel" },
  { label: "Factory connectors", detail: "Moulded onto the strip ends. Nothing for you to assemble.", tag: "Connectors" },
  { label: "Sized driver", detail: "IP67 rated, 24V DC. Correct wattage for your run length.", tag: "Driver" },
  { label: "240V Australian plug", detail: "2m lead. Standard GPO — no electrician required.", tag: "Plug" },
  { label: "Fixings + install guide", detail: "Stainless screws, anchors, and a one-page install sheet.", tag: "Guide" },
];

const TRUST_POINTS = [
  { label: "IP68 submersible", detail: "Rated for permanent immersion — not just splash-proof." },
  { label: "Factory-sealed connectors", detail: "Pressure-tested before dispatch. Nothing for you to waterproof." },
  { label: "No field termination", detail: "Every connection is made at our factory. Zero DIY sealing required." },
  { label: "Same components", detail: "Identical strip, connectors and channel to our custom-quoted systems." },
];

/* ------------------------------------------------------------------ shared input styles (light bg) */
const inputCls = "w-full bg-bone-tile border border-bone-line text-ink rounded-xs px-3 py-2.5 text-sm placeholder:text-ink/35 focus:outline-none focus:border-[--ember] transition-colors";

/* ------------------------------------------------------------------ Select with visible arrow */
function Select({ id, value, onChange, required, children }: {
  id?: string; value: string; onChange: (v: string) => void; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={`${inputCls} appearance-none pr-8 cursor-pointer`}
      >
        {children}
      </select>
      {/* custom arrow */}
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink/50">
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ form */
function WaitlistForm({ preselectedKit, onSuccess }: { preselectedKit: KitId | null; onSuccess?: () => void }) {
  const formId = useId();
  const [kit, setKit] = useState<string>(preselectedKit ?? "");
  const [lengths, setLengths] = useState<string[]>([]);
  const [control, setControl] = useState<Control>("fixed");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [metres, setMetres] = useState("");
  const [priceSensible, setPriceSensible] = useState("");
  const [priceTooMuch, setPriceTooMuch] = useState("");
  const [installer, setInstaller] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [error, setError] = useState("");

  useEffect(() => { if (preselectedKit) setKit(preselectedKit); }, [preselectedKit]);

  const selectedKitDef = KITS.find((k) => k.id === kit);

  function toggleLength(l: string) {
    setLengths((prev) => prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormState("submitting");
    setError("");
    try {
      const res = await fetch("/diy-kits/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kit: selectedKitDef?.name ?? kit, lengths, name, email, phone: phone || undefined, metres: metres || undefined, priceSensible: priceSensible || undefined, priceTooMuch: priceTooMuch || undefined, installer }),
      });
      if (res.ok) {
        setFormState("success");
        if (typeof window !== "undefined" && (window as Window & { gtag?: Function }).gtag) {
          (window as Window & { gtag?: Function }).gtag!("event", "diy_kit_waitlist", { kit_name: selectedKitDef?.name ?? kit });
        }
        onSuccess?.();
      } else {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error || "Something went wrong — please try again.");
        setFormState("error");
      }
    } catch {
      setError("Network error — please check your connection and try again.");
      setFormState("error");
    }
  }

  if (formState === "success") {
    return (
      <div className="py-10 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-[--ember] mb-4">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10l4 4 8-8" stroke="#D9A05B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p className="font-display text-lg text-ink mb-2">You're on the list.</p>
        <p className="text-ink/60 text-sm leading-relaxed max-w-xs mx-auto">
          We'll email you the moment kits go live — likely September 2026. No payment has been taken.
        </p>
      </div>
    );
  }

  const labelCls = "block text-[9px] font-spec tracking-widest text-ink/45 uppercase mb-2";
  const chipBase = "px-3 py-1.5 text-sm font-spec border rounded-xs transition-colors";
  const chipOn = "bg-[--ember] border-[--ember] text-ink";
  const chipOff = "bg-transparent border-bone-line text-ink/60 hover:border-[--ink]/30";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* kit */}
      <div>
        <label htmlFor={`${formId}-kit`} className={labelCls}>Which kit?</label>
        <Select id={`${formId}-kit`} value={kit} onChange={(v) => { setKit(v); setLengths([]); }} required>
          <option value="">Select a kit…</option>
          {KITS.map((k) => <option key={k.id} value={k.id}>{k.name}</option>)}
        </Select>
      </div>

      {/* lengths */}
      {selectedKitDef && (
        <div>
          <p className={labelCls}>Lengths you're interested in</p>
          <div className="flex flex-wrap gap-2">
            {selectedKitDef.lengths.map((l) => (
              <button key={l} type="button" onClick={() => toggleLength(l)} className={`${chipBase} ${lengths.includes(l) ? chipOn : chipOff}`}>{l}</button>
            ))}
          </div>
        </div>
      )}

      {/* control */}
      <div>
        <p className={labelCls}>Control preference</p>
        <div className="flex gap-2">
          {(["fixed", "dimmer"] as const).map((c) => (
            <button key={c} type="button" onClick={() => setControl(c)}
              className={`flex-1 py-2 text-sm font-spec border rounded-xs transition-colors ${control === c ? chipOn : chipOff}`}>
              {c === "fixed" ? "Always on" : "Wall dimmer"}
            </button>
          ))}
        </div>
      </div>

      {/* name + email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${formId}-name`} className={labelCls}>Name</label>
          <input id={`${formId}-name`} type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your name" className={inputCls} />
        </div>
        <div>
          <label htmlFor={`${formId}-email`} className={labelCls}>Email</label>
          <input id={`${formId}-email`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className={inputCls} />
        </div>
      </div>

      {/* phone + metres */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${formId}-phone`} className={labelCls}>Phone <span className="normal-case tracking-normal font-body opacity-60">(optional)</span></label>
          <input id={`${formId}-phone`} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="04xx xxx xxx" className={inputCls} />
        </div>
        <div>
          <label htmlFor={`${formId}-metres`} className={labelCls}>Roughly how many metres? <span className="normal-case tracking-normal font-body opacity-60">(optional)</span></label>
          <input id={`${formId}-metres`} type="number" min="1" max="100" value={metres} onChange={(e) => setMetres(e.target.value)} placeholder="e.g. 8" className={inputCls} />
        </div>
      </div>

      {/* pricing */}
      <div>
        <p className={labelCls}>Help us price it right</p>
        <p className="text-xs text-ink/45 mb-3">These two numbers directly shape how we launch pricing — your input counts.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${formId}-price1`} className="block text-xs text-ink/55 mb-1.5">What would you expect to pay for a kit like this?</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/45 text-sm">$</span>
              <input id={`${formId}-price1`} type="number" min="0" value={priceSensible} onChange={(e) => setPriceSensible(e.target.value)} placeholder="e.g. 450"
                className={`${inputCls} pl-7`} />
            </div>
          </div>
          <div>
            <label htmlFor={`${formId}-price2`} className="block text-xs text-ink/55 mb-1.5">At what price would this be too expensive?</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/45 text-sm">$</span>
              <input id={`${formId}-price2`} type="number" min="0" value={priceTooMuch} onChange={(e) => setPriceTooMuch(e.target.value)} placeholder="e.g. 750"
                className={`${inputCls} pl-7`} />
            </div>
          </div>
        </div>
      </div>

      {/* installer */}
      <div>
        <label htmlFor={`${formId}-installer`} className={labelCls}>Are you installing yourself or hiring someone?</label>
        <Select id={`${formId}-installer`} value={installer} onChange={setInstaller} required>
          <option value="">Select…</option>
          <option value="self">Installing it myself</option>
          <option value="electrician-hiring">Hiring an electrician</option>
          <option value="electrician-am">I am a licensed electrician</option>
          <option value="builder">Builder / trades</option>
        </Select>
      </div>

      {error && <p className="text-sm text-red-600 border border-red-200 bg-red-50 px-3 py-2 rounded-xs">{error}</p>}

      <button type="submit" disabled={formState === "submitting"}
        className="w-full bg-[--ember] hover:bg-[--ember-deep] text-ink font-display text-sm tracking-wider uppercase py-3.5 rounded-xs transition-colors disabled:opacity-50">
        {formState === "submitting" ? "Sending…" : "Notify me when it's ready"}
      </button>
      <p className="text-xs text-center text-ink/35">No payment taken — registration only.</p>
    </form>
  );
}

/* ------------------------------------------------------------------ kit card */
function KitCard({ kit, onRegister }: { kit: KitDef; onRegister: (id: KitId) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"contents" | "install">("contents");
  const detailRef = useRef<HTMLDivElement>(null);

  function handleExpand() {
    setExpanded(true);
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 80);
    if (typeof window !== "undefined" && (window as Window & { gtag?: Function }).gtag) {
      (window as Window & { gtag?: Function }).gtag!("event", "diy_kit_view", { kit_name: kit.name });
    }
  }

  const chipBase = "px-3 py-1.5 text-sm font-spec border rounded-xs transition-colors";
  const chipOn = "bg-[--ember] border-[--ember] text-ink";
  const chipOff = "bg-transparent border-bone-line text-ink/55 hover:border-[--ink]/30";

  return (
    <article className="border border-bone-line rounded-xs overflow-hidden bg-bone-card flex flex-col">
      {/* image */}
      <div className="relative w-full aspect-[16/10] overflow-hidden">
        <Image src={kit.image} alt={kit.application} fill className="object-cover img-treated" sizes="(max-width: 768px) 100vw, 50vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-[--ink] via-[--ink]/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[--ink]/20 to-transparent" />
        {/* channel badge */}
        <div className="absolute top-3 right-3 bg-[--ink]/75 backdrop-blur-sm border border-white/10 px-2.5 py-1.5 rounded-xs">
          <span className="font-spec text-[9px] tracking-[0.15em] text-[--bone] uppercase">{kit.channelBadge}</span>
        </div>
        {/* name over image */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="font-spec text-[9px] tracking-[0.15em] text-[--ember] uppercase mb-1.5">{kit.tagline}</p>
          <h3 className="font-display text-2xl text-white leading-tight" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>
            {kit.name}
          </h3>
        </div>
      </div>

      {/* card body */}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-sm text-ink/65 leading-relaxed mb-5">{kit.application}</p>

        {/* lengths */}
        <div className="mb-4">
          <p className="font-spec text-[9px] tracking-widest text-ink/40 uppercase mb-2">Available lengths</p>
          <div className="flex flex-wrap gap-1.5">
            {kit.lengths.map((l) => (
              <span key={l} className="font-spec text-xs text-ink/65 border border-bone-line bg-bone-tile px-2.5 py-1 rounded-xs">{l}</span>
            ))}
          </div>
        </div>

        {/* ideal for */}
        <div className="mb-5">
          <p className="font-spec text-[9px] tracking-widest text-ink/40 uppercase mb-2">Ideal for</p>
          <div className="flex flex-col gap-1">
            {kit.idealFor.slice(0, 3).map((use) => (
              <div key={use} className="flex items-start gap-2 text-xs text-ink/60">
                <span className="text-[--ember] mt-0.5 flex-shrink-0">–</span>
                {use}
              </div>
            ))}
          </div>
        </div>

        {/* channel note */}
        {kit.channelNote && (
          <p className="text-xs text-ink/55 border-l-2 border-[--ember]/50 pl-3 mb-5 italic leading-relaxed">{kit.channelNote}</p>
        )}

        <div className="mt-auto flex items-center gap-3">
          {!expanded ? (
            <button onClick={handleExpand}
              className="text-xs font-spec tracking-wider text-ink/55 hover:text-ink border border-bone-line hover:border-[--ink]/25 px-3 py-2 rounded-xs transition-colors">
              What's included ↓
            </button>
          ) : (
            <span className="text-xs text-ink/30 font-spec tracking-wider">Details open ↓</span>
          )}
          <button onClick={() => { onRegister(kit.id); handleExpand(); }}
            className="ml-auto bg-[--ember] hover:bg-[--ember-deep] text-ink font-display text-xs tracking-wider uppercase px-4 py-2 rounded-xs transition-colors">
            Join waitlist
          </button>
        </div>
      </div>

      {/* ── expandable detail ── */}
      {expanded && (
        <div ref={detailRef} className="border-t border-bone-line">

          {/* difficulty banner */}
          <div className="px-5 py-4 bg-bone-tile flex items-start gap-4 border-b border-bone-line">
            <div className="flex-shrink-0 w-20 text-center">
              <p className="font-display text-base text-[--ember]">{kit.difficulty}</p>
              <p className="font-spec text-[8px] tracking-widest text-ink/40 uppercase mt-0.5">Install</p>
            </div>
            <p className="text-sm text-ink/60 leading-relaxed border-l border-bone-line pl-4">{kit.difficultyDetail}</p>
          </div>

          {/* tabs */}
          <div className="px-5 pt-5">
            <div className="flex gap-1 mb-5">
              {(["contents", "install"] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 text-xs font-spec tracking-wider uppercase rounded-xs transition-colors ${activeTab === tab ? chipOn : chipOff}`}>
                  {tab === "contents" ? "What's in the kit" : "How it installs"}
                </button>
              ))}
            </div>

            {activeTab === "contents" && (
              <div className="space-y-2 pb-5">
                {kit.kitContents.map((item) => (
                  <div key={item.label} className="flex items-start gap-3 p-3.5 bg-bone-tile rounded-xs border border-bone-line">
                    <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[--ember] mt-2" />
                    <div>
                      <p className="text-sm text-ink font-display mb-0.5">{item.label}</p>
                      <p className="text-xs text-ink/55 leading-relaxed">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "install" && (
              <div className="pb-5">
                {kit.howItInstalls.map((step, i) => (
                  <div key={step.step} className={`flex gap-4 py-4 ${i < kit.howItInstalls.length - 1 ? "border-b border-bone-line" : ""}`}>
                    <div className="flex-shrink-0 w-7 h-7 rounded-full border border-[--ember]/50 bg-[--ember]/8 flex items-center justify-center mt-0.5">
                      <span className="font-spec text-[10px] text-[--ember]">{i + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm text-ink font-display mb-1">{step.step}</p>
                      <p className="text-xs text-ink/55 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* inline form */}
          <div className="px-5 pb-6 border-t border-bone-line">
            <p className="font-spec text-[9px] tracking-widest text-ink/40 uppercase py-4">Register your interest</p>
            <WaitlistForm preselectedKit={kit.id} />
          </div>

          <div className="px-5 pb-4">
            <button onClick={() => setExpanded(false)} className="text-xs text-ink/30 hover:text-ink/60 transition-colors">↑ Collapse</button>
          </div>
        </div>
      )}
    </article>
  );
}

/* ------------------------------------------------------------------ page */
export default function DiyKitsPage() {
  const [activeWaitlistKit, setActiveWaitlistKit] = useState<KitId | null>(null);
  const bottomFormRef = useRef<HTMLElement>(null);

  function scrollToBottom(id?: KitId) {
    if (id) setActiveWaitlistKit(id);
    bottomFormRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-bone text-ink">

      {/* ── nav — stays dark so it reads over the hero photo ── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[--ink]/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-display text-sm tracking-[0.25em] text-[--bone] hover:text-[--ember] transition-colors">
            ORENARA
          </Link>
          <button onClick={() => scrollToBottom()}
            className="font-spec text-[9px] tracking-widest uppercase text-[--ember] border border-[--ember]/40 hover:border-[--ember] px-3 py-1.5 rounded-xs transition-colors">
            Join waitlist
          </button>
        </div>
      </header>

      {/* ── hero — dark photographic, unchanged ── */}
      <section className="relative min-h-screen flex flex-col justify-end overflow-hidden pt-14">
        <div className="absolute inset-0">
          <Image src="/images/kits/kit-hero.jpg" alt="Orenara kit — box, strip, IP68 connector, driver and 240V plug"
            fill priority className="object-cover object-center" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-[--ink] via-[--ink]/60 to-[--ink]/10" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 pb-20 pt-24">
          <p className="font-spec text-xs tracking-widest text-[--ember] uppercase mb-4">SF16 DIY Kit — Launching September 2026</p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.05] mb-6 max-w-2xl text-[--bone]">
            The same submersible system.<br className="hidden sm:block" /> Now in a box you can order today.
          </h1>
          <p className="text-[--bone-dim] text-lg leading-relaxed max-w-xl mb-10">
            Factory-sealed, fully submersible IP68 strip lighting — pre-configured into ready-to-install kits.
            No electrician, no custom quote, no waiting on a design consult. Just pick your length and plug it in.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => document.getElementById("kits")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-[--ember] hover:bg-[--ember-deep] text-ink font-display tracking-wider uppercase px-8 py-3.5 rounded-xs transition-colors">
              Find your kit
            </button>
            <button onClick={() => scrollToBottom()}
              className="border border-[--bone-dim]/30 hover:border-[--bone-dim] text-[--bone] font-display tracking-wider uppercase px-8 py-3.5 rounded-xs transition-colors">
              Join the waitlist
            </button>
          </div>
          <div className="mt-16 flex flex-wrap gap-x-8 gap-y-2">
            {["IP68 Submersible", "Factory sealed", "240V plug-in", "3yr warranty"].map((t) => (
              <div key={t} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-[--ember] flex-shrink-0" />
                <span className="font-spec text-xs tracking-widest text-[--bone-dim] uppercase">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── same system pitch ── */}
      <section className="bg-bone border-t border-bone-line">
        <div className="max-w-6xl mx-auto px-6 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="font-spec text-xs tracking-widest text-[--ember] uppercase mb-4">Same system. Different way to buy it.</p>
              <h2 className="font-display text-3xl sm:text-4xl leading-tight text-ink mb-6">
                Everything we put in a custom-quoted system, pre-packaged.
              </h2>
              <p className="text-ink/65 leading-relaxed mb-4">
                Everything that makes our supply-only systems hold up underwater — the sealed silicone strip,
                the factory-moulded connectors, the tested-before-dispatch process — is exactly the same here.
                What's different is how you get it: instead of a custom quote built around your exact site,
                you choose from a set of ready-made lengths and configurations, and it arrives ready to install.
              </p>
              <p className="text-ink/65 leading-relaxed">
                No electrician required. Every kit ships with a standard Australian plug — you're not
                hard-wiring anything, just running it into an existing power point and screwing down the channel.
              </p>
            </div>
            <div className="relative aspect-[4/3] rounded-xs overflow-hidden border border-bone-line">
              <Image src="/images/kits/kit-connector.jpg" alt="IP68 rated connector — factory moulded onto the strip"
                fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[--ink] to-transparent p-5">
                <p className="font-spec text-[9px] tracking-widest text-[--ember] uppercase mb-1">IP68 factory-moulded connector</p>
                <p className="text-sm text-[--bone-dim]">Sealed at the factory. Pressure-tested before dispatch. Nothing for you to assemble.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── kit gallery ── */}
      <section id="kits" className="bg-bone border-t border-bone-line">
        <div className="max-w-6xl mx-auto px-6 py-20 lg:py-28">
          <div className="mb-12">
            <p className="font-spec text-xs tracking-widest text-[--ember] uppercase mb-3">Find your kit</p>
            <h2 className="font-display text-3xl sm:text-4xl leading-tight text-ink">Four kits. One system.</h2>
            <p className="text-ink/60 mt-3 max-w-xl leading-relaxed">
              Every kit uses the same IP68 SF16 strip. The difference is the channel, the lengths, and how
              it's configured for where it's going. Click any kit to see exactly what's in the box.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {KITS.map((k) => (
              <KitCard key={k.id} kit={k} onRegister={(id) => setActiveWaitlistKit(id)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── inside the box ── */}
      <section className="bg-bone-card border-t border-bone-line">
        <div className="max-w-6xl mx-auto px-6 py-16 lg:py-24">
          <div className="mb-10">
            <p className="font-spec text-xs tracking-widest text-[--ember] uppercase mb-3">Inside the box</p>
            <h2 className="font-display text-2xl sm:text-3xl text-ink">Everything you need. Nothing you don't.</h2>
            <p className="text-ink/60 mt-2 max-w-lg text-sm leading-relaxed">
              Every kit ships complete. Pick a length, plug it in — that's all there is to it.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BOX_ITEMS.map((item) => (
              <div key={item.label} className="rounded-xs border border-bone-line bg-bone-tile p-5 flex items-start gap-4">
                <div className="flex-shrink-0 mt-0.5 w-10 h-10 rounded-xs border border-[--ember]/25 bg-[--ember]/8 flex items-center justify-center">
                  <span className="font-spec text-[8px] tracking-wider text-[--ember] uppercase text-center leading-none">{item.tag}</span>
                </div>
                <div>
                  <p className="font-display text-sm text-ink mb-1">{item.label}</p>
                  <p className="text-xs text-ink/60 leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* control options */}
          <div className="mt-8 rounded-xs border border-bone-line bg-bone-tile p-6 lg:p-8">
            <p className="font-spec text-xs tracking-widest text-[--ember] uppercase mb-3">Control options</p>
            <h3 className="font-display text-xl text-ink mb-5">Choose how you want it to work.</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-bone-card border border-bone-line rounded-xs p-5">
                <p className="font-display text-sm text-ink mb-1.5">Always on</p>
                <p className="text-xs text-ink/60 leading-relaxed">Plug in, it's on. No switches, no setup. Use any timer or smart plug to schedule it.</p>
              </div>
              <div className="bg-bone-card border border-bone-line rounded-xs p-5">
                <p className="font-display text-sm text-ink mb-1.5">Wall dimmer</p>
                <p className="text-xs text-ink/60 leading-relaxed">Manual brightness via a standard trailing-edge dimmer switch. No app, no pairing — dial it up or down.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── trust ── */}
      <section className="bg-bone border-t border-bone-line">
        <div className="max-w-6xl mx-auto px-6 py-16 lg:py-24">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <p className="font-spec text-xs tracking-widest text-[--ember] uppercase mb-4">Why it's still an Orenara system</p>
              <h2 className="font-display text-2xl sm:text-3xl text-ink mb-6">DIY doesn't mean lower-grade.</h2>
              <p className="text-ink/65 leading-relaxed mb-8">
                A DIY kit doesn't mean a lower-grade product. Every connection is still factory-sealed before
                it leaves us — there's nothing for you to waterproof yourself. You're doing the screwing-down
                and the plugging-in; we've already done the sealing.
              </p>
              <div className="space-y-4 mb-8">
                {TRUST_POINTS.map((point) => (
                  <div key={point.label} className="flex items-start gap-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-[--ember] flex-shrink-0 mt-2" />
                    <div>
                      <p className="text-sm text-ink font-display mb-0.5">{point.label}</p>
                      <p className="text-xs text-ink/55 leading-relaxed">{point.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {["IP68", "IP67 driver", "3yr warranty", "LM-80", "UV resistant"].map((badge) => (
                  <span key={badge} className="font-spec text-[9px] tracking-widest uppercase border border-bone-line bg-bone-card px-3 py-1.5 text-ink/55 rounded-xs">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-10 lg:mt-0 grid grid-cols-2 gap-3">
              {[
                { src: "/images/gallery/orenara-travertine-pool-edge.webp", alt: "Pool edge installation" },
                { src: "/images/gallery/orenara-travertine-steps-pool.webp", alt: "Travertine stair lighting" },
                { src: "/images/gallery/orenara-curved-path-pool-dusk.webp", alt: "Curved path lighting" },
                { src: "/images/gallery/orenara-courtyard-patio.webp", alt: "Courtyard patio lighting" },
              ].map((img, i) => (
                <div key={img.alt} className={`relative aspect-square rounded-xs overflow-hidden border border-bone-line ${i % 2 === 1 ? "mt-6" : ""}`}>
                  <Image src={img.src} alt={img.alt} fill className="object-cover img-treated" sizes="300px" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── bottom waitlist form ── */}
      <section ref={bottomFormRef as React.RefObject<HTMLElement>} id="waitlist" className="bg-bone-card border-t border-bone-line">
        <div className="max-w-2xl mx-auto px-6 py-20">
          <div className="text-center mb-10">
            <p className="font-spec text-xs tracking-widest text-[--ember] uppercase mb-3">Register</p>
            <h2 className="font-display text-3xl text-ink mb-3">Get notified when kits go live.</h2>
            <p className="text-ink/60 leading-relaxed">
              And help us get the price right — your two pricing numbers directly shape how we launch.
            </p>
          </div>
          <WaitlistForm preselectedKit={activeWaitlistKit} />
        </div>
      </section>

      {/* ── footer ── */}
      <footer className="bg-bone-tile border-t border-bone-line">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <Link href="/" className="font-display text-sm tracking-[0.25em] text-ink/50 hover:text-ink transition-colors">ORENARA</Link>
          <div className="text-xs text-ink/40 max-w-sm text-left sm:text-right">
            Supply only — you install it yourself, following the included guide. No payment is taken at registration.
            Kits are not yet available; this is a pre-launch waitlist.
          </div>
        </div>
      </footer>
    </div>
  );
}
