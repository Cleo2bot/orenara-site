---
name: GitHub integration binding & git-push quirks
description: Non-obvious gotchas when binding the Replit GitHub connection and pushing via the code_execution sandbox
---

# GitHub integration binding & push quirks

## Binding "could not be assigned" is often a false negative
- For a `not_added` GitHub connection: call `addIntegration(id)` then `proposeIntegration(id)` (the latter sets `exitLoop`).
- After proposeIntegration, the `<automatic_updates>` may say *"Connection … could not be assigned due to a temporary error. Please try again."* — this can be a FALSE NEGATIVE. The binding may have actually succeeded.
- **Always verify with `listConnections('github')`** instead of trusting the error. A successful bind returns one connection with `status: 'healthy'` and `settings.access_token`.

## code_execution sandbox pitfalls (for git ops)
- `execSync` of a long/blocking git command (e.g. `git push`) throws **"Script execution blocked the event loop"**. Use promisified `child_process.exec` (`await promisify(exec)(cmd)`) instead — the child process may still complete even when the sync call errors.
- The notebook **restarts between calls**, wiping `globalThis`. Re-fetch the token via `listConnections` inside the SAME code block where you use it; do not stash it in `globalThis` across calls.

## Pushing to a new repo
- Create repo: `POST https://api.github.com/user/repos` with `Bearer <token>`.
- Push without persisting the token in `.git/config`: push to an ephemeral URL `https://x-access-token:<token>@github.com/<owner>/<repo>.git main:main`, and keep `origin` set to the clean URL (no token).
- **Never log the token** — sanitize command/output strings (replace token with `***`) before printing.
