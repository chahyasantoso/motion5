import { describe, expect, it } from "vitest";
import { ikPlugin, readMembers, solveTwoBone, type BaseFrame } from "../../../src/plugins/ik";

// Slice C3 of issue #195: the `ik` solver plugin and the `solveTwoBone` math.
//
// The analytic two-bone solve computes local rotations for the root-most and the tip member through
// the law of cosines, clamping reach into `[|l1 - l2|, l1 + l2]` so an unreachable target extends
// the chain instead of producing `NaN` out of `acos`.
//
// The failing-first seam this file opened with is deleted, under the guardrail that created it: a
// seam declared for a module that does not exist yet expires when the module lands. It declared
// `ikPlugin`, `solveTwoBone` and `readMembers` as optional members of a local interface beside a
// real import of all three, so every `expect(seam.x).toBeDefined()` asserted that an import
// resolved and every call went through a `!`. `BaseFrame` and `MemberState` were re-declared here
// as well, a second copy of a published type that no assignment would ever have caught drifting.
// The fixtures are inferred now and type-checked against the module's own parameter types at each
// call site.

const ROOT = { x: 200, y: 300, rotation: 0 };
const UPPER_ARM = "walker/upper-arm";
const FOREARM = "walker/forearm";

/** The worked rig of ADR-051: an 80-unit upper arm and a 60-unit forearm, root-most first. */
function armMembers(l1 = 80, l2 = 60) {
  return [
    { id: UPPER_ARM, base: "walker/shoulder", values: { length: l1 }, progress: 0 },
    { id: FOREARM, base: UPPER_ARM, values: { length: l2 }, progress: 0 },
  ];
}

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** `fk`'s own composition, inlined as an oracle: rotate then translate, twice. */
function forwardTip(
  root: BaseFrame,
  l1: number,
  r1: number,
  l2: number,
  r2: number,
): { x: number; y: number } {
  const worldR1 = root.rotation + r1;
  const jointX = root.x + l1 * Math.cos(degToRad(worldR1));
  const jointY = root.y + l1 * Math.sin(degToRad(worldR1));
  const worldR2 = worldR1 + r2;
  return {
    x: jointX + l2 * Math.cos(degToRad(worldR2)),
    y: jointY + l2 * Math.sin(degToRad(worldR2)),
  };
}

describe("ikPlugin and solveTwoBone (Slice C3)", () => {
  it("IK-1 solveTwoBone reaches the target tip and pins the default elbow branch", () => {
    const target = { x: 320, y: 340, rotation: 0 };
    const rotations = solveTwoBone(ROOT, target, armMembers(), false);

    const r1 = rotations[UPPER_ARM]!;
    const r2 = rotations[FOREARM]!;
    const tip = forwardTip(ROOT, 80, r1, 60, r2);
    expect(tip.x).toBeCloseTo(320, 5);
    expect(tip.y).toBeCloseTo(340, 5);

    // Reaching the target is not the convention. Both elbow branches put the tip exactly on it, so
    // swapping the two arms of `flip` leaves every reachability assertion green: this case used to
    // assert `typeof r1 === "number"` and the tip, and passed either way round. The default is the
    // positive branch, `phi + alpha`, and these two numbers are the only thing that says so.
    expect(r1).toBeCloseTo(40.168, 3);
    expect(r2).toBeCloseTo(-51.3178, 4);
  });

  it("IK-2 unreachable target produces finite angles fully extended toward it", () => {
    // The target is 200 units away and the chain reaches 80 + 60 = 140.
    const target = { x: 400, y: 300, rotation: 0 };
    const rotations = solveTwoBone(ROOT, target, armMembers(), false);

    const r1 = rotations[UPPER_ARM]!;
    const r2 = rotations[FOREARM]!;
    expect(Number.isFinite(r1)).toBe(true);
    expect(Number.isFinite(r2)).toBe(true);
    // Fully extended is a zero relative rotation, aimed straight along the horizontal.
    expect(r2).toBeCloseTo(0, 5);
    expect(r1).toBeCloseTo(0, 5);
  });

  it("IK-3 flip mirrors the elbow across the root-to-target line, both branches pinned", () => {
    const target = { x: 300, y: 350, rotation: 0 };
    const members = armMembers();
    const unflipped = solveTwoBone(ROOT, target, members, false);
    const flipped = solveTwoBone(ROOT, target, members, true);

    // Exact on both sides. `not.toEqual` on one key, which is all this case asserted before, holds
    // for any two distinct solutions: it would survive the branches being swapped, and it would
    // survive them being replaced by different arithmetic entirely.
    expect(unflipped[UPPER_ARM]).toBeCloseTo(57.7726, 4);
    expect(unflipped[FOREARM]).toBeCloseTo(-74.9052, 4);
    expect(flipped[UPPER_ARM]).toBeCloseTo(-4.6425, 4);
    expect(flipped[FOREARM]).toBeCloseTo(74.9052, 4);

    // And a mirror rather than two unrelated poses: the two root angles sit either side of the
    // root-to-target direction by one alpha, and the two elbow angles are exact negations.
    const targetAngle = (Math.atan2(50, 100) * 180) / Math.PI;
    const above = unflipped[UPPER_ARM]! - targetAngle;
    const below = targetAngle - flipped[UPPER_ARM]!;
    expect(above).toBeCloseTo(below, 9);
    expect(unflipped[FOREARM]).toBe(-flipped[FOREARM]!);

    // Both configurations still put the tip on the target.
    const tip = forwardTip(ROOT, 80, flipped[UPPER_ARM]!, 60, flipped[FOREARM]!);
    expect(tip.x).toBeCloseTo(300, 5);
    expect(tip.y).toBeCloseTo(350, 5);
  });

  it("IK-4 degenerate distance or a zero-length member produces finite angles", () => {
    const samePoint = solveTwoBone(ROOT, { x: 200, y: 300, rotation: 0 }, armMembers());
    expect(Number.isFinite(samePoint[UPPER_ARM])).toBe(true);
    expect(Number.isFinite(samePoint[FOREARM])).toBe(true);

    const zeroLength = solveTwoBone(ROOT, { x: 250, y: 300, rotation: 0 }, armMembers(0, 60));
    expect(Number.isFinite(zeroLength[UPPER_ARM])).toBe(true);
    expect(Number.isFinite(zeroLength[FOREARM])).toBe(true);
  });

  it("IK-5 readMembers throws when inputs.members is absent", () => {
    expect(() => readMembers(undefined)).toThrow();
    expect(() => readMembers({})).toThrow();
  });

  it("IK-18 compose returns the solver's own values beside rotations", () => {
    const composed = ikPlugin.compose(
      { flip: true },
      0,
      {
        root: { x: 200, y: 300, rotation: 0 },
        target: { x: 320, y: 340, rotation: 0 },
        members: armMembers(),
      },
      "walker/arm-solve",
    );

    // `Track.composeFrom` chains by replacement, so a bare `{ rotations }` return deletes every key
    // this track authored. `flip` is the one `ik` reads itself, so the solver's own configuration
    // vanishes from its published patch with no error and no diagnostic, and so does anything a
    // co-authored plugin contributed beside it on the same node. See ADR-051.
    expect(composed.flip).toBe(true);
    expect(composed.rotations).toBeDefined();

    // And the record is the solve rather than an echo of the inputs: it is keyed by member id and
    // answers for both members.
    const rotations = composed.rotations as unknown as Readonly<Record<string, number>>;
    expect(Object.keys(rotations).sort()).toEqual([FOREARM, UPPER_ARM]);
  });
});
