# A5 — Inventory removals and maintained consumers

Status: implemented (inventory reviewed) on branch `feat/plugin-structural-api`. Depends on: A1.

Evidence: `docs/skeldata/INVENTORY.md`. Removal itself belongs to F1/F2.

## Start here

Read `00-overview.md`, `package.json`, `packages/core/src/domain/keyframe-groups.ts`, `packages/core/src/contract/solver-slots.ts`, `packages/plugins/src/catalog.ts`, `packages/plugins/src/rig.ts`, `packages/three/src/skeleton-tracks.ts`, and `packages/three/src/skeleton-driver.ts`. Search references before opening additional consumers.

## Outcome and work

Create a concise deletion/consumer inventory under `docs/skeldata` or the repository's accepted tracking location. Each item names actual producer, consumers, public export, replacement/removal, and owning later slice. Inventory object-group parser/flattening, plugin-name requirement scoping, stage/priority/compose/top-level outputs, cross-entry contributions, old group edit APIs, flat writes, solverChain/solves/members injection, slot-name classification, and old per-bone 2D/3D generators.

Classify tests: retain generic transactions/subscriptions/interpolation and solver/math guarantees; rewrite maintained behavior into the hybrid; remove assertions solely enforcing retired contracts. Do not classify arbitrary uses of the word members as obsolete.

Trace app/demo/public export consumers, especially avatar/pose tooling and Three skeleton capture/driving. The old per-bone `fk3d`/`ik3d` contracts and the per-bone generator are replaced, not retired: phase G migrates `transform3d`, the 3D skeleton family, `fk3d`, `ik3d`, `rig`, the Three adapter, `skeletonTracks` and the apps onto the new contract (revised 2026-10-20, ADR-143). `rig` is not a skeleton source; G5 migrates it explicitly to a fold publishing `poses`, never by silent redefinition.

Document no PlanX converter, tree plugin, or 3D bridge. Every inventoried consumer, 3D included, gets an owning migration slice; do not leave a broken exported generator or delete unrelated capabilities silently.

## Evidence and finish

For each public removal, trace at least one actual consumer or state that no internal consumer was found after the named search. Record source-inspected findings separately from executed tests. Inventory root plugin catalog/export additions as well as removals.

Done when F1/F2 have a complete actionable worklist, not “clean up later.” No repository API implementation is required here. Report searches/paths and known external-consumer uncertainty. Next: A6.
