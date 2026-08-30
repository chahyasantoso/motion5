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
/**
 * A leaf that never changes: `length: 62`, not two identical stops pretending to be an animation.
 *
 * Closed to a finite number, string, or boolean, and that is forced rather than chosen. If an
 * object were a legal static value then `{ stops: [...] }` would be one too, and the refusal that
 * retires it would have nothing to fire on. `null` and `undefined` are excluded because omitting
 * the key already spells absence, and a non-finite number is excluded for the same reason
 * `AuthoredStop.p` requires one.
 *
 * Not re-exported from the package entry. A consumer that needs to name a leaf names
 * `AuthoredProperty`, so this adds no entry to the export map or to the boundary allow-list.
 * See ADR-050.
 */
export type AuthoredStaticValue = number | string | boolean;
/**
 * One authored leaf: the stops themselves, or a static value.
 *
 * The `{ stops: [...] }` wrapper is retired rather than kept as an accepted alias, on the precedent
 * ADR-049 set: two accepted shapes are two validation paths and two documentation paths. It is
 * refused by name as `property-stops-wrapper`.
 *
 * A static value is not sugar for a two-stop hold. It never enters the interpolator, so it produces
 * no percent-map entry, no compiled property and no tween, which is the reason the syntax change is
 * worth making at all. It also has no slot for an `ease`, so "a static value with a meaningless
 * ease" is unrepresentable by shape rather than something a validator has to catch. See ADR-050.
 */
export type AuthoredProperty = readonly AuthoredStop[] | AuthoredStaticValue;
/**
 * The authored value of a dict-valued requirement slot: one source id per key the author names.
 *
 * A solver's goals are the case that forced it. A solver reaches for one goal per chain leaf, keyed
 * by that leaf's own member id rather than by position, because an index can never be wrong: it
 * silently means whatever the rig currently makes it mean, so inserting a bone or reordering two
 * tracks would keep loading and pull the wrong limb. A member id can be wrong, so it can be checked.
 * That is the argument that retired `reach` in favour of a named `root`, and object keys being unique
 * makes two entries for one key unrepresentable rather than merely diagnosed. See issue #195.
 *
 * Named for the shape rather than for goals, because the shape is not the goals section's own any
 * more. Any plugin may declare a slot that accepts one, through `PluginRequirement.dict`, and the
 * parser detects one by shape under any name. Keeping `AuthoredPluginGoals` would have made the one
 * plugin that reached the capability first the name of the capability. See ADR-057.
 *
 * One authored section, but one binding per entry. `readPluginBindings` expands each into its own
 * binding carrying the authored key as `memberKey`, because an entry deriving no edge would be
 * invisible to ordering and to pending classification, and because the publisher has to deliver each
 * entry separately.
 *
 * Not re-exported from the package entry, so this adds no entry to the export map or to the
 * boundary allow-list. Same finding ADR-049 recorded for `AuthoredPluginRequires`.
 */
export type AuthoredRequirementDict = Readonly<Record<string, string>>;
/**
 * The optional bindings section of a plugin-named group: one graph source id per requirement slot
 * the named plugin declares, or a dict of source ids for a slot that declares it accepts one.
 *
 * The slot name is the destination, so there is no author-facing projection map and no naming
 * convention such as `parentX` for the author to keep synchronized with the plugin. Omitting the
 * section, or a slot within it, derives no edge and leaves the unbound case to the plugin.
 * See ADR-044.
 *
 * The index signature stays open across both value shapes rather than pinning the dict to particular
 * slot names, on the precedent `MotionDefinition.trigger` sets below: the type is deliberately
 * structurally permissive and validation is the exact owner. A dict derives one binding per key at
 * whatever slot it was authored under, and whether that slot was allowed to carry one is
 * `PluginRequirement.dict`, read by `PluginRegistry` and refused by name as
 * `plugin-requirement-dict-unsupported`. So the looseness costs no silence: nothing is accepted and
 * then ignored, which is what rule 6 of ADR-033 forbids. Pinning it in the type instead would need a
 * per-plugin slot map inside the contract layer, which is the registry this layer must not hold.
 * See issue #195 and ADR-057.
 */
