import { describe, expect, it } from "vitest";
import {
  composeWorld3d,
  eulerFromMatrix3d,
  matrixFromEuler3d,
  multiplyMatrix3,
  multiplyVector3,
  readFrame3d,
} from "../../../src/plugins/frame3d";

// Issue #349 phase 8: the 3D seam keeps CSS's Rz * Rx * Ry convention in one owner. The
// gimbal-lock branch is intentionally deterministic rather than pretending Euler coordinates are
// unique there.

describe("3D frame convention", () => {
  it("TH-1 composes CSS matrices and round-trips ordinary Euler triples", () => {
    const euler = { rotation: 20, rotationX: 30, rotationY: 40 };
    const matrix = matrixFromEuler3d(euler);
    const vector = multiplyVector3(matrix, [1, 0, 0]);
    expect(vector[0]).toBeCloseTo(0.609923, 6);
    expect(vector[1]).toBeCloseTo(0.564014, 6);
    expect(vector[2]).toBeCloseTo(-0.55667, 6);
    const roundTrip = eulerFromMatrix3d(matrix);
    expect(roundTrip.rotation).toBeCloseTo(euler.rotation, 12);
    expect(roundTrip.rotationX).toBeCloseTo(euler.rotationX, 12);
    expect(roundTrip.rotationY).toBeCloseTo(euler.rotationY, 12);
    const composed = multiplyMatrix3(
      matrixFromEuler3d({ rotation: 30, rotationX: 0, rotationY: 0 }),
      matrixFromEuler3d({ rotation: 0, rotationX: 20, rotationY: 0 }),
    );
    expect(composed[0]).toBeCloseTo(0.866025403784, 12);
    expect(composed[1]).toBeCloseTo(-0.469846310393, 12);
    expect(composed[2]).toBeCloseTo(0.171010071663, 12);
  });

  it("TH-2 composes translation through the parent matrix", () => {
    const result = composeWorld3d(
      readFrame3d({ x: 10, y: 20, z: 30, rotation: 90 }),
      readFrame3d({ x: 5, y: 0, z: 0 }),
    );
    expect(result.x).toBeCloseTo(10, 12);
    expect(result.y).toBeCloseTo(25, 12);
    expect(result.z).toBeCloseTo(30, 12);
  });

  it("TH-3 pins gimbal lock to zero Y", () => {
    const positive = eulerFromMatrix3d(
      matrixFromEuler3d({ rotation: 10, rotationX: 90, rotationY: 40 }),
    );
    expect(positive.rotation).toBeCloseTo(50, 12);
    expect(positive.rotationX).toBe(90);
    expect(positive.rotationY).toBe(0);
    const negative = eulerFromMatrix3d(
      matrixFromEuler3d({ rotation: 10, rotationX: -90, rotationY: 40 }),
    );
    expect(negative.rotation).toBeCloseTo(-30, 12);
    expect(negative.rotationX).toBe(-90);
    expect(negative.rotationY).toBe(0);
  });

  it("TH-16 round-trips gimbal matrices and defaults non-finite authoring", () => {
    for (const euler of [
      { rotation: 179.999999, rotationX: 89.999999, rotationY: -179.999999 },
      { rotation: -179.999999, rotationX: -89.999999, rotationY: 179.999999 },
    ]) {
      const matrix = matrixFromEuler3d(euler);
      const decomposed = eulerFromMatrix3d(matrix);
      const rebuilt = matrixFromEuler3d(decomposed);
      const error = Math.max(...matrix.map((value, index) => Math.abs(value - rebuilt[index]!)));
      expect(error).toBeLessThanOrEqual(1e-12);
    }
    expect(
      readFrame3d({
        x: Number.NaN,
        y: Number.POSITIVE_INFINITY,
        z: "bad",
        rotation: Number.NEGATIVE_INFINITY,
      }),
    ).toEqual({
      x: 0,
      y: 0,
      z: 0,
      rotation: 0,
      rotationX: 0,
      rotationY: 0,
    });
  });

  it("TH-21 multiplies and composes every entry exactly as the row-major oracle does", () => {
    // Integer entries make every product exact, and every entry of the product distinct, so a
    // swapped index in `multiplyMatrix3` moves at least one of the nine.
    expect(multiplyMatrix3([1, 2, 3, 4, 5, 6, 7, 8, 9], [9, 8, 7, 6, 5, 4, 3, 2, 1])).toEqual([
      30, 24, 18, 84, 69, 54, 138, 114, 90,
    ]);

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
    const product = multiplyMatrix3(parentMatrix, localMatrix);
    for (let index = 0; index < 9; index += 1)
      expect(Math.abs(product[index]! - expected[index]!)).toBeLessThanOrEqual(1e-15);

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
