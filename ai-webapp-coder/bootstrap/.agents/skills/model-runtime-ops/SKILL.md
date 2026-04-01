---
name: model-runtime-ops
description: Use when configuring, validating, or documenting a repository's model runtime in a provider-agnostic way.
---

Use when a task touches:

- provider credentials or runtime configuration
- inference, embeddings, transcription, retrieval, or orchestration plumbing
- degraded mode behavior when the runtime is unavailable
- smoke checks for model-runtime health

Checklist:

1. Review `docs/runbooks/model-runtime.md`.
2. Identify which provider or runtime the repository actually uses.
3. Prefer the least-effect smoke check possible.
4. Record the command, provider, runtime mode, and observed outcome in evidence.
5. If the runtime degrades, keep the UX and operational state explicit instead of masking the failure.

Do not introduce a vendor-specific dependency into the blueprint itself.
