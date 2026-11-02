import {
  diagnostic,
  typed,
  type PluginDefinition,
  type SourceStructures,
  type Structure,
} from "@motion5/core/plugin-api";
import type { Body, BodyStructure } from "./body/domain";
import { body3d } from "./body3d/type";
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
import type { Root } from "./root/domain";
import { root3d } from "./root3d/type";
import type { Solved, SolvedRow, SolvedStructure } from "./solved/domain";
import { solved3d } from "./solved3d/type";
import { POSE_3D_SPEC } from "./pose/fields";

type Fk3dInput = {
  readonly values: Readonly<Record<string, never>>;
  readonly requires: {
    readonly chain: Body;
    readonly solved?: Solved;
    readonly base: Root;
  };
};

function solvedOrientation(row: SolvedRow | undefined, id: string): Euler3d {
  if (row === undefined) throw new TypeError(`FK3d solver row missing for member "${id}".`);
  const rotation = row.cells.rotation;
  const rotationX = row.cells.rotationX;
  const rotationY = row.cells.rotationY;
  if (
    typeof rotation !== "number" ||
    !Number.isFinite(rotation) ||
    typeof rotationX !== "number" ||
    !Number.isFinite(rotationX) ||
    typeof rotationY !== "number" ||
    !Number.isFinite(rotationY)
  )
    throw new TypeError(`FK3d solver row for member "${row.id}" has no finite orientation.`);
  return { rotation, rotationX, rotationY };
}

function structureOf<T>(structures: SourceStructures, slot: string): Structure<T> | undefined {
  return structures[slot] as Structure<T> | undefined;
}

export const fk3dPlugin: PluginDefinition<Fk3dInput> = {
  id: "fk3d",
  inputs: {
    values: { kind: "record", fields: {} },
    requires: {
      chain: typed(body3d),
      solved: typed(solved3d, { optional: true }),
      base: typed(root3d),
    },
  },
  outputs: { values: POSE_3D_SPEC },
  checkSources(structures) {
    const chain = structureOf<BodyStructure>(structures, "chain");
    const solved = structureOf<SolvedStructure>(structures, "solved");
    if (chain === undefined || solved === undefined) return Object.freeze([]);
    const solvedIds = new Set(solved.ids);
    const diagnostics = chain.ids
      .filter((id) => !solvedIds.has(id))
      .map((id) =>
        diagnostic("plugin-validation-failed", "solved", `Solver row missing for member "${id}".`),
      );
    return Object.freeze(diagnostics);
  },
  transform({ requires }) {
    const chain = requires.chain;
    const solved = requires.solved;
    const baseFrame = readFrame3d(requires.base);
    const worldFrames = new Map<string, WorldFrame3d>();
    const rows = chain.rows.map((row) => {
      const rest = readEuler3d(row.cells);
      const local =
        solved === undefined
          ? rest
          : blendOrientation3d(
              rest,
              solvedOrientation(solved.byId.get(row.id), row.id),
              clamp(readNumber(row.cells.weight, 1), 0, 1),
            );
      const parent = chain.parentById.get(row.id);
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
