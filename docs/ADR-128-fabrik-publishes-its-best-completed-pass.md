# ADR-128: A FABRIK attempt publishes its best completed pass

**Status:** Proposed, 2026-09-28, for issue [#521](https://github.com/chahyasantoso/motion5/issues/521),
above the [#519](https://github.com/chahyasantoso/motion5/issues/519) head
([ADR-127](./ADR-127-fabrik-settles-on-two-rounding-passes.md)). Amends
[ADR-126](./ADR-126-limited-fabrik-seed-side-bidirectional-limits-and-pass-budget.md).

## Context

Planar agreement probe — serial rig solved by `solveChain` and by `solveChain3d` as +z hinges — left two `atBound` disagreements after #519: seed 7 rig 978 (2D `["0","3"]`, 3D `["3"]`), seed 17 rig 2028 (2D `["1","2"]`, 3D `["1"]`). Shared `atBound` predicate not cause. Both dimensions published poses 1 to 4 degrees apart.

Cause is what attempt published when it stopped without settling. Both goals unreachable under limits; constrained iteration does not converge — orbits legal poses until limited pass ceiling. Pass-by-pass traces agree to rounding through pass 16 (seed 7) and pass 29 (seed 17 authored; pass 23 opposite seed), then separate: non-convergent orbit amplifies sub-ulp difference between 2D point arithmetic + 3D frame arithmetic. Both loops published last pass → published pose, its bound members, its residual and, through residual, selector's choice of seed side were whatever phase of orbit cap cut. On seed 17, 2D selected opposite seed (residual 12.706), 3D kept authored one (14.008). Neither answer attempt's best: best completed passes had residuals 44.774 (seed 7, pass 1, against published 54.519 + 54.547) and 12.359 (seed 17, pass 39).

Making two arithmetics byte-identical not available: 3D solver general frame solver, planar rig only its special case. Widening bound tolerance would call visibly interior angles bounded. Defect is stopping rule, and it is shared.

## Invariant

Which completed pass an attempt publishes has one owner, `FabrikIncumbent` in `fabrik-cap.ts`, used by both dimensions: first completed pass held; later pass replaces it only when its residual strictly outranks held one under `fabrikResidualOutranks`, same order selector reads within quality tier. Attempt running no pass publishes its seed as before. Published residual never worse than any completed pass of that attempt.

## Decisions

- **Best completed pass, earliest on a tie.** Pass cap is stopping decision, not fixed point → where it cuts orbit carries no information. Minimum over completed passes independent of where orbit cut. Converged attempt unchanged by construction (stops on first pass within tolerance → every earlier pass worse). Stalled serial rig publishes terminal pose to within about 3e-8 degrees; stalled tree can have passed through better pose before settling, then publishes that one.
- **The kind reads the published pass, and `stalled` reads the iteration.** Inward `spread` naming `conflicted` held with incumbent → published pose never named by another pass's disagreement (independent pass R-2 found terminal spread paired with earlier pose). `stalled` stays loop's verdict: more passes would not help — true of attempt whichever pass published.
- **The seed is never offered.** Seed not through limit-enforcing outward pass → bound bookkeeping not a published claim. Incumbent closed union `empty | held`, read exhaustively; `empty` publishes current state unchanged.
- **One residual order.** Selector's within-tier rule (`NaN` below every number, exact tie keeps held value) moved from `outranks` into `fabrikResidualOutranks` → incumbent + selector cannot disagree which of two residuals better.
- **No copies.** Both loops replace member's point + frame values rather than mutating → incumbent holds references in arrays allocated once per attempt, restores them after loop.
- **A capped baseline pays the opposite seed side.** `fabrikAlternatives` now gives `iteration-cap` same one opposite-side `centroid` attempt `limited` has. Under last-pass rule capped baseline usually published pass on a bound → read `limited`, paid that retry anyway; incumbent can sit off every bound, read `iteration-cap`, and without retry seed 7 + 17 disagreements remain (measured). Capped attempt never settled → seed side in question; opposite side only remedy selector owns. `stalled` pays nothing: fixed point. Paying retry on stalls too measured + withdrawn as unprincipled; fixed nothing more.

## Measurements (sandbox, reviewed not trusted)

- Agreement probe, eight seeds (3, 5, 7, 11, 17, 23, 29, 31) of 3,000 rigs: `atBound` + kind disagreements 2 before, 0 after; equal limited counts per seed in both dimensions.
- Pose census over those 24,000 rigs per dimension: converged attempts (721 free, 7,337 limited) byte-identical; stalled attempts move at most 3e-8 degrees (2D), 3e-10 degrees (3D); capped attempts change in 8,643 of 15,381 limited + 5 of 9 free 2D rigs (3D 8,653 + 5), by up to full turn summed over members — phase of orbit replaced. No published residual worse on any rig; largest drop 350.4.
- Identity dumps: 3D two-bone unchanged (`22b3680e`); 3D trees, 2D free + 2D limited lines move where capped or stalled, as above.
- `npm run bench:ik` equivalent (sandbox, noisy): converged chains within about 5 percent; one capped rig in 200 of `tree-14` now pays opposite attempt.

## Evidence

`TH-155` (both rigs publish no worse than best completed pass, both dimensions), `CL-40` (both rigs report identical `atBound` lists), `CL-41` (incumbent's `empty | held` rule + shared residual order) in `limited-fabrik.test.ts`; `CL-34` pins capped retry. TH-155 + CL-40 fail on #519 head, which published last pass.
