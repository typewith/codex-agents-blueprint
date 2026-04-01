# Architecture overview

## Typical layers

This blueprint assumes a web monorepo can contain some combination of:

- a frontend app
- an API or backend service
- workers or background jobs
- shared contracts and config packages
- a model-runtime layer for inference, embeddings, transcription, retrieval, or orchestration

The exact stack is repository-owned. The blueprint does not require a specific framework, ORM, queue, storage backend, or model provider.

## Source of truth boundaries

- `.prototype/` is the visual source of truth for routes, copy, states, and interaction behavior.
- application code is the source of truth for implementation details
- evidence under `artifacts/` is the source of truth for validation and review handoff

## Why this shape works

- worktree isolation keeps parallel work safer
- `.prototype` keeps UI parity explicit
- artifacts keep validation durable
- provider-agnostic runtime guidance keeps model integrations portable
