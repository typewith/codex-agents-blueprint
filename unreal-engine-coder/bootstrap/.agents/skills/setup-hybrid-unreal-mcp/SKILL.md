---
name: setup-hybrid-unreal-mcp
description: Use when configuring or documenting the hybrid Unreal MCP stack (`unreal_mcp` + `mcp_unreal`) for this repo.
---

Use when MCP setup, wiring, or policy needs attention.

Steps:
1. review `docs/mcp/README.md`
2. configure plugins and local binaries
3. run `python scripts/mcp/render-codex-local-config.py --project-root .`
4. run `python scripts/mcp/healthcheck.py --project-root .`
5. record degraded mode if any

Best subagents:
- `mcp-editor-automation-specialist`
- `mcp-build-test-docs-specialist`
- `repo-ops-guardian`
