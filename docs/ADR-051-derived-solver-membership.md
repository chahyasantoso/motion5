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

Graph finalization (`finalizeGraph`) runs a pure derivation pass, `resolveSolvers`, after reference validation and before topological ordering:

1. **Solver Identification**: Any node with a `root` requirement slot edge is classified as a solver.
2. **Member Discovery**: Any node declaring a `solver` requirement slot edge pointing to solver `S` is collected into `S`'s member list.
3. **Chain Verification**: Each member's `base` ancestor walk is traced. The chain must terminate cleanly at solver `S`'s bound `root` node without leaving the member set.
4. **Deterministic Ordering**: Members are ordered root-most first (depth from root ascending, ties broken by `authoredIndex` and qualified ID).
5. **Frozen Derivation**: Solver nodes are minted with `readonly solves: readonly SolveMember[]`. Non-solver nodes remain untouched.

#### Load-Time IK Diagnostics

The loader enforces structural integrity across 6 deterministic diagnostics (`severity: "error"`):

| Diagnostic Rule ID            | Condition                                                                                       |
| ----------------------------- | ----------------------------------------------------------------------------------------------- |
| `ik-solver-no-root`           | A solver node lacks a bound `root` requirement edge.                                            |
| `ik-solver-no-members`        | A solver node has no member nodes declaring `solver` pointing to it.                            |
| `ik-solver-unreachable-root`  | A member's `base` hierarchy walk fails to terminate at the solver's bound `root`.               |
| `ik-mode-ambiguous`           | A single node binds `solver` alongside `root`/`target`, or binds `root` under multiple plugins. |
| `ik-solved-rotation-dead`     | A bone bound to a `solver` authors a local `rotation` value.                                    |
| `ik-solver-unsupported-arity` | A solver's derived member count is not 2 (two-bone analytical solve).                           |

---

### 3. Pre-Composition Member State Delivery

To supply member lengths to solvers without requirement cycle edges, `Track` separates timeline evaluation from plugin execution (ADR-047 amendment, Slice B):

- `Track.prototype.interpolated()`: Returns renderer-neutral timeline state (`values`, `progress`) prior to plugin composition.
- In `GraphPublisher.flush()`, solver nodes look up their derived `node.solves` members, invoke `memberNode.interpolated()`, and inject the frozen array into `inputs[solvingPlugin].members`.
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

---

### 5. Dirty-Check Memoization and Invalidation Propagation

- **Memoization**: `GraphPublisher` caches solver outputs in `#solverCache` using deep equality (`equalValues`) over both `inputs` and member timeline states (`inputs.ik.members`). If neither the target, root, nor member lengths changed, re-solving is skipped.
- **Seed Propagation**: In the publisher's affected BFS pass, solver members register their solver as a dependent. Invalidating an animated bone's length automatically schedules the solver for re-evaluation.
- **Renderer Shielding**: `createDomPatchAdapter` ignores nested object values (such as `rotations`), ensuring solver nodes contribute zero CSS style mutations to DOM elements.

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

---

## Stagger Semantics

`Motion.#effectiveProgress` calculates timeline progress per track index. If a solver member's length is animated with non-zero stagger, the member's length advances on its own staggered timeline, while the solver reads that length accurately on each tick. This enables natural dynamic effects (such as whips, tentacles, and follow-through) without requiring specialized stagger exceptions.

---

## Evidence

- **Slice A (`FO-1`..`FO-6`)**: `packages/core/test/unit/plugins/fk-pivot-offset.test.ts` (Pivot offsets `x`, `y`).
- **Slice B (`CF-1`..`CF-7`)**: `packages/core/test/unit/domain/track-compose-from.test.ts` (Composition split).
- **Slice C0**: `packages/core/test/unit/graph/finalize-graph.test.ts` (`finalizeGraph` deduplication).
- **Slice C1 (`CN-1`..`CN-3`)**: `packages/core/test/unit/domain/track-node-id.test.ts` (`nodeId` in composer contract).
- **Slice C2 (`RS-1`..`RS-6`)**: `packages/core/test/unit/graph/resolve-solvers.test.ts` (Load-time IK diagnostics).
- **Slice C3 (`IK-1`..`IK-17`)**:
  - `packages/core/test/unit/plugins/ik-solve.test.ts` (Analytical 2-bone solve math).
  - `packages/core/test/unit/plugins/fk-solver-override.test.ts` (FK rotation override).
  - `packages/core/test/unit/runtime/publisher-solver-members.test.ts` (Publisher member gathering & memoization).
  - `packages/core/test/integration/ik-two-bone.test.ts` (Full 6-node rig integration).
- **Slice C4**: `packages/core/test/integration/phase7-walker-demo.test.ts` (Hybrid FK/IK walker demo & `T-C4.1` dynamic mutation rollback).
