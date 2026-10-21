# Skeldata status index

Status: implementation track on branch `feat/skeldata-v5-phase-c`.
Current slice: C3 complete locally with CI pending; next C4.

## Last completed slice

- **Slice:** C3 ([17-C3-joined-layout.md](../../motion5-implementation-plans/slices/17-C3-joined-layout.md)).
- **State:** Plugin-owned joined layout derivation (`deriveJoinedLayout`) and requirement validation
  (`validateJoinedRequirements`) from one or more `join` entries plus an optional single `root`
  entry; authored parent-first ordering validated across the whole track, child adjacency,
  prototype-safe ID index, point locators with a parity refusal, `RootPolicy` propagation and
  imported-root refusal (`skeleton-imported-chain-has-root`), length-prefixed numeric-invariant
  `layoutIdentity` that includes link identity, a shared mixed-track guard between validate and
  derive, and capability map augmentation (`joined`). Implemented locally; CI pending.
- **Next:** C4 ([18-C4-solver-derivation.md](../../motion5-implementation-plans/slices/18-C4-solver-derivation.md)).

## Phase progress

- Phase A (Foundation & Invariants: A1-A6): complete.
- Phase B (Authoring, Operations & Cache Seam: B1-B8): complete.
- Phase C (Derivation & Candidate Acceptance: C1-C7): in progress (C1-C3 complete).
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

- `join` capability `joined` landed in C3; C4 owns the chain-or-joined slot union.
- `skeleton-imported-chain-has-root` is registered in `rule-id.ts`, `rule.ts` and
  `rule-registry.test.ts`; `ik-solver-no-solve-members` remains C4.
- `LocalEvaluation` exposes no bindings or source IDs, so C3's `join.collect` declares the collect
  seam but cannot emit link records. D2 owns the dynamic link record and C5 reads it.
- `SkeletonSpaceSpec` owns plugin and capability names plus point keys; numeric frame reading is the
  explicit `defineRootPlugin` parameter. C5 adds the record reader when records exist.
- `PluginCapability`/`PluginCapabilities` (`ports/plugin-capabilities.ts`) is still type-exported from `packages/core/src/index.ts` and used across the graph; `plugin-capabilities.test.ts` ADR-136 parts stay until F2 deletes the port. C6 removes the type export and quarantines the port, `solverChain`, `solves`, the `members` injection, kinematic slot-name rules and the kinematic constants re-exported by `@motion5/core/plugin-api` behind `isLegacyComposeDefinition`, because legacy compose `ik`/`ik3d` still read `inputs.members`.
- The runtime does not call `executeTrackOperations` yet; evaluation still runs legacy `compose`. Runtime provider override, `committedStates` and `dispose(state)` are exercised only by tests; C7 and D6 wire them into the runtime transaction. C7 also adds the temporary `legacy-compose` strategy (per-plugin parity tests, `legacy-compose-mixed-track` refusal), drops the `committedStates.get(compilerKey) ?? committedStates.get(entryId)` fallback, keys inputs by entry instead of plugin name, and makes `EvaluatorServices` an augmentable interface. F2 deletes `legacy-compose`.
- FK and IK are still legacy `compose` plugins with `base`/`root`/`target` slots; C4, D3, D4 and D5 migrate them.
- `transform3d`, `fk3d`, `ik3d`, `rig`, `pose-classify`, the Three adapter, `skeletonTracks` and the apps are still on the old contract; phase G (G1–G8, slices 36–43) migrates them before F. F1–F6 are now slices 44–49 (plan revision 2026-10-20, ADR-143; no code changed).
