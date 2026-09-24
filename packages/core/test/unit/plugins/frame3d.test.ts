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
});
