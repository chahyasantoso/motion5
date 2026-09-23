import { describe, expect, it } from "vitest";
import { composeWorld, type WorldFrame } from "../../../src/plugins/frame";
import { solveFabrik } from "../../../src/plugins/fabrik";
import {
  atBound,
  limitRotation,
  readBend,
  readJointLimit,
  restDirection,
  wrapRotation,
  type JointRange,
} from "../../../src/plugins/ik-constraint";
import { chainShape, solveChain } from "../../../src/plugins/ik-solve";
import type { SolveMember } from "../../../src/plugins/ik-member";

const ROOT: WorldFrame = { x: 0, y: 0, rotation: 0 };
const GOAL: WorldFrame = { x: 0, y: 140, rotation: 0 };

function members(limit?: JointRange): readonly SolveMember[] {
  const upper: SolveMember = { id: "upper", base: "root", length: 80 };
  return [
    limit === undefined ? upper : { ...upper, limit },
    { id: "fore", base: "upper", length: 60, goal: GOAL },
  ];
}

describe("constrained 2D IK (phase 3)", () => {
  it("CL-1 owns wrapping, clamping, bounds, and authored readers", () => {
    expect(wrapRotation(-180)).toBe(180);
    expect(wrapRotation(540)).toBe(180);
    const limit = { kind: "range" as const, min: -20, max: 30 };
    expect(limitRotation(limit, -40)).toBe(-20);
    expect(limitRotation(limit, 40)).toBe(30);
    expect(atBound(limit, 30)).toBe(true);
    expect(readJointLimit({ minRotation: -20, maxRotation: 30 })).toEqual(limit);
    expect(readJointLimit({ minRotation: [{ p: 0, v: -20 }] })).toEqual({ kind: "free" });
    expect(readJointLimit({ minRotation: "bad", maxRotation: 30 })).toEqual({
      kind: "range",
      min: -180,
      max: 30,
    });
    expect(readBend({ bend: "positive" })).toBe(true);
    expect(readBend({ bend: "negative" })).toBe(false);
    expect(readBend({ bend: "bad", flip: true })).toBe(true);
  });

  it("CL-2 dispatches a limited two-bone chain to FABRIK and respects its range", () => {
    const chain = members({ kind: "range", min: -10, max: 10 });
    expect(chainShape(chain).kind).toBe("constrained");
    const solved = solveChain(ROOT, chain);
    expect(solved.quality.kind).toBe("limited");
    expect(solved.rotations.upper).toBeGreaterThanOrEqual(-10);
    expect(solved.rotations.upper).toBeLessThanOrEqual(10);
    const upper = composeWorld(ROOT, { x: 0, y: 0, rotation: solved.rotations.upper! });
    const upperTip = composeWorld(upper, { x: 80, y: 0, rotation: 0 });
    const fore = composeWorld(upperTip, { x: 0, y: 0, rotation: solved.rotations.fore! });
    const tip = composeWorld(fore, { x: 60, y: 0, rotation: 0 });
    const fabrikTip = solveFabrik(ROOT, chain).tips.fore;
    expect(fabrikTip).toBeDefined();
    expect(tip.x).toBeCloseTo(fabrikTip!.x, 8);
    expect(tip.y).toBeCloseTo(fabrikTip!.y, 8);
    if (solved.quality.kind === "limited") expect(solved.quality.atBound).toContain("upper");
  });

  it("CL-3 reads bend as the flip spelling and gives zero extent a bounded direction", () => {
    const constrained = members({ kind: "range", min: 20, max: 20 });
    const zero: readonly SolveMember[] = [
      { id: "zero", base: "root", length: 0, limit: { kind: "range", min: 20, max: 20 } },
      { id: "tip", base: "zero", length: 40, goal: { x: 30, y: 30, rotation: 0 } },
    ];
    const solved = solveFabrik(ROOT, zero, true);
    expect(solved.rotations.zero).toBe(20);
    expect(solveChain(ROOT, constrained, true).rotations.upper).toBeDefined();
  });
});

