import type { FieldSpec, RecordSpec, TableSchema, ValueSpec } from "./v5";

type Fields = Readonly<Record<string, FieldSpec>>;
type FieldOptions = Omit<FieldSpec, "kind">;
type TableSpec = Extract<ValueSpec, { readonly kind: "table" }>;

interface RecordOptions {
  readonly additionalProperties?: boolean;
  readonly optional?: boolean;
}

interface TableOptions extends RecordOptions {
  readonly minRows?: number;
  readonly maxRows?: number;
}

function table(fields: Fields, options: TableOptions = {}): TableSpec {
  const { additionalProperties, minRows, maxRows, optional } = options;
  const schema: TableSchema = {
    row: { fields, ...(additionalProperties === undefined ? {} : { additionalProperties }) },
    ...(minRows === undefined ? {} : { minRows }),
    ...(maxRows === undefined ? {} : { maxRows }),
  };
  return { kind: "table", schema, ...(optional === undefined ? {} : { optional }) };
}

/** Short forms of a value spec; each returns the same plain object its literal spells out. */
export const Spec = Object.freeze({
  number: (options: FieldOptions = {}): FieldSpec => ({ kind: "number", ...options }),
  string: (options: FieldOptions = {}): FieldSpec => ({ kind: "string", ...options }),
  boolean: (options: FieldOptions = {}): FieldSpec => ({ kind: "boolean", ...options }),
  record: (fields: Fields, options: RecordOptions = {}): RecordSpec => ({
    kind: "record",
    fields,
    ...options,
  }),
  table,
});
