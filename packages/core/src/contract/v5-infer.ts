import { unreachable } from "../lang/exhaustive";
import { acceptedOutcome, refusedOutcomeFrom, type Outcome } from "../lang/outcome";
import { diagnostic } from "./diagnostics";
import type { Diagnostic } from "./v5";
import type { ParsedCell, ParsedRecord, ParsedTable, ParsedValues, ScalarKind } from "./v5-parse";
import type { FieldSpec, Scalar, ValueSpec } from "./v5";

/**
 * The source contract a no-plugin track hands to the graph.
 *
 * `proven` is the difference between "nothing was observed" and "a complete observation says this
 * field is absent". An empty inferred table or record has no evidence for any kind, so a typed
 * consumer requiring a column is unproven rather than incompatible. A declaration proves its own
 * fields even when the authored values are empty.
 */
export interface SourceContract {
  readonly spec: ValueSpec;
  readonly proven: boolean;
}

type TableSpec = Extract<ValueSpec, { readonly kind: "table" }>;
type RecordSpec = Extract<ValueSpec, { readonly kind: "record" }>;

const EMPTY_DIAGNOSTICS: readonly Diagnostic[] = Object.freeze([]);

/**
 * One frozen empty table, as `input.values` omitted means for a no-plugin source.
 *
 * It is the inferred contract too when no rows exist, and it is closed because an inferred contract
 * names exactly the columns that were observed.
 */
const EMPTY_TABLE_SPEC: ValueSpec = Object.freeze({
  kind: "table",
  schema: Object.freeze({
    row: Object.freeze({ fields: Object.freeze({}), additionalProperties: false }),
  }),
});

const EMPTY_SOURCE_CONTRACT: SourceContract = Object.freeze({
  spec: EMPTY_TABLE_SPEC,
  proven: false,
});

interface ColumnEvidence {
  kind: ScalarKind;
  firstPath: string;
  occurrences: number;
  conflict: boolean;
}

/**
 * Infer exactly the observed columns, from every row and every stop.
 *
 * A column present in every row is required; one missing from any row is optional with no implicit
 * default. The cell's scalar kind is computed by the parser over every stop in that cell, so this
 * reads the whole sequence rather than its first member. Nothing here manufactures `static`, a
 * range, an enum or a row-count promise: those are authored decisions, not observations.
 */
function inferTable(table: ParsedTable, path: string, diagnostics: Diagnostic[]): SourceContract {
  const columns = new Map<string, ColumnEvidence>();
  for (const [index, row] of table.rows.entries()) {
    for (const [name, cell] of Object.entries(row.cells)) {
      const cellPath = `${path}[${index}].cells.${name}`;
      const evidence = columns.get(name);
      if (evidence === undefined) {
        columns.set(name, {
          kind: cell.scalar,
          firstPath: cellPath,
          occurrences: 1,
          conflict: false,
        });
        continue;
      }
      evidence.occurrences += 1;
      if (evidence.kind !== cell.scalar && !evidence.conflict) {
        evidence.conflict = true;
        diagnostics.push(
          diagnostic(
            "cell-kind-conflict",
            cellPath,
            `Column '${name}' is ${cell.scalar} here but ${evidence.kind} at ${evidence.firstPath}.`,
          ),
        );
      }
    }
  }
  const fields = Object.fromEntries(
    [...columns].map(([name, evidence]) => [
      name,
      Object.freeze({
        kind: evidence.kind,
        ...(evidence.occurrences === table.rows.length ? {} : { optional: true }),
      }),
    ]),
  );
  return Object.freeze({
    spec: Object.freeze({
      kind: "table",
      schema: Object.freeze({
        row: Object.freeze({
          fields: Object.freeze(fields),
          additionalProperties: false,
        }),
      }),
    }),
    proven: table.rows.length > 0,
  });
}

/** Every record field is required; an empty record observes no field and so proves nothing. */
function inferRecord(record: ParsedRecord): SourceContract {
  const fields = Object.fromEntries(
    Object.entries(record.fields).map(([name, cell]) => [
      name,
      Object.freeze({ kind: cell.scalar }),
    ]),
  );
  return Object.freeze({
    spec: Object.freeze({
      kind: "record",
      fields: Object.freeze(fields),
      additionalProperties: false,
    }),
    proven: Object.keys(fields).length > 0,
  });
}

