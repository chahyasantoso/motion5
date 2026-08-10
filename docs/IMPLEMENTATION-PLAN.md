# motion5 implementation plan

This is an execution plan, not a claim that the listed runtime exists. A phase is complete only when its exit gate is green and [SESSION-STATUS.md](./SESSION-STATUS.md) says so.

## Delivery rules

- One pull request establishes one meaningful invariant.
- Target fewer than twenty semantic files; stop and recut beyond twenty-five commits or after a second revert.
- Behavior, docs, types, tests, and exports land together. Formatting is separate.
- No copied tests, fixtures, demos, or source from motionpath.
- No flags, aliases, facades, or duplicate owners.
- Every PR names the failing test, the new owner, and the deletion or boundary it establishes.

## Phase 0: baseline

**P0-01 Charter:** docs, workflows, Prettier, TypeScript, manifest, placeholder test. Done.

**P0-02 Reproducible install:** commit lockfile, switch CI to `npm ci`, enable npm cache, document Node 24.

**P0-03 Contract package:** create typed v5 constants, diagnostic types, schema types, allow-listed exports, internal entrypoint, and validator result shape.

**P0-04 Ports and fakes:** Clock, Interpolator, Scheduler, manual clock, fake interpolator, fake scheduler, and shared contract harness.

**P0-05 Migration evidence:** implement pure v4-to-v5 migration and fresh tests for rename, qualification, immutability, idempotence, collisions, and diagnostics. Add golden fixture serialization.

**Exit:** core typechecks and tests headlessly; v4 rejects; v5 validates; migration output is deterministic; no engine import exists.

## Phase 1: leaf domain

P1-01 immutable values; P1-02 plugin registry; P1-03 Track leaf and local composition; P1-04 lifecycle; P1-05 Motion scheduling and children; P1-06 triggers.

**Exit:** Track has no children or graph traversal. Motion owns all composite behavior and fake-port tests cover playback and teardown.

## Phase 2: graph kernel

P2-01 qualified ids; P2-02 graph IR; P2-03 validation; P2-04 cycle detection/order; P2-05 stable ObservationState; P2-06 transactional GraphBinding; P2-07 boundary scan and CI gate.

**Exit:** invalid graphs fail before mount; rollback restores the exact observable snapshot; identity survives commit; ordering is canonical and tested.

## Phase 3: runtime and publication

P3-01 PatchRegistry; P3-02 publication-only GraphPublisher; P3-03 error/blocked/retry semantics; P3-04 project-wide GraphRuntime; P3-05 ProjectRuntime; P3-06 Engine; P3-07 budgets and benchmarks.

**Exit:** two motions and a free track publish through one graph, one batch, one registry, and one clock subscription.

## Phase 4: adapters

P4-01 interpolator adapter; P4-02 browser clock and DOM; P4-03 React project and playback hooks; P4-04 immutable patch subscription; P4-05 integration fixtures.

**Exit:** core remains headless and renderer-free; real adapters pass fake-port contract suites; React consumes patches without recursive composition.

## Phase 5: membership

P5-01 cross-motion references; P5-02 adopted free tracks; P5-03 unified diagnostics; P5-04 unmount/remount recovery.

**Exit:** authored, cross-motion, and adopted nodes share one graph path without flags; ownership and detach/destroy behavior are tested.

## Phase 6: hardening

P6-01 API surface and declarations; P6-02 package consumer; P6-03 public docs; P6-04 enforce benchmark budgets; P6-05 delete transitional code and documents.

**Exit:** v1 release criteria are binary, CI is green, packed imports work, docs match implementation, and no migration-only code remains.

## Pull request map

P0-01 through P0-05 are intentionally small. P1 and P2 are ordered by ownership dependencies. P3 cannot begin publication until P2 provides stable graph state. P4 cannot add renderer adapters until the patch contract is immutable. P5 cannot add cross-motion membership until qualified identity is final. P6 deletes anything that existed only to get here.

## Definition of done for every slice

A slice is done only when behavior, API, types, docs, tests, and boundaries agree; the nearest test and full relevant matrix are green; the diff was reviewed with whitespace hidden; and status was updated.
