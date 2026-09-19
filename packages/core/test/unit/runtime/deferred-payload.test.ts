import { describe, expect, it } from "vitest";
import type { Diagnostic, PatchBatch, ProjectDefinition } from "../../../src/contract/v5";
import { createManualClock } from "../../../src/ports/clock";
import type { Cancel } from "../../../src/ports/scheduler";
import { createFakeScheduler } from "../../../src/testing/fakes";
import { GraphRuntime } from "../../../src/runtime/graph-runtime";

/**
 * Issues #392, #393, #400 and #401, found by the quality passes over #390 and #398.
 *
 * The behavioural half of ADR-088, and every case here is red before it. #392 is a frame nothing
 * would replay, because liveness was the seed count and a reentrant `flushAtTick([], tick)` states
 * no seeds. #400 is a host that reroutes a runtime failure: `#report` ends at `onFlushError`, which
 * is host code with no boundary, and `#releaseBooking` calls it two statements after the deferred
 * payload has been taken and before the boundary that would put it back. #401 and #393 are the same
 * sentence from two sides, that a retired runtime carries nothing: it was left holding work no
 * phase could ever book a drain for, and it filed a diagnostic it could do nothing about.
 *
 * The frame is the observable throughout rather than `pendingSeeds`, because a payload that carries
 * a frame and no seeds is invisible to that getter by construction. `runtime.tick` is what says the
 * frame was reached and `runtime.sequence` is what says a publication happened, and neither depends
 * on whether a patch changed. See ADR-088.
 *
 * Issue #412 adds the last case, and it is coverage rather than a regression. Both behavioural frame
 * cases above configure a scheduler, so the one branch `#scheduleDrain` answers differently, a
 * runtime built with no scheduler at all, was never driven with a frame-only payload. That is the
 * branch where nothing will ever drain, so it is where a frame could sit pending forever while
 * `isPending` keeps answering true. See ADR-080.
 *
 * Issue #409 narrows the last of those claims rather than reversing it. A retired runtime hands a
 * host nothing, which is what an empty `received` reads; it does not also forget. Retention is
 * total across phases and delivery stays guarded, so the drain case below reads an empty sink
 * beside a retained `flush-failure` where it used to read both as absent. See ADR-091.
 *
 * Issue #449's quality pass adds the two cases at the end of the first block and the batch
 * assertions in its first case, and all three are red before the change they are evidence for. The
 * answer a reentrant call is handed was chosen from the request's own seed list rather than from
 * the payload the deferral left behind, so a `flushAtTick([], tick)` that queued a real publication
 * was answered as an empty batch, and a `flush([])` that deferred nothing at all still booked a
 * drain whose only act is to release its own booking. Both are read from one place now, which is
 * what is pending after the deferral rather than what the request itself stated. See ADR-088 and
 * ADR-097.
 */

const project: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    { id: "hero", trigger: { type: "manual" }, tracks: [{ id: "arm" }] },
    { id: "caption", trigger: { type: "manual" }, tracks: [{ id: "label" }] },
  ],
};

const compose = (node: { id: string }) => () => ({
  values: { node: node.id },
  sourceProgress: 0,
  sourceRevisions: {},
});

