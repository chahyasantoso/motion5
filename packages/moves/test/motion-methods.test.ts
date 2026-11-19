import { atProgress, span, type Time } from "@gerak/core";
import { describe, expect, it } from "vitest";
import { drop, fade, hop, overshoot, rope, trace, wipe } from "../src";

const at = (ms: number, length = 1000): Time => ({
  progress: ms / length,
  clock: { kind: "timed", elapsed: ms, length },
});

describe("moves are motions", () => {
  it("still answer when called with a time directly", () => {
    expect(drop({ distance: 100 })(atProgress(0)).y).toBe(-100);
    expect(fade()(atProgress(0.5)).opacity).toBe(0.5);
  });

  it("play over a span with in, holding the start and the end", () => {
    const falling = drop({ distance: 100 }).in(span(200, 600));
    expect(falling(at(0)).y).toBe(-100);
    expect(falling(at(1000)).y).toBe(0);
    expect(falling(at(400)).y).toBe(drop({ distance: 100 })(atProgress(0.5)).y);
  });

  it("carry the methods on every move and on an overshoot's result", () => {
    const made = [
      drop({ distance: 1 }),
      hop({ height: 10, bounces: 1 }),
      overshoot()(fade()),
      trace(),
      wipe({ radius: 1, x: 0, y: 0 }),
      rope({
        points: [
          { x: 0, y: 0 },
          { x: 10, y: 0 },
        ],
      }),
    ];
    for (const move of made) {
      expect(move.joins).toBe("layer");
      expect(move.take().joins).toBe("take");
      expect(move.loop(500).period).toBe(500);
    }
  });
});
