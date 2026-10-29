# API reference

Grouped by entrypoint, because the entrypoint is the contract. Each workspace package's `package.json` declares its own exports; source paths in a workspace checkout are not covered by this document.

## Entrypoint tiers

A declared subpath is not automatically production API. The tier says who may import it, and for
the test-support tier that answer is enforced by `scripts/boundary-scan.mjs` rather than by this
list: no package under `packages/*` except core, and no app under `apps/*`, may name it. See
ADR-036 and ADR-048.

- `@motion5/core` — public; production consumers may import it.
- `@motion5/core/adapters` and `/adapters/browser-clock` — public adapters; production consumers may
  import them.
- `@motion5/plugins/fk`, `/transform`, and `/ik` — public plugins; production
  consumers may import them.
- `@motion5/plugins/transform3d`, `/fk3d`, and `/ik3d` — public plugins;
  production consumers may import them.
- `@motion5/plugins/catalog` and `/loader` — public asynchronous composition-root helpers;
  production consumers may import them. Engine loading and live edits stay synchronous.
- `@motion5/plugins/pose-classify` is a public data plugin;
  `/labels` provides label readers and change listeners.
- `@motion5/core/testing` — test support; production consumers may not import it, as enforced by
  the boundary scan.
- `@motion5/core/plugin-api` — the plugin-authoring contract; plugin implementations may import this entrypoint and sibling implementation modules only.
- `@motion5/core/internal` — unadvertised; it carries no stability promise.
- `@motion5/plugins/frame3d` exposes the complete unchanged frame utility module, including
  `readFrame3d` and its nameable types. There is no bare `@motion5/plugins` entrypoint.

## @motion5/core

**Engine and handles.** `Engine`, `StaleTrackHandleError`, and the types `EngineOptions`, `ProjectHandle`, `TrackHandle`, and `LiveValues`.

`new Engine({ clock, interpolator, scheduler, plugins?, triggerFactory? })` validates all three ports. `engine.load(project)` returns a `ProjectHandle`:

- `mount(nodeId, instance?)` and `unmount(nodeId)` control membership.
- `get(nodeId)` returns the retained `LivePatch` or `undefined`. It cannot answer `destroyed`: eviction drops the node's entry before its terminal patch is delivered, so a subscriber hears that publication exactly once and a reader of current state is never handed it.
- `renderMetadata(nodeId)` returns the node's `RenderMetadata`, the output serializers a renderer needs, or `undefined` for a node with no compiled track.
- `subscribeNode(nodeId, listener)` returns an unsubscribe function, and is the one mechanism for it. The `subscribe` alias that used to sit beside it is deleted rather than discouraged. See ADR-076.
- `seek(nodeId, progress)` scrubs one leaf and returns a `PatchBatch`.
- `signal(motionId, signal)` controls a `manual` motion.
- `addMotion(definition)` returns `{ id }`; `destroyMotion(motionId)` removes it.
- `addTrack(track, { motionId? })` returns a `TrackHandle`; `track(nodeId)` returns the handle for an existing node.
- `tryTrack(nodeId)` and `tryMotion(motionId)` return `undefined` for an expected miss; `motion(motionId)` resolves a `MotionHandle`.
- `edit(recipe)` runs one `SchemaTransaction` and commits what it staged exactly once, answering with whatever the recipe returned.
- `values(recipe)` runs one `ValueTransaction` and publishes what it staged exactly once, answering the `PatchBatch` of that single publication.
- A `MotionHandle` exposes `id`, `live`, `definition`, `trackIds`, `setTrigger`, `setStagger`, `addTrack`, `track`, `tryTrack`, and `destroy`. It carries no `signal`, deliberately: signalling a Motion is the composition root's question and `ProjectHandle.signal` answers it, because the runtime holding those trigger tokens holds no Motion instance to signal.
- `dependantsOf(nodeId)` lists every reader of a node for editor preflight: the observer of an edge, and a solver that reads it as a chain member.
- `motionIds()`, `freeTrackIds()` and `mountedNodeIds()` enumerate a loaded project: every Motion id, every track node no Motion owns, and every node currently mounted. All three answer a frozen, total array in committed order, they resolve against a recipe's staged pair while one is open, and they refuse on a disposed project exactly as `dependantsOf` does. A Motion's own children stay `MotionHandle.trackIds`, so mounting a whole document is a loop over these rather than over a copy of its ids kept beside the definition.
- `dispose()` releases the project, motions, triggers, and compiled tracks.

