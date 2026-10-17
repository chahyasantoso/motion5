# Skeldata status index

Status: proposed implementation track.
Current slice: A5 (inventory removals and maintained consumers).

## Active slice

- **Slice:** A5 ([05-A5-deletions.md](../../motion5-implementation-plans/slices/05-A5-deletions.md)).
- **State:** Full inventory of retired machinery (group parser, stage/priority, cross-entry contribute, old group edits, flat writes, solverChain/solves injection, slot names, 3D generators), test classifications, consumer trace, and actionable F1/F2 worklists authored in `docs/skeldata/INVENTORY.md`.
- **Next:** A6 ([06-A6-lifecycle.md](../../motion5-implementation-plans/slices/06-A6-lifecycle.md)).

## Phase progress

- Phase A (Foundation & Invariants: A1-A6): in progress (A1-A5 complete).
- Phase B (Authoring, Operations & Cache Seam: B1-B8): pending.
- Phase C (Derivation & Candidate Acceptance: C1-C7): pending.
- Phase D (Kinematics & Dual Caches: D1-D7): pending.
- Phase E (Editing & Render Lifecycle: E1-E7): pending.
- Phase F (Callers, Verification & Release Gate: F1-F6): pending.

## Evidence index

- Contract: [docs/skeldata/CONTRACT.md](./CONTRACT.md).
- Deletions and consumer inventory: [docs/skeldata/INVENTORY.md](./INVENTORY.md).
- Canonical address module: [packages/core/src/contract/address.ts](../../packages/core/src/contract/address.ts).
- Total numerics module: [packages/core/src/contract/numerics.ts](../../packages/core/src/contract/numerics.ts).
- Numerics test suite: [packages/core/test/contract/numerics.test.ts](../../packages/core/test/contract/numerics.test.ts).
- Identity test suite: [packages/core/test/contract/address-identity.test.ts](../../packages/core/test/contract/address-identity.test.ts).
- Canonical fixtures & oracle module: [packages/core/test/fixtures/skeldata-fixtures.ts](../../packages/core/test/fixtures/skeldata-fixtures.ts).
- Fixtures and oracle test suite: [packages/core/test/contract/fixtures-oracle.test.ts](../../packages/core/test/contract/fixtures-oracle.test.ts).
- Overview reference: [00-overview.md](../../motion5-implementation-plans/00-overview.md).
- Cache contract reference: [42-cache-contract.md](../../motion5-implementation-plans/42-cache-contract.md).
