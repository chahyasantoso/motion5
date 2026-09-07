import { describe, expect, it, vi } from "vitest";
import { Engine } from "../../../src/engine";
import type { ProjectDefinition } from "../../../src/contract/v5";
import type { MotionHandle } from "../../../src/contract/motion-handle";
import type { TrackHandle } from "../../../src/contract/track-handle";
import { createDefaultTriggerFactory } from "../../../src/adapters/trigger-factory/default";
import { createManualClock } from "../../../src/ports/clock";
import type { Interpolator } from "../../../src/ports/interpolator";
import type { Scheduler } from "../../../src/ports/scheduler";
import type { CreatedTrigger, TriggerFactory } from "../../../src/ports/trigger-factory";
import type { ProjectRuntime } from "../../../src/runtime/project-runtime";

// Real Engine, Motion, Track and graph; only the host ports are controlled.
const animated = (id: string) => ({
  id,
  duration: 1000,
  keyframes: { x: { "0%": 0, "100%": 100 } },
});
const project = (withTracks = true): ProjectDefinition => ({
  schemaVersion: 5,
  motions: [
    {
      id: "hero",
      trigger: { type: "manual" },
      tracks: withTracks ? [animated("arm"), animated("leg")] : [],
    },
  ],
});
function rig(definition = project(), triggerFactory?: TriggerFactory) {
  const clock = createManualClock();
  const jobs = new Set<() => void>();
  const scheduler: Scheduler = {
    schedule(job) {
      jobs.add(job);
      return {
        cancel() {
          jobs.delete(job);
        },
      };
    },
  };
  const kills: ReturnType<typeof vi.fn>[] = [];
  const interpolator: Interpolator = {
    create() {
      let position = 0;
      const kill = vi.fn();
      kills.push(kill);
      return {
        duration: 1000,
        get state() {
          return { x: position * 100 };
        },
        progress(value?: number) {
          if (value !== undefined) position = value;
          return position;
        },
        kill,
      };
    },
  };
  const handle = new Engine({ clock, scheduler, interpolator, triggerFactory }).load(definition);
  const runtime = (handle as typeof handle & { readonly _runtime: ProjectRuntime })._runtime;
  const flush = () => {
    for (let rounds = 0; jobs.size; rounds++) {
      if (rounds > 20) throw new Error("Scheduler did not settle.");
      const batch = [...jobs];
      jobs.clear();
      for (const job of batch) job();
    }
  };
  return { handle, runtime, clock, flush, kills };
}
function drivers(options: { cleanup?: unknown; refuse?: "create" | "subscribe" } = {}) {
  const base = createDefaultTriggerFactory();
  const created: { trigger: CreatedTrigger; dispose: ReturnType<typeof vi.fn> }[] = [];
  const failure = new Error("Replacement refused.");
  const factory: TriggerFactory = {
    create(context) {
      if (context.trigger.type === "time" && options.refuse === "create") throw failure;
      const trigger = base.create(context);
      const index = created.length;
      const dispose = vi.fn(() => {
        trigger.dispose();
        if (index === 0 && Object.hasOwn(options, "cleanup")) throw options.cleanup;
      });
      created.push({ trigger, dispose });
      return {
        ...trigger,
        port:
          context.trigger.type === "time" && options.refuse === "subscribe"
            ? {
                subscribe() {
                  throw failure;
                },
              }
            : trigger.port,
        dispose,
      };
    },
  };
  return { factory, created, failure };
}
function caught(operation: () => void): unknown {
  try {
    operation();
  } catch (error) {
    return error;
  }
  return "did not throw";
}

