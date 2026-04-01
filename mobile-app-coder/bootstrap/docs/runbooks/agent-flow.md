# Runbook: agent flow

## Backlog-first mode

1. Resolve the work item in `backlog/`.
2. Read `.prototype/` and the architecture docs.
3. Run `node scripts/mobile/prepare-item.mjs <ITEM_ID>`.
4. Delegate to `mobile-architect`, `react-native-implementer`, `android-studio-specialist`, `xcode-specialist`, `api-integration-validator`, `visual-evidence-reviewer`, `release-curator`, and `github-operator`.
5. Save evidence and publish a draft PR.

## Task-first mode

Use the same flow with `--title` and optional `--source-path` when the work item lives outside `backlog/`.
