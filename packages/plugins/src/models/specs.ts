import { Spec } from "@motion5/core/plugin-api";
import { LIMIT_CEILING, LIMIT_FLOOR } from "@motion5/rig";

const LIMIT = Spec.number({ optional: true, static: true, min: LIMIT_FLOOR, max: LIMIT_CEILING });
const AXIS = Spec.number({ optional: true, static: true });

/** The least positive double: min states "greater than 0" exactly, so zero is refused. */
const INFLUENCE = Spec.number({ optional: true, static: true, min: Number.MIN_VALUE });

const JOINT_VOCABULARY = ["free", "hinge", "cone", "swing-twist"];

export const BODY_2D_FIELDS = {
  parentId: Spec.string({ optional: true, static: true }),
  length: Spec.number(),
  rotation: Spec.number(),
  weight: Spec.number({ optional: true }),
  x: Spec.number({ optional: true }),
  y: Spec.number({ optional: true }),
  minRotation: LIMIT,
  maxRotation: LIMIT,
};

export const BODY_3D_FIELDS = {
  parentId: Spec.string({ optional: true, static: true }),
  length: Spec.number(),
  rotation: Spec.number({ optional: true }),
  rotationX: Spec.number({ optional: true }),
  rotationY: Spec.number({ optional: true }),
  weight: Spec.number({ optional: true }),
  x: Spec.number({ optional: true }),
  y: Spec.number({ optional: true }),
  z: Spec.number({ optional: true }),
  orient: Spec.number({ optional: true, static: true, min: 0, max: 1 }),
  joint: Spec.string({ optional: true, static: true, enum: JOINT_VOCABULARY }),
  axisX: AXIS,
  axisY: AXIS,
  axisZ: AXIS,
  minRotation: LIMIT,
  maxRotation: LIMIT,
  minTwist: LIMIT,
  maxTwist: LIMIT,
  maxSwing: Spec.number({ optional: true, static: true, min: 0, max: LIMIT_CEILING }),
};

export const GOALS_2D_FIELDS = {
  memberId: Spec.string({ static: true }),
  x: Spec.number(),
  y: Spec.number(),
  influence: INFLUENCE,
};

export const GOALS_3D_FIELDS = {
  memberId: Spec.string({ static: true }),
  x: Spec.number(),
  y: Spec.number(),
  z: Spec.number(),
  rotation: Spec.number({ optional: true }),
  rotationX: Spec.number({ optional: true }),
  rotationY: Spec.number({ optional: true }),
  influence: INFLUENCE,
};

export const POINT_2D_FIELDS = {
  x: Spec.number(),
  y: Spec.number(),
  rotation: Spec.number(),
};

export const POINT_3D_FIELDS = {
  x: Spec.number(),
  y: Spec.number(),
  z: Spec.number(),
  rotation: Spec.number(),
  rotationX: Spec.number(),
  rotationY: Spec.number(),
};

export const SOLVED_2D_FIELDS = {
  rotation: Spec.number(),
  residual: Spec.number({ optional: true }),
  atBound: Spec.boolean({ optional: true }),
};

export const SOLVED_3D_FIELDS = {
  rotation: Spec.number(),
  rotationX: Spec.number(),
  rotationY: Spec.number(),
  residual: Spec.number({ optional: true }),
  atBound: Spec.boolean({ optional: true }),
};
