export const AUTHORED_SCHEMA_VERSION = 5 as const;
export const SUPPORTED_TRIGGER_TYPES = ["scroll", "time", "manual"] as const;
export const DIAGNOSTIC_SEVERITIES = ["error", "warning"] as const;

export type TriggerType = (typeof SUPPORTED_TRIGGER_TYPES)[number];
export type DiagnosticSeverity = (typeof DIAGNOSTIC_SEVERITIES)[number];

export interface Diagnostic {
  readonly ruleId: string;
  readonly path: string;
  readonly message: string;
  readonly severity: DiagnosticSeverity;
  readonly ids?: readonly string[];
}

export interface TrackDefinition {
  readonly id: string;
  readonly duration?: number;
  readonly use?: string;
  readonly keyframes?: Record<string, unknown>;
  readonly observes?: readonly ObservationDefinition[];
}

export interface ObservationDefinition {
  readonly source: string;
  readonly role?: "input" | "output";
  readonly target?: string;
}

export interface MotionDefinition {
  readonly id: string;
  readonly trigger: { readonly type: TriggerType; readonly [key: string]: unknown };
  readonly tracks: readonly TrackDefinition[];
  readonly stagger?: number;
}

export interface ProjectDefinition {
  readonly schemaVersion: 5;
  readonly projectId?: string;
  readonly perspective?: number;
  readonly templates?: readonly Record<string, unknown>[];
  readonly motions: readonly MotionDefinition[];
  readonly freeTracks?: readonly TrackDefinition[];
}

export interface MigrationDiagnostic extends Diagnostic {
  readonly ruleId: "schema-v4-migration";
}
