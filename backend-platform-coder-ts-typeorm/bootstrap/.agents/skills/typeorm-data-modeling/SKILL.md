---
name: typeorm-data-modeling
description: Use when the user asks for TypeORM modeling or persistence changes.
---

Follow this workflow for TypeORM data modeling:

1. Map entity and relation changes explicitly.
2. Use `templates/data/schema-change.md` for migration and rollback notes.
3. Implement the narrowest safe change and keep query behavior readable.

- Avoid mixing unrelated refactors into schema changes.
- Keep rollback posture explicit.
