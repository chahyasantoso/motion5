import {
  ok,
  refused,
  type PluginDefinition,
  type Prepared,
  type Scalar,
  type SourceStructures,
  type Table,
  type ValueSpec,
} from "@motion5/core/plugin-api";
import { EXTERNAL_BASE, bindBody, type Body, type BodyStructure } from "./body/domain";
import { readFrame, readNumber, readPivotOffset } from "./frame";
import { goalDiagnostics } from "./goals/check";
import { bindGoals, type Goals, type GoalsStructure } from "./goals/domain";
import { readJointLimit } from "./ik-constraint";
import { readInfluence } from "./ik-goal";
import { inspectSolve } from "./ik-result";
import { solveChain } from "./ik-solve";
import type { SolveMember } from "./ik-member";
import { bindRoot } from "./root/domain";
import { Body2d, Goals2d, Point2d, Solved2d } from "./models";
import { requireStructure, structureOf } from "./slot-structure";

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

function solveMembers(chain: Body, goals: Goals): readonly SolveMember[] {
  return chain.rows.map((row): SolveMember => {
    const goal = goals.byMember.get(row.id);
    const limit = readJointLimit(row.cells);
    const influence = goal === undefined ? undefined : readInfluence(goal.cells);
    return {
      id: row.id,
      base: chain.parentById.get(row.id) ?? EXTERNAL_BASE,
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
  transform({ param, requires, structures }) {
    const local = flatRecord(param ?? {}, "input.param");
    const chain = bindBody(
      requireStructure<BodyStructure>(structures, "chain", "IK"),
      requires.chain,
    );
    const goals = bindGoals(
      requireStructure<GoalsStructure>(structures, "goals", "IK"),
      requires.goals,
    );
    const members = solveMembers(chain, goals);
    const base = bindRoot(requires.base);
    const result = solveChain(readFrame(base), members, local.flip === true);
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
