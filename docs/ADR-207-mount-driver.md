# ADR-207: A mount runs on a driver it is handed

**Date:** 2026-11-26
**Status:** Accepted and built, 2026-11-26.

## Context

A scene is a function of time and events, and `@gerak/player` already runs any scene on any `Driver`. `mount` took
only `clock: "live" | "timed"` and built its own driver from it. A live page, such as a scroll page, ran on wall time
with the visitor's real input, so the Studio could not play, pause, seek, loop or replay it: its timeline only
scrubbed the scroll position. A recorded take could replay only in a headless review, never in the canvas. A piece's
page calls `mount` itself, so a host could not reach in without editing the piece.

## Decision

- **`MountClock` gains `{ kind: "driver", driver }`.** On a handed driver the mount takes time and steps from it and
  requests no frames. It still records the page's real scroll, pointer, watched elements and `mounted.send`, stamped
  at the driver's elapsed ms. The scene sees that log merged with `driver.events()`: handed events add to real input,
  never replace it. A seek keeps the log. `mounted.events()` stays the recorded log alone. `"live"` and `"timed"` are
  unchanged; one `switch` in `mount` owns which driver runs.
- **A host hook.** A function on the global symbol keyed @gerak/dom/driver may hand a `"live"` mount its driver, told
  the scene's length and the root; it returns `undefined` to keep the live clock. A `"timed"` mount never asks. The
  hook is read in one place beside the held clock's, and is not part of the authoring surface.
- **The Studio's driver.** The canvas hands each page it frames a seekable `clockDriver` over the timeline: the longest
  of the scene, the take's last event plus 2000 ms, and a scroll sweep at 1 px per ms. The take's scroll samples
  scroll the real page, because sticky sections are the browser's layout of the real scroll; its other events go to
  the scene as handed events. With no take, Play sweeps the page from top to bottom. Replay reloads at the top. A page
  asks for its driver through an inline script the Studio's server adds ahead of the page's own.

## Rejected alternatives

- **Replace real input with the take.** Fully scripted playback, but a person's hover would do nothing while they
  scrub.
- **Hand scroll as an event.** The scene would see a scroll the page never shows, since sticky layout follows the
  real scroll position.
- **A driver card on the canvas.** Its time is always the preview card's player; only its events vary, and those are
  take cards wired into the preview.
- **Editing pieces to take a driver.** Every page would carry Studio code; the hook keeps pieces unchanged.

## Consequences

- A live page in the Studio plays, seeks, loops and replays like a reel, and `gerak studio play` and `seek` work on it.
- The Studio's scroll-scrub mode is gone; a page with no mount yet reads as waiting.
- The sweep spans the whole timeline and reads the page's height as it plays; the timeline's length is set when the
  driver is built, from the page's height then.
- A loop on a driven page keeps the last pass's real input: a `Driver` cannot tell the mount that a loop wrapped, as
  the timed clock's own recorder is told.
- Every mount in one framed document shares that document's driver; a reload builds a new one.
- Tools still hold a page's clock with a paused fake clock; moving them onto a handed driver is open.
