# Attached architecture article: detailed feasibility study

**Status:** assessment / intent. This report does not claim that any recommendation has landed. Current implementation reality remains governed by `docs/SESSION-STATUS.md`.

- **Repository:** `chahyasantoso/motion5`
- **Branch reviewed:** `phase5/membership-base`
- **Article sections covered:** trigger simplification, graph stability/dynamics, performance/scheduler, multi-track invalidation, Phase 5 status
- **Primary brief:** `docs/IMPLEMENTOR-BRIEF-MOTIONPATH-TO-MOTION5.md`

## Executive summary

The attached article is a useful architecture direction, but it combines observations that are true today, proposed refactors, and claims that the repository is already complete. The feasibility result is:

| Area                             | Verdict                                | Recommendation                                                                                                                       |
| -------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Trigger simplification           | Feasible and mostly correct            | Keep separate `Clock` and `TriggerPort` semantics; move platform drivers outward; retain Motion's Scheduler gate and core validation |
| GraphIR / ObservationState split | Correct and strong                     | Preserve the split and identity-preserving transaction model                                                                         |
| Dynamic adoption                 | Correct diagnosis, incomplete solution | Fix composition ownership, public reachability, atomicity, validation, cache invalidation, and teardown before optimizing            |
| Incremental `GraphIndex`         | Plausible, not yet justified           | Benchmark first; do not introduce a second graph truth or mutable owner                                                              |
| GSAP one-tween optimization      | Feasible, unproven                     | Add equivalence tests and benchmark before replacing the current segment construction                                                |
| Remove Scheduler from Motion     | **Not feasible without a replacement** | Reject; unsubscribe cannot cancel already queued writes                                                                              |
| Multi-track seed fix             | Correct minimum direction              | Seed all IDs in one batch, remove duplicate first-track writes, test independently from stagger                                      |
| Phase 5 completion claim         | Valid only for the named slice         | Do not treat it as proof that every article capability is production-ready                                                           |

The highest-risk mistake in the article is the proposed Scheduler removal. The highest-risk implementation gap is dynamic adoption through `Engine.load`: the graph mutation succeeds, but the adopted node has no compiled `Track` in the Engine-owned closure and publishes composition errors forever.

---

## 1. Trigger architecture simplification

### 1.1 Duplicate Manual, Scroll, and Time subclasses

**Article claim:** all three trigger subclasses validate progress and emit `setProgress`, so the hierarchy is premature.

**Repository evidence:** `packages/core/src/domain/triggers.ts` contains `ManualTrigger`, `ScrollTrigger`, and `TimeTrigger`. Each `handle()` method does the same three operations: reject missing progress, call `assertProgress()`, and emit `{ setProgress: progress }`. The only difference is the error-message label. The trigger tests already test the three types through a table-driven case.

**Feasibility: high. Risk: low.** Collapse the behavior first, then migrate the abstraction. Do not preserve three classes merely because the schema has three labels.

### 1.2 The Time Trigger is conceptually redundant

`Motion.#onTick()` accumulates progress from `ClockTick.delta`, while `Motion.#onTrigger()` assigns externally supplied absolute progress. These are different semantics: Clock means elapsed-time accumulation; Trigger means external position assignment.

The Engine path is currently broken: `engine.ts` constructs every Motion with `listenToClock: false`, then calls `motion.play()` for every trigger type. No owner advances time-driven motions through the Engine path.

**Feasibility: high after an ownership fix. Risk: high if done first.** Add an Engine integration test that loads a `time` motion, ticks the injected clock, flushes the Scheduler, and asserts a patch progresses. Preserve exactly one upstream clock subscription per project.

### 1.3 TriggerPort as a three-line observable

The proposed shape is feasible:

```ts
interface TriggerPort {
  subscribe(onProgress: (progress: number) => void): () => void;
}
```

It matches `Clock`, removes attach/detach asymmetry, and removes `#triggerAttached`. Keep validation at the Motion/core trust boundary. Moving validation only into adapters would let a third-party adapter feed invalid values into Track state.

### 1.4 Adapter ownership

The brief already requires trigger adapters to provide signals only. They must not publish patches, create clocks, or bypass `ProjectRuntime`.

The article's proposal that `Engine.load()` call an adapter factory from core is wrong: it reverses dependency direction and risks the boundary scan. The host/composition root should inject a TriggerPort or factory capability through a port.

### 1.5 Keep Clock and Trigger separate

Strongly agree. Clock emits elapsed-time events and Motion accumulates; TriggerPort emits externally owned absolute progress and Motion assigns. Their subscription shapes may match, but their semantic contracts do not.

### 1.6 The boolean / optional port model

