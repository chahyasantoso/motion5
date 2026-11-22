# Authored cast

## Goal

A person or an agent making a page, a reel or a 3D piece builds its look in the renderer's own format (HTML and CSS, a
`.glb`, or both) and writes only the motion in gerak, binding the cast by name. The code removes the skin, `group`,
`section` and `el()` from the scene, adds binders that each renderer owns, a measure cache that headless tools read,
scenes that include scenes, and one mount that takes a clock and a frame.

Status: accepted by the owner 2026-11-21. The prune merged as PR 615. The refactor is on `feat/authored-cast`: steps
1 to 9 are done (`npm run pack:check` passed all 43 checks; step 9 doc proof and NADI measure on `gemini-4-hydrogen`
medium passed), ready for cold review and PR 2.

Read `AGENTS.md` first. Every rule there applies.

## Where things stand

- Steps 1 to 9 replaced `mountStage`, `mountPage`, the skin, `el(selector)`, `bindScene3d`, `group`, `many`, `text`'s
  string, `pivot`, `section`, `rest`, `layouts` and `import-svg` with `mount(scene, { clock, frame, root, binders,
  nodes })` binding `data-cast`, `threeBinder` binding objects, `.include`, one-sided `.show`, element edges,
  markup-owned part counts and hierarchy, `carry` triggered on re-measure, and `gerak measure`.
- Pieces: `saved`, `launch-day`, `overlay3d` and `character3d` are page, motion module and main, mounted timed and
  measured. `yuzu` and `yuzu-3d` mount live and are measured. `timing`, `card` and `pile` are plain React scene
  modules and need no cache. `performance/stage-baseline.json` is regenerated over the 6 kept pieces.
- A page edit makes its cache stale: run `gerak measure <brief>/<name>.html` again, or review refuses the scene.
- `npm run pack:check` passed all 43 checks; step 9 verified a fresh `gemini-4-hydrogen` (medium) agent building a
  page and reel from docs alone (`landing` and `promo`) plus the NADI run (`36` calls, `4.0 min` vs plain HTML `30`
  calls, `4.1 min`), and added `pop`/`unfold` options, live `elapsedOf`, and discrete `cues` notes to the docs.

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
  pointer, triggers) or `"timed"` (seekable, for reels and capture). `frame` is `"page"` (none) or `"fit"`: `root`
  takes the scene's `frame` size, clipped and scaled to its parent's box; a size on the mount would be a second owner.
  The compositor and the engine's frame rules keep working under it.

### 8. Pieces that stay

`yuzu` (page and GSAP measure), `yuzu-3d` (mixed), `overlay3d` (the 3D example the docs cite), `character3d` (a
`.glb` bound by name), `launch-day` (a short reel, with the showreel moves it borrowed moved into it) and `saved`
(the live page's folder). `timing`, `card` and `pile` stay as scene modules the live page, its browser tests and
`gerak frames`' self-check run on. Every other piece is deleted in the prune; `references/` stays for the rig tests.

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
   - `gerak measure <brief>/<name>.html` reads each mount's `measure()` and writes `<name>.measure.json`: frame, rest
     boxes with placement, lines, cast parents, and a digest of the page and its stylesheets. A builder scene
     `<brief>/src/<name>.ts` whose page exists is refused without a cache matching that digest.
   - The frame size is the markup's: a fitted root's CSS size; the scene's `frame` option is gone.
   - Objects stay out of the cache until a headless tool reads an object's rest.
3. **Binders.** The DOM and Three.js binders, `data-cast` matching and override maps; `el()` and `bindScene3d`'s map
   move behind them.
   - `mount` is the DOM binder, with `nodes` overriding the `data-cast` match by name; `binders` draw the objects,
     each object claimed by exactly one. `threeBinder(root, { objects, draw })` matches `getObjectByName` and replaces
     `bindScene3d`; the React 3D pieces call its `start` on their own player until step 7 mounts them.
4. **Markup owns structure.** `group`, `many`'s count, `text`'s string and `section` go; edges on every box element.
   Their tests go in the same commit. `pivot` and `section` are gone. Build in this order, one commit each: part
   counts, then `group`, then `rest`, `layouts` and `carry`.
   - **Part counts are the markup's.** The scene declares that an element has parts, because its motion reads its
     index: `box(name, { parts: true })`, or `text(name, { split })`. The count is the markup's (matched nodes, or
     the letters or words the mount wraps) and reaches `frame` beside the rest boxes: from the mount's binding, or
     from the cache's `<name>.<index>` boxes. Compile checks no count; `stagger` keeps building each part once per
     `index/count`.
   - **`group` goes.** A box takes its place and the markup nests. A hidden parent hides its children through the
     DOM; headless review reads the parent from the cache's `parents`.
   - **`rest` and `layouts` go.** The cache owns rest. The page arranges itself with CSS, and the mount re-measures.
     `carry` stays, triggered by a re-measure: an element whose rest moves is carried from its old box to its new.
     Today `carry` reads `layouts.pick` and each layout's rest (`run/carry.ts`); its options keep their meaning.
5. **One mount.** `mount` with `clock` and `frame`; `mountStage`, `mountPage` and the skin go, with their tests.
   - `mount` grows from `mountPage`; its time source option is `now`. `"timed"` runs the seekable `clockDriver` over
     the scene's length, the whole scene each frame, with no compositor hand-off.
   - `"fit"` measures rest boxes in frame px, from `root`'s unscaled top left.
   - A shape's path is written on its bound `<path>` from the measured boxes.
   - The React `<Stage>` mounts over its children; the live editor and the talk page load the piece's page, inject
     its styles and body, and mount over the body's first element; `stage.html` goes.
   - `gerak import-svg` and its piece edit go: they wrote a skin. The artwork guide puts the SVG in the page.
6. **Include and one-sided show.**
7. **The canaries.** Convert the six kept pieces; `saved` and `launch-day` are done. `overlay3d` and `character3d`
   get a page whose main mounts with `threeBinder`, and are measured. yuzu's frames and its GSAP numbers match the baseline; the 3D
   pieces' frames match theirs. `performance/stage-benchmark.mjs`, which still looks for `defineStage`, runs the
   converted pieces through the new mount, and `performance/stage-baseline.json` is regenerated over them.
8. **Scaffold and docs.** `gerak new` writes markup and a motion file per renderer (`--three` still writes a React
   component that starts `threeBinder` itself); `stage.md`, `page.md` and
   `agent-3d.md` are rewritten whole; the reference regenerates.
9. **Proof.** A fresh Sonnet 5.5 agent, reading only the docs, builds a page and a reel; then one NADI measure row
   beside the plain agent.

## Deferred

- A reel's capture on the timed clock: any change `gerak render` needs beyond the mount waits for the video app.
