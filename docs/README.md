# motion5 documentation

This directory is the project's working contract. It is intentionally more detailed than a README because it answers questions that should not be rediscovered in every implementation session.

## Using motion5

If you want to drive the runtime rather than build it, read the [user guide](./guide/README.md). It documents the declared package entrypoints and nothing else. Everything else in this directory is written for implementors.

## Current reality

Start with [SESSION-STATUS.md](./SESSION-STATUS.md). It is the only document allowed to claim what has landed. Plans, architecture, and ADRs describe intended behavior unless they explicitly say otherwise.

The runtime mutation model, the trigger drivers, and compiled Track ownership have landed on `feat/adopt-motion-track`. Phase 5 membership work and Phase 6 packaging work remain.

## Product and contracts

- [PRD.md](./PRD.md): problem statement, users, goals, functional requirements, quality attributes, release criteria, and resolved product decisions.
- [TRD.md](./TRD.md): normative technical requirements, verification methods, and traceability to product requirements and architecture invariants.
- [ARCHITECTURE.md](./ARCHITECTURE.md): owners, invariants, graph lifecycle, publication semantics, failure handling, boundaries, and deletion list.
- [AUTHORED-SCHEMA.md](./AUTHORED-SCHEMA.md): schema v5 syntax, field semantics, id qualification, observation edges, diagnostics, and validation.
- [MIGRATION-V4-TO-V5.md](./MIGRATION-V4-TO-V5.md): explicit migration procedure, pure migration behavior, and compatibility policy.

## Decisions

[DECISIONS.md](./DECISIONS.md) holds ADR-001 through ADR-027 inline. From ADR-028 onward each record is its own `ADR-NNN-*.md` file in this directory, and a number names exactly one record.

## Delivery and evidence

- [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md): phases, slice-level pull requests, dependencies, test obligations, exit gates, risk register, and the v1 checklist. Treat its completed-slice claims as intent until reconciled with SESSION-STATUS.
- [PHASE5-DETAILED-PLAN.md](./PHASE5-DETAILED-PLAN.md): the detailed contract for the current phase.
- [TESTING-STRATEGY.md](./TESTING-STRATEGY.md): test tiers, determinism rules, migration evidence, invariant evidence, and prohibited evidence.
- [CI-WORKFLOW.md](./CI-WORKFLOW.md): workflow rules, job contracts, artifacts, required versus advisory gates, and rollout schedule.
- [PR-WORKFLOW.md](./PR-WORKFLOW.md): branch naming, commit style, pull request contents, review order, merge policy, and reverts.
- [FORMATTING.md](./FORMATTING.md): Prettier configuration, the read-only gate, why nothing in CI repairs drift, and the manual repair.
- [AI-EDIT-WORKFLOW.md](./AI-EDIT-WORKFLOW.md): the request contract for an implementor with no local checkout, the anchor rule, the bounded file list, and the cost of a round trip. [AGENTS.md](../AGENTS.md) in the repository root is that reader's entry point.

## Lineage

motion5 is a clean-room successor to [motionpath](https://github.com/chahyasantoso/motionpath). The predecessor is a read-only behavioral oracle and a source of fixture intent. It is not an architecture template, and nothing is copied from it. ADR-001 and [ARCHITECTURE.md](./ARCHITECTURE.md) section 15 explain why.

## How the documents fit together

PRD says why and what. TRD says what "correct" means, in testable terms. ARCHITECTURE says who owns what. IMPLEMENTATION-PLAN says in what order, and names the evidence for each slice. SESSION-STATUS says what is actually true today. DECISIONS and the numbered ADRs say what not to re-litigate. The guide says how to use the result.

## Locked scope decisions

Four scope questions are closed and should not be reopened in review: qualified ids stay internal (ADR-014), GSAP remains the v1 interpolator (ADR-015), runtime diagnostics stay inline (ADR-016), and React ships in v1 (ADR-017).

## Documentation rules

1. Reality belongs in one status file. Do not create parallel handoffs, review logs, or completion matrices.
2. Intent documents must label themselves as intent when code does not exist yet.
3. Every new public behavior needs schema/type/API documentation and a test plan in the same pull request.
4. A decision reversal updates the original record or clearly supersedes it; contradictory records are not left behind.
5. Delete documents that describe deleted code in the same change that deletes the code.
6. Do not copy documentation, tests, fixtures, or examples from the predecessor repository. Recreate the contract from first principles.
7. A document that a consumer reads belongs in `guide/`, and it may only name a symbol or subpath the package declares.
