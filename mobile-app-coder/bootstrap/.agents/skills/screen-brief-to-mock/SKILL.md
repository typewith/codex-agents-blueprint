---
name: screen-brief-to-mock
description: Use when the user asks for a mobile screen flow from brief to reviewable implementation.
---

Follow this workflow for mobile screen work:

1. Resolve the work item in `backlog/` or use `--title` and optional `--source-path` for task-first mode.
2. Read `.prototype/` and `docs/architecture/prototype-contract.md` before implementing the screen.
3. Run `node scripts/mobile/prepare-item.mjs <ITEM_ID>` to create the isolated worktree.
4. Delegate `mobile-architect`, `react-native-implementer`, `visual-evidence-reviewer`, `release-curator`, and `github-operator` as needed.
5. Save evidence under `artifacts/evidence/<ITEM_ID>/` and keep the PR in draft state.

- Do not edit `.prototype/` during normal execution.
- Keep loading, empty, error, and success states explicit.
