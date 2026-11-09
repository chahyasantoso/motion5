# ADR-127: A FABRIK attempt settles on two rounding-only passes

**Status:** Proposed, 2026-09-28, for issue [#519](https://github.com/chahyasantoso/motion5/issues/519),
above `main` at `741fd5a48a317f1ab4349de89b5ac00283667541`. Extends
[ADR-126](./ADR-126-limited-fabrik-seed-side-bidirectional-limits-and-pass-budget.md).

## Context

Both FABRIK loops called an attempt `stalled` only when an outward pass moved nothing
(`moved === 0`). At one planar fixed point one dimension often lands on exact repeat while the
other, by different arithmetic, circles it by an ulp for ever, runs to cap. Main reported
`stalled` in one dimension and `iteration-cap` in the other for 35 of 23,245 limited and 1 of 755
free planar rigs (eight seeds of 3,000, `tools/issue519/agreement.ts` in handover).

## Invariant

Whether a pass leaves an attempt at fixed point has one owner, the pass budget in
`fabrik-cap.ts`, read by both dimensions, and one rule for every constraint: attempt settles on a
pass that moved nothing, or on second consecutive pass in which no tip moved more than
`FABRIK_ROUNDING_ULPS = 1024` ulps of the magnitudes on its own root-to-tip path. Only how many
passes an attempt may take (`admits`) depends on its constraint.

## Decisions

- `FabrikPassBudget.settles(relative)` sits beside `admits` → one exhaustive switch on
  `FabrikConstraint` builds both; both arms take same fixed-point test, `settlesAfter`.
- `fabrikPassMovement(relative)` closed union `still | rounding | moving`, read by one
  exhaustive switch in `settlesAfter`. Non-finite measurements are `moving`.
- `fabrikRelativeMove(moved, scale)` judges each tip against its path scale (root point, then every
  pivot and tip down to it). Exactly zero only for tip that did not move → `still` means
  no movement at all. Global pose extent withdrawn: independent pass (QP-1) showed unrelated 1e12
  branch stalling small arm 7e-3 short of tolerance.
- Two consecutive rounding passes, not one: single one often last step of decay ending on exact
  repeat anyway, would move many results by one pass for nothing.
- Free path takes same rule (review on PR #520). First revision kept free chains on exact test to
  hold their bytes, pinning one free disagreement as boundary. Withdrawn: byte promise of
  ADR-115 and ADR-126 about pass cap, not stall test; holding it here kept wrong answer. Pinned rig
  (unreachable goal, reach 196.7 against 211.8) ran 64 passes in 2D circling one ulp, reported
  `iteration-cap`, a claim that more passes would help, while publishing pose it had after one
  pass; both dimensions now stall at 2 passes with same residual. Nothing about free chain makes a
  rounding circle different thing from limited one.

## Measurements (sandbox, reviewed not trusted)

- Stalled/cap disagreements: limited 35 of 23,245 on main, 0 at head; free 1 of 755 on main and
  on first revision, 0 at head.
- Threshold: 2D rounding floor about 1 ulp, 3D wanders up to about 600; no limited attempt
  that once moved 2^16 ulps or less later moved more than 2^24 (first revival at 2^20 cut). Free
  attempts show no revival past 2^24 at any cut up to 2^20 (serial planar seeds 11 and 5,
  random-axis seed 11), nor after two consecutive passes under 1,024 in 35,325 2D and 35,316 3D
  attempts over envelope's tree scenarios.
- #514 corpora: converged counts unchanged (2D 1375, planar 1366, random-axis 328); mean passes
  fall (for example 2D 29.61 to 28.86, random-axis 57.56 to 53.73).
- Free identity corpora: 3D two-bone unchanged (`22b3680e`). 3D free trees: 674 of 1,380 lines
  move, 670 by at most 1e-9 degrees; 24 turn `iteration-cap` into `stalled`, all at residual of
  6 or more; total passes fall from 33,084 to 27,806. Four conflicted trees now publish mirror
  compromise, residual within 1e-14 of the other, because selector's tie is decided at that level.
  2D free lines: 130 of 1,441 move by at most 2.3e-10 degrees, 6 turn
  `iteration-cap` into `stalled`, passes fall from 42,074 to 40,308. Limited 2D lines move rotations
  by at most 1e-10 degrees; one 2^700-scale rig stops earlier, where absolute tolerance is
  unreachable anyway.

## Deliberate boundary

Two `atBound` disagreements on seeds 7 and 17 unchanged from main, tracked by
[#521](https://github.com/chahyasantoso/motion5/issues/521). Not a bound-reading defect:
shared `atBound` rule reads 1e-9 degree tolerance in both dimensions, and two dimensions
published poses 1 to 4 degrees apart on those rigs.
[ADR-128](./ADR-128-fabrik-publishes-its-best-completed-pass.md) found cause (capped attempt published whichever pass of non-convergent orbit cap cut)
and removed it. Tree whose sub-base mixes very different scales may read
rounding as moving; errs toward running on, never toward masking motion.

## Evidence

`TH-153` (three limited and one free planar rig that disagreed on main, plus QP-1 rig) and
`CL-39` (one settle rule for both constraints, relative-move helper, movement union) in
`limited-fabrik.test.ts`. Mutations fail first: ignoring rounding fails CL-39 and TH-153; settling
on one rounding pass fails both; returning free to exact test fails CL-39 and TH-153; 1-ulp
band fails TH-153.
