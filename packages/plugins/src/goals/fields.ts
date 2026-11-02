const INFLUENCE = { kind: "number", optional: true, static: true, min: Number.MIN_VALUE } as const;

export const GOALS_2D_FIELDS = {
  memberId: { kind: "string", static: true },
  x: { kind: "number" },
  y: { kind: "number" },
  influence: INFLUENCE,
} as const;

export const GOALS_2D_SPEC = {
  kind: "table",
  schema: { row: { fields: GOALS_2D_FIELDS } },
} as const;
