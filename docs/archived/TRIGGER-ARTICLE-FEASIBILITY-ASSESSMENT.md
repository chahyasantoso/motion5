# Trigger article: feasibility assessment and adjacent findings

**Status: assessment / intent.** Nothing in this document claims to have landed. `docs/SESSION-STATUS.md` remains the only file allowed to assert what is true in the tree.

- Reviewed ref: `phase5/membership-base` @ `780e7cf2f010362257b5dce9441f90d2b72cd3bb`
- Source article: external design conversation on `domain/triggers.ts`, progressively collapsing the trigger abstraction down to "an optional `TriggerPort`".
- Governing constraints: `docs/IMPLEMENTOR-BRIEF-MOTIONPATH-TO-MOTION5.md`, `docs/ARCHITECTURE.md`, `oracle/motionpath-v5/README.md`.
- Files read for verification: `packages/core/src/domain/triggers.ts`, `domain/motion.ts`, `domain/lifecycle.ts`, `engine.ts`, `ports/clock.ts`, `ports/scheduler.ts`, `adapters/browser-clock.ts`, `contract/v5.ts`, `contract/validate-v5.ts`, `runtime/project-runtime.ts`, `index.ts`, `test/integration/motion-trigger-types.test.ts`.

---

## 1. Executive summary

The article's diagnosis is **correct and verifiable in the tree**. Its terminal recommendation (delete `domain/triggers.ts`, replace with an optional port) is **architecturally sound but not yet safely executable**, because it lands on top of four unrelated defects in the same progress pathway that would silently absorb the blame for any regression.

Three things need saying plainly:

1. **The article is right that the three trigger classes carry zero behavioral difference.** Verified: `ManualTrigger`, `ScrollTrigger`, and `TimeTrigger` have byte-identical `handle()` bodies modulo the error string.
2. **The article is right that the trigger is a port wearing domain clothing.** Verified: `TriggerDelegate` has no domain state, no invariants beyond a 0..1 range check, and no reference to any other domain object.
3. **The article understates the problem.** It treats the trigger layer as redundant-but-correct. In the tree, the trigger layer is redundant **and** the surrounding progress pathway is broken in ways that make the `"time"` trigger type completely inert and multi-track motions only partially published. See section 4.

There is also a **documentation conflict that must be resolved before any of this is implemented**: `docs/TRIGGER-REFACTORING-FEASIBILITY.md` already exists and reaches a _different_ conclusion (collapse triggers into polymorphic `Clock` implementations, including a `ScrollClock`). The article concludes the opposite (keep `Clock` and `Trigger` as separate named interfaces, precisely so the roles stay legible). Documentation rule 4 forbids leaving contradictory records in place. Section 5 picks a winner.

---

## 2. Topic-by-topic feasibility

Effort is engineer-days for one implementor including tests. Risk is blast radius against the brief's non-negotiables.

| #   | Article claim                                                  | Verified?      | Feasible?             | Effort | Risk     |
| --- | -------------------------------------------------------------- | -------------- | --------------------- | ------ | -------- |
| T1  | Three subclasses are identical, violating DRY                  | Yes            | Yes                   | 0.5    | Low      |
| T2  | `TriggerCommand.play` / `pause` are dead API surface           | Yes            | Yes                   | 0.25   | Low      |
| T3  | `signal()` throwing on type mismatch is fragile                | Yes, partially | Yes, as documentation | 0.25   | Low      |
| T4  | `attach` throws / `detach` no-ops is an undocumented asymmetry | Yes            | Yes                   | 0.25   | Low      |
| T5  | Oracle has no trigger domain concept                           | Yes            | N/A (observation)     | 0      | None     |
| T6  | The three types are schema labels, not behaviors               | Yes            | N/A (observation)     | 0      | None     |
| T7  | Trigger ownership belongs in the adapter layer                 | Yes            | Yes                   | 2      | Medium   |
| T8  | `TriggerDelegate` should move to `ports/trigger.ts`            | Yes            | Yes                   | 1      | Low      |
| T9  | Collapse to `subscribe(cb): () => void`, drop `TriggerCommand` | Yes            | Yes, with a caveat    | 1.5    | Medium   |
| T10 | A trigger is structurally a clock but must not be merged       | Yes            | Yes, agree            | 0      | None     |
| T11 | Reduce the whole system to an optional `TriggerPort`           | Yes            | **Not yet**           | 3+     | **High** |

