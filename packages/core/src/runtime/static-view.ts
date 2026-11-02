import type {
  AuthoredCell,
  AuthoredRow,
  AuthoredValues,
  Scalar,
  Value,
  ValueSpec,
} from "../contract/v5";
import { unreachable } from "../lang/exhaustive";

function isAuthoredTable(values: AuthoredValues): values is readonly AuthoredRow[] {
  return Array.isArray(values);
}

function isTable(
  value: Value,
): value is readonly { readonly id: string; readonly cells: Readonly<Record<string, Scalar>> }[] {
  return Array.isArray(value);
}

type StaticView =
  | { readonly kind: "record"; readonly fields: Readonly<Record<string, Scalar>> }
  | {
      readonly kind: "table";
      readonly rows: readonly {
        readonly id: string;
        readonly cells: Readonly<Record<string, Scalar>>;
      }[];
    }
  | { readonly kind: "absent" };

function staticFieldNames(spec: ValueSpec): readonly string[] {
  const fields = spec.kind === "table" ? spec.schema.row.fields : spec.fields;
  return Object.entries(fields)
    .filter(([, field]) => field.static === true)
    .map(([name]) => name)
    .sort();
}

function pickCells(
  cells: Readonly<Record<string, Scalar>>,
  names: readonly string[],
): Readonly<Record<string, Scalar>> {
  const picked: Record<string, Scalar> = {};
  for (const name of names) if (Object.hasOwn(cells, name)) picked[name] = cells[name]!;
  return Object.freeze(picked);
}

function authoredScalar(cell: AuthoredCell): Scalar | undefined {
  if (typeof cell === "number" || typeof cell === "string" || typeof cell === "boolean")
    return cell;
  const first = cell[0];
  return first === undefined ? undefined : (first.v as Scalar);
}

function authoredRecord(
  values: Readonly<Record<string, AuthoredCell>>,
  names: readonly string[],
): Readonly<Record<string, Scalar>> {
  const picked: Record<string, Scalar> = {};
  for (const name of names) {
    const cell = values[name];
    if (cell === undefined) continue;
    const scalar = authoredScalar(cell);
    if (scalar !== undefined) picked[name] = scalar;
  }
  return Object.freeze(picked);
}

/** The static projection of authored values; absent or wrong-shaped values project as `absent`. */
export function authoredStaticView(
  values: AuthoredValues | undefined,
  spec: ValueSpec,
): StaticView {
  if (values === undefined) return { kind: "absent" };
  const names = staticFieldNames(spec);
  switch (spec.kind) {
    case "table": {
      if (!isAuthoredTable(values)) return { kind: "absent" };
      return {
        kind: "table",
        rows: values.map((row) => ({
          id: row.id,
          cells: authoredRecord(row.cells, names),
        })),
      };
    }
    case "record": {
      if (isAuthoredTable(values)) return { kind: "absent" };
      return { kind: "record", fields: authoredRecord(values, names) };
    }
    default:
      return unreachable(spec);
  }
}

/** The static projection of an evaluated value. */
export function runtimeStaticView(value: Value, spec: ValueSpec): StaticView {
  const names = staticFieldNames(spec);
  switch (spec.kind) {
    case "table":
      if (!isTable(value)) return { kind: "absent" };
      return {
        kind: "table",
        rows: value.map((row) => ({ id: row.id, cells: pickCells(row.cells, names) })),
      };
    case "record":
      if (isTable(value)) return { kind: "absent" };
      return { kind: "record", fields: pickCells(value, names) };
    default:
      return unreachable(spec);
  }
}

function equalScalar(left: unknown, right: unknown): boolean {
  return typeof left === typeof right && Object.is(left, right);
}

function equalCells(
  left: Readonly<Record<string, Scalar>>,
  right: Readonly<Record<string, Scalar>>,
): boolean {
  const leftKeys = Object.keys(left).sort();
  const rightKeys = Object.keys(right).sort();
  if (leftKeys.length !== rightKeys.length) return false;
  for (let index = 0; index < leftKeys.length; index += 1) {
    const key = leftKeys[index]!;
    if (key !== rightKeys[index]) return false;
    if (!equalScalar(left[key], right[key])) return false;
  }
  return true;
}

/** Whether two static projections assert the same structural cells. */
export function sameStaticView(left: StaticView, right: StaticView): boolean {
  if (left.kind !== right.kind) return false;
  switch (left.kind) {
    case "absent":
      return true;
    case "record":
      return equalCells(left.fields, (right as typeof left).fields);
    case "table": {
      const rows = (right as typeof left).rows;
      if (left.rows.length !== rows.length) return false;
      for (let index = 0; index < left.rows.length; index += 1) {
        const a = left.rows[index]!;
        const b = rows[index]!;
        if (a.id !== b.id || !equalCells(a.cells, b.cells)) return false;
      }
      return true;
    }
    default:
      return unreachable(left);
  }
}
