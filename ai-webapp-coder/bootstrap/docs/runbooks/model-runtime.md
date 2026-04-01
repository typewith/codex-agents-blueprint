# Runbook: model runtime

## Goal

Keep model-runtime integrations portable, observable, and reviewable.

## Recommended pattern

1. Document which provider or runtime the repository uses.
2. Keep credentials and runtime config outside versioned source files.
3. Validate the provider with the least-effect smoke check possible.
4. Record provider, model, command, latency notes, and degraded mode behavior in evidence.
5. If the runtime fails or is unavailable, keep the product behavior explicit instead of masking the gap.

## Smoke check expectations

- prefer read-only checks first
- avoid side effects unless the work item explicitly needs them
- capture exact commands and outputs
- record cost, latency, and capability gaps when relevant

## Degraded mode

The application should make it clear when model output is partial, delayed, unavailable, or using a fallback path.
