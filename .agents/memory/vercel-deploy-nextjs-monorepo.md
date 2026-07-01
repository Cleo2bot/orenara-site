---
name: Deploying a Replit pnpm-monorepo Next.js artifact to Vercel
description: The sequence of Vercel-specific blockers when a user insists on deploying a Replit monorepo artifact to Vercel instead of Replit Deployments
---

# Deploying a Replit pnpm-monorepo Next.js artifact to Vercel

Replit monorepo artifacts are built for Replit Deployments; Vercel works only for the
static/Next.js frontend artifact, NOT the Express `api-server` (long-running
`app.listen` servers don't run on Vercel). If the user insists on Vercel, expect this
chain of blockers (each surfaced as a separate failed build):

1. **Wrong folder** — Vercel's *Root Directory* defaults to whatever it first detected
   (often `artifacts/api-server`). The build log shows `@workspace/api-server ... build.mjs`.
   Fix: user sets **Root Directory = the frontend artifact dir** (e.g. `artifacts/duskline`)
   in Vercel dashboard. This is dashboard-only; code can't override it.

2. **`No entrypoint found. Searched for app/index/server.{js,...}`** — appears AFTER
   `next build` succeeds. Means Vercel built Next but is deploying as a generic Node
   project because the **Framework Preset isn't Next.js** (changing Root Directory does
   NOT re-detect the framework). Robust code-side fix: add `vercel.json` in the artifact
   dir with `{"framework":"nextjs"}` — this overrides the dashboard preset.

3. **`Deployment Blocked: commit author email (…) is not valid`** — Vercel (Hobby)
   requires the deployed commit's author email to map to the connected GitHub account.
   Replit checkpoint/agent commits use `agent@replit`, which is invalid.
   Fix: set git author to the GitHub account's noreply email
   `{id}+{login}@users.noreply.github.com` (get id/login from `GET /api.github.com/user`)
   and push a fresh commit. Only HEAD's author matters; a normal `--allow-empty` commit
   avoids a history-rewriting force-push.

## Next.js route handlers + Vercel read-only FS
- Route handlers that `writeFile`/`mkdir` to `process.cwd()` (e.g. logging enquiries to
  `data/submissions.json`) **throw on Vercel** (read-only, ephemeral FS) and 500 the
  request. Wrap the disk write in try/catch (non-fatal) so the request still succeeds;
  rely on the email/DB path for real persistence. `/tmp` is writable but ephemeral.

**Why:** each blocker only surfaces once the previous one is cleared, so it feels like
whack-a-mole. Knowing the full sequence lets you fix code-side items (vercel.json, disk
writes, commit author) up front and hand the user the two dashboard actions (Root
Directory + env vars) in one go.