A `TrackHandle` carries `id`, `live`, `definition`, `input`, `requires`, `writeValues(value)`, `releaseValues()`, `remove()`, and `replace(next)`. `input` is the authored input view: `input.replace(next)` replaces the whole input, `input.requires.set(slot, source, memberKey?)` and `input.requires.remove(slot, memberKey?)` edit one dependency binding, and `input.values.set(values)` and `input.values.setField(address, cell)` edit authored values. A dependency that feeds a track's own composition is authored under `input.requires`, which is the only way a value enters composition.

`remove`, `replace`, `input.replace` and the `input.requires` pair are the structural tier, and each returns `void` because the return type carries the tier: a structural edit replaced the graph. Bindings preserve the rest of the input, redirect rather than append, and support `memberKey` for map-valued slots. A refused candidate is rolled back with the handle unchanged; the dependency rules are `edge-unknown-source`, `input-source-shape` and the plugin's declared-slot refusals, all thrown or reported before anything is committed.

`writeValues(value)` and `releaseValues()` are the live tier. `writeValues` replaces the whole evaluated local value with a table or record that matches the track's committed contract; `releaseValues` drops the overlay and resumes authored evaluation. Both return the `PatchBatch` of one publication, stage no Track and rebuild no graph. The overlay survives authored value edits, binding edits and seeks, and is cleared only by a structural replacement or removal, `releaseValues`, and destroy. `input.values.set(values)` is the sticky authored equivalent: it rewrites `input.values`, so `definition` and the live composition cannot disagree, and validates against the committed contract without re-inferring. A write is replaced wholesale rather than accumulated. See ADR-059, ADR-060 and ADR-078.

`input.values.setField(address, cell)` is the same authored tier narrowed to one cell or field. `address.row` selects a table cell and must be absent for a record field; a mismatch between the address form and the track's shape is `values-shape-invalid`, and an address that does not exist is `cell-address-unknown`. It returns the `PatchBatch` of one publication and stages no Track.

`edit(recipe)` on `ProjectHandle` runs `n` authored ops across `m` tracks as one transaction: one candidate build, one graph replacement, one `ObservationState` commit and one flush. The recipe is handed a `SchemaTransaction`, which carries `addMotion`, `motion`, `tryMotion`, `addTrack`, `track` and `tryTrack` and nothing else, so `mount`, `seek`, `subscribeNode` and `dispose` are not reachable through it. Reads inside the recipe resolve against what it has staged, so a two-step edit sees its own first step, and a throw commits nothing: no hook is reached and a handle issued inside the recipe never becomes live. A recipe inside a recipe is `schema-transaction-nested`, and a verb that applies immediately rather than committing is `schema-transaction-immediate`, named at the verb. See ADR-064.

`values(recipe)` is the same idea for the cheap tier, and it defers the publication rather than the write. The recipe is handed a `ValueTransaction`, which carries `seek`, `writeValues` and `releaseValues` addressed by node id, plus `track` and `tryTrack` answering the ordinary `TrackHandle` so that its authored value verbs join the batch too. Every verb still validates on entry, still applies its write when you call it, and still refuses exactly what it refused before; what changes is that `n` writes cost one `invalidate` and one sequence move instead of `n`. The call answers the `PatchBatch` of that one publication, and a verb reached inside answers a deferred batch naming its own node with no patches and one `value-batch-deferred` warning, because a `TrackHandle` is one interface across batched and unbatched use and a member with two return contracts is not. A recipe that staged nothing publishes nothing and answers an empty batch. A recipe is not a transaction: each cheap edit applies immediately, so edits before a refused one stay applied and nothing publishes. Everything that publishes or mounts refuses inside one as `value-batch-immediate`, including `invalidate` and a nested `values`, and every structural verb refuses as `value-batch-structural`; a value verb inside `edit(recipe)` stays `schema-transaction-immediate`, because the two tiers do not nest in either direction. A recipe that disposes the project is answered with `ProjectRuntime is disposed.` rather than with a batch nobody can read. See ADR-078.

