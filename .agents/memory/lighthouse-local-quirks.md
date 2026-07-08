---
name: Lighthouse audits in this Replit env
description: How to get a working Lighthouse run locally for the Next.js site, and why local perf scores under-report vs Vercel.
---

**Rule:** Run Lighthouse against a production build served in the *same bash session*, bound to 0.0.0.0, using nix chromium.

**Why:** Several traps stack up otherwise:
- No Chrome by default — install `chromium` via nix system deps and set `CHROME_PATH=$(which chromium)`.
- `next start` binds IPv6 `::1` by default; Lighthouse/curl on `127.0.0.1` then hit ERR_CONNECTION_REFUSED, which surfaces as a misleading "Chrome prevented page load with an interstitial". Use `-H 0.0.0.0` and audit `http://127.0.0.1:<port>`.
- Backgrounded servers die when the bash session ends — start the server and run Lighthouse in one command.
- `next dev` (workflow) and `next build` share `.next` and clobber each other. Build to a separate dir via a temporary `distDir: process.env.NEXT_DIST_DIR || ".next"` in next.config.mjs, then revert and delete the dir.

**How to apply:** Local mobile perf under-reports vs Vercel (no sharp, no CDN, 4x CPU throttle on shared vCPU); a11y/BP/SEO scores are reliable, treat perf directionally. Baseline July 2026: home mobile perf 56, a11y/BP/SEO 100.
