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

No 2D behaviour changes. Three existing modules gain lines: `ik-analytic.ts` exports two functions
it already had (below), `graph/ir.ts` asks `contract/solver-shape.ts` whether a derived chain is
one the solver's plugin accepts, and `rule-id.ts` and `rule.ts` register `ik-chain-unsupported`.

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
matrix, and decomposes the resulting matrix using the same convention. At gimbal lock,
`rotationY` is pinned to zero and `rotation` is selected from the first matrix column.
Every decomposed angle is canonical in `(-180, 180]`: `-180` reads as `180` and negative zero as
positive zero, so the representation is deterministic.

The bend plane's pole is root-local +z: the normal is transformed root-local +z with its component
along the root-to-goal direction `e1` removed, and the elbow bends toward `e2 = normal x e1`. In
the planar subset that is +z exactly, so `e2` is the 2D positive branch at every goal azimuth,
including goals behind the root, and it turns continuously with the goal everywhere except on the
root's local z axis. There the normal falls back to `e1 x y` (root-local y), putting the elbow on
the root's +y side (`TH-18`). A goal on the root uses root-local +x as `e1`. No authored pole or
flip key exists in this prototype.

The degenerate arms are a closed union read by one exhaustive switch, in the 2D closed form's order:
no second segment aims the first; no first segment keeps it at rest and aims the second; a goal
clamped to zero distance answers with the rest pose as `coincident`; otherwise the triangle. The
reach band classification and the scaled law of cosines are the 2D module's own `bandQuality` and
`cosineOpposite`, now exported from `ik-analytic.ts` (an `export` keyword each, no byte of 2D
behaviour changed) so neither is stated twice.

The analytic solver accepts exactly two unbranched `fk3d` members and one target position. The
contract layer declares that shape and the graph refuses other derived arities with
`ik-chain-unsupported`; the compose-time check remains only as an invariant guard. Lengths keep the
forgiving 2D FK semantics: non-finite values read as zero and negative values are clamped by
`segmentExtent` to zero rather than rejected. Direct solver callers must provide finite frames;
`readFrame3d` sanitizes authored values at the plugin boundary, mirroring 2D.

It publishes local Euler triples under `rotations3d`, reusing `ClosedFormQuality` from the 2D result
contract. `quality` and `residuals` remain on `SolveResult3d` as solver-level evidence, following
ADR-107; they are not published because an inspection/result output contract is deferred until
promotion. The FK member consumes the member's local triple and publishes only
`x`, `y`, `z`, `rotation`, `rotationX`, and `rotationY`. The DOM adapter therefore receives scalar
keys it already knows how to serialize while the composite solver record remains renderer-shielded.

The planar reduction gate (`TH-6`, 500 seeded rigs at every azimuth and reach outcome) requires
zero X/Y rotations, equal quality kinds, and Z angles equal to 2D modulo 360. Measured over 200,000
sandbox rigs on the TH-6 generator (seed `0x3493d`): at most `2.1e-11` degrees inside the reach
band, zero X/Y rotation and no quality-kind mismatch. At a band edge 2D differs by up to `2.4e-5`
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
- Quaternion publication is withdrawn because the DOM contract is scalar Euler keys and currently
  has no quaternion serializer or public quaternion shape.
- A dimension flag on the 2D plugins is withdrawn because it would give one plugin two frame
  conventions and make 2D ownership conditional rather than explicit.
- `fk3d` claiming authored rotation keys is withdrawn because solver output owns member orientation;
  identity is the unbound member pose and authored Euler overrides are not in v1.
- A wildcard package export is withdrawn because the prototype is internal-only and package exports
  are an allow list. No `index.ts` or package export is changed.

## Consequences

The generic graph membership and publisher are proven reusable: `root`, `target`, `targets`,
`base`, and `solver` retain their existing slot meanings, and publisher scope is the plugin name
rather than a hard-coded `ik`. The prototype is deliberately not a public API and has no authored
3D joint-limit, influence, or blend vocabulary. A future promoted 3D API must define those contracts
separately rather than widening planar constraints.

## Evidence

The `TH-1` through `TH-20` cases cover CSS matrix order, composition, gimbal behavior, near-180
matrix round trips, non-finite input defaults, analytic quality, planar reduction, boundary
continuity, singular bend fallback, non-planar closure and length preservation, plugin wiring,
member ordering by `base` links, FK output, grouped ownership, unsupported chain load refusal,
engine/DOM delivery, dirty propagation, and the separate `rotations3d` output channel. The
200,000-rig corpus above also measured non-planar closure (arbitrary root orientation, reachable
goals anywhere in space) at `1.9e-12` and segment length drift at `4.3e-14`. It is sandbox evidence
carried as the `p8-corpus` opaque component of the phase 8 handover, with its probe and result; it
is not repository-proven evidence and has no run in this repository's CI.
