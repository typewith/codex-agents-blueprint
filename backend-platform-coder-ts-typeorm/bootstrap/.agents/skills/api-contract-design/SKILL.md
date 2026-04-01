---
name: api-contract-design
description: Use when the user asks to design or change backend contracts.
---

Follow this workflow for backend contract design:

1. Inspect existing request or response shape and compatibility requirements.
2. Use `templates/contracts/http-contract.md` to document the change.
3. Record compatibility, examples, and rollout caveats before code changes spread.

- Do not hide breaking behavior behind vague naming.
- Keep concrete examples in the contract notes.
