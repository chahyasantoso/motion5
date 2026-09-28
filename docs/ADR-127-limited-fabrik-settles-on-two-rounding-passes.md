# ADR-127: A limited FABRIK attempt settles on two rounding-only passes

**Status:** Proposed, 2026-09-28, for issue [#519](https://github.com/chahyasantoso/motion5/issues/519),
above `main` at `741fd5a48a317f1ab4349de89b5ac00283667541`. Extends
[ADR-126](./ADR-126-limited-fabrik-seed-side-bidirectional-limits-and-pass-budget.md).

## Context

Both FABRIK loops called an attempt `stalled` only when an outward pass moved nothing
(`moved === 0`). At one planar fixed point 2D usually lands on an exact repeat, while 3D, which
rebuilds every hinge frame from its limited angle, often circles it by an ulp for ever and runs to
the cap. Main reported `stalled` in one dimension and `iteration-cap` in the other for 35 of 23,245
limited planar rigs (eight seeds of 3,000, `tools/issue519/agreement.ts` in the handover).

## Invariant

Whether a pass leaves an attempt at a fixed point has one owner, the pass budget in
`fabrik-cap.ts`, read by both dimensions. A free attempt settles only on a pass that moved nothing,
byte for byte as before. A limited attempt also settles on the second consecutive pass in which no
tip moved more than `FABRIK_ROUNDING_ULPS = 1024` ulps of the magnitudes on its own root-to-tip path.

## Decisions

- `FabrikPassBudget.settles(relative)` sits beside `admits`, so one exhaustive switch on
  `FabrikConstraint` decides both how many passes an attempt takes and when it has stopped moving.
- `fabrikPassMovement(relative)` is a closed union `still | rounding | moving`, read by an
  exhaustive switch in each constraint's budget. Non-finite measurements are `moving`.
- `fabrikRelativeMove(moved, scale)` judges each tip against its path scale (root point, then every
  pivot and tip down to it). It is exactly zero only for a tip that did not move, so the free rule is
  provably the old `moved === 0`. A global pose extent was withdrawn: the independent pass (QP-1)
  showed an unrelated 1e12 branch stalling a small arm 7e-3 short of tolerance.
- Two consecutive rounding passes, not one: a single one is often the last step of a decay that
  ends on an exact repeat anyway, and would move many limited results by one pass for nothing.

## Measurements (sandbox, reviewed not trusted)

- Limited stalled/cap disagreements: 35 of 23,245 on main, 0 at the head.
- Free identity: 3D tree `7e3cf790`, 3D two-bone `22b3680e`, 2D free lines `964c6d7e`, unchanged.
- #514 corpora: converged counts unchanged (2D 1375, planar 1366, random-axis 328); mean passes
  fall (for example 2D 29.61 to 28.86, random-axis 57.56 to 53.73), and random-axis attempts that
  only circled noise now read `stalled` instead of `iteration-cap`.
- Threshold: the 2D rounding floor is about 1 ulp and 3D wanders up to about 600; no limited attempt
  that once moved 2^16 ulps or less later moved more than 2^24 (first revival at a 2^20 cut).
- Changed limited 2D dump lines move rotations by at most 1e-10 degrees. One 2^700-scale rig stops
  earlier, where the absolute tolerance is unreachable anyway and both residuals are negligible
  relative to the chain.

## Deliberate boundary

A free planar rig can still disagree (1 of 755 free rigs in the census, pinned in `CL-39`): 2D
circles by an ulp to the cap while 3D lands exactly. Aligning it moves free bytes, which ADR-115 and
ADR-126 promise not to do. Two `atBound` disagreements on seeds 7 and 17 are unchanged from main
and are a separate bound-reading class. A tree whose sub-base mixes very different scales may read
rounding as moving; that errs toward running on, never toward masking motion.

## Evidence

`TH-153` (three planar rigs that disagreed on main, plus the QP-1 rig) and `CL-39` (the settle rule
per constraint, the relative-move helper, the free boundary) in `limited-fabrik.test.ts`. Mutations
fail first: ignoring rounding for limited fails CL-39 and TH-153; settling on one rounding pass
fails both; settling free on rounding fails CL-39; a 1-ulp band fails TH-153.
