import { describe, expect, it } from "vitest";
import { detectSample } from "../src/live/source";
import { STAGES, createStageTimer, formatTimings } from "../src/live/timings";

describe("live stage timings", () => {
  it("GF-12 reports the source's detection time and each page stage in order", () => {
    const ticks = [100, 101, 104, 110, 111];
    let index = 0;
    const timer = createStageTimer(() => ticks[index++]!);
    timer.mark("adapt");
    timer.mark("fill");
    timer.mark("write");
    timer.mark("draw");
    const timings = timer.finish(40, 12.5);
    expect(timings).toEqual({
      tMs: 40,
      stages: { detect: 12.5, adapt: 1, fill: 3, write: 6, draw: 1 },
    });
    expect(Object.keys(timings.stages).sort()).toEqual([...STAGES].sort());
    expect(formatTimings(timings)).toBe(
      "detect 12.5ms · adapt 1.0ms · fill 3.0ms · write 6.0ms · draw 1.0ms",
    );
  });
});

describe("live source sample", () => {
  it("GF-13 times the detector itself and never repeats a frame time", () => {
    let clock = 50;
    const seen: number[] = [];
    const detect = (tMs: number) => {
      seen.push(tMs);
      clock += 7;
      return { tMs };
    };
    const first = detectSample(detect, -Infinity, () => clock);
    expect(first).toEqual({ result: { tMs: 50 }, tMs: 50, detectMs: 7 });
    // A clock that has not moved past the last frame still yields a strictly later frame time.
    clock = 40;
    const second = detectSample(detect, first.tMs, () => clock);
    expect(second.tMs).toBe(51);
    expect(second.detectMs).toBe(7);
    expect(seen).toEqual([50, 51]);
  });
});
