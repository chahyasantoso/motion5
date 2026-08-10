# motion5 implementation plan

**Status:** Approved execution plan
**Runtime reality:** See [SESSION-STATUS.md](./SESSION-STATUS.md)
**Technical contract:** See [TRD.md](./TRD.md)

This plan turns the product and architecture contracts into reviewable vertical slices. It does not claim that planned code exists. A slice is complete only when its acceptance tests pass, its documentation matches the implementation, and `SESSION-STATUS.md` records the result.

## 1. Delivery rules

- One pull request establishes one meaningful invariant or one tightly coupled contract.
- Target fewer than 20 semantic files. Recut before 25 commits or after a second revert.
- Behavior, public types, tests, exports, and relevant docs land together. Formatting-only changes stay separate.
- Every PR identifies its owner, boundary, failing test, rollback strategy, and newly true invariant.
- No copied source, tests, fixtures, demos, history, or migration seams from motionpath.
- No capability flags, aliases, compatibility facades, wildcard exports, or duplicate owners.
- Core tests are deterministic and headless. Time, scheduling, interpolation, and rendering enter through ports.
- A planned CI job is not described as live until the workflow runs it successfully.

## 2. Dependency chain

```text
contract -> ports -> immutable domain -> graph IR -> transactions
         -> publication -> project runtime -> engine -> adapters
         -> cross-motion membership -> packaging and hardening
```

A slice may start only when every dependency named in its `Requires` field has merged. Parallel work is allowed only where slices do not define or mutate the same owner.

## 3. Pull request template for every slice

Each implementation PR must include:

1. **Invariant:** the behavior that becomes true.
2. **Owner:** the only object allowed to perform the state transition.
3. **Boundary:** imports or APIs that remain forbidden.
4. **Evidence:** the exact unit, contract, integration, or package tests added.
5. **Failure behavior:** what callers observe and what state remains unchanged.
6. **Deletion:** temporary code, obsolete exports, or superseded docs removed by the slice.
7. **Rollback:** whether reverting the PR cleanly restores the previous contract.

## Phase 0: reproducible contract baseline

### P0-01: repository charter and toolchain

**Goal:** establish the repository as a TypeScript, ESM, Node 24 project with honest documentation and deterministic local commands.

**Work:** add package metadata, TypeScript, Vitest, Prettier, documentation ownership, and a placeholder test proving the runner works.

**Evidence:** `npm run format:check`, `npm run typecheck`, and `npm test` execute locally and in CI.

**Exit:** complete.

### P0-02: reproducible installation

**Requires:** P0-01.

**Work:** commit `package-lock.json`; require Node 24; replace fallback installation with `npm ci`; enable npm cache keyed by lockfile; document supported commands.

**Tests and gates:** a clean checkout installs and runs `npm run check`; CI uses no unconstrained install path.

**Exit:** lockfile drift fails CI and contributors can reproduce CI locally.

### P0-03: schema v5 contract package

**Requires:** P0-02.

**Owner:** `contract/` owns authored types, constants, validation result shapes, and diagnostics.

**Work:** define `ProjectDefinition`, `MotionDefinition`, `TrackDefinition`, observation roles, trigger types, diagnostic severity, and allow-listed public exports. Reject schema versions other than 5. Add an unadvertised internal entrypoint before internals need one.

**Tests:** minimal valid project; malformed top level; bad and duplicate ids; reserved `/` and `~`; invalid triggers; perspective errors and warnings; malformed observations; stable diagnostic paths and rule ids.

**Exit:** consumers can validate v5 without importing runtime code; v4 receives a migration diagnostic, not silent conversion.

### P0-04: ports, fakes, and contract harnesses

**Requires:** P0-03.

**Owner:** `ports/` defines `Clock`, `Interpolator`, and `Scheduler`; adapters implement them later.

**Work:** add port interfaces, runtime assertions, manual clock, fake interpolation timeline, fake scheduler, and reusable contract suites. Specify idempotent cancellation and disposal, monotonic ticks, clamped progress, and deterministic job ordering.

