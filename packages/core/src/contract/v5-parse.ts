import { unreachable } from "../lang/exhaustive";
import { acceptedOutcome, refusedOutcomeFrom, type Outcome } from "../lang/outcome";
import { readAuthoredLeaf } from "./authored-leaf";
import { diagnostic } from "./diagnostics";
import type { Diagnostic } from "./v5";
import type { FieldSpec, Scalar, SourceBinding, ValueSpec } from "./v5-values";

/**
 * The authored boundary for an identified-table track.
 *
 * Parsing answers whether the authored document is a track of the target shape and, if it is, what
 * the compiler reads afterwards. Leaves are read through `readAuthoredLeaf`, so one function still
 * decides what an authored cell looks like. It is pure and not wired into the engine yet.
 *
 * Stops are validated in full here rather than filtered later, so evaluation never sees a sequence
 * it has to repair.
 */

export type ScalarKind = "number" | "string" | "boolean";

export interface ParsedStop {
  readonly p: number;
  readonly v: Scalar;
  readonly ease?: string;
}

/** A cell that changes with progress. Every stop in one sequence has one scalar kind. */
export interface ParsedAnimatedCell {
  readonly kind: "animated";
  readonly scalar: ScalarKind;
  readonly stops: readonly ParsedStop[];
}

/** A cell that is written once and never interpolated. */
export interface ParsedStaticCell {
  readonly kind: "static";
  readonly scalar: ScalarKind;
  readonly value: Scalar;
}

export type ParsedCell = ParsedAnimatedCell | ParsedStaticCell;

export interface ParsedRow {
  readonly id: string;
  readonly cells: Readonly<Record<string, ParsedCell>>;
}

export interface ParsedTable {
  readonly kind: "table";
  readonly rows: readonly ParsedRow[];
}

export interface ParsedRecord {
  readonly kind: "record";
  readonly fields: Readonly<Record<string, ParsedCell>>;
}

/** The authored shape selects a table or a record; there is no normalization between them. */
export type ParsedValues = ParsedTable | ParsedRecord;

export interface ParsedInput {
  readonly values?: ParsedValues;
  readonly requires: Readonly<Record<string, SourceBinding>>;
  readonly schema?: ValueSpec;
}

export interface ParsedTrack {
  readonly id: string;
  readonly plugin?: string;
  readonly input: ParsedInput;
  readonly duration?: number;
}

export interface ParseContext {
  /** Answers whether a plugin id names an admitted plugin. Phase 3 supplies the real registry. */
  readonly isPluginRegistered?: (pluginId: string) => boolean;
}

const RESERVED_NAMES: ReadonlySet<string> = new Set(["__proto__", "constructor", "prototype"]);
const TRACK_FIELDS: ReadonlySet<string> = new Set(["id", "plugin", "input", "duration"]);
const LEGACY_FIELDS: ReadonlySet<string> = new Set(["keyframes", "observes"]);
const INPUT_FIELDS: ReadonlySet<string> = new Set(["values", "requires", "schema"]);
const ROW_FIELDS: ReadonlySet<string> = new Set(["id", "cells"]);
const STOP_FIELDS: ReadonlySet<string> = new Set(["p", "v", "ease"]);
const TABLE_SPEC_FIELDS: ReadonlySet<string> = new Set(["kind", "schema", "optional"]);
const RECORD_SPEC_FIELDS: ReadonlySet<string> = new Set([
  "kind",
  "fields",
  "additionalProperties",
  "optional",
]);
const ANY_SPEC_FIELDS: ReadonlySet<string> = new Set([...TABLE_SPEC_FIELDS, ...RECORD_SPEC_FIELDS]);
const TABLE_SCHEMA_FIELDS: ReadonlySet<string> = new Set(["row", "minRows", "maxRows"]);
const ROW_SCHEMA_FIELDS: ReadonlySet<string> = new Set(["fields", "additionalProperties"]);
const FIELD_SPEC_FIELDS: ReadonlySet<string> = new Set([
  "kind",
  "optional",
  "enum",
  "min",
  "max",
  "static",
]);

const EMPTY_DIAGNOSTICS: readonly Diagnostic[] = Object.freeze([]);
const EMPTY_REQUIRES: Readonly<Record<string, SourceBinding>> = Object.freeze({});
const EMPTY_STATIC_FIELDS: ReadonlySet<string> = new Set<string>();
const EMPTY_INPUT: ParsedInput = Object.freeze({ requires: EMPTY_REQUIRES });

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isScalar(value: unknown): value is Scalar {
  return (
    typeof value === "string" ||
    typeof value === "boolean" ||
    (typeof value === "number" && Number.isFinite(value))
  );
}

