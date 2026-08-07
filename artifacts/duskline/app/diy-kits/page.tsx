"use client";

import React, { useState, useRef, useId } from "react";
import Image from "next/image";
import Link from "next/link";
import { KITS, BOX_ITEMS, TRUST_POINTS, KitId, KitDef } from "../../lib/diy-kits-data";

/* ------------------------------------------------------------------ types */
type FormState = "idle" | "submitting" | "success" | "error";
type Control = "fixed" | "dimmer";

/* ------------------------------------------------------------------ shared input styles */
const inputCls =
  "w-full bg-bone-tile border border-bone-line text-ink rounded-xs px-3 py-2.5 text-sm placeholder:text-ink/35 focus:outline-none focus:border-[--ember] transition-colors";

/* ------------------------------------------------------------------ Select */
function Select({
  id,
  value,
  onChange,
  required,
  children,
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  children: React.ReactNode;
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
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink/50">
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path
            d="M1 1l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ form */
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
  const [formState, setFormState] = useState<FormState>("idle");
  const [error, setError] = useState("");

  React.useEffect(() => {
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
    setFormState("submitting");
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
        setFormState("success");
        if (
          typeof window !== "undefined" &&
          (window as Window & { gtag?: Function }).gtag
        ) {
          (window as Window & { gtag?: Function }).gtag!("event", "diy_kit_waitlist", {
            kit_name: selectedKitDef?.name ?? kit,
          });
        }
        onSuccess?.();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(
          (data as { error?: string }).error ||
            "Something went wrong — please try again."
        );
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
            <path
              d="M4 10l4 4 8-8"
              stroke="#D9A05B"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="font-display text-lg text-ink mb-2">You're on the list.</p>
        <p className="text-ink/60 text-sm leading-relaxed max-w-xs mx-auto">
          We'll email you the moment kits go live — likely September 2026. No
          payment has been taken.
        </p>
      </div>
    );
  }

  const labelCls =
    "block text-[9px] font-spec tracking-widest text-ink/45 uppercase mb-2";
  const chipBase =
    "px-3 py-1.5 text-sm font-spec border rounded-xs transition-colors";
  const chipOn = "bg-[--ember] border-[--ember] text-ink";
  const chipOff =
    "bg-transparent border-bone-line text-ink/60 hover:border-[--ink]/30";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* kit */}
      <div>
        <label htmlFor={`${formId}-kit`} className={labelCls}>
          Which kit?
        </label>
        <Select
          id={`${formId}-kit`}
          value={kit}
          onChange={(v) => {
            setKit(v);
            setLengths([]);
          }}
          required
        >
          <option value="">Select a kit…</option>
          {KITS.map((k) => (
            <option key={k.id} value={k.id}>
              {k.name}
            </option>
          ))}
        </Select>
      </div>

      {/* lengths */}
      {selectedKitDef && (
        <div>
          <p className={labelCls}>Lengths you're interested in</p>
          <div className="flex flex-wrap gap-2">
            {selectedKitDef.lengths.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => toggleLength(l)}
                className={`${chipBase} ${
                  lengths.includes(l) ? chipOn : chipOff
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
        <p className={labelCls}>Control preference</p>
        <div className="flex gap-2">
          {(["fixed", "dimmer"] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setControl(c)}
              className={`flex-1 py-2 text-sm font-spec border rounded-xs transition-colors ${
                control === c ? chipOn : chipOff
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
          <label htmlFor={`${formId}-name`} className={labelCls}>
            Name
          </label>
          <input
            id={`${formId}-name`}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Your name"
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor={`${formId}-email`} className={labelCls}>
            Email
          </label>
          <input
            id={`${formId}-email`}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className={inputCls}
          />
        </div>
      </div>

      {/* phone + metres */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${formId}-phone`} className={labelCls}>
            Phone{" "}
            <span className="normal-case tracking-normal font-body opacity-60">
              (optional)
            </span>
          </label>
          <input
            id={`${formId}-phone`}
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="04xx xxx xxx"
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor={`${formId}-metres`} className={labelCls}>
            Roughly how many metres?{" "}
            <span className="normal-case tracking-normal font-body opacity-60">
              (optional)
            </span>
          </label>
          <input
            id={`${formId}-metres`}
            type="number"
            min="1"
            max="100"
            value={metres}
            onChange={(e) => setMetres(e.target.value)}
            placeholder="e.g. 8"
            className={inputCls}
          />
        </div>
      </div>

      {/* pricing */}
      <div>
        <p className={labelCls}>Help us price it right</p>
        <p className="text-xs text-ink/45 mb-3">
          These two numbers directly shape how we launch pricing — your input
          counts.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor={`${formId}-price1`}
              className="block text-xs text-ink/55 mb-1.5"
            >
              What would you expect to pay for a kit like this?
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/45 text-sm">
                $
              </span>
              <input
                id={`${formId}-price1`}
                type="number"
                min="0"
                value={priceSensible}
                onChange={(e) => setPriceSensible(e.target.value)}
                placeholder="e.g. 450"
                className={`${inputCls} pl-7`}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor={`${formId}-price2`}
              className="block text-xs text-ink/55 mb-1.5"
            >
              At what price would this be too expensive?
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/45 text-sm">
                $
              </span>
              <input
                id={`${formId}-price2`}
                type="number"
                min="0"
                value={priceTooMuch}
                onChange={(e) => setPriceTooMuch(e.target.value)}
                placeholder="e.g. 750"
                className={`${inputCls} pl-7`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* installer */}
      <div>
        <label htmlFor={`${formId}-installer`} className={labelCls}>
          Are you installing yourself or hiring someone?
        </label>
        <Select
          id={`${formId}-installer`}
          value={installer}
          onChange={setInstaller}
          required
        >
          <option value="">Select…</option>
          <option value="self">Installing it myself</option>
          <option value="electrician-hiring">Hiring an electrician</option>
          <option value="electrician-am">I am a licensed electrician</option>
          <option value="builder">Builder / trades</option>
        </Select>
      </div>

      {error && (
        <p className="text-sm text-red-600 border border-red-200 bg-red-50 px-3 py-2 rounded-xs">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={formState === "submitting"}
        className="w-full bg-[--ember] hover:bg-[--ember-deep] text-ink font-display text-sm tracking-wider uppercase py-3.5 rounded-xs transition-colors disabled:opacity-50"
      >
        {formState === "submitting" ? "Sending…" : "Notify me when it's ready"}
      </button>
      <p className="text-xs text-center text-ink/35">
        No payment taken — registration only.
      </p>
    </form>
  );
}

/* ------------------------------------------------------------------ kit card */
function KitCard({
  kit,
  onRegister,
}: {
  kit: KitDef;
  onRegister: (id: KitId) => void;
}) {
  return (
    <article className="border border-bone-line rounded-xs overflow-hidden bg-bone-card flex flex-col group">
      {/* image — links to detail page */}
      <Link href={`/diy-kits/${kit.id}`} className="relative w-full aspect-[16/10] overflow-hidden block">
        <Image
          src={kit.image}
          alt={kit.application}
          fill
          className="object-cover img-treated transition-transform duration-700 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[--ink]/30 to-transparent" />
        {/* channel badge */}
        <div className="absolute top-3 right-3 bg-[--ink]/75 backdrop-blur-sm border border-white/10 px-2.5 py-1.5 rounded-xs">
          <span className="font-spec text-[9px] tracking-[0.15em] text-[--bone] uppercase">
            {kit.channelBadge}
          </span>
        </div>
        {/* tagline at bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
          <p className="font-spec text-[9px] tracking-[0.15em] text-[--ember] uppercase">
            {kit.tagline}
          </p>
        </div>
      </Link>

      {/* card body */}
      <div className="p-5 flex flex-col flex-1">
        {/* title — below image, never clipped */}
        <h3 className="font-display text-2xl text-ink mb-1.5 leading-tight tracking-tight">
          {kit.name}
        </h3>
        <p className="text-sm text-ink/60 leading-relaxed mb-5">
          {kit.application}
        </p>

        {/* lengths */}
        <div className="mb-4">
          <p className="font-spec text-[9px] tracking-widest text-ink/40 uppercase mb-2">
            Available lengths
          </p>
          <div className="flex flex-wrap gap-1.5">
            {kit.lengths.map((l) => (
              <Link
                key={l}
                href={`/diy-kits/${kit.id}?length=${l}`}
                className="font-spec text-xs text-ink/65 border border-bone-line bg-bone-tile hover:border-[--ember]/50 hover:text-ink px-2.5 py-1 rounded-xs transition-colors"
              >
                {l}
              </Link>
            ))}
          </div>
        </div>

        {/* ideal for */}
        <div className="mb-4">
          <p className="font-spec text-[9px] tracking-widest text-ink/40 uppercase mb-2">
            Ideal for
          </p>
          <div className="flex flex-col gap-1">
            {kit.idealFor.slice(0, 3).map((use) => (
              <div
                key={use}
                className="flex items-start gap-2 text-xs text-ink/60"
              >
                <span className="text-[--ember] mt-0.5 flex-shrink-0">–</span>
                {use}
              </div>
            ))}
          </div>
        </div>

        {/* colour options badge row (pool only) */}
        {kit.colorOptions && (
          <div className="mb-4">
            <p className="font-spec text-[9px] tracking-widest text-ink/40 uppercase mb-2">
              Colour options
            </p>
            <div className="flex flex-wrap gap-1.5">
              {kit.colorOptions.map((c) => (
                <span
                  key={c.name}
                  className="font-spec text-[10px] text-ink/60 border border-bone-line bg-bone-tile px-2.5 py-1 rounded-xs"
                >
                  {c.name}
                  {c.cct && (
                    <span className="opacity-55 ml-1">{c.cct}</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* channel note */}
        {kit.channelNote && (
          <p className="text-xs text-ink/55 border-l-2 border-[--ember]/50 pl-3 mb-4 italic leading-relaxed">
            {kit.channelNote}
          </p>
        )}

        {/* actions */}
        <div className="mt-auto pt-4 border-t border-bone-line space-y-2">
          <button
            onClick={() => onRegister(kit.id)}
            className="w-full bg-[--ember] hover:bg-[--ember-deep] text-ink font-display text-sm tracking-widest uppercase py-3 rounded-xs transition-colors"
          >
            Join waitlist
          </button>
          <Link
            href={`/diy-kits/${kit.id}`}
            className="block w-full text-center text-xs font-spec tracking-wider text-ink/45 hover:text-ink py-1.5 transition-colors"
          >
            See what's in the kit →
          </Link>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ page */
export default function DiyKitsPage() {
  const [activeWaitlistKit, setActiveWaitlistKit] = useState<KitId | null>(
    null
  );
  const bottomFormRef = useRef<HTMLElement>(null);

  function scrollToBottom(id?: KitId) {
    if (id) setActiveWaitlistKit(id);
    bottomFormRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-bone text-ink">
      {/* ── nav — solid black, inline style guarantees it overrides Tailwind v4 theme ── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/8" style={{ backgroundColor: '#0F1113' }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="font-display text-sm tracking-[0.25em] text-[--bone] hover:text-[--ember] transition-colors"
          >
            ORENARA
          </Link>
          <button
            onClick={() => scrollToBottom()}
            className="font-spec text-[9px] tracking-widest uppercase text-[--ember] border border-[--ember]/40 hover:border-[--ember] px-3 py-1.5 rounded-xs transition-colors"
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
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.05] mb-6 max-w-2xl text-[--bone]">
            The same submersible system.
            <br className="hidden sm:block" /> Now in a box you can order
            today.
          </h1>
          <p className="text-[--bone-dim] text-lg leading-relaxed max-w-xl mb-10">
            Factory-sealed, fully submersible IP68 strip lighting —
            pre-configured into ready-to-install kits. No electrician, no
            custom quote, no waiting on a design consult. Just pick your length
            and plug it in.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() =>
                document
                  .getElementById("kits")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="bg-[--ember] hover:bg-[--ember-deep] text-ink font-display tracking-wider uppercase px-8 py-3.5 rounded-xs transition-colors"
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
          <div className="mt-16 flex flex-wrap gap-x-8 gap-y-2">
            {["IP68 Submersible", "Factory sealed", "240V plug-in", "3yr warranty"].map(
              (t) => (
                <div key={t} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[--ember] flex-shrink-0" />
                  <span className="font-spec text-xs tracking-widest text-[--bone-dim] uppercase">
                    {t}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ── same system pitch ── */}
      <section className="bg-bone border-t border-bone-line">
        <div className="max-w-6xl mx-auto px-6 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="font-spec text-xs tracking-widest text-[--ember] uppercase mb-4">
                Same system. Different way to buy it.
              </p>
              <h2 className="font-display text-3xl sm:text-4xl leading-tight text-ink mb-6">
                Everything we put in a custom-quoted system, pre-packaged.
              </h2>
              <p className="text-ink/65 leading-relaxed mb-4">
                Everything that makes our supply-only systems hold up underwater
                — the sealed silicone strip, the factory-moulded connectors, the
                tested-before-dispatch process — is exactly the same here.
                What's different is how you get it: instead of a custom quote
                built around your exact site, you choose from a set of
                ready-made lengths and configurations, and it arrives ready to
                install.
              </p>
              <p className="text-ink/65 leading-relaxed">
                No electrician required. Every kit ships with a standard
                Australian plug — you're not hard-wiring anything, just running
                it into an existing power point and screwing down the channel.
              </p>
            </div>
            <div className="relative aspect-[4/3] rounded-xs overflow-hidden border border-bone-line">
              <Image
                src="/images/kits/kit-connector.jpg"
                alt="IP68 rated connector — factory moulded onto the strip"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[--ink] to-transparent p-5">
                <p className="font-spec text-[9px] tracking-widest text-[--ember] uppercase mb-1">
                  IP68 factory-moulded connector
                </p>
                <p className="text-sm text-[--bone-dim]">
                  Sealed at the factory. Pressure-tested before dispatch.
                  Nothing for you to assemble.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── kit gallery ── */}
      <section id="kits" className="bg-bone border-t border-bone-line">
        <div className="max-w-6xl mx-auto px-6 py-20 lg:py-28">
          <div className="mb-12">
            <p className="font-spec text-xs tracking-widest text-[--ember] uppercase mb-3">
              Find your kit
            </p>
            <h2 className="font-display text-3xl sm:text-4xl leading-tight text-ink">
              Four kits. One system.
            </h2>
            <p className="text-ink/60 mt-3 max-w-xl leading-relaxed">
              Every kit uses the same IP68 SF16 strip. The difference is the
              channel, the lengths, and how it's configured for where it's
              going. Click any kit to see exactly what's in the box.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {KITS.map((k) => (
              <KitCard
                key={k.id}
                kit={k}
                onRegister={(id) => scrollToBottom(id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── inside the box ── */}
      <section className="bg-bone-card border-t border-bone-line">
        <div className="max-w-6xl mx-auto px-6 py-16 lg:py-24">
          <div className="mb-10">
            <p className="font-spec text-xs tracking-widest text-[--ember] uppercase mb-3">
              Inside the box
            </p>
            <h2 className="font-display text-2xl sm:text-3xl text-ink">
              Everything you need. Nothing you don't.
            </h2>
            <p className="text-ink/60 mt-2 max-w-lg text-sm leading-relaxed">
              Every kit ships complete. Pick a length, plug it in — that's all
              there is to it.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BOX_ITEMS.map((item) => (
              <div
                key={item.label}
                className="rounded-xs border border-bone-line bg-bone-tile p-5 flex items-start gap-4"
              >
                <div className="flex-shrink-0 mt-0.5 w-10 h-10 rounded-xs border border-[--ember]/25 bg-[--ember]/8 flex items-center justify-center">
                  <span className="font-spec text-[8px] tracking-wider text-[--ember] uppercase text-center leading-none">
                    {item.tag}
                  </span>
                </div>
                <div>
                  <p className="font-display text-sm text-ink mb-1">
                    {item.label}
                  </p>
                  <p className="text-xs text-ink/60 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* control options */}
          <div className="mt-8 rounded-xs border border-bone-line bg-bone-tile p-6 lg:p-8">
            <p className="font-spec text-xs tracking-widest text-[--ember] uppercase mb-3">
              Control options
            </p>
            <h3 className="font-display text-xl text-ink mb-5">
              Choose how you want it to work.
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-bone-card border border-bone-line rounded-xs p-5">
                <p className="font-display text-sm text-ink mb-1.5">
                  Always on
                </p>
                <p className="text-xs text-ink/60 leading-relaxed">
                  Plug in, it's on. No switches, no setup. Use any timer or
                  smart plug to schedule it.
                </p>
              </div>
              <div className="bg-bone-card border border-bone-line rounded-xs p-5">
                <p className="font-display text-sm text-ink mb-1.5">
                  Wall dimmer
                </p>
                <p className="text-xs text-ink/60 leading-relaxed">
                  Manual brightness via a standard trailing-edge dimmer switch.
                  No app, no pairing — dial it up or down.
                </p>
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
              <p className="font-spec text-xs tracking-widest text-[--ember] uppercase mb-4">
                Why it's still an Orenara system
              </p>
              <h2 className="font-display text-2xl sm:text-3xl text-ink mb-6">
                DIY doesn't mean lower-grade.
              </h2>
              <p className="text-ink/65 leading-relaxed mb-8">
                A DIY kit doesn't mean a lower-grade product. Every connection
                is still factory-sealed before it leaves us — there's nothing
                for you to waterproof yourself. You're doing the screwing-down
                and the plugging-in; we've already done the sealing.
              </p>
              <div className="space-y-4 mb-8">
                {TRUST_POINTS.map((point) => (
                  <div key={point.label} className="flex items-start gap-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-[--ember] flex-shrink-0 mt-2" />
                    <div>
                      <p className="text-sm text-ink font-display mb-0.5">
                        {point.label}
                      </p>
                      <p className="text-xs text-ink/55 leading-relaxed">
                        {point.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {["IP68", "IP67 driver", "3yr warranty", "LM-80", "UV resistant"].map(
                  (badge) => (
                    <span
                      key={badge}
                      className="font-spec text-[9px] tracking-widest uppercase border border-bone-line bg-bone-card px-3 py-1.5 text-ink/55 rounded-xs"
                    >
                      {badge}
                    </span>
                  )
                )}
              </div>
            </div>
            <div className="mt-10 lg:mt-0 grid grid-cols-2 gap-3">
              {[
                {
                  src: "/images/gallery/orenara-travertine-pool-edge.webp",
                  alt: "Pool edge installation",
                },
                {
                  src: "/images/gallery/orenara-travertine-steps-pool.webp",
                  alt: "Travertine stair lighting",
                },
                {
                  src: "/images/gallery/orenara-curved-path-pool-dusk.webp",
                  alt: "Curved path lighting",
                },
                {
                  src: "/images/gallery/orenara-courtyard-patio.webp",
                  alt: "Courtyard patio lighting",
                },
              ].map((img, i) => (
                <div
                  key={img.alt}
                  className={`relative aspect-square rounded-xs overflow-hidden border border-bone-line ${
                    i % 2 === 1 ? "mt-6" : ""
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover img-treated"
                    sizes="300px"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── bottom waitlist form ── */}
      <section
        ref={bottomFormRef as React.RefObject<HTMLElement>}
        id="waitlist"
        className="bg-bone-card border-t border-bone-line"
      >
        <div className="max-w-2xl mx-auto px-6 py-20">
          <div className="text-center mb-10">
            <p className="font-spec text-xs tracking-widest text-[--ember] uppercase mb-3">
              Register
            </p>
            <h2 className="font-display text-3xl text-ink mb-3">
              Get notified when kits go live.
            </h2>
            <p className="text-ink/60 leading-relaxed">
              And help us get the price right — your two pricing numbers
              directly shape how we launch.
            </p>
          </div>
          <WaitlistForm preselectedKit={activeWaitlistKit} />
        </div>
      </section>

      {/* ── footer ── */}
      <footer className="bg-bone-tile border-t border-bone-line">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <Link
            href="/"
            className="font-display text-sm tracking-[0.25em] text-ink/50 hover:text-ink transition-colors"
          >
            ORENARA
          </Link>
          <div className="text-xs text-ink/40 max-w-sm text-left sm:text-right">
            Supply only — you install it yourself, following the included guide.
            No payment is taken at registration. Kits are not yet available;
            this is a pre-launch waitlist.
          </div>
        </div>
      </footer>
    </div>
  );
}
