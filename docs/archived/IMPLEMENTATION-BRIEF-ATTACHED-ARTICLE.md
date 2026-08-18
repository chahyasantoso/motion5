# Implementation brief: attached architecture feasibility study

**Audience:** lower-level coding agent, including Gemini Flash.

**Purpose:** implement the feasible parts of `docs/ATTACHED-ARTICLE-FEASIBILITY-STUDY.md` without architectural drift, accidental scope expansion, or confusing intended work with landed behavior.

**Base branch:** `phase5/membership-base`

**Starting rule:** before editing, read `docs/SESSION-STATUS.md`, `docs/IMPLEMENTOR-BRIEF-MOTIONPATH-TO-MOTION5.md`, `docs/ARCHITECTURE.md`, and this file. Do not trust older plan documents when they conflict with `SESSION-STATUS.md`.

---

## 0. Non-negotiable guardrails

These rules override every tempting shortcut.

1. **Do not copy motionpath wholesale.** Use it only as a behavior oracle.
2. **Do not replace the graph kernel.** Preserve `GraphIR`, `ObservationState`, `GraphBinding`, canonical ordering, transactional mutation, one `ProjectRuntime`, one `GraphRuntime`, one `PatchRegistry`, and one project clock subscription.
3. **Do not add a second graph truth.** Any future index must be derived, owned, invalidated, and rolled back by the existing graph owner.
4. **Do not move renderer or platform dependencies inward.** Core domain, graph, and runtime must stay DOM/React/GSAP free.
5. **Do not remove Scheduler from Motion.** Trigger delivery may be synchronous, but Motion writes remain scheduled, cancellable, and eventually synchronous when the Scheduler executes them.
6. **Do not move progress validation only into adapters.** Motion/core remains the trust boundary for finite `[0, 1]` progress.
7. **Do not silently change public API.** If `TriggerSignal` is removed or replaced, update exports, consumers, tests, and docs in the same slice.
8. **Do not claim a feature is complete without an Engine-path test.** Direct unit tests are insufficient for Engine wiring, graph publication, or clock ownership.
9. **Every behavior change starts with a failing test on the starting commit.** Refactors with no behavior change may be green-to-green, but state that explicitly.
10. **One slice, one owner, one commit intent.** Do not combine trigger migration, graph optimization, GSAP optimization, and demo work.

---

## 1. Current reality and known defects

Treat these as existing conditions, not solved requirements:

- `domain/triggers.ts` has three identical trigger subclasses.
- `Motion.#onTrigger()` schedules one job per signal; it does not coalesce to one pending progress slot.
- `Engine.load()` constructs Motions with `listenToClock: false`, so Engine-path `time` playback is not proven and currently does not advance through the normal Motion clock path.
- `Engine.load()` invalidates only the first Motion track ID.
- `Motion.schedule()` computes stagger offsets, but `#setProgress()` applies the same progress to every Track.
- `ProjectRuntime.adopt()` mutates graph topology, but Engine's private `tracks` map cannot compose adopted nodes.
- `ProjectHandle` does not expose adoption operations.
- `GraphRuntime.#publisherNodes` retains old GraphNode identities across replacements.
- `PatchRegistry` has no owner teardown operation.
- `ObservationState` normalizes away edge projections and `edgeKey()` excludes projection.
- `docs/SESSION-STATUS.md` says Phase 5 is complete; older docs may still describe Phase 4 reopened. Status is authoritative.

Do not “fix” all of these in one branch. Follow the phases below.

---

# Phase 0: establish a red baseline and decisions

## Goal

Create explicit failing evidence for the correctness gaps before refactoring abstractions.

## Required failing tests

Add tests that fail on the starting commit:

1. **Engine time playback:** load a project with one `time` motion, mount its node, tick the injected project clock, flush the Scheduler, and assert progress/published patch changes.
2. **Multi-track publication:** load one Motion with two independent tracks, drive progress, flush, and assert both node patches publish in one batch.
3. **Adopted-track Engine path:** adopt a valid free track through the intended composition root or current internal path, trigger a flush, and assert it reaches `ready`, not `composition-failure`.
4. **Stale scheduled write:** emit a trigger progress, pause before scheduler flush, flush, and assert no Track mutation or graph invalidation occurs.
5. **Trigger burst behavior:** emit multiple progress values before flush. Record the current behavior as a regression test only if changing it in Phase 2; otherwise defer the assertion to Phase 2.