describe("an empty deferred publication is still a publication", () => {
  it("replays the frame a reentrant flushAtTick asked for when it stated no seeds", () => {
    const clock = createManualClock();
    const scheduler = createFakeScheduler();
    const runtime = new GraphRuntime(project, clock, compose, { scheduler });
    runtime.attach("hero/arm");

    const answered: PatchBatch[] = [];
    let acted = false;
    runtime.registry.subscribeNode("hero/arm", () => {
      if (acted) return;
      acted = true;
      answered.push(runtime.flushAtTick([], 2));
    });

    clock.tick();

    // The batch the caller was answered with says a publication is owed, and the frame is the whole
    // of what it can name: a deferral stating no seed has no payload to give a rule that always
    // names ids, so it answers under a rule of its own rather than under an empty batch that claims
    // nothing was queued.
    const reported = answered[0]?.diagnostics.map(({ ruleId }) => ruleId);
    expect(reported).toEqual(["reentrant-flush-deferred-frame"]);
    expect(answered[0]?.diagnostics[0]?.severity).toBe("warning");
    expect(answered[0]?.diagnostics[0]?.ids).toEqual([]);
    expect(answered[0]?.diagnostics[0]?.message).toMatch(/frame 2/);
    expect(answered[0]?.seeds).toEqual([]);

    // The reentrant call published nothing now and must not record a frame that did not run, which
    // is the half ADR-082 already owned. The payload it left states no seeds, so this getter cannot
    // see it at all and the frame below is what proves it exists.
    expect(runtime.tick).toBe(1);
    expect(runtime.sequence).toBe(1);
    expect(runtime.pendingSeeds).toEqual([]);
    expect(scheduler.pending).toHaveLength(1);

    scheduler.flush();

    // Red before this change: `isPending` read the seed count, so the drain returned immediately,
    // the booked job was spent on nothing and frame 2 stayed stored and unreachable. Issue #392.
    expect(runtime.tick).toBe(2);
    expect(runtime.sequence).toBe(2);
    expect(runtime.lastFlushError).toBeUndefined();
    runtime.dispose();
  });

  it("keeps a pending frame a live write cannot reach rather than consuming it", () => {
    const clock = createManualClock();
    const scheduler = createFakeScheduler();
    const runtime = new GraphRuntime(project, clock, compose, { scheduler });
    runtime.attach("hero/arm");

    let acted = false;
    runtime.registry.subscribeNode("hero/arm", () => {
      if (acted) return;
      acted = true;
      runtime.flushAtTick([], 3);
    });

    clock.tick();
    expect(runtime.tick).toBe(1);

    // The second half of the same decision. `flush` has no parameter to reach frame 3 with, so it
    // takes the seeds it can state and leaves the frame for the drain, and it books that drain
    // through the machinery its own `finally` already had.
    runtime.flush(["caption/label"]);

    expect(runtime.tick).toBe(1);
    expect(runtime.pendingSeeds).toEqual([]);
    expect(scheduler.pending).toHaveLength(1);

    scheduler.flush();

    // Red before this change in both assertions: the live write cleared the whole payload, so no
    // drain was booked and frame 3 was dropped by a verb that could not have published it.
    expect(runtime.tick).toBe(3);
    expect(runtime.lastFlushError).toBeUndefined();
    runtime.dispose();
  });

  it("carries a frame-only payload on the next flush when there is no scheduler to drain it", () => {
    const clock = createManualClock();
    const received: Diagnostic[] = [];
    // No scheduler, which is the whole point: `#scheduleDrain` returns false without booking, and
    // the deferral diagnostic says the work is carried by the next flush rather than by a drain.
    const runtime = new GraphRuntime(project, clock, compose, {
      onFlushError: (diagnostic) => received.push(diagnostic),
    });
    runtime.attach("hero/arm");

    let acted = false;
    runtime.registry.subscribeNode("hero/arm", () => {
      if (acted) return;
      acted = true;
      runtime.flushAtTick([], 2);
    });

    clock.tick();

    // Nothing was booked and nothing was reported for not booking: a runtime with no scheduler is
    // configured that way, so the absent port is not a `scheduler-failure`.
    expect(runtime.tick).toBe(1);
    expect(runtime.sequence).toBe(1);
    expect(runtime.pendingSeeds).toEqual([]);
    expect(received).toEqual([]);
    expect(runtime.lastFlushError).toBeUndefined();

    // A live flush cannot reach frame 2, so it publishes without consuming it. This is `retaining`
    // on the branch that has no drain to hand the frame to, and it must not re-attempt a booking
    // there is no port for.
    runtime.flush([]);
    expect(runtime.tick).toBe(1);
    expect(runtime.sequence).toBe(2);
    expect(runtime.pendingSeeds).toEqual([]);
    expect(received).toEqual([]);

    // And the verb that can reach it consumes it and clears the payload, so the frame was carried
    // by the next flush rather than left pending forever.
    runtime.flushAtTick([], 2);
    expect(runtime.tick).toBe(2);
    expect(runtime.sequence).toBe(3);
    expect(received).toEqual([]);
    expect(runtime.lastFlushError).toBeUndefined();
    runtime.dispose();
  });

  it("books nothing for a reentrant flush that defers no seed and carries no frame", () => {
    const clock = createManualClock();
    const scheduler = createFakeScheduler();
    const runtime = new GraphRuntime(project, clock, compose, { scheduler });
    runtime.attach("hero/arm");

    const answered: PatchBatch[] = [];
    let acted = false;
    runtime.registry.subscribeNode("hero/arm", () => {
      if (acted) return;
      acted = true;
      answered.push(runtime.flush([]));
    });

    clock.tick();

    // Nothing was deferred, so nothing is owed, and a booking is a claim that something is. Red in
    // the last assertion before this change: the drain was booked before the answer was chosen and
    // booked whether or not the deferral created any work, so the scheduler was left holding a job
    // whose only act is to release its own booking.
    expect(answered[0]?.diagnostics).toEqual([]);
    expect(answered[0]?.seeds).toEqual([]);
    expect(runtime.pendingSeeds).toEqual([]);
    expect(runtime.tick).toBe(1);
    expect(runtime.sequence).toBe(1);
    expect(runtime.lastFlushError).toBeUndefined();
    expect(scheduler.pending).toHaveLength(0);
    runtime.dispose();
  });

  it("asks no scheduler for a drain a reentrant flush left nothing to run", () => {
    const clock = createManualClock();
    const received: Diagnostic[] = [];
    const scheduler = {
      schedule(): Cancel {
        throw new Error("scheduler refused");
      },
    };
    const runtime = new GraphRuntime(project, clock, compose, {
      scheduler,
      onFlushError: (diagnostic) => received.push(diagnostic),
    });
    runtime.attach("hero/arm");

    let acted = false;
    runtime.registry.subscribeNode("hero/arm", () => {
      if (acted) return;
      acted = true;
      runtime.flush([]);
    });

    clock.tick();

    // Red before this change in both of the first two assertions: the unconditional booking reached
    // a port that refuses every job, so a reentrant call with nothing to drain minted a
    // `scheduler-failure` describing work that did not exist. A port is asked for a drain only when
    // there is one to run.
    expect(received).toEqual([]);
    expect(runtime.lastFlushError).toBeUndefined();
    expect(runtime.tick).toBe(1);
    expect(runtime.sequence).toBe(1);
    runtime.dispose();
  });
});

