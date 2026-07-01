import { AlertTriangle, Droplets, Sun, Zap } from "lucide-react";

const failures = [
  {
    icon: Droplets,
    title: "IP65/66 is not enough.",
    body: "Most imported strip lighting is rated IP65 or IP66 — dust and splash resistant. That's adequate indoors. Outdoors in Australia, it isn't. Water finds its way in through connector joints, end caps, and micro-cracks in the silicone sleeve. IP65/66 fails in conditions that IP68 handles without issue.",
  },
  {
    icon: Sun,
    title: "UV and heat degrade standard silicone.",
    body: "Australian summer UV intensity is among the highest in the world. Standard silicone sleeves yellow, crack, and allow moisture ingress within 18–24 months. The failure isn't the LEDs — it's the housing that was never rated for the exposure.",
  },
  {
    icon: AlertTriangle,
    title: "Connector corrosion is the silent killer.",
    body: "Coastal properties add salt air to the equation. Unprotected connectors corrode at the contact points. Voltage drops. Sections go dark. The strip looks fine — the connectors aren't. IP68 end-to-end means sealed from the driver to the terminal.",
  },
];

export default function ProblemSection() {
  return (
    <section
      id="problem"
      style={{
        background: "#15171C",
        borderTop: "1px solid rgba(91,100,120,0.2)",
        borderBottom: "1px solid rgba(91,100,120,0.2)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Section label */}
        <div className="mb-16">
          <p
            className="spec-badge mb-6"
            style={{ display: "inline-flex" }}
          >
            The problem
          </p>
          <h2
            className="font-bold"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              color: "#F4F1EA",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              maxWidth: "640px",
            }}
          >
            Why most outdoor strip lighting fails in Australia.
          </h2>
        </div>

        {/* Failure points */}
        <div
          className="grid gap-0"
          style={{ borderTop: "1px solid rgba(91,100,120,0.2)" }}
        >
          {failures.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="flex gap-6 py-10"
                style={{
                  borderBottom: "1px solid rgba(91,100,120,0.2)",
                  alignItems: "flex-start",
                }}
                data-testid={`problem-item-${i}`}
              >
                {/* Number */}
                <div
                  style={{
                    flexShrink: 0,
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    border: "1px solid rgba(245,178,92,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.8125rem",
                    fontWeight: 700,
                    color: "#F5B25C",
                    marginTop: "2px",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="flex items-center gap-3 mb-3">
                    <Icon
                      size={18}
                      style={{ color: "#F5B25C", flexShrink: 0 }}
                    />
                    <h3
                      className="font-semibold"
                      style={{
                        fontSize: "1.0625rem",
                        color: "#F4F1EA",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {item.title}
                    </h3>
                  </div>
                  <p
                    style={{
                      fontSize: "0.9375rem",
                      color: "#9A9DA8",
                      lineHeight: 1.75,
                      maxWidth: "680px",
                    }}
                  >
                    {item.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Resolution statement */}
        <div
          className="mt-12 p-8 rounded-lg"
          style={{
            background: "rgba(245,178,92,0.05)",
            border: "1px solid rgba(245,178,92,0.2)",
          }}
        >
          <div className="flex items-start gap-4">
            <Zap size={22} style={{ color: "#F5B25C", flexShrink: 0, marginTop: "2px" }} />
            <div>
              <p
                className="font-semibold mb-2"
                style={{ color: "#F4F1EA", fontSize: "1rem" }}
              >
                Duskline is IP68 — end to end.
              </p>
              <p style={{ color: "#9A9DA8", fontSize: "0.9375rem", lineHeight: 1.7 }}>
                Dust-tight, submersion-rated to 1.5m for 30 minutes. Every component in the
                system — strip, connectors, end caps — carries the same rating. Not just the
                strip itself. That's what proper outdoor-rated means.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
