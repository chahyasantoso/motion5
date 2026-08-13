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

export type PatchStatus = "ready" | "blocked" | "error";

export interface Patch {
  readonly nodeId: string;
  readonly revision: number;
  readonly values: Readonly<Record<string, unknown>>;
  readonly sourceProgress: number;
  readonly sourceRevisions: Readonly<Record<string, number>>;
  readonly status: PatchStatus;
  readonly diagnostics: readonly Diagnostic[];
}

export interface PatchBatch {
  readonly tick: number;
  readonly seeds: readonly string[];
  readonly patches: readonly Patch[];
  readonly diagnostics: readonly Diagnostic[];
}

export type PatchListener = (patch: Patch) => void;

export interface AuthoredStop {
  readonly p: number;
  readonly v: unknown;
  readonly ease?: unknown;
}

export interface AuthoredProperty {
  readonly stops: readonly AuthoredStop[];
}

/** Input projection: pick preserves selected source keys; map renames source keys to output keys. */
export interface InputProjection {
  readonly pick?: readonly string[];
  readonly map?: Readonly<Record<string, string>>;
}

export interface TrackDefinition {
  readonly id: string;
  readonly duration?: number;
  readonly use?: string;
  readonly keyframes?: Readonly<Record<string, AuthoredProperty>>;
  readonly observes?: readonly ObservationDefinition[];
}

export interface ObservationDefinition {
  readonly source: string;
  readonly role?: "input" | "output";
  /** Transitional label; projected input keys come from projection. */
  readonly target?: string;
  readonly projection?: InputProjection;
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
