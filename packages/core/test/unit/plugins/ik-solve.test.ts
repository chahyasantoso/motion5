import { describe, expect, it } from "vitest";
import type { PluginDefinition } from "../../../src/domain/plugins";

// Slice C3 of issue #195: IK solver plugin and solveTwoBone math.
//
// The 2-bone analytic IK solve computes local rotations for root-most and tip members
// using the law of cosines, with reach clamping [|l1 - l2|, l1 + l2] to prevent NaN
// on unreachable targets.

export interface BaseFrame {
  readonly x: number;
  readonly y: number;
  readonly rotation: number;
}

export interface MemberState {
  readonly id: string;
  readonly base: string;
  readonly values: Readonly<Record<string, unknown>>;
  readonly progress: number;
}

// Temporary seam for failing-first execution before src/plugins/ik.ts exists
export interface IkPluginSeam {
  readonly ikPlugin?: PluginDefinition;
  readonly solveTwoBone?: (
    root: BaseFrame,
    target: BaseFrame,
    members: readonly MemberState[],
    flip?: boolean,
  ) => Readonly<Record<string, number>>;
  readonly readMembers?: (membersInput: unknown) => readonly MemberState[];
}

import { ikPlugin, readMembers, solveTwoBone } from "../../../src/plugins/ik";

const seam: IkPluginSeam = {
  ikPlugin,
  solveTwoBone,
  readMembers,
};

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function forwardTip(
  root: BaseFrame,
  l1: number,
  r1: number,
  l2: number,
  r2: number,
): { x: number; y: number } {
  const worldR1 = root.rotation + r1;
  const jointX = root.x + l1 * Math.cos(degToRad(worldR1));
  const jointY = root.y + l1 * Math.sin(degToRad(worldR1));
  const worldR2 = worldR1 + r2;
  const tipX = jointX + l2 * Math.cos(degToRad(worldR2));
  const tipY = jointY + l2 * Math.sin(degToRad(worldR2));
  return { x: tipX, y: tipY };
}

describe("ikPlugin and solveTwoBone (Slice C3)", () => {
  it("IK-1 solveTwoBone against worked numbers reaches the target tip", () => {
    expect(seam.solveTwoBone).toBeDefined();
    const root: BaseFrame = { x: 200, y: 300, rotation: 0 };
    const target: BaseFrame = { x: 320, y: 340, rotation: 0 };
    const members: MemberState[] = [
      { id: "walker/upper-arm", base: "walker/shoulder", values: { length: 80 }, progress: 0 },
      { id: "walker/forearm", base: "walker/upper-arm", values: { length: 60 }, progress: 0 },
    ];

    const rotations = seam.solveTwoBone!(root, target, members, false);
    expect(rotations).toBeDefined();
    const r1 = rotations["walker/upper-arm"];
    const r2 = rotations["walker/forearm"];
    expect(typeof r1).toBe("number");
    expect(typeof r2).toBe("number");

    const tip = forwardTip(root, 80, r1!, 60, r2!);
    expect(tip.x).toBeCloseTo(320, 5);
    expect(tip.y).toBeCloseTo(340, 5);
  });

  it("IK-2 unreachable target produces finite output fully extended toward target without NaN", () => {
    expect(seam.solveTwoBone).toBeDefined();
    const root: BaseFrame = { x: 200, y: 300, rotation: 0 };
    // Target is 200 units away; max reach is 80 + 60 = 140
    const target: BaseFrame = { x: 400, y: 300, rotation: 0 };
    const members: MemberState[] = [
      { id: "walker/upper-arm", base: "walker/shoulder", values: { length: 80 }, progress: 0 },
      { id: "walker/forearm", base: "walker/upper-arm", values: { length: 60 }, progress: 0 },
    ];

    const rotations = seam.solveTwoBone!(root, target, members, false);
    expect(rotations).toBeDefined();
    const r1 = rotations["walker/upper-arm"]!;
    const r2 = rotations["walker/forearm"]!;
    expect(Number.isFinite(r1)).toBe(true);
    expect(Number.isFinite(r2)).toBe(true);
    // Fully extended means relative rotation r2 is 0
    expect(r2).toBeCloseTo(0, 5);
    // Aiming directly along horizontal (dx > 0, dy = 0)
    expect(r1).toBeCloseTo(0, 5);
  });

  it("IK-3 flip: true mirrors the elbow solution and still reaches target", () => {
    expect(seam.solveTwoBone).toBeDefined();
    const root: BaseFrame = { x: 200, y: 300, rotation: 0 };
    const target: BaseFrame = { x: 300, y: 350, rotation: 0 };
    const members: MemberState[] = [
      { id: "walker/upper-arm", base: "walker/shoulder", values: { length: 80 }, progress: 0 },
      { id: "walker/forearm", base: "walker/upper-arm", values: { length: 60 }, progress: 0 },
    ];

    const unflipped = seam.solveTwoBone!(root, target, members, false);
    const flipped = seam.solveTwoBone!(root, target, members, true);

    expect(unflipped["walker/forearm"]).not.toEqual(flipped["walker/forearm"]);

    const tipFlipped = forwardTip(
      root,
      80,
      flipped["walker/upper-arm"]!,
      60,
      flipped["walker/forearm"]!,
    );
    expect(tipFlipped.x).toBeCloseTo(300, 5);
    expect(tipFlipped.y).toBeCloseTo(350, 5);
  });

  it("IK-4 degenerate target distance or zero-length member produces finite angles without NaN", () => {
    expect(seam.solveTwoBone).toBeDefined();
    const root: BaseFrame = { x: 200, y: 300, rotation: 0 };
    const samePointTarget: BaseFrame = { x: 200, y: 300, rotation: 0 };
    const zeroLenMembers: MemberState[] = [
      { id: "walker/upper-arm", base: "walker/shoulder", values: { length: 0 }, progress: 0 },
      { id: "walker/forearm", base: "walker/upper-arm", values: { length: 60 }, progress: 0 },
    ];

    const res1 = seam.solveTwoBone!(root, samePointTarget, [
      { id: "walker/upper-arm", base: "walker/shoulder", values: { length: 80 }, progress: 0 },
      { id: "walker/forearm", base: "walker/upper-arm", values: { length: 60 }, progress: 0 },
    ]);
    expect(Number.isFinite(res1["walker/upper-arm"])).toBe(true);
    expect(Number.isFinite(res1["walker/forearm"])).toBe(true);

    const res2 = seam.solveTwoBone!(root, { x: 250, y: 300, rotation: 0 }, zeroLenMembers);
    expect(Number.isFinite(res2["walker/upper-arm"])).toBe(true);
    expect(Number.isFinite(res2["walker/forearm"])).toBe(true);
  });

  it("IK-5 readMembers throws when inputs.members is absent", () => {
    expect(seam.readMembers).toBeDefined();
    expect(() => seam.readMembers!(undefined)).toThrow();
    expect(() => seam.readMembers!({})).toThrow();
  });
});
