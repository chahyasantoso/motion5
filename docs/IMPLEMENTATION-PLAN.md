# motion5 implementation plan

**Status:** Execution plan, not a claim that the listed runtime exists.
**Reality:** [SESSION-STATUS.md](./SESSION-STATUS.md) is the only document that reports what is merged.
**Contract:** [PRD.md](./PRD.md) says what to build, [TRD.md](./TRD.md) says what it must satisfy, [ARCHITECTURE.md](./ARCHITECTURE.md) says who owns what.

A phase is complete only when every slice in it is merged and its exit gate is green in CI. "Written" is not "landed". "Landed on a branch" is not "on `main`".

## 1. How to read this plan

Every slice below uses the same eight fields. If a slice cannot fill all eight, it is not ready to start.

1. **Goal:** the single invariant or capability the slice establishes.
2. **Owner introduced:** the one object that gains a responsibility. If the answer is "two objects", recut the slice.
3. **Files:** the semantic files created or changed. Fewer than twenty.
4. **Public surface:** what `@motion5/core` exports after the slice, or `none`.
5. **Invariants:** the architecture invariant ids this slice makes executable.
6. **Tests:** named test files and the contract each proves. The failing test is written first.
7. **Exit:** the binary condition that closes the slice.
8. **Depends on / Risk:** ordering constraint and the way this slice usually goes wrong.

Status legend: `done` merged on `main`, `review` open on a branch, `todo` not started.

## 2. Delivery rules

- One pull request establishes one meaningful invariant.
- Target fewer than twenty semantic files. Stop and recut beyond twenty-five commits or after a second revert.
- Behavior, docs, types, tests, and exports land together. Formatting lands separately.
- No copied tests, fixtures, demos, or source from motionpath. Behavioral intent may be recreated against the motion5 contract.
- No flags, aliases, facades, or duplicate owners. See [ADR-003](./DECISIONS.md).
- Every pull request names the failing test, the new owner, and the deletion or boundary it establishes.
- A slice that grows a second owner is split before it is reviewed, not after.
- No CI job is described as live until its job has run on a pull request.

## 3. Slice sizing heuristics

- A slice that touches `graph/` and `runtime/` in the same diff is usually two slices.
- A slice that adds a public export and a runtime behavior is usually two slices: behavior first, export second.
- A slice with no failing test at the start is either a refactor or a mistake. Label it a refactor and keep behavior byte-identical.
- A slice whose tests all pass on the first run has probably tested the implementation instead of the contract.

## 4. Phase 0: baseline

**Theme:** make the contract, the ports, and the evidence format real before any runtime exists.

### P0-01 Charter (`done`)

- **Goal:** a repository that can hold evidence: docs, workflows, formatter, TypeScript, manifest, placeholder test.
- **Owner introduced:** none. Toolchain only.
- **Files:** `docs/*`, `.github/workflows/quality.yml`, `.prettierrc.json`, `.prettierignore`, `tsconfig.json`, `package.json`.
- **Public surface:** none.
- **Invariants:** none.
- **Tests:** a placeholder unit test that proves the runner executes.
- **Exit:** `npm run check` passes locally and in CI.
- **Depends on / Risk:** nothing. Risk is writing docs that describe a runtime as if it exists.

### P0-02 Reproducible install (`done`)

- **Goal:** identical dependency trees locally and in CI.
- **Owner introduced:** none.
- **Files:** `package-lock.json`, `.github/workflows/quality.yml`.
- **Public surface:** none.
- **Invariants:** none.
- **Tests:** CI itself. The job fails if the lockfile drifts.
- **Exit:** CI uses `npm ci`, the npm cache is enabled, and Node 24 is documented and pinned.
- **Depends on / Risk:** P0-01. Risk is leaving an install fallback in place after the lockfile lands.

### P0-03 Contract package (`done`)

- **Goal:** schema v5 exists as types and constants before anything can consume it.
- **Owner introduced:** the contract layer. It owns the authored vocabulary and nothing else.
- **Files:** `packages/core/src/contract/v5.ts`, `packages/core/src/contract/validate-v5.ts`, `packages/core/src/index.ts`.
- **Public surface:** authored contract constants, diagnostic types, schema types, validator result shape.
- **Invariants:** groundwork for I-15.
- **Tests:** `test/unit/validate-v5.test.ts` proves v4 input is rejected with a migration diagnostic and that warnings never reject.
- **Exit:** core typechecks, v4 is rejected, v5 validates, no engine or DOM import exists anywhere in `src/`.
- **Depends on / Risk:** P0-01. Risk is letting the validator quietly normalize instead of only validating.

### P0-04 Ports and fakes (`done`)

