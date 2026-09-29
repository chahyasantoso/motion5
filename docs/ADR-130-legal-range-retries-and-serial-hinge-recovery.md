# ADR-130: Staged legal-range retries and a legal serial hinge recovery for 3D FABRIK

**Status:** Accepted, 2026-09-29, for [#527](https://github.com/chahyasantoso/motion5/issues/527)
through [PR #528](https://github.com/chahyasantoso/motion5/pull/528), on `main` at `08f656f`.

## Context

[ADR-129](./ADR-129-legal-joint-space-seed-for-3d-hinges.md) seeds a non-planar hinge in legal
joint space, which lifted the reachable-by-construction random-axis corpus (N=2000, seed 7,
1,802 constrained rigs whose goals are the FK image of a legal pose) from 339 to 521 converged.
The remaining 1,281 misses were diagnosed as seed-basin traps and legal-pose geometry FABRIK does
not find, not as unreachable goals: every goal is reachable by construction. A longer pass cap
was measured and withdrawn in #514; it buys cost, not basins.

## Decision and invariant

Two owners, one each for the two remedies, and nothing else moves.

**Staged legal-range starts, owned by the selector.** `fabrik-seed.ts` owns the closed attempt
seed union `FabrikSeed = default | legal-range(fraction)` with `LegalSeedFraction = 0.1 | 0.25 |
0.75 | 0.9`. `fabrik-select.ts` owns the order as data, `LEGAL_RANGE_STAGES = [[0.25, 0.75],
[0.1], [0.9]]`, gated by the exhaustive `legalRangeRetries(quality)`: only a `limited` or
`iteration-cap` baseline pays, only when its residual is within 2% of the reach of the addressed
paths that carry a non-planar hinge (`legalRetryReach3d`), and a later stage runs only while no
candidate has converged. The ceiling is six attempts including the baseline and its opposite
side. Every prescribed candidate is ranked by the existing converged-first, lower-residual rule,
and an exact tie keeps the earlier candidate. 2D, planar 3D, free, converged, stalled and
conflicted rigs pay exactly what they paid before. `ik3d-constraint.ts` builds the legal local at
a fraction (`legalLocal3d`); the centre keeps the bytes of ADR-129's default legal seed.

**Legal serial recovery, owned by `ik3d-serial-recovery.ts`.** After a constrained tree solve
misses, `solveSerialRecovery3d` may answer a single-leaf serial chain of two to five zero-offset
members whose first member is free and whose others are free or non-planar hinges with finite
ranges. The chain splits into free-led blocks; with hinge angles fixed each block is one rigid
vector, and the free leaders orient those vectors independently, so the goal is attainable
exactly when its distance lies in the polygon interval of the block lengths. A lone one-hinge
block has a closed-form angle; otherwise a bounded search (nested legal grids of at most 7^4
samples, a 48-step bisection along a bracketing joint-space segment, and a coordinate search when
no grid brackets) proposes candidates. **Invariant:** a recovery publishes `reached` only for a
pose whose every hinge angle lies in its authored range, whose hinge locals survive the rendered
Euler round trip and the shared limit projection (`renderedLegalHinge3d`), and whose rendered FK
tip meets the goal within `FABRIK_TOLERANCE`. Anything else returns `undefined` and the caller
keeps its tree result byte for byte. A converged tree result is never replaced.

`ik3d-solve.ts` reads the two arms separately: `tree` takes the tree solve, `constrained` takes
the tree solve and, only on a miss, the recovery. The load-time `derivedStrategy` stays
conservative: it names the iterative strategy, because the recovery depends on live values.

## Alternatives withdrawn

A longer pass cap (#514: cost without basins). Unrestricted legal quartiles (121,663 extra
iterations for the recoveries the 2% band buys with 26,615). A second iterative algorithm such as
CCD (a second owner for the same question). Separate recovery functions per shape, which the
first slices had: one module now owns basis, validation, grids, rendering and the result. A frozen
shared identity in the recovery's hot loops, which deoptimized the shared matrix helpers for every
caller and doubled tree-solve time on the corpus.

## Evidence and boundary

On the fixed corpus the branch meets 1,802 of 1,802: 595 `converged` and 1,207 `reached`; all
recovered poses were independently recomposed through `fk3d` with hinge projector agreement, worst
FK residual about 2.5e-5 against a 1e-3 tolerance. An 8,000-rig legal-pose fuzz (rolled roots,
two to five members) has zero misses and zero false or illegal publishes. TH-160 through TH-180
pin the policy, ordering, cost exclusions, reproductions and refusal shapes. All required CI
checks passed on the PR head. The search is finite, so this is not a completeness proof for
arbitrary rigs: offsets, branches, cones, swing-twist, constrained first members and more than
five members stay with FABRIK's answer. Mixed-sign serial chains are
[#524](https://github.com/chahyasantoso/motion5/issues/524), a separate record.

**Refined by [ADR-131](./ADR-131-centred-legal-start-for-mixed-sign-chains.md), 2026-09-29.** Every legal stage, the first included, now runs only while no candidate has converged. Addressed 2D and planar 3D constrained rigs pay a centre after two unresolved arc sides, then up to four off-centre starts for near misses (seven attempts in all); non-planar 3D retains its separately gated staged policy. The historical exclusions and iteration costs above describe the original #527 corpus, not this subsequent planar extension.
