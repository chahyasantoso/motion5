# 3D plan: rigged characters and bodies in depth

**Status:** Proposed, 2026-11-14, after one round of critique. Not approved: check it against the tree, then ask the
owner.
**Base:** `main` at `bb8a828b`, the merge of pull request 592.
**Read first:** `AGENTS.md`, `docs/SESSION-STATUS.md`, `plan/roadmap.md` (stage 8), `docs/ADR-169`, `docs/ADR-180`,
`docs/ADR-181`, `docs/guide/agent-3d.md`, `.claude/skills/wave-build/SKILL.md`, then this plan.

## 1. Goal

**A person building a 3D web page brings in a rigged character, such as a glTF avatar, and makes it wave, nod and
talk from code or from live numbers, the way the 2D penguin does; and objects in the scene fall, bounce and settle
in depth, scrubbing exactly.**

Today a 3D scene poses whole objects (`Pose3d`, `applyPose3d`, `useTarget3d`, ADR-169), and rig solves 3D chains
(`solveChain3d`, joint limits, poles), but nothing writes a pose onto a skinned mesh's bones: a glTF character can
only move as one rigid object. 3D chains are untyped against the 2D ones (`chainThrough`, `chainFromRest`), physics
is 2D only (`@dimforge/rapier2d-deterministic-compat`), and the scaffold writes a plain Three.js page, not React Three
Fiber. The retired engine had a skeleton driver (`packages/three/src/skeleton-*.ts` on `archive/core-plugins`,
ADR-141); it is read for its lessons, not restored.

## 2. Decisions to record (D0, ADR-182)

- **A skinned character's bones take turns local to their parents.** `@gerak/three/skeleton` captures a skeleton's
  rest once (bone names, parent order, rest quaternions, positions and world joint points), and
  `applyBones(skeleton, poses)` writes each named bone's `Pose3d` as a turn and offset from its own rest, in its
  parent's space, parents before children. A pose of `{}` is the rest; bind matrices are never touched; an unknown
  bone name throws, naming it. World-space poses never go to bones: writing them onto nested bones applies every
  ancestor twice.
- **A 3D chain is built through joints, as in 2D, and answers two ways.** `chainThrough3d(joints)` builds a chain
  typed by joint id, from points given by hand or read from a captured skeleton (`skeleton.joints`). Its turns are
  local, as `solveChain3d`'s `rotations3d` already are, so `bonesOf3d(chain, now)` hands them to `applyBones`
  directly; `chainFromRest3d(chain, rest, now)` answers the world `Pose3d` that carries a separate rigid part, as
  `chainFromRest` does in 2D, for `useTarget3d`. Rig gains a public 3D forward kinematics for the second; no second
  solver.
- **Morph targets are custom numbers.** A mesh's named morph targets (a glTF avatar's `jawOpen`, `eyeBlinkLeft`) are
  written from `custom` numbers by a `morphTargets` writer in `@gerak/three`, so `follow` on `mouthOpen` drives a 3D
  mouth exactly as it drives the 2D beak. Authoring blend shapes stays out.
- **3D physics is a second world, same contract.** `@gerak/physics` gains 3D body and world types beside the 2D ones,
  a body's turn as a plain quaternion `{ w, x, y, z }` (physics depends on `@gerak/moves` alone and does no
  orientation math), and `@gerak/rapier` a `rapierEngine3d` on `@dimforge/rapier3d-deterministic-compat@0.21.0`,
  the 2D build's version. `simulate` stays the one owner of seeking, snapshots and events, over either world. Rig's
  `bodyPose3d(state)` turns a body's state into a `Pose3d`, since rig owns 3D orientation (ADR-169).
- **The scaffold writes React Three Fiber.** `motion:new <name> --r3f` writes a page, a component with a `Canvas`, a
  camera, a light and one mesh per target bound by `useTarget3d`, and a scene, as `--three` does today for plain
  Three.js (`page.three.html.template` and its siblings). It sets no look. `@react-three/fiber` joins
  `apps/pieces` and `apps/examples` only, never a package; a glTF loads through three's own `GLTFLoader`, with no
  `drei`.
- **A 3D piece stays a code scene with its page** (ADR-169), not a stage module: the stage owns DOM layout and boxes,
  which a canvas does not have. A stage module with a Three.js skin waits for a brief that needs both.
- **Models live in `apps/pieces/references/`** with their source and licence, as SVGs do; only CC0 or similarly free
  models go there, under 2 MB unless the owner agrees to more.
