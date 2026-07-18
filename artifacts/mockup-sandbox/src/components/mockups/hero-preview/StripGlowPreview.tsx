export function StripGlowPreview() {
  return (
    <div style={{ background: "#0a0a0a", width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ width: "100%", height: "clamp(320px, 40vw, 560px)", overflow: "hidden", position: "relative", flex: 1 }}>
        <img
          src="/images/led-strip-glow-1600.webp"
          alt="Dot-free silicone LED neon strip glowing warm white"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }}
        />
      </div>
    </div>
  );
}
