import type { FlatRecord, Scalar, Table, Value } from "../contract/v5";
import type { ParsedCell, ParsedValues } from "../contract/v5-parse";
import { freezeValue } from "../domain/values";
import { unreachable } from "../lang/exhaustive";

function committedValue(cell: ParsedCell): Scalar {
  switch (cell.kind) {
    case "static":
      return cell.value;
    case "animated": {
      const first = cell.stops[0];
      if (first === undefined) throw new TypeError("An animated cell requires at least one stop.");
      return first.v;
    }
    default:
      return unreachable(cell);
  }
}

function cellsOf(cells: Readonly<Record<string, ParsedCell>>): Record<string, Scalar> {
  const committed: Record<string, Scalar> = {};
  for (const [name, cell] of Object.entries(cells)) committed[name] = committedValue(cell);
  return committed;
}

/** The value a parsed track stands for at its first stop; commit checks read only its shape and static cells. */
export function authoringValue(values: ParsedValues | undefined): Value {
  if (values === undefined) return freezeValue([]) as Table;
  switch (values.kind) {
    case "table": {
      const rows = values.rows.map((row) => ({ id: row.id, cells: cellsOf(row.cells) }));
      return freezeValue(rows) as Table;
    }
    case "record":
      return freezeValue(cellsOf(values.fields)) as FlatRecord;
    default:
      return unreachable(values);
  }
}
