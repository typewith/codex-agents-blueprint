---
name: release-evidence-pack
description: Use when the user asks for readiness evidence or review packaging.
---

Follow this workflow for release evidence packaging:

1. Run `node scripts/qa/collect-evidence.mjs --item <ITEM_ID> --worktree <PATH>`.
2. Attach contract notes, decision notes, validation commands, and explicit risk statements.
3. Keep reviewers able to approve or reject from the artifact set alone.

- Do not open the PR without evidence.
- Do not hide uncertainty or missing validation.
