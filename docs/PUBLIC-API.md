# motion5 public API

**Audience:** application and editor authors consuming `@motion5/core`.

**Current source of truth:** `packages/core/src/index.ts` and the public `ProjectHandle` / `TrackHandle` types in `packages/core/src/engine.ts`. This guide intentionally skips private graph classes.

## 1. The mental model

You load a project into an `Engine`, receive a `ProjectHandle`, and use that handle to:

1. mount nodes into your renderer;
2. drive Motion groups or individual Tracks;
3. subscribe to immutable patches;
4. add, edit, observe, and remove Tracks;
5. add and remove Motions.

```ts
const handle = new Engine({ clock, interpolator, scheduler }).load(project);
const track = handle.addTrack({ id: "arm", keyframes: { x: { stops: [{ p: 0, v: 0 }, { p: 1, v: 100 }] } } });
handle.mount(track.id, element);
handle.seek(track.id, 0.5);
const patch = handle.get(track.id);
handle.dispose();
```

## 2. Package exports

The package entry exports:

### Runtime entrypoints

- `Engine`
- `ProjectHandle`
- `TrackHandle`
- `PluginRegistry`

### Authored contract types and constants

- `AUTHORED_SCHEMA_VERSION`
- `SUPPORTED_TRIGGER_TYPES`
- `DIAGNOSTIC_SEVERITIES`
- `ProjectDefinition`
- `MotionDefinition`
- `TrackDefinition`
- `ObservationDefinition`
- `TriggerType`
- `TriggerSignal`
- `Patch`
- `PatchBatch`
- `PatchStatus`
- `PatchListener`
- `Diagnostic` and `DiagnosticSeverity`
- authored stop/property and migration types

### Validation and serialization

- `validateV5()` and `ValidationResult`
- `validateTrackDefinition()` and `TrackValidationResult`
- `migrateV4ToV5()` and `MigrationResult`
- `parseGolden()` / `serializeGolden()` and golden fixture types

### Ports and helpers

- `assertClock()` / `createManualClock()`
- `assertTriggerPort()` / `createManualTriggerPort()` / `TriggerPort`
- `assertInterpolator()` / `Interpolator` / `InterpolationTimeline`
- `assertScheduler()` / `Scheduler`

Private graph/runtime classes are not public API: `ProjectRuntime`, `GraphRuntime`, `GraphBinding`, `GraphPublisher`, `PatchRegistry`, `ObservationState`, and id-normalization helpers.

## 3. Engine and project loading

```ts
interface EngineOptions {
  clock: Clock;
  interpolator: Interpolator;
  scheduler: Scheduler;
  plugins?: PluginRegistry;
}

class Engine {
  constructor(options: EngineOptions);
  load(project: ProjectDefinition): ProjectHandle;
}
```

`load()` validates schema v5, freezes the accepted project snapshot, compiles authored Tracks, creates authored Motions, and returns a live handle. It mounts nothing automatically.

`Engine` requires all three ports. Tests commonly use `createManualClock()`, `createFakeInterpolator()`, and `createFakeScheduler()` from the test support code; application code supplies real adapters.

## 4. ProjectHandle API

### `mount(nodeId, instance?)`

Attach a qualified node to the active renderer membership set. The optional `instance` is opaque to core and defaults to `{}`.

Mounting is explicit. A node can exist in the graph without being mounted or published on ordinary clock ticks.

### `unmount(nodeId)`

Detach a node without deleting its graph definition. This is reversible: a later `mount()` can attach it again. Unmounting does not emit a terminal `destroyed` patch.

### `seek(nodeId, progress)`

Directly set one Track's progress and invalidate it. `progress` is validated by the Track domain. This is the low-level leaf operation.

Use `signal()` when you want to drive a whole Motion group.

### `signal(motionId, signal)`

Send a `TriggerSignal` to a Motion. A signal with a finite `progress` schedules Motion progress through its scheduler.

The current core implementation does not dispatch behavior from `signal.type`. Schema trigger types `scroll` and `time` are retained but their drivers are not implemented yet; manual progress signaling is the supported behavior.

### `addMotion(definition)`

Create an empty runtime Motion.

```ts
handle.addMotion({
  id: "scene",
  trigger: { type: "manual" },
  tracks: [],
  stagger: 0.1,
});
```

Runtime Motions must start with `tracks: []`. Add Tracks afterward with `addTrack(..., { motionId: "scene" })`.

### `destroyMotion(motionId)`

Remove an empty Motion. Destruction is rejected while the Motion still owns Tracks. There is no cascade deletion.

### `addTrack(track, options?)`

Add a Track and return a `TrackHandle`.

```ts
const arm = handle.addTrack(trackDefinition);
const sceneArm = handle.addTrack(trackDefinition, { motionId: "scene" });
```

Without `motionId`, the Track is a free node and its id becomes `~/trackId`. With `motionId`, its id becomes `motionId/trackId`.

The definition is validated and stored as a frozen runtime-owned clone. Invalid keyframes, ids, observation structures, projections, cycles, or unknown sources reject the operation without partially changing the project.

### `track(nodeId)`

Return a capability handle for an existing authored or runtime Track. This is how an editor gets a mutation capability for content loaded from a document.

The returned handle is not a renderer instance and does not expose the graph.

### `dependantsOf(nodeId)`

