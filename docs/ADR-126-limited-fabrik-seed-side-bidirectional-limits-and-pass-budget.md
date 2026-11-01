# ADR-126: Limited FABRIK seed-side recovery, bidirectional limits and a progress-gated pass budget

**Status:** Accepted, 2026-09-27, through [#518](https://github.com/chahyasantoso/motion5/pull/518)
for issue [#514](https://github.com/chahyasantoso/motion5/issues/514), above `main` at
`1084ba674170042c0c20f16139dd5530e0304545`.

## Context

[ADR-123](./ADR-123-3d-joint-limits.md) deliberately left two behaviours shared by 2D and 3D FABRIK for later
cross-dimensional fix. One-way bound at straight seed side could hold reachable chain at local fixed point. Limited
chain could also keep moving toward reachable goal while free-chain cap stopped it few thousandths short. Two symptoms,
one owner: iterative solve's seed, constraint enforcement, work budget — not public quality union.

Smallest reproductions made first failure concrete. One-way elbow range `[0, 90]` ended `limited` at residual `141.42`
units, `[10, 90]` ended `limited` at `153.21`, opposite `flip` converged. Near-miss rigs ended `iteration-cap` few
thousandths short at free cap of 64 passes. Fix must preserve unconstrained path, not turn every limited miss into
four-attempt search, make extra work answerable from attempt's measured progress.

## Invariant

Limited FABRIK attempt may recover from seed-side bound without changing authored bend on successful or unrelated
result. Inward and outward passes both preserve every declared limit; attempt takes extra passes only when finite,
strictly decreasing residual projects tolerance before its limited ceiling. Free attempt keeps prior cap predicate and
its bytes. Selector, constraint arithmetic, cap policy, seed geometry, bound bookkeeping each one owner, shared by 2D
and 3D where contract shared.

## Decisions

- **Selector closed quality decision in `fabrik-select.ts`.** `fabrikAlternatives(quality)` exhaustive switch over
  iterative quality union. `conflicted` keeps three recorded alternatives; `limited` pays exactly one opposite-seed
  retry with `centroid` rule; `converged`, `stalled`, `iteration-cap` pay nothing. `outranks` unchanged. ADR-128 later
  gave `iteration-cap` same opposite-seed retry, once attempt published best completed pass not its last. Baseline
  still selected first → retry wins only under existing quality tier and residual rule.

- **Limits bidirectional.** `boundBaseDirection` in `ik-constraint.ts`, `boundBaseFrame3d` in `ik3d-constraint.ts` = two
  dimensional owners of same inward rule. Each used by inward pass only for base with limited children: hold child's legal
  direction or frame, move base to nearest legal local limit. Outward pass stays owner of length enforcement and final
  legal pose. Free child or base with no limited child pays nothing for this work.

- **Cap explicit free/limited union.** `fabrik-cap.ts` owns `fabrikIterationCap(depth, "free" | "limited")`. Free result =
  ADR-115 depth-scaled cap. Limited = `FABRIK_LIMITED_CAP_FACTOR = 4` times free cap, four ceiling not unconditional
  allowance.

- **Pass budget gates limited ceiling.** `fabrikPassBudget` gives free chains exact `iterations < cap` predicate,
  byte-identical to old free path. Limited chain takes free cap, then checks progress in windows of
  `FABRIK_PROGRESS_WINDOW = 8` passes. Continues only while residual finite, strictly decreasing over window, geometric
  rate projects reaching tolerance inside remaining 4x ceiling. `projectsConvergence` total over every double: residual
  inside tolerance, zero included, arrived; fall from non-finite `before`, any `NaN`, measures no rate, projects nothing.
  Bare logarithms read `Infinity -> 1` as instant convergence, `1 -> 0` as `NaN` (independent pass finding RV-1); loop
  asks only while residual finite and above tolerance → neither arm moves solve, `CL-36` pins both.

- **Two-dimensional bound witnesses use enforced angle.** `limitTip` records `atBound` from bounded angle actually
  enforced, matching 3D limit record. Removes 2D/3D disagreement from re-deriving angle from rounded positions after
  enforcement.

- **One bound tolerance both dimensions.** `JOINT_BOUND_TOLERANCE = 1e-9` degrees owned by `atBound` in
  `ik-constraint.ts`, 3D cone swing reads same constant. Angle few ulps inside bound rests on it both dimensions.
  Without it, 51 of 3,000 fuzzed planar rigs reported different quality kind in 2D and 3D from ulp-level bound reads
  (RV-2); with it, none. `CL-38` pins.

- **Legal limited child leaves base where it was, both dimensions.** `limitHinge` rebuilds hinge's local from limited
  angle even in range — outward pass must not publish tilt off hinge → `boundBaseFrame3d` answered `moved` for every legal
  hinge child, 3D inward pass re-placed pivot for turn of few ulps, where `boundBaseDirection` returns base given. Rebuilt
  local within `INWARD_FRAME_TOLERANCE = 1e-12` per proposal entry answers `unmoved`. Planar agreement census fell 7 → 2
  mismatches of 3,000, every converged count held, `TH-152` pins.

- **Seed owns geometry.** `fabrik-seed.ts` pure home of 2D arc seed + half-angle arithmetic. Move intentionally
  behavior-preserving: keeps `fabrik.ts` within read budget, gives seed question single owner rather than changing seed.

## Measurements

Sandbox measurements reviewed not trusted; tests and CI run acceptance evidence. Corpus `N=2000`, `SEED=7` limited rigs.

- 2D: converged rigs `556` → `961` after opposite-seed retry, → `1241` after inward enforcement, → `1341` with plain 4x
  cap, out of `1771`. Near-miss `iteration-cap` fell `70` → `52`.
- Planar 3D +z hinges: converged `604` → `1018`, `1275`, `1371` out of `1789` across same stages. Random-axis 3D hinges
  `55` → `92`, `254`, `345` out of `1802`.
- Cap factors 2, 4, 8 added `47`, `100`, `109` converged 2D rigs. Four the knee, not claim 8 free: progress-gated budget
  produced `1329` 2D, `1366` planar 3D, `328` random-axis 3D converged versus `1341`, `1371`, `345` with plain 4x ceiling.
- Replaying recorded residual traces with windows 4, 8, 16, 32 put results within two rigs of one another. Eight selected:
  long enough one noisy pass does not decide, short enough to stop crawl.
- Plain 4x cap failed CI run [36316422522](https://github.com/chahyasantoso/motion5/actions/runs/36316422522) at commit
  `8826e6a` on `TH-84` (`ik3d-constraint.test.ts`): Vitest exceeded 5 second timeout, 7.5 seconds instead of 1.3. Its
  `TH-84` corpus charged `44,968` passes instead of `17,098`. With progress-gated budget charged `17,459`, took 929 ms
  against 778 ms base, found 106 converged rigs against base's 63 and plain 4x's 107.
- Constrained-8 benchmark: `197` → `200` converged solves, `92.7` → `109.4` microseconds per solve, max iterations `64` →
  `157` under plain 4x. Budgeted policy keeps quality recovery without charging every crawling miss.
- At #518 head with every fix above, same corpus converged `1375` 2D, `1366` planar 3D, `328` random-axis 3D out of
  `1771`, `1789`, `1802`. Planar agreement census over 3,000 seeded rigs (`tools/issue514/planar-agreement.ts` in
  handover) left 2 mismatches, both `stalled` in 2D against `iteration-cap` in 3D — class `main` already shows on 2 to 4
  rigs. Benchmark figures in [BENCH-IK](./BENCH-IK.md).
- Unconstrained identity exact: 3D tree hash `7e3cf790`, 3D two-bone hash `22b3680e`, 2D free lines hash `964c6d7e` both
  sides (untagged whole 2D dump of `main` = `7e514e48`).

## What is withdrawn

Plain 4x cap withdrawn. Spent all 256 passes on limited miss, twice when opposite-seed retry ran, including crawling
misses with no evidence ceiling would reach tolerance. That cost caused `TH-84` timeout, made constrained corpus 4.7
times slower. 4x value remains limited ceiling; `fabrikPassBudget` now gates access to extra passes by projected progress.

## Evidence

- `CL-31` through `CL-38`, `TH-147` through `TH-152` in `limited-fabrik.test.ts` cover selector ownership, retries,
  bidirectional enforcement, cap selection, projection, bound witnesses, shared bound tolerance, legal-child inward
  answer. `SD-20`, `FB-21`, `EN-3`, `TH-73` updated for shared identity and cap contracts.
- Mutation checks failing-first: removing selector fails `CL-31`, `CL-34`, `CL-35`, `TH-147`; removing inward bound fails
  `CL-35`, `TH-151`; 1x cap fails `CL-32`, `TH-148`; removing projection fails `CL-36`, `TH-84`; removing 2D bound witness
  fails `CL-37`; removing inward frame tolerance fails `TH-152`.
- CI run [36317988227](https://github.com/chahyasantoso/motion5/actions/runs/36317988227) at commit `70e5882` found six
  `TS2339` in `limited-fabrik.test.ts`: test read `quality.iterations` from whole `SolveQuality` union. Fix = one
  exhaustive `iterationsOf` helper in `test/support/solve-quality.ts`; also replaced two private copies in `ik-envelope`
  and `ik3d-envelope` tests.
- Unchanged free-path hashes above = identity evidence. Sandbox corpus and timing figures reviewed observations; pull
  request's CI run evidence of record.

## Consequences

Limited chains recover reachable goal when authored seed starts on forbidden side; near-miss progress no longer buys full
second attempt at unconditional 4x cost. Limited quality still reports residual and bound members honestly when geometric
projection says ceiling will not reach tolerance. Free chains, unconstrained 2D and unconstrained 3D output retain previous
path and bytes.

Mixed-sign chains still reach local optima: 2D mixed subset `41` → `182` converged of `452`, not to envelope. Random-axis
hinges remain poor ~19% converged: hinge whose axis is not seed bend plane's normal seeded outside its plane, both seed
sides illegal; authored pole in hinge plane works around it. Follow-ups, not claims of universal constrained convergence.

Exact `moved === 0` stall test this record left as follow-up resolved by
[ADR-127](./ADR-127-fabrik-settles-on-two-rounding-passes.md) (issue #519) for every constraint. Free bytes here are pass
cap's; stall test ADR-127's, moving free rigs that circled fixed point by rounding.
