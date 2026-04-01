---
name: github-pr-ops
description: Use when the user asks to publish or maintain the PR for this mobile blueprint.
---

Follow this workflow for GitHub PR operations:

1. Run `node scripts/github/open-pr.mjs --item <ITEM_ID> --worktree <PATH>` after collecting evidence.
2. Use `node scripts/github/poll-review-feedback.mjs --item <ITEM_ID>` to inspect review state.
3. Use `node scripts/github/reply-review-comments.mjs --item <ITEM_ID>` when a thread needs an explicit answer.

- Keep the PR in draft unless a human requests promotion.
- Keep platform notes and evidence links visible in the PR body.
