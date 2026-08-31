# API reference

Grouped by entrypoint, because the entrypoint is the contract. `packages/core/package.json` declares these and nothing else; source paths in a workspace checkout are not covered by this document.

## Entrypoint tiers

A declared subpath is not automatically production API. The tier says who may import it, and for the test-support tier that answer is enforced by `scripts/boundary-scan.mjs` rather than by this table: no package under `packages/*` except core, and no app under `apps/*`, may name it. See ADR-036 and ADR-048.

| subpath                                             | tier           | may a production consumer import it |
| --------------------------------------------------- | -------------- | ----------------------------------- |
| `@motion5/core`                                     | public         | yes                                 |
| `@motion5/core/adapters`, `/adapters/browser-clock` | public adapter | yes                                 |
| `@motion5/core/plugins/fk`, `/plugins/transform`    | public plugin  | yes                                 |
| `@motion5/core/testing`                             | test support   | no, enforced by the boundary scan   |
| `@motion5/core/internal`                            | unadvertised   | no stability promise                |

## @motion5/core

**Engine and handles.** `Engine`, `StaleTrackHandleError`, and `LiveValueKeyError`, and the types `EngineOptions`, `ProjectHandle`, `TrackHandle`, `AuthoredValues`, and `LiveValues`.

`new Engine({ clock, interpolator, scheduler, plugins?, triggerFactory? })` validates all three ports. `engine.load(project)` returns a `ProjectHandle`:

- `mount(nodeId, instance?)` and `unmount(nodeId)` control membership.
- `get(nodeId)` returns the retained `Patch` or `undefined`.
- `subscribeNode(nodeId, listener)` returns an unsubscribe function. `subscribe` is the same call under an older name.
- `seek(nodeId, progress)` scrubs one leaf and returns a `PatchBatch`.
- `signal(motionId, signal)` controls a `manual` motion.
- `addMotion(definition)` returns `{ id }`; `destroyMotion(motionId)` removes it.
- `addTrack(track, { motionId? })` returns a `TrackHandle`; `track(nodeId)` returns the handle for an existing node.
- `tryTrack(nodeId)` and `tryMotion(motionId)` return `undefined` for an expected miss; `motion(motionId)` resolves a `MotionHandle`.
- A `MotionHandle` exposes `id`, `live`, `definition`, `trackIds`, `setTrigger`, `setStagger`, `addTrack`, `track`, `tryTrack`, `signal`, and `destroy`.
- `dependantsOf(nodeId)` lists observers for editor preflight.
- `adopt(track, owner, options?)` and `destroyAdopted(nodeId, owner)` are the superseded owner-based API.
- `dispose()` releases the project, motions, triggers, and compiled tracks.

A `TrackHandle` carries `id`, `live`, `definition`, `requires`, `remove()`, `replace(next)`, `addObserve(observation)`, `removeObserve(observation)`, `setRequire(plugin, slot, source, memberKey?)`, `removeRequire(plugin, slot, memberKey?)`, `setKeyframeGroup(plugin, group)`, `removeKeyframeGroup(plugin)`, `setGoal(plugin, memberId, source)`, `removeGoal(plugin, memberId)`, `overrideValues(next)`, and `setValues(next)`. A generic observation declares an output edge, which merges the source's contribution over the observer's composed patch. A dependency that feeds a track's own composition is bound under the plugin group's `requires` section, which is the only way a value enters composition.

The six authoring members above are the structural tier, and each returns `void` because the return type carries the tier: a structural edit replaced the graph, and the cheap pair returns the `PatchBatch` of its one invalidation. `setRequire` and `removeRequire` edit one binding of a plugin group this node already authors, with `memberKey` addressing one entry of a dict-valued slot. `setKeyframeGroup` writes a whole plugin binding, values and `requires` together, whether or not one was there, and `removeKeyframeGroup` drops the group and every edge its `requires` derived. `setGoal` and `removeGoal` edit one entry of a solver's goals slot by the member id it is authored under, and the binding pair refuses that slot by name. The refusals are `keyframe-group-unbound`, `keyframe-require-shape`, `keyframe-goal-slot-reserved`, `keyframe-entry-shape`, and `keyframe-group-shape`, every one of them a `TypeError` thrown before anything is written. Nothing else about a candidate is asked here: the plugin registry answers for keys and slots and graph validation answers for edges, both at the commit, and a refused candidate is rolled back with the handle unchanged. See ADR-062 and ADR-063.

