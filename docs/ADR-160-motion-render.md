# ADR-160: motion:render

**Status:** Accepted, 2026-11-08

## Context

The owner rates pieces at full speed, and the tools show only stills. A screen recording runs on the wall clock, so it
drops frames and differs on every run.

## Decision

`motion:render` steps the page on the tools' paused clock, 16 ms at a time, screenshots every step and pipes the PNGs
to `ffmpeg`: H.264 MP4 at 62.5 frames a second by default, or a 640 px palette GIF at 25 frames a second. The encoder
runs on one thread with bit-exact flags and no metadata, so a page renders to the same bytes every run. Without
`ffmpeg` on the `PATH` the command refuses with where to get it.

## Consequences

Page tools still import only node, `playwright-core` and `vite`; `ffmpeg` is an outside program, needed by this one
command. A render takes about five times the piece's length. The MP4 is lossy, so a rendered frame matches
`motion:frames` by picture, not by bytes.

## Rejected

- Recording the browser on the wall clock: frames drop and no two runs agree.
- 60 frames a second: the page draws every 16 ms, so 60 would repeat some frames and skip none, a visible judder.
