# API reference

Grouped by entrypoint, because the entrypoint is the contract. `packages/core/package.json` declares these and nothing else; anything you reach through a source path in a workspace checkout is not covered by this document and can move without notice.

## @motion5/core

**Engine and handles.** `Engine`, and the types `ProjectHandle` and `TrackHandle`.

`new Engine({ clock, interpolator, scheduler, plugins?, triggerFactory? })` validates all three ports at construction. `engine.load(project)` returns a `ProjectHandle`:

- `mount(nodeId, instance?)` and `unmount(nodeId)` control membership.
- `get(nodeId)` returns the retained `Patch` or `undefined`.
- `subscribeNode(nodeId, listener)` returns an unsubscribe function. `subscribe` is the same call under an older name.
- `seek(nodeId, progress)` scrubs one leaf and returns the resulting `PatchBatch`.
- `signal(motionId, signal)` controls a `manual` motion.
- `addMotion(definition)` returns `{ id }`. `destroyMotion(motionId)` removes it.
- `addTrack(track, { motionId? })` returns a `TrackHandle`. `track(nodeId)` returns the handle for an existing node.
- `dependantsOf(nodeId)` lists observers, for editor preflight.
- `adopt(track, owner, options?)` and `destroyAdopted(nodeId, owner)` are the superseded owner-based API.
- `dispose()` releases the project, its motions, its triggers, and its compiled tracks.

A `TrackHandle` carries `id`, `track`, and `remove()`, `replace(next)`, `addObserve(observation)`, `removeObserve(observation)`.

**Schema and validation.** `AUTHORED_SCHEMA_VERSION`, `SUPPORTED_TRIGGER_TYPES`, `DIAGNOSTIC_SEVERITIES`, `validateV5`, `validateTrackDefinition`, `validateMotionTrigger`, `resolveTriggerDefinition`, `migrateV4ToV5`, `parseGolden`, `serializeGolden`.

**Types.** `ProjectDefinition`, `MotionDefinition`, `TrackDefinition`, `ObservationDefinition`, `AuthoredProperty`, `AuthoredStop`, `TriggerDefinition` and its three members, `TriggerType`, `TriggerSignal`, `Patch`, `PatchBatch`, `PatchStatus`, `PatchListener`, `Diagnostic`, `DiagnosticSeverity`, `MigrationDiagnostic`, `MigrationResult`, `ValidationResult`, `TrackValidationResult`, `GoldenFixture`, `GoldenValidationFixture`.

**Plugins.** `PluginRegistry`, and the types `PluginDefinition` and `ResolvedPlugins`.

**Ports.** `createManualClock`, `createManualTriggerPort`, `createDefaultTriggerFactory`, `createTriggerFactory`, and the assertions `assertClock`, `assertInterpolator`, `assertScheduler`, `assertTriggerPort`, `assertTriggerFactory`. Port types: `TriggerPort`, `Interpolator`, `InterpolationTimeline`, `ClockBinding`, `ClockConsumer`, `CreatedTrigger`, `TriggerFactory`, `TriggerFactoryContext`, `TriggerFactoryOptions`, `ScrollSource`, `ScrollSourceResolver`, `ScrollSourceResolverContext`.

**Version.** `CORE_VERSION`, which is the package version and is independent of the schema version.

## @motion5/core/adapters

Optional implementations you opt into at your composition root.

- `createBrowserClock(frameSource)` returns a `Clock` with `dispose()`. `frameSource` is `{ requestFrame, cancelFrame }`, so you pass `requestAnimationFrame` in rather than having it imported for you. A listener that throws no longer kills the frame loop: the next frame is requested before the error escapes.
- `createGsapInterpolator(gsap)` and `createGsapOneTweenInterpolator(gsap)`, plus the structural types `GsapLike`, `GsapTimelineLike`, `GsapTweenLike`. Core never imports GSAP; you hand it in.
- `createDomPatchAdapter(stage, perspective?, resolveTarget?, write?, metadata?)`, plus `DomPatchAdapter`, `DomPatchWriter`, `DomTarget`, `DomTargetResolver`, `StageLike`.
- `createScrollTriggerPort(source)` wraps a `ScrollSource` as a `TriggerPort`.
- `FrameSource`, and the default graph builder.

## @motion5/core/plugins/transform and /plugins/fk

`transformPlugin` claims the keys `x`, `y`, and `rotation` and passes them through. Register it if you animate any of those.

`fkPlugin` is a forward-kinematics compose-stage plugin: it claims `boneLength` and `boneRotation`, reads the inputs `parentX`, `parentY`, and `parentRotation`, and produces `x`, `y`, and `rotation` in world space. `composeWorld(parent, local)` is exported alongside it for the same math outside a plugin.

Registering both is the rig case: `fk` produces the transform outputs that `transform` claims.

## @motion5/core/ports/fakes

Test doubles, supported for your tests and examples rather than production rendering: `createFakeInterpolator`, `createFakeScheduler`, `createFakeTriggerPort`, `createFakeTrackRegistry`, and `ScheduledJob`.

`createFakeScheduler()` is the pragmatic answer to the missing scheduler: it collects jobs and exposes `pending` and `flush()`, which is exactly what a deterministic test wants.

## @motion5/core/internal

A private channel between the core and React packages: `Patch`, `PatchListener`, and `PatchSource`. Depend on it only if you are writing a consumer package that needs `PatchSource` structurally.

## @motion5/react

`usePatch(source, nodeId)` and the re-exported `Patch`, `PatchListener`, and `PatchSource` types, so a consumer never has to import from `/internal` directly.

## Known gaps

These are real and worth knowing before you plan around them.

1. **No `Scheduler` implementation ships.** `assertScheduler` is exported but no production scheduler is. Write your own, as in [Getting started](./getting-started.md), or use `createFakeScheduler` from `/ports/fakes`.
2. **The `Clock`, `ClockTick`, `Scheduler`, and `Cancel` types are not exported,** and neither is `EngineOptions`. Object literals still typecheck structurally, so this bites you only when you want to name the type of your own clock or scheduler in a signature.
3. **Neither package is published,** and both are `private` at `0.0.0`. Packaged consumer verification is still planned work, so treat the `exports` map as the contract and expect the install story to change.
