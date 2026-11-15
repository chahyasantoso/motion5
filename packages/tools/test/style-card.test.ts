import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { styleCards } from "../src/scene/cards";
import { reviewSceneFile, type SceneReviewRequest } from "../src/scene/review";

const scratchRoots: string[] = [];
afterEach(() => {
  for (const root of scratchRoots.splice(0)) rmSync(root, { recursive: true, force: true });
});

function localRoot(files: Readonly<Record<string, string>>): string {
  const root = mkdtempSync(join(tmpdir(), "style-cards-"));
  scratchRoots.push(root);
  for (const [file, text] of Object.entries(files)) {
    mkdirSync(join(root, file, ".."), { recursive: true });
    writeFileSync(join(root, file), text);
  }
  return root;
}

const card = (name: string): string => `
import { defineStyle } from "@gerak/moves";
export const card = defineStyle({
  name: "${name}",
  description: "A reel.",
  qualities: { arrive: { overshoot: [0.05, 0.3] } },
  defaults: { y: "${name}/arrive" },
  tokens: {},
  habits: [],
});
`;

const piece = (fall: string, extra = ""): string => `
export const durationMs = 1000;
export const style = "reel";
${extra}
export const scene = (time: { progress: number; clock: { kind: string; elapsed?: number } }) => {
  const p = Math.min(1, (time.clock.elapsed ?? 0) / 600);
  return { ball: { y: ${fall}, x: 3 } };
};
`;

const BOUNCY = "300 * (1 - (1 + 2.70158 * (p - 1) ** 3 + 1.70158 * (p - 1) ** 2))";
const LINEAR = "300 * (1 - p)";

const request = (file: string): SceneReviewRequest => ({
  file,
  hold: 300,
  jump: 1000,
  turn: 150,
  ratio: 1.5,
  budget: 1000,
});

const root = (pieces: Readonly<Record<string, string>>): string =>
  localRoot({
    "reel/style.ts": card("reel"),
    "reel/src/.keep": "",
    ...Object.fromEntries(
      Object.entries(pieces).map(([name, text]) => [`tour/src/${name}.ts`, text]),
    ),
  });

async function findings(dir: string, name: string): Promise<readonly string[]> {
  const result = await reviewSceneFile(request(join(dir, "tour", "src", `${name}.ts`)));
  if (result.kind === "usage") return [result.message];
  return result.findings.filter(
    (line) => line.includes("style default") || !line.includes("ball.x"),
  );
}

describe("a piece's style default", () => {
  it("gives no finding when y meets the default", async () => {
    const dir = root({ good: piece(BOUNCY) });
    expect(await findings(dir, "good")).toEqual([]);
  });

  it("names the card quality when y is linear", async () => {
    const dir = root({ flat: piece(LINEAR) });
    const found = await findings(dir, "flat");
    expect(found).toHaveLength(1);
    expect(found[0]).toMatch(
      /^ball\.y: overshoot 0\.00, reel\/arrive wants 0\.05 to 0\.30 \(style default\)$/,
    );
  });

  it("lets a design that names y win", async () => {
    const dir = root({ named: piece(LINEAR, 'export const design = { ball: { y: "calm" } };') });
    expect((await findings(dir, "named")).filter((line) => line.includes("style default"))).toEqual(
      [],
    );
  });

  it("gives nothing for a field that never moves", async () => {
    const dir = root({ still: piece("0") });
    expect(await findings(dir, "still")).toEqual([]);
  });

  it("is a usage message for a style no card names", async () => {
    const dir = root({ lost: piece(BOUNCY).replace('"reel"', '"nope"') });
    expect(await findings(dir, "lost")).toEqual(['style "nope" names no card; the cards are reel']);
  });

  it("is a problem when the card's name is not its folder's", async () => {
    const dir = localRoot({ "reel/style.ts": card("other"), "reel/src/.keep": "" });
    const { cards, problems } = await styleCards(dir);
    expect(cards).toEqual([]);
    expect(problems.join("\n")).toMatch(/reel\/style\.ts.*"other".*"reel"/);
  });
});
