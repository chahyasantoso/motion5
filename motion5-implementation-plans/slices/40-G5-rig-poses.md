# G5 — Migrate rig and pose-classify onto one poses read contract

Status: not implemented. Depends on: B6, C7, G1, G3.

## Start here

Read `00-overview.md`, ADR-138, `packages/plugins/src/rig.ts` (`readRigValues`, `RigPose`), `packages/plugins/src/pose-classify.ts`, `packages/plugins/test/rig.test.ts`, `packages/plugins/test/pose-classify.test.ts`, G3's `poses` output and `packages/three/src/skeleton-driver.ts` (`rigFrameSource`).

## Outcome and work

`rig` and `fk3d` both publish a record of named 3D world frames, under different names (`pose` versus `poses`) and with two decoders. Make it one contract:

- `rig` becomes a stateless fold over its `bones` and `controls` dict slots. It folds `poses` (renamed from `pose`) and `controls`. Bone frames read through `readFrame3d`; controls read as 3D points. Keep its deterministic key order and own-data-property construction, so a key such as `__proto__` stays data.
- One decoder, `readPoses3d(values)`, reads `poses` from any record that publishes it, whether a `rig` or an `fk3d` output, and returns own keys only as `Readonly<Record<string, WorldFrame3d>>`. `readRigValues` is rebuilt on it (or removed if `readPoses3d` plus a controls reader covers every caller). No second poses parser exists anywhere, including in `@motion5/three` and the apps.
- `pose-classify` binds a pose source instead of a rig: its slot accepts any track publishing `poses` (a `rig` or an `fk3d` track) and reads it through `readPoses3d`. It folds `label` and `confidence` as before, converting only template-referenced bones. Missing referenced bones keep their current classification policy.

Rename every `pose` reference that means this output (types such as `RigPose` included) in the plugins package. Callers in `@motion5/three` move in G7 and apps in G8; this slice only keeps them compiling. Delete the C7 parity tests for `rig` and `pose-classify`.

## Evidence and finish

Run `rig` fold tests for partial dicts, absent members, `__proto__` keys, controls and deterministic order; `readPoses3d` tests showing a `rig` record and an `fk3d` record decode to the same shape; `pose-classify` tests bound to a `rig` source and to an `fk3d` source producing the same labels for equal frames; and a refusal or empty-pose test for a source that publishes no `poses`.

Done when every named-3D-frame consumer reads `poses` through one decoder, whatever plugin produced it. Record renamed public types, commands/results and caller updates deferred to G7/G8. Next: G6.
