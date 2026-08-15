# Attached architecture article: repo-grounded assessment

**Status:** assessment / intent. This document does not change implementation status. `docs/SESSION-STATUS.md` remains the source of truth for landed behavior.

- Reviewed branch: `phase5/membership-base`
- Reviewed tree at: `d33113c4b58d10917c99002fe85ae957613d4802`
- Compared against: attached article, `docs/IMPLEMENTOR-BRIEF-MOTIONPATH-TO-MOTION5.md`, `docs/ARCHITECTURE.md`, `docs/SESSION-STATUS.md`

## Executive verdict

The attached article is directionally strong, but it mixes **verified implementation facts**, **proposals**, and **completion claims** without marking the boundaries. The trigger simplification is mostly right; the dynamic-graph diagnosis is right but understates the runtime leaks; the scheduler-removal proposal is wrong; the multi-track fix is correct but has not landed; and the Phase 5 completion claim is only true for the documented slice, not for every capability the article assumes is production-ready.

The most important correction: **do not remove the Scheduler from Motion.** The unsubscribe function stops future source callbacks, but it cannot cancel progress jobs already queued by a trigger or clock callback. `Motion` currently uses Scheduler as the pause-safe write gate, and removing it reintroduces writes after pause plus synchronous reentrancy into `ProjectRuntime`.

---

## 1. Trigger architecture simplification

### Claim: the three trigger subclasses are identical

**Verdict: verified.** `ManualTrigger`, `ScrollTrigger`, and `TimeTrigger` all validate an optional progress value, enforce `[0, 1]`, and emit `{ setProgress }`. Their only difference is the error-message label. The current hierarchy is premature abstraction.

**Recommendation:** collapse the behavior first, then move the port. Do not mix the mechanical deduplication with the larger ownership/API migration in one untestable change.

### Claim: time is not really a trigger

**Verdict: conceptually correct, operationally incomplete.** `Motion.#onTick` already owns autonomous accumulation from `ClockTick.delta`, while trigger input assigns an absolute progress. Those are different semantics even though both produce progress.

The article misses a critical tree fact: direct `Motion` tests prove clock playback, but `Engine.load()` constructs every Motion with `listenToClock: false`. It also calls `motion.play()` for every trigger type. Therefore an authored `time` motion loaded through `Engine` has no effective driver and does not advance. Through the real public path, time is currently neither a working trigger nor a working clock-driven mode.

**Required before simplifying the API:** add an Engine-path test for `trigger.type === "time"`, then give the one project clock an owner that advances time motions without creating a second clock subscription.

### Claim: TriggerPort should be a tiny observable source

**Verdict: feasible and preferred.** `subscribe(listener): () => void` matches the existing Clock lifecycle and removes the attach/detach asymmetry plus `#triggerAttached` bookkeeping.

Keep the interfaces separately named. `Clock` emits elapsed-time events and Motion accumulates; `TriggerPort` emits externally owned absolute progress and Motion assigns. Same shape does not mean same semantic contract.

Keep progress validation at the Motion/core trust boundary, not only in adapters. A third-party adapter must not be able to feed `NaN` or `1.5` directly into Track state.

### Claim: adapters should own platform listeners

**Verdict: verified as the correct boundary.** The brief already says trigger adapters provide signals only and never publish patches, create clocks, or bypass `ProjectRuntime`.

One correction to the article's sketch: `Engine` must not import an adapter factory from core. That reverses the dependency direction and risks the boundary scan. The composition root or host should inject the appropriate TriggerPort, just as Clock, Interpolator, and Scheduler are injected today.

### Trigger section conclusion

Adopt the direction, but sequence it as:

1. Fix the Engine-path time-driver behavior.
2. Add a public, typed decision for `TriggerSignal` versus direct `seek(progress)`.
3. Move to `ports/trigger.ts` and subscribe-returning cleanup.
4. Add adapter contract tests and retain the Scheduler hop in Motion.

---

## 2. Graph layer: stability and dynamics

### Claim: GraphIR is immutable structure and ObservationState is live mutable state

**Verdict: verified.** `buildGraphIR()` returns frozen nodes, edges, ordering, and lookup structures. `ObservationState` maintains live node/edge indexes in place. `GraphBinding` applies a candidate delta through an undo journal and swaps the immutable graph only after the mutation stages succeed.

This is a sound design. The identity-preserving state plus rollback journal is one of the strongest parts of the implementation.

### Claim: adoption is transactional but not truly dynamic because Engine closures cannot see adopted tracks

