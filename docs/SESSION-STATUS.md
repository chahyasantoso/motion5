# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `test/repo/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-11-19, Asia/Jakarta.
- **Read against:** `feat/principles`, principles, plain moves and state (`plan/principles-plan.md`) built on `refactor/points-and-reference` after PR 602.

## Now

- **A scene is compiled from `defineStage`, split across thirteen packages in three enforced groups (`core`, `modules`, `library`), with core's three shapes named (`Timing`, `Curve<T>`, `Signal<T>`) and one curve convention.**
  `@gerak/core` owns fields, time (`span`, `chain`, `lanes`, `loop`, `sequence`, `repeated`, `reversed`, `timeAt`), shapes (`Timing`, `Curve<T = number>`, `Ease = Curve<number>`, `Signal<T = Pose2d>`), eases (`ease.*`, `backEase`, `springEase`, `spring`), envelopes (`arch`, `wave`, `attack`, `decay`, `taper`), blends, paths (`ballistic`, `along`, `along3d` and every curve with settings built from its settings before taking progress), geometry, 3D maths, measures (`velocity`, `velocity3d`, `tally`), the motion principles (`squashStretch`, `anticipation`, `followThrough`, `overlap`, `arc`, `exaggerate`, `secondary`, each built from options then given a signal, with `smear` and `trail`) and state from events (`state`, `springTo`, `easeTo`, which `follow` and `tally` are built on);
  `@gerak/stage` owns `defineStage`, cast builders, list poses by index, `compileStage`, `frame`, `check`, layouts and `carry`, with `@gerak/stage/render` outlines and `@gerak/stage/dom` tokens; `@gerak/player` (`play`, `Player`), `@gerak/dom` and `@gerak/react` (`usePlayer`, `PlayerHost`) play and write `Signal`.
  Opt-in modules (`@gerak/rig`, `@gerak/rig-three`, `@gerak/physics`, `@gerak/rapier`) depend only on core (and paired core renderers);
  the library (`@gerak/moves`) adds plain moves (each a function from options to a function of time), `squashed` couplings and `follow`, `react` and `noise1d` signals when installed.
  `@gerak/tools` runs `npx gerak <command>` (core commands, `stage.html`, `live.html`, `talk.html`, with `NAMED_CURVES` built from core's `ease` and `Curve`) cleanly with core alone; `npx gerak init` writes page files, `tsconfig.json`, skill and `AGENTS.md` naming read-whole `core.md` (under 8 KB) and `stage.md` (under 10,500 bytes) and every installed package's docs.
  Decisions are ADR-170 to ADR-192; each package ships its docs and generated `packages/<package>/docs/reference` pages, installed from tarballs (nothing is on npm).

## Next in line

- **The scene builder**, in order: `plan/scene-builder-plan.md` (`sceneBuilder` replaces `defineStage`), `plan/page-plan.md` and `plan/stage-3d-plan.md` (3D in a scene); then the live kit and web overlay (`plan/roadmap.md`).

## Open, and not scheduled

- Retargeting remains a proposed design only.
- React Three Fiber integration is deferred; `talk.html` is untried with a microphone.
- Browser tests run in Chromium only.
- The instrument waits for a person who asks to live-code.

## Where the rest of it lives

- Exact commits, runs, decisions and evidence: the owning pull request.
- Standing rules: [AGENTS.md](../AGENTS.md). Who owns what: [ARCHITECTURE.md](./ARCHITECTURE.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md).
- Earlier history remains in Git.
