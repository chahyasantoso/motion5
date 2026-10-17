# Skeldata status index

Status: proposed implementation track.
Current slice: A2 (entry identity, addresses, and ownership).

## Active slice

- **Slice:** A2 ([02-A2-identity.md](../../motion5-implementation-plans/slices/02-A2-identity.md)).
- **State:** Canonical address types, collision-free encoding, safe prototype records, and lifecycle models implemented in `packages/core/src/contract/address.ts`.
- **Next:** A3 ([03-A3-numerics.md](../../motion5-implementation-plans/slices/03-A3-numerics.md)).

## Phase progress

- Phase A (Foundation & Invariants: A1-A6): in progress (A1-A2 complete).
- Phase B (Authoring, Operations & Cache Seam: B1-B8): pending.
- Phase C (Derivation & Candidate Acceptance: C1-C7): pending.
- Phase D (Kinematics & Dual Caches: D1-D7): pending.
- Phase E (Editing & Render Lifecycle: E1-E7): pending.
- Phase F (Callers, Verification & Release Gate: F1-F6): pending.

## Evidence index

- Contract: [docs/skeldata/CONTRACT.md](./CONTRACT.md).
- Canonical address module: [packages/core/src/contract/address.ts](../../packages/core/src/contract/address.ts).
- Identity test suite: [packages/core/test/contract/address-identity.test.ts](../../packages/core/test/contract/address-identity.test.ts).
- Overview reference: [00-overview.md](../../motion5-implementation-plans/00-overview.md).
- Cache contract reference: [42-cache-contract.md](../../motion5-implementation-plans/42-cache-contract.md).
