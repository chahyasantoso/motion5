# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `test/repo/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-11-23, Asia/Jakarta.
- **Read against:** `feat/cookie-gaps`, branched from `feat/authored-cast` after PR 618.

## Now

- **A piece is a `sceneBuilder` chain compiled with `compileScene`, split across thirteen packages in three enforced groups (`core`, `modules`, `library`), played by `mount` over the page nodes tagged `data-cast`, on a live or timed clock, in place or fitted to the page root.**
  `@gerak/core` owns fields, time (`span`, `chain`, `lanes`, `loop`, `sequence`, `repeated`, `reversed`, `timeAt`, `motion` with `MotionWindow`, `shared`), shapes (`Timing`, `Curve<T = number>`, `Ease = Curve<number>`, `Signal<T = Pose2d>`), eases (`ease.*`, `backEase`, `springEase`, `spring`), envelopes (`arch`, `wave`, `attack`, `decay`, `taper`), blends, paths (`ballistic`, `along`, `along3d`), geometry, 3D maths, measures (`velocity`, `velocity3d`, `tally`), motion principles (`squashStretch`, `anticipation`, `followThrough`, `overlap`, `arc`, `exaggerate`, `secondary`, `smear`, `trail`) and state from events (`state`, `eventLog`, `scroll`, `pointer`, `INPUT_EVENTS`, `springTo`, `easeTo`, which `follow` and `tally` build on, and `watchClock` with `stillMoving`, which tell a renderer what moves with time alone);
  `@gerak/stage` owns `sceneBuilder` (single-owner elements, `.include(scene)` to merge scenes on one clock), elements (`box` with optional `{ parts: true }`, `shape`, `text` with optional `{ split }`, and `object`, a Three.js object posed in `Pose3d`), beats (clock `beat`, `scrollPoint`, `.top`/`.end` edges on every box element, scroll beats with `smooth`, triggered beats with `back`), one-sided `.show({ from, until })`, `bind`, `bindEach`, `stagger` (by `index` or `line`), `stayWith`, `carry` (across re-measure), `travel` (onto measured slots, sitting there with no window on every clock, an object's through its view's lens), `compileScene`, `frame` (reporting each element's `moves` and `Drive`) and `check`, with `@gerak/stage/render` outlines/viewport box placements (`withPlacement`, `boxInViewport`) and `@gerak/stage/dom` tokens; `@gerak/player` (`play`, `Player`), `@gerak/dom` (`mount`, which on a live clock hands scroll- and trigger-driven elements to Chromium as Web Animations sampled across active intervals, coalesces `ResizeObserver` bursts and skips rebuilds when handed dependencies stay unchanged, and triggers `carry` when measured rest boxes move), `@gerak/react` (`<Stage>`, `usePlayer`, `PlayerHost`) and `@gerak/three` (`threeBinder`, which `mount` takes in `binders`) play and write `Signal`.
  Opt-in modules (`@gerak/rig`, `@gerak/rig-three`, `@gerak/physics` with O(1) idle pre-spawn `simulate()` fast-forward, `@gerak/rapier`) depend only on core (and paired core renderers);
  the library (`@gerak/moves`) adds plain moves, `squashed` couplings and `follow`, `react` and `noise1d` signals when installed.
  `@gerak/tools` runs `npx gerak <command>` cleanly with core alone (`gerak measure` caches DOM/3D rest boxes from Chromium for headless tools, `gerak review` probes scroll/trigger/input drivers on unmoved settle members, and `gerak fps --action` runs repeatable actions on a real clock); `npx gerak init` writes page files, `tsconfig.json`, skill and `AGENTS.md` naming read-whole `core.md` and `stage.md`, which explain how each package works and link its reference pages.
  Decisions are ADR-170 to ADR-199; each package ships its docs and generated `packages/<package>/docs/reference` pages, installed from tarballs (nothing is on npm).

## Next in line

- **Cookie gaps (`plan/cookie-gaps-plan.md`), PR 1 on `feat/cookie-gaps`: Decisions 1–4 implemented (dependency-gated beat-scoped compositor handoff with coalesced `ResizeObserver`, unwindowed `travel` at slot `1` across all clocks, O(1) idle pre-spawn `simulate()` fast-forward, driver-probing `gerak review <scene.ts>`, and repeatable `--action` on `gerak fps`), ADR-199 written, and cold review addressed; PR 2–3 follow.**

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
