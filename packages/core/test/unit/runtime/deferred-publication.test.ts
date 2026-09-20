import { describe, expect, it } from "vitest";
import type { ProjectDefinition } from "../../../src/contract/v5";
import { createManualClock } from "../../../src/ports/clock";
import { createFakeScheduler } from "../../../src/testing/fakes";
import { GraphRuntime } from "../../../src/runtime/graph-runtime";
import type { PatchBatch } from "../../../src/runtime/patch-registry";

/**
 * Issues #380, #388 and #389, found by the quality passes over #375 and #386.
 *
 * All three are about the same seam from three sides: what a reentrant call leaves behind. #380 is
 * the payload, and it was half a payload: `#deferIfFlushing` queued the seeds and dropped the frame
 * number a deferred `flushAtTick` arrived with, because the drain published through `flush([])` and
 * that verb has no tick parameter at all. #389 is the booking, and it was a claim about the phase
 * rather than about the scheduler that actually held the job, so a publication that consumed the
 * drain forgot the job instead of cancelling it, and the next deferral booked a second for one
 * drain. #388 is the ordering ADR-083 calls load-bearing in both directions and nothing drove:
 * disposal from inside an active publication, where `endFlush` has to leave the runtime disposed
 * rather than walk it back to idle and the booking beside it has to be refused.
 *
 * Two of the cases here are red before the change for reasons that are worth stating, because they
 * are the ones that make this a behaviour slice rather than a refactor. The frame case reads
 * `runtime.tick` after the drain publishes, which answered the frame before the deferred one. The
 * booking case counts the scheduler's own outstanding jobs across a publication, which was two for
 * one drain. Neither is observable through a patch, which is exactly why both survived this long.
 *
 * The composer stamps every composition, so no publication is deduplicated by `samePatch` and every
 * subscriber that a case relies on is actually notified. See ADR-084.
 */

const project: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    { id: "hero", trigger: { type: "manual" }, tracks: [{ id: "arm" }] },
    { id: "caption", trigger: { type: "manual" }, tracks: [{ id: "label" }] },
  ],
};

let stamp = 0;
const compose = (node: { id: string }) => () => ({
  values: { node: node.id, stamp: (stamp += 1) },
  sourceProgress: 0,
  sourceRevisions: {},
});

function harness() {
  const clock = createManualClock();
  const scheduler = createFakeScheduler();
  const runtime = new GraphRuntime(project, clock, compose, { scheduler });
  runtime.attach("hero/arm");
  const batches: number[] = [];
  runtime.registry.subscribeBatch((batch) => batches.push(batch.tick));
  return { clock, scheduler, runtime, batches };
}

describe("a deferred publication carries the frame it arrived with", () => {
  it("records a deferred frame number when the drain publishes, and not before", () => {
    const { clock, scheduler, runtime, batches } = harness();

    let deferred: PatchBatch | undefined;
    let acted = false;
    runtime.registry.subscribeNode("hero/arm", () => {
      if (acted) return;
      acted = true;
      deferred = runtime.flushAtTick(["caption/label"], 2);
    });

    clock.tick();

    // The reentrant call publishes nothing now, so it must not record a frame that did not run.
    // That half was already right, and ADR-082 owns it.
    expect(deferred?.patches).toEqual([]);
    expect(deferred?.diagnostics.map((entry) => entry.ruleId)).toContain(
      "reentrant-flush-deferred",
    );
    expect(runtime.tick).toBe(1);
    expect(runtime.pendingSeeds).toEqual(["caption/label"]);
    expect(scheduler.pending).toHaveLength(1);
    expect(batches).toEqual([1]);

    scheduler.flush();

    // The half that was not: the frame the deferral carried is recorded by the publication that did
    // run, rather than discarded by a drain that had no way to name one.
    expect(runtime.tick).toBe(2);
    const captionLabelPatch = runtime.registry.get("caption/label");
    if (captionLabelPatch?.status !== "ready")
      throw new Error(`caption/label is ${captionLabelPatch?.status ?? "absent"}, not ready.`);
    expect(captionLabelPatch.values.node).toBe("caption/label");
    expect(runtime.pendingSeeds).toEqual([]);
    expect(batches).toEqual([1, 2]);
    expect(runtime.lastFlushError).toBeUndefined();
    runtime.dispose();
  });

  it("keeps the later of two deferred frames, and a deferral naming none erases neither", () => {
    const { clock, scheduler, runtime } = harness();

    let acted = false;
    runtime.registry.subscribeNode("hero/arm", () => {
      if (acted) return;
      acted = true;
      runtime.flushAtTick(["caption/label"], 3);
      // `flush` cannot name a frame, so it must not answer for the one already pending either.
      runtime.flush(["hero/arm"]);
      runtime.flushAtTick(["caption/label"], 2);
    });

    clock.tick();
    expect(runtime.tick).toBe(1);
    expect(scheduler.pending).toHaveLength(1);

    scheduler.flush();

    // A frame number only ever advances, so replaying the earlier of two would be refused by the
    // guard the deferral exists to preserve. The later one wins, and the plain deferral kept it.
    expect(runtime.tick).toBe(3);
    expect(runtime.pendingSeeds).toEqual([]);
    expect(runtime.lastFlushError).toBeUndefined();
    runtime.dispose();
  });

  it("records no frame for a deferral that named none", () => {
    const { clock, scheduler, runtime } = harness();

    let acted = false;
    runtime.registry.subscribeNode("hero/arm", () => {
      if (acted) return;
      acted = true;
      runtime.flush(["caption/label"]);
    });

    clock.tick();
    scheduler.flush();

    // Green before and after, deliberately: the drain still publishes through `flush` when nothing
    // handed it a frame, so a live edit cannot buy one by being deferred.
    expect(runtime.tick).toBe(1);
    expect(runtime.pendingSeeds).toEqual([]);
    const captionLabelPatch2 = runtime.registry.get("caption/label");
    if (captionLabelPatch2?.status !== "ready")
      throw new Error(`caption/label is ${captionLabelPatch2?.status ?? "absent"}, not ready.`);
    expect(captionLabelPatch2.values.node).toBe("caption/label");
    runtime.dispose();
  });
});

