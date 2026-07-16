"use client";

import { useRef, useState, useTransition } from "react";
import { createQuote } from "@/lib/admin/actions";
import { logoutAction } from "@/app/admin/login/actions";

const AU_STATES = ["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"];

type RunDraft = { id: string; label: string; lengthMetres: string };
type ZoneDraft = { id: string; name: string; runs: RunDraft[] };

function uid() {
  return Math.random().toString(36).slice(2);
}

function defaultZone(): ZoneDraft {
  return { id: uid(), name: "", runs: [{ id: uid(), label: "", lengthMetres: "" }] };
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--ink-raised)",
  border: "1px solid var(--ink-line)",
  color: "var(--bone)",
  padding: "10px 14px",
  borderRadius: "var(--radius)",
  fontSize: "0.9rem",
  fontFamily: "var(--font-body)",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.75rem",
  color: "var(--bone-dim)",
  marginBottom: "5px",
  fontFamily: "var(--font-body)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const sectionStyle: React.CSSProperties = {
  background: "var(--ink-raised)",
  border: "1px solid var(--ink-line)",
  borderRadius: "var(--radius)",
  padding: "24px",
  marginBottom: "16px",
};

export default function QuoteForm() {
  const [zones, setZones] = useState<ZoneDraft[]>([defaultZone()]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function addZone() {
    setZones((z) => [...z, defaultZone()]);
  }

  function removeZone(zoneId: string) {
    setZones((z) => z.filter((x) => x.id !== zoneId));
  }

  function updateZone(zoneId: string, name: string) {
    setZones((z) => z.map((x) => (x.id === zoneId ? { ...x, name } : x)));
  }

  function addRun(zoneId: string) {
    setZones((z) =>
      z.map((x) =>
        x.id === zoneId
          ? { ...x, runs: [...x.runs, { id: uid(), label: "", lengthMetres: "" }] }
          : x
      )
    );
  }

  function removeRun(zoneId: string, runId: string) {
    setZones((z) =>
      z.map((x) =>
        x.id === zoneId ? { ...x, runs: x.runs.filter((r) => r.id !== runId) } : x
      )
    );
  }

  function updateRun(
    zoneId: string,
    runId: string,
    field: "label" | "lengthMetres",
    value: string
  ) {
    setZones((z) =>
      z.map((x) =>
        x.id === zoneId
          ? {
              ...x,
              runs: x.runs.map((r) =>
                r.id === runId ? { ...r, [field]: value } : r
              ),
            }
          : x
      )
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    for (const zone of zones) {
      if (!zone.name.trim()) {
        setError("Every zone needs a name.");
        return;
      }
      for (const run of zone.runs) {
        if (!run.label.trim()) {
          setError("Every run needs a label.");
          return;
        }
        const len = parseFloat(run.lengthMetres);
        if (!run.lengthMetres.trim() || isNaN(len) || len <= 0) {
          setError("Every run needs a valid length in metres.");
          return;
        }
      }
    }

    const fd = new FormData(formRef.current!);
    fd.set(
      "zones",
      JSON.stringify(
        zones.map((z) => ({
          name: z.name,
          runs: z.runs.map((r) => ({ label: r.label, lengthMetres: r.lengthMetres })),
        }))
      )
    );

    startTransition(() => {
      createQuote(fd).catch((err: unknown) => {
        if (err instanceof Error && err.message !== "NEXT_REDIRECT") {
          setError(err.message);
        }
      });
    });
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--ink)", color: "var(--bone)" }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 32px",
          borderBottom: "1px solid var(--ink-line)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <a
            href="/admin"
            style={{
              color: "var(--bone-dim)",
              textDecoration: "none",
              fontSize: "0.8125rem",
              fontFamily: "var(--font-body)",
            }}
          >
            ← Admin
          </a>
          <span className="wordmark" style={{ fontSize: "15px" }}>
            Orenara
          </span>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            style={{
              background: "transparent",
              border: "none",
              color: "var(--bone-dim)",
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              cursor: "pointer",
            }}
          >
            Log out
          </button>
        </form>
      </header>

      <main style={{ maxWidth: "720px", margin: "0 auto", padding: "40px 24px" }}>
        <p className="eyebrow" style={{ marginBottom: "8px" }}>
          New Quote
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            fontSize: "1.5rem",
            margin: "0 0 32px",
          }}
        >
          Create Quote
        </h1>

        <form ref={formRef} onSubmit={handleSubmit} noValidate>
          {/* Customer */}
          <div style={sectionStyle}>
            <p className="eyebrow" style={{ marginBottom: "16px" }}>
              Customer
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Customer type</label>
                <select name="customerType" required style={inputStyle}>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Name *</label>
                <input name="customerName" required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email *</label>
                <input name="customerEmail" type="email" required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Phone</label>
                <input name="customerPhone" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Suburb</label>
                <input name="customerSuburb" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>State</label>
                <select name="customerState" style={inputStyle}>
                  <option value="">—</option>
                  {AU_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Project */}
          <div style={sectionStyle}>
            <p className="eyebrow" style={{ marginBottom: "16px" }}>
              Project
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Project label *</label>
                <input
                  name="projectLabel"
                  required
                  placeholder="e.g. Pool perimeter — East Village"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Colour temperature</label>
                <select name="colourTemp" style={inputStyle}>
                  <option value="TBC">TBC</option>
                  <option value="2700K">2700K — Warm White</option>
                  <option value="3000K">3000K — Warm White</option>
                  <option value="4000K">4000K — Neutral White</option>
                  <option value="5700K">5700K — Cool White</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Channel</label>
                <select name="channelType" style={inputStyle}>
                  <option value="none">None (reuse existing)</option>
                  <option value="OR-CHN-RGD">OR-CHN-RGD — Rigid, straight</option>
                  <option value="OR-CHN-FLX">OR-CHN-FLX — Segmented, curves</option>
                  <option value="OR-CHN-SS">OR-CHN-SS — Stainless, recessed</option>
                </select>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Internal notes</label>
                <textarea
                  name="notes"
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>
            </div>
          </div>

          {/* Zones + Runs */}
          <div style={sectionStyle}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <p className="eyebrow">Zones &amp; Runs</p>
              <button
                type="button"
                onClick={addZone}
                className="btn-outline"
                style={{ width: "auto", padding: "7px 16px", fontSize: "0.75rem" }}
              >
                + Add zone
              </button>
            </div>

            {zones.map((zone, zi) => (
              <div
                key={zone.id}
                style={{
                  border: "1px solid var(--ink-line)",
                  borderRadius: "var(--radius)",
                  padding: "16px",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "14px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Zone {zi + 1} name *</label>
                    <input
                      value={zone.name}
                      onChange={(e) => updateZone(zone.id, e.target.value)}
                      placeholder="e.g. Pool surround"
                      style={inputStyle}
                    />
                  </div>
                  {zones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeZone(zone.id)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "var(--bone-dim)",
                        cursor: "pointer",
                        fontSize: "1rem",
                        padding: "4px",
                        marginTop: "18px",
                      }}
                      title="Remove zone"
                    >
                      ×
                    </button>
                  )}
                </div>

                <div style={{ paddingLeft: "8px" }}>
                  {zone.runs.map((run, ri) => (
                    <div
                      key={run.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 120px auto",
                        gap: "10px",
                        alignItems: "end",
                        marginBottom: "10px",
                      }}
                    >
                      <div>
                        <label style={labelStyle}>Run {ri + 1} label *</label>
                        <input
                          value={run.label}
                          onChange={(e) =>
                            updateRun(zone.id, run.id, "label", e.target.value)
                          }
                          placeholder="e.g. North edge"
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Length (m) *</label>
                        <input
                          value={run.lengthMetres}
                          onChange={(e) =>
                            updateRun(zone.id, run.id, "lengthMetres", e.target.value)
                          }
                          placeholder="0.0"
                          style={inputStyle}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeRun(zone.id, run.id)}
                        disabled={zone.runs.length === 1}
                        style={{
                          background: "transparent",
                          border: "none",
                          color:
                            zone.runs.length === 1
                              ? "var(--ink-line)"
                              : "var(--bone-dim)",
                          cursor: zone.runs.length === 1 ? "default" : "pointer",
                          fontSize: "1rem",
                          padding: "10px 4px",
                        }}
                        title="Remove run"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addRun(zone.id)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--bone-dim)",
                      cursor: "pointer",
                      fontSize: "0.8125rem",
                      fontFamily: "var(--font-body)",
                      padding: "4px 0",
                      textDecoration: "underline",
                    }}
                  >
                    + add run
                  </button>
                </div>
              </div>
            ))}
          </div>

          {error && (
            <p
              style={{
                color: "var(--ember)",
                fontSize: "0.875rem",
                marginBottom: "12px",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%" }}
            disabled={isPending}
          >
            {isPending ? "Generating BOM…" : "Create quote and generate BOM"}
          </button>
        </form>
      </main>
    </div>
  );
}