**Verdict: verified, with one wording correction.** The `tracks` Map is not frozen. It is private to `Engine.load` and captured by the compose and set-progress closures. `ProjectRuntime.adopt()` adds a graph node but does not compile or register a corresponding `Track` in that private Map. The first flush therefore reaches `tracks.get(adoptedId)!.compose(...)` with `undefined`; GraphPublisher contains the exception as an error patch, so adoption appears to succeed but never becomes usable.

The dynamic graph path is also unreachable from the public API: `ProjectHandle` exposes no `adopt()` or `destroyAdopted()` method, while `ProjectRuntime` is intentionally not public. Decide whether adoption is v1 or speculative before expanding it.

### Claim: GraphIndex should provide incremental ordering and dependents

**Verdict: plausible future optimization, not an immediate fix.** The current full rebuild and diff is O(project size) per replacement. Sequential adoption can become O(N²), and the publisher reconstructs its dependent map during each flush. However, an incremental GraphIndex would add another long-lived mutable owner alongside GraphBinding and ObservationState, directly threatening the one-owner invariant.

Do not build GraphIndex until the current correctness seams are fixed and a benchmark demonstrates the need. If built, it must be owned by GraphBinding or GraphRuntime, never become a second source of graph truth, and participate in rollback/commit semantics.

### Dynamic graph findings omitted by the article

- **Publisher-node cache leak:** `GraphRuntime.#publisherNodes` is a strong `Map<GraphNode, PublisherNode>`, but every `buildGraphIR()` creates new GraphNode identities. Every replacement misses the cache, re-resolves every compose closure, and retains old graph objects until project disposal.
- **PatchRegistry teardown leak:** `GraphRuntime.dispose()` does not dispose or clear `PatchRegistry`; patches, node listeners, and batch listeners remain retained. This is especially bad for adopt/destroy or repeated project lifecycles.
- **Projection drift:** `ObservationState.normalizeEdge()` drops `projection`, and `edgeKey()` excludes it. A projection-only edge update can leave live inspection state inconsistent with the committed GraphIR.
- **Membership drift:** direct graph replacement can leave `GraphRuntime.#members` containing removed node IDs. The intended `destroyAdopted()` ordering avoids this, but the lower-level exposed binding path does not.
- **Adoption is not fully atomic:** graph replacement commits before `#adopted.set()` and `mount()`. A later mount failure leaves graph ownership and runtime bookkeeping out of sync.
- **Adopted tracks bypass keyframe validation:** `adopt()` reaches `buildGraphIR()` but not `validateV5()`, so runtime-created tracks do not receive the same authored-stop validation as loaded tracks.

**Dynamic graph conclusion:** the article correctly identifies the closure roadblock, but the practical priority is to fix the ownership seam and leaks before optimizing ordering.

---

## 3. Performance and scheduler refinement

### Claim: GSAP creates one tween per property per segment

**Verdict: verified.** `packages/core/src/adapters/interpolator/gsap.ts` loops through each compiled property and each adjacent stop, calling `timeline.to(proxy, vars, position)` for every segment. Four properties over three segments creates up to twelve tween entries.

### Claim: use GSAP percentage keyframes to create one tween per track

**Verdict: feasible, but not a drop-in change.** The current contract intentionally exposes a proxy-backed mutable state and a generic `InterpolationTimeline`; changing construction must preserve:

- adapter-owned mutable state read by `Track`;
- exact authored stop positions and duration;
- per-stop easing and ease collision rules;
- initial values at progress zero;
- kill/dispose behavior;
- deterministic behavior for sparse properties and zero-duration cases.

A single GSAP tween could reduce object count, but benchmark it against the existing adapter first. The current implementation's segment-level construction may be deliberate for independent property easing. The optimization should land only with interpolation equivalence tests and a measured construction/runtime budget.

### Claim: Scheduler is a pause-safe write gate

**Verdict: verified.** `Motion.#onTick` and `Motion.#onTrigger` schedule progress application. `pause()` cancels all pending handles before detaching subscriptions. The current tests explicitly cover queued work and pause/remount behavior.

### Claim: remove Scheduler from Motion after TriggerPort refactor

**Verdict: reject.** Unsubscribe prevents future callbacks; it does not cancel already queued jobs. A trigger can emit, a scheduler job can be queued, then the motion can pause before the scheduler flushes. Without Motion's cancellation set, that stale job still mutates tracks and invalidates the graph.

Scheduler must remain in **both** Motion and GraphRuntime:

- Motion: cancelable progress writes and reentrancy control at the motion boundary.
- GraphRuntime: deferred drain after reentrant publication/flush activity.

