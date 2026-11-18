# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `test/repo/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-11-18, Asia/Jakarta.
- **Read against:** `feat/stage-v3`, stage v3 built on `refactor/points-and-reference` after PR 599.

## Now

- **A scene is compiled from `defineStage`, split across thirteen packages in three enforced groups (`core`, `modules`, `library`).**
  `@gerak/core` owns fields, time (`span`, `chain`, `lanes`, `loop`, `sequence`, `repeated`, `reversed`, `timeAt`), eases, envelopes, blends, paths, geometry, 3D maths and measures;
  `@gerak/stage` owns `defineStage`, cast builders, list poses by index, `compileStage`, `frame`, `check`, layouts and `carry`, with `@gerak/stage/render` outlines and `@gerak/stage/dom` tokens; `@gerak/player`, `@gerak/dom` and `@gerak/react` play and write it.
  Opt-in modules (`@gerak/rig`, `@gerak/rig-three`, `@gerak/physics`, `@gerak/rapier`) depend only on core (and paired core renderers);
  the library (`@gerak/moves` and `@gerak/moves-tools`) adds named moves, couplings, signal parts, styles, `gerak moves`, `new-move`, `promote`, `style` and design review when installed.
  `@gerak/tools` runs `npx gerak <command>` (core commands, `stage.html`, `live.html`, `talk.html`) cleanly with core alone, discovering library plugins via manifest `gerak.commands`/`gerak.review`; `npx gerak init` writes page files, skill and `AGENTS.md` naming read-whole `core.md` and `stage.md` (under 20 KB each) and every installed package's docs.
  Decisions are ADR-170 to ADR-190; each package ships its docs and generated `packages/<package>/docs/reference` pages, installed from tarballs (nothing is on npm).

## Next in line

- **Search and harvest** (`plan/search-plan.md`): `gerak find` over the library and brief records in `@gerak/moves-tools`, followed by the live kit and dev-only web overlay (`plan/roadmap.md`).

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
