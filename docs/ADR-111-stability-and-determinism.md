# ADR-111: Stability and determinism of the 2D solve

**Status:** Proposed as issue [#349](https://github.com/chahyasantoso/motion5/issues/349) phase 6,
2026-09-24, against `main` at `7e6f4edc` (phase 5, PR #486, ADR-110). Accepted when its pull request
merges.

## Invariant

`solveChain` is a total, pure function of its root, its members and `flip`:

- **Finite.** For every rig whose root, lengths, pivot offsets and goals are finite, every published
  rotation, every per-leaf residual and `quality.residual` is finite. A residual that would exceed
  the largest double is `Number.MAX_VALUE`.
- **Scale-free.** Scaling every world-unit field of a rig by a power of two leaves the closed form's
  rotations bit-identical, and a rig past `SOLVE_MAGNITUDE_CEILING` (`2 ** 500`) publishes exactly
  the result of its power-of-two image at the ceiling, with residuals restored to world units.
- **Order-free.** The result does not depend on the order members are listed in. The closed form's
  pair is proven from the `base` relation, and FABRIK already sorted by depth and then by id.
- **Pure.** No state survives a call and nothing is warm-started from a previous frame, so repeated
  and interleaved solves are `Object.is`-identical, inputs are never written, and an engine that
  seeks backward or at random republishes the forward pass byte for byte.
- **Geometrically sound.** FABRIK preserves every member's solve length and never moves the chain's
  base, and every rotation moves continuously as its goal moves, except where the goal crosses the
  chain's own base, which is a singularity of the geometry rather than of the arithmetic.

Every rig the publisher can deliver, parent first and with distinct member ids, publishes in the
ordinary range the bytes it published on `main` at `7e6f4edc`. A direct `solveChain` caller that
listed a valid pair child first now receives the parent-first answer instead of the wrong pose,
which is the order fix below and is deliberate. What changed is confined to rigs whose arithmetic
previously left the normal double range, all of which either published `NaN` or published an angle
rounded through subnormal intermediates.

## Why now

ADR-106 lists this as delivery item 6: property evidence for singularities, branch switches, root
coincidence, angle wrap and near-full extension, and the stated purity that makes reverse scrub and
random seek reproduce the forward pass. Phases 1 to 5 each pinned their own numbers and none
measured the properties every solve owes regardless of strategy. The first measurement found two
defects, so this phase is a fix as well as a record.

## What the measurement found

A seeded property probe ran 100,000 random rigs of one to six members, linear and branching, with
offsets, limits and influence, plus 24 edge rigs and an engine seek check, against `main` at
`7e6f4edc`. Purity, limit bounds and engine seek determinism held with zero violations, all nine
quality kinds were observed, and no negative zero was published. Two defects were found:

1. **Order dependence in the closed form.** `chainShape` read the pair as
   `[first, second] = members`, so `[child, parent]` solved the child as if it hung from the root:
   members `a` of length two and `b` of length one, based on `a` with its goal at `(2, 1)`,
   published `{ a: 53.13, b: -90 }` in order and `{ b: 90, a: -90 }` reversed, both reporting
   `reached`. The publisher delivers members parent first, because `resolveSolvers` sorts chains by
   depth, so no loaded rig reached this path; it is a defect of the pure function the dispatcher
   claims to be.
2. **`NaN` at extreme magnitudes.** The closed form squared its sides in the law of cosines, so
   sides near `1e155` and above overflowed to `Infinity` and sides near `1e-170` and below
   underflowed to zero, and both quotients were `NaN`. A mixed rig failed the same way: a root at
   `x: 1` with lengths `2e-200` and `1e-200` published `NaN`. FABRIK failed only near
   `Number.MAX_VALUE`, where the seed's length sum overflowed. A `NaN` rotation fails the
   publisher's renderer-neutrality check and errors the node, and a length or goal is live, so load
   cannot refuse the magnitude.

## Decisions taken, not asked

**The closed form's pair is proven, not positional.** `twoBonePair` in `ik-solve.ts` asks
`provenPair` both ways round, and `provenPair` accepts a parent and child only when the child's
`base` is the parent's id, the parent hangs from neither member, and only the child carries a goal;
anything else is not the closed form's shape and takes FABRIK. The middle condition is what makes
the proof symmetric: both orders could succeed only if each member hung from the other, which is a
cycle, so a cycle and a self-based member reach FABRIK from either order and FABRIK refuses both as
`Solver chain cycles at member`. Two siblings off the root, a goal on the parent and a goal on both
route to FABRIK too, which reads the relation itself. Members are read with distinct ids, which the
publisher guarantees, and load refuses every one of these shapes, so no loaded rig changes route.

**The law of cosines is stated once and solved at unit magnitude.** `cosineOpposite` in
`ik-analytic.ts` replaces the two restated quotients. It scales the three sides by the power of two
nearest the largest side's reciprocal before squaring. A power-of-two scale is exact on normal
doubles and IEEE arithmetic commutes with it, so every triangle whose arithmetic stayed normal gets
the identical quotient bit for bit, which is why the scale can be unconditional rather than a window
with an edge. The exponent is held inside `[-1000, 1000]` so the scale itself is a normal power of
two. A quotient that is still `NaN` is a triangle one of whose adjacent sides is below `2 ** -1074`
of the largest, a side of no extent even at unit magnitude; the angle beside it reads nothing and
answers a cosine of one. Besides the subnormal-rounded triangles above, that is the one finite
answer the scale changes rather than repairs: a link of `2 ** 500` with a second segment of
`2 ** -600` published an elbow of `-90` on `main` and publishes `-180` now, and both put the tip at
the same point to the last bit.

**A rig past the ceiling solves as its image.** `ik-scale.ts` owns the magnitude as a closed union,
`SolveMagnitude = { native } | { rescaled, exponent }`, and `solveChain` reads it with a `switch`
ending in `unreachable` before it dispatches on shape. The ceiling is `2 ** 500`: a sum of any
practical chain at that magnitude stays finite and so does the square of a sum of sixteen of them.
Rotations are read back unchanged and residuals are scaled back, saturating at `Number.MAX_VALUE`.
The quality kind is the image's and it is the rig's too, because one ulp at the ceiling is
`2 ** 448` world units and `FABRIK_TOLERANCE` is `1e-3`, so a scale cannot move a miss across the
tolerance at any representable precision. The native arm is the path every rig took before,
unchanged, so its output is byte-identical by construction.

**Unconstrained rotations stay unwrapped.** The closed form publishes
`targetAngle + alpha - twist - root.rotation` and FABRIK publishes `worldDirection - baseDirection`,
neither folded into `(-180, 180]`; the probe observed published angles up to about a million degrees
for a root rotated that far. Folding would move published bytes for every rig whose root turns past
half a turn, and `lerpAngle` in `frame.ts` already blends along the short arc whatever the
separation, so a composed pose is the same either way. `SD-9` pins the decision: a whole turn of the
root is the same pose and a different first rotation. A limited joint is wrapped by `limitRotation`,
as ADR-108 decided, and stays inside its declared bounds.

**The goal-through-root jump is documented, not smoothed.** A goal swept along a line through the
chain's base jumps by about 180 degrees at the base, on both strategies and both branches, because
the direction to the goal is undefined there and the elbow branch flips with it. Smoothing it would
need a warm start from the previous frame, which would break the purity every other decision here
depends on. Continuity is pinned everywhere else: a goal swept around the chain moves no rotation
further than the goal turned, and a goal moved radially through full extension moves every rotation
by less than a quarter degree per `1e-4` world units.

**FABRIK's tolerance stays absolute.** `FABRIK_TOLERANCE` is `1e-3` world units at every magnitude,
so a rig of tiny extent converges at once and a rig of huge extent converges only on an exact
answer. A relative tolerance would change `iterations` and the kind for ordinary rigs and was not
asked for by anything measured here. The scale policy is phase 7's to document.

## Withdrawn

- **Refusing extreme magnitudes at load.** Every world-unit field a solve reads is live, so an
  animated length or goal walks past any bound load could check. A rule that refuses a shape the
  runtime can reach through a value write is weaker than a total solve.
- **A fast path with a fallback on `NaN`.** Computing the law of cosines unscaled and rescaling only
  when the quotient is not finite misses the triangles whose quotient is finite and wrong, rounded
  through subnormal squares, and an overflow to `Infinity` that the clamp turns into a plausible
  `±1`. The unconditional scale is exact where the old form was, and correct where it was not.
- **Wrapping published rotations.** See the decision above.
- **A warm start for branch continuity.** See the decision above.

## Evidence

`SD-1` to `SD-12` in `packages/core/test/unit/plugins/ik-stability.test.ts`:

- `SD-1`: the closed form is finite at `2 ** -700`, `2 ** -560`, `2 ** 480` and `2 ** 530` and
  bit-identical to the unit rig, the mixed-scale rig is finite and `too-near`, the sliver arm
  answers the aligned angle, and the worked rig still publishes `40.168` and `-51.318`.
- `SD-2`: a chain of three `Number.MAX_VALUE / 2` members is finite and equals its restored image
  exactly; the ceiling is native and one order past it rescales by one; a pivot offset counts and a
  rotation does not.
- `SD-3`: a residual past the largest double is `Number.MAX_VALUE`.
- `SD-4`: `[child, parent]` equals `[parent, child]`; siblings, a parent goal and a goal on both
  route to FABRIK; a two-member cycle, a self-based parent and a self-based child are refused as a
  cycle from either order; a pair with no goal keeps its message; 400 shuffled corpus rigs equal
  their ordered solve.
- `SD-5`: 300 deep-frozen rigs solved twice, interleaved in reverse, are identical and frozen.
- `SD-6`: FABRIK keeps every length within `1e-9` relative and every base pivot exactly where the
  root puts it, over 400 rigs.
- `SD-7`: a goal on the root is `coincident` with the rest pose on the closed form and converges on
  FABRIK, and an all-zero chain publishes zeros.
- `SD-8`: exact full extension is `reached` with residual zero and an elbow of positive zero; one
  side of the edge at `1e-12` and `1e-9` stays `reached`, the other is `too-far` by exactly the
  excess; a straight FABRIK chain converges.
- `SD-9`: a whole turn of the root is the same pose and an unwrapped first rotation, on both
  strategies.
- `SD-10`: a goal swept around the chain in 720 steps of half a degree turns no rotation further
  than the goal turned, both strategies and both branches, and a radial sweep through full extension
  in steps of `1e-4` moves no rotation by a quarter degree. Both are sampled bounds rather than a
  proof of continuity between samples.
- `SD-11`: 600 limited rigs stay in bounds, and 600 more at `1e-200`, `1e-160`, `1e155` and `1e300`
  are finite.
- `SD-12`: an engine that seeks forward, in reverse and at random through 21 stops republishes the
  forward solver patch at every stop, compared structurally under `Object.is` so a negative zero or
  a `NaN` could not hide behind a serialisation, and the forward pass publishes a different patch at
  each.

Each source change is killed by a case: reverting `ik-analytic.ts` fails `SD-1` and `SD-11`,
reverting `ik-solve.ts` fails `SD-2`, `SD-3` and `SD-4`, the positional pair proof of this slice's
first commit fails the cycle rows of `SD-4`, removing the saturation fails `SD-3`, and removing the
sliver arm fails `SD-1`.

Byte identity was measured against `main` at `7e6f4edc`: 200,000 seeded rigs with lengths drawn from
finite, zero, negative-zero and negative values, offsets, limits, influence, both `flip` values and
root rotations at the half turn, negative zero and past a whole turn were solved on both trees and
every result was identical under `Object.is` with identical key order. At twelve extreme scales from
`1e-300` to `1e305`, 5,000 rigs each, the candidate published no non-finite value; `main` published
one on 372 to 442 rigs per scale from `1e155` up and from `1e-170` down, and every other difference,
292 rigs at `1e-160`, is a rig whose squares were subnormal on `main`. The probe, the corpus scripts
and their exact output are in the handover given to the requester, not in this repository; they have
no run in this repository's suite and their output is reviewed rather than trusted.

## Consequences

`ik-scale.ts` is a new module of about 6,000 bytes, `ik-solve.ts` and `ik-analytic.ts` grow by the
pair proof and the law of cosines, and `fabrik.ts` is untouched at 25,825 bytes. The next strategy,
including phase 8's `ik3d`, inherits totality at the dispatcher rather than restating it, as long as
it is reached through `solveChain`. Nothing is authorable and no load rule is added, so the authored
schema and the errors guide are unchanged.
