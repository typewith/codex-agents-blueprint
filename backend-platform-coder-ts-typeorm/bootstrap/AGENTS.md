# AGENTS.md

## Mission

This bootstrap is a reusable harness for backend repositories with explicit contracts, architecture decisions, worktree isolation, evidence capture, and GitHub review flow.

## Source-of-truth order

1. The requested work item
2. docs/architecture/*
3. contracts/*
4. decisions/*
5. existing code
6. external API or platform docs

## Hard rules

- Keep contracts, data model changes, and rollout notes explicit.
- Prefer one worktree and one branch per work item.
- Save evidence under artifacts/evidence/<ITEM_ID>/.
- Do not auto-merge or hide validation gaps.
- Record architecture or rollout tradeoffs when the change is not obvious from the diff.

## Execution pattern

1. Resolve the work item and its required contract or ADR context.
2. Create an isolated worktree under .worktrees/.
3. Delegate implementation, review, integration checks, and publication.
4. Commit in small semantic steps.
5. Collect evidence before opening the PR.
6. Publish the PR and keep approval human-driven.

## Modes

- In backlog-first mode, use backlog/EPIC-* and TASK-* as the source of truth for scripts and prompts.
- In task-first mode, keep the same worktree, evidence, contract, and PR conventions.
