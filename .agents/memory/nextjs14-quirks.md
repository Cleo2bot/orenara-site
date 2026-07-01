---
name: Next.js 14 quirks (this monorepo)
description: Non-obvious Next.js 14 App Router gotchas hit while building the duskline artifact — config format, dev-origin allowlist, and stale-chunk 404s.
---

# Next.js 14 App Router quirks

## Config file must be .mjs/.js, not .ts
Next 14 rejects `next.config.ts`. Use `next.config.mjs` (plain JS). Symptom: dev server refuses to start.

## allowedDevOrigins uses minimatch — `"*"` fails
`allowedDevOrigins: ["*"]` throws because Next 14 matches with minimatch. Provide explicit host globs instead, e.g. `["*.replit.dev","*.picard.replit.dev","*.repl.co","*.picard.repl.co","*.replit.app"]`. Needed so the proxied preview iframe can load `/_next/*`.

## Stale `_next/static/chunks/*` 404s after Fast Refresh full reload
After editing a file that triggers "Fast Refresh had to perform a full reload", the browser may request old chunk URLs → cascade of `/_next/static/...` 404s, `ChunkLoadError`, and hydration errors.
**Why:** the build manifest changed but the stale client is still requesting pre-reload chunk names.
**How to apply:** this is dev-only and not a code bug. Restart the artifact's workflow for a clean manifest, then re-screenshot. Don't chase it as a real error.

## Client components need "use client"
Any component using event handlers (onMouseEnter/Leave, onClick) or hooks must have `"use client"` at the top, or the build fails.
