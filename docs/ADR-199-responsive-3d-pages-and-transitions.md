# ADR-199: Live compositor stability, cross-scene composition, responsive 3D and transitions

**Status:** Accepted, 2026-11-24

## Context

Building multi-section interactive 2D+3D pages on top of [ADR-194](./ADR-194-pages.md), [ADR-196](./ADR-196-the-compositor.md), [ADR-197](./ADR-197-objects-in-a-scene.md), [ADR-198](./ADR-198-authored-cast.md), and [ADR-165](./ADR-165-simulate-spawns-on-events.md) surfaced nine runtime, authoring, and tooling gaps:

1. Resizing any cast element in a live page caused `mount` to cancel and rebuild every compositor Web Animation synchronously, sampling `scrollTracks` across `[0, maxScroll]` on a 16 px grid even when neither `maxScroll`, `lines`, nor any box read by handed tracks had changed.
2. Unwindowed `travel({ to: slot })` anchored at the slot (`progress = 1`) on live and untimed clocks, yet swept `0 -> 1` over `durationMs` on timed clocks, causing `gerak review <scene.ts>` to diverge from `mount`.
3. `simulate()` stepped an empty physics world frame-by-frame from step `0` even when `starts.size === 0`, producing multi-second stalls when `{ spawn }` fired minutes into a live session.
4. `gerak review <scene.ts>` judged `"settle"` expectations solely on zero-scroll timed frames, flagging scroll-, trigger-, and input-driven members as never moved; `readPageArgs` overwrote repeated `--action` flags; and `gerak fps` rejected `--action`, leaving real-clock interactive stalls undetectable from the CLI.
5. `sceneBuilder` registered read-only geometry dependencies (`view.canvas`, `travel.to`, edge points, `stayWith`) in `OWNERS`, blocking sibling scenes merged with `.include()` from reading shared canvas, slot, or section boxes.
6. Measured sticky placement (`BoxPlacement`, `placementOf`, `boxInViewport`) lived behind `@gerak/stage/render`, and `Edges` exposed `.top` and `.end` without sticky pin bounds (`pinStart` and `pinEnd`).
7. `@gerak/core` lacked a viewport world-size helper matching `project3d`/`unproject3d`, `threeBinder` recorded no local rest bounds on `Object3D`s, and 3D `travel({ to: slot })` refused `fit` ([ADR-197](./ADR-197-objects-in-a-scene.md)).
8. Discrete state transitions across non-numeric or multi-field poses had to manage start timestamps and `stillMoving()` manually via `elapsedOf(rawTime(time).clock)`.
9. Three.js pieces wired duplicate `window`/`ResizeObserver` resize listeners beside `mount`'s remeasure loop and declared `window.__motionReady` locally per file.

## Decision

1. **Dependency-gated, beat-scoped compositor handoff (`@gerak/dom`).** `scrollTracks()` and `triggerTracks()` return `{ tracks, deps }`, capturing every rest box name read by beat edges or `context.rest` via a `RestReader` spy. `scrollTracks()` groups qualifying elements by merged active scroll intervals clamped to `[0, maxScroll]` and samples the 16 px grid only inside those active intervals plus `0`, `maxScroll`, and beat edges. `mount()` coalesces `ResizeObserver` callbacks onto a single microtask, temporarily detaches active animation effects while reading rest boxes without losing trigger playback state, compares `placementOf(box)` alongside geometry in `sameRest()`, and skips `release()` / `handOff()` rebuilds whenever `maxScroll`, `lines`, and all `handedDeps` remain unchanged. `@gerak/dom` stays the sole owner of compositor handoff.
2. **Unwindowed `travel` anchors on every clock (`@gerak/stage`).** Unwindowed `travel({ to: slot })` (both 2D `travel` and 3D `travel3d`) resolves at `progress = 1` on `"timed"`, `"live"`, and `"untimed"` clocks alike; sweeping over a beat requires `.in(beat)`. `@gerak/stage` stays the sole owner of `travel` timing.
3. **Idle pre-spawn physics fast-forward (`@gerak/physics`).** Inside `simulate().seek(target)`, when `starts.size === 0 && head < target`, `head` jumps directly in O(1) to the earliest step with a spawn event (or `target` if none spawns) without stepping an empty world or saving idle checkpoints, preserving bit-for-bit identical replay under [ADR-165](./ADR-165-simulate-spawns-on-events.md). `@gerak/physics` stays the sole owner of simulation seeking.
4. **Driver-probing scene review and real-clock interactive FPS (`@gerak/tools`).** `readPageArgs()` accumulates repeated `--action` flags in order; `gerak fps` accepts `--action` and executes actions in `withPage` under `clock: "real"`; and `reviewSceneModule()` collects `drives` during evaluation and probes unmoved `"settle"` members across their reported scroll, trigger, or input drivers before reporting `"never moved"`. `@gerak/tools` stays the sole owner of both CLI gates.
5. **Read-only cross-scene references across `.include()` (`@gerak/stage`).** `sceneBuilder` tracks `owned` element names (claimed via `.element(...)` with `.motion()`, `.show()`, or `.limits()`) separately from read-only `referenced` elements (`view.canvas`, `travel.to`, edge scroll points, `stayWith`). Sibling `.include()` scenes may share read-only element references; `.include()` keeps the owning scene's `Entry` over `NO_ENTRY` regardless of include order while still refusing two scenes that both claim ownership of one element.
6. **Sticky placement exports and pin edges (`@gerak/stage`).** `@gerak/stage` re-exports `boxInViewport`, `placementOf`, and `type BoxPlacement` from `./render/placement`. `Edges` adds `.pinStart` and `.pinEnd` scroll points reading `placementOf(rest.get(name))` via exhaustive `switch`: `"sticky"` resolves `minY` / `maxY`; `"flow"` and `"fixed"` resolve `.top` / `.end`.
7. **Responsive 3D sizing, measured object bounds, and `"contain"` fit (`@gerak/core`, `@gerak/stage`, `@gerak/three`, `@gerak/dom`, `@gerak/tools`).**
   - `@gerak/core` exports `viewSize3d(lens, stage, depth)` returning `{ width, height, unitsPerPx }` with the same camera validation as `project3d`/`unproject3d`.
   - `@gerak/stage` defines `ObjectBounds3d` (`{ width, height, depth }`) and `RestReader.object(name)`. `Binder` gains optional `measure?: (names?) => Readonly<Record<string, ObjectBounds3d>>`, implemented by `threeBinder` using local `Box3` traversal from identity at each bound `Object3D` root (skipping hidden children), stored on `Measurement.objects` and `<page>.measure.json` (`MeasureCache.objects`).
   - 3D `travel({ to: slot, fit? })` revises [ADR-197](./ADR-197-objects-in-a-scene.md) to accept `fit?: "none" | "contain"`, defaulting to `"none"` on `object` (preserving unscaled `yuzu-3d` cans) and uniformly scaling by `fit: "contain"` from `viewSize3d` and `rest.object(element)`. Pixel `arc` and `fit: "fill"` remain refused on `object`.
