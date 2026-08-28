# ADR-051: Derived Solver Membership and Pre-Composition State Delivery

**Status:** accepted  
**Date:** 2026-08-27  
**Closes:** issue [#195](https://github.com/chahyasantoso/motion5/issues/195)

This record defines the Inverse Kinematics (IK) solver architecture in motion5. It establishes how solvers participate in the single-pass transactional dataflow graph, how member chains are derived without cyclic requirement edges, and how forward kinematics (FK) bones apply solved rotations without mutating published output schemas.

---

## Context

In Forward Kinematics (FK), each bone's world transform is computed relative to its parent frame (`base`) using authored `length` and `rotation`. Inverse Kinematics (IK) allows an end-effector (such as a hand or foot) to reach toward a world-space target by calculating the requisite joint rotations across an ancestor bone chain.

In an immutable single-pass transactional graph, IK introduces a fundamental dependency paradox:

1. The solver requires the bone lengths and pre-composition states of every member in the chain.
2. The members require the calculated joint rotations from the solver to compose their world frames.

If both relationships were expressed as standard requirement edges (`solver -> member.length` and `member -> solver.rotations`), the graph builder would report an immediate dependency cycle (`graph-cycle`), violating single-pass topological execution.

---

## Decision

### 1. Syntactic Solver and Member Binding

An IK setup is authored using standard plugin requirement bindings without introducing new edge types or multi-pass execution:

- **Solver Node (`ikPlugin`)**:
  - Claims key `flip` (boolean configuration selecting the elbow/knee bend direction).
  - Declares requirement slots `root` (world frame from which the chain hangs) and `target` (world-space coordinate the chain reaches for).
  - Outputs `rotations`: a frozen dictionary mapping qualified member node IDs to solved local rotation angles (`Record<string, number>`).

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
  - Declare an optional `solver` slot: `keyframes.fk.requires.solver: "walk/arm-solve"`.
  - Author bone dimensions (`length`, optional pivot offsets `x`, `y`) under `values`. Authored `rotation` is prohibited when bound to a solver and refused at load time.

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

Graph finalization (`finalizeGraph`) runs a pure derivation pass, `resolveSolvers`, only once reference validation has reported no error, and before topological ordering. That precondition is load-bearing rather than tidy: the derivation reads the nodes its `base` edges name, so over a graph whose sources may not resolve it answers about a chain that was never valid and reports `ik-solver-unreachable-root` against a member for a typo one node up. One cause, one diagnostic.

1. **Solver Identification**: Any node with a `root` requirement slot edge is classified as a solver. A node that at least one member binds its `solver` slot to, and which holds no `root` edge, is therefore not a solver at all, and it is refused as `ik-solver-no-root` rather than skipped. Skipping it silently was the one IK misconfiguration with no symptom: no `solves` was derived, no `rotations` were published, every member fell back to its own authored rotation, and the rig held a broken pose with no error and no diagnostic.
2. **Member Discovery**: Any node declaring a `solver` requirement slot edge pointing to solver `S` is collected into `S`'s member list.
3. **Chain Verification**: One walk per member, confined to the member set. It starts at the member, so the member's own `base` edge is its first step, and it follows `base` edges through `S`'s members until it arrives at `S`'s bound `root`. A step with no `base` edge to take, or one that would leave the member set without arriving at the root, is `ik-solver-unreachable-root` against the member whose own `base` broke the chain rather than against the member the walk started from, so one bad ancestor reports once and not once per descendant that inherited it. Verification and depth are one traversal: they cannot disagree, and the walk cannot leave the set it is confined to.
4. **Deterministic Ordering**: Members are ordered root-most first (depth from root ascending, ties broken by `authoredIndex` and qualified ID).
5. **Frozen Derivation**: Solver nodes are minted with `readonly solves: readonly SolveMember[]`. Non-solver nodes remain untouched.

#### Load-Time IK Diagnostics

The loader enforces structural integrity across these deterministic diagnostics (`severity: "error"`):

| Diagnostic Rule ID           | Condition                                                                                       |
| ---------------------------- | ----------------------------------------------------------------------------------------------- |
| `ik-solver-no-root`          | A solver node lacks a bound `root` requirement edge.                                            |
| `ik-solver-no-members`       | A solver node has no member nodes declaring `solver` pointing to it.                            |
| `ik-solver-unreachable-root` | A member's `base` walk leaves the member set without terminating at the solver's bound `root`.  |
| `ik-mode-ambiguous`          | A single node binds `solver` alongside `root`/`target`, or binds `root` under multiple plugins. |
| `ik-solved-rotation-dead`    | A bone authors a `rotation` inside the same plugin group in which it bound its `solver` slot.   |
| `ik-target-not-single-leaf`  | A solver binds the bare `target` slot over a chain with more than one leaf.                     |

`ik-solver-unsupported-arity` was here and is deleted. It refused every derived member count other than two, which was honest while the closed form was the only solve a rig could reach and false the moment `solveChain` dispatches on derived shape. A rule that refuses a shape the code solves is worse than no rule. What the cap was guaranteeing silently is that a chain had exactly one leaf, which is the only thing the bare `target` slot can address, and `ik-target-not-single-leaf` is that guarantee stated rather than implied: the slot names no member, so a branching chain gives it two candidates and the rig is refused instead of solved with the goal applied to whichever leaf the derivation ordered first. `FB-14` pins it, and the throw in `readGoals` is the invariant guard behind it. The goal-addressing rules slices D0 and D1 introduced belong to ADR-052.

`ik-solved-rotation-dead` reads that group and no other. The solved rotation replaces the authored one inside the plugin that reads `rotations` back, which is the plugin that bound the slot, so a `rotation` under any other group is that plugin's own live input. A flat `rotation` is likewise not this rule's: attributing a flat key to a plugin is the registry's question, and this pass holds no registry by design, so a member authoring one meets `plugin-ambiguous-key` in any registry with two claimants and `plugin-unknown-key` in one with none. See ADR-043 and ADR-044.

---

### 3. Pre-Composition Member State Delivery

To supply member lengths to solvers without requirement cycle edges, `Track` separates timeline evaluation from plugin execution (ADR-047 amendment, Slice B):

- `Track.prototype.interpolated()`: Returns renderer-neutral timeline state (`values`, `progress`) prior to plugin composition. It reports what the timeline holds and nothing about topology, so it carries no `base`.
- In `GraphPublisher.flush()`, solver nodes look up their derived `node.solves` members, invoke `memberNode.interpolated()`, join the derived `SolveMember.base` onto each reported state, and inject the frozen array into `inputs[solvingPlugin].members`.
- Because timeline interpolation runs during `Motion.setProgress` before graph flush begins, member timeline states are already immutable and available when the solver composes.

---

### 4. FK Solver Override and Composer Contract

`domain/plugins.ts` extends `PluginComposer` with a 4th parameter:

```ts
export type PluginComposer = (
  values: Readonly<ImmutableRecord>,
  progress: number,
  inputs: PluginInputs,
  nodeId: string,
) => ImmutableRecord;
```

When `fkPlugin.compose` executes:

1. It reads `inputs.solver?.rotations?.[nodeId]`.
2. If present as a finite number, the solved rotation overrides the local rotation before computing parent frame extension and tip coordinates via `composeWorld`.
3. If absent or unbound, it falls back cleanly to authored `values.rotation`.

`ikPlugin.compose` returns the values it was given with `rotations` added, not `rotations` alone. `Track.composeFrom` chains by replacement, so a bare return deletes every key the solver track authored, starting with the `flip` the solver reads itself. `IK-18` pins the spread.

**Amended by slice D3.** `ikPlugin.compose` no longer calls `solveTwoBone` directly. `solveChain` owns the choice: two members and one goal take the closed form, and everything else takes the iterative solve in `plugins/fabrik.ts`. Dispatch is on derived shape rather than on an authored mode, so nothing new is authorable and no rig selects its own solver. The two paths cannot be one: `IK-1` and `IK-3` pin exact numbers an iterative solve reaches only within a tolerance, and `flip` at arity two selects an exact branch rather than a basin, so the DRY guarantee is an equivalence assertion (`FB-2`) rather than a shared code path, and `FB-9` pins the analytic path as byte-identical with the dispatcher in front of it. Neither `tips` nor `convergence` reaches a patch. `FB-13` pins that, and the reasoning is recorded in [DECISIONS.md](./DECISIONS.md) under ADR-051.

---

### 5. Dirty-Check Memoization and Invalidation Propagation

- **Memoization**: there is one memo and `Track.composeFrom` owns it. Its key is the composing track's own seed as well as the requirement inputs, and a solver's members travel inside those inputs, so the comparison that covers `root` and `target` covers every member length, the solver's own interpolated values, and its progress. `GraphPublisher` holds no solver cache. A `#solverCache` existed, keyed on the requirement inputs and the member states alone, and it was not a fixable optimisation but a strictly weaker copy of the memo it sat in front of: an animated value on a solver track changed nothing in that key, so the solver answered from tick one forever with no error and no diagnostic. Widening its key would have reproduced `Track`'s key beside `Track`, so it is deleted instead. `IK-11` runs against a real `Track` for that reason; a fake composer only pins whichever cache the publisher happens to hold.
- **Seed Propagation**: In the publisher's affected BFS pass, solver members register their solver as a dependent. Invalidating an animated bone's length automatically schedules the solver for re-evaluation.
- **Member Scope**: the publisher delivers members under the plugin that owns the solver's `root` edge, read off that edge rather than named in the publisher. A hardcoded `ik` would deliver a spring integrator's or a spline sampler's members under the name of the plugin that happened to be IK's, which would make the first non-kinematic solver an edit to `graph-publisher.ts` instead of a plugin. `IK-19` pins it, and a solver reaching the publisher with no root edge throws, which `ik-solver-no-root` is what keeps unreachable.
- **Renderer Shielding**: `renderableValues` skips a value that is still a plain record after serialization, so a composite output such as `rotations` reaches the nodes that read it and never a renderer. Skipping it after serialization is deliberate: a plugin that serializes a composite into something renderable still renders. Without the guard, the default `resolveTarget` sends a solver's patch to the stage, `defaultWriter` falls through to `target[key] = value`, and `stage.rotations` is assigned on every frame forever, because the adapter's own suppression is `Object.is` against a freshly built object and can never match. `IK-16` asserts the object property rather than `style`, which is what the property is set on.

---

## Invariants Preserved

1. **`J-5` Equivalence (ADR-047)**: Every authored `requires` binding maps 1:1 to exactly one `GraphEdge`. No artificial cycles or hidden edges are added.
2. **`TR-R-03` / `TR-R-04` (Single-Pass Purity)**: Composition remains single-pass and deterministic. No node is evaluated twice per tick, and no published values are patched retroactively.
3. **Deterministic Ordering**: Evaluation order is a pure function of qualified IDs and topological dependency structure.
4. **Full Backwards Compatibility**: Existing FK chains and walker rigs compose byte-identical outputs with zero performance penalty.

---

## Alternatives Rejected

1. **S1: Internal Key Chain Accumulation (`fkChain`)**:
   - _Proposal_: Bones accumulate ancestor frames into an internal key passed down the `base` requirement.
   - _Rejected_: Pushes topological chain state down to leaf bones and introduces implicit order couplings across motions.
2. **S2: Multi-Pass Execution / Solver Pre-Pass**:
   - _Proposal_: Execute a separate pre-pass for solvers before normal graph flushes.
   - _Rejected_: Breaks transactional atomicity, complicates rollback, and violates single-pass scheduling guarantees.
3. **Context Injection / Runtime Handles in Plugins**:
   - _Proposal_: Inject `ProjectRuntime` or engine track stores directly into plugin composers.
   - _Rejected_: Gives plugins arbitrary side-effect capability and bypasses the explicit requirement inputs boundary.
4. **A Publisher-Side Solver Cache**:
   - _Proposal_: Keep `#solverCache`, widening its key until it covers the solver's own seed and progress.
   - _Rejected_: The widened key is `Track`'s key. Two caches with two invalidation rules are cheaper per tick and wrong the first time one of them drifts, which is exactly how the narrow key shipped.
5. **Deriving Chains Over Unresolved References**:
   - _Proposal_: Keep `resolveSolvers` ahead of the reference bail, so one build reports every rule a rig breaks.
   - _Rejected_: A derivation over edges whose sources do not resolve reports about a chain that never existed. The second diagnostic names a member for a typo one node up, which is a worse first thing to read than the typo.
6. **Replacing the Closed Form With FABRIK (slice D3)**:
   - _Proposal_: Delete `solveTwoBone` and let one iterative solve answer for every arity.
   - _Rejected_: `IK-1` and `IK-3` pin exact rotations an iterative solve reaches only within a tolerance, and `flip` at arity two is an exact branch rather than a basin, so one solver would move published values for every rig that already solves.

---

## Stagger Semantics

`Motion.#effectiveProgress` calculates timeline progress per track index. If a solver member's length is animated with non-zero stagger, the member's length advances on its own staggered timeline, while the solver reads that length accurately on each tick. This enables natural dynamic effects (such as whips, tentacles, and follow-through) without requiring specialized stagger exceptions.

---

## Evidence

- **Slice A (`FO-1`..`FO-6`)**: `packages/core/test/unit/plugins/fk-pivot-offset.test.ts` (Pivot offsets `x`, `y`).
- **Slice B (`CF-1`..`CF-7`)**: `packages/core/test/unit/domain/track-compose-from.test.ts` (Composition split).
- **Slice C0**: `packages/core/test/unit/graph/finalize-graph.test.ts` (`finalizeGraph` deduplication).
- **Slice C1 (`CN-1`..`CN-3`)**: `packages/core/test/unit/domain/track-node-id.test.ts` (`nodeId` in composer contract).
- **Slice C2 (`RS-1`..`RS-10`)**: `packages/core/test/unit/graph/resolve-solvers.test.ts` (Load-time IK diagnostics, determinism under permutation, derivation from live state alone, the one confined member walk, the scope of the dead-rotation read, and the reference bail).
- **Slice C3 (`IK-1`..`IK-19`)**:
  - `packages/core/test/unit/plugins/ik-solve.test.ts` (Analytical 2-bone solve math, both elbow branches, and the composed-values spread).
  - `packages/core/test/unit/plugins/fk-solver-override.test.ts` (FK rotation override).
  - `packages/core/test/unit/runtime/publisher-solver-members.test.ts` (Publisher member gathering, member scope, failure semantics, and the one memo).
  - `packages/core/test/integration/ik-two-bone.test.ts` (Full 6-node rig integration and renderer shielding).
- **Slice C4**: `packages/core/test/integration/phase7-walker-demo.test.ts` (Hybrid FK/IK walker demo & `T-C4.1` dynamic mutation rollback).
- **Slice D2 (`FB-1`..`FB-8`)**: `packages/core/test/unit/plugins/fabrik-solve.test.ts` (The iterative solve as arithmetic, unwired: the derived seed, the closed-form equivalence, sub-base averaging, permutation determinism, and the two non-convergent exits).
- **Slice D3 (`FB-9`..`FB-15`)**:
  - `packages/core/test/unit/plugins/fabrik-dispatch.test.ts` (The analytic path byte-identical behind the dispatcher, the unpublished convergence record, and the bare-target join).
  - `packages/core/test/unit/graph/arity-lift.test.ts` (Chains past and short of arity two loading, and `ik-target-not-single-leaf`).
  - `packages/core/test/integration/ik-fabrik-chain.test.ts` (A five-bone chain tracking an animated goal, and a two-arm tree solved once).
