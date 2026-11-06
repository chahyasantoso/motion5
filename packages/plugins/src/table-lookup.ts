import type { Table } from "@motion5/core/plugin-api";

/** Reads one row by table index; a missing or moved row is a structural bug. */
export function rowAtIndex(rows: Table, index: number, id: string): Table[number] {
  const row = rows[index];
  if (row === undefined || row.id !== id)
    throw new TypeError(`Row '${id}' does not match its committed position.`);
  return row;
}

/** Reads one row through a structure's table index. */
export function rowAt(
  rows: Table,
  tableIndex: readonly number[],
  position: number,
  id: string,
): Table[number] {
  return rowAtIndex(rows, tableIndex[position] ?? -1, id);
}

/** Refuses a table whose row count differs from the committed structure. */
export function sameRowCount(rows: Table, expected: number, what: string): void {
  if (rows.length !== expected) throw new TypeError(`${what} row set changed after commit.`);
}
