"use client";

import { useMemo, useState } from "react";
import { Plus, CheckCircle, AlertCircle, Send, FileDown } from "lucide-react";
import { reportConversion } from "@/lib/gtag";
import ZoneCard, { type ZoneFormState, type RunFormState } from "./ZoneCard";
import PrintQuoteView from "./PrintQuoteView";
import {
  calculateZone,
  calculateTotals,
  nextZonePlaceholder,
  formatZoneSummary,
  PART_NUMBERS,
  PART_LABELS,
  type QuoteZoneCalculated,
} from "@/lib/quoteCalc";

const timelines = ["ASAP", "1–3 months", "3–6 months", "Just researching"];

function makeId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function makeRun(): RunFormState {
  return {
    id: makeId("run"),
    lengthMetres: "",
    shape: "straight",
  };
}

function makeZone(): ZoneFormState {
  return {
    id: makeId("zone"),
    name: "",
    note: "",
    runs: [makeRun()],
  };
}

interface ContactState {
  name: string;
  email: string;
  phone: string;
  suburb: string;
  timeline: string;
}

const INITIAL_CONTACT: ContactState = { name: "", email: "", phone: "", suburb: "", timeline: "" };

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.8125rem",
  fontWeight: 500,
  color: "var(--bone-dim)",
  marginBottom: "8px",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
};

