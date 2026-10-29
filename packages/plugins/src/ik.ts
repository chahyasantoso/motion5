import type { PluginDefinition, Outputs, ValueSpec } from "@motion5/core/plugin-api";
import {
  BODY_2D_SLOT,
  EXTERNAL_BASE,
  GOALS_2D_SLOT,
  ROOT_2D_SPEC,
  SOLVED_2D_SPEC,
  readAggregateTopology,
  readGoalTargets,
  type AggregateRow,
  type AggregateTopology,
} from "./aggregate-topology";
import { readFrame, readNumber, readPivotOffset } from "./frame";
import type { SolveMember } from "./ik-member";
import { readJointLimit } from "./ik-constraint";
import { readInfluence } from "./ik-goal";
import { inspectSolve } from "./ik-result";
import { solveChain } from "./ik-solve";

const INSPECT: ValueSpec = {
  kind: "record",
  fields: {
    kind: { kind: "string" },
    residual: { kind: "number" },
    iterations: { kind: "number" },
    atBound: { kind: "boolean" },
  },
};

type FlatRecord = Readonly<Record<string, number | string | boolean>>;

function flatRecord(value: unknown, path: string): FlatRecord {
  if (value === null || typeof value !== "object" || Array.isArray(value))
    throw new TypeError(`IK requires a record at ${path}.`);
  return value as FlatRecord;
}

function recordOutput(outputs: Outputs, path: string): FlatRecord {
  const values = outputs.values;
  if (
    values === undefined ||
    Array.isArray(values) ||
    values === null ||
    typeof values !== "object"
  )
    throw new TypeError(`IK requires a record output at ${path}.`);
  return flatRecord(values, `${path}.values`);
}

function solveMembers(
  topology: AggregateTopology,
  goals: ReadonlyMap<string, AggregateRow>,
): readonly SolveMember[] {
  return topology.rows.map((row): SolveMember => {
    const goal = goals.get(row.id);
    const limit = readJointLimit(row.cells);
    const influence = goal === undefined ? undefined : readInfluence(goal.cells);
    return {
      id: row.id,
      base: topology.parentById.get(row.id) ?? EXTERNAL_BASE,
      length: readNumber(row.cells.length),
      pivot: readPivotOffset(row.cells),
      ...(goal === undefined ? {} : { goal: readFrame(goal.cells) }),
      ...(limit.kind === "range" ? { limit } : {}),
      ...(influence === undefined ? {} : { influence }),
    };
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

export const ikPlugin: PluginDefinition = {
  id: "ik",
  inputs: {
    values: {
      kind: "record",
      fields: {
        flip: { kind: "boolean", optional: true },
        inspect: { kind: "boolean", optional: true, static: true },
      },
    },
    requires: {
      chain: { outputs: { values: BODY_2D_SLOT } },
      goals: { outputs: { values: GOALS_2D_SLOT } },
      base: { outputs: { values: ROOT_2D_SPEC } },
    },
  },
  outputs: { values: SOLVED_2D_SPEC, inspect: { ...INSPECT, optional: true } },
  transform({ values, requires }) {
    const local = flatRecord(values, "input.values");
    const topology = readAggregateTopology((requires.chain as Outputs).values);
    const goals = readGoalTargets(topology, (requires.goals as Outputs).values);
    const members = solveMembers(topology, goals);
    const result = solveChain(
      readFrame(recordOutput(requires.base as Outputs, "base")),
      members,
      local.flip === true,
    );
    const inspection = inspectSolve(result);
    return {
      values: outputRows(result, members),
      ...(local.inspect === true
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
};