`LiveValues` is the narrow live-write type: one static authored value per key. Name it when your call site only ever writes static values; the overlay is structurally unable to carry stops, which keeps an animated authored key from being frozen at a value you passed.

`live` is a boolean that never throws. Every other member throws `StaleTrackHandleError` once the token the handle captured is no longer current, so one condition has one failure contract across the whole surface. That error is a runtime export rather than a type, because a caller cannot `instanceof` a type it cannot name: it extends `TypeError`, keeps the message the `track` getter already threw, and carries a stable `ruleId` of `stale-track-handle` beside the `nodeId` it refused. Both it and `TrackHandle` are declared once, in the contract layer, and named from there by the runtime and by the package entry. See ADR-056.

**Schema and validation.** `AUTHORED_SCHEMA_VERSION`, `SUPPORTED_TRIGGER_TYPES`, `DIAGNOSTIC_SEVERITIES`, `validateV5`, `validateTrackDefinition`, `validateMotionTrigger`, `resolveTriggerDefinition`, `parseGolden`, and `serializeGolden`.

`validateV5` returns a discriminated `ValidationResult`: `kind: "accepted"` carries the frozen
`ProjectDefinition`, while `kind: "refused"` carries at least one `Diagnostic` and no value. Graph
reference and cycle diagnostics are owned by graph construction and are run by the engine load
use-case after schema validation.

`validateV5(input, capabilities?)` accepts `PluginCapabilities`, which `PluginCatalog` implements.
Without the port it does not judge plugin-dependent chain, pole, joint, limit, goal-weight or
dead-orientation rules. Pass the catalog to obtain those checks; Engine does so automatically.

There is no migration entry point. A v4 or grouped document must be rewritten to this contract; a
retained grouped member is refused by name as `track-legacy-field`.

**Types.** `ProjectDefinition`, `MotionDefinition`, `TrackDefinition`, `AuthoredProperty`,
`AuthoredStop`, `TriggerDefinition` and its three members, `TriggerType`, `TriggerSignal`, `Patch`,
`LivePatch`, `PatchBatch`, `PatchStatus`, `PatchListener`, `Diagnostic`, `DiagnosticSeverity`,
`ValidationResult`, `TrackValidationResult`, `GoldenFixture`, and `GoldenValidationFixture`. Value
types are named through `@motion5/core/plugin-api`.

**Plugins.** `PluginCatalog`, `PluginAdmissionError`, and the types `PluginDefinition`,
`DependencySpec`, `EvaluationContext`, `Outputs`, `ResolvedInput` and `ValueSpec` from
`@motion5/core/plugin-api`.

`PluginCatalog.registerAll(definitions)` admits every definition or none: a refusal stores nothing
and preserves existing plugins. `register(definition)` uses the same admission path for one member.
Definitions are validated from one own-property snapshot and frozen before storage; a duplicate id,
unknown member, reserved name or malformed value spec refuses under its named rule.
`EngineOptions.plugins` accepts this catalog only. See
[ADR-134](../ADR-134-atomic-plugin-registration.md).

A `PluginDefinition` declares `id`, `inputs.values`, optional `inputs.requires`, named `outputs`, an
optional `validate` and one `transform`. A dependency slot's `DependencySpec` declares the output
specs it consumes, whether the slot is optional, and whether it binds one source or a map of member
keys. A plugin's `transform` receives the resolved input and an `EvaluationContext` carrying the node
id and progress, and returns named outputs.

**Ports.** `createManualClock`, `createMicrotaskScheduler`, `createManualTriggerPort`,
`createDefaultTriggerFactory`, `createTriggerFactory`, and the helper `acceptsExternalSignal`,
plus the assertions `assertClock`, `assertInterpolator`, `assertScheduler`, `assertTriggerPort`,
and `assertTriggerFactory`. Port types include `Clock`, `ClockTick`, `Scheduler`, `Cancel`,
`SchedulerHost`, `MicrotaskSchedulerOptions`, `TriggerPort`, `Interpolator`,
`InterpolationTimeline`, `TriggerBinding`, `ClockConsumer`, `CreatedTrigger`, `TriggerFactory`,
`TriggerFactoryContext`, `TriggerFactoryOptions`, `ScrollSource`, `ScrollSourceResolver`, and
`ScrollSourceResolverContext`.

