import { describe, expect, it } from "vitest";
import { Matrix4 } from "three";
import { frameToMatrix } from "../src/index";
import { captureSkeleton, createSkeletonDriver } from "../src/skeleton";
import { syntheticSkeleton } from "./support/synthetic-skeleton";

describe("skeleton review regressions", () => {
  it("S5 rejects non-finite positions and invalid rest quaternions", () => {
    for (const value of [NaN, Infinity, -Infinity]) {
      const rig = syntheticSkeleton();
      rig.middle.position.x = value;
      expect(() => captureSkeleton(rig.skeleton, rig)).toThrow(TypeError);
    }
    for (const value of [NaN, Infinity, 0, 2]) {
      const rig = syntheticSkeleton();
      rig.root.quaternion.set(0, 0, 0, value);
      expect(() => captureSkeleton(rig.skeleton, rig)).toThrow(TypeError);
    }
  });

  it("D10 retains bone identity when Skeleton.bones is reordered after capture", () => {
    const rig = syntheticSkeleton();
    const binding = captureSkeleton(rig.skeleton, rig);
    rig.skeleton.bones.reverse();
    const driver = createSkeletonDriver(binding, {
      sourceSpace: rig.rootParent,
      drives: { hips: { kind: "rest" }, hand: { kind: "frame", source: "hand" } },
    });
    const values = { x: 11, y: 12, z: 13, rotation: 20 };
    driver.apply(() => values);
    const expected = new Matrix4().multiplyMatrices(
      rig.rootParent.matrixWorld,
      frameToMatrix(values, new Matrix4()),
    );
    for (let i = 0; i < 16; i += 1)
      expect(Math.abs(rig.tip.matrixWorld.elements[i]! - expected.elements[i]!)).toBeLessThan(1e-6);
    driver.reset();
    expect(rig.tip.position.toArray()).toEqual([0, 5, 2]);
    expect(rig.middle.position.toArray()).toEqual([2, 4, -1]);
  });

  it("D11 huge finite angles stay finite and modulo-equivalent", () => {
    const huge = Number.MAX_VALUE;
    const a = frameToMatrix({ rotation: huge, rotationX: -huge, rotationY: huge }, new Matrix4());
    const b = frameToMatrix(
      { rotation: huge % 360, rotationX: -huge % 360, rotationY: huge % 360 },
      new Matrix4(),
    );
    expect(a.elements.every(Number.isFinite)).toBe(true);
    for (let i = 0; i < 16; i += 1)
      expect(Math.abs(a.elements[i]! - b.elements[i]!)).toBeLessThan(1e-12);
  });

  it("D12 huge finite aim directions normalize without overflow", () => {
    const rig = syntheticSkeleton();
    rig.middle.position.set(1e300, 1e300, 0);
    const binding = captureSkeleton(rig.skeleton, rig);
    const aim = binding.bones[1]!.restAim!;
    expect(aim.length()).toBeCloseTo(1, 12);
    const driver = createSkeletonDriver(binding, {
      sourceSpace: rig.rootParent,
      drives: { hips: { kind: "aim", from: "a", to: "b" } },
    });
    const result = driver.apply((id) => (id === "a" ? {} : { x: 1e300, y: 1e300, z: 0 }));
    expect(result.bones.get("hips")?.kind).toBe("applied");
    expect(rig.root.quaternion.toArray().every(Number.isFinite)).toBe(true);
  });
});
