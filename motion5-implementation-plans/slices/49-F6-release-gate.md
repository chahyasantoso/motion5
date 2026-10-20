# F6 — Verify the exact release candidate without overstating evidence

Status: not implemented. Depends on: every prior slice A1–E7, G1–G8 and F1–F5.

## Start here

Read `00-overview.md`, `cache-contract.md`, the implementation status/evidence index, actual package scripts, `AGENTS.md`, `docs/PR-WORKFLOW.md` and release workflow. Verify evidence belongs to the exact final checkout; prior green commits are not this candidate's verification.

## Outcome and work

Review the complete diff for one authored dialect, no retired compose/stage/priority/singleton API paths, no `legacy-compose` strategy or quarantined kinematic channel, correct exports/apps/examples and no 3D skeleton bridge or converter. The migrated 3D family (`point3d`/`root3d`/`join3d`, `fk3d`, `ik3d`, `transform3d`, `rig`, `skeletonTracks`, Three pose bindings) is public and covered by evidence. Search for duplicate key codecs, parallel topology readers (including a forked 3D copy of the space-generic topology), duplicated binding logic between the DOM and Three adapters, core kinematics, slot-name branches, global caches, second transaction/commit hooks and engine access in mathematics.

Require actual generic provider/type/conformance evidence for default, no-cache and alternative implementations; non-kinematic client DI; stateless/stateful and both-operation isolation; complete canonical IK key/inspection/seed audit; per-point FK reference reuse; atomic output/state acceptance; rejected candidate isolation; structural cold reset and idempotent disposal. Check all new public closed variants are consumed exhaustively and open providers remain substitutable.

Re-run necessary formatting/raw-template/type/test/build/boundary/app gates from actual scripts. The snapshot's npm run check performs raw-template scan, format check, typecheck and npm test; discover other current gates rather than invent names. Include new-schema smoke tests, negative dialect tests, geometry/solve, provider/history/failure/property, editing/binding ownership and actual integration cases. Run browser/GLB/render checks only under their real available workflow; report absent or blocked checks explicitly.

Require F4 raw measurements for both FK and IK provider variants and new-contract workloads. Verify output equivalence before speed comparisons, report O(N) comparisons/copies and coupled solve limits honestly, and distinguish counter savings from end-to-end improvement. Documentation must match actual APIs/exports/errors and synchronous provider limitations. Do not mark unresolved performance or cleanup concerns complete by rewriting the status index.

## Evidence and finish

Record exact commit, environment, commands/exit results, tested apps/fixtures, benchmark artifacts and unresolved limitations. Distinguish code implemented, checks run/passed, performance measured, merged and released. A blocked required gate blocks gate-complete; report the blocker rather than invent green evidence or restore legacy fallback.

Completion means the actual final candidate satisfies the complete reviewed contract and executed gates, not that a planning ZIP exists. Merge/publish/release remains a separate authorized repository operation; do not claim it happened from local verification. Final handoff lists the precise acceptance evidence and any actions still required.
