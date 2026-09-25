import { describe, expect, it } from "vitest";
import type { PluginInputs } from "../../../src/domain/plugins";
import type { ImmutableRecord } from "../../../src/domain/values";
import { fk3dPlugin } from "../../../src/plugins/fk3d";
import {
  composeWorld3d,
  effectiveLink3d,
  pivotFromBase3d,
  readFrame3d,
  readPivotOffset3d,
  ZERO_EULER,
  type Euler3d,
  type PivotOffset3d,
  type WorldFrame3d,
} from "../../../src/plugins/frame3d";
import { solveTwoBone } from "../../../src/plugins/ik-analytic";
import { solveTwoBone3d } from "../../../src/plugins/ik3d-analytic";

function seeded(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function distance(a: readonly number[], b: readonly number[]): number {
  return Math.hypot(a[0]! - b[0]!, a[1]! - b[1]!, a[2]! - b[2]!);
}

function turnDistance(a: number, b: number): number {
  const d = a - b;
  return Math.abs(d - 360 * Math.round(d / 360));
}

function compose(
  base: WorldFrame3d,
  values: Readonly<ImmutableRecord>,
  id: string,
  solver: unknown = undefined,
): WorldFrame3d {
  // The graph delivers a solve result as an immutable record; the fixture hands the composer the
  // same bytes without restating that type for every solver shape it passes.
  const inputs = { base, solver } as unknown as PluginInputs;
  return fk3dPlugin.compose(values, 1, inputs, id) as WorldFrame3d;
}

describe("3D pivot offsets", () => {
  it("TH-33 owns offsets in frame3d, reads non-finite values as zero, and preserves zero bytes", () => {
    expect(readPivotOffset3d({ x: 1, y: NaN, z: Infinity })).toEqual({ x: 1, y: 0, z: 0 });
    const base = readFrame3d({ x: 3, y: -4, z: 5, rotation: 30, rotationX: -20, rotationY: 45 });
    const offset = { x: 7, y: -2, z: 4 };
    const expected = composeWorld3d(base, { ...offset, ...ZERO_EULER });
    expect(pivotFromBase3d(base, offset)).toEqual([expected.x, expected.y, expected.z]);

    const values = { length: 80, rotation: 17, rotationX: -23, rotationY: 41 };
    const solver = { rotations3d: { upper: { rotation: 17, rotationX: -23, rotationY: 41 } } };
    const phase1 = composeWorld3d(
      composeWorld3d(base, { x: 0, y: 0, z: 0, rotation: 17, rotationX: -23, rotationY: 41 }),
      { ...ZERO_EULER, x: 80, y: 0, z: 0 },
    );
    expect(compose(base, values, "upper", solver)).toEqual(phase1);
    expect(compose(base, { ...values, x: 0, y: 0, z: 0 }, "upper", solver)).toEqual(phase1);
    expect(compose(base, { ...values, x: -0, y: 0, z: 0 }, "upper", solver)).toEqual(phase1);
  });

  it("TH-34 reads the effective-link union and the pivot zero short-circuit", () => {
    const axis = effectiveLink3d(80, { x: -0, y: 0, z: 0 });
    expect(axis).toEqual({ kind: "axis", length: 80 });
    expect(effectiveLink3d(80, { x: 3, y: 4, z: 12 })).toEqual({
      kind: "offset",
      length: Math.hypot(83, 4, 12),
      vector: [83, 4, 12],
    });
    expect(effectiveLink3d(80, { x: 0, y: 0, z: 12 }).kind).toBe("offset");
    const base = readFrame3d({ x: -0, y: 2, z: 3 });
    expect(pivotFromBase3d(base, { x: 0, y: -0, z: 0 })).toEqual([base.x, base.y, base.z]);
    expect(Object.is(pivotFromBase3d(base, { x: 0, y: 0, z: 0 })[0], base.x)).toBe(true);
  });

  it("TH-35 closes 2,000 seeded offset rigs and preserves both pivot-to-pivot distances", () => {
    const random = seeded(0x50035);
    let worst = 0;
    for (let sample = 0; sample < 2_000; sample += 1) {
      const root = readFrame3d({
        x: random() * 200 - 100,
        y: random() * 200 - 100,
        z: random() * 200 - 100,
        rotation: random() * 720 - 360,
        rotationX: random() * 720 - 360,
        rotationY: random() * 720 - 360,
      });
      const lengths = [20 + random() * 80, 20 + random() * 80] as const;
      const offsets: readonly [PivotOffset3d, PivotOffset3d] = [
        { x: random() * 60 - 30, y: random() * 60 - 30, z: random() * 60 - 30 },
        { x: random() * 60 - 30, y: random() * 60 - 30, z: random() * 60 - 30 },
      ];
      const authored: readonly [Euler3d, Euler3d] = [
        {
          rotation: random() * 360 - 180,
          rotationX: random() * 360 - 180,
          rotationY: random() * 360 - 180,
        },
        {
          rotation: random() * 360 - 180,
          rotationX: random() * 360 - 180,
          rotationY: random() * 360 - 180,
        },
      ];
      const upper = composeWorld3d(root, { ...offsets[0], ...authored[0] });
      const elbow = composeWorld3d(upper, { ...ZERO_EULER, x: lengths[0], y: 0, z: 0 });
      const fore = composeWorld3d(elbow, { ...offsets[1], ...authored[1] });
      const target = composeWorld3d(fore, { ...ZERO_EULER, x: lengths[1], y: 0, z: 0 });
      const result = solveTwoBone3d(
        root,
        target,
        { id: "upper", length: lengths[0], offset: offsets[0] },
        { id: "fore", length: lengths[1], offset: offsets[1] },
      );
      const solvedUpper = compose(root, { length: lengths[0], ...offsets[0] }, "upper", result);
      const solvedFore = compose(
        solvedUpper,
        { length: lengths[1], ...offsets[1] },
        "fore",
        result,
      );
      const miss = distance(
        [solvedFore.x, solvedFore.y, solvedFore.z],
        [target.x, target.y, target.z],
      );
      worst = Math.max(worst, miss);
      expect(miss).toBeLessThanOrEqual(
        1e-9 * Math.max(1, Math.abs(target.x), Math.abs(target.y), Math.abs(target.z)),
      );
      const firstPivot = pivotFromBase3d(root, offsets[0]);
      const secondPivot = composeWorld3d(solvedUpper, { ...offsets[1], ...ZERO_EULER });
      expect(
        distance([firstPivot[0], firstPivot[1], firstPivot[2]], [elbow.x, elbow.y, elbow.z]),
      ).toBeCloseTo(lengths[0], 10);
      expect(
        distance(
          [firstPivot[0], firstPivot[1], firstPivot[2]],
          [secondPivot.x, secondPivot.y, secondPivot.z],
        ),
      ).toBeCloseTo(effectiveLink3d(lengths[0], offsets[1]).length, 10);
      expect(
        distance(
          [secondPivot.x, secondPivot.y, secondPivot.z],
          [solvedFore.x, solvedFore.y, solvedFore.z],
        ),
      ).toBeCloseTo(lengths[1], 10);
    }
    expect(worst).toBeLessThan(1e-9);
  });

  it("TH-36 agrees with the 2D offset closed form in its planar subset", () => {
    const random = seeded(0x50036);
    for (let sample = 0; sample < 1_000; sample += 1) {
      const root = {
        x: random() * 200 - 100,
        y: random() * 200 - 100,
        rotation: random() * 720 - 360,
      };
      const firstOffset = { x: random() * 30 - 15, y: random() * 30 - 15 };
      const secondOffset = { x: random() * 30 - 15, y: random() * 30 - 15 };
      const l1 = 10 + random() * 90;
      const l2 = 10 + random() * 90;
      const linkLength = Math.hypot(l1 + secondOffset.x, secondOffset.y);
      const pivot = pivotFromBase3d(readFrame3d(root), { ...firstOffset, z: 0 });
      const distanceFromPivot =
        Math.abs(linkLength - l2) +
        (linkLength + l2 - Math.abs(linkLength - l2)) * (0.1 + random() * 0.8);
      const angle = random() * Math.PI * 2;
      const goal = {
        x: pivot[0] + Math.cos(angle) * distanceFromPivot,
        y: pivot[1] + Math.sin(angle) * distanceFromPivot,
      };
      const spatial = solveTwoBone3d(
        readFrame3d(root),
        readFrame3d({ x: goal.x, y: goal.y, z: 0 }),
        { id: "a", length: l1, offset: { ...firstOffset, z: 0 } },
        { id: "b", length: l2, offset: { ...secondOffset, z: 0 } },
      );
      const planar = solveTwoBone(
        root,
        { ...goal, rotation: 0 },
        { id: "a", base: "root", length: l1, pivot: firstOffset },
        { id: "b", base: "a", length: l2, pivot: secondOffset },
      );
      expect(spatial.quality.kind).toBe(planar.quality.kind);
      expect(Math.abs(spatial.quality.residual - planar.quality.residual)).toBeLessThanOrEqual(
        1e-9,
      );
      for (const id of ["a", "b"]) {
        expect(spatial.rotations3d[id]!.rotationX).toBe(0);
        expect(spatial.rotations3d[id]!.rotationY).toBe(0);
        expect(
          turnDistance(spatial.rotations3d[id]!.rotation, planar.rotations[id]!),
        ).toBeLessThanOrEqual(1e-9);
      }
    }
  });

  it("TH-37 keeps offset degeneracies and directional goals finite", () => {
    const root = readFrame3d({ rotation: 30, rotationX: -20, rotationY: 40 });
    const coincidentPivot = pivotFromBase3d(root, { x: 1, y: 2, z: 3 });
    const cases = [
      solveTwoBone3d(
        root,
        readFrame3d({ x: 20, y: 30, z: 40 }),
        { id: "a", length: 50, offset: { x: 2, y: 3, z: 4 } },
        { id: "b", length: 0, offset: { x: 5, y: -2, z: 3 } },
      ),
      solveTwoBone3d(
        root,
        readFrame3d({ x: 20, y: 30, z: 40 }),
        { id: "a", length: 10, offset: { x: 2, y: 3, z: 4 } },
        { id: "b", length: 50, offset: { x: -10, y: 0, z: 0 } },
      ),
      solveTwoBone3d(
        root,
        { ...root, x: coincidentPivot[0], y: coincidentPivot[1], z: coincidentPivot[2] },
        { id: "a", length: 10, offset: { x: 1, y: 2, z: 3 } },
        { id: "b", length: Math.hypot(10, 4), offset: { x: 0, y: 4, z: 0 } },
      ),
      solveTwoBone3d(
        root,
        { ...root, x: Infinity, y: 1, z: 2 },
        { id: "a", length: 10, offset: { x: 1, y: 2, z: 3 } },
        { id: "b", length: 10, offset: { x: 0, y: 4, z: 0 } },
      ),
    ];
    for (const result of cases.slice(0, 3)) {
      for (const rotation of Object.values(result.rotations3d).flatMap((euler) =>
        Object.values(euler),
      ))
        expect(Number.isFinite(rotation)).toBe(true);
      expect(Object.values(result.residuals).every(Number.isFinite)).toBe(true);
    }
    const directional = cases[3]!;
    expect(
      Object.values(directional.rotations3d).every((euler) =>
        Object.values(euler).every(Number.isFinite),
      ),
    ).toBe(true);
    expect(directional.quality.residual).toBe(Number.POSITIVE_INFINITY);
    const coincident = cases[2]!;
    expect(coincident.quality.kind).toBe("coincident");
    expect(coincident.quality.residual).toBe(Math.hypot(10 + Math.hypot(10, 4), 4, 0));
  });

  it("TH-38 scales huge offsets without changing the solved angles", () => {
    const root = readFrame3d({ x: 0, y: 0, z: 0, rotation: 20, rotationX: 10, rotationY: -15 });
    const hugeTarget = readFrame3d({ x: 1e300, y: 2e300, z: -1e300 });
    const hugeFirst = { id: "a", length: 2e300, offset: { x: 3e300, y: -1e300, z: 2e300 } };
    const hugeSecond = { id: "b", length: 1e300, offset: { x: -2e300, y: 4e300, z: 1e300 } };
    const result = solveTwoBone3d(root, hugeTarget, hugeFirst, hugeSecond);
    const factor = 2 ** -1000;
    const image = solveTwoBone3d(
      root,
      {
        ...hugeTarget,
        x: hugeTarget.x * factor,
        y: hugeTarget.y * factor,
        z: hugeTarget.z * factor,
      },
      {
        ...hugeFirst,
        length: hugeFirst.length * factor,
        offset: {
          x: hugeFirst.offset.x * factor,
          y: hugeFirst.offset.y * factor,
          z: hugeFirst.offset.z * factor,
        },
      },
      {
        ...hugeSecond,
        length: hugeSecond.length * factor,
        offset: {
          x: hugeSecond.offset.x * factor,
          y: hugeSecond.offset.y * factor,
          z: hugeSecond.offset.z * factor,
        },
      },
    );
    expect(result.rotations3d).toEqual(image.rotations3d);
    const offsetOnly = solveTwoBone3d(
      root,
      root,
      { id: "a", length: 1, offset: { x: 0, y: 0, z: 0 } },
      { id: "b", length: 1, offset: { x: 1.6e308, y: 1.6e308, z: 0 } },
    );
    expect(offsetOnly.quality.kind).toBe("too-near");
    expect(offsetOnly.quality.residual).toBe(Number.MAX_VALUE);
    for (const euler of Object.values(result.rotations3d))
      for (const value of Object.values(euler)) expect(Number.isFinite(value)).toBe(true);
  });
});