### T1 — Three identical subclasses

**Verified.** All three `handle()` implementations reduce to: reject `undefined` progress, `assertProgress`, `emit({ setProgress })`. The only variance is the word `Manual` / `Scroll` / `Time` in the `TypeError` message.

**Feasibility: trivial.** Collapsing to a single concrete class preserves `trigger.type` (the only field anyone reads) and keeps `createTrigger` as the validating factory. `test/integration/motion-trigger-types.test.ts` already drives all three types through `it.each` and asserts identical behavior, so it passes unchanged. `test/unit/domain/triggers.test.ts` will need its class-identity assertions revisited.

One correction to the article: it proposes keeping the type string in the error message via `${this.type}`. That is right, but note the collapsed class must keep the per-type message or the existing tests that assert on `"Manual trigger requires progress."` style strings will break. Template the message; do not genericize it.

### T2 — Dead `play` / `pause` fields

**Verified.** `TriggerCommand` declares `play?: boolean` and `pause?: boolean`. Nothing in the repository emits them, and `Motion.#onTrigger` only reads `command.setProgress`. A trigger that emitted `{ pause: true }` today would be accepted, frozen, dispatched, and silently discarded.

**Feasibility: trivial, and it should happen regardless of T11.** Dead optional fields on a frozen command object are worse than absent ones: they type-check, so a future implementor will write them and observe nothing.

### T3 — `signal()` type-mismatch guard

**Verified as fragile, but the article's framing is incomplete.** The guard is not redundant with a dispatcher, because there is no dispatcher: `Engine.load` wires `ProjectHandle.signal(motionId, signal)` straight to `motion.signal(signal)`, and `Motion` holds exactly one trigger. So the check is purely an API-misuse guard against a caller that passes `{ type: "scroll" }` to a motion authored as `"time"`.

**Feasibility: keep it, document the intent.** But see B14 below: this guard is currently unreachable in a type-safe way for external consumers, because `TriggerSignal` is not exported from the package entrypoint while `ProjectHandle.signal` is. Fix the export before debating the guard.

### T4 — attach/detach asymmetry

**Verified.** `attach()` throws `Trigger "x" is already attached.`; `detach()` unconditionally clears. `Motion` papers over this with a `#triggerAttached` boolean, which is itself a smell: the guard exists in two places with two different failure modes.

**Feasibility: trivial.** The subscribe-returns-unsubscribe shape in T9 deletes this problem outright rather than documenting it. Prefer T9 over a comment.

Minor defect found while verifying: in `BaseTrigger.attach`, the already-attached check runs **before** the `typeof emit !== "function"` check. Calling `attach(undefined)` on an attached trigger reports "already attached" rather than the actual argument error. Reorder.

### T5 / T6 — Oracle comparison and schema-label semantics

**Both verified, both correct, and both consistent with the brief.** `oracle/motionpath-v5/README.md` lists seven snapshot files; none is a trigger module. Trigger behavior in the oracle lives in `domain/plugins.js` and `adapters/domRenderer.js`. The brief explicitly says motionpath "supplies trigger _semantics and lifecycle inspiration_", not structure, so the absence of an oracle trigger file is permission to design freely here, not evidence of a gap.

The article's conclusion that motion5's trigger layer is "architecturally superior to the oracle" is true but not load-bearing. The oracle is a behavioral reference, not an architecture template (ADR-001). Superiority to a prototype is not an argument for keeping an abstraction.

### T7 — Trigger ownership moves to adapters

**Verified as the correct direction, and already the stated policy.** The brief says it outright: _"Trigger adapters provide signals only. They never publish patches directly, create a clock, or bypass ProjectRuntime."_ So the article is not proposing a new boundary; it is proposing that the code finally match the documented one.

**Feasibility: medium.** No adapter exists yet. `packages/core/src/adapters/` contains only `browser-clock.ts`, `dom.ts`, and `interpolator/`. `adapters/dom.ts` has zero trigger awareness, confirming the article's observation.

