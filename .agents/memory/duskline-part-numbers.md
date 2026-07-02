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
