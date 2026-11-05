import {
  diagnostic,
  ok,
  optional,
  refused,
  type PluginDefinition,
  type Prepared,
  type Scalar,
  type SourceStructures,
  type Table,
} from "@motion5/core/plugin-api";
import { bindBody, type BodyStructure } from "./body/domain";
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
import { bindSolved, type SolvedRow, type SolvedStructure } from "./solved/domain";
import { Body2d, Point2d, Points2d, Solved2d } from "./models";
import { requireStructure, structureOf } from "./slot-structure";

type FkInput = {
  readonly values: Readonly<Record<string, never>>;
  readonly requires: {
    readonly chain: Table;
    readonly solved?: Table;
    readonly base: Readonly<Record<string, Scalar>>;
  };
  readonly structures?: SourceStructures;
};

function solveRotation(row: SolvedRow | undefined, id: string): number {
  if (row === undefined) throw new TypeError(`Solver row missing for member "${id}".`);
  const rotation = row.cells.rotation;
  if (typeof rotation !== "number" || !Number.isFinite(rotation))
    throw new TypeError(`FK solver row for member "${row.id}" has no finite rotation.`);
  return rotation;
}

export const fkPlugin: PluginDefinition<FkInput> = {
  id: "fk",
  inputs: {
    values: { kind: "record", fields: {} },
    requires: {
      chain: Body2d,
      solved: optional(Solved2d),
      base: Point2d,
    },
  },
  outputs: { values: Points2d },
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
    const missing = chain.ids.filter((id) => !solvedIds.has(id));
    if (missing.length > 0) {
      return refused(
        missing.map((id) => ({
          path: "solved",
          message: `Solver row missing for member "${id}".`,
        })),
      );
    }
    return ok(undefined);
  },
  transform({ requires, structures }) {
    const chain = bindBody(
      requireStructure<BodyStructure>(structures, "chain", "FK"),
      requires.chain,
    );
    const solved =
      requires.solved === undefined
        ? undefined
        : bindSolved(
            requireStructure<SolvedStructure>(structures, "solved", "FK"),
            requires.solved,
          );
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
