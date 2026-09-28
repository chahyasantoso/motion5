# ADR-126: Limited FABRIK seed-side recovery, bidirectional limits and a progress-gated pass budget

**Status:** Accepted, 2026-09-27, through [#518](https://github.com/chahyasantoso/motion5/pull/518)
for issue [#514](https://github.com/chahyasantoso/motion5/issues/514), above `main` at
`1084ba674170042c0c20f16139dd5530e0304545`.

## Context

[ADR-123](./ADR-123-3d-joint-limits.md) deliberately left two behaviours shared by 2D and 3D
FABRIK for a later cross-dimensional fix. A one-way bound at the straight seed side could hold a
reachable chain at a local fixed point. A limited chain could also keep moving toward a reachable
goal while the free-chain cap stopped it a few thousandths short. The two symptoms had one owner:
the iterative solve's seed, constraint enforcement and work budget, not the public quality union.

The smallest reproductions made the first failure concrete. A one-way elbow range `[0, 90]` ended
`limited` at a residual of `141.42` units, and `[10, 90]` ended `limited` at `153.21`, while the
opposite `flip` converged. Near-miss rigs ended `iteration-cap` a few thousandths short at the
free cap of 64 passes. A fix must preserve the unconstrained path, must not turn every limited miss
into a four-attempt search, and must make extra work answerable from the attempt's measured
progress.

## Invariant

A limited FABRIK attempt may recover from a seed-side bound without changing the authored bend on a
successful or unrelated result. Inward and outward passes both preserve every declared limit, and
an attempt takes extra passes only when a finite, strictly decreasing residual projects tolerance
before its limited ceiling. A free attempt keeps the prior cap predicate and its bytes. The
selector, constraint arithmetic, cap policy, seed geometry and bound bookkeeping each have one
owner, shared by 2D and 3D where the contract is shared.

## Decisions

- **The selector is a closed quality decision in `fabrik-select.ts`.** `fabrikAlternatives(quality)`
  uses an exhaustive switch over the iterative quality union. `conflicted` keeps its three recorded
  alternatives; `limited` pays for exactly one opposite-seed retry with the `centroid` rule; and
  `converged`, `stalled` and `iteration-cap` pay nothing. `outranks` is unchanged. ADR-128 later
  gave `iteration-cap` the same opposite-seed retry, once an attempt published its best completed
  pass rather than its last. The baseline is
  still selected first, so the retry can win only under the existing quality tier and residual rule.

- **Limits are bidirectional.** `boundBaseDirection` in `ik-constraint.ts` and
  `boundBaseFrame3d` in `ik3d-constraint.ts` are the two dimensional owners of the same inward
  rule. Each is used by its inward pass only for a base with limited children: hold the child's
  legal direction or frame, then move the base to the nearest legal local limit. The outward pass
  remains the owner of length enforcement and the final legal pose. A free child or a base with no
  limited child does not pay for this work.

- **The cap has an explicit free/limited union.** `fabrik-cap.ts` owns
  `fabrikIterationCap(depth, "free" | "limited")`. The free result is the ADR-115 depth-scaled
  cap. The limited result is `FABRIK_LIMITED_CAP_FACTOR = 4` times that free cap, and four is a
  ceiling rather than an unconditional allowance.

- **The pass budget gates the limited ceiling.** `fabrikPassBudget` gives free chains the exact
  `iterations < cap` predicate, byte-identical to the old free path. A limited chain takes the free
  cap, then checks progress in windows of `FABRIK_PROGRESS_WINDOW = 8` passes. It continues only
  while the residual is finite, strictly decreasing over the window, and its geometric rate
  projects reaching tolerance inside the remaining 4x ceiling. `projectsConvergence` is total over
  every double: a residual inside tolerance, zero included, has arrived, and a fall from a
  non-finite `before`, or any `NaN`, measures no rate and projects nothing. The bare logarithms
  read `Infinity -> 1` as instant convergence and `1 -> 0` as `NaN` (independent pass finding
  RV-1); the loop asks only while the residual is finite and above tolerance, so neither arm moves
  a solve, and `CL-36` pins both.

- **Two-dimensional bound witnesses use the enforced angle.** `limitTip` records `atBound` from
  the bounded angle it actually enforced, matching the 3D limit record. This removes a 2D/3D
  disagreement caused by re-deriving an angle from rounded positions after enforcement.

- **One bound tolerance serves both dimensions.** `JOINT_BOUND_TOLERANCE = 1e-9` degrees is owned
  by `atBound` in `ik-constraint.ts`, and the 3D cone swing reads the same constant. An angle a few
  ulps inside a bound rests on it in both dimensions. Without it, 51 of 3,000 fuzzed planar rigs
  reported a different quality kind in 2D and 3D from ulp-level bound reads (RV-2); with it, none
  do. `CL-38` pins it.

- **A legal limited child leaves its base where it was, in both dimensions.** `limitHinge` rebuilds
  a hinge's local from the limited angle even in range, because the outward pass must not publish a
  tilt off the hinge, so `boundBaseFrame3d` answered `moved` for every legal hinge child and the 3D
  inward pass re-placed the pivot for a turn of a few ulps, where `boundBaseDirection` returns the
  base it was given. A rebuilt local within `INWARD_FRAME_TOLERANCE = 1e-12` per entry of the
  proposal now answers `unmoved`. The planar agreement census fell from 7 to 2 mismatches of 3,000,
  every converged count held, and `TH-152` pins it.

- **The seed owns its geometry.** `fabrik-seed.ts` is the pure home of the 2D arc seed and its
  half-angle arithmetic. The move is intentionally behavior-preserving; it keeps `fabrik.ts`
  within the read budget and gives the seed question a single owner rather than changing the seed.

## Measurements

The following sandbox measurements were reviewed, not trusted; the tests and CI run are the
acceptance evidence. The corpus used `N=2000` and `SEED=7` limited rigs.

- In 2D, converged rigs rose from `556` to `961` after the opposite-seed retry, to `1241` after
  inward enforcement, and to `1341` with the plain 4x cap, out of `1771`. Near-miss
  `iteration-cap` results fell from `70` to `52`.
- In planar 3D +z hinges, converged rigs rose from `604` to `1018`, `1275` and `1371`, out of
  `1789`, across those same stages. Random-axis 3D hinges rose from `55` to `92`, `254` and
  `345`, out of `1802`.
- Testing cap factors 2, 4 and 8 added `47`, `100` and `109` converged 2D rigs. Four is the knee,
  not a claim that 8 is free: the progress-gated budget produced `1329` 2D, `1366` planar 3D and
  `328` random-axis 3D converged rigs, versus `1341`, `1371` and `345` with the plain 4x ceiling.
- Replaying recorded residual traces with windows 4, 8, 16 and 32 put the results within two rigs
  of one another. Eight is the selected window: it is long enough not to let one noisy pass decide
  and short enough to stop a crawl.
- The plain 4x cap failed CI run
  [36316422522](https://github.com/chahyasantoso/motion5/actions/runs/36316422522) at commit
  `8826e6a` on `TH-84` (`ik3d-constraint.test.ts`): Vitest exceeded its 5 second timeout,
  taking 7.5 seconds instead of 1.3. Its `TH-84` corpus charged `44,968` passes instead of
  `17,098`. With the progress-gated budget it charged `17,459` passes, took 929 ms instead of
  the 778 ms base, and found 106 converged rigs instead of 63 in the base and 107 with plain 4x.
- The constrained-8 benchmark changed from `197` to `200` converged solves, from `92.7` to
  `109.4` microseconds per solve, and from a maximum of `64` to `157` iterations under plain 4x.
  The budgeted policy keeps the quality recovery without charging every crawling miss.
- At the #518 head with every fix above, the same corpus converged `1375` 2D, `1366` planar 3D and
  `328` random-axis 3D rigs, out of `1771`, `1789` and `1802`. The planar agreement census over
  3,000 seeded rigs (`tools/issue514/planar-agreement.ts` in the handover) left 2 mismatches, both
  `stalled` in 2D against `iteration-cap` in 3D, the class `main` already shows on 2 to 4 rigs.
  The benchmark figures are in [BENCH-IK](./BENCH-IK.md).
- Unconstrained identity remains exact: the 3D tree hash is `7e3cf790`, the 3D two-bone hash is
  `22b3680e`, and the 2D free lines hash to `964c6d7e` on both sides (the untagged whole 2D dump
  of `main` is `7e514e48`).

## What is withdrawn

The plain 4x cap is withdrawn. It spent all 256 passes on a limited miss and did so twice when the
opposite-seed retry ran, including crawling misses with no evidence that the ceiling would reach
tolerance. That cost caused the `TH-84` timeout and made the constrained corpus 4.7 times slower.
The 4x value remains the limited ceiling, but `fabrikPassBudget` now gates access to its extra
passes by projected progress.

## Evidence

- `CL-31` through `CL-38` and `TH-147` through `TH-152` in `limited-fabrik.test.ts` cover selector
  ownership, retries, bidirectional enforcement, cap selection, projection, bound witnesses, the
  shared bound tolerance and the legal-child inward answer.
  `SD-20`, `FB-21`, `EN-3` and `TH-73` were updated for the shared identity and cap contracts.
- Mutation checks are failing-first: removing the selector fails `CL-31`, `CL-34`, `CL-35` and
  `TH-147`; removing the inward bound fails `CL-35` and `TH-151`; a 1x cap fails `CL-32` and
  `TH-148`; removing projection fails `CL-36` and `TH-84`; removing the 2D bound witness fails
  `CL-37`; and removing the inward frame tolerance fails `TH-152`.
- CI run [36317988227](https://github.com/chahyasantoso/motion5/actions/runs/36317988227) at
  commit `70e5882` found six `TS2339` errors in `limited-fabrik.test.ts`: the test read
  `quality.iterations` from the whole `SolveQuality` union. The fix is one exhaustive
  `iterationsOf` helper in `test/support/solve-quality.ts`; it also replaced two private copies in
  the `ik-envelope` and `ik3d-envelope` tests.
- The unchanged free-path hashes above are the identity evidence. The sandbox corpus and timing
  figures are reviewed observations; the pull request's CI run is the evidence of record.

## Consequences

Limited chains can recover a reachable goal when the authored seed starts on a forbidden side, and
near-miss progress no longer buys a full second attempt at an unconditional 4x cost. A limited
quality still reports its residual and bound members honestly when the geometric projection says the
ceiling will not reach tolerance. Free chains, unconstrained 2D output and unconstrained 3D output
retain their previous path and bytes.

Mixed-sign chains still reach local optima: the 2D mixed subset rose from `41` to `182` converged
rigs out of `452`, not all the way to the envelope. Random-axis hinges also remain poor at about
19% converged, because a hinge whose axis is not the seed bend plane's normal is seeded outside its
plane, making both seed sides illegal; an authored pole in the hinge plane works around it. Those
are follow-ups, not claims of universal constrained convergence.

The exact `moved === 0` stall test this record left as a follow-up is resolved by
[ADR-127](./ADR-127-fabrik-settles-on-two-rounding-passes.md) (issue #519) for every constraint.
The free bytes this record holds are the pass cap's; the stall test is ADR-127's, and it moves
free rigs that circled their fixed point by rounding.
