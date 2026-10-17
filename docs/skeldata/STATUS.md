# Skeldata status index

Status: proposed implementation track.
Current slice: A6 (define atomicity, generic private state and failure boundaries).

## Active slice

- **Slice:** A6 ([06-A6-lifecycle.md](../../motion5-implementation-plans/slices/06-A6-lifecycle.md)).
- **State:** Normative candidate evaluation protocol, 7-phase execution lifecycle, private evaluator state, transaction baselines, no-fail swap invariants, and 11-scenario failure ledger authored in `docs/skeldata/LIFECYCLE.md`.
- **Next:** B1 ([07-B1-authoring.md](../../motion5-implementation-plans/slices/07-B1-authoring.md)).

## Phase progress

- Phase A (Foundation & Invariants: A1-A6): complete.
- Phase B (Authoring, Operations & Cache Seam: B1-B8): in progress (B1 next).
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
- Overview reference: [00-overview.md](../../motion5-implementation-plans/00-overview.md).
- Cache contract reference: [42-cache-contract.md](../../motion5-implementation-plans/42-cache-contract.md).
