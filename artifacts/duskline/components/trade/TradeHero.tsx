"use client";

export default function TradeHero() {
  const scrollToForm = () => {
    document.getElementById("trade-enquire")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      style={{
        background: "#15171C",
        paddingTop: "168px",
        paddingBottom: "104px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient amber glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "540px",
          height: "540px",
          background: "radial-gradient(circle, rgba(245,178,92,0.14) 0%, transparent 70%)",
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />

      <div className="max-w-7xl mx-auto px-6" style={{ position: "relative" }}>
        <p className="spec-badge mb-6" style={{ display: "inline-flex" }}>
          Duskline Trade
        </p>
        <h1
          className="font-bold"
          style={{
            fontSize: "clamp(2.25rem, 6vw, 4rem)",
            color: "#F4F1EA",
            letterSpacing: "-0.035em",
            lineHeight: 1.05,
            maxWidth: "900px",
          }}
        >
          Built for tradies. Priced fast,{" "}
          <span className="text-gradient-amber">delivered when we say.</span>
        </h1>
        <p
          style={{
            marginTop: "24px",
            color: "#9A9DA8",
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            lineHeight: 1.6,
            maxWidth: "620px",
          }}
        >
          Tell us what the job needs. We&apos;ll spec it, price it, and get it to site — 20
          business days as standard, faster when the deadline demands it.
        </p>

        <div className="mt-10">
          <button
            onClick={scrollToForm}
            className="btn-primary"
            style={{ padding: "16px 32px", fontSize: "1rem" }}
            data-testid="hero-trade-quote-btn"
          >
            Get a Trade Quote
          </button>
          <p style={{ marginTop: "16px", fontSize: "0.875rem", color: "#5B6478", lineHeight: 1.5 }}>
            20 business day standard lead time. Expedite available for hard deadlines.
          </p>
        </div>
      </div>
    </section>
  );
}
