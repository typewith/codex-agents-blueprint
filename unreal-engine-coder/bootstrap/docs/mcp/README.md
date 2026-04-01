# Optional MCP layer

This bootstrap supports two Unreal MCP roles:

- `mcp_unreal` for build/test loops, docs lookup, and headless verification
- `unreal_mcp` for editor-rich automation, viewport control, and screenshot capture

## What is versioned

- `.codex/config.toml` is versioned and defines the repo-level Codex defaults.

## What stays local

- `.codex/config.local.toml` is intentionally local and should be generated only in a real project checkout.

Generate it with:

```bash
python scripts/mcp/render-codex-local-config.py --project-root .
```

## Healthcheck

Review the local setup with:

```bash
python scripts/mcp/healthcheck.py --project-root .
```

The healthcheck is intentionally tolerant. Missing MCP binaries, plugins, or ports should be recorded as degraded mode, not treated as a reason to abandon the rest of the workflow.
