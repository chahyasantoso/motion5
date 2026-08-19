# API reference

Grouped by entrypoint, because the entrypoint is the contract. `packages/core/package.json` declares these and nothing else; anything you reach through a source path in a workspace checkout is not covered by this document and can move without notice.

## @motion5/core

**Engine and handles.** `Engine`, and the types `EngineOptions`, `ProjectHandle` and `TrackHandle`.

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

**Ports.** `createManualClock`, `createMicrotaskScheduler`, `createManualTriggerPort`, `createDefaultTriggerFactory`, `createTriggerFactory`, and the assertions `assertClock`, `assertInterpolator`, `assertScheduler`, `assertTriggerPort`, `assertTriggerFactory`. Port types: `Clock`, `ClockTick`, `Scheduler`, `Cancel`, `SchedulerHost`, `MicrotaskSchedulerOptions`, `TriggerPort`, `Interpolator`, `InterpolationTimeline`, `ClockBinding`, `ClockConsumer`, `CreatedTrigger`, `TriggerFactory`, `TriggerFactoryContext`, `TriggerFactoryOptions`, `ScrollSource`, `ScrollSourceResolver`, `ScrollSourceResolverContext`.

The port types are exported so you can write a reusable adapter or a typed factory. An object literal always satisfied these contracts structurally; naming one in a signature is what needed the export.

`createMicrotaskScheduler(options?)` is the shipped `Scheduler`. It collects jobs and runs them in one pass on `options.host`, which defaults to a promise microtask, so a pending progress change is applied in the turn after the one that produced it. Cancellation is honoured right up to the moment a job runs, a job scheduled from inside a job runs in the next pass rather than extending the current one, and every job in a pass runs even when one of them throws. Pass `onError` to intercept the single failure a pass reports; without it the failure leaves through the host's own channel, which for the default host is an unhandled rejection. See ADR-038 for the pacing decision and the alternatives rejected.

**Version.** `CORE_VERSION`, which is the package version and is independent of the schema version.

## @motion5/core/adapters

Optional implementations you opt into at your composition root.

- `createBrowserClock(frameSource)` returns a `Clock` with `dispose()`. `frameSource` is `{ requestFrame, cancelFrame }`, so you pass `requestAnimationFrame` in rather than having it imported for you. A listener that throws no longer kills the frame loop: the next frame is requested before the error escapes.
- `createMicrotaskScheduler(options?)`, plus the types `SchedulerHost` and `MicrotaskSchedulerOptions`. The same factory the root entry names; there is one implementation reachable from two declared paths, exactly like the trigger factory.
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

`createFakeScheduler()` collects jobs and exposes `pending` and `flush()`, which is what a deterministic test wants: the test decides when a pass happens, and asserts on what was queued before it. Anything that renders should compose `createMicrotaskScheduler` instead.

## @motion5/core/internal

A private channel between the core and React packages: `Patch`, `PatchListener`, and `PatchSource`. Depend on it only if you are writing a consumer package that needs `PatchSource` structurally.

## @motion5/react

`usePatch(source, nodeId)` and the re-exported `Patch`, `PatchListener`, and `PatchSource` types, so a consumer never has to import from `/internal` directly.

## Known gaps

These are real and worth knowing before you plan around them.

1. **Neither package is published,** and both are `private` at `0.0.0`. Packaged consumer verification is still planned work, so treat the `exports` map as the contract and expect the install story to change.
