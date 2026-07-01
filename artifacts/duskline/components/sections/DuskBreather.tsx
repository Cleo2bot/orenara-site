export default function DuskBreather() {
  return (
    <section
      id="dusk-breather"
      style={{
        background: "#15171C",
        borderTop: "1px solid rgba(91,100,120,0.2)",
        paddingTop: "96px",
        paddingBottom: "96px",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div
          className="glow-amber"
          style={{
            borderRadius: "16px",
            overflow: "hidden",
            border: "1px solid rgba(245,178,92,0.2)",
            position: "relative",
          }}
        >
          <img
            src="/assets/generated/home-dusk-empty-deck.png"
            alt="Empty outdoor deck and pool at deep dusk, warm Duskline strip lighting glowing along the deck edge and pool surround as the dominant light source, house lit softly behind."
            style={{ display: "block", width: "100%", height: "auto" }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(90deg, rgba(21,23,28,0.8) 0%, rgba(21,23,28,0.2) 55%, rgba(21,23,28,0) 100%)",
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
              className="font-bold"
              style={{
                fontSize: "clamp(1.25rem, 3vw, 2rem)",
                color: "#F4F1EA",
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
                color: "#C9CCD4",
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
