# ADR-054: Offset-aware IK, with `fk` still the only owner that applies an offset

**Status:** Accepted, 2026-08-29

**Supersedes the pivot half of [ADR-053](./ADR-053-solver-chain-load-contract.md).** Its `ik-solved-pivot-unsupported` refused non-zero authored `x` or `y` on solved member; own alternatives section called refusal safety stop, not desired end state. This record lands geometry refusal awaited, deletes rule. Rest of ADR-053 stands, including `ik-solver-no-goal`, shared `authoredByBinders` reader, ownership boundary kept here.

Extends [ADR-051](./ADR-051-derived-solver-membership.md) (owns how solver finds bones, what solve publishes), and slice A of issue #195 (gave `fk` authored pivot).

## Context

`fk` composes bone as two rotate-then-translates: pivot at authored `x`, `y` in base's rotated frame, then extension by `length` along own direction. Both solves written against preceding geometry → both assumed pivot exactly on base tip. `solveTwoBone` measured triangle from root position, read `length` alone; `solveFabrik` carried one tip per member, placed each from previous tip.

Non-zero offset therefore composed tip displaced from solve's, chain missed goal by exactly that vector, `ready` patch, no diagnostic. ADR-053 refused shape rather than ship half fix: analytic case tractable, tree case not; two conventions for one authored key = outcome it existed to prevent.

Refusal cost grows. Pivot offset = authored answer to shoulder off spine, hip off pelvis centreline, knee axis inboard of thigh. Those rigs are what IK chain is for; one needed keyword legal everywhere except solved bones.

## Decision

### The offsets enter the geometry, and only the geometry

`fk` keeps sole ownership of applying authored offset. `ik` gains ownership of predicting frame application composes; still publishes rotations only. No runtime pre-pass, second evaluation, solver state, doubled offset: publisher and renderer untouched; composition placing pivot where solve predicted = same `fk.compose` every bone already ran.

**Amended by [ADR-109](./ADR-109-opt-in-solve-inspection.md), 2026-09-24.** "Publishes rotations and nothing else" holds for rigs not opting into inspection. Static `ik.values.inspect: true` → one extra `inspection` output, fixed-shape projection of solve quality record; rotations, hence every offset here, unchanged bit for bit.

That split refusal protected; why fix = two pure functions, not pipeline.

### One rotate-then-translate, in `plugins/frame.ts`

`composeWorld` moves `fk.ts` → `frame.ts`, re-exported from `fk.ts`; `pivotFromBaseTip`, `baseTipFromPivot`, `readPivotOffset`, `effectiveLink` beside it.

`frame.ts` existed because `fk` and `ik` = halves of one composition, each private `readNumber` drifted: solver zeroed authored `length: NaN`, bone passed it through. Trigonometry = same failure one level up, worse: solve rotating offset by member direction instead of base's misses every goal by roughly twice offset; suite outside reachability assertion would not notice. One rotate-then-translate in package now; every kinematic caller reaches it through that module.

`readPivotOffset` = `readNumber` argument. Bone applying offset and solve accounting for it read one function → authored `x: NaN` or absent `y` cannot mean two things in one tick.

### The closed form survives, as a fixed base and a rigid link

Two authored offsets enter two-bone solve in two places; neither approximation.

First member offset moves point chain pivots about. Read in root's rotated frame → fixed once root frame known; no published rotation moves it. Triangle solved from that pivot.

Second member offset not handled that way — naive fix's error: read in _first_ member frame → turns with solved angle, cannot subtract from goal up front. Fuses with first extension into one rigid link instead: both read in same frame, turn together: length `hypot(l1 + x2, y2)` at fixed twist `atan2(y2, l1 + x2)` off first bone direction. Law of cosines runs on link + `l2` unchanged; twist subtracted from first published angle, added to second.

Reach clamp moves onto link: `[|a - l2|, a + l2]` = reach offset chain actually has; second member offset backwards past base length genuinely shortens it.

`effectiveLink` returns length untouched, no twist for zero offset, by short-circuit not rounding arithmetic. `Math.hypot(l, 0)` not guaranteed identity on `l`; every solving rig rides on it being one. `pivotFromBaseTip` short-circuits same reason: `tip.x + (0 * cos - 0 * sin)` = `tip.x` for every finite double, not negative zero.

### FABRIK carries pivots beside tips

Working state: pivot + tip per member. Length = distance between own two points; pivot = base tip moved by authored offset in base direction; outward pass composes both in canonical depth order → exactly `fk` forward composition over current guesses. Length preservation exact by construction, not approached; statement about member segment, not gap between tips — same only at zero offset.

Inward pass accounts for offsets: member proposes own pivot for length to hold, converts to proposal about base _tip_ by removing own offset in base's current direction.

### The shared sub-base convention: average tips, never twists

Conversion = whole branch case; stated because ADR-053 named it as reason for own slice.

Sub-base carries one direction; every child hangs off it at own offset. Children pivots therefore not independent to average: one tip + one direction, read through several offsets. Averaging pivots averages incompatible geometry, leaves sub-base direction over-determined, each branch implying different one.

Each branch un-offsets first; average over sub-base tip, canonical order `resolveSolvers` produces. Positions averaged, twists never. Forward pass re-derives every child pivot from that tip + direction → no branch holds pose composition would not compose.

