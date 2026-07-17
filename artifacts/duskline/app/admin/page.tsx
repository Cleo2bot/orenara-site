import { db } from "@workspace/db";
import { quotesTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { logoutAction } from "./login/actions";
import { QuoteList, type QuoteRow } from "./QuoteList";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const rows = await db
    .select({
      id: quotesTable.id,
      quoteNumber: quotesTable.quoteNumber,
      status: quotesTable.status,
      customerName: quotesTable.customerName,
      customerType: quotesTable.customerType,
      projectLabel: quotesTable.projectLabel,
      systemPrice: quotesTable.systemPrice,
      createdAt: quotesTable.createdAt,
      validUntil: quotesTable.validUntil,
    })
    .from(quotesTable)
    .orderBy(desc(quotesTable.createdAt));

  const quotes: QuoteRow[] = rows.map((r) => ({
    id: r.id,
    quoteNumber: r.quoteNumber,
    status: r.status as QuoteRow["status"],
    customerName: r.customerName,
    customerType: r.customerType as QuoteRow["customerType"],
    projectLabel: r.projectLabel,
    systemPrice: r.systemPrice ?? null,
    createdAt: r.createdAt ?? new Date(),
    validUntil: r.validUntil ?? null,
  }));

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
          maxWidth: "960px",
          margin: "0 auto",
          padding: "48px 32px",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: "32px",
            gap: 16,
          }}
        >
          <div>
            <p className="eyebrow" style={{ marginBottom: "6px" }}>
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
              Quotes
            </h1>
          </div>
          <a
            href="/admin/quotes/new"
            className="btn-primary"
            style={{ display: "inline-flex", whiteSpace: "nowrap" }}
          >
            New Quote
          </a>
        </div>

        <QuoteList quotes={quotes} />
      </main>
    </div>
  );
}
