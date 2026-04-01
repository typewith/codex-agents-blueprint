# Workflow

## Standard task lifecycle

1. Start a task branch and worktree:

   ```bash
   python scripts/ops/start-task.py --slug <slug> --summary "<summary>"
   ```

2. Fill `tasks/active/<task-id>/plan.md`.
3. Pick the subagents and MCP routing that match the task.
4. Implement in the isolated worktree with small, reviewable commits.
5. If the task affects visuals, movement, animation, layout, interaction, or editor state, create an evidence pack:

   ```bash
   python scripts/evidence/create-evidence-pack.py --task-id <task-id> --run-label <label>
   ```

6. If the task needs a human eye before review, create a preview request and later register the human response.
7. Classify `player_facing_change` and `requires_temporal_clip` in `task.json`.
8. Generate the PR artifacts:

   ```bash
   python scripts/ops/generate-pr-body.py --task-id <task-id>
   ```

9. When the worktree is clean and the branch is ready, normalize the main checkout:

   ```bash
   python scripts/ops/finish-task.py --worktree-path <path>
   ```

## Minimum task artifacts

- `plan.md`
- `evidence.md`
- `handoff.md`
- `pr-body.md`
- `task.json`

Generated artifacts appear only when the PR stage runs:

- `pr-body.generated.md`
- `pr-comment.generated.md`

Preview artifacts appear only when a human review is requested:

- `human-loop/preview-request-*.md`
- `human-loop/feedback-*.md`

## PR media note

The bootstrap can render a PR body and a native-comment draft, but it does not automate GitHub uploads in v1. If your review flow needs native media in GitHub, track that status manually in `task.json`.
