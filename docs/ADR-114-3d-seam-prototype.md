# ADR-114: 3D seam prototype

**Status:** Proposed as issue [#349](https://github.com/chahyasantoso/motion5/issues/349)
phase 8, 2026-09-24, against `main` at `7c9ffc3a` plus phase 7 (ADR-113). Accepted when its pull
request merges.

## Context

Issue #349 phase 8 needs a bounded proof that a three-dimensional root, two-bone analytic solve,
and forward-kinematics member can travel through the existing graph and DOM seams. The prototype is
internal and opt-in. It must not widen the established 2D plugin contracts or the package's public
exports before the geometry and delivery contract have evidence.

## Decision

The phase owns six internal modules under `packages/core/src/plugins/`. `frame3d.ts` is the sole
owner of 3D vectors, matrices, frame reading, composition, and Euler decomposition. `transform3d.ts`
is the root and goal reader. `ik3d-analytic.ts` owns bend-plane selection, the two-bone law of
cosines, degenerate arms, local pose derivation, residuals, and closed-form quality.
`ik3d-result.ts` owns the 3D result shape. `ik3d.ts` adapts generic publisher members and goals to
that solver, reading them through the 2D `DeliveredMember` model and ordering the pair by its own
`base` links rather than by delivery order (`TH-20`). `fk3d.ts` consumes its local pose and
publishes a scalar world frame. The load rule's shape lives in `contract/solver-shape.ts`, because
the graph holds no plugin registry (ADR-044) and so cannot ask a plugin definition.

No ordinary 2D behaviour changes: every 2D rig that loaded before loads and solves exactly as it
did, and the one new 2D refusal is a chain with an `fk3d` member, which the shape guard below
refuses in both directions because neither solver consumes the other dimension's output channel.
Existing modules gain lines only where 3D reuses an owner instead of restating it: `ik-analytic.ts` exports two functions it already had (below); `ik-scale.ts` exposes
its magnitude decision as `magnitudeOf` and its residual restoration as `restoreDistance`, which
`solveMagnitude` and `restoreResult` keep calling; `ik-chain.ts` splits goal addressing out of
`readGoals` as `goalInputs`, which `readGoals` decodes with `readFrame` exactly as before;
`graph/ir.ts` asks `contract/solver-shape.ts` whether a derived chain is one the solver's plugin
accepts; and `rule-id.ts` and `rule.ts` register `ik-chain-unsupported`. No 2D test changes,
and no 2D message moves.

The invariant is that a member's local pose is composed as a matrix, not by adding Euler fields.
The frame convention is CSS's right-handed basis: +x is right, +y is the existing 2D positive
direction, and +z is out of plane. The orientation matrix is
`Rz(rotation) * Rx(rotationX) * Ry(rotationY)`, with angles in degrees. Thus the named Euler order
is intrinsic Z-X-Y, equivalently extrinsic Y-X-Z. The matrices are:

```text
Rz = [ cos z, -sin z, 0; sin z, cos z, 0; 0, 0, 1 ]
Rx = [ 1, 0, 0; 0, cos x, -sin x; 0, sin x, cos x ]
Ry = [ cos y, 0, sin y; 0, 1, 0; -sin y, 0, cos y ]
```

Composition multiplies parent and local matrices, rotates the local translation by the parent
matrix, and decomposes the resulting matrix using the same convention. Whole turns are reduced
before an angle becomes radians, which leaves every angle inside a turn unchanged and keeps a finite
angle past about `5.7e307` degrees from overflowing its product with pi into a `NaN` sine
(`TH-22`). At gimbal lock,
`rotationY` is pinned to zero and `rotation` is selected from the first matrix column.
Every decomposed angle is canonical in `(-180, 180]`: `-180` reads as `180` and negative zero as
positive zero, so the representation is deterministic.

The bend plane's pole is root-local +z: the normal is transformed root-local +z with its component
along the root-to-goal direction `e1` removed, and the elbow bends toward `e2 = normal x e1`. In
the planar subset that is +z exactly, so `e2` is the 2D positive branch at every goal azimuth,
including goals behind the root, and it turns continuously with the goal everywhere except on the
root's local z axis. There the normal falls back to `e1 x y` (root-local y), putting the elbow on
the root's +y side (`TH-18`). A goal on the root uses root-local +x as `e1`. No authored pole or
flip key exists in this prototype. **Refined by [ADR-118](./ADR-118-3d-pole-target.md),
2026-09-25.** An optional authored `pole` slot on `ik3d` now names the bend plane where one is
bound and off the pivot-to-goal line; unbound or collinear, the rule above holds byte for byte. No
flip key exists.

The degenerate arms are a closed union read by one exhaustive switch, in the 2D closed form's order:
no second segment aims the first; no first segment keeps it at rest and aims the second; a goal
clamped to zero distance answers with the rest pose as `coincident`; otherwise the triangle. The
reach band classification and the scaled law of cosines are the 2D module's own `bandQuality` and
`cosineOpposite`, now exported from `ik-analytic.ts` (an `export` keyword each, no byte of 2D
behaviour changed) so neither is stated twice.

The analytic solver accepts exactly two unbranched `fk3d` members and one goal, addressed either
by the bare `target` slot or by the leaf's `targets` entry. Which goal a member has is not a
dimensional question, so `ik3d` reads it through the 2D chain's `goalInputs` and decodes it with
`readFrame3d`. The contract layer declares the shape as the closed `SolverChainShape` union, and the
graph refuses anything else with `ik-chain-unsupported` at load: a wrong member count, a branch,
and a member bound through another plugin. The member plugin an `unbranched` shape names is
dedicated to it, a set `solver-shape.ts` derives from its own table, so the refusal runs both ways:
a 2D `fk` member under `ik3d` would read `rotations`, which `ik3d` never publishes, and an `fk3d`
member under the 2D `ik` would read `rotations3d`, which `ik` never publishes. Either would compose
identity on every tick without a symptom. **Superseded in part by [ADR-122](./ADR-122-3d-fabrik-tree-solve.md), 2026-09-26** (issue #500 phase 5): `ik3d` declares `tree { memberPlugin: "fk3d" }`, any count and branching of `fk3d` members, and `unbranched` is deleted; the member-plugin dedication and its refusal both ways are unchanged. The compose-time checks remain only as invariant guards. Lengths keep the
forgiving 2D FK semantics: non-finite values read as zero and negative values are clamped by
`segmentExtent` to zero rather than rejected, the owner 2D `fk` also composes through since
issue #482. Direct solver callers must provide finite frames;
`readFrame3d` sanitizes authored values at the plugin boundary, mirroring 2D.

It publishes local Euler triples under `rotations3d`, reusing `ClosedFormQuality` from the 2D result
contract. `quality` and `residuals` remain on `SolveResult3d` as solver-level evidence, following
ADR-107; they are not published because an inspection/result output contract is deferred until
promotion. **Superseded by [ADR-120](./ADR-120-3d-opt-in-inspection.md), 2026-09-26** (issue #500
phase 4): an `ik3d` solver that authors the static `inspect: true` publishes the 2D `inspection`
record from `SolveResult3d` through the 2D projection; an unopted solver still publishes neither.
The FK member consumes the member's local triple and publishes only
`x`, `y`, `z`, `rotation`, `rotationX`, and `rotationY`. The DOM adapter therefore receives scalar
keys it already knows how to serialize while the composite solver record remains renderer-shielded.

**Total over finite rigs, at the 2D policy.** The solve reads its magnitude through `ik-scale.ts`,
from the root and goal positions including `z` and the two lengths. A rig at or below the ceiling
solves natively; one past it solves as its exact power-of-two image and its residuals are restored,
saturating at `Number.MAX_VALUE` exactly as 2D's do. One owner for the policy keeps the planar
reduction true across the whole finite range rather than only inside it. Directions are quotients
by the norm rather than products with its reciprocal, so a subnormal distance still names a
direction instead of `0 * Infinity`. `TH-22` pins a subnormal rig, opposite roots near
`Number.MAX_VALUE`, a saturated residual, and planar agreement past the ceiling. Composed world
coordinates are outside that promise, as they are in 2D: `fk3d` adding two positions near
`Number.MAX_VALUE` overflows, and the publisher refuses the non-finite frame by name.

The planar reduction gate (`TH-6`, 500 seeded random planar rigs drawn with goal azimuths all the
way round, goals behind the root, and all three reach-band outcomes) requires zero X/Y rotations,
equal quality kinds, and Z angles equal to 2D modulo 360. A sandbox run of the same generator over
200,000 rigs (seed `0x3493d`), outside this repository's CI, measured at most `2.1e-11` degrees
inside the reach band, zero X/Y rotation and no quality-kind mismatch. At a band edge 2D differs by up to `2.4e-5`
degrees because its elbow is `acos` of a cosine rounded next to -1 or 1, so 2D bends a
fully extended arm slightly while 3D lays it out exactly along `e1`; the gate allows `1e-4` there.
Bit identity is not claimed. An exact planar bridge to 2D `solveTwoBone` was built and withdrawn:
it made two arithmetic owners for one answer and a review measured a 720-degree scalar jump across
the planarity boundary (`TH-17` pins continuity). All 3D angles are canonical in `(-180, 180]`.

The bend plane's singular line cannot be removed: no continuous unit perpendicular exists for every
goal direction on the sphere, so some direction must switch, and without an authored pole the pole
axis itself is the least surprising place. The threshold is relative (`1e-9` of the unit pole).

## What is withdrawn

- An authored pole key is withdrawn because it would require a new graph input and ownership
  vocabulary; root-local +z as the pole with a +y fallback is deterministic enough for this seam.
  **Superseded by [ADR-118](./ADR-118-3d-pole-target.md)** (issue #500 phase 3): the pole is a
  requirement slot, already a graph input, and the only vocabulary it needed is the one load rule
  `ik-pole-without-chain`. The default rule remains the unbound answer.
- Quaternion publication is withdrawn because the DOM contract is scalar Euler keys and currently
  has no quaternion serializer or public quaternion shape.
- A dimension flag on the 2D plugins is withdrawn because it would give one plugin two frame
  conventions and make 2D ownership conditional rather than explicit.
- `fk3d` claiming authored rotation keys is withdrawn because solver output owns member orientation;
  identity is the unbound member pose and authored Euler overrides are not in v1. **Superseded by
  [ADR-116](./ADR-116-fk3d-rest-orientation-and-solved-weight.md)** (issue #500 phase 1): `fk3d`
  now claims a local rest orientation and a per-member `weight`, and the solver's triple is blended
  toward rather than taken outright. `TH-11` uses `minRotation` in place of `weight` as its example.
- A wildcard package export is withdrawn because the prototype is internal-only and package exports
  are an allow list. No `index.ts` or package export is changed.

## Consequences

The generic graph membership and publisher are proven reusable: `root`, `target`, `targets`,
`base`, and `solver` retain their existing slot meanings, and publisher scope is the plugin name
rather than a hard-coded `ik`. The prototype is deliberately not a public API and has no authored
3D joint-limit, influence, or blend vocabulary. A future promoted 3D API must define those contracts
separately rather than widening planar constraints.

## Evidence

The `TH-1` through `TH-23` cases cover CSS matrix order, composition, gimbal behavior, near-180
matrix round trips, non-finite input defaults, analytic quality, planar reduction, boundary
continuity, singular bend fallback, non-planar closure and length preservation, plugin wiring,
member ordering by `base` links, FK output, grouped ownership, unsupported chain load refusal in
both dimensions, engine/DOM delivery, dirty propagation, the separate `rotations3d` output channel,
an all-nine-entry matrix and composition oracle (`TH-21`), finite extreme geometry (`TH-22`), and a
negative first member solving and composing exactly as a zero one (`TH-23`). `TH-23` is a parity
guard added by issue #482 and is green on the base as well, because `fk3d` and the 3D closed form
already read `segmentExtent`; it holds the 3D path to the owner 2D `fk` joined. A mutation of the dedicated-member rule, the member-plugin rule, the angle reduction, the quotient
normalization, the rescale, a matrix index, or the pair ordering each fails at least one of them.

The 200,000-rig measurement above also measured non-planar closure (arbitrary root orientation,
reachable goals anywhere in space) at `3.0e-12` and segment length drift at `4.3e-14`. It is
supplementary sandbox evidence, reproducible from the `TH-6` and `TH-19` generators at a larger
count; it is not repository-proven and has no run in this repository's CI.