- **Goal:** the core can be exercised headlessly before a real adapter exists.
- **Owner introduced:** the ports layer. Ports are depended upon and never depend.
- **Files:** `packages/core/src/ports/clock.ts`, `interpolator.ts`, `scheduler.ts`, `fakes.ts`.
- **Public surface:** the manual clock and port assertion helpers.
- **Invariants:** groundwork for I-11 and I-13.
- **Tests:** `test/contract/ports.test.ts` is one suite that every fake and every future real adapter must pass.
- **Exit:** the contract suite is shared, not duplicated per implementation.
- **Depends on / Risk:** P0-03. Risk is a fake that is more permissive than the real adapter, which makes the suite meaningless.

### P0-05 Migration and golden evidence (`review`)

- **Goal:** a deterministic serialization format for evidence, plus a pure v4 to v5 migration outside the runtime.
- **Owner introduced:** the migration module. It is not reachable from the loader. See [ADR-011](./DECISIONS.md).
- **Files:** `packages/core/src/contract/migrate-v4-to-v5.ts`, `packages/core/src/contract/golden.ts`, `test/fixtures/*`, `test/migration/*`, `test/integration/*`, `.github/workflows` integration job.
- **Public surface:** the migration function and the golden serializer.
- **Invariants:** I-15 partially.
- **Tests:** rename, qualification, immutability of the v4 input, idempotence, id collisions, diagnostics, stable key ordering, round-trip parse, free-track acceptance, perspective warning, cycle rejection before mount.
- **Exit:** migration output is byte-deterministic, the v4 input object is never mutated, and the integration job is required.
- **Depends on / Risk:** P0-03. Risk is fixtures that assert implementation shape instead of observable result.

### P0-06 Errors and internal entrypoint (`todo`)

- **Goal:** one error taxonomy and one unadvertised internal entrypoint, established before there is anything to hide behind them.
- **Owner introduced:** `errors/`. It owns error construction and diagnostic attachment.
- **Files:** `packages/core/src/errors/index.ts`, `packages/core/src/internal.ts`, `packages/core/package.json` export map.
- **Public surface:** error classes only. `internal.ts` is not advertised and carries no stability promise.
- **Invariants:** groundwork for I-2 and I-15.
- **Tests:** `test/unit/errors.test.ts` proves every thrown error carries `ruleId`-bearing diagnostics and that deep wildcard imports are blocked by the export map.
- **Exit:** every future layer throws through this module. No layer invents its own error shape later.
- **Depends on / Risk:** P0-05. Risk is skipping this and discovering three error shapes in Phase 3.

**Phase 0 exit gate:** core typechecks and tests headlessly. v4 is rejected. v5 validates. Migration output is deterministic. No engine, DOM, or React import exists in `src/`. Quality and integration jobs are required and green.

## 5. Phase 1: leaf domain

**Theme:** Track becomes a leaf and Motion becomes the only composite, before any graph exists to blur the line. See [ADR-004](./DECISIONS.md).

### P1-01 Immutable values (`todo`)

- **Goal:** one value snapshot representation that cannot be mutated by a consumer.
- **Owner introduced:** `domain/values.ts`. It owns freezing, structural equality, and the numeric equality policy.
- **Files:** `packages/core/src/domain/values.ts`.
- **Public surface:** none yet.
- **Invariants:** groundwork for I-7 and I-8.
- **Tests:** `test/unit/values.test.ts` proves deep freeze, that a mutation attempt throws in strict mode, that equality is structural, and that no snapshot aliases its input object.
- **Exit:** every later layer uses this module. Nothing calls `Object.freeze` directly again.
- **Depends on / Risk:** P0-06. Risk is a shallow freeze that passes a top-level test and leaks nested arrays.

### P1-02 Plugin registry (`todo`)

- **Goal:** local plugin composition is registered, ordered, and pure.
- **Owner introduced:** `domain/plugins.ts`. It owns registration, duplicate rejection, and resolution order.
- **Files:** `packages/core/src/domain/plugins.ts`.
- **Public surface:** plugin registration.
- **Invariants:** none directly.
- **Tests:** `test/unit/plugins.test.ts` proves deterministic resolution order, duplicate id rejection with a diagnostic, and that a plugin cannot observe another node.
- **Exit:** plugin composition is a pure function of its inputs. No plugin receives a Track, a Motion, or the graph.
- **Depends on / Risk:** P1-01. Risk is handing plugins a mutable context object that becomes a back door into runtime state.

### P1-03 Track leaf (`todo`)