`InterpolationTimeline` has one optional member, `patchKeys(overlay, rebase?)`. An implementation
that keeps a per-key child may declare it and replace those children in place; one that cannot answers
by not declaring it, and the runtime recompiles instead and publishes the same values at the same
progress. A declared implementation returns `{ kind: "patched" }` when it replaces the children, or
`{ kind: "recompile" }` when the caller must escalate. `assertInterpolator` does not check for it,
because the capability is not part of what makes something an `Interpolator`. See ADR-060.

`createMicrotaskScheduler(options?)` is the shipped Scheduler. It runs queued jobs in one pass on the injected host, honors cancellation, and reports failures through `onError` without stopping later jobs in the same pass. See ADR-038.

**Version.** `CORE_VERSION`, independent of the authored schema version.

## @motion5/core/adapters

Optional implementations for the composition root.

- `createBrowserClock(frameSource)` returns a `Clock` with `dispose()`.
- `createMicrotaskScheduler(options?)`, plus `SchedulerHost` and `MicrotaskSchedulerOptions`.
- `createGsapInterpolator(gsap)` and `createGsapOneTweenInterpolator(gsap)`, plus structural GSAP types. The timeline-backed one declares `patchKeys`; the one-tween one deliberately does not, because a single tween carrying a `keyframes` map has no per-key child to replace.
- `createDomPatchAdapter(stage, perspective?, resolveTarget?, write?, metadata?)`, plus DOM adapter types and `RenderMetadata`. `metadata` is the serializer half of a resolved plugin chain, which `ProjectHandle.renderMetadata` answers. `apply(patch)` writes a published patch and `applyValues(nodeId, values)` writes a record the caller derived, both through one filter, one composer and one dirty diff; the derived entry has no status to gate and no revision to compare. A key is written to `style`, to an attribute when it names no writable property on a target answering `setAttribute`, or to a property, decided by the target: SVG geometry such as `x1` or `points` therefore renders, while `cx` and `r` stay style writes and want a pose instead. A composed transform on an SVG target pins `transform-box: view-box` with `transform-origin: 0px 0px`, so `rotation` and `scale` pivot at the element's own origin. Every cache the adapter keeps is its own: the dirty diff, the composed transform state, and the newest revision accepted per target and node, all dropped by `clear(target)`. A patch that is not newer than that revision is refused before the diff, so two adapters on one element cannot compose each other's keys. See ADR-074.
- `createScrollTriggerPort(source)` wraps a `ScrollSource` as a `TriggerPort`.
- `createGsapScrollSource(scrollTrigger, options)`, plus structural GSAP scroll source types. Core never imports GSAP.
- `FrameSource`, and the default graph builder.

## @motion5/plugins/transform, /fk, and /ik

Each public subpath exports exactly one identified definition named for the path.

`transformPlugin` takes a record `{ dx, dy }` and a `data` table, and returns the same rows shifted.

`fkPlugin` takes a record `values` (empty), and binds three required slots: a `chain` body table, a
`solved` table and a `base` record. It publishes `values` as a pose table, one row per body member,
with each row's world frame. Body rows carry `parentId?`, `length`, `rotation`, `weight?`, `x?`, `y?`
and optional joint-limit static fields.

`ikPlugin` takes a record `values` with optional `flip` and `inspect`, and binds `chain`, `goals` and
`base`. It publishes `values` as one solved row per member (`rotation`, optional `residual` and
`atBound`) and, when `inspect` is authored, an `inspect` record.

Author a 2D chain as one body table and one goals table:

```js
{ id: "body", input: { values: [
  { id: "upper", cells: { length: 40, rotation: 90, weight: 1 } },
  { id: "fore", cells: { parentId: "upper", length: 36, rotation: 0 } },
] } }
{ id: "goals", input: { values: [
  { id: "goal", cells: { memberId: "fore", x: 60, y: 20 } },
] } }
{ id: "solve", plugin: "ik", input: {
  values: { inspect: true },
  requires: { chain: "body", goals: "goals", base: "root" },
} }
{ id: "pose", plugin: "fk", input: {
  values: {},
  requires: { chain: "body", solved: "solve", base: "root" },
} }
```

