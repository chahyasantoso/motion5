import { describe, expect, it } from "vitest";
import type { Frame } from "../src/page/check";
import { pickFrames } from "../src/page/pick";

/** One element sampled every 16 ms, its x given by `x(ms)`. */
function samples(x: (ms: number) => number, to: number): readonly Frame[] {
  const frames: Frame[] = [];
  for (let at = 0; at <= to; at += 16)
    frames.push({ at, elements: [{ name: ".a", box: { x: x(at), y: 0, width: 20, height: 20 } }] });
  return frames;
}

describe("pickFrames", () => {
  it("takes several times inside a snap that rests before and after", () => {
    const snap = (ms: number) => Math.min(100, Math.max(0, ((ms - 800) / 96) * 100));
    const picked = pickFrames(samples(snap, 3200));
    expect(picked[0]).toEqual({ at: 0, reason: "start" });
    expect(picked.at(-1)).toEqual({ at: 3200, reason: "end" });
    expect(
      picked.filter(({ at, reason }) => reason === "fast" && at >= 800 && at <= 896).length,
    ).toBeGreaterThanOrEqual(3);
  });

  it("takes only the two ends where nothing moves", () => {
    expect(pickFrames(samples(() => 40, 3000))).toEqual([
      { at: 0, reason: "start" },
      { at: 2992, reason: "end" },
    ]);
  });

  it("marks each reversal of a swing as a turn", () => {
    const swing = (ms: number) => Math.abs(((ms % 960) / 480 - 1) * 100);
    const picked = pickFrames(samples(swing, 1440));
    const turns = picked.filter(({ reason }) => reason === "turn").map(({ at }) => at);
    expect(turns).toHaveLength(2);
    expect(turns[0]).toBeGreaterThanOrEqual(464);
    expect(turns[0]).toBeLessThanOrEqual(496);
    expect(turns[1]).toBeGreaterThanOrEqual(944);
    expect(turns[1]).toBeLessThanOrEqual(976);
  });

  it("holds the cap, keeps times ascending and 48 ms apart", () => {
    const picked = pickFrames(
      samples((ms) => 50 + 50 * Math.sin(ms / 60), 3000),
      6,
    );
    expect(picked).toHaveLength(6);
    for (const [index, { at }] of picked.entries()) {
      const before = picked[index - 1];
      if (before !== undefined) expect(at - before.at).toBeGreaterThanOrEqual(48);
    }
    expect(pickFrames([])).toEqual([]);
  });
});
