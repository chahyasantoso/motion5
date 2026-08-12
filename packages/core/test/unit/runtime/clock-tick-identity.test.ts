import { describe, expect, it } from "vitest";
import type { Diagnostic, ProjectDefinition } from "../../../src/contract/v5";
import { createBrowserClock } from "../../../src/adapters/browser-clock";
import type { GraphNode } from "../../../src/graph/ir";
import { createManualClock } from "../../../src/ports/clock";
import { GraphRuntime, type ComposeResolver } from "../../../src/runtime/graph-runtime";
import { ProjectRuntime } from "../../../src/runtime/project-runtime";

const project: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    { id: "hero", trigger: { type: "manual" }, tracks: [{ id: "arm" }] },
    { id: "caption", trigger: { type: "manual" }, tracks: [{ id: "label" }] },
  ],
};

/**
 * Composes a different value every call, so no publication is ever suppressed as unchanged.
 * A test about flush survival must not be able to pass because nothing was published.
 */
function countingCompose(): ComposeResolver {
  let calls = 0;
  return (node: GraphNode) => () => ({
    values: { node: node.id, call: (calls += 1) },
    sourceProgress: 0,
    sourceRevisions: {},
  });
}

describe("clock and batch identity are independent (P0-1)", () => {
  it("keeps the clock running after a seek published without a frame", () => {
    const clock = createManualClock();
    const runtime = new ProjectRuntime(project, { clock, compose: countingCompose() });
    runtime.mount("hero/arm");

    // seek() publishes outside the frame loop. It must not consume a clock frame number,
    // because the clock will reuse that number on its very next frame.
    runtime.seek("hero/arm", 0.5);

    expect(() => clock.tick(16)).not.toThrow();
    expect(() => clock.tick(16)).not.toThrow();
    expect(runtime.graph.tick).toBe(2);

    runtime.dispose();
  });

  it("separates the clock's frame number from batch identity", () => {
    const clock = createManualClock();
    const runtime = new GraphRuntime(project, clock, countingCompose());
    runtime.attach("hero/arm");

    const batchTicks: number[] = [];
    runtime.registry.subscribeBatch((batch) => batchTicks.push(batch.tick));

    clock.tick(16);
    runtime.invalidate(["hero/arm"]);
    clock.tick(16);

    // Two frames happened, so the clock advanced twice and no more.
    expect(runtime.tick).toBe(2);
    // Three publications happened, so batch identity advanced three times.
    expect(runtime.sequence).toBe(3);
    expect(batchTicks).toEqual([1, 2, 3]);

    runtime.dispose();
  });

  it("reports a failed flush as a diagnostic instead of propagating it into the clock", () => {
    const clock = createManualClock();
    const failures: Diagnostic[] = [];
    const runtime = new GraphRuntime(project, clock, countingCompose(), {
      onFlushError: (diagnostic) => failures.push(diagnostic),
    });
    runtime.attach("hero/arm");
    runtime.registry.subscribeNode("hero/arm", () => {
      throw new Error("subscriber boom");
    });

    // A consumer's bug must not be able to stop the frame loop.
    expect(() => clock.tick(16)).not.toThrow();
    expect(failures.map(({ ruleId }) => ruleId)).toEqual(["flush-failure"]);
    expect(failures[0]?.message).toMatch(/subscriber boom/);
    expect(failures[0]?.severity).toBe("error");

    // And the next frame still runs.
    expect(() => clock.tick(16)).not.toThrow();
    expect(runtime.tick).toBe(2);
    // The work the failed flush was carrying is queued, not dropped.
    expect(runtime.pendingSeeds).toContain("hero/arm");

    runtime.dispose();
  });

  it("requests the next animation frame even when a clock listener throws", () => {
    const frames: ((time: number) => void)[] = [];
    let requests = 0;
    const clock = createBrowserClock({
      requestFrame(listener) {
        frames.push(listener);
        requests += 1;
        return requests;
      },
      cancelFrame() {},
    });

    const secondSaw: number[] = [];
    clock.subscribe(() => {
      throw new Error("listener boom");
    });
    clock.subscribe(({ tick }) => secondSaw.push(tick));

    expect(requests).toBe(1);
    // The failure still surfaces to the host, but only after the loop is safe.
    expect(() => frames.shift()?.(16)).toThrow(/listener boom/);
    // Every listener got its turn despite the earlier throw.
    expect(secondSaw).toEqual([1]);
    // The loop rescheduled itself, so the clock is not dead.
    expect(requests).toBe(2);

    expect(() => frames.shift()?.(32)).toThrow(/listener boom/);
    expect(secondSaw).toEqual([1, 2]);
    expect(requests).toBe(3);

    clock.dispose();
  });
});
