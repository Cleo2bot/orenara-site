"use client";
import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { reportConversion } from "@/lib/gtag";

const colourOptions = [
  "Standard warm glow",
  "Custom colour (RGB/CCT) — specify below",
  "Not sure yet",
];

const deadlineOptions = [
  "Standard 20 business days is fine",
  "I have a hard deadline — specify below",
];

interface FormData {
  name: string;
  business: string;
  email: string;
  phone: string;
  suburb: string;
  colourGlow: string;
  lengths: string;
  deadline: string;
  details: string;
}

const INITIAL: FormData = {
  name: "",
  business: "",
  email: "",
  phone: "",
  suburb: "",
  colourGlow: "",
  lengths: "",
  deadline: "",
  details: "",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.8125rem",
  fontWeight: 500,
  color: "var(--bone-dim)",
  marginBottom: "8px",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
};

const optionalStyle: React.CSSProperties = {
  color: "var(--bone-dim)",
  fontWeight: 400,
  textTransform: "none",
  letterSpacing: "normal",
};

export default function TradeEnquiryForm() {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const set = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/trade/enquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Submission failed. Please try again.");
      }
      setStatus("success");
      reportConversion(process.env.NEXT_PUBLIC_CONV_LABEL_TRADE);
      setForm(INITIAL);
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <section id="trade-enquire" style={{ background: "var(--ink-raised)", paddingTop: "96px", paddingBottom: "96px" }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "var(--ink)",
              border: "1px solid var(--ink-line)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <CheckCircle size={28} style={{ color: "var(--bone-dim)" }} />
          </div>
          <h2
            className="mb-4"
            style={{ fontSize: "1.75rem", color: "var(--bone)", letterSpacing: "-0.03em" }}
          >
            Enquiry received.
          </h2>
          <p style={{ fontSize: "1rem", color: "var(--bone-dim)", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto" }}>
            Got it. We&apos;ll come back to you within 24 hours with pricing and a confirmed delivery date.
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="btn-outline"
            style={{ marginTop: "32px", width: "auto", display: "inline-flex" }}
            data-testid="trade-form-reset-btn"
          >
            Submit another enquiry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      id="trade-enquire"
      style={{
        background: "var(--ink-raised)",
        borderTop: "1px solid var(--ink-line)",
        paddingTop: "96px",
        paddingBottom: "96px",
      }}
    >
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <p className="spec-badge mb-6" style={{ display: "inline-flex" }}>
            Trade enquiry
          </p>
          <h2
            className="mb-4"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              color: "var(--bone)",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
            }}
          >
            Tell us the job.
          </h2>
          <p style={{ color: "var(--bone-dim)", fontSize: "1rem", lineHeight: 1.7 }}>
            We&apos;ll spec it, price it, and confirm a delivery date — back to you within 24 hours.
            No pricing runaround, no vague estimates.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate data-testid="trade-enquiry-form">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Name */}
            <div>
              <label htmlFor="name" style={labelStyle}>
                Name <span style={{ color: "var(--bone-dim)" }}>*</span>
              </label>
              <input
                id="name"
                className="enquiry-input"
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={set("name")}
                required
                data-testid="input-name"
              />
            </div>

            {/* Business / Trade */}
            <div>
              <label htmlFor="business" style={labelStyle}>
                Business / trade <span style={{ color: "var(--bone-dim)" }}>*</span>
              </label>
              <input
                id="business"
                className="enquiry-input"
                type="text"
                placeholder="e.g. Electrician, Landscaper, Builder"
                value={form.business}
                onChange={set("business")}
                required
                data-testid="input-business"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" style={labelStyle}>
                Email <span style={{ color: "var(--bone-dim)" }}>*</span>
              </label>
              <input
                id="email"
                className="enquiry-input"
                type="email"
                placeholder="you@business.com.au"
                value={form.email}
                onChange={set("email")}
                required
                data-testid="input-email"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" style={labelStyle}>
                Phone <span style={optionalStyle}>(optional)</span>
              </label>
              <input
                id="phone"
                className="enquiry-input"
                type="tel"
                placeholder="04xx xxx xxx"
                value={form.phone}
                onChange={set("phone")}
                data-testid="input-phone"
              />
            </div>

            {/* Site suburb / postcode */}
            <div>
              <label htmlFor="suburb" style={labelStyle}>
                Site delivery suburb / postcode <span style={{ color: "var(--bone-dim)" }}>*</span>
              </label>
              <input
                id="suburb"
                className="enquiry-input"
                type="text"
                placeholder="e.g. Byron Bay, 2481"
                value={form.suburb}
                onChange={set("suburb")}
                required
                data-testid="input-suburb"
              />
            </div>

            {/* Colour / glow */}
            <div>
              <label htmlFor="colour-select" style={labelStyle}>
                Colour / glow required <span style={{ color: "var(--bone-dim)" }}>*</span>
              </label>
              <select
                id="colour-select"
                className="enquiry-input"
                value={form.colourGlow}
                onChange={set("colourGlow")}
                required
                data-testid="select-colour"
              >
                <option value="" disabled>Select colour / glow…</option>
                {colourOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Lengths / quantity */}
            <div>
              <label htmlFor="lengths" style={labelStyle}>
                Approx lengths / quantity <span style={{ color: "var(--bone-dim)" }}>*</span>
              </label>
              <input
                id="lengths"
                className="enquiry-input"
                type="text"
                placeholder="e.g. 3 × 8m runs + 12m pathway"
                value={form.lengths}
                onChange={set("lengths")}
                required
                data-testid="input-lengths"
              />
            </div>

            {/* Deadline */}
            <div>
              <label htmlFor="deadline-select" style={labelStyle}>
                Deadline — is this urgent? <span style={{ color: "var(--bone-dim)" }}>*</span>
              </label>
              <select
                id="deadline-select"
                className="enquiry-input"
                value={form.deadline}
                onChange={set("deadline")}
                required
                data-testid="select-deadline"
              >
                <option value="" disabled>Select deadline…</option>
                {deadlineOptions.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Additional details — full width */}
            <div style={{ gridColumn: "1 / -1" }}>
              <label htmlFor="details" style={labelStyle}>
                Additional details <span style={optionalStyle}>(optional)</span>
              </label>
              <textarea
                id="details"
                className="enquiry-input"
                rows={4}
                placeholder="Job specifics, custom colour details, hard deadline dates, site access notes, anything relevant…"
                value={form.details}
                onChange={set("details")}
                style={{ resize: "vertical", minHeight: "100px" }}
                data-testid="input-details"
              />
            </div>
          </div>

          {/* Error */}
          {status === "error" && (
            <div
              className="flex items-start gap-3 mt-5 p-4 rounded-lg"
              style={{
                background: "var(--ink)",
                border: "1px solid var(--ink-line)",
              }}
              data-testid="trade-form-error"
            >
              <AlertCircle size={18} style={{ color: "var(--bone)", flexShrink: 0, marginTop: "1px" }} />
              <p style={{ color: "var(--bone)", fontSize: "0.9rem" }}>{errorMsg}</p>
            </div>
          )}

          {/* Submit */}
          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              type="submit"
              className="btn-primary"
              disabled={status === "submitting"}
              style={{ opacity: status === "submitting" ? 0.7 : 1 }}
              data-testid="button-submit"
            >
              <Send size={16} />
              {status === "submitting" ? "Sending…" : "Send Trade Enquiry"}
            </button>
            <p style={{ fontSize: "0.8125rem", color: "var(--bone-dim)", lineHeight: 1.5 }}>
              We respond within 24 hours.<br />
              Firm price, confirmed delivery date.
            </p>
          </div>
          <p style={{ marginTop: "16px", fontSize: "0.8125rem", color: "var(--bone-dim)", lineHeight: 1.5 }}>
            Every system is built to order — allow up to 20 business days from order confirmation.
          </p>
        </form>
      </div>
    </section>
  );
}
