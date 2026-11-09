import {
  Spec,
  definePlugin,
  ok,
  prepareRefused,
  type TableOf,
  type ValueSpec,
} from "@motion5/core/plugin-api";
import {
  inspectSolve,
  readFrame,
  solveChain,
  solveMember,
  type BodyStructure,
  type SolveMember,
} from "@motion5/rig";
import { goalDiagnostics } from "./goal-check";
import type { GoalsStructure } from "../models/goals/domain";
import {
  Body2d,
  Goals2d,
  Point2d,
  Solved2d,
  type Body2dCells,
  type Goals2dCells,
} from "../models/index";
import { nonEmptyDiagnostics } from "../shared/prepare-diagnostics";
import { rowAt, sameRowCount } from "../shared/table-lookup";

const INSPECT: ValueSpec = Spec.record({
  kind: Spec.string(),
  residual: Spec.number(),
  iterations: Spec.number(),
  atBound: Spec.boolean(),
});

function solveMembers(
  chainRows: TableOf<Body2dCells>,
  chain: BodyStructure,
  goalRows: TableOf<Goals2dCells>,
  goals: GoalsStructure,
): readonly SolveMember[] {
  sameRowCount(chainRows, chain.ids.length, "Body");
  sameRowCount(goalRows, goals.rows.length, "Goal");
  return chain.ids.map((id, position): SolveMember => {
    const row = rowAt(chainRows, chain.tableIndex, position, id);
    const goalIndex = goals.indexByMember.get(id);
    const goalRow = goalIndex === undefined ? undefined : goalRows[goalIndex];
    if (goalRow !== undefined && goalRow.cells.memberId !== id)
      throw new TypeError(`Goal row for member '${id}' moved after commit.`);
    return solveMember(id, chain.parentById.get(id), row.cells, goalRow?.cells);
  });
}

function outputRows(result: ReturnType<typeof solveChain>, members: readonly SolveMember[]) {
  const atBound = result.quality.kind === "limited" ? new Set(result.quality.atBound) : undefined;
  return members.map((member) => ({
    id: member.id,
    cells: {
      rotation: result.rotations[member.id] ?? 0,
      ...(result.residuals[member.id] === undefined
        ? {}
        : { residual: result.residuals[member.id] }),
      ...(atBound?.has(member.id) === true ? { atBound: true } : {}),
    },
  }));
}

export const ikPlugin = definePlugin({
  id: "ik",
  inputs: {
    param: Spec.record({
      flip: Spec.boolean({ optional: true }),
      inspect: Spec.boolean({ optional: true, static: true }),
    }),
    requires: {
      chain: Body2d,
      goals: Goals2d,
      base: Point2d,
    },
  },
  outputs: { values: Solved2d, inspect: { ...INSPECT, optional: true } },
  prepare({ structures: { chain, goals } }) {
    const refused = nonEmptyDiagnostics(goalDiagnostics(chain, goals));
    return refused === undefined ? ok(undefined) : prepareRefused(refused);
  },
  transform({ param, requires, structures: { chain, goals } }) {
    const members = solveMembers(requires.chain, chain, requires.goals, goals);
    const result = solveChain(readFrame(requires.base), members, param?.flip === true);
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