- **Goal:** Track owns playhead, progress, interpolation inputs, local plugin composition, and renderer-neutral snapshots. Nothing else.
- **Owner introduced:** `domain/track.ts`.
- **Files:** `packages/core/src/domain/track.ts`.
- **Public surface:** `Track`.
- **Invariants:** **I-4**.
- **Tests:** `test/unit/track-leaf.test.ts` proves Track exposes no children, no parent, no group host, and no method that reads a graph dependency. Composition runs against the fake interpolator only.
- **Exit:** Track's public shape has no traversal method and no composite behavior. The deletion this slice establishes is Track child topology, permanently.
- **Depends on / Risk:** P1-01, P1-02, P0-04. Risk is adding one convenience accessor "for tests" that recreates a second composite API.

### P1-04 Lifecycle (`todo`)

- **Goal:** `dispose` and `destroy` are idempotent, owner-first, and reentrancy-safe.
- **Owner introduced:** `domain/lifecycle.ts`. It owns the guard flag and the teardown order contract.
- **Files:** `packages/core/src/domain/lifecycle.ts`, `domain/track.ts`.
- **Public surface:** none.
- **Invariants:** **I-10**.
- **Tests:** `test/unit/lifecycle.test.ts` proves double dispose is a no-op, that calling dispose from inside a teardown callback does not recurse, and that the guard is set before any notification.
- **Exit:** no object implements its own teardown guard afterwards.
- **Depends on / Risk:** P1-03. Risk is setting the guard after notification, which passes a simple test and fails under reentrancy.

### P1-05 Motion scheduling and children (`todo`)

- **Goal:** Motion owns child membership, hierarchy, stagger, layout, reflow, timeline construction, playback, and child teardown.
- **Owner introduced:** `domain/motion.ts`.
- **Files:** `packages/core/src/domain/motion.ts`.
- **Public surface:** `Motion`.
- **Invariants:** supports I-4 and I-10.
- **Tests:** `test/unit/motion-composite.test.ts` proves playback, stagger offsets, and child teardown against the manual clock and fake scheduler, with no wall-clock read.
- **Exit:** Motion is the only composite. Playback and teardown are proven with fake ports only.
- **Depends on / Risk:** P1-03, P1-04. Risk is Motion reaching into Track internals instead of driving its playhead through a narrow method.

### P1-06 Triggers (`todo`)

- **Goal:** `time`, `manual`, and `scroll` trigger delegates with a renderer-neutral core.
- **Owner introduced:** `domain/triggers.ts`. Motion delegates to it and remains the scheduler.
- **Files:** `packages/core/src/domain/triggers.ts`.
- **Public surface:** triggers.
- **Invariants:** supports I-11.
- **Tests:** `test/unit/triggers.test.ts` proves time and manual triggers headlessly, and proves the scroll trigger is a port-shaped delegate with no DOM import in core.
- **Exit:** scroll exists as a contract in core and as an implementation only in an adapter.
- **Depends on / Risk:** P1-05. Risk is importing a DOM type "just for typing" and breaking I-11.

**Phase 1 exit gate:** Track has no children and no graph traversal. Motion owns all composite behavior. Fake-port tests cover playback, stagger, triggers, and teardown. Core still imports no engine, DOM, or React.

## 6. Phase 2: graph kernel

**Theme:** identity, validation, ordering, and transactional mutation. Nothing publishes yet.

### P2-01 Qualified ids (`todo`)

- **Goal:** qualification happens exactly once, at load, and is total.
- **Owner introduced:** `graph/ids.ts`. It owns qualification, parsing, reserved characters, and the sort key.
- **Files:** `packages/core/src/graph/ids.ts`.
- **Public surface:** none.
- **Invariants:** supports I-12.
- **Tests:** `test/unit/qualified-ids.test.ts` proves `motionId/trackId` and `~/trackId` forms, rejection of `/` in authored ids, rejection of `~` as a motion id, round-trip parsing, and a stable sort key.
- **Exit:** nothing downstream of load can construct or observe an unqualified id.
- **Depends on / Risk:** P0-03. Risk is qualifying twice in two code paths, which produces `a/b/c` and a very confusing diagnostic.

### P2-02 Graph IR (`todo`)

- **Goal:** an immutable intermediate representation of nodes, edges, diagnostics, and canonical order.
- **Owner introduced:** `graph/ir.ts`.
- **Files:** `packages/core/src/graph/ir.ts`, `graph/normalize.ts`.
- **Public surface:** none.
- **Invariants:** supports I-2 and I-12.
- **Tests:** `test/unit/graph-ir.test.ts` proves the IR is frozen, that free tracks and motion tracks produce the same node model, and that building the IR twice from the same input is byte-identical under the golden serializer.
- **Exit:** free tracks are not a second node type. See [ADR-013](./DECISIONS.md).
- **Depends on / Risk:** P2-01. Risk is storing runtime objects in the IR, which turns an immutable snapshot into a live handle.

### P2-03 Graph validation (`todo`)

