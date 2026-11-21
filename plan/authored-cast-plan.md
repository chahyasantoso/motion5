# Authored cast

## Goal

A person or an agent making a page, a reel or a 3D piece builds its look in the renderer's own format (HTML and CSS, a
`.glb`, or both) and writes only the motion in gerak, binding the cast by name. The code removes the skin, `group`,
`section` and `el()` from the scene, adds binders that each renderer owns, a measure cache that headless tools read,
scenes that include scenes, and one mount that takes a clock and a frame.

Status: accepted by the owner 2026-11-21; not started. It starts after PR 614 (`feat/stage-3d`)
merges. Two pull requests: the prune, then the refactor.

Read `AGENTS.md` first. Every rule there applies.

## Where things stand

- A piece is a `sceneBuilder` chain. A skin piece draws through `export const skin = { css, defs? }` on `mountStage`,
  which creates nodes tagged `data-cast`; a page scene binds each element with `node: el(selector)` on `mountPage`
  and refuses a skin; a 3D object is bound in renderer code with `bindScene3d(player, stage, { name: Object3D })`.
  Three answers to one question.
- `section(name, el(selector))` is a separate kind whose `.top` and `.end` are scroll points from its measured box.
- `group(name, children)` restates a hierarchy that the DOM and the `Object3D` tree already hold. The only renderers
  are `@gerak/dom` and `@gerak/three`; both have native hierarchy.
- `text(name, value, { split })` and `many(name, count)` state the text and the count that the markup also holds.
- `mountPage` runs a live clock (`liveAt`) with an optional `clock` source; `mountStage` runs a timed clock in a fixed
  frame. Headless review reads zero rest boxes unless `rest` is passed.
- 26 piece folders under `apps/pieces`; 26 tests in `apps/pieces/test`; `test/repo/stage-pieces.test.ts` names
  `shop`, `nowplaying`, `nadi`, `showreel-e` and `penguin`; `performance/stage-baseline.json` times nine skin pieces.
- The NADI brief lives in `plan/measure-nadi.md`, not in the piece. yuzu is the GSAP page measure
  (`performance/page-vs-gsap.mjs`).

## Decisions

### 1. The scene names the cast; each renderer binds it

- A scene holds names, beats, motions and each element's pose kind. It holds no selector, no skin and no renderer
  object. `el()` and `NodeBinding` leave the scene.
- A binder maps names to its renderer's targets at mount. The DOM binder matches `[data-cast="<name>"]`; the Three.js
  binder matches `getObjectByName(name)`. Each takes an optional map that overrides the match by name.
- A piece may run several binders. Each claims the elements of its pose kind. The mount refuses an element no binder
  claims and an element two binders claim, and names it.
- `bindScene3d`'s object map becomes the Three.js binder's override map.

### 2. The markup owns look, layout, text, hierarchy and counts

- The skin goes. Every piece, reels included, ships its look in its renderer's format.
- `group` goes. A parent moves its children through the DOM or the `Object3D` tree.
- `many(name, count)` goes: `box(name)` bound to several nodes has one part per node, `<name>.<index>`.
- `text(name, { split })` takes no string; the markup holds the text. The DOM binder binds child elements the author
  wrote, or wraps the parts on mount, as `mountPage` does today. A readout (text as a function of time) keeps its
  function in the scene.
- `shape` keeps its path: the path is motion data, not markup.
- The `pivot` option goes. The markup owns where an element turns and scales: CSS `transform-origin` (and
  `transform-box`) in the DOM, the origin in an `Object3D`. The mount stops writing them inline; measure records the
  pivot point for headless tools. A pose's `anchor` stays: a motion that sets it turns and scales about that side of
  the measured box for as long as it sets it, over the markup's pivot.

### 3. Every box element has edges

- `section` goes. Every element with a measured box exposes `.top` and `.end` as scroll points, with `.plus`,
  `.minus` and `.reached`. A 3D object has none, and the types refuse it.

### 4. The measure cache

- `gerak measure <page>` opens the page once in headless Chromium, loads every `.glb` it binds, and writes a cache
  beside the piece: per name, its rest box, edges, parent, part count and line per part; per object, its rest
  position and parent.
