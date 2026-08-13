"use client";

import React, { useState, useId } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { KITS, KitId, KitDef, getLengthMetres } from "../../../lib/kits-data";
import { calculateRunConfig, PART_NUMBERS, PART_LABELS } from "../../../lib/quoteCalc";

/* ------------------------------------------------------------------ shared */
const inputCls =
  "w-full bg-bone-tile border border-bone-line text-ink rounded-xs px-3 py-2.5 text-sm placeholder:text-ink/35 focus:outline-none focus:border-ink/40 transition-colors";

const labelCls =
  "block text-[9px] font-spec tracking-widest text-ink/45 uppercase mb-2";

/* ------------------------------------------------------------------ tier config */
function TierConfig({ lengthStr }: { lengthStr: string }) {
  const metres = getLengthMetres(lengthStr);
  const config = calculateRunConfig(metres);

  const stripPart =
    config.stripType === "cc" ? PART_NUMBERS.stripCC : PART_NUMBERS.stripMono;
  const stripLabel =
    config.stripType === "cc" ? PART_LABELS.stripCC : PART_LABELS.stripMono;

  return (
    <div className="rounded-xs border border-bone-line bg-bone-tile p-5">
      <p className="font-spec text-[8px] tracking-widest text-ink/35 uppercase mb-4">
        System configuration — {lengthStr} run
      </p>
      <div className="space-y-3">
        {/* strip */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-ink font-display">Strip</p>
            <p className="text-xs text-ink/50 mt-0.5">{stripLabel}</p>
          </div>
          <span className="font-spec text-[9px] tracking-wider text-ink/40 flex-shrink-0 mt-0.5">
            {stripPart}
          </span>
        </div>

        {/* physical runs */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-ink font-display">
              {config.physicalRuns.length === 1
                ? "1 run"
                : `${config.physicalRuns.length} independently-fed runs`}
            </p>
            <p className="text-xs text-ink/50 mt-0.5">
              {config.physicalRuns.map((r) => `${r.toFixed(1)}m`).join(" + ")}
            </p>
          </div>
          <span className="font-spec text-[9px] tracking-wider text-ink/40 flex-shrink-0 mt-0.5">
            {PART_NUMBERS.connectorSet}
            {config.physicalRuns.length > 1 && ` ×${config.physicalRuns.length}`}
          </span>
        </div>

        {/* drivers */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-ink font-display">
              {config.driversNeeded === 1
                ? "1 driver"
                : `${config.driversNeeded} drivers`}
            </p>
            <p className="text-xs text-ink/50 mt-0.5">
              LM-150-24 · 80% derate · 150W rated
            </p>
          </div>
          <span className="font-spec text-[9px] tracking-wider text-ink/40 flex-shrink-0 mt-0.5">
            {PART_NUMBERS.driver}
            {config.driversNeeded > 1 && ` ×${config.driversNeeded}`}
          </span>
        </div>

        {config.stripType === "cc" && (
          <div className="pt-3 border-t border-bone-line">
            <p className="text-[10px] text-ink/45 leading-relaxed">
              Runs over 10m use CC strip — the constant-current variant of the SF16
              ensures consistent brightness over the full run length.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ review form */
type FormState = "idle" | "submitting" | "success" | "error";

function ReviewForm({ kit, selectedLength }: { kit: KitDef; selectedLength: string }) {
  const formId = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [suburb, setSuburb] = useState("");
  const [notes, setNotes] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormState("submitting");
    setError("");
    try {
      const res = await fetch("/kits/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kit: kit.name,
          kitId: kit.id,
          length: selectedLength,
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
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-ink/30 mb-4">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10l4 4 8-8" stroke="#0F1113" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="font-display text-lg text-ink mb-2">We'll be in touch.</p>
        <p className="text-ink/60 text-sm leading-relaxed max-w-xs mx-auto">
          We'll review your project and come back with a system spec and price
          within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
          placeholder="Any extra context about your installation — shape, obstructions, access points, etc."
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

/* ------------------------------------------------------------------ page */
function KitPageInner({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const kit = KITS.find((k) => k.id === slug);

  const initialLength =
    searchParams.get("length") &&
    kit?.lengths.includes(searchParams.get("length")!)
      ? searchParams.get("length")!
      : null;

  const [selectedLength, setSelectedLength] = useState<string | null>(initialLength);

  if (!kit) {
    return (
      <div className="min-h-screen bg-bone flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-2xl text-ink mb-4">Kit not found.</p>
          <Link href="/kits" className="text-ink/60 hover:text-ink text-sm underline">
            Back to kits
          </Link>
        </div>
      </div>
    );
  }

  const formReviewId = "review-form";

  return (
    <div className="min-h-screen bg-bone">

      {/* ── nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bone/90 backdrop-blur-md border-b border-bone-line">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
          <Link href="/" className="font-display text-sm tracking-[0.25em] text-ink/60 hover:text-ink transition-colors flex-shrink-0">
            ORENARA
          </Link>
          <div className="hidden sm:flex items-center gap-6 text-xs text-ink/50">
            <Link href="/kits" className="hover:text-ink transition-colors">Kits</Link>
            <Link href="/quote-builder" className="hover:text-ink transition-colors">Quote builder</Link>
            <Link href="/trade" className="hover:text-ink transition-colors">Trade</Link>
          </div>
        </div>
      </nav>

      {/* ── hero image ── */}
      <div className="pt-14">
        <div className="relative w-full aspect-[21/9] overflow-hidden bg-ink">
          <Image
            src={kit.image}
            alt={kit.name}
            fill
            className="object-cover img-treated opacity-60"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 max-w-6xl mx-auto px-6 pb-8">
            <Link
              href="/kits"
              className="inline-flex items-center gap-1.5 text-bone/50 hover:text-bone text-xs font-spec tracking-wider mb-4 transition-colors"
            >
              <span>←</span> All kits
            </Link>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-spec text-[8px] tracking-widest uppercase bg-bone/15 border border-bone/20 text-bone/70 px-2.5 py-1 rounded-xs backdrop-blur-sm">
                {kit.channelBadge}
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl text-bone mt-3 leading-tight">
              {kit.name}
            </h1>
          </div>
        </div>
      </div>

      {/* ── main content ── */}
      <div className="max-w-6xl mx-auto px-6 py-12 lg:py-16">
        <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-12">

          {/* left column */}
          <div>
            {/* application */}
            <p className="font-spec text-[9px] tracking-widest text-ink/40 uppercase mb-3">
              Application
            </p>
            <p className="text-ink/70 leading-relaxed mb-2 max-w-2xl">
              {kit.application}
            </p>
            {kit.channelNote && (
              <p className="text-xs text-ink/50 leading-relaxed italic mb-8">
                {kit.channelNote}
              </p>
            )}

            {/* length selector */}
            <div className="mt-8 mb-8">
              <p className="font-spec text-[9px] tracking-widest text-ink/40 uppercase mb-3">
                Select length
              </p>
              <div className="flex flex-wrap gap-2">
                {kit.lengths.map((l) => {
                  const isSelected = selectedLength === l;
                  return (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setSelectedLength(isSelected ? null : l)}
                      className={`px-4 py-2 text-sm font-spec border rounded-xs transition-colors ${
                        isSelected
                          ? "bg-ink border-ink text-bone"
                          : "bg-transparent border-bone-line text-ink/60 hover:border-ink/30 hover:text-ink"
                      }`}
                    >
                      {l}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* tier config */}
            {selectedLength && (
              <div className="mb-8">
                <TierConfig lengthStr={selectedLength} />
              </div>
            )}

            {!selectedLength && (
              <div className="mb-8 rounded-xs border border-dashed border-bone-line bg-bone-tile/50 p-5">
                <p className="text-sm text-ink/40 text-center">
                  Select a length above to see the system configuration.
                </p>
              </div>
            )}

            {/* ideal for */}
            <div className="mb-8">
              <p className="font-spec text-[9px] tracking-widest text-ink/40 uppercase mb-3">
                Ideal for
              </p>
              <ul className="space-y-2">
                {kit.idealFor.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm text-ink/65">
                    <span className="w-1 h-1 rounded-full bg-ink/30 flex-shrink-0 mt-2" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* what's included */}
            <div className="mb-8">
              <p className="font-spec text-[9px] tracking-widest text-ink/40 uppercase mb-4">
                What's included
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    label: "IP68 silicone strip",
                    detail: selectedLength
                      ? `SF16 series — ${
                          getLengthMetres(selectedLength) > 10
                            ? "CC variant (OR-SF-16CC) for runs over 10m"
                            : "mono warm white (OR-SF-16M)"
                        }`
                      : "SF16 series — mono or CC depending on run length",
                  },
                  {
                    label: kit.channel + " channel",
                    detail: "Frosted PC diffuser included. Surface-mount or recessed.",
                  },
                  {
                    label: selectedLength
                      ? `${calculateRunConfig(getLengthMetres(selectedLength)).driversNeeded}× IP67 driver`
                      : "IP67 driver(s)",
                    detail: "LM-150-24 · 24V DC · 80% derated",
                  },
                  {
                    label: "Factory IP68 connectors",
                    detail: "Moulded onto strip ends. Pressure-tested before dispatch.",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xs border border-bone-line bg-bone-tile p-4"
                  >
                    <p className="font-display text-sm text-ink mb-1">{item.label}</p>
                    <p className="text-xs text-ink/55 leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* compliance note */}
            <div className="rounded-xs border border-bone-line bg-bone-card px-5 py-4 mb-8">
              <p className="text-xs text-ink/55 leading-relaxed">
                <strong className="text-ink/70 font-display">Installation note.</strong>{" "}
                All electrical work must be carried out by a licensed electrician
                in line with AS/NZS 3000. Orenara supplies the finished system;
                your electrician connects it to mains.
              </p>
            </div>
          </div>

          {/* right column — sticky review form */}
          <div>
            <div
              id={formReviewId}
              className="lg:sticky lg:top-20 rounded-xs border border-bone-line bg-bone-tile p-6"
            >
              <p className="font-spec text-[9px] tracking-widest text-ink/40 uppercase mb-2">
                {kit.name}
                {selectedLength ? ` · ${selectedLength}` : ""}
              </p>
              <h2 className="font-display text-xl text-ink mb-1">
                Request a review.
              </h2>
              <p className="text-xs text-ink/50 leading-relaxed mb-6">
                We'll confirm the system configuration and come back with a price
                within one business day. No payment now.
              </p>
              <ReviewForm kit={kit} selectedLength={selectedLength ?? ""} />
            </div>
          </div>

        </div>
      </div>

      {/* ── footer ── */}
      <footer className="bg-bone-tile border-t border-bone-line">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <Link
            href="/"
            className="font-display text-sm tracking-[0.25em] text-ink/50 hover:text-ink transition-colors"
          >
            ORENARA
          </Link>
          <div className="flex items-center gap-6 text-xs text-ink/40">
            <Link href="/kits" className="hover:text-ink/60 transition-colors">← All kits</Link>
            <Link href="/terms" className="hover:text-ink/60 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-ink/60 transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function KitSlugPage({ params }: { params: { slug: string } }) {
  return <KitPageInner slug={params.slug} />;
}
