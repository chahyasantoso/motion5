# Authoring, 3D composition, and state ergonomics

## Goal

People and agents making multi-section 2D and 3D web pieces author markup, subject-first scene sentences, interactive UI state, and multi-viewport checks without hand-written cast dictionaries, manual 3D slot projection, duplicated mutable UI stores, stateful `.element(...)` builder cursors, or per-viewport pixel scroll numbers. The code removes the `count === 1` list-binding ambiguity in `@gerak/dom`, generates `<name>.cast.d.ts` from `gerak measure`, adds 3D `context.read(object)` and `slot3d(...)` projection in `@gerak/stage`, adds `createStage3d(...)` in `@gerak/three`, adds `mounted.subscribe(signal, listener)` in `@gerak/dom` (and `useSignal` in `@gerak/react`), adds selector-based scroll actions (`scroll:<selector>@ms`) and `--measure` refresh in `@gerak/tools`, and replaces `sceneBuilder().element(x).motion(...)` with subject-first `scene([options,] ...entries)` and `element.moves(...).modifies(...).shows(...).limits(...)` across the workspace.

Status: planned 2026-11-24 on `feat/authoring-ergonomics` from `main` after PR #617 and PR #621 merged. Four pull requests in order.

Read `AGENTS.md` first. Every rule there applies. Any agent can run this plan; it needs no harness-specific skill.

## Where things stand

- `bindList()` in `packages/dom/src/mount.ts` (`lines 453–477`) treats `[data-cast="<name>"]` differently depending on match count: `matches.length > 1` binds the matched nodes as items, while `matches.length === 1 && kids.length > 0` binds `first.children` (even on `box(name, { parts: true })` and explicit `options.nodes` arrays). That collides at `count === 1` whenever a single item has inner child elements (`<h3>`, `<p>`, `<button>`), and left `apps/pieces/cookie/` with 24 indexed DOM casts (`spotlightTint0..3`, `flavorTitle0..3`, `flavorNum0..3`, `flavorNote0..3`, `flavorDot0..3`, `craftCard0..3`).
- Multi-file pieces like `apps/pieces/cookie/` maintain a 60-line `CAST` string-mirror dictionary in `src/contract.ts` solely to avoid typos across `<name>.html`, `world-models.ts`, `<name>-main.ts`, and `scene-*.ts`, even though `gerak measure` already inspects both DOM `[data-cast]` nodes and bound 3D `objects`.
- `travelled3d()` in `packages/stage/src/author/scene-builder.ts` (`lines 611–668`) already computes sticky `boxInViewport`, `project3d`, `unproject3d`, `viewSize3d`, and `fit: "contain"`, yet `context.read` still refuses `object` elements (`ADR-197`) and no public helper exposes a slot's projected 3D frame to custom motion callbacks. As a result, `apps/pieces/cookie/` still carries 233 lines of manual slot projection in `src/space3d.ts` and repeats `builderJarTransform(...)` across 6 motions in `src/scene-builder.ts`.
- Every Three.js piece (`apps/pieces/yuzu-3d/src/yuzu-3d-main.ts` and `apps/pieces/cookie/src/world-studio.ts`) re-implements the same `WebGLRenderer`, `PerspectiveCamera(lens.fov)`, `applyPose3d(camera, lens)`, DPR/aspect `resize`, and `threeBinder` wiring.
- `Mounted` in `packages/dom/src/mount.ts` writes into the event log via `mounted.send(...)` but offers no subscription to a pure `Signal<T>` / `State<S>`. Consequently, `apps/pieces/cookie/src/cookie-main.ts` duplicates `builderState` (`jarSlots`, `sealed`, `sealId`, `exitPoolCursor`) as a second mutable state machine just to update DOM text, button `disabled` attributes, and cookie flavor meshes.
- `parseActions()` in `packages/tools/src/page/actions.ts` (`lines 42–46`) accepts only raw pixel numbers for `scroll:<px>@ms` (which shift between `1440x900` desktop and `390x844` mobile under `--sizes`), and `gerak review <scene.ts>` / `gerak sample <scene.ts>` require a separate manual `gerak measure` command whenever HTML or CSS changes.
- `sceneBuilder` in `packages/stage/src/author/scene-builder.ts` (`ADR-193`) uses `.element(x)` as a stateful cursor: Prettier aligns `.element(x)` and `.motion(...)` in one flat column (obscuring element boundaries and making `.element(card).element(dot).motion(...)` look as if `card` moves), and loops mixing 2D and 3D steps must declare `let builder: SceneBuilder = sceneBuilder(...)` (`apps/pieces/cookie/src/scene-spotlight.ts:285`) to widen the cursor back.

