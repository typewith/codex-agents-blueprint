# Mock execution prompt

## Context
- Work item: `{{ITEM_ID}}`
- Title: {{ITEM_TITLE}}
- Source: {{ITEM_PATH}}
- Worktree: `{{WORKTREE_PATH}}`
- Branch: `{{BRANCH_NAME}}`

## Goals
- read the work item and the .prototype contract before editing code
- build a mock that makes state coverage and hierarchy reviewable
- capture visual and accessibility evidence before publication

## Guardrails
- Keep the change scoped to the requested work item.
- Save explicit validation notes under `artifacts/evidence/{{ITEM_ID}}/`.
- Leave the PR open for human approval.
