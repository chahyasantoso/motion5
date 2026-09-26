# ADR-120: Opt-in 3D solve inspection

**Status:** Proposed as issue [#500](https://github.com/chahyasantoso/motion5/issues/500) phase 4,
2026-09-26, above `main` at `9d6d8834ac828273259714a74ee3a58b065d26ad`, where the phase 3 pole
target of [ADR-118](./ADR-118-3d-pole-target.md) landed through #505. Accepted when the pull request
carrying it merges.

**Amended by [ADR-121](./ADR-121-grouped-only-keyframes.md), 2026-09-26.** The `ik3d` inspection
switch remains inside the plugin-named group; a top-level `inspect` entry is no longer an authored
spelling and is refused as `keyframes-ungrouped-key`.

## Invariant

An internal `ik3d` solver whose own static `inspect` is exactly `true` publishes one `inspection`
output with the fixed shape `{ kind, residual, iterations, atBound, residuals }`, the same record
the 2D `ik` publishes under [ADR-109](./ADR-109-opt-in-solve-inspection.md), projected from its
`SolveResult3d` by the same function. Its `rotations3d` do not move by a single bit when it opts in.
An `ik3d` solver that authors no `inspect`, or `inspect: false`, publishes exactly the values and
`rotations3d` it published before. The switch is held to the 2D load rules by the 2D rule owners,
and no per-frame diagnostic or warning is emitted for any quality kind.

## Context

ADR-114 computed `quality` and `residuals` on `SolveResult3d` and deliberately did not publish them:
"an inspection/result output contract is deferred until promotion". That deferral left a 3D author
with no way to see whether a goal was out of reach, folded inside the band, or on the root, while
the 2D author could ask with one static key. The 3D solve already answers in the 2D vocabulary,
because `SolveResult3d.quality` is `ClosedFormQuality`, a subset of the 2D `SolveQuality` union, so
what was missing was a publication path, not a model.

Measured against the tree at `9d6d8834`, three facts shaped the decision. The 2D projection,
`inspectSolve`, was typed to take the whole 2D `SolveResult`, whose pose field is `rotations`, a
record of numbers; a 3D result has `rotations3d`, a record of Euler triples, so the projection could
not accept it although it never read the pose. The opt-in itself, `values.inspect === true`, was an
inline expression in `ik.ts`. And the graph's two inspect rules, `ik-inspect-malformed` and
`ik-solver-key-misgrouped`, already read every group that bound `root` through `solverSpellings`,
`ik3d` among them; what refused `ik3d.values.inspect: true` at load was only the registry, because
`ik3d` claimed no key.

## Decision

**The projection reads evidence, not a pose.** `ik-result.ts` states `SolveEvidence<Q>`, the
dimension-free part of a solve result: `quality` and `residuals`. `SolveResult<Q>` extends it with
the 2D `rotations`, and `ik3d-result.ts` states `SolveResult3d` as
`SolveEvidence<ClosedFormQuality> & { rotations3d }`. `inspectSolve` takes a `SolveEvidence`, which
every result of either dimension is, so the one exhaustive switch over `SolveQuality["kind"]` serves
both dimensions and a new quality kind still fails to compile in exactly one place.

**The opt-in has one reader.** `inspectionOutput(values, result)` in `ik-result.ts` answers both
questions an inspecting solver asks: whether to publish (the solver's own `inspect` is exactly
`true`) and what (`inspectSolve(result)`). It returns either `{ inspection }` or a shared frozen
empty record, typed as the closed union `InspectionOutput`, and each solver spreads it after its
pose. `ik.ts` now spreads it where it used to carry the inline expression, which moves no 2D byte:
`IN-1` through `IN-9` are unchanged except that `IN-6` constructs its evidence without a pose.
`ik3d.ts` spreads the same answer after `rotations3d`, so an opted patch's key order is values, pose,
record in both dimensions.

**`ik3d` claims `inspect` and owns `inspection`.** `ik3d` declares `keys: [INSPECT_KEY]` and
`outputs: [ROTATIONS3D_KEY, INSPECTION_KEY]`, the name for every registration, the value only when
opted in, exactly as ADR-109 decided for `ik`. The pose channel stays dimensional (`rotations3d`,
ADR-114) and the record does not, because the record is one shape read through one owner. A track
that registers both solvers was already a mistake; it is now also refused as
`plugin-duplicate-output` on `inspection`.

**The load rules are shared, not restated.** No rule is added and no rule id changes.
`ik-inspect-malformed` refuses an `ik3d` switch that is not one static boolean, flat or under the
group that bound `root`, and `ik-solver-key-misgrouped` refuses one under any other group on the
solver node, because both already read every group that bound `root`. The one change in
`graph/solver-constraints.ts` is its module comment, which said the `ik` composer reads these keys
and now says which solver reads which. `bend` and `flip` stay 2D vocabulary: under `ik3d` they are
the registry's `plugin-unknown-key`, as `TH-11` already pins. **Superseded in part by [ADR-121](./ADR-121-grouped-only-keyframes.md), 2026-09-26.** There is no flat switch any more: an ungrouped `inspect` is refused at schema validation as `keyframes-ungrouped-key`, so these two rules read only grouped spellings.

## What is withdrawn

- A 3D copy of the projection (`inspectSolve3d`, or a 3D inspection type) is withdrawn. It would
  be a second owner of the record's shape, and the two would drift the first time either union
  grows.
- A generic `inspectSolve<R extends { quality; residuals }>` over the result type is withdrawn in
  favour of a named `SolveEvidence`. The name states what both results share, and each result
  extends it, so a result that stops carrying the evidence fails to compile at its own declaration
  rather than at a call site.
- A dimension-specific output name, `inspection3d`, is withdrawn. The pose has a dimensional name
  so that one pose cannot silently replace the other; the record is the same record, and a second
  name would make every consumer branch on dimension for no difference in content.
- A 3D-specific load rule, or a second classifier for the 3D switch, is withdrawn. The rules
  already read the group that bound `root`, and a second rule would report one mistake twice.
- Leaving the opt-in inline in each solver is withdrawn. Two inline copies of
  `values.inspect === true` would be two owners of what the switch means.
- Publishing inspection unconditionally for `ik3d`, as an internal prototype with no compatibility
  to keep, is withdrawn. ADR-051's reasons apply in 3D as in 2D, and an unopted rig's bytes are part
  of what every phase of #500 preserves.
- Declaring `iterations` or `atBound` meaningfully for 3D is not in this phase. The closed form
  answers only closed-form kinds, which project to zero iterations and an empty `atBound`; the
  iterative 3D solve of phase 5 and the 3D limits of phase 6 will fill them through the same
  projection without a shape change.

## Consequences

A 3D author opts into the same record a 2D author reads, and a consumer reads it without knowing
the dimension. Registering `ik` and `ik3d` in one registry makes a flat `inspect` spelling
`plugin-ambiguous-key`, exactly as `x` already is between `transform` and `transform3d` (`TH-10`);
the grouped spelling names its owner (ADR-043), and the guide's example is grouped. Nothing
3D is exported from the package, and no file approaches the read budget: `ik-result.ts`,
`ik3d.ts`, `ik3d-result.ts` and `graph/solver-constraints.ts` all stay below the 30,000-byte
sister-document line. **Superseded in part by [ADR-121](./ADR-121-grouped-only-keyframes.md), 2026-09-26.** A flat `inspect` is no longer ambiguous between `ik` and `ik3d`, because no flat spelling is authorable: it is refused as `keyframes-ungrouped-key` before plugin resolution, and `plugin-ambiguous-key` is deleted.

## Evidence

- `TH-52` proves the declaration (`keys`, `outputs`), the opted key order, the fixed record, and
  that it is frozen and freezable as an immutable value.
- `TH-53` proves an unopted solver is exactly `{ rotations3d }` of the direct solve, an explicit
  `false` keeps the switch and publishes no record, an opted pose is `Object.is`-identical, and a
  truthy non-boolean is no opt-in at runtime.
- `TH-54` proves every closed-form kind, `reached`, `too-far`, `too-near` and `coincident`, reaches
  the record with the direct solve's residual and one per-leaf entry, including a rig past the
  magnitude ceiling whose residual is restored rather than published as its image's.
- `TH-55` proves the published record equals the 2D `inspectSolve` of the 3D evidence for every
  kind, and that a planar 3D rig reports the 2D closed form's kind and residual to `1e-9`.
- `TH-56` proves the 2D rules speak for `ik3d` grouped and flat, name the authored path, refuse a
  misgrouped switch as misgrouped only, accept both static booleans through the engine, refuse them
  as `plugin-unknown-key` without the claim, and make the flat spelling ambiguous only when `ik` is
  registered beside `ik3d`. **Superseded in part by [ADR-121](./ADR-121-grouped-only-keyframes.md), 2026-09-26.** `TH-56` now proves the grouped spelling only, and that an ungrouped `inspect` is `keyframes-ungrouped-key`.
- `TH-57` proves through `Engine` that opting in adds exactly two keys to the solver's patch and
  changes no member patch, that an animated goal leaving the band turns the record `too-far`, that
  seeking back reproduces every byte, and that the DOM adapter never writes `inspection`.
- `TH-13` now pins `inspection` beside `rotations3d` and still refuses a 2D `rotations` output.
- Sandbox mutation pass over 12 mutants (`tools/mutate/phase4.json` in the handover, run against
  `ik3d-inspection.test.ts` and `ik-inspection.test.ts`): 12 killed, among them dropping the 3D
  spread, the claim, the output declaration, an always-on or inverted or truthy opt-in, a spread
  before the pose, and an unrestored far residual.
- An independent quality pass over the behaviour commit reported one blocking finding, the stale
  `TH-13` output assertion, and two advisory comment findings; all three are fixed in the
  behaviour commit. Its report belongs on the pull request rather than here.
- Every result above is a sandbox measurement under a Vitest stand-in, reviewed rather than
  trusted. The sandbox has no TypeScript, so `CI` on the pull request head is the compiler evidence.
