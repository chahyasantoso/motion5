import { describe, expect, it } from "vitest";
import { fkPlugin } from "../../../src/plugins/fk";

// Issue #211: the per-member blend between a bone's authored rest pose and its solver's output.
//
// The oracle throughout is the composition itself rather than a recomputed frame. Composing a bone
// whose authored `rotation` *is* the solved angle, with no solver bound, is exactly what the
// unconditional override used to produce, so every byte-identity claim below is stated against that
// composition instead of against numbers copied out of it. See ADR-055.

const NODE = "walker/upper-arm";
const BASE = { x: 200, y: 300, rotation: 0 };

/** `IK-1`'s first member on ADR-051's worked rig: root 200,300, target 320,340, lengths 80 and 60. */
const SOLVED = 40.1680100853265;

function solver(solved: number) {
  return { base: BASE, solver: { rotations: { [NODE]: solved } } };
}

/** The three published keys, compared exactly rather than to a tolerance. */
function frameOf(composed: { readonly [key: string]: unknown }) {
  return { x: composed.x, y: composed.y, rotation: composed.rotation };
}

describe("fkPlugin solved rotation weight (issue #211)", () => {
  it("WT-5 an omitted weight composes the unconditional override byte-identically", () => {
    // The mutation instrument. Revert the blend to `solved ?? authored` and this case still passes,
    // which is the point: it is what says the default costs no existing rig a single double.
    const matrix = [
      { length: 80, rotation: 45, x: 0, y: 0 },
      { length: 60, rotation: -20, x: 10, y: -5 },
      { length: 120, rotation: 90, x: 0, y: 15 },
      { length: 20, rotation: 175, x: -3, y: 7 },
    ];

    for (const values of matrix) {
      const blended = fkPlugin.compose(values, 0, solver(SOLVED), NODE);
      const overridden = fkPlugin.compose({ ...values, rotation: SOLVED }, 0, { base: BASE }, NODE);
      expect(frameOf(blended)).toEqual(frameOf(overridden));
      expect(Object.is(blended.rotation, overridden.rotation)).toBe(true);
      expect(Object.is(blended.x, overridden.x)).toBe(true);
      expect(Object.is(blended.y, overridden.y)).toBe(true);
    }
  });

  it("WT-6 weight 0 composes exactly the authored rotation and discards the solve", () => {
    const values = { length: 80, rotation: 45, x: 10, y: -5, weight: 0 };
    const blended = fkPlugin.compose(values, 0, solver(SOLVED), NODE);
    const authoredOnly = fkPlugin.compose(
      { length: 80, rotation: 45, x: 10, y: -5 },
      0,
      { base: BASE },
      NODE,
    );
    expect(frameOf(blended)).toEqual(frameOf(authoredOnly));
    expect(blended.rotation).toBe(45);
  });

  it("WT-7 weight 1 composes exactly the solved rotation, on IK-1's worked number", () => {
    const values = { length: 80, rotation: 45, x: 0, y: 0 };
    const explicit = fkPlugin.compose({ ...values, weight: 1 }, 0, solver(SOLVED), NODE);
    const omitted = fkPlugin.compose(values, 0, solver(SOLVED), NODE);

    // A base rotation of zero, so the composed world rotation is the local one and the assertion is
    // on the published double rather than on a rounding of it.
    expect(explicit.rotation).toBe(SOLVED);
    expect(frameOf(explicit)).toEqual(frameOf(omitted));
  });

  it("WT-8 weight 0.5 across the 180/0 wrap takes the short path", () => {
    // Authored and solved sit 20 degrees apart through the wrap and 340 apart the other way round.
    const values = { length: 80, rotation: 170, x: 0, y: 0, weight: 0.5 };
    const blended = fkPlugin.compose(values, 0, solver(-170), NODE);
    expect(blended.rotation as number).toBeCloseTo(180, 12);

    // What a naive linear blend would have composed instead: the long way round, through zero.
    expect(blended.rotation).not.toBe(0);

    // And the mirror, which lands on the same pose from the other side.
    const mirrored = fkPlugin.compose(
      { length: 80, rotation: -170, x: 0, y: 0, weight: 0.5 },
      0,
      solver(170),
      NODE,
    );
    expect(mirrored.rotation as number).toBeCloseTo(-180, 12);
  });

  it("WT-9 a weight outside [0, 1] is clamped and a non-finite one is fully solved", () => {
    const values = { length: 80, rotation: 45, x: 0, y: 0 };
    const fullySolved = frameOf(fkPlugin.compose(values, 0, solver(SOLVED), NODE));
    const fullyAuthored = frameOf(
      fkPlugin.compose({ ...values, weight: 0 }, 0, solver(SOLVED), NODE),
    );

    // An eased `stops` curve that overshoots is clamped, not extrapolated: extrapolating an angle
    // blend past its only two defined anchors is undefined behavior rather than a designed one.
    for (const weight of [1, 1.25, 2, 1000]) {
      expect(frameOf(fkPlugin.compose({ ...values, weight }, 0, solver(SOLVED), NODE))).toEqual(
        fullySolved,
      );
    }
    for (const weight of [0, -0.25, -1]) {
      expect(frameOf(fkPlugin.compose({ ...values, weight }, 0, solver(SOLVED), NODE))).toEqual(
        fullyAuthored,
      );
    }

    // Non-finite and non-numeric both resolve to `1`, identically to an omitted key, because
    // `readNumber` keeps the damage inside the value that was wrong.
    for (const weight of [Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(frameOf(fkPlugin.compose({ ...values, weight }, 0, solver(SOLVED), NODE))).toEqual(
        fullySolved,
      );
    }
    expect(
      frameOf(fkPlugin.compose({ ...values, weight: "half" }, 0, solver(SOLVED), NODE)),
    ).toEqual(fullySolved);
  });

  it("WT-10 an unbound solver ignores the weight entirely rather than blending toward nothing", () => {
    const values = { length: 80, rotation: 45, x: 0, y: 0, weight: 0.3 };

    // No slot bound at all.
    expect(fkPlugin.compose(values, 0, { base: BASE }, NODE).rotation).toBe(45);

    // Bound, but the solver does not name this node. Both short-circuit to authored, which is what
    // keeps "no solve" and "a solve this bone weights to zero" two distinguishable things.
    const elsewhere = { base: BASE, solver: { rotations: { "other/bone": 10 } } };
    expect(fkPlugin.compose(values, 0, elsewhere, NODE).rotation).toBe(45);

    // A solver publishing a non-finite angle for this node is the same case.
    const broken = { base: BASE, solver: { rotations: { [NODE]: Number.NaN } } };
    expect(fkPlugin.compose(values, 0, broken, NODE).rotation).toBe(45);
  });

  it("WT-11 weight never reaches the composed patch", () => {
    // `compose` returns `composeWorld(...)`, three keys, with no `...values` spread, unlike
    // `ikPlugin` which spreads deliberately (`IK-18`). So the chain-by-replacement rule already
    // drops the authored weight and no `internalKeys` entry or serializer is needed for it.
    const composed = fkPlugin.compose(
      { length: 80, rotation: 45, x: 0, y: 0, weight: 0.5 },
      0,
      solver(SOLVED),
      NODE,
    );
    expect(Object.keys(composed).sort()).toEqual(["rotation", "x", "y"]);
  });
});
