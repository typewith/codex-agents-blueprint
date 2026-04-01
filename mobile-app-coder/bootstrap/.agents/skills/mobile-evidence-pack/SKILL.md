---
name: mobile-evidence-pack
description: Use when the user asks for review-ready evidence for a mobile work item.
---

Follow this workflow for mobile evidence packaging:

1. Run `node scripts/qa/collect-mobile-evidence.mjs --item <ITEM_ID>` to create the evidence skeleton.
2. Attach screenshots, platform notes, API sync notes, and open risks beside the generated summary.
3. Keep anything unvalidated explicit before publication.

- Do not open the PR without evidence.
- Do not hide platform-specific caveats.
