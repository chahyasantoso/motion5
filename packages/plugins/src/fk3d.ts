import {
  diagnostic,
  ok,
  optional,
  prepareRefused,
  type PluginDefinition,
  type Prepared,
  type Scalar,
  type SourceStructures,
  type Table,
} from "@motion5/core/plugin-api";
import { bindBody, type BodyStructure } from "./body/domain";
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
import { bindSolved, type SolvedRow, type SolvedStructure } from "./solved/domain";
import { Body3d, Point3d, Points3d, Solved3d } from "./models";
import { nonEmptyDiagnostics } from "./prepare-diagnostics";
import { requireStructure, structureOf } from "./slot-structure";

type Fk3dInput = {
  readonly values: Readonly<Record<string, never>>;
  readonly requires: {
    readonly chain: Table;
    readonly solved?: Table;
    readonly base: Readonly<Record<string, Scalar>>;
  };
  readonly structures?: SourceStructures;
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

export const fk3dPlugin: PluginDefinition<Fk3dInput> = {
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
  prepare({ structures }) {
    const chain = structureOf<BodyStructure>(structures, "chain");
    const solved = structureOf<SolvedStructure>(structures, "solved");
    if (chain === undefined || solved === undefined) return ok(undefined);
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
  transform({ requires, structures }) {
    const chain = bindBody(
      requireStructure<BodyStructure>(structures, "chain", "FK3d"),
      requires.chain,
    );
    const solved =
      requires.solved === undefined
        ? undefined
        : bindSolved(
            requireStructure<SolvedStructure>(structures, "solved", "FK3d"),
            requires.solved,
          );
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
