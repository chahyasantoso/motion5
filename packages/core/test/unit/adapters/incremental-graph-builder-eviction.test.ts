import { describe, expect, it } from "vitest";
import { IncrementalGraphBuilder } from "../../../src/adapters/graph-builder/incremental";
import { createManualClock } from "../../../src/ports/clock";
import { ProjectRuntime } from "../../../src/runtime/project-runtime";
import type { ProjectDefinition, TrackDefinition } from "../../../src/contract/v5";

/**
 * Issue #225.
 *
 * One invariant: after a build completes, `IncrementalGraphBuilder` holds a cache entry for exactly
 * the tracks that build walked. Before this, `delete` ran in exactly one place, the reject path in
 * `#collect`, and no removal path reached the builder at all, so every `GraphNode` it ever built
 * stayed for the builder's lifetime, along with the authored `TrackDefinition` the node holds.
 *
 * `cachedNodeCount` is the whole observable, on purpose. It is declared on this class and not on
 * the `GraphBuilder` port, so the residency claim is stated as a count of live entries rather than
 * as a lookup no caller would ever perform; the alternative is GC probing, which is flaky and not
 * worth owning. See ADR-058.
 */
const HERO: ProjectDefinition = {
  schemaVersion: 5,
  motions: [{ id: "hero", trigger: { type: "manual" }, tracks: [{ id: "arm" }, { id: "leg" }] }],
};
const HERO_AND_DUST: ProjectDefinition = { ...HERO, freeTracks: [{ id: "dust" }] };

const compose = (node: { id: string }) => () => ({
  values: { node: node.id },
  sourceProgress: 0,
  sourceRevisions: {},
});

function freeProject(tracks: readonly TrackDefinition[]): ProjectDefinition {
  return { schemaVersion: 5, motions: [], freeTracks: tracks };
}
/** Drives the real runtime path, which is what the issue reports, rather than `build` directly. */
function runtimeOn(project: ProjectDefinition, builder: IncrementalGraphBuilder): ProjectRuntime {
  return new ProjectRuntime(project, {
    clock: createManualClock(),
    compose,
    graphBuilder: builder,
  });
}

