export const AUTHORED_SCHEMA_VERSION = 5 as const;
export const SUPPORTED_TRIGGER_TYPES = ["scroll", "time", "manual"] as const;
export const DIAGNOSTIC_SEVERITIES = ["error", "warning"] as const;

export type TriggerType = (typeof SUPPORTED_TRIGGER_TYPES)[number];
export type DiagnosticSeverity = (typeof DIAGNOSTIC_SEVERITIES)[number];

export interface ManualTriggerDefinition {
  readonly type: "manual";
}
export interface TimeTriggerDefinition {
  readonly type: "time";
  readonly duration: number;
  readonly autoplay?: true;
  /**
   * Passes after the initial one, so a finite loop runs `repeat + 1` cycles and the initial pass is
   * never one of the repeats. `-1` is infinite; any other negative value or non-integer is
   * rejected. See ADR-040.
   */
  readonly repeat?: number;
  /**
   * Reverse every odd cycle. Requires a `repeat` that actually repeats, because a yoyo with
   * nothing to reverse would be a field accepted and then ignored. Ping-pong is this with
   * `repeat: -1` rather than a third field.
   */
  readonly yoyo?: boolean;
}
export interface ScrollTriggerDefinition {
  readonly type: "scroll";
  readonly source?: string;
}
export type TriggerDefinition =
  | ManualTriggerDefinition
  | ScrollTriggerDefinition
  | TimeTriggerDefinition;

export interface TriggerSignal {
  readonly type: TriggerType;
  readonly progress?: number;
}

export interface Diagnostic {
  readonly ruleId: string;
  readonly path: string;
  readonly message: string;
  readonly severity: DiagnosticSeverity;
  readonly ids?: readonly string[];
}

/**
 * `"ready"`, `"blocked"`, and `"error"` all describe a node that still exists and may publish
 * again. `"destroyed"` is terminal: the node has been evicted from the graph and will never
 * publish again.
 *
 * The terminal status exists because destruction previously had no representation on the
 * observation wire at all. Eviction dropped the retained patch silently, so the last `"ready"`
 * patch a subscriber had received stayed authoritative forever and consumers kept rendering a
 * node the graph had already destroyed.
 */
export type PatchStatus = "ready" | "blocked" | "error" | "destroyed";

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
/**
 * One authored keyframe entry: a property, or a plugin-named group of properties.
 *
 * The group form names the plugin that owns its leaves, so `{ fk: { length } }` scopes the leaf
 * without the author inventing a disambiguated flat name. The group is flattened back to its
 * unprefixed leaves before compilation, so no interpolator, adapter, or renderer ever receives a
 * nested value.
 *
 * The flat form is unchanged, and stays legal for every key exactly one registered plugin claims.
 * For a key several plugins claim it is not sugar: the flat spelling is `plugin-ambiguous-key`, and
 * the group is the only way to name an owner. See ADR-041 and ADR-043.
 */
export type AuthoredKeyframe = AuthoredProperty | Readonly<Record<string, AuthoredProperty>>;
export interface InputProjection {
  readonly pick?: readonly string[];
  readonly map?: Readonly<Record<string, string>>;
}
export interface TrackDefinition {
  readonly id: string;
  readonly duration?: number;
  readonly keyframes?: Readonly<Record<string, AuthoredKeyframe>>;
  readonly observes?: readonly ObservationDefinition[];
}
export interface ObservationDefinition {
  readonly source: string;
  readonly role?: "input" | "output";
  readonly target?: string;
  readonly projection?: InputProjection;
}
export interface MotionDefinition {
  readonly id: string;
  readonly trigger:
    | TriggerDefinition
    | { readonly type: TriggerType; readonly [key: string]: unknown };
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
