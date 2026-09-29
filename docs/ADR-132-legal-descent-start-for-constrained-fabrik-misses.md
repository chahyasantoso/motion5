# ADR-132: A legal descent start finishes constrained FABRIK misses

**Status:** Accepted, 2026-09-29, for [#524](https://github.com/chahyasantoso/motion5/issues/524)
through [PR #529](https://github.com/chahyasantoso/motion5/pull/529), above `main` at
`1b04ac7`.

## Context

The prior head's `tools/issue524/classify.ts` found that every remaining mixed-sign miss it
classified—30 2D rigs and 35 planar 3D rigs—was reachable and was not a local minimum. The
published FABRIK poses were bound-projection fixed points: their normalised projected gradient over
the legal joint box was 0.02 to 0.98. A box-projected damped least-squares walk from the legal
centre reached 30/30 2D misses and 34/35 planar 3D misses. The missing remedy was a legal walk,
not another arc side or a larger FABRIK pass cap.

## Decision and invariant

`ik-descent.ts` owns one dimension-free bounded Levenberg–Marquardt walk. In dual form its step is
`-Jᵀ(JJᵀ+λI)⁻¹m`, with an active-set box for legal joint coordinates, one-sided finite-difference
Jacobians through each owner's composition, and monotone accepted steps only. Damping is measured
in `(reach·π/180)²`, so planar 2D and planar 3D take the same path. The walk has
`LEGAL_DESCENT_STEPS = 64` and `LEGAL_DESCENT_TOLERANCE = 1e-4`, one tenth of
`FABRIK_TOLERANCE`. Its end pose seeds one ordinary FABRIK attempt: FABRIK remains the only
publisher.

`FabrikSeed` adds `legal-descent`, and `LegalSeed` is the closed seed union. Only the descent
attempt uses `heldFromSeed`: after its first outward pass it holds the seeded pose as the first
incumbent under [ADR-128](./ADR-128-fabrik-publishes-its-best-completed-pass.md). Thus FABRIK cannot
publish a completed pass worse than the legal walk's pose. `fabrik-seed.ts` owns the 2D `seedLegal`
construction. `ik3d-seed.ts` owns the 3D construction through the discriminated `Dof3d = hinge |
tilt` union: a hinge uses its angle, while other members use two tilts about local +y and +z and
are rebuilt through `swing+limitLocal3d`. `ik-constraint.ts` owns `turnRotation` and
`rotationSide`; their range clamp is continuous, and a full-circle range is free.

The selector reads `LegalStarts = none | centre | centre-then-descent | staged(reach)` exhaustively
in `legalStages`. Every stage runs only while no candidate has converged.

- Arc-seeded constrained rigs—all 2D and planar 3D rigs, plus a non-planar hinge path whose
  pole-side default arc is legal—run baseline, opposite, centre and descent, for a ceiling of four
  attempts. The q25/q75/q10/q90 offsets recorded by [ADR-131](./ADR-131-centred-legal-start-for-mixed-sign-chains.md)
  are withdrawn for these rigs; the descent supersedes them.
- `staged(reach)` remains for the non-planar path whose default seed is already the legal centre.
  A baseline-gated near miss within 2% of the addressed reach runs ADR-130's quartiles and then the
  descent, for a ceiling of seven attempts. A distant miss pays the descent stage alone, with a
  ceiling of three. `centre` remains unchanged when there is no addressed extent.

A held descent pose must also remain numerically composable. Near a half turn,
`frame3d.ts`'s `swingFrame3d` computes `f = (1-c)/|v|²` when `1+cos` is below `1e-3`, rather than
using `1/(1+c)`. The latter amplified rounding into a frame about `1e-9` from orthonormal when a
free member was nearly antiparallel to its rest; the resulting published residual disagreed with
independent FK by `2.3e-8` in TH-84.

## Alternatives withdrawn

More FABRIK seeds or quartiles are withdrawn: the classifier identified a legal descent direction,
and more fixed-point samples add cost without owning that direction. CCD is a second iterative owner
for the same miss and is withdrawn. An analytic Jacobian per owner duplicates each owner's
composition and would make the dimension-free descent two algorithms. Trace-relative damping is
withdrawn because it makes the 2D and planar 3D paths depend on their differing trace histories;
damping in reach-angle units keeps their walk shared.

## Evidence and boundary

On the Node 22 sandbox shim corpus (N=2000 per dimension, seed 7; reviewed evidence, not CI),
mixed 2D converged `422 -> 452/452`, and planar 3D `460 -> 495/495`. Limited 2D converged
`1678 -> 1771/1771`, and limited planar 3D `1693 -> 1789/1789`. Random-axis 3D converged
`771 -> 1568/2000`; its mixed subset converged `175 -> 410/452`. `badPublished` stayed zero in
every dimension. Baseline identity checked 1,036 changed rows and found zero baseline-converged rigs
moved.

The same run counted limited attempts and summed their iterations as follows: 2D `3300 -> 3218`
attempts and `112708 -> 101293` iterations; planar 3D `3306 -> 3226` and `114133 -> 102494`;
random-axis 3D `4082 -> 4880` and `225974 -> 226038`. These are sandbox measurements, not CI
latency claims. TH-194 through TH-196 cover descent legality, agreement, classifier regressions and
the held seed; TH-197 through TH-199 cover the descent kernel. Updated TH-160, TH-174, TH-183,
TH-185 through TH-191, TH-193, TH-169, TH-173, TH-177, TH-178 and TH-180 cover selector cost,
seed legality, serial recovery and the tree-solve regressions. TH-84 covers the half-turn frame fix.

This is not a completeness proof. Random-axis 3D still has non-converged mixed rigs, and those
remaining cases were not classified by `classify.ts`. The corpus will be rerun on final code, and
wall time has not been measured in CI.

## Follow-up boundary

The descent is bounded, active-set and monotone; it does not turn FABRIK into a general constrained
optimizer. Keep the random-axis mixed rigs as the next classification and recovery boundary, and
keep end-to-end wall-time measurement separate from the sandbox attempt and iteration counts.
