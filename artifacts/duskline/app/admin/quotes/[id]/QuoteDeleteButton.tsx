"use client";

import { useState, useTransition } from "react";
import { deleteQuote } from "@/lib/admin/actions";

interface Props {
  quoteId: number;
  quoteNumber: string;
  status: string;
}

export default function QuoteDeleteButton({ quoteId, quoteNumber, status }: Props) {
  const [open, setOpen]           = useState(false);
  const [typed, setTyped]         = useState("");
  const [error, setError]         = useState<string | null>(null);
  const [isPending, start]        = useTransition();

  if (status !== "draft") return null;

  function handleOpen() {
    setTyped("");
    setError(null);
    setOpen(true);
  }

  function handleCancel() {
    setOpen(false);
    setTyped("");
    setError(null);
  }

  function handleDelete() {
    if (typed !== quoteNumber) {
      setError(`Type exactly "${quoteNumber}" to confirm.`);
      return;
    }
    setError(null);
    start(async () => {
      try {
        await deleteQuote(quoteId);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Delete failed.");
        setOpen(false);
      }
    });
  }

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={handleOpen}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--bone-dim)",
            fontFamily: "var(--font-body)",
            fontSize: "0.8125rem",
            cursor: "pointer",
            padding: 0,
            textDecoration: "underline",
            opacity: 0.6,
          }}
        >
          Delete quote
        </button>
      )}

      {open && (
        <div
          style={{
            background: "var(--ink-raised)",
            border: "1px solid var(--ember)",
            borderRadius: "var(--radius)",
            padding: "20px 24px",
            marginTop: "12px",
            maxWidth: "420px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              color: "var(--bone)",
              marginBottom: "6px",
            }}
          >
            Delete <span style={{ fontFamily: "var(--font-spec)" }}>{quoteNumber}</span>?
          </p>
          <p
            style={{
              fontSize: "0.8rem",
              color: "var(--bone-dim)",
              marginBottom: "14px",
              lineHeight: 1.5,
            }}
          >
            This is permanent. Zones, runs, and line items will be removed.
            The quote number will not be reused. Type the quote number to confirm.
          </p>

          <input
            value={typed}
            onChange={e => { setTyped(e.target.value); setError(null); }}
            placeholder={quoteNumber}
            autoFocus
            style={{
              width: "100%",
              background: "var(--ink)",
              border: "1px solid var(--ink-line)",
              color: "var(--bone)",
              padding: "8px 12px",
              borderRadius: "var(--radius)",
              fontSize: "0.875rem",
              fontFamily: "var(--font-spec)",
              outline: "none",
              marginBottom: "10px",
              boxSizing: "border-box",
            }}
            onKeyDown={e => { if (e.key === "Enter") handleDelete(); if (e.key === "Escape") handleCancel(); }}
          />

          {error && (
            <p style={{ color: "var(--ember)", fontSize: "0.8rem", marginBottom: "10px" }}>
              {error}
            </p>
          )}

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending || typed !== quoteNumber}
              style={{
                background: typed === quoteNumber ? "var(--ember)" : "var(--ink-line)",
                border: "none",
                color: typed === quoteNumber ? "#fff" : "var(--bone-dim)",
                fontFamily: "var(--font-body)",
                fontSize: "0.8125rem",
                padding: "8px 18px",
                borderRadius: "var(--radius)",
                cursor: typed === quoteNumber ? "pointer" : "not-allowed",
                transition: "background 150ms ease",
              }}
            >
              {isPending ? "Deleting…" : "Delete permanently"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              style={{
                background: "transparent",
                border: "1px solid var(--ink-line)",
                color: "var(--bone-dim)",
                fontFamily: "var(--font-body)",
                fontSize: "0.8125rem",
                padding: "8px 18px",
                borderRadius: "var(--radius)",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
