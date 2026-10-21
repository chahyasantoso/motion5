# Skeldata status index

Status: implementation track on branch `feat/skeldata-v5-phase-c`.
Current slice: C6 complete locally with CI pending; next C7.

## Last completed slice

- **Slice:** C6 ([20-C6-generic-core.md](../../motion5-implementation-plans/slices/20-C6-generic-core.md)).
- **State:** One shared `isLegacyComposeDefinition` predicate plus one graph-side gate (`graph/legacy.ts`); `PluginRegistry` answers `isNewPath`, and unknown or unjudged plugins keep the pre-C6 legacy classification. The new execution path carries no kinematic knowledge: `CompiledEntryPlan.capabilities`, `PluginLookup.capabilityOf`, `DEFAULT_CAPABILITY` and the public `PluginCapability`/`PluginCapabilities` type export are gone, and `solverChain` without `compose` is refused at admission. Legacy `ik`/`ik3d` graphs still derive `solves` through the quarantined channel and solve end to end through `GraphPublisher` with the real plugin composes; loading them through `Engine` is deferred to C7 because the execution-plan compiler requires every plugin to declare `collect` or `fold`, so a compose-only legacy plugin cannot load yet. That derivation now records `solveScope` and `solveRootEntry` on the solver node, so the publisher reads neither the `root` slot name nor an entry id that names a registered non-compose plugin; a non-compose plugin with slots spelled `root`/`base`/`solver`/`targets` is never classified, receives no `members`, and still gets cycle refusal. Quarantined behind F2 markers: `ports/plugin-capabilities.ts`, `contract/solver-shape.ts`, `contract/solver-constraints.ts`, `contract/solver-slots.ts` (`PLUGIN_GOALS_SLOT`), the solver derivation in `graph/ir.ts`, the constraint passes in `graph/solver-constraints.ts`, the members injection and solver-scope lookup in `runtime/graph-publisher.ts`, capability derivation in `domain/plugin-admission.ts`, and legacy re-exports in `plugin-api.ts`. Implemented locally; CI pending.
- **Next:** C7 ([21-C7-candidate-acceptance.md](../../motion5-implementation-plans/slices/21-C7-candidate-acceptance.md)).

## Phase progress

- Phase A (Foundation & Invariants: A1-A6): complete.
- Phase B (Authoring, Operations & Cache Seam: B1-B8): complete.
- Phase C (Derivation & Candidate Acceptance: C1-C7): in progress (C1-C6 complete).
- Phase D (Kinematics & Dual Caches: D1-D7): pending.
- Phase E (Editing & Render Lifecycle: E1-E7): pending.
- Phase G (3D & Integration Migration: G1-G8, runs before F): pending.
- Phase F (Callers, Verification & Release Gate: F1-F6): pending.

## Evidence index

