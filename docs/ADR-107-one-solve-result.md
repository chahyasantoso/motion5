# ADR-107: One solve result for every IK strategy

**Amended by [ADR-108](./ADR-108-constrained-2d-solving.md) and [ADR-109](./ADR-109-opt-in-solve-inspection.md).**

**Status:** Accepted, 2026-09-24. Issue [#349](https://github.com/chahyasantoso/motion5/issues/349)
phase 2, squash-merged from [#483](https://github.com/chahyasantoso/motion5/pull/483) as `c03c6b19`.
Phase 3 is [ADR-108](./ADR-108-constrained-2d-solving.md).

**Amended by [ADR-110](./ADR-110-goal-influence-and-conflict-policy.md), 2026-09-24.** The
closed `SolveQuality` union has nine kinds, adding `conflicted`, and every `SolveResult` carries
per-leaf `residuals`. Inspection projects that record alongside `quality`; the one-result invariant
and the existing quality fields remain.

## Invariant

Every IK solve strategy returns one `SolveResult`, and `solveChain` returns it from both arms of its dispatch. A `SolveResult` carries `rotations`, the only half anything publishes, and `quality`, one flat closed `SolveQuality` union read exhaustively, whose every variant carries `residual`, the world-unit distance the composed tip is left from the goal. `plugins/ik-result.ts` is the single owner of both types. Nothing new is published: every rig publishes the same doubles, the same keys in the same order and the same frozen records, and throws the same messages, as it did on `main` at `95bef276`.

## Why

ADR-106 split the solve into one owner per question and left one question with two shapes. "Did this solve reach its goal" had an answer on the iterative path (`FabrikConvergence`, beside `rotations` on `FabrikSolution`) and no answer on the closed-form path, which returned a bare rotations record. A caller that wanted it had to know which strategy the dispatcher had picked, which is the dispatch decision ADR-106 gave one owner leaking back out. Phase 3 (constrained solving) and phase 4 (opt-in inspection) both need to read how well a solve answered, so the shape is settled first and alone.

## Decisions (taken, not asked)

**One flat union, not a nested `{ strategy, quality }`.** Seven kinds: `reached`, `too-far`, `too-near` and `coincident` from the closed form, and `converged`, `stalled` and `iteration-cap` from FABRIK. A caller reads one discriminant, and a `switch` ending in `unreachable` is exhaustive over every answer any strategy gives. A nested strategy tag would be two reads and would let the tag disagree with the kind beside it. The family is recoverable from the kind, and `IR-7` pins that each strategy answers only from its own. See ADR-092.

**Per-strategy subsets are `Extract`s, not second unions.** `ClosedFormQuality` and `IterativeQuality` are derived from `SolveQuality`, so a kind has one declaration. `solveTwoBone` returns `SolveResult<ClosedFormQuality>` and `FabrikSolution` extends `SolveResult<IterativeQuality>`, so each strategy's own callers keep a narrow type and `solveChain` widens without a cast.

**`residual` on every variant.** A caller that only wants the miss reads it without a `switch`. The kind says why the miss is what it is.

**The closed form states its residual; it does not measure it.** Its angles are exact inside the reach band, so the residual is the clamp's own `|d - clampedD|`: zero inside the band, the distance to the nearer bound outside it. `IR-6` holds that statement to the miss `fk`'s own composition (`composeWorld`, called twice per bone as `fk.compose` does) measures over a seeded sample, so the stated residual cannot become a second convention.

**One reach band serves every exit.** The degenerate exits need no band of their own: with extents already clamped to zero, `[|reach - l2|, reach + l2]` is exactly `[reach, reach]` when the second segment has no extent and `[l2, l2]` when the link has none. `IR-5` pins both collapsed bands.

**`coincident` is the one geometric miss inside the band.** A goal on the chain's own base with `reach === l2` clamps to distance zero and has no direction to aim at, so the closed form answers with the rest pose (unchanged from ADR-106) and the residual is where that pose leaves the tip. `IR-4` pins it.

**A non-finite goal is reported as the geometry it is, never laundered.** An infinite goal is directional: its distance is past every finite outer bound, so it reads as `too-far` with an infinite residual, and the angles still aim along the finite direction `atan2` finds for it. A `NaN` goal, or a `NaN` extent, compares false against both bounds and reads as `reached` with a `NaN` residual beside `NaN` angles, so `residual <= tolerance` is false for it. `IR-9` pins both. Adding an `invalid` kind was considered and rejected, because it would be a second validation owner for input `readFrame` already defines, and a kind nothing can produce from a loaded rig. The first draft of this record said every non-finite goal reads as `reached`; the independent quality pass on the pull request measured `+Infinity` reading as `too-far`, and the record was corrected to the behaviour rather than the behaviour to the record, because forcing `reached` would hide a direction the solve does state.

**`convergence` is renamed `quality` and `FabrikConvergence` is deleted, not aliased.** The iterative kinds moved into `ik-result.ts` with the iteration count only they can state. A second name for one type is a second owner.

**`solveChain` passes quality through and drops `pivots` and `tips`.** Those are FABRIK's own; returning them from the dispatcher would make the result's shape a function of arity. `ik.ts` destructures `rotations` and publishes nothing else, so `FB-9` and `FB-13` hold unchanged. ADR-051's reasoning for not publishing convergence per tick stands; phase 4 owns whether an authored opt-in may.

**Withdrawn again: a shared `reachBand`.** ADR-106 deferred it to this phase if the reachability report needed the band on both paths. It does not: FABRIK reports what its iteration did, not a band, and a branching chain with several goals has no single band to report. The band keeps one caller, the closed form.

**Withdrawn: FABRIK reachability kinds.** Reporting `too-far` from FABRIK would need a per-goal reach bound on a tree, which is phase 5's goal policy rather than this record's shape. `stalled` already distinguishes an unreachable goal from a slow chain, which is the distinction a caller acts on.

## Found, and left to its own issue

`fk.compose` reads an authored `length` raw, while both solves clamp it through `segmentExtent`, so a negative length composes a backwards segment in `fk` and a zero-extent one in the solve. ADR-106's invariant line says `segmentExtent` owns the clamp "for `fk` and both solves alike"; that holds for `effectiveLink` and not for `fk.compose`. Fixing it moves `fk`'s published positions for such rigs, which this record's invariant forbids, so it is [#482](https://github.com/chahyasantoso/motion5/issues/482). `IR-6` draws lengths non-negative for exactly that reason, and `IR-10` pins the solve's half of it without composing: a negative authored length answers exactly as a zero one does.

## Evidence

`packages/core/test/unit/plugins/ik-result.test.ts`, `IR-1` to `IR-10`, registered in `docs/acceptance-map.json` and gated by `evidence-case-ids.test.ts`. The migrated `IK-*`, `FB-*`, `PV-*` and `WT-*` cases read `.rotations` and `.quality` with every numeric assertion unchanged. Published byte identity was measured by composing 200,000 seeded random rigs through `ikPlugin` built from `main` and from this change, with rotations compared under `Object.is` plus key order, freezing and thrown messages; the result and script are in the pull request body.

## Consequences

Constrained solving (phase 3) returns this record from its new `ChainShape` arm and reports a limit-clamped miss as a kind of its own, which fails to compile at every exhaustive reader until it is answered. Opt-in inspection (phase 4) has one record to project rather than two.

**Amended by [ADR-109](./ADR-109-opt-in-solve-inspection.md), 2026-09-24.** The invariant above still holds for every unopted rig. An author who writes the static `inspect: true` on a solver opts into one extra `inspection` output, the fixed-shape projection of this record's `quality`; its rotations are unchanged bit for bit. Two sentences above are therefore read with their amendments: the union has eight kinds rather than seven, because ADR-108 added `limited`, and "publishes nothing else" holds for an unopted rig only.

**Amended by [ADR-110](./ADR-110-goal-influence-and-conflict-policy.md), 2026-09-24.** Read the
union and result shape above with ADR-110's additions: there are now nine kinds, including
`conflicted`, and `SolveResult` carries per-leaf `residuals`; inspection projects that record.