## Decisions

### 1. Unambiguous DOM list binding (`@gerak/dom`)

- Separate the two DOM list rules by element kind in `packages/dom/src/mount.ts`:
  - `box(name, { parts: true })` always binds the matched `[data-cast="<name>"]` elements directly (`items = matches`, for `1..N`), never descending into `first.children`.
  - `text(name, { split: "words" | "letters" })` owns single-container child binding (using existing child elements when present, or wrapping `textContent` on mount and restoring on `dispose()`).
  - Explicit `options.nodes[name]` arrays always bind the given array elements directly without child descent.
- Update container-tagged `box(..., { parts: true })` fixtures (`apps/pieces/launch-day` `dust` and `packages/dom/test/mount.test.ts`), and collapse `apps/pieces/cookie/`'s `spotlightTint0..3`, `flavorTitle0..3`, `flavorNum0..3`, `flavorNote0..3`, `flavorDot0..3`, and `craftCard0..3` into 6 `box(..., { parts: true })` lists.

### 2. Generated `<name>.cast.d.ts` from `gerak measure` (`@gerak/tools`, `@gerak/stage`)

- `gerak measure <brief>/<name>.html` (`packages/tools/src/page/measure.ts`) writes `<brief>/<name>.cast.d.ts` alongside `<name>.measure.json`, exporting type-only `export type CastName = ...` (the sorted union of `[data-cast]` attribute names in markup and measured 3D `objects` base names, with zero runtime JS emission). `box<N extends string = string>(name: N, ...)`, `text<N extends string = string>(...)`, `shape<N extends string = string>(...)`, and `object<N extends string = string>(...)` take an optional type parameter so multi-file pieces get compile-time typo errors against `<name>.cast.d.ts` with no hand-maintained `CAST` dictionary in `contract.ts`.
- Single-file pieces (`yuzu`, `yuzu-3d`) continue needing no type annotation at all; `apps/pieces/cookie/src/contract.ts` deletes `CastNames` and `CAST`.

### 3. 3D `context.read(object)` and `slot3d` projection (`@gerak/stage`)

- Amend `ADR-197` so `MotionContext.read` carried into scenes has typed overloads:
  - `context.read(target: Element, at?: ReadAt): Pose2d`
  - `context.read(target: ObjectElement, at?: ReadAt): Pose3d`
  Cycle detection (`loopOf`), `drives` (`MORE`), and `moves` propagation treat 2D and 3D reads identically in `packages/stage/src/author/scene-builder.ts`, with `@gerak/stage` remaining the sole owner of cross-element pose reads.
- Extract the single projection calculation inside `travelled3d()` into a shared internal helper and export `slot3d(slot: Element, view: ObjectView, context: MotionContext, options?: { depth?: number; fit?: "none" | "contain" }): Slot3d | undefined` from `@gerak/stage`:
  - Returns `{ readonly center: Point3d; readonly scale: number; readonly width: number; readonly height: number; readonly view: ViewSize3d }` at the current `scroll.y(context.time, context.events)` (or `undefined` when unmeasured or behind the lens).
  - `travelled3d()` calls the exact same helper so `travel({ to: slot, fit })` and `slot3d(...)` share one owner.
- Refactor `apps/pieces/cookie/` to delete `src/space3d.ts` (replacing custom projection helpers with `travel({ to: slot, fit: "contain" })`, `slot3d(...)`, and `context.read(builderJarRoot)` / `context.read(jarRoot)`).

### 4. Opt-in `createStage3d` rig (`@gerak/three`)

