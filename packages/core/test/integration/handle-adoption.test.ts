import { describe, expect, it } from "vitest";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";

const project = {
  schemaVersion: 5 as const,
  motions: [{ id: "hero", trigger: { type: "manual" as const }, tracks: [{ id: "arm" }] }],
};

function makeHandle() {
  return new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
  }).load(project);
}

describe("adoption through ProjectHandle (G2)", () => {
  it("adopts a free track and publishes a ready patch via seek", () => {
    const handle = makeHandle();
    const owner = {};
    const adopted = handle.adopt({ id: "cursor" }, owner);
    expect(adopted.id).toBe("~/cursor");
    const batch = handle.seek(adopted.id, 0);
    const patch = batch.patches.find(({ nodeId }) => nodeId === adopted.id);
    expect(patch).toBeDefined();
    expect(patch!.status).toBe("ready");
    handle.dispose();
  });

  it("destroyAdopted removes the node from the graph", () => {
    const handle = makeHandle();
    const owner = {};
    const adopted = handle.adopt({ id: "cursor" }, owner);
    handle.destroyAdopted(adopted.id, owner);
    // Seeking a destroyed node should produce no patch for that node.
    const batch = handle.seek("hero/arm", 0);
    expect(batch.patches.find(({ nodeId }) => nodeId === adopted.id)).toBeUndefined();
    handle.dispose();
  });

  it("rejects adoption of a track with malformed keyframes", () => {
    const handle = makeHandle();
    const owner = {};
    const bad = {
      id: "bad",
      keyframes: {
        x: {
          stops: [
            { p: Number.NaN, v: 0 },
            { p: 0.5, v: 1 },
          ],
        },
      },
    };
    expect(() => handle.adopt(bad, owner)).toThrow(/stop-position/);
    handle.dispose();
  });

  it("adopts a track into an existing motion and receives motion signals", () => {
    const scheduler = createFakeScheduler();
    const handle = new Engine({
      clock: createManualClock(),
      interpolator: createFakeInterpolator(),
      scheduler,
    }).load(project);
    const owner = {};
    const adopted = handle.adopt(
      {
        id: "leg",
        keyframes: {
          x: {
            stops: [
              { p: 0, v: 0 },
              { p: 1, v: 100 },
            ],
          },
        },
      },
      owner,
      { motionId: "hero" },
    );
    expect(adopted.id).toBe("hero/leg");

    let latestPatch: any;
    handle.subscribe("hero/leg", (patch) => {
      latestPatch = patch;
    });

    handle.signal("hero", { type: "manual", progress: 0.5 });
    scheduler.flush();

    expect(latestPatch).toBeDefined();
    expect(latestPatch.nodeId).toBe("hero/leg");
    expect(latestPatch.values).toEqual({ x: 50 });

    handle.destroyAdopted(adopted.id, owner);
    const batch = handle.seek("hero/arm", 0);
    expect(batch.patches.find(({ nodeId }) => nodeId === "hero/leg")).toBeUndefined();
    handle.dispose();
  });
});
