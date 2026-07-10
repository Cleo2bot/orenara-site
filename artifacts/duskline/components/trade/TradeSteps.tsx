import { ClipboardList, FileCheck, Truck } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    number: "01",
    title: "Tell us the job",
    body: "Colour / glow, lengths, site location. Use the form below. Two minutes, no account, no runaround.",
  },
  {
    icon: FileCheck,
    number: "02",
    title: "We spec and price it",
    body: "Back to you within 24 hours with a firm price and a confirmed delivery date — not a range, not a maybe.",
  },
  {
    icon: Truck,
    number: "03",
    title: "Made to order, delivered to site",
    body: "Lead time confirmed at quote stage. Need it faster for a deadline? Say so in the form — we can often expedite.",
  },
];

export default function TradeSteps() {
  return (
    <section
      id="how-trade-works"
      style={{
        background: "var(--ink-raised)",
        borderTop: "1px solid var(--ink-line)",
        paddingTop: "96px",
        paddingBottom: "96px",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <p className="spec-badge mb-6" style={{ display: "inline-flex" }}>
            How trade orders work
          </p>
          <h2
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              color: "var(--bone)",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              maxWidth: "620px",
            }}
          >
            Three steps. No fluff.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 relative">
          {/* Connector line (desktop) */}
          <div
            className="hidden lg:block absolute"
            style={{
              top: "28px",
              left: "calc(33.33% + 20px)",
              right: "calc(33.33% + 20px)",
              height: "1px",
              background: "var(--ink-line)",
            }}
            aria-hidden="true"
          />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                className="relative"
                style={{
                  padding: "0 0 48px 0",
                  paddingRight: i < 2 ? "48px" : "0",
                }}
                data-testid={`trade-step-${i}`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                      border: "1px solid var(--ink-line)",
                      background: "var(--ink)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={22} style={{ color: "var(--bone-dim)" }} />
                  </div>
                  <span
                    className="spec-mono-upper"
                    style={{
                      position: "relative",
                      zIndex: 1,
                      background: "var(--ink-raised)",
                      paddingRight: "12px",
                    }}
                  >
                    Step {step.number}
                  </span>
                </div>

                <h3
                  className="mb-4"
                  style={{
                    fontSize: "1.125rem",
                    color: "var(--bone)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.3,
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ fontSize: "0.9375rem", color: "var(--bone-dim)", lineHeight: 1.75 }}>
                  {step.body}
                </p>
              </div>
            );
          })}
        </div>

        {/* Product finish image */}
        <div
          style={{
            marginTop: "16px",
            borderRadius: "var(--radius)",
            overflow: "hidden",
            border: "1px solid var(--ink-line)",
            position: "relative",
          }}
        >
          <div className="img-treated">
            <img
              src="/assets/generated/trade-sandstone-wall.png"
              alt="Continuous warm Orenara strip glow washing across a coastal sandstone retaining wall at dusk."
              style={{ display: "block", width: "100%", height: "auto" }}
            />
          </div>
          <div aria-hidden="true" className="scrim" />
          <p
            style={{
              position: "absolute",
              left: "clamp(20px, 4vw, 32px)",
              right: "clamp(20px, 4vw, 32px)",
              bottom: "22px",
              fontSize: "0.9375rem",
              color: "var(--bone)",
              letterSpacing: "-0.01em",
              lineHeight: 1.4,
            }}
          >
            One clean ribbon of light — no dots, no hot spots. The finish your client signs off on.
          </p>
        </div>
      </div>
    </section>
  );
}
