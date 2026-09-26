import { describe, expect, it } from "vitest";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import type { ProjectDefinition, TrackDefinition } from "../../src/contract/v5";

function ramp(from: number, to: number) {
  return [
    { p: 0, v: from },
    { p: 1, v: to },
  ];
}
function track(id: string, from: number, to: number, duration?: number): TrackDefinition {
  return {
    id,
    ...(duration === undefined ? {} : { duration }),
    keyframes: { transform: { values: { x: ramp(from, to) } } },
  };
}

describe("motion-owned Track replacement", () => {
  it("re-registers the compiled Track without throwing on the next Motion update", () => {
    const clock = createManualClock();
    const scheduler = createFakeScheduler();
    const handle = new Engine({
      clock,
      interpolator: createFakeInterpolator(),
      scheduler,
    }).load({
      schemaVersion: 5,
      motions: [{ id: "scene", trigger: { type: "manual" }, tracks: [track("arm", 0, 100)] }],
    });
    handle.mount("scene/arm");
    handle.signal("scene", { type: "manual", progress: 0.5 });
    scheduler.flush();

    handle.track("scene/arm").replace(track("arm", 0, 250));

    expect(() => {
      clock.tick(0);
      scheduler.flush();
    }).not.toThrow();
    const sceneArmPatch = handle.get("scene/arm");
    if (sceneArmPatch?.status !== "ready")
      throw new Error(`scene/arm is ${sceneArmPatch?.status ?? "absent"}, not ready.`);
    expect(sceneArmPatch.values).toEqual({ x: 125 });

    handle.dispose();
  });

  it("preserves the replaced Track index and stagger timing", () => {
    const clock = createManualClock();
    const scheduler = createFakeScheduler();
    const project: ProjectDefinition = {
      schemaVersion: 5,
      motions: [
        {
          id: "scene",
          trigger: { type: "manual" },
          stagger: 100,
          tracks: [track("first", 0, 100), track("second", 0, 100), track("third", 0, 100)],
        },
      ],
    };
    const handle = new Engine({
      clock,
      interpolator: createFakeInterpolator(),
      scheduler,
    }).load(project);
    handle.mount("scene/first");
    handle.mount("scene/second");
    handle.mount("scene/third");
    handle.signal("scene", { type: "manual", progress: 1 });
    scheduler.flush();

    handle.track("scene/first").replace(track("first", 0, 200));

    expect(() => {
      clock.tick(0);
      scheduler.flush();
    }).not.toThrow();
    const sceneFirstPatch = handle.get("scene/first");
    if (sceneFirstPatch?.status !== "ready")
      throw new Error(`scene/first is ${sceneFirstPatch?.status ?? "absent"}, not ready.`);
    expect(sceneFirstPatch.values).toEqual({ x: 200 });
    const sceneSecondPatch = handle.get("scene/second");
    if (sceneSecondPatch?.status !== "ready")
      throw new Error(`scene/second is ${sceneSecondPatch?.status ?? "absent"}, not ready.`);
    expect(sceneSecondPatch.values).toEqual({ x: 0 });
    const sceneThirdPatch = handle.get("scene/third");
    if (sceneThirdPatch?.status !== "ready")
      throw new Error(`scene/third is ${sceneThirdPatch?.status ?? "absent"}, not ready.`);
    expect(sceneThirdPatch.values).toEqual({ x: 0 });

    handle.dispose();
  });

  it("updates a Motion-owned Track through observation mutations", () => {
    const clock = createManualClock();
    const scheduler = createFakeScheduler();
    const handle = new Engine({
      clock,
      interpolator: createFakeInterpolator(),
      scheduler,
    }).load({
      schemaVersion: 5,
      motions: [
        {
          id: "scene",
          trigger: { type: "manual" },
          tracks: [track("arm", 0, 100), track("label", 0, 50)],
        },
      ],
    });
    handle.mount("scene/arm");
    handle.mount("scene/label");
    handle.track("scene/label").addObserve({ source: "scene/arm" });

    expect(() => {
      handle.signal("scene", { type: "manual", progress: 0.5 });
      scheduler.flush();
    }).not.toThrow();

    handle.dispose();
  });
});
