"use client";
import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { reportConversion } from "@/lib/gtag";

const kits = [
  "Pathway Kit",
  "Pergola Kit",
  "Pool & Water Feature Kit",
  "Custom Zone Kit",
  "Not sure yet",
];

const timelines = [
  "ASAP",
  "1–3 months",
  "3–6 months",
  "Just researching",
];

interface FormData {
  name: string;
  email: string;
  phone: string;
  suburb: string;
  kit: string;
  timeline: string;
  message: string;
}

const INITIAL: FormData = {
  name: "",
  email: "",
  phone: "",
  suburb: "",
  kit: "",
  timeline: "",
  message: "",
};

export default function EnquiryForm() {
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
      const res = await fetch("/enquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Submission failed. Please try again.");
      }
      setStatus("success");
      reportConversion(process.env.NEXT_PUBLIC_CONV_LABEL_ENQUIRY);
      setForm(INITIAL);
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <section id="enquire" style={{ background: "var(--ink)", paddingTop: "96px", paddingBottom: "96px" }}>
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
            <CheckCircle size={28} style={{ color: "var(--bone-dim)" }} />
          </div>
          <h2
            className="font-medium mb-4"
            style={{ fontSize: "1.75rem", color: "var(--bone)", letterSpacing: "-0.03em" }}
          >
            Enquiry received.
          </h2>
          <p style={{ fontSize: "1rem", color: "var(--bone-dim)", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto" }}>
            Thanks — we'll be in touch within 1–2 business days with pricing and lead time.
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="btn-outline"
            style={{ marginTop: "32px", width: "auto", display: "inline-flex" }}
            data-testid="form-reset-btn"
          >
            Submit another enquiry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      id="enquire"
      style={{
        background: "var(--ink)",
        borderTop: "1px solid var(--ink-line)",
        paddingTop: "96px",
        paddingBottom: "96px",
      }}
    >
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <p className="eyebrow mb-6">Enquire</p>
          <h2
            className="font-medium mb-4"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              color: "var(--bone)",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
            }}
          >
            Tell us about your project.
          </h2>
          <p style={{ color: "var(--bone-dim)", fontSize: "1rem", lineHeight: 1.7 }}>
            We'll come back within 1–2 business days with pricing and a confirmed lead time.
            No obligation, no automated quote — a real conversation about your space.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate data-testid="enquiry-form">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, color: "var(--bone-dim)", marginBottom: "8px", letterSpacing: "0.04em", textTransform: "uppercase" }}
              >
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

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, color: "var(--bone-dim)", marginBottom: "8px", letterSpacing: "0.04em", textTransform: "uppercase" }}
              >
                Email <span style={{ color: "var(--bone-dim)" }}>*</span>
              </label>
              <input
                id="email"
                className="enquiry-input"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={set("email")}
                required
                data-testid="input-email"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, color: "var(--bone-dim)", marginBottom: "8px", letterSpacing: "0.04em", textTransform: "uppercase" }}
              >
                Phone <span style={{ color: "var(--bone-dim)", fontWeight: 400, textTransform: "none", letterSpacing: "normal" }}>(optional)</span>
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

            {/* Suburb/State */}
            <div>
              <label
                htmlFor="suburb"
                style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, color: "var(--bone-dim)", marginBottom: "8px", letterSpacing: "0.04em", textTransform: "uppercase" }}
              >
                Suburb / State <span style={{ color: "var(--bone-dim)" }}>*</span>
              </label>
              <input
                id="suburb"
                className="enquiry-input"
                type="text"
                placeholder="e.g. Noosa, QLD"
                value={form.suburb}
                onChange={set("suburb")}
                required
                data-testid="input-suburb"
              />
            </div>

            {/* Kit */}
            <div>
              <label
                htmlFor="kit-select"
                style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, color: "var(--bone-dim)", marginBottom: "8px", letterSpacing: "0.04em", textTransform: "uppercase" }}
              >
                Which kit? <span style={{ color: "var(--bone-dim)" }}>*</span>
              </label>
              <select
                id="kit-select"
                className="enquiry-input"
                value={form.kit}
                onChange={set("kit")}
                required
                data-testid="select-kit"
              >
                <option value="" disabled>Select a kit…</option>
                {kits.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>

            {/* Timeline */}
            <div>
              <label
                htmlFor="timeline"
                style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, color: "var(--bone-dim)", marginBottom: "8px", letterSpacing: "0.04em", textTransform: "uppercase" }}
              >
                Project timeline <span style={{ color: "var(--bone-dim)" }}>*</span>
              </label>
              <select
                id="timeline"
                className="enquiry-input"
                value={form.timeline}
                onChange={set("timeline")}
                required
                data-testid="select-timeline"
              >
                <option value="" disabled>When are you looking to proceed?</option>
                {timelines.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Message — full width */}
            <div style={{ gridColumn: "1 / -1" }}>
              <label
                htmlFor="message"
                style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, color: "var(--bone-dim)", marginBottom: "8px", letterSpacing: "0.04em", textTransform: "uppercase" }}
              >
                Tell us about your space <span style={{ color: "var(--bone-dim)", fontWeight: 400, textTransform: "none", letterSpacing: "normal" }}>(optional)</span>
              </label>
              <textarea
                id="message"
                className="enquiry-input"
                rows={4}
                placeholder="Approximate lineal metres, what you're lighting, any specific requirements…"
                value={form.message}
                onChange={set("message")}
                style={{ resize: "vertical", minHeight: "100px" }}
                data-testid="input-message"
              />
            </div>
          </div>

          {/* Error */}
          {status === "error" && (
            <div
              className="flex items-start gap-3 mt-5 p-4 rounded-lg"
              style={{
                background: "var(--ink-raised)",
                border: "1px solid var(--ink-line)",
              }}
              data-testid="form-error"
            >
              <AlertCircle size={18} style={{ color: "var(--bone-dim)", flexShrink: 0, marginTop: "1px" }} />
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
              {status === "submitting" ? "Sending…" : "Send Enquiry"}
            </button>
            <p style={{ fontSize: "0.8125rem", color: "var(--bone-dim)", lineHeight: 1.5 }}>
              We respond within 1–2 business days.<br />
              No spam. No automated quotes.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
