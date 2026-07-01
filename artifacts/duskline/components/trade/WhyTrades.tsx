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
    body: "20 business days standard, confirmed at quote stage. We say 20, we mean 20.",
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
        background: "#15171C",
        borderTop: "1px solid rgba(91,100,120,0.2)",
        paddingTop: "96px",
        paddingBottom: "96px",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <p className="spec-badge mb-6" style={{ display: "inline-flex" }}>
            Why trades order from Duskline
          </p>
          <h2
            className="font-bold"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              color: "#F4F1EA",
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
                  background: "#1F222B",
                  border: "1px solid rgba(91,100,120,0.2)",
                }}
                data-testid={`why-trade-${i}`}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "10px",
                    border: "1px solid rgba(245,178,92,0.3)",
                    background: "rgba(245,178,92,0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={22} style={{ color: "#F5B25C" }} />
                </div>
                <div>
                  <h3
                    className="font-bold mb-2"
                    style={{
                      fontSize: "1.0625rem",
                      color: "#F4F1EA",
                      letterSpacing: "-0.01em",
                      lineHeight: 1.3,
                    }}
                  >
                    {reason.title}
                  </h3>
                  <p style={{ fontSize: "0.9375rem", color: "#9A9DA8", lineHeight: 1.7 }}>
                    {reason.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