## Decision records required

Before implementation, write down answers in the PR description or `docs/DECISIONS.md`:

- Is runtime adoption a v1 public feature or an internal recovery capability?
- Does manual public control remain `signal({ type, progress })`, or become direct `seek(progress)`?
- If `TriggerSignal` is retained, export its type. If removed, update `ProjectHandle` and all callers.
- What exactly does `stagger` mean? If no owner can be agreed, remove it from active behavior rather than pretending it works.
- Is GraphRuntime reentrancy queued or refused? Current code queues a deferred drain; architecture prose says refused. Pick one and align docs/tests.

## Exit criteria

- All new tests are red on the starting commit.
- No production code changed yet, unless only test support is needed.
- Decisions are explicit.

---

# Phase 1: fix Engine-path correctness

## Goal

Make the existing model correct before changing the trigger abstraction.

## 1A. Time playback

Preserve the invariant: **one clock subscription per project**.

Do not make every Motion subscribe independently when fixing Engine playback. Choose a project-level owner, most likely `ProjectRuntime` or an explicit project Motion coordinator, that receives the existing clock tick and advances only time-driven Motions.

Requirements:

- `time` motions advance from elapsed `ClockTick.delta`.
- `scroll` and `manual` motions do not also advance from the clock.
- no second RAF, ticker, or Clock subscription.
- all progress writes still pass through Scheduler.
- disposal removes the project clock subscription exactly once.

Add an Engine integration test proving the full path, not just direct Motion behavior.

## 1B. Multi-track invalidation

Change the invalidation boundary so one Motion update seeds all of its track IDs in one deterministic batch.

Do not blindly replace `runtime.seek(first, progress)` with a multi-ID call if that causes the first Track to be written twice. Add a project-level multi-seed operation or equivalent that:

- writes each Track exactly once;
- seeds all Motion track IDs;
- invalidates downstream graph dependents;
- emits one batch;
- preserves canonical order and deterministic seed order.

Add tests for independent siblings and dependent siblings.

## 1C. Adoption composition ownership

Make adopted tracks compose through the same compiler/Track ownership path as authored tracks.

Preferred shape: keep compilation in the composition root and provide `ProjectRuntime` a renderer-neutral capability for compiling/adopting a Track. Do not expose Engine's private `tracks` Map and do not duplicate keyframe/plugin compilation.

Requirements:

- adopted valid tracks publish ready patches;
- malformed adopted keyframes fail before graph commit;
- adoption remains owner-gated on destruction;
- failed adoption leaves graph, ownership map, membership, and patches unchanged.

## Exit criteria

- Phase 0 tests pass.
- Engine-path tests exist and pass.
- One-clock invariant is tested.
- No trigger port migration yet.

---

# Phase 2: preserve safety while improving Motion scheduling

## Goal

Keep synchronous source delivery, but coalesce scheduled writes.

## Required behavior

TriggerPort or current TriggerDelegate callbacks may run synchronously. Motion must not immediately mutate Track from the callback.

Replace “one Scheduler job per signal” with:

```ts
#pendingProgress: number | undefined;
#progressJob: Cancel | undefined;
```

Algorithm:

1. Receive a validated progress value.
2. Store it in `#pendingProgress`, overwriting the previous value.
3. If `#progressJob` already exists, do not schedule another job.
4. Otherwise schedule one job.
5. When the job executes, capture the latest progress, clear slot and handle, then call the existing progress application path.
6. On `pause`, cancel the job, clear the slot, and detach/unsubscribe the source.
7. On dispose, make cleanup idempotent.

Do not use a generic queue package. The Motion owns this lifecycle because only Motion knows whether a queued write is still valid.

## Required tests

- ten signals before Scheduler flush produce one Track write with the latest value;
- pause cancels the pending write;
- remount does not duplicate subscriptions or jobs;
- clock and trigger paths both retain cancellation behavior;
- graph publication occurs once for the coalesced update.

