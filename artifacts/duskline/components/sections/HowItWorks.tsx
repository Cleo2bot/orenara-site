import Image from "next/image";
import Link from "next/link";
import { LayoutGrid, FileCheck, Package } from "lucide-react";

const steps = [
  {
    icon: LayoutGrid,
    number: "01",
    title: "Configure online.",
    body: "Pick your application, size it to your space, and see the price straight away. Pool surround, staircase, garden path, custom zone — each builder is pre-loaded with the right defaults for the application.",
  },
  {
    icon: FileCheck,
    number: "02",
    title: "Confirm and we'll invoice you.",
    body: "No wait for standard configurations — confirm your order and we'll send an invoice within one business day. For anything unusual, request a review and we'll get back to you within 1–2 business days with a confirmed spec and price.",
  },
  {
    icon: Package,
    number: "03",
    title: "Made to order. Shipped to you.",
    body: "Built to your spec and dispatched direct — we'll confirm the schedule with your invoice and keep you updated through the process. Orenara supplies the system; your licensed electrician installs it.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      style={{
        background: "var(--ink)",
        borderTop: "1px solid var(--ink-line)",
        paddingTop: "96px",
        paddingBottom: "96px",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Catalogue-style hero — heading overlaid on the image */}
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
            className="img-treated"
            style={{
              aspectRatio: "16 / 9",
              maxHeight: "420px",
              minHeight: "clamp(320px, 56vw, 420px)",
            }}
          >
            <Image
              src="/assets/generated/how-it-works.webp"
              alt="Outdoor alfresco entertaining area at dusk lit with warm amber LED strip lighting"
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div aria-hidden="true" className="scrim" />
          <div
            style={{
              position: "absolute",
              left: "clamp(20px, 5vw, 56px)",
              top: "50%",
              transform: "translateY(-50%)",
              maxWidth: "540px",
            }}
          >
            <p className="eyebrow mb-6">How it works</p>
            <h2
              className="font-medium"
              style={{
                fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)",
                color: "var(--bone)",
                letterSpacing: "-0.03em",
                lineHeight: 1.15,
              }}
            >
              Simple process. No surprises.
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
                data-testid={`step-${i}`}
              >
                {/* Step number + icon */}
                <div className="flex items-center gap-4 mb-6">
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                      border: "1px solid var(--ink-line)",
                      background: "var(--ink-raised)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={22} style={{ color: "var(--bone-dim)" }} />
                  </div>
                  <span className="spec-mono-upper">
                    Step {step.number}
                  </span>
                </div>

                <h3
                  className="font-medium mb-4"
                  style={{
                    fontSize: "1.125rem",
                    color: "var(--bone)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.3,
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.9375rem",
                    color: "var(--bone-dim)",
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
            background: "var(--ink-raised)",
            border: "1px solid var(--ink-line)",
          }}
        >
          <Package size={20} style={{ color: "var(--bone-dim)", flexShrink: 0, marginTop: "2px" }} />
          <div>
            <p
              className="font-medium mb-1"
              style={{ color: "var(--bone)", fontSize: "0.9375rem" }}
            >
              Made to order, not off the shelf.
            </p>
            <p style={{ color: "var(--bone-dim)", fontSize: "0.875rem", lineHeight: 1.7 }}>
              We don&apos;t hold stock — every system is built to your spec. If your project
              has a hard deadline, tell us in your enquiry and we&apos;ll be straight with you
              about whether we can meet it. Orenara supplies the system; your licensed
              electrician installs it.
            </p>
          </div>
        </div>

        {/* Closing CTA */}
        <div style={{ marginTop: "48px" }}>
          <p
            style={{
              fontSize: "0.9375rem",
              color: "var(--bone-dim)",
              lineHeight: 1.7,
              marginBottom: "24px",
            }}
          >
            Most standard configurations price instantly online. For anything complex, use the enquiry form below.
          </p>
          <Link href="/kits" className="btn-primary">
            Build Your Kit
          </Link>
        </div>
      </div>
    </section>
  );
}
