export default function OutcomeSection() {
  return (
    <section
      id="outcome"
      style={{
        background: "var(--ink)",
        borderTop: "1px solid var(--ink-line)",
        paddingTop: "96px",
        paddingBottom: "96px",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div
          style={{
            borderRadius: "var(--radius)",
            overflow: "hidden",
            border: "1px solid var(--ink-line)",
            position: "relative",
          }}
        >
          <img
            src="/assets/generated/home-outcome-deck.png"
            alt="Family and friends relaxing on an outdoor deck by a pool at dusk, warm Orenara strip lighting glowing along the deck edge and pergola, house lit warm behind."
            style={{ display: "block", width: "100%", height: "auto" }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background: "color-mix(in srgb, var(--ink) 55%, transparent)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "clamp(20px, 5vw, 56px)",
              top: "50%",
              transform: "translateY(-50%)",
              maxWidth: "460px",
            }}
          >
            <p
              className="font-medium"
              style={{
                fontSize: "clamp(1.25rem, 3vw, 2rem)",
                color: "var(--bone)",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              This is what it&apos;s for.
            </p>
            <p
              style={{
                marginTop: "12px",
                fontSize: "0.9375rem",
                color: "var(--bone-dim)",
                lineHeight: 1.6,
              }}
            >
              Not for show. For nights exactly like this one.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
