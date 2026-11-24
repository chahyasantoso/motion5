import { describe, expect, it } from "vitest";
import {
  NO_EVENTS,
  liveAt,
  shared,
  springTo,
  state,
  transition,
  watchClock,
  watchedTime,
  type ClockUse,
  type Events,
  type Signal,
  type Time,
} from "@gerak/core";

const timed = (elapsed: number, progress = elapsed / 1000): Time => ({
  progress,
  clock: { kind: "timed", elapsed, length: 1000 },
});

function counted(): { signal: Signal<number>; calls: () => number } {
  let calls = 0;
  const signal: Signal<number> = (time) => {
    calls += 1;
    return time.progress * 2;
  };
  return { signal, calls: () => calls };
}

describe("shared", () => {
  it("runs once for the same time and the same events list", () => {
    const { signal, calls } = counted();
    const read = shared(signal);
    expect(read(timed(500), NO_EVENTS)).toBe(1);
    expect(read(timed(500), NO_EVENTS)).toBe(1);
    expect(calls()).toBe(1);
  });

  it("runs again for a new time or a new events list", () => {
    const { signal, calls } = counted();
    const read = shared(signal);
    read(timed(500), NO_EVENTS);
    read(timed(600), NO_EVENTS);
    expect(calls()).toBe(2);
    const other: Events = [];
    read(timed(600), other);
    expect(calls()).toBe(3);
    read({ progress: 0.6, clock: { kind: "live", elapsed: 600 } }, other);
    expect(calls()).toBe(4);
  });

  it("gives the values of the plain signal", () => {
    const { signal } = counted();
    const read = shared(signal);
    for (const ms of [0, 250, 250, 900, 100])
      expect(read(timed(ms), NO_EVENTS)).toBe(signal(timed(ms), NO_EVENTS));
  });

  it("replays clock-use reports identically across cached readers of transition and springTo", () => {
    const phase = state("idle", (_cur, ev) => (ev.name === "go" ? "open" : _cur));
    const events: Events = [{ name: "go", at: 0 }];

    let transCalls = 0;
    const rawTrans = transition(phase, { ms: 300 });
    const sharedTrans = shared((t: Time, ev: Events) => {
      transCalls += 1;
      return rawTrans(t, ev);
    });

    const usesOf = <T>(run: () => T): { readonly value: T; readonly uses: readonly ClockUse[] } => {
      const uses: ClockUse[] = [];
      const value = watchClock((use) => uses.push(use), run);
      return { value, uses };
    };

    const r1Active = usesOf(() => sharedTrans(watchedTime(liveAt(100)), events));
    const r2Active = usesOf(() => sharedTrans(watchedTime(liveAt(100)), events));
    expect(transCalls).toBe(1);
    expect(r1Active.value.active).toBe(true);
    expect(r2Active.value).toBe(r1Active.value);
    expect(r1Active.uses).toEqual(["time"]);
    expect(r2Active.uses).toEqual(["time"]);

    const r1Settled = usesOf(() => sharedTrans(watchedTime(liveAt(400)), events));
    const r2Settled = usesOf(() => sharedTrans(watchedTime(liveAt(400)), events));
    expect(transCalls).toBe(2);
    expect(r1Settled.value).toEqual({
      current: "open",
      previous: "idle",
      progress: 1,
      active: false,
    });
    expect(r2Settled.value).toBe(r1Settled.value);
    expect(r1Settled.uses).toEqual([]);
    expect(r2Settled.uses).toEqual([]);

    const sharedSpring = shared(springTo(phase, (p) => (p === "open" ? 1 : 0)));
    const sp1 = usesOf(() => sharedSpring(watchedTime(liveAt(50)), events));
    const sp2 = usesOf(() => sharedSpring(watchedTime(liveAt(50)), events));
    expect(sp2.value).toBe(sp1.value);
    expect(sp1.uses).toEqual(["time"]);
    expect(sp2.uses).toEqual(["time"]);
  });

  it("reports maybe to a watched reader even after an unwatched reader populated the cache", () => {
    let calls = 0;
    const read = shared((t: Time) => {
      calls += 1;
      return t.progress * 2;
    });
    const usesOf = (time: Time): readonly ClockUse[] => {
      const uses: ClockUse[] = [];
      watchClock(
        (use) => uses.push(use),
        () => read(time, NO_EVENTS),
      );
      return uses;
    };

    expect(usesOf(timed(500))).toEqual([]);
    const tWatched = watchedTime(timed(500));
    expect(usesOf(tWatched)).toEqual(["maybe"]);
    expect(calls).toBe(1);
  });
});
