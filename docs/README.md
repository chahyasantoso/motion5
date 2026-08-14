# motion5 documentation

This directory is the project’s working contract. It is intentionally more detailed than a README because it answers questions that should not be rediscovered in every implementation session.

## Current reality

Start with [SESSION-STATUS.md](./SESSION-STATUS.md). It is the only document allowed to claim what has landed. Plans, architecture, and ADRs describe intended behavior unless they explicitly say otherwise.

The current status is **Phase 6 active**. Phase 5 membership, the generated API report, and the packed package consumer are shipped. P6-03 is reconciling public documentation, followed by performance-budget enforcement and transitional-code deletion.

## Recovery references

- [PHASE-3-4-CONSOLIDATED-AUDIT.md](./PHASE-3-4-CONSOLIDATED-AUDIT.md): consolidated motionpath v4/v5 lineage, findings, and architecture judgment.
- [PHASE-3-4-RECOVERY-PLAN.md](./PHASE-3-4-RECOVERY-PLAN.md): actionable restoration sequence and stop conditions.
- [IMPLEMENTOR-BRIEF-MOTIONPATH-TO-MOTION5.md](./IMPLEMENTOR-BRIEF-MOTIONPATH-TO-MOTION5.md): focused instructions and source references for implementors.

## Lineage

motion5 is a clean-room successor to [motionpath](https://github.com/chahyasantoso/motionpath). The predecessor is a read-only behavioral oracle and a source of fixture intent. It is not an architecture template, and nothing is copied from it. ADR-001 and [ARCHITECTURE.md](./ARCHITECTURE.md) section 15 explain why.

## Product and contracts

- [PRD.md](./PRD.md): problem statement, users, goals, functional requirements, quality attributes, release criteria, and resolved product decisions.
- [TRD.md](./TRD.md): normative technical requirements, verification methods, and traceability to product requirements and architecture invariants.
- [ARCHITECTURE.md](./ARCHITECTURE.md): owners, invariants, graph lifecycle, publication semantics, failure handling, boundaries, and deletion list.
- [AUTHORED-SCHEMA.md](./AUTHORED-SCHEMA.md): schema v5 syntax, field semantics, id qualification, observation edges, diagnostics, and validation.
- [MIGRATION-V4-TO-V5.md](./MIGRATION-V4-TO-V5.md): explicit migration procedure, pure migration behavior, and compatibility policy.
- [DECISIONS.md](./DECISIONS.md): accepted decisions, alternatives rejected, consequences, and supersession history.

## Delivery and evidence

- [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md): phases, slice-level pull requests, dependencies, test obligations, exit gates, risk register, and the v1 checklist.
- [PHASE6-DETAILED-PLAN.md](./PHASE6-DETAILED-PLAN.md): Phase 6 hardening intent, allow-lists, package consumer contract, documentation reconciliation, budgets, and deletion checklist.
- [TESTING-STRATEGY.md](./TESTING-STRATEGY.md): test tiers, determinism rules, migration evidence, invariant evidence, and prohibited evidence.
- [CI-WORKFLOW.md](./CI-WORKFLOW.md): workflow rules, job contracts, artifacts, required versus advisory gates, and rollout schedule.
- [PR-WORKFLOW.md](./PR-WORKFLOW.md): branch naming, commit style, pull request contents, review order, merge policy, and reverts.
- [FORMATTING.md](./FORMATTING.md): Prettier configuration, local commands, manual workflow, and permission rationale.

## How the documents fit together

PRD says why and what. TRD says what “correct” means, in testable terms. ARCHITECTURE says who owns what. IMPLEMENTATION-PLAN says in what order, and names the evidence for each slice. SESSION-STATUS says what is actually true today. The Phase 6 plan details the remaining hardening work. DECISIONS says what not to re-litigate.

## Locked scope decisions

Four scope questions are closed and should not be reopened in review: qualified ids stay internal (ADR-014), GSAP remains the v1 interpolator (ADR-015), runtime diagnostics stay inline (ADR-016), and React ships in v1 (ADR-017). The interpolator state contract and value/compiler restoration are recovery decisions and must be recorded with their implementation slices.

## Documentation rules

1. Reality belongs in one status file. Do not create parallel handoffs, review logs, or completion matrices.
2. Intent documents must label themselves as intent when code does not exist yet.
3. Every new public behavior needs schema/type/API documentation and a test plan in the same pull request.
4. A decision reversal updates the original record or clearly supersedes it; contradictory records are not left behind.
5. Delete documents that describe deleted code in the same change that deletes the code.
6. Do not copy documentation, tests, fixtures, or examples from the predecessor repository. Recreate the contract from first principles.
