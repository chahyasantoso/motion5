import type {
  AuthoredCell,
  AuthoredRecord,
  AuthoredValues,
  FlatRecord,
  MotionDefinition,
  PatchPayload,
  SourceBinding,
  Table,
  TrackDefinition,
  TriggerDefinition,
  Value,
} from "../../src/contract/v5";

/**
 * Shape-neutral authored fixtures for the v5 value contract.
 *
 * A test authors rows, records and tracks through these builders rather than spelling the target
 * shape at each call site, so the next shape change edits this module once. `table` and `record`
 * preserve the cells a caller wrote, which lets the same builder produce authored stop sequences
 * and evaluated scalar values without pretending one is the other.
 */

export function row<Cells extends Readonly<Record<string, AuthoredCell>>>(
  id: string,
  cells: Cells,
): { readonly id: string; readonly cells: Cells } {
  return { id, cells };
}

export function table<
  Rows extends readonly {
    readonly id: string;
    readonly cells: Readonly<Record<string, AuthoredCell>>;
  }[],
>(...rows: Rows): Rows {
  return rows;
}

export function record<Values extends AuthoredRecord>(values: Values): Values {
  return values;
}

export const TEST_RECORD_MODEL = "TestRecord";
export const TEST_TABLE_MODEL = "TestTable";

export interface TrackOptions {
  readonly id: string;
  readonly model?: string;
  readonly plugin?: string;
  readonly values?: AuthoredValues;
  readonly param?: AuthoredValues;
  readonly requires?: Readonly<Record<string, SourceBinding>>;
  readonly duration?: number;
}

export function track(options: TrackOptions): TrackDefinition {
  const output =
    options.plugin !== undefined
      ? { plugin: options.plugin }
      : options.model !== undefined
        ? { model: options.model }
        : { model: Array.isArray(options.values) ? TEST_TABLE_MODEL : TEST_RECORD_MODEL };
  const hasInput =
    options.values !== undefined || options.param !== undefined || options.requires !== undefined;
  const input = hasInput
    ? {
        ...(options.values !== undefined ? { values: options.values } : {}),
        ...(options.param !== undefined ? { param: options.param } : {}),
        ...(options.requires !== undefined ? { requires: options.requires } : {}),
      }
    : undefined;
  return {
    id: options.id,
    output,
    ...(input !== undefined ? { input } : {}),
    ...(options.duration !== undefined ? { duration: options.duration } : {}),
  };
}

export interface BuilderMotion {
  readonly id: string;
  readonly trigger: TriggerDefinition;
  readonly tracks: readonly TrackDefinition[];
  readonly stagger?: number;
}

export interface BuilderProject {
  readonly schemaVersion: 5;
  readonly projectId?: string;
  readonly perspective?: number;
  readonly motions: readonly BuilderMotion[];
  readonly freeTracks?: readonly TrackDefinition[];
}

export function project(tracks: readonly TrackDefinition[]): BuilderProject {
  return {
    schemaVersion: 5,
    motions: [{ id: "demo", trigger: { type: "manual" }, tracks }],
  };
}

export function outputOf(patch: PatchPayload | undefined, name: string): Value | undefined {
  if (patch?.status !== "ready") return undefined;
  return patch.outputs[name];
}

export function isTableOutput(value: Value | undefined): value is Table {
  return Array.isArray(value);
}

/**
 * The ready patch's `values` output, narrowed to the flat record most fixtures publish.
 *
 * `Outputs` is open by contract, so a reader has to say which shape it expects before indexing one.
 * A thrown error rather than `undefined` because every caller has already asserted the patch is
 * ready: an absent or tabular output is the test's fixture being wrong, not a case to branch on.
 */
export function recordValues(patch: PatchPayload | undefined): FlatRecord {
  const value = outputOf(patch, "values");
  if (value === undefined || isTableOutput(value))
    throw new Error("Expected a ready patch whose values output is a flat record.");
  return value;
}

export function tableValues(patch: PatchPayload | undefined): Table {
  const value = outputOf(patch, "values");
  if (!isTableOutput(value))
    throw new Error("Expected a ready patch whose values output is a table.");
  return value;
}
