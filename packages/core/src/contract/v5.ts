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
  /** Extra passes after first; integer, `-1` forever, `0`+ counts. */
  readonly repeat?: number;
  /** Reverse odd cycles; needs repeating `repeat`. */
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

/** Refusal tagged with its rule. */
export interface Diagnostic extends DiagnosticShape {
  readonly ruleId: RuleId;
  readonly ids: readonly string[];
}

/** `Diagnostic` narrowed to one rule. */
export interface DiagnosticOf<Rule extends RuleId> extends Diagnostic {
  readonly ruleId: Rule;
}

interface DiagnosticShape {
  readonly path: string;
  readonly message: string;
  readonly severity: DiagnosticSeverity;
}

/** `Patch` status; `"destroyed"` terminal. */
export type PatchStatus = Patch["status"];

/** Publishing node and revision. */
interface PatchIdentity {
  readonly nodeId: string;
  readonly revision: number;
}

/** Cell or record field value; non-finite refused. */
export type Scalar = number | string | boolean;

/** Evaluated table row; `cells.id` is application data. */
export interface Row {
  readonly id: string;
  readonly cells: Readonly<Record<string, Scalar>>;
}

/** Evaluated rows in authored order unless a plugin reorders. */
export type Table = readonly Row[];

/** Evaluated flat record. */
export type FlatRecord = Readonly<Record<string, Scalar>>;

/** Table as array, record as plain object. */
export type Value = Table | FlatRecord;

/** Named node outputs; main is `values`. */
export type Outputs = Readonly<Record<string, Value>>;

/** Composed node; only variant with a pose. */
export interface ReadyPatch extends PatchIdentity {
  readonly status: "ready";
  readonly outputs: Outputs;
  readonly sourceProgress: number;
  readonly sourceRevisions: Readonly<Record<string, number>>;
  readonly diagnostics: readonly Diagnostic[];
}

/** Stopped by upstream state; refusal, no pose. */
export interface BlockedPatch extends PatchIdentity {
  readonly status: "blocked";
  readonly diagnostics: readonly Diagnostic[];
}

/** Own composition threw; failure, no pose. */
export interface ErrorPatch extends PatchIdentity {
  readonly status: "error";
  readonly diagnostics: readonly Diagnostic[];
}

/** Evicted from graph; never publishes again. */
export interface DestroyedPatch extends PatchIdentity {
  readonly status: "destroyed";
}

/** Observation-wire patch, discriminated by status. */
export type Patch = ReadyPatch | BlockedPatch | ErrorPatch | DestroyedPatch;

/** From a node that still exists: all variants but the terminal one. */
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
/** Non-animating authored leaf: finite scalar. */
export type AuthoredStaticValue = number | string | boolean;
/** Scalar `v` at position `p`, optional ease. */
export interface Stop {
  readonly p: number;
  readonly v: Scalar;
  readonly ease?: string;
}
/** Scalar or stop sequence; bare array is stops. */
export type AuthoredCell = Scalar | readonly Stop[];
/** Table row; `cells` holds columns. */
export interface AuthoredRow {
  readonly id: string;
  readonly cells: Readonly<Record<string, AuthoredCell>>;
}
/** Flat record of authored cells. */
export type AuthoredRecord = Readonly<Record<string, AuthoredCell>>;
/** Top-level shape picks table or record. */
export type AuthoredValues = readonly AuthoredRow[] | AuthoredRecord;
/** One relative complaint a model validation reports. */
export interface TypeIssue {
  readonly path: readonly string[];
  readonly message: string;
}
/** A problem reported when parsing or validating a model. */
export interface Issue {
  readonly path: string;
  readonly message: string;
}
/** Domain parse either yields a plain structure or refuses it. */
export type Parsed<Structure> =
  | { readonly ok: true; readonly value: Structure }
  | { readonly ok: false; readonly issues: readonly Issue[] };
/** A refusal that names at least one diagnostic; a hook that refuses owes a reason. */
export type NonEmptyDiagnostics = readonly [Diagnostic, ...Diagnostic[]];
/** Result of preparing plugin static state. */
export type Prepared<State = unknown> =
  | { readonly ok: true; readonly value: State }
  | { readonly ok: false; readonly diagnostics: NonEmptyDiagnostics };
