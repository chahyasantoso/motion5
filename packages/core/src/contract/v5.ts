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
  | { readonly kind: "table"; readonly schema: TableSchema; readonly optional?: true }
  | {
      readonly kind: "record";
      readonly fields: Readonly<Record<string, FieldSpec>>;
      readonly additionalProperties?: boolean;
      readonly optional?: true;
    };
/** Slot reads from bound node; output shapes. */
export interface DependencySpec {
  readonly outputs: Readonly<Record<string, ValueSpec>>;
  readonly optional?: true;
  readonly binding?: BindingMode;
}
/** What a track authors: values, slots, source schema. */
export interface TrackInput {
  readonly values?: AuthoredValues;
  readonly requires?: Readonly<Record<string, SourceBinding>>;
  /** No-plugin sources only. */
  readonly schema?: ValueSpec;
}
/** Stops or a static value. */
export type AuthoredProperty = readonly AuthoredStop[] | AuthoredStaticValue;
/** Dataflow node: optional plugin, input, duration. */
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
/** Node id and progress passed to a plugin. */
export interface EvaluationContext {
  readonly nodeId: string;
  readonly progress: number;
}
/** Bound outputs by slot; map slots add a member level. */
export type ResolvedRequires = Readonly<
  Record<string, Outputs | Readonly<Record<string, Outputs>>>
>;
/** Plugin input: local values plus bound slots. */
export interface ResolvedInput<Values extends Value = Value> {
  readonly values: Values;
  readonly requires: ResolvedRequires;
}
/** Admitted plugin; `Input` is its evaluated input shape. */
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