- Contract: [docs/skeldata/CONTRACT.md](./CONTRACT.md).
- Deletions and consumer inventory: [docs/skeldata/INVENTORY.md](./INVENTORY.md).
- Lifecycle and failure ledger: [docs/skeldata/LIFECYCLE.md](./LIFECYCLE.md).
- Canonical address module: [packages/core/src/contract/address.ts](../../packages/core/src/contract/address.ts).
- Total numerics module: [packages/core/src/contract/numerics.ts](../../packages/core/src/contract/numerics.ts).
- Numerics test suite: [packages/core/test/contract/numerics.test.ts](../../packages/core/test/contract/numerics.test.ts).
- Identity test suite: [packages/core/test/contract/address-identity.test.ts](../../packages/core/test/contract/address-identity.test.ts).
- Canonical fixtures & oracle module: [packages/core/test/fixtures/skeldata-fixtures.ts](../../packages/core/test/fixtures/skeldata-fixtures.ts).
- Fixtures and oracle test suite: [packages/core/test/contract/fixtures-oracle.test.ts](../../packages/core/test/contract/fixtures-oracle.test.ts).
- Authoring schema & admission test suite: [packages/core/test/contract/authoring-schema-b1.test.ts](../../packages/core/test/contract/authoring-schema-b1.test.ts).
- Execution plan module: [packages/core/src/domain/execution-plan.ts](../../packages/core/src/domain/execution-plan.ts).
- Execution plan test suite: [packages/core/test/contract/execution-plan-b2.test.ts](../../packages/core/test/contract/execution-plan-b2.test.ts).
- Leaf codec module: [packages/core/src/contract/leaf-codec.ts](../../packages/core/src/contract/leaf-codec.ts).
- Leaf codec test suite: [packages/core/test/contract/leaf-codec-b3.test.ts](../../packages/core/test/contract/leaf-codec-b3.test.ts).
- Track preparation module: [packages/core/src/domain/track-preparation.ts](../../packages/core/src/domain/track-preparation.ts).
- Track preparation test suite: [packages/core/test/contract/track-preparation-b4.test.ts](../../packages/core/test/contract/track-preparation-b4.test.ts).
- Requirements scoping test suite: [packages/core/test/contract/requirements-b5.test.ts](../../packages/core/test/contract/requirements-b5.test.ts).
- Track operations module: [packages/core/src/domain/track-operations.ts](../../packages/core/src/domain/track-operations.ts).
- Track operations test suite: [packages/core/test/contract/operations-b6.test.ts](../../packages/core/test/contract/operations-b6.test.ts).
- Cache port and evaluator services module: [packages/core/src/domain/cache.ts](../../packages/core/src/domain/cache.ts).
- Cache providers module: [packages/core/src/domain/cache-providers.ts](../../packages/core/src/domain/cache-providers.ts).
- Cache provider conformance suite: [packages/core/test/contract/cache-provider-b7.test.ts](../../packages/core/test/contract/cache-provider-b7.test.ts).
- Staged state test suite: [packages/core/test/contract/staged-state-b7.test.ts](../../packages/core/test/contract/staged-state-b7.test.ts).
- Value transaction module: [packages/core/src/domain/value-transaction.ts](../../packages/core/src/domain/value-transaction.ts).
- Value writes test suite: [packages/core/test/contract/value-writes-b8.test.ts](../../packages/core/test/contract/value-writes-b8.test.ts).
- Generic structural derivation contract: [packages/core/src/contract/derivation.ts](../../packages/core/src/contract/derivation.ts).
- Generic structural derivation domain: [packages/core/src/domain/structural-derivation.ts](../../packages/core/src/domain/structural-derivation.ts).
- Structural derivation test suite (C1): [packages/core/test/contract/structural-derivation-c1.test.ts](../../packages/core/test/contract/structural-derivation-c1.test.ts).
- Chain layout derivation module: [packages/plugins/src/chain-layout.ts](../../packages/plugins/src/chain-layout.ts).
- Point plugin module: [packages/plugins/src/point.ts](../../packages/plugins/src/point.ts).
- Root plugin module: [packages/plugins/src/root.ts](../../packages/plugins/src/root.ts).
- Chain layout test suite (C2): [packages/plugins/test/unit/chain-layout-c2.test.ts](../../packages/plugins/test/unit/chain-layout-c2.test.ts).
- Joined layout derivation module: [packages/plugins/src/joined-layout.ts](../../packages/plugins/src/joined-layout.ts).
- Join plugin module: [packages/plugins/src/join.ts](../../packages/plugins/src/join.ts).
- Skeleton space spec module: [packages/plugins/src/skeleton-space.ts](../../packages/plugins/src/skeleton-space.ts).
- Layout identity module: [packages/plugins/src/layout-identity.ts](../../packages/plugins/src/layout-identity.ts).
- Joined layout test suite (C3): [packages/plugins/test/unit/joined-layout-c3.test.ts](../../packages/plugins/test/unit/joined-layout-c3.test.ts).
- Solve contract module (C4): [packages/plugins/src/solve-contract.ts](../../packages/plugins/src/solve-contract.ts).
- Solve bindings test suite (C4): [packages/plugins/test/unit/solve-bindings-c4.test.ts](../../packages/plugins/test/unit/solve-bindings-c4.test.ts).
- Dynamic skeleton reader module (C5): [packages/plugins/src/dynamic-skeleton.ts](../../packages/plugins/src/dynamic-skeleton.ts).
- Dynamic skeleton reader test suite (C5): [packages/plugins/test/unit/dynamic-reader-c5.test.ts](../../packages/plugins/test/unit/dynamic-reader-c5.test.ts).
- Legacy compose predicate (C6): [packages/core/src/domain/legacy-compose.ts](../../packages/core/src/domain/legacy-compose.ts).
- Graph legacy gate (C6): [packages/core/src/graph/legacy.ts](../../packages/core/src/graph/legacy.ts).
- Quarantine evidence suite (C6): [packages/core/test/unit/graph/legacy-quarantine.test.ts](../../packages/core/test/unit/graph/legacy-quarantine.test.ts).
- Public plugin subpaths test suite: [packages/plugins/test/public-subpaths.test.ts](../../packages/plugins/test/public-subpaths.test.ts).
- Capability registry: [packages/core/src/contract/capability.ts](../../packages/core/src/contract/capability.ts).
- Derive result constructors test suite: [packages/core/test/contract/derive-constructors.test.ts](../../packages/core/test/contract/derive-constructors.test.ts).
- Stateful plugin helper: [packages/core/src/domain/stateful-plugin.ts](../../packages/core/src/domain/stateful-plugin.ts).
- Plugin admission (execution strategy refusals): [packages/core/src/domain/plugin-admission.ts](../../packages/core/src/domain/plugin-admission.ts).
- Root policy module: [packages/plugins/src/root-policy.ts](../../packages/plugins/src/root-policy.ts).
- Root rules test suite (F1): [packages/plugins/test/unit/root-rules-f1.test.ts](../../packages/plugins/test/unit/root-rules-f1.test.ts).
- Duplicate root test suite (D8): [packages/plugins/test/unit/root-duplicate-d8.test.ts](../../packages/plugins/test/unit/root-duplicate-d8.test.ts).
- Root frame test suite (D7): [packages/plugins/test/unit/root-frame-d7.test.ts](../../packages/plugins/test/unit/root-frame-d7.test.ts).
- Overview reference: [00-overview.md](../../motion5-implementation-plans/00-overview.md).
- Cache contract reference: [cache-contract.md](../../motion5-implementation-plans/cache-contract.md).
- Plugin structural API ADR: [ADR-142-plugin-structural-api.md](../ADR-142-plugin-structural-api.md).
- Plugin API decisions: [motion5-plugin-api-decisions.md](../../motion5-implementation-plans/motion5-plugin-api-decisions.md).

