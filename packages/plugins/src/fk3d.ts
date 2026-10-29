import { unreachable } from "@motion5/core/plugin-api";
import type { IdentifiedPluginDefinition, Outputs } from "@motion5/core/plugin-api";
import {
  BODY_3D_SLOT,
  POSE_3D_SPEC,
  ROOT_3D_SPEC,
  SOLVED_3D_SLOT,
  readAggregateTopology,
  type AggregateRow,
} from "./aggregate-topology";
import {
  blendOrientation3d,
  composeWorld3d,
  readEuler3d,
  readFrame3d,
  readPivotOffset3d,
  ZERO_EULER,
  type Euler3d,
  type WorldFrame3d,
} from "./frame3d";
import { clamp, readNumber, segmentExtent } from "./frame";

type FlatRecord = Readonly<Record<string, number | string | boolean>>;
type TableOutput = {
  readonly values: readonly { readonly id: string; readonly cells: FlatRecord }[];
};

type SolvedRowLookup3d =
  | { readonly kind: "found"; readonly row: AggregateRow }
  | { readonly kind: "missing"; readonly id: string };

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

function tableOutput(outputs: Outputs, path: string): TableOutput["values"] {
  const values = outputs.values;
  if (!Array.isArray(values)) throw new TypeError(`FK3d requires a table output at ${path}.`);
  return values as TableOutput["values"];
}

function lookupSolvedRow3d(
  solvedById: ReadonlyMap<string, AggregateRow>,
  id: string,
): SolvedRowLookup3d {
  const row = solvedById.get(id);
  return row === undefined ? { kind: "missing", id } : { kind: "found", row };
}

function solvedOrientation(lookup: SolvedRowLookup3d): Euler3d {
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
      throw new TypeError(`FK3d solver row missing for member "${lookup.id}".`);
    default:
      return unreachable(lookup);
  }
}

export const fk3dPlugin: IdentifiedPluginDefinition = {
  id: "fk3d",
  inputs: {
    values: { kind: "record", fields: {} },
    requires: {
      chain: { outputs: { values: BODY_3D_SLOT } },
      solved: { outputs: { values: SOLVED_3D_SLOT } },
      base: { outputs: { values: ROOT_3D_SPEC } },
    },
  },
  outputs: { values: POSE_3D_SPEC },
  transform({ requires }) {
    const topology = readAggregateTopology((requires.chain as Outputs).values);
    const baseFrame = readFrame3d(recordOutput(requires.base as Outputs, "base"));
    const solvedRows = tableOutput(requires.solved as Outputs, "solved");
    const solvedById = new Map<string, AggregateRow>();
    for (const row of solvedRows) {
      solvedById.set(row.id, row as AggregateRow);
    }
    const worldFrames = new Map<string, WorldFrame3d>();
    const rows = topology.rows.map((row) => {
      const solved = solvedOrientation(lookupSolvedRow3d(solvedById, row.id));
      const rest = readEuler3d(row.cells);
      const weight = clamp(readNumber(row.cells.weight, 1), 0, 1);
      const local = blendOrientation3d(rest, solved, weight);
      const parent = topology.parentById.get(row.id);
      const parentFrame = parent === undefined ? baseFrame : worldFrames.get(parent)!;
      const pivot = composeWorld3d(parentFrame, {
        ...readPivotOffset3d(row.cells),
        ...local,
      });
      const world = composeWorld3d(pivot, {
        ...ZERO_EULER,
        x: segmentExtent(readNumber(row.cells.length)),
        y: 0,
        z: 0,
      });
      worldFrames.set(row.id, world);
      return { id: row.id, cells: world };
    });
    return { values: rows };
  },
};
