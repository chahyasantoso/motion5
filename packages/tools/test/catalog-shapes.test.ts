import { describe, expect, it } from "vitest";
import { type Pose2d } from "@gerak/core";
import { defineMove } from "@gerak/moves";
import {
  collectRecords,
  distance,
  duplicatePairs,
  loadDuplicateBaseline,
  query,
  type MoveRecord,
} from "../src/scene/catalog";
import { descriptorsOf } from "../src/scene/moves";

const number = (description: string) => ({ kind: "number", description }) as const;

const mover = (id: string, run: (progress: number) => Pose2d, bounded = false) =>
  defineMove({
    id,
    role: "emphasis",
    description: "A test mover.",
    options: {
      amount: bounded
        ? { kind: "number", min: 0, max: 2, default: 1, description: "Unused." }
        : number("Unused."),
    },
    example: { options: { amount: 1 } },
    moments: () => ({}),
    run: (_options, { progress }): Pose2d => run(progress),
  });

const arch = (p: number): number => 100 * Math.sin(Math.PI * p);
/** The records of the moves, in the order the moves are given. */
const records = (...moves: readonly ReturnType<typeof mover>[]): readonly MoveRecord[] => {
  const found = collectRecords(
    [{ module: Object.fromEntries(moves.map((made) => [made.id, made])), source: "kit" }],
    {},
  ).map(({ record }) => record);
  return moves.flatMap(({ id }) => found.filter((record) => record.id === id));
};

describe("the shape of every field", () => {
  it("keeps one shape for each field a move moves, at the example and at each option set", () => {
    const found = descriptorsOf(mover("both", (p) => ({ x: arch(p), y: -40 * p }), true));
    expect(Object.keys(found.shapes)).toEqual(["x", "y"]);
    expect(found.shapes.y?.travelling).toBe(true);
    expect(found.shapes.x?.travelling).toBe(false);
    expect(found.shapesAt).toHaveLength(3);
    expect(found.shapesAt[0]?.options).toEqual({ amount: 1 });
    expect(found.shapesAt[0]?.shapes).toEqual(found.shapes);
    expect(found.shapesAt.map(({ options }) => options)).toEqual([
      { amount: 1 },
      { amount: 0 },
      { amount: 2 },
    ]);
  });

  it("measures a move against itself as 0 and against a move sharing no field as 1", () => {
    const [left, same, other] = records(
      mover("left", (p) => ({ x: arch(p) })),
      mover("same", (p) => ({ x: arch(p) })),
      mover("other", (p) => ({ scale: 1 + p })),
    );
    if (left === undefined || same === undefined || other === undefined) throw new Error("records");
    expect(distance(left, left)).toBe(0);
    expect(distance(left, same)).toBe(0);
    expect(distance(left, other)).toBe(1);
  });

  it("counts a field only one move has as a whole step apart, averaged over the fields of both", () => {
    const [one, two] = records(
      mover("one", (p) => ({ x: arch(p) })),
      mover("two", (p) => ({ x: arch(p), y: arch(p) })),
    );
    if (one === undefined || two === undefined) throw new Error("records");
    expect(distance(one, two)).toBeCloseTo(0.5, 9);
  });

  it("gives the built-in hop a y shape of its own beside its x shape", () => {
    const hop = collectRecords([])
      .map(({ record }) => record)
      .find((record) => record.id === "hop");
    expect(Object.keys(hop?.shapes ?? {})).toEqual(expect.arrayContaining(["x", "y"]));
    expect(hop?.shapes.y?.travelling).toBe(false);
    expect(hop?.shapes.y?.settle).toBeGreaterThan(0.5);
  });

  it("finds only duplicate pairs the baseline lists", () => {
    const found = duplicatePairs(collectRecords([]).map(({ record }) => record));
    const listed = loadDuplicateBaseline();
    for (const pair of found) expect(listed.has(pair)).toBe(true);
  });
});

describe("--like on any field", () => {
  const ringing = mover("ringer", (p) => ({
    x: 5 * Math.sin(Math.PI * p),
    y: -100 * Math.sin(Math.PI * p) * Math.cos(14 * p),
  }));
  const quiet = mover("quiet", (p) => ({ x: arch(p) }));

  it("keeps a move when one of its fields has the quality, and names that field", () => {
    const found = query(records(ringing, quiet), { like: "loose" });
    if (found.kind !== "rows") throw new Error(found.message);
    expect(found.rows.map(({ record }) => record.id)).toEqual(["ringer"]);
    expect(found.rows[0]?.field).toBe("y");
  });
});
