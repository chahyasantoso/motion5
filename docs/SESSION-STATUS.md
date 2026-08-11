# Session status

**Captured:** 2026-08-11, Asia/Jakarta  
**Branch:** `phase-0r2-1r1-gap-closure`  
**Phase:** Phase 4 remains reopened; graph ownership is preserved and the first value-pipeline slices are merged.  
**Next action:** close the verified acceptance gaps before Phase 1R-3 progress wiring.

This is the only document that reports current implementation reality. Everything else is a contract, plan, or decision record unless it says otherwise.

## Verified recovered behavior

- **0R-1:** `InterpolationTimeline.state` is adapter-owned; the fake interpolator produces deterministic numeric interpolation and no sampler API exists.
- **0R-2 shape:** authored properties use `{ stops: [{ p, v, ease? }] }`.
- **1R-1:** plugins resolve from authored keys with deterministic stage, priority, and registration ordering; this follow-up adds contribution metadata and duplicate-output diagnostics.
- **1R-2:** Track instances and timelines are reused for the runtime lifetime; graph traversal remains owned by `GraphRuntime` and `GraphPublisher`.

## Findings from the review

1. The stop type shape landed before stop validation. The validator must reject non-finite, out-of-range, non-monotonic, and duplicate positions before Track/timeline construction.
2. The GSAP adapter exposed a proxy-shaped `state`, but its current fake-like timeline call does not prove a real tween mutates that proxy. The adapter needs a real proxy-backed `to()` compilation contract and an adapter test.
3. The plugin contract had runtime `compose` and metadata but no compile-time `contribute` hook or duplicate output ownership check. This branch closes that contract gap and tests must prove both diagnostics.
4. The prior status text underclaimed the merged work. This document now records the verified state instead of repeating the pre-recovery audit.

## Acceptance order

1. Land and test stop validation.
2. Land and test real GSAP proxy/tween wiring, or explicitly keep it adapter-gated until a real GSAP dependency is present.
3. Land and test plugin `contribute` and duplicate-output ownership.
4. Only then start 1R-3 progress-to-invalidation wiring.

## Guardrails

- One owner per state transition.
- No graph rebuild or motionpath wholesale copy.
- No compatibility aliases, flags, facades, or placeholder tests.
- No renderer imports in core layers.
- Every recovery slice starts with a test that fails on its parent commit.
- Docs, types, tests, and status move together.
