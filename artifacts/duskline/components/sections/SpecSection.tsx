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
    body: "RCM (Regulatory Compliance Mark) is the current Australian and New Zealand mark for electrical equipment compliance. It replaced the old 'SAA' mark. Products entering the Australian market are required to bear the RCM mark if they're electrical goods. Some importers still reference SAA certification — that designation was retired in 2016. Duskline components carry current RCM compliance.",
    badge: "Regulatory Compliance Mark",
  },
];

export default function SpecSection() {
  return (
    <section
      id="specs"
      style={{
        background: "#15171C",
        borderTop: "1px solid rgba(91,100,120,0.2)",
        paddingTop: "96px",
        paddingBottom: "96px",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <p className="spec-badge mb-6" style={{ display: "inline-flex" }}>
            Technical specification
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
            Getting the fundamentals right.
          </h2>
          <p
            style={{
              marginTop: "16px",
              color: "#9A9DA8",
              fontSize: "1rem",
              lineHeight: 1.7,
              maxWidth: "560px",
            }}
          >
            Three specifications that determine whether outdoor lighting lasts two years
            or ten. Most products get at least one wrong.
          </p>
        </div>

        {/* IP68 proof image */}
        <div
          className="rounded-lg overflow-hidden mb-16"
          style={{
            position: "relative",
            aspectRatio: "16 / 9",
            maxHeight: "460px",
            border: "1px solid rgba(91,100,120,0.2)",
          }}
        >
          <Image
            src="/assets/generated/spec-rain-green.png"
            alt="Duskline outdoor LED strip lighting a curved garden path in rich emerald-green while rain falls, water beading on the sealed silicone sleeve and reflecting off the wet path"
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            style={{ objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "16px 20px",
              background: "linear-gradient(transparent, rgba(21,23,28,0.92))",
              fontSize: "0.8125rem",
              color: "#9A9DA8",
            }}
          >
            IP68 — running live in the rain. Rated for 1.5&nbsp;m submersion, 30&nbsp;minutes.
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
                  background: "#1F222B",
                  border: "1px solid rgba(91,100,120,0.25)",
                }}
                data-testid={`spec-card-${i}`}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "8px",
                    background: "rgba(245,178,92,0.08)",
                    border: "1px solid rgba(245,178,92,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "20px",
                  }}
                >
                  <Icon size={20} style={{ color: "#F5B25C" }} />
                </div>

                <span className="spec-badge mb-4" style={{ display: "inline-flex" }}>
                  {spec.badge}
                </span>

                <h3
                  className="font-bold mb-4 mt-4"
                  style={{
                    fontSize: "1.125rem",
                    color: "#F4F1EA",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.3,
                  }}
                >
                  {spec.headline}
                </h3>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#9A9DA8",
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
