import { elapsedOf, type Time } from "@gerak/core";
import { describe, expect, it } from "vitest";
import { readSceneModule } from "../src/scene/scene";
import { reviewSceneModule } from "../src/scene/review";
import * as stageClean from "./fixtures/stage-clean";

const limits = { hold: 500, jump: 1000, turn: 150, ratio: 1.5 };

function review(module: unknown): readonly string[] {
  const read = readSceneModule(module);
  if ("reason" in read) throw new Error(read.reason);
  return reviewSceneModule(read, limits).findings;
}

const ms = (time: Time): number => elapsedOf(time.clock) ?? 0;

/** Falls from 300 to 0 over a second with its fastest step at the end. */
const falling = (time: Time) => {
  const share = Math.min(1, ms(time) / 1000);
  return { ball: { y: 300 * (1 - share ** 3), x: 5 } };
};

const base = { durationMs: 1000, scene: falling };

const designFindings = (design: unknown): readonly string[] => {
  const plain = review(base);
  return review({ ...base, design }).filter((line) => !plain.includes(line));
};

describe("a design checked by the review", () => {
  it("passes a late-peaking fall as heavy and names the peak for light", () => {
    expect(designFindings({ ball: { y: "heavy" } })).toEqual([]);
    const light = designFindings({ ball: { y: "light" } });
    expect(light).toHaveLength(1);
    expect(light[0]).toMatch(/^ball\.y: peak 0\.\d\d, light wants 0 to 0\.35/);
  });

  it("measures each beat of a stage module by its own quality", () => {
    const stage = {
      ...stageClean,
      scene: (time: Time) => {
        const at = ms(time);
        const rise = Math.min(1, Math.max(0, at - 400) / 1000);
        const fall = Math.min(1, Math.max(0, at - 1400) / 600);
        return {
          dot: { y: at < 1400 ? 300 * rise ** 3 : 300 * (1 - fall) ** 3 },
          word: [{ x: 0 }, { x: 0 }],
        };
      },
    };
    const found = (design: unknown): readonly string[] => {
      const plain = review(stage);
      return review({ ...stage, design }).filter((line) => !plain.includes(line));
    };
    expect(found({ dot: { y: { go: "heavy", out: "light" } } })).toEqual([]);
    const wrong = found({ dot: { y: { go: "light", out: "heavy" } } });
    expect(wrong).toHaveLength(2);
    expect(wrong[0]).toMatch(/^dot\.y \(go\): peak/);
    expect(wrong[1]).toMatch(/^dot\.y \(out\): peak/);
  });

  it("names a field that never moves", () => {
    expect(designFindings({ ball: { x: "heavy" } })).toEqual([
      "ball.x never moves; heavy wants motion",
    ]);
  });

  it("names an unknown target, field, beat and quality", () => {
    expect(designFindings({ ghost: { y: "heavy" } })).toEqual([expect.stringContaining('"ghost"')]);
    expect(designFindings({ ball: { nope: "heavy" } })).toEqual([
      expect.stringContaining('"nope"'),
    ]);
    expect(designFindings({ ball: { y: { land: "heavy" } } })).toEqual([
      expect.stringContaining('"land"'),
    ]);
    expect(designFindings({ ball: { y: "gooey" } })).toEqual([expect.stringContaining('"gooey"')]);
  });

  it("refuses a module whose design is not the shape", () => {
    const read = readSceneModule({ ...base, design: { ball: { y: 3 } } });
    expect("reason" in read && read.reason).toContain("ball.y");
    const stage = readSceneModule({ ...stageClean, design: "heavy" });
    expect("reason" in stage && stage.reason).toContain("`design`");
  });

  it("gives a module without a design the findings it had", () => {
    const plain = review(base);
    expect(review({ ...base, design: {} })).toEqual(plain);
    expect(readSceneModule(base)).not.toHaveProperty("design");
  });

  it("reads and checks the design of a stage module", () => {
    const read = readSceneModule({ ...stageClean, design: { dot: { x: "heavy" } } });
    if ("reason" in read) throw new Error(read.reason);
    expect(read.design).toEqual({ dot: { x: "heavy" } });
    const plain = review(stageClean);
    const checked = review({ ...stageClean, design: { dot: { x: "calm" }, dust: { x: "calm" } } });
    expect(checked.filter((line) => !plain.includes(line))).toEqual([
      expect.stringContaining('"dust"'),
    ]);
  });

  it("holds a list member's intent for each item, naming the item that misses, and checks one item by index", () => {
    // Items 0 and 1 fall with their fastest step at the end (heavy); item 2 with it at the start.
    const word = (time: Time) => {
      const share = Math.min(1, ms(time) / 1000);
      const late = { y: 300 * (1 - share ** 3) };
      const early = { y: 300 * (1 - share) ** 3 };
      return { word: [late, late, early] };
    };
    const module = { durationMs: 1000, scene: word };
    const plain = review(module);
    const found = review({
      ...module,
      design: { word: { y: "heavy" }, "word.0": { y: "heavy" } },
    }).filter((line) => !plain.includes(line));
    expect(found).toEqual([expect.stringMatching(/^word\.2\.y: peak/)]);
    const one = review({ ...module, design: { "word.2": { y: "light" } } }).filter(
      (line) => !plain.includes(line),
    );
    expect(one).toEqual([]);
  });
});
