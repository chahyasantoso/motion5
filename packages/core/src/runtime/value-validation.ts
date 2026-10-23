import type { FieldSpec, Scalar, Value, ValueSpec } from "../contract/v5";
import { isImmutableLeaf } from "../domain/values";

/** One structural complaint about a runtime value, before a caller maps it to its own rule id. */
export interface ValueIssue {
  readonly path: string;
  readonly message: string;
  readonly code: "shape" | "field" | "row-id" | "row-id-duplicate" | "reserved" | "range";
}

export type ValueShape = "table" | "record" | "invalid";

const RESERVED_NAMES = new Set(["__proto__", "constructor", "prototype"]);

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

export function valueShape(value: unknown): ValueShape {
  if (Array.isArray(value)) return "table";
  return isPlainRecord(value) ? "record" : "invalid";
}

/** A runtime value after shape validation: a table or a flat record, never a scalar or host object. */
export function isValue(value: unknown): value is Value {
  return valueShape(value) !== "invalid";
}

function scalarOf(value: unknown): value is Scalar {
  return isImmutableLeaf(value);
}

function checkField(value: unknown, field: FieldSpec, path: string, issues: ValueIssue[]): void {
  if (!scalarOf(value) || typeof value !== field.kind) {
    issues.push({
      path,
      code: "field",
      message: `expected ${field.kind}, received ${typeof value}.`,
    });
    return;
  }
  if (typeof value === "number") {
    if (field.min !== undefined && value < field.min)
      issues.push({
        path,
        code: "range",
        message: `expected at least ${field.min}, received ${value}.`,
      });
    if (field.max !== undefined && value > field.max)
      issues.push({
        path,
        code: "range",
        message: `expected at most ${field.max}, received ${value}.`,
      });
  }
  if (typeof value === "string" && field.enum !== undefined && !field.enum.includes(value))
    issues.push({ path, code: "field", message: `expected one of ${field.enum.join(", ")}.` });
}

interface FieldsOptions {
  readonly extraFields: "allow" | "reject";
}

function checkFields(
  source: Readonly<Record<string, unknown>>,
  fields: Readonly<Record<string, FieldSpec>>,
  path: string,
  options: FieldsOptions,
  issues: ValueIssue[],
): void {
  for (const [name, field] of Object.entries(fields)) {
    if (!Object.hasOwn(source, name)) {
      if (field.optional !== true)
        issues.push({
          path: `${path}.${name}`,
          code: "field",
          message: "required value is absent.",
        });
      continue;
    }
    checkField(source[name], field, `${path}.${name}`, issues);
  }
  if (options.extraFields === "reject") {
    for (const name of Object.keys(source))
      if (!Object.hasOwn(fields, name))
        issues.push({
          path: `${path}.${name}`,
          code: "field",
          message: "field is not declared and the contract is closed.",
        });
  }
}

function checkTable(
  table: readonly unknown[],
  spec: Extract<ValueSpec, { readonly kind: "table" }>,
  path: string,
  options: FieldsOptions,
  issues: ValueIssue[],
): void {
  const { minRows, maxRows } = spec.schema;
  if (minRows !== undefined && table.length < minRows)
    issues.push({ path, code: "range", message: `expected at least ${minRows} rows.` });
  if (maxRows !== undefined && table.length > maxRows)
    issues.push({ path, code: "range", message: `expected at most ${maxRows} rows.` });
  const ids = new Set<string>();
  for (const [index, row] of table.entries()) {
    const rowPath = `${path}[${index}]`;
    if (!isPlainRecord(row)) {
      issues.push({
        path: rowPath,
        code: "shape",
        message: "row must be an object with id and cells.",
      });
      continue;
    }
    for (const key of Object.keys(row))
      if (key !== "id" && key !== "cells")
        issues.push({
          path: `${rowPath}.${key}`,
          code: "field",
          message: "row member is unknown.",
        });
    const id = row.id;
    if (typeof id !== "string" || id.length === 0) {
      issues.push({
        path: `${rowPath}.id`,
        code: "row-id",
        message: "row id must be a non-empty string.",
      });
    } else if (RESERVED_NAMES.has(id)) {
      issues.push({
        path: `${rowPath}.id`,
        code: "reserved",
        message: `row id '${id}' is reserved.`,
      });
    } else if (ids.has(id)) {
      issues.push({
        path: `${rowPath}.id`,
        code: "row-id-duplicate",
        message: `row id '${id}' is duplicated.`,
      });
    } else ids.add(id);
    const cells = row.cells;
    if (!isPlainRecord(cells)) {
      issues.push({ path: `${rowPath}.cells`, code: "shape", message: "cells must be an object." });
      continue;
    }
    for (const name of Object.keys(cells))
      if (RESERVED_NAMES.has(name))
        issues.push({
          path: `${rowPath}.cells.${name}`,
          code: "reserved",
          message: `field '${name}' is reserved.`,
        });
    checkFields(cells, spec.schema.row.fields, `${rowPath}.cells`, options, issues);
  }
}

function checkRecord(
  record: Readonly<Record<string, unknown>>,
  spec: Extract<ValueSpec, { readonly kind: "record" }>,
  path: string,
  options: FieldsOptions,
  issues: ValueIssue[],
): void {
  for (const name of Object.keys(record))
    if (RESERVED_NAMES.has(name))
      issues.push({
        path: `${path}.${name}`,
        code: "reserved",
        message: `field '${name}' is reserved.`,
      });
  checkFields(record, spec.fields, path, options, issues);
}

/**
 * Whether a runtime value matches a `ValueSpec`.
 *
 * The caller chooses whether extra fields are refused. Plugin input and plugin output contracts
 * default closed; a consumer slot is open because it reads only the outputs and fields it declares.
 * The shape mismatch is its own answer, because the authored parser and the runtime report it under
 * `values-shape-invalid` rather than under a field rule.
 */
export function validateRuntimeValue(
  value: unknown,
  spec: ValueSpec,
  path: string,
  options: FieldsOptions,
): readonly ValueIssue[] {
  const issues: ValueIssue[] = [];
  const shape = valueShape(value);
  if (spec.kind === "table") {
    if (!Array.isArray(value)) {
      issues.push({ path, code: "shape", message: `expected a table, received a ${shape}.` });
      return issues;
    }
    checkTable(value, spec, path, options, issues);
    return issues;
  }
  if (!isPlainRecord(value)) {
    issues.push({ path, code: "shape", message: `expected a record, received a ${shape}.` });
    return issues;
  }
  checkRecord(value, spec, path, options, issues);
  return issues;
}
