# ADR-165: simulate spawns bodies on events

**Status:** Accepted, 2026-11-08

## Context

`simulate` built its world once, so a scene could not add confetti when a click came. The CONFETTI agent ran one
simulation per click and kept three, and earlier piles vanished on the fourth click; bursts never landed on each
other.

## Decision

- `simulate(world, build, { spawn })` calls `spawn(event, world)` before the step whose span holds the event's ms,
  and `spawn` may only add bodies. Every question takes the scene's events: `at`, `bodies`, `pose`, `place` and
  `events`.
- An event that changes what came before the furthest step played drops later snapshots and contacts and replays from
  the snapshot before it, so the same time and events always give the same world.
- Snapshots of both engines carry which bodies exist: the built-in engine names each body in its rows, and the Rapier
  adapter prefixes Rapier's bytes with its own id-to-handle maps.
- `sim.place(id, time, events)` gives a body's place on the stage, at opacity 0 until it exists, for elements laid out
  centred on the stage's corner; `sim.bodies` lists the ids there, in the order added.

## Consequences

Every click's bodies share one world. A scene passes its events to each question. The conformance suite spawns two
balls, seeks back and forth, inserts an earlier event, and holds the result equal to a fresh run, on both engines.

## Rejected

- One simulation per event: bodies from different events never meet.
- Spawning from outside the scene, in a click handler: the tools replay events, not handlers.
