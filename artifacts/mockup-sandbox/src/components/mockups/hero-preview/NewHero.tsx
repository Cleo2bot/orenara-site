export function NewHero() {
  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "#0a0a0a",
        fontFamily: "'Archivo', 'Inter', sans-serif",
      }}
    >
      {/* Background image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          filter: "sepia(0.18) brightness(0.62) saturate(0.88)",
        }}
      >
        <img
          src="/images/new-hero.png"
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }}
        />
        {/* Gradient scrim — stronger at bottom */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(10,10,10,0.18) 0%, rgba(10,10,10,0.28) 50%, rgba(10,10,10,0.72) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "820px",
          margin: "0 auto",
          padding: "128px 24px 96px",
          textAlign: "center",
        }}
      >
        {/* Badge */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}>
          <span
            style={{
              fontSize: "0.6875rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(230,215,190,0.7)",
              border: "1px solid rgba(230,215,190,0.25)",
              borderRadius: "4px",
              padding: "5px 12px",
              fontWeight: 500,
            }}
          >
            IP68 Outdoor Lighting · Australian Conditions
          </span>
        </div>

        {/* H1 */}
        <h1
          style={{
            fontSize: "clamp(2rem, 5.5vw, 3.75rem)",
            letterSpacing: "-0.03em",
            lineHeight: 1.08,
            color: "#f0e8d8",
            margin: "0 auto",
            fontWeight: 500,
          }}
        >
          Not waterproof. Submersible.
        </h1>

        {/* Support line */}
        <p
          style={{
            fontSize: "clamp(1rem, 2vw, 1.1875rem)",
            color: "rgba(230,215,190,0.6)",
            maxWidth: "600px",
            margin: "24px auto 40px",
            lineHeight: 1.7,
          }}
        >
          Outdoor LED strip lighting — sealed end to end, rated for permanent
          water contact. Salt air, pool chemicals, Queensland summers. Built for
          all of it.
        </p>

        {/* CTA */}
        <button
          style={{
            background: "#c8882a",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "16px 36px",
            fontSize: "1.0625rem",
            fontWeight: 500,
            letterSpacing: "0.04em",
            cursor: "pointer",
          }}
        >
          Enquire for Pricing
        </button>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: "absolute",
          bottom: "32px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <div
          style={{
            width: "1px",
            height: "48px",
            background: "rgba(230,215,190,0.2)",
            margin: "0 auto",
          }}
        />
      </div>
    </div>
  );
}
