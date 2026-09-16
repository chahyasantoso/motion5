import { describe, expect, it } from "vitest";
import type { ProjectDefinition } from "../../../src/contract/v5";
import type { GraphIR } from "../../../src/graph/ir";
import { createManualClock } from "../../../src/ports/clock";
import { createFakeScheduler } from "../../../src/testing/fakes";
import { GraphRuntime } from "../../../src/runtime/graph-runtime";
import type { PublisherSnapshot } from "../../../src/runtime/graph-publisher";
import {
  COLD_MEMO,
  DISPOSED,
  IDLE,
  NOTHING_PENDING,
  beginFlush,
  bookingDrain,
  deferredSeeds,
  deferredTick,
  deferring,
  endFlush,
  isDisposed,
  isFlushing,
  isPending,
  memoHit,
  requeuing,
  retaining,
  unbookDrain,
  warmMemo,
  type PendingPublication,
  type RuntimePhase,
  type SnapshotMemo,
} from "../../../src/runtime/graph-runtime-state";

/**
 * Issue #376, the deferred half of #374 that ADR-082 recorded as owed.
 *
 * `GraphRuntime` encoded two state machines as six independent fields. The lifecycle was
 * `#disposed`, `#flushing` and `#scheduledDrain`, three booleans whose eight combinations included
 * two that meant nothing, and the snapshot memo was `#snapshot`, `#snapshotGraph` and
 * `#snapshotMembers` with `-1` standing in for cold. Neither illegal combination was reachable, and
 * that is the whole reason this evidence is shaped the way it is: `dispose` cleared the drain flag
 * by hand, and warmth required the value beside the key, so no behavioural case can go red on
 * either. Asserting on what the class does would prove nothing here, and asserting on the names of
 * private fields would pin the spelling of the fix rather than the invariant.
 *
 * So the evidence is the state space itself, and it is red on this head for the honest reason that
 * the module below does not exist yet. What each case pins is that an illegal combination cannot be
 * written down: every phase the transitions can reach means something, disposal is terminal, and a
 * memo carries its whole key or nothing. The three `@ts-expect-error` cases are the compile-time
 * half of the same claim, in the shape `membership-gating` used for #374: an arrow that is never
 * called, so a `tsc` diagnostic is the assertion.
 *
 * The behavioural case at the end is deliberately green before and after. It is the regression that
 * keeps the decision honest, because the point of this slice is that nothing a caller can observe
 * moves. See ADR-083.
 *
 * Issue #387 then found that the compile-time half was weaker than the record it was evidence for.
 * All three `@ts-expect-error` arrows above read a property, and none reads an assignment, which is
 * the shape TypeScript's excess-property check does not cover: a value arriving through an
 * intermediate variable was assignable to either union even when it spelled a combination ADR-083
 * calls unrepresentable. The two cases added for that read the assignment instead, and they are red
 * before the unions are branded for the honest reason that the assignment they forbid compiles.
 * See ADR-084.
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

// Sentinels rather than fixtures, because the memo compares the graph by identity and reads nothing
// out of either value. A real `GraphIR` here would suggest the key looks at its contents.
const graphA = {} as GraphIR;
const graphB = {} as GraphIR;
const snapshotA = {} as PublisherSnapshot;

const label = (phase: RuntimePhase): string =>
  phase.kind === "disposed" ? phase.kind : `${phase.kind}/${phase.drain}`;

/** Every transition, as one list, so a case can ask what the whole machine can reach. */
const TRANSITIONS: readonly ((phase: RuntimePhase) => RuntimePhase)[] = [
  beginFlush,
  endFlush,
  unbookDrain,
  (phase) => bookingDrain(phase) ?? phase,
];

function reachableFrom(...seeds: readonly RuntimePhase[]): readonly RuntimePhase[] {
  const found = new Set<RuntimePhase>(seeds);
  for (let grew = true; grew; ) {
    grew = false;
    for (const phase of [...found])
      for (const step of TRANSITIONS) {
        const next = step(phase);
        if (found.has(next)) continue;
        found.add(next);
        grew = true;
      }
  }
  return [...found];
}

