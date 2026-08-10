# Implementation plan

Seven phases, each a vertical slice that proves a user-visible capability. A phase is done when its exit gate is green in CI, not when its pull requests are merged.

## Ground rules

- Each pull request lists the invariant it establishes and the test that proves it.
- Target under twenty semantic files per pull request. Above twenty-five commits, or after a second revert, stop and re-cut the phase.
- Behavior and formatting never share a commit.
- Tests, types, exports, and docs move in the same pull request as the code they describe.
- No pull request adds a capability flag. If a feature is not ready, it does not merge.
- Nothing is copied from the reference repository. Fixture intent may be reproduced; fixture files may not.

## Phase 0: baseline

Establish the toolchain and the evidence format before there is any behavior to argue about.

- **P0-01** Charter and contracts. This documentation set, the pull request template, `ci.yml`, `format.yml`, Prettier config, `tsconfig`, root manifest. **Done.**
- **P0-02** Lockfile and dependency cache. Commit `package-lock.json`, switch CI installs to `npm ci`, enable `actions/setup-node` npm caching.
- **P0-03** Package skeletons. `packages/core` with the `contract` layer, the diagnostics type, the allow-listed export map, and `internal.ts`. Vitest configured for unit and integration projects.
- **P0-04** Port interfaces and fakes. `Clock`, `Interpolator`, `Scheduler` types, a manual clock, a fake interpolator, a fake scheduler, and the contract test harness that both fakes and future adapters run against.
- **P0-05** Golden fixture format. Deterministic fixture loader and serializer for graph order, rollback, cycles, diamond memoization, lifecycle cleanup, playback states, and patch immutability. Fixtures are authored here, not imported.

**Exit:** the core package builds and tests with no animation engine present, contracts are typed, every gate is honest, and fixtures are reproducible byte for byte across two machines.

## Phase 1: leaf domain and local composition

- **P1-01** Immutable value snapshots and the deep freeze contract.
- **P1-02** Plugin registry, plugin stages, and `createAnimationPlugin`.
- **P1-03** Track: playhead, progress, snapshot, local composition through the `Interpolator` port. No observation, no children, no parent.
- **P1-04** Track lifecycle events and idempotent teardown.
- **P1-05** Motion: child membership, stagger, layout, reflow, timeline construction against a fake `Scheduler` and fake timeline.
- **P1-06** Trigger delegates for time, scroll, and manual, behind one interface.

**Exit:** Track is a renderer-neutral leaf with no composite behavior, Motion is the sole composite, and teardown plus reinitialization are covered by unit tests. Invariant I-4 has a test that would fail if any graph traversal were added to Track.

## Phase 2: graph kernel

- **P2-01** Qualified ids and the load-time normalization of authored ids.
- **P2-02** Graph IR, node and edge model, edge identity by source, role, target.
- **P2-03** Validation: duplicates, unknowns, self-reference, role and target rules, with the shared diagnostic shape.
- **P2-04** Cycle detection and canonical topological ordering keyed on qualified ids.
- **P2-05** `ObservationState`: live edges, observers, in-place mutation, stable identity.
- **P2-06** `GraphBinding`: the transactional coordinator, with the undo journal and full rollback.
- **P2-07** `scripts/boundary-scan.mjs` plus the CI `boundaries` job, enforcing invariant I-11 and the single-owner rules.

**Exit:** invalid graphs fail before mount, mutations are atomic, observation state identity survives every commit and every rollback, and invariants I-1, I-2, and I-12 have named tests.

## Phase 3: project runtime and publication

- **P3-01** `PatchRegistry`: revisions, deep freeze, deduplication, batching, subscriber notification at batch close.
- **P3-02** `GraphPublisher`: traversal, per-batch memoization, dirty seeds, downstream closure. Publication only, zero mutation methods.
- **P3-03** Failure semantics: error status, blocked downstream closure, retry metadata for publication failures only.
- **P3-04** `GraphRuntime`: one binding, one state, one publisher, one registry, one clock subscription.
- **P3-05** `ProjectRuntime`: project lifetime, membership, instance registry, diagnostics, the sole mount path.
- **P3-06** `Engine` as composition root, with explicit port injection.
- **P3-07** `performance/` benchmarks and `budgets.json`, plus the CI `performance` job.

**Exit:** two motions mount into one project graph, `Motion A -> Motion B` composes in a single tick, one batch, one publication per changed node, and invalidation stays stable after A unmounts. No per-Motion publisher or clock exists anywhere in the tree. Invariants I-3, I-5 through I-9, and I-13 have named tests.

## Phase 4: adapters and renderer integration

- **P4-01** GSAP interpolator adapter, behind the port, with the shared contract suite.
- **P4-02** Browser clock adapter and DOM renderer adapter.
- **P4-03** `packages/react`: project loading, motion instance, and playback hooks.
- **P4-04** React patch subscription hook consuming published batches, with no recursive composition and no per-frame React state updates.
- **P4-05** DOM and React integration fixtures.

**Exit:** the core suite still runs with no animation engine installed, React consumes immutable batches only, every port has a real adapter passing the same contract suite as its fake, and the boundaries job is green.

## Phase 5: cross-motion and adopted membership

- **P5-01** `motionId/trackId` references resolved at load, with pending reference semantics.
- **P5-02** `~/trackId` adopted free tracks through `engine.adopt(track)`.
- **P5-03** Unified diagnostics for missing, unknown, duplicate, role-mismatched, and incompatible references.
- **P5-04** Unmount and remount behavior: downstream blocking, diagnostics, and recovery.

**Exit:** authored, cross-motion, and adopted nodes travel the same graph, state, publisher, registry, clock, and lifecycle, with no capability flag anywhere. Invariant I-14 has a test.

## Phase 6: release hardening

- **P6-01** Final export map, TypeScript declarations, and the `api-surface-check` script plus CI job.
- **P6-02** Packaging: `npm pack --dry-run`, tarball install into a temporary consumer, import of the documented API. CI `package` job.
- **P6-03** Public documentation pass: README, API reference, authoring guide, migration guidance for authored projects.
- **P6-04** Benchmark thresholds finalized and enforced.
- **P6-05** Deletion sweep: any transitional code, test, or document created during delivery.

**Exit:** public docs describe only the shipped runtime, the full CI matrix is green, the tarball consumer test passes, and every release criterion in [PRD.md](./PRD.md) section 10 is checked off.

## Sequencing

Phases are strictly ordered. Phase 2 needs Phase 1's leaf semantics to have something to order. Phase 3 needs Phase 2's transactions to have something safe to publish. Phase 4 needs a publication contract to adapt to. Phase 5 needs all of it, and is the phase most likely to expose a Phase 2 identity mistake, which is why it comes before hardening rather than after.

Within a phase, pull requests may land in parallel where they touch disjoint files. Across phases, they may not.
