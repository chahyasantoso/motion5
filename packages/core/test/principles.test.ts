import { describe, expect, it } from "vitest";
import {
  NO_INPUT,
  anticipation,
  anticipation3d,
  arc,
  arc3d,
  elapsedOf,
  exaggerate,
  exaggerate3d,
  followThrough,
  followThrough3d,
  liveAt,
  overlap,
  secondary,
  secondary3d,
  squashStretch,
  squashStretch3d,
  type Pose2d,
  type Pose3d,
  type Time,
} from "../src";

const ms = (time: Time) => elapsedOf(time.clock) ?? 0;
const timed = (progress: number, length = 1000): Time => ({
  progress,
  clock: { kind: "timed", elapsed: progress * length, length },
});
const line = (time: Time): Pose2d => ({ x: 200 * time.progress });
const line3d = (time: Time): Pose3d => ({ x: 200 * time.progress });
const running = (time: Time): Pose2d => ({ x: Math.min(ms(time), 1000) / 5 });
const running3d = (time: Time): Pose3d => ({ x: Math.min(ms(time), 1000) / 5 });

describe("squashStretch", () => {
  it("keeps the area while it stretches along the travel", () => {
    const pose = squashStretch({ stretch: 0.5, max: 3 })(running)(liveAt(500), NO_INPUT);
    expect(pose.scaleX).toBeGreaterThan(1);
    expect((pose.scaleX ?? 0) * (pose.scaleY ?? 0)).toBeCloseTo(1);
  });

  it("keeps the volume in 3D", () => {
    const pose = squashStretch3d({ stretch: 0.01, max: 3 })(running3d)(liveAt(500), NO_INPUT);
    expect(pose.scaleX).toBeGreaterThan(1);
    expect((pose.scaleX ?? 0) * (pose.scaleY ?? 0) * (pose.scaleZ ?? 0)).toBeCloseTo(1);
  });

  it("refuses a bad option", () => {
    expect(() => squashStretch({ stretch: -1, max: 3 })).toThrow(RangeError);
    expect(() => squashStretch({ stretch: 1, max: 0.5 })).toThrow(RangeError);
    expect(() => squashStretch3d({ stretch: 1, max: 0.5 })).toThrow(RangeError);
  });
});

describe("anticipation", () => {
  const options = { share: 0.2, amount: 0.15 };
  it("matches the values the anticipate move gave over a rising line", () => {
    const wound = anticipation(options)(line);
    const recorded: readonly (readonly [number, number])[] = [
      [0, 0],
      [0.1, -30],
      [0.5, 75],
      [1, 200],
    ];
    for (const [progress, x] of recorded)
      expect(wound(timed(progress), NO_INPUT).x).toBeCloseTo(x, 9);
  });

  it("goes the other way first and ends where the signal ends", () => {
    const wound = anticipation(options)(line);
    expect(wound(timed(0.1), NO_INPUT).x).toBeCloseTo(-0.15 * 200);
    expect(wound(timed(1), NO_INPUT).x).toBeCloseTo(200);
  });

  it("winds up a 3D signal the same way", () => {
    const wound = anticipation3d(options)(line3d);
    expect(wound(timed(0.1), NO_INPUT).x).toBeCloseTo(-30);
    expect(wound(timed(1), NO_INPUT).x).toBeCloseTo(200);
  });

  it("refuses a bad option", () => {
    expect(() => anticipation({ share: 1, amount: 0.1 })).toThrow(RangeError);
    expect(() => anticipation3d({ share: 0.2, amount: -1 })).toThrow(RangeError);
  });
});

describe("followThrough", () => {
  const spring = { stiffness: 170, damping: 26 };
  it("lags the signal, then ends on its end", () => {
    const followed = followThrough(spring)(running);
    expect(followed(liveAt(500), NO_INPUT).x).toBeLessThan(100);
    expect(followed(liveAt(8000), NO_INPUT).x).toBe(200);
  });

  it("turns the short way across the seam", () => {
    const turning = (time: Time): Pose2d => ({ rotation: ms(time) < 500 ? 350 : 10 });
    const rotation = followThrough(spring)(turning)(liveAt(560), NO_INPUT).rotation ?? 0;
    expect(Math.abs(rotation)).toBeLessThan(40);
  });

  it("follows a 3D signal and ends on it", () => {
    const followed = followThrough3d(spring)(running3d);
    expect(followed(liveAt(500), NO_INPUT).x).toBeLessThan(100);
    expect(followed(liveAt(8000), NO_INPUT).x).toBe(200);
  });

  it("refuses a bad option", () => {
    expect(() => followThrough({ stiffness: 0, damping: 26 })).toThrow(RangeError);
    expect(() => followThrough3d({ stiffness: 170, damping: -1 })).toThrow(RangeError);
  });
});

