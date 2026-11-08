# ADR-150: Time and the time module

**Status:** Accepted, 2026-11-08

**Supersedes in part:** [ADR-023](./ADR-023-motion-owns-stagger-playhead-delay.md) and
[ADR-147](./ADR-147-stagger-finishes-every-track.md). The stagger arithmetic ADR-147 chose is kept; its owner moves
from `Motion` to the time module.

## Context

A plugin sees only `{ nodeId, progress }`. A track's `duration` is a length relative to its siblings, and only the
`time` trigger's `duration` is milliseconds; scroll and manual triggers have no clock at all. Physics and events
need elapsed time. The stagger formula has two owners, `Motion.#effectiveProgress` and `cascade`.

## Decision

```ts
type Clock = { kind: "timed"; elapsed: number; length: number } | { kind: "untimed" };
type Time = { progress: number; clock: Clock };
```

`progress` runs from 0 to 1. `elapsed` and `length` are milliseconds within one pass of the track's own window.
A reader of `clock` switches on `kind`.

One time module in `@motion5/moves` owns windows and stagger as lanes, and computes each track's `Time` from the
Motion's position, the track's place among its siblings and a timed trigger's duration. Delay, repeat and yoyo
stay with the trigger, which drives the position, so `elapsed` holds through a delay, restarts each pass and runs
backwards on a yoyo pass. `Motion`, `cascade` and the player call it, and the engine's `EvaluationContext`
carries `clock` to every plugin.

## Consequences

Elapsed time reaches a move only where a clock exists, and the type says so. The stagger cases `L-16`, `M-6` and
`stagger-finishes.test.ts` must pass unchanged against the moved formula.

## Rejected

- Elapsed as a plain number, zero when untimed: a scroll-driven physics move would read zero as a real time.
- Track `duration` in milliseconds: it changes every authored project's meaning.
- Each runtime keeping its own stagger: the duplicate this record removes.
