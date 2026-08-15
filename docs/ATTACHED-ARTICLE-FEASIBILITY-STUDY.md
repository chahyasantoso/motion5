# Attached architecture article: detailed feasibility study

**Status:** assessment / intent. This report does not claim that any recommendation has landed. Current implementation reality remains governed by `docs/SESSION-STATUS.md`.

- **Repository:** `chahyasantoso/motion5`
- **Branch reviewed:** `phase5/membership-base`
- **Reviewed source ref:** `d33113c4b58d10917c99002fe85ae957613d4802`
- **Article sections covered:** trigger simplification, graph stability/dynamics, performance/scheduler, multi-track invalidation, Phase 5 status
- **Primary brief:** `docs/IMPLEMENTOR-BRIEF-MOTIONPATH-TO-MOTION5.md`

## Executive summary

The attached article is a useful architecture direction, but it combines three different things: observations that are true today, proposed refactors, and claims that the repository is already complete. The feasibility result is:

| Area | Verdict | Recommendation |
|---|---|---|
| Trigger simplification | Feasible and mostly correct | Keep separate `Clock` and `TriggerPort` semantics; move platform drivers outward; retain Motion's Scheduler gate and core validation |
| GraphIR / ObservationState split | Correct and strong | Preserve the split and identity-preserving transaction model |
| Dynamic adoption | Correct diagnosis, incomplete solution | Fix composition ownership, public reachability, atomicity, validation, cache invalidation, and teardown before optimizing |
| Incremental `GraphIndex` | Plausible, not yet justified | Benchmark first; do not introduce a second graph truth or mutable owner |
| GSAP one-tween optimization | Feasible, unproven | Add equivalence tests and benchmark before replacing the current segment construction |
| Remove Scheduler from Motion | **Not feasible without a replacement** | Reject; unsubscribe cannot cancel already queued writes |
| Multi-track seed fix | Correct minimum direction | Seed all IDs in one batch, remove duplicate first-track writes, test independently from stagger |
| Phase 5 completion claim | Valid only for the named slice | Do not treat it as proof that every article capability is production-ready |

The highest-risk mistake in the article is the proposed Scheduler removal. The highest-risk implementation gap is dynamic adoption through `Engine.load`: the graph mutation succeeds, but the adopted node has no compiled `Track` in the Engine-owned closure and publishes composition errors forever.

---

## 1. Trigger architecture simplification

### 1.1 Duplicate Manual, Scroll, and Time subclasses

**Article claim:** all three trigger subclasses validate progress and emit `setProgress`, so the hierarchy is premature.

**Repository evidence:** `packages/core/src/domain/triggers.ts` contains `ManualTrigger`, `ScrollTrigger`, and `TimeTrigger`. Each `handle()` method does the same three operations:

1. reject missing progress;
2. call `assertProgress()`;
3. emit `{ setProgress: progress }`.

The only difference is the error-message label. `packages/core/test/unit/domain/triggers.test.ts` already tests the three types through a table-driven case, confirming that behavior is intentionally identical.

**Feasibility: high. Risk: low.**

A mechanical first step can replace the subclasses with one internal implementation while retaining the type tag and factory. That is safe and keeps the public behavior unchanged. It should be a separate refactor from the port migration so failures remain attributable.

**Recommendation:** collapse the behavior first, then migrate the abstraction. Do not preserve three classes merely because the schema has three labels.

### 1.2 The Time Trigger is conceptually redundant

**Article claim:** `time` is not a real trigger because `Motion` already advances autonomously from `Clock`; the clock is the time trigger.

**Repository evidence:** `Motion.#onTick()` computes:

```ts
next = position + delta / duration
```

while `Motion.#onTrigger()` assigns externally supplied absolute progress. These are different semantics:

- Clock: accumulate based on elapsed time.
- Trigger: assign normalized position supplied by an external driver.

The model is sound. The Engine path is not: `engine.ts` constructs every Motion with `listenToClock: false`, then calls `motion.play()` for every trigger type. No owner advances time-driven motions through the Engine path.

**Feasibility: high after an ownership fix. Risk: high if done first.**

