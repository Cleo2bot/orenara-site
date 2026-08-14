import Image from "next/image";
import Link from "next/link";
import { KITS } from "@/lib/kits-data";

export default function ProductKits() {
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
            Each kit is configured for its application — strip, driver, channel,
            and connectors matched and pre-specced. Size it to your space and
            see the price straight away.
          </p>
        </div>

        {/* Teaser grid — four application tiles, single source of truth is /kits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {KITS.map((kit, i) => (
            <Link
              key={i}
              href={`/kits/${kit.id}`}
              className="group block"
              style={{ textDecoration: "none" }}
              data-testid={`kit-card-${i}`}
            >
              <div
                style={{
                  background: "var(--ink-raised)",
                  border: "1px solid var(--ink-line)",
                  borderRadius: "var(--radius)",
                  overflow: "hidden",
                  transition: "border-color 0.15s ease",
                }}
              >
                {/* Image */}
                <div
                  className="img-treated"
                  style={{
                    aspectRatio: "16 / 9",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <Image
                    src={kit.image}
                    alt={kit.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
                    className="group-hover:scale-[1.03]"
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "color-mix(in srgb, var(--ink) 30%, transparent)",
                    }}
                  />
                </div>

                {/* Caption */}
                <div style={{ padding: "20px 24px" }}>
                  <p
                    className="font-medium"
                    style={{
                      fontSize: "1.0625rem",
                      color: "var(--bone)",
                      letterSpacing: "-0.02em",
                      marginBottom: "4px",
                    }}
                  >
                    {kit.name}
                  </p>
                  <p style={{ fontSize: "0.875rem", color: "var(--bone-dim)", lineHeight: 1.5 }}>
                    {kit.tagline}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Single CTA — /kits is the source of truth for all kit detail */}
        <div className="flex justify-center mt-12">
          <Link href="/kits" className="btn-primary" data-testid="kits-see-all-btn">
            See all kits →
          </Link>
        </div>
      </div>
    </section>
  );
}
