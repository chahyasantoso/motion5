# ADR-122: 3D FABRIK tree solve behind a closed 3D chain-shape union

**Status:** Proposed as issue [#500](https://github.com/chahyasantoso/motion5/issues/500) phase 5,
2026-09-26, above `main` at `ef47ba597a7119024dc9f0c7be7797a76b3ef80e` (#511). Accepted when the
pull request carrying it merges. **Extended by [ADR-123](./ADR-123-3d-joint-limits.md),
2026-09-27** (phase 6): `ChainShape3d` gains the `constrained` arm this record deferred, a
constrained two-member chain takes 3D FABRIK rather than the closed form, and `derivedStrategy`
reads each member's constraining joint beside its depth. **Extended by
[ADR-124](./ADR-124-3d-goal-influence-and-end-effector-orientation.md), 2026-09-27** (phase 7): the tree compromise weighs
its branches by each addressed leaf's `influence` through the 2D `branchPulls`, and the dispatcher
runs the end-effector orientation step after either strategy.

## Invariant

An internal `ik3d` solver answers every chain of `fk3d` members the graph derives, of any member
count and any branching. A parent and its one addressed child take the ADR-114 closed form and
publish exactly the bytes they published before; every other chain takes 3D FABRIK, whose every
leaf tip, composed by `fk3d` from the published local triples, lies at the published residual from
its goal. A chain reports `converged` only when every residual is inside `FABRIK_TOLERANCE`; the
iteration cap bounds the work, so a reachable goal can still end the solve `conflicted` or
`iteration-cap` with a small residual rather than landing (see Consequences). Roll is reconstructed
as the minimal swing from each member's rest frame under its parent's solved frame, so a member
adds no roll its rest pose did not have. The solve is a pure function of root, members and pole.
Nothing authored is accepted that the chosen strategy does not read, and nothing it reads is
refused. No 2D byte moves.

## Decision

- **One closed 3D union decides the strategy.** `ik3d-solve.ts` states `ChainShape3d` as
  `two-bone | tree`, read by one exhaustive switch (ADR-092). It is its own union rather than a
  dimension flag on the 2D `ChainShape`, because 3D has no `constrained` arm until phase 6. The
  two-bone proof is `ik-topology.ts`'s `twoBonePair`, the function the 2D dispatcher reads.
- **The contract declares a tree.** `contract/solver-shape.ts` replaces `unbranched` with
  `tree { memberPlugin: "fk3d" }`; `unbranched` is deleted because no solver declares it.
  `ik-chain-unsupported` now refuses any `ik3d` chain containing a member bound through a plugin
  other than `fk3d`, a 2D `fk` member among them, and no count or branching.
- **Shared with 2D only where the contract matches.** `ik-topology.ts` owns canonical order, child
  counts, leaves, serial depth and `twoBonePair`; `ik-goal.ts` owns the generic compromise
  (`Pull<P>`, `compromiseIn`, `relativeWeights`); `fabrik-select.ts` the selector (#490);
  `fabrik-cap.ts` the cap (ADR-115); `ik-scale.ts` the magnitude policy. 3D vector and rotation
  arithmetic has one owner, `frame3d.ts` (`dot3`, `cross3`, `normalize3`, `swingFrame3d` and the
  rest), which `ik3d-fabrik.ts`, `ik3d-compromise.ts` and the test support read rather than restate.
- **Roll is reconstructed inside every outward pass** by `frame3d.ts`'s `swingFrame3d` (minimal
  Rodrigues swing, half turn about local +z when antiparallel), because a child's offset is read in
  its parent's full frame, roll included (ADR-117).
- **The pole bends the seed arc** through `bendBasis3d` (ADR-118); `flip` is only the selector's
  opposite seed side, never authored in 3D.
- **A rest orientation the tree solve reads is live.** `ik-solved-rotation-dead` refused a
  solver-bound `fk3d` rest orientation with no `weight`, which was right while the closed form was
  the only 3D strategy: it publishes its triples outright. The tree solve reads every member's rest
  as the frame its minimal swing starts from, so there the rest changes the pose at every weight
  and the refusal rejected a rig whose authored value is live. The rule is narrowed rather than
  deleted: `contract/solver-shape.ts`'s `readsMemberRest` answers, from the derived depths, whether
  the solver's strategy reads the rest (`derivedStrategy`: exactly two members at depths 1 and 2 is
  the closed form, every other accepted `tree` chain is iterative), and a binder whose solver does
  is struck from the refusal. Requiring an explicit `weight: 1` was the other defensible design and
  is withdrawn below. `TH-77` measures both halves: the tree solve's triples move with the rest and
  the closed form's do not.
- **A pole needs an interior joint.** Phase 5 admits a single member and a fan of members hanging
  straight from the root. Each is one segment pointing at its goal in either strategy, so a pole
  bound there bends nothing. It is refused at load as `ik-pole-without-bend`, judged by
  `poleBends` (some member at depth 2 or deeper) beside `ik-chain-unsupported`, and `TH-78`
  measures the inertness it names: two opposite poles publish byte-identical solves over both.
- **The load-time strategy restates the runtime proof, and a test holds them equal.** The graph
  holds no plugin and a plugin holds no graph, so `derivedStrategy` reads depths where
  `twoBonePair` reads ids and goals. `TH-76` enumerates every rooted forest of one to five members
  (153 shapes) and holds the two answers equal.
- **One generic result.** `SolveResult3d<Q>` is narrowed per strategy; `restoreResult3d` is the one
  restoration of a power-of-two image. The ADR-120 record reads the tree solve unchanged.

## What is withdrawn

- A dimension flag on 2D `ChainShape`, `fabrik.ts` or `ik`: every 2D line would change for a 3D
  reason.
- FABRIK for two-bone rigs: the closed form is exact and is the bytes those rigs publish.
- Reconstructing roll once after the solve: offsets read through a swing-only frame land wrong
  (`TH-69` is the counter-check).
- A per-iteration pole constraint: it is a joint limit in all but name, phase 6's to own.
- Requiring an explicit `weight` beside a tree member's rest orientation: it keeps one rule text
  for both strategies at the cost of refusing a rig whose rest the solve reads, which is the rule
  answering the wrong question to stay uniform.
- Reading the rest orientation in the closed form: it would move every two-bone byte.
- A 3D-only iteration cap: the shortfall below is slow convergence, to be studied in both
  dimensions at once.

## Consequences

A rig growing from two members to three changes roll convention (closed form bend plane versus
minimal swing from rest); tip placement is unaffected. Feasible 3D tree-14 measured 185
`converged`, 13 `conflicted` and 2 `iteration-cap` of 200 at the default cap, against 2D's 196, 3
and 1; all 15 converge at a 5,000-pass cap (65 to 4,913 passes). The shortfall is measured as
inherent to tree FABRIK in three dimensions rather than a port defect: the planar restriction of
the 3D solve matches 2D FABRIK on all 200 rigs, zeroing every rest and offset changes no outcome,
and every seed and compromise variant tried regressed another scenario. No fix is taken; the
cap stays shared with 2D (ADR-115), and the invariant above says `converged` rather than claiming
every reachable goal lands. A rig that authored a rest orientation with no weight on a solver-bound
`fk3d` member now loads under a tree solve and is still refused under the closed form. Nothing 3D
is exported.

## Evidence

- `TH-76` to `TH-78`: the load-time strategy agrees with the dispatcher over 153 forests, the rest
  orientation is live under the tree solve and dead under the closed form, and a pole over a chain
  with no interior joint is refused and measured inert.
- `TH-58` to `TH-70` (closure corpus, planar reduction, purity, pole, magnitude and degeneracies,
  `swingFrame3d`, selector, inspection kinds, dispatch, per-leaf residuals, roll, rolled offsets,
  and an `Engine` scrub), `TH-71` to `TH-74` (3D envelope) and `TH-75` (mutation survivors).
- 2D identity, sandbox: 1,840 solves hash to `7e514e48…fb81` on `ef47ba5` and this change.
- 3D two-bone identity, sandbox: 4,000 closed-form solves hash to `22b3680e…4851` on both trees.
- 3D tree identity, sandbox: 1,380 tree solves (chains, trees, offsets, rests, poles, `2^700`
  rigs, both seed sides and rules) hash to `7e3cf790…6976` before and after the index-based
  attempt refactor.
- Sandbox mutation pass: 20 mutants, 17 killed, the 3 survivors killed by `TH-75`.
- Full suite under the sandbox Vitest stand-in: no new failure against `ef47ba5`. Sandbox
  TypeScript 5.8.3 with stubs for packages it cannot install reports the same error set as
  `ef47ba5`. Reviewed, not trusted; `CI` on the pull request head is the evidence.
