# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `test/repo/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-11-12, Asia/Jakarta.
- **Read against:** `feat/composition` after the full check gate.

## Now

- **The code path and its live editor are in place:** `@gerak/core` and `@gerak/plugins` are deleted (ADR-170), and
  the branch `archive/core-plugins` holds the retired JSON engine. A scene is `(time, events) => targets` built from
  `@gerak/moves` (time, spans, lanes, eases, springs, 2D and 3D poses, events and `defineMove` moves, each with a role and an example the gate samples) and
  `@gerak/rig` (2D chains, frames, and 3D FK/IK solvers and constraints), played by `@gerak/player` (`play`,
  `Player.replace`, `manualDriver`) on a manual, clock (`setRate`, `setRange`), scroll or event driver, and written by
  `@gerak/dom`, `@gerak/react` (`Stage`, `usePlayer`, `useTarget`, `useValue`, `useWatch`, `PlayerHostProvider`,
  `driverKeeper`) and `@gerak/three`. `@gerak/physics` gives a seekable `PhysicsWorld`, built in or on Rapier
  through `@gerak/rapier`. `@gerak/tools` holds the `motion:*` commands (`motion:live`, `motion:new`,
  `motion:review`, `motion:check`, `motion:read`, `motion:frames`, `motion:probe`, `motion:render`, `motion:sample`,
  `motion:timeline`, `motion:points`) and `@gerak/tools/vite` (`motionLivePlugin`, `scanNumericLiterals`,
  `resolveSceneFile`, `applySourceEdit`). `checkMove` in `@gerak/tools/scene` is the move gate (ADR-172). `VALUE_FIELDS` is the one table of a value's fields, with blur, a stroke's tail, a clip and a piece's own `custom` numbers, written by one `applyValue` (ADR-173). `sequence` orders phases and beats, `span(from, to)` is placed by the clock, `motion:moves -- --parts` lists the building blocks, and `motion:review` picks its own frames. A piece is one stage module (ADR-174, ADR-175): `@gerak/stage` gives the cast (`actor`, `many`, `group`, `letters`, `words`; a path member draws `Cubic2d` strokes; `on` lists the beats a member shows in), the `story` of named beats, measured `Rest` boxes and `readStageModule`, the one reader; `mountStage` in `@gerak/dom` builds it with its `skins.dom.css` and plays it on a clock that records watched hovers, so a watched piece scrubs, `stage.html?piece=<name>` plays it, `motion:new` writes one, and `motion:review <file>.ts` checks the cast against the scene. The hand-made showreel rebuilt as the stage module `showreel-d` is the standing measure. `live.html?scene=<name>` in `apps/pieces` hot-swaps saved scene or stage-module edits in
  place (ADR-171) without losing time, playback rate or loop range, guards broken edits with an error banner while
  holding the last good frame, scrubs and loops on a timeline with cue and named-moment marks, and drags numeric literals in the
  code panel straight back into `src/<name>-scene.ts`. Twenty moves by role, four of them modifiers, are listed
  by `motion:moves`, which also reads an app's `src/moves`. The agent guide and the `make-motion` skill start a piece from its
  brief and the catalog and name no worked example; a test under `test/repo/` refuses one that does. Seven worked examples live in `apps/examples`, which tests read; the proof pieces, the showreels, the app's
  own moves and the live page live in `apps/pieces`, the tools' default root, and `docs/guide/agent-reference.md`'s entries are generated from the doc comments by `npm run reference` and held current by a test.

## Next in line

- **Composition, part two:** transitions and layout moves (roadmap stage 4), with the measure's gaps: a path laid
  out from measured rest boxes, skins that keep their own transform origin, and a gentler default text; then publish.

## Open, and not scheduled

- Retargeting remains a proposed design only.
- 3D rigs, a skinned mesh's bones (rebuilt on the code path, reading the archive), 3D physics (Rapier is 2D today) and
  an R3F scaffold for code scenes: wanted, not started.

## Where the rest of it lives

- Exact commits, runs, decisions and equivalence evidence: the owning pull request.
- Standing rules: [AGENTS.md](../AGENTS.md). Who owns what: [ARCHITECTURE.md](./ARCHITECTURE.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md).
- Earlier long-form history remains in Git, not in this status file.
