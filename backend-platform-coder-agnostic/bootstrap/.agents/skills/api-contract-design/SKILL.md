---
name: api-contract-design
description: Use when the user asks to design or change contracts in a stack-agnostic backend.
---

Follow this workflow for backend contract design:

1. Inspect the current boundary and expected compatibility.
2. Use `templates/contracts/http-contract.md` to record the contract change.
3. Keep examples and compatibility notes explicit before implementation fans out.

- Do not hide breaking behavior behind generic naming.
- Prefer concrete examples over broad abstractions.
