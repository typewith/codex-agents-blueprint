---
name: code-first-mock-generation
description: Use when the user asks for mock generation in code instead of design tooling.
---

Follow this workflow for fast code-first mock generation:

1. Map the target route, component shell, and state list.
2. Run `node scripts/prototype/generate-mock.mjs --item <ITEM_ID>` to create review notes and artifact placeholders.
3. Implement the mock with explicit interaction and copy assumptions.
4. Record any gaps between the brief and the mock in `artifacts/review/`.

- Favor clarity and testability over visual decoration.
- Keep token assumptions explicit when the system is still being invented.
