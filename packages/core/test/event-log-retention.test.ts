import { describe, expect, it } from "vitest";
import {
  derivedInput,
  generationOf,
  inputLog,
  inputSerialsOf,
  inputs,
  liveAt,
  sourceStreamOf,
  state,
  triggers,
  versionOf,
  type Input,
} from "@gerak/core";

const testInputs = inputs({
  values: { mode: {}, sample: {} },
  triggers: { tap: {} },
});

describe("inputLog window retention", () => {
  it("keeps the window and each name-and-target latest while dropping older entries in batches", () => {
    const windowMs = 4000;
    const log = inputLog({ windowMs });
    const rateHz = 60;
    const totalFrames = 30 * rateHz;
    // Twice the window at 60 Hz plus one retained latest per name and target (2 names).
    const maxRetained = ((2 * windowMs) / 1000) * rateHz + 2;

    log.set(0, testInputs, "mode", 1, "jar");

    let prevLength = log.input.length;
    let prevGeneration = generationOf(log.input);
    let drops = 0;

    for (let frame = 0; frame <= totalFrames; frame += 1) {
      const at = Math.round((frame * 1000) / rateHz);
      log.set(at, testInputs, "sample", frame + 1, "dial");

      expect(log.input.length).toBeLessThanOrEqual(maxRetained);

      const gen = generationOf(log.input);
      if (log.input.length < prevLength) {
        drops += 1;
        expect(gen).toBeGreaterThan(prevGeneration ?? -1);
      }
      prevLength = log.input.length;
      prevGeneration = gen;
    }

    expect(drops).toBeGreaterThan(0);

    const entries = log.input;
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
    expect(modeEntry).toEqual({ kind: "value", name: "mode", at: 0, target: "jar", value: 1 });
  });

  it("keeps every entry when configured with no window", () => {
    const log = inputLog();
    log.set(0, testInputs, "mode", 1, "jar");
    const totalFrames = 30 * 60;
    for (let frame = 0; frame <= totalFrames; frame += 1) {
      log.set(Math.round((frame * 1000) / 60), testInputs, "sample", frame + 1);
    }
    expect(log.input.length).toBe(totalFrames + 2);
  });

  it("refolds state after a drop and still reads the latest sample value", () => {
    const log = inputLog({ windowMs: 4000 });
    const latest = state(0, (current, entry) => (entry.name === "sample" ? entry.value : current));
    const mode = state(0, (current, entry) => (entry.name === "mode" ? entry.value : current));

    log.set(0, testInputs, "mode", 7);
    let dropped = false;
    let prevLen = log.input.length;

    for (let frame = 0; frame <= 20 * 60; frame += 1) {
      const at = Math.round((frame * 1000) / 60);
      log.set(at, testInputs, "sample", frame + 1);
      if (log.input.length < prevLen) dropped = true;
      prevLen = log.input.length;
      expect(latest(liveAt(at), log.input)).toBe(frame + 1);
      expect(mode(liveAt(at), log.input)).toBe(7);
    }

    expect(dropped).toBe(true);
  });

  it("set records only changed values per name and target, and trigger always records with default 1", () => {
    const log = inputLog();
    log.set(10, testInputs, "mode", 1);
    log.set(20, testInputs, "mode", 1);
    log.set(30, testInputs, "mode", 1, "box");
    log.set(40, testInputs, "mode", 2);
    log.trigger(50, testInputs, "tap");
    log.trigger(60, testInputs, "tap", 3, "box");
    expect(log.input).toEqual([
      { kind: "value", name: "mode", at: 10, value: 1 },
      { kind: "value", name: "mode", at: 30, value: 1, target: "box" },
      { kind: "value", name: "mode", at: 40, value: 2 },
      { kind: "trigger", name: "tap", at: 50, value: 1 },
      { kind: "trigger", name: "tap", at: 60, value: 3, target: "box" },
    ]);
  });
});

describe("derivedInput records and caching", () => {
  it("gives merged output a record and preserves identity across frames without new input", () => {
    const cues: Input = [
      { kind: "trigger", name: "cue", at: 100, value: 1 },
      { kind: "trigger", name: "cue", at: 5000, value: 1 },
    ];
    const log = inputLog();
    log.trigger(200, testInputs, "tap");
    const derived = derivedInput();

    const first = derived.resolve(cues, log.input, 300);
    expect(first).toEqual([
      { kind: "trigger", name: "cue", at: 100, value: 1 },
      { kind: "trigger", name: "tap", at: 200, value: 1 },
    ]);
    expect(versionOf(first)).toBeTypeOf("number");
    expect(generationOf(first)).toBeTypeOf("number");
    expect(sourceStreamOf(first)).toBeDefined();

    const second = derived.resolve(cues, log.input, 350);
    expect(second).toBe(first);

    // Merging with a plain array page also produces a recorded, identity-stable list.
    const plainDerived = derivedInput();
    const plainPage: Input = [{ kind: "trigger", name: "tap", at: 200, value: 1 }];
    const plainFirst = plainDerived.resolve(cues, plainPage, undefined);
    expect(versionOf(plainFirst)).toBeTypeOf("number");
    expect(generationOf(plainFirst)).toBeTypeOf("number");
    expect(sourceStreamOf(plainFirst)).toBeDefined();
    expect(plainDerived.resolve(cues, plainPage, undefined)).toBe(plainFirst);
  });

  it("preserves page serials and negative cue serials while resuming across appends", () => {
    const cues: Input = [
      { kind: "trigger", name: "cue", at: 100, value: 1 },
      { kind: "trigger", name: "cue", at: 300, value: 1 },
    ];
    const log = inputLog({ windowMs: 4000 });
    const derived = derivedInput();
    let folds = 0;
    const count = state(0, (n) => {
      folds += 1;
      return n + 1;
    });

    for (let at = 0; at <= 4500; at += 500) {
      log.set(at, testInputs, "sample", at);
    }
    log.trigger(5500, testInputs, "tap");

    const m1 = derived.resolve(cues, log.input, 5600);
    const serials1 = inputSerialsOf(m1);
    expect(serials1).toBeDefined();
    const t1 = triggers(testInputs, "tap")(liveAt(5600), m1);
    const tapSerial1 = t1[0]?.serial;
    expect(tapSerial1).toBe(11);
    expect(serials1?.[1]).toBeLessThan(0);
    expect(serials1?.[2]).toBeLessThan(0);
    expect((serials1?.[1] ?? 0) < (serials1?.[2] ?? 0)).toBe(true);

    expect(count(liveAt(5600), m1)).toBe(13);
    const folds1 = folds;

    log.set(5700, testInputs, "sample", 5700);
    const m2 = derived.resolve(cues, log.input, 5700);
    expect(sourceStreamOf(m2)).toBe(sourceStreamOf(m1));
    expect(generationOf(m2)).toBe(generationOf(m1));
    expect(count(liveAt(5700), m2)).toBe(14);
    expect(folds).toBe(folds1 + 1);

    for (let at = 6000; at <= 9500; at += 500) {
      log.set(at, testInputs, "sample", at);
    }
    const m3 = derived.resolve(cues, log.input, 5700);
    const t3 = triggers(testInputs, "tap")(liveAt(5700), m3);
    expect(t3[0]?.serial).toBe(tapSerial1);
  });

  it("rejects an unknown entry kind in inputLog.add via exhaustive switch", () => {
    const log = inputLog();
    const bogus: unknown = JSON.parse('{"kind":"bogus","name":"x","at":0,"value":1}');
    expect(() => Reflect.apply(log.add, log, [bogus])).toThrow(TypeError);
  });
});
