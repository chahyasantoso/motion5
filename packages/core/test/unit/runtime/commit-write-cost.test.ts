import { describe, expect, it } from "vitest";
import { IncrementalGraphBuilder } from "../../../src/adapters/graph-builder/incremental";
import type { MotionDefinition, ProjectDefinition } from "../../../src/contract/v5";
import type { GraphBuildResult } from "../../../src/graph/ir";
import { createManualClock } from "../../../src/ports/clock";
import { ProjectRuntime } from "../../../src/runtime/project-runtime";

/**
 * Issue #223, the rest of finding 3: what a commit writes, and what an authored read derives.
 *
 * `RA-89` closed the first of its pieces, which was what the snapshot walks. The three the re-review
 * left named and the two smaller ones beside them are one subject rather than five, because they are
 * one cost class: work `ProjectRuntime` does per commit, per op or per access, in front of a graph
 * layer that reads its shape and allocates nothing for it.
 *
 * The adoption cleared both retained maps and re-`set` every entry into them, so a commit that moved
 * one entry paid `O(V)` writes and paid them for the half of the schema that did not move at all.
 * Every entry point copied the pair it was about to write, so a recipe of n ops over V tracks copied
 * V n times, and the one thing `edit` collapsed to one was the thing `RA-65` counts.
 * `withAuthoredValues` searched the flattened entries once per written key. `handle.requires` derived
 * and froze the whole list on every access, on a getter a devtool polls.
 *
 * None of them changes what anything answers, so every case here is a counter or an oracle, and the
 * counters are call counts rather than stopwatches: a timing assertion cannot fail for a reason a
 * reader can act on. Both instruments are precise for the reason `RA-89`'s is, and each one says what
 * it deliberately cannot see.
 *
 * `RA-7` owns whether the committed graph and the retained definitions agree, `RA-65` and `RA-66` own
 * what one recipe costs in builds, replacements and flushes, and `RA-89` through `RA-91` own the
 * document a commit hands over. Nothing here restates any of them.
 *
 * `RA-95` and `RA-97` are green on purpose, and for one reason each rather than for the same one. The
 * wholesale rewrite was correct as well as expensive, so the equivalence half of it cannot fail
 * against it; and a copy taken before an entry point's last refusal is a way to get this slice wrong
 * rather than something the old code did.
 */

const MANUAL: MotionDefinition["trigger"] = { type: "manual" };
/** V, fixed across both rigs of `RA-92`, so the motion count is the only thing that differs. */
const TRACKS = 24;
const compose = (node: { id: string }) => () => ({
  values: { node: node.id },
  sourceProgress: 0,
  sourceRevisions: {},
});
/** `count` motions holding `tracks` tracks each. */
function evenly(count: number, tracks: number): ProjectDefinition {
  const motions: MotionDefinition[] = Array.from({ length: count }, (_motion, index) => ({
    id: `m${index}`,
    trigger: MANUAL,
    tracks: Array.from({ length: tracks }, (_track, position) => ({ id: `t${position}` })),
  }));
  return { schemaVersion: 5, motions };
}
/**
 * How many retained entries an operation wrote into a `Map`.
 *
 * The retained pair is private, so the count is instrumented at the prototype rather than injected,
 * and the instrument is precise rather than broad. It counts a write whose value is one of the two
 * entries this runtime retains, recognised as a `token` beside an `overlay` for a track entry or
 * beside a `definition` for a motion entry. Nothing else in `packages/core/src` holds a value of
 * either shape, so a graph node, a publisher member, a mounted instance and a bucket of track
 * definitions are all uncounted, and so is every `Map` the graph layer keeps for itself.
 *
 * A copy is counted as the V writes it is, because `new Map(pair)` reaches the same adder, and that
 * is the point rather than a leak in the instrument: the copy is the cost both commit cases below are
 * about, and a counter that could not see it would answer the same number for one copy as for two
 * hundred. What it cannot see is a rewrite that avoids the prototype, which nothing here does.
 *
 * Restored in a `finally`, because a counter left installed would follow the rest of the file.
 */
function entryWrites(operation: () => void): number {
  const original = Map.prototype.set;
  let writes = 0;
  Object.defineProperty(Map.prototype, "set", {
    value: function (this: Map<unknown, unknown>, key: unknown, value: unknown) {
      if (typeof value === "object" && value !== null) {
        const retained = "token" in value && ("overlay" in value || "definition" in value);
        if (retained) writes += 1;
      }
      return original.call(this, key, value);
    },
  });
  try {
    operation();
  } finally {
    Object.defineProperty(Map.prototype, "set", { value: original });
  }
  return writes;
}
/**
 * How many times an operation searched a flattened keyframe list.
 *
 * Narrowed to the one array whose entries carry an `authoredPath`, which is what
 * `flattenAuthoredKeyframes` answers with, so a search anywhere else in the write path is uncounted
 * and an empty array reads as neither. The authored bindings carry that field too, and nothing on
 * this path searches them, because a value-tier write reaches no graph rebuild at all.
 */
