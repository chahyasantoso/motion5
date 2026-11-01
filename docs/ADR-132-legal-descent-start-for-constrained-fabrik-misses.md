# ADR-132: A legal descent start finishes constrained FABRIK misses

**Status:** Accepted, 2026-09-29, for [#524](https://github.com/chahyasantoso/motion5/issues/524)
through [PR #529](https://github.com/chahyasantoso/motion5/pull/529), above `main` at
`1b04ac7`.

## Context

Prior head's `tools/issue524/classify.ts` found every remaining mixed-sign miss it classified (30 2D
rigs, 35 planar 3D rigs) reachable and not a local minimum. Published FABRIK poses were bound-projection
fixed points: normalised projected gradient over legal joint box 0.02 to 0.98. A box-projected damped
least-squares walk from legal centre reached 30/30 2D misses and 34/35 planar 3D misses. Missing remedy
was a legal walk, not another arc side or a larger FABRIK pass cap.

## Decision and invariant

`ik-descent.ts` owns one dimension-free bounded Levenberg–Marquardt walk. In dual form its step is
`-Jᵀ(JJᵀ+λI)⁻¹m`, with an active-set box for legal joint coordinates, one-sided finite-difference
Jacobians through each owner's composition, monotone accepted steps only. Damping measured in
`(reach·π/180)²` → planar 2D and planar 3D take same path. Walk has `LEGAL_DESCENT_STEPS = 64` and
`LEGAL_DESCENT_TOLERANCE = 1e-4`, one tenth of `FABRIK_TOLERANCE`. Its end pose seeds one ordinary
FABRIK attempt: FABRIK remains the only publisher.

`FabrikSeed` adds `legal-descent`, `LegalSeed` is the closed seed union. Only the descent attempt uses
`heldFromSeed`: after its first outward pass it holds seeded pose as first incumbent under
[ADR-128](./ADR-128-fabrik-publishes-its-best-completed-pass.md). FABRIK therefore cannot publish a
completed pass worse than the legal walk's pose. `fabrik-seed.ts` owns 2D `seedLegal` construction.
`ik3d-seed.ts` owns 3D construction through discriminated `Dof3d = hinge | tilt` union: a hinge uses its
angle, other members use two tilts about local +y and +z, rebuilt through `swing+limitLocal3d`.
`ik-constraint.ts` owns `turnRotation` and `rotationSide`; their range clamp is continuous, a full-circle
range is free.

Selector reads `LegalStarts = none | centre | centre-then-descent | staged(reach) |
staged-then-descent(reach)` exhaustively in `legalStages`. No later stage starts once a candidate
converged; seeds inside one stage (a quartile pair) all run. Only a `limited` or `iteration-cap` baseline
pays legal stages at all: a `conflicted` baseline pays its three recorded alternatives and nothing more →
the ceilings below count the baseline and its opposite side. Descent paid only when every addressed goal
lies within its own path's extent of root (`goalsWithinReach`, necessary condition for any pose to meet
it): a walk toward an unreachable goal cannot converge, so `-then-descent` kinds are chosen only inside
that envelope, and `arcLegalStarts(reach, withinReach)` is the one arc-rig rule both dimensions call.

- Arc-seeded constrained rigs (all 2D and planar 3D rigs, plus a non-planar hinge path whose pole-side
  default arc is legal) run baseline, opposite, centre and descent — ceiling of four attempts; outside
  the reach envelope they stop after the centre. The q25/q75/q10/q90 offsets recorded by
  [ADR-131](./ADR-131-centred-legal-start-for-mixed-sign-chains.md) are withdrawn for these rigs; the
  descent supersedes them.
- `staged-then-descent(reach)` is the non-planar path whose default seed is already legal centre and
  whose goals are inside the envelope. A baseline-gated near miss within 2% of addressed reach runs
  ADR-130's quartiles then the descent — ceiling of seven attempts. A distant miss pays the descent stage
  alone, ceiling three. Outside the envelope same path reads `staged(reach)`, keeping ADR-130's meaning:
  quartiles for a near miss, else nothing. `centre` unchanged when there is no addressed extent.

