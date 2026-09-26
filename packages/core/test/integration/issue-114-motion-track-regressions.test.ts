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
function load(project: ProjectDefinition) {
  const clock = createManualClock();
  const scheduler = createFakeScheduler();
  const handle = new Engine({ clock, interpolator: createFakeInterpolator(), scheduler }).load(
    project,
  );
  return { clock, scheduler, handle };
}
const baseProject = (tracks: readonly TrackDefinition[], stagger = 0): ProjectDefinition => ({
  schemaVersion: 5,
  motions: [{ id: "scene", trigger: { type: "manual" }, ...(stagger ? { stagger } : {}), tracks }],
});
function flushReplacement(
  clock: ReturnType<typeof createManualClock>,
  scheduler: ReturnType<typeof createFakeScheduler>,
) {
  // Replacement seeds the new compiled Track immediately; the graph publication is still clock/scheduler-driven.
  clock.tick(0);
  scheduler.flush();
}

describe("issue 114: Motion-owned Track replacement", () => {
  it("does not drive the disposed Track after direct replacement", () => {
    const { clock, scheduler, handle } = load(baseProject([track("arm", 0, 100)]));
    handle.mount("scene/arm");
    handle.signal("scene", { type: "manual", progress: 0.5 });
    scheduler.flush();
    handle.track("scene/arm").replace(track("arm", 0, 250));

    expect(() => {
      clock.tick(16);
      scheduler.flush();
    }).not.toThrow(/Track is disposed/);
    const sceneArmPatch = handle.get("scene/arm");
    if (sceneArmPatch?.status !== "ready")
      throw new Error(`scene/arm is ${sceneArmPatch?.status ?? "absent"}, not ready.`);
    expect(sceneArmPatch.values).toEqual({ x: 250 });
    handle.dispose();
  });

  it("preserves current progress when replacing", () => {
    const { clock, scheduler, handle } = load(baseProject([track("arm", 0, 100)]));
    handle.mount("scene/arm");
    handle.signal("scene", { type: "manual", progress: 0.5 });
    scheduler.flush();
    handle.track("scene/arm").replace(track("arm", 0, 200));
    flushReplacement(clock, scheduler);

    const sceneArmPatch2 = handle.get("scene/arm");
    if (sceneArmPatch2?.status !== "ready")
      throw new Error(`scene/arm is ${sceneArmPatch2?.status ?? "absent"}, not ready.`);
    expect(sceneArmPatch2.values).toEqual({ x: 100 });
    handle.dispose();
  });

  it("preserves the original array index and stagger timing", () => {
    const project = baseProject(
      [track("first", 0, 100), track("second", 0, 100), track("third", 0, 100)],
      100,
    );
    const { clock, scheduler, handle } = load(project);
    for (const id of ["scene/first", "scene/second", "scene/third"]) handle.mount(id);
    handle.signal("scene", { type: "manual", progress: 1 });
    scheduler.flush();
    handle.track("scene/first").replace(track("first", 0, 200));
    flushReplacement(clock, scheduler);

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

  it("keeps sibling progress healthy after replacement", () => {
    const { scheduler, handle } = load(
      baseProject([track("first", 0, 100), track("second", 0, 200)]),
    );
    handle.mount("scene/first");
    handle.mount("scene/second");
    handle.signal("scene", { type: "manual", progress: 0.25 });
    scheduler.flush();
    handle.track("scene/first").replace(track("first", 0, 400));
    handle.signal("scene", { type: "manual", progress: 0.5 });
    scheduler.flush();

    const sceneFirstPatch2 = handle.get("scene/first");
    if (sceneFirstPatch2?.status !== "ready")
      throw new Error(`scene/first is ${sceneFirstPatch2?.status ?? "absent"}, not ready.`);
    expect(sceneFirstPatch2.values).toEqual({ x: 200 });
    const sceneSecondPatch2 = handle.get("scene/second");
    if (sceneSecondPatch2?.status !== "ready")
      throw new Error(`scene/second is ${sceneSecondPatch2?.status ?? "absent"}, not ready.`);
    expect(sceneSecondPatch2.values).toEqual({ x: 100 });
    handle.dispose();
  });

  it("keeps the observation replacement path live", () => {
    const { scheduler, handle } = load(baseProject([track("arm", 0, 100), track("label", 0, 50)]));
    handle.mount("scene/arm");
    handle.mount("scene/label");
    const label = handle.track("scene/label");
    label.addObserve({ source: "scene/arm" });
    label.removeObserve({ source: "scene/arm" });

    expect(() => {
      handle.signal("scene", { type: "manual", progress: 0.5 });
      scheduler.flush();
    }).not.toThrow(/Track is disposed/);
    handle.dispose();
  });
});
