import Image from "next/image";
import { Check } from "lucide-react";

function StraightDiagram() {
  return (
    <svg width="76" height="26" viewBox="0 0 76 26" fill="none" aria-hidden="true">
      <line
        x1="5"
        y1="13"
        x2="71"
        y2="13"
        stroke="var(--bone)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CurveDiagram() {
  return (
    <svg width="76" height="26" viewBox="0 0 76 26" fill="none" aria-hidden="true">
      <path
        d="M5 18 C 19 18, 19 8, 38 8 S 57 18, 71 8"
        stroke="var(--bone)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const rigidPoints = [
  "Aluminium channel with click-in strip mounting.",
  "For pergola beams, benchtops and straight garden edges — anywhere the line doesn't need to bend.",
  "Zero flex, zero risk of the strip sagging or pulling loose over time.",
];

const trackPoints = [
  "Segmented specifically to bend into a clean, consistent radius — garden paths, pool edges, curved pergola lines.",
  "The strip clicks directly into the track. Mechanically secured, not resting in a channel and hoping.",
  "Same strip, same connectors, same IP68 rating end to end as the rigid channel.",
];

export default function MountingSystem() {
  return (
    <section
      id="mounting"
      style={{
        background: "var(--ink)",
        borderBottom: "1px solid var(--ink-line)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="mb-16" style={{ maxWidth: "760px" }}>
          <p className="eyebrow mb-6">The mounting system</p>
          <h2
            className="font-medium"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              color: "var(--bone)",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
            }}
          >
            Straight lines are easy. Curves are the hard part.
          </h2>
          <p
            style={{
              marginTop: "16px",
              color: "var(--bone-dim)",
              fontSize: "1rem",
              lineHeight: 1.7,
              maxWidth: "620px",
            }}
          >
            Any strip lights up fine in a straight run. The hard part — the part
            most products get wrong — is a curve that still looks intentional
            five years in.
          </p>
        </div>

        {/* Two-column comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Rigid Channel */}
          <div
            className="rounded-lg p-8 flex flex-col"
            style={{
              background: "var(--ink-raised)",
              border: "1px solid var(--ink-line)",
            }}
            data-testid="mounting-rigid"
          >
            <div className="flex items-center justify-between mb-6">
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: "var(--radius)",
                  background: "transparent",
                  border: "1px solid var(--ink-line)",
                  display: "inline-flex",
                }}
              >
                <StraightDiagram />
              </div>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--bone-dim)",
                }}
              >
                For straight lines
              </span>
            </div>
            <h3
              className="font-medium mb-4"
              style={{
                fontSize: "1.375rem",
                color: "var(--bone)",
                letterSpacing: "-0.02em",
              }}
            >
              Rigid Channel
            </h3>
            <ul className="flex flex-col gap-4">
              {rigidPoints.map((point, i) => (
                <li key={i} className="flex gap-3" style={{ alignItems: "flex-start" }}>
                  <Check
                    size={18}
                    style={{ color: "var(--bone-dim)", flexShrink: 0, marginTop: "3px" }}
                  />
                  <span
                    style={{
                      fontSize: "0.9375rem",
                      color: "var(--bone-dim)",
                      lineHeight: 1.65,
                    }}
                  >
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Flexible Segmented Track */}
          <div
            className="rounded-lg p-8 flex flex-col"
            style={{
              background: "var(--ink-raised)",
              border: "1px solid var(--ink-line)",
            }}
            data-testid="mounting-track"
          >
            <div className="flex items-center justify-between mb-6">
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: "var(--radius)",
                  background: "transparent",
                  border: "1px solid var(--ink-line)",
                  display: "inline-flex",
                }}
              >
                <CurveDiagram />
              </div>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--bone-dim)",
                }}
              >
                For curves
              </span>
            </div>
            <h3
              className="font-medium mb-3"
              style={{
                fontSize: "1.375rem",
                color: "var(--bone)",
                letterSpacing: "-0.02em",
              }}
            >
              Flexible Segmented Track
            </h3>
            <p
              style={{
                fontSize: "0.9375rem",
                color: "var(--bone-dim)",
                lineHeight: 1.7,
                marginBottom: "20px",
              }}
            >
              This is the part that actually matters. Most &ldquo;flexible&rdquo;
              strip lighting just relies on the silicone sleeve bending — no
              structure, no consistent radius. It shows: uneven light spacing at
              the bend, visible strain points, and a strip that slowly works
              itself loose from whatever clip was holding it.
            </p>
            <ul className="flex flex-col gap-4">
              {trackPoints.map((point, i) => (
                <li key={i} className="flex gap-3" style={{ alignItems: "flex-start" }}>
                  <Check
                    size={18}
                    style={{ color: "var(--bone-dim)", flexShrink: 0, marginTop: "3px" }}
                  />
                  <span
                    style={{
                      fontSize: "0.9375rem",
                      color: "var(--bone)",
                      lineHeight: 1.65,
                    }}
                  >
                    {point}
                  </span>
                </li>
              ))}
            </ul>

            {/* Honesty caveat — kept visible, not fine print */}
            <div
              className="mt-6 rounded-lg"
              style={{
                padding: "14px 16px",
                background: "var(--ink)",
                border: "1px solid var(--ink-line)",
              }}
            >
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--bone)",
                  lineHeight: 1.6,
                }}
              >
                <span style={{ fontWeight: 500, color: "var(--bone)" }}>
                  Horizontal bend only.
                </span>{" "}
                This isn&apos;t a garden hose — it won&apos;t loop vertically,
                and we won&apos;t tell you it does.
              </p>
            </div>
          </div>
        </div>

        {/* Segmented track product photo */}
        <style>{`
          .track-img-outer {
            position: relative;
            overflow: hidden;
            border-radius: var(--radius);
            margin-top: 16px;
          }
          .track-img-inner {
            position: relative;
            width: 100%;
            aspect-ratio: 4 / 3;
          }
          .track-caption-overlay {
            position: absolute;
            bottom: 14px;
            right: 16px;
            z-index: 2;
            font-size: 0.625rem;
            letter-spacing: 0.12em;
            color: rgba(15, 17, 19, 0.45);
            font-family: var(--font-mono, monospace);
            text-transform: uppercase;
          }
          .track-caption-below {
            display: block;
            font-size: 0.625rem;
            letter-spacing: 0.12em;
            color: var(--bone-dim);
            font-family: var(--font-mono, monospace);
            text-transform: uppercase;
            margin-top: 8px;
          }
          @media (min-width: 768px) {
            .track-img-inner {
              aspect-ratio: 16 / 9;
            }
            .track-caption-overlay {
              bottom: 20px;
              right: 28px;
            }
            .track-caption-below {
              display: none;
            }
          }
          @media (max-width: 767px) {
            .track-caption-overlay {
              display: none;
            }
          }
        `}</style>
        <div className="track-img-outer">
          <div className="track-img-inner">
            <Image
              src="/images/product/curved-track-1600.webp"
              alt="Flexible segmented mounting track on a curve"
              fill
              sizes="(max-width: 767px) 100vw, (max-width: 1280px) 100vw, 1280px"
              style={{ objectFit: "cover", objectPosition: "center 50%" }}
              loading="lazy"
            />
            <p
              className="track-caption-overlay"
              aria-label="Segmented track — consistent radius — no strain points"
            >
              SEGMENTED TRACK. CONSISTENT RADIUS. NO STRAIN POINTS.
            </p>
          </div>
        </div>
        <p
          className="track-caption-below"
          aria-label="Segmented track — consistent radius — no strain points"
        >
          SEGMENTED TRACK. CONSISTENT RADIUS. NO STRAIN POINTS.
        </p>

        {/* Closing line */}
        <p
          style={{
            marginTop: "40px",
            fontSize: "1rem",
            color: "var(--bone-dim)",
            lineHeight: 1.75,
            maxWidth: "760px",
          }}
        >
          Pick your mounting system based on the geometry of your space, not the
          limitations of the product. Straight run: rigid channel. Curve:
          segmented track. Both take the same strip, same connectors, same IP68
          rating end to end.
        </p>
      </div>
    </section>
  );
}