`MotionOptions` already has `trigger?` and `listenToClock?`, so the proposed optional TriggerPort is close. The missing piece is a project-level owner for time playback and a host injection path for external drivers. Keep `TriggerType` in the authored contract even if it disappears from Motion internals.

### Trigger work plan

1. Add Engine-path time playback test and fix one-clock ownership.
2. Decide whether public manual control uses typed signals or direct `seek(progress)`.
3. Export or replace the currently unexported `TriggerSignal` used by public `ProjectHandle.signal`.
4. Introduce `ports/trigger.ts` with subscribe cleanup.
5. Keep Motion's Scheduler cancellation set and core progress validation.
6. Add adapter contract tests for scroll and manual sources.

---

## 2. Graph stability and dynamics

### 2.1 GraphIR versus ObservationState

This claim is verified and should be preserved. `graph/ir.ts` builds frozen nodes, edges, lookup, diagnostics, and canonical order. `ObservationState` maintains live indexes in place. `GraphBinding` validates a candidate before mutation, applies a reversible delta, swaps the immutable snapshot last, and commits only after success.

### 2.2 Transactional rollback

The delta ordering is correct: remove obsolete edges, remove obsolete nodes, add new nodes, add new edges. On failure, the journal is replayed in reverse. The remaining concern is rollback failure containment: if an undo precondition throws, the journal is cleared in `finally` and live state could be partially restored. Add an invariant test or make rollback failure impossible by construction.

### 2.3 Dynamic adoption closure roadblock

The `tracks` Map is not frozen, but it is private to one `Engine.load()` invocation. The Engine compose closure calls `tracks.get(node.id)!.compose(...)`. `ProjectRuntime.adopt()` changes the graph but does not compile/register a Track in that private Map. The first flush of an adopted node therefore publishes a contained composition error.

Choose one owner: Engine owns a track compiler and exposes adoption through the composition root, or ProjectRuntime receives a renderer-neutral compose/track factory capability. Do not let ProjectRuntime reach into Engine's closure or duplicate compilation logic.

### 2.4 Public reachability

`ProjectHandle` exposes no `adopt()` or `destroyAdopted()`, and ProjectRuntime is intentionally not public. Decide whether adoption is a v1 feature or an internal recovery scaffold. A transactional internal implementation without a caller is not a shipped feature.

### 2.5 GraphIndex proposal

GraphIndex is plausible but premature. Current replacement rebuilds and validates the full candidate graph, then diffs it. An incremental index would add another mutable graph representation, owner, rollback surface, cache synchronization problem, and stale-index failure mode.

Benchmark realistic project sizes and adoption rates first. If built, GraphIndex must be owned by GraphBinding or GraphRuntime, never become a second graph truth, and preserve canonical order, affected closures, and rollback semantics.

### 2.6 Additional dynamic graph findings

- **Publisher-node cache retention:** `GraphRuntime.#publisherNodes` is a strong `Map<GraphNode, PublisherNode>`, but every graph build creates new node identities. Replacement misses the cache, re-resolves every compose closure, and retains old entries until disposal.
- **PatchRegistry teardown leak:** `GraphRuntime.dispose()` does not dispose or clear the registry, so patches, node listeners, and batch listeners survive runtime disposal.
- **Projection drift:** `ObservationState.normalizeEdge()` drops `projection`, and `edgeKey()` excludes it. Projection-only changes can leave live inspection state inconsistent with GraphIR.
- **Membership drift:** direct graph replacement can leave removed IDs in `GraphRuntime.#members`; later flushes silently ignore those stale seeds.
- **Adoption atomicity:** graph replacement commits before ownership bookkeeping and mount complete. A mount failure can leave graph and runtime maps inconsistent.
- **Adopted keyframe validation:** adoption reaches `buildGraphIR()` but not the full keyframe validation pass, so runtime-created tracks can bypass authored-stop validation.

---

## 3. Performance and Scheduler refinement

### 3.1 GSAP object count

`adapters/interpolator/gsap.ts` calls `timeline.to()` for every compiled property and every adjacent stop. Four properties over three segments can create twelve timeline entries. A one-tween path is feasible but must preserve proxy-owned state, authored positions, duration, per-stop easing, sparse properties, zero-duration behavior, progress accessors, and kill lifecycle. Benchmark before changing it.

### 3.2 What the Scheduler actually does

The core path is synchronous **inside each stage**. There is no Promise, database, worker, or hidden network operation in `Motion`, `Track`, `ProjectRuntime`, or `GraphPublisher`. The Scheduler is an injected callback queue, not an async runtime by itself. In tests, `createFakeScheduler().schedule(job)` records a job and `flush()` executes it synchronously when the test calls `flush()`.

