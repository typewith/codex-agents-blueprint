---
name: release-evidence-pack
description: Use when the user asks for release or handoff evidence.
---

Follow this workflow for backend evidence packaging:

1. Run `node scripts/qa/collect-evidence.mjs --item <ITEM_ID> --worktree <PATH>`.
2. Attach command outputs, contract notes, migration notes, and risk statements beside the generated summary.
3. Keep gaps explicit before publication.

- Do not open the PR without evidence.
- Do not hide unvalidated behavior.
