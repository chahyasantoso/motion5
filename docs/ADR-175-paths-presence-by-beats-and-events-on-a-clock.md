# ADR-175: Paths as content, presence as beats, and events on a clock

**Status:** Accepted, 2026-11-12

## Context

The third rebuild of the hand-made showreel as one stage module named its costliest gaps. A member could not be a
stroke, so `trace`, `streak` and `spread` drew nothing and two moves were written to fake them. Presence was one
span, so six dust landings took six members and six beats. `trail` threw on a slow spring until `rest` was found by
trial. A piece with a `watch` member played on the event driver, which cannot seek, so the live page gave it no
timeline. And two readers, one in the tools and one in the pieces app, each decided what a stage module is.

## Decision

- **A path is content.** `actor({ path })` gives a member a geometry its motion depends on, as `text` gives it words.
  The DOM stage draws it as an SVG `path` inside the member, its `viewBox` the path's own box; a value's transform
  goes to the member and its stroke fields to the path. The skin decides colour and width.
- **Presence is a list of stretches.** `on` lists beats, or pairs of beats meaning from the first's start to the
  second's end; a member is shown while any runs. A member without `on` takes its group's; with none it is always
  shown. `enters` and `leaves` are removed.
- **`trail` finds its own `rest`** when none is given: the smallest that keeps the spring's memory under the cap.
- **Events ride a clock.** The clock driver watches members and records events at its elapsed time; seeking keeps
  the log; replay clears it. The player hands the scene only events at or before the time, cues included. The stage
  always plays on the clock driver.
- **One reader.** `readStageModule` in `@gerak/stage` answers a stage module or why a value is not one; every caller
  uses it.
- **`letters` splits by grapheme.**

## Consequences

- A stroke on stage needs no move of its own, and one member can appear at several moments.
- A watched piece scrubs; a person's hover is kept across a seek and forgotten on replay.
- Pieces and fixtures that used `enters` and `leaves` are rewritten.
- A scene that reads `events` by hand never sees one after its time.
