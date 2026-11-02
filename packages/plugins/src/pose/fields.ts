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

export const POSE_2D_SPEC = {
  kind: "table",
  schema: { row: { fields: POSE_2D_FIELDS } },
} as const;
export const POSE_3D_SPEC = {
  kind: "table",
  schema: { row: { fields: POSE_3D_FIELDS } },
} as const;
