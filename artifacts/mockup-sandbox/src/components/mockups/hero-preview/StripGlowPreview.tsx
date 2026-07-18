const IMG_URL =
  "https://414df1c6-b8a0-461b-a419-5b349bb7124f-00-2uw6btk9ur78j.picard.replit.dev/images/product/led-strip-glow-1600.webp";

export function StripGlowPreview() {
  return (
    <div style={{ background: "#0a0a0a", width: "100%", height: "100vh", overflow: "hidden" }}>
      <img
        src={IMG_URL}
        alt="Dot-free silicone LED neon strip glowing warm white"
        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }}
      />
    </div>
  );
}
