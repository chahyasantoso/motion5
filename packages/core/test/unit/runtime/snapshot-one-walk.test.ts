import { describe, expect, it } from "vitest";
import { IncrementalGraphBuilder } from "../../../src/adapters/graph-builder/incremental";
import type {
  MotionDefinition,
  ProjectDefinition,
  TrackDefinition,
} from "../../../src/contract/v5";
import type { GraphBuildResult } from "../../../src/graph/ir";
import { createManualClock } from "../../../src/ports/clock";
import { ProjectRuntime } from "../../../src/runtime/project-runtime";

/**
 * Issue #223, finding 3 of the re-review: the authoring side of a structural commit is quadratic.
 *
 * Every publisher optimisation in slice 7 was about the tick, and that side is finished: a
 * steady-state tick derives no graph shape, and a one-track structural edit builds one
 * `PublisherNode` rather than V of them. The document a commit hands the graph was never read that
 * way. `#snapshot` maps every motion and asks `#ownedBy` for its tracks, and `#ownedBy`
 * materialises the whole track map to answer about one id, so the snapshot is `O(M x V)` in time
 * and allocates M arrays of length V to place V definitions. A one-track edit on a rig with 40
 * motions and 600 tracks materialised the map 40 times to move one edge, in front of a candidate
 * build the incremental builder cache-hits for every untouched node.
 *
 * `RA-89` is that cost, counted rather than timed. `RA-90` and `RA-91` are the equivalence half:
 * the document a single bucketing walk produces has to be the document the per-motion filter
 * produced, track for track, in the same order and by identity, or this is a rule change wearing a
 * refactor's clothes.
 *
 * `RA-7` in `structural-commit-path.test.ts` already owns whether the committed graph and the
 * retained definitions agree, and nothing here restates it. What these cases add is the document in
 * between, which no case has ever read.
 *
 * Two pieces of finding 3 are deliberately not here. The wholesale `#adoptMaps` rewrite and the
 * per-op `new Map` copy are invariants about what a commit writes rather than about what the
 * snapshot walks, and the second of those is a measurement before it is a change.
 */

const MANUAL: MotionDefinition["trigger"] = { type: "manual" };
const compose = (node: { id: string }) => () => ({
  values: { node: node.id },
  sourceProgress: 0,
  sourceRevisions: {},
});
/** `count` motions holding `tracks` tracks each, so V is fixed while M moves. */
function evenly(count: number, tracks: number): ProjectDefinition {
  const motions: MotionDefinition[] = Array.from({ length: count }, (_motion, index) => ({
    id: `m${index}`,
    trigger: MANUAL,
    tracks: Array.from({ length: tracks }, (_track, position) => ({ id: `t${position}` })),
  }));
  return { schemaVersion: 5, motions };
}
/**
 * How many times an operation materialised a `Map` through an explicit `.entries()` call.
 *
 * The track map is private, so the count is instrumented at the prototype rather than injected, and
 * the instrument is precise rather than broad. `Map.prototype[Symbol.iterator]` is a separate
 * property slot holding the same function, so replacing `entries` leaves every `new Map(pair)` copy
 * and every `for ... of` walk in the commit path uncounted, and `Object.entries` and
 * `Array.prototype.entries` are different functions entirely. Across `packages/core/src` there is
 * exactly one explicit `Map.prototype.entries` call and it is `#ownedBy`'s, so this counts that
 * call and nothing else.
 *
 * Restored in a `finally`, because a counter left installed would follow the rest of the file.
 */
function mapMaterialisations(operation: () => void): number {
  const original = Map.prototype.entries;
  let calls = 0;
  Object.defineProperty(Map.prototype, "entries", {
    value: function (this: Map<unknown, unknown>) {
      calls += 1;
      return original.call(this);
    },
  });
  try {
    operation();
  } finally {
    Object.defineProperty(Map.prototype, "entries", { value: original });
  }
  return calls;
}
interface Rig {
  readonly runtime: ProjectRuntime;
  /** The document the last commit handed the builder, which is `#snapshot`'s answer verbatim. */
  readonly committed: () => ProjectDefinition;
}
/**
 * One runtime whose candidate documents are captured on the way to the real builder.
 *
 * The snapshot is what this slice changes, and the graph builder port is where it is observable
 * without reaching into the runtime: `replaceGraph` hands the builder exactly the object `#snapshot`
 * produced. The real builder still runs behind the capture, so every case commits against the same
 * graph a caller would get. The first captured document is the authored project the constructor
 * built from, which is why a case reads the last one.
 */
function rig(project: ProjectDefinition): Rig {
  const seen: ProjectDefinition[] = [];
  const inner = new IncrementalGraphBuilder();
  const runtime = new ProjectRuntime(project, {
    clock: createManualClock(),
    compose,
    graphBuilder: {
      build(candidate: ProjectDefinition): GraphBuildResult {
        seen.push(candidate);
        return inner.build(candidate);
      },
    },
  });
  return {
    runtime,
    committed: () => {
      const last = seen[seen.length - 1];
      if (last === undefined) throw new Error("No candidate document was built.");
      return last;
    },
  };
}
/** The authored ids of a committed list, which is the order a loaded document would carry. */
function idsOf(tracks: readonly TrackDefinition[] | undefined): readonly string[] {
  return (tracks ?? []).map((track) => track.id);
}
/**
 * Every node whose committed definition is not the retained object, by identity.
 *
 * The reading `RA-7` takes of the graph, applied to the document in front of it: a fresh definition
 * for an untouched entry is exactly what costs `IncrementalGraphBuilder` its `cached.track === track`
 * hit, and deep equality cannot see the difference. See ADR-058.
 */
