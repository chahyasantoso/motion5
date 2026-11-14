# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `test/repo/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-11-14, Asia/Jakarta.
- **Read against:** `feat/toolkit`, the toolkit plan built, before its pull request merges into `main` at `6079f613`.

## Now

- **The code path and its live editor are in place:** `@gerak/core` and `@gerak/plugins` are deleted (ADR-170), and
  the branch `archive/core-plugins` holds the retired JSON engine. A scene is `(time, events) => targets` built from
  `@gerak/moves` (time, spans, lanes, eases, springs, 2D and 3D poses, events and `defineMove` moves, each with a role and an example the gate samples) and
  `@gerak/rig` (2D and typed 3D chains, frames, and 3D FK/IK solvers and constraints), played by `@gerak/player` (`play`,
  `Player.replace`, `manualDriver`) on a manual, clock (`setRate`, `setRange`), scroll or event driver, and written by
  `@gerak/dom`, `@gerak/react` (`Stage`, `usePlayer`, `useTarget`, `useValue`, `useWatch`, `PlayerHostProvider`,
  `driverKeeper`) and `@gerak/three` (`applyPose2d`, `applyPose3d`, `morphTargets`, `@gerak/three/react`, `@gerak/three/skeleton`). `@gerak/physics` gives a seekable `PhysicsWorld` and `PhysicsWorld3d`, built in or on Rapier
  through `@gerak/rapier` (`rapierEngine`, `rapierEngine3d`). `@gerak/tools` holds the `motion:*` commands (`motion:live`, `motion:new`,
  `motion:review`, `motion:check`, `motion:read`, `motion:frames`, `motion:probe`, `motion:render`, `motion:sample`,
  `motion:timeline`, `motion:points`) and `@gerak/tools/vite` (`motionLivePlugin`, `scanNumericLiterals`,
  `resolveSceneFile`, `applySourceEdit`). `checkMove` in `@gerak/tools/scene` is the move gate (ADR-172). `VALUE_FIELDS` is the one table of a value's fields, with blur, a stroke's tail, a clip and a piece's own `custom` numbers, written by one `applyValue` (ADR-173). `sequence` orders phases and beats, `span(from, to)` is placed by the clock, `motion:moves -- --parts` lists the building blocks, and `motion:review` picks its own frames. A piece is one stage module (ADR-174, ADR-175): `@gerak/stage` gives the cast (`actor`, `many`, `group`, `letters`, `words`; a path member draws `Cubic2d` strokes, fixed or a function of where things rest, placed by the stage; `on` lists the beats a member shows in), the `story` of named beats, measured `Rest` boxes and `readStageModule`, the one reader; `mountStage` in `@gerak/dom` builds it with its `skins.dom.css` and plays it on a clock that records watched hovers, so a watched piece scrubs, `stage.html?piece=<name>` plays it, `motion:new` writes one, and `motion:review <file>.ts` checks the cast against the scene. The hand-made showreel rebuilt as the stage module `showreel-f` (189 k tokens) is the standing measure; `motion:frames --compare` compares two runs. A move may name its `recipe`; `motion:moves -- --candidates` lists local moves used by two or more files, and `motion:promote` moves one into `@gerak/moves`. `live.html?scene=<name>` in `apps/pieces` hot-swaps saved scene or stage-module edits in
  place (ADR-171) without losing time, playback rate or loop range, guards broken edits with an error banner while
  holding the last good frame, scrubs and loops on a timeline with cue and named-moment marks, and drags numeric literals in the
  code panel straight back into `src/<name>-scene.ts`. Twenty-one moves by role, four of them modifiers, are listed
  by `motion:moves`, which also reads an app's `src/moves`. The agent guide and the `make-motion` skill start a piece from its
  brief and the catalog and name no worked example; a test under `test/repo/` refuses one that does. Eight worked examples live in `apps/examples`, which tests read; the proof pieces, the showreels, the app's
  own moves and the live page live in `apps/pieces`, the tools' default root, a stage module may name `layouts` the stage measures, a `layout` from events and `cues` it plays, and `carried` in `@gerak/stage` carries a member between boxes (ADR-178), measured by the site piece `shop`; an SVG imports as a stage module of flat parts that `pivot` about their joints and ride `chainFromRest` chains, checked by `motion:compare` (ADR-180), and imports `--into` a bigger piece, placed, scaled and prefixed; an event may carry a `value`, a sample that `follow` springs to with `"value"`, that `MountedStage.send` logs live and a recording plays as `cues`, and a path member's `shapes` morph by the value field `shape`, imported from outlines named `<part>-shape<N>` (ADR-181), measured by `penguin-scene`; the scene review seeks back and forth against playing, and skips the final rest of an `ongoing` member; a 3D scene rigs a skinned glTF from the joint table `motion:joints` writes beside it (`jointOf`), turns its bones about the model's axes through `captureSkeleton` and `applyBones`, drives blend shapes through `morphTargets`, solves typed 3D chains that never twist a bone (`chainThrough3d`, `fk3d`, `ik3d`, `bonesOf3d`, `childBase3d`, `chainFromRest3d`) and steps 3D Rapier bodies read through `sim.pose` and `bodyPose3d` (ADR-182), with `character3d` in `apps/examples` and measured by `avatar-3d`, the dragonling; 2D labels pin over 3D on one clock: the scene owns the lens and pins DOM targets with `project3d` and `posedJoints3d`, 3D pages draw on the player's step, and `motion:review` takes `limits` per target with `custom` numbers as ratios (ADR-183), with `overlay3d` in `apps/examples`; a step reads the present (ADR-184): `motion:review` flags a step whose cost grows with time or passes `--budget`, `motion:fps` measures a running page per 500 ms window and names its renderer, `tally` answers how much of a sample stream has passed, contact events carry `point` and `other`, `attach` rides an object on a bone, `useTarget3d` binds one pose of a list, and `motion:frames --crop --zoom` and `motion:sample --watch` look closer, measured by `dragon-intro`, rebuilt from its brief, at 144 fps in every window after the first; the nine runtime packages build to `dist` and `npm run pack:check` installs and type-checks them outside the repository, with nothing on npm (ADR-179); and `docs/guide/agent-reference.md`'s entries are generated from the doc comments by `npm run reference` and held current by a test.

## Next in line

- **Anatomy (`plan/anatomy-plan.md`, proposed):** the layers as folders, new laws and fields (skew, shadow, colour), no recipes, and a catalog searched by measured descriptors; the motion atlas is deferred behind it.

## Open, and not scheduled

- Retargeting remains a proposed design only.
- 3D left: React Three Fiber (`--r3f` and `<Canvas>` integration with the scene clock and frame tools) is deferred as a future feature; `talk.html` is for stage modules only, so a live 3D avatar feeds `clock.send` itself.
- Live inputs left: `talk.html` is untried with a microphone; browser tests run in Chromium only.
- The instrument (roadmap, deferred) waits for the live kit and a person who asks to live-code.

## Where the rest of it lives

- Exact commits, runs, decisions and equivalence evidence: the owning pull request.
- Standing rules: [AGENTS.md](../AGENTS.md). Who owns what: [ARCHITECTURE.md](./ARCHITECTURE.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md).
- Earlier long-form history remains in Git, not in this status file.
