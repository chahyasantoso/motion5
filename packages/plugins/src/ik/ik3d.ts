import {
  Spec,
  definePlugin,
  ok,
  prepareRefused,
  type TableOf,
  type ValueSpec,
} from "@motion5/core/plugin-api";
import { EXTERNAL_BASE, type BodyStructure } from "@motion5/rig";
import { readNumber } from "@motion5/rig";
import { readEuler3d, readFrame3d, readPivotOffset3d } from "@motion5/rig";
import type { Euler3d } from "@motion5/rig";
import { goalDiagnostics } from "./goal-check";
import type { GoalsStructure } from "../models/goals/domain";
import { readInfluence } from "@motion5/rig";
import { inspectSolve } from "@motion5/rig";
import { readPole3d } from "@motion5/rig";
import { constrains, readJointLimit3d } from "@motion5/rig";
import { readOrient } from "@motion5/rig";
import type { ChainMember3d } from "@motion5/rig";
import { solveChain3d } from "@motion5/rig";
import {
  Body3d,
  Goals3d,
  Point3d,
  Solved3d,
  type Body3dCells,
  type Goals3dCells,
} from "../models/index";
import { nonEmptyDiagnostics } from "../shared/prepare-diagnostics";
import { rowAt, sameRowCount } from "../shared/table-lookup";

const FRAME: ValueSpec = Spec.record({
  x: Spec.number(),
  y: Spec.number(),
  z: Spec.number(),
  rotation: Spec.number({ optional: true }),
  rotationX: Spec.number({ optional: true }),
  rotationY: Spec.number({ optional: true }),
});

const INSPECT: ValueSpec = Spec.record({
  kind: Spec.string(),
  residual: Spec.number(),
  iterations: Spec.number(),
  atBound: Spec.boolean(),
});

function solveMembers3d(
  chainRows: TableOf<Body3dCells>,
  chain: BodyStructure,
  goalRows: TableOf<Goals3dCells>,
  goals: GoalsStructure,
): readonly ChainMember3d[] {
  sameRowCount(chainRows, chain.ids.length, "Body");
  sameRowCount(goalRows, goals.rows.length, "Goal");
  return chain.ids.map((id, position): ChainMember3d => {
    const row = rowAt(chainRows, chain.tableIndex, position, id);
    const goalIndex = goals.indexByMember.get(id);
    const goalRow = goalIndex === undefined ? undefined : goalRows[goalIndex];
    if (goalRow !== undefined && goalRow.cells.memberId !== id)
      throw new TypeError(`Goal row for member '${id}' moved after commit.`);
    const limit = readJointLimit3d(row.cells);
    const influence = goalRow === undefined ? undefined : readInfluence(goalRow.cells);
    const orient = readOrient(row.cells);
    return {
      id,
      base: chain.parentById.get(id) ?? EXTERNAL_BASE,
      length: readNumber(row.cells.length),
      offset: readPivotOffset3d(row.cells),
      rest: readEuler3d(row.cells),
      ...(constrains(limit) ? { limit } : {}),
      ...(influence === undefined ? {} : { influence }),
      ...(orient === undefined ? {} : { orient }),
      ...(goalRow === undefined ? {} : { goal: readFrame3d(goalRow.cells) }),
    };
  });
}

function outputRows(result: ReturnType<typeof solveChain3d>, members: readonly ChainMember3d[]) {
  const atBound = result.quality.kind === "limited" ? new Set(result.quality.atBound) : undefined;
  return members.map((member) => {
    const euler: Euler3d = result.rotations3d[member.id] ?? {
      rotation: 0,
      rotationX: 0,
      rotationY: 0,
    };
    return {
      id: member.id,
      cells: {
        ...euler,
        ...(result.residuals[member.id] === undefined
          ? {}
          : { residual: result.residuals[member.id] }),
        ...(atBound?.has(member.id) === true ? { atBound: true } : {}),
      },
    };
  });
}

export const ik3dPlugin = definePlugin({
  id: "ik3d",
  inputs: {
    param: Spec.record({ inspect: Spec.boolean({ optional: true, static: true }) }),
    requires: {
      chain: Body3d,
      goals: Goals3d,
      base: Point3d,
      pole: { kind: "shape", optional: true, outputs: { values: FRAME } },
    },
  },
  outputs: { values: Solved3d, inspect: { ...INSPECT, optional: true } },
  prepare({ structures: { chain, goals } }) {
    const refused = nonEmptyDiagnostics(goalDiagnostics(chain, goals));
    return refused === undefined ? ok(undefined) : prepareRefused(refused);
  },
  transform({ param, requires, structures: { chain, goals } }) {
    const members = solveMembers3d(requires.chain, chain, requires.goals, goals);
    const pole = readPole3d(requires.pole?.values);
    const result = solveChain3d(readFrame3d(requires.base), members, pole);
    const inspection = inspectSolve(result);
    return {
      values: outputRows(result, members),
      ...(param?.inspect === true
        ? {
            inspect: {
              kind: inspection.kind,
              residual: inspection.residual,
              iterations: inspection.iterations,
              atBound: inspection.atBound.length > 0,
            },
          }
        : {}),
    };
  },
});
