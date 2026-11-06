/** Reads one row by table index; a missing or moved row is a structural bug. */
export function rowAtIndex<R extends { readonly id: string }>(
  rows: readonly R[],
  index: number,
  id: string,
): R {
  const row = rows[index];
  if (row === undefined || row.id !== id)
    throw new TypeError(`Row '${id}' does not match its committed position.`);
  return row;
}

/** Reads one row through a structure's table index. */
export function rowAt<R extends { readonly id: string }>(
  rows: readonly R[],
  tableIndex: readonly number[],
  position: number,
  id: string,
): R {
  return rowAtIndex(rows, tableIndex[position] ?? -1, id);
}

/** Refuses a table whose row count differs from the committed structure. */
export function sameRowCount(rows: readonly unknown[], expected: number, what: string): void {
  if (rows.length !== expected) throw new TypeError(`${what} row set changed after commit.`);
}
