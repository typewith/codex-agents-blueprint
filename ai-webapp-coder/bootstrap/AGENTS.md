# AGENTS.md

## Mission

This bootstrap is a reusable harness for web monorepos that combine application code, model-runtime integrations, evidence capture, and GitHub review flow.

The repository may run in either `backlog-first` or `task-first` mode. In both cases, keep the worktree isolated, the evidence explicit, and the PR open for human approval.

## Source-of-truth order

1. The requested work item
2. `.prototype/` for visual and copy parity
3. `docs/architecture/*`
4. Existing code
5. External API docs

## Hard rules

- Never edit `.prototype/` during normal task execution.
- Preserve prototype parity for user-facing UI unless the work item explicitly authorizes a deviation.
- Keep source telemetry separate from model-derived conclusions.
- Prefer one branch and one worktree per work item.
- Save evidence under `artifacts/evidence/<ITEM_ID>/`.
- Keep PRs open for human approval. Never auto-merge.
- Do not leave local changes behind in the primary checkout after publication or cleanup.

## Execution pattern

1. Resolve the work item.
2. Create an isolated worktree under `.worktrees/`.
3. Link root env files into the worktree when needed.
4. Delegate implementation, validation, evidence, GitHub publication, and review.
5. Commit in small semantic steps.
6. Run the narrowest meaningful validation, then broader checks if stable.
7. Publish the PR and the evidence summary.
8. Return the primary checkout to the main branch when local cleanup is complete.

## Dual mode

- In `backlog-first` mode, use `backlog/EPIC-*` and `TASK-*` as the source of truth for scripts and prompts.
- In `task-first` mode, use the same scripts with `--title` and optional `--source-path`, or operate the flow manually while keeping the same artifact conventions.
