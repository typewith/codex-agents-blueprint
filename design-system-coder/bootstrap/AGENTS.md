# AGENTS.md

## Mission

This bootstrap is a reusable harness for design-system and prototype-oriented repositories with code-first mocks, worktree isolation, visual evidence, and GitHub review flow.

## Source-of-truth order

1. The requested work item
2. .prototype/ for visual intent, flow, and copy
3. docs/architecture/*
4. existing code
5. external references that clarify UI behavior

## Hard rules

- Do not edit .prototype/ during normal task execution.
- Keep state coverage explicit.
- Save screenshots and review notes under artifacts/evidence/<ITEM_ID>/.
- Keep draft PRs open for human approval.
- Do not hide accessibility or parity gaps.

## Execution pattern

1. Resolve the work item and prototype context.
2. Create an isolated worktree.
3. Build the code-first mock and component shell.
4. Review parity and accessibility.
5. Collect visual evidence.
6. Publish the draft PR and keep review human-driven.

## Modes

- In backlog-first mode, backlog/EPIC-* and TASK-* describe the work item and the expected artifact trail.
- In task-first mode, use the same worktree and evidence conventions with --title and --source-path.