function flattenedSearches(operation: () => void): number {
  type Finder = (value: unknown, index: number, list: unknown[]) => unknown;
  const original = Array.prototype.find;
  let searches = 0;
  Object.defineProperty(Array.prototype, "find", {
    value: function (this: unknown[], predicate: Finder, thisArg?: unknown) {
      const first = this[0];
      if (typeof first === "object" && first !== null && "authoredPath" in first) searches += 1;
      return original.call(this, predicate, thisArg);
    },
  });
  try {
    operation();
  } finally {
    Object.defineProperty(Array.prototype, "find", { value: original });
  }
  return searches;
}
interface Rig {
  readonly runtime: ProjectRuntime;
  /** How many candidate documents have been built, the constructor's own included. */
  readonly builds: () => number;
  /** The document the last commit handed the builder, which is `#snapshot`'s answer verbatim. */
  readonly committed: () => ProjectDefinition;
}
/**
 * One runtime whose candidate documents are captured on the way to the real builder.
 *
 * The same seam `RA-89` reads, for two questions rather than one: how many times a commit asked the
 * builder anything, and what the last thing it asked was. The real builder still runs behind the
 * capture, so every case commits against the graph a caller would get.
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
    builds: () => seen.length,
    committed: () => {
      const last = seen[seen.length - 1];
      if (last === undefined) throw new Error("No candidate document was built.");
      return last;
    },
  };
}
/** The authored ids of a committed list, which is the order a loaded document would carry. */
function idsOf(tracks: readonly { readonly id: string }[] | undefined): readonly string[] {
  return (tracks ?? []).map((track) => track.id);
}

