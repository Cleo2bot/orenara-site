"use client";

import { useTransition, useState } from "react";
import { updateQuoteStatus, duplicateQuote } from "@/lib/admin/actions";

type QuoteStatus = "draft" | "sent" | "accepted" | "declined" | "expired";

export interface QuoteRow {
  id: number;
  quoteNumber: string;
  status: QuoteStatus;
  customerName: string;
  customerType: "residential" | "commercial";
  projectLabel: string;
  systemPrice: string | null;
  createdAt: Date;
  validUntil: Date | null;
}

const STATUS_LABELS: Record<QuoteStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  accepted: "Accepted",
  declined: "Declined",
  expired: "Expired",
};

const STATUS_COLORS: Record<QuoteStatus, string> = {
  draft: "#6B6660",
  sent: "#D9A05B",
  accepted: "#5A9B6F",
  declined: "#9B5A5A",
  expired: "#7A4A4A",
};

function isOverdue(validUntil: Date | null, status: QuoteStatus): boolean {
  if (!validUntil) return false;
  if (status === "accepted" || status === "declined" || status === "expired")
    return false;
  return new Date(validUntil) < new Date();
}

function formatDate(d: Date | null): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatPrice(p: string | null, type: "residential" | "commercial"): string {
  if (!p) return "—";
  const n = parseFloat(p);
  const val = type === "residential" ? n * 1.1 : n;
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val) + (type === "residential" ? " inc" : " ex");
}

function StatusBadge({ status, overdue }: { status: QuoteStatus; overdue: boolean }) {
  const display = overdue ? "Overdue" : STATUS_LABELS[status];
  const color = overdue ? "#9B5A5A" : STATUS_COLORS[status];
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: "3px",
        border: `1px solid ${color}`,
        color,
        fontFamily: "var(--font-mono)",
        fontSize: "0.6875rem",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {display}
    </span>
  );
}

function QuoteRow({ quote }: { quote: QuoteRow }) {
  const [status, setStatus] = useState<QuoteStatus>(quote.status);
  const [isPending, startTransition] = useTransition();
  const overdue = isOverdue(quote.validUntil, status);

  function handleStatusChange(next: QuoteStatus) {
    const prev = status;
    setStatus(next);
    startTransition(async () => {
      try {
        await updateQuoteStatus(quote.id, next);
      } catch {
        setStatus(prev);
      }
    });
  }

  return (
    <tr
      style={{
        borderBottom: "1px solid var(--ink-line)",
        opacity: isPending ? 0.6 : 1,
        transition: "opacity 0.15s",
      }}
    >
      {/* Quote # */}
      <td style={{ padding: "12px 16px 12px 0", verticalAlign: "middle" }}>
        <a
          href={`/admin/quotes/${quote.id}`}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.8125rem",
            color: "var(--bone)",
            textDecoration: "none",
          }}
          onMouseEnter={(e) =>
            ((e.target as HTMLElement).style.textDecoration = "underline")
          }
          onMouseLeave={(e) =>
            ((e.target as HTMLElement).style.textDecoration = "none")
          }
        >
          {quote.quoteNumber}
        </a>
      </td>

      {/* Customer / Project */}
      <td style={{ padding: "12px 16px", verticalAlign: "middle" }}>
        <div style={{ fontSize: "0.875rem", color: "var(--bone)", marginBottom: 2 }}>
          {quote.customerName}
        </div>
        <div style={{ fontSize: "0.75rem", color: "var(--bone-dim)" }}>
          {quote.projectLabel}
        </div>
      </td>

      {/* Status */}
      <td style={{ padding: "12px 16px", verticalAlign: "middle", whiteSpace: "nowrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <StatusBadge status={status} overdue={overdue} />
          <select
            value={status}
            disabled={isPending}
            onChange={(e) => handleStatusChange(e.target.value as QuoteStatus)}
            style={{
              background: "var(--ink-raised)",
              border: "1px solid var(--ink-line)",
              borderRadius: "3px",
              color: "var(--bone-dim)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.6875rem",
              padding: "2px 4px",
              cursor: "pointer",
              outline: "none",
            }}
          >
            {(["draft", "sent", "accepted", "declined", "expired"] as QuoteStatus[]).map(
              (s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              )
            )}
          </select>
        </div>
      </td>

      {/* Price */}
      <td
        style={{
          padding: "12px 16px",
          verticalAlign: "middle",
          fontFamily: "var(--font-mono)",
          fontSize: "0.8125rem",
          color: "var(--bone)",
          textAlign: "right",
          whiteSpace: "nowrap",
        }}
      >
        {formatPrice(quote.systemPrice, quote.customerType)}
      </td>

      {/* Expires */}
      <td
        style={{
          padding: "12px 16px",
          verticalAlign: "middle",
          fontFamily: "var(--font-mono)",
          fontSize: "0.75rem",
          color: overdue ? "#9B5A5A" : "var(--bone-dim)",
          whiteSpace: "nowrap",
        }}
      >
        {formatDate(quote.validUntil)}
      </td>

      {/* Actions */}
      <td style={{ padding: "12px 0 12px 16px", verticalAlign: "middle" }}>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <a
            href={`/admin/quotes/${quote.id}/pdf`}
            target="_blank"
            rel="noopener"
            style={actionLinkStyle}
          >
            PDF
          </a>
          <DuplicateButton quoteId={quote.id} />
        </div>
      </td>
    </tr>
  );
}

function DuplicateButton({ quoteId }: { quoteId: number }) {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await duplicateQuote(quoteId);
        })
      }
      style={{
        ...actionLinkStyle,
        background: "transparent",
        border: "1px solid var(--ink-line)",
        cursor: isPending ? "default" : "pointer",
        opacity: isPending ? 0.5 : 1,
      }}
    >
      {isPending ? "…" : "Dup"}
    </button>
  );
}

const actionLinkStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "3px 10px",
  border: "1px solid var(--ink-line)",
  borderRadius: "3px",
  fontFamily: "var(--font-mono)",
  fontSize: "0.6875rem",
  color: "var(--bone-dim)",
  textDecoration: "none",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
};

export function QuoteList({ quotes }: { quotes: QuoteRow[] }) {
  if (quotes.length === 0) {
    return (
      <p style={{ color: "var(--bone-dim)", fontSize: "0.875rem" }}>
        No quotes yet. Create the first one above.
      </p>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "0.875rem",
        }}
      >
        <thead>
          <tr style={{ borderBottom: "1px solid var(--bone-dim)" }}>
            {["Quote #", "Customer / Project", "Status", "Price", "Expires", ""].map(
              (h) => (
                <th
                  key={h}
                  style={{
                    padding: "0 16px 10px 0",
                    textAlign: h === "Price" ? "right" : "left",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.6875rem",
                    color: "var(--bone-dim)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    fontWeight: 400,
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {quotes.map((q) => (
            <QuoteRow key={q.id} quote={q} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
