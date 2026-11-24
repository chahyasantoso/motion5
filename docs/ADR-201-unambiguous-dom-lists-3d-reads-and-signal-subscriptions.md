# ADR-201: Unambiguous DOM lists, generated cast modules, 3D reads & stage rig, selector scroll actions, and signal subscriptions

**Date:** 2026-11-24
**Status:** Accepted, 2026-11-24

## Context

Five pieces of authoring and verification boilerplate kept recurring across multi-section 2D and
3D pieces:

1. `bindList` in `@gerak/dom` switched on match count: multiple `[data-cast="<name>"]` nodes bound
   directly as parts `0..count-1`, whereas a single `[data-cast="<name>"]` node with child elements
   descended into `first.children` — even for `box(name, { parts: true })` and explicit
   `options.nodes[name]` arrays — while non-parts `box(name)` silently took only the first node
   when multiple nodes matched. Pieces with a 1-item list whose card contained `<h3>`/`<p>`
   children collided with child-element binding and fell back to numbered casts (`card0..card3`).
2. Multi-file pieces (`apps/pieces/cookie/`) hand-maintained a `CAST` string dictionary in
   `src/contract.ts` and repeated `box("...")` / `object("...")` declarations across scene modules
   and `world-models.ts`, duplicating information HTML `[data-cast]` markup and `threeBinder`
   already own.
3. `parseActions` accepted only pixel offsets for `scroll:<px>@ms`, so multi-viewport checks under
   `--sizes 1440x900,390x844` could not land on the same section across desktop and mobile without
   hard-coding viewport-specific pixel coordinates, and refreshing `<name>.measure.json` required a
   separate manual `gerak measure` command before `gerak review <scene.ts>` or `gerak sample`.
4. `travelled3d()` already projected DOM slots into 3D space through `boxInViewport`,
   `project3d`, `unproject3d`, and `viewSize3d`, yet `context.read` refused `object` elements
   (`ADR-197`) and no public helper exposed a slot's projected 3D frame, forcing custom 3D scenes to
   duplicate slot projection math (`apps/pieces/cookie/src/space3d.ts`) and repeat parent
   transforms across dependent 3D elements.
5. Every Three.js piece re-implemented identical `Scene`, `PerspectiveCamera(lens.fov)`,
   `applyPose3d(camera, lens)`, `WebGLRenderer`, DPR-clamped `resize`, `draw`, and `threeBinder`
   setup boilerplate.

6. Page UI outside the cast (counts, button `disabled`, mesh materials) had no way to follow a
   scene's `state(...)`, so `apps/pieces/cookie/src/cookie-main.ts` kept a second mutable copy of
   the jar beside the scene's `builderState`.

## Decision

1. **Unambiguous DOM list binding (`@gerak/dom`).**
   - `box(name, { parts: true })` and explicit `options.nodes[name]` arrays always bind the matched
     or supplied elements directly (`1..N`), never descending into a single node's `.children`.
   - `mount` refuses a non-parts `box(name)` matching more than one DOM node, naming `parts: true`.
   - `text(name, { split: "words" | "letters" })` alone binds single-container child elements (or
     wraps `textContent` in `<span>` nodes on mount and restores the original text on `dispose()`).

2. **Generated `<name>.cast.ts` modules, static HTML sync, and `Binder.casts()` (`@gerak/tools`, `@gerak/dom`, `@gerak/three`, `@gerak/stage`).**
   - `gerak measure <brief>/<name>.html` writes `<brief>/<name>.cast.ts` alongside
     `<name>.measure.json`, exporting `cast` (plain `box(...)` and `object(...)` handles, with
     `{ parts: true }` when HTML `[data-cast]` count `> 1` or when a 3D binder reports a list),
     disjoint `DomCast` and `ObjectCast` string literal unions, and `CastName = DomCast | ObjectCast`.
   - `Binder.casts?()` (implemented by `threeBinder` from `options.objects` and bound scene objects)
     is published by `mount` onto `globalThis[BINDER_CASTS]` before scene binding validates nodes, and
     `withPage` captures `window.__motionReady` rejections into `pageErrors`, so `gerak measure` still
     rewrites `<name>.cast.ts` cleanly even when a renamed cast causes `mount()` to throw.
   - `motionLivePlugin()` in `@gerak/tools/vite` watches `.html` adds/changes inside `appRoot` via
     `syncHtmlCastFile`, keeping HTML entries and `{ parts: true }` counts current in `<name>.cast.ts`
     while preserving existing 3D `object(...)` entries.
   - `box<N>`, `text<N>`, `shape<N>`, and `object<N>` preserve literal `name: N` and `parts: true`;
     scene modules import `{ cast } from "../<name>.cast"` directly and override only elements
     requiring options (`text(cast.x.name, { split })`, `box(cast.x.name, { watch: true })`,
     `shape(...)`, or `object(..., { view })`), while Three.js assembly modules stay pure producers
     without importing cast types back from generated files.