describe("IncrementalGraphBuilder evicts what the last build did not walk", () => {
  it("EV-1 holds an entry for exactly the tracks the last build walked", () => {
    const builder = new IncrementalGraphBuilder();

    expect(builder.build(HERO_AND_DUST).graph).toBeDefined();
    expect(builder.cachedNodeCount).toBe(3);

    // One motion track dropped, everything else identical. The retained entry is what leaked.
    const withoutLeg: ProjectDefinition = {
      ...HERO_AND_DUST,
      motions: [{ id: "hero", trigger: { type: "manual" }, tracks: [{ id: "arm" }] }],
    };
    expect(builder.build(withoutLeg).graph).toBeDefined();
    expect(builder.cachedNodeCount).toBe(2);

    // And down to nothing, so the sweep is not merely off by the last entry.
    expect(builder.build(freeProject([])).graph).toBeDefined();
    expect(builder.cachedNodeCount).toBe(0);
  });

  it("EV-2 evicts through the removal path the runtime already has", () => {
    const builder = new IncrementalGraphBuilder();
    const project = runtimeOn(HERO, builder);
    expect(builder.cachedNodeCount).toBe(2);

    // `remove()` reaches `replaceGraph` -> `GraphBinding.replace` -> `builder.build(project)`, and
    // that build is the only thing that has to happen. No `evict(nodeId)` on the port, nothing new
    // in `ProjectRuntime`, and no third call site to keep in step.
    project.track("hero/arm").remove();
    expect(builder.cachedNodeCount).toBe(1);

    project.dispose();
  });

  it("EV-3 leaves nothing cached for a motion once its track and the motion are gone", () => {
    const builder = new IncrementalGraphBuilder();
    const project = runtimeOn(HERO, builder);

    project.addMotion({ id: "cameo", trigger: { type: "manual" }, tracks: [] });
    const pan = project.addTrack({ id: "pan" }, { motionId: "cameo" });
    expect(builder.cachedNodeCount).toBe(3);

    // The second teardown the issue names. `destroyMotion` owns no builder state and does not learn
    // any here; it replaces the graph, and the count it leaves behind is the residency rule holding
    // across a path that never mentions the cache.
    pan.remove();
    expect(builder.cachedNodeCount).toBe(2);
    project.destroyMotion("cameo");
    expect(builder.cachedNodeCount).toBe(2);

    project.dispose();
  });

  it("EV-4 still hits, so the sweep cannot pass by never caching", () => {
    const builder = new IncrementalGraphBuilder();

    const first = builder.build(HERO).graph;
    const second = builder.build(HERO).graph;

    // Node identity across an unchanged rebuild is the cache doing its job. Without this case every
    // eviction assertion above passes against a builder that caches nothing at all.
    expect(first?.nodeById["hero/arm"]).toBe(second?.nodeById["hero/arm"]);
    expect(first?.nodeById["hero/leg"]).toBe(second?.nodeById["hero/leg"]);
    expect(builder.cachedNodeCount).toBe(2);
  });

  it("EV-5 rebuilds a re-authored node rather than answering from an evicted entry", () => {
    const builder = new IncrementalGraphBuilder();
    const original: TrackDefinition = { id: "dust", duration: 100 };
    expect(builder.build(freeProject([original])).graph?.nodeById["~/dust"]?.track).toBe(original);

    expect(builder.build(freeProject([])).graph).toBeDefined();
    expect(builder.cachedNodeCount).toBe(0);

    // Same node id, new object. Eviction must not have opened a stale-hit path, and the freshness
    // check that makes this a miss is object identity rather than the key.
    const reauthored: TrackDefinition = { id: "dust", duration: 250 };
    const node = builder.build(freeProject([reauthored])).graph?.nodeById["~/dust"];
    expect(node?.track).toBe(reauthored);
    expect(node?.track.duration).toBe(250);
    expect(builder.cachedNodeCount).toBe(1);
  });

  it("EV-6 leaves the cache untouched when a build throws part way through", () => {
    const builder = new IncrementalGraphBuilder();
    expect(builder.build(HERO_AND_DUST).graph).toBeDefined();
    expect(builder.cachedNodeCount).toBe(3);

    // The motion loop walks both hero tracks, then the free-track loop throws before reaching
    // `~/dust`. A sweep in a `finally` would read that partial `visited` as residency and evict a
    // live entry, which is why the sweep is on the completion path and this case is a count.
    const unwalkable = {
      ...HERO_AND_DUST,
      freeTracks: {
        entries: () => {
          throw new Error("free tracks cannot be walked");
        },
      },
    } as unknown as ProjectDefinition;

    expect(() => builder.build(unwalkable)).toThrow(/free tracks cannot be walked/);
    expect(builder.cachedNodeCount).toBe(3);

    // A build that completes and is rejected is a different thing from a build that throws: it
    // walked every track it was given, so it sweeps, and the entries it walked survive.
    const duplicate = builder.build(freeProject([{ id: "dust" }, { id: "dust" }]));
    expect(duplicate.graph).toBeUndefined();
    expect(duplicate.diagnostics.map(({ ruleId }) => ruleId)).toEqual(["node-duplicate"]);
    expect(builder.cachedNodeCount).toBe(1);
  });

  it("EV-7 makes one builder shared by two projects thrash to a permanent miss", () => {
    const builder = new IncrementalGraphBuilder();
    const left = freeProject([{ id: "dust" }]);
    const right = freeProject([{ id: "smoke" }]);

    const before = builder.build(left).graph?.nodeById["~/dust"];
    expect(builder.build(right).graph).toBeDefined();
    const after = builder.build(left).graph?.nodeById["~/dust"];

    // The stated cost of per-build residency, pinned rather than left implied by the constructor.
    // Correctness is unaffected and throughput is not: the node is rebuilt, and equal.
    expect(after).not.toBe(before);
    expect(after).toEqual(before);
    expect(builder.cachedNodeCount).toBe(1);
  });
});
