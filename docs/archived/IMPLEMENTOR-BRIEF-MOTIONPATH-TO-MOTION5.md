# Implementor brief: restore motionpath behavior in motion5

## Mission

Complete `motion5` without rewriting its graph kernel. Preserve motion5's graph IR, qualified IDs, transactional binding, canonical ordering, one project runtime, immutable patches, failure containment, package boundaries, and renderer separation. Use motionpath as the behavioral oracle for authored keyframes, proxy interpolation, plugin compilation, observations, Motion controls, and renderer output, but port behavior into motion5 boundaries rather than copying files.

## Non-negotiable rules

1. Keep motion5 graph ownership and transactional semantics.
2. Do not copy motionpath wholesale.
3. The interpolator owns adapter-managed mutable state; Track reads it.
4. Keep one clock owner per project. No second RAF/ticker.
5. Every new behavior test must fail on the starting commit.
6. Phase 4 requires green build and end-to-end evidence.
7. Keep PatchRegistry and graph internals out of the public package surface.

## Motion and trigger ownership decision

Motion and trigger lifecycle are wired through the existing runtime path. `ProjectHandle.signal(motionId, signal)` forwards to one Motion owner. Motion schedules progress through the injected Scheduler, updates its Tracks, and invalidates through `ProjectRuntime.seek`. Engine-created Motion instances do not subscribe to the Clock themselves, so ProjectRuntime remains the sole clock owner. Motion owns trigger attachment, detachment, pause/play, and disposal guards. ProjectRuntime owns publication and graph invalidation.

Trigger adapters provide signals only. They never publish patches directly, create a clock, or bypass ProjectRuntime.

## Required behavior

- Interpolation timelines expose duration, adapter-owned state, progress get/set, and kill.
- Authored stops are typed and validated for finite, monotonic, unique positions.
- Plugins resolve once per Track and support ownership, contribution, composition, deterministic ordering, inputs, outputs, serializers, and internal keys.
- Tracks and timelines survive multiple flushes and dispose once.
- Inputs and outputs remain deterministic, immutable, and graph-owned.
- DOM and React consumers pass lifecycle and public-boundary tests.
- Manual, scroll, and time signals pass through Scheduler and ProjectRuntime.
- Pause/remount, disposal, invalid progress, reentrancy, and one-clock ownership are covered.

## Motion5 boundary

Motionpath supplies trigger semantics and lifecycle inspiration. Motion5 keeps `ProjectRuntime.seek`, `GraphRuntime.invalidate`, the injected Scheduler, immutable patches, and one project clock. Motion must not independently publish around ProjectRuntime.

## Evidence and exit

The implementation must include assertion-level failing-first evidence, exact-head required CI, and a Recovery audit with the final ref, base `e53265b97be1c1f1bb766c78abf7bc4f1e1ce44b`, and blank exception. Update status and review disposition only after those results are green, then merge into rescue and open rescue → main.
