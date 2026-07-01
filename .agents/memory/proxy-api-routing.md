---
name: Proxy shadows Next /api/* routes in this monorepo
description: Why Next.js API routes under /api/* in the duskline web artifact are unreachable through the shared proxy, and where to put form-submit endpoints instead.
---

# Shared proxy routes all /api/* to the Express api-server

The global reverse proxy routes by path prefix, most-specific-first. The `api-server` artifact owns `/api`; the `duskline` web (Next.js) artifact owns `/`. So any request to `/api/*` — including the duskline app's own Next.js route handlers under `app/api/**` — is routed to the Express api-server, NOT to Next. Those Next routes are dead through the proxy (and in production), returning the Express 404 "Cannot POST /api/...".

**Why:** proxy path routing shadows the Next app's `/api` namespace entirely; there is only one `/api` service.

**How to apply:** For a form-submit endpoint that must live in the Next app (fs JSON store + Resend pattern, no OpenAPI codegen), serve it from a path the Next app owns under `/` — e.g. `app/trade/enquire/route.ts` → `/trade/enquire`. Do NOT put it under `app/api/**`. The consumer EnquiryForm posting to `/api/enquire` is affected by this same bug (pre-existing). If enquiries should be a real API, add them to the contract-first Express `api-server` instead.

Also: when interpolating user input into Resend HTML email bodies, escape it (`&<>"'`) — the enquiry routes build HTML by string concatenation.
