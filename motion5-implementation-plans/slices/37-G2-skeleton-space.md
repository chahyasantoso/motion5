# G2 — Generalize skeleton topology over spaces and add point3d, root3d and join3d

Status: not implemented. Depends on: C2, C3, C4, C5, D2, G1.

## Start here

Read `00-overview.md`, C3's space spec (`SKELETON_2D`), `packages/plugins/src/point.ts`, `root.ts`, `root-policy.ts`, `chain-layout.ts`, the C3 join module, the C5 reader, `frame3d.ts`, `ik3d-chain.ts` (the per-member 3D readers for joint limits, influence and orient), and `packages/core/src/contract/capability.ts` (`CapabilityMap`).

## Outcome and work

Make the skeleton topology generic over a `SkeletonSpace` spec instead of writing a 3D copy. The spec names the space's plugin names (`point`/`root`/`join` or `point3d`/`root3d`/`join3d`), its capability names (`chain`/`joined` or `chain3d`/`joined3d`), its point-record reader and its frame reader. Build both families from shared factories (for example `definePointPlugin(space)`, `defineRootPlugin(space)`, `defineJoinPlugin(space)`), and run chain layout, joined layout, root policy and the C5 reader over the spec. The 2D family keeps its names and behavior exactly; 2D tests pass unchanged.

The 3D family:

- `point3d` collects one local record per entry: `length`, `rotation`, `rotationX`, `rotationY`, pivot offset `x`/`y`/`z`, `weight`, the joint-limit vocabulary (ADR-123), `influence` and `orient` (ADR-124). These were per-member `fk3d` values; they are point values now. Its `derive` produces `chain3d`.
- `root3d` folds `{ root: readFrame3d(input) }` from an optional `frame` slot with no capability, exactly as `root` does with `readFrame`.
- `join3d` collects link records with a required `chain` and optional `parent` slot, both declaring `capability: "chain3d"`, and produces `joined3d`.
- The plugins package augments `CapabilityMap` with `chain3d` and `joined3d`, with payload types parameterized by the space's point record and frame types.

Space rules:

- Capability names differ per space, so core's presence check refuses a 3D consumer bound to a 2D source and the reverse (`derivation-missing-capability`). No plugin code checks space by hand.
- A track mixing entries of both spaces derives no skeleton capability (`none`), the same rule as any other mixed track.
- `root` and `root3d` on one track are duplicate roots. The shared root factory's `derive` counts root-family entries of both spaces from the track-local inventory, and only the first root-family entry's plugin reports, so the diagnostic appears once.
- The C3/C4 rule ids (`skeleton-imported-chain-has-root`, `ik-solver-no-solve-members`) are space-neutral; reuse them and add no 3D variants.

`readAny` over `["chain3d", "joined3d"]` returns the same discriminated union shape as in 2D, and the space-generic reader consumes it with the same exhaustive switch. The 3D resolved skeleton has the same layout, locators, adjacency and provenance as 2D, with 3D point records and `WorldFrame3d` root frames.

Check `validate-v5.ts` perspective detection (`THREE_D_KEYS`): it already scans entry-nested values. Confirm a `point3d` chain authoring `z` or `rotationX` is detected as 3D and that requires-only entries (`join3d`, `fk3d`, `ik3d`) need no perspective of their own; record the result.

## Evidence and finish

Run the C2, C3 and C5 suites table-driven over both specs instead of duplicating them: canonical torso/two-arms topology in 3D, every C3 refusal, rooted import, root anywhere, mixed-space track, `root`+`root3d` duplicate, cross-space binding refusals in both directions, and the 3D reader's stale-layout and malformed-record refusals. Instrument topology construction to prove the 3D dynamic read does not rebuild it.

Done when 2D and 3D skeletons share one topology implementation and differ only in their spec, records and math. Record actual factory/spec paths, commands/results and any 2D behavior change (there should be none). Next: G3.
