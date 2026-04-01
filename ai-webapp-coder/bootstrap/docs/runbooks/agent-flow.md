# Runbook: agent flow

## Backlog-first mode

Use this when the repository tracks work in `backlog/EPIC-*` and `TASK-*`.

Expected flow:

1. Resolve the item in `backlog/`.
2. Read `.prototype/` and `docs/architecture/prototype-contract.md` when UI is involved.
3. Create a worktree and branch.
4. Delegate:
   - `prototype-mapper`
   - `frontend-implementer`
   - `backend-implementer`
   - `integration-validator`
   - `evidence-curator`
   - `github-operator`
   - `reviewer`
5. Run validation and collect evidence.
6. Publish the PR and review summary.
7. Remove the local worktree and return the primary checkout to the main branch.

## Task-first mode

Use this when the work item lives outside `backlog/`.

Expected flow:

1. Pick a stable identifier such as `ISSUE-42` or `SPEC-auth-fallback`.
2. Provide `--title` and optional `--source-path` when using the backlog-aware scripts.
3. Follow the same branch, worktree, evidence, PR, and review conventions.

Example:

```bash
node scripts/backlog/prepare-item.mjs ISSUE-42 --title "Add provider fallback banner" --source-path docs/specs/provider-fallback.md
```

## Hard rules

- do not edit `.prototype`
- do not auto-merge
- do not hide validation gaps
- do not leave local changes in the primary checkout
