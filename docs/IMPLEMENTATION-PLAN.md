# motion5 implementation plan

**Status:** Execution plan. This document describes work to be done, not runtime that exists. A phase is complete only when its exit gate is green and [SESSION-STATUS.md](./SESSION-STATUS.md) says so.
**Authored contract:** schema v5. See [AUTHORED-SCHEMA.md](./AUTHORED-SCHEMA.md).
**Normative requirements:** [TRD.md](./TRD.md). Every slice below names the requirements it satisfies.
**Predecessor:** [motionpath](https://github.com/chahyasantoso/motionpath) is a read-only behavioral oracle. Nothing is copied from it. See ADR-001.

## 1. How to read this plan

The plan is a queue of slices. One slice is one pull request and one meaningful invariant. Slices are written in dependency order and each one is described with the same nine fields.

- **Intent:** the single sentence a reviewer should be able to check.
- **Owner:** the object that gains a responsibility, or the boundary that gains an enforcement.
- **Changes:** files added, changed, or deleted. Paths are targets, not guarantees.
- **API delta:** what appears in `@motion5/core`, in `@motion5/core/internal`, or nowhere.
- **Behavior:** the observable rules the slice establishes.
- **Evidence:** named executable tests. A slice with no failing-first test is not a slice.
- **Exit:** the binary condition for merge.
- **Depends / blocks:** ordering constraints.
- **Risk and rollback:** what goes wrong and how the change is undone in one revert.

Requirement ids in the form `TR-*` point at [TRD.md](./TRD.md). Invariant ids in the form `I-*` point at [ARCHITECTURE.md](./ARCHITECTURE.md). Requirement ids in the form `FR-*` point at [PRD.md](./PRD.md).

## 2. Delivery rules

- One pull request establishes one meaningful invariant.
- Target fewer than twenty semantic files; stop and recut beyond twenty-five commits or after a second revert.
- Behavior, docs, types, tests, and exports land together. Formatting is separate.
- No copied tests, fixtures, demos, or source from motionpath.
- No flags, aliases, facades, or duplicate owners.
- Every PR names the failing test, the new owner, and the deletion or boundary it establishes.
- A slice that cannot name which single object owns its new state transition is not ready to be written.
- A slice that only adds types with no behavior must say so in its title and must not claim an invariant.

## 3. Sizing and cadence

A healthy slice is one to three days of focused work, under twenty semantic files, and reviewable in one sitting with whitespace hidden. If a slice grows a second owner, a second failing test theme, or a second public export group, recut it before opening the pull request. Recutting is cheap. Reverting a merged slice that did two things is not.

Phases are not calendar milestones. They are dependency tiers. Work inside a phase may run in parallel only where the plan says the slices are independent.

## 4. Phase 0: baseline

Goal: an honest toolchain, a typed authored contract, injectable ports with fakes, and deterministic migration evidence, all with no engine and no graph.

### P0-01 Charter

**Status:** Done, merged.
**Intent:** Establish docs, workflows, Prettier, TypeScript, manifest, and a placeholder test.
**Owner:** The repository itself.
**Evidence:** `npm run check` passes on a clean clone.
**Exit:** Green quality job.

### P0-02 Reproducible install

**Status:** Done, merged.
**Intent:** Make installs deterministic before anything depends on them.
**Changes:** commit `package-lock.json`; switch CI to `npm ci`; enable the npm cache; document Node 24 in `engines` and the README.
**Evidence:** CI installs from the lockfile; a lockfile-free run fails.
**Exit:** Quality job runs `npm ci` on Node 24.
**Satisfies:** TR-SC-01, TR-SC-02.

### P0-03 Contract package

**Status:** Done, merged.
**Intent:** Type the authored contract before writing anything that reads it.
**Owner:** `core/contract` as the single source of authored truth.
**Changes:** `packages/core/src/contract/v5.ts`, `validate-v5.ts`, `packages/core/src/index.ts`, `internal.ts`.
**API delta:** `AUTHORED_SCHEMA_VERSION`, `SUPPORTED_TRIGGER_TYPES`, `DIAGNOSTIC_SEVERITIES`, `validateV5`, and the v5 type set.
**Behavior:** v5 validates; v4 is rejected with a migration diagnostic; the validator returns a result object and never throws for authored-input problems.
**Evidence:** `test/unit/contract/validate-v5.test.ts`.
**Exit:** Allow-listed exports only; no deep wildcard import path resolves.
**Satisfies:** FR-1, FR-2, TR-D-01 through TR-D-06, TR-S-01.

### P0-04 Ports and fakes

**Status:** Done, merged.
**Intent:** Define the three capabilities the core will accept, and ship the fakes the core test suite will actually use.
**Owner:** `core/ports`.
**Changes:** `ports/clock.ts`, `ports/interpolator.ts`, `ports/scheduler.ts`, `ports/fakes.ts`, `test/contract/ports.test.ts`.
**API delta:** `createManualClock`, `assertClock`, `assertInterpolator`, `assertScheduler`.
**Behavior:** the manual clock emits monotonic frozen ticks with non-negative deltas, refuses use after dispose, and iterates a snapshot of its listener set so a listener may unsubscribe during a tick.
**Evidence:** one shared contract harness run against every fake.
**Exit:** The harness exists and is reusable by future real adapters unchanged.
**Satisfies:** FR-17, TR-P-01 through TR-P-06.

### P0-05 Migration and golden evidence

**Status:** In review on `feat/p0-05-golden-fixtures-and-integration`.
**Intent:** Prove the v4-to-v5 transformation is pure, deterministic, and serializable before any runtime consumes it.
**Owner:** `core/contract/migrate-v4-to-v5.ts` and `core/contract/golden.ts`.
**Behavior:** migration is pure and idempotent; it refuses documents that carry both `tracks` and `freeTracks`; the golden serializer sorts object keys, preserves array order, and ends with exactly one newline.
**Evidence:** `test/migration/*`, `test/integration/golden-serialization.test.ts`, fresh v5 fixtures for minimal projects, perspective warnings, free tracks, cycles, and migration.
**Exit:** Integration job is required and green; migration output is byte-stable across runs and across key insertion order.
**Satisfies:** FR-5, TR-D-07 through TR-D-10, TR-T-04.

### P0-06 Requirements and plan detail

**Status:** This change.
**Intent:** Replace a phase outline with a slice-level execution plan and add a normative technical requirements document, so that no future slice has to reinvent its own acceptance criteria.
**Owner:** `docs/TRD.md` becomes the single normative requirements source; `docs/IMPLEMENTATION-PLAN.md` becomes the single sequencing source.
**Changes:** `docs/IMPLEMENTATION-PLAN.md`, `docs/TRD.md`, `docs/README.md`, `README.md`.
**API delta:** None. Documentation only.
**Evidence:** None claimed. This slice asserts no runtime invariant and must not pretend to.
**Exit:** Format check passes; every phase gate in this plan maps to a requirement in the TRD and a job in [CI-WORKFLOW.md](./CI-WORKFLOW.md).
**Depends:** Nothing. **Blocks:** Nothing, but Phase 1 reviews should cite it.

### Phase 0 exit gate

Core typechecks and tests headlessly. v4 is rejected at the boundary. v5 validates. Migration output is deterministic and immutable. No engine, DOM, or React import exists anywhere in `packages/core/src`. The quality and integration jobs are both required and both green.

## 5. Phase 1: leaf domain

Goal: `Track` becomes a genuine leaf and `Motion` becomes the only composite, both provable with fake ports and no graph layer in sight.

### P1-01 Immutable value snapshots

**Intent:** Give the domain one frozen value representation so publication never has to defensively copy.
**Owner:** `core/domain/values.ts`.
**Changes:** add deep-freeze helpers, a structural equality check for published values, and a canonical property ordering helper.
**API delta:** internal only.
**Behavior:** snapshots are deeply frozen; freezing is idempotent and cycle-safe; equality is structural, order-insensitive for object keys, and treats `-0` and `NaN` as JavaScript `Object.is` does; a frozen snapshot is never re-frozen on a hot path.
**Evidence:** `test/unit/domain/values.test.ts` proves mutation throws in strict mode, that equality drives revision suppression, and that freezing a large nested value does not recurse into a cycle forever.
**Exit:** No other module owns freezing. Grep-level enforcement lands later in P2-07; the behavioral rule lands here.
**Depends:** P0-03. **Blocks:** P1-03, P3-01.
**Risk:** deep freeze on every tick is a performance trap. Mitigation: freeze at publication only, and record the cost in the P3-07 benchmark.
**Satisfies:** TR-R-06, I-7.

### P1-02 Plugin registry

**Intent:** One registration path for value producers, resolved once per track, never consulted during traversal.
**Owner:** `core/domain/plugins.ts`.
**Behavior:** registration is explicit and namespaced; duplicate registration of the same name is an error, not a silent overwrite; resolution happens at track construction and produces a frozen ordered composition list; an unknown plugin is a load-time error diagnostic, not a runtime throw.
**Evidence:** `test/unit/domain/plugins.test.ts` covers duplicate rejection, deterministic composition order, and unknown-plugin diagnostics.
**Exit:** Track holds a resolved list, not a registry reference.
**Depends:** P1-01. **Blocks:** P1-03.
**Risk:** plugins becoming a general extension point that can reach the graph. Mitigation: the plugin signature receives values and progress only, never a node, project, or runtime.
**Satisfies:** TR-M-05.

### P1-03 Track leaf and local composition

**Intent:** Track owns playhead, interpolation inputs, local plugin composition, and renderer-neutral snapshots, and nothing else.
**Owner:** `core/domain/track.ts`.
**Behavior:** `Track` has no children, no parent, no group host, and no method that reads a dependency; setting progress marks the track dirty and does not compose eagerly; composing produces a frozen snapshot from local inputs only; progress is clamped to `[0, 1]` and rejects non-finite input.
**API delta:** `Track` is exported, constructed with an `Interpolator` port.
**Evidence:** `test/unit/domain/track.test.ts` plus `test/unit/domain/track-is-leaf.test.ts`, which asserts the public shape has no child, parent, or traversal member and that composition never calls the interpolator more than once per progress change.
**Exit:** I-4 has a named test.
**Depends:** P1-01, P1-02, P0-04. **Blocks:** P1-05, P2-02.
**Risk:** convenience methods creeping back onto Track. Mitigation: ADR-004 is cited in the PR body and the shape test fails on any added member.
**Satisfies:** FR-16, TR-M-03, TR-M-04, I-4.

### P1-04 Lifecycle primitives

**Intent:** One idempotent, reentrancy-safe teardown primitive that every owner reuses.
**Owner:** `core/domain/lifecycle.ts`.
**Behavior:** the disposed flag is set before any notification, never after; `dispose` and `destroy` are idempotent; calling `dispose` from inside a dispose callback returns immediately; teardown is owner-first, so an owner releases membership and subscriptions before the contained object releases local resources; a borrowed object is detached by its borrower and destroyed only by its owner.
**Evidence:** `test/unit/domain/lifecycle.test.ts` covers double dispose, reentrant dispose, dispose during notification, and borrowed-versus-owned teardown.
**Exit:** I-10 has a named test and no other module implements its own guard flag.
**Depends:** P1-03. **Blocks:** P1-05, P3-05, P5-04.
**Satisfies:** TR-L-01 through TR-L-04, I-10.

### P1-05 Motion scheduling and children

**Intent:** Motion becomes the only composite: membership, hierarchy, stagger, layout, reflow, timeline construction, playback, and child teardown.
**Owner:** `core/domain/motion.ts`.
**Behavior:** a motion owns an ordered child list keyed by local track id; stagger is a pure function of authored order and offset; playback advances child playheads through the `Scheduler` and `Clock` ports and never touches the DOM; destroying a motion destroys its authored children and detaches anything it merely borrowed.
**Evidence:** `test/unit/domain/motion.test.ts` and `test/integration/motion-playback.test.ts`, both driven by the manual clock and fake scheduler, covering play, pause, seek, stagger offsets, reflow after a duration change, and full teardown with zero surviving subscriptions.
**Exit:** Playback and teardown are proven with fake ports only. Zero real timers.
**Depends:** P1-03, P1-04. **Blocks:** P1-06, P3-04.
**Risk:** Motion quietly acquiring graph knowledge. Mitigation: Motion may not import anything from `core/graph`; P2-07 makes that mechanical.
**Satisfies:** FR-15, TR-M-01, TR-M-02.

### P1-06 Triggers

**Intent:** `scroll`, `time`, and `manual` triggers as delegates owned by Motion, with no renderer dependency in core.
**Owner:** `core/domain/triggers/`.
**Behavior:** a trigger is a pure delegate that converts an external signal into a playback command; the `scroll` trigger in core takes a normalized progress input and does not read the DOM; an invalid trigger type is a load-time error; attaching a trigger twice is an error, not a second subscription.
**Evidence:** `test/unit/domain/triggers.test.ts` covers each type, double-attach rejection, and detach leaving no listener behind.
**Exit:** No trigger implementation imports the DOM.
**Depends:** P1-05. **Blocks:** P4-02.
**Satisfies:** TR-M-06, I-11.

### Phase 1 exit gate

Track has no children and no graph traversal. Motion owns all composite behavior. Fake-port tests cover playback, stagger, triggers, and teardown. Nothing in `core/domain` imports `core/graph`, an animation engine, the DOM, or React.

## 6. Phase 2: graph kernel

Goal: identity, intermediate representation, validation, ordering, live state, and one transactional mutation coordinator. No publication yet.

### P2-01 Qualified ids

**Intent:** Qualification happens exactly once, at load, and nothing downstream ever sees an unqualified id.
**Owner:** `core/graph/ids.ts`.
**Behavior:** `motionId/trackId` for motion tracks and `~/trackId` for free tracks; `/` is a reserved separator and `~` is a reserved motion id, both rejected in authored input; qualification is a pure total function; parsing a qualified id back into parts is lossless.
**Evidence:** `test/unit/graph/ids.test.ts` covers round-tripping, reserved-character rejection, collision between a motion track and a free track of the same name, and stability of the sort key.
**Exit:** One qualification function exists. No second spelling.
**Depends:** P0-03. **Blocks:** P2-02, P5-01.
**Satisfies:** FR-3, TR-G-01, TR-G-02.

### P2-02 Graph IR

**Intent:** An immutable intermediate representation with nodes, edges, diagnostics, and canonical order, built from a validated authored project.
**Owner:** `core/graph/ir.ts` and `core/graph/normalize.ts`.
**Behavior:** the IR is frozen; nodes carry qualified id, authored index, owner, and role-tagged edge lists; free tracks and motion tracks produce the same node shape; normalization is deterministic and never reads a `Map` whose insertion order came from a runtime event.
**Evidence:** `test/unit/graph/normalize.test.ts` plus a golden fixture whose serialized IR is byte-stable across shuffled authored key order.
**Exit:** Two normalizations of the same document are byte-identical.
**Depends:** P2-01, P1-03. **Blocks:** P2-03.
**Satisfies:** FR-6, FR-9, TR-G-03, TR-G-04, I-12, ADR-013.

### P2-03 Graph validation

**Intent:** Every invalid graph fails before mount with a deterministic diagnostic set.
**Owner:** `core/graph/validate.ts`.
**Behavior:** rejects unknown sources, duplicate edges by `(source, role, target)`, self-reference, input edges with an empty target, output edges that carry a target, and reserved-namespace violations; warns for missing perspective alongside 3D content and for unused free tracks; diagnostics are sorted by rule id then path so output is stable.
**Evidence:** `test/unit/graph/validate.test.ts` with one named case per rule id, plus a golden diagnostic fixture.
**Exit:** An error diagnostic never permits a load and a warning never blocks one. I-15 has a named test.
**Depends:** P2-02. **Blocks:** P2-04.
**Satisfies:** FR-2, FR-20, TR-G-05, TR-E-01 through TR-E-03, I-15.

### P2-04 Cycle detection and canonical order

**Intent:** Ordering is a pure function of qualified ids and authored order, and a cycle is a load-time error naming the participating ids.
**Owner:** `core/graph/order.ts`.
**Behavior:** topological order with a deterministic tie-break on qualified id, then authored index; cycle detection reports the minimal cycle path in the diagnostic `ids` array; ordering is recomputed only on commit, never during a flush.
**Evidence:** `test/unit/graph/order.test.ts` covers diamonds, disconnected components, deterministic tie-breaks under shuffled input, self-cycles, and multi-node cycles.
**Exit:** I-12 has a named test.
**Depends:** P2-03. **Blocks:** P2-06, P3-02.
**Risk:** deep graphs blowing the stack in a recursive sort. Mitigation: iterative Kahn traversal, with a depth fixture in the P3-07 benchmark.
**Satisfies:** TR-G-06, TR-G-07, I-12.

### P2-05 Stable ObservationState

**Intent:** One long-lived live-state object per project whose identity survives every commit and every rollback.
**Owner:** `core/graph/observation-state.ts`.
**Behavior:** live edges and observers are mutated in place, never rebuilt after commit; every mutation records an undo entry; the undo journal is released only after a successful commit; the object exposes no method that rebuilds itself from an IR snapshot.
**Evidence:** `test/unit/graph/observation-state.test.ts` asserts reference identity before and after commit and after rollback, and that replaying the journal restores an exact structural snapshot.
**Exit:** I-1 has a named test.
**Depends:** P2-02. **Blocks:** P2-06.
**Satisfies:** FR-8, TR-G-08, I-1, ADR-006.

### P2-06 Transactional GraphBinding

**Intent:** One coordinator for every add, remove, and replace of a node or edge, with all-or-nothing semantics.
**Owner:** `core/graph/binding.ts`.
**Behavior:** the transaction path is build candidate, normalize and validate candidate, apply live-state changes with an undo journal, apply publisher schedule changes, commit the immutable snapshot, invalidate affected nodes, release the journal; any failure before commit replays the journal in reverse and rethrows the original error with candidate diagnostics attached; there is no partial application and no repair step; mutations requested during a flush are deferred to the next tick rather than queued mid-pass.
**Evidence:** `test/integration/graph-rollback.test.ts` compares pre- and post-mutation snapshots of IR, live edges, publisher indexes, lifecycle subscriptions, ownership, and published patches after an induced failure at each stage of the transaction.
**Exit:** I-2 has a named test that fails if any single stage forgets to journal.
**Depends:** P2-04, P2-05. **Blocks:** P3-04.
**Risk:** this is the highest-risk slice in the project. Mitigation: land the journal and the failure-injection harness first, then the command surface; if review stalls, split into P2-06a journal and P2-06b commands.
**Satisfies:** FR-7, TR-G-09 through TR-G-12, I-2, ADR-005.

### P2-07 Boundary scan and CI gate

**Intent:** Make the import rules mechanical instead of cultural.
**Owner:** `scripts/boundary-scan.mjs` and the `boundaries` CI job.
**Behavior:** fails on any renderer, DOM, or animation-engine import under `core/contract`, `core/domain`, `core/graph`, or `core/runtime`; fails on banned compatibility symbols; fails on any export from `index.ts` that is not on the allow list; fails on a second module claiming an owner name.
**Evidence:** the script has its own fixture suite in `test/unit/scripts/boundary-scan.test.ts` proving it fails on a planted violation and passes on the real tree.
**Exit:** The `boundaries` job is required. I-11 has both a mechanical gate and a headless runtime test.
**Depends:** P2-06. **Blocks:** P3-01.
**Risk:** a scanner that is green because its glob is wrong. Mitigation: the planted-violation fixture is mandatory, per ADR-008.
**Satisfies:** TR-T-05, TR-S-04, I-11.

### Phase 2 exit gate

Invalid graphs fail before mount. Rollback restores the exact observable snapshot. ObservationState identity survives commit. Ordering is canonical and tested. The boundary job is required and green.

## 7. Phase 3: runtime and publication

Goal: one project-wide runtime that turns committed graph snapshots into immutable, revisioned, batched patches.

### P3-01 PatchRegistry

**Intent:** One owner for patch identity, revisions, immutability, batching, and subscriber notification.
**Owner:** `core/runtime/patch-registry.ts`.
**Behavior:** a patch carries `nodeId`, `revision`, `values`, `sourceProgress`, `sourceRevisions`, `status`, and `diagnostics`; patches are deeply frozen; revisions are monotonic per node and advance only when a published value actually changes; subscribers are notified at batch close only, node subscribers before batch subscribers; unsubscribing during notification is safe.
**Evidence:** `test/unit/runtime/patch-registry.test.ts` proves deep-freeze rejection of mutation, revision suppression on an unchanged republish, notification ordering, and safe unsubscribe mid-notification.
**Exit:** I-7 and I-8 have named tests.
**Depends:** P1-01, P2-07. **Blocks:** P3-02.
**Satisfies:** FR-13, FR-14, TR-R-05 through TR-R-09, I-6, I-7, I-8.

### P3-02 GraphPublisher

**Intent:** Publication is one-way. The publisher accepts a validated snapshot and cannot change topology.
**Owner:** `core/runtime/graph-publisher.ts`.
**Behavior:** one tick opens one batch; dirty seeds come from playhead invalidation and from mutations since the last flush; traversal walks canonical order restricted to the downstream closure of the seeds; each dirty node composes at most once, memoized per batch, so a diamond composes its shared ancestor once; input-role edges contribute to the source object before local composition and output-role edges merge over the resulting patch after it; a flush triggered during a flush returns immediately rather than queueing.
**API delta:** internal only. The publisher is never exported from `@motion5/core`.
**Evidence:** `test/integration/flush-diamond.test.ts` counts composition calls; `test/unit/runtime/publisher-has-no-mutation.test.ts` asserts the behavioral absence of topology methods; `test/integration/flush-reentrancy.test.ts` proves a subscriber mutation lands on the next tick.
**Exit:** I-3, I-5, and I-6 have named tests.
**Depends:** P3-01, P2-04. **Blocks:** P3-03.
**Satisfies:** FR-11, TR-R-01 through TR-R-04, I-3, I-5, I-6, ADR-005.

### P3-03 Error, blocked, and retry semantics

**Intent:** A failure degrades one branch, never the pass.
**Owner:** `core/runtime/graph-publisher.ts` failure path plus `core/errors/`.
**Behavior:** a node whose composition throws publishes `error` status with its diagnostic; its entire downstream closure publishes `blocked`; unrelated branches continue; aggregated failures in one flush are reported as one aggregate error after the pass completes, never by aborting it; retry metadata is retained only for nodes whose publication failed, and retry scheduling keys off monotonic tick numbers.
**Evidence:** `test/integration/failure-closure.test.ts` proves blocked propagation across a fan-out, unaffected sibling publication, single aggregate error per flush, and retry metadata cleared on recovery.
**Exit:** I-9 has a named test.
**Depends:** P3-02. **Blocks:** P3-04.
**Satisfies:** FR-12, TR-R-10, TR-E-04, TR-E-05, I-9.

### P3-04 GraphRuntime

**Intent:** One project-wide runtime owning one binding, one observation state, one publisher, one patch registry, and one clock subscription.
**Owner:** `core/runtime/graph-runtime.ts`.
**Behavior:** the runtime is project-wide and never Motion-wide; exactly one upstream clock subscription exists regardless of how many motions mount; tick numbers stay monotonic across detach and reattach so retry scheduling never moves backwards.
**Evidence:** `test/integration/single-owner.test.ts` mounts several motions and asserts one clock subscription, one registry, and one state object; `test/integration/tick-monotonic.test.ts` covers detach and reattach.
**Exit:** I-13 has a named test.
**Depends:** P3-03, P2-06, P1-05. **Blocks:** P3-05.
**Satisfies:** FR-10, TR-R-11, TR-R-12, I-13.

### P3-05 ProjectRuntime

**Intent:** One project lifetime owner and the only mount path.
**Owner:** `core/runtime/project-runtime.ts`.
**Behavior:** owns the normalized project, membership, the instance registry, diagnostics, and exactly one `GraphRuntime`; load validates, qualifies, and builds the IR before anything mounts; a load that produces an error diagnostic never replaces an active project; unload is owner-first and releases every subscription, timeline, membership entry, and cached patch.
**Evidence:** `test/integration/project-lifecycle.test.ts` runs repeated load, mount, unmount, and dispose cycles and asserts no growth in retained subscriptions or cached patches.
**Exit:** Memory retention is flat across cycles.
**Depends:** P3-04, P1-04. **Blocks:** P3-06.
**Satisfies:** TR-L-05, TR-L-06, TR-PF-04.

### P3-06 Engine

**Intent:** A composition root that wires adapters to ports and does no graph work itself.
**Owner:** `core/engine.ts`.
**Behavior:** `Engine` constructs a `ProjectRuntime`, injects `Clock`, `Interpolator`, and `Scheduler`, and exposes the user-facing entrypoint; it asserts each injected port with the P0-04 assertion helpers; it has no method that touches the graph, the publisher, or the registry.
**API delta:** `Engine` and project loading become the primary public surface.
**Evidence:** `test/integration/engine-headless.test.ts` runs a complete two-motion project with fake ports only and imports no engine, DOM, or React.
**Exit:** The headless integration path is green with fakes.
**Depends:** P3-05. **Blocks:** P4-01.
**Satisfies:** TR-S-02, TR-T-01.

### P3-07 Budgets and benchmarks

**Intent:** Commit deterministic performance evidence before adapters make measurement noisy.
**Owner:** `performance/budgets.json` and `performance/graph-benchmark.mjs`.
**Behavior:** benchmarks cover graph traversal, dirty propagation, publication throughput, and memory retention on fixed synthetic graphs with fixed seeds; the benchmark uses the manual clock and never wall-clock timing for correctness; budgets are versioned and advisory during calibration with an expiry date recorded in session status.
**Evidence:** `npm run benchmark` produces a stable report artifact; a deliberately quadratic change fails the budget.
**Exit:** The `performance` job runs on every pull request, advisory only, with a named removal date.
**Depends:** P3-06. **Blocks:** P6-04.
**Risk:** advisory forever. Mitigation: the expiry date is a merge blocker for P6-04, per CI policy.
**Satisfies:** TR-PF-01 through TR-PF-05.

### Phase 3 exit gate

Two motions and a free track publish through one graph, one batch, one registry, and one clock subscription. Failures block downstream closures without aborting the pass. Budgets exist and are measured.

## 8. Phase 4: adapters

Goal: real capabilities behind ports, with core still headless.

### P4-01 Interpolator adapter

**Intent:** The first real `Interpolator` implementation, proving the port was not an unproven interface.
**Owner:** `core/adapters/interpolator/`.
**Behavior:** the adapter creates and kills timelines, reports duration, and reads and writes progress; it never subscribes to its own ticker, because the project owns the clock; killing is idempotent.
**Evidence:** the P0-04 contract harness runs unchanged against the real adapter.
**Exit:** The same suite passes for the fake and the real adapter with no adapter-specific branches.
**Depends:** P3-06. **Blocks:** P4-02.
**Satisfies:** FR-18, TR-P-07.

### P4-02 Browser clock and DOM adapter

**Intent:** Real ticking and real rendering, both outside core.
**Owner:** `core/adapters/browser-clock.ts` and `core/adapters/dom/`.
**Behavior:** the browser clock emits monotonic ticks from animation frames and produces exactly one subscription per project; the DOM adapter consumes frozen patches and applies them, and it is the only place that reads `perspective` and applies it once to a stage container.
**Evidence:** the clock passes the port contract harness; `test/integration/dom-patch-apply.test.ts` proves the adapter mutates no patch it receives.
**Exit:** No DOM import exists outside `core/adapters`.
**Depends:** P4-01, P1-06. **Blocks:** P4-03.
**Satisfies:** FR-4, TR-P-08, TR-A-05, ADR-012.

### P4-03 React project and playback hooks

**Intent:** React consumes the runtime without recreating composition.
**Owner:** `packages/react/src/`.
**Behavior:** hooks provide a project context and playback controls; no hook traverses the graph, calls a track composition method, or holds a runtime internal; unmount detaches through the owner path.
**Evidence:** `packages/react/test/hooks.test.tsx` covers mount, playback control, and unmount with no leaked subscription.
**Exit:** `@motion5/react` imports only the public core surface.
**Depends:** P4-02. **Blocks:** P4-04.
**Satisfies:** FR-18, TR-A-06.

### P4-04 Immutable patch subscription

**Intent:** A React subscription that is safe under concurrent rendering and cannot tear.
**Owner:** `packages/react/src/use-patch.ts`.
**Behavior:** subscription uses an external-store pattern with a stable snapshot per revision; a component receives the same frozen object for an unchanged revision; attempting to mutate a received patch throws.
**Evidence:** `packages/react/test/use-patch.test.tsx` covers snapshot stability across re-renders, no tearing across two consumers of one node, and mutation rejection.
**Exit:** The patch contract is immutable at the consumer boundary.
**Depends:** P4-03. **Blocks:** P4-05.
**Satisfies:** TR-A-07, I-7.

### P4-05 Integration fixtures and build job

**Intent:** Prove the adapters together, and start building what will later be packed.
**Owner:** `packages/core/test/integration/` and the `build` CI job.
**Behavior:** end-to-end fixtures drive an authored v5 project through real interpolation and a real clock into applied output; the build job compiles every package and runs public import smoke tests.
**Evidence:** `test/integration/end-to-end.test.ts` plus a green `build` job.
**Exit:** The `build` job is required.
**Depends:** P4-04. **Blocks:** P5-01.
**Satisfies:** TR-T-06, TR-S-05.

### Phase 4 exit gate

Core remains headless and renderer-free. Real adapters pass the fake-port contract suites unchanged. React consumes patches without recursive composition. The build job is required and green.

## 9. Phase 5: membership

Goal: cross-motion references and adopted free tracks travel the same path as any authored node, with no flags.

### P5-01 Cross-motion references

**Intent:** A track in one motion may observe a track in another, resolved through qualified ids at load.
**Owner:** `core/graph/references.ts`.
**Behavior:** reference resolution is total: a reference either resolves to a member or is recorded as a pending reference with a diagnostic; there is no third state and a pending reference never publishes; resolution order does not depend on motion mount order.
**Evidence:** `test/integration/cross-motion.test.ts` covers resolution, pending references, and mount-order independence.
**Exit:** No capability flag exists anywhere in the diff. I-14 has a named test.
**Depends:** P4-05, P2-01. **Blocks:** P5-02.
**Satisfies:** FR-19, TR-G-13, I-14.

### P5-02 Adopted free tracks

**Intent:** A free track created at runtime joins the project graph as an ordinary node with a different owner.
**Owner:** `core/runtime/project-runtime.ts` membership path.
**Behavior:** an adopted track is qualified `~/trackId` like any other free track; the project detaches it rather than destroying it; ownership is decided at adoption and never changes during teardown; adoption of a duplicate id is an error, not a replacement.
**Evidence:** `test/integration/adoption.test.ts` covers adopt, publish, detach, and the owner-destroys-borrower-detaches rule.
**Exit:** Free tracks and adopted tracks share one code path.
**Depends:** P5-01. **Blocks:** P5-03.
**Satisfies:** TR-L-07, ADR-013.

### P5-03 Unified diagnostics

**Intent:** One diagnostic surface for load-time and runtime problems, bounded so it cannot leak memory.
**Owner:** `core/runtime/diagnostics.ts`.
**Behavior:** runtime diagnostics accumulate on the project in a bounded ring buffer and also surface on the affected patch; the buffer drops oldest entries and reports how many were dropped; load and runtime diagnostics share the one `Diagnostic` shape.
**Evidence:** `test/integration/diagnostics.test.ts` covers buffer bounding, drop counting, and patch-level surfacing.
**Exit:** No second diagnostic shape exists.
**Depends:** P5-02. **Blocks:** P5-04.
**Satisfies:** FR-20, TR-E-06, TR-E-07.

### P5-04 Unmount and remount recovery

**Intent:** A downstream node survives an upstream disappearing and recovers when it returns.
**Owner:** `core/runtime/project-runtime.ts` and `core/graph/binding.ts`.
**Behavior:** unmounting an upstream node blocks its downstream closure rather than publishing stale values; remounting resolves the pending reference and republishes with a fresh revision; repeated unmount and remount cycles leave no residual subscription.
**Evidence:** `test/integration/remount.test.ts` runs many cycles and asserts flat retention plus correct blocked-then-ready transitions.
**Exit:** Membership churn is leak-free and observable.
**Depends:** P5-03. **Blocks:** P6-01.
**Satisfies:** TR-L-08, TR-R-13.

### Phase 5 exit gate

Authored, cross-motion, and adopted nodes share one graph path without flags. Ownership and detach-versus-destroy behavior are tested. Churn leaks nothing.

## 10. Phase 6: hardening

Goal: a shippable, packed, documented, budget-enforced v1 with nothing transitional left behind.

### P6-01 API surface and declarations

**Intent:** The public surface becomes an allow list that a machine checks.
**Owner:** `scripts/api-surface-check.mjs` and `packages/core/src/index.ts`.
**Behavior:** the checker compares generated declarations against a committed API report; adding an export without updating the report fails; `GraphRuntime`, `ProjectRuntime`, `GraphBinding`, `GraphPublisher`, `PatchRegistry`, `ObservationState`, and normalization helpers are never exported from the public entrypoint; `@motion5/core/internal` carries no stability promise.
**Evidence:** `test/unit/scripts/api-surface-check.test.ts` with a planted extra export.
**Exit:** The API report is committed and enforced.
**Depends:** P5-04. **Blocks:** P6-02.
**Satisfies:** FR-21, TR-S-01, TR-S-03.

### P6-02 Package consumer

**Intent:** Prove the documented imports work from the packed artifact, not just from source.
**Owner:** the `package` CI job.
**Behavior:** pack the repository, install the tarball into a clean consumer project, and import only documented exports in both ESM and TypeScript; deep wildcard imports must fail.
**Evidence:** a consumer fixture that fails when the export map regresses.
**Exit:** The `package` job is required.
**Depends:** P6-01. **Blocks:** P6-03.
**Satisfies:** FR-22, TR-S-05, TR-S-06.

### P6-03 Public documentation

**Intent:** Documentation describes implementation, not intention.
**Owner:** `docs/` and `README.md`.
**Behavior:** every intent label is removed or corrected; the architecture, TRD, schema, and API docs are checked against the shipped surface; the documentation map matches the files that exist.
**Evidence:** review checklist plus the API report diff from P6-01.
**Exit:** No document claims a gate or a behavior that does not exist.
**Depends:** P6-02. **Blocks:** P6-04.
**Satisfies:** TR-T-07.

### P6-04 Enforce benchmark budgets

**Intent:** Promote advisory budgets to required gates or delete them.
**Owner:** the `performance` CI job.
**Behavior:** budgets become required; any budget still advisory past its recorded expiry is deleted along with its benchmark rather than extended.
**Evidence:** a deliberate regression fails the required job.
**Exit:** No `continue-on-error` remains in the performance job.
**Depends:** P6-03, P3-07. **Blocks:** P6-05.
**Satisfies:** TR-PF-06.

### P6-05 Delete transitional code and documents

**Intent:** Remove everything that existed only to get here.
**Owner:** whoever opens the release pull request.
**Behavior:** delete migration-only helpers that the runtime no longer needs, temporary fixtures, calibration scaffolding, and any document describing deleted code; the deletion happens in the same change as the code it describes.
**Evidence:** the full required matrix stays green after deletion.
**Exit:** No migration-only code remains and no orphan document survives.
**Depends:** P6-04.
**Satisfies:** TR-T-08.

### Phase 6 exit gate

v1 release criteria are binary, CI is green, packed imports work, docs match implementation, and no migration-only code remains.

## 11. Dependency map

```text
P0-01 -> P0-02 -> P0-03 -> P0-04 -> P0-05 -> P0-06
                    |         |
                    v         v
         P1-01 -> P1-02 -> P1-03 -> P1-04 -> P1-05 -> P1-06
                              |                 |
                              v                 |
         P2-01 -> P2-02 -> P2-03 -> P2-04       |
                    |                  |        |
                    v                  v        |
                  P2-05 ----------> P2-06 -> P2-07
                                        |        |
                                        v        v
         P3-01 -> P3-02 -> P3-03 -> P3-04 -> P3-05 -> P3-06 -> P3-07
                                                                 |
                                                                 v
         P4-01 -> P4-02 -> P4-03 -> P4-04 -> P4-05
                                               |
                                               v
         P5-01 -> P5-02 -> P5-03 -> P5-04
                                      |
                                      v
         P6-01 -> P6-02 -> P6-03 -> P6-04 -> P6-05
```

P1 and P2 are ordered by ownership dependencies. P3 cannot begin publication until P2 provides stable graph state. P4 cannot add renderer adapters until the patch contract is immutable. P5 cannot add cross-motion membership until qualified identity is final. P6 deletes anything that existed only to get here.

Safe parallelism: P1-01 and P2-01 are independent. P1-02 and P1-06 are independent of the graph slices. Everything else is serial for a single maintainer.

## 12. Invariant ownership

Each architecture invariant is owned by exactly one slice. If an invariant has no slice, the plan is incomplete.

- **I-1** stable observation state identity: P2-05.
- **I-2** rollback restores an identical snapshot: P2-06.
- **I-3** publisher cannot mutate topology: P3-02.
- **I-4** Track never walks dependencies: P1-03.
- **I-5** one composition per dirty node per flush: P3-02.
- **I-6** subscribers see whole batches only: P3-01 and P3-02.
- **I-7** published patches are deeply frozen: P1-01, P3-01, and P4-04.
- **I-8** monotonic revisions that advance only on change: P3-01.
- **I-9** failure blocks the downstream closure: P3-03.
- **I-10** idempotent owner-first teardown: P1-04.
- **I-11** no renderer or engine import in core: P1-06 behaviorally, P2-07 mechanically.
- **I-12** canonical order is pure: P2-02 and P2-04.
- **I-13** one clock subscription per project: P3-04.
- **I-14** no capability or rollout flags: P5-01.
- **I-15** warnings never block, errors never pass: P2-03.

## 13. CI gate rollout

- **quality** required since P0-01: format check, typecheck, unit tests, migration tests.
- **integration** required from P0-05: golden serialization, schema and migration integration, free-track acceptance, warning and error semantics, cycle rejection.
- **boundaries** required from P2-07.
- **performance** advisory from P3-07, required from P6-04.
- **build** required from P4-05.
- **package** required from P6-02.

A job is not live until its owning slice merges. Until then [CI-WORKFLOW.md](./CI-WORKFLOW.md) describes a target, not a check.

## 14. Risk register

- **P2-06 transaction complexity.** Highest risk in the project. Mitigation: land the undo journal and a failure-injection harness before the command surface; split into 06a and 06b if review stalls.
- **Deep freeze cost.** Freezing every published value can dominate a frame. Mitigation: freeze once at publication, measure in P3-07, and revisit only with benchmark evidence.
- **Advisory benchmarks that never graduate.** Mitigation: expiry dates recorded in session status and enforced by P6-04.
- **Boundary scanner false green.** Mitigation: planted-violation fixtures are mandatory for every mechanical gate.
- **React concurrency tearing.** Mitigation: external-store subscription with per-revision snapshot stability, proven by a two-consumer test in P4-04.
- **Scope creep back toward the predecessor's shape.** Mitigation: any flag, alias, facade, or second owner requires a superseding ADR in the same pull request.

## 15. Definition of done for every slice

A slice is done only when behavior, API, types, docs, tests, and boundaries agree; the nearest test and the full relevant matrix are green; the diff was reviewed with whitespace hidden; the pull request names its failing-first test, its new owner, and the deletion or boundary it establishes; and [SESSION-STATUS.md](./SESSION-STATUS.md) was updated in the same change.

## 16. v1 release checklist

Every line is binary. No line is satisfied by prose.

- Schema v5 loads and v4 is rejected at the runtime boundary.
- Migration is pure, idempotent, and deterministic, with fresh fixtures.
- Every architecture invariant maps to a named executable test that fails when the invariant is broken.
- Rollback leaves every observable surface byte-identical.
- One project owns one graph runtime, publisher, registry, and clock subscription.
- Composition failure blocks the downstream closure without aborting the pass.
- Published patches are deeply frozen, revisioned, deduplicated, and batched.
- Load, mount, unmount, and dispose cycles show flat retention.
- Core imports no animation engine, DOM API, or React.
- Real adapters pass the fake-port contract suites unchanged.
- The documented public API passes a packed-tarball consumer test.
- Benchmarks run against committed budgets as a required job.
- Documentation matches implementation and no transitional code remains.
- No capability flags, compatibility facades, or copied predecessor files shipped.
- No phase required a second revert.