A held descent pose must also stay numerically composable. Near a half turn, `frame3d.ts`'s
`swingFrame3d` computes `f = (1-c)/|v|²` when `1+cos` is below `1e-3`, rather than using `1/(1+c)`. The
latter amplified rounding into a frame about `1e-9` from orthonormal when a free member was nearly
antiparallel to its rest; resulting published residual disagreed with independent FK by `2.3e-8` in
TH-84. On TH-200's 400-point sweep of `1+cos` from `1e-8` to `1e-3` the old form leaves a frame `1.1e-11`
from orthonormal and misplaces +x in the twelfth decimal; new one stays within `8.9e-16`. TH-200 fails on
the old form. Swings outside the band keep their bytes.

## Alternatives withdrawn

More FABRIK seeds or quartiles withdrawn: classifier identified a legal descent direction, more
fixed-point samples add cost without owning that direction. CCD is a second iterative owner for the same
miss, withdrawn. An analytic Jacobian per owner duplicates each owner's composition and would make the
dimension-free descent two algorithms. Trace-relative damping withdrawn: it makes 2D and planar 3D paths
depend on their differing trace histories; damping in reach-angle units keeps their walk shared.

## Evidence and boundary

Final head re-measured on Node 22 sandbox shim (N=2000 per dimension, seed 7, the #514
reachable-by-construction generator through production `solveChain` and `solveChain3d`; reviewed
evidence, not CI) against `main` at `1b04ac7`. Converged counts, `main -> head`:

- 2D: all `1428 -> 1824/2000`, limited `1375 -> 1771/1771`, mixed-sign `187 -> 452/452`.
- Planar 3D: all `1427 -> 1850/2000`, limited `1366 -> 1789/1789`, mixed-sign `202 -> 495/495`.
- Random-axis 3D: FABRIK-converged `771 -> 1568/2000`, mixed-sign `175 -> 410/452`. Every other
  random-axis rig is `reached` by legal serial hinge recovery of ADR-130 (residual at most `1.25e-4`), on
  `main` and on this head → descent moves 797 rigs from recovery to FABRIK rather than turning a miss
  into a hit.
- `badPublished` (a `converged` pose failing independent FK or limit legality) zero in every dimension on
  both sides.

Every limited rig of corpus now meets its goal in every dimension. One corpus row does not: 2D rig 1959,
a free chain capped at 64 passes with residual `0.032`; its row is byte-identical on `main`, so outside
this record's constrained-chain question.

Identity against pre-descent head `a74e51f`: 1,088 corpus rows changed, 45 of them rigs whose single
baseline attempt already converged. With only `frame3d.ts` reverted, all 45 are byte-identical to the
pre-descent head → they move through the half-turn band alone. That band changes 64 rows in total (41
planar 3D, 23 random-axis, no 2D row), every one `converged -> converged` and by at most `4.4e-7` in
residual. Legal-start policy itself moves no rig its baseline already meets.

Attempts and summed iterations on limited rigs (`COST=1`; deterministic counts, not timings), from
pre-descent head `a74e51f` retained with the descent checkpoint's evidence to this head re-measured: 2D
`3300 -> 3218` attempts, `112708 -> 101293` iterations; planar 3D `3306 -> 3226` and `114133 -> 102357`;
random-axis 3D `4082 -> 4880` and `225974 -> 226046`. Random-axis pays more attempts because 308 rigs now
run the seven-attempt staged path before recovery; its iterations flat. Sandbox measurements, not CI
latency claims. TH-194 through TH-196 cover descent legality, agreement, classifier regressions and the
held seed; TH-197 through TH-199 cover the descent kernel; TH-200 covers the half-turn frame. Updated
TH-160, TH-174, TH-183, TH-185 through TH-191, TH-193, TH-169, TH-173, TH-177, TH-178 and TH-180 cover
selector cost, seed legality, serial recovery and the tree-solve regressions.

Not a completeness proof: corpus is reachable by construction → measures seed and search failures, not
diagnosis of unreachable goals, which the envelope gate and existing `limited` kind own.

## Follow-up boundary

Descent is bounded, active-set, monotone; it does not turn FABRIK into a general constrained optimizer.
Serial recovery stays owner for random-axis rigs FABRIK does not converge; end-to-end wall-time
measurement stays separate from sandbox attempt and iteration counts.
