import Image from "next/image";
import { Shield, Waves, Award } from "lucide-react";

const specs = [
  {
    icon: Shield,
    label: "IP68 Rated",
    headline: "Dust-tight. Submersion-rated.",
    body: "IP68 is the highest standard ingress protection rating defined under IEC 60529. It means completely dust-tight and rated for continuous submersion — in our case, 1.5m depth for 30 minutes. Not splash-resistant. Submersion-rated. The difference matters when a garden irrigation system floods the installation zone or a pool edge takes splash loading daily.",
    badge: "IEC 60529 · IP68",
  },
  {
    icon: Waves,
    label: "0–10V Dimming",
    headline: "Smooth, flicker-free. Professional-grade.",
    body: "0–10V is an analogue dimming protocol used in commercial and architectural lighting. It delivers smooth, linear dimming from 0% to 100% without PWM flicker — the high-frequency on/off switching that causes eye strain and shows up on camera. Cheap PWM dimmers flicker at 1,000–20,000Hz. You may not see it directly. Your camera will. And some people can feel it. 0–10V eliminates the problem entirely.",
    badge: "0–10V Analogue Protocol",
  },
  {
    icon: Award,
    label: "RCM Compliant",
    headline: "Australian regulatory compliance.",
    body: "RCM (Regulatory Compliance Mark) is the current Australian and New Zealand mark for electrical equipment compliance. It replaced the old 'SAA' mark. Products entering the Australian market are required to bear the RCM mark if they're electrical goods. Some importers still reference SAA certification — that designation was retired in 2016. Orenara components carry current RCM compliance.",
    badge: "Regulatory Compliance Mark",
  },
];

export default function SpecSection() {
  return (
    <section
      id="specs"
      style={{
        background: "var(--ink)",
        borderTop: "1px solid var(--ink-line)",
        paddingTop: "96px",
        paddingBottom: "96px",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Catalogue-style hero — heading overlaid on the proof image */}
        <div
          className="mb-16"
          style={{
            borderRadius: "var(--radius)",
            overflow: "hidden",
            border: "1px solid var(--ink-line)",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "relative",
              aspectRatio: "16 / 9",
              maxHeight: "460px",
              minHeight: "clamp(380px, 60vw, 460px)",
            }}
          >
            <Image
              src="/assets/generated/spec-cove-green.png"
              alt="Orenara continuous dot-free LED lighting concealed beneath a sandstone coping, casting an even emerald-green glow over a wet terrazzo path with lush tropical foliage leaning in as rain falls"
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background: "color-mix(in srgb, var(--ink) 55%, transparent)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "clamp(20px, 5vw, 56px)",
              top: "50%",
              transform: "translateY(-50%)",
              maxWidth: "540px",
            }}
          >
            <p className="eyebrow mb-6">Technical specification</p>
            <h2
              className="font-medium"
              style={{
                fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)",
                color: "var(--bone)",
                letterSpacing: "-0.03em",
                lineHeight: 1.15,
              }}
            >
              Getting the fundamentals right.
            </h2>
            <p
              style={{
                marginTop: "16px",
                color: "var(--bone-dim)",
                fontSize: "0.9375rem",
                lineHeight: 1.6,
                maxWidth: "440px",
              }}
            >
              Three specifications that determine whether outdoor lighting lasts two years
              or ten. Most products get at least one wrong.
            </p>
          </div>
        </div>

        {/* Spec cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {specs.map((spec, i) => {
            const Icon = spec.icon;
            return (
              <div
                key={i}
                className="rounded-lg p-8"
                style={{
                  background: "var(--ink-raised)",
                  border: "1px solid var(--ink-line)",
                }}
                data-testid={`spec-card-${i}`}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "var(--radius)",
                    background: "transparent",
                    border: "1px solid var(--ink-line)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "20px",
                  }}
                >
                  <Icon size={20} style={{ color: "var(--bone-dim)" }} />
                </div>

                <span className="spec-badge mb-4" style={{ display: "inline-flex" }}>
                  {spec.badge}
                </span>

                <h3
                  className="font-medium mb-4 mt-4"
                  style={{
                    fontSize: "1.125rem",
                    color: "var(--bone)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.3,
                  }}
                >
                  {spec.headline}
                </h3>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--bone-dim)",
                    lineHeight: 1.75,
                  }}
                >
                  {spec.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
