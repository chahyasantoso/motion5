# ADR-163: Injectable physics

**Status:** Accepted, 2026-11-08; superseded in part by ADR-164 (bodies turn)

## Context

Some motion should follow forces rather than curves: many bodies, collisions, a pile settling. A physics engine keeps
state as it steps, while a scene must give the same answer at a time however the player got there. The owner wants
the engine injectable: the built-in one, or Rapier.

## Decision

- **One port.** `@motion5/physics`, in the pure layer, owns `PhysicsWorld`: circle and box bodies that do not turn,
  floor, wall and segment colliders, gravity, a fixed step, body states, contacts that started, and opaque
  snapshots. Units are stage px and seconds with y down. The port holds only what every engine does.
- **One runner.** `simulate(world, build, { dt, checkpointMs, maxCheckpoints })` builds once, steps at a fixed
  `dt` from time 0, keeps a snapshot every `checkpointMs`, and on a seek back restores the nearest and steps on.
  Past `maxCheckpoints` it drops every other snapshot and doubles the gap. Contacts become `contact` events, one per
  body, recorded the first time a step is played.
- **Two engines.** `builtinWorld()`: pure TypeScript, a grid for pairs, impulses with averaged restitution and
  friction, and positional correction. `@motion5/rapier`: Rapier's deterministic 2D build at 100 px a metre, behind
  the same port, with rotation locked on port bodies; `native` and `rigidBody` reach the rest of Rapier.
- **One conformance suite** runs against every engine: a ball lands and rests on the floor with one contact, bounces
  lose height, a restored snapshot gives the same next step, and any order of seeks gives the same states. Each
  engine is held to itself, never to another.
- `seeded(seed)` in `@motion5/moves` gives repeatable randomness for scattering bodies.

## Consequences

Measured here for a thousand bodies over five seconds: the built-in engine steps in 0.59 ms, seeks at random in
55 ms and keeps 1.5 MB of snapshots; Rapier steps in 1.04 ms, seeks in 76 ms and keeps 47.5 MB. A Rapier scene
awaits the engine once at the top of its module, which pages and tools both allow. The two engines give different
numbers for the same scene.

## Rejected

- Rapier alone: 2.4 MB of WebAssembly for a few droplets, and an `await` before the first frame.
- The built-in engine alone: stacks, joints and turning bodies are Rapier's work, not ours to rewrite.
- Stepping in real time and recording: a seek back would need the recording, and tools could not ask for any time.
