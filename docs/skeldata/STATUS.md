# Skeldata status index

Status: proposed implementation track.
Current slice: B8 (uniform entry-addressed value transactions).

## Active slice

- **Slice:** B8 ([14-B8-value-writes.md](../../motion5-implementation-plans/slices/14-B8-value-writes.md)).
- **State:** Uniform entry-addressed value transaction domain, validation, leaf schema enforcement, structural rejection, atomic batching, Track plan-aware value writing, and EntryLiveHandle reference contract implemented.
- **Next:** C1 ([15-C1-derivation.md](../../motion5-implementation-plans/slices/15-C1-derivation.md)).

## Phase progress

- Phase A (Foundation & Invariants: A1-A6): complete.
- Phase B (Authoring, Operations & Cache Seam: B1-B8): complete.
- Phase C (Derivation & Candidate Acceptance: C1-C7): pending.
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
- Cache port and stateful helper module: [packages/core/src/domain/cache.ts](../../packages/core/src/domain/cache.ts).
- Cache providers module: [packages/core/src/domain/cache-providers.ts](../../packages/core/src/domain/cache-providers.ts).
- Cache provider conformance suite: [packages/core/test/contract/cache-provider-b7.test.ts](../../packages/core/test/contract/cache-provider-b7.test.ts).
- Staged state test suite: [packages/core/test/contract/staged-state-b7.test.ts](../../packages/core/test/contract/staged-state-b7.test.ts).
- Value transaction module: [packages/core/src/domain/value-transaction.ts](../../packages/core/src/domain/value-transaction.ts).
- Value writes test suite: [packages/core/test/contract/value-writes-b8.test.ts](../../packages/core/test/contract/value-writes-b8.test.ts).
- Overview reference: [00-overview.md](../../motion5-implementation-plans/00-overview.md).
- Cache contract reference: [42-cache-contract.md](../../motion5-implementation-plans/42-cache-contract.md).
