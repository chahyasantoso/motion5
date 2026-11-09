import { describe, expect, it } from "vitest";
import {
  atProgress,
  elapsedOf,
  liveAt,
  smear,
  velocity,
  type Pose2d,
  type Time,
} from "@motion5/moves";

const ms = (time: Time) => elapsedOf(time.clock) ?? 0;
const falling = (time: Time): Pose2d => ({ x: 5, y: (ms(time) * 2000) / 1000 });

describe("velocity", () => {
  it("reads px per second from the signal", () => {
    const v = velocity(falling, liveAt(500), []);
    expect(v.vy).toBeCloseTo(2000, 6);
    expect(v.vx).toBeCloseTo(0, 6);
  });

  it("is one-sided at the start and zero with no clock", () => {
    expect(velocity(falling, liveAt(0), []).vy).toBeCloseTo(2000, 6);
    expect(velocity(falling, atProgress(0.5), [])).toEqual({ vx: 0, vy: 0 });
  });
});

describe("smear", () => {
  it("is empty at rest", () => {
    expect(smear({ vx: 0, vy: 0 }, { stretch: 0.2, max: 2 })).toEqual({ pose: {}, heading: 0 });
    expect(smear({ vx: 0, vy: 900 }, { stretch: 0, max: 2 })).toEqual({ pose: {}, heading: 0 });
  });

  it("stretches along the travel and keeps area", () => {
    const { pose, heading } = smear({ vx: 0, vy: 2000 }, { stretch: 0.2, max: 3 });
    expect(heading).toBeCloseTo(90, 9);
    expect(pose.rotation).toBeCloseTo(90, 9);
    expect(pose.scaleX).toBeCloseTo(1.4, 9);
    expect(pose.scaleY).toBeCloseTo(1 / 1.4, 9);
  });

  it("holds at the cap", () => {
    expect(smear({ vx: 0, vy: 20000 }, { stretch: 0.2, max: 1.5 }).pose.scaleX).toBe(1.5);
  });

  it("refuses a negative stretch or a max under 1", () => {
    expect(() => smear({ vx: 1, vy: 1 }, { stretch: -1, max: 2 })).toThrow(RangeError);
    expect(() => smear({ vx: 1, vy: 1 }, { stretch: 1, max: 0.5 })).toThrow(RangeError);
  });

  it("keeps its heading when travel reverses, since a stretch has no front", () => {
    const right = smear({ vx: 1000, vy: 0 }, { stretch: 0.2, max: 3 });
    const left = smear({ vx: -1000, vy: 0 }, { stretch: 0.2, max: 3 });
    expect(left).toEqual(right);
    expect(smear({ vx: 0, vy: -900 }, { stretch: 0.2, max: 3 }).heading).toBeCloseTo(90, 9);
  });

  it("with an inner counter-rotation is a pure stretch along the heading", () => {
    const { pose, heading } = smear({ vx: 1000, vy: 1000 }, { stretch: 0.5, max: 4 });
    const s = pose.scaleX ?? 1;
    const rot = (deg: number) => {
      const r = (deg * Math.PI) / 180;
      return [Math.cos(r), -Math.sin(r), Math.sin(r), Math.cos(r)];
    };
    const mul = (a: number[], b: number[]) => [
      (a[0] ?? 0) * (b[0] ?? 0) + (a[1] ?? 0) * (b[2] ?? 0),
      (a[0] ?? 0) * (b[1] ?? 0) + (a[1] ?? 0) * (b[3] ?? 0),
      (a[2] ?? 0) * (b[0] ?? 0) + (a[3] ?? 0) * (b[2] ?? 0),
      (a[2] ?? 0) * (b[1] ?? 0) + (a[3] ?? 0) * (b[3] ?? 0),
    ];
    const outer = mul(rot(pose.rotation ?? 0), [s, 0, 0, pose.scaleY ?? 1]);
    const total = mul(outer, rot(-heading));
    const expected = mul(mul(rot(45), [s, 0, 0, 1 / s]), rot(-45));
    expect(heading).toBeCloseTo(45, 9);
    total.forEach((value, i) => expect(value).toBeCloseTo(expected[i] ?? 0, 9));
  });
});

describe("velocity at the end of a timed clock", () => {
  it("never reads a signal past the clock's length", () => {
    const seen: number[] = [];
    const signal = (time: Time) => {
      seen.push(time.progress);
      return { y: time.progress * 1000 };
    };
    const end: Time = { progress: 1, clock: { kind: "timed", elapsed: 1000, length: 1000 } };
    const { vy } = velocity(signal, end, []);
    expect(Math.max(...seen)).toBeLessThanOrEqual(1);
    expect(vy).toBeCloseTo(1000, 6);
  });
});
