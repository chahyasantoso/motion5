import { LIMIT_CEILING, LIMIT_FLOOR, unreachable, type ValueSpec } from "@motion5/core/plugin-api";

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
  | "row-unreachable"
  | "goal-table-shape"
  | "goal-row-shape"
  | "goal-row-id"
  | "goal-empty"
  | "goal-member-unknown"
  | "goal-member-not-leaf"
  | "goal-member-duplicate"
  | "goal-leaf-unaddressed";

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
  /** Expected external-base children; omit to infer roots from rows lacking parentId. */
  readonly roots?: readonly string[];
}

export interface AggregateTopology {
  /** Body rows, canonical root-first order; row objects and cell records preserved. */
  readonly rows: readonly AggregateRow[];
  readonly byId: ReadonlyMap<string, AggregateRow>;
  readonly parentById: ReadonlyMap<string, string | undefined>;
  readonly childrenById: ReadonlyMap<string, readonly string[]>;
  /** Members with absent parentId; they attach to the external base. */
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
  minRotation: {
    kind: "number",
    optional: true,
    static: true,
    min: LIMIT_FLOOR,
    max: LIMIT_CEILING,
  },
  maxRotation: {
    kind: "number",
    optional: true,
    static: true,
    min: LIMIT_FLOOR,
    max: LIMIT_CEILING,
  },
} as const;

/** Core's `JOINT_KINDS`, mirrored: `@motion5/core/plugin-api` does not export the list. */
const JOINT_VOCABULARY = ["free", "hinge", "cone", "swing-twist"] as const;

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
  orient: { kind: "number", optional: true, static: true, min: 0, max: 1 },
  joint: { kind: "string", optional: true, static: true, enum: JOINT_VOCABULARY },
  axisX: { kind: "number", optional: true, static: true },
  axisY: { kind: "number", optional: true, static: true },
  axisZ: { kind: "number", optional: true, static: true },
  minRotation: {
    kind: "number",
    optional: true,
    static: true,
    min: LIMIT_FLOOR,
    max: LIMIT_CEILING,
  },
  maxRotation: {
    kind: "number",
    optional: true,
    static: true,
    min: LIMIT_FLOOR,
    max: LIMIT_CEILING,
  },
  minTwist: {
    kind: "number",
    optional: true,
    static: true,
    min: LIMIT_FLOOR,
    max: LIMIT_CEILING,
  },
  maxTwist: {
    kind: "number",
    optional: true,
    static: true,
    min: LIMIT_FLOOR,
    max: LIMIT_CEILING,
  },
  maxSwing: { kind: "number", optional: true, static: true, min: 0, max: LIMIT_CEILING },
} as const;

/** The least positive double: min states "greater than 0" exactly, so zero is refused. */
const INFLUENCE = { kind: "number", optional: true, static: true, min: Number.MIN_VALUE } as const;

const GOALS_2D_FIELDS = {
  memberId: { kind: "string", static: true },
  x: { kind: "number" },
  y: { kind: "number" },
  influence: INFLUENCE,
} as const;

