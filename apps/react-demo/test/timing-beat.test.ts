import { describe, expect, it } from "vitest";
import { manualDriver, play } from "@motion5/player";
import { code } from "../../../test/repo/helpers/source-region";
import { BEAT_MS, timingScene } from "../src/timing-scene";

const COMPONENT_URL = new URL("../src/TimingBeat.tsx", import.meta.url);

function at(ms: number) {
  const driver = manualDriver({ durationMs: BEAT_MS });
  const player = play(timingScene({ x: 0, y: 0 }), driver);
  driver.seek(ms / BEAT_MS);
  return player.values;
}

describe("timing beat", () => {
  it("holds every letter above the stage at the first frame", () => {
    expect(at(0).letters.map((letter) => letter.y)).toEqual([-700, -700, -700, -700, -700, -700]);
  });

  it("drops the letters in order", () => {
    const heights = at(500).letters.map((letter) => letter.y ?? 0);
    for (let index = 1; index < heights.length; index += 1)
      expect(heights[index]).toBeLessThanOrEqual(heights[index - 1] ?? 0);
    expect(heights[0]).toBe(0);
    expect(heights[5]).toBe(-700);
  });

  it("lands the word before the wipe", () => {
    expect(at(2300).letters.map((letter) => letter.y)).toEqual([0, 0, 0, 0, 0, 0]);
  });

  it("covers the stage by the end", () => {
    expect(at(3000).cover.radius).toBe(1500);
  });

  it("keeps all motion out of the component: no arithmetic, easing or timing there", () => {
    const source = code(COMPONENT_URL);
    expect(source).not.toMatch(/Math\.|ease|duration|stagger|progress/i);
  });
});
