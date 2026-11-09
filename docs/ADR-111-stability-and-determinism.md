# ADR-111: Stability and determinism of the 2D solve

**Status:** Accepted, 2026-09-24. Issue [#349](https://github.com/chahyasantoso/motion5/issues/349)
phase 6, against `main` at `7e6f4edc` (phase 5, PR #486, ADR-110).
**Extended by [ADR-126][adr126],
2026-09-27** (issue #514): the selector's limited baseline may pay one opposite-seed retry, while
free and non-limited baselines retain the direct-result identity boundary.

## Invariant

`solveChain` is total, pure function of root, members and `flip`:

- **Finite.** For every rig whose root, lengths, pivot offsets and goals are finite, every published
  rotation, every per-leaf residual and `quality.residual` is finite, including rig mixing members
  of very different magnitude. Finite residual exceeding largest double is `Number.MAX_VALUE`;
  `NaN` never laundered into finite number. Amendment of 2026-09-25 below extends claim to
  non-finite goals: infinite goal coordinate is direction on every strategy, `NaN` one refuses
  solve by name.
- **Scale-free.** Scaling every world-unit field of rig by power of two leaves closed form's
  rotations bit-identical; rig past `SOLVE_MAGNITUDE_CEILING` (`2 ** 500`) publishes exactly result
  of its power-of-two image at ceiling, residuals restored to world units.
- **Order-free.** Result independent of order members listed in. Closed form's pair proven from
  `base` relation; FABRIK already sorted by depth then id.
- **Pure.** No state survives call, nothing warm-started from previous frame → repeated and
  interleaved solves `Object.is`-identical, inputs never written, engine seeking backward or at
  random republishes forward pass byte for byte.
- **Geometrically sound.** FABRIK preserves every member's solve length, never moves chain's base;
  every rotation moves continuously as its goal moves — except goal crossing chain's own base:
  singularity of geometry, not arithmetic.

Every rig publisher can deliver, parent first, distinct member ids, publishes in ordinary range the
bytes it published on `main` at `7e6f4edc`. Direct `solveChain` caller listing valid pair child
first now gets parent-first answer, not wrong pose — order fix below, deliberate. Change confined
to rigs whose arithmetic previously left normal double range: all published `NaN` or angle rounded
through subnormal intermediates.

## Why now

ADR-106 lists this as delivery item 6: property evidence for singularities, branch switches, root
coincidence, angle wrap and near-full extension, and stated purity making reverse scrub and random
seek reproduce forward pass. Phases 1 to 5 each pinned own numbers; none measured properties every
solve owes regardless of strategy. First measurement found two defects → phase is fix plus record.
Review of pull request carrying it, [#488](https://github.com/chahyasantoso/motion5/pull/488),
found three more, listed after first two.

## What the measurement found

Seeded property probe ran 100,000 random rigs of one to six members, linear and branching, with
offsets, limits and influence, plus 24 edge rigs and engine seek check, against `main` at
`7e6f4edc`. Purity, limit bounds and engine seek determinism held, zero violations; all nine
quality kinds observed; no negative zero published. Two defects found:

1. **Order dependence in the closed form.** `chainShape` read pair as
   `[first, second] = members` → `[child, parent]` solved child as if hung from root: members `a`
   of length two and `b` of length one, based on `a`, goal at `(2, 1)`, published
   `{ a: 53.13, b: -90 }` in order, `{ b: 90, a: -90 }` reversed, both reporting `reached`.
   Publisher delivers members parent first — `resolveSolvers` sorts chains by depth — so no loaded
   rig reached this path; defect of pure function dispatcher claims to be.
2. **`NaN` at extreme magnitudes.** Closed form squared sides in law of cosines → sides near
   `1e155` and above overflowed to `Infinity`, sides near `1e-170` and below underflowed to zero,
   both quotients `NaN`. Mixed rig failed same way: root at `x: 1`, lengths `2e-200` and `1e-200`,
   published `NaN`. FABRIK failed only near `Number.MAX_VALUE`, where seed's length sum overflowed.
   `NaN` rotation fails publisher's renderer-neutrality check, errors node; length or goal is live
   → load cannot refuse magnitude.
3. **`NaN` in FABRIK on rig of mixed magnitude.** Placement step divided member's length by
   distance to target; finite `1e300` member reaching across finite `1e-100` gap overflowed ratio
   to `Infinity`; product with zero delta `NaN` on every member. No global scale repairs it: rig
   already inside ceiling.
4. **Magnitude wrapper broke non-finite goals.** `solveMagnitude` counted infinite goal as
   magnitude → exponent infinite, scale zero, image read `0 * Infinity`: pair with goal at
   `x: Infinity` published `a: NaN` and `reached` where `main` published `too-far` with infinite
   residual, per ADR-107 and `IR-9`. Restore step compared `restored <= Number.MAX_VALUE`, false
   for `NaN` → turned `NaN` residual into `Number.MAX_VALUE`.
5. **Goal on member with children ignored.** FABRIK reads goals on leaves only → goal on parent,
   which pair proof routes to FABRIK, contributed nothing, had no residual, solve reported
   `converged`. Load refuses shape as `ik-goal-not-leaf` → no loaded rig reached it; previous
   revision of this record said FABRIK read relation itself, and it did not.

## Decisions taken, not asked

**Closed form's pair is proven, not positional.** `twoBonePair` in `ik-solve.ts` asks `provenPair`
both ways round; `provenPair` accepts parent and child only when child's `base` is parent's id,
parent hangs from neither member, only child carries goal; anything else is not closed form's
shape, takes FABRIK. Middle condition makes proof symmetric: both orders succeed only if each
member hung from other — a cycle — so cycle and self-based member reach FABRIK from either order,
FABRIK refuses both as `Solver chain cycles at member`. Two siblings off root take FABRIK as tree.
Goal on parent, alone or beside child's, takes FABRIK too; FABRIK now refuses it by name as goal
not on a leaf, after its cycle guard so cycle keeps own message: answering would invent policy for
interior goals load already refuses as `ik-goal-not-leaf`; ignoring published rig that reached for
nothing as `converged`. Members read with distinct ids, publisher-guaranteed; load refuses every
one of these shapes → no loaded rig changes route.

**Law of cosines stated once, solved at unit magnitude.** `cosineOpposite` in `ik-analytic.ts`
replaces two restated quotients. Scales three sides by power of two nearest largest side's
reciprocal before squaring. Power-of-two scale exact on normal doubles, IEEE arithmetic commutes
with it → every triangle whose arithmetic stayed normal gets identical quotient bit for bit — why
scale is unconditional, not a window with an edge. Exponent held inside `[-1000, 1000]` → scale
itself normal power of two. Quotient still `NaN` is triangle with adjacent side below `2 ** -1074`
of largest, side of no extent even at unit magnitude; angle beside it reads nothing, answers cosine
of one. Besides subnormal-rounded triangles above, that is the one finite answer scale changes
rather than repairs: link of `2 ** 500` with second segment of `2 ** -600` published elbow of `-90`
on `main`, publishes `-180` now; both put tip at same point to last bit.

**Rig past ceiling solves as its image.** `ik-scale.ts` owns magnitude as closed union,
`SolveMagnitude = { native } | { rescaled, exponent }`; `solveChain` reads it with `switch` ending
in `unreachable` before dispatch on shape. Ceiling `2 ** 500`: sum of any practical chain at that
magnitude stays finite, so does square of sum of sixteen of them. Rotations read back unchanged,
residuals scaled back, saturating at `Number.MAX_VALUE`. Quality kind is image's and rig's too:
one ulp at ceiling is `2 ** 448` world units, `FABRIK_TOLERANCE` is `1e-3` → scale cannot move
miss across tolerance at any representable precision. Native arm is path every rig took before,
unchanged → output byte-identical by construction. Only finite fields count toward magnitude:
infinite goal is direction, not size → stays infinite in image, strategies read it there exactly
as natively; `NaN` field reaches them unchanged, not switching scale off for rest of rig. Only
finite residual saturates when restored; infinite stays infinite, `NaN` stays visible.

**FABRIK normalises direction only when ratio overflows.** `place` in `fabrik.ts` keeps
`length / distance` for every finite ratio → every rig that never overflowed places points
byte-identically; only infinite ratio takes direction divided by larger component first,
intermediates staying within `sqrt(2)` of length. Normalising unconditionally: one expression
instead of two, but changes last bit of ordinary rigs, which byte-identity measurement below would
then excuse rather than confirm.

**Unconstrained rotations stay unwrapped.** Closed form publishes
`targetAngle + alpha - twist - root.rotation`, FABRIK publishes `worldDirection - baseDirection`,
neither folded into `(-180, 180]`; probe observed published angles up to about a million degrees
for root rotated that far. Folding moves published bytes for every rig whose root turns past half
turn; `lerpAngle` in `frame.ts` already blends along short arc whatever separation → composed pose
same either way. `SD-9` pins decision: whole turn of root is same pose, different first rotation.
Limited joint wrapped by `limitRotation`, per ADR-108, stays inside declared bounds.

**Goal-through-root jump documented, not smoothed.** Goal swept along line through chain's base
jumps about 180 degrees at base, both strategies and both branches: direction to goal undefined
there, elbow branch flips with it. Smoothing needs warm start from previous frame → breaks purity
every other decision here depends on. Continuity pinned everywhere else: goal swept around chain
moves no rotation further than goal turned; goal moved radially through full extension moves every
rotation less than quarter degree per `1e-4` world units.

**FABRIK's tolerance stays absolute.** `FABRIK_TOLERANCE` is `1e-3` world units at every magnitude
→ rig of tiny extent converges at once; rig of huge extent converges only on exact answer. Relative
tolerance would change `iterations` and kind for ordinary rigs, asked for by nothing measured here.
Scale policy is phase 7's to document.

## Withdrawn

- **Refusing extreme magnitudes at load.** Every world-unit field a solve reads is live → animated
  length or goal walks past any bound load could check. Rule refusing shape runtime reaches through
  value write is weaker than total solve.
- **Fast path with fallback on `NaN`.** Computing law of cosines unscaled, rescaling only when
  quotient not finite, misses triangles whose quotient finite and wrong, rounded through subnormal
  squares, and overflow to `Infinity` clamp turns into plausible `±1`. Unconditional scale exact
  where old form was, correct where it was not.
- **Wrapping published rotations.** See decision above.
- **Warm start for branch continuity.** See decision above.
- **Endpoint-exact seed arc.** At chord below `2 ** -1074` of chain's length, seed's half angle is
  half turn, `sin(pi)` leaves residue of about `1e-16` of radius → seed's last point misses goal by
  that much. Seed promises direction, not points; first outward pass overwrites every point it
  produces. Rewriting with endpoint-stable identities changes seed, and so bytes, of every ordinary
  rig to repair nothing a solve publishes. Mixed-magnitude `NaN` was placement, fixed above.
- **Solving goals on interior members.** See refusal above.

## Evidence

`SD-1` to `SD-14` in `packages/plugins/test/integration/ik-stability.test.ts`:

- `SD-1`: closed form finite at `2 ** -700`, `2 ** -560`, `2 ** 480` and `2 ** 530`,
  bit-identical to unit rig; mixed-scale rig finite and `too-near`; sliver arm answers aligned
  angle; worked rig still publishes `40.168` and `-51.318`.
- `SD-2`: chain of three `Number.MAX_VALUE / 2` members finite, equals restored image exactly;
  ceiling native, one order past it rescales by one; pivot offset counts, rotation does not.
- `SD-3`: residual past largest double is `Number.MAX_VALUE`.
- `SD-4`: `[child, parent]` equals `[parent, child]`; siblings, parent goal and goal on both route
  to FABRIK; parent goal and goal on both refused as goal not on a leaf from either order;
  two-member cycle, self-based parent, self-based child refused as cycle from either order; pair
  with no goal keeps its message; 400 shuffled corpus rigs equal ordered solve.
- `SD-5`: 300 deep-frozen rigs solved twice, interleaved in reverse, identical and frozen.
- `SD-6`: FABRIK keeps every length within `1e-9` relative, every base pivot exactly where root
  puts it, over 400 rigs.
- `SD-7`: goal on root is `coincident` with rest pose on closed form, converges on FABRIK; all-zero
  chain publishes zeros.
- `SD-8`: exact full extension `reached`, residual zero, elbow positive zero; one side of edge at
  `1e-12` and `1e-9` stays `reached`, other is `too-far` by exactly the excess; straight FABRIK
  chain converges.
- `SD-9`: whole turn of root is same pose, unwrapped first rotation, both strategies.
- `SD-10`: goal swept around chain in 720 steps of half a degree turns no rotation further than
  goal turned, both strategies and both branches; radial sweep through full extension in steps of
  `1e-4` moves no rotation by quarter degree. Both sampled bounds, not proof of continuity between
  samples.
- `SD-11`: 600 limited rigs stay in bounds; 600 more at `1e-200`, `1e-160`, `1e155` and `1e300`
  finite.
- `SD-12`: engine seeking forward, in reverse and at random through 21 stops republishes forward
  solver patch at every stop, compared structurally under `Object.is` so negative zero or `NaN`
  could not hide behind serialisation; forward pass publishes different patch at each.
- `SD-13`: branching rig with `1e300` member beside `1e-200` members across `1e-100` gap, and
  linear rig of `1e-200`, `1e300` and `1e-200`, finite on both branches and from either order; 300
  rigs whose every member carries own power of ten from `1e-300` to `1e300` finite.
- `SD-14`: pair with goal at `x: Infinity` publishes `{ a: 0, b: 0 }`, infinite residual and
  `too-far`, natively and at `2 ** 600`, where magnitude rescales by exactly 100 orders; restored
  residual saturates when finite, stays infinite when infinite, stays `NaN` when `NaN`.

Each source change killed by a case: reverting `ik-analytic.ts` fails `SD-1` and `SD-11`;
reverting `ik-solve.ts` fails `SD-2`, `SD-3` and `SD-4`; positional pair proof of this slice's
first commit fails cycle rows of `SD-4`; removing saturation fails `SD-3`; removing sliver arm
fails `SD-1`. From review: always taking ratio in `place` fails `SD-13`; dropping interior-goal
refusal fails `SD-4`; counting non-finite fields toward magnitude fails `SD-14`; saturating
non-finite residual fails `SD-14`.

Byte identity measured against `main` at `7e6f4edc`: 200,000 seeded rigs, lengths drawn from
finite, zero, negative-zero and negative values, offsets, limits, influence, both `flip` values and
root rotations at half turn, negative zero and past whole turn, solved on both trees; every result
identical under `Object.is` with identical key order. At twelve extreme scales from `1e-300` to
`1e305`, 5,000 rigs each, candidate published no non-finite value; `main` published one on 372 to
442 rigs per scale from `1e155` up and from `1e-170` down; every other difference, 292 rigs at
`1e-160`, is rig whose squares were subnormal on `main`. Probe, corpus scripts and exact output are
in handover given to requester, not in this repository; no run in this repository's suite, output
reviewed rather than trusted. Review's fixes measured same way against phase's own first revision:
same 200,000 ordinary rigs, same twelve extreme scales, 260,000 rigs in all, identical under
`Object.is` → three later fixes change no rig that did not publish `NaN` or ignore a goal.

## Consequences

`ik-scale.ts` is new module of about 6,000 bytes; `ik-solve.ts` and `ik-analytic.ts` grow by pair
proof and law of cosines; `fabrik.ts` grows to 27,220 bytes by overflow-safe placement and
interior-goal refusal, still under 30,000-byte sister-document threshold. Next strategy, including
phase 8's `ik3d`, inherits totality at dispatcher rather than restating it, as long as reached
through `solveChain`. Nothing authorable, no load rule added → authored schema and errors guide
unchanged.

## Amendment, 2026-09-25: a goal is a point or a direction, and a `NaN` coordinate is refused by name

Issue [#489](https://github.com/chahyasantoso/motion5/issues/489), found by independent quality
pass on [#488](https://github.com/chahyasantoso/motion5/pull/488), against `main` at `7aa47815`
(#495 squash-merged). **Finite** claim above scoped to finite goals; gap was in contract, not a
regression: FABRIK published `NaN` rotations for every non-finite goal.

### Invariant

For every rig whose root, lengths and pivot offsets are finite, whatever its goals hold: every
published rotation finite or solve refused by name; no strategy publishes `NaN`. Goal coordinate
`Infinity` or `-Infinity` makes goal a direction; `NaN` coordinate names neither point nor
direction, throws
`Solver goal on member "<id>" has a NaN <axis> coordinate, which names no point or direction to solve toward.`,
citing first such coordinate in canonical order (members as strategy orders them, then axes `x`,
`y` and, on internal 3D closed form, `z`). 2D closed form, FABRIK and internal 3D closed form
answer one way because one module answers for all three (ADR-106).

### What was measured before the fix

Through runtime no solver receives non-finite goal: `readFrame` reads non-finite field as zero at
plugin boundary (`readNumber` in `frame.ts`); publisher's renderer-neutrality check refuses
composition holding non-finite number → no goal source can publish one. Defect lived in pure solve
functions, exactly what this record claims to be total. On `7aa47815`:

- 2D closed form already published finite rotations for `Infinity` and `-Infinity`, as `too-far`
  with infinite residual: `Math.atan2` treats infinity as direction. `NaN` coordinate published
  `NaN` rotations reported as `reached` with `NaN` residual, which `IR-9` pinned.
- FABRIK published `NaN` for every non-finite spelling. First `NaN` came from `Math.hypot` in seed
  arc; one infinite leaf in tree contaminated every member of tree.
- Internal 3D closed form absorbed non-finite goal into rest-pose fallbacks, reported non-finite
  residual.

### Decisions taken, not asked

**One owner reads a goal.** `ik-goal-reading.ts` owns closed union
`GoalReading = { kind: "point", coordinates } | { kind: "direction", direction }` and three
readings of it, each exhaustive `switch` ending in `unreachable` (ADR-092). `readGoal(memberId,
axes)` classifies or refuses. `aimPoint(reading, origin, reach)` is finite point iterative solve
moves tip toward. `goalMiss(reading, tip)` is residual solve publishes. No strategy keeps private
predicate or ternary on whether goal is direction.

**Infinite coordinate is direction.** Direction is unit vector of signs of infinite coordinates,
finite coordinate contributing zero → `(Infinity, 5)` is `+x`, `(Infinity, -Infinity)` is `-45`
degrees. That is what `atan2` already gave 2D closed form, now stated once. Closed forms aim along
it fully extended, report `too-far` with infinite residual. FABRIK aims at stand-in on ray from root
at twice reach of leaf's path (sum of its members' solve lengths and pivot offsets, floor one unit,
saturating at quarter of largest double) → passes run unchanged, straighten path along direction as
toward any unreachable goal; published per-leaf residual `Infinity`; `quality.residual` is larger
of iteration's residual and every published miss, which equals iteration's residual on every finite
rig. Kind is whatever FABRIK gives unreachable goal (`stalled` for single chain). No new quality
kind added; `too-far` stays closed-form only, so `IR-7`'s strategy-family recovery holds.

**`NaN` coordinate refuses whole solve.** Including tree where one leaf is `NaN`, siblings finite:
`NaN` is defect to surface, rule `restoreDistance` already documents; silently dropping one branch
hides it. Refusal is thrown `Error` like every other solver refusal → were it delivered, would
surface as node's `composition-failure`.

**Finite root rotation past product's range names a frame.** Independent quality pass on this
change measured rig with finite root at `rotation: Number.MAX_VALUE`, finite lengths, finite pivot
offset, finite goal publishing `a: NaN`, `reached` and `NaN` residual:
`(rotation * Math.PI) / 180` overflows to `Infinity` past about `5.7e307` degrees, `cos` and `sin`
of it `NaN`. Predates #489, but falsified invariant above → fixed here, invariant not narrowed.
`toRadians` in `frame.ts` is the one 2D degrees-to-radians reader: keeps raw product for every
angle whose product finite → every rig that composed before composes to same bit; reduces whole
turns with `%`, which is exact, only where product overflows. `composeWorld`, which `fk.compose`
and every pivot conversion read, and closed form's rest miss read it. FABRIK's
`* (Math.PI / 180)` needs no owner change: factor below one, product cannot overflow. Always
reducing withdrawn: 2D rotations published unwrapped (above), reduced product differs from raw one
in last bit past a turn → every rotated rig would move; internal 3D frame reduces every angle in
`frame3d.ts`, which it could from birth: no published bytes to keep. `fk` bone composed under such
rotation used to publish `NaN`, fail publisher's renderer-neutrality check; now publishes.

**Withdrawn.** Refusing infinities — regresses closed form's pinned directional behaviour. Reading
`NaN` as no goal for tick — hides defect, invents pose. FABRIK `too-far` — breaks ADR-107's family
rule. FABRIK-private set of directional leaves beside ternary on quality residual, which first
prototype had: two places answering whether goal is direction is the defect ADR-106 exists to
prevent. Runtime case through `ikPlugin.compose` with infinite goal — would pin only
`readFrame`'s laundering to zero, not this decision.

### Evidence

`packages/plugins/test/integration/ik-stability.test.ts`:

- `SD-15`: every spelling (`Infinity`, `-Infinity`, `NaN`) on `x` and on `y`, on two-bone pair and
  three-member FABRIK chain. Infinite spelling publishes whole path straightened along axis it
  names (first member at `0`, `180`, `90` or `-90` degrees, every later member at zero), per-leaf
  residual `Infinity`, `too-far` on closed form and `stalled` on FABRIK; `NaN` throws naming member
  and axis.
- `SD-16`: tree whose first leaf in canonical order is `NaN`, sibling directional and limited,
  refuses naming first leaf; so does tree with finite sibling.
- `SD-17`: internal 3D closed form reads each infinite spelling on `x`, `y` and `z` as `too-far`
  with infinite residual and finite rotations; refuses `NaN` on each axis.
- `SD-18`: root at `Number.MAX_VALUE` and `-Number.MAX_VALUE` degrees solves pivot-offset pair,
  coincident pair, limited offset chain and influenced tree with finite rotations and exactly
  residuals and quality of root at `rotation % 360`; `composeWorld` places point as that frame
  does; root at `725` degrees keeps raw product bit for bit. Fails on pre-fix source.

`IR-9` in `ik-result.test.ts` replaces its `NaN`-reads-`reached` expectation with refusal.
Mutations of `ik-goal-reading.ts`, each run against `SD-15` to `SD-17` and `IR-9`: `readGoal`
always answering a point fails `SD-15`; removing refusal fails all four; direction's miss measured
as finite distance fails `SD-15`; direction's aim at origin instead of stand-in fails `SD-15`. Last
survived first revision of `SD-15`, which asserted only finiteness — why `SD-15` pins pose.
Reverting `toRadians` to raw product fails `SD-18`.

Byte identity measured against `7aa47815`: 337,500 seeded finite rigs in nine families of 37,500
(two-bone; serial FABRIK chains of three to 64; branching trees with and without influence; joint
limits; pivot offsets; zero, negative-zero and negative lengths; magnitudes near and past
`SOLVE_MAGNITUDE_CEILING`; internal 3D two-bone solve; root rotations from one to `1e301` degrees
under offsets, limits and trees, which is what `toRadians` reads) solved on both trees; every
published field, including per-leaf residuals, every quality field and `inspectSolve`'s projection,
identical under `Object.is` with identical key order. Harness and output travel in handover given
to requester, not in this repository; no run in this repository's suite, output reviewed rather
than trusted.

### Consequences

`ik-goal-reading.ts` is new module of about 4,500 bytes; `fabrik.ts` is 28,586 bytes, still under
the 30,000-byte sister-document threshold, and `frame.ts` gains `toRadians`. Published bytes of
every finite rig unchanged; nothing authorable → no load rule added, authored schema unchanged.
Runtime answer unchanged too: no delivered goal is non-finite.

## Amendment, 2026-09-25 (#490): selector determinism

Selector has no warm state, reads no previous pose. Always evaluates authored centroid baseline
first; only when that result is `conflicted`, evaluates same three fixed alternatives in recorded
order. Candidate comparison reads only existing quality kind and residual; exact ties retain
earlier candidate; `NaN` residual ranks below every number in either position → comparator is total
order, selection cannot depend on which candidate compared first. Member order still canonical
before any proposal is built; reach-circle Jacobian's coincident-centre axis always positive x.
Therefore permutation, repeat and interleaving checks cover selector as well as underlying passes.
Losing candidate is implementation detail, never published or exposed as restart metadata.

`SD-20` covers seeded no-regression, permutation, repeat and interleave corpus for this selector.

Baseline returned directly rather than reconstructed whenever its closed quality selector has no
alternatives. That is compatibility boundary: selector adds no arithmetic to unbranched rig,
two-bone rig, converged tree, stalled result or iteration-cap result. Baseline classified
`conflicted` pays its three recorded alternatives; `limited` baseline pays one opposite-seed retry
(ADR-126); each selected result reports that candidate's own iterations.

[adr126]: ./ADR-126-limited-fabrik-seed-side-bidirectional-limits-and-pass-budget.md
