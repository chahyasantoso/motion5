# Session status

**Captured:** 2026-08-11, Asia/Jakarta  
**Branch:** `phase-1r3-progress-invalidation`  
**Phase:** Phase 1R-3 is in review: progress changes now update the owning Track and invalidate the existing graph publisher without adding a second clock. Phase 4 remains reopened.  
**Next action:** run the Phase 1R-3 gates, then address Phase 2/3 memo, batch-error, reentrancy, and boundary self-test hardening.

This is the only document that reports current implementation reality. Everything else is a contract, plan, or decision record unless it says otherwise.

## Verified recovered behavior

- **0R-1:** `InterpolationTimeline.state` is adapter-owned; the fake interpolator produces deterministic numeric interpolation and no sampler API exists.
- **0R-2:** authored properties use `{ stops: [{ p, v, ease? }] }`; validation rejects malformed, non-finite, out-of-range, non-monotonic, and duplicate positions, while warning on missing endpoints.
- **1R-1:** plugins resolve from authored keys with deterministic stage, priority, and registration ordering; contribution metadata and duplicate-output diagnostics are present.
- **1R-2:** Track instances and timelines are reused for the runtime lifetime; graph traversal remains owned by `GraphRuntime` and `GraphPublisher`.
- **GSAP adapter gate:** authored stops compile onto an adapter-owned proxy, progress reads the same state object, and teardown kills the injected timeline.
- **1R-3:** `ProjectRuntime.seek(nodeId, progress)` updates the owning Track and publishes the affected downstream closure through `GraphRuntime.invalidate()`; the project still owns the only clock subscription.

## Remaining gates

1. Phase 2/3 hardening: final-value memo consistency, batch error preservation, reentrancy, and boundary self-testing.
2. Phase 4R: React and DOM lifecycle, public consumer imports, required build, and real end-to-end gates.
3. Phase 4 remains open until the required build and end-to-end fixture prove the complete consumer path.

## Guardrails

- One owner per state transition.
- No graph rebuild or motionpath wholesale copy.
- No compatibility aliases, flags, facades, or placeholder tests.
- No renderer imports in core layers.
- Every recovery slice starts with a failing-first test on its parent commit.
- Docs, types, tests, and status move together.
