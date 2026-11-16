import { describe, expect, it } from "vitest";
import { matrixFromEuler3d } from "@gerak/core";
import { composeWorld3d, type WorldFrame3d } from "../../src/frame/frame3d";

const frame3d = (partial: Partial<WorldFrame3d> = {}): WorldFrame3d => ({
  x: 0,
  y: 0,
  z: 0,
  rotation: 0,
  rotationX: 0,
  rotationY: 0,
  ...partial,
});

describe("3D world frames", () => {
  it("TH-2 composes translation through the parent matrix", () => {
    const result = composeWorld3d(
      frame3d({ x: 10, y: 20, z: 30, rotation: 90 }),
      frame3d({ x: 5, y: 0, z: 0 }),
    );
    expect(result.x).toBeCloseTo(10, 12);
    expect(result.y).toBeCloseTo(25, 12);
    expect(result.z).toBeCloseTo(30, 12);
  });

  it("TH-201 composes every entry exactly as the row-major oracle does", () => {
    // The oracle is the definition, a triple loop, over non-special orientations.
    const oracle = (left: readonly number[], right: readonly number[]): number[] => {
      const product: number[] = [];
      for (let row = 0; row < 3; row += 1)
        for (let column = 0; column < 3; column += 1) {
          let sum = 0;
          for (let k = 0; k < 3; k += 1) sum += left[row * 3 + k]! * right[k * 3 + column]!;
          product.push(sum);
        }
      return product;
    };
    const parent = { x: 3, y: -7, z: 11, rotation: 23, rotationX: -41, rotationY: 67 };
    const local = { x: 13, y: 5, z: -2, rotation: -71, rotationX: 29, rotationY: -17 };
    const parentMatrix = matrixFromEuler3d(parent);
    const localMatrix = matrixFromEuler3d(local);
    const expected = oracle(parentMatrix, localMatrix);

    // `composeWorld3d` rotates the local offset by the parent and composes the two matrices.
    const composed = composeWorld3d(parent, local);
    const offset = oracle(parentMatrix, [local.x, 0, 0, local.y, 0, 0, local.z, 0, 0]);
    expect(Math.abs(composed.x - (parent.x + offset[0]!))).toBeLessThanOrEqual(1e-12);
    expect(Math.abs(composed.y - (parent.y + offset[3]!))).toBeLessThanOrEqual(1e-12);
    expect(Math.abs(composed.z - (parent.z + offset[6]!))).toBeLessThanOrEqual(1e-12);
    const rebuilt = matrixFromEuler3d(composed);
    for (let index = 0; index < 9; index += 1)
      expect(Math.abs(rebuilt[index]! - expected[index]!)).toBeLessThanOrEqual(1e-12);
  });
});
