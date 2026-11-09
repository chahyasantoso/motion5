# ADR-040: loop state has one owner, and `repeat` counts the passes after the first

**Status:** accepted

**Date:** 2026-08-19

**Closes:** [issue #156](https://github.com/chahyasantoso/motion5/issues/156)

## Context

`{ type: "time", duration }` produced exactly one forward pass. `validateMotionTrigger` rejected `repeat` + `yoyo` at any value, `0` included, with `trigger-time-repeat-unsupported`; `createTimeDriver` accumulated own `elapsed`, emitted `Math.min(1, elapsed / duration)`, latched first time progress reached `1`.

Rejection correct then. Loop semantics undesigned, field that validates must be honored → refusing fields beat accepting them and animating one pass. Cost: every looping animation predecessor could express had no v5 spelling; migrated v4 document carrying `repeat: -1` failed validation, not loaded.

Design rather than patch: four questions all resolve to arithmetic, each with wrong answer that looks reasonable — whether initial pass is a repeat, what cycle boundary emits, what tick crossing several cycles emits, what infinite loop does to accumulated state.

## Decision

**One owner.** `createLoopCycle` in `packages/core/src/adapters/trigger-factory/loop-cycle.ts` owns loop state, cycle index, direction, completion. Absorbing `running | finished` state carries elapsed time → finished cycle never re-derives running state. `createTimeDriver` keeps emission channel, rule that finished loop stops emitting, disposal; no longer counts elapsed time. `Motion` untouched, no trigger-kind branch added.

**`repeat` counts passes after initial one.** Finite loop runs `repeat + 1` cycles → `repeat: 0` single pass, byte-for-byte previous behavior. `-1` infinite. Matches interpolation engine ADR-015 keeps as behavioral oracle → migrated v4 document keeps timing, never gains cycle.

**Ping-pong not third field.** Ping-pong is `{ repeat: -1, yoyo: true }`. `pingPong` key second authored spelling for one behavior, which ADR-003 rules out.

**Cycles half-open at start, closed at end.** `index = ceil(elapsed / duration) - 1`, position in `(0, 1]` → tick landing exactly on boundary reads as end of cycle it completed. Floor convention with position in `[0, 1)` never emits `1` for any cycle but last → repeating fade visibly skips own end state every pass.

**Direction derived, never toggled.** `yoyo` reverses odd cycle indices. Direction function of elapsed time, not flag flipped per wrap → tick crossing two cycles cannot leave loop running backwards when it should run forwards.

**Crossed cycle not replayed.** One tick produces exactly one emission, at position clock actually reached. `Motion` coalesces to latest progress per scheduler pass → replaying skipped cycles queues values that can never be applied.

**Infinite loop keeps bounded state.** While `repeat` is `-1`, elapsed time reduced into single period (`duration`, or `2 * duration` for yoyo) on every advance. Subtracting whole periods cannot change position inside current one → reduction exact; without it, elapsed time past roughly 2^58 clock units absorbs each new delta and loop freezes on one value forever.

**Validation replaces one rule with three.** `trigger-time-repeat-unsupported` deleted. `trigger-time-repeat-shape` rejects `repeat` not integer of `-1` or above. `trigger-time-yoyo-shape` rejects non-boolean `yoyo`. `trigger-time-yoyo-requires-repeat` rejects `yoyo` whose `repeat` absent or `0`, at either boolean value: neither has effect without repeat, field accepted then ignored is what ADR-033 forbids.

## Deliberately not changed

**Stagger.** `Motion.#effectiveProgress` pure function of committed position → looped position just a position. Stagger is phase offset inside pass; no cycle hands anything to next. On reverse cycle offset reverses with it, following same formula rather than special case.

**Single clock consumer.** Looping time Motion still registers one `clockBinding` of kind `driver`, project still takes one `Clock.subscribe`. Loop lives inside driver's `onTick` → nothing new subscribes to anything.

**`seek`.** Leaf-level scrubbing, overwritten by next driver emission, exactly as ADR-021 says.

**Playback pause.** No public pause; loop cycle deliberately has no pause of own. Driver asking whether its Motion was playing would be second owner of playback, which `Motion` owns. Paused Motion therefore detaches from port while loop time keeps running, resuming lands on wall-clock loop time. Pre-loop driver's behavior unchanged; when pause ships it belongs to `Motion`.

**`delta` guards.** Loop cycle does not validate `delta`. `Clock` owns that contract, `Motion.#scheduleProgress` rejects non-finite progress at emit site. See ADR-037.

## Alternatives rejected

**Putting arithmetic in `Motion`.** It already advances position per tick → adding cycles there looks cheap. Would put loop semantics behind trigger-kind branch in one object issue forbids branching, give two owners to value only driver knows phase of.

**`repeat` as total cycle count.** Reads more naturally in isolation, disagrees with every authored document that already exists, silently, by one cycle.

**Emitting endpoint + wrapped value on one tick.** Defeats coalescing `Motion` performs on purpose; discarded value would be frame runtime reported and never applied.

**A `loop: { repeat, yoyo }` sub-object.** Tidier grouping; second shape for same two fields every existing v4 document spells flat.

**Letting `yoyo: false` pass without a repeat.** Default → accepting it means accepting field that does nothing. Rule about presence for both values: one sentence instead of two.

## Consequences

v4 document with `repeat` or `yoyo` now migrates and loads instead of failing validation, same cycle count as before.

`TimeTriggerDefinition` gains two optional fields. No new export, none removed → `boundary-scan.mjs` + `public-declaration-surface.test.ts` run unchanged.

`createTimeDriver` gains optional second argument, keeps positional `duration` → `T-9` in `trigger-factory-no-fallback.test.ts` still constructs it same way. Own lifecycle absorbing `active | disposed` state, separate from cycle state.

## Evidence

`packages/core/test/unit/adapters/time-loop-cycle.test.ts` cases `L-1` through `L-10`: single-pass compatibility, `repeat: 0` equality, finite repeat counting, both yoyo finishing endpoints, boundary convention, infinite loop never latching, one emission for multi-cycle tick with direction intact, delta past end, enormous delta leaving loop still advancing.

`packages/core/test/integration/trigger-time-loop.test.ts` cases `L-11` through `L-21`: every validation rule by id, deleted rule asserted by absence, authored yoyo end to end, authored and runtime parity, stagger inside cycle, one clock subscription, infinite versus latching, `seek` overwritten, destroyed loop released, loop time running through pause.

`L-1` green on parent commit by design. Byte-for-byte compatibility guard, not claimed red.

Red before green executed and archived, not described. First commit on branch tests only → run [32221562839](https://github.com/chahyasantoso/motion5/actions/runs/32221562839), archived at `logs/32221562839/`, is failing run. `quality` reports `20 failed | 497 passed`, every failure assertion-level or contract throw from `resolveTriggerDefinition` + `assertValidProject`, no import-resolution or config red.

`L-` series new. `evidence-case-ids.test.ts` widens `CASE_TITLE` to include `L` in same commit as red tests.