describe("the runtime lifecycle is one value rather than three booleans", () => {
  it("reaches the five phases that mean something, and no combination that means nothing", () => {
    const reachable = reachableFrom(IDLE, DISPOSED);

    // Four live phases and one terminal one. The two the booleans could spell and this cannot are
    // a disposed runtime mid-flush and a disposed runtime still owing the scheduler a drain.
    expect(reachable.map(label).sort()).toEqual([
      "disposed",
      "flushing/booked",
      "flushing/unbooked",
      "idle/booked",
      "idle/unbooked",
    ]);
    // Closed under every transition, so each of them is total: nothing here leaves the machine and
    // nothing throws on a phase it was not written for.
    expect(reachable).toHaveLength(5);
    expect(reachable.every((phase) => Object.isFrozen(phase))).toBe(true);
  });

  it("keeps disposal terminal, so no transition walks a retired runtime back to life", () => {
    expect(isDisposed(DISPOSED)).toBe(true);
    expect(reachableFrom(DISPOSED).map(label)).toEqual(["disposed"]);
    // The two clears `dispose` used to write by hand, refused by the type rather than remembered.
    expect(beginFlush(DISPOSED)).toBe(DISPOSED);
    expect(bookingDrain(DISPOSED)).toBeUndefined();
    // And a subscriber that disposes mid-flush leaves the runtime disposed rather than idle.
    expect(endFlush(DISPOSED)).toBe(DISPOSED);
    expect(unbookDrain(DISPOSED)).toBe(DISPOSED);
  });

  it("carries a booking through the flush it was made inside, as a fourth phase could not", () => {
    const flushing = beginFlush(IDLE);
    expect(isFlushing(flushing)).toBe(true);

    // The case `scheduler-reentrancy` drives from the outside: a subscriber defers a flush while
    // subscribers are being notified, so the booking is made by a runtime that is already flushing.
    // A `draining` phase beside `flushing` cannot hold this pair, which is why the booking is a
    // field of both live phases instead. Issue #376 left that decision to this slice.
    const booked = bookingDrain(flushing);
    expect(booked && label(booked)).toBe("flushing/booked");
    // And it survives the flush that was in flight, because the drain it books is not that flush.
    expect(booked && label(endFlush(booked))).toBe("idle/booked");
    expect(booked && label(unbookDrain(booked))).toBe("flushing/unbooked");
  });

  it("answers one booking per drain, as a transition rather than as a boolean", () => {
    const booked = bookingDrain(IDLE);
    expect(booked && label(booked)).toBe("idle/booked");
    // Coalescing, stated once: the second ask has nothing to book, so no caller can book twice.
    expect(booked && bookingDrain(booked)).toBeUndefined();
    expect(bookingDrain(beginFlush(booked ?? IDLE))).toBeUndefined();
    // Released, it can be booked again, which is what makes the next deferral schedulable.
    expect(bookingDrain(unbookDrain(booked ?? IDLE))).toBe(booked);
  });

  it("hands a reader one discriminant instead of a conjunction over three fields", () => {
    expect(isFlushing(IDLE)).toBe(false);
    expect(isDisposed(IDLE)).toBe(false);
    expect(isFlushing(DISPOSED)).toBe(false);
    expect(isFlushing(beginFlush(IDLE))).toBe(true);
    expect(isDisposed(beginFlush(IDLE))).toBe(false);

    // The compile-time half: a disposed runtime carries no booking to read, so asking for one is an
    // error rather than a member answering `undefined`. The arrow is deliberately never called.
    const readBookingOfDisposed = () => {
      const phase: RuntimePhase = DISPOSED;
      // @ts-expect-error `drain` belongs to the live phases; a disposed runtime carries none.
      return phase.drain;
    };
    expect(typeof readBookingOfDisposed).toBe("function");
  });

  it("refuses an illegal phase combination assigned through a variable", () => {
    // The gap issue #387 found. Excess-property checking reads a fresh object literal, so both of
    // these compiled before the union was branded and ADR-083's claim held only for the call graph.
    const assignDisposedCarryingABooking = () => {
      const loose = { kind: "disposed", drain: "booked" } as const;
      // @ts-expect-error a disposed runtime carries no booking, however the value arrives.
      const phase: RuntimePhase = loose;
      return phase;
    };
    const assignLivePhaseWithoutItsBooking = () => {
      const loose = { kind: "flushing" } as const;
      // @ts-expect-error a live phase carries its booking; there is no half-stated phase.
      const phase: RuntimePhase = loose;
      return phase;
    };
    expect(typeof assignDisposedCarryingABooking).toBe("function");
    expect(typeof assignLivePhaseWithoutItsBooking).toBe("function");
  });
});

