import { describe, expect, it } from "vitest";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import type { Patch } from "../../src/runtime/patch-registry";

const armTrack = {
  id: "arm",
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

describe("add -> remove -> re-add lifecycle on the wire (D1)", () => {
  it("tells subscribers the node was destroyed and reaches them again after re-addition", () => {
    const { handle, scheduler } = makeHandle();
    const seen: Patch[] = [];

    const added = handle.addTrack(armTrack, { motionId: "walk" });
    handle.subscribeNode(added.id, (patch) => seen.push(patch));

    handle.signal("walk", { type: "manual", progress: 0.45 });
    scheduler.flush();
    expect(seen.at(-1)?.status).toBe("ready");
    const composed = seen.at(-1);
    if (composed?.status !== "ready")
      throw new Error(`${added.id} is ${composed?.status ?? "absent"}, not ready.`);
    expect(composed.values).toEqual({ x: 45 });

    // Destruction must be an event, not a silent deletion. This is the exact moment the demo
    // rig used to freeze: the graph dropped the node while the renderer kept its last pose.
    added.remove();
    expect(seen.at(-1)?.status).toBe("destroyed");
    const terminal = seen.at(-1);
    if (terminal?.status !== "destroyed")
      throw new Error(`${added.id} is ${terminal?.status ?? "absent"}, not destroyed.`);
    // Re-read rather than adjusted: the terminal patch carried four empty members, and asserting
    // the pose had been emptied was how this case said the renderer must stop drawing it. A
    // destroyed patch owns no payload at all since ADR-098, so the claim is the member's absence.
    expect("values" in terminal).toBe(false);
    expect(handle.get(added.id)).toBeUndefined();

    // Driving the motion backwards must not resurrect the destroyed node.
    handle.signal("walk", { type: "manual", progress: 0.2 });
    scheduler.flush();
    expect(handle.get(added.id)).toBeUndefined();
    expect(seen.at(-1)?.status).toBe("destroyed");

    // Re-addition has to reach the subscriber that survived the eviction.
    const readded = handle.addTrack(armTrack, { motionId: "walk" });
    expect(readded.id).toBe(added.id);
    handle.signal("walk", { type: "manual", progress: 0.6 });
    scheduler.flush();
    expect(seen.at(-1)?.status).toBe("ready");
    const recomposed = seen.at(-1);
    if (recomposed?.status !== "ready")
      throw new Error(`${added.id} is ${recomposed?.status ?? "absent"}, not ready.`);
    expect(recomposed.values).toEqual({ x: 60 });

    handle.dispose();
  });
});