describe("a host that cannot receive a diagnostic cannot reroute the runtime", () => {
  it("publishes the drained seeds when the port and the diagnostic sink both throw", () => {
    const clock = createManualClock();
    const jobs: (() => void)[] = [];
    const scheduler = {
      schedule(job: () => void): Cancel {
        jobs.push(job);
        return {
          cancel() {
            throw new Error("cancel unavailable");
          },
        };
      },
    };
    const received: Diagnostic[] = [];
    const runtime = new GraphRuntime(project, clock, compose, {
      scheduler,
      onFlushError: (diagnostic) => {
        received.push(diagnostic);
        throw new Error("diagnostic sink refused");
      },
    });
    runtime.attach("hero/arm");

    let acted = false;
    runtime.registry.subscribeNode("hero/arm", () => {
      if (acted) return;
      acted = true;
      runtime.flush(["caption/label"]);
    });

    runtime.flushAtTick(["hero/arm"], 1);
    expect(jobs).toHaveLength(1);
    expect(runtime.pendingSeeds).toEqual(["caption/label"]);

    // Red before this change: the sink's failure left through `#releaseBooking`, which runs after
    // the payload has been taken and before the publication boundary that would have put it back,
    // so the caller saw the host's error and the drained seed was gone. Issue #400.
    expect(() => runtime.flush(["hero/arm"])).not.toThrow();

    expect(received).toHaveLength(1);
    expect(received[0]?.ruleId).toBe("scheduler-failure");
    // Swallowed rather than aggregated, and retained where the runtime already retains it.
    expect(runtime.lastFlushError?.ruleId).toBe("scheduler-failure");
    expect(runtime.lastFlushError?.message).toMatch(/cancellation failed/);
    expect(runtime.registry.get("caption/label")?.values.node).toBe("caption/label");
    expect(runtime.registry.get("hero/arm")?.values.node).toBe("hero/arm");
    expect(runtime.pendingSeeds).toEqual([]);
    runtime.dispose();
  });
});

