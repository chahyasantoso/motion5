# ADR-053: The solver chain contract is enforced at load, not at composition

**Status:** Accepted, 2026-08-29. **The pivot half is superseded by [ADR-054](./ADR-054-offset-aware-ik-solving.md), 2026-08-29.**

> **Amendment.** Two halves, one still standing.
>
> `ik-solver-no-goal` and everything about it current: rule, throw behind it, one-reader-per-authored-question
> refactor landing with it.
>
> `ik-solved-pivot-unsupported` gone. This record called it safety stop not desired end state, own alternative 1
> sketched geometry retiring it — down to effective link and twist. ADR-054 lands that geometry in both solves,
> defines shared sub-base convention alternative 1 said missing, deletes rule. Read every pivot paragraph below as
> reasoning correct at time, now history: refusal, its consequence 1, `RS-11` through `RS-13` evidence, inverted
> into acceptance rather than deleted. Nothing else moves.

**Supersedes nothing.** Extends [ADR-051](./ADR-051-derived-solver-membership.md) (how solver finds bones) and
[ADR-052](./ADR-052-goal-addressing-by-member-id.md) (how it is told what to reach for). This record owns two
shapes those left reachable: solver with nothing to reach for, member whose pivot neither solve accounts for.

**Amended by [ADR-121](./ADR-121-grouped-only-keyframes.md), 2026-09-26.** `flat key names no group at all`
passage and Alternative 6's acceptance of flat level no longer describe authored input. Flat keys no longer
authored: ungrouped `x` or `y` refused as `keyframes-ungrouped-key` before binder scope or graph reads it.

## Context

Both shapes out of review of `feat/d-base` against consolidated slice D plan, fail same way. Neither errors at
load, both noticed only downstream of loader that could have named them.

**Solver with root, members, no goal loaded clean.** `ik-leaf-without-goal` guarded by goal dict having been used
at all — bare `target` names no member, has no leaf to be missing, bare slot separate read. Shape binding neither
met no rule: `resolveSolvers` derived chain, `orderGraph` linearised, `solveChain` threw on empty goal map first
tick and every tick after. Solver published `error`, every member `blocked-upstream`, every descendant of those
blocked behind them, once per frame — for shape pure function of authored document. ADR-052 already documents
no-goal solver refused at load → implementation contradicted own record, one documentation failure worse than no
documentation.

**Neither solve accounts for member's pivot offset.** Slice A gave `fk` authored `x`, `y`, read in base's rotated
space → bone composes pivot at offset then extends by `length`. Both solves written against preceding geometry:
`solveTwoBone` reads `length` off each member, measures from root's own frame; `fabrikMembers` hands iterative
solve length + `base` per member, nothing else. Member with non-zero offset composes tip displaced from one solve
placed, chain misses goal by exactly that vector — `ready` patch, no diagnostic anywhere. Silent wrongness not
failure: class project refuses everywhere else.

## Decision

### A solver with no goal is refused at load

`ik-solver-no-goal` in `resolveSolvers`, beside `ik-solver-no-root`, `ik-solver-no-members`. Fires when solver
binds neither bare `target` slot nor single goal through dict; about absence not spelling — either spelling
satisfies, because `target` = exactly degenerate case of dict and neither deprecated.

Throw inside `solveChain` stays exactly as is, becomes what `readMembers`' throw already is: invariant guard
behind named rule, not first owner to notice. Composition reaching it = publisher invariant violation not
authoring mistake; answering with seed pose would publish rig reaching for nothing with status `ready`.

Reports without skipping rest of derivation, unlike two refusals beside it. Goal-less solver still has derivable
chain → broken one worth naming same pass not one run later. Cannot report beside `ik-leaf-without-goal`: that
rule needs dict used, this one needs it not used → one absence never two diagnostics.

### A solved member's pivot sits on its base's tip

**Superseded by ADR-054.** The rule described in this section no longer exists. Both solves account for the offset, and a solved member's pivot sits wherever its authored `x` and `y` put it, exactly as on every other bone. The reasoning is kept because ADR-054's own decision is a reply to it.

`ik-solved-pivot-unsupported` refused authored non-zero `x` or `y` on member bound to solver, naming keys found,
one diagnostic per member not per key.

By value not presence — one difference from `ik-solved-rotation-dead` beside it. Authored zero composes exactly
frame unauthored pivot composes → refusing it refuses rig already right; ramp never leaving zero read same way.
Solved rotation, contrast, replaced whatever it was → authoring one at all dead input.

Scoped to group that bound `solver` — scope `RS-9` pins for dead rotation. Solve answers for plugin that asked →
key under any other group that plugin's own live input, flat key names no group at all in layer holding no
registry.

**Both solve paths share this convention rather than holding one each,** loader where guaranteed. Enforcing at load
→ neither `solveTwoBone` nor `solveFabrik` needs a line, neither can drift from other, refusal property of rig not
arity that happens to dispatch it. Convention holding at arity two not above = arity-dependent meaning that killed
reviving member's authored `rotation` as FABRIK seed.

ADR-054 keeps last paragraph's requirement, drops mechanism: both paths still share one convention, now guaranteed
by both reading one module rather than by neither allowed to meet shape.

### One reader per authored question

Both rules exist because two readers of one question already drifted → each lands with readers merged not beside
them.

