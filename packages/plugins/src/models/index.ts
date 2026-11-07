import { Spec, defineModel, ok, refused } from "@motion5/core/plugin-api";
import type { Model, Parsed, ValueSpec } from "@motion5/core/plugin-api";
import { parseBody, type BodyStructure } from "./body/domain";
import { bodyIssue } from "./body/type";
import { parseGoals, type GoalsStructure } from "./goals/domain";
import { goalsIssue } from "./goals/type";
import {
  Anchors2d,
  CubicPath2d,
  LocalAnchors2d,
  type Anchor2dCells,
  type CubicPath2dCells,
  type LocalAnchor2dCells,
  type AnchorsStructure,
  type CubicPathStructure,
  type LocalAnchorsStructure,
} from "./path";
import { parseSolved, type SolvedStructure } from "./solved/domain";
import { solvedIssue } from "./solved/type";
import {
  BODY_2D_FIELDS,
  BODY_3D_FIELDS,
  GOALS_2D_FIELDS,
  GOALS_3D_FIELDS,
  POINT_2D_FIELDS,
  POINT_3D_FIELDS,
  SOLVED_2D_FIELDS,
  SOLVED_3D_FIELDS,
} from "./specs";

function parsedOrRefused<V, E>(
  res:
    | { readonly ok: true; readonly value: V }
    | { readonly ok: false; readonly errors: readonly E[] },
  issue: (err: E) => { readonly path: readonly (string | number)[]; readonly message: string },
): Parsed<V> {
  if (res.ok) return ok(res.value);
  return refused(
    res.errors.map((err) => {
      const mapped = issue(err);
      return { path: mapped.path.join("."), message: mapped.message };
    }),
  );
}

function parsePoints(value: unknown): Parsed<PointsStructure> {
  if (!Array.isArray(value)) {
    return refused([{ path: "", message: "Expected a table." }]);
  }
  return ok({
    ids: value.map((r) => r.id),
    indexById: new Map(value.map((r, i) => [r.id, i])),
  });
}

const POINTS_2D_SPEC: ValueSpec = Spec.table(POINT_2D_FIELDS);

const POINTS_3D_SPEC: ValueSpec = Spec.table(POINT_3D_FIELDS);

export interface PointsStructure {
  readonly ids: readonly string[];
  readonly indexById: ReadonlyMap<string, number>;
}

/** Cells of a 2D body row. */
export type Body2dCells = {
  readonly parentId?: string;
  readonly length: number;
  readonly rotation: number;
  readonly weight?: number;
  readonly x?: number;
  readonly y?: number;
  readonly minRotation?: number;
  readonly maxRotation?: number;
};

/** Cells of a 3D body row. */
export type Body3dCells = {
  readonly parentId?: string;
  readonly length: number;
  readonly rotation?: number;
  readonly rotationX?: number;
  readonly rotationY?: number;
  readonly weight?: number;
  readonly x?: number;
  readonly y?: number;
  readonly z?: number;
  readonly orient?: number;
  readonly joint?: "free" | "hinge" | "cone" | "swing-twist";
  readonly axisX?: number;
  readonly axisY?: number;
  readonly axisZ?: number;
  readonly minRotation?: number;
  readonly maxRotation?: number;
  readonly minTwist?: number;
  readonly maxTwist?: number;
  readonly maxSwing?: number;
};

/** Cells of a 2D goal row. */
export type Goals2dCells = {
  readonly memberId: string;
  readonly x: number;
  readonly y: number;
  readonly influence?: number;
};

/** Cells of a 3D goal row. */
export type Goals3dCells = {
  readonly memberId: string;
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly rotation?: number;
  readonly rotationX?: number;
  readonly rotationY?: number;
  readonly influence?: number;
};

/** Cells of a 2D point record. */
export type Point2dCells = {
  readonly x: number;
  readonly y: number;
  readonly rotation: number;
};

/** Cells of a 3D point record. */
export type Point3dCells = {
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly rotation: number;
  readonly rotationX: number;
  readonly rotationY: number;
};

/** Cells of a 2D solved row. */
export type Solved2dCells = {
  readonly rotation: number;
  readonly residual?: number;
  readonly atBound?: boolean;
};

/** Cells of a 3D solved row. */
export type Solved3dCells = {
  readonly rotation: number;
  readonly rotationX: number;
  readonly rotationY: number;
  readonly residual?: number;
  readonly atBound?: boolean;
};

export type Points2dCells = Point2dCells;
export type Points3dCells = Point3dCells;

/** 2D body kinematics skeleton model with hierarchical joints and limits. */
export const Body2d: Model<Body2dCells, BodyStructure> = defineModel({
  id: "Body2d",
  spec: Spec.table(BODY_2D_FIELDS),
  parse: (value) => parsedOrRefused(parseBody(value, BODY_2D_FIELDS), bodyIssue),
});

