"use client";

export default function Hero() {
  const scrollToForm = () => {
    document.getElementById("enquire")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "#15171C" }}
    >
      {/* Ambient glow background */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        {/* Deep background gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 120%, rgba(245,178,92,0.06) 0%, transparent 70%)",
          }}
        />
        {/* Dusk sky gradient top */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(91,100,120,0.08) 0%, transparent 40%)",
          }}
        />
        {/* Amber glow pool — simulates light below frame */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: "45%",
            background:
              "radial-gradient(ellipse 120% 80% at 50% 100%, rgba(245,178,92,0.14) 0%, rgba(212,145,58,0.05) 40%, transparent 70%)",
            animation: "glow-pulse 6s ease-in-out infinite",
          }}
        />
        {/* Subtle horizontal strip suggestion */}
        <div
          className="absolute"
          style={{
            bottom: "28%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "60%",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(245,178,92,0.5), rgba(245,178,92,0.8), rgba(245,178,92,0.5), transparent)",
            filter: "blur(1px)",
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: "28%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "60%",
            height: "20px",
            background:
              "linear-gradient(90deg, transparent, rgba(245,178,92,0.08), rgba(245,178,92,0.15), rgba(245,178,92,0.08), transparent)",
            filter: "blur(8px)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-24 text-center">
        {/* Overline badge */}
        <div className="animate-fade-up flex justify-center mb-8">
          <span className="spec-badge">
            <span
              style={{
                display: "inline-block",
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#F5B25C",
              }}
            />
            Australian Outdoor Lighting
          </span>
        </div>

        {/* Wordmark */}
        <div className="animate-fade-up-delay-1 mb-6">
          <h1
            className="font-black"
            style={{
              fontSize: "clamp(3.5rem, 10vw, 8rem)",
              letterSpacing: "-0.05em",
              lineHeight: "0.9",
              color: "#F4F1EA",
            }}
          >
            duskline
          </h1>
          {/* Amber underline strip */}
          <div
            style={{
              height: "3px",
              margin: "12px auto 0",
              width: "min(320px, 60%)",
              background:
                "linear-gradient(90deg, rgba(245,178,92,0) 0%, #F5B25C 30%, #F5B25C 70%, rgba(245,178,92,0) 100%)",
              borderRadius: "2px",
            }}
          />
        </div>

        {/* Tagline */}
        <p
          className="animate-fade-up-delay-2 font-semibold"
          style={{
            fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
            color: "#9A9DA8",
            letterSpacing: "0.01em",
            marginTop: "24px",
            marginBottom: "16px",
          }}
        >
          Outdoor lighting, built for Australian conditions.
        </p>

        {/* Positioning statement */}
        <p
          className="animate-fade-up-delay-2"
          style={{
            fontSize: "clamp(0.9rem, 1.8vw, 1.1rem)",
            color: "#9A9DA8",
            maxWidth: "600px",
            margin: "0 auto 40px",
            lineHeight: 1.7,
          }}
        >
          IP68-rated outdoor strip lighting, properly dimmable, built for
          Australian conditions.
        </p>

        {/* CTA group */}
        <div className="animate-fade-up-delay-3 flex flex-col items-center gap-4">
          <button
            onClick={scrollToForm}
            className="btn-primary"
            style={{ fontSize: "1.0625rem", padding: "16px 36px" }}
            data-testid="hero-enquire-btn"
          >
            Enquire for Pricing
          </button>
          <p style={{ fontSize: "0.8125rem", color: "#5B6478", letterSpacing: "0.02em" }}>
            Made to order.&nbsp;&nbsp;Ships in 4–8 weeks.
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2"
        style={{ transform: "translateX(-50%)" }}
        aria-hidden="true"
      >
        <div
          style={{
            width: "1px",
            height: "48px",
            background:
              "linear-gradient(180deg, rgba(91,100,120,0.6) 0%, transparent 100%)",
            margin: "0 auto",
          }}
        />
      </div>
    </section>
  );
}