- **Goal:** every rejection has a rule id, a path, a severity, and the involved ids.
- **Owner introduced:** `graph/validate.ts`. The contract validator checks shape, this one checks the graph.
- **Files:** `packages/core/src/graph/validate.ts`.
- **Public surface:** none.
- **Invariants:** **I-15**.
- **Tests:** `test/unit/graph-validate.test.ts` covers the full rule catalog in [TRD.md](./TRD.md) section 6: unknown source, duplicate edge, self-reference, invalid role, missing `target` on input, present `target` on output, reserved characters, invalid perspective, missing perspective with 3D content, unused free track.
- **Exit:** every rule in the TRD catalog has a named test. A warning never blocks a load and an error never permits one.
- **Depends on / Risk:** P2-02. Risk is inventing rule ids inline instead of reading them from one catalog.

### P2-04 Cycle detection and canonical order (`todo`)

- **Goal:** ordering is a pure function of qualified ids and authored order, and cycles are rejected before mount.
- **Owner introduced:** `graph/order.ts`.
- **Files:** `packages/core/src/graph/order.ts`.
- **Public surface:** none.
- **Invariants:** **I-12**.
- **Tests:** `test/unit/graph-order.test.ts` proves the tie-break rule, proves order is unchanged when input edge arrays are shuffled, proves order never depends on `Map` insertion order derived from runtime events, and proves a cycle diagnostic names every participating id in canonical order.
- **Exit:** shuffling authored edge order changes nothing observable except the diagnostics that mention authored index.
- **Depends on / Risk:** P2-03. Risk is a topological sort that is correct but not deterministic, which is the same as being wrong here.

### P2-05 Stable ObservationState (`todo`)

- **Goal:** one long-lived live-state object per project, mutated in place.
- **Owner introduced:** `graph/observation-state.ts`.
- **Files:** `packages/core/src/graph/observation-state.ts`.
- **Public surface:** none. Never exported.
- **Invariants:** **I-1**.
- **Tests:** `test/integration/observation-identity.test.ts` proves the same object reference survives every successful and failed mutation.
- **Exit:** no code path rebuilds live state after a commit. See [ADR-006](./DECISIONS.md).
- **Depends on / Risk:** P2-02. Risk is a "just rebuild it, it is simpler" shortcut that silently invalidates subscriber references.

### P2-06 Transactional GraphBinding (`todo`)

- **Goal:** one topology mutation coordinator with a real undo journal.
- **Owner introduced:** `graph/binding.ts`.
- **Files:** `packages/core/src/graph/binding.ts`.
- **Public surface:** none. Never exported.
- **Invariants:** **I-2**, supports I-1.
- **Tests:** `test/integration/rollback.test.ts` snapshots graph IR, live edges, publisher indexes, lifecycle subscriptions, ownership, and published patches before a mutation, forces a failure at each stage of the transaction, and asserts byte-identical state afterwards.
- **Exit:** rollback is proven at every stage boundary, not only at validation. There is no repair step and no partial application.
- **Depends on / Risk:** P2-04, P2-05. Risk is a journal that records intent instead of the exact prior value, which cannot restore identity.

### P2-07 Boundary scan and CI gate (`todo`)

- **Goal:** mechanical enforcement of the import boundary.
- **Owner introduced:** `scripts/boundary-scan.mjs`.
- **Files:** `scripts/boundary-scan.mjs`, `.github/workflows` boundaries job, `package.json` script.
- **Public surface:** none.
- **Invariants:** **I-11**, **I-14**.
- **Tests:** the scan itself has unit tests proving it fails on a planted violation. A headless runtime test proves the same boundary behaviorally. See [ADR-008](./DECISIONS.md): the scan complements the test, it does not replace it.
- **Exit:** the boundaries job is required and rejects renderer imports in core, banned compatibility symbols, duplicate runtime owners, and forbidden public exports.
- **Depends on / Risk:** P2-06. Risk is treating a green grep as behavioral evidence.

**Phase 2 exit gate:** invalid graphs fail before mount. Rollback restores the exact observable snapshot. ObservationState identity survives commit. Ordering is canonical and tested under shuffled input. The boundaries job is live.

## 7. Phase 3: runtime and publication

**Theme:** one project, one graph, one batch, one registry, one clock subscription.

### P3-01 PatchRegistry (`todo`)

- **Goal:** patch identity, revisions, immutability, batching, and subscriber notification.
- **Owner introduced:** `runtime/patch-registry.ts`.
- **Files:** `packages/core/src/runtime/patch-registry.ts`.
- **Public surface:** patch subscription types.
- **Invariants:** **I-7**, **I-8**.
- **Tests:** `test/unit/patch-registry.test.ts` attempts deep mutation of a published patch and asserts it throws and that a later reader is unaffected. It proves revisions advance only when a published value actually changes, including when only `status` changes.
- **Exit:** deduplication covers values, progress, source revisions, and status.
- **Depends on / Risk:** P1-01. Risk is comparing by reference and bumping revisions on every tick.

