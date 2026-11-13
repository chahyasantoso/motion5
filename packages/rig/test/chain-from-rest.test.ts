import { describe, expect, it } from "vitest";
import { buildChain, chainFromRest, chainThrough, fk } from "@gerak/rig";

const JOINTS = [
  { id: "shoulder", x: 100, y: 50 },
  { id: "elbow", x: 160, y: 110 },
  { id: "wrist", x: 150, y: 190 },
] as const;

function arm() {
  const { chain, rest } = chainThrough(JOINTS);
  const shoulder = rest.rotations?.shoulder ?? Number.NaN;
  const elbow = rest.rotations?.elbow ?? Number.NaN;
  return { chain, rest, shoulder, elbow };
}

describe("chainThrough", () => {
  it("names bones by the joint they start at and measures them", () => {
    const { chain, rest } = chainThrough(JOINTS);
    expect(chain.order).toEqual(["shoulder", "elbow"]);
    expect(chain.bones.get("shoulder")?.length).toBeCloseTo(Math.hypot(60, 60), 9);
    expect(rest.base).toEqual({ x: 100, y: 50, rotation: 0 });
    expect(rest.rotations?.shoulder).toBeCloseTo(45, 9);
  });

  it("refuses fewer than two joints, naming the count", () => {
    expect(() => chainThrough([{ id: "a", x: 0, y: 0 }])).toThrow(RangeError);
    expect(() => chainThrough([{ id: "a", x: 0, y: 0 }])).toThrow(/got 1/);
  });
});

describe("chainFromRest", () => {
  it("answers exact zeros at rest", () => {
    const { chain, rest } = arm();
    const poses = chainFromRest(chain, rest, rest);
    for (const id of chain.order) {
      expect(Object.is(poses[id].x, 0)).toBe(true);
      expect(Object.is(poses[id].y, 0)).toBe(true);
      expect(Object.is(poses[id].rotation, 0)).toBe(true);
    }
  });

  it("turning the root moves the elbow joint to the root's tip and turns both bones", () => {
    const { chain, rest, shoulder } = arm();
    const now = { ...rest, rotations: { ...rest.rotations, shoulder: shoulder + 30 } };
    const poses = chainFromRest(chain, rest, now);
    const tip = fk(chain, now).shoulder;
    expect(poses.elbow.x).toBeCloseTo(tip.x - 160, 9);
    expect(poses.elbow.y).toBeCloseTo(tip.y - 110, 9);
    expect(poses.shoulder.rotation).toBeCloseTo(30, 9);
    expect(poses.elbow.rotation).toBeCloseTo(30, 9);
    expect(poses.shoulder.x).toBeCloseTo(0, 9);
    expect(poses.shoulder.y).toBeCloseTo(0, 9);
  });

  it("turning only the second bone leaves the first at zero", () => {
    const { chain, rest, elbow } = arm();
    const now = { ...rest, rotations: { ...rest.rotations, elbow: elbow + 20 } };
    const poses = chainFromRest(chain, rest, now);
    expect(poses.shoulder).toEqual({ x: 0, y: 0, rotation: 0 });
    expect(poses.elbow.rotation).toBeCloseTo(20, 9);
  });

  it("lands the wrist on fk's tip when each pose is applied to its drawn joint", () => {
    const { chain, rest, shoulder, elbow } = arm();
    const now = { ...rest, rotations: { shoulder: shoulder + 30, elbow: elbow - 55 } };
    const pose = chainFromRest(chain, rest, now).elbow;
    const turn = (pose.rotation * Math.PI) / 180;
    const dx = JOINTS[2].x - JOINTS[1].x;
    const dy = JOINTS[2].y - JOINTS[1].y;
    const x = JOINTS[1].x + dx * Math.cos(turn) - dy * Math.sin(turn) + pose.x;
    const y = JOINTS[1].y + dx * Math.sin(turn) + dy * Math.cos(turn) + pose.y;
    const tip = fk(chain, now).elbow;
    expect(Math.abs(x - tip.x)).toBeLessThan(1e-9);
    expect(Math.abs(y - tip.y)).toBeLessThan(1e-9);
  });

  it("wraps an angle difference into (-180, 180]", () => {
    const chain = buildChain([{ id: "a", length: 10 }]);
    const poses = chainFromRest(chain, { rotations: { a: 170 } }, { rotations: { a: -170 } });
    expect(poses.a.rotation).toBeCloseTo(20, 9);
  });
});

describe("chainFromRest with a moving base", () => {
  it("carries every joint when the base moves and turns, as a body rocking under an arm", () => {
    const { chain, rest } = chainThrough(JOINTS);
    const base = { x: 112, y: 46, rotation: 12 };
    const now = { ...rest, base };
    const poses = chainFromRest(chain, rest, now);
    const tips = fk(chain, now);
    expect(poses.shoulder.x).toBeCloseTo(12, 9);
    expect(poses.shoulder.y).toBeCloseTo(-4, 9);
    expect(poses.shoulder.rotation).toBeCloseTo(12, 9);
    expect(poses.elbow.x).toBeCloseTo(tips.shoulder.x - 160, 9);
    expect(poses.elbow.y).toBeCloseTo(tips.shoulder.y - 110, 9);
    expect(poses.elbow.rotation).toBeCloseTo(12, 9);
  });
});
