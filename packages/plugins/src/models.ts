import { defineModel, ok, refused } from "@motion5/core/plugin-api";
import type { Model, ValueSpec } from "@motion5/core/plugin-api";
import { parseBody, type BodyStructure } from "./body/domain";
import { BODY_2D_FIELDS, BODY_2D_SPEC, GOALS_2D_SPEC } from "./body/fields";
import { bodyIssue } from "./body/type";
import { BODY_3D_FIELDS, BODY_3D_SPEC } from "./body3d/fields";
import { parseGoals, type GoalsStructure } from "./goals/domain";
import { goalsIssue } from "./goals/type";
import { GOALS_3D_SPEC } from "./goals3d/fields";
import { ROOT_2D_FIELDS, ROOT_2D_SPEC } from "./root/fields";
import { ROOT_3D_FIELDS, ROOT_3D_SPEC } from "./root3d/fields";
import { parseSolved, type SolvedStructure } from "./solved/domain";
import { SOLVED_2D_SPEC } from "./solved/fields";
import { solvedIssue } from "./solved/type";
import { SOLVED_3D_SPEC } from "./solved3d/fields";

const POINTS_2D_SPEC: ValueSpec = {
  kind: "table",
  schema: { row: { fields: ROOT_2D_FIELDS } },
};

const POINTS_3D_SPEC: ValueSpec = {
  kind: "table",
  schema: { row: { fields: ROOT_3D_FIELDS } },
};

export interface PointsStructure {
  readonly ids: readonly string[];
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
  spec: BODY_2D_SPEC,
  parse(value) {
    const res = parseBody(value, BODY_2D_FIELDS);
    return res.ok
      ? ok(res.value)
      : refused(
          res.errors.map((err) => {
            const issue = bodyIssue(err);
            return { path: issue.path.join("."), message: issue.message };
          }),
        );
  },
});

/** 3D body kinematics skeleton model with 3D joint limits and orientation. */
export const Body3d: Model<Body3dCells, BodyStructure> = defineModel({
  id: "Body3d",
  spec: BODY_3D_SPEC,
  parse(value) {
    const res = parseBody(value, BODY_3D_FIELDS);
    return res.ok
      ? ok(res.value)
      : refused(
          res.errors.map((err) => {
            const issue = bodyIssue(err);
            return { path: issue.path.join("."), message: issue.message };
          }),
        );
  },
});

/** 2D solver goals specifying target positions and influences for members. */
export const Goals2d: Model<Goals2dCells, GoalsStructure> = defineModel({
  id: "Goals2d",
  spec: GOALS_2D_SPEC,
  parse(value) {
    const res = parseGoals(value);
    return res.ok
      ? ok(res.value)
      : refused(
          res.errors.map((err) => {
            const issue = goalsIssue(err);
            return { path: issue.path.join("."), message: issue.message };
          }),
        );
  },
});

/** 3D solver goals specifying spatial targets and rotational orientations. */
export const Goals3d: Model<Goals3dCells, GoalsStructure> = defineModel({
  id: "Goals3d",
  spec: GOALS_3D_SPEC,
  parse(value) {
    const res = parseGoals(value);
    return res.ok
      ? ok(res.value)
      : refused(
          res.errors.map((err) => {
            const issue = goalsIssue(err);
            return { path: issue.path.join("."), message: issue.message };
          }),
        );
  },
});

/** 2D point record specifying spatial coordinate and planar rotation. */
export const Point2d: Model<Point2dCells> = defineModel({
  id: "Point2d",
  spec: ROOT_2D_SPEC,
});

/** 3D point record specifying spatial coordinates and orientation angles. */
export const Point3d: Model<Point3dCells> = defineModel({
  id: "Point3d",
  spec: ROOT_3D_SPEC,
});

/** 2D solved pose angles and convergence residuals. */
export const Solved2d: Model<Solved2dCells, SolvedStructure> = defineModel({
  id: "Solved2d",
  spec: SOLVED_2D_SPEC,
  parse(value) {
    const res = parseSolved(value);
    return res.ok
      ? ok(res.value)
      : refused(
          res.errors.map((err) => {
            const issue = solvedIssue(err);
            return { path: issue.path.join("."), message: issue.message };
          }),
        );
  },
});

/** 3D solved joint rotations and convergence residuals. */
export const Solved3d: Model<Solved3dCells, SolvedStructure> = defineModel({
  id: "Solved3d",
  spec: SOLVED_3D_SPEC,
  parse(value) {
    const res = parseSolved(value);
    return res.ok
      ? ok(res.value)
      : refused(
          res.errors.map((err) => {
            const issue = solvedIssue(err);
            return { path: issue.path.join("."), message: issue.message };
          }),
        );
  },
});

/** Table model of 2D points indexing frame rows by identifier. */
export const Points2d: Model<Points2dCells, PointsStructure> = defineModel({
  id: "Points2d",
  spec: POINTS_2D_SPEC,
  parse(value) {
    if (!Array.isArray(value)) {
      return refused([{ path: "", message: "Expected a table." }]);
    }
    return ok({ ids: value.map((r) => r.id) });
  },
});

/** Table model of 3D points indexing frame rows by identifier. */
export const Points3d: Model<Points3dCells, PointsStructure> = defineModel({
  id: "Points3d",
  spec: POINTS_3D_SPEC,
  parse(value) {
    if (!Array.isArray(value)) {
      return refused([{ path: "", message: "Expected a table." }]);
    }
    return ok({ ids: value.map((r) => r.id) });
  },
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
]);
