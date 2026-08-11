import { describe, expect, it } from "vitest";
import type { ProjectDefinition } from "../../../src/contract/v5";
import type { GraphIR } from "../../../src/graph/ir";
import { createManualClock } from "../../../src/ports/clock";
import { GraphRuntime } from "../../../src/runtime/graph-runtime";
import { GraphPublisher, type PublisherNode } from "../../../src/runtime/graph-publisher";
import { PatchRegistry, type PatchBatch } from "../../../src/runtime/patch-registry";

// Evidence-branch note: `pendingSeeds` and `notifying` are read structurally so this file
// compiles against the unfixed runtime too. Without this, `typecheck` fails first and the
// assertions below never execute, which would prove only that the API is missing rather than
// that the behavior is wrong. The shipped copy on the fix branch uses the real types.
const pendingSeeds = (runtime: GraphRuntime): readonly string[] =>
  (runtime as unknown as { pendingSeeds?: readonly string[] }).pendingSeeds ?? [];

const isNotifying = (registry: PatchRegistry): boolean =>
  (registry as unknown as { notifying?: boolean }).notifying ?? false;

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

const soleNode = (id: string): PublisherNode =>
  Object.freeze({
    id,
    owner: "motion",
    authoredIndex: 0,
    track: { id },
    edges: Object.freeze([]),
    compose: () => ({ values: { x: 1 }, sourceProgress: 0, sourceRevisions: {} }),
  });

const soleSnapshot = (id: string): GraphIR & { nodes: readonly PublisherNode[] } => {
  const node = soleNode(id);
  return {
    nodes: [node],
    nodeById: Object.freeze({ [id]: node }),
    order: Object.freeze([id]),
    diagnostics: Object.freeze([]),
  };
};

describe("subscriber-triggered reentrancy (recovery A3)", () => {
  it("defers a subscriber-triggered invalidate instead of running it inside the current flush", () => {
    const clock = createManualClock();
    const runtime = new GraphRuntime(project, clock, compose);
    runtime.attach("hero/arm");

    const ticks: number[] = [];
    runtime.registry.subscribeBatch((batch) => ticks.push(batch.tick));

    let deferred: PatchBatch | undefined;
    let notifications = 0;
    runtime.registry.subscribeNode("hero/arm", () => {
      notifications += 1;
      if (notifications === 1) deferred = runtime.invalidate(["caption/label"]);
    });

    clock.tick();

    // No nested batch may be delivered before the in-flight one completes.
    expect(ticks).toEqual([1]);
    // The reentrant call must not advance the runtime tick from inside a flush.
    expect(runtime.tick).toBe(1);
    // The reentrant call publishes nothing and says so explicitly.
    expect(deferred?.patches).toEqual([]);
    expect(deferred?.seeds).toEqual(["caption/label"]);
    expect(deferred?.diagnostics.map((entry) => entry.ruleId)).toContain(
      "reentrant-flush-deferred",
    );
    // The follow-up is queued, not dropped.
    expect(pendingSeeds(runtime)).toEqual(["caption/label"]);
    expect(runtime.registry.get("caption/label")).toBeUndefined();

    runtime.dispose();
  });

  it("runs the queued follow-up exactly once on the next tick and then clears it", () => {
    const clock = createManualClock();
    const runtime = new GraphRuntime(project, clock, compose);
    runtime.attach("hero/arm");

    const ticks: number[] = [];
    runtime.registry.subscribeBatch((batch) => ticks.push(batch.tick));

    let notifications = 0;
    runtime.registry.subscribeNode("hero/arm", () => {
      notifications += 1;
      if (notifications === 1) runtime.invalidate(["caption/label"]);
    });

    clock.tick();
    expect(pendingSeeds(runtime)).toEqual(["caption/label"]);

    // The clock stays the single owner: the follow-up rides the next tick.
    clock.tick();

    expect(ticks).toEqual([1, 2]);
    expect(runtime.registry.get("caption/label")?.values).toEqual({ node: "caption/label" });
    expect(runtime.registry.get("caption/label")?.revision).toBe(1);
    expect(pendingSeeds(runtime)).toEqual([]);

    // Exactly one follow-up: a third tick must not replay it.
    clock.tick();
    expect(ticks).toEqual([1, 2, 3]);
    expect(runtime.registry.get("caption/label")?.revision).toBe(1);

    runtime.dispose();
  });

  it("coalesces several subscriber-triggered invalidations into one follow-up", () => {
    const clock = createManualClock();
    const runtime = new GraphRuntime(project, clock, compose);
    runtime.attach("hero/arm");

    const ticks: number[] = [];
    runtime.registry.subscribeBatch((batch) => ticks.push(batch.tick));

    let notifications = 0;
    runtime.registry.subscribeNode("hero/arm", () => {
      notifications += 1;
      if (notifications > 1) return;
      runtime.invalidate(["caption/label"]);
      runtime.invalidate(["caption/label"]);
      runtime.invalidate(["hero/arm"]);
    });

    clock.tick();

    expect(ticks).toEqual([1]);
    expect([...pendingSeeds(runtime)].sort()).toEqual(["caption/label", "hero/arm"]);

    clock.tick();
    expect(ticks).toEqual([1, 2]);

    runtime.dispose();
  });

  it("refuses to open a second batch while subscribers are being notified", () => {
    const registry = new PatchRegistry();
    let nested: unknown;
    registry.subscribeNode("hero/arm", () => {
      try {
        registry.beginBatch(9, ["hero/arm"]);
      } catch (error) {
        nested = error;
      }
    });

    registry.beginBatch(1, ["hero/arm"]);
    registry.publish({ nodeId: "hero/arm", values: { x: 1 }, sourceProgress: 0, status: "ready" });

    expect(() => registry.closeBatch()).not.toThrow();
    expect((nested as Error)?.message).toMatch(/while subscribers are being notified/);
    expect(isNotifying(registry)).toBe(false);
  });

  it("rejects a direct publisher flush from inside a subscriber and stays reusable", () => {
    const registry = new PatchRegistry();
    const publisher = new GraphPublisher(registry);
    registry.subscribeNode("hero/arm", () => {
      publisher.flush(soleSnapshot("hero/arm"), ["hero/arm"], 2);
    });

    expect(() => publisher.flush(soleSnapshot("hero/arm"), ["hero/arm"], 1)).toThrow(
      /while subscribers are being notified/,
    );
    expect(isNotifying(registry)).toBe(false);
    expect(() => publisher.flush(soleSnapshot("other/node"), ["other/node"], 3)).not.toThrow();
  });
});