/** Successful parse or prepare result; the shared success arm of both unions. */
export function ok<Structure>(value: Structure): { readonly ok: true; readonly value: Structure } {
  return { ok: true, value };
}
/** Refused parse result with issues. */
export function refused(issues: readonly Issue[]): Parsed<never> {
  return { ok: false, issues };
}
/** Refused prepare with the diagnostics that explain it. */
export function prepareRefused(diagnostics: NonEmptyDiagnostics): Prepared<never> {
  return { ok: false, diagnostics };
}
/** A table value's cell shape, derived from a model's cell type. */
export type TableOf<Cells> = readonly { readonly id: string; readonly cells: Cells }[];
declare const CELLS: unique symbol;
/** Nominal model contract specifying value shape and optional structure parse. */
export interface Model<Cells = unknown, Structure = undefined> {
  readonly id: string;
  readonly spec: ValueSpec;
  readonly parse?: (value: Value) => Parsed<Structure>;
  readonly [CELLS]?: Cells;
}
/** Defines an immutable model contract. */
export function defineModel<Cells = unknown, Structure = undefined>(decl: {
  readonly id: string;
  readonly spec: ValueSpec;
  readonly parse?: (value: Value) => Parsed<Structure>;
}): Model<Cells, Structure> {
  return Object.freeze({ ...decl });
}
declare const STRUCTURE: unique symbol;
/** Frozen, core-branded structure a model produced at commit. */
export type Structure<S> = S & { readonly [STRUCTURE]: true };
/** `row` present = table cell, absent = record field. */
export interface CellAddress {
  readonly row?: string;
  readonly field: string;
}
/** Source id, or per-member id for a map slot. */
export type SourceBinding = string | Readonly<Record<string, string>>;
/** How a slot receives a bound node's outputs. */
export type BindingMode = "single" | "map";
/** Declared contract for one scalar field. */
export interface FieldSpec {
  readonly kind: "number" | "string" | "boolean";
  readonly optional?: true;
  readonly enum?: readonly string[];
  readonly min?: number;
  readonly max?: number;
  /** Local input only: no stop sequence, even one stop. */
  readonly static?: true;
}
/** Row half of table spec; columns describe `row.cells`, not envelope. */
export interface TableSchema {
  readonly row: {
    readonly fields: Readonly<Record<string, FieldSpec>>;
    readonly additionalProperties?: boolean;
  };
  readonly minRows?: number;
  readonly maxRows?: number;
}
/** One vocabulary for local input, slot and plugin outputs. */
export type ValueSpec =
  | { readonly kind: "table"; readonly schema: TableSchema; readonly optional?: boolean }
  | {
      readonly kind: "record";
      readonly fields: Readonly<Record<string, FieldSpec>>;
      readonly additionalProperties?: boolean;
      readonly optional?: boolean;
    };
/** Slot reads from bound node; output shapes. */
export interface DependencySpec {
  readonly outputs: Readonly<Record<string, ValueSpec>>;
  readonly optional?: boolean;
  readonly binding?: BindingMode;
}
/** A slot that admits one named model. */
export interface ModelSlotSpec {
  readonly kind: "model";
  readonly model: Model<unknown, unknown>;
  readonly optional?: true;
  readonly binding?: BindingMode;
}
/** Wrapper declaring an optional dependency on a model. */
export interface OptionalModel<M extends Model<unknown, unknown> = Model<unknown, unknown>> {
  readonly optional: true;
  readonly model: M;
  readonly binding?: BindingMode;
}
/** Declares an optional model slot requirement. */
export function optional<M extends Model<unknown, unknown>>(
  model: M,
  options?: { readonly binding?: BindingMode },
): OptionalModel<M> {
  return Object.freeze({
    optional: true,
    model,
    ...(options?.binding !== undefined ? { binding: options.binding } : {}),
  });
}
/** Model predicate recognizing nominal models. */
export function isModel(value: unknown): value is Model<unknown, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  return (
    "id" in value &&
    typeof value.id === "string" &&
    "spec" in value &&
    !("transform" in value) &&
    !("bind" in value)
  );
}
/** Predicate recognizing optional model declarations. */
export function isOptionalModel(value: unknown): value is OptionalModel<Model<unknown, unknown>> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  return "optional" in value && value.optional === true && "model" in value && isModel(value.model);
}
/** A slot that admits named output shapes. */
export type ShapeSlotSpec = { readonly kind: "shape" } & DependencySpec;
/** How a plugin slot receives its bound source. */
export type SlotSpec = ModelSlotSpec | ShapeSlotSpec;
/** A requirement declared on a plugin slot. */
export type PluginRequirement =
  | SlotSpec
  | Model<unknown, unknown>
  | OptionalModel<Model<unknown, unknown>>;
