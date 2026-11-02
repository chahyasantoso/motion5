export const ROOT_3D_FIELDS = {
  x: { kind: "number" },
  y: { kind: "number" },
  z: { kind: "number" },
  rotation: { kind: "number" },
  rotationX: { kind: "number" },
  rotationY: { kind: "number" },
} as const;

export const ROOT_3D_SPEC = { kind: "record", fields: ROOT_3D_FIELDS } as const;
