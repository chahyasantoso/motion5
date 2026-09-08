import { describe, expect, it, vi } from "vitest";
import { gsap } from "gsap";
import {
  bindScrollReach,
  createScrollReach,
} from "../../../../apps/ik-playground/src/scroll-reach";
import { createGsapInterpolator } from "../../src/adapters/interpolator/gsap";
import {
  ALL_NODE_IDS,
  ARM,
  MOTION_ID,
  ikPlaygroundProject,
  nodeId,
} from "../../../../apps/ik-playground/src/ik-playground-project";
import { Engine } from "../../src/engine";
import { PluginRegistry } from "../../src/domain/plugins";
import { fkPlugin } from "../../src/plugins/fk";
import { lerpAngle } from "../../src/plugins/frame";
import { ikPlugin } from "../../src/plugins/ik";
import { transformPlugin } from "../../src/plugins/transform";
import { createManualClock } from "../../src/ports/clock";
import { createFakeScheduler } from "../../src/testing/fakes";
import { createTriggerFactory } from "../../src/adapters/trigger-factory/default";
import { createGsapScrollSource } from "../../src/adapters/scroll-trigger-gsap";

function host(initialProgress = 0, initialPosition = 0) {
  let vars: Record<string, unknown> = {};
  let position = initialPosition;
  const kill = vi.fn();
  const instance = { progress: initialProgress, scroll: () => position, kill };
  const create = vi.fn((options: Record<string, unknown>) => {
    vars = options;
    return instance;
  });
  const source = createGsapScrollSource(
    { create },
    { trigger: "#scroll-demo", start: "top top", end: "bottom bottom" },
  );
  return {
    source,
    create,
    kill,
    update(progress: number, y: number) {
      instance.progress = progress;
      position = y;
      (vars.onUpdate as (self: typeof instance) => void)(instance);
    },
    refresh(progress: number, y: number) {
      (vars.onRefreshInit as (() => void) | undefined)?.();
      instance.progress = progress;
      position = y;
      (vars.onUpdate as (self: typeof instance) => void)(instance);
      (vars.onRefresh as ((self: typeof instance) => void) | undefined)?.(instance);
    },
  };
}

describe("IK playground adapter-driven progress", () => {
  it("publishes a restored source position after driver subscription and cancels detached initialization", async () => {
    const scroll = host(0.6, 600);
    const seen = vi.fn();
    const unsubscribe = scroll.source.subscribe(seen);
    expect(seen).not.toHaveBeenCalled();
    await Promise.resolve();
    expect(seen).toHaveBeenCalledExactlyOnceWith(0.6);
    unsubscribe();
    expect(scroll.kill).toHaveBeenCalledTimes(1);
    const detached = vi.fn();
    const detach = scroll.source.subscribe(detached);
    detach();
    await Promise.resolve();
    expect(detached).not.toHaveBeenCalled();
    expect(scroll.kill).toHaveBeenCalledTimes(2);
  });

  it("holds refresh-only and unchanged-position updates until the next actual scroll", async () => {
    const scroll = host(0.5, 500);
    const seen = vi.fn();
    const unsubscribe = scroll.source.subscribe(seen);
    await Promise.resolve();
    seen.mockClear();
    scroll.refresh(0.25, 500);
    scroll.update(0.25, 500);
    expect(seen).not.toHaveBeenCalled();
    scroll.update(0.5, 1000);
    expect(seen).toHaveBeenCalledExactlyOnceWith(0.5);
    unsubscribe();
  });

  it("drives authored FK weights through the scroll driver and Motion scheduler, never a manual signal", async () => {
    const scroll = host();
    const plugins = new PluginRegistry();
    for (const plugin of [transformPlugin, fkPlugin, ikPlugin]) plugins.register(plugin);
    const scheduler = createFakeScheduler();
    const clock = createManualClock();
    let controller: ReturnType<typeof createScrollReach>;
    const handle = new Engine({
      clock,
      scheduler,
      plugins,
      // Only the browser producer and scheduler are controlled; interpolation is real GSAP.
      interpolator: createGsapInterpolator(gsap),
      triggerFactory: createTriggerFactory({
        scroll: () => bindScrollReach(scroll.source, () => controller.commit()),
      }),
    }).load(ikPlaygroundProject);
    controller = createScrollReach(handle);
    try {
      for (const id of ALL_NODE_IDS) handle.mount(id);
      expect(scroll.create).toHaveBeenCalledTimes(1);
      await Promise.resolve();
      scheduler.flush();
      const id = nodeId(ARM.memberTracks[0]!);
      const rest = handle.get(id);
      expect(rest?.status).toBe("ready");
      scroll.update(0.5, 500);
      expect(handle.get(id)).toBe(rest);
      scheduler.flush();
      expect(handle.get(id)?.sourceProgress).toBeCloseTo(0.5);
      // FK publishes a world frame, not its private weight input. Measure the actual blend.
      const rotations = handle.get(nodeId(ARM.solverTrack))!.values.rotations as Readonly<
        Record<string, number>
      >;
      expect(handle.get(id)?.values.rotation).toBeCloseTo(
        lerpAngle(ARM.restRotations[0]!, rotations[id]!, 0.5),
      );
      const held = handle.get(id);
      const appliedGoal = handle.get(nodeId(ARM.goalTrack));
      controller.moveGoal(ARM.goalTrack, 290, 360);
      controller.flip(ARM.solverTrack, true);
      clock.tick(1000);
      scheduler.flush();
      scroll.refresh(0.25, 500);
      scroll.update(0.25, 500);
      scheduler.flush();
      expect(handle.get(id)).toBe(held);
      expect(handle.get(nodeId(ARM.goalTrack))).toBe(appliedGoal);
      scroll.update(1, 1000);
      scheduler.flush();
      expect(handle.get(id)?.sourceProgress).toBe(1);
      expect(handle.get(nodeId(ARM.goalTrack))?.values).toMatchObject({ x: 290, y: 360 });
      expect(handle.get(nodeId(ARM.solverTrack))?.values.flip).toBe(true);
      const full = handle.get(id);
      controller.moveGoal(ARM.goalTrack, 310, 380);
      controller.flip(ARM.solverTrack, false);
      clock.tick(2000);
      scheduler.flush();
      expect(handle.get(id)).toBe(full);
      scroll.update(0.75, 750);
      scheduler.flush();
      expect(handle.get(nodeId(ARM.goalTrack))?.values).toMatchObject({ x: 310, y: 380 });
      expect(handle.get(nodeId(ARM.solverTrack))?.values.flip).toBe(false);
      expect(() => handle.signal(MOTION_ID, { type: "manual", progress: 1 })).toThrow(
        "does not accept external signals",
      );
      scroll.update(0, 0);
      scheduler.flush();
      expect(handle.get(id)?.values).toEqual(rest?.values);
    } finally {
      handle.dispose();
    }
    expect(scroll.kill).toHaveBeenCalledTimes(1);
    expect(() => {
      scroll.update(0.5, 500);
      scheduler.flush();
    }).not.toThrow();
  });
});
