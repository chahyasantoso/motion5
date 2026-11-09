# ADR-114: 3D seam prototype

**Status:** Accepted, 2026-09-27, as part of the public 3D contract
([ADR-125](./ADR-125-public-3d-api.md)); landed through #492 (`main` at `87154b95`).
Proposed as issue [#349](https://github.com/chahyasantoso/motion5/issues/349) phase 8,
2026-09-24, against `main` at `7c9ffc3a` plus phase 7 (ADR-113).

## Context

Issue #349 phase 8 needs bounded proof three-dimensional root, two-bone analytic solve, forward-kinematics member can
travel through existing graph + DOM seams. Prototype internal, opt-in. Must not widen established 2D plugin contracts
or package's public exports before geometry and delivery contract have evidence.

## Decision

Phase owns six internal modules under `packages/core/src/plugins/`. `frame3d.ts` sole owner of 3D vectors, matrices,
frame reading, composition, Euler decomposition. `transform3d.ts` root + goal reader. `ik3d-analytic.ts` owns
bend-plane selection, two-bone law of cosines, degenerate arms, local pose derivation, residuals, closed-form quality.
`ik3d-result.ts` owns 3D result shape. `ik3d.ts` adapts generic publisher members and goals to that solver, reading
through 2D `DeliveredMember` model, ordering pair by own `base` links not delivery order (`TH-20`). `fk3d.ts` consumes
local pose, publishes scalar world frame. Load rule's shape in `contract/solver-shape.ts` — graph holds no plugin
registry (ADR-044), cannot ask plugin definition.

**Superseded in part by [ADR-136](./ADR-136-registry-owned-solver-capabilities.md), 2026-10-05.**
The shape algebra stays in contract, but the static plugin-name table and derived dedication are
deleted. Admitted declarations reach graph only through `PluginCapabilities`, preserving ADR-044.

No ordinary 2D behaviour changes: every 2D rig loading before loads and solves exactly as did; one new 2D refusal =
chain with `fk3d` member, which shape guard below refuses both directions — neither solver consumes other dimension's
output channel. Existing modules gain lines only where 3D reuses owner instead of restating: `ik-analytic.ts` exports
two functions it already had (below); `ik-scale.ts` exposes magnitude decision as `magnitudeOf`, residual restoration as
`restoreDistance`, which `solveMagnitude` and `restoreResult` keep calling; `ik-chain.ts` splits goal addressing out of
`readGoals` as `goalInputs`, which `readGoals` decodes with `readFrame` exactly as before; `graph/ir.ts` asks
`contract/solver-shape.ts` whether derived chain one solver's plugin accepts; `rule-id.ts`, `rule.ts` register
`ik-chain-unsupported`. No 2D test changes, no 2D message moves.

Invariant: member's local pose composed as matrix, not by adding Euler fields. Frame convention CSS's right-handed
basis: +x right, +y existing 2D positive direction, +z out of plane. Orientation matrix
`Rz(rotation) * Rx(rotationX) * Ry(rotationY)`, degrees. Named Euler order intrinsic Z-X-Y, equivalently extrinsic Y-X-Z.
Matrices:

```text
Rz = [ cos z, -sin z, 0; sin z, cos z, 0; 0, 0, 1 ]
Rx = [ 1, 0, 0; 0, cos x, -sin x; 0, sin x, cos x ]
Ry = [ cos y, 0, sin y; 0, 1, 0; -sin y, 0, cos y ]
```

Composition multiplies parent and local matrices, rotates local translation by parent matrix, decomposes resulting
matrix with same convention. Whole turns reduced before angle becomes radians → every angle inside turn unchanged, keeps
finite angle past about `5.7e307` degrees from overflowing product with pi into `NaN` sine (`TH-22`). At gimbal lock
`rotationY` pinned to zero, `rotation` selected from first matrix column. Every decomposed angle canonical in
`(-180, 180]`: `-180` reads `180`, negative zero positive zero → representation deterministic.

Bend plane's pole root-local +z: normal transformed root-local +z with component along root-to-goal `e1` removed, elbow
bends toward `e2 = normal x e1`. Planar subset = +z exactly → `e2` 2D positive branch at every goal azimuth, goals behind
root included, turns continuously with goal everywhere except root's local z axis. There normal falls back to `e1 x y`
(root-local y), elbow on root's +y side (`TH-18`). Goal on root uses root-local +x as `e1`. No authored pole or flip key
in this prototype. **Refined by [ADR-118](./ADR-118-3d-pole-target.md),
2026-09-25.** Optional authored `pole` slot on `ik3d` now names bend plane where bound and off pivot-to-goal line;
unbound or collinear, rule above holds byte for byte. No flip key exists.

Degenerate arms closed union read by one exhaustive switch, in 2D closed form's order: no second segment aims first; no
first segment keeps it at rest, aims second; goal clamped to zero distance answers rest pose as `coincident`; otherwise
triangle. Reach band classification and scaled law of cosines = 2D module's own `bandQuality`, `cosineOpposite`, now
exported from `ik-analytic.ts` (`export` keyword each, no byte of 2D behaviour changed) → neither stated twice.

Analytic solver accepts exactly two unbranched `fk3d` members + one goal, addressed by bare `target` slot or leaf's
`targets` entry. Which goal member has not dimensional question → `ik3d` reads through 2D chain's `goalInputs`, decodes
with `readFrame3d`. Contract layer declares shape as closed `SolverChainShape` union, graph refuses anything else with
`ik-chain-unsupported` at load: wrong member count, branch, member bound through another plugin. Member plugin
`unbranched` shape names dedicated to it, set `solver-shape.ts` derives from own table → refusal runs both ways: 2D `fk`
member under `ik3d` would read `rotations`, which `ik3d` never publishes; `fk3d` member under 2D `ik` would read
`rotations3d`, which `ik` never publishes. Either composes identity every tick without symptom. **Superseded in part by [ADR-122](./ADR-122-3d-fabrik-tree-solve.md), 2026-09-26** (issue #500 phase 5): `ik3d` declares `tree { memberPlugin: "fk3d" }`, any count and branching of `fk3d` members, and `unbranched` is deleted; the member-plugin dedication and its refusal both ways are unchanged. The compose-time checks remain only as invariant guards. Lengths keep the
forgiving 2D FK semantics: non-finite read as zero, negative clamped by `segmentExtent` to zero not rejected — owner 2D
`fk` also composes through since issue #482. Direct solver callers must provide finite frames; `readFrame3d` sanitizes
authored values at plugin boundary, mirroring 2D.

Publishes local Euler triples under `rotations3d`, reusing `ClosedFormQuality` from 2D result contract. `quality`,
`residuals` stay on `SolveResult3d` as solver-level evidence per ADR-107; not published — inspection/result output
contract deferred until promotion. **Superseded by [ADR-120](./ADR-120-3d-opt-in-inspection.md), 2026-09-26** (issue #500
phase 4): `ik3d` solver authoring static `inspect: true` publishes 2D `inspection` record from `SolveResult3d` through 2D
projection; unopted solver still publishes neither. FK member consumes member's local triple, publishes only `x`, `y`,
`z`, `rotation`, `rotationX`, `rotationY`. DOM adapter receives scalar keys it already serializes, composite solver record
stays renderer-shielded.

**Total over finite rigs, at the 2D policy.** Solve reads magnitude through `ik-scale.ts`, from root and goal positions
including `z` and two lengths. Rig at or below ceiling solves natively; past it solves as exact power-of-two image,
residuals restored, saturating at `Number.MAX_VALUE` exactly as 2D. One owner for policy keeps planar reduction true
across whole finite range not only inside it. Directions quotients by norm not products with reciprocal → subnormal
distance still names direction instead of `0 * Infinity`. `TH-22` pins subnormal rig, opposite roots near
`Number.MAX_VALUE`, saturated residual, planar agreement past ceiling. Composed world coordinates outside that promise,
as in 2D: `fk3d` adding two positions near `Number.MAX_VALUE` overflows, publisher refuses non-finite frame by name.

Planar reduction gate (`TH-6`, 500 seeded random planar rigs, goal azimuths all way round, goals behind root, all three
reach-band outcomes) requires zero X/Y rotations, equal quality kinds, Z angles equal 2D modulo 360. Sandbox run of same
generator over 200,000 rigs (seed `0x3493d`), outside this repository's CI, measured at most `2.1e-11` degrees inside
reach band, zero X/Y rotation, no quality-kind mismatch. At band edge 2D differs up to `2.4e-5` degrees because its
elbow is `acos` of cosine rounded next to -1 or 1 → 2D bends fully extended arm slightly, 3D lays out exactly along `e1`;
gate allows `1e-4` there. Bit identity not claimed. Exact planar bridge to 2D `solveTwoBone` built, withdrawn: two
arithmetic owners for one answer, review measured 720-degree scalar jump across planarity boundary (`TH-17` pins
continuity). All 3D angles canonical `(-180, 180]`.

Bend plane's singular line cannot be removed: no continuous unit perpendicular for every goal direction on sphere → some
direction must switch, and without authored pole the pole axis itself least surprising place. Threshold relative (`1e-9`
of unit pole).

## What is withdrawn

- Authored pole key withdrawn: would require new graph input and ownership vocabulary; root-local +z as pole with +y
  fallback deterministic enough for this seam.
  **Superseded by [ADR-118](./ADR-118-3d-pole-target.md)** (issue #500 phase 3): pole requirement slot, already graph
  input, only vocabulary needed one load rule `ik-pole-without-chain`. Default rule remains unbound answer.
- Quaternion publication withdrawn: DOM contract scalar Euler keys, no quaternion serializer or public quaternion shape.
- Dimension flag on 2D plugins withdrawn: one plugin two frame conventions, 2D ownership conditional not explicit.
- `fk3d` claiming authored rotation keys withdrawn: solver output owns member orientation, identity unbound member pose,
  authored Euler overrides not in v1. **Superseded by
  [ADR-116](./ADR-116-fk3d-rest-orientation-and-solved-weight.md)** (issue #500 phase 1): `fk3d` claims local rest
  orientation + per-member `weight`, solver's triple blended toward not taken outright. `TH-11` uses `minRotation` in
  place of `weight` as example.
- Wildcard package export withdrawn: prototype internal-only, package exports allow list. No `index.ts` or package
  export changed.
  **Superseded in part by [ADR-125](./ADR-125-public-3d-api.md), 2026-09-27.** Prototype no longer internal-only: three
  3D plugins declared package subpaths; still no wildcard.

## Consequences

Generic graph membership + publisher proven reusable: `root`, `target`, `targets`, `base`, `solver` keep existing slot
meanings, publisher scope plugin name not hard-coded `ik`. Prototype deliberately not public API, no authored 3D
joint-limit, influence or blend vocabulary. Future promoted 3D API defines those contracts separately, not by widening
planar constraints.

## Evidence

`TH-1` through `TH-23` cover CSS matrix order, composition, gimbal behavior, near-180 matrix round trips, non-finite
input defaults, analytic quality, planar reduction, boundary continuity, singular bend fallback, non-planar closure and
length preservation, plugin wiring, member ordering by `base` links, FK output, grouped ownership, unsupported chain
load refusal both dimensions, engine/DOM delivery, dirty propagation, separate `rotations3d` output channel, all-nine
matrix and composition oracle (`TH-21`), finite extreme geometry (`TH-22`), negative first member solving and composing
exactly as zero one (`TH-23`). `TH-23` parity guard added by issue #482, green on base too — `fk3d` and 3D closed form
already read `segmentExtent` — holds 3D path to owner 2D `fk` joined. Mutation of dedicated-member rule, member-plugin
rule, angle reduction, quotient normalization, rescale, matrix index, pair ordering each fails at least one.

200,000-rig measurement above also measured non-planar closure (arbitrary root orientation, reachable goals anywhere in
space) at `3.0e-12`, segment length drift `4.3e-14`. Supplementary sandbox evidence, reproducible from `TH-6`/`TH-19`
generators at larger count; not repository-proven, no run in this repository's CI.
