/** Solved rotations, pure: the row set is structural, every cell is animated. */

export type Scalar = number | string | boolean;
export type Cells = Readonly<Record<string, Scalar>>;

export interface SolvedRow {
  readonly id: string;
  readonly cells: Cells;
}

export interface SolvedStructure {
  readonly ids: readonly string[];
  readonly indexById: ReadonlyMap<string, number>;
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

export function parseSolved(value: unknown): SolvedResult {
  if (!Array.isArray(value))
    return {
      ok: false,
      errors: [{ kind: "table-shape", message: "Solved values must be a table." }],
    };
  const errors: SolvedError[] = [];
  const ids: string[] = [];
  const seen = new Set<string>();
  const indexById = new Map<string, number>();
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
    indexById.set(raw.id, index);
  }
  if (errors.length > 0) return { ok: false, errors: Object.freeze(errors) };
  return { ok: true, value: Object.freeze({ ids: Object.freeze(ids), indexById }) };
}
