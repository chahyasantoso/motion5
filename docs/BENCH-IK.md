# 2D and 3D IK benchmark

This record is the measured performance envelope for the 2D `ik` and `fk` plugins in phase 7 of
[#349](https://github.com/chahyasantoso/motion5/issues/349), with the 3D solve scenarios
added in issue #500 phase 5. It records fresh runs of the committed
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

These are the phase-7 runs of 2026-09-24, taken before the #490 selector landed. Their timings and
their serial-chain and constrained quality counts describe the current solve, because #490 returns
every non-`conflicted` result unchanged; their tree quality counts are the pre-#490 baseline, and
the current tree counts are in the #490 section below.

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
  and 76.3420 microseconds per member. Its goals are seeded independently rather than taken from a
  pose, so no composed pose need satisfy them all; all 200 reported `conflicted`.
- **Constrained-8:** 97.5334 microseconds per solve, or 12.1917 microseconds per member. Of 200
  solves, 197 reported `converged` and 3 reported `limited`; the mean was 7.46 passes and the
  maximum was 64.

The fresh serial-chain readings are approximately 1.5 microseconds per member-iteration. That is
the useful scaling reading from the chain runs, not a timing guarantee: chain-8 measured 76.2351
microseconds and chain-64 measured 2.9674 milliseconds in run 1.

## 3D solve scenarios (issue #500 phase 5)

This section is a sandbox measurement, not a CI gate. It was recorded on 2026-09-26 with Node
`v22.23.1`, V8 `12.4.254.21-node.56`, `linux x64`, and `Intel(R) Xeon(R) Processor @ 2.60GHz`
with 4 cores. CI uses Node `v24.21.0`, so these numbers are not a CI or cross-machine performance
promise. Each scenario used 200 seeded rigs from `packages/core/test/support/ik3d-envelope.ts`.
Each number is the median of 7 samples, each making back-to-back calls for at least 60 ms after one
warm-up pass. Per-member figures divide the measured solve time by member count.

- **Two-bone closed form:** 0.0033559 milliseconds per solve, or 0.0016780 milliseconds per
  member. All 200 solves reported `reached`; the closed form performed zero iterative passes.
- **Chain-8:** 0.0807036 milliseconds per solve, or 0.0100880 milliseconds per member. All 200
  reported `converged`, with a mean of 6.38 passes and a maximum of 20.
- **Chain-32:** 0.8409199 milliseconds per solve, or 0.0262787 milliseconds per member. All 200
  reported `converged`, with a mean of 18.59 passes and a maximum of 55.
- **Chain-64:** 2.6227987 milliseconds per solve, or 0.0409812 milliseconds per member. All 200
  reported `converged`, with a mean of 29.27 passes and a maximum of 90.
- **Tree-14 (feasible pose-derived goals):** 3.4129669 milliseconds per solve, or 0.2437833
  milliseconds per member. Of 200 solves, 185 reported `converged`, 13 reported `conflicted`, and
  2 reported `iteration-cap`; the mean was 21.19 passes and the maximum was 64. The goals are put
  on leaf tips from one generated 3D pose, so a feasible pose exists by construction.
- **Tree-14-conflicting (independent goals):** 5.2382345 milliseconds per solve, or 0.3741596
  milliseconds per member. Of 200 solves, 191 reported `conflicted` and 9 reported `converged`; the
  mean was 61.98 passes and the maximum was 64. Its leaf goals are drawn independently inside each
  path's reach, so sibling goals need not be jointly satisfiable.

For comparison, the 2D post-#490 tree-14 envelope reports 196 `converged`, 1 `iteration-cap`, and
3 `conflicted` results out of 200. The corrected feasible 3D tree-14 is therefore materially less
successful at the default cap: 185 `converged`, 13 `conflicted`, and 2 `iteration-cap`. A brief
probe found that all 15 non-converged feasible 3D results reached 64 iterations; the 13 conflicted
results had residuals from about 0.0054 to 0.5056 units (median about 0.0160), while the two
iteration-cap results had residuals about 0.00107 and 0.00137. A separate cap probe re-solved
those 15 rigs with the minimum cap raised from 64 to 5,000 passes: all 15 reported `converged`,
after between 65 and 4,913 passes. So the difference is slow convergence that the cap cuts off,
not a local minimum the 3D solve cannot leave. The cap stays the 2D owner's rule (ADR-115) and
this phase changes no convergence behaviour; recorded in ADR-122 as a follow-up.

The benchmark JSON keeps the existing 2D `solves` and `engine` keys and adds a `solves3d` key for
these scenarios. The 3D timings are observations of this sandbox run, not a threshold or a gate.

## Branching quality and cap findings (pre-#490)

This section records the pre-#490 centroid-only solve, which is why its tree counts differ from
the issue #490 section below; it is kept because #490 was opened on this measurement. The feasible
tree-14 and tree-30 scenarios use 20-unit segments and pose-derived goals, so every goal set has a
composed feasible pose. At the default cap, tree-14 is mostly `conflicted` at 190/200 and tree-30 is
`conflicted` at 200/200. The additional `tree-14-conflicting` scenario is also `conflicted` at
200/200. A separate seeded shape probe found that the smallest branching tree, one shared parent
with two leaves, already ends `conflicted` on 67/200 rigs.

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
microseconds for `tree-14-conflicting`, and 104.2292 microseconds for constrained-8. The
corresponding run-2 quality counts were identical to run 1.

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

The benchmark is not a CI gate. `EN-1` through `EN-5` pin the deterministic envelope, strategy
selection, finite output, and iteration behavior, while this document records wall-clock evidence.
ADR-008 keeps timing gates withdrawn because a timing result includes the machine, runtime, load,
contention, and benchmark warm-up rather than only the implementation.

## Issue #490 selected and charged passes

Measured on 2026-09-25 in a sandbox on Node `v22.23.1`, with esbuild bundles of the real solver
modules and the committed envelope support module. Reviewed, not trusted: no number here has a run
in this repository's suite. The harness is `measure.mjs` with `offset-feasible.mjs`, carried as an
opaque component of the #490 handover zip rather than in the tree, so `npm run bench:ik` does not
reproduce the residual distributions, charged passes or corpora below; `EN-5` pins the envelope
quality counts at its 40-rig size. "Pre-#490" is one authored-seed attempt with the centroid rule,
which is bit-identical to the solve before #490. Residuals are the worst-leaf `quality.residual`;
median and p90 are linearly interpolated percentiles over the rigs.

Envelope, 200 rigs per scenario, quality counts, then residual median, p90 and maximum:

- tree-14: 196 `converged`, 1 `iteration-cap`, 3 `conflicted`; `3.053643233605371e-14`,
  `2.9905240654283316e-11`, `5.228793097351926`. Pre-#490: 9, 1, 190; `0.7670170117836099`,
  `3.7447892968854277`, `15.153258992928695`.
- tree-30: 139 `converged`, 61 `conflicted`; `2.5421149729252077e-13`, `1.7366946730510466`,
  `8.484869234423337`. Pre-#490: 200 `conflicted`; `2.03077423502542`, `6.95958359349667`,
  `24.069653765295488`.
- tree-14-conflicting: 200 `conflicted`; `13.444071269626964`, `24.079440405670333`,
  `32.36464863348968`. Pre-#490: 200 `conflicted`; `15.215079853683598`, `25.484389659774617`,
  `32.36464863348968`.
- The issue's minimal repro: `converged`, residual `7.944109290391274e-15`, charging 102 passes;
  pre-#490 `conflicted` at 64 passes, residual `1.2448816986307751`.

Charged passes sum `quality.iterations` over every attempt, losing candidates included: tree-14
26,806 against the pre-#490 12,663, tree-30 36,671 against 12,800, tree-14-conflicting 49,703
against 12,800. The selector strictly improved 189, 172 and 115 rigs and regressed none. Two-bone,
chain-8, chain-32, chain-64 and constrained-8 had no improvement, no regression and no identity
failure, and every rig whose pre-#490 result was not `conflicted` returned an `Object.is`-identical
result.

Feasible trees with pivot offsets, 200 rigs per shape, goals composed from one pose so an exact
solution exists, comparing the offset-exact reach circle with the first implementation's circle
centred on the child's raw tip: tree-6 converged 189 against 171, tree-14 105 against 21, tree-30
19 against 0, and tree-14 with offsets up to 15 units 40 against 18; the exact circle was strictly
better on 53, 104, 44 and 37 rigs and worse on none. The two circles are bit-identical wherever no
member has a pivot offset, which is every envelope rig above.

A deterministic 2,000-rig adversarial branching corpus (depth 2 to 6, 2 to 5 leaves, some
influences in 0.25 to 4, some joint ranges, some pivot offsets, 28% of branches with goals past
their reach, both seed sides): pre-#490 334 `converged`, 738 `conflicted`, 641 `limited`, 186
`stalled`, 101 `iteration-cap`; selected 351, 664, 697, 186 and 102. Residual median, p90 and
maximum `36.17042714751404`, `90.59913492069643`, `171.7608046099203` against the pre-#490
`36.539986202983215`, `90.6359756427425`, `171.7608046099203`; 272 rigs improved and none regressed,
charging 214,035 passes against 92,725. A 300-rig member-permutation check of that corpus was
`Object.is`-identical on every rig. These are measurements rather than timing gates.
