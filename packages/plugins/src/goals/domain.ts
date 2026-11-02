/** Goal rows keyed by their static member target, pure. */

export type Scalar = number | string | boolean;
export type Cells = Readonly<Record<string, Scalar>>;

export interface GoalRow {
  readonly id: string;
  readonly cells: Cells;
}

export interface GoalsStructure {
  readonly rows: readonly { readonly id: string; readonly memberId: string }[];
  readonly byMember: ReadonlyMap<string, string>;
}

export interface Goals {
  readonly rows: readonly GoalRow[];
  readonly byMember: ReadonlyMap<string, GoalRow>;
}

export type GoalsError =
  | { readonly kind: "table-shape"; readonly message: string }
  | { readonly kind: "row-shape"; readonly index: number }
  | { readonly kind: "row-id"; readonly index: number }
  | { readonly kind: "row-id-duplicate"; readonly id: string }
  | { readonly kind: "member-shape"; readonly id: string }
  | { readonly kind: "member-duplicate"; readonly memberId: string };

export type GoalsResult =
  | { readonly ok: true; readonly value: GoalsStructure }
  | { readonly ok: false; readonly errors: readonly GoalsError[] };

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

/** Parses a goal table: ids are unique and every row names exactly one member. */
export function parseGoals(value: unknown): GoalsResult {
  if (!Array.isArray(value))
    return {
      ok: false,
      errors: [{ kind: "table-shape", message: "Goal values must be a table." }],
    };
  const errors: GoalsError[] = [];
  const rows: { id: string; memberId: string }[] = [];
  const seenIds = new Set<string>();
  const byMember = new Map<string, string>();
  for (const [index, raw] of value.entries()) {
    if (!isRecord(raw) || typeof raw.id !== "string" || !isRecord(raw.cells)) {
      errors.push({ kind: "row-shape", index });
      continue;
    }
    if (raw.id.length === 0) {
      errors.push({ kind: "row-id", index });
      continue;
    }
    if (seenIds.has(raw.id)) errors.push({ kind: "row-id-duplicate", id: raw.id });
    else seenIds.add(raw.id);
    const memberId = raw.cells.memberId;
    if (typeof memberId !== "string" || memberId.length === 0) {
      errors.push({ kind: "member-shape", id: raw.id });
      continue;
    }
    if (byMember.has(memberId)) errors.push({ kind: "member-duplicate", memberId });
    else byMember.set(memberId, raw.id);
    rows.push({ id: raw.id, memberId });
  }
  if (errors.length > 0) return { ok: false, errors: Object.freeze(errors) };
  return {
    ok: true,
    value: Object.freeze({
      rows: Object.freeze(rows),
      byMember,
    }),
  };
}

/** Joins goal targets with one frame's evaluated cells; the target is static. */
export function bindGoals(structure: GoalsStructure, value: unknown): Goals {
  if (!Array.isArray(value)) throw new TypeError("A goals entity requires a table.");
  const rows: GoalRow[] = [];
  const byMember = new Map<string, GoalRow>();
  const byId = new Map<string, Readonly<Record<string, unknown>>>();
  for (const [index, raw] of value.entries()) {
    if (!isRecord(raw) || typeof raw.id !== "string" || !isRecord(raw.cells))
      throw new TypeError(`Goal row at index ${index} must have id and cells.`);
    byId.set(raw.id, raw.cells);
  }
  if (byId.size !== value.length)
    throw new TypeError("Goal row ids changed or duplicated after commit.");
  if (byId.size !== structure.rows.length)
    throw new TypeError("Goal row set changed after commit.");
  for (const row of structure.rows) {
    const rawCells = byId.get(row.id);
    if (rawCells === undefined)
      throw new TypeError(`Goal row '${row.id}' is missing after commit.`);
    if (rawCells.memberId !== row.memberId)
      throw new TypeError(`Goal row '${row.id}' changed its member after commit.`);
    const cells: Record<string, Scalar> = {};
    for (const [name, cell] of Object.entries(rawCells)) {
      if (!isScalar(cell)) throw new TypeError(`Goal row '${row.id}' has a non-scalar cell.`);
      cells[name] = cell;
    }
    const goal: GoalRow = { id: row.id, cells: Object.freeze(cells) };
    rows.push(goal);
    byMember.set(row.memberId, goal);
  }
  return Object.freeze({ rows: Object.freeze(rows), byMember });
}