A project still needs one clock subscription, per the brief. The fix must not create one clock subscription per Motion. A viable design is for the project-level runtime to advance time-driven Motion owners from the existing project clock, or for a project-level coordinator to dispatch clock ticks to those motions. The implementation must preserve invariant I-13: exactly one upstream clock subscription per project.

**Required evidence:** an Engine integration test that loads a `time` motion, ticks the injected clock, flushes the Scheduler, and asserts a patch progresses.

### 1.3 TriggerPort as a three-line observable

**Article claim:** replace `attach/detach` and command objects with:

```ts
interface TriggerPort {
  subscribe(onProgress: (progress: number) => void): () => void;
}
```

**Repository evidence:** `ports/clock.ts` already uses subscribe-returning cleanup. The current TriggerDelegate is implementation-independent and has no domain state beyond subscription and validation.

**Feasibility: high. Risk: medium.**

This removes `#triggerAttached`, the attach-twice/detach-no-op asymmetry, and a dead command shape. A primitive number is immutable, so removing `Object.freeze(command)` does not weaken value immutability at that seam.

Keep validation at the Motion/core boundary. The article suggests moving `assertProgress` into each adapter, but that would let an untrusted third-party adapter feed `NaN`, infinity, or an out-of-range value into Track state. Adapter-side validation may be an optimization, never the sole trust boundary.

### 1.4 Adapter ownership

**Article claim:** browser scroll listeners, RAF, Lenis, GSAP ScrollTrigger, and manual drivers belong in adapters.

**Repository evidence:** the brief explicitly states that trigger adapters provide signals only, never publish patches, create a clock, or bypass `ProjectRuntime`. The current `adapters/` directory has a browser clock, DOM patch adapter, and interpolator, but no trigger driver.

**Feasibility: high. Risk: medium.**

The article's responsibility split is correct:

- Contract: schema labels and adapter metadata.
- Adapter/composition root: platform event source and normalized progress.
- TriggerPort: source subscription contract.
- Motion: scheduling, validation, assignment, invalidation.
- ProjectRuntime: graph publication and lifecycle.

One proposed shape is wrong: `Engine.load()` must not import an adapter factory from core. Architecture says adapters depend inward on ports and external engines; core must not depend outward on DOM or GSAP. The host/composition root should inject a TriggerPort or a factory capability through an inward-facing port.

### 1.5 Keep Clock and Trigger separate

**Article claim:** Clock and Trigger are structurally alike but must remain separately named.

**Verdict: strongly agree.**

If scroll is represented as a Clock, absolute scroll positions must be converted into synthetic deltas. That breaks on reverse scrolling and jumps. More importantly, it erases the difference between accumulation and assignment. A shared implementation helper may be reasonable; a merged semantic interface is not.

### 1.6 The boolean / optional port model

**Article claim:** `time` means no external TriggerPort; `scroll` and `manual` mean an external progress source exists. Therefore domain needs only `trigger?: TriggerPort`.

**Feasibility: high in domain, blocked in Engine.**

`MotionOptions` already has both `trigger?` and `listenToClock?`, so the proposed shape is close. The missing piece is a working project-level owner for time playback and a host injection path for external drivers.

The schema's `TriggerType` should remain in `contract/v5.ts` for authored intent and validation. It can disappear from Motion internals without disappearing from the public authored schema.

### Trigger work plan

1. Add Engine-path time playback test and fix one-clock ownership.
2. Decide whether public callers use `signal({ type, progress })` or direct `seek(progress)` for manual control.
3. Export or replace the currently unexported `TriggerSignal` type used by public `ProjectHandle.signal`.
4. Introduce `ports/trigger.ts` with subscribe cleanup.
5. Keep Motion's Scheduler cancellation set and core progress validation.
6. Add adapter contract tests for scroll and manual sources.

---

## 2. Graph stability and dynamics

### 2.1 GraphIR versus ObservationState

**Article claim:** GraphIR is immutable structural truth; ObservationState is live mutable state with an undo journal.

**Verdict: verified and should be preserved.**

`graph/ir.ts` builds frozen nodes, edges, lookup, diagnostics, and canonical order. `graph/observation-state.ts` maintains live node and edge indexes in place. `graph/binding.ts` validates a full candidate before mutation, applies a reversible delta, runs hooks, swaps the immutable snapshot last, and commits the journal only after success.