describe("what a commit writes, and what an authored read derives", () => {
  it("RA-92 writes each accepted entry once rather than once more per retained entry", () => {
    const wide = new ProjectRuntime(evenly(12, 2), { clock: createManualClock(), compose });
    const deep = new ProjectRuntime(evenly(2, 12), { clock: createManualClock(), compose });

    // The premise of the case, stated rather than assumed: both rigs hold the same 24 tracks, so the
    // motion count is the only thing that differs below.
    expect(wide.graph.graph.nodes).toHaveLength(TRACKS);
    expect(deep.graph.graph.nodes).toHaveLength(TRACKS);

    const wideCost = entryWrites(() => {
      wide.addTrack({ id: "added" }, { motionId: "m0" });
    });
    const deepCost = entryWrites(() => {
      deep.addTrack({ id: "added" }, { motionId: "m0" });
    });

    // A commit that moved one track writes no motion at all, so twelve motions cost what two cost.
    // The adoption cleared both retained maps and re-set every entry of both, which is the M in the
    // diff and the reason this reads as a difference between two rigs rather than as a total.
    expect(wideCost).toBe(deepCost);
    // One copy of the half this commit moved, plus the one entry it added. An upper bound rather than
    // an equality, because whether an engine routes a map clone through the patched adder is not this
    // file's business: what the case refuses is the second pass over the entries, which is 2V + M + 1
    // either way.
    expect(deepCost).toBeLessThanOrEqual(TRACKS + 1);

    wide.dispose();
    deep.dispose();
  });

  it("RA-93 copies the staged pair once per recipe rather than once per op", () => {
    const { runtime, builds } = rig(evenly(1, TRACKS));
    const added = ["a", "b", "c", "d", "e"];
    const before = builds();

    const cost = entryWrites(() => {
      runtime.edit((tx) => {
        for (const id of added) tx.addTrack({ id }, { motionId: "m0" });
      });
    });

    // One copy, taken by the first op that staged anything, and then one entry written per op. Every
    // op used to copy the pair it was about to write, so five ops over 24 tracks copied 130 entries to
    // place five, and the 200-op recipe the re-review names copied 120,000 to place 200.
    expect(cost).toBeLessThanOrEqual(TRACKS + added.length);
    // The oracle beside the counter, because a cheaper copy is worth nothing if the recipe stopped
    // committing what it staged. `RA-65` owns what one recipe costs; this asserts the pair itself.
    expect(builds()).toBe(before + 1);
    expect(runtime.motion("m0").trackIds).toHaveLength(TRACKS + added.length);
    for (const id of added) expect(runtime.track(`m0/${id}`).live).toBe(true);

    runtime.dispose();
  });

  it("RA-94 indexes the flattened record once rather than searching it per written key", () => {
    const leaves = Object.fromEntries(
      Array.from({ length: 12 }, (_leaf, index) => [`leaf${index}`, index] as [string, number]),
    );
    const project: ProjectDefinition = {
      schemaVersion: 5,
      motions: [
        {
          id: "m0",
          trigger: MANUAL,
          tracks: [{ id: "t0", keyframes: { demo: { values: leaves }, flat: 0 } }],
        },
      ],
    };
    const runtime = new ProjectRuntime(project, { clock: createManualClock(), compose });

    const searches = flattenedSearches(() => {
      runtime.setValues("m0/t0", { leaf0: 5, leaf3: 6, flat: 7 });
    });

    // Zero, because one pass over the flattened entries answers every key the write named. It was one
    // search per key, so three keys over a thirteen-entry record walked it three times, and a k-key
    // write over an n-entry record was O(k x n) to place k.
    expect(searches).toBe(0);
    // The oracle. Every key is still written back into the record the flatten says it came from: a
    // grouped leaf inside that group's values section, a flat key at the top level, and nothing else
    // in either of them moved.
    expect(runtime.track("m0/t0").definition.keyframes).toEqual({
      demo: { values: { ...leaves, leaf0: 5, leaf3: 6 } },
      flat: 7,
    });

    runtime.dispose();
  });

  it("RA-95 stages nothing for an op that refused, and commits the ops around it", () => {
    const { runtime, builds, committed } = rig(evenly(1, 1));
    const before = builds();

    runtime.edit((tx) => {
      // The caller's own catch. A refused op inside a recipe is refused to whoever called it, and the
      // recipe carries on being one transaction.
      expect(() => tx.addTrack({ id: "t0" }, { motionId: "m0" })).toThrow(
        'Track "m0/t0" already exists.',
      );
    });

    // Nothing was staged, so nothing was committed: no candidate build, no flush. This is the case
    // that fails if the copy is taken before an entry point's last refusal, because the recipe would
    // then end on a pair that differs from the retained one by identity while holding exactly the
    // same entries, and identity is the whole of how `edit` answers whether anything was staged.
    expect(builds()).toBe(before);

    runtime.edit((tx) => {
      tx.addTrack({ id: "a" }, { motionId: "m0" });
      expect(() => tx.addTrack({ id: "a" }, { motionId: "m0" })).toThrow(
        'Track "m0/a" already exists.',
      );
      tx.addTrack({ id: "b" }, { motionId: "m0" });
    });

    // One commit, holding both ops that staged and neither of the two that did not. The refusal in
    // the middle read the staged pair rather than the retained one, which is what makes it a
    // duplicate at all, and it is the reason a pair mutated in place has to be written to after every
    // refusal rather than before.
    expect(builds()).toBe(before + 1);
    expect(idsOf(committed().motions[0]?.tracks)).toEqual(["t0", "a", "b"]);

    runtime.dispose();
  });

  it("RA-96 derives one require list per definition, and a fresh one when it moves", () => {
    const project: ProjectDefinition = {
      schemaVersion: 5,
      motions: [
        {
          id: "m0",
          trigger: MANUAL,
          tracks: [
            { id: "t0", keyframes: { demo: { values: { size: 1 }, requires: { base: "~/a" } } } },
          ],
        },
      ],
      freeTracks: [{ id: "a" }],
    };
    const runtime = new ProjectRuntime(project, { clock: createManualClock(), compose });
    const handle = runtime.track("m0/t0");

    const first = handle.requires;
    expect(first).toEqual([{ plugin: "demo", slot: "base", source: "~/a" }]);
    // The same list rather than an equal one. It is a getter a devtool polls, and it read the
    // authored record and froze a whole new list on every access.
    expect(handle.requires).toBe(first);
    // Keyed on the retained definition rather than on the handle, so two handles to one node share
    // one answer and no list can outlive the definition it was derived from.
    expect(runtime.track("m0/t0").requires).toBe(first);

    // The other half of the key, because a memo that never rebuilds is green against every assertion
    // above. A value-tier write moves the retained definition and nothing about the bindings, so the
    // next list is equal and is not the same object.
    runtime.setValues("m0/t0", { size: 2 });
    const rewritten = handle.requires;
    expect(rewritten).not.toBe(first);
    expect(rewritten).toEqual(first);

    // And a structural edit moves both the definition and the answer.
    handle.setRequire("demo", "extra", "~/a");
    expect(handle.requires.map((view) => view.slot)).toEqual(["base", "extra"]);

    runtime.dispose();
  });

  it("RA-97 leaves the adopted pair answering for every half a commit did not move", () => {
    const { runtime, committed } = rig(evenly(2, 2));

    // A commit that moved only the motions leaves the track map this runtime is already holding,
    // which is the half the old adoption cleared and rewrote for nothing.
    runtime.addMotion({ id: "m2", trigger: MANUAL, tracks: [] });
    expect(runtime.track("m0/t0").live).toBe(true);
    expect(runtime.motion("m2").trackIds).toEqual([]);

    // A commit that moved only the tracks leaves the motions, and the map it adopted is the one the
    // in-place tiers write through: a value-tier write after an adoption has to land where the next
    // commit's snapshot reads it, or the committed document and the retained definition disagree,
    // which is the drift the wholesale rewrite existed to prevent.
    const added = runtime.addTrack({ id: "s", keyframes: { size: 1 } }, { motionId: "m2" });
    runtime.setValues(added.id, { size: 4 });
    expect(runtime.track(added.id).definition.keyframes).toEqual({ size: 4 });

    runtime.track("m0/t0").remove();

    const document = committed();
    expect(document.motions.map((motion) => motion.id)).toEqual(["m0", "m1", "m2"]);
    expect(idsOf(document.motions[0]?.tracks)).toEqual(["t1"]);
    expect(document.motions[2]?.tracks[0]?.keyframes).toEqual({ size: 4 });
    expect(runtime.motion("m1").trackIds).toEqual(["m1/t0", "m1/t1"]);

    runtime.dispose();
  });
});
