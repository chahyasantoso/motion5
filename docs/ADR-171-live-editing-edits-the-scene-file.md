# ADR-171: Live editing edits the scene file

**Status:** Accepted, 2026-11-09

## Context

A scene is a `.ts` file that Vite already compiles and hot-updates. Making motion live needs the stage to follow a save
without losing its place, and a person and an agent to share one session.

## Decision

- Live editing edits the scene file. There is no in-browser code editor or compiler. Number drags write the file
  through a dev-server endpoint that checks the old text first, so a stale drag never overwrites a newer edit.
- A host may own the clock. `@motion5/react` gets a `PlayerHost` context, `{ createDriver?, guard? }`. `usePlayer` asks
  the host for its driver, handing it the component's own factory, and never disposes a driver it did not make. `guard`
  wraps the scene so a throw falls back to the last good one. With no host, `usePlayer` behaves as before.
- `player.replace(scene)` swaps the scene and keeps the driver, time, cues and listeners. It is the one owner of "a new
  scene, same time"; `usePlayer` calls it under a host when only the scene changed.
- `clockDriver` gains a rate and a loop range, `setRate(r)` and `setRange(fromMs, toMs)`. It stays the one owner of a
  page's timed clock; there is no second, live clock.
- The live page lives in `apps/react-demo` (`live.html`, `src/live/`), with its dev endpoints in a Vite plugin,
  `@motion5/tools/vite`. It moves into a package only when a second app needs it.
- A number's range comes from the move's declaration: the server finds the literal and names its call and property, and
  the page looks up `move.options[prop]`'s `min` and `max`. A literal outside a move call drags without a clamp.

## Consequences

Core and plugins stay untouched. An agent that edits the file lands on the stage like a person's save does.

## Rejected

- An in-page compiler and a second copy of the code: two owners of the source.
- A separate live clock: a second owner of the page's timed clock.