function scalarKind(value: Scalar): ScalarKind {
  switch (typeof value) {
    case "number":
      return "number";
    case "string":
      return "string";
    case "boolean":
      return "boolean";
    default:
      return unreachable(value);
  }
}

function hasError(diagnostics: readonly Diagnostic[]): boolean {
  return diagnostics.some(({ severity }) => severity === "error");
}

function trackFieldUnknown(path: string, message: string): Diagnostic {
  return diagnostic("track-field-unknown", path, message);
}

function specFieldUnknown(path: string, message: string): Diagnostic {
  return diagnostic("spec-field-unknown", path, message);
}

function readId(value: unknown, path: string, diagnostics: Diagnostic[]): string | undefined {
  if (typeof value !== "string" || value.length === 0) {
    diagnostics.push(diagnostic("id-shape", path, "Track id must be a non-empty string."));
    return undefined;
  }
  if (value.includes("/"))
    diagnostics.push(
      diagnostic("id-qualified-separator", path, `Track id '${value}' must not contain '/'.`),
    );
  return value;
}

function readDuration(value: unknown, path: string, diagnostics: Diagnostic[]): number | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    diagnostics.push(
      diagnostic(
        "track-shape",
        path,
        "Track duration must be a finite number greater than or equal to zero.",
      ),
    );
    return undefined;
  }
  return value;
}

function readPlugin(
  value: unknown,
  path: string,
  context: ParseContext,
  diagnostics: Diagnostic[],
): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== "string" || value.length === 0) {
    diagnostics.push(
      diagnostic(
        "plugin-unknown",
        path,
        "Plugin id must be a non-empty string naming a registered plugin.",
      ),
    );
    return undefined;
  }
  if (!context.isPluginRegistered?.(value))
    diagnostics.push(diagnostic("plugin-unknown", path, `Plugin '${value}' is not registered.`));
  return value;
}

function readRequires(
  value: unknown,
  path: string,
  diagnostics: Diagnostic[],
): Readonly<Record<string, SourceBinding>> {
  if (value === undefined) return EMPTY_REQUIRES;
  if (!isRecord(value)) {
    diagnostics.push(trackFieldUnknown(path, "Track requires must be an object of slot bindings."));
    return EMPTY_REQUIRES;
  }
  const entries: [string, SourceBinding][] = [];
  for (const [slot, binding] of Object.entries(value)) {
    const bindingPath = `${path}.${slot}`;
    if (typeof binding === "string") {
      if (binding.length === 0) {
        diagnostics.push(
          diagnostic(
            "requirement-source",
            bindingPath,
            "A source binding must name a non-empty track id.",
            [binding],
          ),
        );
        continue;
      }
      entries.push([slot, binding]);
      continue;
    }
    if (isRecord(binding)) {
      const members: [string, string][] = [];
      for (const [memberKey, source] of Object.entries(binding)) {
        if (typeof source !== "string" || source.length === 0) {
          diagnostics.push(
            diagnostic(
              "requirement-source",
              `${bindingPath}.${memberKey}`,
              "A map binding must name a non-empty track id for each member.",
              [String(source)],
            ),
          );
          continue;
        }
        members.push([memberKey, source]);
      }
      entries.push([slot, Object.freeze(Object.fromEntries(members))]);
      continue;
    }
    diagnostics.push(
      diagnostic(
        "requirement-source",
        bindingPath,
        "A source binding must be a track id or a map of member keys to track ids.",
        [String(binding)],
      ),
    );
  }
  return Object.freeze(Object.fromEntries(entries));
}

/**
 * A presence flag in the spec vocabulary is the literal `true` or it is absent.
 *
 * `false` is refused rather than read as the default, because the type says `optional?: true` and
 * `static?: true`; a document that writes `false` is asking for a member the contract does not have.
 */
function readTrueFlag(
  value: Record<string, unknown>,
  key: string,
  path: string,
  diagnostics: Diagnostic[],
): true | undefined {
  if (!Object.hasOwn(value, key) || value[key] === undefined) return undefined;
  if (value[key] !== true) {
    diagnostics.push(specFieldUnknown(`${path}.${key}`, `${key} must be true when present.`));
    return undefined;
  }
  return true;
}

