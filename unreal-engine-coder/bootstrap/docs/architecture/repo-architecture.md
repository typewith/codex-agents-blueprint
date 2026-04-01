# Repository architecture

## Why the harness lives next to the Unreal project

The same repository root can host both:

- the Unreal project created later (`.uproject`, `Config/`, `Content/`, `Source/`, `Plugins/`)
- the operational harness (`.codex/`, `.agents/`, `docs/`, `scripts/`, `templates/`, `tasks/`, `evidence/`)

This keeps the rules, task workflow, evidence conventions, and agent contracts close to the code they govern.

## Stable bootstrap directories

- `.codex/agents/` for project-scoped subagents
- `.agents/skills/` for reusable workflows
- `docs/` for durable operating rules
- `scripts/` for repeatable automation helpers
- `templates/` for dossier, evidence, and review scaffolding
- `tasks/` for active and archived task dossiers
- `evidence/` for review artifacts

## Unreal boundary

This blueprint assumes **Third Person + C++** as the safest starting harness.

- Template content is allowed as bootstrap.
- Authored gameplay systems should move into explicit C++ ownership.
- Asset-side work should be documented when it is unavoidable.

## Optional MCP layer

The bootstrap supports a hybrid MCP topology, but it must remain usable without MCP.

- Use `mcp_unreal` first for build/test/docs loops.
- Use `unreal_mcp` first for editor automation and capture.
- If neither is available, continue with a degraded but explicit workflow.
