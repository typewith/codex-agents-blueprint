---
name: background-jobs-and-integrations
description: Use when the user asks for async backend work or integrations.
---

Follow this workflow for jobs and integrations:

1. Define idempotency, retry posture, and failure visibility.
2. Keep dependency boundaries explicit.
3. Save validation notes and integration evidence under `artifacts/evidence/<ITEM_ID>/`.

- Do not leave retry and failure behavior implicit.
- Prefer explicit state transitions over hidden side effects.