**Tests:** fake implementations pass their own contract suites; multiple subscriptions unsubscribe independently; disposal is idempotent; callbacks added or removed during dispatch cannot corrupt the current tick.

**Exit:** core can be implemented with no browser, React, GSAP, or wall clock.

### P0-05: migration and golden evidence

**Requires:** P0-03.

**Owner:** the explicit migration function owns v4-to-v5 transformation; runtime loading never migrates.

**Work:** implement pure migration; rename only project-level `tracks`; qualify known free-track references; preserve motion-owned tracks; reject collisions and ambiguous input; add stable JSON serialization and fresh fixtures.

**Tests:** version bump, immutability, idempotence on v5, deterministic output, both-field collision, invalid source assumptions, qualified references, warning/error serialization, and round-trip fixture parsing.

**Exit:** migration output is deterministic, v4 remains rejected at runtime, and the integration job is required.

## Phase 1: leaf domain

### P1-01: immutable values and lifecycle primitives

**Requires:** Phase 0.

**Owner:** domain value utilities own cloning, equality, and freezing policy.

**Work:** define JSON-compatible renderer-neutral values, deep freeze, structural equality, lifecycle guards, and typed disposal errors. Reject unsupported mutable or cyclic values at the boundary.

**Tests:** nested arrays and objects freeze; mutation throws in strict mode; equal values compare equal independent of object key insertion; cycles and unsupported values fail deterministically; dispose is idempotent and reentrancy-safe.

**Exit:** later patches can rely on one immutability and equality implementation.

### P1-02: plugin registry and local composition

**Requires:** P1-01, P0-04.

**Owner:** the plugin registry owns plugin lookup; a Track owns invoking resolved plugins for itself.

**Work:** define plugin identity, registration, duplicate handling, resolution, composition context, and deterministic merge order. Registry mutation after runtime construction must not silently alter mounted tracks.

**Tests:** registration and duplicate rejection; missing plugin diagnostics; deterministic plugin order; immutable inputs; plugin failure normalization; no graph access in plugin context.

**Exit:** local value composition is usable without graph or renderer code.

### P1-03: Track leaf

**Requires:** P1-01, P1-02, P0-04.

**Owner:** `Track` owns playhead, interpolation timeline, local plugin composition, snapshots, and local lifecycle.

**Work:** construct from normalized definition; create and kill one interpolation timeline; expose clamped progress and immutable snapshots; invalidate on meaningful progress changes; prohibit children, parent ownership, scheduling, and graph traversal.

**Tests:** initial state; progress 0/1 and clamping; unchanged progress deduplication; snapshot immutability; interpolation failure; repeated dispose; no callbacks after dispose; compile-time/public-surface proof that Track has no composite API.

**Exit:** Track is a complete reusable leaf with no graph imports.

### P1-04: lifecycle state machine

**Requires:** P1-03.

**Work:** formalize `created -> mounted -> detached -> destroyed`; define legal and idempotent transitions; set teardown guard before notifications; separate detach from destroy for borrowed objects.

**Tests:** every valid transition, every invalid transition, nested teardown, owner callback reentrancy, detach/remount, and resource release counts.

**Exit:** lifecycle semantics are stable before composite ownership is added.

### P1-05: Motion scheduling and child ownership

**Requires:** P1-04.

**Owner:** `Motion` is the sole composite and owns children, scheduling, stagger, reflow, playback, and owner-first teardown.

**Work:** create child tracks; compute deterministic schedules; delegate progress to tracks without composing graph dependencies; support play, pause, seek, stop, and reflow; dispose membership before child resources.

**Tests:** authored order; stagger offsets; duration aggregation; seek boundaries; replay; reflow; duplicate child rejection; teardown order; one child failure does not leak siblings.

**Exit:** no Track has children and no graph package is required for local Motion behavior.

### P1-06: trigger delegates

