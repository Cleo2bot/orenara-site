import Image from "next/image";
import { MessageSquare, FileCheck, Package } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    number: "01",
    title: "Enquire",
    body: "Tell us about your space — which kit you're interested in, the approximate scope, and your location. Use the form below. We respond within 1–2 business days with pricing and a confirmed lead time.",
  },
  {
    icon: FileCheck,
    number: "02",
    title: "We confirm spec, pricing, and lead time",
    body: "Once we understand the scope, we'll confirm the exact specification, quote a price, and lock in lead time. No vague estimates. You'll know exactly what you're ordering before you commit.",
  },
  {
    icon: Package,
    number: "03",
    title: "Made to order. Shipped to you.",
    body: "Your order is manufactured to spec and dispatched direct to you. Current lead time is 20 business days from order confirmation — not from enquiry. We'll keep you updated through the process. Orenara supplies the system; your electrician handles installation.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      style={{
        background: "#1F222B",
        borderTop: "1px solid rgba(91,100,120,0.2)",
        paddingTop: "96px",
        paddingBottom: "96px",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Catalogue-style hero — heading overlaid on the image */}
        <div
          className="glow-amber mb-16"
          style={{
            borderRadius: "16px",
            overflow: "hidden",
            border: "1px solid rgba(245,178,92,0.2)",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "relative",
              aspectRatio: "16 / 9",
              maxHeight: "420px",
              minHeight: "clamp(320px, 56vw, 420px)",
            }}
          >
            <Image
              src="/assets/generated/how-it-works.png"
              alt="Outdoor alfresco entertaining area at dusk lit with warm amber LED strip lighting"
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
              background:
                "linear-gradient(90deg, rgba(21,23,28,0.9) 0%, rgba(21,23,28,0.4) 55%, rgba(21,23,28,0.05) 100%)",
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
            <p className="spec-badge mb-6" style={{ display: "inline-flex" }}>
              How it works
            </p>
            <h2
              className="font-bold"
              style={{
                fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)",
                color: "#F4F1EA",
                letterSpacing: "-0.03em",
                lineHeight: 1.15,
              }}
            >
              Simple process. Honest lead times.
            </h2>
          </div>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 relative">
          {/* Connector line (desktop) */}
          <div
            className="hidden lg:block absolute"
            style={{
              top: "28px",
              left: "calc(33.33% + 20px)",
              right: "calc(33.33% + 20px)",
              height: "1px",
              background:
                "linear-gradient(90deg, rgba(245,178,92,0.4), rgba(245,178,92,0.2))",
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
                data-testid={`step-${i}`}
              >
                {/* Step number + icon */}
                <div className="flex items-center gap-4 mb-6">
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
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
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "#F5B25C",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    Step {step.number}
                  </span>
                </div>

                <h3
                  className="font-bold mb-4"
                  style={{
                    fontSize: "1.125rem",
                    color: "#F4F1EA",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.3,
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.9375rem",
                    color: "#9A9DA8",
                    lineHeight: 1.75,
                  }}
                >
                  {step.body}
                </p>
              </div>
            );
          })}
        </div>

        {/* Lead time callout */}
        <div
          className="mt-4 p-6 rounded-lg flex items-start gap-4"
          style={{
            background: "rgba(21,23,28,0.6)",
            border: "1px solid rgba(91,100,120,0.25)",
          }}
        >
          <Package size={20} style={{ color: "#5B6478", flexShrink: 0, marginTop: "2px" }} />
          <div>
            <p
              className="font-semibold mb-1"
              style={{ color: "#F4F1EA", fontSize: "0.9375rem" }}
            >
              20 business day lead time — set the right expectation from the start.
            </p>
            <p style={{ color: "#9A9DA8", fontSize: "0.875rem", lineHeight: 1.7 }}>
              This is a made-to-order product. We don't hold stock. The lead time runs from
              confirmed order — not from first enquiry. If your project has a hard deadline,
              tell us in your enquiry and we'll factor it into the conversation.
              Orenara is supply-only; we don&apos;t offer installation services.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
