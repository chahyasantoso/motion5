import { describe, expect, it } from "vitest";
import { matrixFromEuler3d, multiplyMatrix3, type Euler3d, type Matrix3 } from "@motion5/rig";
import { elapsedOf, liveAt, smear3d, velocity3d, type Pose3d, type Time } from "@motion5/moves";

const ms = (time: Time) => elapsedOf(time.clock) ?? 0;
const rising = (time: Time): Pose3d => ({ x: 1, y: 2, z: (ms(time) * 2000) / 1000 });
const eulerOf = (pose: Pose3d): Euler3d => ({
  rotation: pose.rotation ?? 0,
  rotationX: pose.rotationX ?? 0,
  rotationY: pose.rotationY ?? 0,
});
const diag = (a: number, b: number, c: number): Matrix3 => [a, 0, 0, 0, b, 0, 0, 0, c];

describe("velocity3d", () => {
  it("reads units per second from the signal", () => {
    const v = velocity3d(rising, liveAt(500), []);
    expect(v.vz).toBeCloseTo(2000, 6);
    expect(v.vx).toBeCloseTo(0, 6);
    expect(v.vy).toBeCloseTo(0, 6);
  });

  it("never reads a signal past a timed clock's end", () => {
    const seen: number[] = [];
    const signal = (time: Time): Pose3d => {
      seen.push(time.progress);
      return { z: time.progress * 1000 };
    };
    const end: Time = { progress: 1, clock: { kind: "timed", elapsed: 1000, length: 1000 } };
    const { vz } = velocity3d(signal, end, []);
    expect(Math.max(...seen)).toBeLessThanOrEqual(1);
    expect(vz).toBeCloseTo(1000, 6);
  });

  it("is zero with no clock", () => {
    const untimed: Time = { progress: 0.5, clock: { kind: "untimed" } };
    expect(velocity3d(rising, untimed, [])).toEqual({ vx: 0, vy: 0, vz: 0 });
  });
});

describe("smear3d", () => {
  it("is empty at rest", () => {
    expect(smear3d({ vx: 0, vy: 0, vz: 0 }, { stretch: 0.2, max: 2 })).toEqual({
      pose: {},
      turn: {},
    });
    expect(smear3d({ vx: 0, vy: 0, vz: 900 }, { stretch: 0, max: 2 })).toEqual({
      pose: {},
      turn: {},
    });
  });

  it("keeps its pose when travel reverses, since a stretch has no front", () => {
    const ahead = smear3d({ vx: 300, vy: -200, vz: 900 }, { stretch: 0.3, max: 3 });
    const back = smear3d({ vx: -300, vy: 200, vz: -900 }, { stretch: 0.3, max: 3 });
    expect(back).toEqual(ahead);
  });

  it("keeps volume", () => {
    const { pose } = smear3d({ vx: 300, vy: -400, vz: 1200 }, { stretch: 0.2, max: 3 });
    expect((pose.scaleX ?? 1) * (pose.scaleY ?? 1) * (pose.scaleZ ?? 1)).toBeCloseTo(1, 9);
    expect(pose.scaleX).toBeCloseTo(1 + (0.2 * Math.hypot(300, 400, 1200)) / 1000, 9);
  });

  it("holds at the cap", () => {
    expect(smear3d({ vx: 0, vy: 0, vz: 20000 }, { stretch: 0.2, max: 1.5 }).pose.scaleX).toBe(1.5);
  });

  it("refuses a negative stretch or a max under 1", () => {
    expect(() => smear3d({ vx: 1, vy: 1, vz: 1 }, { stretch: -1, max: 2 })).toThrow(RangeError);
    expect(() => smear3d({ vx: 1, vy: 1, vz: 1 }, { stretch: 1, max: 0.5 })).toThrow(RangeError);
  });

  it("with the inner turn is a pure stretch along the travel", () => {
    const { pose, turn } = smear3d({ vx: 1000, vy: 0, vz: 1000 }, { stretch: 0.5, max: 4 });
    const s = pose.scaleX ?? 1;
    const side = 1 / Math.sqrt(s);
    const outer = multiplyMatrix3(matrixFromEuler3d(eulerOf(pose)), diag(s, side, side));
    const total = multiplyMatrix3(outer, matrixFromEuler3d(eulerOf(turn)));
    const d = [Math.SQRT1_2, 0, Math.SQRT1_2];
    const expected = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(
      (i) => (i % 4 === 0 ? side : 0) + (s - side) * (d[Math.floor(i / 3)] ?? 0) * (d[i % 3] ?? 0),
    );
    expected.forEach((value, i) => expect(total[i]).toBeCloseTo(value, 9));
  });
});
