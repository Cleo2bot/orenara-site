import { logoutAction } from "./login/actions";

export default function AdminPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
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
            }}
          >
            Log out
          </button>
        </form>
      </header>

      <main
        style={{
          flex: 1,
          maxWidth: "480px",
          margin: "0 auto",
          padding: "64px 24px",
          width: "100%",
        }}
      >
        <p className="eyebrow" style={{ marginBottom: "8px" }}>
          Admin
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            fontSize: "1.5rem",
            color: "var(--bone)",
            margin: "0 0 32px",
          }}
        >
          Quote Builder
        </h1>

        <a
          href="/admin/quotes/new"
          className="btn-primary"
          style={{ display: "inline-flex" }}
        >
          New Quote
        </a>
      </main>
    </div>
  );
}
