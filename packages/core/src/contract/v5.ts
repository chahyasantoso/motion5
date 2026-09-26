import type { RuleId } from "./rule-id";

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

/**
 * One refusal, named by the rule it refuses under.
 *
 * `ruleId` is `RuleId` and not `string`, so this set is closed on both sides: nothing can mint a
 * rule the enumeration does not carry, and a reader can switch on one. Adding a rule breaks the
 * build in `contract/rule-id.ts`, at the one place the rule is named, rather than being inherited
 * silently by every consumer that pattern-matches a string. That is the acceptance criterion issue
 * #449 asks for, and it is a public surface change: `Diagnostic` is exported from the package
 * entry, so a consumer constructing one with a rule id of its own invention stops compiling.
 *
 * It is one interface rather than a union. The three variants were paid for with a public surface
 * and bought nothing on the read side: `runtime/patch-registry.ts` compares rule ids for identity and
 * `runtime/refusal.ts` renders them generically, so no production reader pattern-matches one.
 * Enforcement was never on the read side either; it is at the call site, as the argument list the
 * rule owns, which `contract/rule.ts` now derives from one record. With no union left to narrow there
 * is nothing for an assertion to narrow into. See ADR-097.
 *
 * `ids` is required, always present, always frozen, and empty for a rule that names none. It was
 * optional while three raw producers omitted the member, and those three are converted in the same
 * slice that requires it: `runtime/project-runtime.ts`'s `#teardown`, the private path-first producer
 * in `contract/migrate-v4-to-v5.ts`, and `runtime/report.ts`'s `frozenDiagnostic` all forward to the
 * one constructor now rather than hand-building an object that chooses between a payload and no
 * member at all. So a reader spelling `ids` and a reader spelling `ids ?? []` are one reader rather
 * than two, and `runtime/patch-registry.ts` comparing two payloads no longer has an absent member and
 * an empty one to tell apart for the same rule.
 *
 * Whether a rule may name ids is still not this field's claim, and requiring the member does not make
 * it one. `ids: []` is what a rule that owns none carries; what refuses a payload a rule does not own
 * is `OwnedIds` at the call site, derived from the one record in `contract/rule.ts`. This closes the
 * shape, and the ownership stays enforced one layer up, where the rule is named. See ADR-097.
 */
export interface Diagnostic extends DiagnosticShape {
  readonly ruleId: RuleId;
  readonly ids: readonly string[];
}

/**
 * One diagnostic pinned to one rule.
 *
 * Naming a rule at a declaration, rather than discriminating one at a read. It was the one thing the
 * three variants were still read for, and it now replaces all three: they are deleted, and
 * `MigrationDiagnostic` below is one derived alias in place of what used to be a variant plus a
 * narrowing interface.
 *
 * It is also what the one constructor in `./diagnostics` returns, which is what retired the widening
 * that used to sit beside it. A producer handed a literal rule id is answered with a diagnostic
 * pinned to that rule, so the v4 reader derives `MigrationDiagnostic` from the call rather than
 * asserting it afterwards, and no expression in this tree casts an object into this shape any more.
 */
export interface DiagnosticOf<Rule extends RuleId> extends Diagnostic {
  readonly ruleId: Rule;
}

