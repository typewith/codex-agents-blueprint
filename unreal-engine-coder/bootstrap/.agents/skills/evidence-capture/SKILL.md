---
name: evidence-capture
description: Use to create a new evidence pack and keep screenshots, logs, and scenario notes organized for a task.
---

Run:

```bash
python scripts/evidence/create-evidence-pack.py --task-id <task-id> --run-label <label>
```

Then fill:

- `run.md`
- `screenshot-index.csv`
- `pr-media.json`

For player-facing tasks, keep `task.json` classification explicit:

- `player_facing_change`
- `requires_temporal_clip`
- `selected_pr_evidence_run`

Use `pr-media.json` to select the screenshot(s) that render in the PR body and the clip(s) up to 15 seconds that must be uploaded natively in the first PR comment.
