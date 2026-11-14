# 3D plan: rigged characters and bodies in depth

**Status:** Approved, 2026-11-14.
**Base:** `main` at `bb8a828b`, the merge of pull request 592.
**Read first:** `AGENTS.md`, `docs/SESSION-STATUS.md`, `plan/roadmap.md` (stage 8), `docs/ADR-169-a-3d-pose-for-code-scenes.md`, `docs/ADR-180-rigging-vector-artwork.md`, `docs/ADR-181-live-inputs.md`, `docs/guide/agent-3d.md`, `.claude/skills/wave-build/SKILL.md`, then this plan.

## 1. Goal

**A person building a 3D web page brings in a rigged character, such as a glTF avatar, and makes it wave, nod and
talk from code or from live numbers, the way the 2D penguin does; and objects in the scene fall, bounce and settle
in depth, scrubbing exactly.**

Today a 3D scene poses whole objects (`Pose3d`, `applyPose3d`, `useTarget3d`, ADR-169), and rig solves 3D chains
(`solveChain3d`, joint limits, poles), but nothing writes a pose onto a skinned mesh's bones: a glTF character can
only move as one rigid object. 3D chains are untyped against the 2D ones (`chainThrough`, `chainFromRest`), and
physics is 2D only (`@dimforge/rapier2d-deterministic-compat`). The retired engine had a skeleton driver
(`packages/three/src/skeleton-*.ts` on `origin/archive/core-plugins`, ADR-141); it is read for its lessons, not
restored.

## 2. Decisions to record (D0, ADR-182)

- **A skinned character's bones turn about the model's axes.** `@gerak/three/skeleton` captures a skeleton's rest
  once, and `applyBones(skeleton, poses)` writes each named bone's `Pose3d` as a turn and offset from its own rest
  about the axes the model had when captured, carried by its parents, parents before children. A pose of `{}` is
  the rest; bind matrices are never touched; an unknown bone name throws, naming it.
- **A 3D chain is built through joints, as in 2D.** `chainThrough3d(joints)` answers `{ chain, rest }`, typed by
  joint id, from points given by hand, from `skeleton.joint(name)`, or from `jointOf(table, name)` over the joint
  table `motion:joints <model.glb>` writes beside a model, which is how a scene module rigs a model it never loads.
  `ik3d` solves it; `bonesOf3d(chain, now)` answers turns only, for `applyBones`; `childBase3d(parent, now, id)`
  hangs a chain from a posed parent chain; `chainFromRest3d(chain, rest, now)` answers the world pose that carries
  a separate rigid part, for `useTarget3d`. Rig stays dependency-free.
- **Morph targets are custom numbers.** A mesh's named morph targets (a glTF avatar's `jawOpen`, `eyeBlinkLeft`,
  `Surprised`) are written from `custom` numbers by a `morphTargets` writer in `@gerak/three`, so `follow` on
  `mouthOpen` drives a 3D mouth or face expression exactly as it drives the 2D beak. Authoring blend shapes stays out.
- **3D physics is a second world, same contract.** `@gerak/physics` gains 3D body and world types beside the 2D ones,
  a body's turn as a plain quaternion `{ w, x, y, z }` (physics depends on `@gerak/moves` alone and does no
  orientation math), and `@gerak/rapier` a `rapierEngine3d` on `@dimforge/rapier3d-deterministic-compat@0.21.0`,
  the 2D build's version. `simulate` is overloaded over `PhysicsWorld` and `PhysicsWorld3d` and stays the one owner
  of seeking, snapshots and events, over either world. A 3D simulation's `pose(id, time)` answers movement from the spawn point
  and the turn, as in 2D; rig's `bodyPose3d` turns it into a `Pose3d`-compatible object, since rig owns 3D orientation.