describe("a drain booking is a claim about the scheduler", () => {
  it("cancels the job a publication consumed, so one drain is one outstanding job", () => {
    const { clock, scheduler, runtime } = harness();

    let deferrals = 0;
    runtime.registry.subscribeNode("hero/arm", () => {
      if (deferrals >= 2) return;
      deferrals += 1;
      runtime.flush(["caption/label"]);
    });

    clock.tick();
    expect(deferrals).toBe(1);
    expect(scheduler.pending).toHaveLength(1);
    expect(runtime.pendingSeeds).toEqual(["caption/label"]);

    // A direct publication before the scheduler ran carries the pending seeds, so the job it
    // consumed has nothing left to do. It is cancelled rather than forgotten, and the deferral this
    // very publication triggers books one job instead of a second one beside an orphan.
    runtime.flush(["hero/arm"]);
    expect(deferrals).toBe(2);
    expect(scheduler.pending).toHaveLength(1);
    expect(runtime.pendingSeeds).toEqual(["caption/label"]);

    scheduler.flush();
    expect(runtime.pendingSeeds).toEqual([]);
    expect(runtime.lastFlushError).toBeUndefined();
    runtime.dispose();
  });

  it("reports a cancellation the scheduler refuses, and lets go of the booking anyway", () => {
    const clock = createManualClock();
    const jobs: (() => void)[] = [];
    const scheduler = {
      schedule(job: () => void) {
        jobs.push(job);
        return {
          cancel() {
            throw new Error("cancel unavailable");
          },
        };
      },
    };
    const runtime = new GraphRuntime(project, clock, compose, { scheduler });
    runtime.attach("hero/arm");

    let deferrals = 0;
    runtime.registry.subscribeNode("hero/arm", () => {
      if (deferrals >= 2) return;
      deferrals += 1;
      runtime.flush(["caption/label"]);
    });

    runtime.flushAtTick(["hero/arm"], 1);
    expect(jobs).toHaveLength(1);

    runtime.flush(["hero/arm"]);

    // A port that refuses to cancel is reported under the rule that already owns scheduler trouble,
    // not swallowed...
    expect(runtime.lastFlushError?.ruleId).toBe("scheduler-failure");
    expect(runtime.lastFlushError?.message).toMatch(/cancellation failed/);
    // ...and the phase was lowered before the port was touched, so the deferral inside this same
    // publication was able to book again. A throwing `cancel` cannot wedge the runtime.
    expect(deferrals).toBe(2);
    expect(jobs).toHaveLength(2);
    runtime.dispose();
  });
});

describe("disposal from inside an active publication", () => {
  it("stays disposed when the publication closes, and drops the drain it owed", () => {
    const { clock, scheduler, runtime, batches } = harness();

    let acted = false;
    runtime.registry.subscribeNode("hero/arm", () => {
      if (acted) return;
      acted = true;
      // A deferral books a drain from inside the publication...
      runtime.flush(["caption/label"]);
      // ...and then the same subscriber retires the runtime before that publication has closed.
      runtime.dispose();
    });

    clock.tick();

    // The publication that was in flight still finished, and no second one was published.
    expect(batches).toEqual([1]);
    expect(runtime.pendingSeeds).toEqual([]);
    // `endFlush` is total and disposal is terminal, so the `finally` left the runtime disposed
    // rather than walking it back to idle. This is the ordering ADR-083 calls load-bearing.
    expect(() => runtime.flush([])).toThrow(/disposed/);
    // And the booking went with it: the job the scheduler was holding is cancelled, which is
    // strictly more than the refusal `#drainScheduled` would still have applied to it.
    expect(scheduler.pending).toHaveLength(0);
    expect(() => scheduler.flush()).not.toThrow();
    expect(batches).toEqual([1]);
    expect(runtime.lastFlushError).toBeUndefined();
  });
});
