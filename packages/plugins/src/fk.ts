import { unreachable } from "@motion5/core/plugin-api";
import type { PluginDefinition, Outputs } from "@motion5/core/plugin-api";
import {
  BODY_2D_SLOT,
  POSE_2D_SPEC,
  ROOT_2D_SPEC,
  SOLVED_2D_SLOT,
  readAggregateTopology,
  type AggregateRow,
} from "./aggregate-topology";
import {
  clamp,
  composeWorld,
  lerpAngle,
  readFrame,
  readNumber,
  readPivotOffset,
  segmentExtent,
  type WorldFrame,
} from "./frame";

type FlatRecord = Readonly<Record<string, number | string | boolean>>;
type TableOutput = {
  readonly values: readonly { readonly id: string; readonly cells: FlatRecord }[];
};

type SolvedRowLookup =
  | { readonly kind: "found"; readonly row: AggregateRow }
  | { readonly kind: "missing"; readonly id: string };

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

function lookupSolvedRow(
  solvedById: ReadonlyMap<string, AggregateRow>,
  id: string,
): SolvedRowLookup {
  const row = solvedById.get(id);
  return row === undefined ? { kind: "missing", id } : { kind: "found", row };
}

function solveRotation(lookup: SolvedRowLookup): number {
  switch (lookup.kind) {
    case "found": {
      const rotation = lookup.row.cells.rotation;
      if (typeof rotation !== "number" || !Number.isFinite(rotation))
        throw new TypeError(`FK solver row for member "${lookup.row.id}" has no finite rotation.`);
      return rotation;
    }
    case "missing":
      throw new TypeError(`Solver row missing for member "${lookup.id}".`);
    default:
      return unreachable(lookup);
  }
}

export const fkPlugin: PluginDefinition = {
  id: "fk",
  inputs: {
    values: { kind: "record", fields: {} },
    requires: {
      chain: { outputs: { values: BODY_2D_SLOT } },
      solved: { outputs: { values: SOLVED_2D_SLOT } },
      base: { outputs: { values: ROOT_2D_SPEC } },
    },
  },
  outputs: { values: POSE_2D_SPEC },
  transform({ requires }) {
    const topology = readAggregateTopology((requires.chain as Outputs).values);
    const baseFrame = readFrame(recordOutput(requires.base as Outputs, "base"));
    const solvedRows = tableOutput(requires.solved as Outputs, "solved");
    const solvedById = new Map<string, AggregateRow>();
    for (const row of solvedRows) {
      solvedById.set(row.id, row as AggregateRow);
    }
    const worldFrames = new Map<string, WorldFrame>();
    const rows = topology.rows.map((row) => {
      const solved = solveRotation(lookupSolvedRow(solvedById, row.id));
      const authored = readNumber(row.cells.rotation);
      const weight = clamp(readNumber(row.cells.weight, 1), 0, 1);
      const rotation = lerpAngle(authored, solved, weight);
      const parent = topology.parentById.get(row.id);
      const parentFrame = parent === undefined ? baseFrame : worldFrames.get(parent)!;
      const pivot = composeWorld(parentFrame, {
        ...readPivotOffset(row.cells),
        rotation,
      });
      const world = composeWorld(pivot, {
        x: segmentExtent(readNumber(row.cells.length)),
        y: 0,
        rotation: 0,
      });
      worldFrames.set(row.id, world);
      return { id: row.id, cells: world };
    });
    return { values: rows };
  },
};
