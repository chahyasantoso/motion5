import { afterEach, describe, expect, it, vi } from "vitest";
import type { PatchBatch, ProjectDefinition } from "../../../src/contract/v5";
import type { AuthoredValues, TrackHandle } from "../../../src/contract/track-handle";
import { createManualClock } from "../../../src/ports/clock";
import { GraphPublisher } from "../../../src/runtime/graph-publisher";
import { ProjectRuntime, type StagedTrack } from "../../../src/runtime/project-runtime";

/**
 * Phase 6 of issue #362: the value tier gets the transaction the structural tier already had.
 *
 * `setValues`, `overrideValues`, `setKeyframe`, `removeKeyframe` and `seek` each end at their own
 * single-node publication, so a caller editing `n` nodes per frame publishes `n` times, notifies
 * every subscriber `n` times and moves the sequence `n` times. `values(recipe)` is the second tier:
 * the verbs reached inside it stage a seed and answer a deferred batch, and the one publication
 * happens once, when the recipe returns.
 *
 * The whole block is red the day it lands, and that is a property of the slice rather than a target.
 * This is a capability, so nothing answered before: eight of eight fail on assertions rather than on
 * a missing member, which is what the locally declared seam below is for. That declaration is
 * deleted in the commit that lands the source.
 *
 * What each case would fail without is named at the case. The one that carries the invariant is
 * `RA-162`, and it is a counter and an oracle in one rig, because a counter cannot see a stale
 * composer while an oracle alone is green against a tier that never batched anything.
 */
interface ValueRecipe {
  seek(nodeId: string, progress: number): PatchBatch;
  setValues(nodeId: string, values: AuthoredValues): PatchBatch;
  overrideValues(nodeId: string, values: AuthoredValues): PatchBatch;
  track(nodeId: string): TrackHandle;
  tryTrack(nodeId: string): TrackHandle | undefined;
}
interface ValueBatchSeam {
  values(recipe: (batch: ValueRecipe) => void): PatchBatch;
}

const NODES = ["rig/a", "rig/b", "rig/c"] as const;

const PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    {
      id: "rig",
      trigger: { type: "manual" },
      tracks: [{ id: "a" }, { id: "b" }, { id: "c" }],
    },
  ],
  freeTracks: [{ id: "cursor" }],
};

// The prototype rather than the instance, because `GraphRuntime` owns its publisher and never hands
// it out. `vi.spyOn` keeps the original implementation, so every publication below really runs.
const flushed = vi.spyOn(GraphPublisher.prototype, "flush");

function publishedValues(runtime: ProjectRuntime): Record<string, unknown> {
  return Object.fromEntries(NODES.map((nodeId) => [nodeId, runtime.graph.registry.get(nodeId)]));
}

/**
 * One mounted runtime whose composition is a map the live-value hook writes into.
 *
 * The hook is what makes a written value readable at all: nothing in this rig compiles a timeline,
 * so a `compose` that answers from what the writer received is the only place the write shows up.
 * That is deliberate for the oracle, which compares what was published rather than what was called,
 * because a spy on the hook cannot tell a correct batch from one that published stale values.
 */
function rig(options: { escalate?: boolean } = {}) {
  const state = new Map<string, Record<string, unknown>>();
  const progressed: (readonly [string, number])[] = [];
  const staged: string[] = [];
  const runtime = new ProjectRuntime(PROJECT, {
    clock: createManualClock(),
    compose: (node) => () => ({
      values: { ...(state.get(node.id) ?? {}) },
      sourceProgress: 0,
      sourceRevisions: {},
    }),
    writeValues: (nodeId, values) => {
      state.set(nodeId, { ...values });
      return options.escalate === true ? { patched: false, progress: 0.25 } : undefined;
    },
    setProgress: (nodeId, progress) => {
      progressed.push([nodeId, progress]);
    },
    stageTrack: (_track, nodeId): StagedTrack => {
      staged.push(nodeId);
      return { commit: () => undefined, rollback: () => undefined };
    },
  }) as ProjectRuntime & ValueBatchSeam;
  for (const nodeId of NODES) runtime.mount(nodeId);
  flushed.mockClear();
  return { runtime, progressed, staged, published: () => publishedValues(runtime) };
}

afterEach(() => {
  flushed.mockClear();
});

