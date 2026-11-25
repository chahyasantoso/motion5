# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `test/repo/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-11-25, Asia/Jakarta.
- **Read against:** `t3/lossless-parallel-render`, built on `feat/render-speed`.

## Now

- **A piece is a `scene(options, ...items)` of element bindings compiled with `compileScene`, split across thirteen packages in three enforced groups (`core`, `modules`, `library`), played by `mount` over the page nodes tagged `data-cast`, on a live or timed clock, in place or fitted to the page root.**
  `@gerak/core` owns fields, time (`span`, `chain`, `lanes`, `loop`, `sequence`, `repeated`, `reversed`, `timeAt`, `motion` with `MotionWindow`, `shared`), shapes (`Timing`, `Curve<T = number>`, `Ease = Curve<number>`, `Signal<T = Pose2d>`), eases (`ease.*`, `backEase`, `springEase`, `spring`), envelopes (`arch`, `wave`, `attack`, `decay`, `taper`), blends, paths (`ballistic`, `along`, `along3d`), geometry, 3D maths (`project3d`, `unproject3d`, `viewSize3d`), measures (`velocity`, `velocity3d`, `tally`), motion principles (`squashStretch`, `anticipation`, `followThrough`, `overlap`, `arc`, `exaggerate`, `secondary`, `smear`, `trail`) and state from events (`state`, `eventLog`, `scroll`, `pointer`, `INPUT_EVENTS`, `transition`, `springTo`, `easeTo`, which `follow` and `tally` build on, and `watchClock` with `stillMoving`, which tell a renderer what moves with time alone);
  `@gerak/stage` owns `scene` (each element bound once through its frozen `.moves`/`.modifies`/`.shows`/`.limits` binding, sub-scenes merged onto one clock, `shot(scene, { length?, until?, overlap? })` sub-scenes played one after another on their own clocks and listed in `stage.shots`, read-only geometry references shared across them), typed literal-preserving elements (`box<N>`, `shape<N>`, `text<N>` with optional `{ split }`, and `object<N>` with optional `{ parts: true }`, a Three.js object or `Object3D[]`/`Group` list posed in `Pose3d`), beats (clock `beat`, `scrollPoint`, `.top`/`.end`/`.pinStart`/`.pinEnd` edges on every box element, scroll beats with `smooth`, triggered beats with `back`), one-sided and scroll-window `.shows(...)`, `bind`, 2D/3D `bindEach` and `stagger` (by `index` or `line`), `stayWith`, `carry` (across re-measure), `travel` (onto measured slots, sitting there with no window on every clock, and uniform `fit: "contain" | "none"` on `object` through its view's lens and measured `RestReader.object` bounds), `slot3d` (single-owner world-unit viewport slot projection shared with `travel`), `context.read(object)` (typed `Pose3d` reads with runtime loop refusal across 2D, 3D, mixed, and list-part evaluations, while raw string `context.read("name")` stays 2D-only), `compileScene`, `frame` (single owner of merged clock + scroll `visible` via `frameVisible`, reporting each element's `moves` and `Drive`), `check`, viewport sticky placement (`placementOf`, `boxInViewport`, `BoxPlacement`), `@gerak/stage/render` stroke outlines and `@gerak/stage/dom` tokens; `@gerak/player` (`play`, `Player` with per-target `subscribe` and `observe(signal)`, which page UI uses to follow scene state), `@gerak/dom` (`ready` owning `window.__motionReady`, `BINDER_CASTS` publishing `Binder.casts()` prior to scene validation errors, and `mount`, where `box(..., { parts: true })` and explicit `nodes` arrays bind matched nodes directly, non-parts `box` refuses multiple DOM nodes, and `text(..., { split })` owns single-container child/span binding, calling `Binder.resize`/`counts`/`measure` into `Measurement.objects`/`counts`, handing Chromium compositor Web Animations except scroll-`.shows()` members, coalescing `ResizeObserver` bursts, skipping rebuilds when handed dependencies stay unchanged, and triggering `carry` when measured rest boxes move), `@gerak/react` (`<Stage>`, `usePlayer`, `useSignal`, `PlayerHost`) and `@gerak/three` (`threeBinder` with `frameVisible`, `casts()`, `resize`, `counts`, `Object3D[]`/`Group.children` lists, and local `Box3` `measure()`, plus `createStage3d` bare `Scene`/`PerspectiveCamera`/`WebGLRenderer`/`threeBinder` rig with zero preset look) play and write `Signal`.
  Opt-in modules (`@gerak/rig`, `@gerak/rig-three`, `@gerak/physics` with O(1) idle pre-spawn `simulate()` fast-forward and 3D `cylinder` shapes/colliders, `@gerak/rapier`) depend only on core (and paired core renderers);
  the library (`@gerak/moves`) adds plain moves, `squashed` couplings and `follow`, `react` and `noise1d` signals when installed.
  `@gerak/tools` runs `npx gerak <command>` cleanly with core alone (`gerak measure` caches DOM, `objects` bounds and 3D list `counts` into `<name>.measure.json` and writes `<name>.cast.ts` with `cast` handles, `DomCast`, `ObjectCast`, and `CastName` even on failed mounts via static HTML scanning + `Binder.casts()`, while `motionLivePlugin()` keeps HTML entries synced on save in Vite; `gerak check`/`review` accept multi-viewport `--sizes` and `scroll:<selector>[±px]@ms` page actions, headless `gerak review`/`sample` accept `--measure` to refresh stale caches or missing cast modules and probe sticky/scroll/trigger/watched drivers with `--events` beside `cues` while expanding 3D list parts, and `gerak fps --action` runs repeatable actions on a real clock); `npx gerak init` writes page files, `tsconfig.json`, skill and `AGENTS.md` naming read-whole `core.md` and `stage.md`, which explain how each package works and link its reference pages.
  Decisions are ADR-170 to ADR-203; each package ships its docs and generated `packages/<package>/docs/reference` pages, installed from tarballs (nothing is on npm).

## Next in line

- **The render-speed PR is built on `feat/render-speed` (exact held-clock frame timestamps, fitted body scaling, and lossless fast PNG capture); Visual Studio (`plan/studio-plan.md`) comes next.**

## Open, and not scheduled

- Retargeting remains a proposed design only.
- React Three Fiber integration is deferred; `talk.html` is untried with a microphone.
- Browser tests run in Chromium only.
- A page frame after an input still runs every engine element; yuzu's `smooth` bottle keeps it at about 2.4x GSAP's script time, while yuzu without `smooth` runs at about 0.7x.
- The instrument waits for a person who asks to live-code.

## Where the rest of it lives

- Exact commits, runs, decisions and evidence: the owning pull request.
- Standing rules: [AGENTS.md](../AGENTS.md). Who owns what: [ARCHITECTURE.md](./ARCHITECTURE.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md).
- Earlier history remains in Git.
