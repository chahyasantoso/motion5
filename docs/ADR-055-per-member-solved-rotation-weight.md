# ADR-055: Per-member weight for solved rotation

- **Status:** accepted
- **Date:** 2026-08-29
- **Closes:** issue [#211](https://github.com/chahyasantoso/motion5/issues/211)
- **Amends:** [ADR-051](./ADR-051-derived-solver-membership.md), owner of the solve a member reads back

**Amended by [ADR-121](./ADR-121-grouped-only-keyframes.md), 2026-09-26.** Flat `rotation` passage outside `ik-solved-rotation-dead` and `weight` consequence saying it acquires no ambiguous flat spelling no longer hold. Ungrouped `rotation` or `weight` refused at schema validation as `keyframes-ungrouped-key`; no flat spelling ambiguous any more — none authorable.

This record owns seam between bone's authored rest pose and rotation its solver publishes: that one exists at all, its domain, which side of composition owns it, what author may write beside it.

---

## Context

Solver-bound `fk` member had no seam. `fk.compose` read `readSolvedRotation(inputs.solver, nodeId) ?? readNumber(values.rotation)` — hard override: solved angle wins outright whenever present, authored angle wins outright when not. Authoring `rotation` on solver-bound member therefore refused at load as `ik-solved-rotation-dead`, correctly: value could never influence output in any runtime state.

Cost: chain could only snap. No way to animate rig gradually reaching fixed target, hand limb back to authored pose, or stagger reach so shoulder commits before wrist. Every rig fully solved or fully authored, every tick, nothing between, no way to cross.

---

## Decision

### 1. `fk.values.weight`, per member

`fkPlugin` claims fifth key. When solver names this node, composed local rotation is authored angle blended toward solved one by that weight:

```ts
const solved = readSolvedRotation(inputs.solver, nodeId);
const authored = readNumber(values.rotation);
const weight = clamp(readNumber(values.weight, 1), 0, 1);
const rotation = solved === undefined ? authored : lerpAngle(authored, solved, weight);
```

**Per member rather than per solver.** Solver-level weight forces every bone in chain to blend in lockstep → staggered reach, the one motion weight exists to author, unauthorable. Also correct responsibility split: solver owns where tip lands, `fk` owns what rotation this bone composes with, blending unambiguously second question. Nothing in `ikPlugin`, `solveChain`, `solveTwoBone` or `solveFabrik` changes; solve keeps publishing exact angles unconditionally, at every arity.

**Default `1`.** Every solver-bound rig authored before this key composes byte-identically — hard requirement, not goal: if any existing `fk` or `ik` case needs editing, including `IK-1`'s and `IK-3`'s worked numbers, default broken. Non-finite weight resolves to `1` through `readNumber`'s fallback → typo behaves exactly like omitted key, this package's standing "keep the damage inside the value that was wrong" policy, not special case.

**Clamped into `[0, 1]`, never extrapolated.** Eased `stops` curve that overshoots clamped, not followed past ends. Angle blend has exactly two defined anchors; position past either undefined behavior, not designed → nothing for overshoot to mean.

**The blend is composed around `readSolvedRotation`, never folded into it.** That function stays single owner of "is there a solved angle at all" (ADR-051). Folding weight in makes unbound slot and `weight` of `0` indistinguishable — two different things: bone with no solver vs bone with solver it currently ignores. `solved === undefined` short-circuit keeps them apart; unbound member never reads its weight at all.

### 2. `clamp` and `lerpAngle` live in `plugins/frame.ts`

`clamp` **promoted** out of `plugins/ik.ts`, where module-private, not copied into `fk.ts`. Copy recreates precisely defect `frame.ts` created to fix: two plugins each carried private `readNumber`, copies drifted, authored `length: NaN` zeroed by solver, passed straight through by bone. Bound closed form needs for reachability and `acos` domain is bound bone needs for weight. One clamp, two callers.

`lerpAngle` exported and pure, same module, two reasons. `solveTwoBone` returns unwrapped degrees by construction → authored and solved angle can sit more than turn apart, naive linear blend swings long way round; wrap-aware angle math thus shared-domain between two halves of one composition, not `fk` private detail. Pure function makes wrap a unit assertion; same claim through whole rig is slow test that also fails for eleven unrelated reasons.

**Both endpoints are returned untouched rather than computed, and that is a byte guarantee.** Wrap sends separation past half turn to short-arc complement → arithmetic at weight of `1` lands whole turn from solved angle: same pose, different published number, on every rig whose solved rotation more than 180 degrees from authored one. At weight of `0` it would also lose negative zero. `pivotFromBaseTip` short-circuits zero offset under same rule, same reason.

**The tie at exactly half a turn resolves in the positive direction.** Both arcs equally short there → choice arbitrary, exactly why pinned in test, not left to arithmetic: rewrite reaching for `floor` instead of `ceil` silently flips pose, every other case still green.

### 3. Validation is presence-only, in two tiers

`ik-solved-rotation-dead` **narrowed, not deleted**. Group that bound `solver` slot and authors `rotation` with no `weight` beside it refused exactly as before — byte-identically old rule and old behavior, no existing rig re-authored: no weight in reach → no runtime state where authored rotation influences output, what rule always meant. `rotation` with `weight` beside it in same group, any authored form, accepted.

`ik-weight-without-solver` symmetric refusal, footgun same shape: no solved rotation to blend toward → `fk` short-circuits to authored value, never reads weight, so inert weight is key accepted then ignored. Fires on node that bound `solver` slot somewhere and authored `weight` in group that bound none there.

**Both rules are scoped to the plugin group that bound the slot**, exactly as `RS-9` already pins for dead rotation. Node can bind `solver` under one plugin, author `weight` under another; "does this node hold a solver anywhere" passes that shape while solve cannot reach key.

**And both speak only about a node that bound a solver.** Guard is other half of same rule, not convenience. `weight` claimed by `fkPlugin`, ADR-043 lets any other plugin claim it too, `resolveSolvers` holds no plugin registry by design → on node with no solver binding it cannot tell blend weight from another plugin's own live input. `Q-10`'s `reach` plugin claims `weight`, binds no solver slot; refusing that rig would be this rule answering for plugin it knows nothing about — wider read `RS-9` already closed once on dead rotation.

**The residual is stated rather than hidden.** `fk` weight on bone that bound no solver anywhere inert too; no load-time rule names it. Cost of not holding registry, exactly as member's flat `rotation` not being `ik-solved-rotation-dead` is; `WT-10` pins composition that makes it harmless: unbound slot short-circuits to authored rotation, never reads weight at all. Catch ever wanted → belongs where key ownership already lives, registry in reach.

Both rules read one walker, `groupsAuthoring`, set operations against binder groups. Two near-identical group walkers → rules drift apart; this read drifted once already, wider than rule that used it.

---

## Alternatives rejected

1. **A solver-level `weight`, or one beside the per-member key.**
   _Rejected._ Cannot express staggered reach, the motion key exists for; second spelling makes "how much of the solve does this bone take" a question with two owners and precedence rule between them.
2. **Delete `ik-solved-rotation-dead` outright.**
   _Rejected._ Unconditional case survives intact: member authoring `rotation` and no `weight` still has no runtime state where value read. Deleting rule accepts shape dead for exactly reason it was always dead, costs diagnostic that names it.
3. **Refuse `rotation` when `weight` is present but provably always `1`** (static `1`, or every `stops` value equal to `1`).
   _Rejected on two counts._ Layering: "is every stop of `weight` equal to `1`" is leaf-shape and value-semantics question; `contract/authored-leaf` already owns leaf shape; `graph/ir.ts` documents at length it holds no plugin registry and punts value-and-ownership questions by design. Hand-walking `stops` array there makes that layer second owner of leaf shape — break issue #192 already closed once. Yield: rule refuses "fully solved for now, I will animate the weight next", authoring intent, while still passing weight arriving through edge, because load-time reader cannot evaluate one. Rule that catches careful author and misses dynamic case is inverted. Catch ever wanted: `Diagnostic.severity` already carries `warning`, every gate tests for `error` → can be non-blocking, belongs where leaf shape already lives.
4. **Fold the weight into `readSolvedRotation`.**
   _Rejected._ Makes unbound slot and `weight` of `0` same answer — the one distinction composition must keep; gives ADR-051's single owner of "is there a solved angle" second job.
5. **Compute both endpoints instead of short-circuiting them.**
   _Rejected._ Default `1` → every existing solver-bound rig's published rotation goes through that path; wrap moves it whole turn for any separation past 180 degrees.
6. **Extrapolate past `[0, 1]` for overshoot easing.**
   _Rejected._ Two anchors, no defined behavior beyond them. Clamping is stated bound; extrapolating an accident that happens to have formula.
7. **An `internalKeys` entry or a serializer for `weight`.**
   _Rejected as redundant._ `fkPlugin.compose` returns `composeWorld(...)`, three keys, no `...values` spread, unlike `ikPlugin` which spreads deliberately (`IK-18`). Chain-by-replacement rule already drops authored weight → neither addition does anything.
8. **Refuse an inert `weight` on any node, with no solver binding required in reach.**
   _Rejected, and it shipped once before it was._ Reads as tighter rule, actually wider: reserves spelling `weight` across every plugin in registry, contradicting per-plugin key ownership ADR-043 states and graph layer's standing refusal to attribute key to plugin it cannot see. `Q-10` is measurement, not argument: its `reach` plugin claims `weight`, binds `base` and `destination`, no solver; wide rule refused fixture predating this key entirely. Narrower read is fix; documented exception for one fixture would not have been.

---

## Consequences

- `fkPlugin.keys` gains `weight`. Whole public surface change: no export map entry, entrypoint or boundary allow-list entry moves; `weight` claimed by no other plugin in this package → acquires no ambiguous flat spelling the way `x`, `y` and `rotation` have.
- `ik-weight-without-solver` new rule id. `ik-solved-rotation-dead` fires on strictly narrower set of authored shapes than before, no new ones.
- ADR-051's load-time diagnostic table gains a rule, narrows one condition; this record is the amendment. Table left as written, change stated in prose beside it, under standing guardrail: hand-padded Markdown tables avoided where formatting is hard CI gate. Nothing about derived membership, member delivery, dispatch, memoization or renderer shielding changes.
- No fixture, demo or playground rig re-authored. No rig authored `weight` under `fk` before key existed; rig authoring one under another plugin's group not this rule's to refuse.

---

## Evidence

- `packages/plugins/test/unit/angle-blend.test.ts` (`WT-1`..`WT-4`): one shared `clamp`, two endpoint identities, short arc through wrap, positive tie-break at exactly half turn.
- `packages/plugins/test/unit/fk-solved-weight.test.ts` (`WT-5`..`WT-11`): omitted-weight default composed against unconditional override as oracle; `0` and `1` as exact authored and exact solved; blend across `180`/`0` wrap; clamping and non-finite fallback; unbound slot ignoring weight entirely; key never reaching patch.
- `packages/core/test/unit/graph/solved-rotation-weight.test.ts` (`WT-12`..`WT-16`): narrowed refusal; acceptance whatever weight; boundary registry-free layer cannot cross; group scope on both rules; two builders agreeing.
- `packages/plugins/test/integration/per-plugin-key-ownership.test.ts` (`N-7`): claimed key list, the one existing case this change moves.
- `packages/plugins/test/integration/plugin-owned-requirements.test.ts` (`Q-10`): pre-existing plugin claiming `weight`, binding no solver — why mirror rule is guarded, not universal. Needed no edit.
