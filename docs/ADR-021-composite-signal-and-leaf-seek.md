# ADR-021: Separate composite Motion signals from leaf node seeking

**Status:** Accepted, 2026-08-15

**Decision.** `seek(nodeId)` positions a leaf; `signal(motionId, signal)` controls a composite Motion.

**Clarified, 2026-08-18.** `seek` is deliberately not gated by `acceptsExternalSignal`. A driver-backed Motion rejects `signal()`, but `seek(nodeId, progress)` still writes node progress directly, and the next driver emission overwrites it. That is intended: `signal()` is Motion-level control and `seek` is leaf-level scrubbing, so merging them would give one responsibility two owners and would remove the only way to scrub a driven node. Gating `seek` behind the driver capability would need a new record here rather than an implementation change. Pinned in executable form by case `T-12` in `packages/core/test/integration/motion-trigger-types.test.ts`. See [ADR-033](./ADR-033-no-manual-trigger-fallback.md).
