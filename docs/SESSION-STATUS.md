# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `test/repo/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-11-21, Asia/Jakarta.
- **Read against:** `feat/authored-cast`, from `main` after PR 616.

## Now

- **A piece is a `sceneBuilder` chain compiled with `compileScene`, split across thirteen packages in three enforced groups (`core`, `modules`, `library`), played by `mount` over the page nodes tagged `data-cast`, on a live or timed clock, in place or fitted to the scene's frame.**
  `@gerak/core` owns fields, time (`span`, `chain`, `lanes`, `loop`, `sequence`, `repeated`, `reversed`, `timeAt`, `motion` with `MotionWindow`, `shared`), shapes (`Timing`, `Curve<T = number>`, `Ease = Curve<number>`, `Signal<T = Pose2d>`), eases (`ease.*`, `backEase`, `springEase`, `spring`), envelopes (`arch`, `wave`, `attack`, `decay`, `taper`), blends, paths (`ballistic`, `along`, `along3d`), geometry, 3D maths, measures (`velocity`, `velocity3d`, `tally`), motion principles (`squashStretch`, `anticipation`, `followThrough`, `overlap`, `arc`, `exaggerate`, `secondary`, `smear`, `trail`) and state from events (`state`, `eventLog`, `scroll`, `pointer`, `INPUT_EVENTS`, `springTo`, `easeTo`, which `follow` and `tally` build on, and `watchClock` with `stillMoving`, which tell a renderer what moves with time alone);
  `@gerak/stage` owns `sceneBuilder` (single-scene element ownership), elements (`box`, `shape`, `text`, `many`, `group`, and `object`, a Three.js object posed in `Pose3d`), beats (clock `beat`, `scrollPoint`, `.top`/`.end` edges on every box element, scroll beats with `smooth`, triggered beats with `back`), `bind`, `bindEach`, `stagger` (by `index` or `line`), `stayWith`, `carry`, `travel` (onto measured slots, an object's through its view's lens), `compileScene`, `frame` (reporting each element's `moves` and `Drive`), `check` and layouts, with `@gerak/stage/render` outlines/viewport box placements (`withPlacement`, `boxInViewport`) and `@gerak/stage/dom` tokens; `@gerak/player` (`play`, `Player`), `@gerak/dom` (`mount`, which on a live clock hands scroll- and trigger-driven elements to Chromium as Web Animations sampled from `frame()`) `@gerak/react` (`usePlayer`, `PlayerHost`) and `@gerak/three` (`threeBinder`, which `mount` takes in `binders`) play and write `Signal`.
  Opt-in modules (`@gerak/rig`, `@gerak/rig-three`, `@gerak/physics`, `@gerak/rapier`) depend only on core (and paired core renderers);
  the library (`@gerak/moves`) adds plain moves, `squashed` couplings and `follow`, `react` and `noise1d` signals when installed.
  `@gerak/tools` runs `npx gerak <command>` cleanly with core alone; `npx gerak init` writes page files, `tsconfig.json`, skill and `AGENTS.md` naming read-whole `core.md` and `stage.md`, which explain how each package works and link its reference pages.
  Decisions are ADR-170 to ADR-197; each package ships its docs and generated `packages/<package>/docs/reference` pages, installed from tarballs (nothing is on npm).

## Next in line

- **Authored cast (`plan/authored-cast-plan.md`), refactor pull request on `feat/authored-cast`: ADR-198, `.include`, one-sided `.show`, element edges in place of `section`, `data-cast` binding in place of `el`, one mount in place of `mountStage`, `mountPage`, the skin, `stage.html` and `gerak import-svg`, `gerak measure` with a frame the markup sizes, binders (`threeBinder`, `nodes`), and `pivot`'s removal have landed on the branch; the rest of step 4 (part counts from the markup, `group`, `rest` and `layouts`) waits on the two decisions in the plan.**

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