### P3-02 Publication-only GraphPublisher (`todo`)

- **Goal:** traversal and publication of a validated snapshot, with no ability to change topology.
- **Owner introduced:** `runtime/graph-publisher.ts`.
- **Files:** `packages/core/src/runtime/graph-publisher.ts`.
- **Public surface:** none. Never exported.
- **Invariants:** **I-3**, **I-5**.
- **Tests:** `test/unit/publisher-contract.test.ts` proves through behavior, not comments, that no method changes topology. `test/unit/diamond-memoization.test.ts` counts composition calls in a diamond and asserts the shared ancestor composes exactly once per batch.
- **Exit:** the publisher accepts a committed snapshot and nothing else. See [ADR-005](./DECISIONS.md).
- **Depends on / Risk:** P2-06, P3-01. Risk is a forwarding convenience method that is still a second owner.

### P3-03 Error, blocked, and retry semantics (`todo`)

- **Goal:** a failure blocks its downstream closure without aborting unrelated branches.
- **Owner introduced:** the publisher's status model plus the project diagnostics ring buffer.
- **Files:** `runtime/graph-publisher.ts`, `runtime/diagnostics.ts`.
- **Public surface:** patch `status` and `diagnostics`.
- **Invariants:** **I-9**.
- **Tests:** `test/integration/blocked-closure.test.ts` proves the failing node publishes `error`, its entire downstream closure publishes `blocked`, an unrelated branch still publishes `ready`, and aggregated failures surface as one aggregate error after the pass completes.
- **Exit:** retry metadata is retained only for nodes whose publication failed, and the diagnostics buffer is bounded.
- **Depends on / Risk:** P3-02. Risk is throwing out of the traversal, which turns one bad node into a dead frame.

### P3-04 Project-wide GraphRuntime (`todo`)

- **Goal:** one binding, one observation state, one publisher, one patch registry, one clock subscription, and one flush loop.
- **Owner introduced:** `runtime/graph-runtime.ts`.
- **Files:** `packages/core/src/runtime/graph-runtime.ts`.
- **Public surface:** none. Never exported.
- **Invariants:** **I-6**, **I-13**, supports I-5.
- **Tests:** `test/integration/flush-batch.test.ts` proves no subscriber observes a partial flush and that node subscribers are notified before batch subscribers. `test/integration/single-clock.test.ts` mounts several motions and asserts exactly one upstream subscription. `test/integration/reentrancy.test.ts` proves a flush triggered during a flush returns immediately and that a mutating subscriber schedules work for the next tick.
- **Exit:** GraphRuntime is project-wide. There is no per-Motion runtime object anywhere.
- **Depends on / Risk:** P3-03. Risk is queueing reentrant flushes instead of refusing them, which reintroduces ordering nondeterminism.

### P3-05 ProjectRuntime (`todo`)

- **Goal:** project lifetime, the normalized project, membership, the instance registry, diagnostics, and exactly one GraphRuntime.
- **Owner introduced:** `runtime/project-runtime.ts`.
- **Files:** `packages/core/src/runtime/project-runtime.ts`.
- **Public surface:** project loading.
- **Invariants:** **I-10**, supports I-1 and I-13.
- **Tests:** `test/integration/project-lifecycle.test.ts` runs repeated load, mount, unmount, and dispose cycles and asserts subscriptions, timelines, graph membership, and cached patches are all released.
- **Exit:** ProjectRuntime is the only mount path.
- **Depends on / Risk:** P3-04. Risk is a second mount path added for tests.

### P3-06 Engine (`todo`)

- **Goal:** the composition root and user-facing entrypoint.
- **Owner introduced:** `runtime/engine.ts`. It performs no graph work itself.
- **Files:** `packages/core/src/runtime/engine.ts`, `packages/core/src/index.ts`.
- **Public surface:** `Engine`, project loading, `Motion`, `Track`, plugin registration, triggers, patch subscription, the manual clock, port assertion helpers, contract constants.
- **Invariants:** supports I-11.
- **Tests:** `test/integration/engine-headless.test.ts` builds a full project with fake ports only and asserts no engine, DOM, or React module is loaded.
- **Exit:** two motions and a free track publish through one graph, one batch, one registry, and one clock subscription.
- **Depends on / Risk:** P3-05. Risk is Engine growing a graph method because it is the convenient place to put one.

### P3-07 Budgets and benchmarks (`todo`)