describe("Engine motion edits preserve accepted state and entity lifetimes", () => {
  it.each([new Error("Old driver cleanup failed."), undefined])(
    "retains an installed trigger when cleanup throws %s",
    (failure) => {
      const host = drivers({ cleanup: failure });
      const test = rig(project(), host.factory);
      const motion = test.handle.motion("hero");
      test.handle.mount("hero/arm");
      expect(caught(() => motion.setTrigger({ type: "time", duration: 1000 }))).toBe(failure);
      expect(motion.definition.trigger).toEqual({ type: "time", duration: 1000 });
      expect(() => test.handle.signal("hero", { progress: 0.5 })).toThrow(
        /configured trigger driver/,
      );
      test.clock.tick(250);
      test.flush();
      expect(test.handle.get("hero/arm")?.sourceProgress).toBeCloseTo(0.25);
      motion.setTrigger({ type: "manual" });
      expect(host.created).toHaveLength(3);
      expect(() => test.handle.signal("hero", { progress: 0.5 })).not.toThrow();
      test.flush();
      test.handle.dispose();
      for (const entry of host.created) expect(entry.dispose).toHaveBeenCalledTimes(1);
    },
  );

  it.each(["create", "subscribe"] as const)(
    "preserves the old driver when replacement %s refuses",
    (refuse) => {
      const host = drivers({ refuse });
      const test = rig(project(), host.factory);
      test.handle.mount("hero/arm");
      expect(
        caught(() => test.handle.motion("hero").setTrigger({ type: "time", duration: 1000 })),
      ).toBe(host.failure);
      expect(test.handle.motion("hero").definition.trigger).toEqual({ type: "manual" });
      expect(() => test.handle.signal("hero", { progress: 0.4 })).not.toThrow();
      test.flush();
      expect(test.handle.get("hero/arm")?.sourceProgress).toBeCloseTo(0.4);
      expect(host.created[0]!.dispose).not.toHaveBeenCalled();
      test.handle.dispose();
      for (const entry of host.created) expect(entry.dispose).toHaveBeenCalledTimes(1);
    },
  );

  it("publishes changed and cleared stagger only after definition adoption without graph work", () => {
    const test = rig();
    for (const id of ["hero/arm", "hero/leg"]) test.handle.mount(id);
    test.handle.signal("hero", { progress: 0.75 });
    test.flush();
    const motion = test.handle.motion("hero");
    const replace = vi.spyOn(test.runtime.graph, "replaceGraph");
    const invalidate = vi.spyOn(test.runtime.graph, "invalidate");
    const seen: (number | undefined)[] = [];
    const reentrant: unknown[] = [];
    test.handle.subscribe("hero/leg", () => {
      seen.push(motion.definition.stagger);
      reentrant.push(caught(() => motion.setStagger(10)));
    });
    expect(() => motion.setStagger(250)).not.toThrow();
    test.flush();
    expect(test.handle.get("hero/arm")?.sourceProgress).toBeCloseTo(0.75);
    expect(test.handle.get("hero/leg")?.sourceProgress).toBeCloseTo(0.5);
    expect(seen).toEqual([250]);
    expect(String(reentrant[0])).toContain("schema-commit-reentrant");
    motion.setStagger();
    test.flush();
    expect(test.handle.get("hero/leg")?.sourceProgress).toBeCloseTo(0.75);
    expect(seen).toEqual([250, undefined]);
    expect(motion.definition).not.toHaveProperty("stagger");
    expect(invalidate).toHaveBeenCalledTimes(2);
    expect(replace).not.toHaveBeenCalled();
    expect(test.kills.every((kill) => kill.mock.calls.length === 0)).toBe(true);
    test.handle.dispose();
  });

  it("refuses invalid stagger and skips unchanged stagger without publication", () => {
    const test = rig();
    const motion = test.handle.motion("hero");
    const invalidate = vi.spyOn(test.runtime.graph, "invalidate");
    for (const value of [-1, NaN, Infinity])
      expect(() => motion.setStagger(value)).toThrow(/finite non-negative/);
    motion.setStagger();
    expect(motion.definition).not.toHaveProperty("stagger");
    expect(invalidate).not.toHaveBeenCalled();
    test.handle.dispose();
  });

  it.each([{ type: "time", duration: 1000 }, { type: "manual" }] as const)(
    "atomically refuses same-ID motion recreation with trigger %s",
    (trigger) => {
      const host = drivers();
      const test = rig(project(false), host.factory);
      const old = test.handle.motion("hero");
      let replacement: MotionHandle | undefined;
      const graph = test.runtime.graph.graph;
      expect(() =>
        test.handle.edit((tx) => {
          tx.addTrack(animated("sibling"));
          tx.motion("hero").destroy();
          replacement = tx.addMotion({ id: "hero", trigger, stagger: 250, tracks: [] });
        }),
      ).toThrow(/schema-transaction-recreated/);
      expect(old.live).toBe(true);
      expect(replacement?.live).toBe(false);
      expect(old.definition.trigger).toEqual({ type: "manual" });
      expect(old.definition).not.toHaveProperty("stagger");
      expect(test.handle.tryTrack("~/sibling")).toBeUndefined();
      expect(test.runtime.graph.graph).toBe(graph);
      expect(test.kills).toHaveLength(0);
      expect(host.created).toHaveLength(1);
      expect(host.created[0]!.dispose).not.toHaveBeenCalled();
      expect(() => test.handle.signal("hero", { progress: 0.5 })).not.toThrow();
      test.flush();
      test.handle.dispose();
      expect(host.created[0]!.dispose).toHaveBeenCalledTimes(1);
    },
  );

  it.each([false, true])("atomically refuses track lifetime reuse, motion-owned=%s", (owned) => {
    const definition: ProjectDefinition = owned
      ? project()
      : { schemaVersion: 5, motions: [], freeTracks: [animated("arm")] };
    const test = rig(definition);
    const id = owned ? "hero/arm" : "~/arm";
    const old = test.handle.track(id);
    const retained = old.definition;
    const instance = test.handle.mount(id);
    test.handle.seek(id, 0.6);
    test.flush();
    const before = test.handle.get(id);
    let replacement: TrackHandle | undefined;
    expect(() =>
      test.handle.edit((tx) => {
        tx.track(id).remove();
        replacement = tx.addTrack(retained, owned ? { motionId: "hero" } : undefined);
      }),
    ).toThrow(/schema-transaction-recreated/);
    expect(old.live).toBe(true);
    expect(replacement?.live).toBe(false);
    expect(old.definition).toBe(retained);
    expect(test.handle.get(id)).toBe(before);
    expect(test.runtime.instanceCount).toBe(1);
    expect(() => test.handle.mount(id, instance)).toThrow(/already mounted/);
    expect(test.kills).toHaveLength(owned ? 2 : 1);
    for (const kill of test.kills) expect(kill).not.toHaveBeenCalled();
    old.replace({ ...retained, duration: 500 });
    test.flush();
    expect(old.live).toBe(true);
    expect(old.definition.duration).toBe(500);
    test.handle.dispose();
    for (const kill of test.kills) expect(kill).toHaveBeenCalledTimes(1);
  });

  it("keeps newly added then removed entities effect-free and permits separate committed recreation", () => {
    const host = drivers();
    const test = rig(project(false), host.factory);
    test.handle.edit((tx) => {
      const transient = tx.addMotion({ id: "temp", trigger: { type: "manual" }, tracks: [] });
      transient.addTrack(animated("temp")).remove();
      transient.destroy();
    });
    expect(host.created).toHaveLength(1);
    expect(test.kills).toHaveLength(0);
    const old = test.handle.motion("hero");
    old.destroy();
    test.handle.addMotion({ id: "hero", trigger: { type: "time", duration: 1000 }, tracks: [] });
    expect(old.live).toBe(false);
    expect(() => test.handle.signal("hero", { progress: 0.5 })).toThrow(
      /configured trigger driver/,
    );
    test.handle.dispose();
    for (const entry of host.created) expect(entry.dispose).toHaveBeenCalledTimes(1);
  });
});
