import { unreachable } from "@motion5/core/plugin-api";
import type { IdentifiedPluginDefinition, Outputs, ValueSpec } from "@motion5/core/plugin-api";
import {
  blendOrientation3d,
  composeWorld3d,
  readFrame3d,
  readPivotOffset3d,
  ZERO_EULER,
  type Euler3d,
} from "./frame3d";
import { clamp, readNumber, segmentExtent } from "./frame";

const MEMBER: ValueSpec = {
  kind: "record",
  fields: {
    memberId: { kind: "string" },
    parentId: { kind: "string" },
    x: { kind: "number", optional: true },
    y: { kind: "number", optional: true },
    z: { kind: "number", optional: true },
    length: { kind: "number" },
    rotation: { kind: "number", optional: true },
    rotationX: { kind: "number", optional: true },
    rotationY: { kind: "number", optional: true },
    weight: { kind: "number", optional: true },
  },
};

const FRAME: ValueSpec = {
  kind: "table",
  schema: {
    row: {
      fields: {
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

const SOLVER: ValueSpec = {
  kind: "table",
  schema: {
    row: {
      fields: {
        rotation: { kind: "number" },
        rotationX: { kind: "number" },
        rotationY: { kind: "number" },
      },
    },
  },
};

const OUTPUT: ValueSpec = {
  kind: "table",
  schema: {
    row: {
      fields: {
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

type FlatRecord = Readonly<Record<string, number | string | boolean>>;
type TableRows = readonly { readonly id: string; readonly cells: FlatRecord }[];
type MemberRowLookup =
  | { readonly kind: "found"; readonly row: TableRows[number] }
  | { readonly kind: "missing"; readonly memberId: string };

function flatRecord(value: unknown, path: string): FlatRecord {
  if (value === null || typeof value !== "object" || Array.isArray(value))
    throw new TypeError(`FK3d requires a record at ${path}.`);
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
    throw new TypeError(`FK3d requires a record output at ${path}.`);
  return flatRecord(values, `${path}.values`);
}

function tableOutput(outputs: Outputs, path: string): TableRows {
  const values = outputs.values;
  if (!Array.isArray(values)) throw new TypeError(`FK3d requires a table output at ${path}.`);
  return values as TableRows;
}

function baseRow(rows: TableRows, parentId: string): FlatRecord {
  const row = rows.find((candidate) => candidate.id === parentId);
  if (row === undefined) throw new TypeError(`FK3d base row missing for parent "${parentId}".`);
  return row.cells;
}

function stringField(record: FlatRecord, field: string, path: string): string {
  const value = record[field];
  if (typeof value !== "string" || value.length === 0)
    throw new TypeError(`FK3d requires ${path}.${field} to be a non-empty string.`);
  return value;
}

function lookupRow(rows: TableRows, memberId: string): MemberRowLookup {
  const row = rows.find((candidate) => candidate.id === memberId);
  return row === undefined ? { kind: "missing", memberId } : { kind: "found", row };
}

function solvedOrientation(lookup: MemberRowLookup): Euler3d {
  switch (lookup.kind) {
    case "found": {
      const rotation = lookup.row.cells.rotation;
      const rotationX = lookup.row.cells.rotationX;
      const rotationY = lookup.row.cells.rotationY;
      if (
        typeof rotation !== "number" ||
        !Number.isFinite(rotation) ||
        typeof rotationX !== "number" ||
        !Number.isFinite(rotationX) ||
        typeof rotationY !== "number" ||
        !Number.isFinite(rotationY)
      )
        throw new TypeError(
          `FK3d solver row for member "${lookup.row.id}" has no finite orientation.`,
        );
      return { rotation, rotationX, rotationY };
    }
    case "missing":
      throw new TypeError(`FK3d solver row missing for member "${lookup.memberId}".`);
    default:
      return unreachable(lookup);
  }
}

/** The identified 3D FK boundary; frame math stays owned by `frame3d.ts`. */
export const fk3dPlugin: IdentifiedPluginDefinition = {
  id: "fk3d",
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
    const baseRows = tableOutput(requires.base as Outputs, "base");
    const solverRows = tableOutput(requires.solver as Outputs, "solver");
    const memberId = stringField(member, "memberId", "member.values");
    const parentId = stringField(member, "parentId", "member.values");
    const solved = solvedOrientation(lookupRow(solverRows, memberId));
    const local = blendOrientation3d(
      {
        rotation: readNumber(member.rotation),
        rotationX: readNumber(member.rotationX),
        rotationY: readNumber(member.rotationY),
      },
      solved,
      clamp(readNumber(member.weight, 1), 0, 1),
    );
    const pivot = composeWorld3d(readFrame3d(baseRow(baseRows, parentId)), {
      ...readPivotOffset3d(member),
      ...local,
    });
    const world = composeWorld3d(pivot, {
      ...ZERO_EULER,
      x: segmentExtent(readNumber(member.length)),
      y: 0,
      z: 0,
    });
    return { values: [{ id: memberId, cells: world }] };
  },
};
