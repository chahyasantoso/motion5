import { describe, expect, it, vi } from "vitest";
import { gsap } from "gsap";
import { createGsapInterpolator } from "../../src/adapters/interpolator/gsap";
import { createGsapScrollSource } from "../../src/adapters/scroll-trigger-gsap";
import type { ScrollSource } from "../../src/adapters/scroll-trigger";
import { createManualClock } from "../../src/ports/clock";
import { Engine, type ProjectHandle } from "../../src/engine";
import type { ProjectDefinition } from "../../src/contract/v5";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import { ALL_NODE_IDS, nodeId } from "../../../../apps/ik-playground/src/ik-playground-project";
import { IK3D_NODE_IDS } from "../../../../apps/ik-playground/src/ik3d-playground-project";
import {
  loadPlayground,
  playgroundProject,
} from "../../../../apps/ik-playground/src/playground-runtime";

function fakeScroll() {
  const listeners = new Set<(progress: number) => void>();
  const source: ScrollSource = {
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
  return {
    source,
    listeners,
    emit(progress: number) {
      for (const listener of [...listeners]) listener(progress);
    },
  };
}

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

/** The progress a ready patch composed at; any other status fails the case where it is read. */
function progressOf(project: ProjectHandle, id: string): number {
  const patch = project.get(id);
  if (patch?.status !== "ready")
    throw new Error(`${id} is ${patch?.status ?? "absent"}, not ready.`);
  return patch.sourceProgress;
}

function flush(scheduler: ReturnType<typeof createFakeScheduler>): void {
  for (let rounds = 0; scheduler.pending.length; rounds++) {
    if (rounds > 20) throw new Error("Scheduler did not settle.");
    scheduler.flush();
  }
}

describe("IK playground runtime loading and scroll progress", () => {
  it("TH-132 loads and mounts the composed runtime answer and disposes after setup failure", () => {
    const scroll = fakeScroll();
    const scheduler = createFakeScheduler();
    const runtime = loadPlayground({
      clock: createManualClock(),
      interpolator: createFakeInterpolator(),
      scheduler,
      scroll: scroll.source,
    });
    expect(playgroundProject.motions).toHaveLength(2);
    expect(
      runtime.project.motionIds().flatMap((id) => runtime.project.motion(id).trackIds),
    ).toEqual([...ALL_NODE_IDS, ...IK3D_NODE_IDS]);
    expect(runtime.project.mountedNodeIds()).toEqual([...ALL_NODE_IDS, ...IK3D_NODE_IDS]);
    expect(scroll.listeners.size).toBe(2);
    runtime.project.dispose();
    expect(scroll.listeners.size).toBe(0);

    const failureScroll = fakeScroll();
    const loadOriginal = Engine.prototype.load;
    const disposed = vi.fn();
    const load = vi.spyOn(Engine.prototype, "load").mockImplementation(function (
      this: Engine,
      project: ProjectDefinition,
    ) {
      const handle = loadOriginal.call(this, project);
      const dispose = handle.dispose;
      handle.dispose = () => {
        disposed();
        dispose();
      };
      handle.mount = () => {
        throw new Error("injected setup failure");
      };
      return handle;
    });
    try {
      expect(() =>
        loadPlayground({
          clock: createManualClock(),
          interpolator: createFakeInterpolator(),
          scheduler: createFakeScheduler(),
          scroll: failureScroll.source,
        }),
      ).toThrow("injected setup failure");
      expect(disposed).toHaveBeenCalledOnce();
      expect(failureScroll.listeners.size).toBe(0);
    } finally {
      load.mockRestore();
    }
  });

  it("publishes restored GSAP source progress and drives both Motions through one scroll source", async () => {
    const scroll = host(0.6, 600);
    const scheduler = createFakeScheduler();
    const runtime = loadPlayground({
      clock: createManualClock(),
      interpolator: createGsapInterpolator(gsap),
      scheduler,
      scroll: scroll.source,
    });
    try {
      expect(scroll.create).toHaveBeenCalledTimes(1);
      await Promise.resolve();
      scheduler.flush();
      expect(progressOf(runtime.project, nodeId("seg-1"))).toBeCloseTo(0.6);
      expect(progressOf(runtime.project, "rig3d/upper")).toBeCloseTo(0.6);
      scroll.refresh(0.25, 600);
      scroll.update(0.25, 600);
      expect(progressOf(runtime.project, nodeId("seg-1"))).toBeCloseTo(0.6);
      scroll.update(0.5, 1000);
      scheduler.flush();
      expect(progressOf(runtime.project, nodeId("seg-1"))).toBeCloseTo(0.5);
      expect(progressOf(runtime.project, "rig3d/upper")).toBeCloseTo(0.5);
    } finally {
      runtime.project.dispose();
    }
    expect(scroll.kill).toHaveBeenCalledTimes(1);
    expect(() => {
      scroll.update(0.5, 500);
      scheduler.flush();
    }).not.toThrow();
  });
});
