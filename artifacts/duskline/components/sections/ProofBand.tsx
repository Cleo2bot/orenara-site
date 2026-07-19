import Image from "next/image";

type ProofImage = {
  src: string;
  alt: string;
};

const images: ProofImage[] = [
  {
    src: "/images/gallery/orenara-step-edge-night.webp",
    alt: "Step edges lit at night by Orenara LED strip beneath each nosing",
  },
  {
    src: "/images/gallery/orenara-pool-pavilion-tropical.webp",
    alt: "Tropical pool pavilion at dusk with warm Orenara strip lighting along the pool surround",
  },
  {
    src: "/images/gallery/orenara-garden-rockbed.webp",
    alt: "Garden rock bed wall washed in warm light from Orenara LED strip at its base",
  },
];

export default function ProofBand() {
  return (
    <section
      aria-label="Installation examples"
      style={{
        background: "var(--ink)",
        borderTop: "1px solid var(--ink-line)",
        paddingTop: "64px",
        paddingBottom: "64px",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <p className="eyebrow mb-8">THE SYSTEM, AFTER DARK</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {images.map((image, i) => (
            <div
              key={image.src}
              className={i === 0 ? "sm:col-span-2 lg:col-span-1" : ""}
              style={{
                position: "relative",
                aspectRatio: "4 / 3",
                overflow: "hidden",
                borderRadius: "var(--radius)",
                border: "1px solid var(--ink-line)",
                background: "var(--ink-raised)",
              }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                style={{ objectFit: "cover" }}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