## Exit criteria

- no stale write after pause;
- no duplicate scheduled job for a burst;
- Scheduler remains in Motion;
- all existing lifecycle tests pass.

---

# Phase 3: migrate triggers to a port

## Goal

Move trigger ownership to the port/adapter boundary without changing graph semantics.

## Target contract

Create `packages/core/src/ports/trigger.ts` with a minimal semantic contract, preferably:

```ts
export interface TriggerPort {
  subscribe(onProgress: (progress: number) => void): () => void;
}
```

Keep `Clock` as a separate named interface. Same method shape does not mean same semantics:

- Clock emits elapsed time and Motion accumulates.
- TriggerPort emits absolute normalized progress and Motion assigns.

## Migration rules

- Remove dead `play` and `pause` command fields.
- Do not move all validation into adapters.
- Keep one core validation point for finite `[0, 1]` progress.
- Do not have `Engine` import an adapter factory from core.
- Host/composition root injects the TriggerPort or a factory capability.
- `TriggerType` remains in `contract/v5.ts` for authored schema validation.
- If `TriggerSignal` is removed, replace public API deliberately and update types/tests/docs together.
- Delete `domain/triggers.ts` only when no internal or public caller remains.

## Adapter rules

A scroll adapter may own browser/Lenis/GSAP listener wiring. A manual adapter may expose a programmatic emitter. Neither may:

- publish patches;
- mutate Track directly;
- create a Clock;
- bypass Scheduler;
- call GraphRuntime directly.

## Required tests

- port lifecycle: subscribe, unsubscribe, resubscribe;
- invalid progress rejected at the Motion/core boundary;
- scroll/manual adapter contract tests without DOM imports in core;
- no second clock subscription;
- pause/remount and disposal are idempotent.

## Exit criteria

- public API compiles for external consumers;
- boundary scan passes;
- no trigger behavior regression;
- all progress writes still pass through Scheduler and ProjectRuntime.

---

# Phase 4: dynamic graph lifecycle hardening

## Goal

Make runtime graph mutation correct, reachable, and leak-safe before adding incremental indexes.

## 4A. Adoption surface

If adoption is v1, expose deliberate methods on the public composition root with owner semantics. If not v1, keep it internal and label it explicitly as scaffold. Never pretend private ProjectRuntime methods are a shipped feature.

## 4B. Registry teardown

Add owner-first teardown to PatchRegistry. Preserve `remove(nodeId)` semantics for remount, where subscriber identity must survive. Full runtime disposal must release patches and listeners and reject/ignore future publication according to the chosen lifecycle contract.

## 4C. Publisher cache lifecycle

Do not blindly switch to `WeakMap` and call it fixed. A WeakMap reduces retention but still misses every new GraphNode identity and re-resolves every compose closure. Prefer stable node-ID/revision ownership or clear/rebuild the cache on successful graph replacement under GraphRuntime ownership.

Add a repeated replace/adopt/destroy test that proves bounded retained state and no stale compose closures.

## 4D. Membership and adoption atomicity

Ensure graph replacement reconciles attached membership. Ensure adoption failure cannot leave only one of graph node, ownership record, mount membership, and patch state committed.

Use the existing GraphBinding transaction; do not invent a second rollback system. If cross-object compensation is required, define the commit order and test every failure point.

## 4E. Projection and validation

Preserve `projection` in normalized live edges and define whether projection participates in edge identity. A projection-only change must update inspection state consistently with GraphIR.

Reuse the authored keyframe validation rules for adopted tracks. Do not let runtime-created tracks bypass finite, monotonic, unique stop validation.

## Exit criteria

- adoption through the selected API produces ready patches;
- failed adoption is observationally atomic;
- repeated graph mutation does not retain dead nodes/listeners/closures;
- projection-only replacement is consistent;
- keyframe validation is shared.

---

# Phase 5: performance measurement and optional optimization

## Goal

Measure first. Optimize only where the measurement justifies complexity.

## 5A. GSAP interpolation benchmark

