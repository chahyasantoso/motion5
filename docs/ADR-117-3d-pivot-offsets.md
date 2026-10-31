# ADR-117: 3D pivot offsets

**Status:** Accepted, 2026-09-27, as part of the public 3D contract
([ADR-125](./ADR-125-public-3d-api.md)); landed through #503 (`main` at `7bd3c3d0`).
Proposed as issue [#500](https://github.com/chahyasantoso/motion5/issues/500) phase 2,
2026-09-25, first against `main` at `42c723226ed044b11e2441b06c8c7019ae4ed885` with phase 1
stacked beneath it, and completed against `main` at `c9ce26665e8756614fb8f021e253dd631fcd96d7`,
where phase 1 ([ADR-116](./ADR-116-fk3d-rest-orientation-and-solved-weight.md)) landed through
#502.

**Amended by [ADR-121](./ADR-121-grouped-only-keyframes.md), 2026-09-26.** The **What is withdrawn**
bullet saying flat `x`, `y`, and `z` remain ambiguous no longer holds for authored input. Grouped
ownership removes that ambiguity; ungrouped `x`, `y`, `z` refused as `keyframes-ungrouped-key`.

## Invariant

3D member's `x`, `y` and `z` values are its pivot offset in parent's rotated frame. `fk3d`
composes that pivot before member's local orientation; internal `ik3d` closed form
solves same geometry exactly: first offset moves effective root pivot, second
joins first extension into one rigid effective link. Solved offset chain whose goal is inside
effective reach band thus composes its tip on goal to rounding; goal outside
clamped to band's nearer edge exactly as zero-offset solve clamps; residual names
miss. Omitted or explicit zero offset publishes phase 1 bytes.

## Context

3D seam already had one composition convention in `frame3d.ts`: CSS `Rz * Rx * Ry` matrices,
Euler decomposition, rest/solve blend from ADR-116. 2D runtime already accounts for pivot
offsets by moving base pivot and reducing member extension plus child offset to rigid link.
Ignoring those keys in 3D lets member compose pivot solve never aimed at; putting
offset arithmetic in both `fk3d` and `ik3d` creates two owners for same rotation and
translation convention.

## Decision

`frame3d.ts` owns `PivotOffset3d`, `ZERO_PIVOT_OFFSET3D`, `readPivotOffset3d`,
`pivotFromBase3d`, `effectiveLink3d`. Reader uses `readNumber` → absent or non-finite
component is zero. `pivotFromBase3d` returns base position itself when all components compare
exactly equal to zero, `-0` included; otherwise takes position from `composeWorld3d(base,
{ ...offset, ...ZERO_EULER })`, exactly call `fk3d` uses. `effectiveLink3d` returns closed
union `{ kind: "axis", length }` for all-zero child offset, `{ kind: "offset", length,
vector }` otherwise, where `vector` is `[length + x, y, z]` and `length` its norm.

`fk3d` claims `length`, `rotation`, `rotationX`, `rotationY`, `weight`, `x`, `y`, `z`. Composes
`composeWorld3d(readFrame3d(base), { ...readPivotOffset3d(values), ...local })`, then
extends along local +x exactly as phase 1. Zero reader returns same three scalar values
and object shape → zero call has phase 1 byte path.

`ik3d` reads same offset record into each `SolveMember3d`. Root point
`pivotFromBase3d(root, first.offset)`. Reach band and triangle use effective link length
and second segment length. For offset link, first member's world orientation is
`orientation(d1, normal) * transpose(K)`, where `K = orientation(normalize(vector), [0, 0, 1])` maps
member-local +x to effective link. This is 3D link frame; in planar subset it is
2D twist `atan2(y, length + x)`. Axis union arm returns old orientation directly; offset arm
read in one exhaustive switch ending in `unreachable`. Second world orientation
still aims second segment from solved effective elbow. Magnitude scaling includes all six
offset components, scales them with positions and lengths.

## What is withdrawn

- Iterative or approximate solve for offsets withdrawn: rigid effective link is closed form,
  exact, keeps analytic solver's finite magnitude policy.
- Publishing effective link or its frame withdrawn: public and renderer-facing shape
  stays Euler triples and scalar world coordinates.
- Second composition owner withdrawn: both solving and composition reach offset and link
  arithmetic through `frame3d.ts`.
- Load rule for offsets withdrawn. No authored shape found that accepts offset and
  then does nothing: `fk3d` now claims all three keys and composes them, while `ik3d` reads
  same values when bound. Flat `x`, `y` and `z` remain ambiguous whenever both `transform3d` and
  `fk3d` claim them, so grouped authoring remains required; that is existing ownership
  diagnostic, not new rule.

## Consequences

New union keeps phase-1 zero path byte-identical while making all non-zero pivot geometry
explicit. `frame3d.ts` 13,982 bytes, `ik3d-analytic.ts` 12,225, `fk3d.ts` 4,374; all
below 30,000-byte source split line. Offset evidence file,
`test/unit/plugins/ik3d-offsets.test.ts`, 12,863 bytes. No 2D source changes, no package
export added.

## Evidence

- `TH-33` proves parent-frame composition, non-finite reads, explicit and omitted zero bytes,
  `-0` zero short-circuiting.
- `TH-34` proves effective-link and pivot unions, including zero paths.
- `TH-35` closes 2,000 seeded rigs with arbitrary root orientation and offsets on both members in
  all three axes, preserving both member extents and pivot-to-pivot distances.
- `TH-36` compares 1,000 planar offset rigs to `solveTwoBone` modulo whole turns.
- `TH-37` covers zero-length links, zero second arms, coincident residuals, reach-band misses and
  infinite-direction goals; `TH-38` covers scaled huge offsets.
- `TH-39` drives offsets through `Engine` and DOM adapter, closes at goal, reproduces
  bytes on repeated seek.
- Sandbox byte-identity probe compares at least 200,000 seeded omitted or zero-offset rigs
  against phase-1 tip `31ec57f8`; reports zero mismatches when run.
- Mutation pass killed all 10 of 10 mutants: FK offset composition, root pivot use,
  effective-link length in both triangle sides, link-frame undo, offset scaling, offset magnitude
  accounting, coincident residual, z-only union selection, non-finite offset reading.
- `CI` on `133631bae795679614370005d9252e1305bbc5a2`, run 36130570689, green on every job,
  `typecheck` included. First green compiler run of this change: sandbox cannot
  install TypeScript, and run before it, 36127576806, refused two test fixtures and no source.
- Independent quality pass on #503 recorded as a pull request comment rather than here.
  Every other result above is a sandbox measurement, reviewed rather than trusted.
