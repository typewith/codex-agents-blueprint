---
name: adr-driven-design
description: Use when the user asks for Go service architecture decisions or ADRs.
---

Follow this workflow for ADR-driven Go service design:

1. Read the work item and architecture docs first.
2. Start a record from `templates/adr/decision-record.md` when the decision affects boundaries, storage, or concurrency.
3. Keep alternatives and consequences explicit before implementation begins.

- Do not let structural decisions stay implicit.
- Keep ADRs short and decision-oriented.
