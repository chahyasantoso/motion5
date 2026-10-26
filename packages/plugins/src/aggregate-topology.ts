import type { ValueSpec } from "@motion5/core/plugin-api";

export type AggregateScalar = number | string | boolean;
export type AggregateCells = Readonly<Record<string, AggregateScalar>>;

export interface AggregateRow {
  readonly id: string;
  readonly cells: AggregateCells;
}

export type AggregateTopologyErrorKind =
  | "table-shape"
  | "row-shape"
  | "row-id"
  | "row-id-duplicate"
  | "parent-shape"
  | "parent-unknown"
  | "parent-self"
  | "parent-cycle"
  | "root-shape"
  | "row-unreachable";

export class AggregateTopologyError extends TypeError {
  readonly kind: AggregateTopologyErrorKind;
  readonly ids: readonly string[];

  constructor(kind: AggregateTopologyErrorKind, message: string, ids: readonly string[] = []) {
    super(message);
    this.name = "AggregateTopologyError";
    this.kind = kind;
    this.ids = Object.freeze([...ids]);
  }
}

export interface AggregateTopologyOptions {
  /** Optional expected external-base children, used when a caller owns the root set explicitly. */
  readonly roots?: readonly string[];
}

export interface AggregateTopology {
  /** Body rows in canonical root-first order. The row objects and cell records are preserved. */
  readonly rows: readonly AggregateRow[];
  readonly byId: ReadonlyMap<string, AggregateRow>;
  readonly parentById: ReadonlyMap<string, string | undefined>;
  readonly childrenById: ReadonlyMap<string, readonly string[]>;
  /** Members whose optional parentId is absent and therefore attach to the external base. */
  readonly roots: readonly string[];
  readonly leaves: readonly string[];
  readonly ids: readonly string[];
}

const BODY_2D_FIELDS = {
  parentId: { kind: "string", optional: true, static: true },
  length: { kind: "number" },
  rotation: { kind: "number" },
  weight: { kind: "number", optional: true },
  x: { kind: "number", optional: true },
  y: { kind: "number", optional: true },
  minRotation: { kind: "number", optional: true },
  maxRotation: { kind: "number", optional: true },
} as const;

const BODY_3D_FIELDS = {
  parentId: { kind: "string", optional: true, static: true },
  length: { kind: "number" },
  rotation: { kind: "number", optional: true },
  rotationX: { kind: "number", optional: true },
  rotationY: { kind: "number", optional: true },
  weight: { kind: "number", optional: true },
  x: { kind: "number", optional: true },
  y: { kind: "number", optional: true },
  z: { kind: "number", optional: true },
  orient: { kind: "number", optional: true },
  joint: { kind: "string", optional: true, static: true },
  axisX: { kind: "number", optional: true, static: true },
  axisY: { kind: "number", optional: true, static: true },
  axisZ: { kind: "number", optional: true, static: true },
  minRotation: { kind: "number", optional: true, static: true },
  maxRotation: { kind: "number", optional: true, static: true },
  minTwist: { kind: "number", optional: true, static: true },
  maxTwist: { kind: "number", optional: true, static: true },
  maxSwing: { kind: "number", optional: true, static: true },
} as const;

const GOALS_2D_FIELDS = {
  memberId: { kind: "string", static: true },
  x: { kind: "number" },
  y: { kind: "number" },
  influence: { kind: "number", optional: true, static: true },
} as const;

const GOALS_3D_FIELDS = {
  memberId: { kind: "string", static: true },
  x: { kind: "number" },
  y: { kind: "number" },
  z: { kind: "number" },
  rotation: { kind: "number", optional: true },
  rotationX: { kind: "number", optional: true },
  rotationY: { kind: "number", optional: true },
  influence: { kind: "number", optional: true, static: true },
} as const;

const ROOT_2D_FIELDS = {
  x: { kind: "number" },
  y: { kind: "number" },
  rotation: { kind: "number" },
} as const;

const ROOT_3D_FIELDS = {
  x: { kind: "number" },
  y: { kind: "number" },
  z: { kind: "number" },
  rotation: { kind: "number" },
  rotationX: { kind: "number" },
  rotationY: { kind: "number" },
} as const;

