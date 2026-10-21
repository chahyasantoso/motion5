# G7 — Generate new-contract 3D skeletons from captured bones and drive Three skeletons from poses

Status: not implemented. Depends on: G1, G2, G3, G5.

## Start here

Read `00-overview.md`, ADR-141, `packages/three/src/skeleton-tracks.ts`, `skeleton-capture.ts` (`captureSkeleton`, `CapturedBone`, `assertCapturedHierarchy`), `skeleton-driver.ts` (`FrameSource`, `rigFrameSource`, `BoneDrive`), `skeleton.ts`, and `packages/three/test/skeleton-*.test.ts`.

## Outcome and work

`skeletonTracks` today emits an old object-form `transform3d` root track, one zero-length per-bone `fk3d` track whose `base` names its parent, and a `rig` track keyed by bone key. Rewrite it to emit the new contract directly; no bridge or converter.

Decompose the captured bone tree into maximal unbranched chains. A chain starts at a captured root bone or at a child of a bone with more than one child, and extends while the current bone has exactly one child; it ends at a bone with zero or several children. A branching bone is therefore always the final point of its chain, which is exactly where C3/G2 attach child chains. For every captured root bone, emit:

- one `point3d` chain track per chain, with one entry per bone. Entry IDs are generated, `bone-<index>`, so they are unique and safe whatever the authored bone names are. Values are `length: 0`, the rest position as the pivot offset `x`/`y`/`z`, and the rest orientation. A zero-length point publishes its joint frame, which reproduces today's zero-length per-bone FK semantics. Chain tracks carry no root entry (imports must be rootless);
- one joined track: a `root3d` entry bound to the generated root frame track, then one `join3d` entry per chain in parent-first order. The root bone's chain is the first join and has no parent; every other join names the chain whose final point is its first bone's parent. Emit a joined track even when the skeleton is one chain, so every generated skeleton has one shape;
- one `fk3d` pose track bound to the joined track, with no solver.

All skeletons share one generated `transform3d` root frame track at the origin of the capture's root parent. Several captured root bones (which `captureSkeleton` allows when they share a parent) produce one skeleton each; there is no virtual root point. Unmapped bones still get points, so the hierarchy is complete.

Return a typed result instead of a bare track list: the tracks, the list of pose track IDs (one per captured root bone), and a read-only map from bone key to point ID for keyed bones. Keep the existing `idPrefix` validation, hierarchy and scale assertions.

Driver: replace `rigFrameSource` with `poseFrameSource`, which takes one or more published records, decodes each once through G5's `readPoses3d`, and returns a `FrameSource` over own keys only. Several records with an overlapping point ID are a programmer error (`TypeError`); generated skeletons never overlap. Callers set drive sources to the point IDs from the result's key map, or to rig keys when they drive from a `rig`. `BoneDrive` and the driver's outcome union are unchanged.

## Evidence and finish

Run generator tests on a single chain, a branched humanoid, two captured root bones, unmapped intermediate bones and a bone keyed `__proto__`: every generated document loads through the public parser and derives without diagnostics; chain splits fall exactly at branching and leaf bones; joins are parent-first with one parentless join per skeleton. Evaluate the pose tracks and drive the captured skeleton with `frame` drives: bone world matrices equal the captured rest pose within the existing tolerance. Animate one point rotation and assert only its subtree moves. Test `poseFrameSource` over `rig` and `fk3d` records, multiple records, and overlap refusal.

Remove the old per-bone generator assertions with that reason. Done when captured skeletons become new-contract 3D skeletons and the driver reads poses through the shared decoder. Record the result type, commands/results and browser/GLB checks still pending. Next: G8.
