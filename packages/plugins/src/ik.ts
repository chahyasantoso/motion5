import type { IdentifiedPluginDefinition, Outputs, ValueSpec } from "@motion5/core/plugin-api";
import { readFrame, readNumber, readPivotOffset } from "./frame";
import type { SolveMember } from "./ik-member";
import { readJointLimit } from "./ik-constraint";
import { readInfluence } from "./ik-goal";
import { inspectSolve } from "./ik-result";
import { solveChain } from "./ik-solve";

const MEMBER: ValueSpec = {
  kind: "record",
  fields: {
    memberId: { kind: "string" },
    parentId: { kind: "string", optional: true },
    length: { kind: "number" },
    x: { kind: "number", optional: true },
    y: { kind: "number", optional: true },
    minRotation: { kind: "number", optional: true },
    maxRotation: { kind: "number", optional: true },
    influence: { kind: "number", optional: true },
  },
};

const ROOT: ValueSpec = {
  kind: "record",
  fields: {
    memberId: { kind: "string" },
    x: { kind: "number" },
    y: { kind: "number" },
    rotation: { kind: "number" },
  },
};

const GOAL: ValueSpec = {
  kind: "record",
  fields: {
    goalId: { kind: "string" },
    memberId: { kind: "string" },
    x: { kind: "number" },
    y: { kind: "number" },
    influence: { kind: "number", optional: true },
  },
};

const SOLVED_ROW: ValueSpec = {
  kind: "table",
  schema: {
    row: {
      fields: {
        rotation: { kind: "number" },
        residual: { kind: "number", optional: true },
        atBound: { kind: "boolean", optional: true },
      },
    },
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

type RecordOutput = { readonly values: FlatRecord };
type MapOutput = Readonly<Record<string, RecordOutput>>;
type FlatRecord = Readonly<Record<string, number | string | boolean>>;
type ResolvedRequires = Readonly<Record<string, Outputs | Readonly<Record<string, Outputs>>>>;

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

function recordsOutput(value: unknown, path: string): MapOutput {
  if (value === null || typeof value !== "object" || Array.isArray(value))
    throw new TypeError(`IK requires a map output at ${path}.`);
  return value as MapOutput;
}

function stringField(record: FlatRecord, field: string, path: string): string {
  const value = record[field];
  if (typeof value !== "string" || value.length === 0)
    throw new TypeError(`IK requires ${path}.${field} to be a non-empty string.`);
  return value;
}

function optionalStringField(record: FlatRecord, field: string): string | undefined {
  const value = record[field];
  if (value === undefined) return undefined;
  if (typeof value !== "string" || value.length === 0)
    throw new TypeError(`IK requires ${field} to be a non-empty string when present.`);
  return value;
}

function memberRows(requires: ResolvedRequires): readonly SolveMember[] {
  const root = recordOutput(requires.root as Outputs, "root");
  const rootId = stringField(root, "memberId", "root.values");
  const members = recordsOutput(requires.members, "members");
  const goals = recordsOutput(requires.goals, "goals");
  const memberIds = new Set<string>();
  const goalByMember = new Map<string, FlatRecord>();
  for (const [label, output] of Object.entries(goals)) {
    const goal = recordOutput(output as Outputs, `goals.${label}`);
    const memberId = stringField(goal, "memberId", `goals.${label}.values`);
    if (goalByMember.has(memberId))
      throw new TypeError(`IK received duplicate goal for ${memberId}.`);
    goalByMember.set(memberId, goal);
  }
  const rows = Object.entries(members).map(([label, output]) => {
    const values = recordOutput(output as Outputs, `members.${label}`);
    const id = stringField(values, "memberId", `members.${label}.values`);
    if (!memberIds.add(id)) throw new TypeError(`IK received duplicate member id ${id}.`);
    const parentId = optionalStringField(values, "parentId") ?? rootId;
    const goal = goalByMember.get(id);
    const merged = flatRecord(
      goal === undefined
        ? values
        : { ...values, ...(goal.influence === undefined ? {} : { influence: goal.influence }) },
      `members.${label}.values`,
    );
    const limit = readJointLimit(merged);
    const influence = readInfluence(merged);
    return {
      id,
      base: parentId,
      length: readNumber(merged.length),
      pivot: readPivotOffset(merged),
      ...(goal === undefined ? {} : { goal: readFrame(goal) }),
      ...(limit.kind === "range" ? { limit } : {}),
      ...(influence === undefined ? {} : { influence }),
    };
  });
  for (const id of goalByMember.keys())
    if (!memberIds.has(id)) throw new TypeError(`IK goal targets unknown member ${id}.`);
  return rows;
}

function rootFrame(requires: ResolvedRequires) {
  return readFrame(recordOutput(requires.root as Outputs, "root"));
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

export const ikPlugin: IdentifiedPluginDefinition = {
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
      members: { binding: "map", outputs: { values: MEMBER } },
      root: { outputs: { values: ROOT } },
      goals: { binding: "map", outputs: { values: GOAL } },
    },
  },
  outputs: { values: SOLVED_ROW, inspect: { ...INSPECT, optional: true } },
  transform({ values, requires }) {
    const local = flatRecord(values, "input.values");
    const members = memberRows(requires);
    const result = solveChain(rootFrame(requires), members, local.flip === true);
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
