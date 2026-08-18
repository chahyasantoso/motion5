# Implementation Plan: T4 runtime Motion parity and T5 removal of inert trigger semantics

**Status:** Committed plan. Section 1 is locked and MUST NOT be re-litigated.

**Branch base:** `feat/adopt-motion-track`, after [#126](https://github.com/chahyasantoso/motion5/pull/126) squash-merges. This plan reads the tree as it exists on `feat/option-c-motion-track-resolution` at `d022b67`.

**Implements:** slices `T4` and `T5` of `docs/IMPLEMENTATION-PLAN-trigger-drivers.md` section 7, as amended by `docs/IMPLEMENTATION-PLAN-trigger-drivers-corrections.md`.

**Depends on:** option C (ADR-031). `Motion` resolves compiled Tracks by id, so nothing in this plan may reintroduce a captured `Track`.

**Two pull requests, not one.** `T4` and `T5` are separate slices with separate invariants. `docs/PR-WORKFLOW.md` allows one meaningful invariant per pull request, and these are two.

---

## 0. How to use this plan

This plan is written to be executed by an implementer with **no authority to change the design**. Read this section before touching code.

### 0.1 Non-negotiables

1. **Do not re-open section 1.** Every decision is made. If you believe one is wrong, stop and raise it. Do not implement an alternative.
2. **Do not widen a slice.** Section 7 is the forbidden list. Work outside the file lists in sections 3 and 5 is drift, even when it is an obvious improvement.
3. **Do not touch `packages/core/src/domain/motion.ts`.** Neither slice needs it. ADR-031's source guard (`C-3` in `motion-track-resolution.test.ts`) must stay green without being edited, and `MotionTrackEntry` stays `{ id, duration? }`.
4. **Do not add a second Motion construction path.** `Engine.load()`'s `buildMotion` closure is the only one. It is already reused by the `createMotion` hook, and that is the property `T4` is protecting, not introducing.
5. **Do not add `if (trigger.type === ...)` anywhere outside the trigger factory.** `Motion` and `Engine` stay ignorant of trigger kinds. Capability flags and `ClockBinding` carry the information.
6. **Do not gate `seek`.** See `T5-5`. `seek` is node-level scrubbing and is deliberately not covered by `acceptsExternalSignal`.
7. **Every commit must leave `npm run check` green** (`format:check` plus `typecheck` plus `test`). No skipped, `.todo`, `.only`, deleted, or weakened test.
8. **Error message strings and rule ids in this plan are the contract.** Use them verbatim; they are asserted by tests and consumed by editors.
9. **Run `npm run format` before every push.** Both slices edit `docs/SESSION-STATUS.md`, which is the file behind the two most recent archived formatting failures on this base. The write-enabled `format` job only runs after all five behavioral jobs are green, so cosmetic drift costs a full CI cycle.

### 0.2 Required reading before you start

Read these in full. They are what you change or must not break.

- `packages/core/src/runtime/project-runtime.ts` (`addMotion`, `destroyMotion`, `#addTrack`, `#removeTrack`, `#replaceTrack`)
- `packages/core/src/engine.ts` (`load`, `buildMotion`, `releaseMotion`, the `createMotion` and `destroyMotion` hooks, `onClockTick`, `disposeComposition`, and the outer `catch`)
- `packages/core/src/ports/trigger-factory.ts` (`ClockBinding`, `CreatedTrigger`, `TriggerFactoryContext`)
- `packages/core/src/adapters/trigger-factory/default.ts` (`createTriggerFactory`, the scroll resolver, the `trigger-driver-unavailable` throw)
- `packages/core/src/adapters/trigger-factory/time-driver.ts`
- `packages/core/src/contract/validate-v5.ts` (`validateMotionTrigger`, `resolveTriggerDefinition`)
- `packages/core/src/ports/fakes.ts` and `packages/core/src/ports/clock.ts`
- `packages/core/test/integration/motion-trigger-types.test.ts`, `trigger-time.test.ts`, `trigger-scroll.test.ts`, `runtime-motion-lifecycle.test.ts`, `runtime-motion-trigger-validation.test.ts`
- `docs/ADR-028-runtime-motion-trigger-validation.md`, `docs/ADR-030-scroll-trigger-source-injection.md`, `docs/ADR-031-motion-track-resolution-by-id.md`
- `docs/PR-WORKFLOW.md` and `docs/CI-WORKFLOW.md`

Test runner is **vitest**. Helpers live in `packages/core/src/ports/fakes.ts` (`createFakeInterpolator`, `createFakeScheduler`, `createFakeTriggerPort`, `createFakeTrackRegistry`) and `packages/core/src/ports/clock.ts` (`createManualClock`). There is no `packages/core/test/support/` directory. Do not create one, and do not write replacement fakes.

### 0.3 Position in the sequence

`T0` through `T3` have landed. Option C has landed. The trigger-validation half of `T4` landed with ADR-028. What remains of `T4` is **creation and destruction ordering**, plus the parity evidence that was never written. `T5` is then mostly proof and documentation, because the inert manual fallback is already gone from the factory. Read section 2 before assuming otherwise; a large part of both original slice descriptions is already true.

---

## 1. Locked decisions

### T4

**T4-1. A runtime Motion is created before anything is committed, and a failed creation rolls the graph back.**

`ProjectRuntime.addMotion` today mutates in this order: validate trigger, reject non-empty tracks, reject duplicate id, `replaceGraph(candidate)`, `#motions.set(...)`, `#createMotion?.(...)`. The last call can throw, and when it does the definition is already committed and the graph is already replaced. The new order is:

1. validate trigger through `validateMotionTrigger`
2. reject non-empty `tracks`
3. reject duplicate id
4. `#createMotion?.(accepted)`
5. `replaceGraph(candidate)` inside a `try`, and on failure `#destroyMotion?.(accepted.id)` then rethrow the original error
6. `#motions.set(accepted.id, accepted)`

This mirrors `#addTrack`, which already compiles first and disposes on graph rejection. The precedent is in the same file; follow it rather than inventing a rollback shape.

**T4-2. `destroyMotion` ordering is already correct and stays byte-identical.**

Validate unknown id, reject while it still owns tracks, `replaceGraph` without it, delete from `#motions`, then `#destroyMotion?.()`. `Engine`'s hook releases the clock consumer, disposes the created trigger, disposes the Motion, and deletes the map entry, in that order. Do not touch it. `T4` adds the missing test, not a change.

**T4-3. Disposal is exactly once, and idempotence is not a licence to double-dispose.**

`releaseMotion` deletes from `createdTriggers`, so `disposeComposition`'s later loop cannot reach an already-released trigger. `CreatedTrigger.dispose` is contractually idempotent, but the tests assert a counter of exactly `1`, not "at least 1". Idempotence is the safety net, not the expected behavior.

**T4-4. No second construction path, and no per-type branch outside the factory.**

Runtime Motions go through the same `buildMotion` closure, the same `resolveTriggerDefinition` narrowing, the same `triggerFactory`, and the same exhaustive `ClockBinding` switch. If you find yourself needing a runtime-only branch, the design is wrong.

**T4-5. Parity is proved by comparing emitted progress sequences, not by asserting a final value.**

A runtime-created `time` Motion and a load-time authored one must produce the **same sequence** for the same ticks. A single end-state assertion would pass under a double advance, which is precisely the trap section 6.3 of the trigger plan exists to catch.

**T4-6. Failure leaves nothing behind, and "nothing" is enumerated.**

After a rejected `addMotion`: no entry in `ProjectRuntime`'s motion map, no graph node, no clock consumer, no undisposed trigger, no compiled `Track`, and `instanceCount` unchanged. Assert all of them, not just the throw.

### T5

**T5-1. A declared trigger type never resolves to a manual fallback, and this is proved by source, not by behavior.**

`createManualTriggerPort` may be called from exactly two places in `packages/core/src`: its own definition site in `ports/trigger.ts`, and the manual branch of `adapters/trigger-factory/default.ts`. A source-level assertion enforces it, in the same spirit as ADR-031's `C-3`. A behavioral test cannot see a fallback that happens to be unreachable today.

**T5-2. Tests that assert all three trigger types share the manual signal path are retired, not relaxed.**

`motion-trigger-types.test.ts` currently asserts that `manual`, `scroll`, and `time` all "use the same scheduled progress path", by constructing `Motion` directly around track doubles. That claim is exactly the inert semantics `T5` removes. Replace the three cases with per-type assertions on the real factory output. Do not merely rename them.

**T5-3. `docs/PUBLIC-API.md` does not exist. Do not create it.**

Section 7 of the trigger plan named it; the repository has no such file. The documentation targets are `docs/ARCHITECTURE.md`, `docs/AUTHORED-SCHEMA.md`, `docs/DECISIONS.md`, `docs/MIGRATION-V4-TO-V5.md`, and `docs/SESSION-STATUS.md`. Creating a new public-API document is a new surface and a separate slice.

**T5-4. The migration note states the five rejections verbatim.**

`time` requires a finite `duration` greater than zero; `repeat` and `yoyo` are rejected at any value, including `0`; `autoplay` may be absent or `true` and `false` is rejected; a declared `scroll` source with no registered resolver rejects both `load()` and `addMotion`; `signal()` on a driver-backed Motion throws `Motion has a configured trigger driver and does not accept external signals.`

**T5-5. `seek` is documented, not gated.**

`ProjectHandle.seek(nodeId, progress)` writes node progress directly and bypasses the owning Motion. On a driver-backed Motion the next driver emission overwrites it. This is legitimate scrubbing and is **not** the hole that locked decision 4 closes: `signal()` is Motion-level, `seek` is node-level. Document the interaction and leave the behavior alone.

**T5-6. Loop semantics stay undesigned.**

Only after `T5` lands may `repeat`, `yoyo`, ping-pong, or any looping behavior be designed, and that is a new plan rather than an extension of this one.

---

## 2. Verified current state

Every claim below was read out of the tree at `d022b67`, not assumed. Read it before writing code; most of the original slice text is already satisfied.

1. `ProjectRuntime.addMotion` already calls `validateMotionTrigger(definition.trigger, ...)` and throws `describeDiagnostics(...)` when any diagnostic is an error. ADR-028 is accepted. **The validation half of `T4` is done.**
2. `Engine`'s `createMotion` hook is `(definition) => motions.set(definition.id, buildMotion(definition, []))`. There is already exactly one construction path. **`T4`'s "same `buildMotion` closure" requirement is already met.**
3. `buildMotion` wraps `new Motion(...)`, `play()`, and consumer registration in a `try`, and its `catch` calls `releaseMotion(definition.id)`, which deletes the clock consumer and disposes the created trigger before rethrowing. **Driver disposal on construction failure is already correct.**
4. `createTriggerFactory` throws a `trigger-driver-unavailable` `TypeError` naming the motion id and source key when a `scroll` trigger has no resolved source. It throws from `create(...)`, before `createdTriggers.set(...)`, so nothing is registered and nothing leaks inside `Engine`.
5. **The gap.** Because `addMotion` commits before it calls `#createMotion`, a throw from step 4 leaves `ProjectRuntime` holding a motion definition and a replaced graph while `Engine`'s `motions` map holds nothing. The cascade is worse than the ghost: a later `addTrack(track, { motionId: ghost })` passes the `#motions.has` check, compiles a `Track`, replaces the graph, commits the entry to `#tracks`, and only then throws `Unknown motion "<id>".` from the `addMotionTrack` hook, before `mount(id)` runs. The result is a committed, compiled, unmounted track plus a live graph node for a Motion that does not exist. `destroyMotion(ghost)` does clear it, but silently, so nothing surfaces the original cause.
6. `ProjectRuntime.destroyMotion` validates, refuses while owned tracks remain, replaces the graph, deletes from `#motions`, then calls the hook. `Engine`'s hook is `releaseMotion` then `motion.dispose()` then `motions.delete(...)`. **Ordering already matches `T4`. Only the test is missing.**
7. `onClockTick` collects per-consumer failures and throws the single error, or an `AggregateError`, after the loop. `GraphRuntime.#onTick` catches and records a `flush-failure` diagnostic, so a driver failure is observable as a diagnostic rather than as a thrown error at the call site. Relevant to `T4`'s assertions: do not assert that a tick throws to the caller.
8. `ClockBinding` is a total tagged union with `driver`, `motion`, and `none`, and the registration site is an exhaustive `switch` with no `??` fallback. `manual` is `motion`, `time` is `driver`, `scroll` is `none`. **No Motion can hold both a driver and its own clock advance.**
9. `default.ts` has **no inert fallback left**. `time` returns `createTimeDriver(trigger.duration)`, `scroll` either resolves a real source or throws, and only the `manual` branch reaches `createManualTriggerPort()`. **`T5`'s structural work is already done; what is missing is the proof, the misleading tests, and the documentation.**
10. `motion-trigger-types.test.ts` still contains three cases named "manual signals use the same scheduled progress path", "scroll signals ...", and "time signals ...", built on `vi.fn()` track doubles passed through `resolveTrack: () => current as never`. These are the `T5-2` targets, and they are the last `as never` casts in the trigger suites.
11. `docs/PUBLIC-API.md` does not exist. `docs/ARCHITECTURE.md`, `docs/AUTHORED-SCHEMA.md`, `docs/DECISIONS.md`, and `docs/MIGRATION-V4-TO-V5.md` do.
12. The highest ADR on this base is `ADR-031`. This plan therefore claims `ADR-032` for `T4` and `ADR-033` for `T5`.
13. Whether `MotionOptions.disposeTracks` defaults to `true` or `false` is unresolved review feedback on #126. **Neither slice may depend on the default.** Every Motion in both slices is constructed through `Engine`, which passes `disposeTracks: false` explicitly.

---

## 3. T4, the change, file by file

Four files. Nothing else.

### 3.1 `packages/core/src/runtime/project-runtime.ts`

Reorder `addMotion` per `T4-1`. Everything above the mutation sequence, including the trigger validation and both rejections, is unchanged.

```ts
addMotion(definition: MotionDefinition): { readonly id: string } {
  this.#assertLive();
  const triggerDiagnostics = validateMotionTrigger(
    definition.trigger,
    `addMotion(${definition.id}).trigger`,
  );
  if (triggerDiagnostics.some(({ severity }) => severity === "error"))
    throw new TypeError(describeDiagnostics(triggerDiagnostics));
  if (definition.tracks.length > 0)
    throw new TypeError(`Runtime Motion "${definition.id}" must start with empty tracks.`);
  if (this.#motions.has(definition.id))
    throw new TypeError(`Motion "${definition.id}" already exists.`);
  const accepted = { ...definition, tracks: [] };
  const next = new Map(this.#motions);
  next.set(accepted.id, accepted);
  // Build the Motion before committing anything. A driver that cannot be created, such as a
  // scroll trigger with no registered source, must not leave a definition or a graph node
  // behind. Mirrors #addTrack, which compiles first and disposes on graph rejection.
  this.#createMotion?.(accepted);
  try {
    this.#graph.replaceGraph(this.#snapshot(this.#tracks, next));
  } catch (error) {
    this.#destroyMotion?.(accepted.id);
    throw error;
  }
  this.#motions.set(accepted.id, accepted);
  return Object.freeze({ id: accepted.id });
}
```

The rollback reuses the existing `destroyMotion` hook rather than adding a new one. `Engine`'s hook already releases the consumer, disposes the trigger, disposes the Motion, and deletes the map entry, which is exactly the rollback set, and it is a no-op when the id is absent.

If #126 landed without section 3.4's ordering comment above the `replaceMotionTrack` call in `#replaceTrack`, add it here:

```ts
// Must run after compileTrack: Motion resolves by id against the live compiled map,
// so an earlier call would resolve the disposed instance.
```

Nothing else in this file changes. `destroyMotion`, `#addTrack`, `#removeTrack`, `#replaceTrack`, `#replaceWithObservation`, and `#snapshot` are untouched.

### 3.2 `packages/core/src/engine.ts`

**No change.** Listed so you do not go looking for one. `buildMotion`, `releaseMotion`, both hooks, the fanout, and `disposeComposition` are already correct. If a `T4` test fails, the fix belongs in `project-runtime.ts` or in the test, not here.

### 3.3 New test file

`packages/core/test/integration/t4-runtime-motion-parity.test.ts`. Contents in section 4.

### 3.4 `docs/ADR-032-runtime-motion-creation-ordering.md`

New ADR, accepted, dated. Required sections:

- **Context.** `addMotion` committed the definition and the graph before the Motion existed, so a driver that could not be created left a ghost id that `addTrack` would accept and then reject from a hook, one layer too late to explain itself.
- **Decision.** `T4-1`'s six-step order, restated, plus `T4-6`'s enumeration of what "nothing left behind" means.
- **Relationship to ADR-028.** Validation rejects a bad definition; this ordering rejects an unbuildable one. Both now fail before any commit. ADR-028 is neither superseded nor edited.
- **Relationship to ADR-030.** `trigger-driver-unavailable` is the reachable trigger for this path, which is why the regression test uses a `scroll` definition with no resolver.
- **Evidence.** The new test file, by path, naming cases `T4-3` and `T4-6`.

### 3.5 `docs/SESSION-STATUS.md`

Add the slice, its pull request link, and its CI run. One status file. Do not create a parallel handoff note. Run `npm run format` after editing it.

---

## 4. T4 test plan

New file `packages/core/test/integration/t4-runtime-motion-parity.test.ts`. Drive the public `Engine` and `ProjectHandle` surface only. Use `createManualClock` plus `createFakeScheduler`, and flush explicitly between ticks, or `Motion.#scheduleProgress` coalescing will hide intermediate values. Comment _why_ each assertion exists, matching `test/unit/runtime/clock-tick-identity.test.ts`.

- **T4-1 parity of emitted sequences.** Load a project with an authored `{ type: "time", duration: 1000 }` Motion and one track. In a second `Engine`, load an empty project, `addMotion` the identical definition with empty tracks, then `addTrack(track, { motionId })`. Tick both with the same deltas, flushing between, and assert the two recorded progress sequences are **deeply equal**, including length. Record values through a node subscription, not by reading state once.
- **T4-2 validation parity.** `addMotion({ trigger: { type: "time" } })` with no duration throws with `trigger-time-duration` in the message, and afterwards `instanceCount` and the graph node count are unchanged. This overlaps `runtime-motion-trigger-validation.test.ts` deliberately; that suite proves the rule fires, this one proves nothing was committed.
- **T4-3 unbuildable driver leaves nothing behind.** With the default factory, `addMotion({ id: "late", trigger: { type: "scroll", source: "hero" }, tracks: [] })` throws with `trigger-driver-unavailable` and the motion id in the message. Then assert, in this order: a following `addTrack(track, { motionId: "late" })` throws `Unknown motion "late".`; `destroyMotion("late")` also throws `Unknown motion "late".`; the graph node count is unchanged; `instanceCount` is unchanged; and a subsequent `clock.tick(16)` plus flush records no diagnostic. _This is the required red evidence for the slice; it fails on the parent because the ghost definition makes both follow-up calls behave differently._
- **T4-4 destroy disposes the driver exactly once.** Inject `createTriggerFactory({ scroll })` with a resolver returning a counting fake `ScrollSource`. `addMotion` a scroll Motion, then `destroyMotion`. Assert the source's unsubscribe counter is exactly `1`, then `clock.tick(16)` plus flush and assert the counter is still `1` and no emission reached the disposed driver.
- **T4-5 project dispose leaves zero live subscriptions.** Two scroll Motions and one time Motion. `handle.dispose()`, then assert every fake source's unsubscribe counter is exactly `1`, that the time driver's dispose counter is exactly `1`, and that a post-dispose tick emits nothing. _Exactly once, not at least once: `releaseMotion` deletes from `createdTriggers` so `disposeComposition`'s loop cannot reach it again, and a `2` here means that guarantee broke._
- **T4-6 rollback on graph rejection.** Force `replaceGraph` to reject during `addMotion` by injecting a `graphBuilder` that throws for a candidate containing the new motion id. Assert the throw propagates unchanged, the Motion was disposed, no clock consumer survives (a following tick reaches nothing and records no diagnostic), and the motion id is absent from every public surface. _This is the only test for the `catch` branch in 3.1; without it the rollback is unproved code._
- **T4-7 successful creation still registers exactly one clock consumer.** A runtime-created `time` Motion plus four authored `manual` Motions produce a `Clock.subscribe` call count of `1` for the project, and one tick advances the time Motion by exactly one step. _Guards non-negotiable 5 of the trigger plan across the runtime path._

### 4.1 Red-before-green evidence

`T4-3` and `T4-6` are the required red evidence and must be recorded in the pull request. `T4-1`, `T4-2`, `T4-4`, `T4-5`, and `T4-7` are behavior-preservation guards and should pass on the parent commit; if any of them is red there, stop, because you have found a separate bug and this plan is not the place to fix it.

### 4.2 Suites that must stay byte-identical through T4

`trigger-time.test.ts`, `trigger-scroll.test.ts`, `runtime-motion-lifecycle.test.ts`, `runtime-motion-trigger-validation.test.ts`, `issue-114-motion-track-regressions.test.ts`, `replace-motion-track.test.ts`, `option-c-track-resolution.test.ts`, `motion-track-resolution.test.ts`, `unified-mutation-surface.test.ts`, `observation-identity.test.ts`, `motion.test.ts`.

If any of them needs an edit to pass, **stop and escalate**. A green suite that had to be edited is not evidence of preserved behavior. This list is verified against the current tree rather than inherited, which is the mistake section 4.4 of the option C plan made.

---

## 5. T5, the change, file by file

Seven files. Nothing else.

### 5.1 `packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts`, new

The proof for `T5-1`. Two halves.

Source guard, read from disk, in the manner of ADR-031's `C-3`:

```ts
const FACTORY_SOURCE = readFileSync(
  fileURLToPath(new URL("../../../src/adapters/trigger-factory/default.ts", import.meta.url)),
  "utf8",
);
```

- **T5-1 manual port has exactly one call site in the factory.** `FACTORY_SOURCE.match(/createManualTriggerPort\(/g)` has length `1`, and it is not inside the `time` or `scroll` branch. Assert additionally that `engine.ts` contains zero matches.
- **T5-2 per-type capability matrix.** For `{ type: "manual" }`: `clockBinding.kind` is `"motion"` and `acceptsExternalSignal` is `true`. For `{ type: "time", duration: 1000 }`: `"driver"` and `false`. For `{ type: "scroll", source: "hero" }` with a resolver: `"none"` and `false`. Assert on all three fields for all three types, so a future regression cannot flip one silently.
- **T5-3 scroll without a resolver throws rather than degrading.** The thrown message contains `trigger-driver-unavailable`, the motion id, and the source key. No manual port is returned under any circumstance.

### 5.2 `packages/core/test/integration/motion-trigger-types.test.ts`

Retire the three "same scheduled progress path" cases per `T5-2`. Replace them with three cases driven through `Engine` and the real factory:

- `manual` accepts `signal()`, advances on the project clock, and still throws `RangeError` for progress outside `[0, 1]`.
- `time` rejects `signal()` with `Motion has a configured trigger driver and does not accept external signals.`, advances only through the driver, and latches at `1`.
- `scroll` rejects `signal()` with the same message, registers no clock consumer, and moves only when its source emits.

Delete the `vi.fn()` track doubles and the `resolveTrack: () => current as never` casts while you are in this file. Keep the two cases about clock ownership and pause or remount behavior unchanged, including their names.

### 5.3 `docs/ARCHITECTURE.md`

State that a declared trigger type selects a real driver or fails loudly, that there is no manual fallback for `time` or `scroll`, and that a Motion's relationship to the one project clock is the three-state `ClockBinding` rather than an optional callback.

### 5.4 `docs/AUTHORED-SCHEMA.md`

Document the per-type trigger shapes and every rejection in `T5-4`, with the exact rule ids: `trigger-shape`, `trigger-time-duration`, `trigger-time-autoplay-unsupported`, `trigger-time-repeat-unsupported`, `trigger-scroll-source`, `trigger-driver-unavailable`. State that `autoplay` is representable only as absent or `true`, and that `repeat` and `yoyo` are rejected at any value including `0`.

### 5.5 `docs/MIGRATION-V4-TO-V5.md`

Add the migration note from `T5-4` as a list of breaking changes, each with the error a caller will actually see.

### 5.6 `docs/DECISIONS.md`

Record `T5-5`: `seek` is node-level scrubbing, is not gated by `acceptsExternalSignal`, and a driver-backed Motion overwrites a seeked value on its next emission. State that this is intended and that gating it would need a new decision.

### 5.7 `docs/ADR-033-no-manual-trigger-fallback.md`

New ADR, accepted, dated. Context: `trigger.type` was decorative and every type resolved to a manual port. Decision: `T5-1` through `T5-5` restated. Consequences: loop semantics may now be designed as a separate plan, and the three adjacent findings in section 8 of the trigger plan remain open. Evidence: the two test files by path. Do not supersede or edit ADR-028 or ADR-030.

Also update `docs/SESSION-STATUS.md` in the same pull request.

---

## 6. T5 test plan

Beyond section 5.1 and 5.2:

- **T5-4 no inert semantics survive anywhere.** Grep-style source assertions: zero occurrences of `createManualTriggerPort` in `engine.ts`, exactly one in `default.ts`, and zero in any file under `src/adapters/trigger-factory/` other than `default.ts`.
- **T5-5 seek interaction is pinned by a test, not only by prose.** On a `time` Motion, `handle.seek(nodeId, 0.9)` applies, then one driver tick overwrites it with the driver's value. Assert both steps. This documents the behavior in executable form without gating it.
- **T5-6 documentation drift guard.** If `public-declaration-surface.test.ts` covers documented exports, run it unchanged and do not edit its allowlist. `T5` changes no exports.

No red-before-green evidence is required for `T5`, because it removes a claim rather than changing a behavior. Say so explicitly in the pull request instead of inventing a failing test to satisfy the guardrail.

---

## 7. Forbidden in these slices

- Editing `packages/core/src/domain/motion.ts`, `packages/core/src/domain/track.ts`, or `packages/core/src/index.ts`.
- Reintroducing a `Track` instance into `MotionTrackEntry`, or caching a resolved `Track` anywhere.
- Adding a second Motion construction path, or a runtime-only trigger branch.
- Reading `trigger.type` outside `adapters/trigger-factory/`, or reading `context.definition.trigger` instead of `context.trigger`.
- Changing `ClockBinding` into an optional callback plus a flag, or adding a `??` fallback at the registration site.
- Gating `seek` behind `acceptsExternalSignal`.
- Unifying `manual` onto the time driver. It is tracked debt from section 6.3 of the trigger plan and will break a large number of existing tests.
- Designing `repeat`, `yoyo`, looping, or ping-pong semantics.
- Fixing the adjacent findings still open from the trigger plan: `edgeKey`'s `|` separator collision (8.2), `seek` bypassing the Motion beyond documenting it (8.3), and the `signal()` versus manual-port range disagreement (8.4).
- Creating `docs/PUBLIC-API.md`, or any parallel status or handoff document.
- Any new flag, mode, alias, or facade. If one becomes unavoidable, stop; `docs/DECISIONS.md` would need to change and that is a different conversation.

---

## 8. Acceptance gates

Nothing lands until all of these hold, per slice.

### 8.1 Commands

`npm run check` green locally, then all seven CI jobs green: `quality`, `integration`, `boundaries`, `build`, `end-to-end`, `performance`, `format`.

### 8.2 Grep gates

- `createManualTriggerPort` in `packages/core/src`: exactly two sites, its definition in `ports/trigger.ts` and one call in `adapters/trigger-factory/default.ts`. Zero in `engine.ts`.
- `entry.track` in `packages/core/src`: **zero**. ADR-031's invariant must survive both slices.
- `trigger.type` in `packages/core/src` outside `adapters/trigger-factory/` and `contract/`: **zero**.
- `same scheduled progress path` anywhere in the test suite after `T5`: **zero**.
- `as never` in `packages/core/test/integration/motion-trigger-*.test.ts` after `T5`: **zero**.

### 8.3 Counting gates

- Total test count strictly increases against the parent commit for each slice. Re-measure on your actual parent; do not hardcode a baseline from an older run.
- Zero `.skip`, `.todo`, `.only`, or commented-out test introduced.
- Every rule id named in `T5-4` has a test asserting it by exact string.
- `Clock.subscribe` call count is `1` per loaded project, including projects whose Motions were created at runtime.
- `boundary-scan` and `public-declaration-surface.test.ts` green with no allowlist edit.

### 8.4 Semantic size

`T4` is four semantic files. `T5` is seven. Both are far under the twenty-file ceiling in `docs/PR-WORKFLOW.md`. If either diff exceeds ten files, you have drifted; re-read sections 3 and 5.

---

## 9. Commits and pull requests

### 9.1 T4

Commit sequence, in order:

1. `test(runtime): red suite for runtime Motion creation ordering` - the new test file only. Capture the red output for `T4-3` and `T4-6` before moving on.
2. `fix(runtime): build a runtime Motion before committing it` - `project-runtime.ts`. Green after this commit.
3. `docs(adr): record runtime Motion creation ordering` - ADR-032 and `SESSION-STATUS.md`.

Pull request body, per `docs/PR-WORKFLOW.md`:

1. **Invariant:** a runtime-created Motion is indistinguishable from an authored one, and a creation that cannot be completed leaves no definition, graph node, clock consumer, trigger, or compiled Track behind.
2. **Evidence:** `t4-runtime-motion-parity.test.ts`, cases `T4-1`, `T4-3`, and `T4-6`.
3. **Ownership:** `ProjectRuntime` gains the commit decision and loses the ability to publish a motion id it could not build. `Engine` gains nothing; its hooks were already correct.
4. **Public surface:** unchanged.
5. **Deletions:** the premature `#motions.set` and `replaceGraph` ordering in `addMotion`.
6. **Status:** `SESSION-STATUS.md` updated here, not promised.

### 9.2 T5

Commit sequence, in order:

1. `test(trigger): assert no manual fallback for declared trigger types` - the new unit file and the `motion-trigger-types.test.ts` rewrite.
2. `docs(trigger): remove inert trigger semantics from the documented contract` - the four docs, ADR-033, and `SESSION-STATUS.md`.

Pull request body:

1. **Invariant:** a declared trigger type selects a real driver or fails loudly. No type resolves to a manual fallback, and the source guard makes it undriftable.
2. **Evidence:** `trigger-factory-no-fallback.test.ts` plus the rewritten `motion-trigger-types.test.ts`.
3. **Ownership:** the trigger factory is the only object that knows trigger kinds. No second owner is introduced.
4. **Public surface:** unchanged. Documented schema now matches enforced schema.
5. **Deletions:** the three tests asserting a shared manual signal path, and the last `as never` track doubles in the trigger suites.
6. **Status:** `SESSION-STATUS.md` updated here, not promised.

Formatting never shares a behavior commit. If the `format` job pushes a `chore: apply prettier` child commit, review it as mechanical-only and let it ride into the squash. Squash merge only when every required check is green. Never weaken a test to merge.

Link the original Actions run as the primary citation. Failed `CI` runs are archived on the `ci-logs` branch at `logs/<run-id>/` with `README.md`, `run.json`, and `failed-jobs.log`. If a run you need is missing, dispatch **Archive CI logs** manually with the run id. Never develop on `ci-logs`.

---

## 10. Bottom line

Most of what the original `T4` and `T5` descriptions asked for is already true. What is left is narrow and specific.

`T4` is one ordering bug and the parity evidence nobody wrote. `addMotion` publishes a motion id before it knows the Motion can exist, and the only reachable failure, a scroll trigger with no registered source, turns that into a ghost whose real cause surfaces one call later from the wrong layer.

`T5` is not a refactor at all. The fallback is already gone from the factory; the tests and the documentation still describe a world where it exists.

The decisive rules, restated so they cannot drift:

- **Nothing is committed until it can be built.** Validate, construct, then commit; roll back the graph if it rejects.
- **One construction path, one factory, one clock consumer per Motion.** Never a driver and `motion.onTick`.
- **A declared trigger type either selects a real driver or fails loudly.** Never a silent fallback, never an accepted-but-ignored field.
- **`seek` is scrubbing, `signal()` is control.** Document the difference; do not merge them.
- **Proof lives where drift happens.** Behavior tests for behavior, source guards for structure.
