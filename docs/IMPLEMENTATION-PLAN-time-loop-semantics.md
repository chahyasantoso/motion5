# Implementation plan: time loop semantics

**Status:** implemented

**Date:** 2026-08-19

**Issue:** [#156](https://github.com/chahyasantoso/motion5/issues/156)

**Record:** [ADR-040](./ADR-040-time-loop-semantics.md)

This is a new plan, not an amendment. `docs/archived/IMPLEMENTATION-PLAN-trigger-drivers.md` and its T4/T5 successor closed with the driver question answered: which driver a declared trigger gets, and who feeds it. Loop behavior is a different question with a different owner, and folding it into a completed plan would make both citations two-valued.

## 0. Non-negotiables

1. One owner for loop state and cycle arithmetic.
2. No trigger-kind branching added to `Motion`. `Motion` is not modified at all.
3. Existing non-looping time behavior stays byte-for-byte compatible.
4. One clock subscription per project and one clock consumer per Motion, unchanged.
5. No field is accepted and then ignored.
6. Failing-first evidence is executed and archived, not described.

## 1. Problem

Time-trigger validation rejected `repeat` and `yoyo` whenever present, and the driver latched at `1` and emitted nothing further. Both were deliberate placeholders for an undesigned contract. Four questions have to be answered together, because each has a plausible wrong answer: whether the initial pass counts as a repeat, what a boundary tick emits, what a multi-cycle tick emits, and what unbounded elapsed time does to precision.

## 2. Locked decisions

1. `repeat` counts passes after the initial one; a finite loop runs `repeat + 1` cycles.
2. `-1` is the only spelling for infinite. `Infinity` is not accepted, so the field stays serializable.
3. `yoyo` reverses odd cycle indices and requires a repeat that repeats.
4. Ping-pong is `{ repeat: -1, yoyo: true }`, not a third field.
5. Cycles are half-open at the start and closed at the end.
6. Direction is derived from the cycle index, never from a toggled flag.
7. One tick, one emission. Crossed cycles are not replayed.
8. Infinite loops reduce elapsed time into one period, so state stays bounded.
9. The loop cycle has no pause. Playback belongs to `Motion`.

## 3. Owner and arithmetic

`createLoopCycle({ duration, repeat, yoyo })` returns `{ completed, elapsed, advance(delta) }` and is the only place the following runs:

- `totalDuration = repeat === -1 ? Infinity : (repeat + 1) * duration`
- `period = (yoyo ? 2 : 1) * duration`
- on advance: accumulate, clamp to `totalDuration` and latch when a finite loop is finished, otherwise reduce by whole periods when infinite
- `index = ceil(elapsed / duration) - 1`, `position = clamp(elapsed / duration - index)`
- `progress = yoyo && index odd ? 1 - position : position`

The completion latch moved here from the driver, because completion is loop state. `duration` is not re-validated here; `createTimeDriver` and `validateMotionTrigger` already own that message.

## 4. Authored schema and validation

`TimeTriggerDefinition` gains `repeat?: number` and `yoyo?: boolean`. `trigger-time-repeat-unsupported` is deleted and replaced by `trigger-time-repeat-shape`, `trigger-time-yoyo-shape`, and `trigger-time-yoyo-requires-repeat`. Runtime `addMotion` inherits all of it through `resolveTriggerDefinition`, which is the single narrowing boundary, so authored and runtime parity needs no second code path and only needs proving.

## 5. Interaction with existing owners

Stagger, the single clock consumer, `seek`, disposal, and pause are covered in the "deliberately not changed" section of ADR-040. Each is pinned by a case rather than asserted in prose, except pause, which has no public surface and is pinned at `Motion` instead.

## 6. Evidence and the failing-first constraint

The `Recovery audit` failing-first job replays new test files against the parent and treats import-resolution or config red as no evidence. Every case in this slice therefore asserts through modules that already exist on the parent: `resolveTriggerDefinition`, `validateMotionTrigger`, `createTriggerFactory`, `Engine`, and `Motion`. No new test imports the module this plan introduces. On the parent those calls reject the loop fields, which is assertion-level red about behavior.

Commit one is tests only. Commit two is the implementation and the records. Red is run [32221562839](https://github.com/chahyasantoso/motion5/actions/runs/32221562839), archived at `logs/32221562839/`, reporting `20 failed | 497 passed` in `quality`.

Cases `L-1` through `L-10` cover boundaries and overshoot; `L-11` through `L-21` cover validation, lifecycle, and authored/runtime parity.

## 7. Files

- `packages/core/src/adapters/trigger-factory/loop-cycle.ts`, new owner
- `packages/core/src/adapters/trigger-factory/time-driver.ts`, composes the cycle
- `packages/core/src/adapters/trigger-factory/default.ts`, forwards the loop fields
- `packages/core/src/contract/v5.ts`, two optional fields
- `packages/core/src/contract/validate-v5.ts`, one rule out, three in
- two new test files, plus the `L-` widening in `evidence-case-ids.test.ts`
- `docs/ADR-040-time-loop-semantics.md`, this plan, and `docs/acceptance-map.json`

## 8. Out of scope

Easing per cycle, a repeat delay, a loop completion callback, and playback pause. Each is a separate authored field with its own owner question, and none of them is needed to make a loop run.
