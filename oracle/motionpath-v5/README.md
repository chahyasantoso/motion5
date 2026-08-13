# Vendored motionpath v5 oracle

This directory is a read-only behavioral reference for motion5 implementation work.

- Repository: `chahyasantoso/motionpath`
- Branch: `v5-pr-15-observation-graph`
- Commit: `c629e9b70972f32ac13f2de9c3b5ab1f4a89314b`

Do not import these files into motion5 production code. Do not copy the oracle architecture wholesale. Use them to answer one question: what behavior must motion5 preserve inside its own boundaries?

The snapshots here are the files that define the current value pipeline, plugin contribution contract, graph ownership behavior, and DOM output behavior. If the upstream branch changes, update this snapshot intentionally and record the new commit here.

## Snapshot map

- `packages/core/src/usecases/BuildTrackTween.js`: shared percent-keyframe compilation, ease collision, tween vars, paused GSAP timeline.
- `packages/core/src/domain/plugins.js`: plugin resolution, ownership, metadata, and stages.
- `packages/core/src/domain/plugins/simpleProperty.js`: canonical per-property contribution.
- `packages/core/src/lib/Track.js`: proxy state, input projection, local composition, output merge, lifecycle.
- `packages/core/src/usecases/GraphPublisher.js`: graph scheduling, dirty closure, cache, failure containment.
- `packages/core/src/usecases/GraphBinding.js`: transactional graph mutation and rollback.
- `packages/core/src/adapters/domRenderer.js`: serializer/internal-key handling and DOM diff application.