Return the qualified node ids that currently observe `nodeId`. This is a read-only editor preflight query.

It does not replace graph validation. Removing a source with a live dependant still throws during candidate validation.

### `subscribe(nodeId, listener)` and `subscribeNode(nodeId, listener)`

Subscribe to node patches. Both currently resolve to the same node subscription behavior. The listener receives a `Patch`; the returned function unsubscribes.

### `get(nodeId)`

Return the latest retained `Patch` for a node, or `undefined` if that node has not published a patch or its retained patch has been removed.

### `adopt(track, owner, options?)` and `destroyAdopted(nodeId, owner)`

These are compatibility wrappers for the older owner-object API. New code should prefer `addTrack()` / `track()` and `TrackHandle.remove()`.

The old owner API remains available because existing consumers use it. Its mutations now go through the same unified store and transaction rules.

### `dispose()`

Idempotently tear down the project, clock subscription, Motions, Tracks, graph, patch registry, and diagnostics state. Do not use the handle after disposal.

## 5. TrackHandle API

```ts
interface TrackHandle {
  readonly id: string;
  readonly track: TrackDefinition;
  remove(): void;
  replace(next: TrackDefinition): void;
  addObserve(observation: ObservationDefinition): void;
  removeObserve(observation: ObservationDefinition): void;
}
```

### `id` and `track`

`id` is the qualified graph id. `track` is the frozen definition currently owned by the runtime.

After the Track is removed, reading `track` throws because the capability is no longer live.

### `remove()`

Permanently remove this Track instance. It emits one terminal `status: "destroyed"` patch when a retained patch/subscriber makes that event observable. Calling `remove()` again is safe.

If another live Track observes this Track, removal is rejected and the Track remains live. Check `dependantsOf()` first for better editor UX.

### `replace(next)`

Replace the definition without changing the qualified node id. The replacement is validated and compiled before commit.

```ts
arm.replace({
  id: "arm",
  keyframes: { x: { stops: [{ p: 0, v: 0 }, { p: 1, v: 250 }] } },
});
```

A replacement preserves subscribers and does not emit `status: "destroyed"`. Renaming is not replacement; use remove plus add.

### `addObserve(observation)` / `removeObserve(observation)`

Edit the observer Track's `observes` array through replacement. Edges are not independent public objects, so these methods do not create a second edge owner.

Invalid source ids, projections, duplicate edges, and cycles reject atomically.

### Stale handles and id reuse

Handles contain a private monotonic identity token. If `arm` is removed and another Track later uses `~/arm`, the old handle becomes inert. Its `remove`, `replace`, and observation methods cannot affect the new Track.

## 6. Qualified ids

| Content | Qualified id |
| --- | --- |
| Track `arm` inside Motion `scene` | `scene/arm` |
| Free Track `arm` | `~/arm` |

Authored local ids must not contain `/`. Motion id `~` is reserved. Qualified ids are runtime/public node ids, not authored local ids.

## 7. Patches and batches

A `Patch` contains:

- `nodeId`;
- monotonic `revision`;
- deeply frozen `values`;
- `sourceProgress`;
- `sourceRevisions`;
- `status`: `ready`, `blocked`, `error`, or terminal `destroyed`;
- inline `diagnostics`.

A `PatchBatch` contains the tick, seed ids, patches, and batch diagnostics.

Consumers should treat `destroyed` as permanent for that node instance. A normal edit uses `TrackHandle.replace()`, not remove plus re-add.

## 8. Validation behavior

`validateV5()` validates a complete project and returns a frozen accepted value when valid. `validateTrackDefinition()` does the same for one runtime Track definition.

Runtime errors are thrown at the mutation boundary. The graph is never left half-updated after a rejected mutation.

## 9. What is not public

Do not import these from deep paths:

- `ProjectRuntime`;
- `GraphRuntime`;
- `GraphBinding`;
- `GraphPublisher`;
- `PatchRegistry`;
- `ObservationState`;
- graph id helpers and internal IR types.

They are implementation details and may change without consumer compatibility.

## 10. Recommended editor flow

```ts
const project = engine.load({ schemaVersion: 5, motions: [], freeTracks: [] });

project.addMotion({ id: "scene", trigger: { type: "manual" }, tracks: [] });
const root = project.addTrack(rootDefinition, { motionId: "scene" });
const child = project.addTrack(childDefinition, { motionId: "scene" });

if (project.dependantsOf(root.id).length === 0) root.remove();

child.replace(nextChildDefinition);
child.addObserve({ source: root.id, role: "input", projection: { map: { x: "parentX" } } });

project.mount(root.id, rootElement);
project.mount(child.id, childElement);
project.signal("scene", { type: "manual", progress: 0.5 });

project.dispose();
```

For a loaded document, call `project.track(nodeId)` to get a capability for an authored Track. For new code, avoid `adopt()` unless maintaining the older owner-based integration.

## 11. Canonical companion docs

- [ARCHITECTURE.md](./ARCHITECTURE.md): how the pieces fit together.
- [SESSION-STATUS.md](./SESSION-STATUS.md): current work and CI evidence.
- [DECISIONS.md](./DECISIONS.md): decisions and tradeoffs.
- [IMPLEMENTATION-PLAN-runtime-mutation-model.md](./IMPLEMENTATION-PLAN-runtime-mutation-model.md): how W1-W5 were executed.