- `review`, `sample` and every headless tool read the cache. A piece with no cache, or a cache older than its markup,
  is refused with the command that writes it. Review needs no browser.

### 5. Scenes include scenes

- `sceneBuilder().include(scene)` merges another scene: its elements, beats and chain, on one clock. No scene has its
  own time.
- An element gets its motions in one scene; two included scenes claiming one element are refused, naming both.
  Names are global; a clash is refused.
- `frame`, `cues` and `length` belong to the scene that is mounted; including a scene that sets any is refused.
- Each scene still reviews alone against the cache.

### 6. One-sided show

- `.show({ from })`, `.show({ until })` and `.show([from, to])`. A timed scene ends after its last beat, plus
  `length` when given; nothing names the end.

### 7. One mount

- `mount(scene, { clock, frame, binders })` replaces `mountStage` and `mountPage`. `clock` is `"live"` (scroll,
  pointer, triggers) or `"timed"` (seekable, for reels and capture). `frame` is `"page"` (none) or `{ width, height }`
  (fit, scale and clip). The compositor and the engine's frame rules keep working under it.

### 8. Pieces that stay

`yuzu` (page and GSAP measure), `yuzu-3d` (mixed), `overlay3d` (the 3D example the docs cite), `character3d` (a
`.glb` bound by name), `launch-day` (a short reel) and `saved` (the live page's folder). Every other piece is deleted
in the prune.

## The team

- **Lead:** Opus 5.5 at medium effort, one session for the whole plan, so its context stays cached. It writes the
  ADR, the types and rules of each step, the briefs, and judges every diff. It reads diffs with `git diff --stat` and
  targeted reads, never whole packages.
- **Worker:** Sonnet 5.5 at medium effort, started only when the step needs a fresh context or costs less on the
  worker than on the lead, brief included. Otherwise the lead does the step. One worker at a time; the lead continues
  it by message while its context helps. The brief names the step, the files, the commit message and the gate; it
  never restates this plan.
- **Review:** one cold review per pull request by a fresh Sonnet 5.5 agent at medium effort, given the diff range and
  the claims, never the plan.
- No waves, no parallel builders.

## PR 1: the prune

1. Delete every piece folder not kept in decision 8, and its tests in `apps/pieces/test`. Tests made obsolete are
   deleted, not adapted; the pull request lists them.
2. Fix what names them: `test/repo/stage-pieces.test.ts`, `test/repo/agent-guide.test.ts`,
   `packages/tools/test/motion-new.test.ts`, `packages/stage/test/compile.test.ts`, `.prettierignore`, and the docs
   that link a deleted piece (`packages/physics/docs/agent-physics.md`, `packages/stage/docs/README.md`, the guide
   and `docs/MAP.md`). ADRs and plans stay as they are.
3. Regenerate `performance/stage-baseline.json` over the pieces left.
4. `npm run check` green; `SESSION-STATUS.md` states the pieces left.

## PR 2: the refactor

Each step is one commit or a few, green on `npm run check`, in this order:

1. **ADR-198**, covering decisions 1 to 7, with the ADRs it supersedes in part (190, 193, 194, 197).
2. **Measure.** `gerak measure` and the cache format; review and sample read it. The existing pieces still run.
3. **Binders.** The DOM and Three.js binders, `data-cast` matching and override maps; `el()` and `bindScene3d`'s map
   move behind them.
4. **Markup owns structure.** `group`, `many`'s count, `text`'s string and `section` go; edges on every box element.
   Their tests go in the same commit.
5. **One mount.** `mount` with `clock` and `frame`; `mountStage`, `mountPage` and the skin go, with their tests.
6. **Include and one-sided show.**
7. **The canaries.** Convert the six kept pieces. yuzu's frames and its GSAP numbers match the baseline; the 3D
   pieces' frames match theirs.
8. **Scaffold and docs.** `gerak new` writes markup and a motion file per renderer; `stage.md`, `page.md` and
   `agent-3d.md` are rewritten whole; the reference regenerates.
9. **Proof.** A fresh Sonnet 5.5 agent, reading only the docs, builds a page and a reel; then one NADI measure row
   beside the plain agent.

## Deferred

- A reel's capture on the timed clock: any change `gerak render` needs beyond the mount waits for the video app.
