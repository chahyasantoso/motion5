import { definePlugin, diagnostic, ok, optional, prepareRefused } from "@motion5/core/plugin-api";
import {
  clamp,
  composeWorld,
  lerpAngle,
  readFrame,
  readNumber,
  readPivotOffset,
  segmentExtent,
  type WorldFrame,
} from "../frame/frame";
import { type SolvedRow } from "../models/solved/domain";
import { Body2d, Point2d, Points2d, Solved2d } from "../models/index";
import { nonEmptyDiagnostics } from "../shared/prepare-diagnostics";
import { rowAt, rowAtIndex, sameRowCount } from "../shared/table-lookup";

function solveRotation(row: SolvedRow): number {
  const rotation = row.cells.rotation;
  if (typeof rotation !== "number" || !Number.isFinite(rotation))
    throw new TypeError(`FK solver row for member "${row.id}" has no finite rotation.`);
  return rotation;
}

export const fkPlugin = definePlugin({
  id: "fk",
  inputs: {
    requires: {
      chain: Body2d,
      solved: optional(Solved2d),
      base: Point2d,
    },
  },
  outputs: { values: Points2d },
  prepare({ structures: { chain, solved } }) {
    if (solved === undefined) return ok(undefined);
    const solvedIds = new Set(solved.ids);
    const refused = nonEmptyDiagnostics(
      chain.ids
        .filter((id) => !solvedIds.has(id))
        .map((id) =>
          diagnostic(
            "plugin-validation-failed",
            "solved",
            `Solver row missing for member "${id}".`,
          ),
        ),
    );
    return refused === undefined ? ok(undefined) : prepareRefused(refused);
  },
  transform({ requires, structures: { chain, solved } }) {
    sameRowCount(requires.chain, chain.ids.length, "Body");
    if (requires.solved !== undefined && solved !== undefined)
      sameRowCount(requires.solved, solved.ids.length, "Solved");
    const baseFrame = readFrame(requires.base);
    const worldFrames = new Map<string, WorldFrame>();
    const rows = chain.ids.map((id, position) => {
      const row = rowAt(requires.chain, chain.tableIndex, position, id);
      const solvedIndex = solved?.indexById.get(id);
      if (solved !== undefined && requires.solved !== undefined && solvedIndex === undefined)
        throw new TypeError(`Solver row missing for member "${id}".`);
      const solvedRow =
        requires.solved === undefined || solvedIndex === undefined
          ? undefined
          : rowAtIndex(requires.solved, solvedIndex, id);
      const authored = readNumber(row.cells.rotation);
      const rotation =
        solvedRow === undefined
          ? authored
          : lerpAngle(
              authored,
              solveRotation(solvedRow),
              clamp(readNumber(row.cells.weight, 1), 0, 1),
            );
      const parent = chain.parentById.get(id);
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
      worldFrames.set(id, world);
      return { id, cells: world };
    });
    return { values: rows };
  },
});
