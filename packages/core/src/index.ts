/** `@motion5/core` public entrypoint. Graph internals stay private. */

export {
  AUTHORED_SCHEMA_VERSION,
  DIAGNOSTIC_SEVERITIES,
  SUPPORTED_TRIGGER_TYPES,
} from "./contract/v5";
export type {
  AuthoredProperty,
  AuthoredStop,
  Diagnostic,
  DiagnosticSeverity,
  MotionDefinition,
  ProjectDefinition,
  TrackDefinition,
  TriggerType,
  TriggerSignal,
  TriggerDefinition,
  ManualTriggerDefinition,
  TimeTriggerDefinition,
  ScrollTriggerDefinition,
  PatchStatus,
  Patch,
  LivePatch,
  PatchBatch,
  PatchListener,
  Value,
} from "./contract/v5";
export type { SolverChainShape } from "./contract/solver-shape";
export type { PluginCapability, PluginCapabilities } from "./ports/plugin-capabilities";
export {
  resolveTriggerDefinition,
  validateTrackDefinition,
  validateMotionTrigger,
} from "./contract/validate-v5";
export { validateV5 } from "./validate-v5";
export type { ValidationResult } from "./validate-v5";
export type { TrackValidationResult } from "./contract/validate-v5";
export { parseGolden, serializeGolden } from "./contract/golden";
export type { GoldenFixture, GoldenValidationFixture } from "./contract/golden";
export { Engine } from "./engine";
export type { EngineOptions, ProjectHandle } from "./engine";
/** Handle base + failure family. `StaleHandleError` is a value for `instanceof`; `Handle` is the shape to write a generic over. */
export { StaleHandleError } from "./contract/handle";
export type { Handle } from "./contract/handle";
/** Track mutation + failure. `StaleTrackHandleError` is a value for `instanceof`/`ruleId`; `LiveValues` is the narrow live-write half, `RequireView` types `TrackHandle.requires`. */
export { StaleTrackHandleError } from "./contract/track-handle";
export type { LiveValues, RequireView, TrackHandle } from "./contract/track-handle";
/** Motion capability + refusal: error is a value to catch, handle is a type `ProjectHandle.motion` returns. */
export { StaleMotionHandleError } from "./contract/motion-handle";
export type { MotionHandle } from "./contract/motion-handle";
/** Structural authoring surface `ProjectHandle.edit` takes. Type only, declared in `contract/`; refusals are `TypeError`s, nothing more to export. */
export type { SchemaTransaction } from "./contract/schema-transaction";
/** Value authoring surface `ProjectHandle.values` takes. Type only, declared in `contract/`; refusals arrive as `TypeError`, deferred writes carry `value-batch-deferred`. */
export type { ValueTransaction } from "./contract/value-transaction";
/** Identified-table plugin registry + admission refusal. `EngineOptions.plugins` takes a `PluginCatalog`. */
export { PluginAdmissionError, PluginCatalog } from "./domain/plugin-catalog";
export type {
  DependencySpec,
  EvaluationContext,
  Outputs,
  PluginDefinition as PluginDefinition,
  ResolvedInput,
  ValueSpec,
} from "./contract/v5";
export { assertClock, createManualClock } from "./ports/clock";
/** Port contracts an adapter must name. Types only; the assertions above stay the runtime surface. */
export type { Clock, ClockTick } from "./ports/clock";
export { assertTriggerPort, createManualTriggerPort } from "./ports/trigger";
export type { TriggerPort } from "./ports/trigger";
export { acceptsExternalSignal, assertTriggerFactory } from "./ports/trigger-factory";
export type {
  TriggerBinding,
  ClockConsumer,
  CreatedTrigger,
  TriggerFactory,
  TriggerFactoryContext,
} from "./ports/trigger-factory";
/** Trigger drivers are opt-in at the composition root, so the factory is reachable through the exports map. */
export {
  createDefaultTriggerFactory,
  createTriggerFactory,
} from "./adapters/trigger-factory/default";
export type {
  ScrollSourceResolver,
  ScrollSourceResolverContext,
  TriggerFactoryOptions,
} from "./adapters/trigger-factory/default";
export type { ScrollSource } from "./adapters/scroll-trigger";
export { assertInterpolator } from "./ports/interpolator";
export type { InterpolationTimeline, Interpolator, PatchKeysResult } from "./ports/interpolator";
export { assertScheduler } from "./ports/scheduler";
export type { Cancel, Scheduler } from "./ports/scheduler";
/** Scheduler on an injected microtask host: no globals, `createFakeScheduler` stays a test double. */
export { createMicrotaskScheduler } from "./adapters/microtask-scheduler";
export type { MicrotaskSchedulerOptions, SchedulerHost } from "./adapters/microtask-scheduler";

/** Package version, independent of the authored schema version. */
export const CORE_VERSION = "0.0.0";
