---
name: react-pdf layout rules
description: Hard-won rules for reliable page layout, footers, and image overlays in @react-pdf/renderer v4.x
---

## Negative horizontal margins break yoga height accounting
**Rule:** Never use `marginLeft: -N, marginRight: -N` on children inside a page to achieve full-bleed elements.

**Why:** Yoga miscounts the child's height contribution, causing phantom content overflow and extra blank pages even when the content visually fits.

**How to apply:** Set `paddingLeft: 0, paddingRight: 0` on the `<Page>` style, then wrap all indented content in `<View style={{ paddingLeft: H_PAD, paddingRight: H_PAD }}>` sections. Full-bleed elements (hero band, dark pitch block) need no special treatment — they're naturally full-width.

---

## Absolute-positioned footer creates a spurious extra page
**Rule:** Do not use `position: absolute` for a page footer in react-pdf.

**Why:** react-pdf places absolute elements relative to the page border-box. When page content fills the content-box, the absolute footer lands in the paddingBottom zone which react-pdf apparently can't render in-place — it pushes the footer to a new page, creating a blank ghost page.

**How to apply:** Use a `flexGrow: 1` spacer View above the footer, and render the footer as a normal in-flow element at the end of the page. The spacer absorbs all remaining vertical space, pushing the footer to the bottom. Works on both content-heavy and content-light pages.

```tsx
<View style={{ flexGrow: 1 }} />
<View style={s.footer}>...</View>
```

---

## Text overlay on a hero image
**Rule:** Use `position: relative` on the containing View, then `position: absolute` on both the `<Image>` and the `<Text>` overlay.

**Why:** Without `position: relative` on the container, absolute children escape the band's height and overlay unrelated page content.

**How to apply:**
```tsx
heroBand: { height: 110, position: "relative" },
heroImage: { position: "absolute", top: 0, left: 0, width: "100%", height: 110, objectFit: "cover" },
heroTagline: { position: "absolute", top: 12, left: H_PAD, ... },
```

---

## objectFit: "cover" with explicit numeric height
**Rule:** Always set numeric `height` (not percentage) directly on the `<Image>` component alongside `objectFit: "cover"`. Do not rely solely on the parent View's height to constrain the image.

**Why:** If only the parent View has a fixed height and the Image has `height: "100%"`, react-pdf may render the image at its natural aspect-ratio height and overflow the View, pushing all subsequent content down and causing multi-page overflow.

---

## Page count budget for Orenara quote PDFs
- A4 usable height (paddingTop 44 + paddingBottom 44): ~754pt
- Hero band: 110pt
- Each table row (paddingVertical 3, 9pt text, 1pt border): ~16pt per single-line row, ~29pt for 2-line descriptions
- Spacer + footer: ~30pt
- 9 single-line items with the current template fit comfortably on page 1
