# First run checklist

- [ ] Copy the bootstrap into the target repository root.
- [ ] Initialize Git if the target repository does not already exist.
- [ ] Confirm `.codex/config.toml` is present.
- [ ] Review `AGENTS.md` and `docs/operations/workflow.md`.
- [ ] Create the Unreal project as **Games > Third Person > C++** in the repository root if the project does not exist yet.
- [ ] Start the first task with `python scripts/ops/start-task.py --slug <slug> --summary "<summary>"`.
- [ ] Confirm the dossier was created under `tasks/active/<task-id>/`.
- [ ] If MCP is desired, generate `.codex/config.local.toml` with `python scripts/mcp/render-codex-local-config.py --project-root .`.
- [ ] If MCP is desired, review `python scripts/mcp/healthcheck.py --project-root .`.

## Notes

- The bootstrap does not version `.codex/config.local.toml`.
- MCP is optional in v1. The workflow must remain usable without it.
