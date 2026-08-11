# Session status

**Captured:** 2026-08-11, Asia/Jakarta  
**Branch:** `phase-0r2-stop-validation`  
**Phase:** Phase 4 remains reopened; graph ownership is preserved and the value pipeline recovery is progressing through Phase 0R/1R.  
**Next action:** verify the GSAP adapter contract and then begin Phase 1R-3 progress-to-invalidation wiring.

This is the only document that reports current implementation reality. Everything else is a contract, plan, or decision record unless it says otherwise.

## Verified recovered behavior

- **0R-1:** `InterpolationTimeline.state` is adapter-owned; the fake interpolator produces deterministic numeric interpolation and no sampler API exists.
- **0R-2:** authored properties use `{ stops: [{ p, v, ease? }] }`; validation now rejects malformed, non-finite, out-of-range, non-monotonic, and duplicate positions, while warning on missing endpoints.
- **1R-1:** plugins resolve from authored keys with deterministic stage, priority, and registration ordering; contribution metadata and duplicate-output diagnostics are present.
- **1R-2:** Track instances and timelines are reused for the runtime lifetime; graph traversal remains owned by `GraphRuntime` and `GraphPublisher`.

## Remaining gates

1. Prove the GSAP proxy/tween contract with an adapter test against the injected timeline port.
2. Then start **Phase 1R-3: progress-to-invalidation wiring**.
3. Keep Phase 4 open until React, DOM lifecycle, public consumer imports, required build, and real end-to-end gates are green.

## Guardrails

- One owner per state transition.
- No graph rebuild or motionpath wholesale copy.
- No compatibility aliases, flags, facades, or placeholder tests.
- No renderer imports in core layers.
- Every recovery slice starts with a test that fails on its parent commit.
- Docs, types, tests, and status move together.
