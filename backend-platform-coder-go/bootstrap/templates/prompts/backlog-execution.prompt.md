# Backlog execution prompt

## Context
- Work item: `{{ITEM_ID}}`
- Title: {{ITEM_TITLE}}
- Source: {{ITEM_PATH}}
- Worktree: `{{WORKTREE_PATH}}`
- Branch: `{{BRANCH_NAME}}`

## Goals
- read the work item, architecture docs, contracts, and decisions before editing code
- keep data shape, failure modes, and rollout risk explicit
- collect evidence and document any unvalidated area before publication

## Guardrails
- Keep the change scoped to the requested work item.
- Save explicit validation notes under `artifacts/evidence/{{ITEM_ID}}/`.
- Leave the PR open for human approval.
