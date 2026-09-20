import { describe, expect, it } from "vitest";
import type { ProjectDefinition } from "../../../src/contract/v5";
import { createManualClock } from "../../../src/ports/clock";
import { createFakeScheduler } from "../../../src/testing/fakes";
import { GraphRuntime } from "../../../src/runtime/graph-runtime";

/**
 * Issues #395, #411 and #417: which frame a failed publication carries, and which it does not.
 *
 * `#flushSeeds` re-queues the seeds it was carrying when a publication fails. Whether a frame goes
 * with them turns on one question, and #417 is that this file used to answer only half of it: a frame
 * the publication reached is not carried, and a frame it never reached is.
 *
 * The reached half is the first case, and the order is what makes it a decision rather than an
 * oversight. `flushAtTick` records the frame through `#advanceTick` **before** `#flushSeeds` runs, so
 * by the time a publication can fail the frame has already been reached and `runtime.tick` already
 * says so. What a publisher failure loses is therefore not the frame but the pairing between it and
 * the publication that eventually carries the seeds: the retry goes through `flush`, at the frame the
 * runtime is already on. Carrying it forward would make the replay claim to reach a frame that was
 * reached by the call that failed, which is a false claim rather than a recovered one, and the seeds
 * are what the retry is actually for.
 *
 * The unreached half is the second case, and it is why #417 narrows the claim rather than the code.
 * `retaining` keeps a deferred frame the publication has not reached and `requeuing` preserves it, so
 * a direct `flush` failing over a later pending frame re-queues its seeds beside that frame. Dropping
 * it would lose a frame nobody reached, which is what ADR-084 and ADR-088 decided against.
 *
 * #411 asked the first case to witness the loss it names, by publishing with `flush([])` after the
 * failure and asserting the scheduler then holds nothing. That is refused, and the reason is
 * recorded rather than dropped: a drain replays **at** the frame it deferred, so in this scenario the
 * frame the payload asked for always equals the frame the failing call reached, and `retaining`
 * answers `NOTHING_PENDING` for a frame at or below the reached one whichever way `requeuing` is
 * written. No observation here can differ, so the assertion would be green for both implementations,
 * which is the defect #411 is about rather than a fix for it. An unreached frame is the only frame
 * whose presence is observable, so the second case is the witness and the first stops claiming to be
 * one: it pins that the seeds survive and that monotonicity refuses walking the frame back.
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

describe("a publisher failure re-queues the seeds, and carries only a frame it never reached", () => {
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
    // The seeds survived, which is the guarantee. The frame did not travel with them because this
    // publication had already reached it, and that absence is not observable from here: the case
    // below is the one that watches an unreached frame survive. Issues #411 and #417.
    expect(runtime.pendingSeeds).toEqual(["caption/label"]);
    expect(scheduler.pending).toHaveLength(1);

    refusing = false;
    scheduler.flush();

    // The retry published the seeds through `flush`, at the frame the runtime was already on. It did
    // not re-reach frame 2 and it did not invent a later one, and both of those are what carrying
    // the frame forward would have had to mean.
    const captionLabelPatch = runtime.registry.get("caption/label");
    if (captionLabelPatch?.status !== "ready")
      throw new Error(`caption/label is ${captionLabelPatch?.status ?? "absent"}, not ready.`);
    expect(captionLabelPatch.values.node).toBe("caption/label");
    expect(runtime.pendingSeeds).toEqual([]);
    expect(runtime.tick).toBe(2);

    // And the frame cannot be walked back to be paired with the retry, which is the other half of
    // why the loss is deliberate rather than repairable: monotonicity refuses it outright.
    expect(() => runtime.flushAtTick(["hero/arm"], 1)).toThrow(/monotonic/);
    runtime.dispose();
  });

  it("keeps a frame no publication reached, and re-queues the failed seeds beside it", () => {
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
      // Frame-only, and for a frame two ahead of the one being published, so nothing reaches it
      // before the failure below.
      runtime.flushAtTick([], 3);
    });

    clock.tick();

    // The payload states no seeds, so `pendingSeeds` cannot see it and the frame is what it holds.
    expect(runtime.tick).toBe(1);
    expect(runtime.pendingSeeds).toEqual([]);
    expect(scheduler.pending).toHaveLength(1);

    runtime.replaceGraph(project);
    refusing = true;

    // A direct `flush` has no parameter to reach frame 3 with, so it fails over a frame it could
    // never have published.
    expect(() => runtime.flush(["caption/label"])).toThrow(failure);

    // Both halves survive, and this is the assertion the pair was missing: the frame is still
    // pending, which is why the replay below can reach it, and the seeds this call was carrying are
    // re-queued beside it rather than replacing it.
    expect(runtime.tick).toBe(1);
    expect(runtime.pendingSeeds).toEqual(["caption/label"]);
    expect(scheduler.pending).toHaveLength(1);

    refusing = false;
    scheduler.flush();

    // Green before this change as well as after, and deliberately so: #417 is that the prose was
    // wrong, not the behaviour. Carrying the frame here would be the regression, and dropping it
    // would leave frame 3 unreachable with the seeds published at frame 1.
    expect(runtime.tick).toBe(3);
    const captionLabelPatch2 = runtime.registry.get("caption/label");
    if (captionLabelPatch2?.status !== "ready")
      throw new Error(`caption/label is ${captionLabelPatch2?.status ?? "absent"}, not ready.`);
    expect(captionLabelPatch2.values.node).toBe("caption/label");
    expect(runtime.pendingSeeds).toEqual([]);
    expect(runtime.lastFlushError).toBeUndefined();
    runtime.dispose();
  });
});
