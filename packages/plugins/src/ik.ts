import {
  ok,
  refused,
  typed,
  type PluginDefinition,
  type Prepared,
  type SourceStructures,
  type Structure,
  type ValueSpec,
} from "@motion5/core/plugin-api";
import { EXTERNAL_BASE, type Body, type BodyStructure } from "./body/domain";
import { body2d } from "./body/type";
import { readFrame, readNumber, readPivotOffset } from "./frame";
import { goalDiagnostics } from "./goals/check";
import type { Goals, GoalsStructure } from "./goals/domain";
import { goals2d } from "./goals/type";
import { readJointLimit } from "./ik-constraint";
import { readInfluence } from "./ik-goal";
import { inspectSolve } from "./ik-result";
import { solveChain } from "./ik-solve";
import type { SolveMember } from "./ik-member";
import type { Root } from "./root/domain";
import { root2d } from "./root/type";
import { SOLVED_2D_SPEC } from "./solved/fields";

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
    readonly chain: Body;
    readonly goals: Goals;
    readonly base: Root;
  };
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

function structureOf<T>(structures: SourceStructures, slot: string): Structure<T> | undefined {
  return structures[slot] as Structure<T> | undefined;
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
      chain: typed(body2d),
      goals: typed(goals2d),
      base: typed(root2d),
    },
  },
  outputs: { values: SOLVED_2D_SPEC, inspect: { ...INSPECT, optional: true } },
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
  transform({ param, requires }) {
    const local = flatRecord(param ?? {}, "input.param");
    const members = solveMembers(requires.chain, requires.goals);
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
