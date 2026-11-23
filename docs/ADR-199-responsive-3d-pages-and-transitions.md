# ADR-199: Live compositor stability, unwindowed travel, idle physics fast-forward and review probing

**Status:** Accepted, 2026-11-23

## Context

Building multi-section interactive 2D+3D pages on top of [ADR-194](./ADR-194-pages.md), [ADR-196](./ADR-196-the-compositor.md), [ADR-197](./ADR-197-objects-in-a-scene.md), and [ADR-165](./ADR-165-simulate-spawns-on-events.md) surfaced four runtime and tooling defects:

1. Resizing any cast element in a live page caused `mount` to cancel and rebuild every compositor Web Animation synchronously, sampling `scrollTracks` across `[0, maxScroll]` on a 16 px grid even when neither `maxScroll`, `lines`, nor any box read by handed tracks had changed.
2. Unwindowed `travel({ to: slot })` anchored at the slot (`progress = 1`) on live and untimed clocks, yet swept `0 -> 1` over `durationMs` on timed clocks, causing `gerak review <scene.ts>` to diverge from `mount`.
3. `simulate()` stepped an empty physics world frame-by-frame from step `0` even when `starts.size === 0`, producing multi-second stalls when `{ spawn }` fired minutes into a live session.
4. `gerak review <scene.ts>` judged `"settle"` expectations solely on zero-scroll timed frames, flagging scroll-, trigger-, and input-driven members as never moved; `readPageArgs` overwrote repeated `--action` flags; and `gerak fps` rejected `--action`, leaving real-clock interactive stalls undetectable from the CLI.

## Decision

1. **Dependency-gated, beat-scoped compositor handoff (`@gerak/dom`).** `scrollTracks()` and `triggerTracks()` return `{ tracks, deps }`, capturing every rest box name read by beat edges or `context.rest` via a `RestReader` spy. `scrollTracks()` groups qualifying elements by merged active scroll intervals clamped to `[0, maxScroll]` and samples the 16 px grid only inside those active intervals plus `0`, `maxScroll`, and beat edges. `mount()` coalesces `ResizeObserver` callbacks onto a single microtask, temporarily detaches active animation effects while reading rest boxes without losing trigger playback state, compares `placementOf(box)` alongside geometry in `sameRest()`, and skips `release()` / `handOff()` rebuilds whenever `maxScroll`, `lines`, and all `handedDeps` remain unchanged. `@gerak/dom` stays the sole owner of compositor handoff.
2. **Unwindowed `travel` anchors on every clock (`@gerak/stage`).** Unwindowed `travel({ to: slot })` (both 2D `travel` and 3D `travel3d`) resolves at `progress = 1` on `"timed"`, `"live"`, and `"untimed"` clocks alike; sweeping over a beat requires `.in(beat)`. `@gerak/stage` stays the sole owner of `travel` timing.
3. **Idle pre-spawn physics fast-forward (`@gerak/physics`).** Inside `simulate().seek(target)`, when `starts.size === 0 && head < target`, `head` jumps directly in O(1) to the earliest step with a spawn event (or `target` if none spawns) without stepping an empty world or saving idle checkpoints, preserving bit-for-bit identical replay under [ADR-165](./ADR-165-simulate-spawns-on-events.md). `@gerak/physics` stays the sole owner of simulation seeking.
4. **Driver-probing scene review and real-clock interactive FPS (`@gerak/tools`).** `readPageArgs()` accumulates repeated `--action` flags in order; `gerak fps` accepts `--action` and executes actions in `withPage` under `clock: "real"`; and `reviewSceneModule()` collects `drives` during evaluation and probes unmoved `"settle"` members across their reported scroll, trigger, or input drivers before reporting `"never moved"`. `@gerak/tools` stays the sole owner of both CLI gates.

Supersedes in part [ADR-194](./ADR-194-pages.md) (timed unwindowed `travel`). Refines [ADR-196](./ADR-196-the-compositor.md) (beat-scoped compositor sampling and dependency-gated rebuilds) and [ADR-165](./ADR-165-simulate-spawns-on-events.md) (idle pre-spawn seeking).

## Consequences

- Interactive DOM updates on non-dependency elements trigger zero compositor animation rebuilds and zero `ResizeObserver` bursts per frame; long multi-section scroll pages sample compositor tracks strictly within active beat ranges.
- `travel({ to: slot })` matches across live mounts and timed headless reviews without `.in(...)` workarounds.
- Late `{ spawn }` physics bursts after minutes of live uptime start in sub-millisecond seek overhead with identical deterministic states and shifted contact timestamps.
- `gerak review <scene.ts>` passes scroll-, trigger-, and input-driven scenes (including `yuzu` and `yuzu-3d`) while still catching genuinely static settle members, and `gerak fps --action` detects real-clock frame drops during clicks and scrolls.

## Rejected

- Rebuilding compositor tracks asynchronously after an interaction frame: adds a multi-frame lag window and stale keyframe races instead of eliminating redundant work.
- Keeping timed unwindowed `travel` sweeping across `durationMs`: creates a two-clock discrepancy where pieces authored for live pages break headless review.
- Exempting `"settle"` members blindly whenever `drive.kind !== "more"`: would silence genuine bugs where a motion inside a scroll or trigger beat never moves.
