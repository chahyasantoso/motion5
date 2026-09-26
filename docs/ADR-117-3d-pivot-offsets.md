# ADR-117: 3D pivot offsets

**Status:** Proposed as issue [#500](https://github.com/chahyasantoso/motion5/issues/500) phase 2,
2026-09-25, first against `main` at `42c723226ed044b11e2441b06c8c7019ae4ed885` with phase 1
stacked beneath it, and completed against `main` at `c9ce26665e8756614fb8f021e253dd631fcd96d7`,
where phase 1 ([ADR-116](./ADR-116-fk3d-rest-orientation-and-solved-weight.md)) landed through
#502. Accepted when the implementation pull request, #503, merges.

**Amended by [ADR-121](./ADR-121-grouped-only-keyframes.md), 2026-09-26.** The **What is withdrawn**
bullet saying flat `x`, `y`, and `z` remain ambiguous no longer holds for authored input. Grouped
ownership removes that ambiguity; ungrouped `x`, `y`, and `z` are refused as
`keyframes-ungrouped-key`.

## Invariant

A 3D member's `x`, `y` and `z` values are its pivot offset in the parent's rotated frame. `fk3d`
composes that pivot before the member's local orientation, and the internal `ik3d` closed form
solves the same geometry exactly: the first offset moves the effective root pivot, while the second
offset joins the first extension into one rigid effective link. A solved offset chain whose goal
is inside the effective reach band therefore composes its tip on the goal to rounding; a goal
outside it is clamped to the band's nearer edge exactly as the zero-offset solve clamps, and the
residual names the miss. An omitted or explicit zero offset publishes the phase 1 bytes.

## Context

The 3D seam already had one composition convention in `frame3d.ts`: CSS `Rz * Rx * Ry` matrices,
Euler decomposition, and the rest/solve blend from ADR-116. The 2D runtime already accounts for
pivot offsets by moving the base pivot and reducing a member extension plus child offset to a rigid
link. Ignoring those keys in 3D would let a member compose a pivot the solve never aimed at, while
putting the offset arithmetic in both `fk3d` and `ik3d` would create two owners for the same
rotation and translation convention.

## Decision

`frame3d.ts` owns `PivotOffset3d`, `ZERO_PIVOT_OFFSET3D`, `readPivotOffset3d`,
`pivotFromBase3d`, and `effectiveLink3d`. The reader uses `readNumber`, so an absent or non-finite
component is zero. `pivotFromBase3d` returns the base position itself when all components compare
exactly equal to zero, including `-0`; otherwise it takes the position from `composeWorld3d(base,
{ ...offset, ...ZERO_EULER })`, exactly the call `fk3d` uses. `effectiveLink3d` returns the closed
union `{ kind: "axis", length }` for an all-zero child offset and `{ kind: "offset", length,
vector }` otherwise, where `vector` is `[length + x, y, z]` and `length` is its norm.

`fk3d` claims `length`, `rotation`, `rotationX`, `rotationY`, `weight`, `x`, `y` and `z`. It
composes `composeWorld3d(readFrame3d(base), { ...readPivotOffset3d(values), ...local })`, then
extends along local +x exactly as phase 1 did. Since the zero reader returns the same three scalar
values and object shape, the zero call has the phase 1 byte path.

`ik3d` reads the same offset record into each `SolveMember3d`. The root point is
`pivotFromBase3d(root, first.offset)`. The reach band and triangle use the effective link length
and the second segment length. For an offset link, the first member's world orientation is
`orientation(d1, normal) * transpose(K)`, where `K = orientation(normalize(vector), [0, 0, 1])` maps
member-local +x to the effective link. This is the 3D link frame; in the planar subset it is the
2D twist `atan2(y, length + x)`. The axis union arm returns the old orientation directly, while the
offset arm is read in one exhaustive switch ending in `unreachable`. The second world orientation
still aims the second segment from the solved effective elbow. Magnitude scaling includes all six
offset components and scales them with positions and lengths.

## What is withdrawn

- An iterative or approximate solve for offsets is withdrawn: a rigid effective link is closed form,
  exact, and keeps the analytic solver's finite magnitude policy.
- Publishing the effective link or its frame is withdrawn: the public and renderer-facing shape
  stays Euler triples and scalar world coordinates.
- A second composition owner is withdrawn: both solving and composition reach the offset and link
  arithmetic through `frame3d.ts`.
- A load rule for offsets is withdrawn. No authored shape was found that accepts an offset and
  then does nothing: `fk3d` now claims all three keys and composes them, while `ik3d` reads the
  same values when bound. Flat `x`, `y` and `z` remain ambiguous whenever both `transform3d` and
  `fk3d` claim them, so grouped authoring remains required; that is the existing ownership
  diagnostic, not a new rule.

## Consequences

The new union keeps the phase-1 zero path byte-identical while making all non-zero pivot geometry
explicit. `frame3d.ts` is 13,982 bytes, `ik3d-analytic.ts` 12,225 bytes and `fk3d.ts` 4,374 bytes;
all remain below the 30,000-byte source split line. The offset evidence file,
`test/unit/plugins/ik3d-offsets.test.ts`, is 12,863 bytes. No 2D source changes, and no package
export is added.

## Evidence

- `TH-33` proves parent-frame composition, non-finite reads, explicit and omitted zero bytes, and
  `-0` zero short-circuiting.
- `TH-34` proves the effective-link and pivot unions, including their zero paths.
- `TH-35` closes 2,000 seeded rigs with arbitrary root orientation and offsets on both members in
  all three axes, preserving both member extents and pivot-to-pivot distances.
- `TH-36` compares 1,000 planar offset rigs to `solveTwoBone` modulo whole turns.
- `TH-37` covers zero-length links, zero second arms, coincident residuals, reach-band misses and
  infinite-direction goals; `TH-38` covers scaled huge offsets.
- `TH-39` drives offsets through `Engine` and the DOM adapter, closes at the goal and reproduces
  bytes on a repeated seek.
- The sandbox byte-identity probe compares at least 200,000 seeded omitted or zero-offset rigs
  against the phase-1 tip `31ec57f8`; it reports zero mismatches when run.
- The mutation pass killed all 10 of 10 mutants: FK offset composition, root pivot use,
  effective-link length in both triangle sides, link-frame undo, offset scaling, offset magnitude
  accounting, coincident residual, z-only union selection, and non-finite offset reading.
- `CI` on `133631bae795679614370005d9252e1305bbc5a2`, run 36130570689, is green on every job,
  `typecheck` included. That is the first green compiler run of this change: the sandbox cannot
  install TypeScript, and the run before it, 36127576806, refused two test fixtures and no source.
- The independent quality pass on #503 is recorded as a pull request comment rather than here.
  Every other result above is a sandbox measurement, reviewed rather than trusted.
