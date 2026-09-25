# ADR-116: fk3d rest orientation and solved weight

**Status:** Proposed as issue [#500](https://github.com/chahyasantoso/motion5/issues/500) phase 1,
2026-09-25, against `main` at `42c723226ed044b11e2441b06c8c7019ae4ed885` (#499). Accepted when
its pull request merges. Supersedes one withdrawn bullet of
[ADR-114](./ADR-114-3d-seam-prototype.md), "`fk3d` claiming authored rotation keys".

## Invariant

An `fk3d` bone composes its authored local rest orientation when nothing solves it, and the
short-arc rotation blend from that rest toward its solved orientation by its own `weight` when
something does. Weight `0` is the rest orientation and weight `1` is the solved triple, both
returned as themselves rather than computed. A rig that authors neither key composes exactly the
bytes the ADR-114 prototype composed.

## Context

The ADR-114 prototype gave a 3D bone no rest pose and no blend: an unsolved `fk3d` member composed
identity, a solved one took the solver's triple outright, and `fk3d` claimed only `length`. 2D has
had both since ADR-051 and ADR-055, and a real rig needs both: an arm stands in a pose before the
solve reaches for anything, and a chain staggers its reach by giving the shoulder and the wrist
different weights. Issue #500 phase 1 is that parity and nothing else.

## Decision

`fk3d` claims `rotation`, `rotationX` and `rotationY`, the bone's local rest orientation relative
to its parent in the CSS `Rz * Rx * Ry` convention [ADR-114](./ADR-114-3d-seam-prototype.md) fixes,
each defaulting to zero and read through `readEuler3d`, so a non-finite angle is zero exactly as it
is in the matrix. It also claims `weight`, per member, clamped into `[0, 1]` and defaulting to `1`,
with a non-finite weight reading as `1` through `readNumber`'s fallback, identically to omitting the
key. Those are the 2D `fk` semantics of ADR-055 key for key. The authored orientation keys are local
and the published ones are world, which is what 2D `fk` does with `rotation` too: a key a plugin
claims and produces is an input on the way in and an output on the way out.

**"Is there a solve" has one owner.** `fk3d.ts`'s `readSolved` answers `undefined` for an unbound
slot, a source that publishes no `rotations3d`, a `rotations3d` that is not a record, a record that
does not name this node, and an entry that is not a record. The prototype read the last case as a
zero triple, a solve to identity; it is now "no solve", which is what 2D's `readSolvedRotation`
answers for a non-number entry (ADR-051). No correctly wired rig reaches it, because `ik3d`
publishes a triple for every member it solves. The weight is deliberately not folded into that
answer: an unbound slot and a weight of `0` stay two different things, and with no solve `weight`
is never read.

**The blend has one owner, and it is a rotation blend.** `frame3d.ts` already owned the matrix
convention and Euler decomposition, so it owns the blend too: `blendOrientation3d(rest, solved,
weight)`, the 3D counterpart of 2D's `lerpAngle`. Between the endpoints it converts both triples to
unit quaternions (`quaternionFromEuler3d`, the product of the three axis quaternions in the
matrix's own order), takes the shorter-arc spherical blend (`slerpQuaternion`), and decomposes the
result back through `matrixFromQuaternion` and the existing `eulerFromMatrix3d`, so every published
angle stays canonical in `(-180, 180]` and the gimbal-lock rule is the one ADR-114 already pinned.
Euler coordinates are not a space a rotation can be interpolated in: a linear blend of three angles
neither follows a great circle nor has a short arc, and two triples naming one orientation would
blend differently. The quaternion never leaves the module's arithmetic; members still author and
publish Euler triples, so ADR-114's withdrawal of quaternion publication stands.

**Short arc on rotations, not on coordinates.** `q` and `-q` are one rotation, so a negative dot
product negates the target before blending. That is what makes a triple and the same triple plus a
whole turn blend nowhere rather than all the way round. Below `1e-12` of `1 - |cos|` the spherical
weights would divide by a sine that has lost its digits, so the blend is the normalized linear one
there, which agrees to far below rounding. Exactly half a turn apart both arcs are equally short;
the sign of the rounded dot product, which the inputs determine, picks one, so the result is
deterministic without pretending either arc is privileged. 2D breaks that tie toward the positive
direction (`WT-4`); the two tie rules are each deterministic and are not claimed to agree.

**The load rule reads every orientation key.** `ik-solved-rotation-dead` refused a solver-bound
group that authors `rotation` and no `weight`, because at the default weight the solve replaces
the authored value outright. The same is true of each of `rotationX` and `rotationY` on an `fk3d`
bone, so the rule now reads the union of the groups authoring any of the three (`ORIENTATION_KEYS`
in `graph/ir.ts`). Reading `rotation` alone would refuse a 3D member authoring a dead Z angle and
load one authoring a dead X angle, one rule answering two ways for one question. No 2D member
plugin claims `rotationX` or `rotationY`, so no 2D rig and no 2D message moves.
`ik-weight-without-solver` already reads `weight` by group and covers `fk3d` unchanged. Nothing
that loaded before is refused now: before this change every one of these keys under `fk3d` was
`plugin-unknown-key`.

`x`, `y` and `z` stayed unclaimed in this slice. ADR-117 claims them together with the closed form
that accounts for their geometry, rather than ahead of it where they would compose a tip the solve
never aimed.

## What is withdrawn

- Euler-coordinate interpolation is withdrawn for the reasons above; `TH-25`, `TH-26` and `TH-30`
  each turn red under it.
- A solver-level weight is withdrawn for the reason ADR-055 gives in 2D: one weight per chain
  cannot stagger a reach.
- A second blend owner beside `lerpAngle` for the planar case is withdrawn. The quaternion blend of
  two pure-Z orientations already is `lerpAngle` modulo a turn (`TH-26`), and a planar shortcut
  would be a second arithmetic owner for one answer, the defect ADR-114 withdrew its exact planar
  bridge for.
- A published quaternion, an `orientation` record, or a quaternion authored key is withdrawn as in
  ADR-114: the DOM contract is scalar Euler keys.
- Removing `fk3d`'s own `clamp` because `blendOrientation3d` short-circuits outside `(0, 1)` is
  withdrawn. The two agree on every input, so a mutation dropping the clamp survives the suite as
  an equivalent mutant; the clamp stays because the reader, not the arithmetic, owns what an
  authored `weight` means, exactly as 2D `fk` clamps before `lerpAngle`.

## Consequences

A 3D bone has a rest pose and a per-member reach, so a phase-3 pole and a phase-5 iterative solve
have a rest direction to swing from. `frame3d.ts` grows from 6,502 to 12,278 bytes and stays below
the 30,000-byte sister-document line; `fk3d.ts` is 4,140 bytes. Nothing is exported from the
package, no 2D module changes, and the ADR-114 prototype's tests stand unchanged except `TH-11`,
which used `weight` as its example of 2D vocabulary refused in a 3D group and now uses
`minRotation`, the 2D limit key a 3D bone still does not claim.

## Evidence

- `TH-24`: over 2,000 seeded triples, the quaternion's matrix equals the CSS matrix entry for entry
  to `1e-12`, and a non-finite angle is the identity quaternion.
- `TH-25`: sign equivalence on both inputs over 1,000 pairs; over 1,000 more, the whole separation
  is at most half a turn and the blend splits it by weight to `1e-6` degrees; one whole turn apart
  blends nowhere; near-antipodal and exactly antipodal inputs stay finite and deterministic.
- `TH-26`: 5,000 seeded pure-Z pairs over two turns each way agree with `lerpAngle` modulo a turn
  to `1e-9` degrees with zero X and Y, excluding only the exact half-turn tie.
- `TH-27`: a weight at or past either endpoint returns the argument object itself; through the
  plugin, weight `1` is `Object.is`-identical to the prototype's composition and weight `0` to the
  unsolved rest pose.
- `TH-28`: six "no solve" shapes, each with five weights, compose the rest pose byte for byte.
- `TH-29`: 500 seeded rigs with neither key compose the prototype's bytes, solved and unsolved.
- `TH-30`: clamping, non-finite weight, and a staged partial reach.
- `TH-31`: each orientation key alone under a solve with no weight is `ik-solved-rotation-dead`,
  and any weight beside it loads.
- `TH-32` (`test/integration/ik3d-two-bone.test.ts`): through the engine, fake interpolator and a
  keyframed `weight` on both members, weight `0` publishes the rest pose byte for byte while the
  solve is bound and published, `0.25`, `0.5` and `0.75` publish the blend oracle byte for byte,
  weight `1` closes on the goal to `1e-9`, and seeking back in a different order reproduces every
  earlier pose.

A sandbox mutation pass, reviewed and not trusted, with no run in this repository's CI, killed 13 of
14 mutants: Euler interpolation, a dropped sign flip, each dropped endpoint short circuit, a
reversed quaternion product term, a sign error in `matrixFromQuaternion`, the normalized linear
blend used everywhere, weight read with no solve, a malformed entry read as identity, a non-finite
weight read as `0`, the rest orientation ignored, the load rule reading `rotation` alone, and
`weight` unclaimed each turn at least one case red. Dropping `fk3d`'s clamp survives as the
equivalent mutant recorded above. The harness and the mutant list travel in the phase handover as
opaque material.

### How this record was completed

The first commit on `feat/500-phase-1` (`afb55858`) carried only this record and `TH-24` to `TH-31`.
Its message and handover notes described source, load-rule, guide, schema, `ADR-114` and status
changes that were not in the commit, so `TH-24` to `TH-31` could not import what they tested. The
completion commit adds the implementation this record describes, `TH-32`, the `TH-11` change, the
`ADR-114` forward pointer, the guide, schema and status text, and corrects the figures above to
what was measured. Sandbox runs of that completion, reviewed rather than trusted: the full suite
under an offline Vitest stand-in (the same 1,403 cases that passed on `afb55858` still pass, plus
the nine new ones; every file that does not run needs `gsap`, `typescript`, `react-test-renderer`
or `npx`, none installable offline), Prettier 3.6.2 from `.tools/`, and the read-budget, boundary
and raw-template scans. `npm run typecheck` has no run: TypeScript is not installable offline.
