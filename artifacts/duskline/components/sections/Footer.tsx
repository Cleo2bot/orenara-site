"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Wordmark from "@/components/Wordmark";
import { Mail, Instagram } from "lucide-react";

const BUILD_YEAR = new Date().getFullYear();

export default function Footer() {
  const [year, setYear] = useState(BUILD_YEAR);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer
      style={{
        background: "var(--ink)",
        borderTop: "1px solid var(--ink-line)",
        paddingTop: "64px",
        paddingBottom: "40px",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand col */}
          <div>
            <Wordmark size="md" />
            <p
              className="spec-mono-upper"
              style={{
                fontSize: "10.5px",
                color: "var(--bone-dim)",
                letterSpacing: "0.16em",
                marginTop: "10px",
                marginBottom: "20px",
              }}
              data-testid="footer-wordmark-subline"
            >
              IP68 · Made to Order · Australia
            </p>
            <p style={{ fontSize: "0.9rem", color: "var(--bone-dim)", lineHeight: 1.7, maxWidth: "280px" }}>
              The most capable outdoor strip lighting available in Australia. Fully
              submersible (IP68), properly dimmable, built to last.
            </p>
          </div>

          {/* Contact col */}
          <div>
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "var(--bone-dim)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "16px",
              }}
            >
              Contact
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:hello@orenara.com"
                className="flex items-center gap-2"
                style={{ color: "var(--bone-dim)", fontSize: "0.9rem", textDecoration: "none", transition: "color 0.15s ease" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--bone)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--bone-dim)")}
                data-testid="footer-email"
              >
                <Mail size={15} style={{ color: "var(--bone-dim)" }} />
                hello@orenara.com
              </a>
              <a
                href="https://instagram.com/orenara.lighting"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
                style={{ color: "var(--bone-dim)", fontSize: "0.9rem", textDecoration: "none", transition: "color 0.15s ease" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--bone)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--bone-dim)")}
                data-testid="footer-instagram"
              >
                <Instagram size={15} style={{ color: "var(--bone-dim)" }} />
                @orenara.lighting
              </a>
            </div>
          </div>

          {/* Notes col */}
          <div>
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "var(--bone-dim)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "16px",
              }}
            >
              Important
            </p>
            <p style={{ fontSize: "0.8125rem", color: "var(--bone-dim)", lineHeight: 1.7 }}>
              Orenara is a supply-only business. We supply components only;
              installation is your responsibility and must be carried out by a licensed
              electrician where required by Australian standards.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "var(--ink-line)", marginBottom: "24px" }} />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5">
            <p style={{ fontSize: "0.8rem", color: "var(--bone-dim)" }}>
              © {year} Orenara. All rights reserved.
            </p>
            <Link
              href="/terms"
              style={{ fontSize: "0.8rem", color: "var(--bone-dim)", textDecoration: "none" }}
              data-testid="footer-terms-link"
            >
              Terms &amp; Conditions
            </Link>
            <Link
              href="/trade-resources"
              style={{ fontSize: "0.8rem", color: "var(--bone-dim)", textDecoration: "none" }}
              data-testid="footer-trade-resources-link"
            >
              Trade Resources
            </Link>
            <Link
              href="/privacy"
              style={{ fontSize: "0.8rem", color: "var(--bone-dim)", textDecoration: "none" }}
              data-testid="footer-privacy-link"
            >
              Privacy Policy
            </Link>
          </div>
          <p className="spec-mono">IP68. No excuses.</p>
        </div>
      </div>
    </footer>
  );
}
