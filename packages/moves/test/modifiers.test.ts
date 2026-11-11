import { describe, expect, it } from "vitest";
import {
  anticipate,
  atProgress,
  overshoot,
  repeated,
  reversed,
  type Pose2d,
  type Time,
  wipe,
} from "../src";

const ramp = (time: Time): Pose2d => ({ x: time.progress });
const slide = (time: Time): Pose2d => ({ x: -200 * (1 - time.progress) });

describe("modifiers", () => {
  it("reversed answers the time at 1 - progress, and a timed clock runs back with it", () => {
    const time: Time = { progress: 0.25, clock: { kind: "timed", elapsed: 250, length: 1000 } };
    expect(reversed(time)).toEqual({
      progress: 0.75,
      clock: { kind: "timed", elapsed: 750, length: 1000 },
    });
    expect(slide(reversed(atProgress(0))).x).toBeCloseTo(0);
    expect(slide(reversed(atProgress(1))).x).toBeCloseTo(-200);
  });

  it("reversed plays a move that answers something other than a pose backwards", () => {
    const options = { radius: 100, x: 0, y: 0 };
    expect(wipe(options, reversed(atProgress(1))).clipRadius).toBeCloseTo(0);
    expect(wipe(options, reversed(atProgress(0))).clipRadius).toBeCloseTo(100);
  });

  it("anticipate goes the other way mid wind-up and ends on the input's end", () => {
    expect(anticipate({}, atProgress(0), ramp).x).toBeCloseTo(0);
    expect(anticipate({ share: 0.2, amount: 0.15 }, atProgress(0.1), ramp).x).toBeCloseTo(-0.15);
    expect(anticipate({ share: 0.2 }, atProgress(0.2), ramp).x).toBeCloseTo(0);
    expect(anticipate({}, atProgress(1), ramp).x).toBe(1);
  });

  it("anticipate with share 0 is the input unchanged", () => {
    for (const p of [0, 0.3, 1])
      expect(anticipate({ share: 0 }, atProgress(p), ramp).x).toBeCloseTo(p);
  });

  it("overshoot passes the end during the settle and lands exactly on it", () => {
    const options = { share: 0.3, amount: 0.1 };
    expect(overshoot(options, atProgress(0.35), ramp).x).toBeCloseTo(0.35 / 0.7);
    expect(overshoot(options, atProgress(0.8), ramp).x ?? 0).toBeGreaterThan(1);
    expect(overshoot(options, atProgress(1), ramp).x).toBe(1);
  });

  it("overshoot never hands its input a progress outside 0 to 1", () => {
    const seen: number[] = [];
    const spy = (time: Time): Pose2d => {
      seen.push(time.progress);
      return ramp(time);
    };
    for (let i = 0; i <= 20; i += 1) overshoot({}, atProgress(i / 20), spy);
    expect(Math.min(...seen)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...seen)).toBeLessThanOrEqual(1);
  });

  it("repeated runs progress 0 to 1 count times and ends on 1", () => {
    expect(ramp(repeated(atProgress(1 / 6), 3)).x).toBeCloseTo(0.5);
    expect(ramp(repeated(atProgress(0.5), 3)).x).toBeCloseTo(0.5);
    expect(repeated(atProgress(1), 3).progress).toBe(1);
    expect(ramp(repeated(atProgress(0.25), 2.9)).x).toBeCloseTo(0.5);
    expect(ramp(repeated(atProgress(0.25), 0)).x).toBeCloseTo(0.25);
  });

  it("overshoot passes its end on a custom number and settles on it", () => {
    const tint = (time: Time): Pose2d => ({ custom: { tint: time.progress } });
    const options = { share: 0.3, amount: 0.1 };
    expect(overshoot(options, atProgress(0.8), tint).custom?.tint ?? 0).toBeGreaterThan(1);
    expect(overshoot(options, atProgress(1), tint).custom?.tint).toBe(1);
    expect(overshoot(options, atProgress(0.35), tint).custom?.tint).toBeCloseTo(0.35 / 0.7);
  });

  it("anticipate leaves a number that multiplies as the input gave it", () => {
    const grow = (time: Time): Pose2d => ({ scale: 1 + time.progress });
    expect(anticipate({}, atProgress(0.1), grow).scale).toBe(1);
    expect(anticipate({}, atProgress(1), grow).scale).toBe(2);
  });
});