const SOLVED_2D_FIELDS = {
  rotation: { kind: "number" },
  residual: { kind: "number", optional: true },
  atBound: { kind: "boolean", optional: true },
} as const;

const SOLVED_3D_FIELDS = {
  rotation: { kind: "number" },
  rotationX: { kind: "number" },
  rotationY: { kind: "number" },
  residual: { kind: "number", optional: true },
  atBound: { kind: "boolean", optional: true },
} as const;

const POSE_2D_FIELDS = {
  x: { kind: "number" },
  y: { kind: "number" },
  rotation: { kind: "number" },
} as const;

const POSE_3D_FIELDS = {
  x: { kind: "number" },
  y: { kind: "number" },
  z: { kind: "number" },
  rotation: { kind: "number" },
  rotationX: { kind: "number" },
  rotationY: { kind: "number" },
} as const;

export const BODY_2D_SPEC: ValueSpec = {
  kind: "table",
  schema: { row: { fields: BODY_2D_FIELDS } },
};
export const BODY_3D_SPEC: ValueSpec = {
  kind: "table",
  schema: { row: { fields: BODY_3D_FIELDS } },
};
export const GOALS_2D_SPEC: ValueSpec = {
  kind: "table",
  schema: { row: { fields: GOALS_2D_FIELDS } },
};
export const GOALS_3D_SPEC: ValueSpec = {
  kind: "table",
  schema: { row: { fields: GOALS_3D_FIELDS } },
};
export const ROOT_2D_SPEC: ValueSpec = { kind: "record", fields: ROOT_2D_FIELDS };
export const ROOT_3D_SPEC: ValueSpec = { kind: "record", fields: ROOT_3D_FIELDS };
export const SOLVED_2D_SPEC: ValueSpec = {
  kind: "table",
  schema: { row: { fields: SOLVED_2D_FIELDS } },
};
export const SOLVED_3D_SPEC: ValueSpec = {
  kind: "table",
  schema: { row: { fields: SOLVED_3D_FIELDS } },
};
export const POSE_2D_SPEC: ValueSpec = {
  kind: "table",
  schema: { row: { fields: POSE_2D_FIELDS } },
};
export const POSE_3D_SPEC: ValueSpec = {
  kind: "table",
  schema: { row: { fields: POSE_3D_FIELDS } },
};