- **One 3D scaffold for now; React Three Fiber is a future feature.** `motion:new <name> --three` remains the single
  3D scaffold so there are not two owners for mounting a 3D scene; a glTF loads through three's own `GLTFLoader`.
  React Three Fiber (`--r3f` and `<Canvas>` integration that scrubs deterministically with the scene clock and frame
  tools) is recorded as a future feature that needs to be working.
- **A 3D piece stays a code scene with its page** (ADR-169), not a stage module: the stage owns DOM layout and boxes,
  which a canvas does not have. A stage module with a Three.js skin waits for a brief that needs both.
- **Models live in `apps/pieces/references/`** with their source and licence, as SVGs do; only models whose licence
  allows changing and keeping them (CC0, or CC BY with its credit line beside the file), under 2 MB unless the owner
  agrees to more. The page entry, not the scene, owns `window.__motionReady` and rejects it when a model fails to load.
- **A live 3D avatar needs its own few lines.** `talk.html` mounts stage modules only; a 3D page drives its clock with
  `clockDriver` and calls its `send`, which this plan's guide shows and no page of its own provides.

## 3. Slices

### T1. Typed 3D chains

- **Invariant:** `chainThrough3d` builds a chain through 3D joints, typed by id; `ik3d` solves it through
  `solveChain3d`; `bonesOf3d(chain, now)` answers each bone's local turn from its rest, `{}` at rest;
  `chainFromRest3d(chain, rest, now)` answers each bone's world pose from where it was modelled, `{}` at rest; a
  public `fk3d` answers each joint's world frame, and agrees with the frames `solveChain3d` reaches for the same
  turns; `bodyPose3d(state)` converts a 3D rigid body's position and quaternion into a `Pose3d`-compatible object
  without importing `@gerak/moves`.
- **Owner:** `packages/rig/src/chain3d.ts` (new), re-exported from `packages/rig/src/index.ts`.
- **Test:** a three-joint arm bent 90 degrees at its elbow puts its tip at the expected point by `fk3d`; rest gives
  `{}` both ways; a wrong id does not compile (a type test); `bodyPose3d` of a quarter turn about y is
  `{ rotationY: 90 }` to 1e-9.

### T2. Skinned bones

- **Invariant:** as decided; `captureSkeleton(root)` and `applyBones(skeleton, poses)`; writing a pose and then `{}`
  returns every bone to its captured rest exactly; a turn on a parent carries its children as `fk3d` says; a rest
  with a non-unit scale on any bone is reported by `captureSkeleton`, not fixed.
- **Owner:** `packages/three/src/skeleton.ts` (new), entry `@gerak/three/skeleton` in `packages/three/package.json`
  (`"@gerak/rig": "0.1.0"` added to `dependencies`), which `npm run pack:check` then installs.
- **Test:** a skeleton built in code (no file): `bonesOf3d` of a bent arm through `applyBones` puts the hand bone's
  world position where `fk3d` puts the tip; rest restores; unknown names throw; parents are written before children
  whatever order the poses come in.

### T3. Morph targets

- **Invariant:** `morphTargets(mesh)` returns a custom writer that sets `morphTargetInfluences` by name, clamped to
  [0, 1]; a name the mesh lacks is reported once, not thrown, so one scene drives meshes with different targets.
- **Owner:** `packages/three/src/morph.ts` (new), re-exported from `packages/three/src/index.ts`.
- **Test:** a mesh built in code with two morph targets; `follow` on a sample drives one; an unknown name is reported.

### T4. 3D physics

- **Invariant:** `rapierEngine3d` on `@dimforge/rapier3d-deterministic-compat@0.21.0` gives a `PhysicsWorld3d`;
  `simulate` overloaded for `PhysicsWorld3d` seeks backwards and forwards to the same state at the same time and
  events, as in 2D.
- **Owner:** `packages/physics/src/world.ts`, `packages/physics/src/simulate.ts` and `packages/physics/src/index.ts`;
  `packages/rapier/src/world3d.ts` (new), `packages/rapier/src/index.ts` and `packages/rapier/package.json`.
