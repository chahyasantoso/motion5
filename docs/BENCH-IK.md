# 2D IK benchmark

This record is the measured performance envelope for the 2D `ik` and `fk` plugins in phase 7 of
[#349](https://github.com/chahyasantoso/motion5/issues/349). It records fresh runs of the committed
`packages/core/test/support/ik-envelope.ts` scenarios rather than a promise about every machine.
The deterministic shape and finiteness contract is the CI evidence; timing is deliberately not a CI
gate under [ADR-008](./ADR-008-gates-measure-behavior-not-prose.md).

## Conditions

The paired reports were recorded on 2026-09-24 with Node `v22.23.1`, V8 `12.4.254.21-node.56`,
`linux x64`, and `Intel(R) Xeon(R) Processor @ 2.60GHz` with 4 cores. Each solve scenario used
200 rigs. Each number is the median of 7 samples, each sample making back-to-back calls for at least
60 ms after one warm-up pass. The machine was deliberately kept free of other known heavy work, but
other agents may have been running tests during the measurements, so these are observations rather
than isolated-host guarantees.

Run 1 is the primary report below. Its raw JSON, like the paired Run 2 report, is a generated
measurement artifact rather than a repository input; reproduce both with the command in Reproduce.
The engine numbers measure a mounted runtime seeking every rig's goal once in a frame. Per-member
figures divide the measured solve time by member count; they are not additional measurements.

## Solve scenarios

- **Two-bone closed form:** 2.3257 microseconds per solve, or 1.1629 microseconds per member. All
  200 solves reported `reached`; the closed form performed zero iterative passes.
- **Chain-8:** 76.2351 microseconds per solve, or 9.5294 microseconds per member. All 200 reported
  `converged`, with a mean of 6.11 passes and a maximum of 20.
- **Chain-32:** 923.4225 microseconds per solve, or 28.8570 microseconds per member. All 200
  reported `converged`, with a mean of 18.66 passes and a maximum of 53.
- **Chain-64:** 2,967.4311 microseconds per solve, or 2.9674 milliseconds per solve and 46.3661
  microseconds per member. Of 200 solves, 183 reported `converged` and 17 reported
  `iteration-cap`; the mean was 30.59 passes and the maximum was 64.
- **Tree-14:** 1,088.9650 microseconds per solve, or 1.0890 milliseconds per solve and 77.7832
  microseconds per member. Of 200 solves, 190 reported `conflicted`, 9 reported `converged`, and
  1 reported `iteration-cap`; the mean was 63.31 passes and the maximum was 64.
- **Tree-30:** 2,575.0832 microseconds per solve, or 2.5751 milliseconds per solve and 85.8361
  microseconds per member. All 200 reported `conflicted`, with a mean and maximum of 64 passes.
- **Tree-14-conflicting:** 1,068.7883 microseconds per solve, or 1.0688 milliseconds per solve
  and 76.3420 microseconds per member. This is the committed script's additional scenario and was absent
  from the stale report.
- **Constrained-8:** 97.5334 microseconds per solve, or 12.1917 microseconds per member. Of 200
  solves, 197 reported `converged` and 3 reported `limited`; the mean was 7.46 passes and the
  maximum was 64.

The fresh serial-chain readings are approximately 1.5 microseconds per member-iteration. That is
the useful scaling reading from the chain runs, not a timing guarantee: chain-8 measured 76.2351
microseconds and chain-64 measured 2.9674 milliseconds in run 1.

## Branching quality and cap findings

The feasible tree-14 and tree-30 scenarios use 20-unit segments and pose-derived goals, so every
goal set has a composed feasible pose. At the default cap, tree-14 is mostly `conflicted` at
190/200 and tree-30 is `conflicted` at 200/200. The additional `tree-14-conflicting` scenario is
also `conflicted` at 200/200. A separate seeded shape probe found that the smallest branching tree,
one shared parent with two leaves, already ends `conflicted` on 67/200 rigs.

The separate cap probe found that tree-14 at cap 10,000 ends with 94 `conflicted` and 106
`converged` results; 69 of the 94 conflicted results are exact fixed points with `moved === 0`.
Tree-30 still has 139 `conflicted` results at cap 10,000. Raising the cap from 64 to 10,000 is
about 150 times the iteration budget: it rescues about half of tree-14's default conflicted cases,
but leaves the exact fixed-point tail and most of tree-30 unresolved. The fixed-point/local-minimum
follow-up is [#490](https://github.com/chahyasantoso/motion5/issues/490).

The same cap probe separates chain behavior from branching behavior. All 17 chain-64 results that
hit the default cap converge at cap 256. This is slow serial convergence, not the tree centroid
fixed-point problem. A fixed cap for that case remains a policy decision for follow-up
[#491](https://github.com/chahyasantoso/motion5/issues/491), not phase 7 behavior.

## Run-to-run variation

Run 2 was recorded under the same reported conditions. It produced 1.9013 microseconds for two-bone,
75.8308 microseconds for chain-8, 858.2578 microseconds for chain-32, 2,863.6790 microseconds for
chain-64, 1,112.1312 microseconds for tree-14, 2,606.5190 microseconds for tree-30, 1,128.9132
microseconds for `tree-14-conflicting`, and 104.2292 microseconds for constrained-8. The corresponding
run-2 quality counts were identical to run 1.

Relative to run 1, solve timing changed by -18.3% for two-bone, -0.5% for chain-8, -7.1% for
chain-32, -3.5% for chain-64, +2.1% for tree-14, +1.2% for tree-30, +5.6% for
`tree-14-conflicting`, and +6.9% for constrained-8. Engine timing changed from 49.53 to 74.47
microseconds per rig for one rig (+50.3%), from 52.26 to 54.06 for ten (+3.4%), from 70.08 to
79.85 for 100 (+13.9%), and from 137.96 to 159.20 for 500 (+15.4%). This variance is why the
numbers are evidence about shape and scale, not release thresholds.

## Engine scenarios

- **1 rig:** load and mount took 16.88 milliseconds; a frame took 49.53 microseconds, or 49.53
  microseconds per rig.
- **10 rigs:** load and mount took 6.61 milliseconds; a frame took 522.60 microseconds, or 52.26
  microseconds per rig.
- **100 rigs:** load and mount took 44.08 milliseconds; a frame took 7,007.73 microseconds, or
  70.08 microseconds per rig.
- **500 rigs:** load and mount took 376.01 milliseconds; a frame took 68,978.51 microseconds, or
  137.96 microseconds per rig.

The one-rig result is approximately 50 microseconds per rig per frame in run 1, with 74.47
microseconds in the paired run. The larger runs show the measured publisher and runtime overhead as
rig count grows; they should not be read as an invariant cost.

## Reproduce

Run `npm run bench:ik` from the repository root, or run `node scripts/bench-ik.mjs --out <file>`
to write JSON directly. The command uses the same envelope rigs as the `EN-` tests and prints the
conditions, solve scenarios, and engine scenarios as JSON. Use a fresh report's conditions beside
any numbers copied into a review; do not compare runs while treating machine-dependent timing as a
pass/fail threshold.

The benchmark is not a CI gate. `EN-1` through `EN-4` pin the deterministic envelope, strategy
selection, finite output, and iteration behavior, while this document records wall-clock evidence.
ADR-008 keeps timing gates withdrawn because a timing result includes the machine, runtime, load,
contention, and benchmark warm-up rather than only the implementation.