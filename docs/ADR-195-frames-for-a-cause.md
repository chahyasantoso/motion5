# ADR-195: Page frames run for a cause

**Status:** Accepted, 2026-11-20

## Context

`mountPage` ran the whole scene on every animation frame until `settleMs` after the last input. On the yuzu proof,
60 wheel steps in Chromium, gerak spent 80 ms of script time against 29 ms for the same page with GSAP and
ScrollTrigger. Of 326 frames, 60 had new input, yet the scene ran on all of them, and the mount alone, with no
motion, cost 20 ms above a page with no animation script.

## Decision

1. **A frame runs for a cause.** A frame after an input runs the whole scene. A frame with no new input runs only
   the elements that move with time alone, keeps every other element's last pose and does not write it. With
   neither, the mount asks for no frame.
2. **What moves with time alone is found as elements run.** `frame(stage, { only, moves })` runs a set of elements
   and reports, per element, `time` while a clock beat has not ended, a trigger's clock part runs, a `smooth` beat's
   spring settles or a loop plays; and `maybe` when a motion read the scene's clock, `carry` or another element.
   `maybe` elements run until `settleMs` after the last input, as every element did before. `MotionWindow` gains an
   optional `moving()`.
3. **Core reports clock use.** `watchClock`, `watchedTime`, `rawTime` and `stillMoving` let a renderer learn whether a
   value can change with the clock alone. States, `springTo` and `easeTo` read the clock untracked and report only
   while on their way; any other read of a watched time counts as `maybe`.
4. **The loop costs little per frame.** The player checks only a growing log's last event, the boxes passed to a
   frame are rebuilt only on remeasure, and the CSS writer keeps one record per element.

A motion answers the same to the same reads; `core.md` states it beside the purity rule.

## Consequences

- yuzu without `smooth` (as the GSAP proof scrubs): 40 ms against GSAP's 30 ms, and about 1.35x with the CPU slowed
  6x, from 2.7x. A page with nothing moving costs nothing; the mount with no motion is within 2x of a page with no
  script. With `smooth`, the bottle springs every frame and costs as before.
- Every piece samples the same; a page mount writes the same styles with clock frames on and off (tested frame by
  frame).
- A motion that changes with wall-clock time while reading nothing tracked stops between inputs.

## Rejected

- Skipping a motion or element whose reads did not change (per element, per step, and with readable keyframes):
  each gave the same poses and no browser gain, since deciding that a motion is unchanged cost as much as running it.
- A second, data-only way to write motion for speed: measured with no browser gain.
- Stopping frames once a frame writes nothing: freezes a motion that waits on the clock before it moves.
