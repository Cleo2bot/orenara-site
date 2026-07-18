import Image from "next/image";
import Link from "next/link";

const KIT_ITEMS = [
  {
    number: "01",
    label: "Silicone LED Neon Strip",
    detail: "Submersible IP68 — dot-free diffusion, sealed end caps",
  },
  {
    number: "02",
    label: "24V Dimmable Driver",
    detail: "100–150W, IP67 rated, 0–10V dim input, 240V feed",
  },
  {
    number: "03",
    label: "Touch Dimmer Panel",
    detail: "Wall-mount control, scene presets, wireless pairing",
  },
  {
    number: "04",
    label: "240V Mains Lead",
    detail: "AU/NZ plug, pre-wired, plug-and-play installation",
  },
];

export default function KitBox() {
  return (
    <section
      id="kit-box"
      style={{
        background: "var(--ink)",
        borderTop: "1px solid var(--ink-line)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          minHeight: "520px",
          maxWidth: "1600px",
          margin: "0 auto",
        }}
        className="kit-box-grid"
      >
        {/* Left — strip photograph */}
        <div
          className="img-treated"
          style={{
            overflow: "hidden",
            minHeight: "420px",
          }}
        >
          <Image
            src="/images/product/connector-detail-v2-1600.webp"
            alt="Factory-sealed IP68 connector detail"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
            loading="lazy"
          />
          {/* IP68 badge overlay */}
          <div
            style={{
              position: "absolute",
              top: "28px",
              right: "28px",
              border: "1px solid var(--ember)",
              borderRadius: "var(--radius)",
              padding: "4px 10px",
              fontSize: "0.6875rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--ember)",
              fontWeight: 600,
              background: "color-mix(in srgb, var(--ink) 60%, transparent)",
            }}
          >
            IP68 Rated
          </div>
        </div>

        {/* Right — spec list */}
        <div
          style={{
            padding: "64px 56px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            borderLeft: "1px solid var(--ink-line)",
          }}
          className="kit-box-right"
        >
          <p className="eyebrow mb-6">What&apos;s in every kit</p>
          <h2
            className="font-medium"
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
              color: "var(--bone)",
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              marginBottom: "12px",
            }}
          >
            One box. Everything needed to install.
          </h2>
          <p
            style={{
              fontSize: "0.9375rem",
              color: "var(--bone-dim)",
              lineHeight: 1.6,
              marginBottom: "40px",
              maxWidth: "440px",
            }}
          >
            Every Orenara kit ships with matched components. No driver sourcing,
            no compatibility guesswork, no site visits.
          </p>

          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {KIT_ITEMS.map((item) => (
              <li
                key={item.number}
                style={{
                  borderTop: "1px solid var(--ink-line)",
                  paddingTop: "16px",
                  paddingBottom: "16px",
                  display: "flex",
                  gap: "16px",
                  alignItems: "flex-start",
                }}
              >
                <span
                  className="spec-mono-upper"
                  style={{
                    fontSize: "0.625rem",
                    color: "var(--ember)",
                    minWidth: "20px",
                    paddingTop: "3px",
                    flexShrink: 0,
                  }}
                >
                  {item.number}
                </span>
                <div>
                  <p
                    className="font-medium"
                    style={{
                      fontSize: "0.9375rem",
                      color: "var(--bone)",
                      marginBottom: "3px",
                      lineHeight: 1.3,
                    }}
                  >
                    {item.label}
                  </p>
                  <p
                    style={{
                      fontSize: "0.8125rem",
                      color: "var(--bone-dim)",
                      lineHeight: 1.5,
                    }}
                  >
                    {item.detail}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div style={{ marginTop: "36px" }}>
            <Link href="/quote-builder" className="btn-outline" style={{ width: "auto", display: "inline-flex" }}>
              Build Your Kit
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .kit-box-grid {
            grid-template-columns: 1fr !important;
          }
          .kit-box-right {
            padding: 48px 24px !important;
            border-left: none !important;
            border-top: 1px solid var(--ink-line);
          }
        }
      `}</style>
    </section>
  );
}
