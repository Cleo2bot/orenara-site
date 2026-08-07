"use client";

import React, { useState, useId, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, notFound } from "next/navigation";
import Wordmark from "../../../components/Wordmark";
import { KITS, KitId, KitDef } from "../../../lib/diy-kits-data";

/* ------------------------------------------------------------------ shared */
const inputCls =
  "w-full bg-bone-tile border border-bone-line text-ink rounded-xs px-3 py-2.5 text-sm placeholder:text-ink/35 focus:outline-none focus:border-ink/40 transition-colors";

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
type FormState = "idle" | "submitting" | "success" | "error";
type Control = "fixed" | "dimmer";

function WaitlistForm({ kit, initialLength }: { kit: KitDef; initialLength?: string }) {
  const formId = useId();
  const [lengths, setLengths] = useState<string[]>(
    initialLength && kit.lengths.includes(initialLength) ? [initialLength] : []
  );
  const [color, setColor] = useState<string>("");
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
          kit: kit.name,
          lengths,
          color: color || undefined,
          control,
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
            kit_name: kit.name,
          });
        }
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
      <div className="py-12 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-ink/30 mb-4">
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
  const chipOn = "bg-ink border-ink text-bone";
  const chipOff =
    "bg-transparent border-bone-line text-ink/60 hover:border-[--ink]/30";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* lengths */}
      <div>
        <p className={labelCls}>Lengths you're interested in</p>
        <div className="flex flex-wrap gap-2">
          {kit.lengths.map((l) => (
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

      {/* colour options (pool only) */}
      {kit.colorOptions && (
        <div>
          <p className={labelCls}>Colour preference</p>
          <div className="flex flex-wrap gap-2">
            {kit.colorOptions.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setColor(color === c.name ? "" : c.name)}
                className={`${chipBase} ${color === c.name ? chipOn : chipOff}`}
              >
                {c.name}
                {c.cct && (
                  <span className="ml-1 opacity-70 text-xs">{c.cct}</span>
                )}
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
        className="w-full bg-ink hover:bg-ink/80 text-bone font-display text-sm tracking-wider uppercase py-3.5 rounded-xs transition-colors disabled:opacity-50"
      >
        {formState === "submitting" ? "Sending…" : "Notify me when it's ready"}
      </button>
      <p className="text-xs text-center text-ink/35">
        No payment taken — registration only.
      </p>
    </form>
  );
}

/* ------------------------------------------------------------------ page */
export default function KitDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const kit = KITS.find((k) => k.id === params.slug);
  if (!kit) notFound();
  const searchParams = useSearchParams();
  const initialLength = searchParams.get("length") ?? undefined;

  return (
    <div className="min-h-screen bg-bone text-ink">
      {/* nav */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/8" style={{ backgroundColor: '#0F1113' }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="text-bone hover:opacity-70 transition-opacity"
            aria-label="Orenara home"
          >
            <Wordmark size="sm" />
          </Link>
          <Link
            href="/diy-kits"
            className="font-spec text-[9px] tracking-widest uppercase text-bone/60 hover:text-bone transition-colors"
          >
            ← All kits
          </Link>
        </div>
      </header>

      {/* hero image */}
      <section className="relative pt-14">
        <div className="relative w-full aspect-[21/9] overflow-hidden">
          <Image
            src={kit.image}
            alt={kit.application}
            fill
            priority
            className="object-cover img-treated"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[--ink]/70 via-[--ink]/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 max-w-6xl mx-auto px-6 pb-10">
            <div className="inline-flex items-center gap-2 bg-[--ink]/70 backdrop-blur-sm border border-white/10 px-2.5 py-1.5 rounded-xs mb-4">
              <span className="font-spec text-[9px] tracking-[0.15em] text-bone uppercase">
                {kit.channelBadge}
              </span>
            </div>
            <p className="font-spec text-xs tracking-widest text-bone/55 uppercase mb-2">
              {kit.tagline}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-bone leading-tight max-w-2xl">
              {kit.name}
            </h1>
          </div>
        </div>
      </section>

      {/* overview */}
      <section className="bg-bone border-b border-bone-line">
        <div className="max-w-6xl mx-auto px-6 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <p className="text-ink/70 text-lg leading-relaxed mb-6">
                {kit.application}
              </p>
              {kit.channelNote && (
                <p className="text-sm text-ink/50 border-l border-ink/20 pl-4 italic leading-relaxed mb-6">
                  {kit.channelNote}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="font-spec text-[9px] tracking-widest uppercase border border-bone-line bg-bone-card px-3 py-1.5 text-ink/55 rounded-xs">
                  IP68
                </span>
                <span className="font-spec text-[9px] tracking-widest uppercase border border-bone-line bg-bone-card px-3 py-1.5 text-ink/55 rounded-xs">
                  IP67 driver
                </span>
                <span className="font-spec text-[9px] tracking-widest uppercase border border-bone-line bg-bone-card px-3 py-1.5 text-ink/55 rounded-xs">
                  3yr warranty
                </span>
                <span className="font-spec text-[9px] tracking-widest uppercase border border-bone-line bg-bone-card px-3 py-1.5 text-ink/55 rounded-xs">
                  240V plug-in
                </span>
              </div>
            </div>
            <div className="space-y-4">
              {/* difficulty */}
              <div className="bg-bone-card border border-bone-line rounded-xs p-5">
                <p className="font-spec text-[9px] tracking-widest text-ink/40 uppercase mb-1">
                  Install difficulty
                </p>
                <p className="font-display text-lg text-ink mb-1">
                  {kit.difficulty}
                </p>
                <p className="text-xs text-ink/60 leading-relaxed">
                  {kit.difficultyDetail}
                </p>
              </div>
              {/* lengths */}
              <div className="bg-bone-card border border-bone-line rounded-xs p-5">
                <p className="font-spec text-[9px] tracking-widest text-ink/40 uppercase mb-3">
                  Available lengths
                </p>
                <div className="flex flex-wrap gap-2">
                  {kit.lengths.map((l) => (
                    <span
                      key={l}
                      className="font-spec text-xs text-ink/65 border border-bone-line bg-bone-tile px-3 py-1.5 rounded-xs"
                    >
                      {l}
                    </span>
                  ))}
                </div>
              </div>
              {/* colour options */}
              {kit.colorOptions && (
                <div className="bg-bone-card border border-bone-line rounded-xs p-5">
                  <p className="font-spec text-[9px] tracking-widest text-ink/40 uppercase mb-3">
                    Colour options
                  </p>
                  <div className="space-y-2">
                    {kit.colorOptions.map((c) => (
                      <div key={c.name} className="flex items-start gap-2">
                        <span className="text-ink/40 mt-0.5 flex-shrink-0 text-xs">–</span>
                        <div>
                          <span className="text-sm text-ink font-display">
                            {c.name}
                          </span>
                          {c.cct && (
                            <span className="ml-2 font-spec text-[10px] text-ink/40">
                              {c.cct}
                            </span>
                          )}
                          {c.note && (
                            <p className="text-xs text-ink/50 mt-0.5">
                              {c.note}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* what's in the kit */}
      <section className="bg-bone-card border-b border-bone-line">
        <div className="max-w-6xl mx-auto px-6 py-12 lg:py-16">
          <p className="font-spec text-xs tracking-widest text-ink/40 uppercase mb-3">
            What's in the box
          </p>
          <h2 className="font-display text-2xl sm:text-3xl text-ink mb-8">
            Everything you need. Nothing you don't.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {kit.kitContents.map((item) => (
              <div
                key={item.label}
                className="bg-bone-tile border border-bone-line rounded-xs p-5 flex items-start gap-3"
              >
                <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-ink/30 mt-2" />
                <div>
                  <p className="text-sm text-ink font-display mb-1">
                    {item.label}
                  </p>
                  <p className="text-xs text-ink/55 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* how it installs */}
      <section className="bg-bone border-b border-bone-line">
        <div className="max-w-6xl mx-auto px-6 py-12 lg:py-16">
          <p className="font-spec text-xs tracking-widest text-ink/40 uppercase mb-3">
            Installation
          </p>
          <h2 className="font-display text-2xl sm:text-3xl text-ink mb-8">
            How it installs.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-bone-line rounded-xs overflow-hidden">
            {kit.howItInstalls.map((s, i) => (
              <div
                key={s.step}
                className={`p-6 bg-bone-card ${
                  i % 2 === 0 ? "border-r border-bone-line" : ""
                } ${i < kit.howItInstalls.length - 2 ? "border-b border-bone-line" : ""}`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full border border-ink/20 bg-ink/5 flex items-center justify-center">
                    <span className="font-spec text-[11px] text-ink/40">
                      {i + 1}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-ink font-display mb-1.5">
                      {s.step}
                    </p>
                    <p className="text-xs text-ink/55 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ideal for */}
      <section className="bg-bone-card border-b border-bone-line">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <p className="font-spec text-xs tracking-widest text-ink/40 uppercase mb-3">
            Ideal for
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl">
            {kit.idealFor.map((use) => (
              <div key={use} className="flex items-start gap-2 text-sm text-ink/65">
                <span className="text-ink/40 mt-0.5 flex-shrink-0">–</span>
                {use}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* waitlist form */}
      <section className="bg-bone border-b border-bone-line">
        <div className="max-w-2xl mx-auto px-6 py-16 lg:py-20">
          <div className="text-center mb-10">
            <p className="font-spec text-xs tracking-widest text-ink/40 uppercase mb-3">
              Register
            </p>
            <h2 className="font-display text-3xl text-ink mb-3">
              Get notified when this kit goes live.
            </h2>
            <p className="text-ink/60 leading-relaxed">
              And help us get the price right — your two pricing numbers
              directly shape how we launch.
            </p>
          </div>
          <WaitlistForm kit={kit} initialLength={initialLength} />
        </div>
      </section>

      {/* footer */}
      <footer className="bg-bone-tile border-t border-bone-line">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <Link
            href="/diy-kits"
            className="font-display text-sm tracking-[0.25em] text-ink/50 hover:text-ink transition-colors"
          >
            ← Back to all kits
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
