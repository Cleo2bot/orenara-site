---
name: Duskline supplier vs. own part numbers
description: Rule for where/how Duskline's product part numbers may appear on the marketing site
---

Duskline sources components from suppliers under their own SKUs (e.g. `SF17-24V-2835-120-2700K`,
`ALC17S02FLX-1000MM`, `ALC16S02-1000MM`). These supplier codes must never appear anywhere in the
site UI, emails, or PDFs — customers should only ever see Duskline's own renamed part numbers
(the `DL-*` codes defined in `lib/quoteCalc.ts` `PART_NUMBERS`).

**Why:** the user explicitly does not want to expose which supplier/manufacturer they source from,
and wants their own branding on every part reference customers see.

**How to apply:** when adding any new place that could show a part number (spec tables, kit pages,
quote PDFs, emails, schema markup), always pull from `PART_NUMBERS`/`PART_LABELS` in
`lib/quoteCalc.ts`, never hardcode or reference the raw supplier SKUs even in placeholder content.

Additionally, part numbers should stay low-key on the marketing site: the homepage kit cards
(`components/sections/ProductKits.tsx`) intentionally show no part numbers at all — only a
"See full specifications" link per kit that goes to a dedicated `/kits/[slug]` page
(`app/kits/[slug]/page.tsx`, data in `lib/kits.ts`) where the full spec table with part numbers
lives. This was a deliberate choice (not an accordion) so each kit also gets its own indexable URL
for future SEO purposes.

## Next.js hydration crashes from `new Date()` at render time

Calling `new Date()` (or `.toLocaleDateString()`/`.getFullYear()`) directly in a component body
causes a server/client hydration text mismatch whenever the date/year rolls over between the
server-rendered HTML and the client hydration pass. React then discards the SSR output and
switches the whole page to client rendering — in this app that surfaced to the user as the entire
artifact preview crashing ("Your Duskline artifact encountered an error"), not just a console
warning.

**Why:** this bit the project for real — `PrintQuoteView.tsx` computed a "Generated {date}" string
at render time and crashed the live preview when the date rolled over mid-session.

**How to apply:** never compute the current date/year at render time in a component that's part of
the SSR tree. Use `useState` initialized to a static/placeholder value, then set the real value in
a `useEffect` (client-only, post-mount) — this pattern is now used in both `PrintQuoteView.tsx` and
`Footer.tsx` in this project. Grep for `new Date()` in `.tsx` files after touching either of these
if adding similar "generated on" / copyright-year UI elsewhere.
