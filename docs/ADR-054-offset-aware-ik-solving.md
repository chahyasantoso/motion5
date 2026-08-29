# ADR-054: Offset-aware IK, with `fk` still the only owner that applies an offset

**Status:** Accepted, 2026-08-29

**Supersedes the pivot half of [ADR-053](./ADR-053-solver-chain-load-contract.md).** That record's `ik-solved-pivot-unsupported` refused a non-zero authored `x` or `y` on a solved member, and it said in its own alternatives section that the refusal was a safety stop rather than the desired end state. This record lands the geometry the refusal was waiting for and deletes the rule. Everything else in ADR-053 stands, including `ik-solver-no-goal`, the shared `authoredByBinders` reader, and the ownership boundary this record keeps.

Extends [ADR-051](./ADR-051-derived-solver-membership.md), which owns how a solver finds its bones and what a solve publishes, and slice A of issue #195, which gave `fk` the authored pivot in the first place.

## Context

`fk` composes a bone as two rotate-then-translates: its pivot at the authored `x`, `y` read in its base's rotated frame, and then its extension by `length` along its own direction. Both solves were written against the geometry that preceded that, so both assumed a member's pivot sits exactly on its base's tip. `solveTwoBone` measured its triangle from the root's own position and read `length` alone; `solveFabrik` carried one tip per member and placed each from the previous tip.

A member with a non-zero offset therefore composed a tip displaced from the one the solve placed, and the chain missed its goal by exactly that vector, with a `ready` patch and no diagnostic anywhere. ADR-053 refused the shape rather than shipping half the fix, because the analytic case was tractable and the tree case was not, and two conventions for one authored key is the outcome it existed to prevent.

Refusing it has a cost that grows. A pivot offset is the authored answer to a shoulder that hangs off a spine, a hip that is not on the pelvis' centreline, and a knee whose axis is inboard of the thigh. Those are the rigs an IK chain is for, and the one keyword they need was legal everywhere except on the bones being solved.

## Decision

### The offsets enter the geometry, and only the geometry

`fk` keeps sole ownership of applying an authored offset. `ik` gains ownership of predicting the frame that application composes, and it still publishes rotations and nothing else. No runtime pre-pass, no second evaluation, no solver state, and no offset applied twice: the publisher and the renderer are untouched, and the composition that puts a pivot where the solve predicted it is the same `fk.compose` every bone in the rig already ran through.

That is the split the refusal was protecting, and it is why the fix is a change to two pure functions rather than to a pipeline.

### One rotate-then-translate, in `plugins/frame.ts`

`composeWorld` moves from `fk.ts` to `frame.ts` and is re-exported from `fk.ts`, and `pivotFromBaseTip`, `baseTipFromPivot`, `readPivotOffset` and `effectiveLink` land beside it.

`frame.ts` already existed because `fk` and `ik` are halves of one composition and each held a private `readNumber` that had drifted, so an authored `length: NaN` was zeroed by the solver and passed through by the bone. The trigonometry is the same failure one level up and a worse one: a solve that rotated an offset by the member's own direction instead of its base's would miss every goal by roughly twice the offset, and nothing in the suite outside a reachability assertion would notice. There is one rotate-then-translate in this package now, and every kinematic caller reaches it through that module.

`readPivotOffset` is the same argument as `readNumber`'s. The bone that applies the offset and the solve that accounts for it read one function, so an authored `x: NaN` or an absent `y` cannot mean two things inside one tick.

### The closed form survives, as a fixed base and a rigid link

Two authored offsets enter the two-bone solve in two different places, and neither is an approximation.

The first member's offset moves the point the chain pivots about. It is read in the root's own rotated frame, so it is fixed the moment the root frame is known and no rotation the solve publishes can move it. The triangle is solved from that pivot.

The second member's offset cannot be handled that way, and this is the part a naive fix gets wrong: it is read in the _first_ member's frame, so it turns with the angle being solved and cannot be subtracted from the goal up front. It fuses with the first member's extension into one rigid link instead, because both are read in that same frame and turn together: a length of `hypot(l1 + x2, y2)` at a fixed twist of `atan2(y2, l1 + x2)` off the first bone's own direction. The law of cosines runs on that link and `l2` unchanged, and the twist is subtracted from the first published angle and added to the second.

