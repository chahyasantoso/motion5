# ADR-106: One owner per question an IK solve answers

**Status:** Accepted, 2026-09-23. Issue #349 phase 1, squash-merged from [#481](https://github.com/chahyasantoso/motion5/pull/481) as `95bef276`. Phase 2 is [ADR-107](./ADR-107-one-solve-result.md).

**Corrected by ADR-107, then made true by [#482](https://github.com/chahyasantoso/motion5/issues/482).** Invariant below says `segmentExtent` owns length clamp for `fk` and both solves alike. At landing it owned it for `effectiveLink` and both solves while `fk.compose` read authored `length` raw, which ADR-107 recorded. Issue #482 routes `fk.compose` through `segmentExtent` too → line holds as written: `fk.compose`, internal `fk3d`, `effectiveLink`, `solveLength` (read by closed form and FABRIK iteration), FABRIK's `seedArc` and internal 3D closed form all read it, none restates clamp, `IR-11`, `IR-12` and `LV-22` pin it, `segmentExtent` keeps signed zero (`length < 0 ? 0 : length`) → no published `-0` moves.

## Invariant

Each question `ik` solve answers has exactly one owning module under `packages/core/src/plugins/`, and every solve strategy reads chain member through one read model:

- `ik-member.ts` owns `SolveMember`, record every strategy reads, and two readings every strategy shares: `solveLength` (authored length, never negative, read through `frame.ts`'s `segmentExtent`, which owns that clamp for `fk` and both solves alike) and `solveOffset` (authored pivot offset, absent read as shared frozen zero).
- `ik-chain.ts` owns slot adaptation and topology: `DeliveredMember`, joined solver member `members` slot delivers (runtime's `SolverMember`, restated because plugin does not import runtime), `readMembers`, private `chainLeaves`, `readGoals` over both goal spellings, `readSolveMembers`, one adapter from delivered member states to `SolveMember`.
- `ik-solve.ts` owns strategy selection: `ChainShape`, closed union with variants `two-bone` and `tree`, derived by `chainShape`, and `solveChain`, reading it with `switch` ending in `unreachable`.
- `ik-analytic.ts` owns closed form (`solveTwoBone`), `fabrik.ts` owns iterative solve (`solveFabrik`). Neither reads authored record.
- `ik.ts` owns `PluginDefinition` and wiring from its slots to modules above, exports `ikPlugin` only.

Published behavior unchanged: every rig publishes same doubles, same keys in same order, same frozen records, throws same messages in same order as on `main` at `b609fbda`.

**Amended by [ADR-109](./ADR-109-opt-in-solve-inspection.md), 2026-09-24.** Unchanged-publication claim above covers this extraction, still holds for every rig without ADR-109 inspection opt-in. Author writing static `inspect: true` on solver gets additional `inspection` output ADR-109 defines; unopted solver path stays byte-identical.

**Amended by [ADR-110](./ADR-110-goal-influence-and-conflict-policy.md), 2026-09-24.** Delivery order item 5 now recorded by ADR-110: goal influence belongs to goal module, weighted compromise explicit, unweighted rig retains phase 4 rotations bit for bit.

**Amended by [ADR-111](./ADR-111-stability-and-determinism.md), 2026-09-24.** Delivery order item 6 now recorded by ADR-111: solve total over finite rigs, order-free and pure, every rig in ordinary range keeps bytes above. Closed form now receives pair proven from `base` relation rather than by position, so "the dispatcher proves the pair" below holds for member order as well as arity. `ChainShape` has third variant, `constrained`, since ADR-108, so two-variant union in invariant above describes phase 1, not code.

## Why now

Issue #349's study and implementation plan in its first comment both find `ik.ts` answered four questions at once (slot adaptation, chain topology, solver selection, closed form's arithmetic), and every capability study ranks (constraints, inspection, goal policy, 3D seam) adds code to at least two of them. Constraints especially → limit policy beside arithmetic that consumes it, and limit enforced by two owners always disagrees on case nobody tests. Extraction is therefore first phase, ships alone with own evidence, before any feature needs it.

## Decisions

**A closed union, not an open strategy registry.** Plan on issue proposed `SolveStrategy` port with `accepts(shape)` plus ordered registry. Withdrawn in favour of `ChainShape` read exhaustively. Registry's try-order is second, implicit dispatch rule → "which strategy answers this chain" has as many owners as registrations, exactly predicate chain [ADR-092](./ADR-092-reading-a-closed-union-is-exhaustive.md) and standing instructions in `AGENTS.md` refuse. Nothing outside `plugins/` registers strategy → open extension point buys nothing new variant does not, and new variant fails to compile at one `switch` that must answer it. ADR-051's rule "no rig chooses its own solver" kept: shape derived, never authored.

**The closed form takes its two members as two parameters.** `solveTwoBone(root, target, first, second, flip)`, not array indexed on trust. Dispatcher proves pair and hands it over → arity decision has one owner, strategy has no `!`. Tuple parameter considered and rejected: fixture declared as array literal infers array type, not tuple → every call site would annotate type to say nothing.

**Goals are joined onto members before dispatch.** `solveChain` takes `readonly SolveMember[]` with each addressed leaf carrying `goal`, not members plus separate goal map. `readGoals` still normalises both spellings into one map keyed by member id, and since every key is member id join loses nothing; goal count `chainShape` reads is that map's size by construction. One argument, not two that must agree.

**The degenerate cases of the closed form are one table.** Four zero-extent early returns in `solveTwoBone` now two guarded pairs plus coincident-target pair, returned through one frozen record. First and third old returns were same expression; early `l2 <= 0` covers both because old order tested `reach <= 0 && l2 <= 0` before `reach <= 0` alone.

**`FabrikMember` is deleted, not aliased.** `SolveMember` has its exact shape and docblock; second name for one type = second owner of read model. ADR-054's consequence naming `FabrikMember.pivot` now names `SolveMember.pivot`.

**One owner for a negative length.** `Math.max(0, length)` restated in closed form, twice in FABRIK's seed, once more in FABRIK's solve, and in `frame.ts`'s `effectiveLink`, which `fk` composes through. Now `segmentExtent` in `frame.ts`, beside kinematic convention it belongs to; `solveLength`, `seedArc` and `effectiveLink` all read it.

**The delivered member is `DeliveredMember`, not `MemberState`.** Old `ik.ts` declared own `MemberState` with `base` and `goal`; runtime's `MemberState` has neither, its joined shape is `SolverMember`. One name for two shapes sent reader to wrong owner → `ik-chain.ts` names restated shape for what it is to plugin.

**The stale header in `fabrik.ts` is corrected in the slice that touches the file.** Called module unwired; dispatcher imported it since issue #195's slice D3.

**Withdrawn from the plan: a shared `reachBand`.** Plan said reachability band `[|reach - l2|, reach + l2]` stated twice, once in closed form, once in iterative path. Re-read at `b609fbda`, `fabrik.ts` states no such band; FABRIK reaches bound by enforcing lengths outward. Band has one caller → extracting now = module for one line. Phase 2 extracts it if reachability report needs band on both paths.

**Public surface narrows, deliberately.** `@motion5/core/plugins/ik` exported `readMembers`, `readGoals`, `solveTwoBone`, `solveChain`, `MemberState` (now `DeliveredMember` in `ik-chain.ts`) and `BaseFrame` beside `ikPlugin`. Now exports `ikPlugin` only. No app, package entry or document consumed others; `BaseFrame` was alias of `WorldFrame` with nothing to add. Tests import each owner directly.

## Delivery order after this record

Replanned against `b609fbda`; each phase one pull request with own invariant and evidence. Issue #349's first delivery step, exercising rest weights in playground, already landed in #351.

1. This record: one owner per question, byte-identical output.
2. One solve result. Both strategies return one `SolveResult` carrying rotations and total quality record (reachability, residual, iterations, stall reason) as closed union read exhaustively, closed form reporting reachability its clamp already computes. Nothing new published.
3. Constrained 2D solving, own ADR: declared local angle limits and bend hint, enforced inside solve by one owner both strategies call; empty range refused at load by name; `flip` kept as degenerate spelling of `bend` under named conflict rule. `ChainShape` gains variant routing constrained chains.
4. Opt-in inspection, own ADR because it changes ADR-051's per-tick diagnostic policy rather than extending it: authored key produces declared output, numerical residual belongs to `ik`, visible tip gap at partial weight belongs to `fk`.
5. Goal intent and conflict policy: per-goal influence owned by goal module, never member `weight`; branch averaging stated as weighted rule with documented infeasible outcome.
6. Stability and determinism evidence: property cases for singularities, branch switches, root coincidence, angle wrap, near-full extension; stated purity makes reverse scrub and random seek reproduce forward pass byte for byte.
7. Envelope and documentation: benchmarks with recorded conditions, coordinate conventions, scale policy, validation error list, guide demos.
8. 3D seam as prototype: separate `ik3d` and `fk3d` entry points reusing `ik-chain.ts` topology and goal addressing, dimension-specific frame math beside `frame.ts`, not unions inside it.

## Evidence

Byte identity measured, not argued: 200,000 seeded random rigs of one to six members, branching and linear, authored lengths and offsets drawn from finite, zero, negative-zero, negative, non-finite and non-number values, under both goal spellings, missing goals and empty member lists, composed through `ikPlugin` built from `main` at `b609fbda` and through this record's `ikPlugin`. Every published rotation compared equal under `Object.is`, key order and freezing matched, 38,068 throwing inputs threw same message on both. Script and exact output in pull request body; not a committed test because it compares against source that no longer exists after merge. Existing solve cases (`IK-*`, `FB-*`, `PV-*`, `WT-*`) migrated to new owners with every numeric assertion unchanged; `ik-chain-shape.test.ts` adds `CS-1` onwards for dispatch union and adapter.

## Consequences

Constraint, inspection output or 3D strategy now lands in owner of question it answers. Cost: four new files, each under 7,000 bytes, and `fabrik.ts` drops below previous size → stays clear of 30,000-byte sister-document line constrained solving would otherwise cross.
