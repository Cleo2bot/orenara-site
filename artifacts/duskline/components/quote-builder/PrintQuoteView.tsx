"use client";

import { useEffect, useState } from "react";
import { PART_NUMBERS, type QuoteZoneCalculated, type QuoteTotals } from "@/lib/quoteCalc";

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
}

const rule = { border: "none", borderTop: "1px solid #ccc", margin: "16px 0" };

export default function PrintQuoteView({ zones, totals, contact, partLabels }: PrintQuoteViewProps) {
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
    <div className="print-only" style={{ color: "#15171C", fontFamily: "Inter, system-ui, sans-serif", padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em" }}>duskline</div>
          <div style={{ fontSize: "0.75rem", color: "#D4913A", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: "4px" }}>
            Quote Request Summary
          </div>
        </div>
        <div style={{ textAlign: "right", fontSize: "0.8125rem", color: "#555" }}>
          <div>Generated {generatedDate}</div>
        </div>
      </div>

      <hr style={{ ...rule, borderTopColor: "#D4913A", borderTopWidth: "2px" }} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 24px", fontSize: "0.875rem", marginBottom: "8px" }}>
        <div><strong>Name:</strong> {contact.name || "—"}</div>
        <div><strong>Email:</strong> {contact.email || "—"}</div>
        <div><strong>Phone:</strong> {contact.phone || "—"}</div>
        <div><strong>Suburb / State:</strong> {contact.suburb || "—"}</div>
        <div><strong>Timeline:</strong> {contact.timeline || "—"}</div>
        <div><strong>Kit:</strong> Custom Zone Kit ({PART_NUMBERS.kits["Custom Zone Kit"]})</div>
      </div>

      <hr style={rule} />

      <div style={{ fontSize: "0.875rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#15171C", marginBottom: "12px" }}>
        1. Zone breakdown
      </div>

      {validZones.map((zone, i) => (
        <div key={i} style={{ marginBottom: "18px", pageBreakInside: "avoid" }}>
          <div style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "4px" }}>
            {i + 1}.{"  "}
            {zone.name}
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #ccc" }}>
                <th style={{ textAlign: "left", padding: "4px 8px 4px 0", fontWeight: 600, color: "#555" }}>Run</th>
                <th style={{ textAlign: "left", padding: "4px 8px", fontWeight: 600, color: "#555" }}>Length</th>
                <th style={{ textAlign: "left", padding: "4px 8px", fontWeight: 600, color: "#555" }}>Shape</th>
                <th style={{ textAlign: "left", padding: "4px 0 4px 8px", fontWeight: 600, color: "#555" }}>Mounting part</th>
              </tr>
            </thead>
            <tbody>
              {zone.runs.map((run, ri) => (
                <tr key={ri} style={{ borderBottom: "1px solid #eee" }}>
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

          <div style={{ fontSize: "0.8125rem", marginTop: "8px", color: "#333" }}>
            <strong>Total run length:</strong> {zone.totalLengthMetres}m &nbsp;|&nbsp;{" "}
            <strong>Required parts:</strong> {zone.driversNeeded}x {partLabels.driver} ({PART_NUMBERS.driver}),{" "}
            {zone.dimmersNeeded}x {partLabels.dimmer} ({PART_NUMBERS.dimmer}), {zone.plugsNeeded}x {partLabels.plug} (
            {PART_NUMBERS.plug})
          </div>
          {zone.runs.length > 1 && (
            <div style={{ fontSize: "0.75rem", color: "#777", marginTop: "4px", fontStyle: "italic" }}>
              Driver count assumes all runs in this zone are wired together on a shared power feed.
            </div>
          )}
          {zone.note && (
            <div style={{ fontSize: "0.75rem", color: "#777", marginTop: "4px" }}>Note: {zone.note}</div>
          )}
        </div>
      ))}

      <hr style={rule} />

      <div style={{ fontSize: "0.875rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#15171C", marginBottom: "12px" }}>
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
            <tr key={label as string} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "6px 8px 6px 0" }}>{label}</td>
              <td style={{ padding: "6px 8px", color: "#777" }}>{partNumber}</td>
              <td style={{ padding: "6px 0", textAlign: "right", fontWeight: 700 }}>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr style={rule} />

      <div style={{ fontSize: "0.75rem", color: "#555", lineHeight: 1.6 }}>
        Pricing is enquiry-only. Contact hello@duskline.com.au to confirm pricing and lead time.
        <br />
        duskline.com.au
      </div>
    </div>
  );
}
