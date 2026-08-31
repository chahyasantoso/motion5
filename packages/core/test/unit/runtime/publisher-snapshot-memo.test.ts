import { afterEach, describe, expect, it, vi } from "vitest";
import type { ProjectDefinition } from "../../../src/contract/v5";
import { createManualClock } from "../../../src/ports/clock";
import { GraphRuntime } from "../../../src/runtime/graph-runtime";
import { GraphPublisher } from "../../../src/runtime/graph-publisher";

/**
 * Issue #223, optimisation 7c.
 *
 * `GraphRuntime.flush` rebuilds the whole snapshot on every tick: it maps every graph node to a
 * publisher node, builds an id map from the result, and freezes a fresh object around them. Every
 * part of that is now a pure function of the `GraphIR` identity. The publisher nodes were already
 * cached per graph node, `dependents` is derived once per graph by `finalizeGraph` since 7a, and the
 * closures a publisher node carries resolve the compiled map per call since A3, so an entry that
 * survives a recompile is not stale.
 *
 * One part is not a function of the graph: which nodes are mounted. It moves without the graph
 * moving, and it is the reason the memo is keyed rather than the reason it cannot exist. Aliasing the
 * runtime's own set inside a frozen snapshot is what the two red cases below refuse, because a cache
 * whose answer changes without its key changing is not keyed on what its answer depends on.
 */
const PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  motions: [{ id: "hero", trigger: { type: "manual" }, tracks: [{ id: "arm" }, { id: "hand" }] }],
};

const REPLACEMENT: ProjectDefinition = {
  schemaVersion: 5,
  motions: [{ id: "hero", trigger: { type: "manual" }, tracks: [{ id: "arm" }] }],
};

const compose = (node: { id: string }) => () => ({
  values: { node: node.id },
  sourceProgress: 0,
  sourceRevisions: {},
});

// The prototype rather than the instance, because `GraphRuntime` owns its publisher and never hands
// it out. `vi.spyOn` keeps the original implementation, so every flush below really runs.
const flushed = vi.spyOn(GraphPublisher.prototype, "flush");

const handed = () => flushed.mock.calls.map(([snapshot]) => snapshot);

afterEach(() => {
  flushed.mockClear();
});

describe("the snapshot a flush runs over is memoised per graph", () => {
  it("RA-23 hands the publisher one frozen snapshot for as long as nothing in it moved", () => {
    const clock = createManualClock();
    const runtime = new GraphRuntime(PROJECT, clock, compose);
    runtime.attach("hero/arm");

    clock.tick();
    clock.tick();

    const [first, second] = handed();
    expect(flushed).toHaveBeenCalledTimes(2);
    // The whole slice, in one identity comparison: a second tick over a graph that did not move has
    // nothing left to allocate for graph shape.
    expect(second).toBe(first);
    expect(Object.isFrozen(first)).toBe(true);
    expect(first?.nodes.map(({ id }) => id).sort()).toEqual(["hero/arm", "hero/hand"]);
    expect(first?.nodes.every((node) => typeof node.compose === "function")).toBe(true);

    runtime.dispose();
  });

  it("RA-24 keys it on membership, so neither a stale member set nor a live alias is possible", () => {
    const clock = createManualClock();
    const runtime = new GraphRuntime(PROJECT, clock, compose);
    runtime.attach("hero/arm");

    clock.tick();
    const first = handed()[0];
    expect([...(first?.members ?? [])]).toEqual(["hero/arm"]);

    // A snapshot already handed over does not widen behind the publisher that read it. Aliasing the
    // runtime's own set is what fails here, and it is what a memo keyed on the graph alone keeps.
    runtime.attach("hero/hand");
    expect([...(first?.members ?? [])]).toEqual(["hero/arm"]);

    // And the next flush sees the mount, so the memo cannot reach green by never rebuilding.
    clock.tick();
    const second = handed()[1];
    expect(second).not.toBe(first);
    expect([...(second?.members ?? [])].sort()).toEqual(["hero/arm", "hero/hand"]);
    expect(second?.nodes[0]).toBe(first?.nodes[0]);

    runtime.dispose();
  });

  it("RA-25 rebuilds it when a member leaves, by either exit", () => {
    const clock = createManualClock();
    const runtime = new GraphRuntime(PROJECT, clock, compose);
    runtime.attach("hero/arm");
    runtime.attach("hero/hand");

    clock.tick();
    expect([...(handed()[0]?.members ?? [])].sort()).toEqual(["hero/arm", "hero/hand"]);

    runtime.detach("hero/hand");
    clock.tick();
    expect([...(handed()[1]?.members ?? [])]).toEqual(["hero/arm"]);

    runtime.evictNode("hero/arm");
    clock.tick();
    expect([...(handed()[2]?.members ?? [])]).toEqual([]);

    runtime.dispose();
  });

  it("RA-26 rebuilds it when the graph is replaced, and reuses no node the rebuild displaced", () => {
    const clock = createManualClock();
    const runtime = new GraphRuntime(PROJECT, clock, compose);
    runtime.attach("hero/arm");

    clock.tick();
    const first = handed()[0];

    runtime.replaceGraph(REPLACEMENT);
    clock.tick();
    const second = handed()[1];

    expect(second).not.toBe(first);
    expect(second?.nodes.map(({ id }) => id)).toEqual(["hero/arm"]);
    expect(second?.nodeById["hero/hand"]).toBeUndefined();
    expect(second?.dependents).toBe(runtime.graph.dependents);
    // Residency, which the clear inside `replaceGraph` owns: a publisher node the rebuild displaced
    // is not reused, so the memo cannot become the thing that retains it.
    expect(second?.nodes[0]).not.toBe(first?.nodes[0]);

    runtime.dispose();
  });
});
