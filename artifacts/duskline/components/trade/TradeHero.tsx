"use client";

export default function TradeHero() {
  const scrollToForm = () => {
    document.getElementById("trade-enquire")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      style={{
        background: "var(--ink)",
        paddingTop: "148px",
        paddingBottom: "96px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="max-w-7xl mx-auto px-6" style={{ position: "relative" }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="spec-badge mb-6" style={{ display: "inline-flex" }}>
              Orenara Trade
            </p>
            <h1
              style={{
                fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
                color: "var(--bone)",
                letterSpacing: "-0.035em",
                lineHeight: 1.05,
              }}
            >
              Built for tradies. Priced fast,{" "}
              <span>delivered when we say.</span>
            </h1>
            <p
              style={{
                marginTop: "24px",
                color: "var(--bone-dim)",
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
                borderRadius: "var(--radius)",
                border: "1px solid var(--ink-line)",
                background: "var(--ink-raised)",
                maxWidth: "560px",
              }}
            >
              <p
                style={{
                  fontSize: "0.9375rem",
                  color: "var(--bone)",
                  lineHeight: 1.6,
                }}
              >
                Trade &amp; wholesale pricing available — project dependent.
              </p>
              <p
                style={{
                  marginTop: "6px",
                  fontSize: "0.875rem",
                  color: "var(--bone-dim)",
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
                  color: "var(--bone-dim)",
                  lineHeight: 1.5,
                }}
              >
                20 business day standard lead time. Expedite available for hard deadlines.
              </p>
            </div>
          </div>

          {/* Hero image */}
          <div
            style={{
              borderRadius: "var(--radius)",
              overflow: "hidden",
              border: "1px solid var(--ink-line)",
              position: "relative",
            }}
          >
            <img
              src="/assets/generated/trade-mansion-coast.png"
              alt="Modern coastal mansion at dusk with Orenara warm strip lighting integrated into sandstone entry steps, ocean spray beyond."
              style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
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
          </div>
        </div>
      </div>
    </section>
  );
}