- **A live 3D avatar needs its own few lines.** `talk.html` mounts stage modules only; a 3D page drives its clock with
  `clockDriver` and calls its `send`, which this plan's guide shows and no page of its own provides.

## 3. Slices

### T1. Typed 3D chains

- **Invariant:** `chainThrough3d` builds a chain through 3D joints, typed by id; `bonesOf3d(chain, now)` answers each
  bone's local turn from its rest, `{}` at rest; `chainFromRest3d` answers each bone's world `Pose3d` from where it
  was modelled, `{}` at rest; a public `fk3d` answers each joint's world frame, and agrees with the frames
  `solveChain3d` reaches for the same turns.
- **Owner:** `packages/rig/src/chain3d.ts` (new) and the 3D FK it exports; `bodyPose3d` in the same package.
- **Test:** a three-joint arm bent 90 degrees at its elbow puts its tip at the expected point by `fk3d`; rest gives
  `{}` both ways; a wrong id does not compile (a type test); `bodyPose3d` of a quarter turn about y is
  `{ rotationY: 90 }` to 1e-9.

### T2. Skinned bones

- **Invariant:** as decided; `captureSkeleton(root)` and `applyBones(skeleton, poses)`; writing a pose and then `{}`
  returns every bone to its captured rest exactly; a turn on a parent carries its children as `fk3d` says; a rest
  with a non-unit scale on any bone is reported by `captureSkeleton`, not fixed.
- **Owner:** `packages/three/src/skeleton.ts` (new), entry `@gerak/three/skeleton` in the package's `exports`, which
  `npm run pack:check` then installs.
- **Test:** a skeleton built in code (no file): `bonesOf3d` of a bent arm through `applyBones` puts the hand bone's
  world position where `fk3d` puts the tip; rest restores; unknown names throw; parents are written before children
  whatever order the poses come in.

### T3. Morph targets

- **Invariant:** `morphTargets(mesh)` returns a custom writer that sets `morphTargetInfluences` by name, clamped to
  [0, 1]; a name the mesh lacks is reported once, not thrown, so one scene drives meshes with different targets.
- **Owner:** `packages/three/src/morph.ts` (new).
- **Test:** a mesh built in code with two morph targets; `follow` on a sample drives one; an unknown name is reported.

### T4. 3D physics

- **Invariant:** `rapierEngine3d` on the deterministic 3D build gives a `PhysicsWorld3d`; `simulate` over it seeks
  backwards and forwards to the same state at the same time and events, as in 2D.
- **Owner:** `packages/physics/src/world.ts` (types) and `simulate.ts`, `packages/rapier/src/world3d.ts` (new).
- **Test:** boxes dropped on a plane settle; a seek to 2 s from 0, from 5 s and from 1 s gives the same positions to
  1e-9; an event that pushes a box replays on a seek back.

### T5. The R3F scaffold and a worked example

- **Invariant:** `motion:new <name> --r3f` writes a page, a component and a scene that typecheck and render; an
  example in `apps/examples` binds a skinned character built in code through `applyBones`, and its tests read it.
- **Owner:** `packages/tools/src/scene/new.ts` and its templates; `apps/examples`.
- **Test:** the scaffold's files typecheck and the page mounts in Chromium with no page error; the example's scene
  is sampled by its test.

### T6. Guide

- `docs/guide/agent-3d.md` gains "A rigged character": find a CC0 glTF, capture its skeleton, name the bones you
  drive, build chains through their joints, drive the jaw or morph targets from samples; and "Bodies in depth".
  Generated reference entries by `npm run reference -- --write`.

### T7. Proof

- **Model:** a CC0 rigged glTF character with a jaw bone or mouth morph targets, chosen with the owner (downloading
  it needs the owner's yes), in `apps/pieces/references/` with its source and licence.
- **Measure, alone, fresh:** a planner-model worker makes `avatar-3d`: the character on a small stage greets the
  viewer, waves through a chain, nods, and talks from `apps/pieces/references/talk.json` through `follow`; a few
  props fall onto the stage at the start and settle through 3D physics. It passes when the scene reads samples only
  through `follow`, the scene review is clean (it seeks as well as plays), the frame sheet shows the character in
  frame throughout, and scrubbing gives the frame playing reached.
- **Cold review:** a fresh executor-model agent reviews the diff and runs what it claims.

## 4. Team and order

Roles, not model names: the **planner** conducts (plans, briefs, combines, judges), **executors** build slices from
short briefs, each in its own isolated workspace. The handoff maps them to the harness in use.

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
