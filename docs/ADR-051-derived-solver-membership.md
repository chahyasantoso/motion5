# ADR-051: Derived Solver Membership and Pre-Composition State Delivery

**Status:** accepted  
**Date:** 2026-08-27  
**Closes:** issue [#195](https://github.com/chahyasantoso/motion5/issues/195)

This record defines IK solver architecture in motion5: how solvers join single-pass transactional dataflow
graph, how member chains derive without cyclic requirement edges, how FK bones apply solved rotations
without mutating published output schemas.

---

## Context

FK: each bone's world transform computed from parent frame (`base`) using authored `length` + `rotation`.
IK: end-effector (hand, foot) reaches world-space target by calculating joint rotations across ancestor
bone chain.

Immutable single-pass transactional graph gives IK a dependency paradox:

1. solver needs bone lengths + pre-composition states of every chain member;
2. members need solver's joint rotations to compose world frames.

Both as standard requirement edges (`solver -> member.length`, `member -> solver.rotations`) → graph builder
reports dependency cycle (`graph-cycle`), violating single-pass topological execution.

---

## Decision

### 1. Syntactic Solver and Member Binding

IK setup authors with standard plugin requirement bindings — no new edge types, no multi-pass execution:

- **Solver Node (`ikPlugin`)**:
  - Claims key `flip` (boolean selecting elbow/knee bend direction).
  - Declares requirement slots `root` (world frame chain hangs from), `target` (world-space coordinate chain
    reaches for).
  - Outputs `rotations`: frozen dictionary mapping qualified member node IDs to solved local rotation angles
    (`Record<string, number>`).

```text
{
  id: "arm-solve",
  keyframes: {
    ik: {
      values: { flip: false },
      requires: { root: "walk/shoulder", target: "walk/hand-target" },
    },
  },
}
```

- **Member Nodes (`fkPlugin`)**:
  - Bound hierarchically via `keyframes.fk.requires.base`.
  - Optional `solver` slot: `keyframes.fk.requires.solver: "walk/arm-solve"`.
  - Bone dimensions (`length`, optional pivot offsets `x`, `y`) authored under `values`. Authored `rotation`
    prohibited when bound to solver with no blend `weight` beside it, refused at load. See ADR-055.

```text
{
  id: "upper-arm",
  keyframes: {
    fk: {
      values: { length: 30 },
      requires: { base: "walk/shoulder", solver: "walk/arm-solve" },
    },
  },
},
{
  id: "forearm",
  keyframes: {
    fk: {
      values: { length: 25 },
      requires: { base: "walk/upper-arm", solver: "walk/arm-solve" },
    },
  },
}
```

---

### 2. Derived Solver Membership (`resolveSolvers`)

`finalizeGraph` runs pure derivation pass `resolveSolvers` only once reference validation reports no error,
before topological ordering. Precondition load-bearing not tidy: derivation reads nodes its `base` edges
name, so over graph whose sources may not resolve it answers about chain that was never valid, reports
`ik-solver-unreachable-root` against a member for typo one node up. One cause, one diagnostic.

1. **Solver Identification**: node with `root` requirement slot edge = solver. Node that ≥1 member binds its
   `solver` slot to, holding no `root` edge = not a solver, refused as `ik-solver-no-root` rather than
   skipped. Silent skipping was the one IK misconfiguration with no symptom: no `solves` derived, no
   `rotations` published, every member fell back to own authored rotation, rig held broken pose with no error
   and no diagnostic.
2. **Member Discovery**: node declaring `solver` requirement slot edge pointing to solver `S` → collected into
   `S`'s member list.
3. **Chain Verification**: one walk per member, confined to member set. Starts at member (own `base` edge =
   first step), follows `base` edges through `S`'s members until arriving at `S`'s bound `root`. Step with no
   `base` edge, or leaving member set without arriving at root = `ik-solver-unreachable-root` against member
   whose own `base` broke chain, not against walk's start → one bad ancestor reports once, not once per
   descendant inheriting it. Verification + depth = one traversal: cannot disagree, cannot leave confined set.
4. **Deterministic Ordering**: members ordered root-most first (depth from root ascending, ties by
   `authoredIndex` then qualified ID).
5. **Frozen Derivation**: solver nodes minted with `readonly solves: readonly SolveMember[]`. Non-solver nodes
   untouched.

#### Load-Time IK Diagnostics

Loader enforces structural integrity via deterministic diagnostics (`severity: "error"`):

| Diagnostic Rule ID           | Condition                                                                                       |
| ---------------------------- | ----------------------------------------------------------------------------------------------- |
| `ik-solver-no-root`          | A solver node lacks a bound `root` requirement edge.                                            |
| `ik-solver-no-members`       | A solver node has no member nodes declaring `solver` pointing to it.                            |
| `ik-solver-unreachable-root` | A member's `base` walk leaves the member set without terminating at the solver's bound `root`.  |
| `ik-mode-ambiguous`          | A single node binds `solver` alongside `root`/`target`, or binds `root` under multiple plugins. |
| `ik-solved-rotation-dead`    | A bone authors a `rotation` inside the same plugin group in which it bound its `solver` slot.   |
| `ik-target-not-single-leaf`  | A solver binds the bare `target` slot over a chain with more than one leaf.                     |

`ik-solver-unsupported-arity` was here, now deleted. It refused every derived member count but two — honest
while closed form was only solve a rig could reach, false the moment `solveChain` dispatches on derived shape.
Rule refusing a shape code solves is worse than no rule. Cap silently guaranteed chain had exactly one leaf —
only thing bare `target` slot can address — and `ik-target-not-single-leaf` states that guarantee rather than
implies it: slot names no member, so branching chain gives two candidates → rig refused instead of solved with
goal applied to whichever leaf derivation ordered first. `FB-14` pins it, throw in `readGoals` is invariant
guard behind it. Goal-addressing rules slices D0 + D1 introduced belong to ADR-052.

`ik-solved-rotation-dead` reads that group, no other. Solved rotation replaces authored one inside plugin that
reads `rotations` back — plugin that bound slot — so `rotation` under any other group is that plugin's own live
input. Flat `rotation` likewise not this rule's: attributing flat key to plugin is registry's question, this
pass holds no registry by design → member authoring one meets `plugin-ambiguous-key` in any registry with two
claimants, `plugin-unknown-key` in one with none. See ADR-043 and ADR-044. **Superseded in part by
[ADR-121](./ADR-121-grouped-only-keyframes.md), 2026-09-26.** Flat `rotation` no longer reaches this pass or
registry: refused at schema validation as `keyframes-ungrouped-key`, `plugin-ambiguous-key` deleted.

**Amended by ADR-055**, stated here not inside table above, because hand-padded Markdown table is what this
project's formatting gate fails on rather than a fact it records. Dead-rotation row now carries one condition
more: bone bound to `solver` refused for authored `rotation` only while no `weight` sits beside it in same
group — byte-identically old rule for every rig authored before key existed. Seventh rule exists, its mirror:
`ik-weight-without-solver` — node binding `solver` slot under one plugin, authoring `weight` under another,
where solve cannot reach it. Both keep group scope this section describes, both speak only of node that bound
solver at all, for flat-key sentence's reason: `weight` may have claimants this pass cannot see → weight with
no solve in reach not its to attribute.

---

### 3. Pre-Composition Member State Delivery

Member lengths reach solvers without requirement cycle edges: `Track` separates timeline evaluation from
plugin execution (ADR-047 amendment, Slice B):

- `Track.prototype.interpolated()`: renderer-neutral timeline state (`values`, `progress`) before plugin
  composition. Reports what timeline holds, nothing about topology → carries no `base`.
- In `GraphPublisher.flush()` solver nodes look up derived `node.solves` members, invoke
  `memberNode.interpolated()`, join derived `SolveMember.base` onto each reported state, inject frozen array
  into `inputs[solvingPlugin].members`.
- Timeline interpolation runs during `Motion.setProgress` before graph flush begins → member timeline states
  already immutable and available when solver composes.

---

### 4. FK Solver Override and Composer Contract

`domain/plugins.ts` extends `PluginComposer` with 4th parameter:

```ts
export type PluginComposer = (
  values: Readonly<ImmutableRecord>,
  progress: number,
  inputs: PluginInputs,
  nodeId: string,
) => ImmutableRecord;
```

`fkPlugin.compose` execution:

1. reads `inputs.solver?.rotations?.[nodeId]`;
2. present + finite → solved rotation overrides local rotation before `composeWorld` computes parent frame
   extension and tip coordinates;
3. absent or unbound → clean fallback to authored `values.rotation`.

`ikPlugin.compose` returns values it was given with `rotations` added, not `rotations` alone.
`Track.composeFrom` chains by replacement → bare return deletes every key solver track authored, starting with
`flip` solver reads itself. `IK-18` pins spread.

**Amended by slice D3.** `ikPlugin.compose` no longer calls `solveTwoBone` directly. `solveChain` owns choice:
two members + one goal → closed form, everything else → iterative solve in `plugins/fabrik.ts`. Dispatch on
derived shape not authored mode → nothing new authorable, no rig selects own solver. Two paths cannot be one:
`IK-1` + `IK-3` pin exact numbers iterative solve reaches only within tolerance, `flip` at arity two selects
exact branch not basin → DRY guarantee is equivalence assertion (`FB-2`) not shared code path, `FB-9` pins
analytic path byte-identical with dispatcher in front. Neither `tips` nor `convergence` reaches patch. `FB-13`
pins that, convergence paragraphs below own reasoning.

**Amended by ADR-055.** Override is blend. Bound `solver` composes authored rotation blended toward solved one
by member's own `weight`, default `1` → step 2 above is exactly default's case, every rig authored before key
composes byte-identically. Step 3 unchanged, keeps "no solve" and "solve this bone weights to zero"
distinguishable: unbound slot short-circuits to authored value, never reads weight.

**Convergence metadata not published — decision, not omission.** `solveFabrik` returns closed convergence kind
beside `residual`, because unreachable goal and merely slow chain both end unconverged, reporting them as one
thing tells caller raise cap that is not problem.

**Amended by [ADR-107](./ADR-107-one-solve-result.md).** Convergence kind now `quality` of one `SolveResult`
both strategies return, closed form reports own reachability beside it, `FabrikConvergence` deleted. Nothing
about publication changes: `ik.ts` publishes `rotations` only, `FB-13` still pins, reasoning above still owns
why.

**Amended by [ADR-109](./ADR-109-opt-in-solve-inspection.md), 2026-09-24.** Policy above kept for every
unopted rig: solve quality not published, no tick emits diagnostic. Author writing static
`ik.values.inspect: true` opts into one declared `inspection` output carrying fixed-shape projection of
existing `SolveQuality` record. Authored `inspect` value stays beside `rotations`, output uses separate
`inspection` name, nothing depends on arity. Visible FK composition-space tip gap not part of it.

**Extended by [ADR-052](./ADR-052-goal-addressing-by-member-id.md), 2026-08-28.** This record owns how solver
finds bones. How solver is told what to reach for is ADR-052: goal-addressing grammar keyed by member id,
split across contract layer / plugin registry / graph construction, rules policing it, withdrawal of FABRIK
benchmark claim. Dispatch clarifications above = dispatch half of that work, stay here because dispatch is
property of this record's solve.

---

### 5. Dirty-Check Memoization and Invalidation Propagation

- **Memoization**: one memo, `Track.composeFrom` owns it. Key = composing track's own seed plus requirement
  inputs; solver's members travel inside those inputs → comparison covering `root` + `target` covers every
  member length, solver's own interpolated values, its progress. `GraphPublisher` holds no solver cache. A
  `#solverCache` existed, keyed on requirement inputs + member states alone — not fixable optimisation but
  strictly weaker copy of memo it sat in front of: animated value on solver track changed nothing in key →
  solver answered from tick one forever, no error, no diagnostic. Widening key would reproduce `Track`'s key
  beside `Track` → deleted instead. `IK-11` runs against real `Track` for that reason; fake composer pins
  whichever cache publisher holds.
- **Seed Propagation**: publisher's affected BFS registers solver members' solver as dependant. Invalidating
  animated bone length automatically schedules solver re-evaluation.
- **Member Scope**: publisher delivers members under plugin owning solver's `root` edge, read off that edge
  not named in publisher. Hardcoded `ik` would deliver spring integrator's or spline sampler's members under
  name of plugin that happened to be IK's → first non-kinematic solver becomes edit to
  `graph-publisher.ts` instead of plugin. `IK-19` pins it; solver reaching publisher with no root edge throws,
  and `ik-solver-no-root` keeps that unreachable.
- **Renderer Shielding**: `renderableValues` skips value still plain record after serialization → composite
  output such as `rotations` reaches reading nodes, never renderer. Skipping after serialization deliberate:
  plugin serializing composite into something renderable still renders. Without guard, default `resolveTarget`
  sends solver patch to stage, `defaultWriter` falls through to `target[key] = value`, `stage.rotations`
  assigned every frame forever — adapter's own suppression is `Object.is` against freshly built object, can
  never match. `IK-16` asserts object property not `style`, which is what property is set on.

---

## Invariants Preserved

1. **`J-5` Equivalence (ADR-047)**: every authored `requires` binding maps 1:1 to one `GraphEdge`. No
   artificial cycles, no hidden edges.
2. **`TR-R-03` / `TR-R-04` (Single-Pass Purity)**: composition stays single-pass, deterministic. No node
   evaluated twice per tick, no published values patched retroactively.
3. **Deterministic Ordering**: evaluation order pure function of qualified IDs + topological dependency
   structure.
4. **Full Backwards Compatibility**: existing FK chains and walker rigs compose byte-identical outputs, zero
   performance penalty.

---

## Alternatives Rejected

1. **S1: Internal Key Chain Accumulation (`fkChain`)**:
   - _Proposal_: bones accumulate ancestor frames into internal key passed down `base` requirement.
   - _Rejected_: pushes topological chain state to leaf bones, implicit order couplings across motions.
2. **S2: Multi-Pass Execution / Solver Pre-Pass**:
   - _Proposal_: separate pre-pass for solvers before normal graph flushes.
   - _Rejected_: breaks transactional atomicity, complicates rollback, violates single-pass scheduling.
3. **Context Injection / Runtime Handles in Plugins**:
   - _Proposal_: inject `ProjectRuntime` or engine track stores directly into plugin composers.
   - _Rejected_: arbitrary side-effect capability for plugins, bypasses explicit requirement inputs boundary.
4. **Publisher-Side Solver Cache**:
   - _Proposal_: keep `#solverCache`, widen key until covering solver's own seed + progress.
   - _Rejected_: widened key is `Track`'s key. Two caches, two invalidation rules = cheaper per tick, wrong
     the first time one drifts — exactly how narrow key shipped.
5. **Deriving Chains Over Unresolved References**:
   - _Proposal_: keep `resolveSolvers` ahead of reference bail, one build reports every rule rig breaks.
   - _Rejected_: derivation over edges whose sources don't resolve reports chain that never existed. Second
     diagnostic names member for typo one node up — worse first thing to read than typo.
6. **Replacing Closed Form With FABRIK (slice D3)**:
   - _Proposal_: delete `solveTwoBone`, one iterative solve answers every arity.
   - _Rejected_: `IK-1` + `IK-3` pin exact rotations iterative solve reaches only within tolerance, `flip` at
     arity two is exact branch not basin → one solver moves published values for every rig already solving.

---

## Stagger Semantics

`Motion.#effectiveProgress` calculates timeline progress per track index. Solver member length animated with
non-zero stagger → length advances on own staggered timeline, solver reads length accurately each tick. Gives
natural dynamic effects (whips, tentacles, follow-through) without specialized stagger exceptions.

---

## Evidence

- **Slice A (`FO-1`..`FO-6`)**: `packages/core/test/unit/plugins/fk-pivot-offset.test.ts` (pivot offsets `x`,
  `y`).
- **Slice B (`CF-1`..`CF-7`)**: `packages/core/test/unit/domain/track-compose-from.test.ts` (composition split).
- **Slice C0**: `packages/core/test/unit/graph/finalize-graph.test.ts` (`finalizeGraph` deduplication).
- **Slice C1 (`CN-1`..`CN-3`)**: `packages/core/test/unit/domain/track-node-id.test.ts` (`nodeId` in composer
  contract).
- **Slice C2 (`RS-1`..`RS-10`)**: `packages/core/test/unit/graph/resolve-solvers.test.ts` (load-time IK
  diagnostics, determinism under permutation, derivation from live state alone, one confined member walk,
  scope of dead-rotation read, reference bail).
- **Slice C3 (`IK-1`..`IK-19`)**:
  - `packages/plugins/test/unit/ik-solve.test.ts` (analytical 2-bone solve math, both elbow branches,
    composed-values spread).
  - `packages/plugins/test/unit/fk-solver-override.test.ts` (FK rotation override).
  - `packages/core/test/unit/runtime/publisher-solver-members.test.ts` (publisher member gathering, member
    scope, failure semantics, one memo).
  - `packages/core/test/integration/ik-two-bone.test.ts` (full 6-node rig integration, renderer shielding).
- **Slice C4**: `packages/core/test/integration/phase7-walker-demo.test.ts` (hybrid FK/IK walker demo,
  `T-C4.1` dynamic mutation rollback).
- **Slice D2 (`FB-1`..`FB-8`)**: `packages/plugins/test/unit/fabrik-solve.test.ts` (iterative solve as
  arithmetic, unwired: derived seed, closed-form equivalence, sub-base averaging, permutation determinism, two
  non-convergent exits).
- **Slice D3 (`FB-9`..`FB-15`)**:
  - `packages/plugins/test/unit/fabrik-dispatch.test.ts` (analytic path byte-identical behind dispatcher,
    unpublished convergence record, bare-target join).
  - `packages/core/test/unit/graph/arity-lift.test.ts` (chains past and short of arity two loading,
    `ik-target-not-single-leaf`).
  - `packages/core/test/integration/ik-fabrik-chain.test.ts` (five-bone chain tracking animated goal, two-arm
    tree solved once).
- **Blend weight (`WT-1`..`WT-16`)**: ADR-055 and three files it names, owning seam between authored rest pose
  and solve this record derives.

---

## Amendment, 2026-09-03: which nodes read one node has one owner, and a removal seeds them

Recorded here as promotion half of read-budget audit in
[issue #267](https://github.com/chahyasantoso/motion5/issues/267). Reasoning below lived in two docblocks
inside `packages/core/src/runtime/project-runtime.ts` and nowhere else; audit shrinking that file would
otherwise delete only record of it along with comments holding it. Nothing about behaviour changes here.

**One owner, the reverse topology `finalizeGraph` already derived.** `ProjectRuntime.#readersOf` reads
`GraphIR.dependants`, frozen onto `GraphIR` once per graph by walk already holding solver fan-in, never
rederived. Walk it replaced filtered `graph.nodes` on `edges`, one property access from frozen answer, and
duplicate was not defect: weaker of two derivations. `deriveDependants` names both reader kinds because only
one is an edge. Solver reads every member `resolveSolvers` derived onto its `solves`, no edge points that way
→ edge walk missed every member of every chain. Over live IK chain query answered nothing for leaf, named no
solver for any member = preflight telling editor deleting chain member breaks nothing.

**Two consumers, one question.** What caller is told before removing node (`dependantsOf`), which nodes must
publish once it did (flush seed structural commit derives). Coincide by construction only while one mechanism
answers both; this file already paid once for two derivations of this fact → second consumer reads first's
owner rather than graph. Enforcement does not move: candidate orphaning live dependant still refused by
candidate graph, where ADR-050 put it; preflight wrong in permissive direction worse than none, because it is
read.

`#readersOf` stays private, commit path deliberately does not call `dependantsOf` instead. That member owns
public contract about caller from outside → binding commit's own invariant to it makes seed depend on
preflight's promises, points dependency at class's own surface rather than away. Not passed as parameter
either: derivation already reads retained pair off same object under same ordering rule, parameter for one of
two identically ordered reads would claim they differ.

Deduplication + freezing belong to consumers not derivation. `deriveDependants` keeps reader once per
dependency deliberately — consumer walking it guards on own visited set; both consumers want set → collapse
where both are. First occurrence wins, committed node order old filter produced → no existing ordering
expectation moves.

**Removal seeds nodes that were reading it,** not removed node (gone). Premise this replaced said removal
needs no seed, because `finalizeGraph` would refuse candidate anything still depended on — half right. Holds
for every reader that is edge: `finalizeGraph` walks every edge of every node not only observation ones →
removal whose node still bound by ordinary `requires` slot refused before anything commits, `RA-98` pins.
Fails for reader that is not edge. Solver reads chain members through `solves`; under bare `target` slot,
chain losing leaf still has exactly one leaf → every rule in `resolveSolvers` passes, commit lands, solver's
member set moves, nothing publishes. Manual clock with no tick → subscribers hold old pose forever, the
failure single-pass publication exists to end, one node downstream.

**Seed read before graph replaced; that ordering is whole correctness.** Commit path derives before it asks →
this reads graph removal is replacing, only one still knowing who read node it no longer contains. `RA-99`
fails if moved after `replaceGraph`, answer becomes empty.

Two seeds deliberately unfiltered. Reader same commit also removed is seeded, harmless — publisher walks
committed order, seed graph doesn't contain publishes nothing → membership test here = second opinion about
committed pair. Reader replacement in same commit already seeded is seeded twice, harmless — `flush` collapses
seeds.

Evidence `RA-86` through `RA-88` for unified derivation, `RA-98` + `RA-99` for seed. Flush this seed reaches,
and why empty seed set is not cheap flush, are
[ADR-064](./ADR-064-schema-transaction-derived-hooks.md)'s.
