# ADR-182: Rigged 3D characters and bodies in depth

**Status:** Accepted, 2026-11-14

## Context

A 3D scene could pose whole objects (`Pose3d`, `applyPose3d`, `useTarget3d`, ADR-169) and solve 3D chains
(`solveChain3d`), but nothing wrote a pose onto a skinned mesh's bones: a glTF character could only move as one rigid
object. 3D chains were untyped against the 2D ones (`chainThrough`, `chainFromRest`, ADR-180), morph targets had no
writer from custom numbers, and physics was 2D only (`@dimforge/rapier2d-deterministic-compat`).

## Decision

- **A skinned character's bones turn about the model's axes.** `@gerak/three/skeleton` captures a skeleton's rest
  once (`captureSkeleton(root)`: bone names, parent-before-child order, local rest positions and quaternions, world
  joint points, and parent world rest frames, allowing uniform positive scale on ancestor nodes), and
  `applyBones(skeleton, poses)` writes each named bone's `Pose3d` as a turn and offset from its own rest about the
  axes the model had when captured, carried by its parents: a bone's world turn is its parents' turns, then its own,
  then its rest (`parentTurns * delta * restWorld`). Bones' own axes, which exporters roll differently, are never
  used, so `{ rotationX: -14 }` on a head nods it the same way on any model. A pose of `{}` restores rest; bind
  matrices are never touched; a scaled bone or non-uniform ancestor scale at rest is refused by `captureSkeleton`;
  an unknown bone name throws, naming it.
- **A 3D chain is built through joints, as in 2D.** `chainThrough3d(joints)` answers `{ chain, rest }`, typed by
  joint id, from points given by hand, read from `skeleton.joint(name)`, or read with `jointOf(table, name)` from
  the joint table `motion:joints` writes beside a model, so a scene module, which runs before any page loads the
  model, rigs it from the model's own joints. `ik3d` solves the chain through `solveChain3d`. `bonesOf3d(chain, now)`
  answers each bone's turn in the convention `applyBones` reads, turns only: a chain's base is its first bone's
  parent, which owns any movement of it. A chain hung from a posed parent chain takes its base from
  `childBase3d(parent, parentNow, id)`. `chainFromRest3d(chain, rest, now)` answers the world pose that carries a
  separate rigid part, for `useTarget3d`, as `chainFromRest` does in 2D. Rig stays dependency-free, answering plain
  `Pose3d`-compatible objects.
- **Morph targets are custom numbers.** `morphTargets(mesh)` in `@gerak/three` returns a custom writer that sets
  `morphTargetInfluences` by name, clamped to `[0, 1]`, reporting an unknown morph target name once rather than
  throwing so one scene can drive meshes with different blend shapes.
- **3D physics is a second world, same contract.** `@gerak/physics` adds `PhysicsWorld3d`, `BodySpec3d`,
  `BodyState3d`, `Shape3d`, `Collider3d`, `Quaternion3d`, `Simulation3d` and `SimulateOptions3d` beside the 2D types, with
  a body's orientation as a plain quaternion `{ w, x, y, z }`. `@gerak/rapier` adds `rapierEngine3d` on
  `@dimforge/rapier3d-deterministic-compat@0.21.0`. `simulate` is overloaded over `PhysicsWorld` and `PhysicsWorld3d`
  as the single owner of seeking, snapshots and contact events. A 3D simulation's `pose(id, time)` answers a body's
  movement from where it was spawned and its turn, as 2D `pose` does, so its mesh is placed at the spawn point;
  `@gerak/rig`'s `bodyPose3d` turns that into a `Pose3d`-compatible object. `@gerak/rapier` keeps one snapshot format
  for both worlds.
- **One 3D scaffold for now.** `motion:new <name> --three` remains the single 3D scaffold; a glTF loads through
  Three.js's `GLTFLoader`. React Three Fiber (`--r3f` and `<Canvas>` integration with the scene clock and frame tools)
  is deferred as a future feature.
- **A 3D piece stays a code scene with its page** (ADR-169); the page entry, not the scene, owns
  `window.__motionReady` and rejects it when a model fails to load. Models live in `apps/pieces/references/` with
  their source and licence, under 2 MB, under a licence that allows changing and keeping them (CC0, or CC BY with
  its credit line kept beside the file).

## Consequences

- `fk3d`, `bonesOf3d`, `childBase3d` and `applyBones` share one equation (`parentTurns * delta * restWorld`), so a
  chain built from a model's joints reaches the world joint positions in Three.js that `fk3d` computes, even when
  the exporter rolled its bones away from the model's axes.
- A model is rigged from code only through its joint table; a scene never loads the model itself.
- Rapier 3D's WebAssembly binary stays inside `@gerak/rapier` and is never pulled in by `@gerak/three` or `@gerak/rig`.
