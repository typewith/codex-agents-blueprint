---
name: github-pr-ops
description: Use for GitHub PR publication, markdown PR descriptions, evidence comments, requested reviewers, and review handoff. Never merges automatically.
---

Use the helpers in `scripts/github/`.

Required outputs:

- PR title with the work item id
- PR description with summary, checks, evidence, and risk notes
- evidence comment on the PR conversation
- automated PR review entry

Rules:

- destination branch is `main` unless overridden by `GITHUB_BASE_BRANCH`
- leave PR open
- prefer markdown that is easy to scan
- explicitly list anything not tested
