import Image from "next/image";

const COMPONENTS = [
  {
    id: "strip",
    number: "01",
    label: "IP68 Silicone Strip",
    specs: ["Dot-free diffusion", "Fully submersible", "Sealed end caps", "24V DC"],
  },
  {
    id: "channel",
    number: "02",
    label: "Channel & Mount",
    specs: ["Aluminium or stainless", "Straight or flexible", "Matched to application", "Diffuser included"],
  },
  {
    id: "connectors",
    number: "03",
    label: "Factory IP68 Connectors",
    specs: ["Moulded onto strip ends", "Pressure-tested", "Before dispatch", "No field sealing"],
  },
  {
    id: "driver",
    number: "04",
    label: "Driver",
    specs: ["Mean Well HLG", "IP67 rated", "Sized to the run", "Hardwired to mains"],
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
            Strip, channel, connectors, and driver — matched, pre-specced, and
            ready to install. Nothing to source separately.
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
            src="/images/product/product-kit-top-view-1600.webp"
            alt="Submersible LED strip system components"
            fill
            sizes="(max-width: 768px) 100vw, 1280px"
            style={{ objectFit: "cover", objectPosition: "center" }}
            loading="lazy"
          />
        </div>

        {/* Component spec columns */}
        <style>{`
          .kit-spec-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            background: var(--ink-line);
            border: 1px solid var(--ink-line);
            border-radius: var(--radius);
            overflow: hidden;
            gap: 1px;
          }
          @media (max-width: 767px) {
            .kit-spec-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
        `}</style>
        <div className="kit-spec-grid">
          {COMPONENTS.map((c) => (
            <div
              key={c.id}
              style={{
                background: "var(--ink-raised)",
                padding: "32px 28px 32px",
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
          All kits are pre-specced by application. Your licensed electrician hardwires the driver and connects it to mains.
        </p>
      </div>
    </section>
  );
}