`overrideValues` and `setValues` are the cheap pair, and they take an `AuthoredValues`: one authored leaf per key, static or animated, which is `LiveValues` widened per key to `AuthoredProperty`. Both return the `PatchBatch` of the single invalidation they cause, exactly as `seek()` does. Neither stages a Track or rebuilds the graph, which is what separates them from `replace(next)`. The difference between the two is the retained definition: `setValues` rewrites it, so `handle.definition` and the live composition cannot disagree, and `overrideValues` deliberately leaves it alone, because it is a write you expect to take back. A write is replaced wholesale rather than accumulated, so an empty record is the clear, and a real `replace()` drops it by construction. A static key is masked over the interpolated state and an animated one has its tweens replaced on the live timeline, so a caller reads one API for both. `LiveValueKeyError` is the refusal, with `ruleId` of `live-value-key`, and its `reason` is `unknown`, `kind`, or `prepared`. See ADR-059 and ADR-060.

`LiveValues` stays declared beside `AuthoredValues` as the narrower type: one static authored value per key, which is the type of the mask itself. Name it when your call site only ever writes static values; the mask is structurally unable to carry stops, which is what keeps an animated key from being frozen at a value you passed.

`live` is a boolean that never throws. Every other member throws `StaleTrackHandleError` once the token the handle captured is no longer current, so one condition has one failure contract across the whole surface. That error is a runtime export rather than a type, because a caller cannot `instanceof` a type it cannot name: it extends `TypeError`, keeps the message the `track` getter already threw, and carries a stable `ruleId` of `stale-track-handle` beside the `nodeId` it refused. Both it and `TrackHandle` are declared once, in the contract layer, and named from there by the runtime and by the package entry. `LiveValueKeyError` is public on that same rule, and it is declared in the domain layer that owns the refusal while `Track` itself stays private. See ADR-056 and ADR-059.

**Schema and validation.** `AUTHORED_SCHEMA_VERSION`, `SUPPORTED_TRIGGER_TYPES`, `DIAGNOSTIC_SEVERITIES`, `validateV5`, `validateTrackDefinition`, `validateMotionTrigger`, `resolveTriggerDefinition`, `migrateV4ToV5`, `parseGolden`, and `serializeGolden`.

**Types.** `ProjectDefinition`, `MotionDefinition`, `TrackDefinition`, `ObservationDefinition`, `AuthoredProperty`, `AuthoredStop`, `TriggerDefinition` and its three members, `TriggerType`, `TriggerSignal`, `Patch`, `PatchBatch`, `PatchStatus`, `PatchListener`, `Diagnostic`, `DiagnosticSeverity`, `MigrationDiagnostic`, `MigrationResult`, `ValidationResult`, `TrackValidationResult`, `GoldenFixture`, and `GoldenValidationFixture`.

An `ObservationDefinition` carries `source` and nothing else. There is no `target`, no `role`, and no `projection`, and an authored one of each is rejected with `observation-target-unsupported`, `observation-role-unsupported`, or `observation-projection-unsupported`. `InputProjection` is gone with the primitive it described. See ADR-046 and ADR-047.

**Plugins.** `PluginRegistry`, and the types `PluginDefinition` and `ResolvedPlugins`.

A `PluginDefinition` may declare `requirements`, a record of optional input slots owned by that plugin. Its `compose` receives authored/interpolated values, the track's progress, and that plugin's scoped inputs. `ResolvedPlugins.requirements` reports the bindings resolved for a track.

**Ports.** `createManualClock`, `createMicrotaskScheduler`, `createManualTriggerPort`, `createDefaultTriggerFactory`, `createTriggerFactory`, and the assertions `assertClock`, `assertInterpolator`, `assertScheduler`, `assertTriggerPort`, and `assertTriggerFactory`. Port types include `Clock`, `ClockTick`, `Scheduler`, `Cancel`, `SchedulerHost`, `MicrotaskSchedulerOptions`, `TriggerPort`, `Interpolator`, `InterpolationTimeline`, `ClockBinding`, `ClockConsumer`, `CreatedTrigger`, `TriggerFactory`, `TriggerFactoryContext`, `TriggerFactoryOptions`, `ScrollSource`, `ScrollSourceResolver`, and `ScrollSourceResolverContext`.

