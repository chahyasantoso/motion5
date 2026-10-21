# Skeldata status index

Status: proposed implementation track.
Current slice: C2 (chain layout and root policy derivation).

## Active slice

- **Slice:** C2 ([16-C2-chain-layout.md](../../motion5-implementation-plans/slices/16-C2-chain-layout.md)).
- **State:** Plugin-owned chain layout derivation (`deriveChainLayout`), sequential point parenting, child adjacency, prototype-safe ID index, point locators, `RootPolicy` (`origin`, `unbound`, `bound` with provenance), numeric-invariant `layoutIdentity`, and duplicate root diagnostics implemented.
- **Next:** C3 ([17-C3-joined-layout.md](../../motion5-implementation-plans/slices/17-C3-joined-layout.md)).

## Phase progress

- Phase A (Foundation & Invariants: A1-A6): complete.
- Phase B (Authoring, Operations & Cache Seam: B1-B8): complete.
- Phase C (Derivation & Candidate Acceptance: C1-C7): in progress (C1, C2 complete).
- Phase D (Kinematics & Dual Caches: D1-D7): pending.
- Phase E (Editing & Render Lifecycle: E1-E7): pending.
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
- Overview reference: [00-overview.md](../../motion5-implementation-plans/00-overview.md).
- Cache contract reference: [42-cache-contract.md](../../motion5-implementation-plans/42-cache-contract.md).
- Plugin structural API ADR: [ADR-142-plugin-structural-api.md](../ADR-142-plugin-structural-api.md).

## Follow-ups

- N1: `00-overview.md` line 105 still says "Root-only FK is valid, root-only IK is not". Correct it to "FK and IK both need a skeleton source with points; a root-only track has no skeleton capability". The architect edits the plan pack; this bullet only records it.
- `join` capability `joined` and the chain-or-joined slot union: C3/C4.
- `plugin-capabilities.test.ts` ADR-136 parts stay until C6.
- `42-cache-contract.md` section 4 and any D4/D5 plan text still describe the evaluator factory and claims; the architect updates them to `init`/`prepare`.
- `dispose(state)` and `committedStates` are exercised only by tests; wire them into the runtime transaction when that slice lands.
