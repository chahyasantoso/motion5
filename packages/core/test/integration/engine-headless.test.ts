import { describe, expect, it, vi } from "vitest";
import type { FlatRecord, ProjectDefinition, Table, Value } from "../../src/contract/v5";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";

function isTable(value: Value): value is Table {
  return Array.isArray(value);
}
function recordOf(value: Value | undefined): FlatRecord {
  if (value === undefined || isTable(value)) throw new Error("Expected a record pose.");
  return value;
}

const project: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    {
      id: "hero",
      trigger: { type: "manual" },
      tracks: [
        {
          id: "arm",
          input: {
            values: {
              opacity: [
                { p: 0, v: 0.2 },
                { p: 1, v: 1 },
              ],
            },
          },
        },
      ],
    },
  ],
  freeTracks: [{ id: "cursor" }],
};

describe("Engine", () => {
  it("publishes a progress change through the public project handle", () => {
    const runtime = new Engine({
      clock: createManualClock(),
      interpolator: createFakeInterpolator(),
      scheduler: createFakeScheduler(),
    }).load(project);
    runtime.mount("hero/arm");
    let published: FlatRecord | undefined;
    runtime.subscribeNode("hero/arm", (patch) => {
      // Only a ready patch carries the pose this case reads, and the structural type it is held in
      // says so, so the narrowing happens where the patch arrives. See ADR-098.
      if (patch.status !== "ready") return;
      published = recordOf(patch.outputs.values);
    });
    const batch = runtime.seek("hero/arm", 0.5);
    const heroArmPatch = batch.patches.find(({ nodeId }) => nodeId === "hero/arm");
    if (heroArmPatch?.status !== "ready")
      throw new Error(`hero/arm is ${heroArmPatch?.status ?? "absent"}, not ready.`);
    expect(recordOf(heroArmPatch.outputs.values).opacity).toBeCloseTo(0.6, 12);
    expect(published?.opacity).toBeCloseTo(0.6, 12);
    runtime.dispose();
  });

  it("keeps one clock owner while clock progress publishes once", () => {
    const clock = createManualClock();
    const subscribe = vi.spyOn(clock, "subscribe");
    const runtime = new Engine({
      clock,
      interpolator: createFakeInterpolator(),
      scheduler: createFakeScheduler(),
    }).load(project);
    runtime.mount("hero/arm");
    runtime.seek("hero/arm", 0.25);
    expect(subscribe).toHaveBeenCalledTimes(1);
    runtime.dispose();
  });

  it("routes a manual trigger through the public handle into a published patch", () => {
    const scheduler = createFakeScheduler();
    const runtime = new Engine({
      clock: createManualClock(),
      interpolator: createFakeInterpolator(),
      scheduler,
    }).load(project);
    runtime.mount("hero/arm");
    let opacity = 0;
    runtime.subscribeNode("hero/arm", (patch) => {
      // A subscriber records what was published, and a patch owning no pose has nothing to record.
      if (patch.status !== "ready") return;
      opacity = Number(recordOf(patch.outputs.values).opacity);
    });

    runtime.signal("hero", { type: "manual", progress: 0.75 });
    expect(opacity).toBe(0);
    scheduler.flush();
    expect(opacity).toBeCloseTo(0.8, 12);

    expect(() => runtime.signal("hero", { type: "manual", progress: 1.5 })).toThrow(
      "between 0 and 1",
    );
    runtime.dispose();
  });
});