`InterpolationTimeline` has one optional member, `patchKeys(overlay, rebase?)`. An implementation that keeps a per-key child may declare it and replace those children in place; one that cannot answers by not declaring it, and the runtime recompiles instead and publishes the same values at the same progress. `false` from it means escalate and nothing else: it is never a report about the caller's input. `assertInterpolator` does not check for it, because the capability is not part of what makes something an `Interpolator`. See ADR-060.

`createMicrotaskScheduler(options?)` is the shipped Scheduler. It runs queued jobs in one pass on the injected host, honors cancellation, and reports failures through `onError` without stopping later jobs in the same pass. See ADR-038.

**Version.** `CORE_VERSION`, independent of the authored schema version.

## @motion5/core/adapters

Optional implementations for the composition root.

- `createBrowserClock(frameSource)` returns a `Clock` with `dispose()`.
- `createMicrotaskScheduler(options?)`, plus `SchedulerHost` and `MicrotaskSchedulerOptions`.
- `createGsapInterpolator(gsap)` and `createGsapOneTweenInterpolator(gsap)`, plus structural GSAP types. The timeline-backed one declares `patchKeys`; the one-tween one deliberately does not, because a single tween carrying a `keyframes` map has no per-key child to replace.
- `createDomPatchAdapter(stage, perspective?, resolveTarget?, write?, metadata?)`, plus DOM adapter types.
- `createScrollTriggerPort(source)` wraps a `ScrollSource` as a `TriggerPort`.
- `createGsapScrollSource(scrollTrigger, options)`, plus structural GSAP scroll source types. Core never imports GSAP.
- `FrameSource`, and the default graph builder.

## @motion5/core/plugins/transform and /plugins/fk

`transformPlugin` claims `x`, `y`, and `rotation` and passes them through.

`fkPlugin` is a compose-stage forward-kinematics plugin. It claims `length` and `rotation`, declares the `base` requirement, reads `inputs.base`, and produces `x`, `y`, and world-space `rotation`. The authored `rotation` is relative to the parent and the composed one is world-space, so the local value is replaced rather than published beside it. `composeWorld(parent, local)` is exported alongside it.

Registering both is the rig case: both claim `rotation`, so flat `rotation` is ambiguous. Author a bone as `fk: { length, rotation, requires: { base: "walk/pelvis" } }` and a root as `transform: { x, y, rotation }`. The parent's natural `x`, `y`, and `rotation` values arrive inside `inputs.base`; no `parentX`, `parentY`, or `parentRotation` is needed, and there is no projection primitive left with which to invent one. See ADR-043, ADR-044, and ADR-047.

## @motion5/core/testing

Test support, and the only tier a production consumer may not import: `createFakeInterpolator`, `createFakeScheduler`, `createFakeTriggerPort`, `createFakeTrackRegistry`, and `ScheduledJob`.

These are the implementations the core suite runs the port contract suite against, per TR-P-05, so they ship inside the package rather than beside it. `createFakeInterpolator` declares no `patchKeys`, deliberately: it is the double that proves the capability is genuinely optional and that a declining backend is observably identical to a patching one. The restriction is mechanical, not advisory: `scripts/boundary-scan.mjs` scans every workspace declared in the root `package.json`, `apps/*` included, and reports a `testing entrypoint import` violation for any consumer that names this path or reaches `packages/core/src/testing` directly. This path replaces `@motion5/core/ports/fakes`, which is no longer declared. See ADR-048.

## @motion5/core/internal

A private channel between core and React: `Patch`, `PatchListener`, and `PatchSource`.

## @motion5/react

`usePatch(source, nodeId)` and the re-exported `Patch`, `PatchListener`, and `PatchSource` types.

## Known gaps

1. Neither package is published; both remain private at `0.0.0`.
2. [Issue #176](https://github.com/chahyasantoso/motion5/issues/176) tracks transactional `replaceTrack` ordering after a failed recompile.
