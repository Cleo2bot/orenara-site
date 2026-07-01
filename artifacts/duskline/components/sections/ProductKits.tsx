"use client";

import Image from "next/image";

const kits = [
  {
    name: "Pathway Kit",
    image: "/assets/generated/kit-pathway-coastal.png",
    tagline: "Garden edges, walkways, water features",
    description:
      "Designed for ground-level and near-ground applications. Fully flexible strip with horizontal-bend capability. Pairs with an RCM-compliant 24V driver and 0–10V dimmer.",
    specs: ["IP68 rated", "0–10V dimming", "RCM compliant", "Driver & dimmer included"],
    note: null,
    accent: false,
  },
  {
    name: "Pergola Kit",
    image: "/assets/generated/kit-pergola-coastal.png",
    tagline: "Overhead structural runs, BBQ and alfresco zones",
    description:
      "Built for overhead installation in structural channels. High-output 24V strip with consistent colour temperature. Suitable for spans up to 10m per run from a single driver.",
    specs: ["IP68 rated", "0–10V dimming", "RCM compliant", "Driver & dimmer included"],
    note: null,
    accent: false,
  },
  {
    name: "Pool & Water Feature Kit",
    image: "/assets/generated/kit-pool-blue.png",
    tagline: "Fully submersible runs",
    description:
      "Our most demanding application. IP68 submersion-rated for permanent water contact. For pool edges, water features, and submerged elements. Sealed to 1.5m/30min per EN60529.",
    specs: ["IP68 rated (submersible)", "0–10V dimming", "RCM compliant", "Driver & dimmer included"],
    note: "For electrical work near water, all installation must be performed by a licensed electrician per AS/NZS 3000.",
    accent: true,
  },
  {
    name: "Custom Zone Kit",
    image: "/assets/generated/kit-marina.png",
    tagline: "Larger or multi-zone properties",
    description:
      "Multiple zones, extended runs, or architectural applications that need a spec conversation before quoting. Tell us about your space and we'll come back with a detailed breakdown.",
    specs: ["Multi-zone capable", "0–10V dimming", "RCM compliant", "Spec on enquiry"],
    note: null,
    accent: false,
  },
];

export default function ProductKits() {
  const scrollToForm = (kitName: string) => {
    const select = document.getElementById("kit-select") as HTMLSelectElement;
    if (select) {
      select.value = kitName;
    }
    document.getElementById("enquire")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="kits"
      style={{ background: "#15171C", paddingTop: "96px", paddingBottom: "96px" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <p className="spec-badge mb-6" style={{ display: "inline-flex" }}>
            Pre-specced kits
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
            Choose your application.
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
            Each kit is configured for its application — strip, driver, and dimmer
            matched and pre-specced. No separate component selection required. A
            range of colour options is available — just tell us what you&apos;re
            after when you enquire.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {kits.map((kit, i) => (
            <div
              key={i}
              className="kit-card rounded-lg p-8 flex flex-col"
              style={{
                background: kit.accent
                  ? "rgba(245,178,92,0.04)"
                  : "#1F222B",
                border: kit.accent
                  ? "1px solid rgba(245,178,92,0.25)"
                  : "1px solid rgba(91,100,120,0.25)",
              }}
              data-testid={`kit-card-${i}`}
            >
              {/* Kit image */}
              <div
                style={{
                  position: "relative",
                  margin: "-32px -32px 24px",
                  aspectRatio: "16 / 10",
                  overflow: "hidden",
                  borderTopLeftRadius: "8px",
                  borderTopRightRadius: "8px",
                }}
              >
                <Image
                  src={kit.image}
                  alt={kit.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, transparent 50%, rgba(31,34,43,0.9) 100%)",
                  }}
                />
              </div>

              {/* Kit header */}
              <div className="mb-5">
                <h3
                  className="font-bold mb-1"
                  style={{
                    fontSize: "1.1875rem",
                    color: "#F4F1EA",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {kit.name}
                </h3>
                <p style={{ fontSize: "0.875rem", color: "#F5B25C", fontWeight: 500 }}>
                  {kit.tagline}
                </p>
              </div>

              {/* Description */}
              <p
                style={{
                  fontSize: "0.9375rem",
                  color: "#9A9DA8",
                  lineHeight: 1.7,
                  marginBottom: "20px",
                  flex: 1,
                }}
              >
                {kit.description}
              </p>

              {/* Specs */}
              <div className="flex flex-wrap gap-2 mb-6">
                {kit.specs.map((spec, j) => (
                  <span
                    key={j}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      color: "#9A9DA8",
                      background: "rgba(91,100,120,0.15)",
                      border: "1px solid rgba(91,100,120,0.25)",
                      padding: "4px 10px",
                      borderRadius: "4px",
                    }}
                  >
                    {spec}
                  </span>
                ))}
              </div>

              {/* Safety note */}
              {kit.note && (
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "#5B6478",
                    lineHeight: 1.6,
                    marginBottom: "16px",
                    padding: "10px 12px",
                    background: "rgba(91,100,120,0.1)",
                    borderRadius: "4px",
                    borderLeft: "2px solid rgba(91,100,120,0.4)",
                  }}
                >
                  {kit.note}
                </p>
              )}

              {/* CTA */}
              <button
                className="btn-outline"
                onClick={() => scrollToForm(kit.name)}
                data-testid={`kit-enquire-btn-${i}`}
              >
                Enquire for Pricing
              </button>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p
          className="text-center mt-10"
          style={{ fontSize: "0.8125rem", color: "#5B6478", lineHeight: 1.6 }}
        >
          Pricing is enquiry-only — no pricing is displayed on this site.
          All products are made to order; typical lead time is 20 business days from
          order confirmation. Duskline supplies the system only; installation is arranged
          separately by you or your electrician.
        </p>
      </div>
    </section>
  );
}
