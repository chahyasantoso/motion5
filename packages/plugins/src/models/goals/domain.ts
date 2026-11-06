/** Goal rows keyed by their static member target, pure. */

export interface GoalsStructure {
  readonly rows: readonly { readonly id: string; readonly memberId: string }[];
  readonly byMember: ReadonlyMap<string, string>;
  readonly indexByMember: ReadonlyMap<string, number>;
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
  const indexByMember = new Map<string, number>();
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
    else {
      byMember.set(memberId, raw.id);
      indexByMember.set(memberId, index);
    }
    rows.push({ id: raw.id, memberId });
  }
  if (errors.length > 0) return { ok: false, errors: Object.freeze(errors) };
  return {
    ok: true,
    value: Object.freeze({
      rows: Object.freeze(rows),
      byMember,
      indexByMember,
    }),
  };
}
