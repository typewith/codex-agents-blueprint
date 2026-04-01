---
name: github-pr-ops
description: Use when the user asks to open or maintain the PR for this blueprint.
---

Follow this workflow for GitHub PR operations:

1. Run `node scripts/github/open-pr.mjs --item <ITEM_ID> --worktree <PATH>` after collecting evidence.
2. Use `node scripts/github/poll-review-feedback.mjs --item <ITEM_ID>` to fetch review state.
3. Use `node scripts/github/reply-review-comments.mjs --item <ITEM_ID>` when a thread needs an explicit answer.

- Keep the PR in draft unless a human explicitly requests promotion.
- Keep risk notes and evidence links visible in the PR description.
