import { describe, expect, it } from "vitest";
import type { ProjectDefinition } from "../../../src/contract/v5";
import { createManualClock } from "../../../src/ports/clock";
import { createFakeScheduler } from "../../../src/testing/fakes";
import { GraphRuntime } from "../../../src/runtime/graph-runtime";

/**
 * Issue #378, found by the quality pass over #375.
 *
 * `#flushSeeds` drained the pending payload and derived the publisher snapshot before the boundary
 * that re-queues it. Derivation is not runtime bookkeeping: on a cold memo it builds publisher
 * nodes, and building one calls the constructor-supplied `compose` and `interpolated` suppliers. So
 * caller code ran between the drain and the `catch` written to preserve that work, and a supplier
 * that threw dropped every seed the call had just taken. From the clock path the loss was quiet,
 * because the next tick re-seeds from the member set; from a direct `flush(seeds)` it was silent
 * and total.
 *
 * The ordering predates the split, so #375 did not introduce it; extracting the three statements
 * into one owner is what made the missing boundary legible. The docblock claimed more than the code
 * delivered, and that is the part worth pinning: a publisher failure re-queued and a snapshot
 * failure did not, and a reader had no reason to expect the distinction. See ADR-086.
 */

const project: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    { id: "hero", trigger: { type: "manual" }, tracks: [{ id: "arm" }] },
    { id: "caption", trigger: { type: "manual" }, tracks: [{ id: "label" }] },
  ],
};

describe("the publication boundary covers everything after the drain", () => {
  it("keeps the drained seeds when the injected compose supplier throws", () => {
    const clock = createManualClock();
    const scheduler = createFakeScheduler();
    const failure = new Error("compose refused");
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
      runtime.flush(["caption/label"]);
    });

    clock.tick();
    expect(runtime.pendingSeeds).toEqual(["caption/label"]);

    // `replaceGraph` colds the memo and releases the cached publisher nodes, which is what puts the
    // injected supplier back on the publication path. Nothing else here needs the graph to move.
    runtime.replaceGraph(project);
    refusing = true;

    // Red before this change: the pending seed was taken and cleared before the boundary that
    // restores it, so the `catch` never saw it and a direct caller lost the work outright.
    expect(() => runtime.flush(["hero/arm"])).toThrow(failure);
    expect([...runtime.pendingSeeds].sort()).toEqual(["caption/label", "hero/arm"]);

    // Deferred rather than dropped, which is what the docblock always claimed: the follow-up the
    // failed publication booked publishes both seeds once the supplier answers again.
    refusing = false;
    scheduler.flush();
    expect(runtime.pendingSeeds).toEqual([]);
    const heroArmPatch = runtime.registry.get("hero/arm");
    if (heroArmPatch?.status !== "ready")
      throw new Error(`hero/arm is ${heroArmPatch?.status ?? "absent"}, not ready.`);
    expect(heroArmPatch.values.node).toBe("hero/arm");
    const captionLabelPatch = runtime.registry.get("caption/label");
    if (captionLabelPatch?.status !== "ready")
      throw new Error(`caption/label is ${captionLabelPatch?.status ?? "absent"}, not ready.`);
    expect(captionLabelPatch.values.node).toBe("caption/label");
    runtime.dispose();
  });
});
