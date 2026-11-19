import { describe, expect, it } from "vitest";
import {
  atProgress,
  repeated,
  reversed,
  type Pose2d,
  type Time,
  anticipation,
  NO_EVENTS,
} from "@gerak/core";
import { overshoot, wipe } from "../src";

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
    expect(wipe(options)(reversed(atProgress(1))).clipRadius).toBeCloseTo(0);
    expect(wipe(options)(reversed(atProgress(0))).clipRadius).toBeCloseTo(100);
  });

  it("anticipate goes the other way mid wind-up and ends on the input's end", () => {
    expect(
      anticipation({ share: 0.2, amount: 0.15 })(ramp)(atProgress(0), NO_EVENTS).x,
    ).toBeCloseTo(0);
    expect(
      anticipation({ share: 0.2, amount: 0.15 })(ramp)(atProgress(0.1), NO_EVENTS).x,
    ).toBeCloseTo(-0.15);
    expect(
      anticipation({ share: 0.2, amount: 0.15 })(ramp)(atProgress(0.2), NO_EVENTS).x,
    ).toBeCloseTo(0);
    expect(anticipation({ share: 0.2, amount: 0.15 })(ramp)(atProgress(1), NO_EVENTS).x).toBe(1);
  });

  it("anticipate with share 0 is the input unchanged", () => {
    for (const p of [0, 0.3, 1])
      expect(
        anticipation({ share: 0, amount: 0.15 })(ramp)(atProgress(p), NO_EVENTS).x,
      ).toBeCloseTo(p);
  });

  it("overshoot passes the end during the settle and lands exactly on it", () => {
    const options = { share: 0.3, amount: 0.1 };
    expect(overshoot(options)(ramp)(atProgress(0.35)).x).toBeCloseTo(0.35 / 0.7);
    expect(overshoot(options)(ramp)(atProgress(0.8)).x ?? 0).toBeGreaterThan(1);
    expect(overshoot(options)(ramp)(atProgress(1)).x).toBe(1);
  });

  it("overshoot never hands its input a progress outside 0 to 1", () => {
    const seen: number[] = [];
    const spy = (time: Time): Pose2d => {
      seen.push(time.progress);
      return ramp(time);
    };
    for (let i = 0; i <= 20; i += 1) overshoot({})(spy)(atProgress(i / 20));
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
    expect(overshoot(options)(tint)(atProgress(0.8)).custom?.tint ?? 0).toBeGreaterThan(1);
    expect(overshoot(options)(tint)(atProgress(1)).custom?.tint).toBe(1);
    expect(overshoot(options)(tint)(atProgress(0.35)).custom?.tint).toBeCloseTo(0.35 / 0.7);
  });

  it("anticipate leaves a number that multiplies as the input gave it", () => {
    const grow = (time: Time): Pose2d => ({ scale: 1 + time.progress });
    expect(anticipation({ share: 0.2, amount: 0.15 })(grow)(atProgress(0.1), NO_EVENTS).scale).toBe(
      1,
    );
    expect(anticipation({ share: 0.2, amount: 0.15 })(grow)(atProgress(1), NO_EVENTS).scale).toBe(
      2,
    );
  });
});
