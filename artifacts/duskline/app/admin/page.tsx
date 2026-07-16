import { logoutAction } from "./login/actions";

export default function AdminPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 32px",
          borderBottom: "1px solid var(--ink-line)",
        }}
      >
        <span className="wordmark wordmark-md">Orenara</span>
        <form action={logoutAction}>
          <button
            type="submit"
            style={{
              background: "transparent",
              border: "none",
              color: "var(--bone-dim)",
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              cursor: "pointer",
              padding: "6px 0",
              transition: "color 150ms ease",
            }}
          >
            Log out
          </button>
        </form>
      </header>

      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "12px",
          padding: "48px 32px",
        }}
      >
        <p
          className="eyebrow"
          style={{ marginBottom: "4px" }}
        >
          Admin
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            fontSize: "1.5rem",
            color: "var(--bone)",
            margin: 0,
          }}
        >
          Quote Builder
        </h1>
        <p
          style={{
            color: "var(--bone-dim)",
            fontSize: "0.9rem",
            marginTop: "8px",
          }}
        >
          Phase 2 — quote form coming next.
        </p>
      </main>
    </div>
  );
}