**Requires:** P1-05, P0-04.

**Work:** implement manual, time, and scroll trigger contracts as injected delegates. Keep DOM and browser listeners out of core. Define attach, detach, event normalization, and resubscription behavior.

**Tests:** each trigger drives the same Motion playback contract; duplicate events dedupe; detach stops updates; remount resumes once; invalid trigger configuration produces diagnostics before mount.

**Exit:** Motion playback is fully testable with fakes and no environment globals.

**Phase 1 exit gate:** Track is a strict leaf; Motion is the only composite; fake-port tests cover playback, scheduling, triggers, remount, and teardown.

## Phase 2: graph kernel

### P2-01: qualified identity and reference resolution

**Requires:** Phase 1.

**Owner:** graph normalization owns qualification exactly once.

**Work:** normalize motion tracks to `motionId/trackId` and free tracks to `~/trackId`; resolve local, cross-motion, and free references; retain authored order metadata; never expose bare ids downstream.

**Tests:** all reference forms; reserved namespaces; duplicate qualified ids; ambiguous and unknown references; already-qualified internal ids are not requalified; canonical sorting fixtures.

**Exit:** every graph-facing registry uses qualified ids only.

### P2-02: immutable graph IR

**Requires:** P2-01.

**Work:** define immutable node, edge, adjacency, authored-order, diagnostic, and canonical-order structures. Build candidates without touching live state.

**Tests:** source input cannot mutate IR; graph snapshots are deeply frozen; input/output edges preserve role and target; free and motion tracks share one node representation.

**Exit:** candidate graphs are inspectable pure values.

### P2-03: graph validation

**Requires:** P2-02.

**Work:** validate membership, source existence, self-reference, duplicate edge identity, role/target compatibility, and node compatibility. Collect deterministic diagnostics rather than failing at the first unrelated error.

**Tests:** one fixture per rule; multiple-error ordering; warning never blocks; error always blocks; diagnostic paths point to authored locations.

**Exit:** no invalid candidate can reach mount or live state.

### P2-04: cycle detection and canonical order

**Requires:** P2-03.

**Work:** implement deterministic cycle detection and stable topological sorting using qualified id and authored order, never incidental `Map` insertion order.

**Tests:** chains, diamonds, disconnected components, multiple roots, self-cycle, multi-node cycle, stable cycle diagnostics, and randomized insertion producing identical order.

**Exit:** the same authored project always produces the same order and diagnostics.

### P2-05: stable ObservationState

**Requires:** P2-04.

**Owner:** one long-lived `ObservationState` owns live observer and edge registrations.

**Work:** add reversible primitives for node and edge attach/detach; expose read-only snapshots; keep object identity stable; prohibit replacement after construction.

**Tests:** architecture invariant I-1; attach/detach symmetry; duplicate operations; identity through successful and failed candidate operations; snapshot determinism.

**Exit:** live state can support transactions without reconstruction.

### P2-06: transactional GraphBinding

**Requires:** P2-05.

**Owner:** `GraphBinding` is the only topology mutation coordinator.

**Work:** implement add, remove, and replace through candidate build, validation, undo-journal application, schedule update, immutable snapshot commit, and invalidation. Replay the journal in reverse on any pre-commit failure.

**Tests:** architecture invariant I-2; injected failure at every transaction stage; exact pre/post snapshots; stable ObservationState identity; successful commit invalidates only affected closure; original error retains diagnostics.

**Exit:** rollback restores graph IR, live edges, indexes, subscriptions, ownership, and published state exactly.

### P2-07: boundary scan and CI gate

**Requires:** P2-06.

**Work:** add mechanical import and export checks for renderer dependencies, forbidden compatibility symbols, wildcard exports, and duplicate owner construction paths. Add a required boundaries job and local command.

**Tests:** seeded violating fixtures make the scan fail; behavioral tests remain the proof for runtime invariants.

**Exit:** core graph/domain cannot import GSAP, DOM, React, or adapter modules.

