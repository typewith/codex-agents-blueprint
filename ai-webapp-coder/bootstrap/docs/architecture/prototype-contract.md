# `.prototype` contract

`.prototype` is a supported convention in this blueprint.

## Purpose

It captures the intended routes, components, copy, states, and interactions for the product.

## Rules

1. Do not edit `.prototype` as part of routine implementation work.
2. If a UI change touches layout, copy, route coverage, theme, states, or interaction behavior, compare the implementation against `.prototype`.
3. If the implementation must diverge, record:
   - why
   - which work item authorizes the divergence
   - the exact user-facing impact

## Minimum parity evidence

Every UI-affecting task should document:

- affected route or screen
- affected components
- supported visual states
- comparative evidence with `.prototype`
