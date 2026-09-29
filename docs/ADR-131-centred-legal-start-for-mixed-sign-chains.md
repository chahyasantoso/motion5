# ADR-131: A limited or capped FABRIK miss pays one centred legal start in both dimensions

**Status:** Accepted, 2026-09-29, for [#524](https://github.com/chahyasantoso/motion5/issues/524), on `main` at `1b04ac7`.

## Context

On the #514 corpus (N=2000, seed 7) mixed-sign serial chains converged 187/452 (2D) and 202/495 (planar 3D). Every miss was `limited`, and seeding from the authored legal pose met all of them, so they are seed-side basin traps: the arc bends every joint one way and a range demanding the other way holds it on its bound from either arc side.

## Decision and invariant

**Invariant:** a limited or capped baseline of a limited rig whose default seed is the arc pays, after the arc's opposite side, exactly one start that is legal by construction, every limited member at its range centre. The selector is the only owner of which extra attempts are paid.

`fabrik-select.ts` reads a closed `LegalStarts = none | centre | staged(reach)` exhaustively in `legalStages`: `none` for rigs without a limited member (their legal seed is a straight line), `centre` for 2D limited rigs and 3D constrained rigs without an addressed non-planar hinge, `staged` for ADR-130's non-planar paths. One uniform rule replaces ADR-130's "a later stage": every legal stage runs only while no candidate has converged, so a rig the baseline or its opposite side already meets keeps its bytes. `fabrik-seed.ts` adds `0.5` to `LegalSeedFraction` and owns the 2D legal seed `seedLegal`, the planar image of `ik3d-seed.ts`'s legal seed (limited members at `legalRotation`, free aimed members turned onto the mean aim). `legalRotation` moves to `ik-constraint.ts` as the one owner of "the angle at a fraction of a range" for both dimensions. The 2D legal seed takes no `flip`: the plane cannot express the 3D half turn, and a mirror is illegal.

## Alternatives withdrawn

A mixed-sign eligibility predicate (the previous branch): a second diagnosis to own, with the same corpus result. Range centre as the primary seed: it moves every rig that converges today. Higher caps and CCD, as in #514.

## Evidence and boundary

Sandbox (Node 22, vitest shim, not CI). Mixed: 2D 187 -> 400/452, planar 3D 202 -> 447/495. Whole corpus: 2D 1428 -> 1701, planar 3D 1427 -> 1734; mean iterations 25.75 -> 19.47 and 26.87 -> 19.98. No baseline-converged 2D or planar rig changes a byte; 11 of 771 converged random-axis rigs pick another converged pose because the uniform stop rule skips quartiles after a met opposite side, with identical counts. Independent FK and limit checks: zero bad publishes. TH-181 to TH-185 pin the policy, reproductions, seed legality and planar agreement; TH-155/CL-40 now read the arc-only portfolio. The 52 (2D) and 48 (planar) remaining misses are candidates for true local minima under these seeds, not proofs of unreachability.
