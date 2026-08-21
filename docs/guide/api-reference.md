# API reference

Grouped by entrypoint, because the entrypoint is the contract. `packages/core/package.json` declares these and nothing else; source paths in a workspace checkout are not covered by this document.

## @motion5/core

**Engine and handles.** `Engine`, and the types `EngineOptions`, `ProjectHandle`, and `TrackHandle`.

`new Engine({ clock, interpolator, scheduler, plugins?, triggerFactory? })` validates all three ports. `engine.load(project)` returns a `ProjectHandle`:

- `mount(nodeId, instance?)` and `unmount(nodeId)` control membership.
- `get(nodeId)` returns the retained `Patch` or `undefined`.
- `subscribeNode(nodeId, listener)` returns an unsubscribe function. `subscribe` is the same call under an older name.
- `seek(nodeId, progress)` scrubs one leaf and returns a `PatchBatch`.
- `signal(motionId, signal)` controls a `manual` motion.
- `addMotion(definition)` returns `{ id }`; `destroyMotion(motionId)` removes it.
- `addTrack(track, { motionId? })` returns a `TrackHandle`; `track(nodeId)` returns the handle for an existing node.
- `dependantsOf(nodeId)` lists observers for editor preflight.
- `adopt(track, owner, options?)` and `destroyAdopted(nodeId, owner)` are the superseded owner-based API.
- `dispose()` releases the project, motions, triggers, and compiled tracks.

A `TrackHandle` carries `id`, `track`, `remove()`, `replace(next)`, `addObserve(observation)`, and `removeObserve(observation)`. Generic observations remain available, but plugin-owned dependencies should use the plugin group's `requires` section.

**Schema and validation.** `AUTHORED_SCHEMA_VERSION`, `SUPPORTED_TRIGGER_TYPES`, `DIAGNOSTIC_SEVERITIES`, `validateV5`, `validateTrackDefinition`, `validateMotionTrigger`, `resolveTriggerDefinition`, `migrateV4ToV5`, `parseGolden`, and `serializeGolden`.

**Types.** `ProjectDefinition`, `MotionDefinition`, `TrackDefinition`, `ObservationDefinition`, `AuthoredProperty`, `AuthoredStop`, `TriggerDefinition` and its three members, `TriggerType`, `TriggerSignal`, `Patch`, `PatchBatch`, `PatchStatus`, `PatchListener`, `Diagnostic`, `DiagnosticSeverity`, `MigrationDiagnostic`, `MigrationResult`, `ValidationResult`, `TrackValidationResult`, `GoldenFixture`, and `GoldenValidationFixture`.

An `ObservationDefinition` carries `source`, an optional `role`, and an optional `projection`. There is no `target`; an authored one is rejected with `observation-target-unsupported`. See ADR-046.

**Plugins.** `PluginRegistry`, and the types `PluginDefinition` and `ResolvedPlugins`.

A `PluginDefinition` may declare `requirements`, a record of optional input slots owned by that plugin. Its `compose` receives authored/interpolated values and a third argument containing that plugin's scoped inputs. `ResolvedPlugins.requirements` reports the bindings resolved for a track.

**Ports.** `createManualClock`, `createMicrotaskScheduler`, `createManualTriggerPort`, `createDefaultTriggerFactory`, `createTriggerFactory`, and the assertions `assertClock`, `assertInterpolator`, `assertScheduler`, `assertTriggerPort`, and `assertTriggerFactory`. Port types include `Clock`, `ClockTick`, `Scheduler`, `Cancel`, `SchedulerHost`, `MicrotaskSchedulerOptions`, `TriggerPort`, `Interpolator`, `InterpolationTimeline`, `ClockBinding`, `ClockConsumer`, `CreatedTrigger`, `TriggerFactory`, `TriggerFactoryContext`, `TriggerFactoryOptions`, `ScrollSource`, `ScrollSourceResolver`, and `ScrollSourceResolverContext`.

`createMicrotaskScheduler(options?)` is the shipped Scheduler. It runs queued jobs in one pass on the injected host, honors cancellation, and reports failures through `onError` without stopping later jobs in the same pass. See ADR-038.

**Version.** `CORE_VERSION`, independent of the authored schema version.

## @motion5/core/adapters

Optional implementations for the composition root.

- `createBrowserClock(frameSource)` returns a `Clock` with `dispose()`.
- `createMicrotaskScheduler(options?)`, plus `SchedulerHost` and `MicrotaskSchedulerOptions`.
- `createGsapInterpolator(gsap)` and `createGsapOneTweenInterpolator(gsap)`, plus structural GSAP types.
- `createDomPatchAdapter(stage, perspective?, resolveTarget?, write?, metadata?)`, plus DOM adapter types.
- `createScrollTriggerPort(source)` wraps a `ScrollSource` as a `TriggerPort`.
- `createGsapScrollSource(scrollTrigger, options)`, plus structural GSAP scroll source types. Core never imports GSAP.
- `FrameSource`, and the default graph builder.

## @motion5/core/plugins/transform and /plugins/fk

`transformPlugin` claims `x`, `y`, and `rotation` and passes them through.

`fkPlugin` is a compose-stage forward-kinematics plugin. It claims `length` and `rotation`, declares the `base` requirement, reads `inputs.base`, and produces `x`, `y`, and world-space `rotation`. The authored `rotation` is relative to the parent and the composed one is world-space, so the local value is replaced rather than published beside it. `composeWorld(parent, local)` is exported alongside it.

Registering both is the rig case: both claim `rotation`, so flat `rotation` is ambiguous. Author a bone as `fk: { length, rotation, requires: { base: "walk/pelvis" } }` and a root as `transform: { x, y, rotation }`. The parent's natural `x`, `y`, and `rotation` values arrive inside `inputs.base`; no `parentX`, `parentY`, or `parentRotation` projection is needed. See ADR-043 and ADR-044.

## @motion5/core/ports/fakes

Test doubles supported for tests and examples: `createFakeInterpolator`, `createFakeScheduler`, `createFakeTriggerPort`, `createFakeTrackRegistry`, and `ScheduledJob`.

## @motion5/core/internal

A private channel between core and React: `Patch`, `PatchListener`, and `PatchSource`.

## @motion5/react

`usePatch(source, nodeId)` and the re-exported `Patch`, `PatchListener`, and `PatchSource` types.

## Known gaps

1. Neither package is published; both remain private at `0.0.0`.
2. [Issue #176](https://github.com/chahyasantoso/motion5/issues/176) tracks transactional `replaceTrack` ordering after a failed recompile.
