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
        background: "var(--ink)",
        borderTop: "1px solid var(--ink-line)",
        borderBottom: "1px solid var(--ink-line)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Section label */}
        <div className="mb-16">
          <p className="eyebrow mb-6">The problem</p>
          <h2
            className="font-medium"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              color: "var(--bone)",
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
          style={{ borderTop: "1px solid var(--ink-line)" }}
        >
          {failures.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="flex gap-6 py-10"
                style={{
                  borderBottom: "1px solid var(--ink-line)",
                  alignItems: "flex-start",
                }}
                data-testid={`problem-item-${i}`}
              >
                {/* Number */}
                <div
                  className="spec-mono"
                  style={{
                    flexShrink: 0,
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    border: "1px solid var(--ink-line)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "2px",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="flex items-center gap-3 mb-3">
                    <Icon
                      size={18}
                      style={{ color: "var(--bone-dim)", flexShrink: 0 }}
                    />
                    <h3
                      className="font-medium"
                      style={{
                        fontSize: "1.0625rem",
                        color: "var(--bone)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {item.title}
                    </h3>
                  </div>
                  <p
                    style={{
                      fontSize: "0.9375rem",
                      color: "var(--bone-dim)",
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
            background: "var(--ink-raised)",
            border: "1px solid var(--ink-line)",
          }}
        >
          <div className="flex items-start gap-4">
            <Zap size={22} style={{ color: "var(--bone-dim)", flexShrink: 0, marginTop: "2px" }} />
            <div>
              <p
                className="font-medium mb-2"
                style={{ color: "var(--bone)", fontSize: "1rem" }}
              >
                Orenara is IP68 — end to end.
              </p>
              <p style={{ color: "var(--bone-dim)", fontSize: "0.9375rem", lineHeight: 1.7 }}>
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