describe("the snapshot memo carries its whole key or nothing", () => {
  it("answers only for the exact graph and revision it was warmed at", () => {
    expect(memoHit(COLD_MEMO, graphA, 0)).toBeUndefined();

    const warm = warmMemo(snapshotA, graphA, 3);
    expect(memoHit(warm, graphA, 3)).toBe(snapshotA);
    // Both halves of the key, and both are load-bearing: the graph identity because every part of a
    // snapshot but membership is a pure function of it, the revision because membership is not.
    expect(memoHit(warm, graphB, 3)).toBeUndefined();
    expect(memoHit(warm, graphA, 4)).toBeUndefined();
    // Cold is a discriminant rather than a sentinel, so no number stands in for absence.
    expect(memoHit(COLD_MEMO, graphA, -1)).toBeUndefined();
    expect(Object.isFrozen(warm)).toBe(true);
    expect(Object.isFrozen(COLD_MEMO)).toBe(true);
  });

  it("cannot be built with half a key, and cannot be read for one it does not carry", () => {
    // The state `replaceGraph` used to leave behind is not expressible: the value and its key are
    // assigned together, so there is no half-cleared memo to clear the rest of.
    const halfWarmed = () =>
      // @ts-expect-error a warm memo needs its whole key; membership is not optional.
      warmMemo(snapshotA, graphA);
    const readSnapshotOfCold = () => {
      const memo: SnapshotMemo = COLD_MEMO;
      // @ts-expect-error a cold memo carries no snapshot; the key and the value arrive together.
      return memo.snapshot;
    };
    expect(typeof halfWarmed).toBe("function");
    expect(typeof readSnapshotOfCold).toBe("function");
  });

  it("refuses a half-cleared memo key assigned through a variable", () => {
    // The memo half of issue #387, and the more interesting one: the object this used to admit is
    // exactly the key `replaceGraph` left behind: a cold memo still carrying a membership revision.
    const assignStaleColdMemo = () => {
      const loose = { kind: "cold", membersRevision: 3 } as const;
      // @ts-expect-error a cold memo carries no key, so there is no stale half of one to hold.
      const memo: SnapshotMemo = loose;
      return memo;
    };
    const assignWarmMemoMissingItsRevision = () => {
      const loose = { kind: "warm", snapshot: snapshotA, graph: graphA } as const;
      // @ts-expect-error a warm memo carries its whole key; membership is not optional.
      const memo: SnapshotMemo = loose;
      return memo;
    };
    expect(typeof assignStaleColdMemo).toBe("function");
    expect(typeof assignWarmMemoMissingItsRevision).toBe("function");
  });
});

describe("what the runtime does with them does not move", () => {
  it("drops a drain the scheduler accepted before disposal, without a flag to clear", () => {
    const clock = createManualClock();
    const scheduler = createFakeScheduler();
    const runtime = new GraphRuntime(project, clock, compose, { scheduler });
    runtime.attach("hero/arm");

    const batches: number[] = [];
    runtime.registry.subscribeBatch((batch) => batches.push(batch.tick));

    let notifications = 0;
    runtime.registry.subscribeNode("hero/arm", () => {
      notifications += 1;
      if (notifications === 1) runtime.flush(["caption/label"]);
    });

    // One tick, one deferral, one booking: the reentrant flush is queued for the scheduler.
    clock.tick();
    expect(batches).toEqual([1]);
    expect(scheduler.pending).toHaveLength(1);
    expect(runtime.pendingSeeds).toEqual(["caption/label"]);

    // Disposal is terminal, so the job the scheduler already holds finds a runtime that refuses it
    // on the one discriminant rather than on a boolean `dispose` remembered to clear.
    runtime.dispose();
    expect(runtime.pendingSeeds).toEqual([]);
    expect(() => scheduler.flush()).not.toThrow();
    expect(batches).toEqual([1]);
    expect(runtime.lastFlushError).toBeUndefined();
  });
});

/**
 * Issues #392, #396 and #401, found by the quality passes over #390 and #398.
 *
 * The third value this module owns, held to the same standard as the two above. It was an interface
 * rather than a union, and the three findings are what that cost: liveness was the seed count, so a
 * payload carrying a frame and no seeds was not pending and its frame was never replayed; the empty
 * constant carried one live `Set` behind a `ReadonlySet` type and every runtime in the process
 * shared it; and a failed publication re-queued its seeds without asking whether the runtime it was
 * re-queueing onto still existed.
 *
 * These cases are the state space again rather than the behaviour, for the reason the file's
 * preamble already gives. `deferred-payload.test.ts` is the behavioural half and it is red before
 * the change; two of the cases here are red as well, because a frame with no seeds answered false
 * and `retaining` and `requeuing` did not exist. See ADR-088.
 */