Current flow:

```text
TriggerPort callback or Clock callback
  -> Motion validates / computes progress
  -> Scheduler.schedule(job)       // defer the write boundary
  -> caller may pause before flush
  -> Motion.pause() cancels job
  -> Scheduler.flush()             // synchronous execution
  -> Track.setProgress()
  -> ProjectRuntime / GraphRuntime publication
```

The Scheduler exists primarily for **correctness and ownership**, not raw efficiency. It gives Motion a commit boundary where queued writes can be cancelled before Track and ProjectRuntime mutate. It also prevents source callbacks from entering graph publication recursively. It can improve efficiency if jobs are coalesced, but that is secondary.

### 3.3 Immediate versus scheduled application

Immediate application would be:

```text
TriggerPort callback
  -> Track.setProgress()
  -> ProjectRuntime.invalidate()
  -> patch publication
```

That model is simpler and has the lowest latency. It is valid only if the contract explicitly says signals apply immediately. Its costs are:

- `pause()` cannot cancel a write already performed;
- a source callback can synchronously re-enter graph publication;
- a burst of scroll signals can cause a burst of graph invalidations;
- source delivery and graph mutation become tightly coupled;
- batching and coalescing must be rebuilt elsewhere.

Scheduled application costs one controlled boundary and potentially one scheduler turn of latency, but gives cancellation, batching/coalescing, and a stable place to enforce lifecycle rules. For this repository, scheduled Motion writes are the safer contract because the brief explicitly requires manual, scroll, and time signals to pass through Scheduler.

### 3.4 Recommended TriggerPort/Scheduler design

**TriggerPort delivery should be synchronous; Motion's write should remain scheduled.** The TriggerPort callback is not itself asynchronous. It delivers the latest normalized progress immediately to Motion. Motion then keeps one pending progress slot and one scheduled job per Motion:

```ts
#pendingProgress: number | undefined;
#progressJob: Cancel | undefined;
```

On each signal, Motion overwrites `#pendingProgress`. If `#progressJob` already exists, it does not schedule another job. When the job runs, it reads the latest progress, clears the slot and handle, then applies one update. On pause, Motion cancels the job and clears the slot.

This means ten scroll signals before a scheduler flush produce one Track update and one graph invalidation, using the latest progress. It does **not** happen in the current code: current `#onTrigger()` schedules one job per signal and stores every handle in `#scheduled`.

A fully synchronous design is possible, but it is a deliberate contract change, not a cleanup. If selected, it needs explicit reentrancy rules, a coalescing mechanism, and a new pause contract. Do not remove Scheduler merely because TriggerPort cleanup is synchronous.

### 3.5 Removing Scheduler from Motion

**Reject the deletion as proposed.** Unsubscribe stops future source callbacks; it cannot cancel work already queued:

1. TriggerPort emits progress.
2. Motion schedules a job.
3. Caller pauses before Scheduler flush.
4. Source unsubscribe succeeds.
5. The queued job still runs unless Motion cancels it.

Without Scheduler, the write is still there; it just runs synchronously inside the source callback. Removing the Scheduler would make trigger and clock callbacks mutate Track and invalidate the graph immediately, increasing reentrancy risk and losing the current pause-safe write gate.

Scheduler should remain in both places, with different responsibilities:

- **Motion:** cancelable/coalesced progress writes and pause safety.
- **GraphRuntime:** deferred drain after a reentrant flush request.

There is a separate documentation contradiction: GraphRuntime currently queues deferred flushes, while `docs/ARCHITECTURE.md` says reentrancy is refused rather than queued. Resolve that before changing behavior.

---

## 4. Multi-track invalidation

`engine.ts` updates every Motion track locally but invalidates only `ids[0]`. Independent sibling tracks therefore remain stale in published output even though their internal progress changes.

Passing all IDs is the correct minimum direction because `GraphRuntime.invalidate()` accepts multiple seeds, but it must avoid double-writing the first track: `ProjectRuntime.seek()` currently calls the single-node `setProgress` callback before invalidating. Add a project-level multi-seed path, preserve one deterministic batch, and test independent siblings plus downstream dependencies.

Stagger is separate. `Motion.schedule()` computes offsets, but `#setProgress()` applies identical progress to every track. Seeding all IDs does not implement stagger. Either define and implement per-track offset semantics or remove stagger from the active contract.

Required tests: two independent tracks publish ready patches in one batch; dependent nodes compose once; first-track progress is written once; stagger has explicit semantics; paused Motion cannot publish queued work.

---

## 5. Phase 5 completion and diagnostics

