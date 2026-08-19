# ADR-040: loop state has one owner, and `repeat` counts the passes after the first

**Status:** accepted

**Date:** 2026-08-19

**Closes:** [issue #156](https://github.com/chahyasantoso/motion5/issues/156)

## Context

`{ type: "time", duration }` produced exactly one forward pass. `validateMotionTrigger` rejected `repeat` and `yoyo` at any value, including `0`, with `trigger-time-repeat-unsupported`, and `createTimeDriver` accumulated its own `elapsed`, emitted `Math.min(1, elapsed / duration)`, and latched the first time progress reached `1`.

The rejection was correct for its moment. Loop semantics were undesigned, and a field that validates has to be honored, so refusing the fields beat accepting them and animating one pass anyway. The cost was that every looping animation the predecessor could express had no v5 spelling at all, and a migrated v4 document carrying `repeat: -1` failed validation instead of loading.

What made this a design rather than a patch is that four separate questions all resolve to arithmetic, and each of them has a wrong answer that looks reasonable: whether the initial pass is a repeat, what a cycle boundary emits, what a tick that crosses several cycles emits, and what an infinite loop does to accumulated state.

## Decision

**One owner.** `createLoopCycle` in `packages/core/src/adapters/trigger-factory/loop-cycle.ts` owns loop state, the cycle index, the direction, and completion. `createTimeDriver` keeps the emission channel, the rule that a finished loop stops emitting, and disposal; it no longer counts elapsed time itself. `Motion` is untouched, and no trigger-kind branch was added to it.

**`repeat` counts the passes after the initial one.** A finite loop runs `repeat + 1` cycles, so `repeat: 0` is a single pass and is byte-for-byte the previous behavior. `-1` is infinite. This matches the interpolation engine ADR-015 keeps as the behavioral oracle, which is what lets a migrated v4 document keep its timing rather than gain a cycle.

**Ping-pong is not a third field.** Ping-pong is `{ repeat: -1, yoyo: true }`. A `pingPong` key would be a second authored spelling for one behavior, which ADR-003 rules out.

**Cycles are half-open at the start and closed at the end.** With `index = ceil(elapsed / duration) - 1` and a position in `(0, 1]`, a tick landing exactly on a boundary reads as the end of the cycle it completed. The floor convention with a position in `[0, 1)` never emits `1` for any cycle but the last, so a repeating fade would visibly skip its own end state on every pass.

**Direction is derived, never toggled.** `yoyo` reverses odd cycle indices. Because direction is a function of elapsed time rather than of a flag flipped per wrap, a tick that crosses two cycles cannot leave the loop running backwards when it should run forwards.

**A crossed cycle is not replayed.** One tick produces exactly one emission, at the position the clock actually reached. `Motion` coalesces to the latest progress per scheduler pass, so replaying skipped cycles would queue values that can never be applied.

**An infinite loop keeps bounded state.** While `repeat` is `-1`, elapsed time is reduced into a single period (`duration`, or `2 * duration` for a yoyo) on every advance. Subtracting whole periods cannot change the position inside the current one, so the reduction is exact; without it, elapsed time past roughly 2^58 clock units absorbs each new delta and the loop freezes on one value forever.

**Validation replaces one rule with three.** `trigger-time-repeat-unsupported` is deleted. `trigger-time-repeat-shape` rejects a `repeat` that is not an integer of `-1` or above. `trigger-time-yoyo-shape` rejects a non-boolean `yoyo`. `trigger-time-yoyo-requires-repeat` rejects a `yoyo` whose `repeat` is absent or `0`, at either boolean value, because neither has any effect without a repeat and a field accepted and then ignored is what ADR-033 forbids.

## Deliberately not changed

**Stagger.** `Motion.#effectiveProgress` is a pure function of the committed position, so a looped position is just a position. Stagger is a phase offset inside a pass and no cycle hands anything to the next one. On a reverse cycle the offset reverses with it, which follows from the same formula rather than from a special case.

**The single clock consumer.** A looping time Motion still registers one `clockBinding` of kind `driver` and the project still takes one `Clock.subscribe`. The loop lives inside the driver's `onTick`, so nothing new subscribes to anything.

**`seek`.** Leaf-level scrubbing, overwritten by the next driver emission, exactly as ADR-021 says.

**Playback pause.** There is no public pause, and the loop cycle deliberately has no pause of its own. A driver that asked whether its Motion was playing would be a second owner of playback, which `Motion` owns. A paused Motion therefore detaches from its port while loop time keeps running, and resuming lands on wall-clock loop time. That is the pre-loop driver's behavior unchanged, and when pause ships it belongs to `Motion`.

**`delta` guards.** The loop cycle does not validate `delta`. `Clock` owns that contract and `Motion.#scheduleProgress` rejects a non-finite progress at the emit site. See ADR-037.

## Alternatives rejected

**Putting the arithmetic in `Motion`.** It already advances a position per tick, so adding cycles there looks cheap. It would put loop semantics behind a trigger-kind branch in the one object the issue forbids branching, and it would give two owners to a value only the driver knows the phase of.

**`repeat` as a total cycle count.** Reads more naturally in isolation and disagrees with every authored document that already exists, silently, by one cycle.

**Emitting the endpoint and the wrapped value on one tick.** It would defeat the coalescing `Motion` performs on purpose, and the discarded value would be a frame the runtime reported and never applied.

**A `loop: { repeat, yoyo }` sub-object.** Tidier grouping, and a second shape for the same two fields that every existing v4 document spells flat.

**Letting `yoyo: false` pass without a repeat.** It is the default, so accepting it means accepting a field that does nothing. The rule is about presence for both values, which is one sentence instead of two.

## Consequences

A v4 document with `repeat` or `yoyo` now migrates and loads instead of failing validation, with the same cycle count it had before.

`TimeTriggerDefinition` gains two optional fields. No new export and no export removed, so `boundary-scan.mjs` and `public-declaration-surface.test.ts` run unchanged.

`createTimeDriver` gains an optional second argument and keeps its positional `duration`, so `T-9` in `trigger-factory-no-fallback.test.ts` still constructs it the same way.

## Evidence

`packages/core/test/unit/adapters/time-loop-cycle.test.ts` cases `L-1` through `L-10`: single-pass compatibility, `repeat: 0` equality, finite repeat counting, both yoyo finishing endpoints, the boundary convention, an infinite loop never latching, one emission for a multi-cycle tick with direction intact, a delta past the end, and an enormous delta leaving the loop still advancing.

`packages/core/test/integration/trigger-time-loop.test.ts` cases `L-11` through `L-21`: every validation rule by id, the deleted rule asserted by absence, an authored yoyo end to end, authored and runtime parity, stagger inside a cycle, one clock subscription, infinite versus latching, `seek` overwritten, a destroyed loop released, and loop time running through a pause.

`L-1` is green on the parent commit by design. It is the byte-for-byte compatibility guard and is not claimed as red.

Red before green is executed and archived rather than described. The first commit on this branch is tests only, so run [32221562839](https://github.com/chahyasantoso/motion5/actions/runs/32221562839), archived at `logs/32221562839/`, is the failing run. `quality` reports `20 failed | 497 passed`, every failure assertion-level or a contract throw from `resolveTriggerDefinition` and `assertValidProject`, with no import-resolution or config red.

The `L-` series is new. `evidence-case-ids.test.ts` widens `CASE_TITLE` to include `L` in the same commit as the red tests.
