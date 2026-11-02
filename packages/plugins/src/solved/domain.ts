/** Solved rotations, pure: the row set is structural, every cell is animated. */

export type Scalar = number | string | boolean;
export type Cells = Readonly<Record<string, Scalar>>;

export interface SolvedRow {
  readonly id: string;
  readonly cells: Cells;
}

export interface SolvedStructure {
  readonly ids: readonly string[];
}

export interface Solved {
  readonly rows: readonly SolvedRow[];
  readonly byId: ReadonlyMap<string, SolvedRow>;
}

export type SolvedError =
  | { readonly kind: "table-shape"; readonly message: string }
  | { readonly kind: "row-shape"; readonly index: number }
  | { readonly kind: "row-id"; readonly index: number }
  | { readonly kind: "row-id-duplicate"; readonly id: string };

export type SolvedResult =
  | { readonly ok: true; readonly value: SolvedStructure }
  | { readonly ok: false; readonly errors: readonly SolvedError[] };

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

export function parseSolved(value: unknown): SolvedResult {
  if (!Array.isArray(value))
    return {
      ok: false,
      errors: [{ kind: "table-shape", message: "Solved values must be a table." }],
    };
  const errors: SolvedError[] = [];
  const ids: string[] = [];
  const seen = new Set<string>();
  for (const [index, raw] of value.entries()) {
    if (!isRecord(raw) || typeof raw.id !== "string" || !isRecord(raw.cells)) {
      errors.push({ kind: "row-shape", index });
      continue;
    }
    if (raw.id.length === 0) {
      errors.push({ kind: "row-id", index });
      continue;
    }
    if (seen.has(raw.id)) errors.push({ kind: "row-id-duplicate", id: raw.id });
    else seen.add(raw.id);
    ids.push(raw.id);
  }
  if (errors.length > 0) return { ok: false, errors: Object.freeze(errors) };
  return { ok: true, value: Object.freeze({ ids: Object.freeze(ids) }) };
}

export function bindSolved(structure: SolvedStructure, value: unknown): Solved {
  if (!Array.isArray(value)) throw new TypeError("A solved entity requires a table.");
  const byId = new Map<string, SolvedRow>();
  for (const [index, raw] of value.entries()) {
    if (!isRecord(raw) || typeof raw.id !== "string" || !isRecord(raw.cells))
      throw new TypeError(`Solved row at index ${index} must have id and cells.`);
    const cells: Record<string, Scalar> = {};
    for (const [name, cell] of Object.entries(raw.cells)) {
      if (!isScalar(cell)) throw new TypeError(`Solved row '${raw.id}' has a non-scalar cell.`);
      cells[name] = cell;
    }
    byId.set(raw.id, { id: raw.id, cells: Object.freeze(cells) });
  }
  const rows = structure.ids.map((id) => {
    const row = byId.get(id);
    if (row === undefined) throw new TypeError(`Solved row '${id}' is missing after commit.`);
    return row;
  });
  if (byId.size !== structure.ids.length)
    throw new TypeError("Solved row set changed after commit.");
  return Object.freeze({ rows: Object.freeze(rows), byId });
}
