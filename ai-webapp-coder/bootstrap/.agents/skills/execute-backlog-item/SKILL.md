---
name: execute-backlog-item
description: Use in backlog-first mode when the user asks to execute EPIC-XX or TASK-XXXX end-to-end.
---

Follow this workflow:

1. Resolve the item in `backlog/`.
2. Read the item fully, plus `.prototype/` and `docs/architecture/prototype-contract.md` if UI is involved.
3. Run `node scripts/backlog/prepare-item.mjs <ITEM_ID>`.
4. In the new worktree, delegate:
   - `prototype-mapper` first for UI and state mapping
   - `frontend-implementer` for web changes
   - `backend-implementer` for API, worker, or data changes
   - `integration-validator` for tests and smoke checks
   - `evidence-curator` for evidence bundles
   - `github-operator` for PR publishing
   - `reviewer` for post-change review
5. Make small semantic commits.
6. Save evidence under `artifacts/evidence/<ITEM_ID>/`.
7. Open a GitHub PR to the base branch with a concise markdown description and evidence comment.
8. Post an automated review summary to the PR.
9. Run `node scripts/backlog/finalize-item.mjs <ITEM_ID>` so the primary checkout returns to the main branch.

Do not merge the PR.
Do not leave local changes in the primary checkout.
Do not use this skill for task-first repositories that do not keep a structured backlog.
