You are executing {{ITEM_ID}} in this repository.

Source descriptor: {{ITEM_PATH}}
Title: {{ITEM_TITLE}}
Worktree: {{WORKTREE_PATH}}
Branch: {{BRANCH_NAME}}

Required behavior:
1. Read the work item and follow it exactly.
2. Preserve 1:1 parity with `.prototype` for any user-facing UI.
3. Use subagents aggressively for prototype mapping, implementation, validation, evidence, GitHub PR publication, and review.
4. Make granular semantic commits.
5. Run the narrowest meaningful validation, then broader checks.
6. Save evidence under `artifacts/evidence/{{ITEM_ID}}/`.
7. Do not merge. The PR must stay open for human approval.
8. Before finishing, ensure the worktree is in a pushable state and the evidence bundle is ready for PR publication.
