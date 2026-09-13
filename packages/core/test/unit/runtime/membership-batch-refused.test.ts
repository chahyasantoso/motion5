import { afterEach, describe, expect, it, vi } from "vitest";
import type { ProjectDefinition } from "../../../src/contract/v5";
import { createManualClock } from "../../../src/ports/clock";
import { GraphPublisher } from "../../../src/runtime/graph-publisher";
import { GraphRuntime } from "../../../src/runtime/graph-runtime";
import { ProjectRuntime } from "../../../src/runtime/project-runtime";

/**
 * Phase 5 of issue #362, and the phase ends in a refusal rather than in a verb. See ADR-077.
 *
 * The plan priced `mountAll` and `unmountAll` at one membership revision bump and one
 * `PublisherSnapshot` re-derivation instead of `n`, plus all-or-nothing attempt semantics through
 * the collector the teardown paths already use. Neither half is there to buy. The revision is the
 * key `#snapshotFor` compares its memo against rather than an invalidation, and `#snapshotFor` is
 * reached from `flush` and from nowhere else, so `n` mounts before one flush already derive one
 * snapshot. `unmount` refuses nothing per id, and `mount`'s two per-id refusals are both answered
 * before the call by the readers phase 2 landed.
 *
 * These four cases are green the day they land, and that is stated rather than dressed up: this
 * slice changes no behaviour, so failing-first does not apply, and what they are is the tripwire
 * under the decision. What each one would fail without is named at the case.
 *
 * `publisher-snapshot-memo.test.ts` owns the memo's keying, `RA-23` through `RA-26`. This file owns
 * the narrower claim a keying case cannot make: what a mount loop costs, and therefore what a batch
 * over it would save.
 */
const NODES = ["hero/arm", "hero/hand", "hero/leg", "hero/foot"] as const;

const PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    {
      id: "hero",
      trigger: { type: "manual" },
      tracks: [{ id: "arm" }, { id: "hand" }, { id: "leg" }, { id: "foot" }],
    },
  ],
  freeTracks: [{ id: "cursor" }],
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
const derivations = () => new Set(handed()).size;

function loaded(): ProjectRuntime {
  return new ProjectRuntime(PROJECT, { clock: createManualClock(), compose });
}

afterEach(() => {
  flushed.mockClear();
});

describe("a mount loop is what mounting a document costs, so no batch verb is added", () => {
  it("RA-158 derives one publisher snapshot for a mount loop, against one per mount when a flush sits between them", () => {
    const clock = createManualClock();
    const runtime = new GraphRuntime(PROJECT, clock, compose);

    for (const nodeId of NODES) runtime.attach(nodeId);

    // Mounting derives nothing and publishes nothing of its own, so there is no publication for a
    // batch to collapse either: the publisher has not been asked anything yet.
    expect(flushed).not.toHaveBeenCalled();
    expect(runtime.memberCount).toBe(NODES.length);

    clock.tick();

    // The number the phase asked for. Four mounts, one derivation, because the revision is the
    // memo's key rather than an invalidation and the derivation is pulled at the flush.
    expect(derivations()).toBe(1);
    expect([...(handed()[0]?.members ?? [])].sort()).toEqual([...NODES].sort());

    runtime.dispose();
    flushed.mockClear();

    // The other direction, in the same rig, because a counter that can only ever answer one is green
    // against a publisher nobody called. A flush between the mounts is what `n` derivations look
    // like, and the loop above is not that shape.
    const alternatingClock = createManualClock();
    const alternating = new GraphRuntime(PROJECT, alternatingClock, compose);
    for (const nodeId of NODES) {
      alternating.attach(nodeId);
      alternatingClock.tick();
    }

    expect(derivations()).toBe(NODES.length);

    alternating.dispose();
  });

  it("RA-159 accepts an unmount of a node it does not hold, so a batch would have no partial failure to collect", () => {
    const runtime = loaded();
    try {
      // The accepting direction first, so the no-ops below are a claim about this verb rather than
      // about a rig that never mounted anything.
      runtime.mount("hero/arm");
      expect(runtime.mountedNodeIds()).toEqual(["hero/arm"]);
      runtime.unmount("hero/arm");
      expect(runtime.mountedNodeIds()).toEqual([]);

      // Total, and by the same line for all three: a node already unmounted, a node this project
      // never mounted, and an id the graph does not carry at all.
      expect(() => runtime.unmount("hero/arm")).not.toThrow();
      expect(() => runtime.unmount("hero/hand")).not.toThrow();
      expect(() => runtime.unmount("hero/nothing")).not.toThrow();
      expect(runtime.mountedNodeIds()).toEqual([]);
      expect(runtime.instanceCount).toBe(0);
    } finally {
      runtime.dispose();
    }
  });

  it("RA-160 mounts every id the enumeration readers answer, so a per-id refusal is unreachable through them", () => {
    const runtime = loaded();
    try {
      const ids = [
        ...runtime.motionIds().flatMap((motionId) => [...runtime.motion(motionId).trackIds]),
        ...runtime.freeTrackIds(),
      ];
      expect([...ids].sort()).toEqual([...NODES, "~/cursor"].sort());

      for (const nodeId of ids) expect(() => runtime.mount(nodeId)).not.toThrow();
      expect([...runtime.mountedNodeIds()].sort()).toEqual([...ids].sort());

      // The two refusals a per-id loop can meet, and neither is reachable from the list above. This
      // one is answered by `mountedNodeIds()`, which now names every id in it.
      expect(() => runtime.mount("hero/arm")).toThrow(/already mounted/);
      // And this one by the readers themselves, which cannot name a node the graph does not carry.
      expect(() => runtime.mount("hero/nothing")).toThrow(/Unknown graph node/);
    } finally {
      runtime.dispose();
    }
  });

  it("RA-161 leaves a refused loop's progress readable, so all-or-nothing would own nothing a total reader does not", () => {
    const runtime = loaded();
    try {
      const attempted = ["hero/arm", "hero/hand", "hero/nothing", "hero/leg"];
      expect(() => {
        for (const nodeId of attempted) runtime.mount(nodeId);
      }).toThrow('Unknown graph node "hero/nothing"');

      // Exactly the prefix, named by the runtime rather than reconstructed by the caller, which is
      // the question a collector would be a second owner of.
      expect(runtime.mountedNodeIds()).toEqual(["hero/arm", "hero/hand"]);

      // And the loop resumes from that answer, which is the progress a rollback would have undone.
      for (const nodeId of NODES)
        if (!runtime.mountedNodeIds().includes(nodeId)) runtime.mount(nodeId);
      expect([...runtime.mountedNodeIds()].sort()).toEqual([...NODES].sort());
    } finally {
      runtime.dispose();
    }
  });
});
