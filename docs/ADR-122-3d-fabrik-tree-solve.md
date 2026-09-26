# ADR-122: 3D FABRIK tree solve behind a closed 3D chain-shape union

**Status:** Proposed as issue [#500](https://github.com/chahyasantoso/motion5/issues/500) phase 5,
2026-09-26, above `main` at `ef47ba597a7119024dc9f0c7be7797a76b3ef80e` (#511). Accepted when the
pull request carrying it merges.

## Invariant

An internal `ik3d` solver answers every chain of `fk3d` members the graph derives, of any member
count and any branching. A parent and its one addressed child take the ADR-114 closed form and
publish exactly the bytes they published before; every other chain takes 3D FABRIK, whose tip,
composed by `fk3d` from the published local triples, lands on every reachable goal inside
`FABRIK_TOLERANCE`. Roll is reconstructed as the minimal swing from each member's rest frame under
its parent's solved frame, so a member adds no roll its rest pose did not have. The solve is a pure
function of root, members and pole. No 2D byte moves.

## Decision

- **One closed 3D union decides the strategy.** `ik3d-solve.ts` states `ChainShape3d` as
  `two-bone | tree`, read by one exhaustive switch (ADR-092). It is its own union rather than a
  dimension flag on the 2D `ChainShape`, because 3D has no `constrained` arm until phase 6. The
  two-bone proof is `ik-topology.ts`'s `twoBonePair`, the function the 2D dispatcher reads.
- **The contract declares a tree.** `contract/solver-shape.ts` replaces `unbranched` with
  `tree { memberPlugin: "fk3d" }`; `unbranched` is deleted because no solver declares it.
  `ik-chain-unsupported` now refuses only a mixed-dimension `ik3d` chain.
- **Shared with 2D only where the contract matches.** `ik-topology.ts` owns canonical order, child
  counts, leaves, serial depth and `twoBonePair`; `ik-goal.ts` owns the generic compromise
  (`Pull<P>`, `compromiseIn`, `relativeWeights`); `fabrik-select.ts` the selector (#490);
  `fabrik-cap.ts` the cap (ADR-115); `ik-scale.ts` the magnitude policy. Vector arithmetic stays
  in `ik3d-fabrik.ts` and `ik3d-compromise.ts` over `Vec3`.
- **Roll is reconstructed inside every outward pass** by `frame3d.ts`'s `swingFrame3d` (minimal
  Rodrigues swing, half turn about local +z when antiparallel), because a child's offset is read in
  its parent's full frame, roll included (ADR-117).
- **The pole bends the seed arc** through `bendBasis3d` (ADR-118); `flip` is only the selector's
  opposite seed side, never authored in 3D.
- **One generic result.** `SolveResult3d<Q>` is narrowed per strategy; `restoreResult3d` is the one
  restoration of a power-of-two image. The ADR-120 record reads the tree solve unchanged.

## What is withdrawn

- A dimension flag on 2D `ChainShape`, `fabrik.ts` or `ik`: every 2D line would change for a 3D
  reason.
- FABRIK for two-bone rigs: the closed form is exact and is the bytes those rigs publish.
- Reconstructing roll once after the solve: offsets read through a swing-only frame land wrong
  (`TH-69` is the counter-check).
- A per-iteration pole constraint: it is a joint limit in all but name, phase 6's to own.
- A 3D-only iteration cap: the shortfall below is slow convergence, to be studied in both
  dimensions at once.

## Consequences

A rig growing from two members to three changes roll convention (closed form bend plane versus
minimal swing from rest); tip placement is unaffected. Feasible 3D tree-14 measured 185
`converged`, 13 `conflicted` and 2 `iteration-cap` of 200 at the default cap, against 2D's 196, 3
and 1; all 15 converge at a 5,000-pass cap (65 to 4,913 passes), so it is slow convergence, left
as a follow-up. Nothing 3D is exported.

## Evidence

- `TH-58` to `TH-70` (closure corpus, planar reduction, purity, pole, magnitude and degeneracies,
  `swingFrame3d`, selector, inspection kinds, dispatch, per-leaf residuals, roll, rolled offsets,
  and an `Engine` scrub), `TH-71` to `TH-74` (3D envelope) and `TH-75` (mutation survivors).
- 2D identity, sandbox: 1,840 solves hash to `7e514e48…fb81` on `ef47ba5` and this change.
- 3D two-bone identity, sandbox: 4,000 closed-form solves hash to `22b3680e…4851` on both trees.
- Sandbox mutation pass: 20 mutants, 17 killed, the 3 survivors killed by `TH-75`.
- Full suite under the sandbox Vitest stand-in: no new failure against `ef47ba5`. Reviewed, not
  trusted; the sandbox has no TypeScript, so `CI` on the pull request head is the compiler evidence.
