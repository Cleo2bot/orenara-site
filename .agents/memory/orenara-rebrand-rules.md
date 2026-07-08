---
name: Orenara rebrand ground rules
description: Standing user decisions for the Duskline→Orenara rebrand and repo handling
---

# Orenara rebrand ground rules

- **Never push to GitHub (Cleo2bot/duskline) without explicit user approval, every time.**
  **Why:** standing user rule; the repo auto-deploys to Vercel.
- Email domain is intentionally `orenara.com` (Resend-verified); site canonical is `orenara.com.au`. Do NOT "correct" this mismatch.
- Package name `@workspace/duskline` and folder `artifacts/duskline` stay unchanged (approved exceptions, listed for handover).
- Rebrand spec (attached_assets Pasted--REBRAND-DUSKLINE-ORENARA…txt) must be executed phase-by-phase, STOPPING after each phase for review with desktop + 360px screenshots. No copy rewrites outside the Phase 5 whitelist; no gradients/glows/shadows; no structure changes; preserve forms/quote-builder.
- `.next/**` was untracked from git (July 2026, with user sign-off) — `.gitignore` now takes effect. History purge (old encryption key in past commits) remains deferred.
- Production Vercel alias: `duskline-api-server.vercel.app` (project name is a misnomer; it serves the Next.js site). Per-deployment `*-projects.vercel.app` URLs are behind Vercel login — verify on the stable alias.
