# ADR-154: The player

**Status:** Accepted, 2026-11-08

## Context

Without the engine, code needs something to drive a scene from a clock or scroll and hand poses to renderers. The
engine's React path reads per-node patches with a `ready`, `blocked`, `error` or `destroyed` status, because a
node can be refused or destroyed mid-edit.

## Decision

`@motion5/player` owns `play(scene, driver)`. A scene is a function from `Time` to poses by target. Each frame the
player reads the driver, reruns the whole scene through the time module, and notifies each target's subscribers
with plain values. It offers `seek` and `replay`, and a target that subscribes late receives the current value.

Drivers produce `Time`: a manual driver in the player, the clock and scroll drivers in `@motion5/dom`. A page
without a component framework may pass a renderer function to `play` instead of subscribing.

`@motion5/react` adds `useTarget`, which writes each frame through a ref with no re-render, and `useValue`, which
reads rarely changing values through `useSyncExternalStore`. Both sit beside the engine hooks.

## Consequences

A bad option fails when the scene runs, never as a per-target status. There is no incremental invalidation until
a measurement on the largest demo asks for it.

## Rejected

- Incremental recomputation now: no measurement shows a whole-scene rerun is too slow.
- Per-target statuses: a scene is validated whole, so no target is ever blocked alone.
- Rendering through React state each frame: it re-renders the tree sixty times a second.
