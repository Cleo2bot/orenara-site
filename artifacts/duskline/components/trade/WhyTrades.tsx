import { ShieldCheck, BadgeCheck, CalendarClock, PackageCheck } from "lucide-react";

const reasons = [
  {
    icon: ShieldCheck,
    title: "IP68 end to end",
    body: "You're not going back to this job in a wet season. Sealed strip, sealed connectors, sealed joins.",
  },
  {
    icon: BadgeCheck,
    title: "RCM compliant",
    body: "Clean to sign off. No compliance headache, no awkward conversation with the client's sparky.",
  },
  {
    icon: CalendarClock,
    title: "Firm lead times, not vague estimates",
    body: "Confirmed at quote stage — a firm date, not a range. We say a date, we mean it.",
  },
  {
    icon: PackageCheck,
    title: "Pre-specced kits",
    body: "Strip, driver and dimmer matched before it ships. Less to get wrong on install day.",
  },
];

export default function WhyTrades() {
  return (
    <section
      id="why-trades"
      style={{
        background: "var(--ink)",
        borderTop: "1px solid var(--ink-line)",
        paddingTop: "96px",
        paddingBottom: "96px",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <p className="spec-badge mb-6" style={{ display: "inline-flex" }}>
            Why trades order from Orenara
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
            You know the spec. We just deliver it properly.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reasons.map((reason, i) => {
            const Icon = reason.icon;
            return (
              <div
                key={i}
                className="flex items-start gap-5 p-7 rounded-lg"
                style={{
                  background: "var(--ink-raised)",
                  border: "1px solid var(--ink-line)",
                }}
                data-testid={`why-trade-${i}`}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "var(--radius)",
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
                <div>
                  <h3
                    className="mb-2"
                    style={{
                      fontSize: "1.0625rem",
                      color: "var(--bone)",
                      letterSpacing: "-0.01em",
                      lineHeight: 1.3,
                    }}
                  >
                    {reason.title}
                  </h3>
                  <p style={{ fontSize: "0.9375rem", color: "var(--bone-dim)", lineHeight: 1.7 }}>
                    {reason.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Awe shot */}
        <div
          style={{
            marginTop: "56px",
            borderRadius: "var(--radius)",
            overflow: "hidden",
            border: "1px solid var(--ink-line)",
            position: "relative",
          }}
        >
          <div className="img-treated">
            <img
              src="/images/gallery/orenara-waterfall-rockpond.webp"
              alt="Waterfall and rock pond water feature at night with Orenara LED strip lighting integrated into the rockwork"
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
              style={{
                fontSize: "clamp(1.25rem, 3vw, 2rem)",
                color: "var(--bone)",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              The kind of finish that wins the next job.
            </p>
            <p
              style={{
                marginTop: "12px",
                fontSize: "0.9375rem",
                color: "var(--bone-dim)",
                lineHeight: 1.6,
              }}
            >
              Spec it right once and the client&apos;s neighbours come asking who did it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
