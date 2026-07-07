export function OgImage() {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Archivo:wght@500&family=IBM+Plex+Mono:wght@400&display=swap"
      />
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#101214",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 36,
        }}
      >
        <div
          style={{
            fontFamily: "'Archivo', sans-serif",
            fontWeight: 500,
            fontSize: 84,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#F3EEE4",
            marginRight: "-0.22em",
          }}
        >
          ORENARA
        </div>
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 400,
            fontSize: 22,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "rgba(243, 238, 228, 0.62)",
            marginRight: "-0.06em",
          }}
        >
          IP68 Outdoor Strip Lighting · Australian Conditions
        </div>
      </div>
    </>
  );
}