Branch un-offsets in sub-base current direction, lags one iteration. Ordinary FABRIK: fixed-point iteration over positions, outward pass re-composes exactly, residual measured on composed pose not proposal. Converges; `PV-5`, `PV-8` pin linear and branching offset chains.

### The refusal is deleted rather than replaced

`ik-solved-pivot-unsupported` goes; `PIVOT_KEYS`, `isZeroOffset` with it. No replacement diagnostic: no unsupported solved-member offset class remains. Offset shortening reach past goal = unreachable target, clamped exactly as unreachable target without offset, never diagnostic.

`authoredByBinders` stays generalised to key though dead rotation now sole caller. Generalised so two readers of one question could not drift on group binding solver; narrowing to `authorsSolvedRotation` re-specialises reader leaving change that widened layer. `RS-13` carries all scope evidence.

## Alternatives rejected

1. **Subtracting every offset from the goal before solving.** Correct first member, wrong all later. Only first offset fixed in frame solve does not move; second turns with first bone → solves different rig, lands tip composition never puts there. Green when second offset zero and root rotation zero — most of suite — why named.
2. **Rotating a member's offset by the member's own direction.** Off one bone; `fk` chose opposite: pivot stopping parent-following would not be pivot. Misses by roughly twice offset, reaches no goal → fails loudly, in place reviewer reads as arithmetic not convention.
3. **A runtime pre-pass that composes pivots and hands the solve world-space joints.** Works, moves ownership boundary. Solve reads runtime-derived positions; runtime must know pivot keys; second evaluation per tick memoised. Pure seam ADR-051 draws worth more than saved arithmetic; issue #214 requires single pass.
4. **Averaging child pivots at a sub-base.** Convention above refuses it: averages incompatible geometry, sub-base direction implied differently per branch, pose composition disagrees with reported positions.
5. **Replacing the analytic path with FABRIK now that both account for offsets.** `IK-1`, `IK-3` pin exact angles; `flip` at arity two selects exact branch not basin; iterative solve reaches tolerance. Every solving rig moves. `PV-7` holds paths to each other on offset rig — shared-convention assertion.
6. **Keeping the refusal for the branch case only.** Two conventions for one authored key, decided by derived member count author never wrote. ADR-053 alternative 2; defining sub-base convention is this record's purpose.
7. **Seeding the arc from the effective links rather than the segment lengths.** Better first guess, second geometry to keep in step. First outward pass overwrites seed points; seed only says which way chain bends.

## Consequences, stated as costs

1. **`plugins/frame.ts` is no longer only readers.** Holds kinematic convention, wider than ADR-051 left. Accepted: alternative = two convention copies in two files that are halves of one composition — drift module created to end.
2. **`FabrikSolution` gains `pivots`.** Published patch unchanged, `rotations` alone → test surface, not runtime. Returned not derived: recomputing pivot from rotation re-derives thing under test.
3. **`SolveMember.pivot` is optional** (`FabrikMember.pivot` when written; ADR-106 replaced type with `SolveMember` in `plugins/ik-member.ts`). Absent = zero, exactly `fk` composition for bone authoring neither key; `PV-6` pins absent vs authored zero byte-identical. Required field would put `{ x: 0, y: 0 }` on every fixture to say nothing.
4. **A branching rig with incompatible offset geometry solves, not reports.** Converges to compromise incompatible goals already converge to; `FB-5` documents shape. Naming it needs per-tick diagnostic — decision ADR-051 closed generally.
5. **The offset gap ADR-053 named stays open, harmless.** `fk` composes pivot from flattened value namespace → `x` under non-`solver` group reaches it. Under refusal = unaccounted offset; now offset solve does not know, on member whose rotation plugin owns. Wide read ADR-053 alternative 6 rejects still unnecessary.
6. **No mode added → no new numbered record owed.** Dispatch unchanged, no solve branch, no published key moves, no new authored spelling. This record = whole architecture change.

## Evidence

- `PV-1` through `PV-10`: `packages/plugins/test/unit/pivot-offset-solve.test.ts`. Each member offset alone + both together reaching target on both elbow branches at three root rotations; analytic path byte-identical to pre-offset arithmetic over 180 zero-offset combinations; three- and five-bone chain keeping every segment length, reaching tolerance; absent offset + authored zero one solve; two paths agreeing on offset rig; branching offset chain solving both goals, deterministic under twenty authored permutations; chain root offset moving chain rigidly; unreachable offset chain clamped to effective link reach. Oracle `fkPlugin.compose`, not trigonometry copy.
- `RS-11` through `RS-13`: `packages/core/test/unit/graph/solved-pivot-offset.test.ts`. Three refusal cases inverted into acceptances, graph + derived chain asserted not only empty diagnostics; every offset loader accepted still accepted; shared reader scope, dead rotation sole carrier.
- Unchanged, making geometry safe not merely new: `IK-1` through `IK-4` and `IK-18`, `FB-1` through `FB-9`, `FB-13` and `FB-15`, walker demo cases 11 and 13, `IK-13` end to end, `FO-1` through `FO-6`. No fixture re-authored, no pinned number moves.
