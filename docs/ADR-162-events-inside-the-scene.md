# ADR-162: Events inside the scene

**Status:** Accepted, 2026-11-08

## Context

A scene knew its own moments, such as a ball's last landing, only as numbers it computed; nothing answered them, and a
page could not hear them to play a sound. The scene tools played no events, and a timed manual driver could not
sample past its length, so a scene's answers to late events could not be sampled at all.

## Decision

- A scene's own events are `cues`, plain `MotionEvent` rows a scene module may export. `play(scene, driver, { cues })`
  and `usePlayer(scene, clock, cues)` merge them with the driver's events, oldest first, before every step.
- `react({ on, target, kind, amplitude, decay, frequency })` adds a closed-form damped answer to each past event:
  `recoil`, `wobble`, `flash` or `shake`. It is exactly 0 before its event and once below a thousandth of its size.
- `player.on(name, listener)` calls back when forward play passes an event's ms, cue or page event; a step backwards
  calls nothing, and passing it forward again calls again.
- `manualDriver` gains `seekMs`: past its length, progress holds at 1 while the clock's ms runs on.
- `motion:sample` and `motion:timeline` read a module's `cues` and take `--events`; sampling at ms uses `seekMs`, and
  a timeline runs 2000 ms past the last event.

## Consequences

`player.on` hears only what crosses between two steps of the driver: a clock driver's frames, or a manual seek. An
untimed driver has no ms, so it calls nothing. The CATCH example's hand gives under the ball from its `catch` cue.

## Rejected

- Letting `react` read moments directly: the same answer to a page event and to a cue would need two forms.
- Firing `player.on` on every seek past an event, backwards too: scrubbing would replay sounds.
