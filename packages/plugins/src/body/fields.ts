export const LIMIT_FLOOR = -180;
export const LIMIT_CEILING = 180;

/** The least positive double: min states "greater than 0" exactly, so zero is refused. */
const INFLUENCE = { kind: "number", optional: true, static: true, min: Number.MIN_VALUE } as const;

export const BODY_2D_FIELDS = {
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

export const GOALS_2D_FIELDS = {
  memberId: { kind: "string", static: true },
  x: { kind: "number" },
  y: { kind: "number" },
  influence: INFLUENCE,
} as const;

export const ROOT_2D_FIELDS = {
  x: { kind: "number" },
  y: { kind: "number" },
  rotation: { kind: "number" },
} as const;

export const SOLVED_2D_FIELDS = {
  rotation: { kind: "number" },
  residual: { kind: "number", optional: true },
  atBound: { kind: "boolean", optional: true },
} as const;

export const BODY_2D_SPEC = {
  kind: "table",
  schema: { row: { fields: BODY_2D_FIELDS } },
} as const;

export const GOALS_2D_SPEC = {
  kind: "table",
  schema: { row: { fields: GOALS_2D_FIELDS } },
} as const;

export const ROOT_2D_SPEC = { kind: "record", fields: ROOT_2D_FIELDS } as const;

export const SOLVED_2D_SPEC = {
  kind: "table",
  schema: { row: { fields: SOLVED_2D_FIELDS } },
} as const;
