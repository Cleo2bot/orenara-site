"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

const initial: LoginState = { error: null, locked: false, remainingMs: 0 };

export default function LoginPage() {
  const [state, dispatch, pending] = useActionState(loginAction, initial);

  const lockedMins = Math.ceil((state.remainingMs ?? 0) / 60000);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--ink)",
        padding: "24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "360px" }}>
        <div style={{ marginBottom: "40px", textAlign: "center" }}>
          <span className="wordmark wordmark-md">Orenara</span>
          <p
            style={{
              marginTop: "8px",
              fontSize: "0.8125rem",
              color: "var(--bone-dim)",
              fontFamily: "var(--font-body)",
            }}
          >
            Admin area
          </p>
        </div>

        <div
          style={{
            background: "var(--ink-raised)",
            border: "1px solid var(--ink-line)",
            borderRadius: "var(--radius)",
            padding: "32px",
          }}
        >
          {state.locked ? (
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--bone-dim)",
                textAlign: "center",
                lineHeight: 1.6,
              }}
            >
              Too many failed attempts.
              <br />
              Try again in {lockedMins} minute{lockedMins === 1 ? "" : "s"}.
            </p>
          ) : (
            <form action={dispatch} noValidate>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  fontSize: "0.8125rem",
                  color: "var(--bone-dim)",
                  marginBottom: "8px",
                  fontFamily: "var(--font-body)",
                }}
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="enquiry-input"
                style={{ marginBottom: "8px" }}
                disabled={pending}
              />

              {state.error && (
                <p
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--ember)",
                    marginBottom: "12px",
                    marginTop: "4px",
                  }}
                >
                  {state.error}
                </p>
              )}

              <button
                type="submit"
                className="btn-primary"
                style={{ width: "100%", marginTop: "16px" }}
                disabled={pending}
              >
                {pending ? "Checking…" : "Enter"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
