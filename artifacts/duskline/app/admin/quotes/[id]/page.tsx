import { db } from "@workspace/db";
import {
  quotesTable,
  zonesTable,
  runsTable,
  lineItemsTable,
} from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import LineItemsEditor from "./LineItemsEditor";
import { logoutAction } from "@/app/admin/login/actions";

export default async function QuotePage({
  params,
}: {
  params: { id: string };
}) {
  const quoteId = parseInt(params.id, 10);
  if (isNaN(quoteId)) notFound();

  const [quote] = await db
    .select()
    .from(quotesTable)
    .where(eq(quotesTable.id, quoteId));
  if (!quote) notFound();

  const zones = await db
    .select()
    .from(zonesTable)
    .where(eq(zonesTable.quoteId, quoteId))
    .orderBy(asc(zonesTable.sortOrder));

  const runs = await db
    .select()
    .from(runsTable)
    .where(
      eq(
        runsTable.zoneId,
        db
          .select({ id: zonesTable.id })
          .from(zonesTable)
          .where(eq(zonesTable.quoteId, quoteId))
          .limit(1)
      )
    );

  const allRuns: { zoneId: number; label: string; lengthMetres: string }[] = [];
  for (const zone of zones) {
    const zoneRuns = await db
      .select()
      .from(runsTable)
      .where(eq(runsTable.zoneId, zone.id))
      .orderBy(asc(runsTable.sortOrder));
    allRuns.push(...zoneRuns);
  }

  const lineItems = await db
    .select()
    .from(lineItemsTable)
    .where(eq(lineItemsTable.quoteId, quoteId))
    .orderBy(asc(lineItemsTable.sortOrder));

  const createdAt = quote.createdAt
    ? new Date(quote.createdAt).toLocaleDateString("en-AU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div style={{ minHeight: "100vh", background: "var(--ink)", color: "var(--bone)" }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 32px",
          borderBottom: "1px solid var(--ink-line)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <a
            href="/admin"
            style={{
              color: "var(--bone-dim)",
              textDecoration: "none",
              fontSize: "0.8125rem",
              fontFamily: "var(--font-body)",
            }}
          >
            ← Admin
          </a>
          <span className="wordmark" style={{ fontSize: "15px" }}>
            Orenara
          </span>
        </div>
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

      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "32px",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <p className="eyebrow" style={{ marginBottom: "6px" }}>
              {quote.status.toUpperCase()}
            </p>
            <h1
              style={{
                fontFamily: "var(--font-spec)",
                fontWeight: 400,
                fontSize: "1.5rem",
                margin: "0 0 4px",
                letterSpacing: "0.04em",
              }}
            >
              {quote.quoteNumber}
            </h1>
            <p
              style={{
                color: "var(--bone-dim)",
                fontSize: "0.875rem",
                margin: 0,
              }}
            >
              {quote.projectLabel}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: "var(--bone-dim)", fontSize: "0.8125rem", margin: "0 0 2px" }}>
              {quote.customerName}
            </p>
            <p style={{ color: "var(--bone-dim)", fontSize: "0.8125rem", margin: 0 }}>
              {quote.customerEmail}
            </p>
            <p
              style={{
                color: "var(--bone-dim)",
                fontSize: "0.75rem",
                margin: "6px 0 0",
                fontFamily: "var(--font-spec)",
              }}
            >
              Created {createdAt}
            </p>
            <a
              href={`/admin/quotes/${quoteId}/pdf`}
              target="_blank"
              rel="noreferrer"
              className="btn-outline"
              style={{
                display: "inline-flex",
                marginTop: "12px",
                width: "auto",
                padding: "8px 18px",
                fontSize: "0.8125rem",
              }}
            >
              Download PDF
            </a>
          </div>
        </div>

        {/* Zones summary */}
        <div
          style={{
            background: "var(--ink-raised)",
            border: "1px solid var(--ink-line)",
            borderRadius: "var(--radius)",
            padding: "20px 24px",
            marginBottom: "16px",
          }}
        >
          <p className="eyebrow" style={{ marginBottom: "12px" }}>
            Zones &amp; Runs
          </p>
          {zones.map((zone) => {
            const zRuns = allRuns.filter((r) => r.zoneId === zone.id);
            const total = zRuns.reduce(
              (s, r) => s + parseFloat(r.lengthMetres),
              0
            );
            return (
              <div key={zone.id} style={{ marginBottom: "10px" }}>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    margin: "0 0 4px",
                  }}
                >
                  {zone.name}
                </p>
                {zRuns.map((run) => (
                  <p
                    key={run.zoneId + "-" + run.label}
                    style={{
                      color: "var(--bone-dim)",
                      fontSize: "0.8125rem",
                      margin: "0 0 2px",
                      paddingLeft: "12px",
                      fontFamily: "var(--font-spec)",
                    }}
                  >
                    {run.label} — {run.lengthMetres}m
                  </p>
                ))}
                <p
                  style={{
                    color: "var(--bone-dim)",
                    fontSize: "0.75rem",
                    margin: "4px 0 0",
                    paddingLeft: "12px",
                  }}
                >
                  Zone total: {total.toFixed(1)}m · {quote.colourTemp} ·{" "}
                  {quote.channelType === "none" ? "No channel" : quote.channelType}
                </p>
              </div>
            );
          })}
        </div>

        <LineItemsEditor
          quoteId={quoteId}
          initialItems={lineItems.map((li) => ({
            id: li.id,
            partNumber: li.partNumber,
            description: li.description,
            qty: li.qty,
            unit: li.unit,
            isGenerated: li.isGenerated,
            sortOrder: li.sortOrder,
          }))}
          initialSystemPrice={quote.systemPrice ?? ""}
          initialNotes={quote.notes ?? ""}
          initialWarrantyLine={
            quote.warrantyLine ??
            "System warranty: 2 years (submerged application)"
          }
        />
      </main>
    </div>
  );
}
