import { unreachable } from "../lang/exhaustive";
import { isScalar } from "./v5-parse";
import type { FlatRecord, Row } from "./v5";

/**
 * The one owner of published-output selection.
 *
 * A published node answers with a named-outputs map, and every consumer that renders one has to say
 * which output it reads and which row it means. Left to each consumer, that answer became a local
 * predicate beside a cast: a table could reach a record writer as an object with numeric keys, the
 * first row could stand in for the one the caller asked for, and a duplicate row id could resolve to
 * whichever copy was written first. The selectors here are the single answer, and every consumer
 * handles their closed results rather than inventing a fallback. See ADR-092 and ADR-143.
 *
 * Selection is pure and total over `unknown`, because the render boundaries that read a patch are
 * untrusted inputs: `tableFrameSource` accepts an arbitrary value, and a cast at that boundary would
 * move the refusal one layer out without answering it. A successful result carries the original
 * immutable record or cells, never a copy, so a caller can compare references across publications
 * without asking whether the selector rebuilt something equal.
 *
 * `missing-output` is exactly `undefined`. A record passed to a table selector, a table passed to
 * `selectRecord`, a malformed table and a record with a non-scalar field are all `wrong-kind`;
 * `missing-row` is reserved for a valid table that does not hold the requested id.
 */

/** The result of selecting a flat record from one named output. */
export type RecordSelection =
  | { readonly kind: "record"; readonly values: FlatRecord }
  | { readonly kind: "missing-output" }
  | { readonly kind: "wrong-kind" };

/** The result of selecting one row from a table output. */
export type RowSelection =
  | { readonly kind: "row"; readonly cells: Row["cells"] }
  | { readonly kind: "missing-output" }
  | { readonly kind: "missing-row" }
  | { readonly kind: "wrong-kind" };

/**
 * A plain record: not an array, a class instance, or a primitive.
 *
 * Structural only, and deliberately so. Existing render boundaries asked this question to decide
 * whether a value has a key space at all, and a record whose fields are not scalars still answers
 * that question the same way. Whether the fields honour the published scalar contract is the
 * selector's question, not this guard's, so a caller that only needs the structure keeps the guard
 * it had and a caller that publishes through it asks `selectRecord` instead.
 */
export function isFlatRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

/** A plain record whose every own enumerable field is a published scalar. */
function isScalarRecord(value: unknown): value is FlatRecord {
  return isFlatRecord(value) && Object.values(value).every(isScalar);
}

/**
 * One table row: a non-empty string id and scalar cells.
 *
 * `cells.id` is ordinary data. The envelope id is the row's identity, and nothing here reads deeper
 * than the scalar contract, so an application column named `id` is neither special nor rejected.
 */
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
      /** The row whose envelope id is the requested one, if any. */
      readonly match: Row | undefined;
      /** The row at index zero, so a one-row table can be answered without a second pass. */
      readonly first: Row | undefined;
    };

const INVALID_TABLE: TableScan = Object.freeze({ kind: "invalid" });

/**
 * One walk over one table that decides validity and finds the requested row together.
 *
 * Validity is a property of the whole table, so the walk never stops at the first match: a duplicate
 * id after the requested row still makes the table ambiguous, and answering first-match would hide
 * that. A hole in a sparse array is malformed in the same way an absent row is not, and both are
 * checked before `missing-row` can be returned. The `Set` is per call and is not retained.
 */
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

/**
 * The one row of a table that is required to hold exactly one.
 *
 * An empty table is absence, not a type failure; more than one row is a type failure, because a
 * caller that asks for "the row" has not said which one and the selector will not choose for it. A
 * malformed table is `wrong-kind` before cardinality is considered, so a two-row table with a
 * malformed second row never reads as `wrong-kind` only because it is large.
 */
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
