# ADR-053: The solver chain contract is enforced at load, not at composition

**Status:** Accepted, 2026-08-29

**Supersedes nothing.** Extends [ADR-051](./ADR-051-derived-solver-membership.md), which owns how a solver finds its bones, and [ADR-052](./ADR-052-goal-addressing-by-member-id.md), which owns how it is told what to reach for. This record owns two shapes those two left reachable: a solver with nothing to reach for, and a member whose pivot neither solve accounts for.

## Context

Both shapes come out of the review of `feat/d-base` against the consolidated slice D plan, and they fail the same way. Neither errors at load, and both were only noticed downstream of the loader that could have named them.

**A solver with a root, members, and no goal loaded clean.** `ik-leaf-without-goal` is guarded by the goal dict having been used at all, because a bare `target` names no member and has no leaf to be missing, and the bare slot is a separate read. The one shape that binds neither therefore met no rule: `resolveSolvers` derived its chain, `orderGraph` linearised it, and `solveChain` threw on an empty goal map on the first tick and every tick after it. The solver published `error`, every member of it published `blocked-upstream`, and every descendant of those blocked behind them, once per frame, for a shape that is a pure function of the authored document. ADR-052 already documents that a no-goal solver is refused at load, so the implementation contradicted its own record, which is the one documentation failure worse than no documentation.

**Neither solve accounts for a member's pivot offset.** Slice A gave `fk` an authored `x` and `y`, read in the base's rotated space, so a bone composes its pivot at that offset and then extends by `length`. Both solves were written against the geometry that preceded it: `solveTwoBone` reads `length` off each member and measures from the root's own frame, and `fabrikMembers` hands the iterative solve a length and a `base` per member and nothing else. A member with a non-zero offset therefore composes a tip displaced from the one the solve placed, and the chain misses its goal by exactly that vector, with a `ready` patch and no diagnostic anywhere. That is silent wrongness rather than a failure, which is the class this project refuses everywhere else.

## Decision

### A solver with no goal is refused at load

`ik-solver-no-goal`, in `resolveSolvers`, beside `ik-solver-no-root` and `ik-solver-no-members`. It fires when a solver binds neither the bare `target` slot nor a single goal through the dict, and it is about absence rather than about spelling: either spelling satisfies it, because `target` is exactly the degenerate case of the dict and neither is deprecated.

The throw inside `solveChain` stays exactly as it is, and becomes what `readMembers`' throw already is: the invariant guard behind a named rule rather than the first owner to notice. A composition that reaches it is a publisher invariant violation, not an authoring mistake, and answering with the seed pose instead would publish a rig reaching for nothing with status `ready`.

It reports without skipping the rest of the derivation, unlike the two refusals it sits beside. A goal-less solver still has a derivable chain, so a broken one is worth naming in the same pass rather than one run later. It cannot report beside `ik-leaf-without-goal`: that rule needs the dict to have been used, and this one needs it not to have been, so one absence is never two diagnostics.

### A solved member's pivot sits on its base's tip

`ik-solved-pivot-unsupported` refuses an authored non-zero `x` or `y` on a member bound to a solver, naming the keys it found in one diagnostic per member rather than one per key.

By value rather than by presence, which is the one difference between it and `ik-solved-rotation-dead` beside it. An authored zero composes exactly the frame an unauthored pivot composes, so refusing it would refuse a rig that is already right; a ramp that never leaves zero is read the same way. A solved rotation, by contrast, is replaced whatever it was, so authoring one at all is dead input.

Scoped to the group that bound `solver`, which is the scope `RS-9` pins for the dead rotation. A solve answers for the plugin that asked for it, so a key under any other group is that plugin's own live input, and a flat key names no group at all in a layer that holds no registry.

**Both solve paths share this convention rather than holding one each,** and the loader is where that is guaranteed. Enforcing it at load means neither `solveTwoBone` nor `solveFabrik` needs a line and neither can drift from the other, and it means the refusal is a property of the rig rather than of the arity that happens to dispatch it. A convention that held at arity two and not above it would be the arity-dependent meaning that killed reviving a member's authored `rotation` as a FABRIK seed.

### One reader per authored question

Both rules exist because two readers of one question had already drifted, so each lands with its readers merged rather than beside them.

`goalBindingsOf` returns the bare slot and the dict entries together, and four callers read it: `ik-mode-ambiguous` needs to know whether a node bound a goal at all, `ik-goal-conflict` needs both spellings, `ik-solver-no-goal` needs neither of them, and the chain derivation needs every dict entry with its authored key. Two of those used to read the literal `"target"` in one loop while the grammar was read in another, which is exactly how a member binding `solver` beside a goal dict loaded clean with every one of its goals ignored.

