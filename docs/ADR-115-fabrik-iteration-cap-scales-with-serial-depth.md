# ADR-115: FABRIK iteration cap scales with serial depth

**Status:** Accepted, 2026-09-27, as part of the public 3D contract
([ADR-125](./ADR-125-public-3d-api.md)); landed through #499 (`main` at `42c72322`).
Proposed as issue [#491](https://github.com/chahyasantoso/motion5/issues/491), 2026-09-25,
stacked on PR #499.
**Extended by [ADR-126][adr126],
2026-09-27** (issue #514): free chains retain this cap and its bytes, while limited chains have a
4x ceiling gated by measured convergence progress.

## Invariant

A FABRIK attempt stops at cap only after budget proportional to serial depth: members on longest
root-to-leaf path. Every free rig of depth 16 or less keeps 64-pass bound and its bytes. Limited rig
takes cap unconditionally; may pass beyond it only under [ADR-126][adr126]'s progress-gated ceiling
of four times cap.

## Decision

`packages/core/src/plugins/fabrik-cap.ts` single owner: `FABRIK_MIN_ITERATIONS = 64`,
`FABRIK_ITERATIONS_PER_DEPTH = 4`, `fabrikIterationCap(depth, constraint)`. Free arm: larger of floor
and depth product, exactly as before. Limited arm: 4x ceiling; `fabrikPassBudget` admits extra passes
only when measured residual progress projects tolerance inside that ceiling. `FABRIK_MAX_ITERATIONS`
deleted, not aliased — internal, no longer a maximum. `solveFabrikAttempt` reads depth from canonical
order, last member deepest.

## Measurement

Sandbox, Node `v22.23.1`, esbuild bundles; reviewed, not trusted. Cap lifted: every serial rig at
depths 4 to 128 converged; worst needed 33 passes at 16, 73 at 48, 90 at 64, 145 at 128. Fixed 64
left 17 of 200 chain-64 rigs at cap. Depth rule: envelope differs from prior head only on those 17
rigs, each `iteration-cap` to `converged`; every other rig in every scenario `Object.is`-identical.

## Withdrawn

Fixed cap of 256 withdrawn: tripled charged passes of envelope trees, no quality gain, changed
converged tree-14 results through #490 selector. Keeping 64 withdrawn: capped chains still
converging.

## Evidence

`FB-21` pins rule and that depth, not member count, sets it. `FB-22` pins chain-64 rig 27 converging
in 88 passes. `EN-3` holds each rig to own depth's cap; `EN-5` pins chain-64.

[adr126]: ./ADR-126-limited-fabrik-seed-side-bidirectional-limits-and-pass-budget.md
