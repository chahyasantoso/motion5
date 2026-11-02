export const SOLVED_3D_FIELDS = {
  rotation: { kind: "number" },
  rotationX: { kind: "number" },
  rotationY: { kind: "number" },
  residual: { kind: "number", optional: true },
  atBound: { kind: "boolean", optional: true },
} as const;

export const SOLVED_3D_SPEC = {
  kind: "table",
  schema: { row: { fields: SOLVED_3D_FIELDS } },
} as const;
