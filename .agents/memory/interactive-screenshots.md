---
name: Interactive-state screenshots
description: How to capture screenshots of UI states that need interaction (form fills etc.) when runTest returns no screenshot files
---
The testing subagent (`runTest`) verifies interactive flows but has returned `screenshotPaths: []` even when asked explicitly; `/tmp/testing-screenshots` stayed empty.
**Why:** checkpoint evidence sometimes requires an image of a state only reachable via interaction (e.g. duskline quote-builder BOM panel after entering runs); the `screenshot` tool can't interact.
**How to apply:** install `puppeteer-core` at root (`pnpm add -D -w`), launch the nix chromium binary (`which chromium`) with `--no-sandbox --disable-dev-shm-usage`, drive the page via data-testids, `element.screenshot()` the panel, then `pnpm remove -w puppeteer-core` and delete any test data created.
