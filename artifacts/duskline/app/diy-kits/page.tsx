"use client";

import React, { useState, useRef, useEffect, useId } from "react";
import Image from "next/image";
import Link from "next/link";

/* ------------------------------------------------------------------ types */
type KitId = "pool" | "stair" | "patio" | "path";
type FormState = "idle" | "submitting" | "success" | "error";
type Control = "fixed" | "dimmer";

interface KitDef {
  id: KitId;
  name: string;
  tagline: string;
  application: string;
  channel: string;
  channelNote?: string;
  lengths: string[];
  image: string;
  ctaLabel: string;
}

/* ------------------------------------------------------------------ data */
const KITS: KitDef[] = [
  {
    id: "pool",
    name: "Pool Surround Kit",
    tagline: "Pool coping & pond edges",
    application: "Permanent submersion, tile-flush coping, lap-pool edges",
    channel: "Stainless 316L",
    channelNote: "Stainless channel included — not aluminium. The only right choice for pool water.",
    lengths: ["3m", "5m", "8m", "10m"],
    image: "/images/gallery/orenara-curved-travertine-pool.webp",
    ctaLabel: "Register for Pool Kit",
  },
  {
    id: "stair",
    name: "Stair Kit",
    tagline: "Step edges & stair nosing",
    application: "Internal and external stairs, step nosing, deck treads",
    channel: "Aluminium",
    lengths: ["2m", "3m", "5m"],
    image: "/images/gallery/orenara-step-edge-night.webp",
    ctaLabel: "Register for Stair Kit",
  },
  {
    id: "patio",
    name: "Patio Kit",
    tagline: "Deck edges & patio perimeter",
    application: "Alfresco perimeter, deck edge, pergola fascia, BBQ surrounds",
    channel: "Aluminium",
    lengths: ["3m", "5m", "8m", "10m"],
    image: "/images/gallery/orenara-courtyard-patio.webp",
    ctaLabel: "Register for Patio Kit",
  },
  {
    id: "path",
    name: "Path Kit",
    tagline: "Garden paths & walkways",
    application: "Curved garden paths, driveway edges, landscape borders",
    channel: "Flexible aluminium",
    channelNote: "Segmented aluminium channel that follows curves — no cutting required.",
    lengths: ["2m", "3m", "5m"],
    image: "/images/gallery/orenara-curved-retaining-path.webp",
    ctaLabel: "Register for Path Kit",
  },
];

const WHAT_IS_INCLUDED = [
  { icon: "◎", label: "Sealed IP68 strip", sub: "Cut & tested to your length" },
  { icon: "▭", label: "Matched channel", sub: "Aluminium or stainless, fitted" },
  { icon: "⊕", label: "Factory connectors", sub: "Moulded on, nothing to assemble" },
  { icon: "⬡", label: "Sized driver", sub: "Correct for your run, IP67 rated" },
  { icon: "⏻", label: "240V plug", sub: "Australian standard — plug & go" },
  { icon: "◼", label: "Screws + guide", sub: "Stainless fixings, one-page install" },
];

const TRUST_POINTS = [
  "IP68 submersible — rated for permanent immersion",
  "Factory-sealed connectors — pressure-tested before dispatch",
  "No field termination — there is nothing for you to waterproof",
  "Same strip, same connectors, same channel as our custom-quoted systems",
];

