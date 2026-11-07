# ADR-147: Stagger finishes every track

**Status:** Accepted, 2026-11-07

**Keeps:** [ADR-023](./ADR-023-motion-owns-stagger-playhead-delay.md). Motion still owns the calculation.

## Context

A later track was offset by `index * stagger` while the Motion still ended at position 1. Three tracks at
`0.25` ended at progress `1`, `0.75` and `0.5`, and stayed there. The last letter of a word stopped halfway,
with no diagnostic. A track could never reach its final pose in a staggered Motion.

## Decision

`stagger` is the delay between track starts, in track lengths. The Motion's position runs across the span
to the last finish, so `elapsed = position * span - index * stagger` and a track's progress is
`elapsed / length`, clamped. Every track is at `1` when the Motion is at `1`. `1` runs tracks one after
another, and no value needs a refusal. A zero stagger leaves every track on the Motion's own position.

## Consequences

Under a non-zero stagger each track runs faster than the Motion, because the same trigger duration now
covers the span. Under a loop, the phase still resets each cycle. The cases pinning the previous numbers,
including `L-16` and `M-6`, moved with this contract. Three replacement cases now signal `0.25` instead of
`1`, where the first track has finished and the others have not started, which keeps what they assert.

## Rejected

- Refusing `(n - 1) * stagger >= 1` and compressing into `1 - (n - 1) * stagger`: it adds a rule, and adding
  a track could make a valid Motion invalid.
- Keeping the contract and having callers window each track: a second mechanism for one question.
- Lengthening the trigger's duration: the trigger owns its progress and knows no tracks.