- **Goal:** deterministic performance evidence with committed budgets.
- **Owner introduced:** `performance/`.
- **Files:** `performance/budgets.json`, `performance/graph-benchmark.mjs`, `.github/workflows` performance job.
- **Public surface:** none.
- **Invariants:** none.
- **Tests:** the benchmark is deterministic: fixed graph shapes, manual clock, no wall-clock dependence in the workload itself.
- **Exit:** budgets cover graph traversal, dirty propagation, publication, and memory retention. The job is advisory during calibration, with an expiry date recorded in [SESSION-STATUS.md](./SESSION-STATUS.md), and is promoted or deleted by that date.
- **Depends on / Risk:** P3-06. Risk is an advisory job that stays advisory forever. See [CI-WORKFLOW.md](./CI-WORKFLOW.md).

**Phase 3 exit gate:** two motions and a free track publish through one graph, one batch, one registry, and one clock subscription. Failure blocks downstream without aborting siblings. Repeated mount and dispose cycles leak nothing.

## 8. Phase 4: adapters

**Theme:** real implementations arrive behind the ports, and core stays headless.

### P4-01 Interpolator adapter (`todo`)

- **Goal:** the first real `Interpolator`, backed by GSAP.
- **Owner introduced:** `adapters/gsap-interpolator.ts`.
- **Files:** `packages/core/src/adapters/gsap-interpolator.ts`.
- **Public surface:** the adapter factory, exported from an adapter path, not from the core root.
- **Invariants:** **I-11** stays green.
- **Tests:** the existing port contract suite runs unchanged against the real adapter. No new assertions are written for the fake.
- **Exit:** the same suite passes for fake and real. A port with no passing real adapter is an unproven interface.
- **Depends on / Risk:** P3-06. Risk is the contract suite quietly growing adapter-specific branches.

### P4-02 Browser clock and DOM (`todo`)

- **Goal:** a real clock and a renderer that consumes patches.
- **Owner introduced:** `adapters/browser-clock.ts`, `adapters/dom.ts`.
- **Files:** those two, plus `performance` notes if the frame budget moves.
- **Public surface:** adapter factories.
- **Invariants:** **I-13** under a real clock. **ADR-012**: the DOM adapter is the only thing that reads `perspective` and applies it once to a stage container.
- **Tests:** `test/contract/clock.test.ts` runs against the browser clock. `test/integration/dom-perspective.test.ts` proves perspective is applied by the adapter and never appears in a patch.
- **Exit:** tick numbers stay monotonic across detach and reattach.
- **Depends on / Risk:** P4-01. Risk is core gaining a DOM type import through the adapter's public types.

### P4-03 React project and playback hooks (`todo`)

- **Goal:** React consumes the runtime without touching the graph.
- **Owner introduced:** `packages/react`.
- **Files:** `packages/react/src/*`, `packages/react/package.json`.
- **Public surface:** project and playback hooks only.
- **Invariants:** **I-11** for core, which must not depend on React.
- **Tests:** `packages/react/test/hooks.test.tsx` proves hooks mount and unmount cleanly and that nothing depends on adapters except the composition root.
- **Exit:** React depends on core. Core does not know React exists.
- **Depends on / Risk:** P4-02. Risk is a hook that composes recursively instead of subscribing.

### P4-04 Immutable patch subscription (`todo`)

- **Goal:** React reads patches, never graph objects.
- **Owner introduced:** the React patch subscription hook.
- **Files:** `packages/react/src/use-patch.ts`.
- **Public surface:** the patch hooks.
- **Invariants:** **I-7** across the package boundary.
- **Tests:** `packages/react/test/patch-immutability.test.tsx` proves a component cannot mutate a received patch and that no render path exposes a `Track`, a `Motion`, or a graph object.
- **Exit:** the subscriber contract exposes patches and batches only.
- **Depends on / Risk:** P4-03. Risk is exposing the runtime object "temporarily" for a demo that this repository does not have. See [ADR-009](./DECISIONS.md).

### P4-05 Integration fixtures and build job (`todo`)

- **Goal:** end-to-end evidence with real adapters, plus a live build job.
- **Owner introduced:** none.
- **Files:** `test/integration/*`, `.github/workflows` build job.
- **Public surface:** none.
- **Invariants:** none new.
- **Tests:** golden patch batches produced through real adapters, serialized with the P0-05 serializer.
- **Exit:** the build job builds packages and runs public import smoke tests, and is required.
- **Depends on / Risk:** P4-04. Risk is goldens that encode adapter timing instead of contract behavior.

**Phase 4 exit gate:** core remains headless and renderer-free. Real adapters pass the fake-port contract suites unchanged. React consumes patches without recursive composition.

## 9. Phase 5: membership

**Theme:** authored, cross-motion, and adopted nodes travel one path, with no flags. See [ADR-003](./DECISIONS.md) and [ADR-013](./DECISIONS.md).

### P5-01 Cross-motion references (`todo`)

