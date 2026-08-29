# ADR-055: Per-member weight for solved rotation

- **Status:** accepted
- **Date:** 2026-08-29
- **Closes:** issue [#211](https://github.com/chahyasantoso/motion5/issues/211)
- **Amends:** [ADR-051](./ADR-051-derived-solver-membership.md), which owns the solve a member reads back

This record owns the seam between a bone's authored rest pose and the rotation its solver publishes: that there is one at all, what its domain is, which side of the composition owns it, and what an author may write beside it.

---

## Context

A solver-bound `fk` member had no seam. `fk.compose` read `readSolvedRotation(inputs.solver, nodeId) ?? readNumber(values.rotation)`, which is a hard override: the solved angle wins outright whenever there is one, and the authored angle wins outright when there is not. Authoring `rotation` on a solver-bound member was therefore refused at load as `ik-solved-rotation-dead`, correctly, because the value could never influence the output in any runtime state.

The cost was that a chain could only snap. There was no way to animate a rig gradually reaching toward a fixed target, no way to hand a limb back to its authored pose, and no way to stagger a reach so that a shoulder commits before a wrist does. Every rig was either fully solved or fully authored, on every tick, with nothing between and no way to cross.

---

## Decision

### 1. `fk.values.weight`, per member

`fkPlugin` claims a fifth key. When a solver names this node, the composed local rotation is the authored angle blended toward the solved one by that weight:

```ts
const solved = readSolvedRotation(inputs.solver, nodeId);
const authored = readNumber(values.rotation);
const weight = clamp(readNumber(values.weight, 1), 0, 1);
const rotation = solved === undefined ? authored : lerpAngle(authored, solved, weight);
```

**Per member rather than per solver.** A solver-level weight would force every bone in a chain to blend in lockstep, which makes the one motion a weight exists to author, a staggered reach, unauthorable. It is also the correct responsibility split: the solver owns where the tip lands, `fk` owns what rotation this bone composes with, and blending is unambiguously the second question. Nothing in `ikPlugin`, `solveChain`, `solveTwoBone` or `solveFabrik` changes; the solve keeps publishing exact angles unconditionally, at every arity.

**Default `1`.** Every solver-bound rig authored before this key existed composes byte-identically, and that is a hard requirement rather than a goal: if any existing `fk` or `ik` case needs editing, including `IK-1`'s and `IK-3`'s worked numbers, the default is broken. A non-finite weight resolves to `1` through `readNumber`'s fallback, so a typo behaves exactly like an omitted key, which is this package's standing "keep the damage inside the value that was wrong" policy rather than a special case.

**Clamped into `[0, 1]`, never extrapolated.** An eased `stops` curve that overshoots is clamped rather than followed past the ends. An angle blend has exactly two defined anchors, and a position past either of them is undefined behavior rather than a designed one, so there is nothing for an overshoot to mean.

**The blend is composed around `readSolvedRotation`, never folded into it.** That function stays the single owner of "is there a solved angle at all" (ADR-051). Folding the weight in would make an unbound slot and a `weight` of `0` indistinguishable, and those are two different things: one is a bone with no solver, the other is a bone with a solver it currently ignores. The `solved === undefined` short-circuit is what keeps them apart, and it also means an unbound member never reads its weight at all.

### 2. `clamp` and `lerpAngle` live in `plugins/frame.ts`

`clamp` is **promoted** out of `plugins/ik.ts`, where it was module-private, rather than copied into `fk.ts`. Copying it would recreate precisely the defect `frame.ts` was created to fix: the two plugins each carried a private `readNumber`, the copies drifted, and an authored `length: NaN` was zeroed by the solver and passed straight through by the bone. The bound the closed form needs for reachability and for the `acos` domain is the bound the bone needs for its weight. One clamp, two callers.

`lerpAngle` is exported and pure, in the same module, for two reasons. `solveTwoBone` returns unwrapped degrees by construction, so an authored and a solved angle can sit more than a turn apart and a naive linear blend swings the long way round; wrap-aware angle math is therefore shared-domain between the two halves of one composition rather than an `fk` private detail. And a pure function makes the wrap a unit assertion, where the same claim asserted through a whole rig is a slow test that also fails for eleven unrelated reasons.

**Both endpoints are returned untouched rather than computed, and that is a byte guarantee.** The wrap sends a separation past half a turn to its short-arc complement, so the arithmetic at a weight of `1` lands a whole turn away from the solved angle: the same pose, and a different published number, on every rig whose solved rotation is more than 180 degrees from its authored one. At a weight of `0` it would also lose a negative zero. `pivotFromBaseTip` short-circuits a zero offset under the same rule and for the same reason.

**The tie at exactly half a turn resolves in the positive direction.** Both arcs are equally short there, so the choice is arbitrary, which is exactly why it is pinned in a test rather than left to the arithmetic: a rewrite reaching for `floor` instead of `ceil` would silently flip a pose with every other case still green.

### 3. Validation is presence-only, in two tiers

`ik-solved-rotation-dead` is **narrowed, not deleted**. A group that bound the `solver` slot and authors `rotation` with no `weight` beside it is refused exactly as before, which is byte-identically the old rule and the old behavior, so no existing rig is re-authored: with no weight in reach there is no runtime state in which the authored rotation influences the output, which is what the rule has always meant. A `rotation` with a `weight` beside it in that same group, in any authored form, is accepted.

`ik-weight-without-solver` is the symmetric refusal, and the footgun is the same shape: with no solved rotation to blend toward, `fk` short-circuits to the authored value and never reads the weight, so an inert weight is a key accepted and then ignored. It fires on a node that bound a `solver` slot somewhere and authored `weight` in a group that bound none there.

**Both rules are scoped to the plugin group that bound the slot**, exactly as `RS-9` already pins for the dead rotation. A node can bind `solver` under one plugin and author `weight` under another, and "does this node hold a solver anywhere" would pass that shape while the solve cannot reach the key.

**And both speak only about a node that bound a solver.** That guard is the other half of the same rule, and it is not a convenience. `weight` is claimed by `fkPlugin`, ADR-043 lets any other plugin claim it too, and `resolveSolvers` holds no plugin registry by design, so on a node with no solver binding at all it cannot tell a blend weight from another plugin's own live input. `Q-10`'s `reach` plugin claims `weight`, binds no solver slot, and refusing that rig would be this rule answering for a plugin it knows nothing about, which is the wider read `RS-9` already closed once on the dead rotation.

**The residual is stated rather than hidden.** An `fk` weight on a bone that bound no solver anywhere is inert too, and no load-time rule names it. That is the cost of not holding the registry, exactly as a member's flat `rotation` not being `ik-solved-rotation-dead` is, and `WT-10` is what pins the composition that makes it harmless: an unbound slot short-circuits to the authored rotation and never reads the weight at all. If the catch is ever wanted it belongs where key ownership already lives, with a registry in reach.

Both rules read one walker, `groupsAuthoring`, and are set operations against the binder groups. Two near-identical group walkers is how two rules drift apart, and this read has drifted once already, when it was wider than the rule that used it.

---

## Alternatives rejected

1. **A solver-level `weight`, or one beside the per-member key.**
   _Rejected._ It cannot express a staggered reach, which is the motion the key exists for, and a second spelling would make "how much of the solve does this bone take" a question with two owners and a precedence rule between them.
2. **Delete `ik-solved-rotation-dead` outright.**
   _Rejected._ The unconditional case survives intact: a member that authors `rotation` and no `weight` still has no runtime state in which that value is read. Deleting the rule would accept a shape that is dead for exactly the reason it was always dead, and would cost the diagnostic that names it.
3. **Refuse `rotation` when `weight` is present but provably always `1`** (a static `1`, or every `stops` value equal to `1`).
   _Rejected on two counts._ Layering: "is every stop of `weight` equal to `1`" is a leaf-shape and value-semantics question, `contract/authored-leaf` already owns leaf shape, and `graph/ir.ts` documents at length that it holds no plugin registry and punts value-and-ownership questions by design. Hand-walking a `stops` array there makes that layer a second owner of leaf shape, which is the break issue #192 already closed once. Yield: the rule would refuse "fully solved for now, I will animate the weight next", which is authoring intent, while still passing a weight that arrives through an edge, because a load-time reader cannot evaluate one. A rule that catches the careful author and misses the dynamic case is inverted. If the catch is ever wanted, `Diagnostic.severity` already carries `warning` and every gate tests for `error`, so it can be non-blocking, and it belongs where leaf shape already lives.
4. **Fold the weight into `readSolvedRotation`.**
   _Rejected._ It would make an unbound slot and a `weight` of `0` the same answer, which is the one distinction the composition must keep, and it would give ADR-051's single owner of "is there a solved angle" a second job.
5. **Compute both endpoints instead of short-circuiting them.**
   _Rejected._ The default is `1`, so every existing solver-bound rig's published rotation goes through that path, and the wrap moves it by a whole turn for any separation past 180 degrees.
6. **Extrapolate past `[0, 1]` for overshoot easing.**
   _Rejected._ There are two anchors and no defined behavior beyond them. Clamping is a stated bound; extrapolating is an accident that happens to have a formula.
7. **An `internalKeys` entry or a serializer for `weight`.**
   _Rejected as redundant._ `fkPlugin.compose` returns `composeWorld(...)`, three keys, with no `...values` spread, unlike `ikPlugin` which spreads deliberately (`IK-18`). The chain-by-replacement rule already drops the authored weight, so neither addition would do anything.
8. **Refuse an inert `weight` on any node, with no solver binding required in reach.**
   _Rejected, and it shipped once before it was._ It reads as the tighter rule and is actually a wider one: it reserves the spelling `weight` across every plugin in the registry, which contradicts the per-plugin key ownership ADR-043 states and the graph layer's own standing refusal to attribute a key to a plugin it cannot see. `Q-10` is the measurement rather than the argument: its `reach` plugin claims `weight`, binds `base` and `destination` and no solver, and the wide rule refused a fixture that predates this key entirely. The narrower read is the fix; a documented exception for one fixture would not have been.

---

## Consequences

- `fkPlugin.keys` gains `weight`. That is the whole public surface change: no export map entry, entrypoint, or boundary allow-list entry moves, and `weight` is claimed by no other plugin in this package, so it acquires no ambiguous flat spelling the way `x`, `y` and `rotation` have.
- `ik-weight-without-solver` is a new rule id. `ik-solved-rotation-dead` fires on a strictly narrower set of authored shapes than before and on no new ones.
- ADR-051's load-time diagnostic table gains a rule and narrows one condition, and this record is the amendment. The table itself is left as written and the change is stated in prose beside it, under the standing guardrail that hand-padded Markdown tables are avoided where formatting is a hard CI gate. Nothing about derived membership, member delivery, dispatch, memoization or renderer shielding changes.
- No fixture, demo or playground rig has to be re-authored. No rig authored a `weight` under `fk` before the key existed, and a rig that authors one under another plugin's group is not this rule's to refuse.

---

## Evidence

- `packages/core/test/unit/plugins/angle-blend.test.ts` (`WT-1`..`WT-4`): one shared `clamp`, the two endpoint identities, the short arc through the wrap, and the positive tie-break at exactly half a turn.
- `packages/core/test/unit/plugins/fk-solved-weight.test.ts` (`WT-5`..`WT-11`): the omitted-weight default composed against the unconditional override as its oracle, `0` and `1` as exact authored and exact solved, a blend across the `180`/`0` wrap, clamping and the non-finite fallback, an unbound slot ignoring the weight entirely, and the key never reaching a patch.
- `packages/core/test/unit/graph/solved-rotation-weight.test.ts` (`WT-12`..`WT-16`): the narrowed refusal, acceptance whatever the weight is, the boundary a registry-free layer cannot cross, group scope on both rules, and the two builders agreeing.
- `packages/core/test/integration/per-plugin-key-ownership.test.ts` (`N-7`): the claimed key list, which is the one existing case this change moves.
- `packages/core/test/integration/plugin-owned-requirements.test.ts` (`Q-10`): the pre-existing plugin that claims `weight` and binds no solver, which is why the mirror rule is guarded rather than universal. It needed no edit.
