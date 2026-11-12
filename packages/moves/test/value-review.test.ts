import { describe, expect, it } from "vitest";
import {
  anticipate,
  mixPose,
  overshoot,
  repeated,
  reversed,
  type Pose2d,
  type Time,
} from "@gerak/moves";

const timed = (progress: number, length: number): Time => ({
  progress,
  clock: { kind: "timed", elapsed: progress * length, length },
});

describe("values at their edges", () => {
  it("blends a clip from the side that has one, since a clip has no rest to start from", () => {
    const wipe: Pose2d = { clipX: 100, clipY: 80, clipRadius: 900 };
    expect(mixPose({}, wipe, 0.5)).toEqual(wipe);
    expect(mixPose(wipe, { clipX: 300, clipY: 80, clipRadius: 100 }, 0.5)).toEqual({
      clipX: 200,
      clipY: 80,
      clipRadius: 500,
    });
    expect(mixPose({}, { blur: 4 }, 0.5)).toEqual({ blur: 2 });
  });

  it("stops a modifier at the least a field can be", () => {
    const sharpening = (time: Time): Pose2d => ({ blur: 4 * time.progress });
    const wound = anticipate({ share: 0.2, amount: 0.5 }, timed(0.1, 1000), sharpening);
    expect(wound.blur).toBe(0);
  });

  it("writes out only the fields its input carries", () => {
    const sliding = (time: Time): Pose2d => ({ x: -200 * (1 - time.progress) });
    expect(Object.keys(anticipate({}, timed(0.5, 1000), sliding))).toEqual(["x"]);
    expect(Object.keys(overshoot({}, timed(0.9, 1000), sliding))).toEqual(["x"]);
  });

  it("moves a timed clock with the progress it reshapes", () => {
    expect(reversed(timed(0.25, 1000))).toEqual(timed(0.75, 1000));
    expect(repeated(timed(0.125, 1000), 2)).toEqual(timed(0.25, 1000));
    expect(repeated(timed(1, 1000), 3)).toEqual(timed(1, 1000));
    const elapsed: number[] = [];
    const reading = (time: Time): Pose2d => {
      if (time.clock.kind === "timed") elapsed.push(time.clock.elapsed);
      return { x: time.progress };
    };
    overshoot({ share: 0.5 }, timed(0.25, 1000), reading);
    expect(elapsed).toEqual([0, 1000, 500]);
  });
});