- **Goal:** a track in one motion observes a track in another through the same graph path as any other edge.
- **Owner introduced:** none. This slice proves the existing owners already handle it.
- **Files:** `graph/normalize.ts`, `runtime/project-runtime.ts`.
- **Public surface:** none.
- **Invariants:** **I-14**.
- **Tests:** `test/integration/cross-motion.test.ts` proves ordering, publication, and teardown are identical to a same-motion edge, and that no code branches on a capability flag.
- **Exit:** the diff adds tests and removes special-casing. If it adds a branch, the earlier phases were wrong.
- **Depends on / Risk:** P4-05. Risk is discovering a hidden same-motion assumption in the ordering key.

### P5-02 Adopted free tracks (`todo`)

- **Goal:** a free track adopted at runtime is owned by its adopter and detached, not destroyed, by the project.
- **Owner introduced:** the membership rules on `ProjectRuntime`.
- **Files:** `runtime/project-runtime.ts`.
- **Public surface:** adopt and detach.
- **Invariants:** **I-10**, **I-14**.
- **Tests:** `test/integration/adoption.test.ts` proves a project-authored free track is destroyed with the project, an adopted track is only detached, and ownership is decided at construction and never changes during teardown.
- **Exit:** ownership is explicit and tested in both directions.
- **Depends on / Risk:** P5-01. Risk is a borrowed runtime being destroyed by its borrower.

### P5-03 Unified diagnostics (`todo`)

- **Goal:** unresolved, duplicate, self-referential, role-invalid, and incompatible references diagnose identically regardless of membership kind.
- **Owner introduced:** none. Consolidation only.
- **Files:** `graph/validate.ts`, `runtime/diagnostics.ts`.
- **Public surface:** none.
- **Invariants:** **I-15**.
- **Tests:** `test/integration/diagnostics-parity.test.ts` runs the same rule catalog across authored, cross-motion, and adopted nodes and asserts identical rule ids and severities.
- **Exit:** reference resolution is total. A reference is resolved or pending with a diagnostic, and a pending reference never publishes.
- **Depends on / Risk:** P5-02. Risk is a third state sneaking in as `undefined`.

### P5-04 Unmount and remount recovery (`todo`)

- **Goal:** an upstream node can disappear and return while downstream nodes stay mounted.
- **Owner introduced:** none.
- **Files:** `runtime/graph-runtime.ts`, `runtime/project-runtime.ts`.
- **Public surface:** none.
- **Invariants:** **I-9**, **I-13**.
- **Tests:** `test/integration/remount.test.ts` proves downstream nodes publish `blocked` while the upstream is absent, recover to `ready` on remount, and that tick numbers never move backwards across the cycle.
- **Exit:** retry scheduling is safe across detach and reattach.
- **Depends on / Risk:** P5-03. Risk is resetting the tick counter on reattach, which breaks retry ordering.

**Phase 5 exit gate:** authored, cross-motion, and adopted nodes share one graph path without flags. Ownership and detach versus destroy behavior are tested.

## 10. Phase 6: hardening

**Theme:** make the surface small, the gates required, and the transitional code gone.

### P6-01 API surface and declarations (`todo`)

- **Goal:** the export map is an allow list and the check is mechanical.
- **Owner introduced:** `scripts/api-surface-check.mjs`.
- **Files:** that script, `packages/core/src/index.ts`, `internal.ts`, export maps.
- **Public surface:** frozen and documented.
- **Invariants:** supports I-11.
- **Tests:** the check fails on a planted extra export and on a deep wildcard import. `GraphRuntime`, `ProjectRuntime`, `GraphBinding`, `GraphPublisher`, `PatchRegistry`, `ObservationState`, and normalization helpers are unreachable except through `@motion5/core/internal`.
- **Exit:** the api job is required.
- **Depends on / Risk:** P5-04. Risk is a type-only export that leaks an internal shape.

### P6-02 Package consumer (`todo`)

- **Goal:** the documented API works from the packed artifact, not only from source.
- **Owner introduced:** none.
- **Files:** `.github/workflows` package job, a clean consumer fixture.
- **Public surface:** verified.
- **Invariants:** none.
- **Tests:** pack the repository, install the tarball into a clean consumer, import only documented exports, run a smoke scene headlessly.
- **Exit:** the package job is required.
- **Depends on / Risk:** P6-01. Risk is passing locally because of workspace resolution.

### P6-03 Public docs (`todo`)

- **Goal:** documentation matches implementation, in the present tense, honestly.
- **Owner introduced:** none.
- **Files:** `README.md`, `docs/*`.
- **Public surface:** documented.
- **Invariants:** none.
- **Tests:** every documented import appears in the package consumer test.
- **Exit:** no document describes an unimplemented behavior in the present tense without a status marker.
- **Depends on / Risk:** P6-02. Risk is doc drift being discovered by users instead of CI.

