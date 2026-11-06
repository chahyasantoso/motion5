import {
  ok,
  prepareRefused,
  type Outputs,
  type PluginDefinition,
  type Prepared,
  type Scalar,
  type SourceStructures,
  type Table,
  type ValueSpec,
} from "@motion5/core/plugin-api";
import { EXTERNAL_BASE, type BodyStructure } from "./body/domain";
import { readNumber } from "./frame";
import { readEuler3d, readFrame3d, readPivotOffset3d } from "./frame3d";
import type { Euler3d } from "./frame3d";
import { goalDiagnostics } from "./goals/check";
import type { GoalsStructure } from "./goals/domain";
import { readInfluence } from "./ik-goal";
import { inspectSolve } from "./ik-result";
import { readPole3d } from "./ik3d-analytic";
import { constrains, readJointLimit3d } from "./ik3d-constraint";
import { readOrient } from "./ik3d-orient";
import type { ChainMember3d } from "./ik3d-chain";
import { solveChain3d } from "./ik3d-solve";
import { Body3d, Goals3d, Point3d, Solved3d } from "./models";
import { nonEmptyDiagnostics } from "./prepare-diagnostics";
import { requireStructure, structureOf } from "./slot-structure";
import { rowAt, sameRowCount } from "./table-lookup";

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

const SLOT = { chain: "chain", goals: "goals", base: "base" } as const;

type FlatRecord = Readonly<Record<string, number | string | boolean>>;

type Ik3dInput = {
  readonly values: FlatRecord;
  readonly param: FlatRecord;
  readonly requires: {
    readonly chain: Table;
    readonly goals: Table;
    readonly base: Readonly<Record<string, Scalar>>;
    readonly pole?: Outputs;
  };
  readonly structures?: SourceStructures;
};

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
  chainRows: Table,
  chain: BodyStructure,
  goalRows: Table,
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

export const ik3dPlugin: PluginDefinition<Ik3dInput> = {
  id: "ik3d",
  inputs: {
    param: {
      kind: "record",
      fields: {
        inspect: { kind: "boolean", optional: true, static: true },
      },
    },
    requires: {
      chain: Body3d,
      goals: Goals3d,
      base: Point3d,
      pole: { kind: "shape", optional: true, outputs: { values: FRAME } },
    },
  },
  outputs: { values: Solved3d, inspect: { ...INSPECT, optional: true } },
  prepare({ structures }) {
    const chain = structureOf<BodyStructure>(structures, SLOT.chain);
    const goals = structureOf<GoalsStructure>(structures, SLOT.goals);
    if (chain === undefined || goals === undefined) return ok(undefined);
    const refused = nonEmptyDiagnostics(goalDiagnostics(chain, goals));
    return refused === undefined ? ok(undefined) : prepareRefused(refused);
  },
  transform({ param, requires, structures }) {
    const local = flatRecord(param ?? {}, "input.param");
    const chain = requireStructure<BodyStructure>(structures, SLOT.chain, "IK3d");
    const goals = requireStructure<GoalsStructure>(structures, SLOT.goals, "IK3d");
    const members = solveMembers3d(requires.chain, chain, requires.goals, goals);
    const pole = readPole3d(
      requires.pole === undefined ? undefined : recordOutput(requires.pole, "pole"),
    );
    const result = solveChain3d(readFrame3d(requires.base), members, pole);
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
