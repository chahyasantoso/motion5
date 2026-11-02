import {
  diagnostic,
  typed,
  type PluginDefinition,
  type SourceStructures,
  type Structure,
} from "@motion5/core/plugin-api";
import type { Body, BodyStructure } from "./body/domain";
import { body2d } from "./body/type";
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
import type { Root } from "./root/domain";
import { root2d } from "./root/type";
import type { Solved, SolvedRow, SolvedStructure } from "./solved/domain";
import { solved2d } from "./solved/type";
import { POSE_2D_SPEC } from "./aggregate-topology";

type FkInput = {
  readonly values: Readonly<Record<string, never>>;
  readonly requires: {
    readonly chain: Body;
    readonly solved?: Solved;
    readonly base: Root;
  };
};

function solveRotation(row: SolvedRow | undefined, id: string): number {
  if (row === undefined) throw new TypeError(`Solver row missing for member "${id}".`);
  const rotation = row.cells.rotation;
  if (typeof rotation !== "number" || !Number.isFinite(rotation))
    throw new TypeError(`FK solver row for member "${row.id}" has no finite rotation.`);
  return rotation;
}

function structureOf<T>(structures: SourceStructures, slot: string): Structure<T> | undefined {
  return structures[slot] as Structure<T> | undefined;
}

export const fkPlugin: PluginDefinition<FkInput> = {
  id: "fk",
  inputs: {
    values: { kind: "record", fields: {} },
    requires: {
      chain: typed(body2d),
      solved: typed(solved2d, { optional: true }),
      base: typed(root2d),
    },
  },
  outputs: { values: POSE_2D_SPEC },
  checkSources(structures) {
    const chain = structureOf<BodyStructure>(structures, "chain");
    const solved = structureOf<SolvedStructure>(structures, "solved");
    if (chain === undefined || solved === undefined) return Object.freeze([]);
    const solvedIds = new Set(solved.ids);
    const diagnostics = chain.ids
      .filter((id) => !solvedIds.has(id))
      .map((id) =>
        diagnostic(
          "plugin-validation-failed",
          "solved",
          `Solver row missing for member "${id}".`,
        ),
      );
    return Object.freeze(diagnostics);
  },
  transform({ requires }) {
    const chain = requires.chain;
    const solved = requires.solved;
    const baseFrame = readFrame(requires.base);
    const worldFrames = new Map<string, WorldFrame>();
    const rows = chain.rows.map((row) => {
      const authored = readNumber(row.cells.rotation);
      const rotation =
        solved === undefined
          ? authored
          : lerpAngle(
              authored,
              solveRotation(solved.byId.get(row.id), row.id),
              clamp(readNumber(row.cells.weight, 1), 0, 1),
            );
      const parent = chain.parentById.get(row.id);
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
