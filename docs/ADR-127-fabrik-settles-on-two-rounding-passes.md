# ADR-127: A FABRIK attempt settles on two rounding-only passes

**Status:** Proposed, 2026-09-28, for issue [#519](https://github.com/chahyasantoso/motion5/issues/519),
above `main` at `741fd5a48a317f1ab4349de89b5ac00283667541`. Extends
[ADR-126](./ADR-126-limited-fabrik-seed-side-bidirectional-limits-and-pass-budget.md).

## Context

Both FABRIK loops called an attempt `stalled` only when an outward pass moved nothing
(`moved === 0`). At one planar fixed point one dimension often lands on an exact repeat while the
other, by different arithmetic, circles it by an ulp for ever and runs to the cap. Main reported
`stalled` in one dimension and `iteration-cap` in the other for 35 of 23,245 limited and 1 of 755
free planar rigs (eight seeds of 3,000, `tools/issue519/agreement.ts` in the handover).

## Invariant

Whether a pass leaves an attempt at a fixed point has one owner, the pass budget in
`fabrik-cap.ts`, read by both dimensions, and one rule for every constraint: an attempt settles on a
pass that moved nothing, or on the second consecutive pass in which no tip moved more than
`FABRIK_ROUNDING_ULPS = 1024` ulps of the magnitudes on its own root-to-tip path. Only how many
passes an attempt may take (`admits`) depends on its constraint.

## Decisions

- `FabrikPassBudget.settles(relative)` sits beside `admits`, so one exhaustive switch on
  `FabrikConstraint` builds both, and both arms take the same fixed-point test, `settlesAfter`.
- `fabrikPassMovement(relative)` is a closed union `still | rounding | moving`, read by one
  exhaustive switch in `settlesAfter`. Non-finite measurements are `moving`.
- `fabrikRelativeMove(moved, scale)` judges each tip against its path scale (root point, then every
  pivot and tip down to it). It is exactly zero only for a tip that did not move, so `still` means
  no movement at all. A global pose extent was withdrawn: the independent pass (QP-1) showed an
  unrelated 1e12 branch stalling a small arm 7e-3 short of tolerance.
- Two consecutive rounding passes, not one: a single one is often the last step of a decay that
  ends on an exact repeat anyway, and would move many results by one pass for nothing.
- The free path takes the same rule (review on PR #520). The first revision kept free chains on the
  exact test to hold their bytes, pinning one free disagreement as a boundary. That was withdrawn:
  the byte promise of ADR-115 and ADR-126 is about the pass cap, not the stall test, and holding it
  here kept a wrong answer. The pinned rig (unreachable goal, reach 196.7 against 211.8) ran 64
  passes in 2D circling one ulp and reported `iteration-cap`, a claim that more passes would help,
  while publishing the pose it had after one pass; both dimensions now stall at 2 passes with the
  same residual. Nothing about a free chain makes a rounding circle a different thing from a
  limited one.

## Measurements (sandbox, reviewed not trusted)

- Stalled/cap disagreements: limited 35 of 23,245 on main, 0 at the head; free 1 of 755 on main and
  on the first revision, 0 at the head.
- Threshold: the 2D rounding floor is about 1 ulp and 3D wanders up to about 600; no limited attempt
  that once moved 2^16 ulps or less later moved more than 2^24 (first revival at a 2^20 cut). Free
  attempts show no revival past 2^24 at any cut up to 2^20 (serial planar seeds 11 and 5,
  random-axis seed 11), nor after two consecutive passes under 1,024 in 35,325 2D and 35,316 3D
  attempts over the envelope's tree scenarios.
- #514 corpora: converged counts unchanged (2D 1375, planar 1366, random-axis 328); mean passes
  fall (for example 2D 29.61 to 28.86, random-axis 57.56 to 53.73).
- Free identity corpora: 3D two-bone unchanged (`22b3680e`). 3D free trees: 674 of 1,380 lines
  move, 670 of them by at most 1e-9 degrees; 24 turn `iteration-cap` into `stalled`, all at a
  residual of 6 or more; total passes fall from 33,084 to 27,806. Four conflicted trees now publish
  the mirror compromise, whose residual is within 1e-14 of the other, because the selector's tie is
  decided at that level. 2D free lines: 130 of 1,441 move by at most 2.3e-10 degrees, 6 turn
  `iteration-cap` into `stalled`, passes fall from 42,074 to 40,308. Limited 2D lines move rotations
  by at most 1e-10 degrees; one 2^700-scale rig stops earlier, where the absolute tolerance is
  unreachable anyway.

## Deliberate boundary

Two `atBound` disagreements on seeds 7 and 17 were unchanged from main and were tracked by
[#521](https://github.com/chahyasantoso/motion5/issues/521). They are not a bound-reading defect:
the shared `atBound` rule reads a 1e-9 degree tolerance in both dimensions, and the two dimensions
published poses 1 to 4 degrees apart on those rigs.
[ADR-128](./ADR-128-fabrik-publishes-its-best-completed-pass.md) found the cause (a capped attempt published whichever pass of a non-convergent orbit the cap cut)
and removed it. A tree whose sub-base mixes very different scales may read
rounding as moving; that errs toward running on, never toward masking motion.

## Evidence

`TH-153` (three limited and one free planar rig that disagreed on main, plus the QP-1 rig) and
`CL-39` (one settle rule for both constraints, the relative-move helper, the movement union) in
`limited-fabrik.test.ts`. Mutations fail first: ignoring rounding fails CL-39 and TH-153; settling
on one rounding pass fails both; returning free to the exact test fails CL-39 and TH-153; a 1-ulp
band fails TH-153.