function compareCodeUnits(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isScalar(value: unknown): value is AggregateScalar {
  return (
    typeof value === "string" ||
    typeof value === "boolean" ||
    (typeof value === "number" && Number.isFinite(value))
  );
}

function readRow(value: unknown, index: number): AggregateRow {
  if (!isRecord(value) || typeof value.id !== "string" || !isRecord(value.cells))
    throw new AggregateTopologyError(
      "row-shape",
      `Body row at index ${index} must have id and cells.`,
    );
  if (value.id.length === 0)
    throw new AggregateTopologyError("row-id", `Body row at index ${index} has an empty id.`);
  const cells: Record<string, AggregateScalar> = {};
  for (const [name, cell] of Object.entries(value.cells)) {
    if (!isScalar(cell))
      throw new AggregateTopologyError(
        "row-shape",
        `Body row '${value.id}' has a non-scalar cell '${name}'.`,
        [value.id],
      );
    cells[name] = cell;
  }
  return { id: value.id, cells: Object.freeze(cells) };
}

function readParent(row: AggregateRow): string | undefined {
  const parent = row.cells.parentId;
  if (parent === undefined) return undefined;
  if (typeof parent !== "string" || parent.length === 0)
    throw new AggregateTopologyError(
      "parent-shape",
      `Body row '${row.id}' parentId must be a non-empty string when present.`,
      [row.id],
    );
  return parent;
}

/**
 * Reads one aggregate body table and derives its topology exactly once.
 *
 * The optional `roots` argument is an internal validation seam for callers that already own the
 * expected external-base children. Without it, every row omitting `parentId` is a valid external-base
 * child, so branching at the base is explicitly supported. Rows and cells are copied into immutable
 * records; canonical ordering never changes row ids or cell values as observed by consumers.
 */
export function readAggregateTopology(
  value: unknown,
  options: AggregateTopologyOptions = {},
): AggregateTopology {
  if (!Array.isArray(value))
    throw new AggregateTopologyError("table-shape", "Aggregate body values must be a table.");
  const authoredRows = value.map(readRow);
  const byId = new Map<string, AggregateRow>();
  for (const row of authoredRows) {
    if (byId.has(row.id))
      throw new AggregateTopologyError(
        "row-id-duplicate",
        `Body row id '${row.id}' is duplicated.`,
        [row.id],
      );
    byId.set(row.id, row);
  }
  const parentById = new Map<string, string | undefined>();
  const children = new Map<string, string[]>(authoredRows.map((row) => [row.id, []]));
  for (const row of authoredRows) {
    const parent = readParent(row);
    if (parent === row.id)
      throw new AggregateTopologyError(
        "parent-self",
        `Body row '${row.id}' cannot parent itself.`,
        [row.id],
      );
    if (parent !== undefined) {
      if (!byId.has(parent))
        throw new AggregateTopologyError(
          "parent-unknown",
          `Body row '${row.id}' names unknown parent '${parent}'.`,
          [row.id, parent],
        );
      children.get(parent)!.push(row.id);
    }
    parentById.set(row.id, parent);
  }

  const inferredRoots = authoredRows
    .filter((row) => parentById.get(row.id) === undefined)
    .map((row) => row.id)
    .sort(compareCodeUnits);
  const roots = [...(options.roots ?? inferredRoots)].sort(compareCodeUnits);
  for (const root of roots) {
    if (!byId.has(root))
      throw new AggregateTopologyError("root-shape", `Expected root '${root}' is not a body row.`, [
        root,
      ]);
    if (parentById.get(root) !== undefined)
      throw new AggregateTopologyError(
        "root-shape",
        `Expected root '${root}' must omit parentId.`,
        [root],
      );
  }
  const rootSet = new Set(roots);
  for (const root of inferredRoots)
    if (!rootSet.has(root))
      throw new AggregateTopologyError(
        "row-unreachable",
        `Body row '${root}' is not reachable from the declared external base roots.`,
        [root],
      );

  const explicitRoots = options.roots !== undefined;
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const depthById = new Map<string, number>();
  const visit = (id: string, depth: number): void => {
    if (visiting.has(id))
      throw new AggregateTopologyError("parent-cycle", `Body topology cycles at row '${id}'.`, [
        id,
      ]);
    if (visited.has(id)) return;
    visiting.add(id);
    depthById.set(id, depth);
    for (const child of children.get(id)!.sort(compareCodeUnits)) visit(child, depth + 1);
    visiting.delete(id);
    visited.add(id);
  };
  for (const root of roots) visit(root, 0);
  if (!explicitRoots && visited.size !== authoredRows.length) {
    const disconnected = authoredRows.find((row) => !visited.has(row.id))!;
    visit(disconnected.id, 0);
  }
  if (visited.size !== authoredRows.length) {
    const unreachable = authoredRows.find((row) => !visited.has(row.id))!;
    throw new AggregateTopologyError(
      "row-unreachable",
      `Body row '${unreachable.id}' is not reachable from the external base.`,
      [unreachable.id],
    );
  }

  const ids = authoredRows
    .map((row) => row.id)
    .sort(
      (left, right) =>
        (depthById.get(left) ?? 0) - (depthById.get(right) ?? 0) || compareCodeUnits(left, right),
    );
  const rows = ids.map((id) => byId.get(id)!);
  const childrenById = new Map<string, readonly string[]>(
    [...children].map(([id, childIds]) => [
      id,
      Object.freeze([...childIds].sort(compareCodeUnits)),
    ]),
  );
  const leaves = ids.filter((id) => childrenById.get(id)!.length === 0);
  return Object.freeze({
    rows: Object.freeze(rows),
    byId,
    parentById,
    childrenById,
    roots: Object.freeze(roots),
    leaves: Object.freeze(leaves),
    ids: Object.freeze(ids),
  });
}
