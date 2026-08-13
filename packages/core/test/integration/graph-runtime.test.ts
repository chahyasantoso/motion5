import { describe, expect, it, vi } from "vitest";
import type { ProjectDefinition } from "../../src/contract/v5";
import { createManualClock } from "../../src/ports/clock";
import { GraphRuntime } from "../../src/runtime/graph-runtime";

const project: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    { id: "hero", trigger: { type: "manual" }, tracks: [{ id: "arm" }] },
    { id: "caption", trigger: { type: "manual" }, tracks: [{ id: "label" }] },
  ],
  freeTracks: [{ id: "cursor" }],
};

const compose = (node: { id: string }) => () => ({
  values: { node: node.id },
  sourceProgress: 0,
  sourceRevisions: {},
});

describe("GraphRuntime", () => {
  it("I-13 owns one registry, one state, and one clock subscription", () => {
    const clock = createManualClock();
    // The spy has to exist before construction. Installing it afterwards can only prove that
    // nothing subscribed later, which is not the invariant being claimed here.
    const subscribe = vi.spyOn(clock, "subscribe");

    const runtime = new GraphRuntime(project, clock, compose);

    expect(subscribe).toHaveBeenCalledTimes(1);
    expect(runtime.registry).toBe(runtime.registry);
    expect(runtime.state).toBe(runtime.binding.state);
    runtime.dispose();
  });

  it("P1-8 keeps the publisher off the public runtime surface", () => {
    const clock = createManualClock();
    const runtime = new GraphRuntime(project, clock, compose);

    expect((runtime as unknown as { publisher?: unknown }).publisher).toBeUndefined();
    runtime.dispose();
  });

  it("I-13 keeps ticks monotonic across detach and reattach", () => {
    const clock = createManualClock();
    const runtime = new GraphRuntime(project, clock, compose);
    runtime.attach("hero/arm");
    const batches: number[] = [];
    runtime.registry.subscribeBatch((batch) => batches.push(batch.tick));

    clock.tick(0.1);
    runtime.detach("hero/arm");
    clock.tick(0.1);
    runtime.attach("hero/arm");
    clock.tick(0.1);

    expect(runtime.tick).toBe(3);
    expect(batches).toEqual([1, 2, 3]);
    runtime.dispose();
  });

  it("publishes only attached seeds and stops after disposal", () => {
    const clock = createManualClock();
    const runtime = new GraphRuntime(project, clock, compose);
    runtime.attach("hero/arm");
    runtime.attach("~/cursor");
    const seen: (readonly string[])[] = [];
    runtime.registry.subscribeBatch((batch) => seen.push(batch.seeds));

    clock.tick();
    expect(seen).toEqual([["hero/arm", "~/cursor"]]);

    runtime.detach("~/cursor");
    clock.tick();
    expect(seen).toEqual([["hero/arm", "~/cursor"], ["hero/arm"]]);

    runtime.dispose();
    expect(() => clock.tick()).not.toThrow();
    expect(seen).toHaveLength(2);
  });
});
