# AGENTS.md

## Mission

This bootstrap is a reusable Unreal Engine harness for teams that want Codex to operate with explicit roles, repeatable workflows, and durable evidence.

The default assumption is **Third Person + C++**. Treat template content as a playable harness, not as long-term architecture.

## Core rules

- Keep authored gameplay logic in C++ unless an editor-side asset boundary is required.
- Prefer one branch per task and one isolated worktree per branch.
- Keep the task dossier current under `tasks/active/<task-id>/`.
- Create evidence when a change affects player-facing behavior, spatial layout, visuals, or animation.
- Use the human preview gate when a change needs a human eye before review.
- Record MCP usage explicitly when MCPs are enabled.
- Keep the main checkout clean and return it to `main` when the task is ready for review.

## Done means

1. The task has its own branch and worktree.
2. The dossier contains `plan.md`, `evidence.md`, `handoff.md`, `pr-body.md`, and `task.json`.
3. Evidence exists when the task is player-facing or visually meaningful.
4. PR artifacts were generated when the task is ready for review.
5. Cleanup back to a clean main checkout is straightforward.

## Routing

- Architecture and boundaries: `architecture-lead`
- Authored Unreal C++ changes: `unreal-cpp-engineer`
- Repo workflow and PR readiness: `repo-ops-guardian`
- Build, tests, and UE docs lookup: `mcp-build-test-docs-specialist`
- Editor automation and screenshot capture: `mcp-editor-automation-specialist`
- Evidence quality review: `visual-evidence-reviewer`
- Human preview pause/resume flow: `human-loop-preview-gate`

## Optional MCP mode

- `mcp_unreal` is the preferred MCP for build/test loops and docs lookup.
- `unreal_mcp` is the preferred MCP for editor-rich automation and capture.
- The repository must still function when MCP is unavailable. Document degraded mode instead of blocking on an absent server.
