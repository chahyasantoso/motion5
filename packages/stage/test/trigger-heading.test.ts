import { INPUT_EVENTS, liveAt, type Input } from "@gerak/core";
import { describe, expect, it } from "vitest";
import { beat, scrollPoint } from "../src";

const scrolls = (...steps: readonly [at: number, value: number][]): Input =>
  steps.map(([at, value]) => ({ kind: "value", name: INPUT_EVENTS.scroll, at, value }));

describe("which way a trigger's clock part runs", () => {
  it("forward after crossing and at rest once done, for each way back", () => {
    for (const back of ["reverse", "stay", "replay"] as const) {
      const reveal = beat(`reveal-${back}`, 400, { when: scrollPoint(100).reached, back });
      const events = scrolls([0, 200]);
      expect(reveal.heading(liveAt(0), { events }), back).toBe(1);
      expect(reveal.heading(liveAt(200), { events }), back).toBe(1);
      expect(reveal.heading(liveAt(500), { events }), back).toBe(0);
      expect(reveal.heading(liveAt(0), { events: [] }), back).toBe(0);
    }
  });

  it("back towards 0 after crossing back with reverse, and not with stay or replay", () => {
    const events = scrolls([0, 200], [200, 0]);
    const at = liveAt(300);
    const reverse = beat("r", 400, { when: scrollPoint(100).reached, back: "reverse" });
    const stay = beat("s", 400, { when: scrollPoint(100).reached, back: "stay" });
    const replay = beat("p", 400, { when: scrollPoint(100).reached, back: "replay" });
    expect(reverse.heading(at, { events })).toBe(-1);
    expect(reverse.heading(liveAt(500), { events })).toBe(0);
    expect(stay.heading(at, { events })).toBe(1);
    expect(replay.heading(at, { events })).toBe(0);
  });
});