### P6-04 Enforce benchmark budgets (`todo`)

- **Goal:** performance becomes a required gate.
- **Owner introduced:** none.
- **Files:** `performance/budgets.json`, `.github/workflows` performance job.
- **Public surface:** none.
- **Invariants:** none.
- **Tests:** the job fails on a planted regression beyond budget.
- **Exit:** the performance job is required, not advisory, and any remaining advisory check has been deleted.
- **Depends on / Risk:** P3-07. Risk is calibrating budgets against a noisy runner and setting them so loose they prove nothing.

### P6-05 Delete transitional code and documents (`todo`)

- **Goal:** nothing that existed only to get here survives v1.
- **Owner introduced:** none. This slice only deletes.
- **Files:** migration-only helpers, transitional docs, calibration notes.
- **Public surface:** unchanged. If deletion changes the surface, the allow list was wrong.
- **Invariants:** none.
- **Tests:** the full matrix stays green after deletion.
- **Exit:** no migration-only code remains in shipped packages. Migration tooling that users still need moves to a documented, separately tested entrypoint.
- **Depends on / Risk:** P6-04. Risk is deleting something a user depends on because it was never in the allow list but was reachable anyway.

**Phase 6 exit gate:** v1 release criteria are binary, CI is green, packed imports work, docs match implementation, and no migration-only code remains.

## 11. Dependency map

```text
P0-01 -> P0-02 -> P0-03 -> P0-04 -> P0-05 -> P0-06
                              |
                              v
        P1-01 -> P1-02 -> P1-03 -> P1-04 -> P1-05 -> P1-06
                              |
                              v
        P2-01 -> P2-02 -> P2-03 -> P2-04 -> P2-05 -> P2-06 -> P2-07
                                                        |
                                                        v
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

Hard ordering constraints, stated as reasons rather than arrows:

1. Phase 3 cannot publish until Phase 2 provides a committed, stable graph snapshot.
2. Phase 4 cannot add renderer adapters until the patch contract is immutable and revisioned.
3. Phase 5 cannot add cross-motion membership until qualified identity is final, because ordering keys would change under it.
4. Phase 6 cannot freeze the API until adapters and membership have stopped adding exports.
5. The boundary scan (P2-07) lands before the first adapter (P4-01), so the first renderer import is caught by a live gate rather than a review.

## 12. Risk register

- **Second owner creeps in through convenience.** Mitigation: every pull request names its owner. A forwarding method counts as a second owner.
- **Nondeterministic ordering passes local tests.** Mitigation: P2-04 shuffles input arrays in tests as a matter of course.
- **Rollback is only tested at validation failure.** Mitigation: P2-06 injects failure at every transaction stage.
- **A fake port is more permissive than the real one.** Mitigation: one shared contract suite, no adapter-specific branches, real adapter added in P4-01 before the port is considered proven.
- **Advisory CI becomes permanent.** Mitigation: expiry date recorded in session status, and P6-04 promotes or deletes.
- **Docs drift ahead of the runtime.** Mitigation: present-tense claims require a status marker, and P6-03 ties documented imports to the package consumer test.
- **A revert loop.** Mitigation: after a second revert on a slice, stop and recut it rather than fixing forward.

## 13. v1 release checklist

Every line is binary and mirrored by a CI job.

1. Schema v5 loads, and v4 is rejected with a migration diagnostic.
2. Migration output is deterministic and never mutates its input.
3. Every architecture invariant I-1 through I-15 has a named executable test that fails when the invariant is broken.
4. Rollback restores graph IR, live edges, publisher indexes, subscriptions, ownership, and patches byte-identically.
5. One tick produces one batch, and each dirty node composes at most once.
6. Published patches are deeply frozen and revisions are monotonic per node.
7. A composition failure blocks its downstream closure and leaves unrelated branches publishing.
8. Repeated load, mount, unmount, and dispose cycles release everything they allocated.
9. Clock, Interpolator, and Scheduler each have a fake and a real adapter passing one shared contract suite.
10. Core imports no animation engine, no DOM, and no React, enforced by a live boundaries job and a headless test.
11. No shipped code branches on a capability or rollout flag.
12. The documented public API passes a packed-tarball consumer test.
13. Deterministic benchmarks pass committed budgets in a required job.
14. No migration-only code or transitional document remains.
15. No phase required a second revert.

## 14. Definition of done for every slice

A slice is done only when behavior, API, types, docs, tests, and boundaries agree; the named failing test now passes and fails again when the change is reverted; the nearest test and the full relevant matrix are green; the diff was reviewed with whitespace hidden; and [SESSION-STATUS.md](./SESSION-STATUS.md) was updated in the same pull request.
