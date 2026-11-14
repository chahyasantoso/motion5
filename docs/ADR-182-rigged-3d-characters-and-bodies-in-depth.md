# ADR-182: Rigged 3D characters and bodies in depth

**Status:** Accepted, 2026-11-14

## Context

A 3D scene could pose whole objects (`Pose3d`, `applyPose3d`, `useTarget3d`, ADR-169) and solve 3D chains
(`solveChain3d`), but nothing wrote a pose onto a skinned mesh's bones: a glTF character could only move as one rigid
object. 3D chains were untyped against the 2D ones (`chainThrough`, `chainFromRest`, ADR-180), morph targets had no
writer from custom numbers, and physics was 2D only (`@dimforge/rapier2d-deterministic-compat`).

## Decision

- **A skinned character's bones take turns local to their parents.** `@gerak/three/skeleton` captures a skeleton's
  rest once (`captureSkeleton(root)`: bone names, parent-before-child order, local rest positions and quaternions,
  and world joint points and orientations), and `applyBones(skeleton, poses)` writes each named bone's `Pose3d` as a
  turn and offset from its own rest, in its parent's space, parents before children. A pose of `{}` restores rest;
  bind matrices are never touched; a non-unit bone scale at rest is reported by `captureSkeleton`, not silently fixed;
  an unknown bone name throws, naming it.
- **A 3D chain is built through joints, as in 2D, and answers two ways.** `chainThrough3d(joints)` builds a chain
  typed by joint id, from points given by hand or read from `skeleton.joints`, and `ik3d` solves it through
  `solveChain3d`. Its turns are local to each bone's rest frame, as `solveChain3d`'s `rotations3d` already are, so
  `bonesOf3d(chain, now)` hands them to `applyBones` directly; `chainFromRest3d(chain, rest, now)` answers the world
  pose that carries a separate rigid part from where it was modelled, for `useTarget3d`. Rig exports `fk3d` for world
  joint frames and stays dependency-free, returning plain `Pose3d`-compatible objects.
- **Morph targets are custom numbers.** `morphTargets(mesh)` in `@gerak/three` returns a custom writer that sets
  `morphTargetInfluences` by name, clamped to `[0, 1]`, reporting an unknown morph target name once rather than
  throwing so one scene can drive meshes with different blend shapes.
- **3D physics is a second world, same contract.** `@gerak/physics` adds `PhysicsWorld3d`, `BodySpec3d`,
  `BodyState3d`, `BodyShape3d` and `ColliderShape3d` beside the 2D types, with a body's orientation as a plain
  quaternion `{ w, x, y, z }`. `@gerak/rapier` adds `rapierEngine3d` on
  `@dimforge/rapier3d-deterministic-compat@0.21.0`. `simulate` is overloaded over `PhysicsWorld` and `PhysicsWorld3d`
  as the single owner of seeking, snapshots and contact events. `@gerak/rig`'s `bodyPose3d(state)` converts a 3D
  body's state into a `Pose3d`-compatible object.
- **One 3D scaffold for now.** `motion:new <name> --three` remains the single 3D scaffold; a glTF loads through
  Three.js's `GLTFLoader`. React Three Fiber (`--r3f` and `<Canvas>` integration with the scene clock and frame tools)
  is deferred as a future feature.
- **A 3D piece stays a code scene with its page** (ADR-169), and CC0 models live in `apps/pieces/references/` with
  their source and licence under 2 MB.

## Consequences

- `fk3d`, `solveChain3d`, `bonesOf3d` and `applyBones` share one local rotation equation (`restRotation * delta`), so
  a chain built from `skeleton.joints` reaches the same world joint positions in Three.js as `fk3d` computes,
  even when the exporter oriented bones away from the world axes at rest.
- Rapier 3D's WebAssembly binary stays inside `@gerak/rapier` and is never pulled in by `@gerak/three` or `@gerak/rig`.