export default function QuoteBuilder() {
  const [zones, setZones] = useState<ZoneFormState[]>([]);
  const [contact, setContact] = useState<ContactState>(INITIAL_CONTACT);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const calculatedZones: QuoteZoneCalculated[] = useMemo(
    () =>
      zones.map((z) =>
        calculateZone({
          name: z.name.trim() || nextZonePlaceholder(zones.indexOf(z)),
          runs: z.runs.map((r) => ({
            lengthMetres: parseFloat(r.lengthMetres) || 0,
            shape: r.shape,
          })),
          note: z.note.trim() || undefined,
        })
      ),
    [zones]
  );

  const totals = useMemo(() => calculateTotals(calculatedZones), [calculatedZones]);

  const hasValidZones = calculatedZones.some((z) => z.totalLengthMetres > 0);

  const addZone = () => setZones((prev) => [...prev, makeZone()]);

  const updateZone = (id: string, patch: Partial<ZoneFormState>) =>
    setZones((prev) => prev.map((z) => (z.id === id ? { ...z, ...patch } : z)));

  const removeZone = (id: string) => setZones((prev) => prev.filter((z) => z.id !== id));

  const updateRun = (zoneId: string, runId: string, patch: Partial<RunFormState>) =>
    setZones((prev) =>
      prev.map((z) =>
        z.id === zoneId ? { ...z, runs: z.runs.map((r) => (r.id === runId ? { ...r, ...patch } : r)) } : z
      )
    );

  const addRun = (zoneId: string) =>
    setZones((prev) => prev.map((z) => (z.id === zoneId ? { ...z, runs: [...z.runs, makeRun()] } : z)));

  const removeRun = (zoneId: string, runId: string) =>
    setZones((prev) =>
      prev.map((z) => (z.id === zoneId ? { ...z, runs: z.runs.filter((r) => r.id !== runId) } : z))
    );

  const setContactField = (field: keyof ContactState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setContact((prev) => ({ ...prev, [field]: e.target.value }));

  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasValidZones) {
      setStatus("error");
      setErrorMsg("Add at least one zone with a run length before sending.");
      return;
    }

    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/enquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contact.name,
          email: contact.email,
          phone: contact.phone || undefined,
          suburb: contact.suburb,
          kit: "Custom Zone Kit",
          timeline: contact.timeline,
          zones: calculatedZones.filter((z) => z.totalLengthMetres > 0),
          totals,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Submission failed. Please try again.");
      }

      setStatus("success");
      reportConversion(process.env.NEXT_PUBLIC_CONV_LABEL_QUOTE);
      setZones([]);
      setContact(INITIAL_CONTACT);
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <section style={{ background: "var(--ink)", paddingTop: "160px", paddingBottom: "120px" }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "var(--ink-raised)",
              border: "1px solid var(--ink-line)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <CheckCircle size={28} style={{ color: "var(--bone)" }} />
          </div>
          <h2 className="font-medium mb-4" style={{ fontSize: "1.75rem", color: "var(--bone)", letterSpacing: "-0.03em" }}>
            Got it — we'll come back to you within 1–2 business days with pricing and a confirmed lead time.
          </h2>
          <p style={{ fontSize: "1rem", color: "var(--bone-dim)", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto" }}>
            Your full zone breakdown and bill of materials came through with your enquiry — no need to repeat
            anything on the phone.
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="btn-outline"
            style={{ marginTop: "32px", width: "auto", display: "inline-flex" }}
            data-testid="quote-builder-reset-btn"
          >
            Build another kit
          </button>
        </div>
      </section>
    );
  }

  return (
    <section style={{ background: "var(--ink)", paddingTop: "160px", paddingBottom: "120px" }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12 max-w-2xl">
          <p className="spec-badge mb-6" style={{ display: "inline-flex" }}>
            Build Your Kit
          </p>
          <h1
            className="font-medium mb-4"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3rem)",
              color: "var(--bone)",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
            }}
          >
            Piece your job together and get a straight quote.
          </h1>
          <p style={{ color: "var(--bone-dim)", fontSize: "1.0625rem", lineHeight: 1.7 }}>
            Add each zone of your project — a garden path, a patio, a pool surround — with its run length and
            shape. We'll work out the drivers, dimmers, and mounting track for you. No pricing shown here, no
            account needed — just email it straight through and we'll come back with real numbers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Zones column */}
          <div className="lg:col-span-2">
            {zones.length === 0 ? (
              <div
                className="rounded-lg p-10 text-center"
                style={{ background: "var(--ink-raised)", border: "1px dashed var(--ink-line)" }}
              >
                <p style={{ color: "var(--bone-dim)", fontSize: "0.9375rem", marginBottom: "20px" }}>
                  No zones yet. Start with the first area of your project.
                </p>
                <button type="button" onClick={addZone} className="btn-outline" style={{ width: "auto", display: "inline-flex" }} data-testid="add-zone-btn-empty">
                  <Plus size={16} />
                  Add a zone
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {zones.map((zone, i) => {
                  const summary = formatZoneSummary(
                    zone.name.trim() || nextZonePlaceholder(i),
                    zone.runs.map((r) => ({ lengthMetres: parseFloat(r.lengthMetres) || 0, shape: r.shape }))
                  );
                  return (
                    <ZoneCard
                      key={zone.id}
                      zone={zone}
                      placeholder={nextZonePlaceholder(i)}
                      index={i}
                      onChange={updateZone}
                      onRemove={removeZone}
                      onRunChange={updateRun}
                      onAddRun={addRun}
                      onRemoveRun={removeRun}
                      summary={summary}
                    />
                  );
                })}
                <button
                  type="button"
                  onClick={addZone}
                  className="btn-outline"
                  style={{ width: "auto", alignSelf: "flex-start" }}
                  data-testid="add-zone-btn"
                >
                  <Plus size={16} />
                  Add another zone
                </button>
              </div>
            )}
          </div>

          {/* Summary column */}
          <div className="lg:col-span-1">
            <div
              className="lg:sticky rounded-lg p-6"
              style={{ background: "var(--ink-raised)", border: "1px solid var(--ink-line)", top: "104px" }}
              data-testid="quote-summary-panel"
            >
              <p
                className="eyebrow"
                style={{
                  marginBottom: "16px",
                }}
              >
                Your bill of materials
              </p>

              {!hasValidZones ? (
                <p style={{ color: "var(--bone-dim)", fontSize: "0.875rem", lineHeight: 1.6 }}>
                  Add a zone with a run length to see what it needs.
                </p>
              ) : (
                <>
                  <div className="flex flex-col gap-3 mb-6">
                    {[
                      ["Strip metres", `${totals.stripMetres}m`, PART_NUMBERS.strip],
                      ["Drivers", totals.drivers, PART_NUMBERS.driver],
                      ["Dimmers", totals.dimmers, PART_NUMBERS.dimmer],
                      ["240V plugs", totals.plugs, PART_NUMBERS.plug],
                      ["Rigid channel", `${totals.rigidChannelMetres}m`, PART_NUMBERS.rigidChannel],
                      ["Flexible track", `${totals.flexibleTrackMetres}m`, PART_NUMBERS.flexibleTrack],
                    ].map(([label, value, partNumber]) => (
                      <div key={label as string} className="flex items-center justify-between gap-3">
                        <span style={{ color: "var(--bone-dim)", fontSize: "0.875rem" }}>
                          {label}
                          <span className="spec-mono" style={{ fontSize: "0.6875rem", marginLeft: "6px" }}>
                            ({partNumber})
                          </span>
                        </span>
                        <span className="spec-mono" style={{ color: "var(--bone)", fontSize: "0.9375rem", flexShrink: 0 }}>
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderTop: "1px solid var(--ink-line)", paddingTop: "16px" }}>
                    <p
                      className="eyebrow"
                      style={{
                        marginBottom: "12px",
                      }}
                    >
                      Zone breakdown
                    </p>
                    <div className="flex flex-col gap-3">
                      {calculatedZones
                        .filter((z) => z.totalLengthMetres > 0)
                        .map((z, i) => (
                          <div key={i} style={{ fontSize: "0.8125rem", color: "var(--bone-dim)", lineHeight: 1.6 }}>
                            <span style={{ color: "var(--bone)" }}>{z.name}</span> —{" "}
                            {z.runs.map((r) => `${r.lengthMetres}m ${r.shape}`).join(" + ")} ({z.totalLengthMetres}m
                            total), {z.driversNeeded} driver{z.driversNeeded === 1 ? "" : "s"} (
                            {PART_NUMBERS.driver})
                          </div>
                        ))}
                    </div>
                  </div>

                  <p className="mt-4" style={{ fontSize: "0.75rem", color: "var(--bone-dim)", lineHeight: 1.5 }}>
                    Driver count assumes all runs within a zone are wired together on a shared power feed.
                  </p>

                  <button
                    type="button"
                    onClick={handlePrint}
                    className="btn-outline mt-5"
                    data-testid="quote-bom-download-pdf"
                  >
                    <FileDown size={16} />
                    Download PDF
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Handoff */}
        <div
          className="mt-12 rounded-lg p-8"
          style={{ background: "var(--ink-raised)", border: "1px solid var(--ink-line)" }}
        >
          <h2 className="font-medium mb-2" style={{ fontSize: "1.375rem", color: "var(--bone)", letterSpacing: "-0.02em" }}>
            Email this for pricing.
          </h2>
          <p style={{ color: "var(--bone-dim)", fontSize: "0.9375rem", lineHeight: 1.7, marginBottom: "28px" }}>
            We'll come back within 1–2 business days with pricing and a confirmed lead time. No obligation, no
            automated quote.
          </p>

          <form onSubmit={handleSubmit} noValidate data-testid="quote-builder-form">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="qb-name" style={labelStyle}>
                  Name <span style={{ color: "var(--bone-dim)" }}>*</span>
                </label>
                <input
                  id="qb-name"
                  className="enquiry-input"
                  type="text"
                  placeholder="Your name"
                  value={contact.name}
                  onChange={setContactField("name")}
                  required
                  data-testid="qb-input-name"
                />
              </div>

              <div>
                <label htmlFor="qb-email" style={labelStyle}>
                  Email <span style={{ color: "var(--bone-dim)" }}>*</span>
                </label>
                <input
                  id="qb-email"
                  className="enquiry-input"
                  type="email"
                  placeholder="you@example.com"
                  value={contact.email}
                  onChange={setContactField("email")}
                  required
                  data-testid="qb-input-email"
                />
              </div>

              <div>
                <label htmlFor="qb-phone" style={labelStyle}>
                  Phone{" "}
                  <span style={{ color: "var(--bone-dim)", fontWeight: 400, textTransform: "none", letterSpacing: "normal" }}>
                    (optional)
                  </span>
                </label>
                <input
                  id="qb-phone"
                  className="enquiry-input"
                  type="tel"
                  placeholder="04xx xxx xxx"
                  value={contact.phone}
                  onChange={setContactField("phone")}
                  data-testid="qb-input-phone"
                />
              </div>

              <div>
                <label htmlFor="qb-suburb" style={labelStyle}>
                  Suburb / State <span style={{ color: "var(--bone-dim)" }}>*</span>
                </label>
                <input
                  id="qb-suburb"
                  className="enquiry-input"
                  type="text"
                  placeholder="e.g. Noosa, QLD"
                  value={contact.suburb}
                  onChange={setContactField("suburb")}
                  required
                  data-testid="qb-input-suburb"
                />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label htmlFor="qb-timeline" style={labelStyle}>
                  Project timeline <span style={{ color: "var(--bone-dim)" }}>*</span>
                </label>
                <select
                  id="qb-timeline"
                  className="enquiry-input"
                  value={contact.timeline}
                  onChange={setContactField("timeline")}
                  required
                  data-testid="qb-select-timeline"
                >
                  <option value="" disabled>
                    When are you looking to proceed?
                  </option>
                  {timelines.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {status === "error" && (
              <div
                className="flex items-start gap-3 mt-5 p-4 rounded-lg"
                style={{ background: "var(--ink-raised)", border: "1px solid var(--ink-line)" }}
                data-testid="quote-builder-error"
              >
                <AlertCircle size={18} style={{ color: "var(--bone)", flexShrink: 0, marginTop: "1px" }} />
                <p style={{ color: "var(--bone)", fontSize: "0.9rem" }}>{errorMsg}</p>
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button
                type="submit"
                className="btn-primary"
                disabled={status === "submitting"}
                style={{ opacity: status === "submitting" ? 0.7 : 1 }}
                data-testid="quote-builder-submit"
              >
                <Send size={16} />
                {status === "submitting" ? "Sending…" : "Email This for Pricing"}
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="btn-outline"
                disabled={!hasValidZones}
                style={{ opacity: hasValidZones ? 1 : 0.5, cursor: hasValidZones ? "pointer" : "not-allowed" }}
                data-testid="quote-builder-download-pdf"
              >
                <FileDown size={16} />
                Download PDF
              </button>
              <p style={{ fontSize: "0.8125rem", color: "var(--bone-dim)", lineHeight: 1.5 }}>
                We respond within 1–2 business days.
                <br />
                No spam. No automated quotes.
              </p>
            </div>
          </form>
        </div>
      </div>

      <PrintQuoteView zones={calculatedZones} totals={totals} contact={contact} partLabels={PART_LABELS} />
    </section>
  );
}
