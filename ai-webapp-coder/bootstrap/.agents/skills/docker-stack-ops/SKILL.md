---
name: docker-stack-ops
description: Use when the change should be validated through Docker Compose or an equivalent local stack runner rather than host-only commands.
---

Principles:

- prefer stack-level validation when the change crosses service boundaries
- keep command logs in evidence
- if a container or service fails to boot, capture the relevant logs instead of summarizing from memory
- do not claim integration health without checking the dependent services together