This satisfies the key identity invariant: subscribers and runtime code holding the live ObservationState continue to reference the same object across successful and failed replacements.

### 2.2 Transactional rollback

**Article claim:** an edge or node mutation that fails halfway rolls back to the previous state.

**Verdict: intended and substantially implemented.**

The delta ordering is correct:

- remove obsolete edges;
- remove obsolete nodes;
- add new nodes;
- add new edges.

On failure, `ObservationState.rollback()` replays the journal in reverse and rethrows the original error from `GraphBinding.replace()`.

**Remaining feasibility concern:** rollback itself has no independent failure containment. If an undo precondition throws during replay, the journal is cleared in `finally`, leaving partially restored live state. The normal delta path makes this unlikely, but the transaction guarantee deserves a rollback integrity assertion or a test that proves failed undo is impossible under all GraphBinding mutations.

### 2.3 Dynamic adoption closure roadblock

**Article claim:** `ProjectRuntime.adopt()` exists but is not truly dynamic because Engine closures cannot see adopted tracks.

**Verdict: verified, with precise wording.**

The `tracks` Map is not frozen, but it is private to one `Engine.load()` invocation. The Engine's `compose` closure calls `tracks.get(node.id)!.compose(...)`. `ProjectRuntime.adopt()` changes the graph but does not compile/register a Track in that private Map. On the first flush of an adopted node, the non-null assertion is false; GraphPublisher catches the exception and publishes an error patch.

This is not a process crash, but it is worse operationally: adoption appears successful while the node remains unusable.

**Feasibility: medium. Risk: high.**

Choose one owner before coding:

- Engine owns a track compiler and exposes an adoption operation through the public composition root; or
- ProjectRuntime receives a renderer-neutral compose/track factory capability for adopted definitions.

Do not let ProjectRuntime reach into Engine's closure. Do not duplicate compilation logic.

### 2.4 Public reachability

**Article omission:** the dynamic graph is not publicly reachable. `ProjectHandle` exposes mount, unmount, seek, signal, subscribe, and dispose, but not adopt or destroyAdopted. ProjectRuntime is intentionally not exported.

**Feasibility: decision required.**

If runtime adoption is a v1 capability, add a deliberate public API with owner semantics and tests. If it is an internal recovery scaffold, document it as non-shipped and stop treating it as a complete product feature. A transactional internal implementation without a public or composition-root caller is not a usable runtime feature.

### 2.5 GraphIndex proposal

**Article claim:** add GraphIndex for incremental ordering and dependents, avoiding full O(n) rebuilds.

**Feasibility: plausible, not yet justified. Risk: high architectural.**

Current replacement rebuilds and validates the entire candidate graph, then diffs it. This is simple and makes transaction boundaries explicit. An incremental index could improve repeated adoption, but it introduces:

- another mutable graph representation;
- another owner of node ranks and dependents;
- rollback requirements for rank and adjacency changes;
- invalidation/cache synchronization;
- a new class of stale-index bugs.

The publisher currently rebuilds its dependent map per flush, so there may be two performance problems, not one. Measure separately before designing GraphIndex.

**Acceptance conditions before implementation:** benchmark realistic project sizes and adoption rates; prove no second graph truth; define owner and rollback protocol; demonstrate identical canonical order and affected closures; add mutation and rollback tests.

### 2.6 Dynamic graph findings not covered by the article

#### Publisher-node cache retention

`GraphRuntime.#publisherNodes` is a strong `Map<GraphNode, PublisherNode>`. Every `buildGraphIR()` creates new GraphNode identities, so replacement misses the cache and retains all old entries until runtime disposal. This causes repeated compose closure creation and memory retention.

**Feasibility:** easy to fix mechanically, but choose the owner deliberately. Keying by stable node ID plus graph revision, or clearing/rebuilding on successful replacement, is safer than adding another cache layer. A WeakMap removes retention but does not prevent repeated re-resolution.

#### PatchRegistry teardown