describe("overlap", () => {
  it("holds the start before the lag, then plays the signal late", () => {
    const late = overlap({ lagMs: 100 })(running);
    expect(late(liveAt(50), NO_INPUT).x).toBe(0);
    expect(late(liveAt(300), NO_INPUT).x).toBeCloseTo(40);
  });

  it("holds a 3D signal the same way", () => {
    const late = overlap({ lagMs: 100 })(running3d);
    expect(late(liveAt(50), NO_INPUT).x).toBe(0);
  });

  it("refuses a negative lag", () => {
    expect(() => overlap({ lagMs: -1 })).toThrow(RangeError);
  });
});

describe("arc", () => {
  it("is 0 at both ends and bend at the middle", () => {
    const bowed = arc({ bend: 40 })(line);
    expect(bowed(timed(0), NO_INPUT).y ?? 0).toBeCloseTo(0);
    expect(bowed(timed(1), NO_INPUT).y ?? 0).toBeCloseTo(0);
    expect(Math.abs(bowed(timed(0.5), NO_INPUT).y ?? 0)).toBeCloseTo(40);
    expect(bowed(timed(0.5), NO_INPUT).x).toBeCloseTo(100);
  });

  it("adds the 3D offset vector scaled by the arch", () => {
    const bowed = arc3d({ bend: { x: 0, y: 30, z: 10 } })(line3d);
    expect(bowed(timed(0.5), NO_INPUT)).toMatchObject({ y: 30, z: 10 });
    expect(bowed(timed(0), NO_INPUT).y ?? 0).toBeCloseTo(0);
  });

  it("refuses a bad option", () => {
    expect(() => arc({ bend: Number.NaN })).toThrow(RangeError);
    expect(() => arc3d({ bend: { x: 0, y: Number.POSITIVE_INFINITY, z: 0 } })).toThrow(RangeError);
  });
});

describe("exaggerate", () => {
  const pose = (): Pose2d => ({ x: 10, scale: 1.2, rotation: -5 });
  it("changes nothing at amount 0", () => {
    expect(exaggerate({ amount: 0 })(pose)(timed(0.5), NO_INPUT)).toEqual(pose());
  });

  it("scales each field's distance from its rest", () => {
    expect(exaggerate({ amount: 1 })(pose)(timed(0.5), NO_INPUT)).toEqual({
      x: 20,
      scale: 1.4,
      rotation: -10,
    });
  });

  it("does the same in 3D", () => {
    const pose3d = (): Pose3d => ({ x: 10, z: 4, scale: 1.2 });
    expect(exaggerate3d({ amount: 0 })(pose3d)(timed(0.5), NO_INPUT)).toEqual(pose3d());
    expect(exaggerate3d({ amount: 1 })(pose3d)(timed(0.5), NO_INPUT)).toEqual({
      x: 20,
      z: 8,
      scale: 1.4,
    });
  });

  it("refuses a bad option", () => {
    expect(() => exaggerate({ amount: -1 })).toThrow(RangeError);
    expect(() => exaggerate3d({ amount: Number.NaN })).toThrow(RangeError);
  });
});

describe("secondary", () => {
  it("answers respond of the primary's velocity", () => {
    const tilt = secondary(({ vx }) => ({ rotation: vx / 100 }))(running);
    expect(tilt(liveAt(500), NO_INPUT).rotation).toBeCloseTo(2);
  });

  it("answers respond of the 3D velocity", () => {
    const lean = secondary3d(({ vx, vz }) => ({ rotationY: vx / 100 + vz }))(running3d);
    expect(lean(liveAt(500), NO_INPUT).rotationY).toBeCloseTo(2);
  });

  it("refuses a respond that is not a function", () => {
    // @ts-expect-error a bad argument on purpose
    expect(() => secondary(undefined)).toThrow(RangeError);
  });
});
