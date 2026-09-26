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

describe("runtime track addition through ProjectHandle (G2)", () => {
  it("adds a free track and publishes a ready patch on the commit", () => {
    const handle = makeHandle();
    const added = handle.addTrack({ id: "cursor" });
    expect(added.id).toBe("~/cursor");
    // On the commit, not on a following seek. A structural commit seeds its own flush, so the
    // added node is ready through the handle before anything else is asked of it, and the seek
    // that used to carry this patch now publishes nothing because nothing changed.
    // Issue #223, slice A2.
    const patch = handle.get(added.id);
    expect(patch).toBeDefined();
    expect(patch!.status).toBe("ready");
    expect(handle.seek(added.id, 0).patches).toEqual([]);
    handle.dispose();
  });

  it("remove() takes the node out of the graph", () => {
    const handle = makeHandle();
    const added = handle.addTrack({ id: "cursor" });
    added.remove();
    // Seeking a removed node should produce no patch for that node.
    const batch = handle.seek("hero/arm", 0);
    expect(batch.patches.find(({ nodeId }) => nodeId === added.id)).toBeUndefined();
    handle.dispose();
  });

  it("rejects a track with malformed keyframes", () => {
    const handle = makeHandle();
    const bad = {
      id: "bad",
      keyframes: {
        transform: {
          values: {
            x: [
              { p: Number.NaN, v: 0 },
              { p: 0.5, v: 1 },
            ],
          },
        },
      },
    };
    expect(() => handle.addTrack(bad)).toThrow(/stop-position/);
    handle.dispose();
  });

  it("adds a track into an existing motion and receives motion signals", () => {
    const scheduler = createFakeScheduler();
    const handle = new Engine({
      clock: createManualClock(),
      interpolator: createFakeInterpolator(),
      scheduler,
    }).load(project);
    const added = handle.addTrack(
      {
        id: "leg",
        keyframes: {
          transform: {
            values: {
              x: [
                { p: 0, v: 0 },
                { p: 1, v: 100 },
              ],
            },
          },
        },
      },
      { motionId: "hero" },
    );
    expect(added.id).toBe("hero/leg");

    let latestPatch: any;
    handle.subscribeNode("hero/leg", (patch) => {
      latestPatch = patch;
    });

    handle.signal("hero", { type: "manual", progress: 0.5 });
    scheduler.flush();

    expect(latestPatch).toBeDefined();
    expect(latestPatch.nodeId).toBe("hero/leg");
    expect(latestPatch.values).toEqual({ x: 50 });

    added.remove();
    const batch = handle.seek("hero/arm", 0);
    expect(batch.patches.find(({ nodeId }) => nodeId === "hero/leg")).toBeUndefined();
    handle.dispose();
  });
});