// Additional phase-3 witnesses keep each design promise independently cited.
describe("constrained 2D IK evidence details", () => {
  it("CL-7 preserves bend and flip equivalence on analytic and FABRIK strategies", () => {
    const analytic = members();
    const tree: readonly SolveMember[] = [
      { id: "a", base: "root", length: 50 },
      { id: "b", base: "a", length: 40 },
      { id: "c", base: "b", length: 30, goal: { x: 60, y: 40, rotation: 0 } },
    ];
    expect(solveChain(ROOT, analytic, readBend({ bend: "positive" }))).toEqual(
      solveChain(ROOT, analytic, true),
    );
    expect(solveChain(ROOT, tree, readBend({ bend: "negative" }))).toEqual(
      solveChain(ROOT, tree, false),
    );
  });

  it("CL-8 gives bend precedence to the explicit bend value over flip", () => {
    expect(readBend({ bend: "negative", flip: true })).toBe(false);
    expect(readBend({ bend: "positive", flip: false })).toBe(true);
  });

  it("CL-9 keeps every seeded limited rotation inside its authored range", () => {
    const chain: readonly SolveMember[] = [
      { id: "a", base: "root", length: 70, limit: { kind: "range", min: -35, max: 5 } },
      { id: "b", base: "a", length: 55, limit: { kind: "range", min: -20, max: 25 } },
      {
        id: "c",
        base: "b",
        length: 35,
        goal: { x: 20, y: 120, rotation: 0 },
        limit: { kind: "range", min: -10, max: 10 },
      },
    ];
    const result = solveChain(ROOT, chain);
    for (const member of chain) {
      if (member.limit === undefined) continue;
      const rotation = result.rotations[member.id]!;
      expect(rotation).toBeGreaterThanOrEqual(member.limit.min);
      expect(rotation).toBeLessThanOrEqual(member.limit.max);
    }
  });

  it("CL-10 reports canonical atBound ids only for a residual limited miss", () => {
    const result = solveFabrik(ROOT, members({ kind: "range", min: -10, max: 10 }));
    expect(result.quality).toEqual({
      kind: "limited",
      iterations: 1,
      residual: expect.any(Number),
      atBound: ["upper"],
    });
  });

  it("CL-11 composes the seeded limited pose to the solver's stated tip", () => {
    const chain: readonly SolveMember[] = [
      { id: "a", base: "root", length: 60, limit: { kind: "range", min: -20, max: 20 } },
      { id: "b", base: "a", length: 40, goal: { x: 50, y: 70, rotation: 0 } },
    ];
    const result = solveFabrik(ROOT, chain);
    const a = composeWorld(ROOT, { x: 0, y: 0, rotation: result.rotations.a! });
    const aTip = composeWorld(a, { x: 60, y: 0, rotation: 0 });
    const b = composeWorld(aTip, { x: 0, y: 0, rotation: result.rotations.b! });
    const tip = composeWorld(b, { x: 40, y: 0, rotation: 0 });
    const solvedTip = result.tips.b;
    expect(solvedTip).toBeDefined();
    expect(tip.x).toBeCloseTo(solvedTip!.x, 8);
    expect(tip.y).toBeCloseTo(solvedTip!.y, 8);
  });
});

describe("constrained 2D IK review fixes", () => {
  /** ADR-051's worked rig: root `200,300`, target `320,340`, lengths `80` and `60`. */
  const WORKED_ROOT: WorldFrame = { x: 200, y: 300, rotation: 0 };
  const worked: readonly SolveMember[] = [
    { id: "upper", base: "root", length: 80 },
    { id: "fore", base: "upper", length: 60, goal: { x: 320, y: 340, rotation: 0 } },
  ];

  it("CL-19 names the sign of the solved elbow: positive bends toward increasing rotation", () => {
    const positive = solveChain(WORKED_ROOT, worked, readBend({ bend: "positive" }));
    const negative = solveChain(WORKED_ROOT, worked, readBend({ bend: "negative" }));
    expect(positive.rotations.fore).toBeCloseTo(51.318, 3);
    expect(negative.rotations.fore).toBeCloseTo(-51.318, 3);
    expect(negative).toEqual(solveChain(WORKED_ROOT, worked));
  });

  it("CL-20 limits to the bound nearer on the circle, and leaves an in-range angle exact", () => {
    expect(limitRotation({ kind: "range", min: 90, max: 170 }, -170)).toBe(170);
    expect(limitRotation({ kind: "range", min: 90, max: 170 }, 0)).toBe(90);
    expect(limitRotation({ kind: "range", min: -180, max: -170 }, 180)).toBe(-180);
    expect(limitRotation({ kind: "range", min: -10, max: 10 }, 180)).toBe(-10);
    expect(atBound({ kind: "range", min: 90, max: 170 }, -170)).toBe(true);
    const fractional = 30.123456789012345;
    expect(Object.is(wrapRotation(fractional), fractional)).toBe(true);
    expect(limitRotation({ kind: "range", min: -45, max: 45 }, fractional)).toBe(fractional);
    expect(wrapRotation(-190)).toBe(170);
  });

  it("CL-21 keeps the no-goal refusal ahead of constrained dispatch", () => {
    const noGoal: readonly SolveMember[] = [
      { id: "a", base: "root", length: 10, limit: { kind: "range", min: -5, max: 5 } },
    ];
    expect(() => chainShape(noGoal)).toThrow(
      "ikPlugin requires at least one goal; 1 members received none.",
    );
  });

  it("CL-22 reads live bounds totally: out of domain is absent, inverted is [min, min]", () => {
    expect(readJointLimit({ minRotation: 400, maxRotation: 30 })).toEqual({
      kind: "range",
      min: -180,
      max: 30,
    });
    expect(readJointLimit({ minRotation: 40, maxRotation: -40 })).toEqual({
      kind: "range",
      min: 40,
      max: 40,
    });
    expect(readJointLimit({ minRotation: Number.NaN })).toEqual({ kind: "free" });
    expect(readJointLimit({})).toEqual({ kind: "free" });
  });

  it("CL-23 a free joint is the identity: rest direction and published angle are untouched", () => {
    expect(Object.is(restDirection({ kind: "free" }, -0), -0)).toBe(true);
    expect(restDirection({ kind: "range", min: 20, max: 40 }, 10)).toBe(30);
    expect(Object.is(limitRotation({ kind: "free" }, 725.5), 725.5)).toBe(true);
    expect(chainShape(members()).kind).toBe("two-bone");
  });
});
