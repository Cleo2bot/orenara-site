---
name: Screenshot quirks (Next.js dev + app_preview)
description: Blank app_preview screenshots against the Next.js dev server and how to work around them
---

# Blank app_preview screenshots (Next.js 14 dev)

The `app_preview` screenshot tool frequently returns a **blank/solid-color image** against the Next.js dev server. Two independent triggers:

- **First capture after a code edit** — the dev server is mid-recompile/re-render. Simply re-take the screenshot (sometimes twice) and it renders.
- **Very tall viewports** — heights near the 3000px max (e.g. `[1280, 3000]`) reliably come back blank. Use a moderate height (≤ ~2200px) instead; it renders on the first or second try.

**Also:** URL fragment scrolling (`/#section`) is unreliable — the capture sometimes lands on a different section than the fragment target. Don't depend on the fragment to position a tall capture; verify by content, not by assuming the anchor scrolled correctly.

**How to apply:** when verifying UI visually, prefer viewport heights ≤ ~2200px and be ready to re-screenshot once or twice before concluding something is broken.