8. **Discrete state transitions (`@gerak/core`).** `packages/core/src/state/transition.ts` exports `transition(source, options)` and `transition(source, pick, options)` returning `Signal<Transition<S>>` (`{ current, previous, progress, active }`), accepting `ms: number | ((from, to) => number)` and optional `ease`. It reads `source.steps(rawTime(time), events)` untracked, restarts cleanly on mid-transition state changes, calls `stillMoving()` strictly while `active`, and settles (`progress: 1, active: false`) on untimed clocks.
9. **Binder resize and readiness hooks (`@gerak/dom`, `@gerak/three`).** `Binder` and `ThreeBinderOptions` gain optional `resize?: () => void`, called by `mount` before initial `measure()` and inside `remeasure()` before `measure()`. `@gerak/dom` exports `ready(promise)` as the single typed owner of `window.__motionReady`.

Supersedes in part [ADR-194](./ADR-194-pages.md) (timed unwindowed `travel`), [ADR-197](./ADR-197-objects-in-a-scene.md) (3D `travel` `fit`), and [ADR-198](./ADR-198-authored-cast.md) (read-only cross-scene references across `.include()`). Refines [ADR-196](./ADR-196-the-compositor.md) (beat-scoped compositor sampling and dependency-gated rebuilds), [ADR-165](./ADR-165-simulate-spawns-on-events.md) (idle pre-spawn seeking), and [ADR-198](./ADR-198-authored-cast.md) (`.pinStart`/`.pinEnd` edges).

## Consequences

- Interactive DOM updates on non-dependency elements trigger zero compositor animation rebuilds and zero `ResizeObserver` bursts per frame; long multi-section scroll pages sample compositor tracks strictly within active beat ranges.
- `travel({ to: slot })` matches across live mounts and timed headless reviews without `.in(...)` workarounds, and 3D `travel({ to: slot, fit: "contain" })` scales models responsively from measured `Box3` bounds.
- Multi-section 2D+3D pages share `stageCanvas`, slots, and section pin edges across `.include()` scenes and replace bespoke projection/sticky math and manual transition timestamps with `@gerak/core`, `@gerak/stage`, `@gerak/three`, and `@gerak/dom` primitives.
- Three.js mounts register resize and readiness through `threeBinder(..., { resize, draw })` and `ready(promise)` without duplicate `window` listeners or ambient `Window` augmentations.

## Rejected

- Rebuilding compositor tracks asynchronously after an interaction frame: adds a multi-frame lag window and stale keyframe races instead of eliminating redundant work.
- Keeping timed unwindowed `travel` sweeping across `durationMs`: creates a two-clock discrepancy where pieces authored for live pages break headless review.
- Exempting `"settle"` members blindly whenever `drive.kind !== "more"`: would silence genuine bugs where a motion inside a scroll or trigger beat never moves.
- Allowing `.include()` to merge motions or `.show()` on the same element from two scenes: creates two owners for one animated element ([ADR-198](./ADR-198-authored-cast.md)).
- Defaulting 3D `travel` `fit` to `"contain"` silently or allowing `fit: "fill"`: changing existing `"none"` default would rescale `yuzu-3d`, and non-uniform stretching distorts 3D proportions.
