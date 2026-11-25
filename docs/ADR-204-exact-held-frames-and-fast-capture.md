# ADR-204: Exact held frames and fast capture

**Date:** 2026-11-25
**Status:** Accepted, 2026-11-25

## Context

Page tools (`gerak frames`, `gerak render`, `gerak check`, `gerak probe`, `gerak read`) hold the page clock via Playwright's fake clock (`page.clock`). Before this change, `@gerak/dom` subscribed directly to `requestAnimationFrame`, which Playwright's fake clock ticks on a fixed 16 ms grid regardless of the ms requested by `advanceTo(ms)` (a 60 fps frame at `17 ms` drew `16 ms`, `33 ms` drew `32 ms`). Meanwhile, a `frame: "fit"` root mounted directly inside `<body>` or `<html>` scaled to `parent.clientHeight` instead of the viewport when CSS stretched `body` to `height: 100%` or centered inside a grid, and `gerak render` spent ~42 ms per `1080x1920` frame in `page.screenshot()`.

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

## Rejected alternatives

- **Parallel render pages across contexts:** Interleaved frames across 4 contexts gave 34.1 fps on the reel against 30.0, and 41.4 on the explainer against 31.0, and anti-aliased edges differed by up to 7 levels between contexts, so files stopped being byte-identical.

## Consequences

- Measured 60 fps render throughput on one quiet Windows machine (`ffmpeg` `libx264 -threads 1`):
  - `reel/reel.html` (`1080x1920`, `721` frames, with audio): `28.5` fps (`25,278` ms) vs `19.7` fps (`36,593` ms) at `a77d045f`.
  - `explainer/explainer.html` (`1920x1080`, `554` frames, `<video>` clip): `30.6` fps (`18,132` ms) vs `18.3` fps (`30,347` ms) at `a77d045f`.
- `launch-day` differs between two single-worker runs at 1250 and 1267 ms by up to 4 levels. So byte-identical renders hold only while Chromium rasterizes the same.
- Real-clock tools (`gerak fps`, `clock: "real"`) do not set `HELD_CLOCK` and keep the browser's own `requestAnimationFrame` frames.