- **Test:** boxes dropped on a floor settle; a seek to 2 s from 0, from 5 s and from 1 s gives the same positions to
  1e-9; an event that spawns or pushes a box replays on a seek back.

### T5. A worked 3D character example

- **Invariant:** an example in `apps/examples` binds a skinned character built in code through `captureSkeleton` and
  `applyBones`, and its tests read and render it in Chromium with no page error.
- **Owner:** `apps/examples` (`character3d.html`, `src/character3d.tsx`, `src/character3d-scene.ts`, and tests);
  example lists in `packages/tools/test/motion-new.test.ts` and `test/repo/agent-guide.test.ts`.
- **Test:** the example's scene is sampled by its test and its page mounts in Chromium with no page error.

### T6. Guide

- `docs/guide/agent-3d.md` gains "A rigged character": find a CC0 glTF, capture its skeleton, name the bones you
  drive, build chains through their joints, drive the jaw or morph targets from samples; and "Bodies in depth".
  Generated reference and repo map entries by `npm run reference -- --write` and `npm run map -- --write`.

### T7. Proof

- **Model:** `dragonling.glb`, Polyfork's "Red fire dragonling" (CC BY 4.0, 1.7 MB, skinned, 31 bones with a `Jaw`),
  chosen by the owner, in `apps/pieces/references/` with its source, licence and credit line.
- **Measure, alone, fresh:** a planner-model worker makes `avatar-3d`: the character on a small stage greets the
  viewer, waves a front paw through a chain built from the model's joint table, nods, and talks, its jaw opening
  from `apps/pieces/references/talk.json` through `follow`; a few
  props fall onto the stage at the start and settle through 3D physics. It passes when the scene reads samples only
  through `follow`, the scene review is clean (it seeks as well as plays), the frame sheet shows the character in
  frame throughout, props never settle inside the character, and scrubbing gives the frame playing reached.
- **Cold review:** a fresh executor-model agent reviews the diff and runs what it claims.

## 4. Team and order

Roles, not model names: the **planner** conducts (plans, briefs, combines, judges), **executors** build slices from
short briefs, each in its own isolated workspace. The handoff maps them to the harness in use. When combining a wave
that adds package exports or subpaths, the planner updates `tsconfig.json`, `scripts/reference.mjs`,
`docs/guide/agent-reference.md` (`npm run reference -- --write`) and `docs/MAP.md` (`npm run map -- --write`) so the
executors' workspaces never touch shared repo files.

| Wave | Who | Slices | Why |
| --- | --- | --- | --- |
| 1 | Planner | D0, T1 | the decisions, and the chain type T2 and T5 read |
| 2 | Executor | T2 and T3 | one worker owns `packages/three` |
| 2 | Executor | T4 | physics and rapier only; `bodyPose3d` is the planner's, in T1 |
| 3 | Executor | T5 | after T2, so the example uses `applyBones` |
| 4 | Planner | T6 | what the measure reads |
| 4 | Planner model, fresh | T7 measure | |
| 4 | Executor | cold review | |

One pull request, after wave 4.

## 5. Risks

- **Bone conventions differ by exporter** (axes, roll, scale on the armature): the measure's model is the test; a
  model whose rest is not unit-scaled is reported by `captureSkeleton`, not silently fixed.
- **A canvas in the headless browser:** the frame sheet needs WebGL in headless Chromium, which `principles3d` in
  `apps/examples` already shows working; a page that renders black there is a finding, not a pass.
- **The 3D deterministic Rapier build** may differ in API from the 2D one; T4 reads both packages' types first.
- **Bundle weight:** Rapier 3D's wasm is large; it stays in `@gerak/rapier`, never pulled in by `@gerak/three`.
- **A new harness:** the wave-build skill was written for Claude Code; the handoff names what maps and what does not.

## 6. Done when

The measure passes, its tokens are recorded, `npm run check` is green, and `docs/SESSION-STATUS.md` says so.