`fk3dPlugin` and `ik3dPlugin` use the same aggregate shape in three dimensions: body rows carry
`rotation`, `rotationX`, `rotationY`, and goals rows address a leaf by `memberId` with `x`, `y`, `z`.
`transform3dPlugin` shifts a 3D point table.

## @motion5/core/testing

Test support, and the only tier a production consumer may not import: `createFakeInterpolator`, `createFakeScheduler`, `createFakeTriggerPort`, `createFakeTrackRegistry`, and `ScheduledJob`.

These are the implementations the core suite runs the port contract suite against, per TR-P-05, so they ship inside the package rather than beside it. `createFakeInterpolator` declares no `patchKeys`, deliberately: it is the double that proves the capability is genuinely optional and that a declining backend is observably identical to a patching one. The restriction is mechanical, not advisory: `scripts/boundary-scan.mjs` scans every workspace declared in the root `package.json`, `apps/*` included, and reports a `testing entrypoint import` violation for any consumer that names this path or reaches `packages/core/src/testing` directly. This path replaces `@motion5/core/ports/fakes`, which is no longer declared. See ADR-048.

## @motion5/core/internal

A private channel between core and React: the `Patch`, `LivePatch`, `PatchListener`, `PatchSource`, `RenderMetadata`, and `RenderMetadataSource` types, plus the `liveOrAbsent` function. The metadata half is declared separately and required only by the binding that renders, so a consumer that reads values keeps the two-member source contract. `PatchSource.get` answers `LivePatch | undefined` while `subscribeNode` delivers every variant, and `liveOrAbsent` is the one function that converts between them, so an implementor discharges that obligation with a call rather than re-deriving which variants are live.

## @motion5/plugins/loader

`createPluginLoader(catalog)` takes a `ReadonlyMap<string, PluginDescriptor>` of approved
descriptors and returns a `PluginLoader` with
`ensure(registry, demand): Promise<EnsuredDemand>`. Each descriptor declares
`load(): Promise<PluginDefinition>` and optional `dependencies`. A `PluginDemand` is either
`{ kind: "project", project }` or `{ kind: "tracks", tracks }`; the loader reads the plugin ids those
tracks name.

Ensure validates demand and plans its dependency closure before importing, then registers only the
missing definitions in one atomic `registerAll` on the caller's `PluginCatalog`. The Engine retains
that same catalog by reference, so ensure also works after loading a project.

`EnsuredDemand` is `{ kind: "ensured", added }` or `{ kind: "refused", failure }`.
`PluginLoadFailure` has six variants: `invalid-demand` carries diagnostics, `unknown-plugin`
carries name and authored path, `dependency-cycle` carries its cycle, `import-failed` carries
name and cause, `identity-mismatch` carries name and received identity, and `registration-refused`
carries cause. `describeLoadFailure(failure)` owns their wording;
`ensuredOrThrow(result)` returns added names or throws an Error preserving the available cause.
See [ADR-135](../ADR-135-approved-plugin-loader.md).

Imports are cached across catalogs by a loader, but admission always targets the caller's catalog.
Failed imports are evicted for retry. Ensure rechecks registered names after its final await, so
overlapping calls are idempotent. A plugin already registered needs no catalog entry, while declared
catalog dependencies must still be approved.

### Ensure before a synchronous live edit

Keep one catalog per Engine. Await ensure outside the transaction, then call the synchronous edit.
Neither `addTrack` nor `edit` imports plugins; an unseen id is refused without changing the graph.

```ts
import { Engine, PluginCatalog, type TrackDefinition } from "@motion5/core";
import { fkPlugin } from "@motion5/plugins/fk";
import { createPluginLoader, ensuredOrThrow } from "@motion5/plugins/loader";

const approved = new Map([["fk", { load: async () => fkPlugin }]]);
const plugins = new PluginCatalog();
ensuredOrThrow(await createPluginLoader(approved).ensure(plugins, { kind: "project", project }));
const project = new Engine({ clock, interpolator, scheduler, plugins }).load(definition);

const tracks: readonly TrackDefinition[] = [
  {
    id: "bone",
    plugin: "fk",
    input: {
      values: { length: 20, rotation: 0 },
      requires: { chain: "body", solved: "solve", base: "~/root" },
    },
  },
];
ensuredOrThrow(await createPluginLoader(approved).ensure(plugins, { kind: "tracks", tracks }));
project.edit((edit) => {
  for (const track of tracks) edit.addTrack(track);
});
```

