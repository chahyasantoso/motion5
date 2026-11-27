import { describe, expect, it } from "vitest";
import {
  derivedEvents,
  eventLog,
  generationOf,
  liveAt,
  sourceStreamOf,
  state,
  versionOf,
  type Events,
} from "@gerak/core";

describe("eventLog window retention", () => {
  it("keeps the window and each name-and-target latest while dropping older entries in batches", () => {
    const windowMs = 4000;
    const log = eventLog({ windowMs });
    const rateHz = 60;
    const totalFrames = 30 * rateHz;
    // Twice the window at 60 Hz plus one retained latest per name and target (2 names).
    const maxRetained = ((2 * windowMs) / 1000) * rateHz + 2;

    log.add({ name: "mode", at: 0, target: "jar", value: 1 });

    let prevLength = log.events.length;
    let prevGeneration = generationOf(log.events);
    let drops = 0;

    for (let frame = 0; frame <= totalFrames; frame += 1) {
      const at = Math.round((frame * 1000) / rateHz);
      log.add({ name: "sample", at, target: "dial", value: frame + 1 });

      expect(log.events.length).toBeLessThanOrEqual(maxRetained);

      const gen = generationOf(log.events);
      if (log.events.length < prevLength) {
        drops += 1;
        expect(gen).toBeGreaterThan(prevGeneration ?? -1);
      }
      prevLength = log.events.length;
      prevGeneration = gen;
    }

    expect(drops).toBeGreaterThan(0);

    const entries = log.events;
    const newest = entries[entries.length - 1]?.at ?? 0;
    const recentSamples = entries.filter(
      (entry) => entry.name === "sample" && entry.at >= newest - windowMs,
    );
    expect(recentSamples.length).toBeGreaterThanOrEqual(windowMs * (rateHz / 1000));

    // Any entry older than twice the window must be the latest of its name and target.
    for (let i = 0; i < entries.length; i += 1) {
      const entry = entries[i];
      if (entry === undefined) continue;
      if (entry.at < newest - 2 * windowMs) {
        const hasNewer = entries
          .slice(i + 1)
          .some((later) => later.name === entry.name && later.target === entry.target);
        expect(hasNewer).toBe(false);
      }
    }

    const modeEntry = entries.find((entry) => entry.name === "mode" && entry.target === "jar");
    expect(modeEntry).toEqual({ name: "mode", at: 0, target: "jar", value: 1 });
  });

  it("keeps every entry when configured with no window", () => {
    const log = eventLog();
    log.add({ name: "mode", at: 0, target: "jar", value: 1 });
    const totalFrames = 30 * 60;
    for (let frame = 0; frame <= totalFrames; frame += 1) {
      log.add({ name: "sample", at: Math.round((frame * 1000) / 60), value: frame + 1 });
    }
    expect(log.events.length).toBe(totalFrames + 2);
  });

  it("refolds state after a drop and still reads the latest sample value", () => {
    const log = eventLog({ windowMs: 4000 });
    const latest = state(0, (current, event) =>
      event.name === "sample" ? (event.value ?? current) : current,
    );
    const mode = state(0, (current, event) =>
      event.name === "mode" ? (event.value ?? current) : current,
    );

    log.add({ name: "mode", at: 0, value: 7 });
    let dropped = false;
    let prevLen = log.events.length;

    for (let frame = 0; frame <= 20 * 60; frame += 1) {
      const at = Math.round((frame * 1000) / 60);
      log.add({ name: "sample", at, value: frame + 1 });
      if (log.events.length < prevLen) dropped = true;
      prevLen = log.events.length;
      expect(latest(liveAt(at), log.events)).toBe(frame + 1);
      expect(mode(liveAt(at), log.events)).toBe(7);
    }

    expect(dropped).toBe(true);
  });
});

describe("derivedEvents records and caching", () => {
  it("gives merged output a record and preserves identity across frames without new input", () => {
    const cues: Events = [
      { name: "cue", at: 100 },
      { name: "cue", at: 5000 },
    ];
    const log = eventLog();
    log.add({ name: "tap", at: 200 });
    const derived = derivedEvents();

    const first = derived.resolve(cues, log.events, 300);
    expect(first).toEqual([
      { name: "cue", at: 100 },
      { name: "tap", at: 200 },
    ]);
    expect(versionOf(first)).toBeTypeOf("number");
    expect(generationOf(first)).toBeTypeOf("number");
    expect(sourceStreamOf(first)).toBeDefined();

    const second = derived.resolve(cues, log.events, 350);
    expect(second).toBe(first);

    // Merging with a plain array page also produces a recorded, identity-stable list.
    const plainDerived = derivedEvents();
    const plainPage: Events = [{ name: "tap", at: 200 }];
    const plainFirst = plainDerived.resolve(cues, plainPage, undefined);
    expect(versionOf(plainFirst)).toBeTypeOf("number");
    expect(generationOf(plainFirst)).toBeTypeOf("number");
    expect(sourceStreamOf(plainFirst)).toBeDefined();
    expect(plainDerived.resolve(cues, plainPage, undefined)).toBe(plainFirst);
  });
});