/* ------------------------------------------------------------------ form component */
function WaitlistForm({
  preselectedKit,
  onSuccess,
}: {
  preselectedKit: KitId | null;
  onSuccess?: () => void;
}) {
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
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");

  // keep kit in sync when parent changes preselectedKit
  useEffect(() => {
    if (preselectedKit) setKit(preselectedKit);
  }, [preselectedKit]);

  const selectedKitDef = KITS.find((k) => k.id === kit);

  function toggleLength(l: string) {
    setLengths((prev) =>
      prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("submitting");
    setError("");

    try {
      const res = await fetch("/diy-kits/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kit: selectedKitDef?.name ?? kit,
          lengths,
          name,
          email,
          phone: phone || undefined,
          metres: metres || undefined,
          priceSensible: priceSensible || undefined,
          priceTooMuch: priceTooMuch || undefined,
          installer,
        }),
      });

      if (res.ok) {
        setState("success");
        // analytics
        if (typeof window !== "undefined" && (window as Window & { gtag?: Function }).gtag) {
          (window as Window & { gtag?: Function }).gtag!("event", "diy_kit_waitlist", {
            kit_name: selectedKitDef?.name ?? kit,
          });
        }
        onSuccess?.();
      } else {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error || "Something went wrong — please try again.");
        setState("error");
      }
    } catch {
      setError("Network error — please check your connection and try again.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="py-10 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-[--ember] mb-4">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10l4 4 8-8" stroke="#D9A05B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="font-display text-lg text-[--bone] mb-2">You're on the list.</p>
        <p className="text-[--bone-dim] text-sm leading-relaxed max-w-xs mx-auto">
          We'll email you the moment kits go live — likely September 2026. No payment has been taken.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* kit selector */}
      <div>
        <label htmlFor={`${formId}-kit`} className="block text-xs font-spec tracking-widest text-[--bone-dim] uppercase mb-2">
          Which kit?
        </label>
        <select
          id={`${formId}-kit`}
          value={kit}
          onChange={(e) => { setKit(e.target.value); setLengths([]); }}
          required
          className="w-full bg-[--ink-raised] border border-[--ink-line] text-[--bone] rounded-xs px-3 py-2.5 text-sm focus:outline-none focus:border-[--ember] appearance-none"
        >
          <option value="">Select a kit…</option>
          {KITS.map((k) => (
            <option key={k.id} value={k.id}>{k.name}</option>
          ))}
        </select>
      </div>

      {/* length picker */}
      {selectedKitDef && (
        <div>
          <p className="text-xs font-spec tracking-widest text-[--bone-dim] uppercase mb-2">
            Lengths you're interested in
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedKitDef.lengths.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => toggleLength(l)}
                className={`px-3 py-1.5 text-sm font-spec border rounded-xs transition-colors ${
                  lengths.includes(l)
                    ? "bg-[--ember] border-[--ember] text-[--ink]"
                    : "bg-transparent border-[--ink-line] text-[--bone-dim] hover:border-[--bone-dim]"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* control */}
      <div>
        <p className="text-xs font-spec tracking-widest text-[--bone-dim] uppercase mb-2">Control preference</p>
        <div className="flex gap-2">
          {(["fixed", "dimmer"] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setControl(c)}
              className={`flex-1 py-2 text-sm font-spec border rounded-xs transition-colors ${
                control === c
                  ? "bg-[--ember] border-[--ember] text-[--ink]"
                  : "bg-transparent border-[--ink-line] text-[--bone-dim] hover:border-[--bone-dim]"
              }`}
            >
              {c === "fixed" ? "Always on" : "Wall dimmer"}
            </button>
          ))}
        </div>
      </div>

      {/* name + email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${formId}-name`} className="block text-xs font-spec tracking-widest text-[--bone-dim] uppercase mb-2">Name</label>
          <input
            id={`${formId}-name`}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Your name"
            className="w-full bg-[--ink-raised] border border-[--ink-line] text-[--bone] rounded-xs px-3 py-2.5 text-sm placeholder:text-[--bone-dim]/40 focus:outline-none focus:border-[--ember]"
          />
        </div>
        <div>
          <label htmlFor={`${formId}-email`} className="block text-xs font-spec tracking-widest text-[--bone-dim] uppercase mb-2">Email</label>
          <input
            id={`${formId}-email`}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="w-full bg-[--ink-raised] border border-[--ink-line] text-[--bone] rounded-xs px-3 py-2.5 text-sm placeholder:text-[--bone-dim]/40 focus:outline-none focus:border-[--ember]"
          />
        </div>
      </div>

      {/* phone + metres */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${formId}-phone`} className="block text-xs font-spec tracking-widest text-[--bone-dim] uppercase mb-2">
            Phone <span className="normal-case tracking-normal font-body text-[--bone-dim]/60">(optional)</span>
          </label>
          <input
            id={`${formId}-phone`}
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="04xx xxx xxx"
            className="w-full bg-[--ink-raised] border border-[--ink-line] text-[--bone] rounded-xs px-3 py-2.5 text-sm placeholder:text-[--bone-dim]/40 focus:outline-none focus:border-[--ember]"
          />
        </div>
        <div>
          <label htmlFor={`${formId}-metres`} className="block text-xs font-spec tracking-widest text-[--bone-dim] uppercase mb-2">
            Roughly how many metres? <span className="normal-case tracking-normal font-body text-[--bone-dim]/60">(optional)</span>
          </label>
          <input
            id={`${formId}-metres`}
            type="number"
            min="1"
            max="100"
            value={metres}
            onChange={(e) => setMetres(e.target.value)}
            placeholder="e.g. 8"
            className="w-full bg-[--ink-raised] border border-[--ink-line] text-[--bone] rounded-xs px-3 py-2.5 text-sm placeholder:text-[--bone-dim]/40 focus:outline-none focus:border-[--ember]"
          />
        </div>
      </div>

      {/* pricing signals */}
      <div>
        <p className="text-xs font-spec tracking-widest text-[--bone-dim] uppercase mb-1">Help us price it right</p>
        <p className="text-xs text-[--bone-dim]/60 mb-3">These two numbers directly shape how we launch pricing — your input counts.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${formId}-price1`} className="block text-xs text-[--bone-dim] mb-1.5">What would you expect to pay for a kit like this?</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[--bone-dim] text-sm">$</span>
              <input
                id={`${formId}-price1`}
                type="number"
                min="0"
                value={priceSensible}
                onChange={(e) => setPriceSensible(e.target.value)}
                placeholder="e.g. 450"
                className="w-full bg-[--ink-raised] border border-[--ink-line] text-[--bone] rounded-xs pl-7 pr-3 py-2.5 text-sm placeholder:text-[--bone-dim]/40 focus:outline-none focus:border-[--ember]"
              />
            </div>
          </div>
          <div>
            <label htmlFor={`${formId}-price2`} className="block text-xs text-[--bone-dim] mb-1.5">At what price would this be too expensive?</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[--bone-dim] text-sm">$</span>
              <input
                id={`${formId}-price2`}
                type="number"
                min="0"
                value={priceTooMuch}
                onChange={(e) => setPriceTooMuch(e.target.value)}
                placeholder="e.g. 750"
                className="w-full bg-[--ink-raised] border border-[--ink-line] text-[--bone] rounded-xs pl-7 pr-3 py-2.5 text-sm placeholder:text-[--bone-dim]/40 focus:outline-none focus:border-[--ember]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* installer */}
      <div>
        <label htmlFor={`${formId}-installer`} className="block text-xs font-spec tracking-widest text-[--bone-dim] uppercase mb-2">
          Are you a licensed electrician, or installing yourself?
        </label>
        <select
          id={`${formId}-installer`}
          value={installer}
          onChange={(e) => setInstaller(e.target.value)}
          required
          className="w-full bg-[--ink-raised] border border-[--ink-line] text-[--bone] rounded-xs px-3 py-2.5 text-sm focus:outline-none focus:border-[--ember] appearance-none"
        >
          <option value="">Select…</option>
          <option value="self">Installing it myself</option>
          <option value="electrician-hiring">Hiring an electrician</option>
          <option value="electrician-am">I am a licensed electrician</option>
          <option value="builder">Builder / trades</option>
        </select>
      </div>

      {error && (
        <p className="text-sm text-red-400 border border-red-400/20 bg-red-400/5 px-3 py-2 rounded-xs">{error}</p>
      )}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="w-full bg-[--ember] hover:bg-[--ember-deep] text-[--ink] font-display text-sm tracking-wider uppercase py-3.5 rounded-xs transition-colors disabled:opacity-50"
      >
        {state === "submitting" ? "Sending…" : "Notify me when it's ready"}
      </button>

      <p className="text-xs text-center text-[--bone-dim]/50">
        No payment taken — registration only.
      </p>
    </form>
  );
}

/* ------------------------------------------------------------------ kit card */
function KitCard({ kit, onRegister }: { kit: KitDef; onRegister: (id: KitId) => void }) {
  const [expanded, setExpanded] = useState(false);
  const detailRef = useRef<HTMLDivElement>(null);

  function handleExpand() {
    setExpanded(true);
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 80);
    // kit view analytics
    if (typeof window !== "undefined" && (window as Window & { gtag?: Function }).gtag) {
      (window as Window & { gtag?: Function }).gtag!("event", "diy_kit_view", { kit_name: kit.name });
    }
  }

  return (
    <article className="border border-[--ink-line] rounded-xs overflow-hidden bg-[--ink-raised] flex flex-col">
      {/* image */}
      <div className="relative w-full aspect-[16/10] overflow-hidden">
        <Image
          src={kit.image}
          alt={kit.application}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105 img-treated"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[--ink] via-transparent to-transparent opacity-70" />
        {/* channel badge */}
        <div className="absolute top-3 right-3 bg-[--ink]/80 backdrop-blur-sm border border-[--ink-line] px-2 py-1 rounded-xs">
          <span className="font-spec text-[10px] tracking-widest text-[--bone-dim] uppercase">{kit.channel}</span>
        </div>
        {/* name over image */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="font-spec text-[10px] tracking-widest text-[--ember] uppercase mb-1">{kit.tagline}</p>
          <h3 className="font-display text-xl text-[--bone] leading-tight">{kit.name}</h3>
        </div>
      </div>

      {/* card body */}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-sm text-[--bone-dim] leading-relaxed mb-4">{kit.application}</p>

        {/* lengths */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {kit.lengths.map((l) => (
            <span key={l} className="font-spec text-xs text-[--bone-dim] border border-[--ink-line] px-2 py-1 rounded-xs">
              {l}
            </span>
          ))}
        </div>

        {/* channel note */}
        {kit.channelNote && (
          <p className="text-xs text-[--bone-dim]/70 border-l-2 border-[--ember]/40 pl-3 mb-4 italic">{kit.channelNote}</p>
        )}

        <div className="mt-auto flex gap-2">
          {!expanded && (
            <button
              onClick={handleExpand}
              className="text-xs font-spec tracking-wider text-[--bone-dim] hover:text-[--bone] underline underline-offset-4 decoration-[--ink-line] hover:decoration-[--bone-dim] transition-colors mr-auto"
            >
              What's included ↓
            </button>
          )}
          <button
            onClick={() => { onRegister(kit.id); handleExpand(); }}
            className="ml-auto bg-[--ember] hover:bg-[--ember-deep] text-[--ink] font-display text-xs tracking-wider uppercase px-4 py-2 rounded-xs transition-colors"
          >
            Join waitlist
          </button>
        </div>
      </div>

      {/* expandable detail + inline form */}
      {expanded && (
        <div ref={detailRef} className="border-t border-[--ink-line] px-5 pb-6 pt-5 space-y-5">
          <div>
            <p className="font-spec text-[10px] tracking-widest text-[--bone-dim] uppercase mb-3">What's in this kit</p>
            <ul className="space-y-2">
              {WHAT_IS_INCLUDED.map((item) => (
                <li key={item.label} className="flex items-start gap-3 text-sm text-[--bone-dim]">
                  <span className="text-[--ember] mt-0.5 text-xs w-4 flex-shrink-0 text-center">{item.icon}</span>
                  <span>
                    <span className="text-[--bone]">{item.label}</span>
                    {" — "}
                    {item.sub}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-[--ink-line] pt-5">
            <p className="font-spec text-[10px] tracking-widest text-[--bone-dim] uppercase mb-4">Register your interest</p>
            <WaitlistForm preselectedKit={kit.id} />
          </div>
          <button
            onClick={() => setExpanded(false)}
            className="text-xs text-[--bone-dim]/50 hover:text-[--bone-dim] transition-colors"
          >
            ↑ Collapse
          </button>
        </div>
      )}
    </article>
  );
}

/* ------------------------------------------------------------------ page */
export default function DiyKitsPage() {
  const [activeWaitlistKit, setActiveWaitlistKit] = useState<KitId | null>(null);
  const bottomFormRef = useRef<HTMLElement>(null);

  function openWaitlist(id: KitId) {
    setActiveWaitlistKit(id);
  }

  function scrollToBottom(id?: KitId) {
    if (id) setActiveWaitlistKit(id);
    bottomFormRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-[--ink] text-[--bone]">
      {/* ── nav bar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[--ink-line] bg-[--ink]/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-display text-sm tracking-[0.25em] text-[--bone] hover:text-[--ember] transition-colors">
            ORENARA
          </Link>
          <button
            onClick={() => scrollToBottom()}
            className="font-spec text-[10px] tracking-widest uppercase text-[--ember] border border-[--ember]/40 hover:border-[--ember] px-3 py-1.5 rounded-xs transition-colors"
          >
            Join waitlist
          </button>
        </div>
      </header>

      {/* ── hero ── */}
      <section className="relative min-h-screen flex flex-col justify-end overflow-hidden pt-14">
        <div className="absolute inset-0">
          <Image
            src="/images/kits/kit-hero.jpg"
            alt="Orenara kit — box, strip, IP68 connector, driver and 240V plug"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[--ink] via-[--ink]/60 to-[--ink]/10" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pb-20 pt-24">
          <p className="font-spec text-xs tracking-widest text-[--ember] uppercase mb-4">
            SF16 DIY Kit — Launching September 2026
          </p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.05] mb-6 max-w-2xl">
            The same submersible system.<br className="hidden sm:block" /> Now in a box you can order today.
          </h1>
          <p className="text-[--bone-dim] text-lg leading-relaxed max-w-xl mb-10">
            Factory-sealed, fully submersible IP68 strip lighting — pre-configured into ready-to-install kits.
            No electrician, no custom quote, no waiting on a design consult.
            Just pick your length and plug it in.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                document.getElementById("kits")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-[--ember] hover:bg-[--ember-deep] text-[--ink] font-display tracking-wider uppercase px-8 py-3.5 rounded-xs transition-colors"
            >
              Find your kit
            </button>
            <button
              onClick={() => scrollToBottom()}
              className="border border-[--bone-dim]/30 hover:border-[--bone-dim] text-[--bone] font-display tracking-wider uppercase px-8 py-3.5 rounded-xs transition-colors"
            >
              Join the waitlist
            </button>
          </div>

          {/* IP68 trust bar */}
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
      <section className="bg-[--ink] border-t border-[--ink-line]">
        <div className="max-w-6xl mx-auto px-6 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="font-spec text-xs tracking-widest text-[--ember] uppercase mb-4">Same system. Different way to buy it.</p>
              <h2 className="font-display text-3xl sm:text-4xl leading-tight mb-6">
                Everything we put in a custom-quoted system, pre-packaged.
              </h2>
              <p className="text-[--bone-dim] leading-relaxed mb-4">
                Everything that makes our supply-only systems hold up underwater — the sealed silicone strip,
                the factory-moulded connectors, the tested-before-dispatch process — is exactly the same here.
                What's different is how you get it: instead of a custom quote built around your exact site,
                you choose from a set of ready-made lengths and configurations, and it arrives ready to install.
              </p>
              <p className="text-[--bone-dim] leading-relaxed">
                No electrician required. Every kit ships with a standard Australian plug — you're not
                hard-wiring anything, just running it into an existing power point and screwing down the channel.
              </p>
            </div>
            <div className="relative aspect-[4/3] rounded-xs overflow-hidden">
              <Image
                src="/images/kits/kit-connector.jpg"
                alt="IP68 rated connector — factory moulded onto the strip"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[--ink] to-transparent p-5">
                <p className="font-spec text-[10px] tracking-widest text-[--ember] uppercase">IP68 factory-moulded connector</p>
                <p className="text-sm text-[--bone-dim]">Sealed at the factory. Pressure-tested before dispatch. Nothing for you to assemble.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── kit gallery ── */}
      <section id="kits" className="bg-[--ink] border-t border-[--ink-line]">
        <div className="max-w-6xl mx-auto px-6 py-20 lg:py-28">
          <div className="mb-12">
            <p className="font-spec text-xs tracking-widest text-[--ember] uppercase mb-3">Find your kit</p>
            <h2 className="font-display text-3xl sm:text-4xl leading-tight">Find the kit that suits your space.</h2>
            <p className="text-[--bone-dim] mt-3 max-w-xl">
              Four application-specific kits. Every one uses the same IP68 SF16 strip — just matched to the
              channel, lengths and connection type that make sense for where it's going.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {KITS.map((k) => (
              <KitCard key={k.id} kit={k} onRegister={openWaitlist} />
            ))}
          </div>
        </div>
      </section>

      {/* ── what's in every kit ── */}
      <section className="bg-[--ink-raised] border-t border-[--ink-line]">
        <div className="max-w-6xl mx-auto px-6 py-16 lg:py-24">
          <div className="mb-10">
            <p className="font-spec text-xs tracking-widest text-[--ember] uppercase mb-3">What's in every kit</p>
            <h2 className="font-display text-2xl sm:text-3xl">Everything you need to go from box to lit.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHAT_IS_INCLUDED.map((item) => (
              <div key={item.label} className="border border-[--ink-line] p-5 rounded-xs">
                <div className="text-2xl text-[--ember] mb-3">{item.icon}</div>
                <p className="font-display text-base text-[--bone] mb-1">{item.label}</p>
                <p className="text-sm text-[--bone-dim]">{item.sub}</p>
              </div>
            ))}
          </div>

          {/* control options */}
          <div className="mt-10 border border-[--ink-line] rounded-xs p-6 lg:p-8">
            <p className="font-spec text-xs tracking-widest text-[--ember] uppercase mb-4">Control options</p>
            <h3 className="font-display text-xl mb-6">Set it and forget it.</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[--ink] border border-[--ink-line] rounded-xs p-5">
                <p className="font-display text-base text-[--bone] mb-1">Always on</p>
                <p className="text-sm text-[--bone-dim]">Plug in, it's on. No switches, no setup. Simplest option.</p>
              </div>
              <div className="bg-[--ink] border border-[--ink-line] rounded-xs p-5">
                <p className="font-display text-base text-[--bone] mb-1">Wall dimmer</p>
                <p className="text-sm text-[--bone-dim]">Manual brightness control — dial it down without an app. Works like any dimmer switch.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── trust section ── */}
      <section className="bg-[--ink] border-t border-[--ink-line]">
        <div className="max-w-6xl mx-auto px-6 py-16 lg:py-24">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <p className="font-spec text-xs tracking-widest text-[--ember] uppercase mb-4">Why it's still an Orenara system</p>
              <h2 className="font-display text-2xl sm:text-3xl mb-6">DIY doesn't mean lower-grade.</h2>
              <p className="text-[--bone-dim] leading-relaxed mb-8">
                A DIY kit doesn't mean a lower-grade product. Every connection is still factory-sealed before
                it leaves us — there's nothing for you to waterproof yourself. You're doing the screwing-down
                and the plugging-in; we've already done the sealing.
              </p>
              <ul className="space-y-3">
                {TRUST_POINTS.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm text-[--bone-dim]">
                    <span className="w-1 h-1 rounded-full bg-[--ember] flex-shrink-0 mt-2" />
                    {point}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                {["IP68", "IP67 driver", "3yr warranty", "LM-80", "UV resistant"].map((badge) => (
                  <span key={badge} className="font-spec text-xs tracking-widest uppercase border border-[--ink-line] px-3 py-1.5 text-[--bone-dim] rounded-xs">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-10 lg:mt-0 grid grid-cols-2 gap-3">
              <div className="relative aspect-square rounded-xs overflow-hidden">
                <Image src="/images/gallery/orenara-travertine-pool-edge.webp" alt="Pool edge installation" fill className="object-cover img-treated" sizes="300px" />
              </div>
              <div className="relative aspect-square rounded-xs overflow-hidden mt-6">
                <Image src="/images/gallery/orenara-curved-travertine-pool.webp" alt="Curved pool coping" fill className="object-cover img-treated" sizes="300px" />
              </div>
              <div className="relative aspect-square rounded-xs overflow-hidden">
                <Image src="/images/gallery/orenara-step-edge-night.webp" alt="Step edge lighting" fill className="object-cover img-treated" sizes="300px" />
              </div>
              <div className="relative aspect-square rounded-xs overflow-hidden mt-6">
                <Image src="/images/gallery/orenara-courtyard-patio.webp" alt="Courtyard patio" fill className="object-cover img-treated" sizes="300px" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── bottom waitlist form ── */}
      <section ref={bottomFormRef as React.RefObject<HTMLElement>} id="waitlist" className="bg-[--ink-raised] border-t border-[--ink-line]">
        <div className="max-w-2xl mx-auto px-6 py-20">
          <div className="text-center mb-10">
            <p className="font-spec text-xs tracking-widest text-[--ember] uppercase mb-3">Register</p>
            <h2 className="font-display text-3xl mb-3">Get notified when kits go live.</h2>
            <p className="text-[--bone-dim] leading-relaxed">
              And help us get the price right — your two pricing numbers directly shape how we launch.
            </p>
          </div>
          <WaitlistForm preselectedKit={activeWaitlistKit} />
        </div>
      </section>

      {/* ── page footer ── */}
      <footer className="bg-[--ink] border-t border-[--ink-line]">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <Link href="/" className="font-display text-sm tracking-[0.25em] text-[--bone-dim] hover:text-[--bone] transition-colors">
            ORENARA
          </Link>
          <div className="text-xs text-[--bone-dim]/50 max-w-sm text-left sm:text-right">
            Supply only — you install it yourself, following the included guide. No payment is taken at registration.
            Kits are not yet available; this is a pre-launch waitlist.
          </div>
        </div>
      </footer>
    </div>
  );
}
