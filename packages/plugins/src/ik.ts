import {
  ok,
  prepareRefused,
  type PluginDefinition,
  type Prepared,
  type Scalar,
  type SourceStructures,
  type Table,
  type ValueSpec,
} from "@motion5/core/plugin-api";
import { EXTERNAL_BASE, type BodyStructure } from "./body/domain";
import { readFrame, readNumber, readPivotOffset } from "./frame";
import { goalDiagnostics } from "./goals/check";
import type { GoalsStructure } from "./goals/domain";
import { readJointLimit } from "./ik-constraint";
import { readInfluence } from "./ik-goal";
import { inspectSolve } from "./ik-result";
import { solveChain } from "./ik-solve";
import type { SolveMember } from "./ik-member";
import { Body2d, Goals2d, Point2d, Solved2d } from "./models";
import { nonEmptyDiagnostics } from "./prepare-diagnostics";
import { requireStructure, structureOf } from "./slot-structure";
import { rowAt, sameRowCount } from "./table-lookup";

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

type IkInput = {
  readonly values: FlatRecord;
  readonly param: FlatRecord;
  readonly requires: {
    readonly chain: Table;
    readonly goals: Table;
    readonly base: Readonly<Record<string, Scalar>>;
  };
  readonly structures?: SourceStructures;
};

function flatRecord(value: unknown, path: string): FlatRecord {
  if (value === null || typeof value !== "object" || Array.isArray(value))
    throw new TypeError(`IK requires a record at ${path}.`);
  return value as FlatRecord;
}

function solveMembers(
  chainRows: Table,
  chain: BodyStructure,
  goalRows: Table,
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
    const limit = readJointLimit(row.cells);
    const influence = goalRow === undefined ? undefined : readInfluence(goalRow.cells);
    return {
      id,
      base: chain.parentById.get(id) ?? EXTERNAL_BASE,
      length: readNumber(row.cells.length),
      pivot: readPivotOffset(row.cells),
      ...(goalRow === undefined ? {} : { goal: readFrame(goalRow.cells) }),
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

export const ikPlugin: PluginDefinition<IkInput> = {
  id: "ik",
  inputs: {
    param: {
      kind: "record",
      fields: {
        flip: { kind: "boolean", optional: true },
        inspect: { kind: "boolean", optional: true, static: true },
      },
    },
    requires: {
      chain: Body2d,
      goals: Goals2d,
      base: Point2d,
    },
  },
  outputs: { values: Solved2d, inspect: { ...INSPECT, optional: true } },
  prepare({ structures }) {
    const chain = structureOf<BodyStructure>(structures, SLOT.chain);
    const goals = structureOf<GoalsStructure>(structures, SLOT.goals);
    if (chain === undefined || goals === undefined) return ok(undefined);
    const refused = nonEmptyDiagnostics(goalDiagnostics(chain, goals));
    return refused === undefined ? ok(undefined) : prepareRefused(refused);
  },
  transform({ param, requires, structures }) {
    const local = flatRecord(param ?? {}, "input.param");
    const chain = requireStructure<BodyStructure>(structures, SLOT.chain, "IK");
    const goals = requireStructure<GoalsStructure>(structures, SLOT.goals, "IK");
    const members = solveMembers(requires.chain, chain, requires.goals, goals);
    const result = solveChain(readFrame(requires.base), members, local.flip === true);
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