`GraphRuntime.dispose()` unsubscribes from the clock and clears its own sets, but `PatchRegistry` has no dispose/clear lifecycle. Retained patches, node listeners, and batch listeners survive runtime disposal.

**Feasibility:** high. Add an owner-first registry teardown operation and test that post-dispose notifications and retained state are gone. Preserve the separate remount behavior where `remove(nodeId)` intentionally retains subscriber identity.

#### Projection drift

`ObservationState.normalizeEdge()` drops `projection`, and `edgeKey()` excludes it. A replacement that changes only an input projection can leave live inspection state and edge identity stale even though GraphIR has changed. GraphPublisher reads the IR, so rendering may still be correct while inspection is wrong.

**Feasibility:** medium. Either include projection in edge identity with canonical serialization, or explicitly narrow the live snapshot model. The safer default is to preserve projection in normalized edges and define deterministic identity.

#### Membership drift

`GraphRuntime.#members` is independent from GraphBinding replacement. A lower-level replacement can remove an attached node while leaving its ID in membership. Later flushes silently ignore the stale seed.

**Feasibility:** medium. GraphRuntime should own a replacement wrapper that reconciles membership, retained patches, and publisher caches. Do not expose raw binding replacement as the only route for live mutation.

#### Adoption atomicity

`ProjectRuntime.adopt()` replaces the graph, then records ownership, then mounts. If mount fails, graph state and adoption bookkeeping can disagree.

**Feasibility:** medium. Define the transaction boundary across graph, ownership map, and membership. Either validate/mount before commit where safe, or add compensation that restores all three on failure.

#### Adopted keyframe validation

Authored load calls `validateV5()`, but adoption reaches `buildGraphIR()` without the full keyframe validation pass. Runtime-created tracks can therefore bypass finite/monotonic/unique stop validation.

**Feasibility:** high. Reuse the same validation owner for authored and adopted track definitions without running full project validation against an incomplete project.

### Dynamic graph implementation order

1. Decide whether adoption is shipped.
2. Fix the Engine composition ownership seam.
3. Add public/composition-root tests if shipped.
4. Fix registry teardown and publisher cache retention.
5. Reconcile membership and adoption atomicity.
6. Preserve projection in live edge state.
7. Add shared track/keyframe validation.
8. Benchmark before considering GraphIndex.

---

## 3. Performance and Scheduler refinement

### 3.1 GSAP object count

**Article claim:** current GSAP construction creates one tween per property per segment; native percentage keyframes could use one tween per track.

**Verdict: current cost verified, optimization feasible but unproven.**

`adapters/interpolator/gsap.ts` loops over every compiled property and every adjacent stop, calling `timeline.to()` per segment. Four properties and three segments can produce twelve timeline entries.

The proposed one-tween construction must preserve:

- proxy-owned mutable adapter state;
- `Track` reads from that state, not from GSAP internals;
- authored stop positions and duration;
- per-stop easing and default ease behavior;
- sparse properties and initial values;
- zero-duration timelines;
- `progress()` getter/setter behavior;
- `kill()` lifecycle.

GSAP's native percentage keyframe syntax may not map cleanly to the current `GsapTimelineLike` test port or to independent easing per property/segment. The optimization is viable only after equivalence tests compare state at representative progress values and lifecycle tests verify kill/dispose.

**Recommendation:** benchmark construction time, memory, and progress update time before and after. Do not optimize from object-count intuition alone.

### 3.2 Scheduler as a write gate

**Article claim:** Scheduler separates progress computation from application and makes pause safe.

**Verdict: verified.**

`Motion.#onTick()` and `Motion.#onTrigger()` enqueue jobs. `pause()` cancels every pending handle, clears the set, unsubscribes from the clock, detaches the trigger, and transitions lifecycle state. Existing tests cover pause/remount without duplicate queued work.

This is not incidental plumbing. It is the ownership boundary that prevents stale progress writes from reaching Track and ProjectRuntime after pause.

### 3.3 Removing Scheduler from Motion

**Article claim:** after TriggerPort returns unsubscribe, Scheduler can be removed from Motion.

**Verdict: reject.**

Unsubscribe only stops future source callbacks. It cannot cancel a job already scheduled:

1. trigger emits progress;
2. Motion schedules a write;
3. caller pauses before Scheduler flush;
4. source unsubscribe succeeds;
5. queued write still runs unless Motion cancels it.

Removing Scheduler would also make trigger and clock callbacks mutate Track and invalidate the graph synchronously, increasing reentrancy risk and violating the brief requirement that manual, scroll, and time signals pass through Scheduler.

Scheduler must remain in both places, with different responsibilities:

- **Motion:** cancelable progress writes and pause safety.
- **GraphRuntime:** deferred drain after a reentrant flush request.

There is a separate documentation contradiction: `GraphRuntime` currently queues deferred flushes, while `docs/ARCHITECTURE.md` says reentrancy is refused rather than queued. Resolve that before changing behavior.

---

## 4. Multi-track invalidation

### 4.1 Current bug

**Article claim:** `engine.ts` invalidates only `ids[0]`.

**Verdict: verified.**

The Motion updates every Track's local progress, but the Engine invalidation callback calls:

```ts
const first = ids[0];
if (first) runtime.seek(first, progress);
```

GraphPublisher computes the affected closure from the seed set. Independent sibling tracks are not reached from the first track and therefore do not publish patches. Their internal state changes while their rendered output remains stale.

### 4.2 Proposed fix

**Article claim:** pass the complete `ids` array to `runtime.invalidate()`.

**Verdict: correct minimum direction, not a complete patch.**

`GraphRuntime.invalidate()` accepts multiple seeds, so all Motion track IDs should be seeded in one graph batch. However, `ProjectRuntime.seek()` currently calls the single-node `setProgress` callback before invalidating, so blindly calling a new multi-seed API can double-write the first track.

A proper implementation should:

- add a project-level multi-seed seek/invalidate path;
- avoid writing the same Track twice;
- preserve one batch and deterministic seed order;
- invalidate downstream observation dependents exactly once;
- test independent siblings and cross-track dependencies.

### 4.3 Stagger is separate

The article connects multi-track invalidation and stagger, but seeding all IDs does not implement stagger. `Motion.schedule()` returns offsets, yet `#setProgress()` applies one identical progress to every Track. The current `stagger` value is computed and discarded.

Choose one:

- implement per-track offset semantics and define clamping/end behavior; or
- remove `stagger` from the active authored contract until it has an owner.

Do not mark stagger fixed merely because all IDs are seeded.

### 4.4 Required tests

- Two independent Motion tracks both receive ready patches in one batch.
- A dependent track is composed once when multiple seeds reach it.
- First-track progress is written once, not twice.
- Staggered tracks produce the documented offsets, or the schema rejects/ignores stagger explicitly.
- A paused Motion cannot publish queued work after a trigger update.

---

## 5. Phase 5 completion and diagnostics

### 5.1 Phase 5 status

`docs/SESSION-STATUS.md` says Phase 5 is complete and records exact-head CI evidence for P5-01 through P5-04. The tree contains the specific named features:

- one classifier in `graph/references.ts`;
- bounded diagnostics in `runtime/diagnostics.ts`;
- runtime adoption through `ProjectRuntime.adopt()`;
- retained-patch eviction on unmount/remount behavior.

**Verdict: valid for the named Phase 5 slice, too broad as a blanket completion claim.**

The article uses Phase 5 completion to imply that dynamic graph adoption, trigger integration, multi-track output, and all runtime behavior are complete. The repository does not support that interpretation. The Engine adoption closure bug, multi-track invalidation bug, Scheduler concerns, and teardown/cache findings remain.

There is also a stale-doc conflict: `docs/README.md` says Phase 4 is reopened while `SESSION-STATUS.md` says Phase 5 is complete. The status file is explicitly authoritative, so the README should be updated or labeled historical.

### 5.2 Cross-motion reference classifier

`graph/references.ts` correctly owns pending-versus-resolved classification. It does not fabricate values, and unknown graph sources are rejected earlier by GraphIR construction. This is a good single-owner design.

**Feasibility/status: complete for its stated responsibility.**

### 5.3 Bounded diagnostics

`runtime/diagnostics.ts` uses a capacity-limited buffer, defaults to 500 entries, and tracks `droppedCount`. Runtime diagnostics remain inline on patches/batches while the buffer is inspection-only.

