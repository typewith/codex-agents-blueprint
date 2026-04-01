---
name: mcp-build-test-cycle
description: Use for compile/test loops, UE docs lookup, and troubleshooting with mcp_unreal as the primary MCP.
---

Primary MCP: `mcp_unreal`

Use when you need:
- build_project
- run_tests
- docs/API lookup
- compile error triage

Fallback to `unreal_mcp` only if the task also needs editor-state confirmation.
Best subagent: `mcp-build-test-docs-specialist`.
