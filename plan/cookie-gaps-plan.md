# Cookie gaps

## Goal

People and agents building multi-section, responsive 2D+3D interactive web pages with gerak author modular scenes without layout-freeze regressions, manual sticky or projection math, or manual state-transition clocks, and catch live-clock and mobile defects through `gerak` CLI checks. The code fixes compositor re-handoff stalls, idle physics replay, unwindowed `travel` clock divergence, and headless/live CLI blind spots first; adds read-only cross-scene references, sticky placement and pin edges, responsive 3D slot fitting, `transition()`, and `Binder.resize`/`ready()`; and adds scroll-window `.show()`, 3D list objects, multi-viewport CLI checks, and 3D cylinder shapes.

Status: planned 2026-11-23 from `apps/pieces/cookie/GAPS.md` after all 5 Warm Batch sections landed. Branch `feat/cookie-gaps` from `feat/authored-cast` (or `main` once PR #617 merges). Three pull requests in order.

Read `AGENTS.md` first. Every rule there applies. Any agent can run this plan; it needs no harness-specific skill.

## Where things stand

- `mount()` in `@gerak/dom` (`packages/dom/src/mount.ts`) attaches `ResizeObserver` to every cast element and unconditionally runs `release()` -> `measure()` -> `handOff()` even when an interactive widget changes size without affecting scroll- or trigger-handed tracks, while `scrollTracks()` (`packages/dom/src/compositor.ts`) samples every scroll element across the full `[0, maxScroll]` range on a 16 px grid.
- `gerak fps` (`packages/tools/src/page/fps.ts`) explicitly rejects `--action`, even though `withPage()` (`packages/tools/src/page/page.ts`) already executes `actions` under `clock: "real"`, and `readPageArgs()` overwrites earlier `--action` flags instead of joining repeated ones.
- `gerak review <scene.ts>` (`packages/tools/src/scene/review.ts`) samples on a zero-scroll timed clock and flags scroll- or trigger-only `"settle"` members as never moved (`stageMemberFindings` checks `!member.watch` without inspecting `drives`).
- Unwindowed `travel({ to: slot })` (`packages/stage/src/author/scene-builder.ts`) anchors at the slot (`progress = 1`) on `"live"` and `"untimed"` clocks yet sweeps `0 -> 1` across the scene duration on a `"timed"` clock (ADR-194).
- `simulate()` (`packages/physics/src/simulate.ts`) steps the physics world forward from step `0` even when zero dynamic bodies exist (`starts.size === 0`), creating multi-second hitches when `{ spawn }` fires late in a live session.
- `sceneBuilder` (`packages/stage/src/author/scene-builder.ts`) calls `validateRegistration` and `OWNERS.set(...)` on read-only geometry dependencies (`view.canvas`, `travel.to`, `edgeElementsOf`, `stayWith`), preventing sibling `.include()` scenes from reading shared elements.
- `@gerak/stage` hides measured `BoxPlacement` and `boxInViewport()` behind `@gerak/stage/render` (`packages/stage/src/render/placement.ts`), and `Edges` exposes `.top`/`.end` without sticky pin edges (`pinStart`/`pinEnd`), forcing `apps/pieces/cookie/src/space3d.ts` and `scene-craft.ts` to duplicate sticky math.
- `@gerak/core` (`packages/core/src/geometry/stage3d.ts`) exposes `project3d`/`unproject3d` with no viewport world-size helper, `threeBinder` records no `Object3D` rest bounds, and 3D `travel` refuses `fit` (ADR-197).
- `@gerak/core` has `easeTo` and `springTo` for numeric fields, forcing discrete multi-field or 3D transitions (Sections 2 and 4 of `apps/pieces/cookie/`) to track start timestamps via `elapsedOf(rawTime(time).clock)` and call `stillMoving()` manually.
- Pieces using Three.js (`apps/pieces/yuzu-3d/src/yuzu-3d-main.ts` and `cookie-main.ts`) wire separate resize listeners beside `mount`'s resize pass and declare `window.__motionReady` locally.
- `.show()` accepts clock `Beat`s only, `object()` lacks `{ parts: true }`, `gerak check`/`review` cache a single viewport, and `@gerak/physics` / `@gerak/rapier` support only `sphere` and `box` 3D shapes (`apps/pieces/cookie/` works around these with `PARKED_Z = 15`, 25 indexed `object` casts, manual mobile checks, and sphere crumbs).

## Decisions

### 1. Live-clock compositor stability (`G-15`)

- `compositor.ts` wraps `input.rest` in a tracked `RestReader` spy so `scrollTracks()` and `triggerTracks()` return the exact set of rest box names read (beat edge targets plus any `context.rest.get(...)` calls).
- `scrollTracks()` computes each qualifying scroll element's active scroll intervals from its `drive.beats` (`[from.at(rest), to.at(rest)]`) and samples the 16 px grid only inside those active intervals plus `0`, `maxScroll`, and beat edges, preserving `TRACK_TOLERANCE` and `MAX_SAMPLES`.
- In `mount.ts`, `sameRest` compares `placementOf(box)` alongside `{ x, y, width, height }`, and `ResizeObserver` callbacks coalesce cleanly so DOM bursts measure once.
- When `remeasure()` finishes, `mount.ts` skips `release()` and `handOff()` rebuilds whenever `maxScroll`, `lines`, and every box/placement recorded in `handedDeps` are unchanged. Single owner of compositor handoff remains `@gerak/dom`.

### 2. Unwindowed `travel` across every clock (`G-05`)

- Unwindowed `travel({ to: slot })` resolves at `progress = 1` on `"timed"`, `"live"`, and `"untimed"` clocks alike in `packages/stage/src/author/scene-builder.ts` (both 2D `travel` and `travel3d`); sweeping over a beat requires `.in(beat)`.
- `@gerak/stage` stays the sole owner of `travel` timing across clocks; amends ADR-194 via ADR-199.

### 3. Idle pre-spawn physics fast-forward (`G-14`)

- In `packages/physics/src/simulate.ts`, when `starts.size === 0 && head < target`, `seek(target)` jumps `head` directly in O(1) to `Math.min(target, nextSpawnEventStep)` (or `target` when no spawn event lies ahead) without stepping an empty world or saving idle snapshots, preserving bit-for-bit identical replay under ADR-165.
- `@gerak/physics` stays the sole owner of simulation seeking; `@gerak/rapier` needs no wrapper change.

### 4. Truthful scene review and real-clock interactive FPS (`G-08`, `G-16`)

- `readPageArgs()` in `packages/tools/src/page/page.ts` accumulates repeated `--action` flags into an ordered array and joins them before `parseActions()`.
- `parseFpsArgs()` and `measureFps()` in `packages/tools/src/page/fps.ts` accept `--action`, passing `actions` into `withPage()` under `clock: "real"` so real-clock frame drops and main-thread stalls during clicks and scrolls are caught by CLI gates.
- `reviewSceneModule()` in `packages/tools/src/scene/review.ts` collects `drives` during `evaluate()` and, when an unmoved `"settle"` member reports `drive.kind === "scroll"` or `drive.kind === "trigger"`, probes synthetic scroll samples across its measured `[from, to]` or `[0, threshold + beat.ms]` range, reporting `"never moved"` only when genuinely static under its own driver. `@gerak/tools` owns both CLI gates.

### 5. Read-only cross-scene references across `.include()` (`G-01`)

- `packages/stage/src/author/scene-builder.ts` separates `owned` elements (those configured via `.element(...)` with `.motion()`, `.show()`, or `.limits()`, enforcing ADR-198's single owner) from `referenced` elements (read-only geometry inputs pulled in via `view.canvas`, `travel.to`, `edgeElementsOf`, or `stayWith`).
- Sibling scenes combined with `.include()` may share read-only references to the same `Element` (such as a shared `stageCanvas`, section edge, or slot); `.include()` retains the owning scene's `Entry` rather than overwriting with `NO_ENTRY` and still throws when two scenes both claim motion/show/limit ownership of one element.

### 6. Sticky placement and pin edges (`G-11`)

- `packages/stage/src/index.ts` re-exports `boxInViewport`, `placementOf`, and `type BoxPlacement` from `./render/placement` so scenes and helper modules share `@gerak/dom`'s measured sticky contract without importing internal or render subpaths.
- `Edges` in `packages/stage/src/author/elements.ts` gains `pinStart` and `pinEnd` (`ScrollPoint`s) reading `placementOf(rest.get(name))` with an exhaustive `switch`: `"sticky"` answers `minY` and `maxY`; `"flow"` and `"fixed"` fall back to `.top` and `.end`.

### 7. Responsive 3D sizing and measured object bounds (`G-02`)

- `@gerak/core` exports `viewSize3d(lens, stage, depth)` returning `{ width, height, unitsPerPx }` in `packages/core/src/geometry/stage3d.ts` with the same validation rules as `project3d`/`unproject3d`.
- `Binder` (`packages/dom/src/mount.ts`) gains optional `measure?: () => Readonly<Record<string, ObjectBounds3d>>`; `threeBinder` (`packages/three/src/scene3d.ts`) measures `THREE.Box3` rest `{ width, height, depth }` per bound `Object3D`, stored under `objects` in `Measurement` / `<page>.measure.json` and exposed read-only via `RestReader`.
- 3D `travel({ to: slot, fit })` revises ADR-197 to accept `fit?: "none" | "contain"` (defaulting to `"none"` on `object` so existing `yuzu-3d` behavior stays unchanged; `"contain"` uniformly scales using `viewSize3d` and measured 3D bounds to fit the CSS slot). Pixel `arc` and `fit: "fill"` remain refused on `object`.

### 8. Discrete state transitions (`G-10`)

- `packages/core/src/state/transition.ts` exports `transition<S>(source, options)` returning a `Signal<Transition<S>>` (`{ current, previous, progress, active }`) accepting `ms: number | ((from: S, to: S) => number)` and optional `ease`.
- On `"live"` clocks it reads `source.steps(rawTime(time), events)` untracked, interrupts mid-transition from the current state, calls `stillMoving()` strictly while `active` (`progress < 1`), and returns `progress: 1, active: false` without a clock. Single owner of discrete transition clocks stays `@gerak/core`.

### 9. Binder resize and readiness hooks (`G-07`)

- `Binder` (`packages/dom/src/mount.ts`) and `ThreeBinderOptions` (`packages/three/src/scene3d.ts`) gain an optional `resize?: () => void` callback invoked inside `mount`'s `remeasure()` before `measure()`.
- `@gerak/dom` exports `ready(promise)` as the single typed owner of `window.__motionReady`, replacing ambient per-project declarations.

### 10. Scroll-window presence and 3D list objects (`G-09`, `G-03a`)

- `ShowWindow` in `packages/stage/src/author/scene-builder.ts` accepts `ScrollBeat`, `[ScrollPoint, ScrollPoint]`, `{ from: ScrollPoint }`, and `{ until: ScrollPoint }`.
- `frame()` (`packages/stage/src/run/frame.ts`) becomes the single owner of `visible[name]` across clock stretches and scroll windows; `threeBinder` reads frame-computed visibility rather than calling `stage.visibleAt(ms)` independently.
- `object(name, { parts?: boolean, view? })` mirrors `box(name, { parts: true })`, binding `Object3D[]` overrides or `Group.children` in `threeBinder` (`ObjectTarget3d` union read with exhaustive `switch`), with typed `Pose3d` overloads on `stagger` and `bindEach`.

### 11. Multi-viewport checks and 3D cylinder shapes (`G-06`, `G-04a`)

- `gerak check` and `gerak review <page>` (`packages/tools/src/page/`) accept `--sizes WxH,WxH` (defaulting to `--size`) and report per-viewport findings and labelled sheets.
- `@gerak/physics` (`packages/physics/src/world.ts`) adds `{ kind: "cylinder", radius, height }` to `Shape3d` (and `Collider3d` where static cylinders apply), and `@gerak/rapier` (`packages/rapier/src/world3d.ts`) handles it in exhaustive `switch` arms via `RAPIER.ColliderDesc.cylinder(height / 2, radius)`.

## Slices

| Slice | Decisions | Done when |
| --- | --- | --- |
| PR 1: Stability, physics & CLI | 1, 2, 3, 4 | `remeasure()` triggers 0 handoff rebuilds on non-dependency UI edits; beat-scoped `scrollTracks` matches engine on `yuzu`; late physics spawn at 120 s runs in `< 50 ms`; unwindowed `travel` matches across live and timed clocks; `gerak review` passes `yuzu`/`yuzu-3d`; `gerak fps --action` runs cleanly on `cookie.html` |
| PR 2: Responsive 3D & composition | 5, 6, 7, 8, 9 | Cross-scene shared `stageCanvas`/slots compile without duplicate-owner errors; `.pinStart`/`.pinEnd` and `boxInViewport` work in scenes; `viewSize3d`, `Measurement.objects`, and 3D `travel({ fit: "contain" })` pass responsive tests; `transition()` replaces manual `rollStartMs` clocks; `yuzu-3d` and `cookie` adopt `ready()` and `threeBinder.resize` |
| PR 3: 3D lists, visibility & tools | 10, 11 | Scroll-gated `.show()` hides `Object3D.visible` outside section bounds; `object(..., { parts: true })` binds `Group`/arrays with `stagger`/`bindEach`; `cookie` deletes `PARKED_Z = 15` and collapses 25 indexed casts into 4 list objects; `--sizes` checks desktop + mobile; Rapier 3D cylinder conformance passes |

## Tests first, per slice

- PR 1: resizing a non-dependency cast element triggers zero compositor `handOff()` rebuilds; beat-scoped `scrollTracks()` matches `frame()` on `yuzu` across 50 scroll positions at two viewports; `simulate()` spawn at `120000 ms` matches `0 ms` state shifted and runs under budget; unwindowed 2D and 3D `travel` sit at slot `1` on timed and live clocks; `reviewSceneModule` passes scroll/trigger-only `"settle"` members and still fails static ones; `readPageArgs` joins repeated `--action` flags and `gerak fps --action` runs on a real clock.
- PR 2: `.include()` allows read-only shared `view.canvas`, `edgeElementsOf`, and `travel.to` across scenes while refusing two scenes claiming motions on one element; `Element.pinStart`/`pinEnd` resolve sticky `minY`/`maxY` and fall back to `.top`/`.end`; `viewSize3d` inverts consistently with `project3d`/`unproject3d` at multiple depths and FOVs; `threeBinder.measure()` records `Box3` bounds into `Measurement.objects` and `travel({ fit: "contain" })` fits slots at `1440x900` and `390x844`; `transition()` handles interruptions, asymmetric durations, untimed clocks, seeking, and `stillMoving()`; `ready()` sets `window.__motionReady` and `Binder.resize` runs on remeasure.
- PR 3: `.show(scrollBeat)` and `.show([pointA, pointB])` drive `frame().visible` and `Object3D.visible` without breaking clock `.show()` or compositor eligibility; `object(name, { parts: true })` drives `Group.children` and `Object3D[]` via `stagger` and `bindEach` across live and timed mounts and `reviewSceneModule`; `gerak review --sizes 1440x900,390x844` reports viewport-prefixed findings; Rapier 3D `{ kind: "cylinder", radius, height }` passes roll, floor contact, and snapshot seek tests.

## Proof and measure

- PR 1: `gerak fps cookie/cookie.html --to 3500 --action scroll:8450@400,click:[data-builder-add=\30]@900` reports worst frame gap `< 50 ms` and `pageErrors: []`; `compositor-browser.test.ts` matches `frame()` across 50 scroll positions on `yuzu`.
- PR 2: `apps/pieces/cookie/` refactors `space3d.ts` (~85% line reduction), removes manual `rollStartMs` clocks from `scene-spotlight.ts` and `scene-builder.ts`, and matches desktop (`1440x900`) and mobile (`390x844`) `gerak frames` with zero regressions; `apps/pieces/yuzu-3d/src/yuzu-3d-main.ts` adopts `threeBinder(..., { resize, draw })`.
- PR 3: `apps/pieces/cookie/` eliminates all `PARKED_Z = 15` workarounds and collapses `flavorCookie0..3`, `builderCookie0..5`, `builderExitCookie0..2`, and `builderCrumb0..11` into 4 `object(..., { parts: true })` elements, passing `gerak check --sizes 1440x900,390x844` and `gerak review`.

## Docs and record

- Write `docs/ADR-199-responsive-3d-pages-and-transitions.md` covering Decisions 1–9 (and add ADR-200 or update alongside PR 3 for Decisions 10–11), appending supersession/refinement markers per `docs/PR-WORKFLOW.md` on `ADR-194` (unwindowed timed `travel`), `ADR-197` (3D `travel` `fit` and list objects), and `ADR-198` (read-only cross-scene references and scroll-window visibility).
- Run `npm run adr-index:write`, `npm run reference -- --write`, and `npm run map -- --write` after export/folder/ADR changes.
- Update `packages/core/docs/core.md` (`transition`, `viewSize3d`), `packages/stage/docs/stage.md` (unwindowed `travel`, cross-scene references, `pinStart`/`pinEnd`, `boxInViewport`, scroll `.show()`, `object(..., { parts: true })`), `packages/dom/docs/page.md` (`ready`, `Binder.resize`/`measure`, compositor remeasure behavior), `packages/three/docs/` (`fit: "contain"`, `Object3D[]`/`Group` binding), `packages/tools/docs/commands.md` (`fps --action`, `--sizes`), and rewrite `docs/SESSION-STATUS.md`.

## Execution

1. Wait for `feat/authored-cast` PR #617 to settle or branch cleanly per repository workflow; verify clean baseline with `npm run check`.
2. Implement PR 1 (Decisions 1–4), PR 2 (Decisions 5–9), and PR 3 (Decisions 10–11) sequentially, writing tests first in each slice.
3. Run `npm run check` and `npm run pack:check` before opening each PR.
4. Perform one cold review by a fresh agent that has not read this plan before merging each PR.

## Working notes for any harness

- Windows PowerShell 5.1 does not support `&&`: chain commands with `; if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE };`.
- Browser tests (`*-browser.test.ts`) run in Chromium only; rerun a timed-out test alone with `npx vitest run <file>` before treating it as a failure.
- In `apps/pieces/cookie/`, never stage or commit `apps/pieces/cookie/references/reel-inspo.mp4`.
- Re-measure modified HTML/CSS piece fixtures (`npx gerak measure cookie/cookie.html --size 1440x900`) whenever DOM boxes change.

## Not in this plan

- Pre-warmed synchronous Rapier WASM initialization (`G-13`; module top-level `await` remains adequate for browser ES modules and sync `build(world)` contracts).
- Programmatic `scrollTo` helper inside `@gerak/dom` (`G-12`; `window.scrollTo` + `mounted.send()` stays outside the pure input driver).
- 3D pointer raycasting inside `@gerak/stage` (`G-03b`; DOM hit-targets keep keyboard accessibility and pure layer separation).
- Mid-simulation physics body deletion (`G-04b`; Gerak curves + `state` folds own interactive edits while physics stays additive under ADR-165).
- Pixel `arc` on 3D `travel` (ADR-197; world-unit `along3d` and `ballistic` own 3D trajectories).
- Multi-scene motion mutation (`.extend`; only read-only element references cross `.include()` boundaries).