## @motion5/plugins/pose-classify

`createPoseClassifyPlugin(options)` returns a pure plugin definition binding directly to an FK pose
table track (`requires: { pose: "..." }`) and publishing `{ label, confidence }` records.
`PoseClassifyOptions` names `templates`, positive finite `maxDistance` in degrees, optional `name`
(default `pose-classify`) and `unknownLabel` (default `unknown`). Each `PoseTemplate` contains a
distinct non-empty label and a non-empty bone record of finite `rotation`, `rotationX` and
`rotationY` angles. A template label cannot equal the unknown label. Invalid configuration throws
TypeError eagerly; template copies are deeply frozen.

Distance is the mean per-bone geodesic rotation angle, not a per-axis Euler difference. Position is
ignored. A missing bone scores Infinity, a present zero-default bone remains a candidate, ties keep
the first template, and a distance at or below the maximum selects that template's label.
Confidence is `max(0, 1 - distance / maxDistance)`, or zero for a non-finite distance.
Use `readLabel` or `onLabelChange` to consume labels; listeners must not synchronously write.

The factory is deliberately absent from `builtinCatalog`. An application approves a configured
descriptor, and any template fetch happens before the definition is returned:

```ts
import { builtinCatalog } from "@motion5/plugins/catalog";
import { createPluginLoader } from "@motion5/plugins/loader";
import { createPoseClassifyPlugin } from "@motion5/plugins/pose-classify";

const loader = createPluginLoader(
  new Map([
    ...builtinCatalog,
    [
      "pose-classify",
      {
        load: async () =>
          createPoseClassifyPlugin({
            templates: await fetchTemplates(),
            maxDistance: 10,
          }),
      },
    ],
  ]),
);
```

The application's `fetchTemplates` returns `readonly PoseTemplate[]`. A custom definition name
must equal its catalog key. No descriptor dependency is needed: authored rig requirements are
graph edges, and the authored rig group creates its own loader demand.
See [ADR-138](../ADR-138-rig-aggregation-and-pose-classification.md).

## @motion5/three

The optional `@motion5/three` workspace package adapts public patches to Three.js `Object3D`
instances. Its consumer-facing peer dependency is `three >=0.160.0`; the adapter writes world
frames, converts core's degree angles to radians, and uses `EULER_ORDER_3D` (`"ZXY"`) so Three.js
composes `Rz · Rx · Ry`. `writeFrame3d(object, values)` writes one frame, and
`createObject3dPatchAdapter(resolve)` provides `apply(patch)`, `applyValues(nodeId, values)` and
`clear(object?)`. `apply` accepts one revision per resolved object and node, in order, and refuses a
stale or duplicate one, as core's DOM adapter does; `clear(object)` drops that revision state for
one object so a retained patch can re-pose it after a rebind. Called without an object it clears
nothing, exactly as the DOM adapter's `clear` does (revision state is held per object in a weak map,
which cannot be enumerated). It never removes anything from the scene graph.

## @motion5/react

`usePatch(source, nodeId)`, `useDomPatch(source, nodeId)`, `useDerivedDomPatch(source, nodeIds, derive)`, `liveOrAbsent(patch)`, the `PatchDerivation` and `PatchValues` types, and the re-exported `Patch`, `LivePatch`, `PatchListener`, `PatchSource`, `RenderMetadata`, and `RenderMetadataSource` types.

`useDomPatch` returns a callback ref for one-patch-to-one-target HTML or SVG binding and requires a `PatchSource & RenderMetadataSource`. `useDerivedDomPatch` returns one for a target whose values are a `PatchDerivation` over the nodes it names: it takes a plain `PatchSource`, runs the derivation only while every named node is ready, and hides the target while one is not or while the derivation returns `undefined`. Diagnostics and markup that must render absence rather than hide it stay on `usePatch`. See ADR-073 and ADR-075.

