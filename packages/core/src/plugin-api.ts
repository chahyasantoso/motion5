/**
 * The declared plugin-authoring surface. Re-exports only: the protocol and its exhaustive reader
 * keep their owners in core, while implementations depend on this entry. See ADR-133.
 *
 * A plugin authored against the identified-table contract names `PluginDefinition` until
 * the mechanical rename lands, and registers through `PluginCatalog`.
 */
export { PluginAdmissionError, PluginCatalog } from "./domain/plugin-catalog";
export {
  defineModel,
  isModel,
  isOptionalModel,
  ok,
  prepareRefused,
  refused,
  outputPluginId,
} from "./contract/v5";
export { diagnostic } from "./contract/diagnostics";
export { optional, shape } from "./contract/slot-spec";
import type {
  EvaluationContext,
  FlatRecord,
  Model,
  ModelSlotSpec,
  OptionalModel,
  Outputs,
  PluginDefinition,
  PluginPrepareContext,
  PluginRequirement,
  Prepared,
  RecordSpec,
  ShapeSlotSpec,
  TableOf,
  Value,
  ValueSpec,
} from "./contract/v5";
export type {
  DependencySpec,
  Diagnostic,
  EvaluationContext,
  FlatRecord,
  Issue,
  Model,
  ModelSlotSpec,
  NonEmptyDiagnostics,
  OptionalModel,
  Outputs,
  Parsed,
  PluginDefinition as PluginDefinition,
  PluginPrepareContext,
  PluginRequirement,
  Prepared,
  RecordSpec,
  ResolvedInput,
  Row,
  Scalar,
  ShapeSlotSpec,
  SlotSpec,
  SourceStructure,
  SourceStructures,
  Structure,
  Table,
  TableOf,
  TypeIssue,
  Value,
  ValueSpec,
} from "./contract/v5";

export type Simplify<T> = { readonly [K in keyof T]: T[K] };
export type PrimitiveScalar = number | string | boolean;
export type PrimitiveRecord = Readonly<Record<string, PrimitiveScalar>>;
export type PrimitiveValue =
  | PrimitiveRecord
  | readonly { readonly id: string; readonly cells: PrimitiveRecord }[];
export type PrimitiveOutputs = Readonly<Record<string, PrimitiveValue>>;

export type IsOptionalRequirement<R> =
  R extends OptionalModel<Model<unknown, unknown>>
    ? true
    : R extends { readonly optional: true }
      ? true
      : false;

export type ModelValue<M> =
  M extends Model<infer Cells, infer S>
    ? unknown extends Cells
      ? PrimitiveValue
      : Cells extends readonly unknown[]
        ? Cells
        : [S] extends [undefined]
          ? Cells
          : TableOf<Cells>
    : PrimitiveValue;

export type RequirementValue<R> =
  R extends OptionalModel<infer M>
    ? ModelValue<M>
    : R extends Model<unknown, unknown>
      ? ModelValue<R>
      : R extends ModelSlotSpec
        ? ModelValue<R["model"]>
        : R extends ShapeSlotSpec
          ? PrimitiveOutputs
          : unknown;

/** Evaluates `requires` slot types from a plugin's `inputs.requires` map. */
export type InferredRequires<Requires extends Readonly<Record<string, PluginRequirement>>> =
  Simplify<
    {
      readonly [K in keyof Requires as IsOptionalRequirement<Requires[K]> extends false
        ? K
        : never]: RequirementValue<Requires[K]>;
    } & {
      readonly [K in keyof Requires as IsOptionalRequirement<Requires[K]> extends true
        ? K
        : never]?: RequirementValue<Requires[K]> | undefined;
    }
  >;

export type RequiredStructureKey<K, R> =
  R extends Model<unknown, infer S>
    ? [S] extends [undefined]
      ? never
      : K
    : R extends { readonly kind: "model"; readonly model: Model<unknown, infer S> }
      ? R extends { readonly optional: true }
        ? never
        : [S] extends [undefined]
          ? never
          : K
      : never;

export type OptionalStructureKey<K, R> =
  R extends OptionalModel<Model<unknown, infer S>>
    ? [S] extends [undefined]
      ? never
      : K
    : R extends {
          readonly kind: "model";
          readonly optional: true;
          readonly model: Model<unknown, infer S>;
        }
      ? [S] extends [undefined]
        ? never
        : K
      : never;

export type RequirementStructure<R> =
  R extends Model<unknown, infer S>
    ? S
    : R extends OptionalModel<Model<unknown, infer S>>
      ? S
      : R extends { readonly kind: "model"; readonly model: Model<unknown, infer S> }
        ? S
        : never;

