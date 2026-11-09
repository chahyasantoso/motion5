# ADR-168: Motion principles are knobs, not presets

**Status:** Accepted, 2026-11-09

## Context

An agent writing a code scene should be able to apply the classic motion principles: squash and stretch,
anticipation, follow-through, slow in and out, arcs, stagger and the rest. Moves already cover some of them. A
spring sat private inside `follow`, eases had fixed overshoot, `lanes` staggered only from the first lane, and nothing
gave a body's place on a path, its speed, or a stretch from speed. A preset per principle would give agents a house
look, and a wrapper that rewrote a move's progress breaks moves, which are not defined past 0 or 1.

## Decision

- A principle is a knob on a move, a function over a signal (any function of time), or a line in the guide. A knob
  states what it does in px, ms, degrees or a share, and never names a feel. A default is neutral, or there is none.
  Every knob has a range in its declaration.
- No preset bundles such as `pop`, `settle` or `bounceIn`, and no wrapper that takes a move. A principle composes
  with a move through `combine`.
- `spring(offset, speed, seconds, { stiffness, damping })` in `moves/src/spring.ts` is the one owner of spring math,
  and is exported. `follow`, `springEase` and `trail` call it.
- `springEase({ stiffness, damping })` is an ease over a fixed span, exactly 1 at its end. `follow` chases goals that
  events set, over open time.
- `backEase({ amount, direction })` owns the back curve; `ease.backIn`, `backOut` and `backInOut` are it at `1.70158`.
- `lanes(lengths, stagger, { from, spacing })` owns stagger order and spacing.
- `trail(signal, options)` is a spring chasing a continuous signal. It steps only over the spring's memory, the time
  its envelope takes to fall under `rest`, so its cost per frame does not grow with the scene's length.
- `velocity(signal, time)` owns a signal's speed. `smear` turns to the heading of travel and stretches along it,
  keeping area. `squashed` takes an anchor and owns squash at contact; `smear` owns stretch from speed.
- `along` gives a pose at a share of a path's length. `trace` keeps the share of a path drawn.
- `clockDriver` honours `prefers-reduced-motion` by showing the scene's end, unless the scene opts out.
- Staging, timing, exaggeration and appeal are judgment, taught in the guide with a worked example held by a test.

## Consequences

Each listed export is new public API in `@motion5/moves`, or an option on an existing one; existing calls keep their
values. `Pose2d` gets no skew: an outer element takes `smear`'s pose and an inner one turns back by its `heading`,
which is exact. A timed shake is `react` on a cue, and a crouch is `backEase` with `squashed`; the guide shows both.
3D scenes get none of this until a later decision.

## Rejected

- A move per principle (`settle`, `windup`, `shake`): each repeats what `springEase`, `backEase` or `react` owns.
- Wrappers that take a move and rewrite its progress: a second owner of the move's timing, and overshoot breaks moves.
- Skew in `Pose2d`: every renderer would change, Three.js objects have none, and two elements are exact.
- A length limit on `trail`: the spring's memory bounds the cost instead.