export type AuthoredPluginRequires = Readonly<Record<string, string | AuthoredRequirementDict>>;
/**
 * A plugin-named group: the properties that plugin claims, under `values`, plus its optional
 * `requires` section.
 *
 * Two named members, not an open record of a union. Both section names are reserved in
 * `contract/keyframe-shape`, so the contract layer can tell a section from a property without a
 * plugin registry, and the type can say what a group is instead of what it might contain. A group
 * that names neither section is not a group at all; it stays an ordinary property. Anything else
 * inside one is `keyframes-unknown-section`. See ADR-049.
 */
export interface AuthoredPluginGroup {
  readonly values?: Readonly<Record<string, AuthoredProperty>>;
  readonly requires?: AuthoredPluginRequires;
}
/**
 * One authored keyframe entry: a property, or a plugin-named group of properties.
 *
 * The group form names the plugin that owns its leaves, so `{ fk: { values: { length } } }` scopes
 * the leaf without the author inventing a disambiguated flat name. The group is flattened back to
 * its unprefixed leaves before compilation, so no interpolator, adapter, or renderer ever receives
 * a nested value.
 *
 * The flat form is unchanged, and stays legal for every key exactly one registered plugin claims.
 * For a key several plugins claim it is not sugar: the flat spelling is `plugin-ambiguous-key`, and
 * the group is the only way to name an owner. See ADR-041, ADR-043, and ADR-049.
 *
 * Group detection is unaffected by the leaf forms ADR-050 introduces: a bare array and a bare
 * scalar both fail the group predicate's `isObject` test before its section check ever runs.
 */
export type AuthoredKeyframe = AuthoredProperty | AuthoredPluginGroup;
/** One `keyframes.<plugin>.requires.<slot>` entry, as read from authored input. See ADR-044. */
export interface PluginRequiresBinding {
  readonly plugin: string;
  readonly slot: string;
  readonly source: string;
  /**
   * The key this binding was authored under inside a dict-valued slot, absent for a scalar slot.
   *
   * Data rather than a formatted slot name. The slot stays exactly as the author spelled it, so the
   * one thing that distinguishes two entries of one slot is a field, with one owner and no parser.
   * It reaches `EdgeRequirement`, participates in edge identity and ordering, and is what a solver's
   * goal is recovered from. See ADR-057.
   */
  readonly memberKey?: string;
  /**
   * `plugin.requires.slot`, or `plugin.requires.slot.memberKey` for a dict entry, relative to the
   * keyframes record. Diagnostics cite this, so a refusal names the path the author actually wrote.
   */
  readonly authoredPath: string;
}
export interface TrackDefinition {
  readonly id: string;
  readonly duration?: number;
  readonly keyframes?: Readonly<Record<string, AuthoredKeyframe>>;
  readonly observes?: readonly ObservationDefinition[];
}
/**
 * One generic `observes` entry: a graph edge the author writes by hand, declaring an output edge
 * and nothing else.
 *
 * One authored field, and deliberately only one.
 *
 * There is no `target`. It named a destination key that no consumer ever read, on either role.
 * See ADR-046.
 *
 * There is no `role`. Every edge this form derives is `role: "output"`, so writing the only legal
 * value would be a field accepted and then ignored.
 *
 * There is no `projection`. Renaming an upstream key existed to keep it from colliding inside a
 * flat input bag, and an output edge merges the source's patch whole rather than renaming anything.
 *
 * A dependency that feeds composition is bound under `keyframes.<plugin>.requires` and arrives
 * scoped to that plugin, which is now the only way a value enters composition. All three removed
 * fields are refused rather than accepted and ignored: `graph/ir.ts` reports
 * `observation-target-unsupported`, `observation-role-unsupported`, and
 * `observation-projection-unsupported`. See ADR-047.
 */
export interface ObservationDefinition {
  readonly source: string;
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
