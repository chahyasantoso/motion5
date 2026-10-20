# F2 — Delete obsolete APIs, implementation, and exports

Status: not implemented. Depends on: A5, C6, C7, G1–G8, F1.

## Start here

Read `00-overview.md`, the completed consumer/deletion inventory, package export manifests, `packages/plugins/src/catalog.ts`, `packages/core/src/domain/plugins.ts`, `packages/core/src/graph/ir.ts`, `packages/core/src/runtime/graph-publisher.ts`, `packages/core/src/domain/execution-plan.ts` and `packages/core/src/domain/track-operations.ts`. Start from the F2 markers C6 and C7 left on quarantined code. Trace all remaining search hits before deletion.

## Outcome and work

Already removed by the plugin structural API (ADR-142), so do not re-plan them: `createEvaluator`, `EvaluatorFactory`, `StatefulEvaluator`, `defineStatefulEvaluator`, `FoldClaim` and operation claims, plugin-level `capabilities[]`, the collect output label, and the eager root-only error. Admission still refuses a definition that declares `createEvaluator`; keep that guard. C6 already removed the `PluginCapability` type export from `packages/core/src/index.ts`; the port itself is quarantined and deleted here.

Precondition: every catalog plugin is a collect/fold plugin. D2, D4, D5, G1, G3, G4 and G5 migrated `transform`, `ik`, `fk`, `transform3d`, `fk3d`, `ik3d`, `rig` and `pose-classify`; confirm that no admitted definition satisfies `isLegacyComposeDefinition` before deleting anything.

Delete the temporary legacy bridge as one unit:

- The `legacy-compose` `ExecutionStrategy` variant, its executor case, the `legacy-compose-mixed-track` rule id and its registry entry, the remaining C7 parity tests, and the `isLegacyComposeDefinition` predicate. The exhaustive switches turn any reader left behind into a compile error; fix each one by deletion, never by a default branch.
- The quarantined kinematic channel C6 gated behind that predicate: `solverChain` and `SolverChainShape` in admission, `node.solves` and `resolveSolvers` in `graph/ir.ts`, members injection in `graph-publisher.ts`, `graph/solver-constraints.ts`, `contract/solver-slots.ts`, the kinematic constants in `contract/solver-shape.ts` and `contract/solver-constraints.ts` with their `@motion5/core/plugin-api` re-exports (`POLE_SLOT`, `INSPECT_KEY`, `INSPECTION_KEY` and the bend/flip keys), kinematic slot-name rules in `validate-v5.ts`, and the `PluginCapability`/`PluginCapabilities` port with `UNJUDGED_CAPABILITIES` and the ADR-136 parts of `packages/core/test/unit/domain/plugin-capabilities.test.ts`.
- Plugin-name requirement scoping, which survived only inside the legacy case, and `Track.compose`/`composeFrom` with its memo once nothing calls them.

Remove old object-group normalization/flattening, plugin-name instance addressing, stage/priority scheduling, compose/top-level outputs and contribute (the legacy `stage`, `priority`, `outputs`, `contribute`, `compose` and `solverChain` fields still on `PluginDefinitionBase` in `packages/core/src/domain/plugins.ts`), flat singleton writes, by-plugin edits and cross-entry prepare behavior. Remove dead private helpers and type exports, not only public entrypoints. No temporary aliases, normalizer, legacy flags, dual path, or development converter remains.

Nothing is deleted for being 3D: `fk3d`, `ik3d`, `transform3d`, `rig`, `skeletonTracks` and the skeleton driver were migrated by phase G and stay public. Do not accidentally delete legitimate solver-local members arrays merely because the old injected slot used that name.

Audit package exports, barrels, catalogs/loaders, generated documentation, test helpers, apps/demos, and build entrypoints. The root plugin must be discoverable/public where other built-ins are; no exported generator constructs rejected documents. Confirm no source import from core into the concrete plugins package and no concrete kinematic dependency in generic core.

## Evidence and finish

Run semantic import/dependency and public-export checks, a check that `ExecutionStrategy` has exactly the `stateless` and `stateful` variants, parser refusals for both retired authoring dialects, supported-generator smoke tests, and relevant type/boundary tests. Search results are an inventory aid, not a correctness oracle; record classified residual hits and their actual owners.

Done when one authoring/runtime path exists and every retained public consumer is compatible. Record actual deleted APIs/files, contract-based reasons, commands/results, and explicit removal list. Do not hide failures by removing generic guarantees or weakening required checks. Next: F3.