## Follow-ups

- The dynamic skeleton reader landed in C5; D3/D4/D5 consume `readDynamicSkeleton` during execution.
- C4 reuses the existing `ik-goal-*` target rules; `ik-target-not-single-leaf` stays unused because
  the singular target shorthand is removed. `SolvePayload.memberIds` bounds the runtime angle keys,
  and D4/D5 own refusal of unknown or non-finite angles.
- `skeleton-imported-chain-has-root` and `ik-solver-no-solve-members` are registered in `rule-id.ts`,
  `rule.ts` and `rule-registry.test.ts`. D4/G4 wire the solver validators to the built-in solvers.
- `LocalEvaluation` exposes no bindings or source IDs, so C3's `join.collect` declares the collect
  seam but cannot emit link records. D2 owns the dynamic link record and C5 reads it.
- `SkeletonSpaceSpec` owns plugin and capability names plus point keys; numeric frame reading is the
  explicit `defineRootPlugin` parameter. C5 added the record reader and frame keys to the spec.
- C6 removed the `PluginCapability`/`PluginCapabilities` type export and quarantined the port, `solverChain`, `solves`, the `members` injection, kinematic slot-name rules and the kinematic constants re-exported by `@motion5/core/plugin-api` behind `isLegacyComposeDefinition`; legacy compose `ik`/`ik3d` still read `inputs.members`. `plugin-capabilities.test.ts` ADR-136 parts and every F2 marker stay until F2 deletes the channel. `runtime/authoring-edit.ts` still routes a `targets` slot edit to the reserved-goal verb and `runtime/graph-publisher.ts` still injects `members` for a node whose `solves` was derived; both are marked F2. The reserved-goal route is the legacy verb's own contract rather than plugin classification: `applyEdit` is registry-free by design, so C6 leaves that route whole for F2 instead of teaching it a second question. The plugin loader runs `validateV5` before definitions load, so that pre-validation remains unjudged and classifies unknown plugins as legacy exactly as before C6; graph builds that hold the registry apply the predicate. C6-8 joins solves to the publisher on object-form legacy groups, the form the current publisher/Track pair can solve; entry-record input keying is C7's change, so array-form legacy solve parity is not claimed here.
- The runtime does not call `executeTrackOperations` yet; evaluation still runs legacy `compose`. Runtime provider override, `committedStates` and `dispose(state)` are exercised only by tests; C7 and D6 wire them into the runtime transaction. C7 also adds the temporary `legacy-compose` strategy (per-plugin parity tests, `legacy-compose-mixed-track` refusal), drops the `committedStates.get(compilerKey) ?? committedStates.get(entryId)` fallback, keys inputs by entry instead of plugin name, and makes `EvaluatorServices` an augmentable interface. F2 deletes `legacy-compose`.
- FK and IK built-ins are still legacy `compose` plugins with `base`/`root`/`target` slots. C4 added
  the final descriptor contract in `packages/plugins/src/solve-contract.ts`; D3/D4/D5 migrate the
  built-ins to it.
- `transform3d`, `fk3d`, `ik3d`, `rig`, `pose-classify`, the Three adapter, `skeletonTracks` and the apps are still on the old contract; phase G (G1–G8, slices 36–43) migrates them before F. F1–F6 are now slices 44–49 (plan revision 2026-10-20, ADR-143; no code changed).
