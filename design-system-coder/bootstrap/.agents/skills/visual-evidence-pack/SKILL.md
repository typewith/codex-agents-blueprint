---
name: visual-evidence-pack
description: Use when the user asks for a review-ready visual evidence package.
---

Follow this workflow to capture visual evidence:

1. Run `node scripts/qa/collect-visual-evidence.mjs --item <ITEM_ID>` to create the evidence skeleton.
2. Attach screenshots, interaction notes, accessibility notes, and known gaps beside the generated summary.
3. Keep artifact names stable and easy for reviewers to inspect.

- Do not open the PR without explicit validation notes.
- Do not hide unresolved design gaps.