const GOALS_3D_FIELDS = {
  memberId: { kind: "string", static: true },
  x: { kind: "number" },
  y: { kind: "number" },
  z: { kind: "number" },
  rotation: { kind: "number", optional: true },
  rotationX: { kind: "number", optional: true },
  rotationY: { kind: "number", optional: true },
  influence: INFLUENCE,
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

type FieldMap = Extract<ValueSpec, { readonly kind: "record" }>["fields"];

function withoutStatic(fields: FieldMap): FieldMap {
  return Object.fromEntries(
    Object.entries(fields).map(([name, field]) => {
      const { static: _local, ...slotField } = field;
      return [name, slotField];
    }),
  );
}

/** An authored spec read slot-side: the same fields minus `static`. Core refuses `static` in a slot
 * output, and the slot check compares kinds and field presence, never staticness. */
export function slotSpec(spec: ValueSpec): ValueSpec {
  switch (spec.kind) {
    case "table":
      return {
        ...spec,
        schema: {
          ...spec.schema,
          row: { ...spec.schema.row, fields: withoutStatic(spec.schema.row.fields) },
        },
      };
    case "record":
      return { ...spec, fields: withoutStatic(spec.fields) };
    default:
      return unreachable(spec);
  }
}

export const BODY_2D_SLOT = slotSpec(BODY_2D_SPEC);
export const BODY_3D_SLOT = slotSpec(BODY_3D_SPEC);
export const GOALS_2D_SLOT = slotSpec(GOALS_2D_SPEC);
export const GOALS_3D_SLOT = slotSpec(GOALS_3D_SPEC);
export const SOLVED_2D_SLOT = slotSpec(SOLVED_2D_SPEC);
export const SOLVED_3D_SLOT = slotSpec(SOLVED_3D_SPEC);

/** The node a member hangs from when `parentId` is absent (`""`). No row may use that id, so
 * nothing collides; a solver walk reads a base naming no member as the external root. */
export const EXTERNAL_BASE = "";

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
    (typeof value === "number" && !Number.isNaN(value))
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

/** Reads one body table and derives its topology once. `roots` is a validation seam for callers
 * owning the expected base children; else any row omitting `parentId` is a valid base child. */
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

function readGoalRow(value: unknown, index: number): AggregateRow {
  if (!isRecord(value) || typeof value.id !== "string" || !isRecord(value.cells))
    throw new AggregateTopologyError(
      "goal-row-shape",
      `Goal row at index ${index} must have id and cells.`,
    );
  if (value.id.length === 0)
    throw new AggregateTopologyError("goal-row-id", `Goal row at index ${index} has an empty id.`);
  const cells: Record<string, AggregateScalar> = {};
  for (const [name, cell] of Object.entries(value.cells)) {
    if (!isScalar(cell))
      throw new AggregateTopologyError(
        "goal-row-shape",
        `Goal row '${value.id}' has a non-scalar cell '${name}'.`,
        [value.id],
      );
    cells[name] = cell;
  }
  return { id: value.id, cells: Object.freeze(cells) };
}

export function readGoalTargets(
  topology: AggregateTopology,
  value: unknown,
): ReadonlyMap<string, AggregateRow> {
  if (!Array.isArray(value))
    throw new AggregateTopologyError("goal-table-shape", "Aggregate goal values must be a table.");
  const rows = value.map(readGoalRow);
  if (rows.length === 0)
    throw new AggregateTopologyError(
      "goal-empty",
      "Aggregate goal table has no rows; a solver with no goals is refused.",
      topology.leaves,
    );
  const leafSet = new Set(topology.leaves);
  const byMember = new Map<string, AggregateRow>();
  for (const row of rows) {
    const member = row.cells.memberId;
    if (typeof member !== "string" || member.length === 0)
      throw new AggregateTopologyError(
        "goal-row-shape",
        `Goal row '${row.id}' must name a non-empty memberId.`,
        [row.id],
      );
    if (!topology.byId.has(member))
      throw new AggregateTopologyError(
        "goal-member-unknown",
        `Goal row '${row.id}' targets unknown member '${member}'.`,
        [row.id, member],
      );
    if (!leafSet.has(member))
      throw new AggregateTopologyError(
        "goal-member-not-leaf",
        `Goal row '${row.id}' targets member '${member}', which is not a leaf.`,
        [row.id, member],
      );
    if (byMember.has(member))
      throw new AggregateTopologyError(
        "goal-member-duplicate",
        `Two goal rows target member '${member}'.`,
        [member],
      );
    byMember.set(member, row);
  }
  for (const leaf of topology.leaves)
    if (!byMember.has(leaf))
      throw new AggregateTopologyError(
        "goal-leaf-unaddressed",
        `Body leaf '${leaf}' has no goal.`,
        [leaf],
      );
  return byMember;
}
