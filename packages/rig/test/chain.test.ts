import { describe, expect, it } from "vitest";
import { buildChain, chainPoses, fk, ik } from "@gerak/rig";

const ARM = [
  { id: "lower", parentId: "upper", length: 80 },
  { id: "upper", length: 100 },
];

describe("buildChain", () => {
  it("orders bones parent first, whatever order they came in", () => {
    expect(buildChain(ARM).structure.ids).toEqual(["upper", "lower"]);
  });

  it("refuses a parent it does not know", () => {
    expect(() => buildChain([{ id: "a", parentId: "ghost", length: 1 }])).toThrow(
      /buildChain: bone "a" names unknown parent "ghost"/,
    );
  });

  it("refuses a cycle", () => {
    expect(() =>
      buildChain([
        { id: "a", parentId: "b", length: 1 },
        { id: "b", parentId: "a", length: 1 },
      ]),
    ).toThrow(/buildChain: bone "[ab]" is in a parent cycle/);
  });
});

describe("fk", () => {
  const arm = buildChain(ARM);

  it("places each bone's tip along its parent, straight when nothing turns", () => {
    const frames = fk(arm);
    expect(frames.upper).toEqual({ x: 100, y: 0, rotation: 0 });
    expect(frames.lower).toEqual({ x: 180, y: 0, rotation: 0 });
  });

  it("turns a bone and everything below it", () => {
    const frames = fk(arm, { base: { x: 10, y: 0, rotation: 0 }, rotations: { upper: 90 } });
    expect(frames.upper?.x).toBeCloseTo(10, 9);
    expect(frames.upper?.y).toBeCloseTo(100, 9);
    expect(frames.lower?.y).toBeCloseTo(180, 9);
    expect(frames.lower?.rotation).toBeCloseTo(90, 9);
  });

  it("reads a bone's own authored rotation", () => {
    const bent = buildChain([{ id: "a", length: 10, rotation: 180 }]);
    expect(fk(bent).a?.x).toBeCloseTo(-10, 9);
  });
});

describe("ik", () => {
  const arm = buildChain(ARM);

  it("turns the bones so the end reaches a goal in range", () => {
    const goal = { x: 60, y: 120 };
    const { rotations } = ik(arm, { lower: goal });
    const tip = fk(arm, { rotations }).lower;
    expect(tip?.x).toBeCloseTo(goal.x, 6);
    expect(tip?.y).toBeCloseTo(goal.y, 6);
  });

  it("bends the other way when flipped", () => {
    const goal = { x: 60, y: 120 };
    const straight = ik(arm, { lower: goal }).rotations;
    const flipped = ik(arm, { lower: goal }, { flip: true }).rotations;
    expect(Math.sign(flipped.lower ?? 0)).toBe(-Math.sign(straight.lower ?? 0));
  });
});

describe("a chain typed by its bone ids", () => {
  const arm = buildChain([
    { id: "upper", length: 100 },
    { id: "lower", parentId: "upper", length: 100 },
  ]);

  it("answers every bone by name, with no missing entries", () => {
    const { rotations } = ik(arm, { lower: { x: 150, y: 0 } });
    const turn: number = rotations.upper + rotations.lower;
    expect(turn).toBeCloseTo(-41.40962210927086, 9);
    expect(fk(arm, { rotations }).lower.x).toBeCloseTo(150, 6);
  });

  it("bends the elbow clockwise of the reach on screen, and the other way when flipped", () => {
    const reach = { lower: { x: 150, y: 0 } };
    expect(fk(arm, ik(arm, reach)).upper.y).toBeGreaterThan(0);
    expect(fk(arm, ik(arm, reach, { flip: true })).upper.y).toBeLessThan(0);
  });

  it("points the chain straight at a goal out of reach and says so", () => {
    const far = ik(arm, { lower: { x: 500, y: 0 } });
    expect(far.quality.kind).toBe("too-far");
    expect(fk(arm, far).lower).toEqual({ x: 200, y: 0, rotation: 0 });
  });

  it("poses each bone from its start joint and each tip as an offset from the base", () => {
    const base = { x: 250, y: 300, rotation: 0 };
    const { bones, tips } = chainPoses(arm, { rotations: { upper: 90, lower: -90 }, base });
    expect(bones.upper).toEqual({ x: 0, y: 0, rotation: 90, anchor: "left" });
    expect(bones.lower.x).toBeCloseTo(0, 9);
    expect(bones.lower.y).toBeCloseTo(100, 9);
    expect(bones.lower.rotation).toBeCloseTo(0, 9);
    expect(tips.lower.x).toBeCloseTo(100, 9);
    expect(tips.lower.y).toBeCloseTo(100, 9);
  });
});