`authoredByBinders` generalises `authorsSolvedRotation` to a key, so the dead rotation and the pivot offset ask one function which group bound the solver, and it reads `readPluginValues` rather than reaching into a group itself, so what a `values` section is keeps its single owner.

## Alternatives rejected

1. **Incorporating the pivot offsets into both solves now.** The analytic case is tractable and the tree case is not, and shipping half of it would be the two conventions this record exists to prevent. For a two-bone chain the first pivot is fixed once the root frame is known, and the link from it to the second pivot is rigid: a length of `hypot(l1 + x2, y2)` at a fixed twist of `atan2(y2, l1 + x2)` from the first bone's own direction, so the closed form survives with the twist subtracted from one angle and added to the other. FABRIK generalises the same way over pivots rather than tips for a linear chain, and stops generalising at a branch: a sub-base carries a different twist per child, so the averaged inward pass has no single direction to recover. That is a geometry change to both solves, it moves the numbers `IK-1`, `IK-3` and every `FB-` tolerance pin, and it is its own slice with its own evidence.
2. **Refusing the offsets for the iterative path only.** Two conventions for one authored key, decided by a derived member count the author never wrote. The review asked for one convention across both paths for this reason.
3. **Documenting the offsets as unsupported without refusing them.** A field accepted and then ignored, which is what rule 6 of [ADR-033](./ADR-033-no-manual-trigger-fallback.md) forbids, and the silent miss is the whole finding.
4. **Guarding the offsets in `readMembers` instead of at load.** The plugin reads a member's composed value namespace, which is flat, so it cannot see which group authored a key. It would refuse an `x` authored under `transform` that the load rule accepts, and two owners answering one question differently is precisely the drift that had two copies of `readNumber` disagreeing about `length: NaN`. The load rule is the only owner that can see the authored group.
5. **Refusing the presence of `x` or `y` rather than a non-zero value.** Cheaper to implement and it re-authors rigs that are already correct, including any bone that spells its zeros out for symmetry with its siblings.
6. **Reading every group and the flat level for the pivot.** Wider than the scope `RS-9` pins for the dead rotation, and it would have this rule answering for a plugin it knows nothing about. The residual gap is stated as a cost below rather than closed by a wide read.
7. **Leaving the no-goal refusal to the throw.** A shape the loader can name should never be a per-tick composition error, and the throw's own message names a publisher invariant rather than an authoring mistake, so the author is told about the wrong layer.

## Consequences, stated as costs

1. **A solved member cannot carry a pivot offset at all.** The two keys stay fully available everywhere else, including on the chain root and on every bone below the chain, which is where the walker rig already uses them: its shoulder hangs off the pelvis at `y: -50` and is the arm solver's root, not one of its members. No fixture, demo, or playground rig is re-authored by either rule.
2. **The narrow scope leaves one gap, and it is named rather than discovered.** `fk` composes its pivot from the flattened value namespace, so an `x` authored under a group that did not bind `solver` still reaches it and is still unaccounted for by the solve. Accepted for consistency with `ik-solved-rotation-dead`, which `RS-9` pins at the same scope for the same reason, and closing it needs the wide read alternative 6 rejects.
3. **`PIVOT_KEYS` puts two of `fk`'s key names in the graph layer,** beside the `rotation` that was already there. This layer holds no plugin registry by design, so a kinematic key it reads is a literal or nothing.
4. **Two rules for two adjacent absences.** `ik-solver-no-goal` and `ik-leaf-without-goal` both say a chain has nothing to reach for, and which one an author meets depends on whether they used the dict. One rule covering both would have to report a leaf for a solver that named no leaves.
5. **No mode is added, so [DECISIONS.md](./DECISIONS.md) gains no record.** Dispatch is exactly what ADR-051's clarification says it is, neither solve gained a branch, and no published value moves. This record is the whole of the change's architecture.

## Evidence

- `MG-14`, `MG-15`: `packages/core/test/unit/graph/solver-goal-required.test.ts`. The refusal by name with its participant ids, both builders bailing at the same point, either goal spelling satisfying it, and the mutual exclusion with `ik-leaf-without-goal`.
- `RS-11`, `RS-12`, `RS-13`: `packages/core/test/unit/graph/solved-pivot-offset.test.ts`. A static, an animated and a two-key offset refused with the keys named; an authored zero, a zero ramp, the chain root's own offset and a bone below the chain all accepted; and the binder scope, asserted through the `spring` and flat-key fixtures `RS-9` uses for the dead rotation.
- Unchanged, which is what makes the refusals safe rather than merely narrow: the walker demo's cases 11 and 13, `IK-13` end to end, `FB-9`'s byte identity, and `FB-15`'s bare-target join. Every solver in the suite, in the demo, and in the playground binds a goal, and no member of any of them authors a pivot.
