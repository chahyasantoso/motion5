# ADR-021: Separate composite Motion signals from leaf node seeking

**Status:** Accepted, 2026-08-15

**Decision.** `seek(nodeId)` positions a leaf; `signal(motionId, signal)` controls a composite Motion.

**Clarified, 2026-08-18.** `seek` deliberately not gated by `acceptsExternalSignal`. A driver-backed Motion rejects `signal()`, but `seek(nodeId, progress)` still writes node progress directly, and next driver emission overwrites it. Intended: `signal()` is Motion-level control, `seek` is leaf-level scrubbing → merging gives one responsibility two owners and removes the only way to scrub a driven node. Gating `seek` behind the driver capability needs a new record here, not an implementation change. Pinned in executable form by case `T-12` in `packages/core/test/integration/motion-trigger-types.test.ts`. See [ADR-033](./ADR-033-no-manual-trigger-fallback.md).