**Phase 2 exit gate:** invalid graphs fail before mount; canonical order is stable; ObservationState identity survives every transaction; rollback is byte-identical; only GraphBinding mutates topology.

## Phase 3: runtime and publication

### P3-01: PatchRegistry

**Requires:** Phase 2, P1-01.

**Owner:** one project-wide registry owns latest patches, per-node revisions, deep immutability, batching, deduplication, and subscriptions.

**Work:** define patch and batch contracts; publish only changed value/progress/source-revision/status tuples; notify node subscribers before batch subscribers at batch close.

**Tests:** invariants I-6, I-7, and I-8; no partial visibility; monotonic per-node revision; unchanged dedupe; unsubscribe during notification; subscriber exceptions do not corrupt registry state.

**Exit:** publication identity and subscriber timing are fixed.

### P3-02: publication-only GraphPublisher

**Requires:** P3-01.

**Owner:** publisher owns traversal of a committed graph snapshot, never topology.

**Work:** collect dirty seeds; calculate downstream closure; traverse canonical order; compose each dirty node once; apply input contributions before local composition and output contributions after; refuse reentrant flushes.

**Tests:** I-3, I-5, I-12; chain and diamond call counts; unrelated branch omission; role merge semantics; flush during flush returns without queueing; public type exposes no mutation API.

**Exit:** one deterministic flush can produce a complete batch without mutation methods.

### P3-03: error, blocked, and retry semantics

**Requires:** P3-02.

**Work:** normalize composition errors; publish `error` for the failing node and `blocked` for its downstream closure; continue unrelated branches; aggregate errors after traversal; retain retry metadata only for publication failures.

**Tests:** I-9; multi-branch failure; recovery next tick; unchanged blocked patch dedupe; bounded diagnostics; publication failure retry without recomposition where safe.

**Exit:** failures never leak stale downstream values or abort unrelated work.

### P3-04: GraphRuntime composition root

**Requires:** P3-03, P2-06.

**Owner:** one `GraphRuntime` owns one binding, ObservationState, publisher, registry, and clock subscription.

**Work:** wire one clock listener; translate ticks and explicit flush requests into batches; coordinate mutations for the next tick; maintain monotonic tick semantics across detach/remount.

**Tests:** I-13; many motions still create one subscription; explicit flush; subscription disposal; mutation from subscriber runs next tick; no work after destroy.

**Exit:** all project graph work travels through one runtime.

### P3-05: ProjectRuntime

**Requires:** P3-04, Phase 1.

**Owner:** ProjectRuntime owns normalized project data, instances, membership, diagnostics, metadata, and the single GraphRuntime.

**Work:** validate before construction; instantiate motions and free tracks; mount transactionally; expose subscriptions and diagnostics; preserve perspective as renderer metadata; tear down owner-first.

**Tests:** valid load; invalid load creates no runtime resources; one mixed project; warning visibility; perspective preservation; repeated dispose; failed replacement keeps active project untouched.

**Exit:** project load, lifetime, replacement, and publication have one public runtime path.

### P3-06: Engine public facade

**Requires:** P3-05.

**Owner:** Engine is only the composition root and user-facing entrypoint.

**Work:** accept ports/adapters; load, replace, and dispose projects; expose documented subscriptions and controls without leaking internals; define typed errors.

**Tests:** public API happy path; invalid adapters; load replacement rollback; no internal class exports; package-level import examples compile.

**Exit:** consumers can use core without constructing internals.

### P3-07: budgets and deterministic benchmarks

**Requires:** P3-06.

**Work:** benchmark graph build, traversal, dirty propagation, publication, and repeated load/dispose memory retention. Commit dataset generators, environment metadata, and versioned budgets. Run advisory only during a dated calibration window, then require or remove.

**Exit:** regressions have reproducible numbers and the performance job has no permanent soft-fail mode.

**Phase 3 exit gate:** two motions and a free track publish through one graph, one state, one publisher, one registry, one batch per tick, and one clock subscription.