**Feasibility/status: complete for diagnostic history.**

It does not make the entire runtime leak-free. PatchRegistry listeners/patches and the GraphRuntime publisher-node cache are separate retained structures and need separate lifecycle fixes.

### 5.4 Runtime adoption

`ProjectRuntime.adopt()` is transactional at the GraphBinding level and uses qualified free-track IDs with owner-gated destruction.

**Feasibility/status: partially complete.**

The graph mutation machinery exists, but the Engine composition seam and public reachability are missing. Calling it fully active is misleading until an Engine-path test proves an adopted track composes and publishes.

---

## 6. Consolidated feasibility matrix

| Topic | Current evidence | Feasibility | Priority | Required proof |
|---|---|---:|---:|---|
| Collapse duplicate triggers | Three identical handlers | High | P2 | Existing trigger tests stay green |
| Replace with TriggerPort | Clock precedent exists | High | P1 | Port lifecycle + adapter tests |
| Time mode through Engine | Currently disabled by `listenToClock: false` | High after ownership fix | P0 | Engine integration tick test |
| Adapter-owned drivers | Brief already requires it | High | P1 | Boundary scan + driver contract tests |
| Keep Clock/Trigger separate | Accumulate vs assign | High | P1 | Semantic tests for both paths |
| GraphIR/ObservationState split | Implemented and coherent | High | Preserve | Transaction and identity tests |
| Dynamic adoption compose seam | Current closure cannot see adopted Track | Medium | P0 | Adopt via Engine, ready patch |
| Public adoption API | Currently absent | Decision | P0 | Explicit v1/internal decision |
| GraphIndex | Could reduce rebuild cost | Medium | P3 | Benchmark + rollback proof |
| GSAP one-tween path | Current per-segment loop verified | Medium | P3 | Equivalence + performance budget |
| Remove Motion Scheduler | Breaks stale-write cancellation | Low / reject | N/A | No implementation; retain current gate |
| Multi-track invalidation | First seed only | High | P0 | Same-batch sibling patch test |
| Stagger | Offset calculation unused | Medium | P1 | Semantics test or contract removal |
| Phase 5 status | Named slice has CI evidence | High for slice, not blanket | Docs | Narrow wording and reconcile README |
| Diagnostic boundedness | Buffer is capped | High for diagnostics only | Done | Retention tests for separate registries |

---

## 7. Recommended delivery sequence

### P0: correctness before refactor

1. Add Engine-path time playback test and fix one-clock ownership.
2. Add Engine-path adoption test and introduce the Track/compose ownership seam.
3. Add multi-track same-batch publication test and fix duplicate first-track writes.
4. Add stale scheduled write test, preserving Scheduler in Motion.
5. Decide whether adoption is public v1 or internal-only.

### P1: boundary and lifecycle cleanup

6. Add registry teardown and publisher cache lifecycle handling.
7. Reconcile graph membership during replacement and make adoption bookkeeping atomic.
8. Preserve projection in live edges and apply keyframe validation to adopted tracks.
9. Refactor trigger implementation into a host-injected `TriggerPort`.
10. Resolve the GraphRuntime reentrancy documentation contradiction.

### P2/P3: optimization and scale

11. Benchmark GSAP one-tween construction with equivalence fixtures.
12. Benchmark graph replacement and publisher dependent-map construction.
13. Only if measurements justify it, design GraphIndex under GraphBinding/GraphRuntime ownership with rollback semantics.
14. Update stale documentation and narrow Phase 5 completion language.

## Final recommendation

Adopt the article's **direction**, not its unqualified completion claims. Keep the strong parts: immutable GraphIR, identity-stable ObservationState, transactional GraphBinding, single-owner reference classification, bounded diagnostic history, adapter-owned platform drivers, and separate Clock/Trigger semantics.

Reject or defer the risky parts: removing Scheduler from Motion, importing adapter factories into core Engine, moving validation entirely into adapters, and adding GraphIndex before measurement. Fix the Engine-path time/adoption seams and multi-track invalidation first. Those are correctness bugs; trigger class count and GSAP object count are optimization and clarity work.
