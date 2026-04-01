---
name: api-contract-design
description: Use when the user asks to design or change service contracts in Go.
---

Follow this workflow for Go contract design:

1. Inspect existing request, response, or message shape.
2. Use `templates/contracts/http-contract.md` to document compatibility and examples.
3. Keep contract changes reviewable before implementation fans out.

- Do not hide breaking behavior in vague naming.
- Prefer concrete examples over abstract descriptions.
