import { describe, expect, it } from "vitest";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";

describe("S6 plugin use contract", () => {
  it("rejects the dead TrackDefinition.use field instead of silently ignoring it", () => {
    const interpolator = createFakeInterpolator();
    expect(() =>
      new Engine({
        clock: createManualClock(),
        interpolator,
        scheduler: createFakeScheduler(),
      }).load({
        schemaVersion: 5,
        motions: [
          {
            id: "hero",
            trigger: { type: "manual" },
            tracks: [{ id: "arm", use: "some-plugin", keyframes: {} }],
          },
        ],
      } as never),
    ).toThrow(/plugin-contribution-unsupported-entry|use/);
  });
});