`docs/SESSION-STATUS.md` says Phase 5 is complete and records exact-head CI evidence for P5-01 through P5-04. The tree contains the named features: the single reference classifier, bounded diagnostic history, runtime adoption, and retained-patch eviction on unmount/remount.

This is valid for the named Phase 5 slice, not a blanket claim that trigger integration, dynamic adoption through Engine, multi-track output, and all runtime behavior are complete. The Engine adoption closure bug, multi-track invalidation bug, Scheduler concerns, and cache/teardown findings remain.

`runtime/diagnostics.ts` correctly bounds diagnostic history at a default capacity of 500 and tracks dropped entries. That prevents diagnostic-history growth only; it does not fix PatchRegistry or publisher-node cache retention.

There is also a stale-doc conflict: `docs/README.md` describes Phase 4 reopened while `SESSION-STATUS.md` says Phase 5 complete. The status file is authoritative, so update or label the README.

---

## 6. Consolidated feasibility matrix

| Topic                          | Current evidence                   |                 Feasibility | Priority | Required proof                      |
| ------------------------------ | ---------------------------------- | --------------------------: | -------: | ----------------------------------- |
| Collapse duplicate triggers    | Three identical handlers           |                        High |       P2 | Existing trigger tests stay green   |
| Replace with TriggerPort       | Clock precedent exists             |                        High |       P1 | Port lifecycle + adapter tests      |
| Time mode through Engine       | Disabled by `listenToClock: false` |    High after ownership fix |       P0 | Engine integration tick test        |
| Adapter-owned drivers          | Brief requires it                  |                        High |       P1 | Boundary scan + driver tests        |
| Keep Clock/Trigger separate    | Accumulate vs assign               |                        High |       P1 | Semantic tests                      |
| GraphIR/ObservationState split | Implemented and coherent           |                    Preserve | Preserve | Transaction and identity tests      |
| Dynamic adoption compose seam  | Closure cannot see adopted Track   |                      Medium |       P0 | Adopt via Engine, ready patch       |
| Public adoption API            | Currently absent                   |                    Decision |       P0 | Explicit v1/internal decision       |
| GraphIndex                     | Could reduce rebuild cost          |                      Medium |       P3 | Benchmark + rollback proof          |
| GSAP one-tween path            | Per-segment loop verified          |                      Medium |       P3 | Equivalence + performance budget    |
| Remove Motion Scheduler        | Breaks stale-write cancellation    |                      Reject |      N/A | Do not implement as deletion        |
| Multi-track invalidation       | First seed only                    |                        High |       P0 | Same-batch sibling test             |
| Stagger                        | Offset calculation unused          |                      Medium |       P1 | Semantics test or contract removal  |
| Phase 5 status                 | Named slice has CI evidence        | High for slice, not blanket |     Docs | Narrow wording and reconcile README |
| Diagnostic boundedness         | Buffer is capped                   |   High for diagnostics only |     Done | Separate registry retention tests   |

---

## 7. Recommended delivery sequence

### P0: correctness before refactor

1. Add Engine-path time playback test and fix one-clock ownership.
2. Add Engine-path adoption test and introduce the Track/compose ownership seam.
3. Add multi-track same-batch publication test and fix duplicate first-track writes.
4. Add stale scheduled-write test, preserving Scheduler in Motion.
5. Decide whether adoption is public v1 or internal-only.

### P1: boundary and lifecycle cleanup

6. Add registry teardown and publisher cache lifecycle handling.
7. Reconcile graph membership during replacement and make adoption bookkeeping atomic.
8. Preserve projection in live edges and apply keyframe validation to adopted tracks.
9. Refactor trigger implementation into a host-injected TriggerPort.
10. Resolve the GraphRuntime reentrancy documentation contradiction.

### P2/P3: optimization and scale

11. Benchmark GSAP one-tween construction with equivalence fixtures.
12. Benchmark graph replacement and publisher dependent-map construction.
13. Only if measurements justify it, design GraphIndex under GraphBinding/GraphRuntime ownership with rollback semantics.
14. Update stale documentation and narrow Phase 5 completion language.

## Final recommendation

Adopt the article's **direction**, not its unqualified completion claims. Keep immutable GraphIR, identity-stable ObservationState, transactional GraphBinding, single-owner reference classification, bounded diagnostic history, adapter-owned platform drivers, separate Clock/Trigger semantics, and synchronous TriggerPort delivery with scheduled/coalesced Motion writes.

Reject or defer removing Scheduler from Motion, importing adapter factories into core Engine, moving validation entirely into adapters, and adding GraphIndex before measurement. Fix Engine-path time/adoption seams and multi-track invalidation first. Those are correctness bugs; trigger class count and GSAP object count are clarity and optimization work.
