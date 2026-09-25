# ADR-113: 2D IK envelope and documentation

**Status:** Accepted, 2026-09-24. Issue [#349](https://github.com/chahyasantoso/motion5/issues/349)
phase 7, read against `main` at `7c9ffc3afc7c9fbfb813df7573d8cf0ad7dcbbf6` after PR #488
merged. The phase-7 slice is in review; this record states the accepted contract and its evidence,
not a claim that the review has merged.

## Context

The 2D solve has a complete numerical and lifecycle contract, but its implementation evidence was
spread across the envelope fixtures, the user guide, the diagnostics guide, and the stability ADR.
A benchmark without a named rig owner could drift from the tests, and documentation that silently
invented a duration gate would turn a machine-specific observation into a false compatibility
promise. Phase 7 closes those documentation and ownership gaps without adding another solver owner.

The public reader also needs one coherent convention: the DOM adapter's screen coordinates, the
solver's local angles, the renderer's scale, and the runtime's load/edit/seek lifecycle must say the
same thing. The decision is therefore about the envelope and its record, not about adding a new
runtime behavior.

## Invariant

One owner answers each envelope question. `test/support/ik-envelope.ts` owns the named rigs and
scenario shapes. The `EN-1` through `EN-4` cases execute those rigs and pin shape, strategy,
quality, finite output, and iteration behavior; they do not pin elapsed time. `scripts/bench-ik.mjs`
measures those same rigs and owns only the repeatable measurement procedure. `docs/BENCH-IK.md`
records one report's conditions and results. No benchmark fixture may become a second behavioral
oracle.

The guide's coordinate convention is +x right, +y down, degrees, and positive rotation clockwise
on screen. It is one-to-one with the DOM adapter: the same numeric frame is written as
`translate3d(x, y, 0)` and `rotate(rotation deg)`. On mathematical y-up axes, the same positive
number appears counter-clockwise; motion5 does not silently convert it.

A solve reads world position, rotation, lengths, pivot offsets, limits, and goals. It reads no
scale because the solver frame has no scale field. To draw a rig larger or smaller, scale the
container that holds the rig. A uniform container scale preserves the pose; nonuniform scale
changes the appearance of angles and is not solver geometry. Scaling an individual bone element
changes that drawing only, not the solved child tip.

A loaded or mounted rig publishes nothing until a real operation. A value edit recomposes the
existing graph; a goal edit is a topology edit; removing a member seeds the derived solver that
read it. A solve has no warm state, so reverse and random seeks reproduce the forward bytes.

## Decision

The envelope rigs have one owner in `test/support/ik-envelope.ts`. The benchmark imports those
fixtures rather than rebuilding similar chains. `EN` is the executable evidence for shapes and
bounds, not a duration assertion. The guide examples are executable `GE-1` through `GE-5` cases
and therefore execute the guide's own conventions and lifecycle claims, as required by ADR-095.

The closed-form two-bone path is measured separately from FABRIK. FABRIK's useful fresh serial-chain
reading is approximately 1.5 microseconds per member-iteration on the recorded machine; the
numbers are observations, not API guarantees. Branching outcomes are reported as `conflicted` when
the centroid compromise remains outside tolerance and its witness shows branch disagreement.
That name does not claim that no pose exists.

The numerical scale policy remains the one established by ADR-111. Native finite inputs are read
without scene scaling. Above `2 ** 500` in finite world-unit magnitude, the solve uses an exact
power-of-two image and restores residuals to world units; rotations are unchanged. An infinite goal
coordinate is a direction on every strategy and a `NaN` goal coordinate refuses the solve by name
(ADR-111, amendment of 2026-09-25, #489); any other `NaN` remains visible rather than being
laundered into a plausible finite answer. The absolute FABRIK tolerance remains `0.001` world units.

The lifecycle record is intentionally cross-linked rather than duplicated as a new runtime rule.
Load and mount do not seed a publication. Member value writes invalidate dependants without a graph
rebuild, goal additions and removals edit the graph, and derived solver membership makes member
removal seed the solver. The pure solve carries no previous frame into the next one.

## Measurements

The paired benchmark reports were recorded on 2026-09-24 with Node `v22.23.1`, V8
`12.4.254.21-node.56`, `linux x64`, an Intel(R) Xeon(R) Processor @ 2.60GHz, and 4 cores. Each
solve scenario used 200 rigs. Each number was the median of 7 samples, each sample running
back-to-back calls for at least 60 ms after one warm-up pass. The machine had no deliberate heavy
work, although other agents may have been running tests. Run 1 is the primary report in
[BENCH-IK.md](./BENCH-IK.md); run 2 is the paired variance check.

Run 1 measured 2.3257 microseconds for the two-bone closed form, 76.2351 microseconds for chain-8,
923.4225 microseconds for chain-32, and 2,967.4311 microseconds for chain-64. Chain-64 had 183
`converged` and 17 `iteration-cap` results. Tree-14 measured 1,088.9650 microseconds with 190
`conflicted`, 9 `converged`, and 1 `iteration-cap`; tree-30 measured 2,575.0832 microseconds with
all 200 `conflicted`; the additional `tree-14-conflicting` scenario measured 1,068.7883
microseconds with all 200 `conflicted`. Constrained-8 measured 97.5334 microseconds with 197
`converged` and 3 `limited`. Engine cost was 49.53 microseconds per rig for one rig, 52.26 for ten,
70.08 for 100, and 137.96 for 500.

Run 2 kept every quality count identical. Its solve timings were 1.9013, 75.8308, 858.2578,
2,863.6790, 1,112.1312, 2,606.5190, 1,128.9132, and 104.2292 microseconds in the same scenario
order. Relative to run 1, these changed by -18.3%, -0.5%, -7.1%, -3.5%, +2.1%, +1.2%, +5.6%, and
+6.9%. Engine per-rig timing changed by +50.3%, +3.4%, +13.9%, and +15.4% for 1, 10, 100, and
500 rigs respectively. The spread is evidence that the timings are machine observations, not gates.

The separate feasible-tree probe used the same seeded 200-rig tree-14 and tree-30 populations,
20-unit segments, and pose-derived goals. At cap 10,000, tree-14 had 94 `conflicted` and 106
`converged` results; 69 of the 94 conflicted results were exact fixed points with `moved === 0`.
Tree-30 still had 139 `conflicted` results. The smallest branching tree, one shared parent and two
leaves, already had 67 `conflicted` results out of 200. Raising the cap from 64 to 10,000 is about
150 times the work: it fixes about half of tree-14's default conflicts but leaves exact fixed points
and most of tree-30. The fixed-point/local-minimum behavior is tracked by
[#490](https://github.com/chahyasantoso/motion5/issues/490).

The same probe found that all 17 chain-64 results that hit the default cap converge at cap 256. That
is slow serial convergence, a different cause from the tree centroid fixed points. Choosing a fixed
cap for that behavior is tracked by [#491](https://github.com/chahyasantoso/motion5/issues/491), not
decided in phase 7.

## Issue #490 measurement (2026-09-25)

The selector was measured with the seeded 200-rig envelope on Node `v22.23.1`. Tree-14 reported
196 `converged`, 1 `iteration-cap` and 3 `conflicted`; tree-30 reported 139 `converged` and 61
`conflicted`; tree-14-conflicting remained 200 `conflicted`. The selected residual median, p90 and
maximum were respectively `3.1776437161565096e-14`, `6.997021959159209e-11` and `5.228793097351926`
for tree-14; `2.5421149729252077e-13`, `1.7467344192014325` and `8.484869234423337` for tree-30;
and `13.586018483017028`, `24.191544287957452` and `32.36464863348968` for the conflicting tree.

The charged-pass probe sums `quality.iterations` across every attempt, including losing candidates.
Tree-14 charged 26,806 passes versus 12,663 for its baseline, tree-30 charged 36,671 versus 12,800,
and tree-14-conflicting charged 49,703 versus 12,800. The selector improved 189, 172 and 115 rigs
respectively and regressed none. Every one of the 10 tree-14 rigs whose baseline was not conflicted
returned an Object.is-identical result. The full harness also checked chains and two-bone rigs; all
had zero improvements, regressions and identity failures, as required by the direct-return gate.

## Withdrawn

**Raising the iteration cap is withdrawn as a phase-7 policy.** At cap 10,000, about 150 times the
default iteration budget, tree-14 improves from 190 default conflicted results to 94, but 69 of
those 94 are exact `moved === 0` fixed points and tree-30 still has 139 conflicted results. The
centroid compromise needs an algorithmic follow-up, tracked by
[#490](https://github.com/chahyasantoso/motion5/issues/490). The 17 chain-64 cap hits do all
converge at cap 256, but choosing a new fixed cap is a separate policy decision, tracked by
[#491](https://github.com/chahyasantoso/motion5/issues/491), not a phase-7 change.

**Timing gates are withdrawn.** A timing threshold would make CI depend on the host CPU, runtime,
load, contention, and benchmark warm-up. The deterministic `EN` cases are the gate; `BENCH-IK.md`
and `npm run bench:ik` are measurement and reproduction records only, as required by ADR-008.

**A second envelope fixture is withdrawn.** Recreating the rigs in the benchmark or guide would
make shape evidence and measured shape disagree. The support module is the single owner, and the
GE cases consume the guide's printed examples rather than replacing them with hidden fixtures.

## Consequences

Consumers can read one explicit DOM-compatible coordinate convention and one scale policy without
assuming that renderer scale changes solver geometry. Maintainers can reproduce the measurements
and see exactly which results are machine-specific. A future solver or 3D seam must state its own
shape owner and evidence instead of extending the 2D benchmark by implication.

The benchmark is intentionally not a release threshold. A slower or faster machine can produce a
different number while the same EN behavior remains valid. A change to the deterministic envelope
must update the owning fixtures, EN evidence, and this record's measured conditions together.

## Evidence

`EN-1` through `EN-5` in `packages/core/test/unit/plugins/ik-envelope.test.ts` cover strategy
selection, finite output, independent rigs, and the iteration envelope. `GE-1` through `GE-5` in
`packages/core/test/unit/plugins/ik-guide-examples.test.ts` execute the JSON examples in the guide.
The benchmark uses the same support module and is reproduced with `npm run bench:ik`. The recorded
numbers and full scenario fields are in [BENCH-IK.md](./BENCH-IK.md). The accepted coordinate,
scale, lifecycle, and determinism decisions are also described by the guide and ADR-111.