function infer(values: ParsedValues, path: string, diagnostics: Diagnostic[]): SourceContract {
  switch (values.kind) {
    case "table":
      return inferTable(values, path, diagnostics);
    case "record":
      return inferRecord(values);
    default:
      return unreachable(values);
  }
}

function stripFields(
  fields: Readonly<Record<string, FieldSpec>>,
): Readonly<Record<string, FieldSpec>> {
  const entries = Object.entries(fields).map(([name, field]) => [
    name,
    Object.freeze({
      kind: field.kind,
      ...(field.optional === undefined ? {} : { optional: field.optional }),
      ...(field.enum === undefined ? {} : { enum: field.enum }),
      ...(field.min === undefined ? {} : { min: field.min }),
      ...(field.max === undefined ? {} : { max: field.max }),
    }),
  ]);
  return Object.freeze(Object.fromEntries(entries));
}

/**
 * The declared contract with authored-only flags removed.
 *
 * `static` forbids a stop sequence in the local input; it says nothing about the output contract,
 * where a column's current value may still change through an authored edit or a live write.
 */
function withoutStatic(spec: ValueSpec): ValueSpec {
  switch (spec.kind) {
    case "table":
      return Object.freeze({
        kind: "table",
        schema: Object.freeze({
          row: Object.freeze({
            fields: stripFields(spec.schema.row.fields),
            ...(spec.schema.row.additionalProperties === undefined
              ? {}
              : { additionalProperties: spec.schema.row.additionalProperties }),
          }),
          ...(spec.schema.minRows === undefined ? {} : { minRows: spec.schema.minRows }),
          ...(spec.schema.maxRows === undefined ? {} : { maxRows: spec.schema.maxRows }),
        }),
        ...(spec.optional === undefined ? {} : { optional: spec.optional }),
      });
    case "record":
      return Object.freeze({
        kind: "record",
        fields: stripFields(spec.fields),
        ...(spec.additionalProperties === undefined
          ? {}
          : { additionalProperties: spec.additionalProperties }),
        ...(spec.optional === undefined ? {} : { optional: spec.optional }),
      });
    default:
      return unreachable(spec);
  }
}

function valueRule(staticCell: boolean): "cell-form-invalid" | "cell-stops-invalid" {
  return staticCell ? "cell-form-invalid" : "cell-stops-invalid";
}

/** Every authored value a cell contributes to a declared enum or range. */
function cellValues(cell: ParsedCell, path: string): readonly { value: Scalar; path: string }[] {
  switch (cell.kind) {
    case "static":
      return [{ value: cell.value, path }];
    case "animated":
      return cell.stops.map((stop, index) => ({ value: stop.v, path: `${path}[${index}].v` }));
    default:
      return unreachable(cell);
  }
}

function validateCell(
  cell: ParsedCell,
  field: FieldSpec,
  path: string,
  diagnostics: Diagnostic[],
): void {
  if (cell.scalar !== field.kind) {
    diagnostics.push(
      diagnostic(
        "cell-kind-conflict",
        path,
        `Field is declared ${field.kind} but the authored cell is ${cell.scalar}.`,
      ),
    );
    return;
  }
  for (const { value, path: valuePath } of cellValues(cell, path)) {
    if (
      field.kind === "string" &&
      field.enum !== undefined &&
      typeof value === "string" &&
      !field.enum.includes(value)
    )
      diagnostics.push(
        diagnostic(
          valueRule(cell.kind === "static"),
          valuePath,
          `Value '${value}' is not one of the declared enum values.`,
        ),
      );
    if (field.kind === "number" && typeof value === "number") {
      if (field.min !== undefined && value < field.min)
        diagnostics.push(
          diagnostic(
            valueRule(cell.kind === "static"),
            valuePath,
            `Value ${value} is below the declared minimum ${field.min}.`,
          ),
        );
      if (field.max !== undefined && value > field.max)
        diagnostics.push(
          diagnostic(
            valueRule(cell.kind === "static"),
            valuePath,
            `Value ${value} is above the declared maximum ${field.max}.`,
          ),
        );
    }
  }
}

