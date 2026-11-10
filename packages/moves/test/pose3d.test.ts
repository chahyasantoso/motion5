import { describe, expect, it } from "vitest";
import {
  atProgress,
  combine3d,
  hop,
  lift2d,
  mixPoint3d,
  mixPose3d,
  squashed3d,
  type Pose2d,
  type Pose3d,
} from "@gerak/moves";

describe("Pose3d", () => {
  it("refuses a 2D pose where a 3D one goes", () => {
    const flat: Pose2d = { x: 1, anchor: "bottom" };
    // @ts-expect-error A page pose has y down and px; it reaches 3D only through lift2d.
    const deep: Pose3d = flat;
    expect(deep).toBe(flat);
  });
});

describe("combine3d", () => {
  it("adds offsets and multiplies scales and opacity", () => {
    expect(
      combine3d([
        { x: 1, y: 2, z: 3, scale: 2, opacity: 0.5 },
        { x: 1, z: -1, scale: 3, scaleZ: 0.5, opacity: 0.5 },
      ]),
    ).toEqual({ x: 2, y: 2, z: 2, scale: 6, scaleZ: 0.5, opacity: 0.25 });
  });

  it("keeps one pose's turns exactly, and adds turns about one shared axis, winding and all", () => {
    expect(combine3d([{ rotationX: 400 }, { x: 1 }])).toEqual({ rotationX: 400, x: 1 });
    expect(combine3d([{ rotation: 100 }, { rotation: 150 }]).rotation).toBe(250);
  });

  it("composes turns about different axes as rotations, in order", () => {
    const first = combine3d([{ rotationY: 90 }, { rotationX: 90 }]);
    const second = combine3d([{ rotationX: 90 }, { rotationY: 90 }]);
    expect(first).not.toEqual(second);
    const kept = combine3d([{ rotation: 30, rotationX: 40, rotationY: 50 }, { rotationX: 0 }]);
    expect(kept.rotation ?? 0).toBeCloseTo(30, 9);
    expect(kept.rotationX ?? 0).toBeCloseTo(40, 9);
    expect(kept.rotationY ?? 0).toBeCloseTo(50, 9);
  });
});

describe("mixPose3d", () => {
  it("blends turns along the short arc", () => {
    expect(mixPose3d({}, { rotationY: 170 }, 0.5).rotationY ?? 0).toBeCloseTo(85, 9);
    expect(
      Math.abs(mixPose3d({ rotationY: 170 }, { rotationY: -170 }, 0.5).rotationY ?? 0),
    ).toBeCloseTo(180, 9);
  });

  it("overshoots past the end for a share past 1, so a spring settle reaches turns", () => {
    expect(mixPose3d({}, { rotationY: 90 }, 1.1).rotationY ?? 0).toBeCloseTo(99, 6);
  });

  it("puts a missing field at its rest", () => {
    expect(mixPose3d({ z: 4, scaleY: 3 }, {}, 0.5)).toEqual({ z: 2, scaleY: 2 });
  });

  it("blends points", () => {
    expect(mixPoint3d({ x: 0, y: 0, z: 0 }, { x: 2, y: 4, z: -6 }, 0.5)).toEqual({
      x: 1,
      y: 2,
      z: -3,
    });
  });
});

describe("lift2d", () => {
  it("flips y and the turn, scales px to units, and drops the anchor", () => {
    expect(
      lift2d(
        { x: 100, y: -50, rotation: 30, scaleX: 1.2, opacity: 0.5, anchor: "bottom" },
        { unitsPerPx: 0.01 },
      ),
    ).toEqual({ x: 1, y: 0.5, rotation: -30, scaleX: 1.2, opacity: 0.5 });
  });

  it("puts a hop's peak above the ground", () => {
    const peak = hop({ height: 260, bounces: 0 }, atProgress(0.5));
    expect(lift2d(peak, { unitsPerPx: 0.01 }).y ?? 0).toBeGreaterThan(1);
  });

  it("refuses a scale that is not above 0", () => {
    expect(() => lift2d({}, { unitsPerPx: 0 })).toThrow(RangeError);
  });
});

describe("squashed3d", () => {
  it("keeps the volume while it shortens the named axis", () => {
    const pose = squashed3d(0.4, 1);
    expect(pose.scaleY).toBeCloseTo(0.6, 12);
    expect((pose.scaleX ?? 1) * (pose.scaleY ?? 1) * (pose.scaleZ ?? 1)).toBeCloseTo(1, 12);
    const side = squashed3d(0.4, 0.5, "x");
    expect(side.scaleX).toBeCloseTo(0.8, 12);
    expect((side.scaleX ?? 1) * (side.scaleY ?? 1) * (side.scaleZ ?? 1)).toBeCloseTo(1, 12);
  });

  it("is no pose at all with no weight, and refuses a squash that flattens", () => {
    expect(squashed3d(0.4, 0)).toEqual({});
    expect(() => squashed3d(1, 1)).toThrow(RangeError);
  });
});
