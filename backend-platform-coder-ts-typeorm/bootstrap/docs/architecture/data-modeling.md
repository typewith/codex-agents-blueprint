# Architecture: TypeORM data modeling

## Principles

- prefer explicit entities and migrations over hidden schema drift
- keep state transitions and invariants visible in code reviews
- record rollback assumptions whenever a migration is not trivially reversible