## Phase 4: adapters and React

### P4-01: GSAP interpolator adapter

**Requires:** P3-06.

**Decision:** GSAP remains the v1 interpolation engine; no built-in sampler ships.

**Work:** implement `Interpolator` using GSAP behind the adapter boundary; translate normalized keyframes; guarantee progress, duration, and kill semantics; keep GSAP out of core package layers.

**Tests:** run the shared interpolator contract against fake and GSAP implementations; parity fixtures cover numeric properties, easing, duration, progress boundaries, and disposal.

**Exit:** GSAP is replaceable through the port but is the supported v1 implementation.

### P4-02: browser clock and DOM adapter

**Requires:** P4-01.

**Work:** implement animation-frame clock with monotonic ticks and cancellation; translate immutable patches into DOM writes; apply perspective to the stage once; define missing-target behavior and cleanup.

**Tests:** port contract; fake RAF; attach/detach; no writes after disposal; 3D perspective metadata; blocked/error patches do not apply stale values.

**Exit:** browser behavior exists entirely outside renderer-neutral core.

### P4-03: React package and playback hooks

**Requires:** P3-06.

**Decision:** `@motion5/react` is part of v1.

**Work:** create the React package; provide project/runtime context, patch and batch subscriptions, stable selectors, and playback lifecycle hooks. Use `useSyncExternalStore` semantics; never traverse graph objects or compose recursively.

**Tests:** strict-mode mount/unmount; selector stability; immutable snapshot contract; no duplicate subscriptions; runtime replacement; server render imports without starting clocks.

**Exit:** React consumes public patch/lifecycle contracts only.

### P4-04: immutable patch subscription behavior

**Requires:** P4-02, P4-03.

**Work:** verify DOM and React consumers receive the same immutable batch identity and cannot mutate later readers; document selector and rerender rules.

**Tests:** cross-consumer mutation attempts; unchanged-patch rerender suppression; batch ordering; subscriber cleanup.

**Exit:** renderer behavior cannot alter runtime truth.

### P4-05: adapter integration fixtures and build gate

**Requires:** P4-04.

**Work:** add fresh end-to-end fixtures for time, scroll, manual input, 3D metadata, errors, and teardown. Add package builds and public import smoke tests to CI.

**Exit:** real adapters pass fake-port contracts and integration fixtures without importing renderer code into core.

**Phase 4 exit gate:** GSAP, browser, DOM, and React integrations are proven adapters; React remains in v1; core stays headless and renderer-neutral.

## Phase 5: unified membership

### P5-01: cross-motion references

**Requires:** Phase 4, final qualified identity from P2.

**Work:** resolve and mount references across motions through the existing graph transaction path; define detach behavior when source or observer leaves.

**Tests:** forward and reverse authored order; source removal blocks dependents; remount recovery; cycles spanning motions; no feature flag.

### P5-02: adopted free tracks

**Requires:** P5-01.

**Work:** add runtime adoption and detachment for externally owned tracks; distinguish authored project ownership from borrowed adoption without changing graph node type.

**Tests:** owner destroys owned track; borrower only detaches adopted track; repeated adoption rejection; detach/remount; shared root across multiple motions.

### P5-03: unified diagnostics

**Requires:** P5-02.

**Decision:** runtime diagnostics remain inline on patches and in batch summaries; no separate diagnostics stream ships in v1.

**Work:** use one diagnostic shape for authored validation, membership, composition, blocked state, and publication; maintain a bounded project ring buffer for inspection.

**Tests:** deterministic ordering; affected patch diagnostics; batch summary; bounded retention; warnings do not block; errors do.

### P5-04: unmount and remount recovery

**Requires:** P5-03.

**Work:** prove topology, schedules, subscriptions, and patch state recover through source/observer unmount and remount without replacing ObservationState or leaking revisions.

**Tests:** permutations of authored, cross-motion, and adopted nodes; repeated cycles; one clock subscription; stable state identity; memory retention checks.