/** Evaluates `structures` slot types from a plugin's `inputs.requires` map. */
export type InferredStructures<Requires extends Readonly<Record<string, PluginRequirement>>> =
  Simplify<
    {
      readonly [K in keyof Requires as RequiredStructureKey<K, Requires[K]>]: RequirementStructure<
        Requires[K]
      >;
    } & {
      readonly [K in keyof Requires as OptionalStructureKey<K, Requires[K]>]?:
        | RequirementStructure<Requires[K]>
        | undefined;
    }
  >;

export type InferredValues<ValuesSpec, Values = PrimitiveValue> =
  ValuesSpec extends Model<unknown, unknown> ? ModelValue<ValuesSpec> : Values;

/** Evaluates full `transform` input shape from a plugin's declarations. */
export type DerivedPluginInput<
  RequiresMap extends Readonly<Record<string, unknown>> = Readonly<Record<string, unknown>>,
  StructuresMap = Readonly<Record<string, unknown>>,
  Param = PrimitiveRecord,
  State = undefined,
  Values = PrimitiveValue,
> = Simplify<
  {
    readonly values: Values;
    readonly requires: RequiresMap;
    readonly structures: StructuresMap;
    readonly param?: Param | undefined;
  } & ([State] extends [undefined] ? { readonly state?: undefined } : { readonly state: State })
>;

/** Admitted plugin with derived slot, structure and state types. */
export interface DerivedPluginDefinition<
  RequiresMap extends Readonly<Record<string, unknown>> = Readonly<Record<string, unknown>>,
  StructuresMap = Readonly<Record<string, unknown>>,
  State = undefined,
  Param = PrimitiveRecord,
  Values = PrimitiveValue,
> extends PluginDefinition<
    DerivedPluginInput<RequiresMap, StructuresMap, Param, State, Values>,
    Readonly<Record<string, ValueSpec | Model<unknown, unknown>>>,
    State,
    StructuresMap
  > {}

/** Defines an immutable plugin with slot, structure and state types derived from its contract. */
export function definePlugin<
  Requires extends Readonly<Record<string, PluginRequirement>> = Readonly<Record<string, never>>,
  ValuesSpec extends ValueSpec | Model<unknown, unknown> = ValueSpec,
  Param = PrimitiveRecord,
  State = undefined,
  Values = PrimitiveValue,
>(decl: {
  readonly id: string;
  readonly inputs: {
    readonly param?: RecordSpec;
    readonly values?: ValuesSpec;
    readonly requires?: Requires;
  };
  readonly outputs: Readonly<Record<string, ValueSpec | Model<unknown, unknown>>>;
  prepare?(ctx: PluginPrepareContext<InferredStructures<Requires>>): Prepared<State>;
  transform(
    input: DerivedPluginInput<
      InferredRequires<Requires>,
      InferredStructures<Requires>,
      Param,
      State,
      InferredValues<ValuesSpec, Values>
    >,
    context: EvaluationContext,
  ): Outputs;
}): DerivedPluginDefinition<
  InferredRequires<Requires>,
  InferredStructures<Requires>,
  State,
  Param,
  InferredValues<ValuesSpec, Values>
> {
  return Object.freeze({ ...decl });
}
export type {
  ImmutableArray,
  ImmutableLeaf,
  ImmutableRecord,
  ImmutableValue,
} from "./domain/values";
export { isImmutableLeaf } from "./domain/values";
export type { OutputSerializer } from "./ports/render-metadata";
export { unreachable } from "./lang/exhaustive";
export { patchRender, type PatchRender } from "./contract/patch-render";
export { isFlatRecord, selectRecord, selectRow, selectSingleRow } from "./contract/output-select";
export type { RecordSelection, RowSelection } from "./contract/output-select";
export type { PluginCapabilities } from "./ports/plugin-capabilities";
export type {
  AxisKey,
  Bend,
  BendAuthored,
  JointBoundKey,
  JointKind,
  JointVocabularyKey,
  LimitKey,
  TwistKey,
} from "./contract/solver-constraints";
export {
  AXIS_X_KEY,
  AXIS_Y_KEY,
  AXIS_Z_KEY,
  BEND_KEY,
  classifyBend,
  FLIP_KEY,
  INFLUENCE_KEY,
  INSPECT_KEY,
  INSPECTION_KEY,
  JOINT_KEY,
  JOINT_VOCABULARY_KEYS,
  jointConstrains,
  LIMIT_CEILING,
  LIMIT_FLOOR,
  MAX_ROTATION_KEY,
  MAX_SWING_KEY,
  MAX_TWIST_KEY,
  MIN_ROTATION_KEY,
  MIN_TWIST_KEY,
  ORIENT_KEY,
  readAxisComponent,
  readInfluenceValue,
  readJointKind,
  readLimitDegree,
  readOrientValue,
  readSwingDegree,
} from "./contract/solver-constraints";
