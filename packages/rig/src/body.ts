/** Body topology, pure: no core import and no frame-time work. */

export type Scalar = number | string | boolean;
export type Cells = Readonly<Record<string, Scalar>>;

export type FieldShape = Readonly<Record<string, { readonly static?: true }>>;

export interface BodyRow {
  readonly id: string;
  readonly cells: Cells;
}

export interface BodyStructureRow {
  readonly id: string;
  readonly cells: Cells;
}

export interface BodyStructure {
  readonly rows: readonly BodyStructureRow[];
  readonly ids: readonly string[];
  readonly tableIndex: readonly number[];
  readonly roots: readonly string[];
  readonly leaves: readonly string[];
  readonly parentById: ReadonlyMap<string, string | undefined>;
  readonly childrenById: ReadonlyMap<string, readonly string[]>;
}

export type BodyError =
  | { readonly kind: "table-shape"; readonly message: string }
  | { readonly kind: "row-shape"; readonly index: number }
  | { readonly kind: "row-id"; readonly index: number }
  | { readonly kind: "row-id-duplicate"; readonly id: string }
  | { readonly kind: "parent-shape"; readonly id: string }
  | { readonly kind: "parent-unknown"; readonly id: string; readonly parentId: string }
  | { readonly kind: "parent-self"; readonly id: string }
  | { readonly kind: "parent-cycle"; readonly id: string }
  | {
      readonly kind: "range-inverted";
      readonly id: string;
      readonly field: "rotation" | "twist";
      readonly min: number;
      readonly max: number;
    };

export type BodyResult =
  | { readonly ok: true; readonly value: BodyStructure }
  | { readonly ok: false; readonly errors: readonly BodyError[] };

export const EXTERNAL_BASE = "";

function compareCodeUnits(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isScalar(value: unknown): value is Scalar {
  return (
    typeof value === "string" ||
    typeof value === "boolean" ||
    (typeof value === "number" && Number.isFinite(value))
  );
}

function readRows(value: unknown): BodyRow[] | BodyError {
  if (!Array.isArray(value))
    return { kind: "table-shape", message: "Body values must be a table." };
  const rows: BodyRow[] = [];
  for (const [index, raw] of value.entries()) {
    if (!isRecord(raw) || typeof raw.id !== "string" || !isRecord(raw.cells))
      return { kind: "row-shape", index };
    if (raw.id.length === 0) return { kind: "row-id", index };
    const cells: Record<string, Scalar> = {};
    for (const [name, cell] of Object.entries(raw.cells))
      if (!isScalar(cell)) return { kind: "row-shape", index };
      else cells[name] = cell;
    rows.push({ id: raw.id, cells: Object.freeze(cells) });
  }
  return rows;
}

function staticCells(row: BodyRow, fields: FieldShape): Cells {
  const cells: Record<string, Scalar> = {};
  for (const [name, field] of Object.entries(fields))
    if (field.static === true && Object.hasOwn(row.cells, name)) cells[name] = row.cells[name]!;
  return Object.freeze(cells);
}

function readParent(row: BodyRow): string | undefined | BodyError {
  const parent = row.cells.parentId;
  if (parent === undefined) return undefined;
  if (typeof parent !== "string" || parent.length === 0)
    return { kind: "parent-shape", id: row.id };
  return parent;
}

function invertedRanges(row: BodyRow): readonly BodyError[] {
  const errors: BodyError[] = [];
  for (const [minKey, maxKey, field] of [
    ["minRotation", "maxRotation", "rotation"],
    ["minTwist", "maxTwist", "twist"],
  ] as const) {
    const min = row.cells[minKey];
    const max = row.cells[maxKey];
    if (typeof min === "number" && typeof max === "number" && min > max)
      errors.push({ kind: "range-inverted", id: row.id, field, min, max });
  }
  return errors;
}

/** Parses one body table into its frozen topology; roots are rows that omit `parentId`. */
export function parseBody(value: unknown, fields: FieldShape): BodyResult {
  const rows = readRows(value);
  if (!Array.isArray(rows)) return { ok: false, errors: [rows] };
  const errors: BodyError[] = [];
  const byId = new Map<string, BodyRow>();
  for (const row of rows) {
    if (byId.has(row.id)) errors.push({ kind: "row-id-duplicate", id: row.id });
    else byId.set(row.id, row);
    errors.push(...invertedRanges(row));
  }
  const parentById = new Map<string, string | undefined>();
  const children = new Map<string, string[]>(rows.map((row) => [row.id, []]));
  for (const row of rows) {
    const parent = readParent(row);
    if (typeof parent === "object") {
      errors.push(parent);
      continue;
    }
    if (parent === row.id) {
      errors.push({ kind: "parent-self", id: row.id });
      continue;
    }
    if (parent !== undefined) {
      if (!byId.has(parent)) {
        errors.push({ kind: "parent-unknown", id: row.id, parentId: parent });
        continue;
      }
      children.get(parent)!.push(row.id);
    }
    parentById.set(row.id, parent);
  }
  if (errors.length > 0) return { ok: false, errors: Object.freeze(errors) };

  const depth = new Map<string, number>();
  const visit = (id: string, depthValue: number, path: Set<string>): void => {
    if (path.has(id)) {
      errors.push({ kind: "parent-cycle", id });
      return;
    }
    if (depth.has(id)) return;
    path.add(id);
    depth.set(id, depthValue);
    for (const child of children.get(id)!.sort(compareCodeUnits))
      visit(child, depthValue + 1, path);
    path.delete(id);
  };
  const roots = rows
    .filter((row) => parentById.get(row.id) === undefined)
    .map((row) => row.id)
    .sort(compareCodeUnits);
  for (const root of roots) visit(root, 0, new Set());
  for (const row of rows) if (!depth.has(row.id)) visit(row.id, 0, new Set());
  if (errors.length > 0) return { ok: false, errors: Object.freeze(errors) };

  const ids = rows
    .map((row) => row.id)
    .sort(
      (left, right) =>
        (depth.get(left) ?? 0) - (depth.get(right) ?? 0) || compareCodeUnits(left, right),
    );
  const childrenById = new Map<string, readonly string[]>(
    [...children].map(([id, childIds]) => [
      id,
      Object.freeze([...childIds].sort(compareCodeUnits)),
    ]),
  );
  const leaves = ids.filter((id) => childrenById.get(id)!.length === 0);
  const indexById = new Map(rows.map((row, index) => [row.id, index] as const));
  const tableIndex: number[] = [];
  for (const id of ids) {
    const index = indexById.get(id);
    if (index === undefined) throw new TypeError(`Body row '${id}' is missing from the table.`);
    tableIndex.push(index);
  }
  return {
    ok: true,
    value: Object.freeze({
      rows: Object.freeze(ids.map((id) => ({ id, cells: staticCells(byId.get(id)!, fields) }))),
      ids: Object.freeze(ids),
      tableIndex: Object.freeze(tableIndex),
      roots: Object.freeze(roots),
      leaves: Object.freeze(leaves),
      parentById,
      childrenById,
    }),
  };
}