function validateTable(
  table: ParsedTable,
  schema: TableSpec,
  path: string,
  diagnostics: Diagnostic[],
): void {
  const { minRows, maxRows } = schema.schema;
  if (minRows !== undefined && table.rows.length < minRows)
    diagnostics.push(
      diagnostic(
        "values-shape-invalid",
        path,
        `The schema requires at least ${minRows} rows but ${table.rows.length} are authored.`,
      ),
    );
  if (maxRows !== undefined && table.rows.length > maxRows)
    diagnostics.push(
      diagnostic(
        "values-shape-invalid",
        path,
        `The schema allows at most ${maxRows} rows but ${table.rows.length} are authored.`,
      ),
    );
  const fields = schema.schema.row.fields;
  const closed = schema.schema.row.additionalProperties !== true;
  for (const [index, row] of table.rows.entries()) {
    const cellsPath = `${path}[${index}].cells`;
    for (const [name, field] of Object.entries(fields)) {
      if (!Object.hasOwn(row.cells, name)) {
        if (field.optional !== true)
          diagnostics.push(
            diagnostic(
              "cell-form-invalid",
              `${cellsPath}.${name}`,
              `Required field '${name}' is absent.`,
            ),
          );
        continue;
      }
      const cell = row.cells[name];
      if (cell !== undefined) validateCell(cell, field, `${cellsPath}.${name}`, diagnostics);
    }
    if (!closed) continue;
    for (const name of Object.keys(row.cells))
      if (!Object.hasOwn(fields, name))
        diagnostics.push(
          diagnostic(
            "cell-form-invalid",
            `${cellsPath}.${name}`,
            `Field '${name}' is not declared and the schema is closed.`,
          ),
        );
  }
}

function validateRecord(
  record: ParsedRecord,
  schema: RecordSpec,
  path: string,
  diagnostics: Diagnostic[],
): void {
  for (const [name, field] of Object.entries(schema.fields)) {
    if (!Object.hasOwn(record.fields, name)) {
      if (field.optional !== true)
        diagnostics.push(
          diagnostic("cell-form-invalid", `${path}.${name}`, `Required field '${name}' is absent.`),
        );
      continue;
    }
    const cell = record.fields[name];
    if (cell !== undefined) validateCell(cell, field, `${path}.${name}`, diagnostics);
  }
  if (schema.additionalProperties === true) return;
  for (const name of Object.keys(record.fields))
    if (!Object.hasOwn(schema.fields, name))
      diagnostics.push(
        diagnostic(
          "cell-form-invalid",
          `${path}.${name}`,
          `Field '${name}' is not declared and the schema is closed.`,
        ),
      );
}

function validateDeclared(
  values: ParsedValues,
  schema: ValueSpec,
  path: string,
  diagnostics: Diagnostic[],
): void {
  switch (schema.kind) {
    case "table":
      if (values.kind !== "table") {
        diagnostics.push(
          diagnostic(
            "values-shape-invalid",
            path,
            `Authored values are a ${values.kind} but input.schema declares a table.`,
          ),
        );
        return;
      }
      validateTable(values, schema, path, diagnostics);
      return;
    case "record":
      if (values.kind !== "record") {
        diagnostics.push(
          diagnostic(
            "values-shape-invalid",
            path,
            `Authored values are a ${values.kind} but input.schema declares a record.`,
          ),
        );
        return;
      }
      validateRecord(values, schema, path, diagnostics);
      return;
    default:
      return unreachable(schema);
  }
}

/**
 * Derive the source contract for one no-plugin track.
 *
 * A declaration is validated against every authored cell and stop and is then published as written,
 * minus `static`; it is never merged with inference. Without a declaration the contract is inferred
 * from the complete authored snapshot, and an empty snapshot is accepted with `proven: false` rather
 * than being treated as compatible with every typed consumer.
 */
export function deriveSourceContract(
  values: ParsedValues | undefined,
  schema: ValueSpec | undefined,
  path: string,
): Outcome<SourceContract, Diagnostic> {
  const diagnostics: Diagnostic[] = [];
  if (schema !== undefined) {
    if (values !== undefined) validateDeclared(values, schema, path, diagnostics);
    if (diagnostics.length > 0) return refusedOutcomeFrom(diagnostics);
    return acceptedOutcome(
      Object.freeze({ spec: withoutStatic(schema), proven: true }),
      EMPTY_DIAGNOSTICS,
    );
  }
  if (values === undefined) return acceptedOutcome(EMPTY_SOURCE_CONTRACT, EMPTY_DIAGNOSTICS);
  const contract = infer(values, path, diagnostics);
  if (diagnostics.length > 0) return refusedOutcomeFrom(diagnostics);
  return acceptedOutcome(contract, EMPTY_DIAGNOSTICS);
}