Also note that the current GraphRuntime implementation queues deferred work, while `docs/ARCHITECTURE.md` says reentrancy is refused rather than queued. That is a documentation contradiction requiring resolution.

---

## 4. Multi-track invalidation

### Claim: only `ids[0]` is invalidated

**Verdict: verified.** `Engine.load()` updates every Motion track locally, but its invalidate callback calls `runtime.seek(first, progress)` for only the first qualified ID. The publisher's affected closure starts from that seed, so sibling tracks that do not depend on the first remain absent from the flush.

### Claim: pass the entire `ids` array

**Verdict: directionally correct, but do not patch blindly.** `GraphRuntime.invalidate()` accepts `readonly string[]`, so seeding all IDs is the obvious minimum fix. But the current callback also calls `ProjectRuntime.seek()`, which invokes the single-node `#setProgress` callback again before flushing. A correct fix should avoid double-writing the first track and should define whether one Motion invalidation produces one batch with all motion tracks as seeds.

Add a failing integration test with two independent tracks, subscribe to both, drive one Motion progress update, and assert both patches are published in the same batch. Add a stagger test separately: simply seeding all IDs does not make stagger functional because `Motion.schedule()` computes offsets but `#setProgress()` applies the same progress to every track.

**Status:** not landed in the reviewed tree.

---

## 5. Phase 5 completion claim

### Claim: Phase 5 is complete and earlier status is stale

**Verdict: partially verified, not a blanket completion proof.** `docs/SESSION-STATUS.md` says Phase 5 is complete and records evidence for P5-01 through P5-04. The code also contains the claimed pieces:

- `graph/references.ts` is the single pending/resolved reference classifier.
- `runtime/diagnostics.ts` implements a bounded diagnostic history with `droppedCount`.
- `ProjectRuntime.adopt()` exists and uses `GraphBinding.replace()` transactionally.

But Phase 5 status does not prove the attached article's broader runtime claims. The current tree still has the Engine/adoption closure failure, the multi-track invalidation bug, and teardown/cache issues documented above. Treat "Phase 5 complete" as **the named Phase 5 acceptance slice passed**, not "all dynamic graph and motion behavior is complete."

There is also a documentation inconsistency: `docs/README.md` describes the current reality as Phase 4 reopened, while `docs/SESSION-STATUS.md` says Phase 5 complete. The status file is explicitly designated authoritative, so update the README or clearly mark it historical.

### Claim: diagnostics prevent memory leaks

**Verdict: verified only for diagnostic history.** The 500-entry `Diagnostics` buffer bounds retained diagnostic entries. It does not prevent the independent `PatchRegistry` and publisher-node cache leaks. Do not generalize the bounded diagnostics result to whole-runtime memory safety.

---

## 6. Consolidated decision table

| Topic | Verdict | Action |
|---|---|---|
| Duplicate trigger subclasses | True | Collapse, then migrate port |
| Time trigger is a clock mode | True in model, broken in Engine path | Fix Engine-path ownership first |
| Adapter owns platform listening | True | Inject ports from composition root |
| Bare subscribe progress port | Good direction | Keep core validation and Scheduler |
| GraphIR / ObservationState split | True and strong | Preserve exactly |
| Dynamic graph adoption closure bug | True | Add compile/compose ownership seam |
| GraphIndex | Plausible, premature | Benchmark and defer |
| GSAP one-tween optimization | Feasible, unproven | Benchmark with equivalence tests |
| Remove Scheduler from Motion | False | Keep it and its cancellation set |
| Seed all Motion track IDs | Correct minimum direction | Add failing test; avoid double writes |
| Phase 5 fully implements all claims | False as blanket statement | Narrow status language |
| Bounded diagnostics means no runtime leaks | False | Fix registry/cache teardown separately |

## 7. Recommended implementation order

1. Add failing tests for Engine-path time playback, multi-track publication, adoption through the public composition path, and stale scheduled work after pause.
2. Fix ownership and lifecycle leaks: compile adopted tracks, dispose PatchRegistry, invalidate publisher cache safely, reconcile membership, and make adoption atomic.
3. Fix multi-track invalidation without double-writing and decide whether stagger is implemented or removed from the active contract.
4. Resolve the GraphRuntime reentrancy documentation contradiction.
5. Refactor triggers into a `TriggerPort` with host-injected adapters while retaining Motion's Scheduler gate and core progress validation.
6. Benchmark GSAP construction before changing timeline representation.
7. Only then evaluate an incremental GraphIndex.
