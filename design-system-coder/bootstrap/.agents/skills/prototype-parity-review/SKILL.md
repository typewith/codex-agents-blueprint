---
name: prototype-parity-review
description: Use when the user asks for a parity check between brief, prototype, and generated mock.
---

Follow this workflow for prototype parity review:

1. Read `.prototype/` and the current work item again before reviewing.
2. Run `node scripts/prototype/check-parity.mjs --item <ITEM_ID>` to write the parity report.
3. Capture copy mismatches, state gaps, token drift, and interaction inconsistencies.

- Be explicit about what is missing, not only what is correct.
- Treat parity as product intent validation, not just pixel comparison.
