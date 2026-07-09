import "./_group.css";

const COMPONENTS = [
  {
    id: "strip",
    label: "Silicone LED Neon Strip",
    specs: ["Dot-free diffusion", "Fully submersible IP68", "Sealed end caps", "24V DC"],
  },
  {
    id: "driver",
    label: "24V Dimmable Driver",
    specs: ["100–150W rating", "IP67 rated", "0–10V dim input", "240V mains feed"],
  },
  {
    id: "dimmer",
    label: "Touch Dimmer Panel",
    specs: ["Wall-mounted", "Scene presets", "Wireless pairing", "Included"],
  },
  {
    id: "plug",
    label: "240V Mains Lead",
    specs: ["AU/NZ plug", "Pre-wired", "1.5m cable", "Plug & play"],
  },
];

export function FlatLay() {
  return (
    <div
      className="min-h-screen flex flex-col justify-center"
      style={{
        background: "#111111",
        fontFamily: "'Archivo', 'Inter', sans-serif",
        padding: "80px 64px",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "56px" }}>
        <p
          style={{
            fontSize: "0.6875rem",
            fontWeight: 600,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#C5A96E",
            marginBottom: "12px",
          }}
        >
          Every kit includes
        </p>
        <h2
          style={{
            fontSize: "2.25rem",
            fontWeight: 500,
            color: "#F0EBE0",
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
            maxWidth: "480px",
          }}
        >
          Four components. One complete system.
        </h2>
        <p
          style={{
            marginTop: "16px",
            fontSize: "0.9375rem",
            color: "#8B8278",
            maxWidth: "520px",
            lineHeight: 1.6,
          }}
        >
          Strip, driver, dimmer, and mains lead — matched, pre-specced, and
          ready to wire. Nothing to source separately.
        </p>
      </div>

      {/* Component grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: "2px",
          background: "#1E1C1A",
          border: "1px solid #2A2724",
          borderRadius: "6px",
          overflow: "hidden",
        }}
      >
        {COMPONENTS.map((c, i) => (
          <div
            key={c.id}
            style={{
              background: "#161412",
              padding: "40px 32px 36px",
              borderRight: i < 3 ? "1px solid #2A2724" : undefined,
            }}
          >
            {/* Icon area */}
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "4px",
                background: "#1E1C1A",
                border: "1px solid #2A2724",
                marginBottom: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ComponentIcon id={c.id} />
            </div>

            {/* Number */}
            <p
              style={{
                fontSize: "0.625rem",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#C5A96E",
                marginBottom: "8px",
              }}
            >
              0{i + 1}
            </p>

            {/* Label */}
            <p
              style={{
                fontSize: "0.9375rem",
                fontWeight: 500,
                color: "#F0EBE0",
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
                    color: "#8B8278",
                    lineHeight: 1.5,
                    paddingTop: "6px",
                    borderTop: "1px solid #2A2724",
                    marginTop: "6px",
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
          marginTop: "24px",
          fontSize: "0.8125rem",
          color: "#8B8278",
          letterSpacing: "0.02em",
        }}
      >
        All kits are pre-specced by application. Quantities and ratings are confirmed when you enquire.
      </p>
    </div>
  );
}

function ComponentIcon({ id }: { id: string }) {
  const color = "#C5A96E";
  if (id === "strip") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M3 12h18" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        <rect x="2" y="10" width="20" height="4" rx="2" stroke={color} strokeWidth="1.5" />
      </svg>
    );
  }
  if (id === "driver") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="6" width="14" height="12" rx="2" stroke={color} strokeWidth="1.5" />
        <path d="M17 9h4M17 12h4M17 15h4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (id === "dimmer") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="4" width="16" height="16" rx="3" stroke={color} strokeWidth="1.5" />
        <circle cx="12" cy="11" r="3" stroke={color} strokeWidth="1.5" />
        <path d="M9 16h6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 2v10M8 6l4-4 4 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 12v8a1 1 0 001 1h12a1 1 0 001-1v-8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
