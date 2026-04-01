---
name: api-contract-sync
description: Use when the user asks to sync mobile screens with API contracts.
---

Follow this workflow for API contract sync:

1. Map the mobile state assumptions and the contract surface they depend on.
2. Review loading, empty, error, retry, and auth behavior explicitly.
3. Record contract caveats and validation notes under `artifacts/evidence/<ITEM_ID>/`.

- Do not treat API shape as stable without checking.
- Keep user-visible fallbacks explicit.
