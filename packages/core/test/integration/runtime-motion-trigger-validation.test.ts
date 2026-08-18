import { describe, expect, it } from "vitest";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/ports/fakes";

function makeRuntime() {
  return new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
  }).load({ schemaVersion: 5, motions: [] });
}

describe("runtime Motion trigger validation", () => {
  it("uses the load-time diagnostic and leaves the id available for retry", () => {
    const handle = makeRuntime();

    expect(() => handle.addMotion({ id: "scene", trigger: { type: "time" }, tracks: [] })).toThrow(
      /trigger-time-duration/,
    );

    expect(() =>
      handle.addMotion({ id: "scene", trigger: { type: "time", duration: 1000 }, tracks: [] }),
    ).not.toThrow();

    handle.destroyMotion("scene");
    handle.dispose();
  });
});