function borrowed(runtime: ProjectRuntime, document: ProjectDefinition): readonly string[] {
  const fresh: string[] = [];
  for (const motion of document.motions)
    for (const track of motion.tracks) {
      const nodeId = `${motion.id}/${track.id}`;
      if (runtime.track(nodeId).definition !== track) fresh.push(nodeId);
    }
  for (const track of document.freeTracks ?? []) {
    const nodeId = `~/${track.id}`;
    if (runtime.track(nodeId).definition !== track) fresh.push(nodeId);
  }
  return fresh;
}

describe("the committed pair is walked once, not once per motion", () => {
  it("RA-89 pays the same snapshot cost for 12 motions as for 2 over the same tracks", () => {
    const wide = new ProjectRuntime(evenly(12, 2), { clock: createManualClock(), compose });
    const deep = new ProjectRuntime(evenly(2, 12), { clock: createManualClock(), compose });

    // The premise of the case, stated rather than assumed: both rigs hold 24 tracks, so the motion
    // count is the only thing that differs below.
    expect(wide.graph.graph.nodes).toHaveLength(24);
    expect(deep.graph.graph.nodes).toHaveLength(24);

    const wideCost = mapMaterialisations(() => {
      wide.addTrack({ id: "added" }, { motionId: "m0" });
    });
    const deepCost = mapMaterialisations(() => {
      deep.addTrack({ id: "added" }, { motionId: "m0" });
    });

    // 12 against 2 for the same 24 tracks is the quadratic stated as a diff: the snapshot asked
    // `#ownedBy` once per motion, and each of those answers about one id by materialising every
    // entry of the map.
    expect(wideCost).toBe(deepCost);
    // Zero, because a walk that buckets by the owner each entry already names asks `#ownedBy`
    // nothing at all, and `#ownedBy`'s call is the only explicit `Map.prototype.entries` call in
    // `packages/core/src`. A commit that reintroduces a per-motion materialisation fails here
    // whether or not the document it produces is still right.
    expect(wideCost).toBe(0);

    wide.dispose();
    deep.dispose();
  });

  it("RA-90 places every track under its owner, by identity, with free tracks apart", () => {
    const { runtime, committed } = rig(evenly(2, 2));

    const free = runtime.addTrack({ id: "loose" });
    const document = committed();

    expect(free.id).toBe("~/loose");
    expect(document.schemaVersion).toBe(5);
    expect(document.motions.map((motion) => motion.id)).toEqual(["m0", "m1"]);
    expect(idsOf(document.motions[0]?.tracks)).toEqual(["t0", "t1"]);
    expect(idsOf(document.motions[1]?.tracks)).toEqual(["t0", "t1"]);
    expect(idsOf(document.freeTracks)).toEqual(["loose"]);
    expect(borrowed(runtime, document)).toEqual([]);

    // A motion that owns nothing answers with an empty list rather than with no key, because that
    // is the document a loader accepts and what a runtime-added Motion starts as.
    runtime.track("m1/t0").remove();
    runtime.track("m1/t1").remove();

    expect(committed().motions[1]?.tracks).toEqual([]);
    expect(idsOf(committed().motions[0]?.tracks)).toEqual(["t0", "t1"]);
    expect(borrowed(runtime, committed())).toEqual([]);

    runtime.dispose();
  });

  it("RA-91 keeps the walk and the single-motion owner answering one list", () => {
    const { runtime, committed } = rig(evenly(2, 1));

    // Interleaved on purpose. Map order and grouping order are different orders here, so a walk
    // that buckets has to answer in map order rather than in the order it filled the buckets.
    runtime.addTrack({ id: "a" }, { motionId: "m1" });
    runtime.addTrack({ id: "b" }, { motionId: "m0" });
    runtime.addTrack({ id: "loose" });
    runtime.addTrack({ id: "c" }, { motionId: "m1" });

    const document = committed();

    expect(idsOf(document.motions[0]?.tracks)).toEqual(["t0", "b"]);
    expect(idsOf(document.motions[1]?.tracks)).toEqual(["t0", "a", "c"]);
    expect(idsOf(document.freeTracks)).toEqual(["loose"]);
    expect(borrowed(runtime, document)).toEqual([]);

    // The three readers `#ownedBy` still has must answer the list the walk did, or one question has
    // two mechanisms again, which is the defect finding 2 closed one member over.
    expect(runtime.motion("m1").trackIds).toEqual(["m1/t0", "m1/a", "m1/c"]);
    expect(idsOf(runtime.motion("m1").definition.tracks)).toEqual(["t0", "a", "c"]);
    expect(() => runtime.destroyMotion("m1")).toThrow(
      'Motion "m1" still has 3 track(s). Remove them before destroying it.',
    );

    runtime.dispose();
  });
});
