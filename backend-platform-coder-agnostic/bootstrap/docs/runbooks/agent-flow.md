# Runbook: agent flow

## Backlog-first mode

Use this mode when the repository tracks work in `backlog/EPIC-*` and `TASK-*`.

Expected flow:

1. Resolve the work item.
2. Read architecture docs, relevant contracts, and any prior decisions.
3. Run `node scripts/backlog/prepare-item.mjs <ITEM_ID>`.
4. Delegate to the agents listed in this blueprint.
5. Collect evidence and open a draft PR.
6. Run `node scripts/backlog/finalize-item.mjs <ITEM_ID>` after local cleanup.

## Task-first mode

Use `--title` and optional `--source-path` with the same scripts when the work item lives outside `backlog/`.

## Hard rules

- do not hide migration or rollout risk
- do not merge automatically
- do not leave worktree cleanup implicit
