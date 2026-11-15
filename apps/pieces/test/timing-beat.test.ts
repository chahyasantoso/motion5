import { describe, expect, it } from "vitest";
import { manualDriver, play } from "@gerak/player";
import { code } from "../../../test/repo/helpers/source-region";
import { BEAT_MS, timingScene } from "../timing/src/timing-scene";

const COMPONENT_URL = new URL("../timing/src/TimingBeat.tsx", import.meta.url);

function at(ms: number) {
  const driver = manualDriver({ durationMs: BEAT_MS });
  const player = play(timingScene({ x: 0, y: 0 }), driver);
  driver.seek(ms / BEAT_MS);
  return player.values;
}

describe("timing beat", () => {
  it("holds every letter above the stage at the first frame, and the dot off it", () => {
    const first = at(0);
    expect(first.letters.map((letter) => letter.y)).toEqual([-700, -700, -700, -700, -700, -700]);
    expect(first.dot).toMatchObject({ x: -1300, y: 0 });
    expect(first.cover).toMatchObject({ clipRadius: 0, clipX: 0, clipY: 0 });
  });

  it("drops the letters in order", () => {
    const heights = at(500).letters.map((letter) => letter.y ?? 0);
    for (let index = 1; index < heights.length; index += 1)
      expect(heights[index]).toBeLessThanOrEqual(heights[index - 1] ?? 0);
    expect(heights[0]).toBe(0);
    expect(heights[5]).toBe(-700);
  });

  it("lands the word and the dot at their rest poses before the wipe", () => {
    const landed = at(2300);
    expect(landed.letters.map((letter) => letter.y)).toEqual([0, 0, 0, 0, 0, 0]);
    expect(landed.dot).toMatchObject({ x: 0, y: 0, scaleX: 1, scaleY: 1 });
  });

  it("covers the stage by the end", () => {
    expect(at(3000).cover.clipRadius).toBe(1500);
  });

  it("keeps all motion out of the component: no arithmetic, easing or timing there", () => {
    const source = code(COMPONENT_URL);
    expect(source).not.toMatch(/Math\.|ease|duration|stagger|progress/i);
  });
});
