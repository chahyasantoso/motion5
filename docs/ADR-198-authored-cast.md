# ADR-198: Authored cast

**Status:** Accepted, 2026-11-21

## Context

A piece answered "what draws this element" three ways: a skin string whose nodes `mountStage` created and tagged
`data-cast`, a selector inside the scene (`node: el(selector)`) on `mountPage`, and a map in renderer code
(`bindScene3d(player, stage, { name: mesh })`). The scene also restated what its markup already held: the hierarchy
(`group`), part counts (`many(name, 3)`), text (`text(name, "…")`), pivots (`pivot`) and section boxes (`section`).
Each was a second owner of a question the markup owns. A page and a reel needed different mounts, and a long page
could not be written as several scenes.

## Decision

1. **The scene names the cast; a binder binds it.** A scene holds names, beats, motions and each element's pose kind,
   and no selector, skin or renderer object. A binder maps names to its renderer's targets when the scene is
   mounted: the DOM binder matches `[data-cast="<name>"]`, the Three.js binder `getObjectByName(name)`, each with an
   optional map that overrides a match by name. A mount with several binders refuses an element no binder claims or
   two claim, naming it. `el`, `NodeBinding` and `bindScene3d`'s object map leave the surface.
2. **The markup owns look, layout, text, hierarchy, counts and pivots.** A piece ships its look in its renderer's
   format: HTML and CSS, a `.glb`, or both. The skin, `group`, `many`, `section` and the `pivot` option go. An element
   bound to several nodes has one part per node, `<name>.<index>`. `text(name, { split })` takes no string: the DOM
   binder binds the child elements the author wrote, or wraps the parts on mount. A readout keeps its function.
   `shape` keeps its path. Where an element turns is CSS `transform-origin` in the DOM and the origin of an
   `Object3D`; a pose's `anchor` turns about a side of the measured box while a motion sets it. **Refined by [ADR-201](./ADR-201-unambiguous-dom-lists-3d-reads-and-signal-subscriptions.md), 2026-11-24.** `box(name, { parts: true })` and explicit `options.nodes` arrays always bind matched elements directly (`1..N`) without descending into a single node's children; `text(name, { split })` alone binds or wraps single-container children.
3. **Every box element has edges.** `box`, `text` and `shape` expose `.top` and `.end` as scroll points, with `.plus`,
   `.minus` and `.reached`. An object has none. **Refined by [ADR-199](./ADR-199-responsive-3d-pages-and-transitions.md), 2026-11-24.** Every DOM element (`box`, `text`, `shape`) also exposes `.pinStart` and `.pinEnd`, reading measured sticky `minY` and `maxY` with `.top`/`.end` fallback.
4. **The measure cache.** `gerak measure <page>` opens the page once in headless Chromium and writes
   `<page>.measure.json` beside it: per name its parts, rest boxes, edges, parent, pivot and line per part; per
   object its rest position and parent. `review`, `sample` and every headless tool read it, and refuse a piece with no
   cache, or a cache older than its markup, naming the command that writes it. **Refined by [ADR-201](./ADR-201-unambiguous-dom-lists-3d-reads-and-signal-subscriptions.md), 2026-11-24.** `gerak measure <page>` also writes `<page>.cast.d.ts` (`export type CastName = ...`) beside `<page>.measure.json`, and `gerak review <scene.ts> --measure` and `gerak sample <scene.ts> --measure` refresh a missing or stale cache on demand.
5. **Scenes include scenes.** `sceneBuilder().include(scene)` merges another scene's elements, beats and chain onto one
   clock. No scene has its own time. Two scenes claiming one element, or one name, are refused. `frame`, `cues` and
   `length` belong to the scene that is mounted; including a scene that sets any of them is refused. **Superseded in part by [ADR-199](./ADR-199-responsive-3d-pages-and-transitions.md), 2026-11-24.** Sibling scenes combined with `.include()` may share read-only element references (`view.canvas`, `travel.to`, edge points, `stayWith`); two scenes claiming motion, show, or limit ownership of one element remain refused.
6. **One-sided show.** `.show(beat)`, `.show([from, to])`, `.show({ from })` and `.show({ until })`. A timed scene
   ends after its last beat, plus `length` when given.

**Amended by [ADR-200](./ADR-200-scroll-presence-3d-lists-and-multiviewport.md):** `.show(...)` also accepts `ScrollBeat`, `[ScrollPoint, ScrollPoint]`, `{ from: ScrollPoint }`, and `{ until: ScrollPoint }`, evaluated alongside timed windows by `frame()`.
7. **One mount.** `mount(scene, { root, clock, frame, binders })` in `@gerak/dom` replaces `mountStage` and
   `mountPage`. `clock` is `"live"` (scroll, pointer and triggers) or `"timed"` (seekable). `frame` is `"page"` or
   `"fit"`, which sizes `root` to the scene's `frame`, clips it and scales it to its parent; a size on the mount would
   be a second owner of the scene's. The engine's frame rules and the compositor hold under
   it. A piece is its page and its motion module; the page's script mounts it, and `stage.html` goes.

Supersedes in part ADR-190 (skins, groups), ADR-193 (the skin as the renderer's, `many`, `group`), ADR-194 (`el`,
`section`, `mountPage`) and ADR-197 (`bindScene3d`'s map).

## Consequences

- An agent writes markup in its renderer's format and a motion module that names it; nothing in gerak styles a piece.
- Headless review reads the cache, so it needs no browser after one `gerak measure`.
- A long page is several scenes in one, each reviewed alone.

## Rejected

- A scene as an element with its own clock: two owners of time, and meaningless on a scroll page.
- A DOM binder that makes the split spans from a string in the scene: the text would have two owners.
- Keeping `group` for renderers with no hierarchy: both renderers have one; a third brings its own in its binder.
