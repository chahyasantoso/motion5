# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `test/repo/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-11-24, Asia/Jakarta.
- **Read against:** `feat/cookie-gaps-3`, branched from `feat/authored-cast` after PR 620.

## Now

- **A piece is a `sceneBuilder` chain compiled with `compileScene`, split across thirteen packages in three enforced groups (`core`, `modules`, `library`), played by `mount` over the page nodes tagged `data-cast`, on a live or timed clock, in place or fitted to the page root.**
  `@gerak/core` owns fields, time (`span`, `chain`, `lanes`, `loop`, `sequence`, `repeated`, `reversed`, `timeAt`, `motion` with `MotionWindow`, `shared`), shapes (`Timing`, `Curve<T = number>`, `Ease = Curve<number>`, `Signal<T = Pose2d>`), eases (`ease.*`, `backEase`, `springEase`, `spring`), envelopes (`arch`, `wave`, `attack`, `decay`, `taper`), blends, paths (`ballistic`, `along`, `along3d`), geometry, 3D maths (`project3d`, `unproject3d`, `viewSize3d`), measures (`velocity`, `velocity3d`, `tally`), motion principles (`squashStretch`, `anticipation`, `followThrough`, `overlap`, `arc`, `exaggerate`, `secondary`, `smear`, `trail`) and state from events (`state`, `eventLog`, `scroll`, `pointer`, `INPUT_EVENTS`, `transition`, `springTo`, `easeTo`, which `follow` and `tally` build on, and `watchClock` with `stillMoving`, which tell a renderer what moves with time alone);
  `@gerak/stage` owns single-owner `sceneBuilder` (sharing read-only geometry references and `.include(scene)` across sections onto one clock), elements (`box` with optional `{ parts: true }`, `shape`, `text` with optional `{ split }`, and `object` with optional `{ parts: true }`, a Three.js object or `Object3D[]`/`Group` list posed in `Pose3d`), beats (clock `beat`, `scrollPoint`, `.top`/`.end`/`.pinStart`/`.pinEnd` edges on every box element, scroll beats with `smooth`, triggered beats with `back`), one-sided and scroll-window `.show(...)`, `bind`, 2D/3D `bindEach` and `stagger` (by `index` or `line`), `stayWith`, `carry` (across re-measure), `travel` (onto measured slots, sitting there with no window on every clock, and uniform `fit: "contain" | "none"` on `object` through its view's lens and measured `RestReader.object` bounds), `compileScene`, `frame` (single owner of merged clock + scroll `visible` via `frameVisible`, reporting each element's `moves` and `Drive`), `check`, viewport sticky placement (`placementOf`, `boxInViewport`, `BoxPlacement`), `@gerak/stage/render` stroke outlines and `@gerak/stage/dom` tokens; `@gerak/player` (`play`, `Player`), `@gerak/dom` (`ready` owning `window.__motionReady`, and `mount`, which calls `Binder.resize`/`counts`/`measure` into `Measurement.objects`/`counts`, hands Chromium compositor Web Animations except scroll-`.show()` members, coalesces `ResizeObserver` bursts, skips rebuilds when handed dependencies stay unchanged, and triggers `carry` when measured rest boxes move), `@gerak/react` (`<Stage>`, `usePlayer`, `PlayerHost`) and `@gerak/three` (`threeBinder` with `frameVisible`, `resize`, `counts`, `Object3D[]`/`Group.children` lists, and local `Box3` `measure()`) play and write `Signal`.
  Opt-in modules (`@gerak/rig`, `@gerak/rig-three`, `@gerak/physics` with O(1) idle pre-spawn `simulate()` fast-forward and 3D `cylinder` shapes/colliders, `@gerak/rapier`) depend only on core (and paired core renderers);
  the library (`@gerak/moves`) adds plain moves, `squashed` couplings and `follow`, `react` and `noise1d` signals when installed.
  `@gerak/tools` runs `npx gerak <command>` cleanly with core alone (`gerak measure` caches DOM, `objects` bounds and 3D list `counts` from Chromium for headless tools, `gerak check`/`review` accept multi-viewport `--sizes`, headless `gerak review` probes sticky/scroll/trigger/watched drivers and accepts `--events` beside `cues` and expands 3D list parts, and `gerak fps --action` runs repeatable actions on a real clock); `npx gerak init` writes page files, `tsconfig.json`, skill and `AGENTS.md` naming read-whole `core.md` and `stage.md`, which explain how each package works and link its reference pages.
  Decisions are ADR-170 to ADR-200; each package ships its docs and generated `packages/<package>/docs/reference` pages, installed from tarballs (nothing is on npm).

## Next in line

- **Cookie gaps (`plan/cookie-gaps-plan.md`), PR 3 on `feat/cookie-gaps-3`: Decisions 10–11 implemented on branch (3D `cylinder` physics, scroll-window `.show()` with single-owner `frame().visible`, `object(..., { parts: true })` 3D lists, and multi-viewport `--sizes` CLI), adopted in `apps/pieces/cookie/` with zero `PARKED_Z` and 3D list casts; ready for PR review.**

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
