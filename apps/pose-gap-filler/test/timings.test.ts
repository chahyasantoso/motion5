import { describe, expect, it } from "vitest";
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
