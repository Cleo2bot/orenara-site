"use client";

import { useState, useTransition } from "react";
import { updateQuoteHeader } from "@/lib/admin/actions";

const COLOUR_TEMPS = ["2700K", "3000K", "4000K", "5700K", "TBC"] as const;
const CHANNEL_TYPES = [
  { value: "OR-CHN-RGD", label: "OR-CHN-RGD (Rigid)" },
  { value: "OR-CHN-FLX", label: "OR-CHN-FLX (Flex)" },
  { value: "OR-CHN-SS",  label: "OR-CHN-SS (Stainless)" },
  { value: "none",       label: "No channel" },
] as const;

type ColourTemp = (typeof COLOUR_TEMPS)[number];
type ChannelType = (typeof CHANNEL_TYPES)[number]["value"];

interface Props {
  quoteId: number;
  initial: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerSuburb: string;
    customerState: string;
    projectLabel: string;
    colourTemp: ColourTemp;
    channelType: ChannelType;
  };
}

const fieldStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--ink)",
  border: "1px solid var(--ink-line)",
  color: "var(--bone)",
  padding: "8px 12px",
  borderRadius: "var(--radius)",
  fontSize: "0.875rem",
  fontFamily: "var(--font-body)",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.7rem",
  color: "var(--bone-dim)",
  marginBottom: "4px",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  fontFamily: "var(--font-body)",
};

export default function QuoteHeaderEditor({ quoteId, initial }: Props) {
  const [customerName,  setCustomerName]  = useState(initial.customerName);
  const [customerEmail, setCustomerEmail] = useState(initial.customerEmail);
  const [customerPhone, setCustomerPhone] = useState(initial.customerPhone);
  const [customerSuburb,setCustomerSuburb]= useState(initial.customerSuburb);
  const [customerState, setCustomerState] = useState(initial.customerState);
  const [projectLabel,  setProjectLabel]  = useState(initial.projectLabel);
  const [colourTemp,    setColourTemp]    = useState<ColourTemp>(initial.colourTemp);
  const [channelType,   setChannelType]   = useState<ChannelType>(initial.channelType);

  const [saved, setSaved]       = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [isPending, start]      = useTransition();

  function mark() { setSaved(false); }

  function handleSave() {
    if (!customerName.trim() || !customerEmail.trim() || !projectLabel.trim()) {
      setError("Name, email, and project label are required.");
      return;
    }
    setError(null);
    start(async () => {
      try {
        await updateQuoteHeader(quoteId, {
          customerName, customerEmail, customerPhone,
          customerSuburb, customerState, projectLabel,
          colourTemp, channelType,
        });
        setSaved(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Save failed.");
      }
    });
  }

  return (
    <div
      style={{
        background: "var(--ink-raised)",
        border: "1px solid var(--ink-line)",
        borderRadius: "var(--radius)",
        padding: "20px 24px",
        marginBottom: "16px",
      }}
    >
      <p className="eyebrow" style={{ marginBottom: "16px" }}>Customer &amp; Project</p>

      {/* Customer fields — 3 col */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "12px",
          marginBottom: "12px",
        }}
      >
        <div>
          <label style={labelStyle}>Name *</label>
          <input value={customerName}  onChange={e => { setCustomerName(e.target.value);  mark(); }} style={fieldStyle} />
        </div>
        <div>
          <label style={labelStyle}>Email *</label>
          <input value={customerEmail} onChange={e => { setCustomerEmail(e.target.value); mark(); }} style={fieldStyle} type="email" />
        </div>
        <div>
          <label style={labelStyle}>Phone</label>
          <input value={customerPhone} onChange={e => { setCustomerPhone(e.target.value); mark(); }} style={fieldStyle} />
        </div>
        <div>
          <label style={labelStyle}>Suburb</label>
          <input value={customerSuburb} onChange={e => { setCustomerSuburb(e.target.value); mark(); }} style={fieldStyle} />
        </div>
        <div>
          <label style={labelStyle}>State</label>
          <input value={customerState} onChange={e => { setCustomerState(e.target.value); mark(); }} style={fieldStyle} placeholder="VIC" />
        </div>
      </div>

      {/* Project fields — 3 col */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        <div>
          <label style={labelStyle}>Project label *</label>
          <input value={projectLabel} onChange={e => { setProjectLabel(e.target.value); mark(); }} style={fieldStyle} />
        </div>
        <div>
          <label style={labelStyle}>Colour temp</label>
          <select
            value={colourTemp}
            onChange={e => { setColourTemp(e.target.value as ColourTemp); mark(); }}
            style={{ ...fieldStyle, cursor: "pointer" }}
          >
            {COLOUR_TEMPS.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Channel type</label>
          <select
            value={channelType}
            onChange={e => { setChannelType(e.target.value as ChannelType); mark(); }}
            style={{ ...fieldStyle, cursor: "pointer" }}
          >
            {CHANNEL_TYPES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p style={{ color: "var(--ember)", fontSize: "0.875rem", marginBottom: "10px" }}>
          {error}
        </p>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button
          type="button"
          onClick={handleSave}
          className="btn-outline"
          style={{ width: "auto", padding: "8px 20px", fontSize: "0.8125rem" }}
          disabled={isPending}
        >
          {isPending ? "Saving…" : "Save header"}
        </button>
        {saved && (
          <p style={{ color: "var(--bone-dim)", fontSize: "0.8125rem", fontFamily: "var(--font-body)" }}>
            Saved.
          </p>
        )}
      </div>
    </div>
  );
}
