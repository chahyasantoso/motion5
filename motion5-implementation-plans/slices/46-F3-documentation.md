# F3 — Publish the final architecture and breaking contract

Status: not implemented. Depends on: A1–A6, B1–B8, C1–C7, D1–D7, E1–E7, G1–G8, F1, F2.

## Start here

Read `00-overview.md`, `cache-contract.md`, actual implemented public types/exports, `docs/AUTHORED-SCHEMA.md`, relevant ADRs discovered by reference search, the status index and `docs/PR-WORKFLOW.md`. Use code/executed evidence rather than treating proposed API names as existing exports.

## Outcome and work

Update schema, plugin admission and stateless/stateful (`init`/`prepare`) execution, the reserved `collect` output, `validate`/`derive` with `DeriveResult` and `CapabilityMap`, contributions, structural capabilities, private state/cache lifecycle, numerics, handles/value batches, atomic recipes and pose binding/cleanup. Keep one normative implementation contract and link examples to it. Repository docs use no Markdown tables; this plan pack's reference tables are not a reason to violate that rule.

Explain all hybrid reconciliations: IDs on singleton-map entries; append collections/ordered delta folds; stamped IDs and fold/collection isolation; source-owned root/no IK/FK base; root anywhere/first join topology; rootless imports; anchored first point/leaf goals; unqualified unique point IDs; poses tips; no implicit same-track solve. Keep schemaVersion 5 with one breaking pre-release dialect and no converter, compatibility or 3D skeleton bridge. Document the 3D family as the same model in another space: `point3d`/`root3d`/`join3d` with `chain3d`/`joined3d`, `fk3d` poses, `ik3d` targets and pole, `transform3d`, `rig` as a fold publishing `poses`, the one `readPoses3d` decoder, and `skeletonTracks` output. Rewrite the prose of `docs/guide/inverse-kinematics-3d.md` around the examples G4 rewrote, and record ADR-143 (`docs/ADR-143-legacy-bridge-and-3d-migration.md`) as the decision source for the `legacy-compose` exception, the C6 quarantine, per-generation disposal and the 3D migration. Document actual names/removed APIs, free-track root/goal references, FK-only examples, nested writes, stale handles and atomic topology/goal recipes.

Add a runnable public DI example selecting default, no-cache and a conforming custom provider at runtime construction. Show a typed `defineStatefulPlugin<S, P>` plugin (`init`, `prepare`, optional `dispose`, `collect`/`fold.run` over the prepared value), the immutable state proposal and exhaustive hit/miss handling in a non-kinematic plugin. Distinguish operations (collect, fold) from execution strategy (stateless, stateful) and demonstrate the unchanged simple stateless API. Start from ADR-142 and `motion5-implementation-plans/motion5-plugin-api-decisions.md`. Providers are open implementations, not plugin-specific enums or graph access. Document synchronous limitations, exact key/equality/immutability requirements, provider exceptions, bounded retention, structural cold resets and disposal.

Explain FK per-point effective-key reuse versus IK complete-request/whole-result memoization; deterministic seeds, inspection projection, signed zero, no cached failures or callback/delta auto-memoization. State O(N) checks + O(K) FK math and O(N)-scale IK request checks honestly. Provider-disabled correctness, cache-history equivalence and acceptance failures are part of the contract, not optional optimizations.

Separate precommit refusal from postcommit delivery errors. Design/implemented/verified/measured/merged/released remain different statuses; do not imply this plan delivery ran runtime tests or benchmarks.

## Evidence and finish

Run example smoke/typechecks and documentation formatting; verify defaults/errors/exports against actual tests, public custom-provider usability and links. Record real allocated ADR identifiers, commands/results, API removals and pending measurements. Done when users can author, inject caching, edit, solve and render without historical proposals or retired assumptions. Do not mark unrun release/performance gates complete. Next: F4.