/** Structures delivered to a plugin's cross-source check. */
export type SourceStructure = Structure<unknown> | Readonly<Record<string, Structure<unknown>>>;
export type SourceStructures = Readonly<Record<string, SourceStructure>>;
/** What a track's output is: a source model or a computed plugin. Exactly one key. */
export type OutputDefinition = { readonly model: string } | { readonly plugin: string };
/** The model id an output names, or undefined when it names a plugin. */
export function outputModelId(output: OutputDefinition): string | undefined {
  return "model" in output ? output.model : undefined;
}
/** The plugin id an output names, or undefined when it names a model. */
export function outputPluginId(output: OutputDefinition): string | undefined {
  return "plugin" in output ? output.plugin : undefined;
}
/** What a track authors: values, params, slots. */
export interface TrackInput {
  readonly values?: AuthoredValues;
  readonly param?: AuthoredValues;
  readonly requires?: Readonly<Record<string, SourceBinding>>;
}
/** Stops or a static value. */
export type AuthoredProperty = readonly AuthoredStop[] | AuthoredStaticValue;
/** Dataflow node: input, named output, duration. */
export interface TrackDefinition {
  readonly id: string;
  readonly input?: TrackInput;
  readonly output: OutputDefinition;
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
/** Node id and progress passed to a plugin. */
export interface EvaluationContext {
  readonly nodeId: string;
  readonly progress: number;
}
/** Resolved slot values: output sets for shape slots, values for model slots. */
export type ResolvedRequires = Readonly<Record<string, unknown>>;
/** Plugin input: local values plus bound slots. */
export interface ResolvedInput<Values = Value, Structures = Readonly<Record<string, unknown>>> {
  readonly values: Values;
  readonly requires: ResolvedRequires;
  readonly param?: unknown;
  readonly structures?: Structures;
  readonly state?: unknown;
}
/** Record-kind value specification. */
export type RecordSpec = Extract<ValueSpec, { readonly kind: "record" }>;

/** Context passed to plugin prepare hook. */
export interface PluginPrepareContext<TRequires = SourceStructures> {
  readonly values: unknown;
  readonly param?: unknown;
  readonly structures: TRequires;
}

/** Admitted plugin; `Input` is its evaluated input shape. */
export interface PluginDefinition<
  Input extends ResolvedInput<unknown, unknown> = ResolvedInput,
  OutputsDecl extends Readonly<Record<string, ValueSpec | Model<unknown, unknown>>> = Readonly<
    Record<string, ValueSpec | Model<unknown, unknown>>
  >,
  TState = unknown,
  TStructures = [Input] extends [never] ? never : SourceStructures,
> {
  readonly id: string;
  readonly inputs: {
    readonly param?: RecordSpec;
    readonly values?: ValueSpec | Model<unknown, unknown>;
    readonly requires?: Readonly<
      Record<string, SlotSpec | Model<unknown, unknown> | OptionalModel<Model<unknown, unknown>>>
    >;
  };
  readonly outputs: OutputsDecl;
  prepare?(ctx: PluginPrepareContext<TStructures>): Prepared<TState>;
  transform(input: Input, context: EvaluationContext): Outputs;
}
/** Payload by status; only ready owns outputs. */
export type PatchPayload =
  | { readonly status: "ready"; readonly outputs: Outputs }
  | { readonly status: "blocked"; readonly diagnostics: readonly Diagnostic[] }
  | { readonly status: "error"; readonly diagnostics: readonly Diagnostic[] }
  | { readonly status: "destroyed" };
/** The authored project. */
export interface ProjectDefinition {
  readonly schemaVersion: 5;
  readonly projectId?: string;
  readonly perspective?: number;
  readonly motions: readonly MotionDefinition[];
  readonly freeTracks?: readonly TrackDefinition[];
}
