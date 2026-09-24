import { describe, expect, it } from "vitest";
import { fk3dPlugin } from "../../../src/plugins/fk3d";
import { ik3dPlugin } from "../../../src/plugins/ik3d";
import { readFrame3d } from "../../../src/plugins/frame3d";

const upperMember = { id: "upper", base: "root", values: { length: 80 }, progress: 1 };
const foreMember = { id: "fore", base: "upper", values: { length: 60 }, progress: 1 };
const members = [upperMember, foreMember];

describe("3D plugin seam", () => {
  it("TH-7 publishes one local Euler triple per delivered member", () => {
    const result = ik3dPlugin.compose(
      {},
      1,
      { root: readFrame3d({}), target: readFrame3d({ x: 100, y: 20 }), members },
      "solve",
    );
    expect(Object.keys(result.rotations3d as object)).toEqual(["upper", "fore"]);
    expect(result.rotations3d).toHaveProperty("upper.rotation");
    const malformed = ik3dPlugin.compose(
      {},
      1,
      {
        root: { x: NaN, y: Infinity, z: 0 },
        target: { x: NaN, y: Infinity, z: -Infinity },
        members,
      },
      "solve",
    );
    expect(
      Object.values(malformed.rotations3d as Record<string, Record<string, number>>).every((pose) =>
        Object.values(pose).every((value) => Number.isFinite(value)),
      ),
    ).toBe(true);
  });

  it("TH-8 FK consumes the solver record and publishes six scalar frame keys", () => {
    const result = fk3dPlugin.compose(
      { length: 80 },
      1,
      {
        base: readFrame3d({}),
        solver: { rotations3d: { upper: { rotation: 90, rotationX: 0, rotationY: 0 } } },
      },
      "upper",
    );
    expect(result.x).toBeCloseTo(0, 12);
    expect(result.y).toBeCloseTo(80, 12);
    expect(result.z).toBe(0);
    expect(result.rotation).toBe(90);
    expect(result.rotationX).toBe(0);
    expect(result.rotationY).toBe(0);
    expect(Object.keys(result)).toEqual(["x", "y", "z", "rotation", "rotationX", "rotationY"]);
  });

  it("TH-20 reads the pair from its base links, not from delivery order", () => {
    const inputs = { root: readFrame3d({}), target: readFrame3d({ x: 60, y: 40, z: 50 }) };
    const delivered = ik3dPlugin.compose({}, 1, { ...inputs, members }, "solve");
    const reversed = ik3dPlugin.compose(
      {},
      1,
      { ...inputs, members: [foreMember, upperMember] },
      "solve",
    );
    expect(reversed.rotations3d).toEqual(delivered.rotations3d);
    // FK closure: composing the published pose through `fk3d` puts the tip on the goal, which a
    // pair solved in the wrong order cannot do, since the 80 and 60 segments would swap.
    const upper = fk3dPlugin.compose(
      { length: 80 },
      1,
      { base: inputs.root, solver: delivered },
      "upper",
    );
    const tip = fk3dPlugin.compose({ length: 60 }, 1, { base: upper, solver: delivered }, "fore");
    expect(Math.hypot(Number(tip.x) - 60, Number(tip.y) - 40, Number(tip.z) - 50)).toBeLessThan(
      1e-9,
    );
    // Siblings are two paths. The graph refuses them at load (TH-12), so reaching the solver with
    // them is an invariant breach and throws rather than solving one as if it hung from the other.
    const siblings = [
      { id: "upper", base: "root", values: { length: 80 }, progress: 1 },
      { id: "fore", base: "root", values: { length: 60 }, progress: 1 },
    ];
    expect(() => ik3dPlugin.compose({}, 1, { ...inputs, members: siblings }, "solve")).toThrow(
      "ik3d requires exactly two members on one path.",
    );
  });
});
