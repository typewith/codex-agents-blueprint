# AGENTS.md

## Mission

This bootstrap is a reusable harness for mobile repositories with Expo or React Native flows, prototype parity, native tooling guidance, worktree isolation, and GitHub review flow.

## Source-of-truth order

1. The requested work item
2. .prototype/ for screen intent, copy, and interaction flow
3. docs/architecture/*
4. existing code
5. external platform docs for Android or iOS when needed

## Hard rules

- Do not edit .prototype/ during normal task execution.
- Keep state coverage explicit for every screen touched.
- Save screenshots and platform notes under artifacts/evidence/<ITEM_ID>/.
- Keep draft PRs open for human approval.
- Do not hide Android or iOS tooling caveats.

## Execution pattern

1. Resolve the work item and prototype context.
2. Create an isolated worktree.
3. Implement the screen or flow with explicit states.
4. Run visual and native-tooling review steps.
5. Collect evidence and publish the draft PR.

## Modes

- In backlog-first mode, backlog/EPIC-* and TASK-* describe the work item and expected artifact trail.
- In task-first mode, use the same worktree and evidence conventions with --title and --source-path.
