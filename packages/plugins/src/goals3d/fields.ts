const INFLUENCE = { kind: "number", optional: true, static: true, min: Number.MIN_VALUE } as const;

export const GOALS_3D_FIELDS = {
  memberId: { kind: "string", static: true },
  x: { kind: "number" },
  y: { kind: "number" },
  z: { kind: "number" },
  rotation: { kind: "number", optional: true },
  rotationX: { kind: "number", optional: true },
  rotationY: { kind: "number", optional: true },
  influence: INFLUENCE,
} as const;

export const GOALS_3D_SPEC = {
  kind: "table",
  schema: { row: { fields: GOALS_3D_FIELDS } },
} as const;