`usePatch` answers `LivePatch | undefined`. The store behind it collapses a node's terminal publication to absence rather than serving it, so a component renders the node's disappearance as the absence its markup already handles instead of as a fourth status it has to know to check. `liveOrAbsent(patch)` is that collapse, exported because `get` answers the live union while `subscribeNode` delivers all four variants: a consumer implementing a source over a wire that carries a terminal patch owes the conversion, and this is the one function that makes it. It answers the patch it was handed for `ready`, `blocked` and `error`, by identity rather than by copy, so snapshot stability survives it, and `undefined` for `destroyed`. A consumer that wants the terminal event itself reads it from `subscribeNode`, which is the only place it is ever delivered.

## Known gaps

1. Neither package is published; both remain private at `0.0.0`.
2. [Issue #176](https://github.com/chahyasantoso/motion5/issues/176) tracks transactional `replaceTrack` ordering after a failed recompile.

## Runners

`@motion5/plugins/runner` exports `attachRunners`, `createLatestSlot` and `describeRunnerFailure`,
with the nameable types `Runner`, `RunnerStep`, `RunnerFailure`, `AttachRunnersOptions` and
`LatestSlot<T>`. Stateful simulations, temporal filters and large inference belong here, not
inside plugin composition. See ADR-139.

Attach after engine creation using the same clock. A missing options object, a clock without
`subscribe` or a missing `onFailure` is refused by name. Attachment snapshots the runner array and node
ids, rejects duplicate or missing owners before subscribing, and subscribes once. A runner
exclusively owns one node's overlay; different attachments must not own the same node.
Synchronous `step(tick, read)` returns `hold` (no write), `write` (replace the overlay wholesale)
or `release` (restore authored values without detaching).

All steps read published state before runner writes. One value batch applies queued commands after
engine composition. Steps must not synchronously write to the project. Keys must already be
authored with the same static leaf kind; a label runner therefore authors a string key.
A runner returning `write` with identical values every tick still republishes and recomputes
downstream each frame; choosing `hold` is the runner's responsibility.

```ts
import { attachRunners, createLatestSlot } from "@motion5/plugins/runner";

const results = createLatestSlot<number>();
// An asynchronous producer calls results.offer(completedX).
const disposeRunners = attachRunners(
  project,
  [
    {
      nodeId: "scene/target",
      step() {
        const x = results.take();
        return x === undefined ? { kind: "hold" } : { kind: "write", values: { x } };
      },
    },
  ],
  { clock, onFailure: reportRunnerFailure },
);
// Shutdown order: disposeRunners(), then project.dispose().
```

`LatestSlot` retains the newest offered result; `take` consumes it once. Async work stays outside
`step`; the next tick that consumes a completed result applies it. `take` answers `undefined` when
empty, so `T` excludes `undefined` by type; wrap an optional result in a record.

Throwing steps, missing nodes and refused writes detach only their runner, attempt release when
possible and dispose it once. `onFailure` runs after the batch and cleanup; every report is
attempted even if a callback throws, then the first thrown value escapes.
`describeRunnerFailure` covers all variants including `dispose-threw` and `project-unavailable`.

Disposal is idempotent: unsubscribe, release remaining nodes still present in one batch and attempt
every disposer. Dispose before the project. Reversed cleanup still attempts every runner disposer,
then rethrows the batch error once; the next call is silent. After a `project-unavailable` stop,
later disposal is a no-op. Any failure of the batch call itself stops the attachment, transient
or not: the runner cannot tell a disposed project from a passing refusal, so it never retries.

Do not recursively tick the clock or dispose the attachment from `step`, runner cleanup or
`onFailure`. Active-dispatch reentrancy is refused before changing attachment state, preserving
the one-batch-per-tick boundary. Dispose after the tick has returned; disposal after a terminal
stop remains a silent no-op.

## Labels

`@motion5/plugins/labels` exposes `readLabel` and `onLabelChange`. Labels are `ImmutableLeaf` values (string, boolean, or finite number), read by the same `isImmutableLeaf` rule the freezer and publisher use. The listener skips its initial state, ignores blocked and error publications by retaining the last ready label, and sends one undefined edge when the node is destroyed. Listeners run during publication and must not synchronously write to the project. See [ADR-137](../ADR-137-no-null-in-renderer-neutral-values.md).
