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
      style={{ background: "var(--ink)", paddingTop: "96px", paddingBottom: "96px" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <p className="eyebrow mb-6">Pre-specced kits</p>
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
            Choose your application.
          </h2>
          <p
            style={{
              marginTop: "16px",
              color: "var(--bone-dim)",
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
                background: "var(--ink-raised)",
                border: "1px solid var(--ink-line)",
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
                    background: "color-mix(in srgb, var(--ink) 40%, transparent)",
                  }}
                />
              </div>

              {/* Kit header */}
              <div className="mb-5">
                <h3
                  className="font-medium mb-1"
                  style={{
                    fontSize: "1.1875rem",
                    color: "var(--bone)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {kit.name}
                </h3>
                <p style={{ fontSize: "0.875rem", color: "var(--bone-dim)", fontWeight: 500 }}>
                  {kit.tagline}
                </p>
              </div>

              {/* Description */}
              <p
                style={{
                  fontSize: "0.9375rem",
                  color: "var(--bone-dim)",
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
                  <span key={j} className="spec-badge">
                    {spec}
                  </span>
                ))}
              </div>

              {/* Safety note */}
              {kit.note && (
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--bone-dim)",
                    lineHeight: 1.6,
                    marginBottom: "16px",
                    padding: "10px 12px",
                    background: "var(--ink)",
                    borderRadius: "var(--radius)",
                    borderLeft: "2px solid var(--ink-line)",
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
                  color: "var(--bone-dim)",
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
          style={{ fontSize: "0.8125rem", color: "var(--bone-dim)", lineHeight: 1.6 }}
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
