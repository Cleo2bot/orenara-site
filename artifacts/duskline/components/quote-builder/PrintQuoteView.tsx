"use client";

import { useEffect, useState } from "react";
import { PART_NUMBERS, getKitPartNumber, type QuoteZoneCalculated, type QuoteTotals } from "@/lib/quoteCalc";

interface PrintContact {
  name: string;
  email: string;
  phone: string;
  suburb: string;
  timeline: string;
}

interface PrintQuoteViewProps {
  zones: QuoteZoneCalculated[];
  totals: QuoteTotals;
  contact: PrintContact;
  partLabels: Record<string, string>;
  kitName: string;
}

const rule = { border: "none", borderTop: "1px solid var(--print-line)", margin: "16px 0" };

export default function PrintQuoteView({ zones, totals, contact, partLabels, kitName }: PrintQuoteViewProps) {
  const validZones = zones.filter((z) => z.totalLengthMetres > 0);
  const [generatedDate, setGeneratedDate] = useState("");

  useEffect(() => {
    setGeneratedDate(
      new Date().toLocaleDateString("en-AU", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
  }, []);

  return (
    <div className="print-only" style={{ color: "var(--print-ink)", fontFamily: "system-ui, sans-serif", padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.25rem",
              fontWeight: 500,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--print-ink)",
            }}
          >
            ORENARA
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--print-ink)", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: "4px" }}>
            Quote Request Summary
          </div>
        </div>
        <div style={{ textAlign: "right", fontSize: "0.8125rem", color: "var(--print-mid)" }}>
          <div>Generated {generatedDate}</div>
        </div>
      </div>

      <hr style={{ ...rule, borderTopColor: "var(--print-ink)", borderTopWidth: "2px" }} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 24px", fontSize: "0.875rem", marginBottom: "8px" }}>
        <div><strong>Name:</strong> {contact.name || "—"}</div>
        <div><strong>Email:</strong> {contact.email || "—"}</div>
        <div><strong>Phone:</strong> {contact.phone || "—"}</div>
        <div><strong>Suburb / State:</strong> {contact.suburb || "—"}</div>
        <div><strong>Timeline:</strong> {contact.timeline || "—"}</div>
        <div><strong>Kit:</strong> {kitName}{getKitPartNumber(kitName) ? ` (${getKitPartNumber(kitName)})` : ""}</div>
      </div>

      <hr style={rule} />

      <div style={{ fontSize: "0.875rem", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--print-ink)", marginBottom: "12px" }}>
        1. Zone breakdown
      </div>

      {validZones.map((zone, i) => (
        <div key={i} style={{ marginBottom: "18px", pageBreakInside: "avoid" }}>
          <div style={{ fontSize: "1rem", fontWeight: 500, marginBottom: "4px" }}>
            {i + 1}.{"  "}
            {zone.name}
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--print-line)" }}>
                <th style={{ textAlign: "left", padding: "4px 8px 4px 0", fontWeight: 500, color: "var(--print-mid)" }}>Run</th>
                <th style={{ textAlign: "left", padding: "4px 8px", fontWeight: 500, color: "var(--print-mid)" }}>Length</th>
                <th style={{ textAlign: "left", padding: "4px 8px", fontWeight: 500, color: "var(--print-mid)" }}>Shape</th>
                <th style={{ textAlign: "left", padding: "4px 0 4px 8px", fontWeight: 500, color: "var(--print-mid)" }}>Mounting part</th>
              </tr>
            </thead>
            <tbody>
              {zone.runs.map((run, ri) => (
                <tr key={ri} style={{ borderBottom: "1px solid var(--print-line-soft)" }}>
                  <td style={{ padding: "4px 8px 4px 0" }}>Run {ri + 1}</td>
                  <td style={{ padding: "4px 8px" }}>{run.lengthMetres}m</td>
                  <td style={{ padding: "4px 8px", textTransform: "capitalize" }}>{run.shape}</td>
                  <td style={{ padding: "4px 0 4px 8px" }}>
                    {run.mountingType} (
                    {run.shape === "curved" ? PART_NUMBERS.flexibleTrack : PART_NUMBERS.rigidChannel})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ fontSize: "0.8125rem", marginTop: "8px", color: "var(--print-ink)" }}>
            <strong>Total run length:</strong> {zone.totalLengthMetres}m &nbsp;|&nbsp;{" "}
            <strong>Required parts:</strong> {zone.driversNeeded}x {partLabels.driver} ({PART_NUMBERS.driver}),{" "}
            {zone.dimmersNeeded}x {partLabels.dimmer} ({PART_NUMBERS.dimmer}), {zone.plugsNeeded}x {partLabels.plug} (
            {PART_NUMBERS.plug})
          </div>
          {zone.runs.length > 1 && (
            <div style={{ fontSize: "0.75rem", color: "var(--print-faint)", marginTop: "4px" }}>
              Driver count assumes all runs in this zone are wired together on a shared power feed.
            </div>
          )}
          {zone.note && (
            <div style={{ fontSize: "0.75rem", color: "var(--print-faint)", marginTop: "4px" }}>Note: {zone.note}</div>
          )}
        </div>
      ))}

      <hr style={rule} />

      <div style={{ fontSize: "0.875rem", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--print-ink)", marginBottom: "12px" }}>
        2. Consolidated totals
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem", marginBottom: "16px" }}>
        <tbody>
          {[
            [`${partLabels.strip}`, PART_NUMBERS.strip, `${totals.stripMetres}m`],
            [`${partLabels.driver}`, PART_NUMBERS.driver, totals.drivers],
            [`${partLabels.dimmer}`, PART_NUMBERS.dimmer, totals.dimmers],
            [`${partLabels.plug}`, PART_NUMBERS.plug, totals.plugs],
            [`${partLabels.rigidChannel}`, PART_NUMBERS.rigidChannel, `${totals.rigidChannelMetres}m`],
            [`${partLabels.flexibleTrack}`, PART_NUMBERS.flexibleTrack, `${totals.flexibleTrackMetres}m`],
          ].map(([label, partNumber, value]) => (
            <tr key={label as string} style={{ borderBottom: "1px solid var(--print-line-soft)" }}>
              <td style={{ padding: "6px 8px 6px 0" }}>{label}</td>
              <td style={{ padding: "6px 8px", color: "var(--print-faint)" }}>{partNumber}</td>
              <td style={{ padding: "6px 0", textAlign: "right", fontWeight: 500 }}>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr style={rule} />

      <div style={{ fontSize: "0.75rem", color: "var(--print-mid)", lineHeight: 1.6 }}>
        Every system is built to order — allow up to 20 business days from order confirmation.
        <br />
        Pricing is enquiry-only. Contact hello@orenara.com to confirm pricing and lead time.
        <br />
        orenara.com.au
      </div>
    </div>
  );
}
