"use client";

import { useState, useTransition } from "react";
import { saveQuoteEdits } from "@/lib/admin/actions";

interface LineItem {
  id?: number;
  partNumber: string;
  description: string;
  qty: string;
  unit: string;
  isGenerated: boolean;
  sortOrder: number;
}

const cellInput: React.CSSProperties = {
  background: "transparent",
  border: "1px solid transparent",
  color: "var(--bone)",
  padding: "4px 6px",
  borderRadius: "var(--radius)",
  fontSize: "0.875rem",
  fontFamily: "var(--font-body)",
  width: "100%",
  outline: "none",
  transition: "border-color 150ms ease",
};

const monoCell: React.CSSProperties = {
  fontFamily: "var(--font-spec)",
  fontSize: "0.8rem",
  color: "var(--bone-dim)",
  letterSpacing: "0.04em",
};

export default function LineItemsEditor({
  quoteId,
  initialItems,
  initialSystemPrice,
  initialNotes,
  initialWarrantyLine,
}: {
  quoteId: number;
  initialItems: LineItem[];
  initialSystemPrice: string;
  initialNotes: string;
  initialWarrantyLine: string;
}) {
  const [items, setItems] = useState<LineItem[]>(initialItems);
  const [systemPrice, setSystemPrice] = useState(initialSystemPrice);
  const [notes, setNotes] = useState(initialNotes);
  const [warrantyLine, setWarrantyLine] = useState(initialWarrantyLine);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [addPart, setAddPart] = useState("");
  const [addDesc, setAddDesc] = useState("");
  const [addQty, setAddQty] = useState("");
  const [addUnit, setAddUnit] = useState("ea");
  const [showAddForm, setShowAddForm] = useState(false);

  function updateItem(index: number, field: keyof LineItem, value: string) {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
    setSaved(false);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
    setSaved(false);
  }

  function addItem() {
    if (!addPart.trim() || !addDesc.trim() || !addQty.trim()) return;
    setItems((prev) => [
      ...prev,
      {
        partNumber: addPart.trim(),
        description: addDesc.trim(),
        qty: addQty.trim(),
        unit: addUnit.trim() || "ea",
        isGenerated: false,
        sortOrder: prev.length,
      },
    ]);
    setAddPart("");
    setAddDesc("");
    setAddQty("");
    setAddUnit("ea");
    setShowAddForm(false);
    setSaved(false);
  }

  function handleSave() {
    setError(null);
    startTransition(async () => {
      try {
        await saveQuoteEdits(quoteId, items, systemPrice, notes, warrantyLine);
        setSaved(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Save failed.");
      }
    });
  }

  const totalMetres = items
    .filter((i) => i.unit === "l/m")
    .reduce((s, i) => s + parseFloat(i.qty || "0"), 0);

  return (
    <div>
      {/* Line items table */}
      <div
        style={{
          background: "var(--ink-raised)",
          border: "1px solid var(--ink-line)",
          borderRadius: "var(--radius)",
          overflow: "hidden",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px 12px",
            borderBottom: "1px solid var(--ink-line)",
          }}
        >
          <p className="eyebrow">Bill of Materials</p>
          <p style={{ fontSize: "0.75rem", color: "var(--bone-dim)" }}>
            {totalMetres.toFixed(1)}m strip total
          </p>
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            tableLayout: "fixed",
          }}
        >
          <colgroup>
            <col style={{ width: "16%" }} />
            <col style={{ width: "45%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "7%" }} />
          </colgroup>
          <thead>
            <tr
              style={{
                borderBottom: "1px solid var(--ink-line)",
              }}
            >
              {["Part No", "Description", "Qty", "Unit", "", ""].map((h, i) => (
                <th
                  key={i}
                  style={{
                    padding: "8px 12px",
                    textAlign: "left",
                    ...monoCell,
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr
                key={i}
                style={{
                  borderBottom: "1px solid var(--ink-line)",
                  opacity: 1,
                }}
              >
                <td style={{ padding: "6px 12px", ...monoCell }}>
                  {item.partNumber}
                </td>
                <td style={{ padding: "6px 8px" }}>
                  <input
                    value={item.description}
                    onChange={(e) => updateItem(i, "description", e.target.value)}
                    style={{
                      ...cellInput,
                      fontSize: "0.875rem",
                    }}
                    onFocus={(e) =>
                      ((e.target as HTMLInputElement).style.borderColor =
                        "var(--ink-line)")
                    }
                    onBlur={(e) =>
                      ((e.target as HTMLInputElement).style.borderColor =
                        "transparent")
                    }
                  />
                </td>
                <td style={{ padding: "6px 8px" }}>
                  <input
                    value={item.qty}
                    onChange={(e) => updateItem(i, "qty", e.target.value)}
                    style={{
                      ...cellInput,
                      textAlign: "right",
                      fontFamily: "var(--font-spec)",
                    }}
                    onFocus={(e) =>
                      ((e.target as HTMLInputElement).style.borderColor =
                        "var(--ink-line)")
                    }
                    onBlur={(e) =>
                      ((e.target as HTMLInputElement).style.borderColor =
                        "transparent")
                    }
                  />
                </td>
                <td
                  style={{
                    padding: "6px 12px",
                    ...monoCell,
                    color: "var(--bone-dim)",
                  }}
                >
                  {item.unit}
                </td>
                <td style={{ padding: "6px 8px", textAlign: "center" }}>
                  {!item.isGenerated && (
                    <span
                      style={{
                        fontSize: "0.65rem",
                        color: "var(--bone-dim)",
                        fontFamily: "var(--font-spec)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      manual
                    </span>
                  )}
                </td>
                <td style={{ padding: "6px 8px", textAlign: "center" }}>
                  <button
                    type="button"
                    onClick={() => removeItem(i)}
                    title="Remove"
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--bone-dim)",
                      cursor: "pointer",
                      fontSize: "1rem",
                      lineHeight: 1,
                      padding: "2px 4px",
                    }}
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add item */}
        <div style={{ padding: "12px 20px" }}>
          {!showAddForm ? (
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--bone-dim)",
                cursor: "pointer",
                fontSize: "0.8125rem",
                fontFamily: "var(--font-body)",
                padding: 0,
                textDecoration: "underline",
              }}
            >
              + Add line item
            </button>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "140px 1fr 80px 60px auto auto",
                gap: "8px",
                alignItems: "end",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.7rem",
                    color: "var(--bone-dim)",
                    marginBottom: "4px",
                    fontFamily: "var(--font-spec)",
                    textTransform: "uppercase",
                  }}
                >
                  Part no
                </label>
                <input
                  value={addPart}
                  onChange={(e) => setAddPart(e.target.value)}
                  placeholder="OR-DIM-010V"
                  style={{
                    background: "var(--ink)",
                    border: "1px solid var(--ink-line)",
                    color: "var(--bone)",
                    padding: "6px 8px",
                    borderRadius: "var(--radius)",
                    fontSize: "0.8rem",
                    fontFamily: "var(--font-spec)",
                    width: "100%",
                    outline: "none",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.7rem",
                    color: "var(--bone-dim)",
                    marginBottom: "4px",
                    fontFamily: "var(--font-spec)",
                    textTransform: "uppercase",
                  }}
                >
                  Description
                </label>
                <input
                  value={addDesc}
                  onChange={(e) => setAddDesc(e.target.value)}
                  style={{
                    background: "var(--ink)",
                    border: "1px solid var(--ink-line)",
                    color: "var(--bone)",
                    padding: "6px 8px",
                    borderRadius: "var(--radius)",
                    fontSize: "0.875rem",
                    fontFamily: "var(--font-body)",
                    width: "100%",
                    outline: "none",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.7rem",
                    color: "var(--bone-dim)",
                    marginBottom: "4px",
                    fontFamily: "var(--font-spec)",
                    textTransform: "uppercase",
                  }}
                >
                  Qty
                </label>
                <input
                  value={addQty}
                  onChange={(e) => setAddQty(e.target.value)}
                  style={{
                    background: "var(--ink)",
                    border: "1px solid var(--ink-line)",
                    color: "var(--bone)",
                    padding: "6px 8px",
                    borderRadius: "var(--radius)",
                    fontSize: "0.875rem",
                    fontFamily: "var(--font-spec)",
                    width: "100%",
                    outline: "none",
                    textAlign: "right",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.7rem",
                    color: "var(--bone-dim)",
                    marginBottom: "4px",
                    fontFamily: "var(--font-spec)",
                    textTransform: "uppercase",
                  }}
                >
                  Unit
                </label>
                <input
                  value={addUnit}
                  onChange={(e) => setAddUnit(e.target.value)}
                  style={{
                    background: "var(--ink)",
                    border: "1px solid var(--ink-line)",
                    color: "var(--bone)",
                    padding: "6px 8px",
                    borderRadius: "var(--radius)",
                    fontSize: "0.875rem",
                    fontFamily: "var(--font-spec)",
                    width: "100%",
                    outline: "none",
                  }}
                />
              </div>
              <button
                type="button"
                onClick={addItem}
                className="btn-outline"
                style={{ width: "auto", padding: "6px 14px", fontSize: "0.8rem" }}
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--bone-dim)",
                  cursor: "pointer",
                  fontSize: "1rem",
                  padding: "6px 4px",
                }}
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Price + warranty + notes */}
      <div
        style={{
          background: "var(--ink-raised)",
          border: "1px solid var(--ink-line)",
          borderRadius: "var(--radius)",
          padding: "20px 24px",
          marginBottom: "16px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "16px",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.75rem",
              color: "var(--bone-dim)",
              marginBottom: "5px",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              fontFamily: "var(--font-body)",
            }}
          >
            System price (AUD ex GST)
          </label>
          <input
            value={systemPrice}
            onChange={(e) => {
              setSystemPrice(e.target.value);
              setSaved(false);
            }}
            placeholder="e.g. 4800"
            style={{
              width: "100%",
              background: "var(--ink)",
              border: "1px solid var(--ink-line)",
              color: "var(--bone)",
              padding: "10px 14px",
              borderRadius: "var(--radius)",
              fontSize: "1rem",
              fontFamily: "var(--font-spec)",
              outline: "none",
            }}
          />
        </div>
        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.75rem",
              color: "var(--bone-dim)",
              marginBottom: "5px",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              fontFamily: "var(--font-body)",
            }}
          >
            Warranty line (PDF)
          </label>
          <input
            value={warrantyLine}
            onChange={(e) => {
              setWarrantyLine(e.target.value);
              setSaved(false);
            }}
            style={{
              width: "100%",
              background: "var(--ink)",
              border: "1px solid var(--ink-line)",
              color: "var(--bone)",
              padding: "10px 14px",
              borderRadius: "var(--radius)",
              fontSize: "0.875rem",
              fontFamily: "var(--font-body)",
              outline: "none",
            }}
          />
        </div>
        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.75rem",
              color: "var(--bone-dim)",
              marginBottom: "5px",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              fontFamily: "var(--font-body)",
            }}
          >
            Internal notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              setSaved(false);
            }}
            rows={3}
            style={{
              width: "100%",
              background: "var(--ink)",
              border: "1px solid var(--ink-line)",
              color: "var(--bone)",
              padding: "10px 14px",
              borderRadius: "var(--radius)",
              fontSize: "0.875rem",
              fontFamily: "var(--font-body)",
              outline: "none",
              resize: "vertical",
            }}
          />
        </div>
      </div>

      {error && (
        <p
          style={{
            color: "var(--ember)",
            fontSize: "0.875rem",
            marginBottom: "12px",
          }}
        >
          {error}
        </p>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button
          type="button"
          onClick={handleSave}
          className="btn-primary"
          style={{ minWidth: "160px" }}
          disabled={isPending}
        >
          {isPending ? "Saving…" : "Save"}
        </button>
        {saved && (
          <p
            style={{
              color: "var(--bone-dim)",
              fontSize: "0.8125rem",
              fontFamily: "var(--font-body)",
            }}
          >
            Saved.
          </p>
        )}
      </div>
    </div>
  );
}
