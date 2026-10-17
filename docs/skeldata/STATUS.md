# Skeldata status index

Status: proposed implementation track.
Current slice: A4 (author canonical fixtures and oracle strategy).

## Active slice

- **Slice:** A4 ([04-A4-fixtures.md](../../motion5-implementation-plans/slices/04-A4-fixtures.md)).
- **State:** Canonical test fixtures, 10 minimal invalid variants, FK oracle, and seeded bounded valid generator implemented in `packages/core/test/fixtures/skeldata-fixtures.ts` and verified in `packages/core/test/contract/fixtures-oracle.test.ts`.
- **Next:** A5 ([05-A5-deletions.md](../../motion5-implementation-plans/slices/05-A5-deletions.md)).

## Phase progress

- Phase A (Foundation & Invariants: A1-A6): in progress (A1-A4 complete).
- Phase B (Authoring, Operations & Cache Seam: B1-B8): pending.
- Phase C (Derivation & Candidate Acceptance: C1-C7): pending.
- Phase D (Kinematics & Dual Caches: D1-D7): pending.
- Phase E (Editing & Render Lifecycle: E1-E7): pending.
- Phase F (Callers, Verification & Release Gate: F1-F6): pending.

## Evidence index

- Contract: [docs/skeldata/CONTRACT.md](./CONTRACT.md).
- Canonical address module: [packages/core/src/contract/address.ts](../../packages/core/src/contract/address.ts).
- Total numerics module: [packages/core/src/contract/numerics.ts](../../packages/core/src/contract/numerics.ts).
- Numerics test suite: [packages/core/test/contract/numerics.test.ts](../../packages/core/test/contract/numerics.test.ts).
- Identity test suite: [packages/core/test/contract/address-identity.test.ts](../../packages/core/test/contract/address-identity.test.ts).
- Canonical fixtures & oracle module: [packages/core/test/fixtures/skeldata-fixtures.ts](../../packages/core/test/fixtures/skeldata-fixtures.ts).
- Fixtures and oracle test suite: [packages/core/test/contract/fixtures-oracle.test.ts](../../packages/core/test/contract/fixtures-oracle.test.ts).
- Overview reference: [00-overview.md](../../motion5-implementation-plans/00-overview.md).
- Cache contract reference: [42-cache-contract.md](../../motion5-implementation-plans/42-cache-contract.md).