The reach clamp moves onto the link for the same reason. `[|a - l2|, a + l2]` is the reach an offset chain actually has, and a second member offset backwards past its base's own length genuinely shortens it.

`effectiveLink` returns the length untouched and no twist for a zero offset, by short-circuit rather than by arithmetic that happens to round that way. `Math.hypot(l, 0)` is not guaranteed to be the identity on `l`, and every rig that already solves has its published angles riding on it being one. `pivotFromBaseTip` short-circuits for the same reason: `tip.x + (0 * cos - 0 * sin)` is `tip.x` for every finite double and not for a negative zero.

### FABRIK carries pivots beside tips

The working state is a pivot and a tip per member. A member's length is the distance between its own two points, its pivot is its base's tip moved by the authored offset in the base's own direction, and the outward pass composes both in canonical depth order, which makes that pass exactly `fk`'s forward composition over the current guesses. Length preservation is therefore exact by construction rather than approached, and it is a statement about a member's own segment rather than about the gap between two consecutive tips, which is the same thing only at zero offset.

The inward pass is where the offsets are actually accounted for. Each member proposes where its own pivot must sit for its length to hold, then converts that pivot into a proposal about its base's _tip_ by removing its own offset in the base's current direction.

### The shared sub-base convention: average tips, never twists

That conversion is the whole of the branch case, and it is stated here because ADR-053 named it as the reason the work needed its own slice.

A sub-base carries one direction, and every child hangs off that one direction at its own offset. The children's pivots are therefore not independent quantities to average: they are one tip and one direction, read through several different offsets. Averaging the pivots would average geometry that is incompatible by construction, and it would leave the sub-base's direction over-determined, with each branch implying a different one.

So each branch un-offsets first, and the average is taken over the sub-base's tip, in the canonical order `resolveSolvers` already produces. Positions are averaged and twists never are. The forward pass then re-derives every child's pivot from that one tip and direction, so no branch can hold a pose the composition would not compose.

The direction a branch un-offsets in is the sub-base's current one, which lags by an iteration. That is ordinary FABRIK: the whole method is a fixed-point iteration over positions, the outward pass re-composes exactly, and the residual it reports is measured on the composed pose rather than on the proposal. It converges, and `PV-5` and `PV-8` pin that it does on linear and branching offset chains.

### The refusal is deleted rather than replaced

`ik-solved-pivot-unsupported` goes, and `PIVOT_KEYS` and `isZeroOffset` go with it. No diagnostic replaces it, because there is no longer a class of solved-member offset geometry that is unsupported: an offset that shortens a chain's reach past its goal is an unreachable target, which is clamped exactly as an unreachable target without an offset already was, and has never been a diagnostic.

`authoredByBinders` stays generalised to a key even though the dead rotation is now its only caller. It was generalised so that two readers of one question could not drift about which group bound the solver, and narrowing it back to `authorsSolvedRotation` would re-specialise a reader on the way out of a change that widened what the layer accepts. `RS-13` carries the whole of its scope evidence now.

## Alternatives rejected

