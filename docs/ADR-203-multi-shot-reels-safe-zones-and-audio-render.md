# ADR-203: Multi-shot reels, safe zones and audio render

**Date:** 2026-11-24
**Status:** Accepted, 2026-11-24

## Context

A timed reel of several shots wrote every beat in the reel's ms. `apps/pieces/launch-day` places its beats at 0, 700,
1000, 2900 and 3500 ms by hand, so making the first shot longer means editing every later beat. Sub-scenes passed to
`scene(...)` all start at the reel's 0, which suits scroll sections that share one page but not shots that follow
one another.

## Decision

1. **A shot is a sub-scene on its own clock (`@gerak/stage`).**
   - `shot(scene, { name?, length?, until?, overlap? })` is a `SceneItem`. `scene` places each shot after the one
     before it: it starts at the previous shot's end minus `overlap` (never below 0), and lasts `length`, or until the
     scene ms `until`, or until its last clock beat ends. `scene` refuses `length` with `until`, an `until` at or
     before the shot's start, a shot with no clock beat and no `length`, and a shot that holds shots.
   - Inside a shot, motions get the shot's time: ms since the shot started (never below 0), progress across its
     length, and events with each `at` moved back by its start. `context.read` of a member in another shot, or of a
     member of the reel, converts back to the scene's time, so a shot never needs another shot's ms.
   - The shot's clock beats become `<shot>.<beat>` on the scene's clock, and a beat named after the shot spans it, so
     `stage.beats`, the default length and `.shows` windows read scene ms.
   - Each member a shot owns shows only during the shot unless it shows a window of its own. During an overlap both
     shots show.
   - The compiled `Stage` lists `shots: { name, index, from, to, overlap }[]`, which `gerak timeline` draws above its
     targets.
   - `@gerak/stage` is the one owner of shot timing and shot presence.

## Consequences

- A reel is written shot by shot from 0; lengthening one shot moves every later one.
- A member seen across shots belongs to the reel and is written on its clock.
- A shot's events are a moved copy of the scene's list, so a `state` read inside a shot folds from the start each
  frame; reels hold few events, and a long live event log in a shot would cost more per frame.
