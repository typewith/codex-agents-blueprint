# Validation and evidence

Validation is part of implementation, not an afterthought.

## Evidence is required when a task changes

- gameplay feel
- animation or locomotion
- camera framing
- layout or navigation
- interaction alignment
- other player-facing visuals

## Default evidence flow

1. Create a new evidence pack with `scripts/evidence/create-evidence-pack.py`.
2. Fill `run.md`, `screenshot-index.csv`, and `pr-media.json`.
3. Update `tasks/active/<task-id>/evidence.md`.
4. If the task needs human review, create a preview request before calling it done.

## Minimum expectation

Every evidence run should capture enough context for another reviewer or agent to understand:

- what scenario was exercised
- what map or runtime context was used
- which MCPs or commands were involved
- which screenshots or clips are selected for PR review
