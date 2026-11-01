# ADR-122: 3D FABRIK tree solve behind a closed 3D chain-shape union

**Status:** Accepted, 2026-09-27, as part of the public 3D contract
([ADR-125](./ADR-125-public-3d-api.md)); landed through #512 (`main` at `db79cc49`).
Proposed as issue [#500](https://github.com/chahyasantoso/motion5/issues/500) phase 5,
2026-09-26, above `main` at `ef47ba597a7119024dc9f0c7be7797a76b3ef80e` (#511).
**Extended by [ADR-123](./ADR-123-3d-joint-limits.md), 2026-09-27** (phase 6): `ChainShape3d`
gains the `constrained` arm this record deferred; constrained two-member chain takes 3D FABRIK,
not closed form; `derivedStrategy` reads each member's constraining joint beside depth.
**Extended by [ADR-124](./ADR-124-3d-goal-influence-and-end-effector-orientation.md), 2026-09-27**
(phase 7): tree compromise weighs branches by each addressed leaf's `influence` through 2D
`branchPulls`; dispatcher runs end-effector orientation step after either strategy.
**Extended by [ADR-126][adr126], 2026-09-27** (issue #514): shared selector + progress-gated cap
apply limited-chain retry + budget to 3D and 2D; free-chain behavior unchanged.

## Invariant

Internal `ik3d` solver answers every chain of `fk3d` members graph derives: any member count, any branching. Parent and its one addressed child take ADR-114 closed form, publish exactly bytes published before; every other chain takes 3D FABRIK, every leaf tip (composed by `fk3d` from published local triples) at published residual from goal. Chain reports `converged` only when every residual inside `FABRIK_TOLERANCE`; iteration cap bounds work → reachable goal can still end `conflicted` or `iteration-cap` with small residual, not land (see Consequences). Roll reconstructed as minimal swing from each member's rest frame under parent's solved frame → member adds no roll its rest pose did not have. Solve pure function of root, members, pole. Nothing authored accepted that chosen strategy does not read; nothing it reads refused. No 2D byte moves.

## Decision

- **One closed 3D union decides strategy.** `ik3d-solve.ts` states `ChainShape3d` as `two-bone | tree`, read by one exhaustive switch (ADR-092). Own union, not dimension flag on 2D `ChainShape`: 3D has no `constrained` arm until phase 6. Two-bone proof is `ik-topology.ts`'s `twoBonePair`, function 2D dispatcher reads.
- **Contract declares tree.** `contract/solver-shape.ts` replaces `unbranched` with `tree { memberPlugin: "fk3d" }`; `unbranched` deleted because no solver declares it. `ik-chain-unsupported` now refuses any `ik3d` chain containing member bound through plugin other than `fk3d`, 2D `fk` member among them; refuses no count or branching.
- **Shared with 2D only where contract matches.** `ik-topology.ts` owns canonical order, child counts, leaves, serial depth and `twoBonePair`; `ik-goal.ts` generic compromise (`Pull<P>`, `compromiseIn`, `relativeWeights`); `fabrik-select.ts` selector (#490); `fabrik-cap.ts` cap (ADR-115); `ik-scale.ts` magnitude policy. 3D vector and rotation arithmetic one owner, `frame3d.ts` (`dot3`, `cross3`, `normalize3`, `swingFrame3d` and rest), which `ik3d-fabrik.ts`, `ik3d-compromise.ts` and test support read rather than restate.
- **Roll reconstructed inside every outward pass** by `frame3d.ts`'s `swingFrame3d` (minimal Rodrigues swing, half turn about local +z when antiparallel): child's offset read in parent's full frame, roll included (ADR-117).
- **Pole bends seed arc** through `bendBasis3d` (ADR-118); `flip` only selector's opposite seed side, never authored in 3D.
- **Rest orientation tree solve reads is live.** `ik-solved-rotation-dead` refused solver-bound `fk3d` rest orientation with no `weight`, right while closed form only 3D strategy: publishes triples outright. Tree solve reads every member's rest as frame its minimal swing starts from → rest changes pose at every weight; refusal rejected rig whose authored value live. Rule narrowed, not deleted: `contract/solver-shape.ts`'s `readsMemberRest` answers, from derived depths, whether solver's strategy reads rest (`derivedStrategy`: exactly two members at depths 1 and 2 is closed form, every other accepted `tree` chain iterative); binder whose solver does is struck from refusal. Explicit `weight: 1` other defensible design, withdrawn below. `TH-77` measures both halves: tree triples move with rest, closed form's do not.
- **Pole needs interior joint.** Phase 5 admits single member and fan of members hanging straight from root. Each one segment pointing at goal in either strategy → pole bound there bends nothing. Refused at load as `ik-pole-without-bend`, judged by `poleBends` (some member at depth 2 or deeper) beside `ik-chain-unsupported`; `TH-78` measures inertness it names: two opposite poles publish byte-identical solves over both.
- **Load-time strategy restates runtime proof; test holds them equal.** Graph holds no plugin, plugin holds no graph, so `derivedStrategy` reads depths where `twoBonePair` reads ids and goals. `TH-76` enumerates every rooted forest of one to five members (153 shapes), holds two answers equal.
- **One generic result.** `SolveResult3d<Q>` narrowed per strategy; `restoreResult3d` one restoration of power-of-two image. ADR-120 record reads tree solve unchanged.

## What is withdrawn

- Dimension flag on 2D `ChainShape`, `fabrik.ts` or `ik`: every 2D line would change for 3D reason.
- FABRIK for two-bone rigs: closed form exact, is bytes those rigs publish.
- Reconstructing roll once after solve: offsets read through swing-only frame land wrong (`TH-69` counter-check).
- Per-iteration pole constraint: joint limit in all but name, phase 6's to own.
- Explicit `weight` beside tree member's rest orientation: keeps one rule text for both strategies at cost of refusing rig whose rest solve reads — rule answering wrong question to stay uniform.
- Reading rest orientation in closed form: would move every two-bone byte.
- 3D-only iteration cap: shortfall below is slow convergence, study in both dimensions at once.

## Consequences

Rig growing from two members to three changes roll convention (closed form bend plane vs minimal swing from rest); tip placement unaffected. Feasible 3D tree-14 measured 185 `converged`, 13 `conflicted`, 2 `iteration-cap` of 200 at default cap, against 2D's 196, 3 and 1; all 15 converge at 5,000-pass cap (65 to 4,913 passes). Shortfall measured inherent to tree FABRIK in three dimensions, not port defect: planar restriction of 3D solve matches 2D FABRIK on all 200 rigs, zeroing every rest and offset changes no outcome, every seed and compromise variant tried regressed another scenario. No fix taken; cap stays shared with 2D (ADR-115); invariant says `converged` rather than claiming every reachable goal lands. ADR-126 keeps free cap shared with 2D, gives limited chains progress-gated ceiling → extra work not unconditional 4x charge. Rig authoring rest orientation with no weight on solver-bound `fk3d` member now loads under tree solve, still refused under closed form. Nothing 3D exported.

## Evidence

- `TH-76` to `TH-78`: load-time strategy agrees with dispatcher over 153 forests; rest orientation live under tree, dead under closed form; pole over chain with no interior joint refused and measured inert.
- `TH-58` to `TH-70` (closure corpus, planar reduction, purity, pole, magnitude and degeneracies, `swingFrame3d`, selector, inspection kinds, dispatch, per-leaf residuals, roll, rolled offsets, `Engine` scrub), `TH-71` to `TH-74` (3D envelope) and `TH-75` (mutation survivors).
- 2D identity, sandbox: 1,840 solves hash to `7e514e48…fb81` on `ef47ba5` and this change.
- 3D two-bone identity, sandbox: 4,000 closed-form solves hash to `22b3680e…4851` on both trees.
- 3D tree identity, sandbox: 1,380 tree solves (chains, trees, offsets, rests, poles, `2^700` rigs, both seed sides and rules) hash to `7e3cf790…6976` before and after index-based attempt refactor.
- Sandbox mutation pass: 20 mutants, 17 killed, 3 survivors killed by `TH-75`.
- Full suite under sandbox Vitest stand-in: no new failure against `ef47ba5`. Sandbox TypeScript 5.8.3 with stubs for packages it cannot install reports same error set as `ef47ba5`. Reviewed, not trusted; `CI` on pull request head is evidence.

[adr126]: ./ADR-126-limited-fabrik-seed-side-bidirectional-limits-and-pass-budget.md