- Export `createStage3d(canvas: HTMLCanvasElement, lens: Lens3d, options?: Stage3dOptions): Stage3d` from `@gerak/three`:
  - Owns `WebGLRenderer` creation (`alpha: true`, `antialias: true`, pixel ratio clamped to `options.maxPixelRatio ?? 2`), `PerspectiveCamera(lens.fov, 1, near, far)` posed via `applyPose3d(camera, lens)`, `world` (`new Scene()`), viewport `resize` (`renderer.setSize`, `camera.aspect`, `camera.updateProjectionMatrix`), `draw`, and `binder` (`threeBinder(world, { objects, resize, draw })`).
  - Adds **zero** lights, materials, meshes, tone-mapping presets, or shadows unless configured on `world` by the caller, preserving `ARCHITECTURE.md` §6 (*no house look*).
- Adopt `createStage3d` in `apps/pieces/yuzu-3d/src/yuzu-3d-main.ts` and `apps/pieces/cookie/src/world-studio.ts`.

### 5. Single-owner UI subscriptions (`@gerak/dom`, `@gerak/react`)

- Keep `@gerak/core`'s event-folded `state(start, rule)` as the sole owner of scene state (never mutable external stores inside scenes, preserving seek determinism, `transition`/`springTo` step history, and frame-exact rendering).
- Add `mounted.subscribe<T>(signal: Signal<T>, listener: (value: T) => void): () => void` to `Mounted` in `packages/dom/src/mount.ts`:
  - Evaluates `signal(player.time, driverEvents)` synchronously on registration and after every player step, calling `listener(next)` only when `!Object.is(next, previous)`.
  - Add matching `useSignal<T>(player, signal)` in `@gerak/react` if absent, reading from the same player step.
- Refactor `apps/pieces/cookie/` to export `builderState` from `src/scene-builder.ts` (including flavor per slot in `BuilderSlotEntry`) and drive `cookie-main.ts` UI text, pips, disabled buttons, and Three.js cookie flavor swaps from `mounted.subscribe(builderState, ...)`, deleting the duplicate mutable `jarSlots` / `sealed` state machine in `cookie-main.ts`.

### 6. Selector-based scroll actions and `--measure` refresh (`@gerak/tools`)

- Widen `PageAction`'s `"scroll"` variant in `packages/tools/src/page/actions.ts` to carry `target: { readonly kind: "px"; readonly px: number } | { readonly kind: "selector"; readonly selector: string; readonly offsetPx: number }`, dispatched via an exhaustive `switch`:
  - `scroll:8450@400` scrolls to `8450 px` as today.
  - `scroll:#builder@400`, `scroll:[data-cast="builderStage"]@400`, or `scroll:[data-cast="builderStage"]-120@400` resolves `element.getBoundingClientRect().top + scrollY + offsetPx` inside the active viewport at action time, working identically across `--sizes 1440x900,390x844`.
- Add `--measure` to `gerak review <scene.ts>` and `gerak sample <scene.ts>` (`packages/tools/src/scene/`) so callers and agents can refresh a missing or stale `<name>.measure.json` in one command, while keeping default headless runs browser-free.

### 7. Subject-first `scene(...)` and `element.moves(...)` sentences (`@gerak/stage`, `@gerak/dom`, `@gerak/react`, `@gerak/tools`)

- Replace the stateful `sceneBuilder().element(x).motion(...)` cursor (`ADR-193` Decision 1) with subject-first element bindings passed into `scene(...)`:
  ```ts
  export default scene(
    { name: "yuzu-3d", length: 1300 },
    headline.moves(stagger(rise({ distance: 22 }), { spread: 0.32, by: "line" }).in(intro, ease.cubicOut)),
    drink
      .moves(
        travel({ to: slotHero }),
        rise3d.in(intro, ease.cubicOut),
        travel({ to: slotFeatures }).in(toFeatures, ease.sineInOut),
      )
      .shows({ until: story.end })
      .limits({ jump: 0.6, turn: 30 }),
  );
  ```
