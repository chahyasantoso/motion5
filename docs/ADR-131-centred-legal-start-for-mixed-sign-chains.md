# ADR-131: A constrained FABRIK miss starts legally, then near misses explore bounded offsets

**Status:** Accepted, 2026-09-29, for [#524](https://github.com/chahyasantoso/motion5/issues/524), on `main` at `1b04ac7`.

## Context

On the #514 corpus (N=2000, seed 7) mixed-sign serial chains converged 187/452 (2D) and 202/495 (planar 3D). Every miss was `limited`, and seeding from the authored legal pose met all of them, so they are seed-side basin traps: the arc bends every joint one way and a range demanding the other way holds it on its bound from either arc side.

## Decision and invariant

**Invariant:** a limited or capped baseline of a constrained arc-seeded rig pays the opposite arc side, then a legal centre while unresolved. When the best arc residual is within 2% of the addressed reach, unresolved 2D and planar 3D rigs also pay q25, q75, q10 and q90, in that order. Both quartiles form one stage; later stages run only while unresolved. A distant miss pays only the centre. The ceiling is seven attempts (baseline, opposite, centre, four offsets); a baseline or opposite-side convergence pays none. The selector is the only owner of which extra attempts are paid. **Superseded in part by [ADR-132](./ADR-132-legal-descent-start-for-constrained-fabrik-misses.md), 2026-09-29.** The four off-centre starts are withdrawn for arc-seeded rigs; legal descent now follows the centre, so that path has a four-attempt ceiling.

`fabrik-select.ts` reads a closed `LegalStarts = none | centre | centre-then-staged(reach) | staged(reach)` exhaustively in `legalStages`. `none` is for free rigs; `centre` covers a constrained rig with zero addressed reach; `centre-then-staged` is the bounded arc-seeded policy; `staged` keeps ADR-130's non-planar 3D baseline-gated quartile policy (six attempts at most). The near-miss test is inclusive. **Superseded in part by [ADR-132](./ADR-132-legal-descent-start-for-constrained-fabrik-misses.md), 2026-09-29.** For arc-seeded rigs, `centre-then-staged` is replaced by `centre-then-descent`; the non-planar `staged(reach)` policy remains. One uniform rule replaces ADR-130's "a later stage": every legal stage runs only while no candidate has converged, so a rig the baseline or its opposite side already meets keeps its bytes. `fabrik-seed.ts` adds `0.5` to `LegalSeedFraction` and owns the 2D legal seed `seedLegal`, the planar image of `ik3d-seed.ts`'s legal seed (limited members at `legalRotation`, free aimed members turned onto the mean aim). Free 2D turns use the shortest wrapped angle, including across the branch cut. `legalRotation` lives in `ik-constraint.ts` as the one owner of "the angle at a fraction of a range" for both dimensions. The 2D legal seed takes no `flip`: the plane cannot express the 3D half turn, and a mirror is illegal.

## Alternatives withdrawn

A mixed-sign eligibility predicate (the previous branch): a second diagnosis to own, with the same corpus result. Range centre as the primary seed: it moves every rig that converges today. Higher caps and CCD, as in #514.

## Evidence and boundary

The original centre-only sandbox measurement (Node 22 shim, not CI) was mixed 2D 187 -> 400/452, planar 3D 202 -> 447/495; whole corpus 1428 -> 1701 and 1427 -> 1734. With bounded offsets the follow-up measured mixed 422/452 and 460/495, whole 1731 and 1754. Random-axis counts remained 771 converged and 1229 reached. Baseline-converged 2D and planar rigs stayed byte-identical; independent FK and limit checks found zero bad converged publications. Mean _selected-result_ iterations fell from 19.47 to 19.01 (2D) and 19.98 to 19.74 (planar 3D) between centre-only and offset policies; they do not represent summed attempt work or latency. The 30 (2D) and 35 (planar) remaining mixed misses are unclassified, not proofs of local minima or unreachability. TH-181 through TH-187 cover the policy and recoveries; the real CI on PR #529's offset commit passed seven Node 24.21.0 jobs.

## Follow-up boundary

The extra four attempts deliberately trade work for recovered near misses. A separate counting wrapper around the actual 2D/3D FABRIK attempt seam, on the same 2,000-rig-per-dimension corpus, counted constrained-rig attempts and their summed iterations. Centre-only versus offset policy: 2D 3,095/101,293 -> 3,300/112,708 (+205 attempts, +11,415 iterations); planar 3D 3,110/102,494 -> 3,306/114,133 (+196 attempts, +11,639 iterations); random-axis 3D unchanged at 4,082/225,974. The seven-attempt path was taken by 36 2D and 39 planar rigs. This separate run excludes 3D serial-recovery cost, does not measure end-to-end latency, and is Node 22 shim evidence rather than Node 24 CI. Keep total work separate from selected-result iterations. The default-seed assumption for an addressed non-planar hinge and zero-length constrained seed orientations warrant dedicated coverage before claiming a general guarantee beyond the measured corpus.
