import { LIMIT_CEILING, LIMIT_FLOOR } from "../body/fields";

const JOINT_VOCABULARY = ["free", "hinge", "cone", "swing-twist"] as const;

export const BODY_3D_FIELDS = {
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

export const BODY_3D_SPEC = {
  kind: "table",
  schema: { row: { fields: BODY_3D_FIELDS } },
} as const;
