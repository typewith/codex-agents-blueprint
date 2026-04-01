---
name: preview-gate-human-review
description: Use when a task is ready for human preview and must be paused until a human replies with approval or requested changes.
---

Use:
- `scripts/evidence/create-preview-request.py`
- `scripts/evidence/register-human-feedback.py`

Update the task state and keep the original human wording.
Best subagent: `human-loop-preview-gate`.
