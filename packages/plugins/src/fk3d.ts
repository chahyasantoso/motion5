import { definePlugin, diagnostic, ok, optional, prepareRefused } from "@motion5/core/plugin-api";
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
import { type SolvedRow } from "./solved/domain";
import { Body3d, Point3d, Points3d, Solved3d } from "./models";
import { nonEmptyDiagnostics } from "./prepare-diagnostics";
import { rowAt, rowAtIndex, sameRowCount } from "./table-lookup";

function solvedOrientation(row: SolvedRow): Euler3d {
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

export const fk3dPlugin = definePlugin({
  id: "fk3d",
  inputs: {
    values: { kind: "record", fields: {} },
    requires: {
      chain: Body3d,
      solved: optional(Solved3d),
      base: Point3d,
    },
  },
  outputs: { values: Points3d },
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
    const baseFrame = readFrame3d(requires.base);
    const worldFrames = new Map<string, WorldFrame3d>();
    const rows = chain.ids.map((id, position) => {
      const row = rowAt(requires.chain, chain.tableIndex, position, id);
      const solvedIndex = solved?.indexById.get(id);
      if (solved !== undefined && requires.solved !== undefined && solvedIndex === undefined)
        throw new TypeError(`FK3d solver row missing for member "${id}".`);
      const solvedRow =
        requires.solved === undefined || solvedIndex === undefined
          ? undefined
          : rowAtIndex(requires.solved, solvedIndex, id);
      const rest = readEuler3d(row.cells);
      const local =
        solvedRow === undefined
          ? rest
          : blendOrientation3d(
              rest,
              solvedOrientation(solvedRow),
              clamp(readNumber(row.cells.weight, 1), 0, 1),
            );
      const parent = chain.parentById.get(id);
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
      worldFrames.set(id, world);
      return { id, cells: world };
    });
    return { values: rows };
  },
});
