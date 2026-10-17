# F2 — Delete obsolete APIs, implementation, and exports

Status: not implemented. Depends on: A5, C6, F1.

## Start here

Read `00-overview.md`, the completed consumer/deletion inventory, package export manifests, `packages/plugins/src/catalog.ts`, `packages/core/src/domain/plugins.ts`, `packages/core/src/graph/ir.ts`, and `packages/core/src/runtime/graph-publisher.ts`. Trace all remaining search hits before deletion.

## Outcome and work

Remove old object-group normalization/flattening, plugin-name instance addressing, stage/priority scheduling, compose/top-level outputs, flat singleton writes, by-plugin edits, cross-entry prepare behavior, old solverChain/solves/members channels, and kinematic slot-name classifications. Remove dead private helpers and type exports, not only public entrypoints. No temporary aliases, normalizer, legacy flags, dual path, or development converter remains.

Delete/defer incompatible fk3d/ik3d skeleton APIs and generators consistently with documented scope. Preserve dimension-independent math and independent transform3d/frame/driver/pose aggregation utilities only where their retained imports/contracts stand alone. Do not accidentally delete legitimate solver-local members arrays merely because the old injected slot used that name.

Audit package exports, barrels, catalogs/loaders, generated documentation, test helpers, apps/demos, and build entrypoints. The root plugin must be discoverable/public where other built-ins are; no exported generator constructs rejected documents. Confirm no source import from core into the concrete plugins package and no concrete kinematic dependency in generic core.

## Evidence and finish

Run semantic import/dependency and public-export checks, parser refusals for both retired authoring dialects, supported-generator smoke tests, and relevant type/boundary tests. Search results are an inventory aid, not a correctness oracle; record classified residual hits and their actual owners.

Done when one authoring/runtime path exists and every retained public consumer is compatible. Record actual deleted APIs/files, contract-based reasons, commands/results, and explicit removal/defer list. Do not hide failures by removing generic guarantees or weakening required checks. Next: F3.
