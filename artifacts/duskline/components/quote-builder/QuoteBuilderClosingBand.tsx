export default function QuoteBuilderClosingBand() {
  return (
    <section
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
              src="/assets/generated/kit-customzone.webp"
              alt="Elevated view of a contemporary Australian backyard at deep dusk — path edges, garden beds, pool surround and bench underglow traced in continuous warm 2700K LED strip light, like a lighting plan come to life."
              loading="lazy"
              decoding="async"
              style={{
                display: "block",
                width: "100%",
                height: "clamp(560px, 60vw, 640px)",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </div>
          <div aria-hidden="true" className="scrim" />
          <div
            style={{
              position: "absolute",
              left: "clamp(20px, 5vw, 56px)",
              right: "clamp(20px, 5vw, 56px)",
              bottom: "clamp(28px, 5vw, 52px)",
              maxWidth: "540px",
            }}
          >
            <p className="eyebrow" style={{ marginBottom: "12px" }}>
              What counts as a zone
            </p>
            <h2
              className="font-medium"
              style={{
                fontSize: "clamp(1.375rem, 3vw, 2rem)",
                color: "var(--bone)",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
                marginBottom: "16px",
              }}
            >
              A zone is an area, not a measurement.
            </h2>
            <p
              style={{
                fontSize: "0.9375rem",
                color: "var(--bone-dim)",
                lineHeight: 1.65,
                marginBottom: "28px",
              }}
            >
              The pool surround. The pergola. The front path. One zone can hold
              several runs — the curved edge, the straight edge, the steps. Pace
              out what you can; we confirm every measurement with you before
              anything is cut.
            </p>
            <div
              className="flex flex-wrap items-center"
              style={{ gap: "20px" }}
            >
              <a href="#zone-builder" className="btn-outline">
                Add your first zone
              </a>
              <a
                href="/#how-it-works"
                style={{
                  fontSize: "0.9375rem",
                  color: "var(--bone-dim)",
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                }}
              >
                Or see how the process works
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
