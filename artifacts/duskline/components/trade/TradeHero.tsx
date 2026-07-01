"use client";

export default function TradeHero() {
  const scrollToForm = () => {
    document.getElementById("trade-enquire")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      style={{
        background: "#15171C",
        paddingTop: "148px",
        paddingBottom: "96px",
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="spec-badge mb-6" style={{ display: "inline-flex" }}>
              Duskline Trade
            </p>
            <h1
              className="font-bold"
              style={{
                fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
                color: "#F4F1EA",
                letterSpacing: "-0.035em",
                lineHeight: 1.05,
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
                maxWidth: "560px",
              }}
            >
              Tell us what the job needs. We&apos;ll spec it, price it, and get it to site — 20
              business days as standard, faster when the deadline demands it.
            </p>

            {/* Trade / wholesale pricing callout */}
            <div
              style={{
                marginTop: "28px",
                padding: "16px 20px",
                borderRadius: "10px",
                border: "1px solid rgba(245,178,92,0.25)",
                background: "rgba(245,178,92,0.06)",
                maxWidth: "560px",
              }}
            >
              <p
                style={{
                  fontSize: "0.9375rem",
                  color: "#F4F1EA",
                  lineHeight: 1.6,
                  fontWeight: 600,
                }}
              >
                Trade &amp; wholesale pricing available — project dependent.
              </p>
              <p
                style={{
                  marginTop: "6px",
                  fontSize: "0.875rem",
                  color: "#9A9DA8",
                  lineHeight: 1.6,
                }}
              >
                The bigger the run, the sharper the number. Send the job through and we&apos;ll give
                you a real figure — not a guess.
              </p>
            </div>

            <div className="mt-8">
              <button
                onClick={scrollToForm}
                className="btn-primary"
                style={{ padding: "16px 32px", fontSize: "1rem" }}
                data-testid="hero-trade-quote-btn"
              >
                Get a Trade Quote
              </button>
              <p
                style={{
                  marginTop: "16px",
                  fontSize: "0.875rem",
                  color: "#5B6478",
                  lineHeight: 1.5,
                }}
              >
                20 business day standard lead time. Expedite available for hard deadlines.
              </p>
            </div>
          </div>

          {/* Hero image */}
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
              src="/assets/generated/trade-mansion-coast.png"
              alt="Modern coastal mansion at dusk with Duskline warm strip lighting integrated into sandstone entry steps, ocean spray beyond."
              style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(21,23,28,0) 55%, rgba(21,23,28,0.5) 100%)",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
