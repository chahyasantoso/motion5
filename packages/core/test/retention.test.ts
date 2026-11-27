// @ts-nocheck
import { describe, expect, it } from "vitest";
import { inputLog, inputs, liveAt, pageInputs, triggers, value } from "@gerak/core";

const jar = inputs({
  values: {
    "jar-slot": { targets: ["slot-0", "slot-1", "slot-2", "slot-3", "slot-4", "slot-5"] },
    "jar-sealed": {},
  },
  triggers: {
    "jar-add": {},
    "jar-remove": {},
  },
});

const SLOT_TARGETS = ["slot-0", "slot-1", "slot-2", "slot-3", "slot-4", "slot-5"] as const;

function feedStream(log: ReturnType<typeof inputLog>, maxRetained?: number): number {
  const durationMs = 30_000;
  const totalFrames = 30 * 60;
  let totalAdded = 0;

  log.set(0, jar, "jar-sealed", 1);
  totalAdded += 1;

  for (let frame = 0; frame <= totalFrames; frame += 1) {
    const at = Math.round((frame * durationMs) / totalFrames);
    log.set(at, pageInputs, "pointer-x", frame + 1);
    totalAdded += 1;

    if (frame % 60 === 0 && frame > 0) {
      const sec = frame / 60;
      log.trigger(at, jar, sec % 2 === 0 ? "jar-remove" : "jar-add", 1);
      totalAdded += 1;
      for (let i = 0; i < SLOT_TARGETS.length; i += 1) {
        const target = SLOT_TARGETS[i];
        if (target !== undefined) {
          log.set(at, jar, "jar-slot", sec * 10 + i, target);
          totalAdded += 1;
        }
      }
    }

    if (maxRetained !== undefined) {
      expect(log.input.length).toBeLessThanOrEqual(maxRetained);
    }
  }

  return totalAdded;
}

describe("inputLog retention", () => {
  it("keeps the window and each name-and-target latest while dropping older entries in batches", () => {
    const windowMs = 4000;
    const log = inputLog({ windowMs });
    // 60 Hz pointer-x + 1/s trigger + 6/s slot values = 67/s, plus 1 per name and target.
    const maxRetained = Math.ceil(((2 * windowMs) / 1000) * 67) + 12;

    feedStream(log, maxRetained);

    const entries = log.input;
    const newest = entries.reduce((max, entry) => Math.max(max, entry.at), 0);

    // Every entry within the window must be retained.
    const recentPointerCount = entries.filter(
      (entry) => entry.name === "pointer-x" && entry.at >= newest - windowMs,
    ).length;
    expect(recentPointerCount).toBeGreaterThanOrEqual(240);

    // Any retained entry older than twice the window must be the latest for its name and target.
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

    // The value set once at t = 0 is still retained.
    const sealedEntry = entries.find((entry) => entry.name === "jar-sealed");
    expect(sealedEntry).toBeDefined();
    expect(sealedEntry?.at).toBe(0);
    expect(sealedEntry?.value).toBe(1);

    // Entries stay in arrival order: the feed records them in time order.
    for (let i = 1; i < entries.length; i += 1) {
      expect(entries[i]?.at ?? -1).toBeGreaterThanOrEqual(entries[i - 1]?.at ?? 0);
    }

    // Readers still see the latest values and only retained triggers.
    const nowTime = liveAt(newest);
    expect(value(jar, "jar-sealed")(nowTime, entries)).toBe(1);
    expect(value(jar, "jar-slot", "slot-2")(nowTime, entries)).toBe(30 * 10 + 2);
    expect(value(pageInputs, "pointer-x")(nowTime, entries)).toBe(30 * 60 + 1);

    const retainedAddTriggers = entries.filter(
      (entry) => entry.kind === "trigger" && entry.name === "jar-add",
    );
    const readAddTriggers = triggers(jar, "jar-add")(nowTime, entries);
    expect(retainedAddTriggers.length).toBeGreaterThan(0);
    expect(readAddTriggers.map((t) => t.at)).toEqual(retainedAddTriggers.map((t) => t.at));
  });

  it("retains every entry when no window is configured", () => {
    const log = inputLog();
    const totalAdded = feedStream(log);
    expect(log.input.length).toBe(totalAdded);
  });
});
