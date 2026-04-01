# AGENTS.md for .codex/agents/

- Keep each custom agent narrow, opinionated, and explicit about ownership.
- Complex agents in this repo default to `gpt-5.4` with `model_reasoning_effort = "xhigh"`.
- Subagents must state when to use `unreal_mcp`, when to use `mcp_unreal`, and when to avoid MCP entirely.
- Avoid ambiguous "can do anything" agents.
