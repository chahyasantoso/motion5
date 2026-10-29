import type { PluginDefinition, Outputs, ValueSpec } from "@motion5/core/plugin-api";
import {
  BODY_3D_SLOT,
  EXTERNAL_BASE,
  GOALS_3D_SLOT,
  ROOT_3D_SPEC,
  SOLVED_3D_SPEC,
  readAggregateTopology,
  readGoalTargets,
  type AggregateRow,
  type AggregateTopology,
} from "./aggregate-topology";
import { readNumber } from "./frame";
import { readEuler3d, readFrame3d, readPivotOffset3d } from "./frame3d";
import type { Euler3d } from "./frame3d";
import { readInfluence } from "./ik-goal";
import { inspectSolve } from "./ik-result";
import { readPole3d } from "./ik3d-analytic";
import { constrains, readJointLimit3d } from "./ik3d-constraint";
import { readOrient } from "./ik3d-orient";
import type { ChainMember3d } from "./ik3d-chain";
import { solveChain3d } from "./ik3d-solve";

const FRAME: ValueSpec = {
  kind: "record",
  fields: {
    x: { kind: "number" },
    y: { kind: "number" },
    z: { kind: "number" },
    rotation: { kind: "number", optional: true },
    rotationX: { kind: "number", optional: true },
    rotationY: { kind: "number", optional: true },
  },
};

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
    throw new TypeError(`IK3d requires a record at ${path}.`);
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
    throw new TypeError(`IK3d requires a record output at ${path}.`);
  return flatRecord(values, `${path}.values`);
}

function solveMembers3d(
  topology: AggregateTopology,
  goals: ReadonlyMap<string, AggregateRow>,
): readonly ChainMember3d[] {
  return topology.rows.map((row): ChainMember3d => {
    const goal = goals.get(row.id);
    const limit = readJointLimit3d(row.cells);
    const influence = goal === undefined ? undefined : readInfluence(goal.cells);
    const orient = readOrient(row.cells);
    return {
      id: row.id,
      base: topology.parentById.get(row.id) ?? EXTERNAL_BASE,
      length: readNumber(row.cells.length),
      offset: readPivotOffset3d(row.cells),
      rest: readEuler3d(row.cells),
      ...(constrains(limit) ? { limit } : {}),
      ...(influence === undefined ? {} : { influence }),
      ...(orient === undefined ? {} : { orient }),
      ...(goal === undefined ? {} : { goal: readFrame3d(goal.cells) }),
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

export const ik3dPlugin: PluginDefinition = {
  id: "ik3d",
  inputs: {
    values: {
      kind: "record",
      fields: {
        inspect: { kind: "boolean", optional: true, static: true },
      },
    },
    requires: {
      chain: { outputs: { values: BODY_3D_SLOT } },
      goals: { outputs: { values: GOALS_3D_SLOT } },
      base: { outputs: { values: ROOT_3D_SPEC } },
      pole: { optional: true, outputs: { values: FRAME } },
    },
  },
  outputs: { values: SOLVED_3D_SPEC, inspect: { ...INSPECT, optional: true } },
  transform({ values, requires }) {
    const local = flatRecord(values, "input.values");
    const topology = readAggregateTopology((requires.chain as Outputs).values);
    const goals = readGoalTargets(topology, (requires.goals as Outputs).values);
    const members = solveMembers3d(topology, goals);
    const pole = readPole3d(
      requires.pole === undefined ? undefined : recordOutput(requires.pole as Outputs, "pole"),
    );
    const result = solveChain3d(
      readFrame3d(recordOutput(requires.base as Outputs, "base")),
      members,
      pole,
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
