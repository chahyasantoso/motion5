import { describe, expect, it } from "vitest";
import type { ProjectDefinition } from "../../../src/contract/v5";
import { createManualClock } from "../../../src/ports/clock";
import { createFakeScheduler } from "../../../src/ports/fakes";
import { GraphRuntime } from "../../../src/runtime/graph-runtime";

const project: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    { id: "hero", trigger: { type: "manual" }, tracks: [{ id: "arm" }] },
    { id: "caption", trigger: { type: "manual" }, tracks: [{ id: "label" }] },
  ],
};

const compose = (node: { id: string }) => () => ({
  values: { node: node.id },
  sourceProgress: 0,
  sourceRevisions: {},
});

describe("scheduler-driven reentrancy (P1-7/P1-8)", () => {
  it("drains a subscriber invalidation with zero clock ticks", () => {
    const clock = createManualClock();
    const scheduler = createFakeScheduler();
    const runtime = new GraphRuntime(project, clock, compose, { scheduler });
    runtime.attach("hero/arm");

    let notifications = 0;
    runtime.registry.subscribeNode("hero/arm", () => {
      notifications += 1;
      if (notifications === 1) runtime.invalidate(["caption/label"]);
    });

    clock.tick();
    expect(runtime.pendingSeeds).toEqual(["caption/label"]);
    expect(runtime.registry.get("caption/label")).toBeUndefined();

    scheduler.flush();

    expect(runtime.pendingSeeds).toEqual([]);
    expect(runtime.registry.get("caption/label")?.values).toEqual({ node: "caption/label" });
    expect(runtime.tick).toBe(1);
    runtime.dispose();
  });

  it("coalesces repeated invalidations into one scheduled follow-up", () => {
    const clock = createManualClock();
    const scheduler = createFakeScheduler();
    const runtime = new GraphRuntime(project, clock, compose, { scheduler });
    runtime.attach("hero/arm");

    let notifications = 0;
    runtime.registry.subscribeNode("hero/arm", () => {
      notifications += 1;
      if (notifications !== 1) return;
      runtime.invalidate(["caption/label"]);
      runtime.invalidate(["caption/label"]);
      runtime.invalidate(["hero/arm"]);
    });

    clock.tick();
    expect(scheduler.pending).toHaveLength(1);
    scheduler.flush();
    expect(runtime.pendingSeeds).toEqual([]);
    runtime.dispose();
  });

  it("retries scheduling after a synchronous scheduler failure", () => {
    const clock = createManualClock();
    let attempts = 0;
    const jobs: Array<() => void> = [];
    const scheduler = {
      schedule(job: () => void) {
        attempts += 1;
        if (attempts === 1) throw new Error("scheduler unavailable");
        jobs.push(job);
        return { cancel() {} };
      },
    };
    const runtime = new GraphRuntime(project, clock, compose, { scheduler });
    runtime.attach("hero/arm");
    const diagnostics: string[] = [];
    runtime.registry.subscribeNode("hero/arm", () => {
      runtime.invalidate(["caption/label"]);
      runtime.invalidate(["caption/label"]);
    });

    runtime.registry.subscribeBatch(() => undefined);
    runtime.flush(["hero/arm"], 1);

    expect(attempts).toBe(2);
    expect(runtime.lastFlushError?.ruleId).toBe("scheduler-failure");
    jobs.splice(0).forEach((job) => job());
    expect(runtime.pendingSeeds).toEqual([]);
    expect(diagnostics).toEqual([]);
    runtime.dispose();
  });

  it("does not expose the publisher as a second public reentrancy entry point", () => {
    const clock = createManualClock();
    const scheduler = createFakeScheduler();
    const runtime = new GraphRuntime(project, clock, compose, { scheduler });
    expect((runtime as unknown as { publisher?: unknown }).publisher).toBeUndefined();
    runtime.dispose();
  });
});
