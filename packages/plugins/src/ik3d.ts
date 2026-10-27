import type { IdentifiedPluginDefinition, Outputs, ValueSpec } from "@motion5/core/plugin-api";
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

const MEMBER: ValueSpec = {
  kind: "record",
  fields: {
    memberId: { kind: "string" },
    parentId: { kind: "string", optional: true },
    length: { kind: "number" },
    x: { kind: "number", optional: true },
    y: { kind: "number", optional: true },
    z: { kind: "number", optional: true },
    rotation: { kind: "number", optional: true },
    rotationX: { kind: "number", optional: true },
    rotationY: { kind: "number", optional: true },
    orient: { kind: "number", optional: true },
    influence: { kind: "number", optional: true },
    joint: { kind: "string", optional: true },
    axisX: { kind: "number", optional: true },
    axisY: { kind: "number", optional: true },
    axisZ: { kind: "number", optional: true },
    minRotation: { kind: "number", optional: true },
    maxRotation: { kind: "number", optional: true },
    minTwist: { kind: "number", optional: true },
    maxTwist: { kind: "number", optional: true },
    maxSwing: { kind: "number", optional: true },
  },
};

const ROOT: ValueSpec = {
  kind: "table",
  schema: {
    row: {
      fields: {
        memberId: { kind: "string" },
        x: { kind: "number" },
        y: { kind: "number" },
        z: { kind: "number" },
        rotation: { kind: "number" },
        rotationX: { kind: "number" },
        rotationY: { kind: "number" },
      },
    },
  },
};

const GOAL: ValueSpec = {
  kind: "record",
  fields: {
    goalId: { kind: "string" },
    memberId: { kind: "string" },
    x: { kind: "number" },
    y: { kind: "number" },
    z: { kind: "number" },
    rotation: { kind: "number", optional: true },
    rotationX: { kind: "number", optional: true },
    rotationY: { kind: "number", optional: true },
    influence: { kind: "number", optional: true },
  },
};

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

const SOLVED_ROW: ValueSpec = {
  kind: "table",
  schema: {
    row: {
      fields: {
        rotation: { kind: "number" },
        rotationX: { kind: "number" },
        rotationY: { kind: "number" },
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

type FlatRecord = Readonly<Record<string, number | string | boolean>>;
type RecordOutput = { readonly values: FlatRecord };
type MapOutput = Readonly<Record<string, RecordOutput>>;
type ResolvedRequires = Readonly<Record<string, Outputs | Readonly<Record<string, Outputs>>>>;

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

function rootOutput(outputs: Outputs, path: string): FlatRecord {
  const values = outputs.values;
  if (!Array.isArray(values)) throw new TypeError(`IK3d requires a root table at ${path}.`);
  const row = values.find(
    (candidate) =>
      candidate.cells !== null &&
      typeof candidate.cells === "object" &&
      candidate.cells.memberId === candidate.id,
  );
  if (row === undefined) throw new TypeError(`IK3d requires a root row at ${path}.`);
  return flatRecord(row.cells, `${path}.values[${row.id}]`);
}

function recordsOutput(value: unknown, path: string): MapOutput {
  if (value === null || typeof value !== "object" || Array.isArray(value))
    throw new TypeError(`IK3d requires a map output at ${path}.`);
  return value as MapOutput;
}

function stringField(record: FlatRecord, field: string, path: string): string {
  const value = record[field];
  if (typeof value !== "string" || value.length === 0)
    throw new TypeError(`IK3d requires ${path}.${field} to be a non-empty string.`);
  return value;
}

function optionalStringField(record: FlatRecord, field: string): string | undefined {
  const value = record[field];
  if (value === undefined) return undefined;
  if (typeof value !== "string" || value.length === 0)
    throw new TypeError(`IK3d requires ${field} to be a non-empty string when present.`);
  return value;
}

function memberRows(requires: ResolvedRequires): readonly ChainMember3d[] {
  const root = rootOutput(requires.root as Outputs, "root");
  const rootId = stringField(root, "memberId", "root.values");
  const members = recordsOutput(requires.members, "members");
  const goals = recordsOutput(requires.goals, "goals");
  const memberIds = new Set<string>();
  const goalByMember = new Map<string, FlatRecord>();
  for (const [label, output] of Object.entries(goals)) {
    const goal = recordOutput(output as Outputs, `goals.${label}`);
    const memberId = stringField(goal, "memberId", `goals.${label}.values`);
    if (goalByMember.has(memberId))
      throw new TypeError(`IK3d received duplicate goal for ${memberId}.`);
    goalByMember.set(memberId, goal);
  }
  const rows = Object.entries(members).map(([label, output]): ChainMember3d => {
    const values = recordOutput(output as Outputs, `members.${label}`);
    const id = stringField(values, "memberId", `members.${label}.values`);
    if (!memberIds.add(id)) throw new TypeError(`IK3d received duplicate member id ${id}.`);
    const goal = goalByMember.get(id);
    const merged = flatRecord(
      goal === undefined
        ? values
        : { ...values, ...(goal.influence === undefined ? {} : { influence: goal.influence }) },
      `members.${label}.values`,
    );
    const limit = readJointLimit3d(merged);
    const influence = readInfluence(merged);
    const orient = readOrient(merged);
    return {
      id,
      base: optionalStringField(values, "parentId") ?? rootId,
      length: readNumber(merged.length),
      offset: readPivotOffset3d(merged),
      rest: readEuler3d(merged),
      ...(constrains(limit) ? { limit } : {}),
      ...(influence === undefined ? {} : { influence }),
      ...(orient === undefined ? {} : { orient }),
      ...(goal === undefined ? {} : { goal: readFrame3d(goal) }),
    };
  });
  for (const id of goalByMember.keys())
    if (!memberIds.has(id)) throw new TypeError(`IK3d goal targets unknown member ${id}.`);
  return rows;
}

function rootFrame(requires: ResolvedRequires) {
  return readFrame3d(rootOutput(requires.root as Outputs, "root"));
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

export const ik3dPlugin: IdentifiedPluginDefinition = {
  id: "ik3d",
  inputs: {
    values: {
      kind: "record",
      fields: {
        inspect: { kind: "boolean", optional: true, static: true },
      },
    },
    requires: {
      members: { binding: "map", outputs: { values: MEMBER } },
      root: { outputs: { values: ROOT } },
      goals: { binding: "map", outputs: { values: GOAL } },
      pole: { optional: true, outputs: { values: FRAME } },
    },
  },
  outputs: { values: SOLVED_ROW, inspect: { ...INSPECT, optional: true } },
  transform({ values, requires }) {
    const local = flatRecord(values, "input.values");
    const members = memberRows(requires);
    const pole = readPole3d(
      requires.pole === undefined ? undefined : recordOutput(requires.pole as Outputs, "pole"),
    );
    const result = solveChain3d(rootFrame(requires), members, pole);
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
