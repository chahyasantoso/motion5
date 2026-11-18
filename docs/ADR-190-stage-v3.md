# ADR-190: Stage v3, one member list and list poses by index

**Status:** Accepted, 2026-11-18

## Context

PR 599 put a piece into one `defineStage` object but kept three copies of each member, recognised stages by module
identity, checked every list three times a frame, and grew the stage's public surface to about 95 names and its
author reference to 29 KB. A list's scene value was an array whose length the author repeated from the cast, so a
changed word broke the piece at run time.

## Decision

- **A list's scene value is `(index, count) => pose`.** The cast owns the count; `each(items, fn)` builds the
  function from per-item data. A renderer asks only for the items it shows.
- **One member list.** `Stage.members` is a closed union `actor | list | group`, parents first, parent by index,
  each with `expect`, `watch`, `pivot` and its `on` windows in ms; renderers and review read the same entries.
  `stage.signature` answers whether two stages mount on the same elements.
- **Visibility is compiled.** `compileStage` turns every `on` into regions between window ends; `visibleAt(ms)` is a
  binary search returning a shared record. A window includes its start and excludes its end unless it reaches durationMs.
- **`compileStage` checks only what types cannot.** It takes what `defineStage` returns, trusts its shape, and refuses
  non-finite numbers, reversed or empty beats, duplicate or dotted names, mismatched morphs and a `pick` answer
  outside `names`; untyped JavaScript that breaks the shape fails with a plain error.
- **`frame` runs, `check` judges.** `frame` returns the scene's targets untouched; `check` owns every shape rule and
  runs in review and on authoring pages (`checks: true`), not in live playback. A hidden member is not written.
- **Layouts are always named**, `main` when a piece gives none. **Identity is data**: guards read `kind`.
- **A URL skin is fetched and applied as an inline one.** Pose `"3d"` and the open renderer skin registry are gone
  until a renderer needs them.
- **Three entries, one per reader:** `@gerak/stage` for authors and runners, `@gerak/stage/render` for outlines,
  `@gerak/stage/dom` for tokens.

## Consequences

The stage's own cost per frame fell from about 203 µs to about 9 µs over the twelve stage pieces, and whole frames
from about 19 ms to about 5 ms, mostly from hidden lists no longer computed. Pieces write lists as functions.
Supersedes the cast and evaluation parts of ADR-174, ADR-175 and ADR-178.
