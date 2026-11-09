import { unreachable } from "../lang/exhaustive";
import { isScalar } from "./v5-parse";
import type { FlatRecord, Row } from "./v5";

/** Named-output selection: one owner; success returns the original, never a copy.
 * `missing-output` is exactly `undefined`; `missing-row` needs a valid table, else `wrong-kind`. */

/** Result of selecting a flat record from one named output. */
export type RecordSelection =
  | { readonly kind: "record"; readonly values: FlatRecord }
  | { readonly kind: "missing-output" }
  | { readonly kind: "wrong-kind" };

/** Result of selecting one row from a table output. */
export type RowSelection =
  | { readonly kind: "row"; readonly cells: Row["cells"] }
  | { readonly kind: "missing-output" }
  | { readonly kind: "missing-row" }
  | { readonly kind: "wrong-kind" };

/** A plain record: not an array, a class instance, or a primitive.
 * Structural only; scalar validation belongs to the selectors. */
export function isFlatRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function isScalarRecord(value: unknown): value is FlatRecord {
  return isFlatRecord(value) && Object.values(value).every(isScalar);
}

// Envelope id is identity; a `cells.id` column is ordinary data, not special.
function isRow(value: unknown): value is Row {
  if (!isFlatRecord(value)) return false;
  const { id, cells } = value;
  return typeof id === "string" && id.length > 0 && isScalarRecord(cells);
}

type TableScan =
  | { readonly kind: "invalid" }
  | {
      readonly kind: "valid";
      readonly count: number;
      readonly match: Row | undefined;
      readonly first: Row | undefined;
    };

const INVALID_TABLE: TableScan = Object.freeze({ kind: "invalid" });

// Whole table must be valid: a duplicate id or sparse hole anywhere is `wrong-kind`.
function scanTable(output: unknown, rowId: string | undefined): TableScan {
  if (!Array.isArray(output)) return INVALID_TABLE;
  const seen = new Set<string>();
  let match: Row | undefined;
  let first: Row | undefined;
  for (let index = 0; index < output.length; index += 1) {
    if (!(index in output)) return INVALID_TABLE;
    const candidate: unknown = output[index];
    if (!isRow(candidate) || seen.has(candidate.id)) return INVALID_TABLE;
    seen.add(candidate.id);
    if (index === 0) first = candidate;
    if (candidate.id === rowId) match = candidate;
  }
  return { kind: "valid", count: output.length, match, first };
}

/** A flat record, or the reason one cannot be selected. */
export function selectRecord(output: unknown): RecordSelection {
  if (output === undefined) return { kind: "missing-output" };
  if (!isScalarRecord(output)) return { kind: "wrong-kind" };
  return { kind: "record", values: output };
}

/** One row by envelope id, or the reason it cannot be selected. */
export function selectRow(output: unknown, rowId: string): RowSelection {
  if (output === undefined) return { kind: "missing-output" };
  const scan = scanTable(output, rowId);
  switch (scan.kind) {
    case "invalid":
      return { kind: "wrong-kind" };
    case "valid":
      return scan.match === undefined
        ? { kind: "missing-row" }
        : { kind: "row", cells: scan.match.cells };
    default:
      return unreachable(scan);
  }
}

/** The one row of a table that is required to hold exactly one.
 * Empty is `missing-row`; two or more is `wrong-kind`, as is any malformed table. */
export function selectSingleRow(output: unknown): RowSelection {
  if (output === undefined) return { kind: "missing-output" };
  const scan = scanTable(output, undefined);
  switch (scan.kind) {
    case "invalid":
      return { kind: "wrong-kind" };
    case "valid":
      switch (scan.count) {
        case 0:
          return { kind: "missing-row" };
        case 1:
          return scan.first === undefined
            ? { kind: "wrong-kind" }
            : { kind: "row", cells: scan.first.cells };
        default:
          return { kind: "wrong-kind" };
      }
    default:
      return unreachable(scan);
  }
}
