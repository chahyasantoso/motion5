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
} from "./contract/v5";
export { migrateV4ToV5 } from "./contract/migrate-v4-to-v5";
export type { MigrationResult } from "./contract/migrate-v4-to-v5";
export { validateV5 } from "./contract/validate-v5";
export type { ValidationResult } from "./contract/validate-v5";
export { parseGolden, serializeGolden } from "./contract/golden";
export type { GoldenFixture, GoldenValidationFixture } from "./contract/golden";
export { Engine } from "./engine";
export { PluginRegistry } from "./domain/plugins";
export type { PluginDefinition, ResolvedPlugins } from "./domain/plugins";
export { assertClock, createManualClock } from "./ports/clock";
export { assertInterpolator } from "./ports/interpolator";
export type { InterpolationTimeline, Interpolator } from "./ports/interpolator";
export { assertScheduler } from "./ports/scheduler";

/** Version of this package. Independent of the authored schema version. */
export const CORE_VERSION = "0.0.0";
