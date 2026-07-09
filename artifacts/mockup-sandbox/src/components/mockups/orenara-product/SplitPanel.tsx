import "./_group.css";

const KIT_ITEMS = [
  {
    label: "Silicone LED Neon Strip",
    detail: "Submersible IP68 — dot-free diffusion, sealed end caps",
  },
  {
    label: "24V Dimmable Driver",
    detail: "100–150W, IP67 rated, 0–10V dim input, 240V feed",
  },
  {
    label: "Touch Dimmer Panel",
    detail: "Wall-mount control, scene presets, wireless pairing",
  },
  {
    label: "240V Mains Lead",
    detail: "AU/NZ plug, pre-wired, plug-and-play installation",
  },
];

export function SplitPanel() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111111",
        fontFamily: "'Archivo', 'Inter', sans-serif",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          width: "100%",
          minHeight: "520px",
        }}
      >
        {/* Left — product visual */}
        <div
          style={{
            background: "#0E0D0C",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            padding: "56px",
          }}
        >
          {/* Product illustration — coiled strip + components */}
          <div style={{ position: "relative", width: "320px", height: "320px" }}>
            {/* Coil */}
            <svg
              viewBox="0 0 320 320"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
              fill="none"
            >
              {/* Outer ring */}
              <circle cx="160" cy="145" r="110" stroke="#3A3530" strokeWidth="22" />
              {/* Middle ring */}
              <circle cx="160" cy="145" r="78" stroke="#2A2724" strokeWidth="20" />
              {/* Inner ring */}
              <circle cx="160" cy="145" r="47" stroke="#2A2724" strokeWidth="16" />
              {/* Ember accent on outer ring */}
              <path
                d="M160 35 A110 110 0 0 1 260 90"
                stroke="#C5A96E"
                strokeWidth="22"
                strokeLinecap="round"
              />
              {/* Lead wire out */}
              <line x1="264" y1="102" x2="290" y2="130" stroke="#3A3530" strokeWidth="8" strokeLinecap="round" />
              <line x1="256" y1="98" x2="282" y2="126" stroke="#C5A96E" strokeWidth="3" strokeLinecap="round" />
              {/* Sealed end dot */}
              <circle cx="255" cy="97" r="6" fill="#C5A96E" />
            </svg>

            {/* Driver box */}
            <div
              style={{
                position: "absolute",
                bottom: "16px",
                left: "16px",
                background: "#F0EBE0",
                borderRadius: "4px",
                padding: "6px 10px",
                width: "88px",
                height: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: "7px", color: "#111", letterSpacing: "0.08em", fontWeight: 600 }}>
                24V DRIVER
              </span>
            </div>

            {/* Dimmer panel */}
            <div
              style={{
                position: "absolute",
                bottom: "16px",
                right: "16px",
                background: "#F5F3EE",
                borderRadius: "4px",
                width: "44px",
                height: "52px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
              }}
            >
              <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: "1.5px solid #8B8278" }} />
              <div style={{ width: "24px", height: "3px", background: "#C5A96E", borderRadius: "2px" }} />
              <div style={{ width: "20px", height: "3px", background: "#D0CBC0", borderRadius: "2px" }} />
            </div>

            {/* Mains plug */}
            <div
              style={{
                position: "absolute",
                bottom: "56px",
                right: "10px",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
                <rect x="1" y="1" width="18" height="14" rx="3" stroke="#3A3530" strokeWidth="1.5" />
                <path d="M7 8V3M13 8V3" stroke="#3A3530" strokeWidth="2" strokeLinecap="round" />
                <path d="M10 15v8" stroke="#3A3530" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* IP68 badge */}
          <div
            style={{
              position: "absolute",
              top: "28px",
              right: "28px",
              border: "1px solid #C5A96E",
              borderRadius: "3px",
              padding: "4px 10px",
              fontSize: "0.625rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#C5A96E",
              fontWeight: 600,
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
          }}
        >
          <p
            style={{
              fontSize: "0.6875rem",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#C5A96E",
              marginBottom: "14px",
            }}
          >
            What's in every kit
          </p>
          <h2
            style={{
              fontSize: "1.875rem",
              fontWeight: 500,
              color: "#F0EBE0",
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
              marginBottom: "12px",
            }}
          >
            One box. Everything needed to install.
          </h2>
          <p
            style={{
              fontSize: "0.9rem",
              color: "#8B8278",
              lineHeight: 1.6,
              marginBottom: "40px",
            }}
          >
            Every Orenara kit ships with matched components. No driver sourcing,
            no compatibility guesswork, no site visits.
          </p>

          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {KIT_ITEMS.map((item, i) => (
              <li
                key={i}
                style={{
                  borderTop: "1px solid #2A2724",
                  paddingTop: "16px",
                  paddingBottom: "16px",
                  display: "flex",
                  gap: "16px",
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    fontSize: "0.625rem",
                    fontWeight: 700,
                    color: "#C5A96E",
                    letterSpacing: "0.1em",
                    minWidth: "20px",
                    paddingTop: "2px",
                  }}
                >
                  0{i + 1}
                </span>
                <div>
                  <p
                    style={{
                      fontSize: "0.9375rem",
                      fontWeight: 500,
                      color: "#F0EBE0",
                      marginBottom: "3px",
                      lineHeight: 1.3,
                    }}
                  >
                    {item.label}
                  </p>
                  <p
                    style={{
                      fontSize: "0.8125rem",
                      color: "#8B8278",
                      lineHeight: 1.5,
                    }}
                  >
                    {item.detail}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div style={{ marginTop: "36px" }}>
            <button
              style={{
                background: "transparent",
                border: "1px solid #F0EBE0",
                color: "#F0EBE0",
                padding: "12px 24px",
                fontSize: "0.8125rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                borderRadius: "2px",
                cursor: "pointer",
              }}
            >
              Build Your Kit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
