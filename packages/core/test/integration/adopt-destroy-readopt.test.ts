import { describe, expect, it } from "vitest";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/ports/fakes";
import type { Patch } from "../../src/runtime/patch-registry";

const armTrack = {
  id: "arm",
  keyframes: {
    x: {
      stops: [
        { p: 0, v: 0 },
        { p: 1, v: 100 },
      ],
    },
  },
};

const project = {
  schemaVersion: 5 as const,
  motions: [{ id: "walk", trigger: { type: "manual" as const }, tracks: [{ id: "pelvis" }] }],
};

function makeHandle() {
  const scheduler = createFakeScheduler();
  const handle = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler,
  }).load(project);
  return { handle, scheduler };
}

describe("adopt -> destroy -> re-adopt lifecycle on the wire (D1)", () => {
  it("tells subscribers the node was destroyed and reaches them again after re-adoption", () => {
    const { handle, scheduler } = makeHandle();
    const owner = {};
    const seen: Patch[] = [];

    const adopted = handle.adopt(armTrack, owner, { motionId: "walk" });
    handle.subscribe(adopted.id, (patch) => seen.push(patch));

    handle.signal("walk", { type: "manual", progress: 0.45 });
    scheduler.flush();
    expect(seen.at(-1)?.status).toBe("ready");
    expect(seen.at(-1)?.values).toEqual({ x: 45 });

    // Destruction must be an event, not a silent deletion. This is the exact moment the demo
    // rig used to freeze: the graph dropped the node while the renderer kept its last pose.
    handle.destroyAdopted(adopted.id, owner);
    expect(seen.at(-1)?.status).toBe("destroyed");
    expect(seen.at(-1)?.values).toEqual({});
    expect(handle.get(adopted.id)).toBeUndefined();

    // Driving the motion backwards must not resurrect the destroyed node.
    handle.signal("walk", { type: "manual", progress: 0.2 });
    scheduler.flush();
    expect(handle.get(adopted.id)).toBeUndefined();
    expect(seen.at(-1)?.status).toBe("destroyed");

    // Re-adoption has to reach the subscriber that survived the eviction.
    const readopted = handle.adopt(armTrack, owner, { motionId: "walk" });
    expect(readopted.id).toBe(adopted.id);
    handle.signal("walk", { type: "manual", progress: 0.6 });
    scheduler.flush();
    expect(seen.at(-1)?.status).toBe("ready");
    expect(seen.at(-1)?.values).toEqual({ x: 60 });

    handle.dispose();
  });
});
