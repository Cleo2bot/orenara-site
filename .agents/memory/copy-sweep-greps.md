---
name: Copy-sweep greps on JSX prose
description: Why single-line greps miss marketing copy in JSX and how to sweep reliably
---
Rule: when sweeping marketing copy for a phrase (e.g. "20 business days"), always run the grep with multiline mode in addition to the plain pass.
**Why:** JSX prose wraps across source lines ("… — 20\n business days as standard …"), so a single-line grep reports a clean sweep while the phrase still renders on the page. This produced a false "clean" QA result on the Orenara language pivot; the miss was only caught in a screenshot.
**How to apply:** after edits, re-run the same pattern with `\s+` between words and multiline enabled, and spot-check rendered pages for the highest-traffic surfaces.
