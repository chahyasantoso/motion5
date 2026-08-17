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
  PatchStatus,
  Patch,
  PatchBatch,
  PatchListener,
} from "./contract/v5";
export { migrateV4ToV5 } from "./contract/migrate-v4-to-v5";
export type { MigrationResult } from "./contract/migrate-v4-to-v5";
export { validateV5, validateTrackDefinition } from "./contract/validate-v5";
export type { ValidationResult, TrackValidationResult } from "./contract/validate-v5";
export { parseGolden, serializeGolden } from "./contract/golden";
export type { GoldenFixture, GoldenValidationFixture } from "./contract/golden";
export { Engine } from "./engine";
export type { ProjectHandle, TrackHandle } from "./engine";
export { PluginRegistry } from "./domain/plugins";
export type { PluginDefinition, ResolvedPlugins } from "./domain/plugins";
export { assertClock, createManualClock } from "./ports/clock";
export { assertTriggerPort, createManualTriggerPort } from "./ports/trigger";
export type { TriggerPort } from "./ports/trigger";
export { assertInterpolator } from "./ports/interpolator";
export type { InterpolationTimeline, Interpolator } from "./ports/interpolator";
export { assertScheduler } from "./ports/scheduler";

/** Version of this package. Independent of the authored schema version. */
export const CORE_VERSION = "0.0.0";