- **Pure element bindings (`@gerak/stage`):**
  - `Element` (`box`, `shape`, `text` in `packages/stage/src/author/elements.ts`) exposes non-mutating methods returning a frozen `ElementBinding` (`readonly kind: "binding"`): `.moves(...motions)`, `.modifies(principle)`, `.shows(...windows)`, and `.limits(limits)`.
  - `ObjectElement` (`object`) exposes matching non-mutating 3D methods returning a frozen `ObjectBinding` (`readonly kind: "object-binding"`): `.moves(...motions3dOrTravel)`, `.modifies(principle3d)`, `.shows(...windows)`, and `.limits(limits)`.
  - Chaining `.moves`, `.modifies`, `.shows`, or `.limits` on a binding returns a new frozen binding appending that step (preserving exact `.moves`/`.modifies` layering and `.take()` order, adding `.shows` windows, and refusing duplicate `.limits` fields). Calling `.moves(...)` never mutates the element value itself, so read-only geometry/pose references stay stateless across sub-scenes.
- **`scene([options,] ...entries)` (`@gerak/stage`):**
  - `SceneItem` is a closed union read with an exhaustive `switch`: `ElementBinding`, `ObjectBinding`, bare `Element` / `ObjectElement` (static member with no motions), and `Scene` (merging a sub-scene's members and beats onto `t = 0` of one shared clock, replacing `.include(subScene)` cleanly: `scene({ name: "cookie" }, heroScene, spotlightScene, ...)`).
  - Programmatic lists spread naturally (`...items.map((item) => item.moves(...))`) with zero cursor widening.
  - Keep `.in(beat, ease?)`, `.loop(ms)`, `.take()`, `.ambient()`, `(t, ctx) => Pose`, and `@gerak/moves` unchanged.
- **Single way to make motion (`ARCHITECTURE.md` §6):**
  - Migrate all pieces under `apps/pieces/`, examples under `apps/examples/`, renderers (`@gerak/dom`, `@gerak/react`), and `@gerak/tools` (`review`, `sample`, `frames`, `timeline`, `live`, `new`, `init`, `import-svg --into`, and embedded `make-motion` skill) in waves with frame-exact baseline verification, then delete `sceneBuilder`, `SceneBuilder`, `SceneBuilderOptions`, `ElementStep`, and `ObjectStep` in the final wave before opening PR 4.

## Slices

| Slice | Decisions | Done when |
| --- | --- | --- |
| PR 1: Unambiguous DOM lists, cast types & CLI actions | 1, 2, 6 | `box(..., { parts: true })` with 1 item binds the item (not its children); `gerak measure` emits `<name>.cast.d.ts`; `scroll:<selector>@ms` works across `--sizes 1440x900,390x844`; `gerak review --measure` refreshes stale caches; `cookie` collapses 24 indexed DOM casts into 6 lists and drops `CAST` from `contract.ts` |
| PR 2: 3D `context.read(object)`, `slot3d` & `createStage3d` | 3, 4 | `context.read(object)` composes 3D follower poses and refuses cycles; `slot3d` matches `travelled3d` across sticky/flow slots; `createStage3d` powers `yuzu-3d` and `cookie`; `cookie/src/space3d.ts` is deleted with zero visual regression |
| PR 3: `mounted.subscribe(signal)` & single-owner `cookie` state | 5 | `mounted.subscribe(state, fn)` fires on initial mount, live events, and timed seeks; `cookie-main.ts` deletes its duplicate `jarSlots`/`sealed` store and syncs UI + 3D flavors purely from `builderState` |
| PR 4: Subject-first `scene(...)` & `element.moves(...)` across workspace | 7 | `scene([options,] ...entries)` and `x.moves(...).modifies(...).shows(...).limits(...)` replace `sceneBuilder` / `.element` / `.include` across packages, pieces, examples, scaffolds, skills, and docs with zero frame diff |

## Tests first, per slice

- PR 1: `box("cards", { parts: true })` with a single `<article data-cast="cards"><h3>Title</h3><p>Body</p></article>` binds `[article]` (`count === 1`), while `text("headline", { split: "words" })` still splits/binds child spans; `options.nodes` with a 1-element array binds that element; `gerak measure` writes deterministic `<name>.cast.d.ts` matching HTML + 3D casts; `parseActions` parses `scroll:#sec@200`, `scroll:[data-cast="sec"]+40@200`, and `scroll:800@200`, failing fast when a selector is absent on the page; `gerak review --measure` updates a stale cache and reviews cleanly.
- PR 2: `context.read(leaderObj)` returns `Pose3d` at current and offset times and throws `RangeError` on 2D/3D read cycles; `slot3d(slot, view, ctx, { fit: "contain" })` returns identical `{ center, scale }` to `travel({ to: slot, fit: "contain" })` across flow, fixed, and sticky placements; `createStage3d` syncs camera FOV/pose to `lens`, resizes cleanly, and registers `threeBinder`.
- PR 3: `mounted.subscribe(counterState, fn)` invokes `fn` once initially, skips unchanged frames (`Object.is`), fires on `mounted.send(...)`, and rewinds cleanly when a `"timed"` driver seeks backward; `useSignal` matches in React.
- PR 4: `x.moves(...)` never mutates `x`; `card.moves(a).modifies(p).moves(b).shows(w).limits(l)` preserves layering, `.take()`, principle wrapping, show windows, and duplicate-limit refusal; `scene({ name }, subA, subB, staticEl)` merges sub-scenes onto one clock and refuses duplicate ownership across entries; type test verifies `object` `.moves(...)` rejects 2D-only motions (except `travel`) and `box` `.moves(...)` rejects `Pose3d` motions.

## Proof and measure

- PR 1: `apps/pieces/cookie/` drops 24 indexed DOM cast entries down to 6 `parts: true` lists and deletes `CAST` / `CastNames` from `src/contract.ts`; `gerak check cookie/cookie.html --sizes 1440x900,390x844 --action 'scroll:[data-cast="builderStage"]@400'` passes on both viewports.
- PR 2: `apps/pieces/cookie/src/space3d.ts` is deleted; desktop (`1440x900`) and mobile (`390x844`) `gerak frames` across hero, spotlight, craft, builder, and closing match pre-refactor framing.
- PR 3: `apps/pieces/cookie/src/cookie-main.ts` shrinks by ~150 lines with zero mutable `jarSlots`/`sealed` duplication, passing `gerak review apps/pieces/cookie/src/cookie.ts --to 5200 --events ...` and `gerak fps cookie/cookie.html --to 3500 --action ...` (`worst < 50 ms`, `pageErrors: []`).
- PR 4: sampled frames and `gerak review` outputs across `apps/pieces/` and `apps/examples/` match their pre-PR-4 baselines identically; `npm run check` and `npm run pack:check` pass with zero remaining references to `sceneBuilder` in live code or docs.

## Docs and record

- Write `docs/ADR-201-unambiguous-dom-lists-3d-reads-and-signal-subscriptions.md` (PRs 1–3, amending `ADR-197` and `ADR-198`) and `docs/ADR-202-subject-first-scenes.md` (PR 4, superseding `ADR-193` Decision 1 and refining `ADR-198` Decision 5).
- Run `npm run adr-index:write`, `npm run reference -- --write`, `npm run map -- --write`, and `npm run format`.
- Update `packages/dom/docs/page.md`, `packages/stage/docs/stage.md`, `packages/three/docs/agent-3d.md`, `packages/tools/docs/commands.md`, `docs/ARCHITECTURE.md`, `docs/MAP.md`, and `docs/SESSION-STATUS.md`.

## Execution and working notes

1. Implement PRs 1, 2, 3, and 4 sequentially from `main`, writing failing tests first in each slice and running a cold diff review before merging each PR.
2. Windows PowerShell 5.1 does not support `&&`: chain commands with `; if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE };`.
3. Browser tests (`*-browser.test.ts`) run in Chromium only; rerun a single timed-out browser test with `npx vitest run <file>` before treating it as a regression.

## Not in this plan

- English-prose tween builder chains such as `.upBy(22).fadingIn().over(700).withEase(...)` (`.in(beat, ease)` + `@gerak/moves` + `(t, ctx) => Pose` stay the single inner motion grammar).
- Adopting Zustand or any mutable external store inside scenes (host apps with Zustand bridge one-way via `mounted.send(...)`).
- Default lights, shadows, or materials inside `createStage3d` (violates `ARCHITECTURE.md` §6 *no house look*).