describe("the deferred payload carries something, or it is nothing at all", () => {
  it("answers nothing pending as a variant rather than as an empty seed set", () => {
    expect(isPending(NOTHING_PENDING)).toBe(false);
    expect(deferredSeeds(NOTHING_PENDING)).toEqual([]);
    expect(deferredTick(NOTHING_PENDING)).toBeUndefined();
    expect(Object.isFrozen(NOTHING_PENDING)).toBe(true);
    // Issue #396: this constant used to cast one live `Set` through `ReadonlySet` and hand the same
    // object to every runtime in the process, so one caller that mutated it poisoned all of them.
    // There is no collection here to hand out, and the reader below answers a copy rather than the
    // set a deferral holds.
    expect(Object.keys(NOTHING_PENDING)).toEqual(["kind"]);
    const deferred = deferring(NOTHING_PENDING, ["hero/arm"], undefined);
    expect(deferredSeeds(deferred)).not.toBe(deferredSeeds(deferred));
  });

  it("is pending when it carries a frame and no seeds, which is what a drain replays", () => {
    const frameOnly = deferring(NOTHING_PENDING, [], 2);

    // Red before this change: liveness was `seeds.size > 0`, so this payload stored a frame the
    // drain refused to replay and the booked job was spent on nothing. Issue #392.
    expect(isPending(frameOnly)).toBe(true);
    expect(deferredSeeds(frameOnly)).toEqual([]);
    expect(deferredTick(frameOnly)).toBe(2);
    // Nothing asked for stays nothing deferred, so the empty answer is still one interned value.
    expect(deferring(NOTHING_PENDING, [], undefined)).toBe(NOTHING_PENDING);
  });

  it("merges the seeds, keeps the later frame, and holds no caller's array", () => {
    const asked = ["hero/arm"];
    const first = deferring(NOTHING_PENDING, asked, 3);
    asked.push("caption/label");

    expect(deferredSeeds(first)).toEqual(["hero/arm"]);
    const merged = deferring(first, ["caption/label"], 2);
    expect([...deferredSeeds(merged)].sort()).toEqual(["caption/label", "hero/arm"]);
    // A frame number only ever advances, so replaying the earlier of two would be refused by the
    // guard the deferral exists to preserve, and a deferral naming none erases neither.
    expect(deferredTick(merged)).toBe(3);
    expect(deferredTick(deferring(first, [], undefined))).toBe(3);
  });

  it("retains a frame a publication has not reached, and nothing it has", () => {
    const carried = deferring(NOTHING_PENDING, ["hero/arm"], 3);

    // The seeds are taken by the publication that is about to state them; the frame it has no
    // parameter to name is what stays behind for the drain. Issue #392.
    const kept = retaining(carried, 1);
    expect(deferredSeeds(kept)).toEqual([]);
    expect(deferredTick(kept)).toBe(3);
    expect(isPending(kept)).toBe(true);
    // And a frame this publication reached is nothing to carry, which is a drain replaying its own
    // deferral through the verb that owns clock transitions.
    expect(retaining(carried, 3)).toBe(NOTHING_PENDING);
    expect(retaining(NOTHING_PENDING, 0)).toBe(NOTHING_PENDING);
  });

  it("re-queues onto a live runtime only, because a retired one owes no follow-up", () => {
    const requeued = requeuing(IDLE, NOTHING_PENDING, ["hero/arm"]);
    expect(deferredSeeds(requeued)).toEqual(["hero/arm"]);

    // Issue #401: `disposed` is terminal and carries nothing, and pending work is something. The
    // payload is a field beside the phase rather than a member of it, so this is the guard that
    // says what the phase would have said if it owned the payload.
    expect(requeuing(DISPOSED, NOTHING_PENDING, ["hero/arm"])).toBe(NOTHING_PENDING);
    expect(requeuing(DISPOSED, requeued, ["caption/label"])).toBe(NOTHING_PENDING);
  });

  it("refuses a payload that states a frame beside no deferral at all", () => {
    // The closedness half, in the shape issue #387 asked for one union across: an excess property
    // arriving through a variable is not checked, so the brand is what keeps this union closed as
    // well as discriminated. Both arrows are deliberately never called.
    const assignNothingCarryingAFrame = () => {
      const loose = { kind: "nothing", tick: 2 } as const;
      // @ts-expect-error nothing pending carries no frame, however the value arrives.
      const pending: PendingPublication = loose;
      return pending;
    };
    const assignDeferralWithoutItsSeeds = () => {
      const loose = { kind: "deferred", tick: 2 } as const;
      // @ts-expect-error a deferral states its seeds, even when that set is empty.
      const pending: PendingPublication = loose;
      return pending;
    };
    expect(typeof assignNothingCarryingAFrame).toBe("function");
    expect(typeof assignDeferralWithoutItsSeeds).toBe("function");
  });
});