1. **Subtracting every offset from the goal before solving.** Correct for the first member and wrong for every member after it. Only the first member's offset is fixed in a frame the solve does not move; the second's turns with the first bone, so subtracting it up front solves a different rig and lands the tip somewhere the composition never puts it. It is green on a rig whose second offset is zero and on a root rotation of zero, which is most of the suite, which is exactly why it is named here.
2. **Rotating a member's offset by the member's own direction.** Off by one bone, and `fk` already made this choice the other way: a pivot that stopped following its parent when the parent turned would not be a pivot. It misses by roughly twice the offset and reaches no goal, so it fails loudly, but it fails in the one place a reviewer reads as arithmetic rather than as a convention.
3. **A runtime pre-pass that composes pivots and hands the solve world-space joints.** It works and it moves the ownership boundary. The solve would then read positions the runtime derived, the runtime would need to know which authored keys are pivots, and a second evaluation per tick would have to be memoised against the first. The pure-function seam ADR-051 draws is worth more than the arithmetic it saves, and issue #214 names the single pass as a requirement.
4. **Averaging child pivots at a sub-base.** The convention above exists to refuse this. It averages incompatible geometry, leaves the sub-base's direction implied differently by each branch, and produces a pose whose composition disagrees with the positions the solve reported.
5. **Replacing the analytic path with FABRIK now that both account for offsets.** `IK-1` and `IK-3` pin exact angles, `flip` at arity two selects an exact branch rather than a basin, and an iterative solve reaches a goal within a tolerance. Every rig that already solves would move. `PV-7` holds the two paths to each other on an offset rig instead, which is the assertion that says they share one convention.
6. **Keeping the refusal for the branch case only.** Two conventions for one authored key, decided by a derived member count the author never wrote. This is alternative 2 of ADR-053, and defining the sub-base convention rather than avoiding it is what this record is for.
7. **Seeding the arc from the effective links rather than the segment lengths.** A better first guess and a second geometry to keep in step with the composition. The first outward pass overwrites every point the seed produces, and the seed's only job is to say which way the chain bends.

## Consequences, stated as costs

1. **`plugins/frame.ts` is no longer only readers.** It holds the kinematic convention as well, which is a wider module than the one ADR-051 left behind. Accepted, because the alternative is two copies of the convention in two files that are halves of one composition, and that is the drift the module was created to end.
2. **`FabrikSolution` gains `pivots`.** A published patch is unchanged and still carries `rotations` alone, so this is a test surface rather than a runtime one. It has to be returned rather than derived: a case that recomputed a pivot from a rotation would re-derive the thing under test.
3. **`FabrikMember.pivot` is optional.** Absent means zero, which is exactly what `fk` composes for a bone that authored neither key, and `PV-6` pins that an absent offset and an authored zero are byte-identical solves. A required field would have put `{ x: 0, y: 0 }` on every fixture in the suite to say nothing.
4. **A branching rig with incompatible offset geometry still solves rather than reporting.** It converges to the same kind of compromise a branching rig with incompatible goals already converges to, and `FB-5` already documents that shape. Naming it would need a per-tick diagnostic, which is the decision ADR-051 closed for convergence generally.
5. **The offset gap ADR-053 named stays open and stays harmless.** `fk` composes its pivot from the flattened value namespace, so an `x` authored under a group that did not bind `solver` still reaches it. Under the refusal that was an unaccounted-for offset; now it is simply an offset the solve does not know about, on a member whose rotation that plugin owns. The wide read ADR-053's alternative 6 rejects is still not needed.
6. **No mode is added, so [DECISIONS.md](./DECISIONS.md) gains no record.** Dispatch is unchanged, neither solve gained a branch, no published key moves, and no authored spelling is new. This record is the whole of the change's architecture.

## Evidence

- `PV-1` through `PV-10`: `packages/core/test/unit/plugins/pivot-offset-solve.test.ts`. Each member's offset alone and both together reaching the target on both elbow branches and at three root rotations; the analytic path byte-identical to its pre-offset arithmetic over 180 zero-offset combinations; a three- and a five-bone chain keeping every segment length and reaching tolerance; an absent offset and an authored zero as one solve; the two paths agreeing on an offset rig; a branching offset chain solving both goals and deterministic under twenty authored permutations; the chain root's offset moving the chain rigidly; and an unreachable offset chain clamped to the effective link's reach. The oracle throughout is `fkPlugin.compose` rather than a copy of the trigonometry.
- `RS-11` through `RS-13`: `packages/core/test/unit/graph/solved-pivot-offset.test.ts`. The three refusal cases inverted into acceptances, with the graph and the derived chain asserted rather than only an empty diagnostics array; every offset the loader already accepted still accepted; and the shared reader's scope, which the dead rotation now carries alone.
- Unchanged, which is what makes the geometry safe rather than merely new: `IK-1` through `IK-4` and `IK-18`, `FB-1` through `FB-9`, `FB-13` and `FB-15`, the walker demo's cases 11 and 13, `IK-13` end to end, and `FO-1` through `FO-6`. No fixture in the suite is re-authored and no pinned number moves.
