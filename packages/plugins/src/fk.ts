import { unreachable } from "@motion5/core/plugin-api";
import type { IdentifiedPluginDefinition, Outputs, ValueSpec } from "@motion5/core/plugin-api";
import {
  clamp,
  composeWorld,
  lerpAngle,
  readFrame,
  readNumber,
  readPivotOffset,
  segmentExtent,
} from "./frame";

const MEMBER: ValueSpec = {
  kind: "record",
  fields: {
    memberId: { kind: "string" },
    x: { kind: "number", optional: true },
    y: { kind: "number", optional: true },
    length: { kind: "number" },
    rotation: { kind: "number", optional: true },
    weight: { kind: "number", optional: true },
  },
};

const FRAME: ValueSpec = {
  kind: "record",
  fields: {
    x: { kind: "number" },
    y: { kind: "number" },
    rotation: { kind: "number" },
  },
};

const SOLVER: ValueSpec = {
  kind: "table",
  schema: { row: { fields: { rotation: { kind: "number" } } } },
};

const OUTPUT: ValueSpec = {
  kind: "table",
  schema: {
    row: {
      fields: {
        x: { kind: "number" },
        y: { kind: "number" },
        rotation: { kind: "number" },
      },
    },
  },
};

type FlatRecord = Readonly<Record<string, number | string | boolean>>;
type RecordOutput = { readonly values: FlatRecord };
type TableOutput = {
  readonly values: readonly { readonly id: string; readonly cells: FlatRecord }[];
};
type ResolvedRequires = Readonly<Record<string, Outputs | Readonly<Record<string, Outputs>>>>;
type MemberRowLookup =
  | { readonly kind: "found"; readonly row: { readonly id: string; readonly cells: FlatRecord } }
  | { readonly kind: "missing"; readonly memberId: string };

function flatRecord(value: unknown, path: string): FlatRecord {
  if (value === null || typeof value !== "object" || Array.isArray(value))
    throw new TypeError(`FK requires a record at ${path}.`);
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
    throw new TypeError(`FK requires a record output at ${path}.`);
  return flatRecord(values, `${path}.values`);
}

function tableOutput(outputs: Outputs, path: string): TableOutput["values"] {
  const values = outputs.values;
  if (!Array.isArray(values)) throw new TypeError(`FK requires a table output at ${path}.`);
  return values as TableOutput["values"];
}

function stringField(record: FlatRecord, field: string, path: string): string {
  const value = record[field];
  if (typeof value !== "string" || value.length === 0)
    throw new TypeError(`FK requires ${path}.${field} to be a non-empty string.`);
  return value;
}

function lookupRow(rows: TableOutput["values"], memberId: string): MemberRowLookup {
  const row = rows.find((candidate) => candidate.id === memberId);
  return row === undefined ? { kind: "missing", memberId } : { kind: "found", row };
}

function solveRotation(lookup: MemberRowLookup): number {
  switch (lookup.kind) {
    case "found": {
      const rotation = lookup.row.cells.rotation;
      if (typeof rotation !== "number" || !Number.isFinite(rotation))
        throw new TypeError(`FK solver row for member "${lookup.row.id}" has no finite rotation.`);
      return rotation;
    }
    case "missing":
      throw new TypeError(`Solver row missing for member "${lookup.memberId}".`);
    default:
      return unreachable(lookup);
  }
}

export const fkPlugin: IdentifiedPluginDefinition = {
  id: "fk",
  inputs: {
    values: { kind: "record", fields: {} },
    requires: {
      member: { outputs: { values: MEMBER } },
      base: { outputs: { values: FRAME } },
      solver: { outputs: { values: SOLVER } },
    },
  },
  outputs: { values: OUTPUT },
  transform({ requires }) {
    const member = recordOutput(requires.member as Outputs, "member");
    const base = recordOutput(requires.base as Outputs, "base");
    const solverRows = tableOutput(requires.solver as Outputs, "solver");
    const memberId = stringField(member, "memberId", "member.values");
    const solved = solveRotation(lookupRow(solverRows, memberId));
    const authored = readNumber(member.rotation);
    const weight = clamp(readNumber(member.weight, 1), 0, 1);
    const rotation = lerpAngle(authored, solved, weight);
    const pivot = composeWorld(readFrame(base), { ...readPivotOffset(member), rotation });
    const world = composeWorld(pivot, {
      x: segmentExtent(readNumber(member.length)),
      y: 0,
      rotation: 0,
    });
    return { values: [{ id: memberId, cells: world }] };
  },
};