**Phase 5 exit gate:** authored, cross-motion, and adopted nodes use one graph path with no flags; ownership determines detach versus destroy; diagnostics remain inline.

## Phase 6: release hardening

### P6-01: API surface and declarations

**Requires:** Phase 5.

**Work:** finalize allow-listed exports and package export maps; generate declarations; block deep imports; document stability levels; run API surface checks.

### P6-02: packed package consumer

**Requires:** P6-01.

**Work:** build and pack core and React; install tarballs into clean ESM TypeScript consumers; import only documented paths; run a manual-clock project and a React render smoke test.

### P6-03: public documentation

**Requires:** P6-02.

**Work:** reconcile README, PRD, TRD, architecture, schema, migration, API reference, and examples with shipped behavior. Remove all statements that describe unimplemented behavior as current.

### P6-04: required benchmark budgets

**Requires:** P6-02 and completed P3-07 calibration.

**Work:** lock accepted budgets, make the performance job required, store useful artifacts on failure, and document the intentional update procedure.

### P6-05: deletion and release audit

**Requires:** P6-03, P6-04.

**Work:** delete migration-only scaffolding not part of the supported migration API, temporary diagnostics, calibration allowances, obsolete status prose, and transitional exports. Audit licenses and dependency boundaries.

**Phase 6 exit gate:** documented imports work from packed artifacts; all architecture invariants have named tests; all required CI gates are green; no flags, duplicate owners, wildcard exports, or transitional runtime paths remain.

## 4. Cross-phase acceptance matrix

| Concern | Owning slice | Required evidence |
| --- | --- | --- |
| v5 validation and v4 rejection | P0-03 | Unit and integration |
| Pure v4 migration | P0-05 | Migration and golden |
| Track leaf boundary | P1-03 | Unit, type, boundary |
| Motion sole composite | P1-05 | Unit and lifecycle |
| Canonical graph order | P2-04 | Unit and randomized insertion |
| Stable live state | P2-05 | I-1 integration |
| Exact rollback | P2-06 | I-2 fault injection |
| Immutable atomic publication | P3-01 | I-6, I-7, I-8 |
| One composition per flush | P3-02 | I-5 diamond test |
| Failure closure | P3-03 | I-9 integration |
| One clock subscription | P3-04 | I-13 integration |
| GSAP adapter | P4-01 | Shared port contract |
| React v1 package | P4-03 to P4-05 | Hook, build, package tests |
| Cross-motion and free membership | P5 | Integration and lifecycle |
| Inline diagnostics | P5-03 | Patch and batch assertions |
| Public package integrity | P6-01, P6-02 | API and tarball consumer |
| Performance and retention | P3-07, P6-04 | Required budgets |

## 5. Release checklist

v1 is releasable only when all answers are yes:

- Does runtime loading accept exactly schema v5 and require explicit migration for v4?
- Are authored ids local and qualified ids internal only?
- Is Track a leaf and Motion the only composite?
- Is there exactly one graph, ObservationState, GraphBinding, publisher, registry, and clock subscription per project?
- Does every topology mutation commit atomically or restore the exact previous observable state?
- Does one tick create at most one immutable batch and compose each dirty node at most once?
- Are composition failures visible inline and are downstream values blocked rather than stale?
- Do GSAP, browser, DOM, and React live behind tested boundaries?
- Does `@motion5/react` ship and pass package-consumer tests?
- Do cross-motion and free tracks use the same graph path without flags?
- Are public exports allow-listed and deep imports blocked?
- Are build, package, boundary, integration, and performance gates required and green?
- Do docs describe shipped behavior, with current reality recorded only in `SESSION-STATUS.md`?

## 6. Definition of done

A slice is done only when behavior, ownership, API, types, docs, tests, exports, and CI agree; the nearest suite and full relevant matrix are green; the diff was reviewed with whitespace hidden; no temporary compatibility path remains; and `SESSION-STATUS.md` names the next unblocked slice.
