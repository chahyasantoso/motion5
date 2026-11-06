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
import { type BodyStructure } from "./body/domain";
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
import { type SolvedRow, type SolvedStructure } from "./solved/domain";
import { Body2d, Point2d, Points2d, Solved2d } from "./models";
import { nonEmptyDiagnostics } from "./prepare-diagnostics";
import { requireStructure, structureOf } from "./slot-structure";
import { rowAt, rowAtIndex, sameRowCount } from "./table-lookup";

const SLOT = { chain: "chain", solved: "solved", base: "base" } as const;

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
  prepare({ structures }) {
    const chain = structureOf<BodyStructure>(structures, SLOT.chain);
    const solved = structureOf<SolvedStructure>(structures, SLOT.solved);
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
    const chain = requireStructure<BodyStructure>(structures, SLOT.chain, "FK");
    const solved =
      requires.solved === undefined
        ? undefined
        : requireStructure<SolvedStructure>(structures, SLOT.solved, "FK");
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
              solveRotation(solvedRow, id),
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
};
