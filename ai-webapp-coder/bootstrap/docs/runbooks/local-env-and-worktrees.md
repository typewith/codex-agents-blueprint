# Runbook: local env and worktrees

## Problem

Worktrees do not automatically inherit local env files.

## Script

`scripts/worktree/link-env.mjs` looks for these files in the repository root:

- `.env`
- `.env.local`
- `.npmrc`

If a file exists in the root and not in the worktree, the script creates a symlink in the worktree.

## Example

```bash
cp .env.example .env
node scripts/backlog/prepare-item.mjs TASK-0101
```

## Rule

Never commit local env files. The goal is only to make real local configuration available inside isolated worktrees.
