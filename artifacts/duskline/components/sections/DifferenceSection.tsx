import Image from "next/image";

export default function DifferenceSection() {
  return (
    <section id="difference" className="diff-section">
      <style>{`
        .diff-section {
          position: relative;
          min-height: 90vh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        /* Full-bleed image */
        .diff-image-wrap {
          position: absolute;
          inset: 0;
        }

        /* Gradient overlay — darkens left third strongly, fades right */
        .diff-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            rgba(17, 17, 19, 0.97) 0%,
            rgba(17, 17, 19, 0.88) 22%,
            rgba(17, 17, 19, 0.55) 42%,
            rgba(17, 17, 19, 0.15) 62%,
            transparent 80%
          );
          z-index: 1;
        }

        /* Copy block — sits in left third */
        .diff-content {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: 96px 24px;
          display: flex;
          align-items: center;
        }

        .diff-copy {
          max-width: 440px;
        }

        /* Bottom-right caption over the image */
        .diff-caption {
          position: absolute;
          bottom: 28px;
          right: 32px;
          z-index: 2;
          font-size: 0.625rem;
          letter-spacing: 0.12em;
          color: rgba(240, 235, 224, 0.45);
          font-family: var(--font-mono, monospace);
          text-transform: uppercase;
        }

        /* ── Mobile ──────────────────────────────────────────── */
        @media (max-width: 767px) {
          .diff-section {
            min-height: unset;
            flex-direction: column;
            align-items: stretch;
          }

          /* Image sits at top, min 50vh */
          .diff-image-wrap {
            position: relative;
            min-height: 50vh;
            flex-shrink: 0;
          }

          /* On mobile the overlay darkens bottom so caption stays legible */
          .diff-overlay {
            background: linear-gradient(
              to bottom,
              transparent 40%,
              rgba(17, 17, 19, 0.55) 100%
            );
          }

          /* Copy sits below the image on a solid background */
          .diff-content {
            position: relative;
            padding: 40px 24px 56px;
            background: var(--ink);
          }

          .diff-copy {
            max-width: 100%;
          }

          .diff-caption {
            bottom: 14px;
            right: 16px;
          }
        }
      `}</style>

      {/* Background image */}
      <div className="diff-image-wrap">
        <Image
          src="/images/product/strip-submerged.webp"
          alt="Orenara IP68 silicone LED neon strip running from poolside concrete into submerged water, glowing warm white, water droplets visible on strip surface"
          fill
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "right center" }}
          priority
        />
        {/* Gradient overlay */}
        <div className="diff-overlay" aria-hidden="true" />
        {/* Caption over image */}
        <p className="diff-caption" aria-label="IP68 — submerged — operating">
          IP68. SUBMERGED. OPERATING.
        </p>
      </div>

      {/* Copy block */}
      <div className="diff-content">
        <div className="diff-copy">
          <p className="eyebrow mb-6">The Difference</p>

          <h2
            className="font-medium"
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
              color: "var(--bone)",
              letterSpacing: "-0.03em",
              lineHeight: 1.13,
              marginBottom: "24px",
            }}
          >
            Most strip lighting is waterproof until it rains.
          </h2>

          <p
            style={{
              fontSize: "clamp(0.9375rem, 1.5vw, 1.0625rem)",
              color: "var(--bone-dim)",
              lineHeight: 1.75,
            }}
          >
            Sealed silicone, end to end. No seams, no glued joints, no ingress
            path. Orenara strip is rated IP68 — fully submersible, permanently.
            Garden beds that flood, pool edges that splash, coastal frontages
            that cop salt and summer storms. It runs through all of it because
            it was specced for exactly that.
          </p>
        </div>
      </div>
    </section>
  );
}
