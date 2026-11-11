import { describe, expect, it } from "vitest";
import {
  anticipate,
  atProgress,
  overshoot,
  repeated,
  reversed,
  type Pose2d,
  type Time,
} from "../src";

const ramp = (time: Time): Pose2d => ({ x: time.progress });
const slide = (time: Time): Pose2d => ({ x: -200 * (1 - time.progress) });

describe("modifiers", () => {
  it("reversed holds rest at progress 0 and plays the input backwards", () => {
    expect(reversed({}, atProgress(0), slide).x).toBeCloseTo(0);
    expect(reversed({}, atProgress(1), slide).x).toBeCloseTo(-200);
    expect(reversed({}, atProgress(0.25), ramp).x).toBeCloseTo(0.75);
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

  it("repeated plays the input count times and ends on its end", () => {
    expect(repeated({ count: 3 }, atProgress(1 / 6), ramp).x).toBeCloseTo(0.5);
    expect(repeated({ count: 3 }, atProgress(0.5), ramp).x).toBeCloseTo(0.5);
    expect(repeated({ count: 3 }, atProgress(1), ramp).x).toBe(1);
    expect(repeated({ count: 2.9 }, atProgress(0.25), ramp).x).toBeCloseTo(0.5);
  });
});
