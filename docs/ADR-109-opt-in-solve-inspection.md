# ADR-109: Opt-in solve inspection

**Status:** Accepted, 2026-09-24. Issue [#349](https://github.com/chahyasantoso/motion5/issues/349)
phase 4, squash-merged from [#485](https://github.com/chahyasantoso/motion5/pull/485) as `2d8ac606`.
Phase 5 is [ADR-110](./ADR-110-goal-influence-and-conflict-policy.md).

**Amended by [ADR-110](./ADR-110-goal-influence-and-conflict-policy.md), 2026-09-24.** The
inspection projection now also carries frozen per-leaf `residuals`, and it may report the new
`conflicted` quality kind. `inspectSolve` takes the whole `SolveResult` so the projection reads the
result-owned residual record; the opt-in, fixed-shape and no-diagnostic rules otherwise remain.

**Amended by [ADR-120](./ADR-120-3d-opt-in-inspection.md), 2026-09-26.** The internal 3D solver
`ik3d` claims `inspect` and publishes the same record under the same rules. `inspectSolve` now
takes `SolveEvidence`, the `quality` and `residuals` both dimensions' results share, and the
reading of the opt-in moved from `ik.ts` into `inspectionOutput` in `ik-result.ts`, so one module
owns both whether to publish and what; `ik`'s published bytes are unchanged.

**Amended by [ADR-121](./ADR-121-grouped-only-keyframes.md), 2026-09-26.** The Invariant's flat
`inspect` alternative, the `solverSpellings` decision's flat branch, and the Evidence claim about
flat and grouped spellings no longer hold for authored input. Authored inspect is
`ik.values.inspect` (or `ik3d.values.inspect` for the 3D solver); an ungrouped `inspect` is
`keyframes-ungrouped-key`, not an inspection-specific diagnostic.

## Invariant

An IK solver publishes exactly the rotations it published before, bit for bit, unless its author
opts into inspection with the static boolean `ik.values.inspect: true` (or the flat `inspect`
spelling on the node that bound `root`). When opted in, it publishes one `inspection` output with
the fixed shape `{ kind, residual, iterations, atBound }`, and its rotations do not move by a single
bit. The shape is independent of chain arity and strategy: the closed form and FABRIK fill the same
four keys. No per-frame diagnostic or warning is emitted for any quality kind.

## Why

ADR-051 deliberately kept convergence metadata out of patches: a per-tick diagnostic turns ordinary
iterative misses into noise, and arity-dependent fields would make the published render surface
unstable. That policy is right for unopted rigs but leaves an author who is diagnosing a rig with no
way to see solver-space residuals, iterations, stalls, or limited members. ADR-107 already made the
quality record total on both strategies, so what remained was a publication decision, and making it
a function of authoring is the one reading that keeps both of ADR-051's reasons: nothing is inferred
from arity, and nothing speaks unless asked.

## Decisions taken, not asked

**`inspect` is an `ik` key and a static boolean.** `ik` claims `inspect`; `true` enables the output
and `false` is a valid explicit opt-out. An animated, non-boolean or otherwise malformed leaf is
refused as `ik-inspect-malformed`. A keyframed switch is refused rather than honoured because an
output that appears and disappears mid-timeline is exactly the unstable patch shape ADR-051 exists
to prevent.

**`inspect` is solver vocabulary, scoped like `bend` and `flip`.** `SolverKey` names all three, and
the rule reads `inspect` through the same `solverSpellings` reader ADR-108's cp002 introduced: flat
or under the group that bound `root` is read and classified, under any other group on a solver node
is refused as `ik-solver-key-misgrouped` (the composer reads the flattened bag, so that spelling
would switch the output on from a group that does not own it), and on a node that bound no `root`
it is some other plugin's key and neither read nor refused. The first draft of this phase read every
spelling on every node, which repeated the exact defect cp002 fixed for `bend`; one reader for the
scope is what keeps it one decision. `IN-7` and `IN-8` pin both halves.

**The output is a fixed projection owned by `ik-result.ts`.** `ik` passes through the existing
`SolveQuality` without recomputing a residual or translating FABRIK metadata. `inspectSolve` reads
the union by an exhaustive switch: every closed-form kind maps to zero iterations and an empty
`atBound`, the iterative kinds keep their iteration count with an empty `atBound`, and `limited`
copies and freezes its bound ids. The record is frozen, always has the same four keys, and holds
only renderer-neutral values. A new quality kind fails to compile here until it is answered.

**The authored and published names are separate.** `inspect` is the static authored switch and stays
in the returned values through the existing `...values` spread, like `flip`. `inspection` is the
published projection. Both names live in `contract/solver-constraints.ts` beside each other, so the
switch and the output cannot drift apart. `ik.outputs` declares `rotations` and `inspection` for
every registration, because owning an output name is a property of the plugin rather than of one
rig, while the value is present only when the live `inspect` is exactly `true`.

**The record reaches consumers and not the renderer.** `ImmutableRecord` admits recursive immutable
arrays, `freezeValue` accepts the frozen projection, and the publisher's renderer-neutral check
passes it. The DOM adapter already skips a plain record as a property it cannot write (ADR-051's
`rotations` reason), so the composite `inspection` is delivered in the patch and never written to a
stage. `IN-9` pins this end to end through the engine and the DOM adapter.

**`ik` owns solver-space residuals only.** The reported residual is the quality already produced in
solver space. The visible tip gap caused by a partially weighted FK composition is a different
question, answered after `fk` blends each member, and is withdrawn to a follow-up below.

**No runtime diagnostics.** Inspection is data requested by an author, not a failure classification.
No tick path logs, warns, or adds a diagnostic for any quality kind.

## Withdrawn

The output name `inspect` is withdrawn. It collided with the authored `inspect` switch and made it
unclear whether a value was configuration or solver data. `inspection` is the published name, so the
two contracts stay distinguishable at the top level of a patch.

The `withoutInspect` strip helper is withdrawn. It was needed only because the first draft published
a derived value under the authored name. Keeping `...values` is the existing composition contract
(`IK-18`) and preserves the authored switch, so no filtering helper and no second owner of key
removal is needed.

Reading `inspect` through `authoredSpellings` on every node is withdrawn in favour of
`solverSpellings`, for the reason above.

The FK partial-weight visible tip gap is withdrawn to a follow-up. It needs a composition-space
measurement after `fk` applies each member's blend, and adding it here would give `ik` a second
owner of a fact that is not in the solve result. It is not implemented, named as an IK field, or
added to published patches.

## Evidence

`packages/core/test/unit/plugins/ik-inspection.test.ts` covers `IN-1` through `IN-9`: the opt-in
output, byte identity of unopted rigs against the solve itself and bit identity of opted-in
rotations, an explicit `false` retained, analytic and FABRIK output-key parity, flat and grouped
malformed refusals, the misgrouped refusal and the bystander-plugin exemption, the exhaustive
projection of every quality kind with frozen `atBound` arrays, and the published patch through the
engine with the DOM adapter declining to write the record. The rule id is registered in
`contract/rule-id.ts` and `contract/rule.ts`; the evidence-id gate and the acceptance map register
the series. `IN-2`, `IN-5` and `IN-9` were tightened by this phase's quality pass: `IN-2` asserts
the opted-in keys, `IN-5` loads both spellings through a registry and shows the load refusing them
as `plugin-unknown-key` once `ik` stops claiming `inspect` (the graph layer holds no registry, so a
graph-only assertion could not fail), and `IN-9` compares the whole patch envelope. `IN-8` is a
scope guard that was green before this phase, paired with the same rig refusing a malformed switch
on the solver, so the exemption is shown to be scope rather than absence. ADR-054 and ADR-106 carry
amendment notes for their unqualified "rotations only" and "publication unchanged" sentences.

The sandbox esbuild harness is behavioural evidence only. Full-suite, formatter, scanner and
typecheck results belong to the pull request's CI run on its exact head and must not be inferred
from this record.

## Consequences

An opted-in solver patch has one additional renderer-neutral `inspection` value and keeps its
authored `inspect` value. An unopted solver publishes the phase 3 patch byte for byte. Consumers
read the same top-level key at every arity and either switch exhaustively on `kind` or read the four
keys directly. Phase 5's goal policy reports an infeasible goal through this record rather than
through a new channel. `fk` remains the future owner of any visible, partially weighted tip gap.
