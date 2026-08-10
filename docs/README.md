# motion5 documentation

This directory is the project’s working contract. It is intentionally more detailed than a README because it answers questions that should not be rediscovered in every implementation session.

## Current reality

Start with [SESSION-STATUS.md](./SESSION-STATUS.md). It is the only document allowed to claim what has landed. Plans, architecture, requirements, and ADRs describe intended behavior unless they explicitly say otherwise.

## Product and contracts

- [PRD.md](./PRD.md): problem statement, users, goals, functional requirements, locked product decisions, quality attributes, and release criteria.
- [TRD.md](./TRD.md): normative technical requirements for modules, contracts, transactions, publication, adapters, lifecycle, packaging, and verification.
- [ARCHITECTURE.md](./ARCHITECTURE.md): owners, invariants, graph lifecycle, publication semantics, failure handling, boundaries, and deletion list.
- [AUTHORED-SCHEMA.md](./AUTHORED-SCHEMA.md): schema v5 syntax, field semantics, id qualification, observation edges, diagnostics, and validation.
- [MIGRATION-V4-TO-V5.md](./MIGRATION-V4-TO-V5.md): explicit migration procedure, pure migration behavior, and compatibility policy.
- [DECISIONS.md](./DECISIONS.md): accepted decisions, alternatives rejected, consequences, and supersession history.

## Delivery and evidence

- [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md): detailed phases, ordered pull requests, owners, dependencies, implementation work, tests, and exit gates.
- [TESTING-STRATEGY.md](./TESTING-STRATEGY.md): test tiers, determinism rules, migration evidence, invariant evidence, and prohibited evidence.
- [CI-WORKFLOW.md](./CI-WORKFLOW.md): workflow rules, job contracts, artifacts, required versus advisory gates, and rollout schedule.
- [PR-WORKFLOW.md](./PR-WORKFLOW.md): branch naming, commit style, pull request contents, review order, merge policy, and reverts.
- [FORMATTING.md](./FORMATTING.md): Prettier configuration, local commands, manual workflow, and permission rationale.

## Document authority

When documents answer different questions, use this order rather than treating them as contradictions:

1. `SESSION-STATUS.md` says what exists now.
2. `DECISIONS.md` records why locked choices were made.
3. `PRD.md` says what product must ship.
4. `TRD.md` says what the technical implementation must guarantee.
5. `ARCHITECTURE.md` assigns ownership and boundaries.
6. `AUTHORED-SCHEMA.md` defines accepted input.
7. `IMPLEMENTATION-PLAN.md` orders the work and evidence.

## Documentation rules

1. Reality belongs in one status file. Do not create parallel handoffs, review logs, or completion matrices.
2. Intent documents must label themselves as intent when code does not exist yet.
3. Every new public behavior needs product, technical, schema/type/API, and test coverage in the same pull request.
4. A decision reversal updates the original record or clearly supersedes it; contradictory records are not left behind.
5. Delete documents that describe deleted code in the same change that deletes the code.
6. Do not copy documentation, tests, fixtures, or examples from the predecessor repository. Recreate the contract from first principles.
