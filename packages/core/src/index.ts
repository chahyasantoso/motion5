/**
 * `@motion5/core` public entrypoint.
 *
 * Graph internals remain private to the package.
 */

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
  MigrationDiagnostic,
  MotionDefinition,
  ObservationDefinition,
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
  PatchBatch,
  PatchListener,
} from "./contract/v5";
export { migrateV4ToV5 } from "./contract/migrate-v4-to-v5";
export type { MigrationResult } from "./contract/migrate-v4-to-v5";
export {
  resolveTriggerDefinition,
  validateV5,
  validateTrackDefinition,
  validateMotionTrigger,
} from "./contract/validate-v5";
export type { ValidationResult, TrackValidationResult } from "./contract/validate-v5";
export { parseGolden, serializeGolden } from "./contract/golden";
export type { GoldenFixture, GoldenValidationFixture } from "./contract/golden";
export { Engine } from "./engine";
export type { EngineOptions, ProjectHandle } from "./engine";
/**
 * The track mutation capability and the one failure it reports.
 *
 * `StaleTrackHandleError` is a runtime export rather than a type, because a caller cannot
 * `instanceof` a type it cannot name, and branching on its `ruleId` is the whole point of giving
 * the failure a name instead of a message to match. Named from its owner rather than re-exported
 * through `./engine`, so there is one declaration and one export path. See ADR-056.
 *
 * `AuthoredValues` is the parameter type of both live write members, so a caller that writes one
 * has to be able to name it. `LiveValues` stays beside it as the narrower mask type, which is what
 * a caller names when it only ever writes static values. See ADR-060.
 */
export { StaleTrackHandleError } from "./contract/track-handle";
export type { AuthoredValues, LiveValues, TrackHandle } from "./contract/track-handle";
/**
 * The refusal a live value write reports, exported on exactly the rule above: a caller cannot
 * `instanceof` a type it cannot name, and `ruleId` is what it branches on. `Track` is not exported
 * beside it and never has been, so the only thing crossing the entry from the domain layer is the
 * error a caller has to catch. See ADR-059.
 */
export { LiveValueKeyError } from "./domain/track";
export { PluginRegistry } from "./domain/plugins";
export type { PluginDefinition, ResolvedPlugins } from "./domain/plugins";
export { assertClock, createManualClock } from "./ports/clock";
/**
 * The port contracts a reusable adapter has to name in order to be written at all. Types only, so
 * the assertions above remain the runtime surface, and the declaration closure is unchanged because
 * every module named here is already reachable through it. Issue #158.
 */
export type { Clock, ClockTick } from "./ports/clock";
export { assertTriggerPort, createManualTriggerPort } from "./ports/trigger";
export type { TriggerPort } from "./ports/trigger";
export { assertTriggerFactory } from "./ports/trigger-factory";
export type {
  ClockBinding,
  ClockConsumer,
  CreatedTrigger,
  TriggerFactory,
  TriggerFactoryContext,
} from "./ports/trigger-factory";
/**
 * Trigger drivers are opt-in at the composition root, so the factory has to be reachable through
 * the package exports map, not only through a deep source path.
 */
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
export type { InterpolationTimeline, Interpolator } from "./ports/interpolator";
export { assertScheduler } from "./ports/scheduler";
export type { Cancel, Scheduler } from "./ports/scheduler";
/**
 * The Scheduler implementation. Microtask-paced through an injected host, so core reaches for no
 * global and `createFakeScheduler` stays a test double instead of the only thing that works. Named
 * here as well as in the adapters barrel, the same shape as the trigger factory above, so no new
 * subpath is declared. Issue #155 and ADR-038.
 */
export { createMicrotaskScheduler } from "./adapters/microtask-scheduler";
export type { MicrotaskSchedulerOptions, SchedulerHost } from "./adapters/microtask-scheduler";

/** Version of this package. Independent of the authored schema version. */
export const CORE_VERSION = "0.0.0";
