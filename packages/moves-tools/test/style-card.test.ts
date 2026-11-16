import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { styleCards } from "../src/cards";
import { reviewSceneFile, type SceneReviewRequest } from "@gerak/tools/scene";

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

const card = (name: string, lively = "[0.5, 1]"): string => `
import { defineStyle } from "@gerak/moves";
export const card = defineStyle({
  name: "${name}",
  description: "A reel.",
  qualities: {},
  lively: { y: ${lively} },
  tokens: {},
  habits: [],
});
`;

const BOUNCY = "300 * (1 - (1 + 2.70158 * (p - 1) ** 3 + 1.70158 * (p - 1) ** 2))";
const LINEAR = "300 * (1 - p)";

/** A piece whose balls fall as given; `null` keeps a ball still. */
const piece = (falls: readonly (string | null)[], extra = ""): string => `
export const durationMs = 1000;
export const style = "reel";
${extra}
export const scene = (time: { progress: number; clock: { kind: string; elapsed?: number } }) => {
  const p = Math.min(1, (time.clock.elapsed ?? 0) / 600);
  return { ${falls.map((fall, index) => `b${index}: { y: ${fall ?? "0"}, x: 3 }`).join(", ")} };
};
`;

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
  return result.findings.filter((line) => !line.includes(".x"));
}

describe("a piece's style lively share", () => {
  it("gives no finding when every y is lively", async () => {
    const dir = root({ good: piece([BOUNCY, BOUNCY, BOUNCY]) });
    expect(await findings(dir, "good")).toEqual([]);
  });

  it("names the share when no y is lively", async () => {
    const dir = root({ flat: piece([LINEAR, LINEAR, LINEAR]) });
    expect(await findings(dir, "flat")).toEqual([
      "y: 0 of 3 motions lively (0%); reel wants 50% to 100% (style)",
    ]);
  });

  it("gives no finding for two lively of three", async () => {
    const dir = root({ mixed: piece([BOUNCY, BOUNCY, LINEAR]) });
    expect(await findings(dir, "mixed")).toEqual([]);
  });

  it("lets a design that names y on every ball win", async () => {
    const design =
      'export const design = { b0: { y: "calm" }, b1: { y: "calm" }, b2: { y: "calm" } };';
    const dir = root({ named: piece([LINEAR, LINEAR, LINEAR], design) });
    expect((await findings(dir, "named")).filter((line) => line.endsWith("(style)"))).toEqual([]);
  });

  it("leaves out only the beat a design names, and all beats when it names none", async () => {
    const stage = (design: string): string => `
import { story } from "@gerak/stage";
export const style = "reel";
export const beats = story(1000, { a: [0, 400], b: [600, 1000] });
export const cast = {};
export const skins = {};
export const design = ${design};
export const scene = (time: { clock: { kind: string; elapsed?: number } }) => {
  const at = time.clock.elapsed ?? 0;
  const t = at < 500 ? Math.min(1, at / 400) : Math.min(1, Math.max(0, (at - 600) / 400));
  const y = 300 * (1 - t);
  return { b0: { y }, b1: { y }, b2: { y } };
};
`;
    const names = (beat: string): string =>
      `{ b0: { y: ${beat} }, b1: { y: ${beat} }, b2: { y: ${beat} } }`;
    const dir = root({
      once: stage(names('{ a: "calm" }')),
      always: stage(names('"calm"')),
    });
    const style = async (name: string): Promise<readonly string[]> =>
      (await findings(dir, name)).filter((line) => line.includes("(style)"));
    expect(await style("once")).toHaveLength(1);
    expect((await style("once"))[0]).toContain("y: 0 of 3 motions lively");
    expect(await style("always")).toEqual([]);
  });

  it("reviews a piece with no style though a style file beside it throws", async () => {
    const dir = localRoot({
      "reel/style.ts": 'throw new Error("bad card");\n',
      "reel/src/.keep": "",
      "tour/src/plain.ts": piece([BOUNCY, BOUNCY, BOUNCY]).replace(
        'export const style = "reel";',
        "",
      ),
    });
    const result = await reviewSceneFile(request(join(dir, "tour", "src", "plain.ts")));
    expect(result.kind).toBe("reviewed");
  });

  it("gives nothing when y moves on fewer than three balls", async () => {
    const dir = root({ few: piece([LINEAR, LINEAR, null]) });
    expect(await findings(dir, "few")).toEqual([]);
  });

  it("finds lively motion in a calm card", async () => {
    const dir = localRoot({
      "reel/style.ts": card("reel", "[0, 0.1]"),
      "reel/src/.keep": "",
      "tour/src/loud.ts": piece([BOUNCY, BOUNCY, BOUNCY]),
    });
    expect(await findings(dir, "loud")).toEqual([
      "y: 3 of 3 motions lively (100%); reel wants 0% to 10% (style)",
    ]);
  });

  it("is a usage message for a style no card names", async () => {
    const dir = root({ lost: piece([BOUNCY]).replace('"reel"', '"nope"') });
    expect(await findings(dir, "lost")).toEqual(['style "nope" names no card; the cards are reel']);
  });

  it("is a problem when the card's name is not its folder's", async () => {
    const dir = localRoot({ "reel/style.ts": card("other"), "reel/src/.keep": "" });
    const { cards, problems } = await styleCards(dir);
    expect(cards).toEqual([]);
    expect(problems.join("\n")).toMatch(/reel\/style\.ts.*"other".*"reel"/);
  });
});
