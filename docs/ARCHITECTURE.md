# motion5 architecture

**Status:** Current implementation, verified against `feat/w5-unified-mutation-surface` after W1-W5. The canonical execution record is [SESSION-STATUS.md](./SESSION-STATUS.md). The public consumer reference is [PUBLIC-API.md](./PUBLIC-API.md).

## 1. The simple version

motion5 is a graph engine for animated values.

A project contains **Motions** and **Tracks**:

- A **Track** is one animated leaf, such as `x`, `rotation`, or a plugin-defined value.
- A **Motion** is a group that drives several Tracks together, including staggered timing.
- A Track may **observe** another Track. That creates a directed dataflow edge.
- The graph evaluates sources before the Tracks that depend on them, then publishes immutable patches.

The important rule: **there is one graph, one live graph state, one publisher, and one public project handle.** There are no separate graph implementations for authored content and runtime content.

## 2. Current status

W1 through W5 are implemented and W5 is ready for review in [PR #113](https://github.com/chahyasantoso/motion5/pull/113). The final W5 CI run [31989827456](https://github.com/chahyasantoso/motion5/actions/runs/31989827456) passed quality, integration, boundaries, build, end-to-end, performance, and formatting.

The runtime mutation model now supports:

- adding and removing Motions at runtime;
- adding and removing authored or runtime Tracks through one store;
- editing a Track without emitting a terminal destruction patch;
- adding and removing observation edges through Track replacement;
- safely rejecting invalid graph changes without partial state;
- reading dependants before attempting a destructive change.

Scroll/time trigger drivers are **not** implemented in core yet. Core currently preserves `trigger.type` in the schema but constructs Motions with the manual trigger path.

## 3. Layers

```text
External adapters: GSAP, DOM, React, browser clock
                         |
                        Ports
          Clock / Interpolator / Scheduler / TriggerPort
                         |
                       Engine
                         |
                   ProjectRuntime
                         |
                    GraphRuntime
                 /       |        \
          GraphBinding Publisher PatchRegistry
                 |
           ObservationState

Motion: composite scheduling and playback
Track:  leaf interpolation and playhead state
```

Dependencies point inward:

- **Contract** defines schema, types, diagnostics, and validation.
- **Domain** defines Track, Motion, plugins, and immutable value behavior.
- **Graph** defines qualified ids, graph IR, ordering, edges, and live observation state.
- **Runtime** coordinates project lifecycle, graph replacement, publication, and patches.
- **Ports** describe external capabilities without importing their implementations.
- **Adapters** connect real engines or environments to the ports.

Core layers do not import GSAP, React, or the DOM. The composition root, `Engine`, wires those capabilities in.

## 4. Ownership: who is allowed to do what

There is one owner per responsibility.

### Engine

`Engine` is the composition root. It validates the project, creates compiler and Motion hooks, constructs `ProjectRuntime`, and returns the public `ProjectHandle`. It does not implement graph algorithms.

### ProjectRuntime

`ProjectRuntime` owns one project lifetime and one mutable model of its current content:

- the unified Track store;
- the Motion definition store;
- mounted instance membership;
- diagnostics history;
- the one `GraphRuntime`;
- mutation capability tokens.

It is the only path for mounting, unmounting, and project mutations.

### GraphRuntime

`GraphRuntime` owns one `GraphBinding`, one `ObservationState`, one `GraphPublisher`, one `PatchRegistry`, and one clock subscription. It exposes the committed GraphIR read-only for queries such as `dependantsOf`, but it does not own topology mutation policy.

### GraphBinding

`GraphBinding` is the only topology coordinator. Every candidate graph is built and validated before live observation state changes. Apply-phase failures roll the live state back.

### GraphPublisher

`GraphPublisher` traverses a committed graph and publishes patches. It cannot add, remove, or replace graph entities.

### PatchRegistry

`PatchRegistry` owns patch identity, revisions, deep freezing, batching, terminal destruction patches, and subscriber notification.

### Motion

`Motion` is the only composite. It owns Track membership, stagger, scheduling, playhead progression, trigger wiring, playback, and Motion-local teardown.

### Track

`Track` is a leaf. It owns interpolation, playhead state, plugin composition, local lifecycle, and renderer-neutral values. It has no children and does not traverse graph dependencies.

## 5. Identity and storage

Authored ids are local. Published and runtime ids are qualified exactly once:

- `motionId/trackId` for a Track inside a Motion;
- `~/trackId` for a free Track.

The unified W5 store contains both schema-declared Tracks and runtime-created Tracks. Schema Tracks retain the frozen object identity produced by `validateV5`; runtime Tracks enter through `validateTrackDefinition` and are stored as frozen clones.

This is an intentional editor tradeoff: loaded schema Tracks are now removable through the same capability surface as runtime Tracks. They are not automatically mounted. Existing load behavior remains explicit: callers must call `mount()`.

A private schema-owner sentinel distinguishes ingested schema content from caller-owned runtime content. Public callers do not receive a schema removal capability by accident; they use the runtime Track lookup/capability surface.

## 6. Mutation transaction

Every topology mutation follows the same shape:

```text
public command
  -> validate input
  -> build an in-memory candidate store
  -> build and validate candidate GraphIR
  -> commit graph
  -> commit runtime maps and compiled lifecycle
  -> publish/invalidate as needed
```

If candidate validation fails, the operation throws before the live maps, mounted membership, compiled Track lifecycle, or patch wire are changed.

This is why deleting a source with a live dependant is safe: the candidate graph contains an unknown source and `GraphBinding` rejects it. The dependant remains live, and no false `destroyed` patch is sent.

Track replacement follows the same candidate-first rule but keeps the node id. Because the id remains present, the graph does not evict the node and subscribers do not receive a terminal destruction patch.

## 7. Capability handles and ABA safety

`addTrack()` and `track()` return a `TrackHandle`. The handle contains:

- the qualified `id`;
- the frozen Track definition;
- `remove()`;
- `replace(next)`;
- `addObserve(observation)`;
- `removeObserve(observation)`.

Each live Track instance has a private monotonic token. If a Track is removed and the same id is later reused, the old handle's methods become no-ops. An old handle can never delete or edit the new Track.

This replaces the weaker caller-invented owner-plus-string-id pattern for the new API. `adopt()` and `destroyAdopted()` remain as compatibility wrappers for existing consumers.

## 8. Flush and publication

One clock tick or explicit invalidation produces one patch batch.

1. A Motion or direct `seek()` changes Track progress.
2. The runtime invalidates affected node ids.
3. The publisher walks canonical topological order.
4. Each dirty node composes at most once per batch.
5. Input and output observation edges contribute values in graph order.
6. A composition failure publishes an error and blocks downstream dependants without aborting unrelated branches.
7. Unchanged patches are deduplicated.
8. Subscribers receive immutable node patches and batch summaries.

Published patches and batches are deeply frozen. Revisions are monotonic per node. Destruction publishes one terminal `status: "destroyed"` patch; unmounting is reversible and does not publish destruction.

Reentrant invalidation requests are queued for a deferred scheduler drain, not recursively flushed.

## 9. Lifecycle

`mount()` attaches a node to the runtime's active membership set. `unmount()` detaches it while leaving its graph definition alive for remounting.

Removing a Track is permanent for that Track instance:

- graph membership is removed;
- the patch registry emits a terminal destruction patch when appropriate;
- compiled Track resources are disposed;
- Motion membership is removed;
- the capability token becomes stale.

`dispose()` is idempotent and tears down the clock subscription, Motion instances, Tracks, graph, patch registry, and diagnostics ownership.

## 10. Validation and diagnostics

There is one validation owner: `packages/core/src/contract/validate-v5.ts`.

- `validateV5()` validates and freezes a whole project.
- `validateTrackDefinition()` validates and freezes one runtime Track definition.
- graph validation checks duplicate nodes, invalid references, invalid projections, self-references, and cycles.

Errors reject a load or mutation. Warnings do not block a load. Runtime diagnostics remain inline on patches/batches and are also retained in the bounded project diagnostics buffer.

## 11. Public boundary

The public package entry is `packages/core/src/index.ts`. It exports the stable consumer types and `Engine`, but not `ProjectRuntime`, `GraphRuntime`, `GraphBinding`, `GraphPublisher`, `PatchRegistry`, `ObservationState`, or normalization helpers.

The public declaration closure is tested so runtime and graph implementation declarations do not leak through `ProjectHandle` types. `TrackHandle` is defined at the Engine boundary for this reason.

## 12. Deliberately out of scope

- Scroll/time trigger implementations. `trigger.type` is currently schema data plus manual trigger behavior.
- Cascade deletion. Source removal is rejected while live dependants exist.
- A second graph or publisher for editor mode.
- Renderer imports in core.
- Track child topology or Motion graph traversal.
- Compatibility facades, rollout flags, and duplicate validation owners.

## 13. Canonical evidence

- [SESSION-STATUS.md](./SESSION-STATUS.md): current implementation status and CI evidence.
- [PUBLIC-API.md](./PUBLIC-API.md): consumer-facing API reference.
- [DECISIONS.md](./DECISIONS.md): accepted architecture decisions, including W5 tradeoffs.
- [IMPLEMENTATION-PLAN-runtime-mutation-model.md](./IMPLEMENTATION-PLAN-runtime-mutation-model.md): execution plan and work-package history.
