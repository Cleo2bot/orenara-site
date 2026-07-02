"use client";

import { Trash2, Plus } from "lucide-react";
import type { ZoneShape } from "@/lib/quoteCalc";

export interface RunFormState {
  id: string;
  lengthMetres: string;
  shape: ZoneShape;
}

export interface ZoneFormState {
  id: string;
  name: string;
  note: string;
  runs: RunFormState[];
}

interface ZoneCardProps {
  zone: ZoneFormState;
  placeholder: string;
  index: number;
  onChange: (id: string, patch: Partial<ZoneFormState>) => void;
  onRemove: (id: string) => void;
  onRunChange: (zoneId: string, runId: string, patch: Partial<RunFormState>) => void;
  onAddRun: (zoneId: string) => void;
  onRemoveRun: (zoneId: string, runId: string) => void;
  summary: string | null;
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.8125rem",
  fontWeight: 600,
  color: "#9A9DA8",
  marginBottom: "8px",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
};

export default function ZoneCard({
  zone,
  placeholder,
  index,
  onChange,
  onRemove,
  onRunChange,
  onAddRun,
  onRemoveRun,
  summary,
}: ZoneCardProps) {
  return (
    <div
      className="rounded-lg p-6"
      style={{ background: "#1F222B", border: "1px solid rgba(91,100,120,0.25)" }}
      data-testid={`zone-card-${index}`}
    >
      <div className="flex items-start justify-between gap-4 mb-5">
        <div style={{ flex: 1 }}>
          <label htmlFor={`zone-name-${zone.id}`} style={labelStyle}>
            Zone name
          </label>
          <input
            id={`zone-name-${zone.id}`}
            className="enquiry-input"
            type="text"
            placeholder={placeholder}
            value={zone.name}
            onChange={(e) => onChange(zone.id, { name: e.target.value })}
            data-testid={`zone-name-input-${index}`}
          />
        </div>
        <button
          type="button"
          onClick={() => onRemove(zone.id)}
          aria-label={`Remove ${zone.name || placeholder}`}
          data-testid={`zone-remove-${index}`}
          style={{
            marginTop: "32px",
            flexShrink: 0,
            background: "transparent",
            border: "1px solid rgba(91,100,120,0.35)",
            borderRadius: "6px",
            padding: "10px",
            cursor: "pointer",
            color: "#9A9DA8",
            transition: "color 0.15s ease, border-color 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#EF4444";
            e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#9A9DA8";
            e.currentTarget.style.borderColor = "rgba(91,100,120,0.35)";
          }}
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="flex flex-col gap-4 mb-5">
        {zone.runs.map((run, runIndex) => (
          <div
            key={run.id}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
            style={
              zone.runs.length > 1
                ? { paddingBottom: "16px", borderBottom: "1px dashed rgba(91,100,120,0.2)" }
                : undefined
            }
          >
            <div>
              <label htmlFor={`zone-run-length-${run.id}`} style={labelStyle}>
                Run length (metres){zone.runs.length > 1 ? ` — run ${runIndex + 1}` : ""}
              </label>
              <input
                id={`zone-run-length-${run.id}`}
                className="enquiry-input"
                type="number"
                min={0}
                step={0.5}
                placeholder="e.g. 14"
                value={run.lengthMetres}
                onChange={(e) => onRunChange(zone.id, run.id, { lengthMetres: e.target.value })}
                data-testid={`zone-run-length-input-${index}-${runIndex}`}
              />
            </div>

            <div className="flex items-end gap-3">
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Shape</label>
                <div className="flex gap-2">
                  {(["straight", "curved"] as ZoneShape[]).map((shape) => {
                    const active = run.shape === shape;
                    return (
                      <button
                        key={shape}
                        type="button"
                        onClick={() => onRunChange(zone.id, run.id, { shape })}
                        data-testid={`zone-run-shape-${shape}-${index}-${runIndex}`}
                        aria-pressed={active}
                        style={{
                          flex: 1,
                          padding: "12px 16px",
                          borderRadius: "6px",
                          border: active ? "1px solid rgba(245,178,92,0.5)" : "1px solid rgba(91,100,120,0.4)",
                          background: active ? "rgba(245,178,92,0.1)" : "rgba(37,40,49,0.8)",
                          color: active ? "#F5B25C" : "#9A9DA8",
                          fontSize: "0.9375rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          textTransform: "capitalize",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {shape}
                      </button>
                    );
                  })}
                </div>
              </div>
              {zone.runs.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveRun(zone.id, run.id)}
                  aria-label={`Remove run ${runIndex + 1}`}
                  data-testid={`zone-run-remove-${index}-${runIndex}`}
                  style={{
                    flexShrink: 0,
                    background: "transparent",
                    border: "1px solid rgba(91,100,120,0.35)",
                    borderRadius: "6px",
                    padding: "12px",
                    cursor: "pointer",
                    color: "#9A9DA8",
                  }}
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => onAddRun(zone.id)}
          className="btn-outline"
          style={{ width: "auto", alignSelf: "flex-start", padding: "8px 14px", fontSize: "0.8125rem" }}
          data-testid={`zone-add-run-${index}`}
        >
          <Plus size={14} />
          Add another run to this zone
        </button>
      </div>

      <div>
        <label htmlFor={`zone-note-${zone.id}`} style={labelStyle}>
          Note <span style={{ color: "#5B6478", fontWeight: 400, textTransform: "none", letterSpacing: "normal" }}>(optional)</span>
        </label>
        <textarea
          id={`zone-note-${zone.id}`}
          className="enquiry-input"
          rows={2}
          placeholder="Anything odd about this zone…"
          value={zone.note}
          onChange={(e) => onChange(zone.id, { note: e.target.value })}
          style={{ resize: "vertical", minHeight: "56px" }}
          data-testid={`zone-note-input-${index}`}
        />
      </div>

      {summary && (
        <p
          className="mt-4"
          style={{ fontSize: "0.875rem", color: "#F5B25C", fontWeight: 500 }}
          data-testid={`zone-summary-${index}`}
        >
          {summary}
        </p>
      )}

      {zone.runs.length > 1 && (
        <p className="mt-2" style={{ fontSize: "0.75rem", color: "#5B6478", lineHeight: 1.5 }}>
          Driver count assumes all runs in this zone are wired together. If your runs need separate power feeds, let
          us know in the notes.
        </p>
      )}
    </div>
  );
}
