# G6 — Add pose-member bindings to the Three adapter through the shared binding module

Status: not implemented. Depends on: E4, E5, E6, G3, G5.

## Start here

Read `00-overview.md`, E4–E6's renderer-neutral binding module and the DOM adapter that uses it, `packages/three/src/index.ts` (`createObject3dPatchAdapter`, `writeFrame3d`), the Three adapter tests in `packages/three/test`, and ADR-105.

## Outcome and work

The Three adapter today writes one scalar frame per resolved node and keeps its own revision map, with a comment saying the logic stays local to avoid widening the DOM adapter. E4 created the shared module, so that reason no longer holds. Rebuild the adapter on it:

- Bindings are the same union as in the DOM adapter, `{ kind: "scalar"; track } | { kind: "member"; track; member }`, each with an `Object3D` target, read by exhaustive switches. A member binding selects `poses[member]` explicitly through `readPoses3d`; nothing else in a published record is renderable.
- Binding identity, member selection, competing-owner refusal (two bindings writing one `Object3D`, including scalar versus member), per-binding revision baselines, initialization of a newly bound target from the current committed pose, generation tokens and retirement all come from the shared module. Delete the adapter's local `appliedRevisions` map.
- The adapter keeps only what is Three-specific: resolving targets and writing through the one writer, `writeFrame3d`. `applyValues` for caller-derived values stays a scalar write without a fabricated revision.
- Removing a member or track, rebinding a target and disposing the adapter follow E6's lifecycle: no writes after disposal, no stale baselines inherited by a reused member ID, and scene-graph ownership stays with the caller.

## Evidence and finish

Run adapter tests with synthetic `fk3d` and `rig` poses and one real pipeline: a scalar binding renders as before; a member binding writes the correct tip; an absent member is handled under the shared policy; competing owners are refused; out-of-order revisions across tracks are independent; rebinding to an unchanged pose initializes the new target; reuse of a removed member ID starts clean; repeated dispose is safe. Assert no Three adapter code duplicates binding identity, ownership or revision logic.

Done when the DOM and Three adapters share every renderer-neutral binding rule and differ only in target resolution and writing. Record API changes, commands/results and browser/GLB checks still pending. Next: G7.