`goalBindingsOf` returns bare slot + dict entries together, four callers read it: `ik-mode-ambiguous` needs whether
node bound goal at all, `ik-goal-conflict` needs both spellings, `ik-solver-no-goal` needs neither, chain derivation
needs every dict entry with authored key. Two used to read literal `"target"` in one loop while grammar read in
another — exactly how member binding `solver` beside goal dict loaded clean with every goal ignored.

`authoredByBinders` generalises `authorsSolvedRotation` to a key → dead rotation and pivot offset ask one function
which group bound solver, reads `readPluginValues` rather than reaching into group itself → what `values` section is
keeps single owner. Stays generalised under ADR-054 though dead rotation its only caller now: re-specialising reader
on way out of widening = how drift it created to end comes back.

## Alternatives rejected

1. **Incorporating pivot offsets into both solves now.** **Taken up by ADR-054**, following this sketch: analytic
   case survives as written here, tree case closed by defining sub-base convention rather than averaging
   incompatible twists. Reasoning below why separate slice, not why wrong. Analytic case tractable, tree case not,
   shipping half = two conventions record exists to prevent. Two-bone chain: first pivot fixed once root frame
   known, link to second pivot rigid — length `hypot(l1 + x2, y2)` at fixed twist `atan2(y2, l1 + x2)` from first
   bone's own direction → closed form survives with twist subtracted from one angle, added to other. FABRIK
   generalises same way over pivots not tips for linear chain, stops generalising at branch: sub-base carries
   different twist per child → averaged inward pass has no single direction to recover. Geometry change to both
   solves, moves numbers `IK-1`, `IK-3`, every `FB-` tolerance pin, own slice with own evidence.
2. **Refusing offsets for iterative path only.** Two conventions for one authored key, decided by derived member
   count author never wrote. Review asked one convention across both paths for this reason; ADR-054 satisfies by
   supporting key on both rather than refusing on both.
3. **Documenting offsets unsupported without refusing.** Field accepted then ignored — what rule 6 of
   [ADR-033](./ADR-033-no-manual-trigger-fallback.md) forbids; silent miss whole finding.
4. **Guarding offsets in `readMembers` instead of at load.** Plugin reads member's composed value namespace, flat →
   cannot see which group authored key. Would refuse `x` authored under `transform` that load rule accepts; two
   owners answering one question differently precisely drift that had two copies of `readNumber` disagreeing about
   `length: NaN`. Load rule only owner able to see authored group.
5. **Refusing presence of `x`/`y` rather than non-zero value.** Cheaper to implement, re-authors rigs already
   correct, including bone spelling zeros out for symmetry with siblings.
6. **Reading every group and flat level for pivot.** Wider than scope `RS-9` pins for dead rotation, would have this
   rule answering for plugin it knows nothing about. Residual gap stated as cost below, not closed by wide read.
7. **Leaving no-goal refusal to throw.** Shape loader can name should never be per-tick composition error; throw's
   own message names publisher invariant not authoring mistake → author told about wrong layer.

## Consequences, stated as costs

1. **Solved member cannot carry pivot offset at all.** **Superseded by ADR-054: it can, and the cost is retired
   rather than paid.** Two keys stay fully available everywhere else, including chain root and every bone below —
   where walker rig already uses them: shoulder hangs off pelvis at `y: -50`, arm solver's root not one of its
   members. No fixture, demo, playground rig re-authored by either rule.
2. **Narrow scope leaves one gap, named not discovered.** `fk` composes pivot from flattened value namespace → `x`
   authored under group not binding `solver` still reaches it, still unaccounted by solve. Accepted for consistency
   with `ik-solved-rotation-dead`, `RS-9` pinning same scope same reason; closing needs wide read alternative 6
   rejects. Under ADR-054 gap still open, costs nothing: offset simply not one solve knows about, on member whose
   rotation that other plugin owns.
3. **`PIVOT_KEYS` puts two of `fk`'s key names in graph layer,** beside `rotation` already there. Layer holds no
   plugin registry by design → kinematic key it reads is literal or nothing. ADR-054 deletes `PIVOT_KEYS` with
   rule, only `rotation` remains.
4. **Two rules for two adjacent absences.** `ik-solver-no-goal`, `ik-leaf-without-goal` both say chain has nothing
   to reach for; which one author meets depends on dict used. One rule covering both would report leaf for solver
   naming no leaves.
5. **No mode added → no new numbered record owed.** Dispatch exactly ADR-051's clarification says, neither solve
   gained branch, no published value moves. This record whole of change's architecture.

## Evidence

- `MG-14`, `MG-15`: `packages/core/test/unit/graph/solver-goal-required.test.ts`. Refusal by name with participant
  ids, both builders bailing same point, either goal spelling satisfying, mutual exclusion with
  `ik-leaf-without-goal`.
- `RS-11`, `RS-12`, `RS-13`: `packages/core/test/unit/graph/solved-pivot-offset.test.ts`. **Inverted by ADR-054.**
  Pinned static, animated, two-key offset refused with keys named; authored zero, zero ramp, chain root's own
  offset, bone below chain all accepted; binder scope asserted through `spring` and flat-key fixtures `RS-9` uses
  for dead rotation. Now pin same fixtures accepted, same scope read — why ids kept not retired: acceptance needs
  evidence exactly as refusal did.
- Unchanged, what makes refusals safe not merely narrow: walker demo cases 11 and 13, `IK-13` end to end, `FB-9`'s
  byte identity, `FB-15`'s bare-target join. Every solver in suite, demo, playground binds goal, no member of any
  authors pivot.