describe("a retired runtime carries no work, and withholds rather than loses a diagnostic", () => {
  it("leaves nothing pending when caller composition disposes it and then throws", () => {
    const clock = createManualClock();
    const scheduler = createFakeScheduler();
    const holder: { runtime?: GraphRuntime } = {};
    const failure = new Error("compose refused");
    let refusing = false;
    const refusingCompose = (node: { id: string }) => {
      if (refusing) {
        holder.runtime?.dispose();
        throw failure;
      }
      return () => ({ values: { node: node.id }, sourceProgress: 0, sourceRevisions: {} });
    };
    const runtime = new GraphRuntime(project, clock, refusingCompose, { scheduler });
    holder.runtime = runtime;
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

    expect(() => runtime.flush(["hero/arm"])).toThrow(failure);

    // Red before this change: the boundary re-queued both seeds onto a runtime whose phase was
    // already terminal, so a retired object answered a non-empty `pendingSeeds` that nothing could
    // ever publish, because `bookingDrain` declines a disposed phase forever. Issue #401.
    expect(runtime.pendingSeeds).toEqual([]);
    expect(() => runtime.flush([])).toThrow(/disposed/);
    expect(scheduler.pending).toHaveLength(0);
    expect(runtime.lastFlushError).toBeUndefined();
  });

  it("hands a retired runtime's host nothing, and still retains why the drain failed", () => {
    const clock = createManualClock();
    const scheduler = createFakeScheduler();
    const holder: { runtime?: GraphRuntime } = {};
    const failure = new Error("compose refused");
    let refusing = false;
    const refusingCompose = (node: { id: string }) => {
      if (refusing) {
        holder.runtime?.dispose();
        throw failure;
      }
      return () => ({ values: { node: node.id }, sourceProgress: 0, sourceRevisions: {} });
    };
    const received: Diagnostic[] = [];
    const runtime = new GraphRuntime(project, clock, refusingCompose, {
      scheduler,
      onFlushError: (diagnostic) => received.push(diagnostic),
    });
    holder.runtime = runtime;
    runtime.attach("hero/arm");

    let acted = false;
    runtime.registry.subscribeNode("hero/arm", () => {
      if (acted) return;
      acted = true;
      runtime.flush(["caption/label"]);
    });

    clock.tick();
    expect(scheduler.pending).toHaveLength(1);

    runtime.replaceGraph(project);
    refusing = true;
    scheduler.flush();

    // The drain's own boundary caught the composition failure, and the runtime it would have
    // reported to had been retired by that same composition. Red before this change in both
    // halves: a `flush-failure` was filed against a terminal runtime, which is issue #393, and the
    // drained seeds were re-queued onto it, which is issue #401 from the drain's side.
    //
    // Withheld from the host rather than discarded, which is issue #409 and the half this case used
    // to overstate. Delivery is what a terminal phase refuses, so the sink stays empty; the reason
    // the work failed is still readable by whoever asks. Red in the last two assertions before that
    // change, when one guard dropped the retention along with the handover.
    expect(received).toEqual([]);
    expect(runtime.lastFlushError?.ruleId).toBe("flush-failure");
    expect(runtime.lastFlushError?.message).toMatch(/Scheduled flush failed/);
    expect(runtime.pendingSeeds).toEqual([]);
    expect(scheduler.pending).toHaveLength(0);
  });
});
