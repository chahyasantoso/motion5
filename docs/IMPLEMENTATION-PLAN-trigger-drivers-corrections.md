# Corrections to `IMPLEMENTATION-PLAN-trigger-drivers.md`

This amendment is part of the implementation plan and must be read together with `docs/IMPLEMENTATION-PLAN-trigger-drivers.md`.

## Correct test helper location

In section 0.2 and anywhere else the plan refers to fake test helpers, use:

- `packages/core/src/ports/fakes.ts` for `createFakeInterpolator`, `createFakeScheduler`, and `createFakeTriggerPort`.
- `packages/core/src/ports/clock.ts` for `createManualClock`.

There is no `packages/core/test/support/` directory in this branch. Lower-level implementers must reuse the helpers above and must not create replacement fakes.

## Issue link for the deferred Motion track replacement bug

Section 8.1 refers to the tracked bug: [Issue #114](https://github.com/chahyasantoso/motion5/issues/114).

The issue covers the stale `MotionTrackEntry` reference created when `ProjectRuntime.#replaceTrack` disposes and recompiles a motion-owned `Track` without re-registering the new instance with its owning `Motion. The recommended near-term fix is Option A from the issue: add an in-place `Motion.replaceTrack`path and a`replaceMotionTrack` hook that preserves the track's array index and stagger timing. Option C, resolving tracks by id instead of retaining compiled references, remains the longer-term follow-up.

The bug remains intentionally out of scope for T0 and the trigger-driver slices. Do not silently fold it into the observation-identity or trigger commits; implement it as a separate change using the regression plan in #114.
