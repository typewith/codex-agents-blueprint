---
name: screen-parity-review
description: Use when the user asks for a parity check between mobile screens and the prototype contract.
---

Follow this workflow for mobile screen parity review:

1. Read `.prototype/` and the current work item again before reviewing.
2. Run `node scripts/mobile/run-screen-check.mjs --item <ITEM_ID>` to write review notes.
3. Capture hierarchy issues, missing states, copy drift, and platform-fit concerns.

- Be explicit about what is missing, not only what is correct.
- Treat parity as product intent validation, not only styling.