**Risk: medium, and specific.** The article's `ScrollTriggerAdapter` sketch calls `emit(progress)` directly from a scroll event handler. If `Motion` does not wrap that callback in `this.#scheduler.schedule(...)`, the adapter drives progress synchronously from a DOM event, which violates brief requirement _"Manual, scroll, and time signals pass through Scheduler and ProjectRuntime"_ and re-opens the reentrancy hole `Motion.#onTrigger` currently closes. Any implementation must keep the scheduler hop inside `Motion`, never inside the adapter.

### T8 — Move the interface to `ports/trigger.ts`

**Verified and low risk.** `TriggerDelegate` already satisfies every property of a port: consumed by `domain/motion.ts` via `import type`, zero domain dependencies, implementation-agnostic. `ports/clock.ts` and `ports/interpolator.ts` are the precedent, both including an `assertX` runtime guard. A `ports/trigger.ts` should ship `assertTrigger` for symmetry, since `Engine`'s constructor already asserts its other three ports and would otherwise treat trigger uniquely.

`TriggerType` stays in `contract/v5.ts` where it already lives, exported publicly. `domain/triggers.ts` currently re-exports it, which is harmless but redundant.

### T9 — Collapse to a progress observable

**Verified as a genuine simplification.** `subscribe(cb): () => void` matches `Clock` exactly, deletes the attach/detach asymmetry (T4), and deletes `Motion.#triggerAttached`.

**Caveat the article misses.** Reducing `TriggerCommand` to a bare `number` removes the freeze boundary. `BaseTrigger.emit` currently calls `Object.freeze(command)` before dispatch, which is the mechanism satisfying the brief's immutability posture at that seam. A primitive `number` is trivially immutable, so this is fine, but the reasoning should be recorded in `DECISIONS.md` rather than lost, otherwise the next audit reads the removed `Object.freeze` as a regression.

Also: `assertProgress` must not simply "move into each adapter" as the article suggests. If validation lives only in adapters, a third-party adapter can push `NaN` or `1.5` into `Track.setProgress`. `Motion.seek` already clamps with `Math.max(0, Math.min(1, progress))` while the trigger path _throws_ on out-of-range. That inconsistency is a defect today (B7) and would become unfixable if validation were pushed outward. Keep a single validation point at the `Motion` boundary and let adapters fail fast on top of it if they want.

### T10 — "Is a trigger a clock?"

**Agreed, and this is the article's strongest paragraph.** Structural identity is not semantic identity. `Clock` means _time advances_; `Trigger` means _position is dictated_. `Motion.#onTick` accumulates (`#position + delta/duration`) whereas `#onTrigger` assigns (`setProgress`). Merging the interfaces would erase the accumulate-versus-assign distinction, which is the only thing that actually differs in `Motion`.

This is also precisely where `docs/TRIGGER-REFACTORING-FEASIBILITY.md` goes wrong. See section 5.

### T11 — Reduce everything to an optional `TriggerPort`

**Logically correct. Not currently safe to implement.**

The article's final step says: `trigger` present means external control and the clock stays silent; `trigger` absent means the clock drives and `motion.play()` starts it. `MotionOptions` already models exactly this shape (`trigger?`, `listenToClock?`), so the ergonomics are nearly free.

The blocker is that **the clock-driven branch does not work through `Engine` at all.** `Engine.load` constructs every `Motion` with `listenToClock: false` (correctly, per brief rule 4: one clock owner per project) and no autoplay path replaces it. `ProjectRuntime` subscribes to the clock for flush scheduling only; it never advances motion position. So a project authored with `trigger: { type: "time" }` produces a motion that never moves unless the host manually calls `signal({ type: "time", progress })` every frame.

Collapsing to "absent trigger equals clock-driven" therefore encodes a branch that is currently dead code in the only path that matters. Implement B3 first, then T11 becomes a genuine simplification instead of a rename over a hole.

---

## 3. Recommended sequencing

**Stage 0 — unblock (do first, independently of the article).** Fix B1, B3, B4, B14. These are correctness and containment defects in the same pathway; landing them first means any regression from Stage 1+ is attributable.

**Stage 1 — free wins (no API change).** T1, T2, and the `attach` argument-order fix from T4. Roughly 50 lines net deletion, existing tests carry over.

**Stage 2 — honest boundary.** T8 then T9: move to `ports/trigger.ts`, add `assertTrigger`, adopt `subscribe(cb): () => void`, delete `#triggerAttached`. Keep validation at the `Motion` boundary. Record the `Object.freeze` removal rationale in `DECISIONS.md`.

