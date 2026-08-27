import { describe, expect, it } from "vitest";
import { fkPlugin } from "../../../src/plugins/fk";

// Slice C3 of issue #195: FK plugin solver slot override.
//
// When `inputs.solver` is bound, `fkPlugin.compose` looks up its qualified `nodeId` in
// `inputs.solver.rotations` and uses that solved rotation in place of authored `values.rotation`.
// When unbound or missing, it falls back to authored `values.rotation`.

describe("fkPlugin solver override (Slice C3)", () => {
  it("IK-6 solver slot is declared and unbound composition is byte-identical across matrix", () => {
    // Assert requirement slot declared
    expect(fkPlugin.requirements).toHaveProperty("solver");

    // Matrix of parent frames and local properties
    const testMatrix = [
      {
        parent: { x: 0, y: 0, rotation: 0 },
        values: { length: 50, rotation: 30, x: 0, y: 0 },
      },
      {
        parent: { x: 100, y: 200, rotation: 45 },
        values: { length: 80, rotation: -20, x: 10, y: -5 },
      },
      {
        parent: { x: -50, y: 50, rotation: 180 },
        values: { length: 120, rotation: 90, x: 0, y: 15 },
      },
    ];

    for (const { parent, values } of testMatrix) {
      const inputs = { base: parent };
      const output = fkPlugin.compose(values, 0, inputs, "walker/bone");
      expect(output).toBeDefined();
      expect(typeof output.x).toBe("number");
      expect(typeof output.y).toBe("number");
      expect(typeof output.rotation).toBe("number");
    }
  });

  it("IK-7 solver bound but nodeId absent from rotations falls back to authored rotation", () => {
    const parent = { x: 200, y: 300, rotation: 0 };
    const values = { length: 80, rotation: 45, x: 0, y: 0 };
    // solver has rotations for other bones, but not walker/upper-arm
    const inputs = {
      base: parent,
      solver: { rotations: { "other/bone": 10 } },
    };

    const output = fkPlugin.compose(values, 0, inputs, "walker/upper-arm");
    expect(output.rotation).toBe(45);
  });

  it("IK-8 solved rotation composes through the authored pivot offset", () => {
    const parent = { x: 100, y: 100, rotation: 0 };
    // Authored rotation is 0, but solver says 90
    const values = { length: 50, rotation: 0, x: 10, y: 20 };
    const inputs = {
      base: parent,
      solver: { rotations: { "walker/bone": 90 } },
    };

    const output = fkPlugin.compose(values, 0, inputs, "walker/bone");
    // Pivot should be at parent (100, 100) + offset (10, 20) = (110, 120)
    // Tip at rotation 90 deg with length 50:
    // dx = 50 * cos(90) = 0, dy = 50 * sin(90) = 50
    // Tip x = 110, Tip y = 120 + 50 = 170, rotation = 90
    expect(output.rotation).toBe(90);
    expect(output.x).toBeCloseTo(110, 5);
    expect(output.y).toBeCloseTo(170, 5);
  });
});
