"use client";
import Link from "next/link";
import Wordmark from "@/components/Wordmark";
import { Mail, Instagram } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "#15171C",
        borderTop: "1px solid rgba(91,100,120,0.2)",
        paddingTop: "64px",
        paddingBottom: "40px",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand col */}
          <div>
            <Wordmark size="md" className="mb-4" />
            <p style={{ fontSize: "0.9rem", color: "#9A9DA8", lineHeight: 1.7, maxWidth: "280px" }}>
              The most capable outdoor strip lighting available in Australia. IP68-rated,
              properly dimmable, built to last.
            </p>
          </div>

          {/* Contact col */}
          <div>
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#5B6478",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "16px",
              }}
            >
              Contact
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:hello@duskline.com.au"
                className="flex items-center gap-2"
                style={{ color: "#9A9DA8", fontSize: "0.9rem", textDecoration: "none", transition: "color 0.15s ease" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#F4F1EA")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#9A9DA8")}
                data-testid="footer-email"
              >
                <Mail size={15} style={{ color: "#5B6478" }} />
                hello@duskline.com.au
              </a>
              <a
                href="https://instagram.com/duskline.studio"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
                style={{ color: "#9A9DA8", fontSize: "0.9rem", textDecoration: "none", transition: "color 0.15s ease" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#F4F1EA")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#9A9DA8")}
                data-testid="footer-instagram"
              >
                <Instagram size={15} style={{ color: "#5B6478" }} />
                @duskline.studio
              </a>
            </div>
          </div>

          {/* Notes col */}
          <div>
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#5B6478",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "16px",
              }}
            >
              Important
            </p>
            <p style={{ fontSize: "0.8125rem", color: "#5B6478", lineHeight: 1.7 }}>
              Duskline is a supply-only business. We supply components only;
              installation is your responsibility and must be carried out by a licensed
              electrician where required by Australian standards.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "rgba(91,100,120,0.2)", marginBottom: "24px" }} />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5">
            <p style={{ fontSize: "0.8rem", color: "#5B6478" }}>
              © {year} Duskline. All rights reserved.
            </p>
            <Link
              href="/terms"
              style={{ fontSize: "0.8rem", color: "#9A9DA8", textDecoration: "none" }}
              data-testid="footer-terms-link"
            >
              Terms &amp; Conditions
            </Link>
          </div>
          <p style={{ fontSize: "0.8rem", color: "#5B6478" }}>
            IP68. No excuses.
          </p>
        </div>
      </div>
    </footer>
  );
}
