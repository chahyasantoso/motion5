import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { isMotionEvent, type MotionEvent } from "@gerak/moves";
import { levelOf } from "../src/talk-level";

const SECONDS = 8;
const FPS = 30;
const FRAMES = SECONDS * FPS;
const SILENT_MS = 300;
const SCRIPT = fileURLToPath(new URL("../references/make-talk.mjs", import.meta.url));
const TALK = fileURLToPath(new URL("../references/talk.json", import.meta.url));

function load(path: string): readonly MotionEvent[] {
  const parsed: unknown = JSON.parse(readFileSync(path, "utf8"));
  if (!Array.isArray(parsed)) throw new Error("talk.json is not a list");
  const events: MotionEvent[] = [];
  for (const item of parsed) {
    if (!isMotionEvent(item)) throw new Error(`not a motion event: ${JSON.stringify(item)}`);
    events.push(item);
  }
  return events;
}

const valueOf = (event: MotionEvent): number => event.value ?? Number.NaN;

describe("the made recording of talking", () => {
  const events = load(TALK);
  const mouth = events.filter((event) => event.name === "mouthOpen");
  const blink = events.filter((event) => event.name === "blink");

  it("is a sorted list of a mouthOpen and a blink sample per frame, within 0 to 1", () => {
    expect(mouth).toHaveLength(FRAMES);
    expect(blink).toHaveLength(FRAMES);
    expect(events).toHaveLength(2 * FRAMES);
    for (let i = 1; i < events.length; i += 1)
      expect(events[i]?.at ?? -1).toBeGreaterThanOrEqual(events[i - 1]?.at ?? 0);
    for (const event of events) {
      expect(valueOf(event)).toBeGreaterThanOrEqual(0);
      expect(valueOf(event)).toBeLessThanOrEqual(1);
    }
  });

  it("blinks fully at least twice and has a silent stretch of 300 ms", () => {
    let closes = 0;
    blink.forEach((event, i) => {
      const before = valueOf(blink[i - 1] ?? event);
      if (valueOf(event) === 1 && before < 1) closes += 1;
    });
    expect(closes).toBeGreaterThanOrEqual(2);
    let longest = 0;
    let from: number | undefined;
    for (const event of mouth) {
      if (valueOf(event) === 0) {
        from ??= event.at;
        longest = Math.max(longest, event.at - from);
      } else from = undefined;
    }
    expect(longest).toBeGreaterThanOrEqual(SILENT_MS);
  });

  it("is written again, byte for byte, by its script", () => {
    const dir = mkdtempSync(join(tmpdir(), "talk-"));
    try {
      const out = join(dir, "talk.json");
      execFileSync(process.execPath, [SCRIPT, out]);
      expect(readFileSync(out, "utf8")).toBe(readFileSync(TALK, "utf8"));
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe("levelOf", () => {
  it("is 0 at and under the floor, rises with the gain, and stops at 1", () => {
    expect(levelOf(0.02)).toBe(0);
    expect(levelOf(0.01)).toBe(0);
    expect(levelOf(0)).toBe(0);
    expect(levelOf(0.07)).toBeCloseTo(0.3, 10);
    expect(levelOf(0.5)).toBe(1);
    expect(levelOf(0.1, 0.1, 6)).toBe(0);
    expect(levelOf(0.2, 0.1, 5)).toBeCloseTo(0.5, 10);
  });
});
