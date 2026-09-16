import { describe, expect, it } from "vitest";
import type { ProjectDefinition } from "../../../src/contract/v5";
import { createManualClock } from "../../../src/ports/clock";
import { createFakeScheduler } from "../../../src/testing/fakes";
import { GraphRuntime } from "../../../src/runtime/graph-runtime";

/**
 * Issue #395: the frame a failed publication does not carry, pinned rather than argued.
 *
 * `#flushSeeds` re-queues the seeds it was carrying when a publication fails, and re-queues them
 * with no frame. Nothing said whether that was a decision or an oversight, which is the whole of the
 * finding: a later slice could "fix" it by carrying the frame forward and no case would object.
 *
 * It is a decision, and the order is what makes it one. `flushAtTick` records the frame through
 * `#advanceTick` **before** `#flushSeeds` runs, so by the time a publication can fail the frame has
 * already been reached and `runtime.tick` already says so. What a publisher failure loses is
 * therefore not the frame but the pairing between it and the publication that eventually carries the
 * seeds: the retry goes through `flush`, at the frame the runtime is already on. Carrying the frame
 * forward instead would make the replay claim to reach a frame that was reached by the call that
 * failed, which is a false claim rather than a recovered one, and the seeds are what the retry is
 * actually for.
 *
 * The composition supplier is the seam this drives, because it is the one injected point inside the
 * publication boundary a case can make fail on demand; the boundary covers it for exactly that
 * reason, per ADR-086. What is pinned is the payload either side of the failure, not which statement
 * threw. See ADR-084 and ADR-088.
 */

const project: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    { id: "hero", trigger: { type: "manual" }, tracks: [{ id: "arm" }] },
    { id: "caption", trigger: { type: "manual" }, tracks: [{ id: "label" }] },
  ],
};

describe("a publisher failure re-queues the seeds and deliberately carries no frame", () => {
  it("keeps the seeds, keeps the frame it already reached, and replays without asking for one", () => {
    const clock = createManualClock();
    const scheduler = createFakeScheduler();
    const failure = new Error("composition refused");
    let refusing = false;
    const compose = (node: { id: string }) => {
      if (refusing) throw failure;
      return () => ({ values: { node: node.id }, sourceProgress: 0, sourceRevisions: {} });
    };
    const runtime = new GraphRuntime(project, clock, compose, { scheduler });
    runtime.attach("hero/arm");

    let acted = false;
    runtime.registry.subscribeNode("hero/arm", () => {
      if (acted) return;
      acted = true;
      runtime.flushAtTick(["caption/label"], 2);
    });

    clock.tick();

    // A deferral carrying both halves of a payload: one seed, and the frame it asked for.
    expect(runtime.tick).toBe(1);
    expect(runtime.pendingSeeds).toEqual(["caption/label"]);
    expect(scheduler.pending).toHaveLength(1);

    // `replaceGraph` colds the memo and releases the cached publisher nodes, which is what puts the
    // injected supplier back inside the publication boundary.
    runtime.replaceGraph(project);
    refusing = true;
    scheduler.flush();

    // The drain replayed through `flushAtTick`, so the frame was recorded before anything could
    // fail, and then the publication failed and reported under its own rule.
    expect(runtime.tick).toBe(2);
    expect(runtime.lastFlushError?.ruleId).toBe("flush-failure");
    expect(runtime.lastFlushError?.message).toMatch(/Scheduled flush failed/);
    // The seeds survived, which is the guarantee. The frame did not travel with them, which is the
    // deliberate loss this case exists to pin: it was consumed by the publication that failed.
    expect(runtime.pendingSeeds).toEqual(["caption/label"]);
    expect(scheduler.pending).toHaveLength(1);

    refusing = false;
    scheduler.flush();

    // The retry published the seeds through `flush`, at the frame the runtime was already on. It did
    // not re-reach frame 2 and it did not invent a later one, and both of those are what carrying
    // the frame forward would have had to mean.
    expect(runtime.registry.get("caption/label")?.values.node).toBe("caption/label");
    expect(runtime.pendingSeeds).toEqual([]);
    expect(runtime.tick).toBe(2);

    // And the frame cannot be walked back to be paired with the retry, which is the other half of
    // why the loss is deliberate rather than repairable: monotonicity refuses it outright.
    expect(() => runtime.flushAtTick(["hero/arm"], 1)).toThrow(/monotonic/);
    runtime.dispose();
  });
});