Current `gsap.ts` creates one timeline segment per property per adjacent stop. A one-tween percentage-keyframe path is allowed only if it preserves:

- proxy-owned mutable state;
- exact progress values;
- duration and authored positions;
- per-stop easing;
- sparse properties and initial values;
- zero-duration behavior;
- `progress()` getter/setter;
- kill/dispose behavior.

Add equivalence tests before changing implementation. Benchmark construction time, memory/object count, progress update time, and kill cost. If one tween is not measurably better without semantic loss, keep the current implementation.

## 5B. Graph replacement benchmark

Measure full GraphIR rebuild/diff and publisher dependent-map construction for realistic node counts and adoption rates. Do not optimize based on theoretical O(n) alone.

## Exit criteria

- benchmark data is committed or attached to the PR;
- semantic equivalence tests pass;
- no new graph owner is introduced without a decision record.

---

# Phase 6: GraphIndex, only if measurement requires it

## Goal

Introduce incremental ordering/dependent lookup only if Phase 5 data proves the current design is a bottleneck.

## Hard constraints

- GraphIndex is not a second GraphIR.
- One existing owner controls mutation and rollback.
- Canonical order remains a pure deterministic result.
- Add/remove/replace updates are transactional.
- Failed updates restore ranks, dependents, edges, membership, and caches.
- Publisher still consumes a validated snapshot and cannot mutate topology.

## Required design before code

Write an ADR covering:

- owner;
- data model;
- stable identity keys;
- rank update algorithm;
- dependent update algorithm;
- rollback journal entries;
- cache invalidation;
- complexity improvement measured against baseline;
- why full rebuild is insufficient.

## Required tests

- insertion before, between, and after existing ranks;
- deletion of a node with dependents;
- edge replacement and cycle rejection;
- rollback after each mutation stage;
- identical canonical ordering versus baseline;
- identical affected closure and patch output;
- repeated mutation memory bound.

If these cannot be proven simply, do not build GraphIndex.

---

# Phase 7: Walker demo integration

## Goal

Build a demo comparable in behavior to the oracle, without copying its architecture.

## Preconditions

Do not begin until Phases 1-4 exit criteria pass. A demo is not a substitute for Engine-path correctness.

## Demo responsibilities

The demo may own:

- DOM/React composition;
- browser clock injection;
- scroll/manual driver injection;
- target resolution;
- DOM patch adapter;
- lifecycle wiring;
- visual controls and diagnostics display.

The demo must not own:

- GraphIR mutation;
- PatchRegistry manipulation;
- direct Track mutation;
- a second RAF/ticker;
- a second graph publisher;
- copied motionpath internals.

## Minimum acceptance demo

1. Load a valid project through `Engine`.
2. Render at least one walker node through the DOM adapter.
3. Demonstrate time playback using the single injected browser clock.
4. Demonstrate manual or scroll progress through TriggerPort.
5. Render multiple tracks from one Motion in one published batch.
6. Demonstrate a graph observation dependency.
7. Mount, unmount, remount, and dispose without duplicate subscriptions.
8. Show blocked/pending/error diagnostics without crashing the app.
9. Use React `usePatch` only at the React boundary.
10. Include an automated end-to-end test, not only a screenshot or manual check.

## Oracle comparison rule

Compare behavior, not file structure. Recreate fixtures and assertions from the oracle. Do not copy oracle source, tests, adapters, or architecture wholesale.

## Exit criteria

- public API only for app integration;
- end-to-end test passes;
- one-clock invariant remains true;
- no boundary scan violations;
- docs and status updated after evidence is green.

---

## Final implementation order

Do not reorder casually:

1. Phase 0: red tests and decisions.
2. Phase 1: Engine-path correctness.
3. Phase 2: coalesced scheduled Motion writes.
4. Phase 3: TriggerPort migration.
5. Phase 4: dynamic graph lifecycle hardening.
6. Phase 5: benchmarks and measured optimization.
7. Phase 6: GraphIndex only if justified.
8. Phase 7: Walker demo.

If a lower-level agent proposes a shortcut, ask: **which owner does this move, which invariant does it preserve, and which failing test proves it?** If it cannot answer all three, reject the shortcut.