/** 3D body kinematics skeleton model with 3D joint limits and orientation. */
export const Body3d: Model<Body3dCells, BodyStructure> = defineModel({
  id: "Body3d",
  spec: Spec.table(BODY_3D_FIELDS),
  parse: (value) => parsedOrRefused(parseBody(value, BODY_3D_FIELDS), bodyIssue),
});

/** 2D solver goals specifying target positions and influences for members. */
export const Goals2d: Model<Goals2dCells, GoalsStructure> = defineModel({
  id: "Goals2d",
  spec: Spec.table(GOALS_2D_FIELDS),
  parse: (value) => parsedOrRefused(parseGoals(value), goalsIssue),
});

/** 3D solver goals specifying spatial targets and rotational orientations. */
export const Goals3d: Model<Goals3dCells, GoalsStructure> = defineModel({
  id: "Goals3d",
  spec: Spec.table(GOALS_3D_FIELDS),
  parse: (value) => parsedOrRefused(parseGoals(value), goalsIssue),
});

/** 2D point record specifying spatial coordinate and planar rotation. */
export const Point2d: Model<Point2dCells> = defineModel({
  id: "Point2d",
  spec: Spec.record(POINT_2D_FIELDS),
});

/** 3D point record specifying spatial coordinates and orientation angles. */
export const Point3d: Model<Point3dCells> = defineModel({
  id: "Point3d",
  spec: Spec.record(POINT_3D_FIELDS),
});

/** 2D solved pose angles and convergence residuals. */
export const Solved2d: Model<Solved2dCells, SolvedStructure> = defineModel({
  id: "Solved2d",
  spec: Spec.table(SOLVED_2D_FIELDS),
  parse: (value) => parsedOrRefused(parseSolved(value), solvedIssue),
});

/** 3D solved joint rotations and convergence residuals. */
export const Solved3d: Model<Solved3dCells, SolvedStructure> = defineModel({
  id: "Solved3d",
  spec: Spec.table(SOLVED_3D_FIELDS),
  parse: (value) => parsedOrRefused(parseSolved(value), solvedIssue),
});

export {
  Anchors2d,
  CubicPath2d,
  LocalAnchors2d,
  type Anchor2dCells,
  type CubicPath2dCells,
  type LocalAnchor2dCells,
  type AnchorsStructure,
  type CubicPathStructure,
  type LocalAnchorsStructure,
};

/** Table model of 2D points indexing frame rows by identifier. */
export const Points2d: Model<Points2dCells, PointsStructure> = defineModel({
  id: "Points2d",
  spec: POINTS_2D_SPEC,
  parse: parsePoints,
});

/** Table model of 3D points indexing frame rows by identifier. */
export const Points3d: Model<Points3dCells, PointsStructure> = defineModel({
  id: "Points3d",
  spec: POINTS_3D_SPEC,
  parse: parsePoints,
});

/** Cells of a pose classification. */
export type PoseLabelCells = {
  readonly label: string;
  readonly confidence: number;
};

/** The template a pose matched and how close the match is, in 2D or 3D. */
export const PoseLabel: Model<PoseLabelCells> = defineModel({
  id: "PoseLabel",
  spec: Spec.record({ label: Spec.string(), confidence: Spec.number() }),
});

/** Cells of a sprite the DOM adapter renders: every field reaches `transform` or a style. */
export type Sprite2dCells = {
  readonly x?: number;
  readonly y?: number;
  readonly rotation?: number;
  readonly scale?: number;
  readonly scaleX?: number;
  readonly scaleY?: number;
  readonly opacity?: number;
};

const OPTIONAL_NUMBER = Spec.number({ optional: true });

/** A renderable 2D pose; a motion move publishes this. */
export const Sprite2d: Model<Sprite2dCells> = defineModel({
  id: "Sprite2d",
  spec: Spec.record({
    x: OPTIONAL_NUMBER,
    y: OPTIONAL_NUMBER,
    rotation: OPTIONAL_NUMBER,
    scale: OPTIONAL_NUMBER,
    scaleX: OPTIONAL_NUMBER,
    scaleY: OPTIONAL_NUMBER,
    opacity: OPTIONAL_NUMBER,
  }),
});

/** A CSS clip path the DOM adapter writes to the target's style. */
export const Clip2d: Model<{ readonly clipPath: string }> = defineModel({
  id: "Clip2d",
  spec: Spec.record({ clipPath: Spec.string() }),
});

/** Every first-party model a host registers so authored sources can name it. */
export const builtinModels: readonly Model<unknown, unknown>[] = Object.freeze([
  Body2d,
  Body3d,
  Goals2d,
  Goals3d,
  Point2d,
  Point3d,
  Solved2d,
  Solved3d,
  Points2d,
  Points3d,
  PoseLabel,
  Anchors2d,
  CubicPath2d,
  LocalAnchors2d,
  Sprite2d,
  Clip2d,
]);
