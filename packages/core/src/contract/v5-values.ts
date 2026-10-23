import type { Diagnostic } from "./v5";

/**
 * The target v5 value contract: authored and evaluated tables, records, specs and outputs.
 *
 * Staged beside `contract/v5.ts` so the Phase 1 acceptance suite can name the target without
 * changing the live engine, which still reads grouped `keyframes`. Phase 2 folds this module back
 * into `contract/v5.ts` when parsing and evaluation adopt identified tables; until then the live
 * `TrackDefinition` and this target one coexist. Nothing here is exported from a package entry yet,
 * so the current public surface is unchanged.
 */

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

/** One authored stop. A bare array is always a stop sequence. */
export interface Stop {
  readonly p: number;
  readonly v: Scalar;
  readonly ease?: string;
}

/** One authored cell or record field: a scalar, or a stop sequence. */
export type AuthoredCell = Scalar | readonly Stop[];

/** One authored table row. */
export interface AuthoredRow {
  readonly id: string;
  readonly cells: Readonly<Record<string, AuthoredCell>>;
}

/** One authored flat record. */
export type AuthoredRecord = Readonly<Record<string, AuthoredCell>>;

/** Authored `values`, whose top-level shape selects a table or a record. */
export type AuthoredValues = readonly AuthoredRow[] | AuthoredRecord;

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

/** One authored dataflow node. */
export interface TrackDefinition {
  readonly id: string;
  readonly plugin?: string;
  readonly input?: TrackInput;
  readonly duration?: number;
}

/** A node's published named outputs. The main output is `values`. */
export type Outputs = Readonly<Record<string, Value>>;

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
  readonly transform: (input: Input, context: EvaluationContext) => Outputs;
}

/** What publication carries, discriminated by status. Only a ready patch owns outputs. */
export type PatchPayload =
  | { readonly status: "ready"; readonly outputs: Outputs }
  | { readonly status: "blocked"; readonly diagnostics: readonly Diagnostic[] }
  | { readonly status: "error"; readonly diagnostics: readonly Diagnostic[] }
  | { readonly status: "destroyed" };
