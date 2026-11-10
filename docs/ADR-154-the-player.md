# ADR-154: The player

**Status:** Accepted, 2026-11-08

## Context

Without the engine, code needs something to drive a scene from a clock or scroll and hand poses to renderers. The
engine's React path reads per-node patches with a `ready`, `blocked`, `error` or `destroyed` status, because a
node can be refused or destroyed mid-edit.

## Decision

`@gerak/player` owns `play(scene, driver)`. A scene is a function from `Time` to poses by target. Each frame the
player reads the driver, reruns the whole scene, and notifies each target's subscribers with plain values; a target
that subscribes late receives the current value, and `refresh` reruns the scene for inputs it reads from outside,
such as a measured layout. The player is in the pure layer.

Drivers produce `Time` and own where it goes: a manual driver in the player, and in `@gerak/dom` a clock driver
on the page's frames, with `play`, `pause`, `seek` and `replay`, and a scroll driver. The clock driver and the
engine's `time` trigger share one loop owner for delay, repeat and yoyo, in `@gerak/moves`.

`@gerak/react` adds `usePlayer`, which plays a scene for a component's life, `useTarget`, which writes each step
through a ref with no re-render, and `useValue`, which reads rarely changing values through
`useSyncExternalStore`. All sit beside the engine hooks.

## Consequences

A bad option fails when the scene runs, never as a per-target status. Rerunning a scene of 501 targets, 500
staggered drops and a hop, costs 0.29 ms a step in Node, under 2% of a 60 fps frame, so there is no incremental
invalidation. The timing beat page runs on the player, and a test holds its scene equal to the engine project.

## Rejected

- Incremental recomputation now: no measurement shows a whole-scene rerun is too slow.
- Per-target statuses: a scene is validated whole, so no target is ever blocked alone.
- Rendering through React state each frame: it re-renders the tree sixty times a second.
