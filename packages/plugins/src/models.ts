import { defineModel, ok, refused } from "@motion5/core/plugin-api";
import type { Model, ValueSpec } from "@motion5/core/plugin-api";
import { bindBody, parseBody, type BodyStructure } from "./body/domain";
import {
  BODY_2D_FIELDS,
  BODY_2D_SPEC,
  GOALS_2D_SPEC,
  ROOT_2D_FIELDS,
  ROOT_2D_SPEC,
  SOLVED_2D_SPEC,
} from "./body/fields";
import { bodyIssue } from "./body/type";
import { BODY_3D_FIELDS, BODY_3D_SPEC } from "./body3d/fields";
import { parseGoals, type GoalsStructure } from "./goals/domain";
import { goalsIssue } from "./goals/type";
import { GOALS_3D_SPEC } from "./goals3d/fields";
import { ROOT_3D_FIELDS, ROOT_3D_SPEC } from "./root3d/fields";
import { parseSolved, type SolvedStructure } from "./solved/domain";
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

/** 2D body kinematics skeleton model with hierarchical joints and limits. */
export const Body2d: Model<unknown, BodyStructure> = defineModel({
  id: "Body2d",
  legacyTypeId: "body2d",
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
export const Body3d: Model<unknown, BodyStructure> = defineModel({
  id: "Body3d",
  legacyTypeId: "body3d",
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
export const Goals2d: Model<unknown, GoalsStructure> = defineModel({
  id: "Goals2d",
  legacyTypeId: "goals2d",
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
export const Goals3d: Model<unknown, GoalsStructure> = defineModel({
  id: "Goals3d",
  legacyTypeId: "goals3d",
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
export const Point2d: Model = defineModel({
  id: "Point2d",
  legacyTypeId: "root2d",
  spec: ROOT_2D_SPEC,
});

/** 3D point record specifying spatial coordinates and orientation angles. */
export const Point3d: Model = defineModel({
  id: "Point3d",
  legacyTypeId: "root3d",
  spec: ROOT_3D_SPEC,
});

/** 2D solved pose angles and convergence residuals. */
export const Solved2d: Model<unknown, SolvedStructure> = defineModel({
  id: "Solved2d",
  legacyTypeId: "solved2d",
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
export const Solved3d: Model<unknown, SolvedStructure> = defineModel({
  id: "Solved3d",
  legacyTypeId: "solved3d",
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
export const Points2d: Model<unknown, PointsStructure> = defineModel({
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
export const Points3d: Model<unknown, PointsStructure> = defineModel({
  id: "Points3d",
  spec: POINTS_3D_SPEC,
  parse(value) {
    if (!Array.isArray(value)) {
      return refused([{ path: "", message: "Expected a table." }]);
    }
    return ok({ ids: value.map((r) => r.id) });
  },
});
