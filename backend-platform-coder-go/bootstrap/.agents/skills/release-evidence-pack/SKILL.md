---
name: release-evidence-pack
description: Use when the user asks for backend evidence or handoff packaging.
---

Follow this workflow for evidence packaging:

1. Run `node scripts/qa/collect-evidence.mjs --item <ITEM_ID> --worktree <PATH>`.
2. Attach command outputs, storage notes, concurrency notes, and open risks beside the summary.
3. Keep anything unvalidated explicit before publication.

- Do not open the PR without evidence.
- Do not hide uncertainty.