/** What every diagnostic carries, whichever rule it names. */
interface DiagnosticShape {
  readonly path: string;
  readonly message: string;
  readonly severity: DiagnosticSeverity;
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
 *
 * Read off the union rather than spelled beside it, so the four statuses have one owner: a variant
 * added to `Patch` widens this, and a status named here that no variant declares stops being
 * expressible. It was two lists for one question while the payload was flat and the status was one
 * member among seven; it is one list now that the status is the discriminant. See ADR-098.
 */
export type PatchStatus = Patch["status"];

/** What every patch carries, whichever status it names: which node published it, and when. */
interface PatchIdentity {
  readonly nodeId: string;
  readonly revision: number;
}

/**
 * A node that composed, and the one variant that owns a pose.
 *
 * The three payload members are measurements of one successful composition: the values it produced,
 * the progress it was evaluated at, and the revision of every source it read. A status that did not
 * compose owns none of them, which is what the three variants below say by declaring none. See
 * ADR-098.
 */
export interface ReadyPatch extends PatchIdentity {
  readonly status: "ready";
  readonly values: Readonly<Record<string, unknown>>;
  readonly sourceProgress: number;
  readonly sourceRevisions: Readonly<Record<string, number>>;
  readonly diagnostics: readonly Diagnostic[];
}

/**
 * A node an upstream state stopped, carrying the refusal and no pose.
 *
 * It declared all three payload members until ADR-098, and `PatchRegistry.publish` filled them by
 * carrying the previous patch's forward, so a blocked patch said `blocked` while holding values no
 * blocked evaluation produced, and a subscriber reading `values` on one was reading an earlier
 * publication's answer. The pose is not lost: it is the registry's retained `ready` patch, answered
 * by `lastReady(nodeId)`, which is what slice 1 of issue #450 landed.
 */
export interface BlockedPatch extends PatchIdentity {
  readonly status: "blocked";
  readonly diagnostics: readonly Diagnostic[];
}

/**
 * A node whose own composition threw, carrying the failure and no pose.
 *
 * Written rather than inherited from `BlockedPatch`. The two are the same shape today and they are
 * two answers: a reader narrowing on `status` names the one it means, and a member either of them
 * later earns lands on the variant that earned it rather than on both.
 */
export interface ErrorPatch extends PatchIdentity {
  readonly status: "error";
  readonly diagnostics: readonly Diagnostic[];
}

/**
 * A node evicted from the graph, which will never publish again.
 *
 * Identity and status and nothing else, including no diagnostics: a node that cannot publish again
 * has nothing to refuse under, and `#notifyTerminal` built all four of those members empty, which is
 * a payload a reader spends a narrowing on to find `{}`, `0`, `{}` and `[]`.
 */
export interface DestroyedPatch extends PatchIdentity {
  readonly status: "destroyed";
}

/**
 * One patch on the observation wire, discriminated by the status that decides what it carries.
 *
 * The flat interface this replaces declared every payload member as required at every status, so the
 * type could not say that only a composition produces a pose, and every consumer either narrowed by
 * hand or read a member its status does not own. Issue #450 calls this a type refinement with every
 * existing test staying green; it is not. Deleting the three members from the non-ready variants
 * deletes the carry-forward in `PatchRegistry.publish` that filled them, and that behaviour moved to
 * `PatchRegistry.lastReady` rather than being dropped. See ADR-098.
 */
export type Patch = ReadyPatch | BlockedPatch | ErrorPatch | DestroyedPatch;

/**
 * A patch a node that still exists published: every variant but the terminal one.
 *
 * What the registry's maps and its open batch actually hold. `evict` deletes a node's entry before
 * it delivers the terminal patch, so nothing `PatchRegistry.get` can answer is `destroyed`, and
 * `registry-phase.ts`'s `retain` is reached only from `publish`, which cannot mint one. Declared
 * once rather than re-narrowed at each of those readers, because it is one fact about who produces a
 * destroyed patch.
 */
export type LivePatch = ReadyPatch | BlockedPatch | ErrorPatch;
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
 * plugin registry, and the type can say what a group is instead of what it might contain. An entry
 * that names neither section is not a group, and since ADR-121 it is not a property either: it is
 * refused as `keyframes-ungrouped-key`. Anything else inside one is `keyframes-unknown-section`.
 * See ADR-049 and ADR-121.
 */
export interface AuthoredPluginGroup {
  readonly values?: Readonly<Record<string, AuthoredProperty>>;
  readonly requires?: AuthoredPluginRequires;
}
/**
 * One authored keyframe entry, which is always a plugin-named group.
 *
 * The group names the plugin that owns its leaves, so `{ fk: { values: { length } } }` scopes the
 * leaf to one owner without the author inventing a disambiguated name. The group is flattened back
 * to its unprefixed leaves before compilation, so no interpolator, adapter, or renderer ever
 * receives a nested value.
 *
 * There is no flat form. It predated plugins, and once two plugins could claim one name it was
 * legal only for the keys exactly one registered plugin claimed, so whether a document loaded
 * depended on which plugins the host registered and `plugin-ambiguous-key` existed only to refuse
 * it. Every property is grouped now, which is the one spelling that names its owner. See ADR-041,
 * ADR-043, ADR-049 and ADR-121.
 */
export type AuthoredKeyframe = AuthoredPluginGroup;
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
/**
 * The authored project.
 *
 * There is no `templates`. It promised reusable keyframe bundles, nothing ever read one, and the
 * runtime's project snapshot carried it through every graph rebuild untouched, so it is removed and
 * then refused rather than left declared: `validate-v5.ts` reports `project-templates-unsupported`.
 * A documented feature that does not exist is the one documentation failure ADR-053 calls worse
 * than none.
 */
export interface ProjectDefinition {
  readonly schemaVersion: 5;
  readonly projectId?: string;
  readonly perspective?: number;
  readonly motions: readonly MotionDefinition[];
  readonly freeTracks?: readonly TrackDefinition[];
}
/**
 * A migration diagnostic, pinned to the one rule the v4 reader refuses under.
 *
 * The literal narrows `Diagnostic.ruleId` rather than sitting beside it, so `schema-v4-migration`
 * is provably a member of `RuleId`: were the enumeration to stop carrying it, this declaration is
 * the build failure rather than a string nobody checks.
 *
 * Each of the four refusals the v4 reader can report names a path and a message and no ids, which is
 * measured rather than chosen: its constructor used to accept an `ids` that nothing passed. That fact
 * is stated once now, where the rule is defined, as `schema-v4-migration`'s own entry in
 * `contract/rule.ts`, rather than by extending a variant named after a group. See ADR-097.
 */
export type MigrationDiagnostic = DiagnosticOf<"schema-v4-migration">;
