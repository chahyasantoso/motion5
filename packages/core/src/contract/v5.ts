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
 * The optional bindings section of a plugin-named group: one graph source id per requirement slot
 * the named plugin declares.
 *
 * The slot name is the destination, so there is no author-facing projection map and no naming
 * convention such as `parentX` for the author to keep synchronized with the plugin. Omitting the
 * section, or a slot within it, derives no edge and leaves the unbound case to the plugin.
 * See ADR-044.
 */
export type AuthoredPluginRequires = Readonly<Record<string, string>>;
/** One member of a plugin-named group: an authored property, or the bindings section. */
export type AuthoredPluginMember = AuthoredProperty | AuthoredPluginRequires;
/**
 * A plugin-named group: the properties that plugin claims, plus its optional `requires` section.
 *
 * The section is reserved by name rather than typed as a distinct key, because the contract layer
 * has no plugin registry and a group's property names are the plugin's to choose.
 * `contract/keyframe-shape` owns telling the two apart.
 */
export type AuthoredPluginGroup = Readonly<Record<string, AuthoredPluginMember>>;
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
export type AuthoredKeyframe = AuthoredProperty | AuthoredPluginGroup;
/** One `keyframes.<plugin>.requires.<slot>` entry, as read from authored input. See ADR-044. */
export interface PluginRequiresBinding {
  readonly plugin: string;
  readonly slot: string;
  readonly source: string;
  /** `plugin.requires.slot`, relative to the keyframes record. Diagnostics cite this. */
  readonly authoredPath: string;
}
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
/**
 * One generic `observes` entry: a graph edge the author writes by hand.
 *
 * There is deliberately no `target`. An input edge delivers its source's values under the source's
 * own names, or under the names an `InputProjection` maps them to, and a dependency that belongs to
 * a plugin is bound under `keyframes.<plugin>.requires` and arrives scoped to that plugin instead.
 * A target name had no consumer on either role, so it is refused rather than accepted and ignored:
 * `graph/ir.ts` reports `observation-target-unsupported`. See ADR-046.
 */
export interface ObservationDefinition {
  readonly source: string;
  readonly role?: "input" | "output";
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