**Stage 3 — adapters, then simplification.** T7 with the scheduler hop retained inside `Motion`, followed by T11 once B3 is real. Not before.

Per brief rule 5, every stage needs a test that fails on the starting commit. Stage 1 is the awkward one: a pure refactor has no new behavior to fail on. Land Stage 1 as an explicitly refactor-only change with a green-to-green claim rather than manufacturing a fake failing test.

---

## 4. Adjacent findings: bugs and other things worth attention

Found while verifying the article. None of these are article claims; all are independent.

### B1 — High. Multi-track motions only publish the first track

`engine.ts`, in the `Motion` options:

```ts
invalidate: (progress) => {
  const first = ids[0];
  if (first) runtime.seek(first, progress);
},
```

`Motion.#setProgress` calls `setProgress` on **every** track entry, then invalidates using **only** `ids[0]`. Tracks 2..n receive the new progress locally but are never seeded into `GraphRuntime.invalidate`, so they emit no patch unless they happen to be downstream of track 0 in the observation graph. A two-track motion renders one track.

Secondary: `ProjectRuntime.seek` then calls `#setProgress(nodeId, progress)` again on track 0, which `Engine` wires to `tracks.get(nodeId)!.setProgress(progress)`. Track 0's progress is set twice per update. Idempotent today, but it is a double write across two owners.

Suggested fix: seed all `ids`, or give `ProjectRuntime` a multi-seed entry point. `GraphRuntime.invalidate` already accepts an array.

### B2 — High. `stagger` is computed and discarded

`Motion.schedule()` returns `index * this.#stagger` and `reflow()` returns the same array. Nothing consumes either. `#setProgress` applies one identical progress value to every track. `MotionDefinition.stagger` is authored, validated by the constructor, threaded through `Engine`, and then has no effect on output. Either wire offsets into `#setProgress` or remove the field from the schema, but it should not stay half-present.

### B3 — High. The `"time"` trigger type is inert through `Engine`

`Engine.load` passes `listenToClock: false` for every motion. Nothing else advances position over time. `test/integration/motion-trigger-types.test.ts` proves clock-driven advance works, but it constructs `Motion` directly with the default `listenToClock: true`, so the passing test does not cover the `Engine` path. A project authored `trigger: { type: "time" }` and loaded via `Engine.load` never animates.

This is the single most important finding in this document, and it is the reason T11 must wait. The brief's clock-ownership rule is not wrong; the missing piece is an owner (`ProjectRuntime`, most likely) that advances motion position from the one project clock.

### B4 — High. Failure containment leak in `Engine.load`

The `catch` block disposes motions and tracks but never disposes `runtime`. If `ProjectRuntime` construction succeeds and a later `Motion` construction throws (a duplicate track id or a negative `stagger` will do it), the `GraphRuntime` and its clock subscription survive as garbage, and `disposeComposition` never runs. Contradicts the brief's failure-containment requirement. Add `runtime?.dispose()` to the catch.

### B5 — Medium. Missing `duration` means a 1 ms animation

`Motion.#progressDelta`:

```ts
const duration = this.#tracks.reduce((max, entry) => Math.max(max, entry.duration ?? 1), 1);
return delta / duration;
```

The existing test uses `duration: 1000` with `clock.tick(250)` to reach `0.25`, which establishes duration as milliseconds. So the `?? 1` fallback means a track authored without `duration` completes in one millisecond, saturating to `1` on the first real frame. `duration` is optional in `TrackDefinition`. Either default to something meaningful or require it for clock-driven motions.

### B6 — Medium. Two uncoordinated writers for progress

`ProjectHandle.seek(nodeId, progress)` goes straight to `runtime.seek`, bypassing `Motion` entirely. `Motion.#position` is not updated, so after a host calls `handle.seek(...)`, `motion.position` reports a stale value and the next clock tick resumes from the stale one. `handle.seek` and `handle.signal` are both public and mutate the same underlying state through different paths with no reconciliation.

### B7 — Medium. Clamp versus throw on out-of-range progress

`Motion.seek` clamps to `[0, 1]`. The trigger path throws `RangeError` via `assertProgress`. Same logical operation, two contradictory contracts, both reachable from the public handle. Pick one.

