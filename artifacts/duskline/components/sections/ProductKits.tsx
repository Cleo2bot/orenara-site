"use client";

import Image from "next/image";
import Link from "next/link";
import { kits } from "@/lib/kits";

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

              <Link
                href={`/kits/${kit.slug}`}
                data-testid={`kit-specs-link-${i}`}
                style={{
                  display: "block",
                  textAlign: "center",
                  marginTop: "12px",
                  fontSize: "0.8125rem",
                  color: "#9A9DA8",
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                }}
              >
                See full specifications
              </Link>
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
          order confirmation. Orenara supplies the system only; installation is arranged
          separately by you or your electrician.
        </p>
      </div>
    </section>
  );
}
