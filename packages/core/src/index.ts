/**
 * `@motion5/core` public entrypoint.
 *
 * Phase 0 contract surface. Runtime internals are never exported from here.
 */

export {
  AUTHORED_SCHEMA_VERSION,
  DIAGNOSTIC_SEVERITIES,
  SUPPORTED_TRIGGER_TYPES,
} from "./contract/v5";
export type {
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

/** Version of this package. Independent of the authored schema version. */
export const CORE_VERSION = "0.0.0";
