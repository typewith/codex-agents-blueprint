---
name: worker-and-concurrency-patterns
description: Use when the user asks for background execution or concurrency work in Go.
---

Follow this workflow for worker and concurrency patterns:

1. Define ownership of retries, cancellation, and side effects.
2. Record concurrency assumptions in plain language.
3. Save validation notes and failure scenarios beside the work item evidence.

- Do not leave retry or cancellation behavior implicit.
- Prefer explicit failure scenarios over generic confidence.
