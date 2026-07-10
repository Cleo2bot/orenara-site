export default function EmberBreather() {
  return (
    <section
      id="ember-breather"
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
          <div className="img-treated">
            <img
              src="/assets/generated/breather-deck.webp"
              alt="Timber pool deck at deep dusk with a just-left table — open wine, two poured glasses and a grazing platter — warm Orenara strip lighting glowing under the deck edge and along the glass balustrade."
              loading="lazy"
              decoding="async"
              style={{ display: "block", width: "100%", height: "auto" }}
            />
          </div>
          <div aria-hidden="true" className="scrim" />
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
              Right about now.
            </p>
            <p
              style={{
                marginTop: "12px",
                fontSize: "0.9375rem",
                color: "var(--bone-dim)",
                lineHeight: 1.6,
              }}
            >
              The point in the evening this was built for.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
