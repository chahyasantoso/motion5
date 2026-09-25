# ADR-106: One owner per question an IK solve answers

**Status:** Accepted, 2026-09-23. Issue #349 phase 1, squash-merged from [#481](https://github.com/chahyasantoso/motion5/pull/481) as `95bef276`. Phase 2 is [ADR-107](./ADR-107-one-solve-result.md).

**Corrected by ADR-107, then made true by [#482](https://github.com/chahyasantoso/motion5/issues/482).** The invariant below says `segmentExtent` owns the length clamp for `fk` and both solves alike. When this record landed it owned it for `effectiveLink` and both solves while `fk.compose` read an authored `length` raw, which ADR-107 recorded. Issue #482 routes `fk.compose` through `segmentExtent` as well, so the line holds as written: `fk.compose`, `effectiveLink`, `solveLength` and FABRIK's `seedArc` are its four readers, `IR-11`, `IR-12` and `LV-22` pin it, and `segmentExtent` keeps a signed zero (`length < 0 ? 0 : length`) so no published `-0` moves.

## Invariant

Each question an `ik` solve answers has exactly one owning module under `packages/core/src/plugins/`, and every solve strategy reads a chain member through one read model:

- `ik-member.ts` owns `SolveMember`, the record every strategy reads, and the two readings of it every strategy shares: `solveLength` (the authored length, never negative, read through `frame.ts`'s `segmentExtent`, which owns that clamp for `fk` and both solves alike) and `solveOffset` (the authored pivot offset, absent read as the shared frozen zero).
- `ik-chain.ts` owns slot adaptation and topology: `DeliveredMember`, the joined solver member the `members` slot delivers (the runtime's `SolverMember`, restated because a plugin does not import the runtime), `readMembers`, the private `chainLeaves`, `readGoals` over both goal spellings, and `readSolveMembers`, the one adapter from delivered member states to `SolveMember`.
- `ik-solve.ts` owns strategy selection: `ChainShape`, a closed union with the variants `two-bone` and `tree`, derived by `chainShape`, and `solveChain`, which reads it with a `switch` that ends in `unreachable`.
- `ik-analytic.ts` owns the closed form (`solveTwoBone`) and `fabrik.ts` owns the iterative solve (`solveFabrik`). Neither reads an authored record.
- `ik.ts` owns the `PluginDefinition` and the wiring from its slots to the modules above, and exports `ikPlugin` only.

Published behavior is unchanged: every rig publishes the same doubles, the same keys in the same order, the same frozen records, and throws the same messages in the same order as it did on `main` at `b609fbda`.

**Amended by [ADR-109](./ADR-109-opt-in-solve-inspection.md), 2026-09-24.** The unchanged-publication claim above is about this extraction and still holds for every rig without the ADR-109 inspection opt-in. An author who writes the static `inspect: true` on a solver receives the additional `inspection` output ADR-109 defines, and the unopted solver path remains byte-identical.

**Amended by [ADR-110](./ADR-110-goal-influence-and-conflict-policy.md), 2026-09-24.** Delivery
order item 5 is now recorded by ADR-110: goal influence belongs to the goal module, the weighted
compromise is explicit, and an unweighted rig retains phase 4 rotations bit for bit.

**Amended by [ADR-111](./ADR-111-stability-and-determinism.md), 2026-09-24.** Delivery order item 6
is now recorded by ADR-111: the solve is total over finite rigs, order-free and pure, and every rig
in the ordinary range keeps the bytes above. The closed form now receives its pair proven from the
`base` relation rather than by position, so "the dispatcher proves the pair" below is true of member
order as well as arity. `ChainShape` has had a third variant, `constrained`, since ADR-108, so
the two-variant union in the invariant above describes phase 1 rather than the code.

## Why now

Issue #349's study and the implementation plan in its first comment both find that `ik.ts` answered four questions at once (slot adaptation, chain topology, solver selection, and the closed form's arithmetic) and that every capability the study ranks (constraints, inspection, goal policy, a 3D seam) adds code to at least two of them. Constraints in particular would otherwise put a limit policy beside the arithmetic that consumes it, and a limit enforced by two owners is guaranteed to disagree on the case nobody tests. The extraction is therefore the first phase and ships alone, with its own evidence, before any feature needs it.

## Decisions

**A closed union, not an open strategy registry.** The plan on the issue proposed a `SolveStrategy` port with `accepts(shape)` plus an ordered registry. It is withdrawn in favour of `ChainShape` read exhaustively. A registry's try-order is a second, implicit dispatch rule, which gives "which strategy answers this chain" as many owners as registrations, and it is exactly the predicate chain [ADR-092](./ADR-092-reading-a-closed-union-is-exhaustive.md) and the standing instructions in `AGENTS.md` refuse. Nothing outside `plugins/` registers a strategy, so the open extension point buys nothing a new variant does not, and a new variant fails to compile at the one `switch` that must answer it. ADR-051's rule that no rig chooses its own solver is kept: the shape is derived, never authored.

**The closed form takes its two members as two parameters.** `solveTwoBone(root, target, first, second, flip)` rather than an array it indexes on trust. The dispatcher proves the pair and hands it over, so the arity decision has one owner and the strategy has no `!`. A tuple parameter was considered and rejected because a fixture declared as an array literal infers an array type, not a tuple, which would have made every call site annotate a type to say nothing.

**Goals are joined onto members before dispatch.** `solveChain` takes `readonly SolveMember[]` with each addressed leaf carrying `goal`, rather than members plus a separate goal map. `readGoals` still normalises both spellings into one map keyed by member id, and because every key is a member id the join loses nothing; the goal count `chainShape` reads is that map's size by construction. One argument instead of two that must agree.

**The degenerate cases of the closed form are one table.** The four zero-extent early returns in `solveTwoBone` are now two guarded pairs plus the coincident-target pair, returned through one frozen record. The first and third of the old returns were the same expression, and an early `l2 <= 0` covers both because the old order tested `reach <= 0 && l2 <= 0` before `reach <= 0` alone.

**`FabrikMember` is deleted, not aliased.** `SolveMember` has its exact shape and its docblock, and a second name for one type would be a second owner of the read model. ADR-054's consequence that named `FabrikMember.pivot` now names `SolveMember.pivot`.

**One owner for a negative length.** `Math.max(0, length)` was restated in the closed form, twice in FABRIK's seed, once more in FABRIK's solve, and in `frame.ts`'s `effectiveLink`, which `fk` composes through. It is now `segmentExtent` in `frame.ts`, beside the kinematic convention it is part of, and `solveLength`, `seedArc` and `effectiveLink` all read it.

**The delivered member is `DeliveredMember`, not `MemberState`.** The old `ik.ts` declared its own `MemberState` with `base` and `goal`, while the runtime's `MemberState` has neither and its joined shape is `SolverMember`. One name for two shapes sent a reader to the wrong owner, so `ik-chain.ts` names the restated shape for what it is to the plugin.

**The stale header in `fabrik.ts` is corrected in the slice that touches the file.** It called the module unwired; the dispatcher has imported it since issue #195's slice D3.

**Withdrawn from the plan: a shared `reachBand`.** The plan said the reachability band `[|reach - l2|, reach + l2]` is stated twice, once in the closed form and once in the iterative path. Re-read at `b609fbda`, `fabrik.ts` states no such band; FABRIK reaches its bound by enforcing lengths outward. The band has one caller, so extracting it now would be a module for one line. Phase 2 extracts it if its reachability report needs the band on both paths.

**Public surface narrows, deliberately.** `@motion5/core/plugins/ik` exported `readMembers`, `readGoals`, `solveTwoBone`, `solveChain`, `MemberState` (now `DeliveredMember` in `ik-chain.ts`) and `BaseFrame` beside `ikPlugin`. It now exports `ikPlugin` only. No app, package entry or document consumed the others, and `BaseFrame` was an alias of `WorldFrame` with nothing to add. Tests import each owner directly.

## Delivery order after this record

Replanned against `b609fbda`, and each phase is one pull request with its own invariant and evidence. Issue #349's first delivery step, exercising rest weights in the playground, already landed in #351.

1. This record: one owner per question, byte-identical output.
2. One solve result. Both strategies return one `SolveResult` carrying rotations and a total quality record (reachability, residual, iterations, stall reason) as a closed union read exhaustively, with the closed form reporting the reachability its clamp already computes. Nothing new is published.
3. Constrained 2D solving, with its own ADR: declared local angle limits and a bend hint, enforced inside the solve by one owner both strategies call, an empty range refused at load by name, and `flip` kept as the degenerate spelling of `bend` under a named conflict rule. `ChainShape` gains the variant that routes constrained chains.
4. Opt-in inspection, with its own ADR because it changes ADR-051's per-tick diagnostic policy rather than extending it: an authored key produces a declared output, numerical residual belongs to `ik`, and the visible tip gap at partial weight belongs to `fk`.
5. Goal intent and conflict policy: per-goal influence owned by the goal module, never by member `weight`, and branch averaging stated as a weighted rule with a documented infeasible outcome.
6. Stability and determinism evidence: property cases for singularities, branch switches, root coincidence, angle wrap and near-full extension, and the stated purity that makes reverse scrub and random seek reproduce the forward pass byte for byte.
7. Envelope and documentation: benchmarks with recorded conditions, coordinate conventions, scale policy, the validation error list, and guide demos.
8. The 3D seam as a prototype: separate `ik3d` and `fk3d` entry points reusing `ik-chain.ts` topology and goal addressing, with dimension-specific frame math beside `frame.ts` rather than unions inside it.

## Evidence

Byte identity was measured, not argued: 200,000 seeded random rigs of one to six members, branching and linear, with authored lengths and offsets drawn from finite, zero, negative-zero, negative, non-finite and non-number values, under both goal spellings, missing goals and empty member lists, were composed through the `ikPlugin` built from `main` at `b609fbda` and through this record's `ikPlugin`. Every published rotation compared equal under `Object.is`, key order and freezing matched, and the 38,068 inputs that throw threw the same message on both. The script and its exact output are in the pull request body; it is not a committed test because it compares against source that no longer exists after merge. The existing solve cases (`IK-*`, `FB-*`, `PV-*`, `WT-*`) are migrated to the new owners with every numeric assertion unchanged, and `ik-chain-shape.test.ts` adds `CS-1` onwards for the dispatch union and the adapter.

## Consequences

A constraint, an inspection output or a 3D strategy now lands in the owner of the question it answers. The cost is four new files, each under 7,000 bytes, and `fabrik.ts` drops below its previous size, which keeps it clear of the 30,000-byte sister-document line constrained solving would otherwise cross.
