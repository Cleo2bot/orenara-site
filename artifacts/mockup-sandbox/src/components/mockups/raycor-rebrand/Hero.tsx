export function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "#15171C" }}
    >
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src="/__mockup/images/rebrand-hero.png"
          alt=""
          className="absolute inset-0 w-full h-full"
          style={{ objectFit: "cover" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(21,23,28,0.82) 0%, rgba(21,23,28,0.64) 38%, rgba(21,23,28,0.72) 60%, rgba(21,23,28,0.94) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(21,23,28,0.55) 0%, transparent 75%)",
          }}
        />
      </div>

      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 120%, rgba(245,178,92,0.06) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(91,100,120,0.08) 0%, transparent 40%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: "45%",
            background:
              "radial-gradient(ellipse 120% 80% at 50% 100%, rgba(245,178,92,0.14) 0%, rgba(212,145,58,0.05) 40%, transparent 70%)",
          }}
        />
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

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-24 text-center">
        <div className="flex justify-center mb-8">
          <span
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase"
            style={{
              border: "1px solid rgba(245,178,92,0.35)",
              color: "#F6DDB8",
              background: "rgba(245,178,92,0.06)",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#F5B25C",
              }}
            />
            IP68 Outdoor Lighting · Australian Conditions
          </span>
        </div>

        <div className="mb-6 flex flex-col items-center">
          <div
            style={{
              display: "inline-block",
              border: "3px solid #F5B25C",
              borderRadius: "6px",
              padding: "0.4em 0.9em",
              background: "rgba(245,178,92,0.05)",
            }}
          >
            <h1
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
                letterSpacing: "-0.01em",
                lineHeight: "0.9",
                color: "#F4F1EA",
                textTransform: "uppercase",
              }}
            >
              raycor
            </h1>
          </div>
          <p
            style={{
              marginTop: "14px",
              fontSize: "0.8125rem",
              fontWeight: 500,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#9A9DA8",
            }}
          >
            Engineered for the Elements
          </p>
        </div>

        <p
          className="font-semibold"
          style={{
            fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
            color: "#9A9DA8",
            letterSpacing: "0.01em",
            marginTop: "24px",
            marginBottom: "16px",
          }}
        >
          Built for salt air, pool chemicals, and Queensland summers.
        </p>

        <p
          style={{
            fontSize: "clamp(0.9rem, 1.8vw, 1.1rem)",
            color: "#9A9DA8",
            maxWidth: "600px",
            margin: "0 auto 40px",
            lineHeight: 1.7,
          }}
        >
          IP68 end-to-end. Properly dimmable. Made for conditions that break everything else.
        </p>

        <div className="flex flex-col items-center gap-4">
          <button
            className="rounded-full font-semibold transition-transform hover:scale-[1.02]"
            style={{
              fontSize: "1.0625rem",
              padding: "16px 36px",
              background: "linear-gradient(135deg, #F5B25C, #D4913A)",
              color: "#0D1117",
              border: "none",
            }}
          >
            Enquire for Pricing
          </button>
          <p style={{ fontSize: "0.8125rem", color: "#5B6478", letterSpacing: "0.02em" }}>
            Made to order.&nbsp;&nbsp;Ships in 20 business days.
          </p>
        </div>
      </div>
    </section>
  );
}
