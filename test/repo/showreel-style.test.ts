import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { fade, rise, slide, span, type Time } from "@gerak/moves";
import { styleCards } from "@gerak/tools/scene";
import { reviewSceneModule } from "../../packages/tools/src/scene/review";
import { readSceneModule } from "../../packages/tools/src/scene/scene";

const PIECES = fileURLToPath(new URL("../../apps/pieces/", import.meta.url));

/** Three cards that each slide, rise and fade in with the library's soft moves, one after another. */
const soft = {
  durationMs: 2000,
  style: "showreel",
  scene: (time: Time) =>
    Object.fromEntries(
      [0, 1, 2].map((index) => {
        const enter = span(index * 300, index * 300 + 600).of(time);
        const pose = {
          ...slide({ distance: 200, from: "left" }, enter),
          ...rise({ distance: 80 }, enter),
          ...fade({}, enter),
        };
        return [`card${index}`, pose];
      }),
    ),
};

describe("the showreel's style card", () => {
  it("refuses a piece made only of fade, slide and rise on its travel, where the showreel is lively", async () => {
    const { cards, problems } = await styleCards(PIECES);
    expect(problems).toEqual([]);
    expect(cards.map((each) => each.name)).toContain("showreel");
    const module = readSceneModule(soft);
    if ("reason" in module) throw new Error(module.reason);
    const findings = reviewSceneModule(module, {
      hold: 300,
      jump: 1000,
      turn: 150,
      ratio: 1.5,
      cards,
    }).findings.filter((line) => line.endsWith("(style)"));
    expect(findings.map((line) => line.split(":")[0])).toEqual(["x", "y"]);
  });
});
