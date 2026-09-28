# ADR-129: Seed non-planar hinges in legal joint space

**Status:** Proposed, 2026-09-28, for [#523](https://github.com/chahyasantoso/motion5/issues/523)
above [PR #526](https://github.com/chahyasantoso/motion5/pull/526).

## Context

The 3D constant-curvature seed aims in the goal/pole plane, not the plane swept by an arbitrary
hinge. On the reachable #514 random-axis corpus, the #521 base converged 339 of 1,802 limited
rigs. The initial legal-seed implementation converged about 521. A direction alone does not prove
a full hinge pose legal: an authored rest roll can leave its +x direction on the hinge circle but
change the orientation of an offset descendant. The first outward pass rebuilds that pose.

## Decision and invariant

`ik3d-seed.ts` is the single owner of the 3D tree's initial tips. Its closed `arc | legal` union is
read exhaustively. Preserve the historic arc when every hinge's proposed local frame fixes its
axis and points on its swept circle. A hinge's angular range is not part of this classification:
a planar arc can exceed a range and still be worth projecting without abandoning its plane.
`ik3d-constraint.ts` owns the hinge-pose predicate and the legal centre of each constrained joint;
`ik-constraint.ts` owns the shared range centre.

If an arc needs a hinge-pose projection, start each limited member at the centre of its legal set
and turn addressed free subtrees toward their mean aims. The opposite seed is a half turn about
the aim line at each topmost addressed free member; an all-limited tree has no opposite legal pose.
Planar +z rigs keep the original arc and remain numerically consistent with 2D. This rule does
not claim global convergence: FABRIK can remain in a local minimum or orbit even from legal seeds.

The exported frozen identity rotation remains immutable. Internal swing/twist arithmetic instead
uses an ordinary private identity array so V8's hot matrix multiply/transpose sees a consistent
array map. This is a representation fix, not a second public identity contract.

## Alternatives and consequences

Using the last arbitrary arc for all hinges is cheaper but starts some attempts outside joint
space. Choosing the legal seed whenever any joint's range is exceeded changes planar behavior and
conflates angular bounds with a three-dimensional pose defect. Starting limited joints at the
range minimum adds a bound bias; the centre preserves room on both sides. Broadening FABRIK's
retry search to many seeds adds work without solving the remaining local minima: the seven-seed
prototype converged only 720 of 1,802 rigs. A per-pass `--trace-deopt` test would depend on V8
internals, so it stays an investigation probe rather than a normal CI assertion.

## Evidence and boundary

TH-156 failed first on the on-circle but rolled arbitrary-axis case (`arc` instead of `legal`);
TH-157 checks planar and off-circle selection, and TH-158 checks constrained centres. The
TH-84 corpus is the published-pose legality and timeout regression. In the attached sandbox
(Node 22 and a vitest shim, not CI), 521 of 1,802 random-axis limited rigs converged, 1,366
planar 3D and 1,375 2D limited rigs converged, with type errors no greater than the 43 recorded
baseline errors. TH-84 ran under the 5-second shim timeout during parallel IK execution. The
non-planar misses remain a separate follow-up, not a claim that the seed is globally optimal.
