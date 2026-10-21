# G1 — Migrate transform3d to a fold and pin the 3D frame value contract

Status: not implemented. Depends on: A3, B6, C7, D2.

## Start here

Read `00-overview.md`, D2's shared frame-fold helper and `transform` fold, `packages/plugins/src/transform3d.ts`, `packages/plugins/src/frame3d.ts` (`readFrame3d`, `readEuler3d`, `readPivotOffset3d`), `packages/three/src/index.ts` (`EULER_ORDER_3D`, `writeFrame3d`), ADR-117 and ADR-125. Phase G migrates the 3D surfaces to the same contract as 2D; it adds no bridge, converter or second runtime path.

## Outcome and work

Build `transform3d` from D2's shared frame-fold helper with the 3D key list (`x`, `y`, `z`, `rotation`, `rotationX`, `rotationY`). It emits only its own authored keys as the delta; unrelated preceding fields survive the delta merge, and repeated `transform3d` entries are ordered per-field replacement, not transform multiplication. There is no second fold body and no 3D-specific copy of the helper.

Pin the 3D frame value contract in one place, the way D2 pins `readFrame` for 2D:

- `readFrame3d` is the single runtime reader for a 3D frame value: `root3d`'s frame, `ik3d` targets and pole, `rig` bones and anything a Three adapter renders. Units are degrees; the Euler order is the one `EULER_ORDER_3D` names; missing fields default to zero.
- The new path relies on B6 publication validation to refuse non-finite values, so no reader on it needs to sanitize. Record whether any retained caller depends on `readFrame3d` sanitizing an authored non-finite value; if one does, keep that behavior behind its existing test and name the caller, rather than changing it silently.
- A 3D frame is a runtime value, not a structural capability (ADR-142 D7). No `frame3d` capability is added.

Register the migrated plugin in the catalog and loader demand discovery with no alias or legacy wrapper. Delete `transform3d`'s C7 `legacy-compose` parity test once the fold replaces it.

## Evidence and finish

Run fold tests for partial publication, per-field repeated replacement, survival of unrelated preceding fields, and absence of multiplication. Run the frame reader tests for defaults and Euler order, and a Three test that `writeFrame3d` renders the fold's published record unchanged. Prove through the real executor (C7) that the published record is the one the parity test pinned before deletion.

Done when `transform3d` is a collect/fold plugin built from the shared helper and every 3D frame consumer reads through one reader. Record commands/results and catalog changes. Next: G2.
