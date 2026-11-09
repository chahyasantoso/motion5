# ADR-116: fk3d rest orientation and solved weight

**Status:** Accepted, 2026-09-27, as part of the public 3D contract
([ADR-125](./ADR-125-public-3d-api.md)); landed through #502 (`main` at `c9ce2666`).
Proposed as issue [#500](https://github.com/chahyasantoso/motion5/issues/500) phase 1,
2026-09-25, against `main` at `42c723226ed044b11e2441b06c8c7019ae4ed885` (#499). Supersedes one
withdrawn bullet of [ADR-114](./ADR-114-3d-seam-prototype.md), "`fk3d` claiming authored
rotation keys".

## Invariant

`fk3d` bone composes authored local rest orientation unsolved; short-arc rotation blend from rest to solved orientation by own `weight` when solved. Weight `0` = rest, `1` = solved triple, both returned themselves, not computed. Rig authoring neither key composes exact ADR-114 prototype bytes.

## Context

ADR-114 prototype: 3D bone no rest pose, no blend — unsolved `fk3d` member composed identity, solved one took solver triple outright, `fk3d` claimed only `length`. 2D had both since ADR-051, ADR-055; real rig needs both: arm stands in pose before solve reaches; chain staggers reach via different shoulder/wrist weights. Issue #500 phase 1 = that parity only.

## Decision

`fk3d` claims `rotation`, `rotationX`, `rotationY` — local rest orientation relative to parent, CSS `Rz * Rx * Ry` convention [ADR-114](./ADR-114-3d-seam-prototype.md) fixes — default zero, read via `readEuler3d` → non-finite angle zero as in matrix. Claims `weight`, per member, clamped `[0, 1]`, default `1`, non-finite reads `1` via `readNumber` fallback, same as omitting key. = 2D `fk` semantics ADR-055 key for key. Authored orientation local, published world — as 2D `fk` `rotation`: claimed+produced key input in, output out.

**"Is there a solve" has one owner.** `fk3d.ts` `readSolved` → `undefined` for unbound slot, source publishing no `rotations3d`, non-record `rotations3d`, record not naming node, non-record entry. Prototype read last as zero triple, solve to identity; now "no solve", = 2D `readSolvedRotation` for non-number entry (ADR-051). No correctly wired rig reaches it: `ik3d` publishes triple per solved member. Weight not folded in: unbound slot + weight `0` two things; no solve → `weight` never read.

**The blend has one owner, and it is a rotation blend.** `frame3d.ts` already owned matrix convention + Euler decomposition → owns blend: `blendOrientation3d(rest, solved, weight)`, 3D `lerpAngle`. Between endpoints: both triples → unit quaternions (`quaternionFromEuler3d`, three axis quaternions in matrix order), shorter-arc spherical blend (`slerpQuaternion`), decompose via `matrixFromQuaternion` + `eulerFromMatrix3d` → every published angle canonical `(-180, 180]`, gimbal-lock rule ADR-114 pinned. Euler coordinates not interpolable space: linear blend of three angles follows no great circle, has no short arc; two triples naming one orientation blend differently. Quaternion never leaves module arithmetic; members author/publish Euler triples → ADR-114 quaternion-publication withdrawal stands.

**Short arc on rotations, not coordinates.** `q` + `-q` = one rotation → negative dot negates target before blend. Makes triple + same triple plus whole turn blend nowhere, not all way round. Below `1e-12` of `1 - |cos|`, spherical weights divide by sine that lost digits → normalized linear blend there, agrees far below rounding. Exactly half turn: both arcs equally short; rounded dot sign (inputs determine) picks one → deterministic, neither arc privileged. 2D breaks tie positive (`WT-4`); rules each deterministic, not claimed to agree.

**The load rule reads every orientation key.** `ik-solved-rotation-dead` refused solver-bound group authoring `rotation`, no `weight` — default weight solve replaces authored value outright. Same for `rotationX`, `rotationY` on `fk3d` → rule reads union of groups authoring any of three (`ORIENTATION_KEYS` in `graph/ir.ts`). `rotation` alone would refuse 3D dead Z angle, load dead X angle — one rule, two answers. No 2D plugin claims `rotationX`/`rotationY` → no 2D rig/message moves. `ik-weight-without-solver` already reads `weight` by group, covers `fk3d` unchanged. Nothing loaded before now refused: before, every such key under `fk3d` = `plugin-unknown-key`.

`x`, `y`, `z` unclaimed. Pivot offset changes geometry closed form must predict → arrives with accounting solve (issue #500 phase 2), not ahead, where it composes tip solve never aimed. **Refined by [ADR-117](./ADR-117-3d-pivot-offsets.md), 2026-09-25.** Phase 2 claims all three with closed form accounting for them → decision held, not moved: offset arrived with solve. Only tree changed: `fk3d` claims `x`, `y`, `z`, composes before local orientation; `ik3d` reads same values.

## What is withdrawn

- Euler-coordinate interpolation withdrawn (reasons above); `TH-25`, `TH-26`, `TH-30` turn red.
- Solver-level weight withdrawn (ADR-055 2D reason): one weight per chain cannot stagger reach.
- Second blend owner beside `lerpAngle` for planar case withdrawn. Quaternion blend of two pure-Z orientations = `lerpAngle` modulo turn (`TH-26`); planar shortcut = second arithmetic owner, defect ADR-114 withdrew exact planar bridge for.
- Published quaternion, `orientation` record, quaternion authored key withdrawn as ADR-114: DOM contract scalar Euler keys.
- Removing `fk3d` `clamp` because `blendOrientation3d` short-circuits outside `(0, 1)` withdrawn. Agree on every input → clamp-dropping mutation survives as equivalent mutant; clamp stays: reader, not arithmetic, owns authored `weight` meaning, as 2D `fk` clamps before `lerpAngle`.

## Consequences

3D bone: rest pose + per-member reach → phase-3 pole, phase-5 iterative solve have rest direction. `frame3d.ts` 6,502 → 12,278 bytes, below 30,000-byte sister-document line; `fk3d.ts` 4,140 bytes. No package export, no 2D module change; ADR-114 prototype tests unchanged except `TH-11` (used `weight` as 2D vocabulary refused in 3D group; now `minRotation`, 2D limit key 3D bone still does not claim).

## Evidence

- `TH-24`: over 2,000 seeded triples, quaternion matrix = CSS matrix entry for entry to `1e-12`; non-finite angle = identity quaternion.
- `TH-25`: sign equivalence both inputs over 1,000 pairs; 1,000 more: whole separation at most half turn, blend splits by weight to `1e-6` degrees; whole turn apart blends nowhere; near-/exact antipodal finite + deterministic.
- `TH-26`: 5,000 seeded pure-Z pairs over two turns each way agree with `lerpAngle` modulo turn to `1e-9` degrees, zero X/Y, excluding exact half-turn tie.
- `TH-27`: weight at/past either endpoint returns argument object; through plugin, weight `1` `Object.is`-identical to prototype composition, `0` to unsolved rest.
- `TH-28`: six "no solve" shapes × five weights compose rest pose byte for byte.
- `TH-29`: 500 seeded rigs, neither key, compose prototype bytes, solved + unsolved.
- `TH-30`: clamping, non-finite weight, staged partial reach.
- `TH-31`: each orientation key alone under solve without weight = `ik-solved-rotation-dead`; any weight beside loads.
- `TH-32` (`test/integration/ik3d-two-bone.test.ts`): engine, fake interpolator, keyframed `weight` both members: weight `0` publishes rest byte for byte while solve bound/published; `0.25`, `0.5`, `0.75` publish blend oracle byte for byte; `1` closes goal to `1e-9`; seeking back different order reproduces every earlier pose.

Sandbox mutation pass, reviewed not trusted, no repo CI run, killed 13 of 14: Euler interpolation, dropped sign flip, each dropped endpoint short circuit, reversed quaternion product term, sign error in `matrixFromQuaternion`, normalized linear blend everywhere, weight read with no solve, malformed entry as identity, non-finite weight as `0`, rest orientation ignored, load rule reading `rotation` alone, `weight` unclaimed — each turns at least one case red. Dropping `fk3d` clamp survives as equivalent mutant above. Harness + mutant list travel in phase handover as opaque material.

### How this record was completed

First commit `feat/500-phase-1` (`afb55858`) carried only record + `TH-24` to `TH-31`. Message/handover notes described source, load-rule, guide, schema, `ADR-114`, status changes not in commit → those tests could not import what they tested. Completion commit adds implementation, `TH-32`, `TH-11` change, `ADR-114` forward pointer, guide, schema, status text; corrects figures to measured. Sandbox runs, reviewed not trusted: full suite offline Vitest stand-in (same 1,403 `afb55858` cases pass + nine new; every non-running file needs `gsap`, `typescript`, `react-test-renderer` or `npx`, none offline-installable), Prettier 3.6.2 from `.tools/`, read-budget/boundary/raw-template scans. `npm run typecheck` no sandbox run: TypeScript not offline-installable. First run `CI` on `31ec57f8` in [#502](https://github.com/chahyasantoso/motion5/pull/502), refused two fixture types, nothing in source: `TH-28` passed inputs typed `Readonly<Record<string, unknown>>`; `TH-30` put `weight: unknown` in values record. Quality-pass follow-up types both as composer reads, `PluginInputs` + `number`, no assertion change.
