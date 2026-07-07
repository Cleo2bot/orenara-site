---
name: Orenara image treatment quirks
description: Sharp edges in the .img-treated / .img-warm-bias CSS system on the Duskline/Orenara site
---

- `.img-treated` sets `position: relative` (plus `isolation: isolate`), which silently overrides Tailwind's `absolute` utility when both are on one element (globals.css loads after utilities here). For absolutely-positioned image wrappers (e.g. hero fill backgrounds), set `position: absolute; inset: 0` via inline style on the wrapper instead of the Tailwind class.
  **Why:** Hero background collapsed to height 0 when `img-treated absolute inset-0` were combined; next/image `fill` needs a sized positioned parent.
  **How to apply:** Any time `.img-treated` wraps a `fill` image or needs non-relative positioning.
- Warm-biasing a strongly green photo with CSS filters only reads amber at full strength: `saturate(0) sepia(1) hue-rotate(-6deg) saturate(1.6) contrast(1.06) brightness(0.9)`. Partial sepia (0.5–0.85) still reads green-grey under the dark overlay.
  **Why:** Took 3 attempts; residual original chroma dominates under darkening scrims.
- `::after` overlay uses `pointer-events: none`, so clickable thumbnails/lightbox triggers under treatment stay operable — verified by architect review.
