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

/** A cell or record field value. The boundary rejects non-finite numbers. */
export type Scalar = number | string | boolean;

/** One evaluated table row. `id` identifies the row; `cells.id` is ordinary application data. */
export interface Row {
  readonly id: string;
  readonly cells: Readonly<Record<string, Scalar>>;
}

/** Evaluated rows. Cell evaluation preserves authored order; a plugin may reorder deliberately. */
export type Table = readonly Row[];

/** One evaluated flat record. A record has no row id. */
export type FlatRecord = Readonly<Record<string, Scalar>>;

/** A table when it is an array, a record when it is a plain object. */
export type Value = Table | FlatRecord;

/** A node's published named outputs. The main output is `values`. */
export type Outputs = Readonly<Record<string, Value>>;

/**
 * A node that composed, and the one variant that owns a pose.
 *
 * The three payload members are measurements of one successful composition: the named outputs it
 * produced, the progress it was evaluated at, and the revision of every source it read. A status
 * that did not compose owns none of them, which is what the three variants below say by declaring
 * none. See ADR-098.
 *
 * `outputs` rather than `values`, because the field holds the named-outputs map and
 * `patch.values.values` would name the same thing twice. The main output is `outputs.values`.
 */
export interface ReadyPatch extends PatchIdentity {
  readonly status: "ready";
  readonly outputs: Outputs;
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
 * One authored cell stop: a scalar `v` at a position `p`, with an optional per-interval ease.
 *
 * The target replacement for `AuthoredStop`, whose `v: unknown` was the shape everything else then
 * had to re-validate. A cell is scalar by contract, so the stop says so and `v5-parse.ts` refuses a
 * non-scalar before any evaluator sees one.
 */
export interface Stop {
  readonly p: number;
  readonly v: Scalar;
  readonly ease?: string;
}
/** One authored cell or record field: a scalar, or a stop sequence. A bare array is always stops. */
export type AuthoredCell = Scalar | readonly Stop[];
/** One authored table row. `id` identifies the row; `cells` holds its columns. */
export interface AuthoredRow {
  readonly id: string;
  readonly cells: Readonly<Record<string, AuthoredCell>>;
}
/** One authored flat record. */
export type AuthoredRecord = Readonly<Record<string, AuthoredCell>>;
/** Authored `values`, whose top-level shape selects a table or a record. */
export type AuthoredValues = readonly AuthoredRow[] | AuthoredRecord;
/**
 * One cell or field an authored edit addresses.
 *
 * `row` present addresses one table cell and absent addresses one record field, so the address
 * carries no mode flag a caller could disagree with the track about. The planner compares that
 * distinction against the track's committed shape and refuses a mismatch by name.
 */
export interface CellAddress {
  readonly row?: string;
  readonly field: string;
}
/** One source id, or one source id per member key for a map slot. */
export type SourceBinding = string | Readonly<Record<string, string>>;
/** How a plugin slot receives a bound node's outputs. */
export type BindingMode = "single" | "map";
/** The declared contract of one scalar field. */
export interface FieldSpec {
  readonly kind: "number" | "string" | "boolean";
  readonly optional?: true;
  readonly enum?: readonly string[];
  readonly min?: number;
  readonly max?: number;
  /** Local authored input only: forbids a stop sequence, including a single stop. */
  readonly static?: true;
}
/** The row half of a table spec. Columns describe `row.cells`, never the envelope. */
export interface TableSchema {
  readonly row: {
    readonly fields: Readonly<Record<string, FieldSpec>>;
    readonly additionalProperties?: boolean;
  };
  readonly minRows?: number;
  readonly maxRows?: number;
}
/** One flat vocabulary for local input, slot-declared outputs and plugin outputs. */
export type ValueSpec =
  | { readonly kind: "table"; readonly schema: TableSchema; readonly optional?: true }
  | {
      readonly kind: "record";
      readonly fields: Readonly<Record<string, FieldSpec>>;
      readonly additionalProperties?: boolean;
      readonly optional?: true;
    };
/** What a plugin slot reads from the bound node and the shape it needs for each output. */
export interface DependencySpec {
  readonly outputs: Readonly<Record<string, ValueSpec>>;
  readonly optional?: true;
  readonly binding?: BindingMode;
}
/** What a track authors: local values, dependency slots and, for a source, a declared schema. */
export interface TrackInput {
  readonly values?: AuthoredValues;
  readonly requires?: Readonly<Record<string, SourceBinding>>;
  /** No-plugin sources only. A plugin track already owns its input contract. */
  readonly schema?: ValueSpec;
}
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
 * One authored dataflow node: an optional plugin, its authored input, and a duration.
 *
 * There is no `keyframes` and no `observes`. Identified tables and records under `input.values`
 * replace grouped keyframes as the authored value form, and a dependency enters composition as a
 * declared `input.requires` slot rather than as a hand-written edge. Both retired spellings are
 * refused by name as `track-legacy-field`, so a document that still carries one fails to load
 * rather than loading with the member accepted and ignored. See ADR-046, ADR-047 and ADR-121.
 */
export interface TrackDefinition {
  readonly id: string;
  readonly plugin?: string;
  readonly input?: TrackInput;
  readonly duration?: number;
}
export interface MotionDefinition {
  readonly id: string;
  readonly trigger:
    | TriggerDefinition
    | { readonly type: TriggerType; readonly [key: string]: unknown };
  readonly tracks: readonly TrackDefinition[];
  readonly stagger?: number;
}
/** One evaluation's identity and progress, handed to a plugin with its resolved input. */
export interface EvaluationContext {
  readonly nodeId: string;
  readonly progress: number;
}
/**
 * A single slot's bound outputs, or a map slot's member key to that member's outputs.
 *
 * This is the resolved shape, not a declaration: a slot's `DependencySpec` says which outputs it
 * reads and what each must satisfy.
 */
export type ResolvedRequires = Readonly<
  Record<string, Outputs | Readonly<Record<string, Outputs>>>
>;
/** The evaluated input one plugin receives: local values plus every bound slot. */
export interface ResolvedInput<Values extends Value = Value> {
  readonly values: Values;
  readonly requires: ResolvedRequires;
}
/**
 * One admitted plugin.
 *
 * `Input` is the evaluated input shape the plugin authors against, so a record input reads
 * `values.dx` with its declared type and a table input reads rows. Types are authored, not derived
 * from the runtime specs; runtime-spec-to-type derivation is deferred to Phase 3.
 */
export interface PluginDefinition<Input extends ResolvedInput = ResolvedInput> {
  readonly id: string;
  readonly inputs: {
    // Type-legal here; admission refuses `optional` on local values in Phase 3.
    readonly values: ValueSpec;
    readonly requires?: Readonly<Record<string, DependencySpec>>;
  };
  readonly outputs: Readonly<Record<string, ValueSpec>>;
  readonly validate?: (input: Input, context: EvaluationContext) => readonly Diagnostic[];
  transform(input: Input, context: EvaluationContext): Outputs;
}
/** What publication carries, discriminated by status. Only a ready patch owns outputs. */
export type PatchPayload =
  | { readonly status: "ready"; readonly outputs: Outputs }
  | { readonly status: "blocked"; readonly diagnostics: readonly Diagnostic[] }
  | { readonly status: "error"; readonly diagnostics: readonly Diagnostic[] }
  | { readonly status: "destroyed" };
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
