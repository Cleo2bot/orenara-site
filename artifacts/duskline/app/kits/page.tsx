"use client";

import React, { useState, useRef, useId } from "react";
import Image from "next/image";
import Link from "next/link";
import { KITS, TRUST_POINTS, KitId, KitDef } from "../../lib/kits-data";

/* ------------------------------------------------------------------ types */
type FormState = "idle" | "submitting" | "success" | "error";

/* ------------------------------------------------------------------ shared */
const inputCls =
  "w-full bg-bone-tile border border-bone-line text-ink rounded-xs px-3 py-2.5 text-sm placeholder:text-ink/35 focus:outline-none focus:border-ink/40 transition-colors";

const labelCls =
  "block text-[9px] font-spec tracking-widest text-ink/45 uppercase mb-2";

/* ------------------------------------------------------------------ review form */
function ReviewForm({
  preselectedKit,
}: {
  preselectedKit: KitId | null;
}) {
  const formId = useId();
  const [kit, setKit] = useState<string>(preselectedKit ?? "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [suburb, setSuburb] = useState("");
  const [notes, setNotes] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (preselectedKit) setKit(preselectedKit);
  }, [preselectedKit]);

  const selectedKitDef = KITS.find((k) => k.id === kit);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormState("submitting");
    setError("");
    try {
      const res = await fetch("/kits/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kit: selectedKitDef?.name ?? kit,
          kitId: kit,
          length: "",
          name,
          email,
          phone: phone || undefined,
          suburb: suburb || undefined,
          notes: notes || undefined,
        }),
      });
      if (res.ok) {
        setFormState("success");
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
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-ink/30 mb-4">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10l4 4 8-8" stroke="#0F1113" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="font-display text-lg text-ink mb-2">We'll be in touch.</p>
        <p className="text-ink/60 text-sm leading-relaxed max-w-xs mx-auto">
          We'll review your project and come back with a system specification
          and price within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* kit */}
      <div>
        <label htmlFor={`${formId}-kit`} className={labelCls}>
          Which kit?
        </label>
        <div className="relative">
          <select
            id={`${formId}-kit`}
            value={kit}
            onChange={(e) => setKit(e.target.value)}
            required
            className={`${inputCls} appearance-none pr-8 cursor-pointer`}
          >
            <option value="">Select a category…</option>
            {KITS.map((k) => (
              <option key={k.id} value={k.id}>
                {k.name}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink/50">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${formId}-name`} className={labelCls}>Your name</label>
          <input
            id={`${formId}-name`}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            className={inputCls}
            placeholder="Full name"
          />
        </div>
        <div>
          <label htmlFor={`${formId}-suburb`} className={labelCls}>Suburb</label>
          <input
            id={`${formId}-suburb`}
            type="text"
            value={suburb}
            onChange={(e) => setSuburb(e.target.value)}
            className={inputCls}
            placeholder="e.g. Mosman"
          />
        </div>
      </div>

      <div>
        <label htmlFor={`${formId}-email`} className={labelCls}>Email</label>
        <input
          id={`${formId}-email`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className={inputCls}
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor={`${formId}-phone`} className={labelCls}>Phone (optional)</label>
        <input
          id={`${formId}-phone`}
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel"
          className={inputCls}
          placeholder="04xx xxx xxx"
        />
      </div>

      <div>
        <label htmlFor={`${formId}-notes`} className={labelCls}>Project notes (optional)</label>
        <textarea
          id={`${formId}-notes`}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className={`${inputCls} resize-none`}
          placeholder="Tell us about your space — approximate run length, application, any constraints."
        />
      </div>

      {error && (
        <p className="text-sm text-ink/70 bg-bone-card border border-bone-line rounded-xs px-4 py-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={formState === "submitting"}
        className="w-full bg-ink text-bone font-spec text-[10px] tracking-widest uppercase px-5 py-3.5 rounded-xs hover:bg-ink/90 transition-colors disabled:opacity-50"
      >
        {formState === "submitting" ? "Sending…" : "Request review"}
      </button>
      <p className="text-[10px] text-ink/35 text-center leading-relaxed">
        No payment. We'll review your project and come back with a spec and price.
      </p>
    </form>
  );
}

/* ------------------------------------------------------------------ kit card */
function KitCard({ kit }: { kit: KitDef }) {
  return (
    <div className="rounded-xs border border-bone-line bg-bone-tile overflow-hidden flex flex-col">
      <Link href={`/kits/${kit.id}`} className="relative w-full aspect-[16/10] overflow-hidden block">
        <Image
          src={kit.image}
          alt={kit.name}
          fill
          className="object-cover img-treated transition-transform duration-500 hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute top-3 left-3">
          <span className="font-spec text-[8px] tracking-widest uppercase bg-ink/70 text-bone px-2.5 py-1 rounded-xs backdrop-blur-sm">
            {kit.channelBadge}
          </span>
        </div>
      </Link>
      <div className="p-5 flex flex-col flex-1">
        <p className="font-spec text-[9px] tracking-widest text-ink/40 uppercase mb-1">
          {kit.tagline}
        </p>
        <Link href={`/kits/${kit.id}`}>
          <h3 className="font-display text-xl text-ink mb-3 hover:text-ink/70 transition-colors">
            {kit.name}
          </h3>
        </Link>
        <p className="text-sm text-ink/60 leading-relaxed mb-5 flex-1">
          {kit.application}
        </p>

        {/* length chips */}
        <div className="mb-5">
          <p className="font-spec text-[8px] tracking-widest uppercase text-ink/35 mb-2">
            Available lengths
          </p>
          <div className="flex flex-wrap gap-1.5">
            {kit.lengths.map((l) => (
              <Link
                key={l}
                href={`/kits/${kit.id}?length=${l}`}
                className="px-2.5 py-1 text-xs font-spec border border-bone-line text-ink/60 rounded-xs hover:border-ink/30 hover:text-ink transition-colors"
              >
                {l}
              </Link>
            ))}
          </div>
        </div>

        <Link
          href={`/kits/${kit.id}`}
          className="block w-full text-center font-spec text-[9px] tracking-widest uppercase border border-ink/20 text-ink/60 px-4 py-2.5 rounded-xs hover:bg-ink hover:text-bone hover:border-ink transition-colors"
        >
          View system spec →
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ page */
export default function KitsPage() {
  const bottomFormRef = useRef<HTMLDivElement>(null);
  const [activeKit, setActiveKit] = useState<KitId | null>(null);

  function scrollToBottom(kitId: KitId) {
    setActiveKit(kitId);
    setTimeout(() => {
      bottomFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  return (
    <div className="min-h-screen bg-bone">

      {/* ── nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bone/90 backdrop-blur-md border-b border-bone-line">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
          <Link href="/" className="font-display text-sm tracking-[0.25em] text-ink/60 hover:text-ink transition-colors flex-shrink-0">
            ORENARA
          </Link>
          <div className="hidden sm:flex items-center gap-6 text-xs text-ink/50">
            <Link href="/kits/build" className="hover:text-ink transition-colors">Build your space</Link>
            <Link href="/trade" className="hover:text-ink transition-colors">Trade</Link>
          </div>
        </div>
      </nav>

      {/* ── hero ── */}
      <section className="pt-14">
        <div className="relative overflow-hidden bg-ink min-h-[52vh] flex items-end">
          <div className="absolute inset-0">
            <Image
              src="/images/gallery/orenara-travertine-pool-edge.webp"
              alt="Pool surround LED lighting"
              fill
              className="object-cover img-treated opacity-40"
              priority
              sizes="100vw"
            />
          </div>
          <div className="relative max-w-6xl mx-auto px-6 py-16 lg:py-24">
            <p className="font-spec text-[9px] tracking-widest text-bone/40 uppercase mb-4">
              System kits
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-bone leading-tight max-w-2xl mb-5">
              The same system.<br />
              Pre-configured.
            </h1>
            <p className="text-bone/65 text-lg leading-relaxed max-w-xl mb-8">
              Choose your application and length. We configure the strip, channel,
              drivers and connectors. Your licensed electrician installs it.
            </p>
            <a
              href="#kits"
              className="inline-block font-spec text-[9px] tracking-widest uppercase bg-bone text-ink px-6 py-3 rounded-xs hover:bg-bone/90 transition-colors"
            >
              Browse kits
            </a>
          </div>
        </div>
      </section>

      {/* ── same system pitch ── */}
      <section className="bg-bone border-t border-bone-line">
        <div className="max-w-6xl mx-auto px-6 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="font-spec text-xs tracking-widest text-ink/40 uppercase mb-4">
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
                ready-made lengths and configurations.
              </p>
              <p className="text-ink/65 leading-relaxed">
                Your licensed electrician installs it. They're handling a
                finished system — not cutting or splicing anything.
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
                <p className="font-spec text-[9px] tracking-widest text-bone/60 uppercase mb-1">
                  IP68 factory-moulded connector
                </p>
                <p className="text-sm text-bone-dim">
                  Sealed at the factory. Pressure-tested before dispatch.
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
            <p className="font-spec text-xs tracking-widest text-ink/40 uppercase mb-3">
              Find your kit
            </p>
            <h2 className="font-display text-3xl sm:text-4xl leading-tight text-ink">
              Four kits. One system.
            </h2>
            <p className="text-ink/60 mt-3 max-w-xl leading-relaxed">
              Every kit uses the same IP68 SF16 strip. The difference is the
              channel, the length tiers, and how it's configured for the
              application. Click any kit to see the system spec.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {KITS.map((k) => (
              <KitCard key={k.id} kit={k} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Build Your Space — multi-zone CTA ── */}
      <section className="bg-bone border-t border-bone-line">
        <div className="max-w-6xl mx-auto px-6 py-16 lg:py-20">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <p className="font-spec text-xs tracking-widest text-ink/40 uppercase mb-4">
                Multiple areas
              </p>
              <h2 className="font-display text-3xl sm:text-4xl leading-tight text-ink mb-4">
                Pool, path, and stairs in one order.
              </h2>
              <p className="text-ink/65 leading-relaxed mb-6">
                Add each area of your job separately. We calculate the strip, drivers, and connectors for the whole site in one go — one price, one order, one dispatch.
              </p>
              <Link
                href="/kits/build"
                className="inline-block font-spec text-[9px] tracking-widest uppercase bg-ink text-bone px-6 py-3 rounded-xs hover:bg-ink/90 transition-colors"
              >
                Build your space →
              </Link>
            </div>
            <div className="mt-10 lg:mt-0 rounded-xs border border-bone-line bg-bone-tile p-7 space-y-4">
              {([
                { label: "Pool surround",  detail: "W × L dimensions, per-side include/exclude, coping or recessed mount" },
                { label: "Garden path",    detail: "Straight or curved run — any length" },
                { label: "Stair nosing",   detail: "Per-tread — each step gets its own independent run" },
                { label: "Custom zone",    detail: "Soffit, feature wall, any other continuous run" },
              ] as const).map(item => (
                <div key={item.label} className="flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full bg-ink/30 flex-shrink-0 mt-2"/>
                  <div>
                    <p className="text-sm text-ink font-display">{item.label}</p>
                    <p className="text-xs text-ink/50 leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── trust ── */}
      <section className="bg-bone-card border-t border-bone-line">
        <div className="max-w-6xl mx-auto px-6 py-16 lg:py-24">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <p className="font-spec text-xs tracking-widest text-ink/40 uppercase mb-4">
                Why it's still an Orenara system
              </p>
              <h2 className="font-display text-2xl sm:text-3xl text-ink mb-6">
                Pre-packaged doesn't mean lower grade.
              </h2>
              <p className="text-ink/65 leading-relaxed mb-8">
                Every connection is factory-sealed before it leaves us. Your
                electrician installs a finished system — nothing to waterproof,
                nothing to splice, nothing to commission. Trim to length on site
                if you need to: a factory-matched snap end cap fits by hand, no
                equipment needed. If the seal fails under warranty, that's our
                problem to fix, not theirs.
              </p>
              <div className="space-y-4 mb-8">
                {TRUST_POINTS.map((point) => (
                  <div key={point.label} className="flex items-start gap-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-ink/30 flex-shrink-0 mt-2" />
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
                {["IP68", "IP67 driver", "3yr standard", "2yr submerged", "LM-80", "UV resistant"].map(
                  (badge) => (
                    <span
                      key={badge}
                      className="font-spec text-[9px] tracking-widest uppercase border border-bone-line bg-bone-tile px-3 py-1.5 text-ink/55 rounded-xs"
                    >
                      {badge}
                    </span>
                  )
                )}
              </div>
            </div>
            <div className="mt-10 lg:mt-0 grid grid-cols-2 gap-3">
              {[
                { src: "/images/gallery/orenara-travertine-pool-edge.webp", alt: "Pool edge installation" },
                { src: "/images/gallery/orenara-travertine-steps-pool.webp", alt: "Travertine stair lighting" },
                { src: "/images/gallery/orenara-curved-path-pool-dusk.webp", alt: "Curved path lighting" },
                { src: "/images/gallery/orenara-courtyard-patio.webp", alt: "Courtyard patio lighting" },
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

      {/* ── bottom review form ── */}
      <section
        ref={bottomFormRef}
        id="review"
        className="bg-bone border-t border-bone-line"
      >
        <div className="max-w-2xl mx-auto px-6 py-20">
          <div className="text-center mb-10">
            <p className="font-spec text-xs tracking-widest text-ink/40 uppercase mb-3">
              Get started
            </p>
            <h2 className="font-display text-3xl text-ink mb-3">
              Request a review.
            </h2>
            <p className="text-ink/60 leading-relaxed">
              Tell us your application and we'll come back with a system
              specification and price within one business day.
            </p>
          </div>
          <ReviewForm preselectedKit={activeKit} />
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
            Supply only — electrician-installed. All electrical work must be
            performed by a licensed electrician per AS/NZS 3000.
          </div>
        </div>
      </footer>
    </div>
  );
}
