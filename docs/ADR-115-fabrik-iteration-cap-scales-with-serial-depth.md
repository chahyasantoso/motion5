# ADR-115: FABRIK iteration cap scales with serial depth

**Status:** Proposed as issue [#491](https://github.com/chahyasantoso/motion5/issues/491),
2026-09-25, stacked on PR #499. Accepted when its pull request merges.

## Invariant

A FABRIK attempt stops at the cap only after a budget proportional to its serial depth, the number
of members on its longest root-to-leaf path. Every rig of depth 16 or less keeps the 64-pass bound
and its bytes.

## Decision

`packages/core/src/plugins/fabrik-cap.ts` is the single owner: `FABRIK_MIN_ITERATIONS = 64`,
`FABRIK_ITERATIONS_PER_DEPTH = 4`, and `fabrikIterationCap(depth)`, the larger of the two.
`FABRIK_MAX_ITERATIONS` is deleted rather than aliased, because it was internal and is no longer a
maximum. `solveFabrikAttempt` reads depth from its canonical order, whose last member is deepest.
No quality kind, result field or package export changes, and no cap-policy union is introduced,
because a union with one live member is a mode in disguise.

## Measurement

Sandbox, Node `v22.23.1`, esbuild bundles; reviewed, not trusted. With the cap lifted, every
serial rig at depths 4 to 128 converged; the worst needed 33 passes at 16, 73 at 48, 90 at 64 and
145 at 128. A fixed 64 left 17 of 200 chain-64 rigs at the cap. Under the depth rule the envelope
differs from the prior head only on those 17 rigs, each `iteration-cap` to `converged`; every other
rig in every scenario is `Object.is`-identical.

## Withdrawn

A fixed cap of 256 is withdrawn: it tripled the charged passes of the envelope trees for no quality
gain and changed converged tree-14 results through the #490 selector. Keeping 64 is withdrawn
because the capped chains were still converging.

## Evidence

`FB-21` pins the rule and that depth, not member count, sets it. `FB-22` pins chain-64 rig 27
converging in 88 passes. `EN-3` holds each rig to its own depth's cap and `EN-5` pins chain-64.
