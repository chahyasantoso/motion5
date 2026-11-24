# ADR-201: Unambiguous DOM lists, generated cast modules, and selector scroll actions

**Date:** 2026-11-24
**Status:** Accepted, 2026-11-24

## Context

Three pieces of authoring and verification boilerplate kept recurring across multi-section 2D and
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

## Consequences

- `box(..., { parts: true })` behaves consistently from `1` to `N` elements regardless of inner DOM
  markup, eliminating indexed cast proliferation such as `flavorTitle0..3`.
- Multi-file pieces import shared, typed DOM/3D cast handles from one generated module with zero
  hand-written `CAST` dictionaries, zero `<CastName>` repetition, and zero rename deadlock.
- Multi-viewport `--sizes` page checks and FPS runs target page sections uniformly via CSS
  selectors.

## Amends

- [ADR-198](./ADR-198-authored-cast.md): Decision 2 is refined so `box(..., { parts: true })` and
  explicit `options.nodes` arrays bind matched nodes directly without child descent and non-parts
  `box` refuses multiple DOM nodes; Decision 4 is refined with `<page>.cast.ts` emission (via
  static HTML scan + `Binder.casts()` even on mount error), Vite HTML watch sync, and `--measure`
  refresh on headless CLI commands.
