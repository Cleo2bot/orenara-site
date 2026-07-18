import Image from "next/image";

export default function StripGlow() {
  return (
    <div
      style={{
        width: "100%",
        height: "clamp(320px, 40vw, 560px)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Image
        src="/images/product/led-strip-glow-1600.webp"
        alt="Dot-free silicone LED neon strip glowing warm white"
        fill
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "center 40%" }}
        loading="lazy"
      />
    </div>
  );
}
