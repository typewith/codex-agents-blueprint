---
name: repo-cleanup-and-return-to-main
description: Use after a task branch is ready so the main checkout returns cleanly to main and the isolated worktree is removed.
---

Run:

```bash
python scripts/ops/finish-task.py --worktree-path <path>
```

Use only when the worktree is clean and the task branch is ready for review.