function readBooleanFlag(
  value: Record<string, unknown>,
  key: string,
  path: string,
  diagnostics: Diagnostic[],
): boolean | undefined {
  if (!Object.hasOwn(value, key) || value[key] === undefined) return undefined;
  const flag = value[key];
  if (typeof flag !== "boolean") {
    diagnostics.push(specFieldUnknown(`${path}.${key}`, `${key} must be a boolean when present.`));
    return undefined;
  }
  return flag;
}

function isStringArray(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function readRowCount(
  value: Record<string, unknown>,
  key: string,
  path: string,
  diagnostics: Diagnostic[],
): number | undefined {
  if (!Object.hasOwn(value, key) || value[key] === undefined) return undefined;
  const count = value[key];
  if (typeof count !== "number" || !Number.isInteger(count) || count < 0) {
    diagnostics.push(
      specFieldUnknown(`${path}.${key}`, `${key} must be a non-negative integer when present.`),
    );
    return undefined;
  }
  return count;
}

function readBound(
  value: Record<string, unknown>,
  key: string,
  path: string,
  numericKind: boolean,
  diagnostics: Diagnostic[],
): number | undefined {
  if (!Object.hasOwn(value, key) || value[key] === undefined) return undefined;
  if (!numericKind) {
    diagnostics.push(
      specFieldUnknown(`${path}.${key}`, `${key} is only meaningful on a number field.`),
    );
    return undefined;
  }
  const bound = value[key];
  if (typeof bound !== "number" || !Number.isFinite(bound)) {
    diagnostics.push(
      specFieldUnknown(`${path}.${key}`, `${key} must be a finite number when present.`),
    );
    return undefined;
  }
  return bound;
}

function readFieldSpec(
  value: unknown,
  path: string,
  diagnostics: Diagnostic[],
): FieldSpec | undefined {
  if (!isRecord(value)) {
    diagnostics.push(specFieldUnknown(path, "A field spec must be an object."));
    return undefined;
  }
  for (const key of Object.keys(value))
    if (!FIELD_SPEC_FIELDS.has(key))
      diagnostics.push(
        specFieldUnknown(`${path}.${key}`, "Field spec member is not part of the contract."),
      );
  const kind = value.kind;
  if (kind !== "number" && kind !== "string" && kind !== "boolean") {
    diagnostics.push(
      specFieldUnknown(`${path}.kind`, "Field kind must be 'number', 'string' or 'boolean'."),
    );
    return undefined;
  }
  const optional = readTrueFlag(value, "optional", path, diagnostics);
  const staticField = readTrueFlag(value, "static", path, diagnostics);
  const numericKind = kind === "number";
  const min = readBound(value, "min", path, numericKind, diagnostics);
  const max = readBound(value, "max", path, numericKind, diagnostics);
  if (min !== undefined && max !== undefined && min > max)
    diagnostics.push(specFieldUnknown(`${path}.min`, "min must not exceed max."));
  let enumValues: readonly string[] | undefined;
  if (Object.hasOwn(value, "enum") && value.enum !== undefined) {
    const authored = value.enum;
    if (kind !== "string")
      diagnostics.push(
        specFieldUnknown(`${path}.enum`, "enum is only meaningful on a string field."),
      );
    else if (!isStringArray(authored))
      diagnostics.push(specFieldUnknown(`${path}.enum`, "enum must be an array of strings."));
    else enumValues = Object.freeze([...authored]);
  }
  return Object.freeze({
    kind,
    ...(optional === undefined ? {} : { optional }),
    ...(enumValues === undefined ? {} : { enum: enumValues }),
    ...(min === undefined ? {} : { min }),
    ...(max === undefined ? {} : { max }),
    ...(staticField === undefined ? {} : { static: staticField }),
  });
}

function readFields(
  value: unknown,
  path: string,
  diagnostics: Diagnostic[],
): Readonly<Record<string, FieldSpec>> | undefined {
  if (!isRecord(value)) {
    diagnostics.push(specFieldUnknown(path, "Fields must be an object of field specs."));
    return undefined;
  }
  const entries: [string, FieldSpec][] = [];
  for (const [name, raw] of Object.entries(value)) {
    const fieldPath = `${path}.${name}`;
    if (RESERVED_NAMES.has(name)) {
      diagnostics.push(diagnostic("name-reserved", fieldPath, `Field name '${name}' is reserved.`));
      continue;
    }
    const spec = readFieldSpec(raw, fieldPath, diagnostics);
    if (spec !== undefined) entries.push([name, spec]);
  }
  return Object.freeze(Object.fromEntries(entries));
}

function readTableSpec(
  value: Record<string, unknown>,
  path: string,
  diagnostics: Diagnostic[],
): ValueSpec | undefined {
  const schemaValue = value.schema;
  if (!isRecord(schemaValue)) {
    diagnostics.push(specFieldUnknown(`${path}.schema`, "A table ValueSpec requires schema."));
    return undefined;
  }
  for (const key of Object.keys(schemaValue))
    if (!TABLE_SCHEMA_FIELDS.has(key))
      diagnostics.push(
        specFieldUnknown(
          `${path}.schema.${key}`,
          "Table schema member is not part of the contract.",
        ),
      );
  const rowValue = schemaValue.row;
  if (!isRecord(rowValue)) {
    diagnostics.push(specFieldUnknown(`${path}.schema.row`, "A table schema requires a row."));
    return undefined;
  }
  for (const key of Object.keys(rowValue))
    if (!ROW_SCHEMA_FIELDS.has(key))
      diagnostics.push(
        specFieldUnknown(
          `${path}.schema.row.${key}`,
          "Row schema member is not part of the contract.",
        ),
      );
  const fields = readFields(rowValue.fields, `${path}.schema.row.fields`, diagnostics);
  if (fields === undefined) return undefined;
  const additionalProperties = readBooleanFlag(
    rowValue,
    "additionalProperties",
    `${path}.schema.row`,
    diagnostics,
  );
  const minRows = readRowCount(schemaValue, "minRows", `${path}.schema`, diagnostics);
  const maxRows = readRowCount(schemaValue, "maxRows", `${path}.schema`, diagnostics);
  if (minRows !== undefined && maxRows !== undefined && minRows > maxRows)
    diagnostics.push(
      specFieldUnknown(`${path}.schema.minRows`, "minRows must not exceed maxRows."),
    );
  const optional = readTrueFlag(value, "optional", path, diagnostics);
  return Object.freeze({
    kind: "table",
    schema: Object.freeze({
      row: Object.freeze({
        fields,
        ...(additionalProperties === undefined ? {} : { additionalProperties }),
      }),
      ...(minRows === undefined ? {} : { minRows }),
      ...(maxRows === undefined ? {} : { maxRows }),
    }),
    ...(optional === undefined ? {} : { optional }),
  });
}

function readRecordSpec(
  value: Record<string, unknown>,
  path: string,
  diagnostics: Diagnostic[],
): ValueSpec | undefined {
  const fields = readFields(value.fields, `${path}.fields`, diagnostics);
  if (fields === undefined) return undefined;
  const additionalProperties = readBooleanFlag(value, "additionalProperties", path, diagnostics);
  const optional = readTrueFlag(value, "optional", path, diagnostics);
  return Object.freeze({
    kind: "record",
    fields,
    ...(additionalProperties === undefined ? {} : { additionalProperties }),
    ...(optional === undefined ? {} : { optional }),
  });
}

function readValueSpec(
  value: unknown,
  path: string,
  diagnostics: Diagnostic[],
): ValueSpec | undefined {
  if (!isRecord(value)) {
    diagnostics.push(specFieldUnknown(path, "A ValueSpec must be an object."));
    return undefined;
  }
  const kind = value.kind;
  const allowed =
    kind === "table" ? TABLE_SPEC_FIELDS : kind === "record" ? RECORD_SPEC_FIELDS : ANY_SPEC_FIELDS;
  for (const key of Object.keys(value)) {
    if (key === "type") {
      diagnostics.push(
        specFieldUnknown(`${path}.type`, "ValueSpec declares kind, never the retired type alias."),
      );
      continue;
    }
    if (!allowed.has(key))
      diagnostics.push(
        specFieldUnknown(`${path}.${key}`, "ValueSpec member is not part of the contract."),
      );
  }
  if (!Object.hasOwn(value, "type") && kind !== "table" && kind !== "record") {
    diagnostics.push(
      specFieldUnknown(`${path}.kind`, "ValueSpec kind must be 'table' or 'record'."),
    );
    return undefined;
  }
  if (kind === "table") return readTableSpec(value, path, diagnostics);
  if (kind === "record") return readRecordSpec(value, path, diagnostics);
  return undefined;
}

function staticFieldsOf(schema: ValueSpec | undefined): ReadonlySet<string> {
  if (schema === undefined) return EMPTY_STATIC_FIELDS;
  const fields = schema.kind === "table" ? schema.schema.row.fields : schema.fields;
  const names = Object.entries(fields)
    .filter(([, spec]) => spec.static === true)
    .map(([name]) => name);
  return names.length === 0 ? EMPTY_STATIC_FIELDS : new Set(names);
}

function readStops(
  stops: readonly unknown[],
  path: string,
  diagnostics: Diagnostic[],
): ParsedAnimatedCell | undefined {
  if (stops.length === 0) {
    diagnostics.push(
      diagnostic("cell-stops-invalid", path, "A stop sequence must contain at least one stop."),
    );
    return undefined;
  }
  const parsed: ParsedStop[] = [];
  let scalar: ScalarKind | undefined;
  let invalid = false;
  let previousPosition: number | undefined;
  for (const [index, raw] of stops.entries()) {
    const stopPath = `${path}[${index}]`;
    if (!isRecord(raw)) {
      diagnostics.push(
        diagnostic("cell-stops-invalid", stopPath, "Each stop must be an object with p and v."),
      );
      invalid = true;
      continue;
    }
    for (const key of Object.keys(raw))
      if (!STOP_FIELDS.has(key)) {
        diagnostics.push(
          diagnostic(
            "cell-stops-invalid",
            `${stopPath}.${key}`,
            "Stop member is not part of the contract.",
          ),
        );
        invalid = true;
      }
    let position: number | undefined;
    if (typeof raw.p !== "number" || !Number.isFinite(raw.p) || raw.p < 0 || raw.p > 1) {
      diagnostics.push(
        diagnostic(
          "cell-stops-invalid",
          `${stopPath}.p`,
          "Stop position must be a finite number in [0, 1].",
        ),
      );
      invalid = true;
    } else if (previousPosition !== undefined && raw.p <= previousPosition) {
      diagnostics.push(
        diagnostic(
          "cell-stops-invalid",
          `${stopPath}.p`,
          "Stop positions must be strictly increasing.",
        ),
      );
      invalid = true;
      position = raw.p;
    } else position = raw.p;
    if (position !== undefined) previousPosition = position;
    let scalarValue: Scalar | undefined;
    if (isScalar(raw.v)) scalarValue = raw.v;
    else {
      diagnostics.push(
        diagnostic("cell-stops-invalid", `${stopPath}.v`, "Stop value must be a finite scalar."),
      );
      invalid = true;
    }
    if (scalarValue !== undefined) {
      const kind = scalarKind(scalarValue);
      if (scalar === undefined) scalar = kind;
      else if (scalar !== kind) {
        diagnostics.push(
          diagnostic(
            "cell-kind-conflict",
            `${stopPath}.v`,
            `Stop value kind '${kind}' conflicts with '${scalar}' in one sequence.`,
          ),
        );
        invalid = true;
      }
    }
    let ease: string | undefined;
    if (Object.hasOwn(raw, "ease") && raw.ease !== undefined) {
      if (typeof raw.ease !== "string" || raw.ease.length === 0) {
        diagnostics.push(
          diagnostic(
            "cell-stops-invalid",
            `${stopPath}.ease`,
            "Stop ease must be a non-empty string when present.",
          ),
        );
        invalid = true;
      } else if (index === 0) {
        diagnostics.push(
          diagnostic(
            "cell-stops-invalid",
            `${stopPath}.ease`,
            "The first stop has no preceding interval and cannot carry an ease.",
          ),
        );
        invalid = true;
      } else {
        ease = raw.ease;
        if (scalarValue !== undefined && scalarKind(scalarValue) !== "number") {
          diagnostics.push(
            diagnostic(
              "cell-stops-invalid",
              `${stopPath}.ease`,
              "Ease applies only to numeric sequences.",
            ),
          );
          invalid = true;
        }
      }
    }
    if (position !== undefined && scalarValue !== undefined)
      parsed.push(
        Object.freeze({
          p: position,
          v: scalarValue,
          ...(ease === undefined ? {} : { ease }),
        }),
      );
  }
  if (invalid || scalar === undefined) return undefined;
  return Object.freeze({ kind: "animated", scalar, stops: Object.freeze(parsed) });
}

function readCell(
  value: unknown,
  path: string,
  staticField: boolean,
  diagnostics: Diagnostic[],
): ParsedCell | undefined {
  const leaf = readAuthoredLeaf(value);
  switch (leaf.kind) {
    case "static":
      return Object.freeze({
        kind: "static",
        scalar: scalarKind(leaf.value),
        value: leaf.value,
      });
    case "animated":
      if (staticField)
        diagnostics.push(
          diagnostic(
            "static-field-stops",
            path,
            "A static field accepts a scalar and refuses every stop sequence, including one stop.",
          ),
        );
      return readStops(leaf.stops, path, diagnostics);
    case "empty":
    case "wrapper":
    case "invalid":
      diagnostics.push(
        diagnostic(
          "cell-form-invalid",
          path,
          leaf.kind === "wrapper"
            ? "A cell is a scalar or a bare stop array; the retired { stops } wrapper is refused."
            : "A cell must be a finite scalar or a non-empty stop array.",
        ),
      );
      return undefined;
    default:
      return unreachable(leaf);
  }
}

function readCells(
  cells: Record<string, unknown>,
  path: string,
  staticFields: ReadonlySet<string>,
  diagnostics: Diagnostic[],
): Readonly<Record<string, ParsedCell>> {
  const entries: [string, ParsedCell][] = [];
  for (const [name, raw] of Object.entries(cells)) {
    const cellPath = `${path}.${name}`;
    if (RESERVED_NAMES.has(name)) {
      diagnostics.push(diagnostic("name-reserved", cellPath, `Cell name '${name}' is reserved.`));
      continue;
    }
    const cell = readCell(raw, cellPath, staticFields.has(name), diagnostics);
    if (cell !== undefined) entries.push([name, cell]);
  }
  return Object.freeze(Object.fromEntries(entries));
}

function readRowId(
  value: unknown,
  path: string,
  seen: Set<string>,
  diagnostics: Diagnostic[],
): string | undefined {
  if (typeof value !== "string" || value.length === 0) {
    diagnostics.push(diagnostic("row-id-invalid", path, "Row id must be a non-empty string."));
    return undefined;
  }
  if (RESERVED_NAMES.has(value))
    diagnostics.push(diagnostic("name-reserved", path, `Row id '${value}' is reserved.`));
  if (seen.has(value))
    diagnostics.push(diagnostic("row-id-duplicate", path, `Row id '${value}' is duplicated.`));
  else seen.add(value);
  return value;
}

function readTable(
  rows: readonly unknown[],
  path: string,
  staticFields: ReadonlySet<string>,
  diagnostics: Diagnostic[],
): ParsedTable {
  const parsed: ParsedRow[] = [];
  const seen = new Set<string>();
  for (const [index, raw] of rows.entries()) {
    const rowPath = `${path}[${index}]`;
    if (!isRecord(raw)) {
      diagnostics.push(
        diagnostic(
          "row-id-invalid",
          rowPath,
          "A row must be an object with a string id and a cells object; flat rows are refused.",
        ),
      );
      continue;
    }
    for (const key of Object.keys(raw))
      if (!ROW_FIELDS.has(key))
        diagnostics.push(
          trackFieldUnknown(`${rowPath}.${key}`, "Row member is not part of the envelope."),
        );
    const id = readRowId(raw.id, `${rowPath}.id`, seen, diagnostics);
    if (id === undefined) continue;
    if (!isRecord(raw.cells)) {
      diagnostics.push(
        diagnostic("cell-form-invalid", `${rowPath}.cells`, "Row cells must be an object."),
      );
      continue;
    }
    parsed.push(
      Object.freeze({
        id,
        cells: readCells(raw.cells, `${rowPath}.cells`, staticFields, diagnostics),
      }),
    );
  }
  return Object.freeze({ kind: "table", rows: Object.freeze(parsed) });
}

function readRecord(
  fields: Record<string, unknown>,
  path: string,
  staticFields: ReadonlySet<string>,
  diagnostics: Diagnostic[],
): ParsedRecord {
  return Object.freeze({
    kind: "record",
    fields: readCells(fields, path, staticFields, diagnostics),
  });
}

function readValues(
  value: unknown,
  path: string,
  schema: ValueSpec | undefined,
  diagnostics: Diagnostic[],
): ParsedValues | undefined {
  if (value === undefined) return undefined;
  if (Array.isArray(value)) {
    if (schema !== undefined && schema.kind !== "table") {
      diagnostics.push(
        diagnostic(
          "values-shape-invalid",
          path,
          `Authored values are a table but input.schema declares a ${schema.kind}.`,
        ),
      );
      return undefined;
    }
    return readTable(value, path, staticFieldsOf(schema), diagnostics);
  }
  if (isRecord(value)) {
    if (schema !== undefined && schema.kind !== "record") {
      diagnostics.push(
        diagnostic(
          "values-shape-invalid",
          path,
          `Authored values are a record but input.schema declares a ${schema.kind}.`,
        ),
      );
      return undefined;
    }
    return readRecord(value, path, staticFieldsOf(schema), diagnostics);
  }
  diagnostics.push(
    diagnostic(
      "values-shape-invalid",
      path,
      "input.values must be a table (array of rows) or a record (plain object).",
    ),
  );
  return undefined;
}

function readInput(
  value: unknown,
  path: string,
  authoredPlugin: boolean,
  diagnostics: Diagnostic[],
): ParsedInput {
  if (value === undefined) return EMPTY_INPUT;
  if (!isRecord(value)) {
    diagnostics.push(trackFieldUnknown(path, "Track input must be an object."));
    return EMPTY_INPUT;
  }
  for (const key of Object.keys(value))
    if (!INPUT_FIELDS.has(key))
      diagnostics.push(
        trackFieldUnknown(`${path}.${key}`, "Input member is not part of the contract."),
      );
  const requires = readRequires(value.requires, `${path}.requires`, diagnostics);
  if (!authoredPlugin && Object.keys(requires).length > 0)
    diagnostics.push(
      diagnostic(
        "plugin-requires-without-plugin",
        `${path}.requires`,
        "A track without a plugin has nothing that owns its required inputs.",
      ),
    );
  let schema: ValueSpec | undefined;
  if (value.schema !== undefined) {
    if (authoredPlugin)
      diagnostics.push(
        diagnostic(
          "input-schema-on-plugin-track",
          `${path}.schema`,
          "A plugin track takes its input contract from the plugin, not input.schema.",
        ),
      );
    else schema = readValueSpec(value.schema, `${path}.schema`, diagnostics);
  }
  const values = readValues(value.values, `${path}.values`, schema, diagnostics);
  return Object.freeze({
    ...(values === undefined ? {} : { values }),
    requires,
    ...(schema === undefined ? {} : { schema }),
  });
}

/**
 * Parse one authored track.
 *
 * `path` is the authored path of the track itself, so every diagnostic reads as the document the
 * author typed rather than as an offset in a compiler table. The result is frozen and carries only
 * validated members; a refused outcome carries every diagnostic this pass could find, not just the
 * first.
 */
export function parseTrackDefinition(
  track: unknown,
  path: string,
  context: ParseContext = {},
): Outcome<ParsedTrack, Diagnostic> {
  const diagnostics: Diagnostic[] = [];
  if (!isRecord(track)) {
    diagnostics.push(diagnostic("track-shape", path, "Track must be an object."));
    return refusedOutcomeFrom(diagnostics);
  }
  for (const key of Object.keys(track)) {
    if (LEGACY_FIELDS.has(key))
      diagnostics.push(
        diagnostic(
          "track-legacy-field",
          `${path}.${key}`,
          "Grouped keyframes and observes are not part of the identified-table contract.",
        ),
      );
    else if (!TRACK_FIELDS.has(key))
      diagnostics.push(
        trackFieldUnknown(`${path}.${key}`, "Track member is not part of the contract."),
      );
  }
  const id = readId(track.id, `${path}.id`, diagnostics);
  const plugin = readPlugin(track.plugin, `${path}.plugin`, context, diagnostics);
  const duration = readDuration(track.duration, `${path}.duration`, diagnostics);
  const input = readInput(track.input, `${path}.input`, track.plugin !== undefined, diagnostics);
  if (id === undefined || hasError(diagnostics)) return refusedOutcomeFrom(diagnostics);
  return acceptedOutcome(
    Object.freeze({
      id,
      ...(plugin === undefined ? {} : { plugin }),
      input,
      ...(duration === undefined ? {} : { duration }),
    }),
    EMPTY_DIAGNOSTICS,
  );
}
