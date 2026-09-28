# ADR-128: A FABRIK attempt publishes its best completed pass

**Status:** Proposed, 2026-09-28, for issue [#521](https://github.com/chahyasantoso/motion5/issues/521),
above the [#519](https://github.com/chahyasantoso/motion5/issues/519) head
([ADR-127](./ADR-127-fabrik-settles-on-two-rounding-passes.md)). Amends
[ADR-126](./ADR-126-limited-fabrik-seed-side-bidirectional-limits-and-pass-budget.md).

## Context

The planar agreement probe (a serial rig solved by `solveChain` and by `solveChain3d` as +z hinges)
left two `atBound` disagreements after #519: seed 7 rig 978 (2D `["0","3"]`, 3D `["3"]`) and
seed 17 rig 2028 (2D `["1","2"]`, 3D `["1"]`). The shared `atBound` predicate was not the cause.
Both dimensions published poses 1 to 4 degrees apart.

The cause is what an attempt published when it stopped without settling. Both goals are
unreachable under the limits, and the constrained iteration does not converge: it orbits legal
poses until the limited pass ceiling. Pass-by-pass traces agree to rounding through pass 16
(seed 7) and pass 29 (seed 17 authored; pass 23 for the opposite seed), then separate, because a
non-convergent orbit amplifies the sub-ulp difference between 2D point arithmetic and 3D frame
arithmetic. Both loops published the last pass, so the published pose, its bound members, its
residual and, through the residual, the selector's choice of seed side were whatever phase of the
orbit the cap cut. On seed 17 that made 2D select the opposite seed (residual 12.706) while 3D kept
the authored one (14.008). Neither answer was the attempt's best: the best completed passes had
residuals 44.774 (seed 7, pass 1, against the published 54.519 and 54.547) and 12.359 (seed 17,
pass 39).

Making the two arithmetics byte-identical is not available: the 3D solver is a general frame solver
and a planar rig is only its special case. Widening the bound tolerance would call visibly interior
angles bounded. The defect is the stopping rule, and it is shared.

## Invariant

Which completed pass an attempt publishes has one owner, `FabrikIncumbent` in `fabrik-cap.ts`,
used by both dimensions: the first completed pass is held, and a later pass replaces it only when
its residual strictly outranks the held one under `fabrikResidualOutranks`, the same order the
selector reads within a quality tier. An attempt that runs no pass publishes its seed as before.
The published residual is therefore never worse than any completed pass of that attempt.

## Decisions

- **Best completed pass, earliest on a tie.** A pass cap is a stopping decision, not a fixed point,
  so where it cuts an orbit carries no information. The minimum over completed passes does not
  depend on where the orbit was cut. A converged attempt is unchanged by construction (it stops on
  its first pass within tolerance, so every earlier pass was worse). A stalled serial rig publishes
  its terminal pose to within about 3e-8 degrees, but a stalled tree can have passed through a
  better pose before it settled, and then publishes that one.
- **The kind reads the published pass, and `stalled` reads the iteration.** The inward `spread`
  that names `conflicted` is held with the incumbent, so a published pose is never named by another
  pass's disagreement (independent pass R-2 found terminal spread paired with an earlier pose).
  `stalled` stays the loop's verdict: it says more passes would not help, which is true of the
  attempt whichever of its passes is published.
- **The seed is never offered.** It has not been through a limit-enforcing outward pass, so its
  bound bookkeeping is not a published claim. The incumbent is a closed union `empty | held`, read
  exhaustively; `empty` publishes the current state unchanged.
- **One residual order.** The selector's within-tier rule (`NaN` below every number, an exact tie
  keeps the held value) moved from `outranks` into `fabrikResidualOutranks`, so the incumbent and
  the selector cannot disagree about which of two residuals is better.
- **No copies.** Both loops replace a member's point and frame values rather than mutating them, so
  the incumbent holds references in arrays allocated once per attempt and restores them after the
  loop.
- **A capped baseline pays the opposite seed side.** `fabrikAlternatives` now gives
  `iteration-cap` the same one opposite-side `centroid` attempt `limited` has. With the last-pass
  rule a capped baseline usually published a pass on a bound, so it read `limited` and paid that
  retry anyway; the incumbent can sit off every bound and read `iteration-cap`, and without the
  retry the seed 7 and 17 disagreements remain (measured). A capped attempt never settled, so its
  seed side is in question, and the opposite side is the only remedy the selector owns. `stalled`
  still pays nothing: it is a fixed point. Paying the retry on stalls too was measured and withdrawn
  as unprincipled; it fixed nothing more.

## Measurements (sandbox, reviewed not trusted)

- Agreement probe, eight seeds (3, 5, 7, 11, 17, 23, 29, 31) of 3,000 rigs: `atBound` and kind
  disagreements 2 before, 0 after, with equal limited counts per seed in both dimensions.
- Pose census over those 24,000 rigs per dimension: converged attempts (721 free, 7,337 limited)
  are byte-identical; stalled attempts move by at most 3e-8 degrees (2D) and 3e-10 degrees (3D);
  capped attempts change in 8,643 of 15,381 limited and 5 of 9 free 2D rigs (3D 8,653 and 5), by up
  to a full turn summed over members, which is the phase of the orbit being replaced. No published
  residual got worse on any rig; the largest drop is 350.4.
- Identity dumps: 3D two-bone unchanged (`22b3680e`); 3D trees, 2D free and 2D limited lines move
  where they were capped or stalled, as above.
- `npm run bench:ik` equivalent (sandbox, noisy): converged chains within about 5 percent; one
  capped rig in 200 of `tree-14` now pays the opposite attempt.

## Evidence

`TH-155` (both rigs publish no worse than their best completed pass, in both dimensions), `CL-40`
(both rigs report identical `atBound` lists) and `CL-41` (the incumbent's `empty | held` rule and
the shared residual order) in `limited-fabrik.test.ts`; `CL-34` now pins the capped retry. TH-155
and CL-40 fail on the #519 head, which published the last pass.
