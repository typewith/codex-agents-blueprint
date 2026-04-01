---
name: migration-safety-review
description: Use when the user asks for a migration safety pass.
---

Follow this workflow for migration safety review:

1. Review schema changes for reversibility, lock risk, and rollout assumptions.
2. Capture any required manual step in evidence or PR notes.
3. Escalate if the rollback story is weak or missing.

- Treat operational risk as a first-class concern.
- Do not approve unclear backfills or implicit destructive changes.
