# ADR-113: 2D IK envelope and documentation

**Status:** Accepted, 2026-09-24. Issue [#349](https://github.com/chahyasantoso/motion5/issues/349)
phase 7, read against `main` at `7c9ffc3afc7c9fbfb813df7573d8cf0ad7dcbbf6` after PR #488
merged. The phase-7 slice is in review; this record states the accepted contract and its evidence,
not a claim that the review has merged.

## Context

2D solve has complete numerical and lifecycle contract; implementation evidence spread across envelope fixtures, user
guide, diagnostics guide, stability ADR. Benchmark without named rig owner could drift from tests; documentation silently
inventing duration gate turns machine-specific observation into false compatibility promise. Phase 7 closes
documentation and ownership gaps without adding solver owner.

Public reader also needs one coherent convention: DOM adapter's screen coordinates, solver's local angles, renderer's
scale, runtime's load/edit/seek lifecycle must say same thing. Decision about envelope and its record, not new runtime
behavior.

## Invariant

One owner answers each envelope question. `test/support/ik-envelope.ts` owns named rigs, scenario shapes. `EN-1` through
`EN-4` execute those rigs, pin shape, strategy, quality, finite output, iteration behavior — not elapsed time.
`scripts/bench-ik.mjs` measures same rigs, owns only repeatable measurement procedure. `docs/BENCH-IK.md` records one
report's conditions and results. No benchmark fixture may become second behavioral oracle.

Guide's coordinate convention: +x right, +y down, degrees, positive rotation clockwise on screen. One-to-one with DOM
adapter: same numeric frame written `translate3d(x, y, 0)`, `rotate(rotation deg)`. On mathematical y-up axes same positive
number appears counter-clockwise; motion5 does not silently convert.

Solve reads world position, rotation, lengths, pivot offsets, limits, goals. Reads no scale — solver frame has no scale
field. Draw rig larger/smaller: scale container holding rig. Uniform container scale preserves pose; nonuniform changes
appearance of angles, not solver geometry. Scaling individual bone element changes that drawing only, not solved child tip.

Loaded or mounted rig publishes nothing until real operation. Value edit recomposes existing graph; goal edit topology
edit; removing member seeds derived solver that read it. Solve has no warm state → reverse and random seeks reproduce
forward bytes.

## Decision

Envelope rigs one owner in `test/support/ik-envelope.ts`. Benchmark imports those fixtures, does not rebuild similar
chains. `EN` executable evidence for shapes and bounds, not duration assertion. Guide examples executable `GE-1` through
`GE-5` cases → execute guide's own conventions and lifecycle claims, as ADR-095 requires.

Closed-form two-bone path measured separately from FABRIK. FABRIK useful fresh serial-chain reading ~1.5 microseconds per
member-iteration on recorded machine; numbers observations not API guarantees. Branching outcomes reported `conflicted`
when centroid compromise remains outside tolerance and witness shows branch disagreement. Name does not claim no pose
exists.

Numerical scale policy stays ADR-111's. Native finite inputs read without scene scaling. Above `2 ** 500` finite
world-unit magnitude, solve uses exact power-of-two image, restores residuals to world units, rotations unchanged.
Infinite goal coordinate = direction on every strategy, `NaN` goal coordinate refuses solve by name (ADR-111, amendment of
2026-09-25, #489); any other `NaN` stays visible, not laundered into plausible finite answer. Absolute FABRIK tolerance
stays `0.001` world units.

Lifecycle record intentionally cross-linked not duplicated as new runtime rule. Load and mount do not seed publication.
Member value writes invalidate dependants without graph rebuild; goal additions/removals edit graph; derived solver
membership makes member removal seed solver. Pure solve carries no previous frame into next.

## Measurements

Section = phase-7 record, taken before #490; its tree quality counts pre-#490 baseline, dated #490 section below states
current. Paired benchmark reports recorded 2026-09-24 with Node `v22.23.1`, V8 `12.4.254.21-node.56`, `linux x64`, Intel
(R) Xeon(R) Processor @ 2.60GHz, 4 cores. Each solve scenario 200 rigs. Each number median of 7 samples, each sample
back-to-back calls at least 60 ms after one warm-up pass. Machine had no deliberate heavy work, other agents may have run
tests. Run 1 primary report in [BENCH-IK.md](./BENCH-IK.md), run 2 paired variance check.

Run 1: 2.3257 microseconds two-bone closed form, 76.2351 chain-8, 923.4225 chain-32, 2,967.4311 chain-64. Chain-64 183
`converged`, 17 `iteration-cap`. Tree-14 1,088.9650 microseconds with 190 `conflicted`, 9 `converged`, 1 `iteration-cap`;
tree-30 2,575.0832 with all 200 `conflicted`; `tree-14-conflicting` 1,068.7883 with all 200 `conflicted`. Constrained-8
97.5334 with 197 `converged`, 3 `limited`. Engine cost 49.53 microseconds per rig for one rig, 52.26 ten, 70.08 100,
137.96 500.

Run 2 kept every quality count identical. Solve timings 1.9013, 75.8308, 858.2578, 2,863.6790, 1,112.1312, 2,606.5190,
1,128.9132, 104.2292 microseconds same scenario order. Versus run 1: -18.3%, -0.5%, -7.1%, -3.5%, +2.1%, +1.2%, +5.6%,
+6.9%. Engine per-rig +50.3%, +3.4%, +13.9%, +15.4% for 1, 10, 100, 500 rigs. Spread = evidence timings machine
observations, not gates.

Separate feasible-tree probe: same seeded 200-rig tree-14/tree-30 populations, 20-unit segments, pose-derived goals. Cap
10,000: tree-14 94 `conflicted`, 106 `converged`; 69 of 94 conflicted exact fixed points `moved === 0`. Tree-30 still 139
`conflicted`. Smallest branching tree (one shared parent, two leaves) already 67 `conflicted` of 200. Cap 64 → 10,000 ≈150
times work: fixes about half tree-14's default conflicts, leaves exact fixed points and most of tree-30. Fixed-point /
local-minimum behavior tracked by [#490](https://github.com/chahyasantoso/motion5/issues/490).

Same probe: all 17 chain-64 results hitting default cap converge at cap 256 — slow serial convergence, different cause from
tree centroid fixed points. Choosing fixed cap for that behavior tracked by
[#491](https://github.com/chahyasantoso/motion5/issues/491), not decided in phase 7.

## Issue #490 measurement (2026-09-25)

#490 selector (ADR-110) changes envelope's tree scenarios, nothing else. Seeded 200-rig envelope, sandbox with esbuild
bundles of real modules on Node `v22.23.1` (reviewed, not trusted; no run in this repository's suite): tree-14 reports 196
`converged`, 1 `iteration-cap`, 3 `conflicted` where pre-#490 solve reported 9, 1, 190; tree-30 139 `converged`, 61
`conflicted` where it reported 200 `conflicted`; tree-14-conflicting remains 200 `conflicted`. Selector strictly improved
189, 172, 115 of those rigs, regressed none. Two-bone, chain-8, chain-32, chain-64, constrained-8 `Object.is`-identical to
pre-#490 solve on every rig as direct-return gate requires, likewise every tree rig whose pre-#490 result was not
`conflicted`. Cost paid only by conflicted rigs: summing `quality.iterations` over every attempt, tree-14 charges 26,806
passes against pre-#490 12,663, tree-30 36,671 against 12,800, tree-14-conflicting 49,703 against 12,800. `EN-5` pins
envelope's quality counts at 40-rig test size, [BENCH-IK.md](./BENCH-IK.md) carries residual distributions. Harness that
produced them carried with #490 handover, not committed → reviewed evidence `npm run bench:ik` does not reproduce.

## Withdrawn

**Raising iteration cap withdrawn as phase-7 policy.** Cap 10,000 (~150 times default iteration budget): tree-14 improves
190 default conflicted → 94, but 69 of those 94 exact `moved === 0` fixed points, tree-30 still 139 conflicted. Centroid
compromise needs algorithmic follow-up, tracked by
[#490](https://github.com/chahyasantoso/motion5/issues/490). 17 chain-64 cap hits all converge at cap 256, but choosing new
fixed cap separate policy decision tracked by [#491](https://github.com/chahyasantoso/motion5/issues/491), not phase-7
change.

**Timing gates withdrawn.** Timing threshold makes CI depend on host CPU, runtime, load, contention, benchmark warm-up.
Deterministic `EN` cases are gate; `BENCH-IK.md` and `npm run bench:ik` measurement and reproduction records only, as
ADR-008 requires.

**Second envelope fixture withdrawn.** Recreating rigs in benchmark or guide makes shape evidence and measured shape
disagree. Support module single owner; GE cases consume guide's printed examples rather than replacing them with hidden
fixtures.

## Consequences

Consumers read one explicit DOM-compatible coordinate convention and one scale policy without assuming renderer scale
changes solver geometry. Maintainers reproduce measurements, see exactly which results machine-specific. Future solver or
3D seam states own shape owner and evidence instead of extending 2D benchmark by implication.

Benchmark intentionally not release threshold. Slower or faster machine produces different number while same EN behavior
stays valid. Change to deterministic envelope must update owning fixtures, EN evidence, this record's measured conditions
together.

## Evidence

`EN-1` through `EN-5` in `packages/plugins/test/integration/ik-envelope.test.ts` cover strategy selection, finite output,
independent rigs, iteration envelope. `GE-1` through `GE-5` in `packages/plugins/test/integration/ik-guide-examples.test.ts`
execute JSON examples in guide. Benchmark uses same support module, reproduced `npm run bench:ik`. Recorded numbers and
full scenario fields in [BENCH-IK.md](./BENCH-IK.md). Accepted coordinate, scale, lifecycle, determinism decisions also
described by guide and ADR-111.
