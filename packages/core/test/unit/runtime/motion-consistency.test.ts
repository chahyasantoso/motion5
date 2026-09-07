import { describe, expect, it, vi } from "vitest";
import { Engine } from "../../../src/engine";
import type { ProjectDefinition } from "../../../src/contract/v5";
import type { MotionHandle } from "../../../src/contract/motion-handle";
import type { TrackHandle } from "../../../src/contract/track-handle";
import { createDefaultTriggerFactory } from "../../../src/adapters/trigger-factory/default";
import { createManualClock } from "../../../src/ports/clock";
import type { Interpolator } from "../../../src/ports/interpolator";
import { createFakeInterpolator, createFakeScheduler } from "../../../src/testing/fakes";
import type { CreatedTrigger, TriggerFactory } from "../../../src/ports/trigger-factory";
import type { ProjectRuntime } from "../../../src/runtime/project-runtime";

// Real Engine, Motion, Track and graph; only the host ports are controlled.
const animated = (id: string) => ({
  id,
  duration: 1000,
  keyframes: {
    x: [
      { p: 0, v: 0 },
      { p: 1, v: 100 },
    ],
  },
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
function rig(definition = project(), triggerFactory?: TriggerFactory, onProgress?: () => void) {
  const clock = createManualClock();
  const scheduler = createFakeScheduler();
  const base = createFakeInterpolator();
  const kills: ReturnType<typeof vi.fn>[] = [];
  const interpolator: Interpolator = {
    create(config) {
      const timeline = base.create(config);
      const kill = vi.fn(() => timeline.kill());
      kills.push(kill);
      function progress(): number;
      function progress(value: number): void;
      function progress(value?: number): number | void {
        if (value === undefined) return timeline.progress();
        timeline.progress(value);
        onProgress?.();
      }
      return { ...timeline, progress, kill };
    },
  };
  const handle = new Engine({ clock, scheduler, interpolator, triggerFactory }).load(definition);
  const runtime = (handle as typeof handle & { readonly _runtime: ProjectRuntime })._runtime;
  const flush = () => {
    for (let rounds = 0; scheduler.pending.length; rounds++) {
      if (rounds > 20) throw new Error("Scheduler did not settle.");
      scheduler.flush();
    }
  };
  return { handle, runtime, clock, flush, kills };
}
function drivers(
  options: { cleanup?: unknown; refuse?: "create" | "subscribe"; onCleanup?: () => void } = {},
) {
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
        if (index === 0) {
          options.onCleanup?.();
          if (Object.hasOwn(options, "cleanup")) throw options.cleanup;
        }
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
  it("completes both cleanup layers, activates eager input and disables failed old generations", () => {
    const subscriptionFailure = new Error("Old subscription cleanup failed.");
    const resourceFailure = new Error("Old resource cleanup failed.");
    const entries: {
      emit: (progress: number) => void;
      unsubscribe: ReturnType<typeof vi.fn>;
      dispose: ReturnType<typeof vi.fn>;
    }[] = [];
    const factory: TriggerFactory = {
      create(context) {
        const index = entries.length;
        const entry = {
          emit: (_progress: number) => undefined as void,
          unsubscribe: vi.fn(() => {
            if (index === 0) throw subscriptionFailure;
          }),
          dispose: vi.fn(() => {
            if (index === 0) throw resourceFailure;
          }),
        };
        entries.push(entry);
        return {
          port: {
            subscribe(listener) {
              entry.emit = listener;
              if (index === 1) listener(0.6);
              return entry.unsubscribe;
            },
          },
          clockBinding: { kind: "none" },
          acceptsExternalSignal: context.trigger.type === "manual",
          dispose: entry.dispose,
        };
      },
    };
    const test = rig(project(), factory);
    test.handle.mount("hero/arm");
    const motion = test.handle.motion("hero");
    const failure = caught(() => motion.setTrigger({ type: "time", duration: 1000 }));
    expect(failure).toBeInstanceOf(AggregateError);
    expect((failure as AggregateError).errors).toEqual([subscriptionFailure, resourceFailure]);
    expect(motion.definition.trigger.type).toBe("time");
    test.flush();
    expect(test.handle.get("hero/arm")?.sourceProgress).toBeCloseTo(0.6);
    const patch = test.handle.get("hero/arm");
    entries[0]!.emit(0.9);
    test.flush();
    expect(test.handle.get("hero/arm")).toBe(patch);
    test.handle.dispose();
    for (const entry of entries) {
      expect(entry.unsubscribe).toHaveBeenCalledTimes(1);
      expect(entry.dispose).toHaveBeenCalledTimes(1);
    }
  });

  it.each([-0.1, NaN])(
    "refuses malformed eager input %s before a later valid emission can hide it",
    (invalid) => {
      const base = createDefaultTriggerFactory();
      const releases: ReturnType<typeof vi.fn>[] = [];
      const factory: TriggerFactory = {
        create(context) {
          const created = base.create(context);
          const dispose = vi.fn(() => created.dispose());
          releases.push(dispose);
          return {
            ...created,
            dispose,
            port:
              context.trigger.type === "time"
                ? {
                    subscribe(listener) {
                      listener(invalid);
                      listener(0.6);
                      return () => undefined;
                    },
                  }
                : created.port,
          };
        },
      };
      const test = rig(project(), factory);
      test.handle.mount("hero/arm");
      expect(() => test.handle.motion("hero").setTrigger({ type: "time", duration: 1000 })).toThrow(
        /finite|between 0 and 1/,
      );
      expect(test.handle.motion("hero").definition.trigger.type).toBe("manual");
      test.handle.signal("hero", { type: "manual", progress: 0.4 });
      test.flush();
      expect(test.handle.get("hero/arm")?.sourceProgress).toBeCloseTo(0.4);
      expect(releases[0]).not.toHaveBeenCalled();
      expect(releases[1]).toHaveBeenCalledTimes(1);
      test.handle.dispose();
      for (const release of releases) expect(release).toHaveBeenCalledTimes(1);
    },
  );

  it("retains an accepted stagger and attempts publication when re-seeding throws", () => {
    let intercept: () => void = () => undefined;
    const test = rig(project(), undefined, () => intercept());
    test.handle.mount("hero/arm");
    test.handle.mount("hero/leg");
    test.handle.signal("hero", { type: "manual", progress: 0.75 });
    test.flush();
    const motion = test.handle.motion("hero");
    const failure = new Error("Host re-seed failed.");
    const seen: (number | undefined)[] = [];
    intercept = () => {
      seen.push(motion.definition.stagger);
      throw failure;
    };
    const invalidate = vi.spyOn(test.runtime.graph, "invalidate");
    expect(caught(() => motion.setStagger(250))).toBe(failure);
    expect(seen).toEqual([250]);
    expect(motion.definition.stagger).toBe(250);
    expect(invalidate).toHaveBeenCalledTimes(1);
    expect(test.handle.get("hero/arm")?.sourceProgress).toBeCloseTo(0.75);
    intercept = () => undefined;
    motion.setStagger();
    test.flush();
    expect(test.handle.get("hero/leg")?.sourceProgress).toBeCloseTo(0.75);
    test.handle.dispose();
    for (const kill of test.kills) expect(kill).toHaveBeenCalledTimes(1);
  });

  it("defers disposal through failed stagger completion and preserves ordered failures", () => {
    let intercept: () => void = () => undefined;
    const test = rig(project(), undefined, () => intercept());
    test.handle.mount("hero/arm");
    // Track skips unchanged progress. Advance first so the new stagger reaches the host.
    test.handle.signal("hero", { type: "manual", progress: 0.75 });
    test.flush();
    const motion = test.handle.motion("hero");
    const failure = new Error("Disposing host re-seed failed.");
    const disposeDuringProgress = vi.fn(() => {
      test.handle.dispose();
      throw failure;
    });
    intercept = disposeDuringProgress;
    const invalidate = vi.spyOn(test.runtime.graph, "invalidate");
    const result = caught(() => motion.setStagger(250));
    expect(disposeDuringProgress).toHaveBeenCalledTimes(1);
    expect(result).toBeInstanceOf(AggregateError);
    expect((result as AggregateError).errors[0]).toBe(failure);
    expect((result as AggregateError).errors[1].message).toBe("ProjectRuntime is disposed.");
    expect(motion.live).toBe(false);
    expect(invalidate).not.toHaveBeenCalled();
    for (const kill of test.kills) expect(kill).toHaveBeenCalledTimes(1);
  });

  it("adopts before a trigger finalizer disposes and releases the replacement once", () => {
    let cleanup: () => void = () => undefined;
    const host = drivers({ onCleanup: () => cleanup() });
    const test = rig(project(), host.factory);
    const motion = test.handle.motion("hero");
    const seen: string[] = [];
    cleanup = () => {
      seen.push(motion.definition.trigger.type);
      test.handle.dispose();
    };
    expect(() => motion.setTrigger({ type: "time", duration: 1000 })).toThrow(
      "ProjectRuntime is disposed.",
    );
    expect(seen).toEqual(["time"]);
    expect(motion.live).toBe(false);
    expect(host.created).toHaveLength(2);
    for (const entry of host.created) expect(entry.dispose).toHaveBeenCalledTimes(1);
    for (const kill of test.kills) expect(kill).toHaveBeenCalledTimes(1);
  });

  it.each([new Error("Old driver cleanup failed."), undefined])(
    "retains an installed trigger when cleanup throws %s",
    (failure) => {
      const host = drivers({ cleanup: failure });
      const test = rig(project(), host.factory);
      const motion = test.handle.motion("hero");
      test.handle.mount("hero/arm");
      expect(caught(() => motion.setTrigger({ type: "time", duration: 1000 }))).toBe(failure);
      expect(motion.definition.trigger).toEqual({ type: "time", duration: 1000 });
      expect(() => test.handle.signal("hero", { type: "manual", progress: 0.5 })).toThrow(
        /configured trigger driver/,
      );
      test.clock.tick(250);
      test.flush();
      expect(test.handle.get("hero/arm")?.sourceProgress).toBeCloseTo(0.25);
      motion.setTrigger({ type: "manual" });
      expect(host.created).toHaveLength(3);
      expect(() => test.handle.signal("hero", { type: "manual", progress: 0.5 })).not.toThrow();
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
      expect(() => test.handle.signal("hero", { type: "manual", progress: 0.4 })).not.toThrow();
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
    test.handle.signal("hero", { type: "manual", progress: 0.75 });
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
      expect(() => test.handle.signal("hero", { type: "manual", progress: 0.5 })).not.toThrow();
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
    expect(() => test.handle.signal("hero", { type: "manual", progress: 0.5 })).toThrow(
      /configured trigger driver/,
    );
    test.handle.dispose();
    for (const entry of host.created) expect(entry.dispose).toHaveBeenCalledTimes(1);
  });
});