3. **Selector-based scroll actions and `--measure` refresh (`@gerak/tools`).**
   - `PageAction`'s `"scroll"` variant widens to `target: ScrollActionTarget` (`{ kind: "px", px }`
     | `{ kind: "selector", selector, offsetPx }`), inspected via an exhaustive `switch`.
     `scroll:<selector>[±px]@ms` resolves `element.getBoundingClientRect().top + scrollY + offsetPx`
     inside the active viewport at action time, failing fast when the selector matches nothing.
   - `gerak review <scene.ts> --measure` and `gerak sample <scene.ts> --measure` refresh a missing
     or stale `<name>.measure.json` or missing `<name>.cast.ts` before loading the scene, keeping
     default headless runs browser-free.

4. **3D `context.read(object)` and `slot3d` projection (`@gerak/stage`).**
   - `MotionContext.read` adds a typed `ObjectElement` overload returning `Pose3d` alongside the
     existing `Element | string` overload returning `Pose2d`. Raw string `context.read("name")`
     and 2D `Element` calls still refuse `object` targets (`RangeError`), and passing an `object`
     proxy matching a 2D element is similarly refused.
   - Frame evaluation maintains separate `read2d` and `read3d` memo caches, tracks active evaluation
     tokens in `env.reading` to throw `RangeError` on 2D, 3D, mixed, self, or mutual list-part
     cycles, and propagates `moves` / `drives` across 3D read edges uniformly.
   - `slot3d(slot, view, context, { depth?, fit?, scrollY? })` and `travelled3d(...)` share
     internal `projectSlot3d(...)`, returning world-unit `{ center, scale, width, height, view }`
     (or `undefined` when unmeasured, behind the lens, or `depth <= 0`).

5. **Opt-in `createStage3d` rig (`@gerak/three`).**
   - `createStage3d(canvas, lens, options?)` creates a bare `Scene`, `PerspectiveCamera(lens.fov,
     1, near, far)` posed via `applyPose3d(camera, lens)`, `WebGLRenderer({ canvas, alpha: true,
     antialias: true })`, clamped-DPR `resize`, `draw`, `dispose`, and `threeBinder(world, {
     objects, resize, draw })`, adding zero preset lights, materials, meshes, tone mapping, or
     shadows (`ARCHITECTURE.md` §6 *no house look*).

6. **Signal subscriptions (`@gerak/player`, `@gerak/react`).**
   - `Player.observe(signal, listener)` calls `listener` with `signal(time, events)` at once and
     after each step whose value differs by `Object.is`, before targets' subscribers, reading the
     same merged, time-filtered events the scene reads, so a seek back undoes later events.
   - `useSignal(player, signal)` in `@gerak/react` renders that value through `observe`.
   - `Mounted` gains no `subscribe`: `mounted.player.observe` is the one path, since the player
     alone knows which events the scene sees at a time.
   - Scene state stays a `state(start, rule)` fold; page code sends events and renders what the
     fold answers, never keeping a copy.

## Consequences

- `box(..., { parts: true })` behaves consistently from `1` to `N` elements regardless of inner DOM
  markup, eliminating indexed cast proliferation such as `flavorTitle0..3`.
- Multi-file pieces import shared, typed DOM/3D cast handles from one generated module with zero
  hand-written `CAST` dictionaries, zero `<CastName>` repetition, and zero rename deadlock.
- Multi-viewport `--sizes` page checks and FPS runs target page sections uniformly via CSS
  selectors.
- Follower 3D objects and projected 2D labels read parent `object` poses directly through
  `context.read(object)` and share one slot projection calculation via `slot3d` and `travel`,
  deleting custom projection helpers (`apps/pieces/cookie/src/space3d.ts`) and studio setup
  boilerplate via `createStage3d`.
- Page UI and Three.js materials follow scene state through `player.observe`, so a piece keeps one
  state machine; `cookie-main.ts` sends jar events and renders `builderState`.

## Amends

- [ADR-154](./ADR-154-the-player.md): the player adds `observe(signal, listener)` beside per-target
  `subscribe`, and `@gerak/react` adds `useSignal` beside `useValue`.
- [ADR-197](./ADR-197-objects-in-a-scene.md): Decision 1 is amended so `context.read(object)`
  returns typed `Pose3d` (with runtime cycle refusal) and `slot3d` exposes single-owner
  world-unit slot projection, while raw string `context.read("name")` stays 2D-typed and refuses
  objects.
- [ADR-198](./ADR-198-authored-cast.md): Decision 2 is refined so `box(..., { parts: true })` and
  explicit `options.nodes` arrays bind matched nodes directly without child descent and non-parts
  `box` refuses multiple DOM nodes; Decision 4 is refined with `<page>.cast.ts` emission (via
  static HTML scan + `Binder.casts()` even on mount error), Vite HTML watch sync, and `--measure`
  refresh on headless CLI commands.
