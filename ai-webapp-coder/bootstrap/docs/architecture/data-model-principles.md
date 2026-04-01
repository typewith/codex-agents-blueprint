# Data model principles

## Core rule

Separate raw operational input from model-derived output.

## Practical implications

- preserve source telemetry or raw inputs when the product depends on external systems
- store derived model outputs in explicit structures with timestamps and provenance
- keep evidence and citations close to user-facing conclusions
- support degraded mode without hiding data quality gaps
- make it possible to replay, audit, or reprocess important flows

## Recommended buckets

- source events or source documents
- derived segments, summaries, classifications, or decisions
- jobs and job states
- evidence bundles for review
- citations, references, or trace metadata used by AI-facing UX
