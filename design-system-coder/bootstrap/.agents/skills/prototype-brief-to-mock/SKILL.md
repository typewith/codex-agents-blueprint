---
name: prototype-brief-to-mock
description: Use when the user asks for an end-to-end mock flow from brief to reviewable code.
---

Follow this workflow to move from intent to a reviewable mock:

1. Resolve the work item in `backlog/` or use `--title` and optional `--source-path` for task-first mode.
2. Read `.prototype/` and `docs/architecture/prototype-contract.md` before assembling the mock.
3. Run `node scripts/prototype/prepare-mock.mjs <ITEM_ID>` to create the isolated worktree.
4. Delegate `design-system-architect`, `mock-flow-builder`, `component-implementer`, `visual-reviewer`, `accessibility-reviewer`, `evidence-curator`, and `github-operator` as needed.
5. Save evidence under `artifacts/evidence/<ITEM_ID>/` and keep the PR in draft state.

- Do not edit `.prototype/` during normal execution.
- Do not skip state coverage for loading, empty, error, and success.
