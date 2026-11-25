# ADR-204: Exact held frames, viewport fit, fast lossless capture and parallel render

**Date:** 2026-11-25
**Status:** Accepted, 2026-11-25

## Context

Page tools (`gerak frames`, `gerak render`, `gerak check`, `gerak probe`, `gerak read`) hold the page clock via Playwright's fake clock (`page.clock`). Before this change, `@gerak/dom` subscribed directly to `requestAnimationFrame`, which Playwright's fake clock ticks on a fixed 16 ms grid regardless of the ms requested by `advanceTo(ms)` (a 60 fps frame at `17 ms` drew `16 ms`, `33 ms` drew `32 ms`). Meanwhile, a `frame: "fit"` root mounted directly inside `<body>` or `<html>` scaled to `parent.clientHeight` instead of the viewport when CSS stretched `body` to `height: 100%` or centered inside a grid, and `gerak render` spent ~42 ms per `1080x1920` frame in `page.screenshot()` on one page.

## Decision

1. **Held-clock frame stepping (`@gerak/dom`, `@gerak/tools`).**
   - `packages/dom/src/frames.ts` owns `HELD_CLOCK` (`Symbol.for("@gerak/dom/held-clock")`) and `pageFrames(): FrameSource`. When `HELD_CLOCK` is `true`, `pageFrames()` queues listeners into `Symbol.for("@gerak/dom/held-frames")` and installs `Symbol.for("@gerak/dom/held-step")` (`stepHeldFrames`), which invokes all queued listeners once with the current `performance.now()`.
   - `packages/tools/src/page/page.ts` sets `HELD_CLOCK` in an init script for paused-clock targets and calls `stepAndHoldAnimations(atMs)` inside `runHeldTo(delta, atMs)` at `0 ms` and every `advanceTo(ms)`, firing one scene frame at the exact requested millisecond and holding document-timeline CSS/Web Animations at `ms - from`.

2. **Fitted roots in `body` or `html` scale to the viewport (`@gerak/dom`).**
   - In `packages/dom/src/mount.ts` (`scaleFrame`), when `frame: "fit"` is mounted on a `root` whose `parentElement` is `null`, `ownerDocument.body`, `ownerDocument.documentElement`, or unsized (`clientWidth <= 0` or `clientHeight <= 0`), the container box falls back to `readViewport()` rather than the parent's CSS box.

3. **Fast lossless PNG capture (`@gerak/tools`).**
   - `captureFrame(page: Page): Promise<Buffer>` in `packages/tools/src/page/page.ts` caches one Playwright `CDPSession` per `Page` in a `WeakMap` and calls `Page.captureScreenshot` with `{ format: "png", optimizeForSpeed: true }`, decoding the base64 payload to a lossless PNG buffer.
   - `renderPage` (`render.ts`) and full-frame captures in `captureFrames` / `captureOnion` (`frames.ts`) use `captureFrame(page)`. Clipped screenshots and `check.ts` contrast reading keep `page.screenshot()`.
   - Pixel parity verified on `reel/reel.html` at `1500 ms` (`1080x1920`) and `explainer/explainer.html` at `3460 ms` (`1920x1080`): `0` differing RGBA bytes across all `8,294,400` bytes on both pages.

4. **Parallel page sessions and ordered render writer (`@gerak/tools`).**
   - `withPages(target, count, visit)` in `packages/tools/src/page/page.ts` starts one site server and one browser, opens `count` independent browser contexts via `openPageSession` (each with its own `seedRandom`, held clock, frame 0, media settling, and `--action` list), and merges their `pageErrors`. `withPage` delegates to `withPages(target, 1, ...)`.
   - `gerak render [--workers n]` (`RenderRequest.workers`, `RenderResult.workers`, valid integer `1..16`) opens `workers` sessions: session `0` resolves `--size` page-frame dimensions and `--to`, syncs any resized viewport and `advanceTo(0)` across the other sessions, and runs worker `k` on frames `k, k+n, k+2n, ...` while a single ordered writer pipes PNGs to `ffmpeg` and bounds in-flight frames to `j < written + 2n`.
   - On deterministic held-step pages (`motion-render.test.ts`), `--workers 1` and `--workers 3` produce byte-identical MP4 files. Across the four real showcase pieces (`timing`, `launch-day`, `reel`, `explainer`), `--workers 1` and `--workers 4` produced different MP4 SHA-256 digests because Chromium anti-aliased edge rasterization varies by step history (e.g. `12` RGB bytes / `maxD: 7` on `explainer` `closingRule` at `8000 ms`, even with `page.screenshot()` and `--disable-gpu`) and multi-context concurrency (`175` RGB bytes / `maxD: 3` on `timing` at `367 ms`), plus single-worker GPU raster jitter on `launch-day` (`53` bytes / `maxD: 4`). Therefore `defaultRenderWorkers()` returns `1`, and `--workers 2..16` is opt-in when faster throughput outweighs cross-worker bit parity.

## Consequences

- Measured 60 fps render speeds on one quiet 16-thread Windows machine (`ffmpeg` `libx264 -threads 1`):
  - `reel/reel.html` (`1080x1920`, `721` frames, with audio): `19.7` fps (`36,593` ms) at `a77d045f` -> `30.0` fps (`24,006` ms) at `--workers 1` (default) -> `34.1` fps (`21,155` ms) at `--workers 4`.
  - `explainer/explainer.html` (`1920x1080`, `554` frames, `<video>` clip): `18.3` fps (`30,347` ms) at `a77d045f` -> `31.0` fps (`17,854` ms) at `--workers 1` (default) -> `41.4` fps (`13,385` ms) at `--workers 4`.
- Real-clock tools (`gerak fps`, `clock: "real"`) do not set `HELD_CLOCK` and keep the browser's own `requestAnimationFrame` frames.
- `gerak render` defaults to `1` worker so default renders keep single-worker Chromium rasterization; `--workers n` enables parallel capture on demand.