describe("the value tier publishes once for a batch, and refuses every tier that is not it", () => {
  it("RA-162 publishes one batch for three nodes and publishes exactly what three separate writes publish", () => {
    const batched = rig();
    expect(typeof batched.runtime.values).toBe("function");
    try {
      const before = batched.runtime.graph.sequence;
      const batch = batched.runtime.values((edit) => {
        edit.setValues("rig/a", { x: 1 });
        edit.setValues("rig/b", { x: 2 });
        edit.track("rig/c").setValues({ x: 3 });
      });

      // The counter. One publication and one sequence move for three nodes, and the batch handed
      // back is the real one rather than the deferred shape the staged verbs answered.
      expect(flushed).toHaveBeenCalledTimes(1);
      expect(batched.runtime.graph.sequence).toBe(before + 1);
      expect([...batch.seeds].sort()).toEqual([...NODES].sort());
      expect(batch.patches.map((patch) => patch.nodeId).sort()).toEqual([...NODES].sort());

      flushed.mockClear();

      // The oracle, in the same rig, because a counter cannot see a stale composer: a tier that
      // published once from the wrong values would pass every assertion above.
      const singly = rig();
      try {
        singly.runtime.setValues("rig/a", { x: 1 });
        singly.runtime.setValues("rig/b", { x: 2 });
        singly.runtime.track("rig/c").setValues({ x: 3 });

        // The other direction of the counter, in the same rig, so it cannot be green against a
        // publisher nobody called: three separate writes are what `n` publications look like.
        expect(flushed).toHaveBeenCalledTimes(NODES.length);
        expect(singly.runtime.graph.sequence).toBe(NODES.length);
        expect(batched.published()).toEqual(singly.published());
      } finally {
        singly.runtime.dispose();
      }
    } finally {
      batched.runtime.dispose();
    }
  });

  it("RA-163 answers a staged write with a deferred batch naming its own node and carrying no patch", () => {
    const { runtime } = rig();
    expect(typeof runtime.values).toBe("function");
    try {
      let staged: PatchBatch | undefined;
      let sequenceInside = -1;
      runtime.values((edit) => {
        staged = edit.setValues("rig/a", { x: 1 });
        sequenceInside = runtime.graph.sequence;
      });

      // Named rather than empty, because the seed is the one thing a caller can still act on, and
      // the diagnostic says the publication was queued instead of pretending one happened.
      expect(staged?.seeds).toEqual(["rig/a"]);
      expect(staged?.patches).toEqual([]);
      expect(staged?.diagnostics.map((diagnostic) => diagnostic.ruleId)).toEqual([
        "value-batch-deferred",
      ]);
      // And nothing had published at the point the verb answered, which is what makes that batch
      // the deferral rather than a copy of a publication which already ran.
      expect(sequenceInside).toBe(0);
      expect(flushed).toHaveBeenCalledTimes(1);
    } finally {
      runtime.dispose();
    }
  });

  it("RA-164 refuses a batch inside a batch and a batch inside a recipe, and accepts both in sequence", () => {
    const { runtime } = rig();
    expect(typeof runtime.values).toBe("function");
    try {
      expect(() =>
        runtime.values(() => {
          runtime.values(() => undefined);
        }),
      ).toThrow("value-batch-immediate");

      expect(() =>
        runtime.edit(() => {
          runtime.values(() => undefined);
        }),
      ).toThrow("schema-transaction-immediate");

      // The accepting direction, in the same rig, because a tier that refuses everything is green
      // against the two refusals alone. Neither throw left a batch open behind it either.
      expect(() => runtime.edit(() => undefined)).not.toThrow();
      const batch = runtime.values((edit) => {
        edit.setValues("rig/a", { x: 1 });
      });
      expect(batch.seeds).toEqual(["rig/a"]);
    } finally {
      runtime.dispose();
    }
  });

  it("RA-165 refuses every verb that publishes, mounts or commits inside a batch, and accepts each outside it", () => {
    const { runtime } = rig();
    expect(typeof runtime.values).toBe("function");
    try {
      runtime.values(() => {
        expect(() => runtime.invalidate(["rig/a"])).toThrow("value-batch-immediate");
        expect(() => runtime.mount("~/cursor")).toThrow("value-batch-immediate");
        expect(() => runtime.unmount("rig/a")).toThrow("value-batch-immediate");
        expect(() => runtime.signal("rig", { type: "start" })).toThrow("value-batch-immediate");
        // The structural family refuses at the one member all of them reach, and it names the
        // condition rather than a verb, because the caller wrote no verb list.
        expect(() => runtime.addTrack({ id: "d" }, { motionId: "rig" })).toThrow(
          "value-batch-structural",
        );
        expect(() => runtime.track("rig/a").remove()).toThrow("value-batch-structural");
      });

      // Refused before anything was staged, so the batch above committed none of it.
      expect(runtime.motion("rig").trackIds).toEqual([...NODES]);
      expect([...runtime.mountedNodeIds()].sort()).toEqual([...NODES].sort());

      // And each one applies normally once the batch has returned, which is what says the refusal
      // belongs to the batch rather than to the verb.
      expect(() => runtime.invalidate(["rig/a"])).not.toThrow();
      expect(() => runtime.mount("~/cursor")).not.toThrow();
      expect(() => runtime.unmount("rig/a")).not.toThrow();
      expect(() => runtime.signal("rig", { type: "start" })).not.toThrow();
      expect(runtime.addTrack({ id: "d" }, { motionId: "rig" }).live).toBe(true);
    } finally {
      runtime.dispose();
    }
  });

  it("RA-166 joins the batch from both endings of a value write, including the escalated one that stages and re-seeks", () => {
    const escalating = rig({ escalate: true });
    expect(typeof escalating.runtime.values).toBe("function");
    try {
      const batch = escalating.runtime.values((edit) => {
        edit.setValues("rig/a", { x: 1 });
        edit.overrideValues("rig/b", { x: 2 });
      });

      // The ending that stages a Track and re-seeks is the one with a settle collector in front of
      // its publication, so it is the ending that could still have published on its own.
      expect(escalating.staged).toEqual(["rig/a", "rig/b"]);
      expect(escalating.progressed).toEqual([
        ["rig/a", 0.25],
        ["rig/b", 0.25],
      ]);
      expect(flushed).toHaveBeenCalledTimes(1);
      expect([...batch.seeds].sort()).toEqual(["rig/a", "rig/b"]);

      flushed.mockClear();

      // The direct ending, in the same rig shape, because a case that only ever drove the
      // escalation would say nothing about the path every static write takes.
      const direct = rig();
      try {
        const plain = direct.runtime.values((edit) => {
          edit.setValues("rig/a", { x: 1 });
          edit.seek("rig/b", 0.5);
        });
        expect(direct.staged).toEqual([]);
        expect(flushed).toHaveBeenCalledTimes(1);
        expect([...plain.seeds].sort()).toEqual(["rig/a", "rig/b"]);
      } finally {
        direct.runtime.dispose();
      }
    } finally {
      escalating.runtime.dispose();
    }
  });

  it("RA-167 publishes nothing for a recipe that staged nothing and still answers a batch", () => {
    const { runtime } = rig();
    expect(typeof runtime.values).toBe("function");
    try {
      const batch = runtime.values(() => undefined);

      // An empty seed list causes no invalidate at all, because even an empty batch opens one,
      // notifies every batch subscriber and moves the sequence.
      expect(flushed).not.toHaveBeenCalled();
      expect(runtime.graph.sequence).toBe(0);
      expect(batch.seeds).toEqual([]);
      expect(batch.patches).toEqual([]);
      expect(batch.diagnostics).toEqual([]);

      // A recipe that only read is the same answer, so the emptiness is about what was staged
      // rather than about whether the recipe did anything at all.
      const read = runtime.values((edit) => {
        expect(edit.tryTrack("rig/a")?.live).toBe(true);
        expect(edit.tryTrack("rig/nothing")).toBeUndefined();
      });
      expect(read.seeds).toEqual([]);
      expect(flushed).not.toHaveBeenCalled();
    } finally {
      runtime.dispose();
    }
  });

  it("RA-168 leaves no batch open when a recipe throws, and publishes nothing it staged", () => {
    const { runtime, published } = rig();
    expect(typeof runtime.values).toBe("function");
    try {
      const failure = new Error("recipe failed");
      expect(() =>
        runtime.values((edit) => {
          edit.setValues("rig/a", { x: 1 });
          throw failure;
        }),
      ).toThrow(failure);

      // The caller's throw, unwrapped, and the publication it staged never happened.
      expect(flushed).not.toHaveBeenCalled();
      expect(published()["rig/a"]).toBeUndefined();

      // The field is cleared in `finally`, so the next batch is an ordinary one rather than a
      // reentrancy refusal against a batch that nothing closed.
      const batch = runtime.values((edit) => {
        edit.setValues("rig/b", { x: 2 });
      });
      expect(batch.seeds).toEqual(["rig/b"]);
      expect(flushed).toHaveBeenCalledTimes(1);
    } finally {
      runtime.dispose();
    }
  });

  it("RA-169 reports a recipe that disposed the project instead of answering it a batch", () => {
    const { runtime } = rig();
    expect(typeof runtime.values).toBe("function");

    expect(() =>
      runtime.values((edit) => {
        edit.setValues("rig/a", { x: 1 });
        runtime.dispose();
      }),
    ).toThrow("ProjectRuntime is disposed.");

    // Reported rather than answered, because the batch is the answer to the call and a disposed
    // project must not publish, must not move the sequence, and must not hand back an empty batch
    // claiming that it did.
    expect(flushed).not.toHaveBeenCalled();
    // The same string every other value verb answers on a disposed project, so the two tiers do
    // not start answering one condition two ways.
    expect(() => runtime.values(() => undefined)).toThrow("ProjectRuntime is disposed.");
  });
});
