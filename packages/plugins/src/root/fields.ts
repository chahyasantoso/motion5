export const ROOT_2D_FIELDS = {
  x: { kind: "number" },
  y: { kind: "number" },
  rotation: { kind: "number" },
} as const;

export const ROOT_2D_SPEC = { kind: "record", fields: ROOT_2D_FIELDS } as const;