Related: `Motion.seek` bypasses `#scheduler` and mutates synchronously, while `#onTrigger` and `#onTick` both hop through it. The brief requires signals to pass through the Scheduler; `seek` is a hole in that guarantee.

### B8 — Medium. Signals are silently swallowed when not playing

After `pause()`, the trigger is detached, so `BaseTrigger.emit` hits `this.#emit?.(...)` with `#emit === undefined` and drops the command with no error and no diagnostic. `#onTrigger` independently guards on `!this.#playing`. A host calling `handle.signal(...)` on a paused motion gets silence, not feedback.

This is also why `Engine.load` calls `motion.play()` on every motion immediately at load, including `"scroll"` and `"manual"` ones: not because they should be playing, but because signals are discarded otherwise. `playing` currently means "accepts input", not "is advancing". Worth a diagnostic and a clearer name.

### B9 — Medium. `stagger` and trigger metadata escape validation

`validate-v5.ts` checks `trigger` is an object with a supported `type`, and never looks at `stagger` or any other trigger field. But `Motion`'s constructor throws `TypeError` on a non-finite or negative `stagger`. So `{ stagger: -1 }` passes `validateV5`, is deep-frozen as a valid project, and then blows up mid-`Engine.load` as a raw exception instead of arriving as a `Diagnostic`. Validation should own it. `MotionDefinition.trigger` also permits arbitrary extra keys (`[key: string]: unknown`) with no validation, which is defensible as adapter config but should be a documented decision.

### B14 — Medium. Public method, unexported parameter type

`packages/core/src/index.ts` exports `ProjectHandle`, whose signature is `signal(motionId: string, signal: TriggerSignal): void`. `TriggerSignal` is **not** exported from the entrypoint. External TypeScript consumers cannot name the type of an argument to a public method. Export `TriggerSignal` (from `ports/trigger.ts` after T8), or change the signature. This blocks any real consumer, including the walker demo.

### B10 / B11 / B12 — Low

- **B10.** `TriggerCommand.play` / `pause` dead surface (same as T2).
- **B11.** `BaseTrigger.attach` argument-validation ordering (see T4).
- **B12.** `engine.ts` uses `let runtime: ProjectRuntime; runtime = new ProjectRuntime(...)` where the closure could capture a `const`. Harmless, but it reads like a deliberate TDZ dance and will attract review noise.

---

## 5. Documentation conflict to resolve

`docs/TRIGGER-REFACTORING-FEASIBILITY.md` already exists on this branch and recommends a **different** end state: delete triggers, and express scroll as a polymorphic `Clock` (`createScrollClock`, `createGsapScrollClock`) so that `Motion.#onTick` handles every source uniformly.

The article rejects exactly that, in its "is a trigger a clock?" section. **The article is right and the existing document is wrong**, for one concrete reason: `Motion.#onTick` _accumulates_ (`#position + delta/duration`) while scroll is _absolute_. A `ScrollClock` would have to emit synthetic deltas reverse-engineered from an absolute scroll position, which breaks the moment scroll direction reverses or the user jumps the scrollbar. Worse, it needs a second clock instance per scroll-driven motion, which collides head-on with brief rule 4, "keep one clock owner per project, no second RAF/ticker." The existing document even lists that rule under "Upside," claiming alignment. It does not align.

Secondary problems with the existing document: it asserts "nothing is exported yet (triggers are internal), safe window to change" while `ProjectHandle.signal` publicly takes a `TriggerSignal` (B14); and it proposes `createGsapScrollClock` in core, which cuts against ADR-015 keeping GSAP contained to the interpolator.

**Recommendation.** Supersede `docs/TRIGGER-REFACTORING-FEASIBILITY.md` with this assessment per documentation rule 4, keeping only its two durable observations (the three-classes-one-behavior finding, and the point that time progression already lives in `Motion` rather than in `TimeTrigger`). Record the accept/reject in `DECISIONS.md`. Do not leave both documents standing.

---

## 6. Verdict

Adopt the article's direction: trigger is a port, one implementation, adapter-owned drivers, `Clock` and `Trigger` kept as separately named interfaces. Do not adopt its final "just an optional port" step until B3 gives the clock-driven branch something real to do. Fix Stage 0 first; the trigger refactor is cosmetic next to a `"time"` trigger that does not tick and a multi-track motion that publishes one track.
