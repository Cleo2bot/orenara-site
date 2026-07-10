import Image from "next/image";

const COMPONENTS = [
  {
    id: "strip",
    number: "01",
    label: "Silicone LED Neon Strip",
    specs: ["Dot-free diffusion", "Fully submersible IP68", "Sealed end caps", "24V DC"],
  },
  {
    id: "driver",
    number: "02",
    label: "24V Dimmable Driver",
    specs: ["100–150W rating", "IP67 rated", "0–10V dim input", "240V mains feed"],
  },
  {
    id: "dimmer",
    number: "03",
    label: "Touch Dimmer Panel",
    specs: ["Wall-mounted", "Scene presets", "Wireless pairing", "Included"],
  },
  {
    id: "plug",
    number: "04",
    label: "240V Mains Lead",
    specs: ["AU/NZ plug", "Pre-wired", "1.5m cable", "Plug & play"],
  },
];

export default function KitComponents() {
  return (
    <section
      id="kit-components"
      style={{
        background: "var(--ink)",
        borderTop: "1px solid var(--ink-line)",
        paddingTop: "96px",
        paddingBottom: "96px",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <p className="eyebrow mb-6">Every kit includes</p>
          <h2
            className="font-medium"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              color: "var(--bone)",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              maxWidth: "480px",
            }}
          >
            Four components. One complete system.
          </h2>
          <p
            style={{
              marginTop: "16px",
              color: "var(--bone-dim)",
              fontSize: "0.9375rem",
              lineHeight: 1.6,
              maxWidth: "520px",
            }}
          >
            Strip, driver, dimmer, and mains lead — matched, pre-specced, and ready to wire.
            Nothing to source separately.
          </p>
        </div>

        {/* Kit photograph */}
        <div
          className="img-treated"
          style={{
            width: "100%",
            height: "clamp(260px, 45vw, 560px)",
            overflow: "hidden",
            borderRadius: "var(--radius)",
            marginBottom: "2px",
          }}
        >
          <Image
            src="/images/product/kit-landscape.webp"
            alt="Orenara kit components: silicone LED neon strip, 24V dimmable driver, touch dimmer panel, 240V mains lead"
            fill
            sizes="(max-width: 768px) 100vw, 1280px"
            style={{ objectFit: "cover", objectPosition: "center" }}
            loading="lazy"
          />
        </div>

        {/* Component spec columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            border: "1px solid var(--ink-line)",
            borderRadius: "var(--radius)",
            overflow: "hidden",
          }}
        >
          {COMPONENTS.map((c, i) => (
            <div
              key={c.id}
              style={{
                background: "var(--ink-raised)",
                padding: "32px 28px 32px",
                borderRight: i < 3 ? "1px solid var(--ink-line)" : undefined,
              }}
              data-testid={`kit-component-${c.id}`}
            >
              {/* Number */}
              <p
                className="spec-mono-upper"
                style={{
                  fontSize: "0.625rem",
                  color: "var(--ember)",
                  marginBottom: "10px",
                }}
              >
                {c.number}
              </p>

              {/* Label */}
              <p
                className="font-medium"
                style={{
                  fontSize: "0.9375rem",
                  color: "var(--bone)",
                  lineHeight: 1.3,
                  marginBottom: "20px",
                }}
              >
                {c.label}
              </p>

              {/* Specs */}
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {c.specs.map((s) => (
                  <li
                    key={s}
                    style={{
                      fontSize: "0.8125rem",
                      color: "var(--bone-dim)",
                      lineHeight: 1.5,
                      paddingTop: "7px",
                      borderTop: "1px solid var(--ink-line)",
                      marginTop: "7px",
                    }}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p
          style={{
            marginTop: "20px",
            fontSize: "0.8125rem",
            color: "var(--bone-dim)",
          }}
        >
          All kits are pre-specced by application. Quantities and ratings are confirmed when you enquire.
        </p>
      </div>
    </section>
  );
}
