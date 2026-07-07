"use client";

import { useState } from "react";
import Image from "next/image";
import { ShieldCheck, ChevronDown } from "lucide-react";

const environments = [
  {
    title: "Commercial & Hospitality",
    image: "/assets/generated/env-commercial-hospitality.png",
    eyebrow: "Higher use, same standard — not a lesser one.",
    body: "Resorts, hospitality venues, strata common areas, and public/council pathways get more daily use and less forgiving maintenance schedules than a private home. The spec doesn't change for commercial application — it's the same IP68, the same 0–10V dimming, the same RCM-compliant components, just specified at scale for a larger site.",
  },
  {
    title: "Pool & Aquatic",
    image: "/assets/generated/env-pool-aquatic.png",
    eyebrow: "Permanent water contact, not occasional splash.",
    body: "Pool edges, water features, and submerged garden elements don't get wet occasionally — they're wet constantly, and often chemically treated. This is the application most outdoor lighting was never actually built for, IP65/66 ratings included. IP68 means submersion-rated to 1.5m for 30 minutes — dust-tight and built for permanent water contact, not just splash resistance dressed up as waterproofing.",
  },
  {
    title: "Marina & Private Berths",
    image: "/assets/generated/kit-marina.png",
    eyebrow: "Timber decking, constant moisture, zero forgiveness for corrosion.",
    body: "Private berths and marina walkways combine every hard condition at once — salt air, direct water exposure, and timber decking that expands and contracts with the weather. It's an unforgiving install for standard connectors. Orenara's sealed IP68 system and segmented track hold a clean line along a pontoon edge the same way they hold a garden path — same spec, same rating, harder setting.",
  },
  {
    title: "Coastal",
    image: "/assets/generated/kit-pathway-coastal2.png",
    eyebrow: "Salt air doesn't announce itself. It just corrodes.",
    body: "Properties within a few kilometres of the coast carry salt air year-round, not just on windy days. It gets into connector joints that look sealed but aren't, corroding contact points from the inside. Voltage drops. Sections go dark months before anyone notices why. Orenara's connectors are sealed end-to-end — driver to terminal — to the same IP68 standard as the strip itself, not treated as an afterthought.",
  },
  {
    title: "Tropical & Humid",
    image: "/assets/generated/env-tropical-humid.png",
    eyebrow: "Queensland summer doesn't wait for a warranty claim.",
    body: "Australian UV intensity is among the highest in the world, and monsoon-season humidity compounds it. Standard silicone sleeves yellow, crack, and let moisture in within 18–24 months — well before most warranty periods even matter. The failure isn't the LEDs themselves; it's housing that was rated for a milder climate than the one it's actually installed in.",
  },
  {
    title: "Rural & Acreage",
    image: "/assets/generated/env-rural-rugged.png",
    eyebrow: "Dust, heat swings, and runs longer than anyone plans for.",
    body: "Acreage, rural driveways, and fence-line runs face problems the suburbs don't — fine dust that works into any gap, day-to-night temperature swings that expand and contract cheap housing until it cracks, and cable runs long enough that a single weak joint takes out the whole line. The 6 in IP68 means dust-tight, not just water-resistant — sealed against the grit that quietly kills lesser strip long before the LEDs ever wear out.",
  },
];

export default function Environments() {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const toggle = (i: number) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <section
      id="environments"
      style={{
        background: "#15171C",
        borderBottom: "1px solid rgba(91,100,120,0.2)",
        paddingTop: "96px",
        paddingBottom: "96px",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <p className="spec-badge mb-6" style={{ display: "inline-flex" }}>
            Environments
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
            Built for where lighting actually fails.
          </h2>
          <p
            style={{
              marginTop: "16px",
              color: "#9A9DA8",
              fontSize: "1rem",
              lineHeight: 1.7,
              maxWidth: "620px",
            }}
          >
            Six conditions that kill cheap outdoor strip lighting. One spec that
            doesn&apos;t change for any of them.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {environments.map((env, i) => {
            const isOpen = expanded.has(i);
            return (
              <div
                key={i}
                className="kit-card rounded-lg p-8 flex flex-col"
                style={{
                  background: "#1F222B",
                  border: "1px solid rgba(91,100,120,0.25)",
                }}
                data-testid={`environment-card-${i}`}
              >
                {/* Image */}
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
                    src={env.image}
                    alt={`${env.title} outdoor LED lighting application at dusk`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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

                {/* Title */}
                <h3
                  className="font-bold mb-2"
                  style={{
                    fontSize: "1.1875rem",
                    color: "#F4F1EA",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {env.title}
                </h3>

                {/* Eyebrow line */}
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#F5B25C",
                    fontWeight: 500,
                    lineHeight: 1.5,
                    marginBottom: "14px",
                  }}
                >
                  {env.eyebrow}
                </p>

                {/* Body */}
                <div className="flex-1 flex flex-col">
                  <p
                    id={`environment-body-${i}`}
                    className={isOpen ? "" : "line-clamp-2"}
                    style={{
                      fontSize: "0.9375rem",
                      color: "#9A9DA8",
                      lineHeight: 1.7,
                    }}
                  >
                    {env.body}
                  </p>

                  {/* Mobile-only expand toggle */}
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                    aria-controls={`environment-body-${i}`}
                    className="inline-flex items-center gap-1.5"
                    data-testid={`environment-toggle-${i}`}
                    style={{
                      marginTop: "12px",
                      alignSelf: "flex-start",
                      color: "#F5B25C",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      background: "transparent",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                    }}
                  >
                    {isOpen ? "Read less" : "Read more"}
                    <ChevronDown
                      size={14}
                      aria-hidden="true"
                      style={{
                        transform: isOpen ? "rotate(180deg)" : "none",
                        transition: "transform 150ms ease",
                      }}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Honesty callout */}
        <div
          className="mt-8 p-8 rounded-lg"
          style={{
            background: "#1A1D24",
            border: "1px solid rgba(91,100,120,0.25)",
          }}
        >
          <div className="flex items-start gap-4">
            <ShieldCheck
              size={22}
              style={{ color: "#F5B25C", flexShrink: 0, marginTop: "2px" }}
            />
            <p style={{ color: "#C9CCD4", fontSize: "0.9375rem", lineHeight: 1.75 }}>
              Built for the conditions Australian coastal, tropical, and
              commercial properties actually face — salt air, permanent water
              contact, and monsoon humidity. Not oil rigs, not naval vessels, not
              mining sites. If your project needs marine-vessel or defense-grade
              certification beyond IP68, tell us upfront — we&apos;ll be straight
              with you about whether we&apos;re the right fit.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
