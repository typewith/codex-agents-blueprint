# Runbook: GitHub PR flow

## Required variables

- `GITHUB_TOKEN` or `GH_TOKEN`
- `GITHUB_BASE_BRANCH` with default `main`
- `GITHUB_REPOSITORY` or a configured `origin`
- `GITHUB_DEFAULT_REVIEWERS` when reviewer auto-request is desired
- `GITHUB_API_BASE_URL` when using GitHub Enterprise Server

## Expected outputs

- remote branch published
- PR opened to `main`
- PR description with summary, checks, evidence, and risk notes
- evidence comment in the PR conversation
- automated PR review entry

## Policy

- the PR stays open for human approval
- merge is never automatic
- anything untested stays explicit in the PR body or evidence
