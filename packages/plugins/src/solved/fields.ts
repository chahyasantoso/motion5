export const SOLVED_2D_FIELDS = {
  rotation: { kind: "number" },
  residual: { kind: "number", optional: true },
  atBound: { kind: "boolean", optional: true },
} as const;

export const SOLVED_2D_SPEC = {
  kind: "table",
  schema: { row: { fields: SOLVED_2D_FIELDS } },
} as const;
