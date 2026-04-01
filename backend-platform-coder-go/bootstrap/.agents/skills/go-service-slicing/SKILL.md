---
name: go-service-slicing
description: Use when the user asks to split, shape, or implement a Go service.
---

Follow this workflow for Go service slicing:

1. Map packages, responsibilities, and error boundaries.
2. Implement the thinnest safe slice first.
3. Keep package APIs and side effects obvious in the diff.

- Do not hide concurrency or storage assumptions across package seams.
- Avoid broad refactors without clear payoff.
