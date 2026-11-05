import {
  ok,
  refused,
  typed,
  type Outputs,
  type PluginDefinition,
  type Prepared,
  type SourceStructures,
  type Structure,
  type ValueSpec,
} from "@motion5/core/plugin-api";
import { EXTERNAL_BASE, type Body, type BodyStructure } from "./body/domain";
import { body3d } from "./body3d/type";
import { readNumber } from "./frame";
import { readEuler3d, readFrame3d, readPivotOffset3d } from "./frame3d";
import type { Euler3d } from "./frame3d";
import { goalDiagnostics } from "./goals/check";
import type { Goals, GoalsStructure } from "./goals/domain";
import { goals3d } from "./goals3d/type";
import { readInfluence } from "./ik-goal";
import { inspectSolve } from "./ik-result";
import { readPole3d } from "./ik3d-analytic";
import { constrains, readJointLimit3d } from "./ik3d-constraint";
import { readOrient } from "./ik3d-orient";
import type { ChainMember3d } from "./ik3d-chain";
import { solveChain3d } from "./ik3d-solve";
import type { Root } from "./root/domain";
import { root3d } from "./root3d/type";
import { SOLVED_3D_SPEC } from "./solved3d/fields";

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

type Ik3dInput = {
  readonly values: FlatRecord;
  readonly requires: {
    readonly chain: Body;
    readonly goals: Goals;
    readonly base: Root;
    readonly pole?: Outputs;
  };
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

function solveMembers3d(chain: Body, goals: Goals): readonly ChainMember3d[] {
  return chain.rows.map((row): ChainMember3d => {
    const goal = goals.byMember.get(row.id);
    const limit = readJointLimit3d(row.cells);
    const influence = goal === undefined ? undefined : readInfluence(goal.cells);
    const orient = readOrient(row.cells);
    return {
      id: row.id,
      base: chain.parentById.get(row.id) ?? EXTERNAL_BASE,
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

function structureOf<T>(structures: SourceStructures, slot: string): Structure<T> | undefined {
  return structures[slot] as Structure<T> | undefined;
}

export const ik3dPlugin: PluginDefinition<Ik3dInput> = {
  id: "ik3d",
  inputs: {
    values: {
      kind: "record",
      fields: {
        inspect: { kind: "boolean", optional: true, static: true },
      },
    },
    requires: {
      chain: typed(body3d),
      goals: typed(goals3d),
      base: typed(root3d),
      pole: { kind: "shape", optional: true, outputs: { values: FRAME } },
    },
  },
  outputs: { values: SOLVED_3D_SPEC, inspect: { ...INSPECT, optional: true } },
  checkSources(structures) {
    const chain = structureOf<BodyStructure>(structures, "chain");
    const goals = structureOf<GoalsStructure>(structures, "goals");
    if (chain === undefined || goals === undefined) return Object.freeze([]);
    return goalDiagnostics(chain, goals);
  },
  prepare({ structures }) {
    const chain = structureOf<BodyStructure>(structures, "chain");
    const goals = structureOf<GoalsStructure>(structures, "goals");
    if (chain === undefined || goals === undefined) return ok(undefined);
    const diagnostics = goalDiagnostics(chain, goals);
    if (diagnostics.length > 0) {
      return refused(
        diagnostics.map((d) => ({
          path: d.path,
          message: d.message,
        })),
      );
    }
    return ok(undefined);
  },
  transform({ values, requires }) {
    const local = flatRecord(values, "input.values");
    const members = solveMembers3d(requires.chain, requires.goals);
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
