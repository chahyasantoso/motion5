import { describe, expect, it } from "vitest";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/ports/fakes";

describe("trigger contract T1", () => {
  it("rejects a time trigger without a positive duration", () => {
    const engine = new Engine({
      clock: createManualClock(),
      interpolator: createFakeInterpolator(),
      scheduler: createFakeScheduler(),
    });

    // Red first: trigger.type is currently validated, but time-specific fields are not.
    expect(() =>
      engine.load({
        schemaVersion: 5,
        motions: [{ id: "scene", trigger: { type: "time" }, tracks: [] }],
      }),
    ).toThrow(/trigger-time-duration/);
  });

  it("rejects unsupported time playback fields instead of accepting inert configuration", () => {
    const engine = new Engine({
      clock: createManualClock(),
      interpolator: createFakeInterpolator(),
      scheduler: createFakeScheduler(),
    });

    expect(() =>
      engine.load({
        schemaVersion: 5,
        motions: [
          {
            id: "scene",
            trigger: { type: "time", duration: 1000, autoplay: false, repeat: 0, yoyo: true },
            tracks: [],
          },
        ],
      }),
    ).toThrow(/trigger-time-autoplay-unsupported|trigger-time-repeat-unsupported/);
  });
});
