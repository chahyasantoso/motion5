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
  /** Extra cycles after the initial pass; `-1` is infinite. */
  /** Extra passes after the first: an integer, `-1` forever, `0` and above a count. */
  readonly repeat?: number;
  /** Reverse every odd cycle; needs a `repeat` that repeats. */
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

/** One refusal, named by the rule it refuses under. */
export interface Diagnostic extends DiagnosticShape {
  readonly ruleId: RuleId;
  readonly ids: readonly string[];
}

/** One diagnostic pinned to one rule. */
export interface DiagnosticOf<Rule extends RuleId> extends Diagnostic {
  readonly ruleId: Rule;
}

/** What every diagnostic carries, whichever rule it names. */
interface DiagnosticShape {
  readonly path: string;
  readonly message: string;
  readonly severity: DiagnosticSeverity;
}

/** A patch's status, read off `Patch`; `"destroyed"` is terminal. */
export type PatchStatus = Patch["status"];

/** What every patch carries: which node published it, and when. */
interface PatchIdentity {
  readonly nodeId: string;
  readonly revision: number;
}

/** A cell or record field value; non-finite numbers are refused. */
export type Scalar = number | string | boolean;

/** One evaluated table row; `cells.id` is ordinary application data. */
export interface Row {
  readonly id: string;
  readonly cells: Readonly<Record<string, Scalar>>;
}

/** Evaluated rows, in authored order unless a plugin reorders. */
export type Table = readonly Row[];

/** One evaluated flat record. */
export type FlatRecord = Readonly<Record<string, Scalar>>;

/** A table as an array, a record as a plain object. */
export type Value = Table | FlatRecord;

/** A node's named outputs; the main one is `values`. */
export type Outputs = Readonly<Record<string, Value>>;

/** A node that composed; the only variant that owns a pose. */
export interface ReadyPatch extends PatchIdentity {
  readonly status: "ready";
  readonly outputs: Outputs;
  readonly sourceProgress: number;
  readonly sourceRevisions: Readonly<Record<string, number>>;
  readonly diagnostics: readonly Diagnostic[];
}

/** Stopped by an upstream state, carrying the refusal and no pose. */
export interface BlockedPatch extends PatchIdentity {
  readonly status: "blocked";
  readonly diagnostics: readonly Diagnostic[];
}

/** A node whose own composition threw, carrying the failure and no pose. */
export interface ErrorPatch extends PatchIdentity {
  readonly status: "error";
  readonly diagnostics: readonly Diagnostic[];
}

/** A node evicted from the graph; it never publishes again. */
export interface DestroyedPatch extends PatchIdentity {
  readonly status: "destroyed";
}

/** One patch on the observation wire, discriminated by status. */
export type Patch = ReadyPatch | BlockedPatch | ErrorPatch | DestroyedPatch;

/** A patch from a node that still exists: every variant but the terminal one. */
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
/** An authored leaf that never changes: a finite scalar. */
export type AuthoredStaticValue = number | string | boolean;
/** One authored cell stop: a scalar `v` at position `p`, with an optional ease. */
export interface Stop {
  readonly p: number;
  readonly v: Scalar;
  readonly ease?: string;
}
/** One authored cell or field: a scalar or a stop sequence; a bare array is stops. */
export type AuthoredCell = Scalar | readonly Stop[];
/** One authored table row, with `cells` holding its columns. */
export interface AuthoredRow {
  readonly id: string;
  readonly cells: Readonly<Record<string, AuthoredCell>>;
}
/** One authored flat record. */
export type AuthoredRecord = Readonly<Record<string, AuthoredCell>>;
/** Authored `values`, whose top-level shape selects a table or a record. */
export type AuthoredValues = readonly AuthoredRow[] | AuthoredRecord;
/** An authored cell address: `row` present is a table cell, absent a record field. */
export interface CellAddress {
  readonly row?: string;
  readonly field: string;
}
/** One source id, or one per member key for a map slot. */
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
  /** Local authored input only: forbids any stop sequence, single stop included. */
  readonly static?: true;
}
/** The row half of a table spec; columns describe `row.cells`, not the envelope. */
export interface TableSchema {
  readonly row: {
    readonly fields: Readonly<Record<string, FieldSpec>>;
    readonly additionalProperties?: boolean;
  };
  readonly minRows?: number;
  readonly maxRows?: number;
}
/** One vocabulary for local input, slot outputs and plugin outputs. */
export type ValueSpec =
  | { readonly kind: "table"; readonly schema: TableSchema; readonly optional?: true }
  | {
      readonly kind: "record";
      readonly fields: Readonly<Record<string, FieldSpec>>;
      readonly additionalProperties?: boolean;
      readonly optional?: true;
    };
/** What a plugin slot reads from a bound node, and each output's shape. */
export interface DependencySpec {
  readonly outputs: Readonly<Record<string, ValueSpec>>;
  readonly optional?: true;
  readonly binding?: BindingMode;
}
/** What a track authors: local values, dependency slots, a source schema. */
export interface TrackInput {
  readonly values?: AuthoredValues;
  readonly requires?: Readonly<Record<string, SourceBinding>>;
  /** No-plugin sources only. */
  readonly schema?: ValueSpec;
}
/** One authored leaf: stops, or a static value. */
export type AuthoredProperty = readonly AuthoredStop[] | AuthoredStaticValue;
/** One authored dataflow node: an optional plugin, its input, and a duration. */
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
/** One evaluation's identity and progress, given to a plugin. */
export interface EvaluationContext {
  readonly nodeId: string;
  readonly progress: number;
}
/** A slot's bound outputs, or a map slot's member key to its outputs. */
export type ResolvedRequires = Readonly<
  Record<string, Outputs | Readonly<Record<string, Outputs>>>
>;
/** The evaluated input a plugin receives: local values plus bound slots. */
export interface ResolvedInput<Values extends Value = Value> {
  readonly values: Values;
  readonly requires: ResolvedRequires;
}
/** One admitted plugin; `Input` is the evaluated input shape it authors against. */
export interface PluginDefinition<Input extends ResolvedInput = ResolvedInput> {
  readonly id: string;
  readonly inputs: {
    // Admission refuses `optional` on local values.
    readonly values: ValueSpec;
    readonly requires?: Readonly<Record<string, DependencySpec>>;
  };
  readonly outputs: Readonly<Record<string, ValueSpec>>;
  readonly validate?: (input: Input, context: EvaluationContext) => readonly Diagnostic[];
  transform(input: Input, context: EvaluationContext): Outputs;
}
/** What publication carries, by status; only a ready patch owns outputs. */
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
