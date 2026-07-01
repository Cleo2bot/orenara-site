import Image from "next/image";
import { Star } from "lucide-react";

const photos = [
  {
    src: "/assets/20260529_141958_1782893962742.jpg",
    alt: "IP68 certification label on the LED strip",
  },
  {
    src: "/assets/20260529_141954_1782893962744.jpg",
    alt: "Sealed IP68 connector detail on the LED strip",
  },
  {
    src: "/assets/20260529_142442_1782893962740.jpg",
    alt: "LED neon flex coiled to show the bend radius",
  },
  {
    src: "/assets/20260529_142637_1782893962733.jpg",
    alt: "IP68 LED strip and neon flex ready for install",
  },
  {
    src: "/assets/20260701_180300_1782893962722.jpg",
    alt: "LTSYS 24V flicker-free LED driver",
  },
  {
    src: "/assets/20260609_131451_1782893962724.jpg",
    alt: "LTECH 0-10V wall dimmer controller",
  },
];

export default function InstallerReview() {
  return (
    <section
      id="review"
      style={{
        background: "#15171C",
        borderTop: "1px solid rgba(91,100,120,0.2)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="mb-12">
          <p className="spec-badge mb-6" style={{ display: "inline-flex" }}>
            From the trade
          </p>
          <h2
            className="font-bold"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              color: "#F4F1EA",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              maxWidth: "640px",
            }}
          >
            What a licensed installer actually thinks.
          </h2>
        </div>

        {/* Review card */}
        <div
          className="rounded-lg"
          style={{
            background: "#1F222B",
            border: "1px solid rgba(245,178,92,0.25)",
            overflow: "hidden",
          }}
          data-testid="installer-review"
        >
          <div className="p-8 md:p-12">
            {/* Stars */}
            <div
              className="flex items-center gap-1 mb-6"
              role="img"
              aria-label="Rated 5 out of 5 stars"
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  style={{ color: "#F5B25C" }}
                  fill="#F5B25C"
                />
              ))}
            </div>

            {/* Quote */}
            <blockquote
              style={{
                fontSize: "clamp(1.125rem, 2vw, 1.375rem)",
                color: "#F4F1EA",
                lineHeight: 1.6,
                letterSpacing: "-0.01em",
                maxWidth: "880px",
              }}
            >
              &ldquo;I install a lot of outdoor strip and most of it I end up
              going back to within a couple of wet seasons. This is the first lot
              I&apos;ve put in that I&apos;m genuinely not worried about. IP68 the
              whole way — strip, joints, end caps — so in the Brisbane humidity
              and out near the bay with the salt air, I&apos;m not chasing
              corroded connectors or water in the channel six months later. The
              0&ndash;10V dimming is smooth with no flicker on camera, and the
              RCM compliance means it&apos;s clean to sign off on. Last job I ran
              a curved path edge and a pool surround — the segmented track holds
              the radius properly instead of the strip fighting me the whole way.
              Gear turns up sorted and wires up quick.&rdquo;
            </blockquote>

            {/* Attribution — no name */}
            <div
              className="mt-8 flex items-center gap-3"
              style={{
                paddingTop: "24px",
                borderTop: "1px solid rgba(91,100,120,0.2)",
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  background: "rgba(245,178,92,0.1)",
                  border: "1px solid rgba(245,178,92,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  color: "#F5B25C",
                  flexShrink: 0,
                }}
              >
                QLD
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.9375rem",
                    fontWeight: 600,
                    color: "#F4F1EA",
                  }}
                >
                  Licensed electrical installer
                </p>
                <p style={{ fontSize: "0.85rem", color: "#9A9DA8" }}>
                  Brisbane, QLD
                </p>
              </div>
            </div>
          </div>

          {/* Installer's photos */}
          <div
            style={{
              borderTop: "1px solid rgba(91,100,120,0.2)",
              padding: "24px",
              background: "#15171C",
            }}
          >
            <p
              style={{
                fontSize: "0.8125rem",
                color: "#5B6478",
                fontWeight: 500,
                marginBottom: "16px",
              }}
            >
              Photos supplied by the installer
            </p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {photos.map((photo, i) => (
                <div
                  key={i}
                  className="rounded-lg overflow-hidden"
                  style={{
                    position: "relative",
                    aspectRatio: "1 / 1",
                    background: "#1F222B",
                    border: "1px solid rgba(91,100,120,0.2)",
                  }}
                  data-testid={`review-photo-${i}`}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 768px) 33vw, 16vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
