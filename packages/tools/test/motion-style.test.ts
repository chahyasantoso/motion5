import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { styleCards } from "../src/scene/cards";
import { measureShapes } from "../src/scene/review";
import { readSceneModule } from "../src/scene/scene";
import { checkStyle, measureStyle } from "../src/scene/style";

const scratchRoots: string[] = [];
afterEach(() => {
  for (const root of scratchRoots.splice(0)) rmSync(root, { recursive: true, force: true });
});

function localRoot(files: Readonly<Record<string, string>>): string {
  const root = mkdtempSync(join(tmpdir(), "motion-style-"));
  scratchRoots.push(root);
  for (const [file, text] of Object.entries(files)) {
    mkdirSync(join(root, file, ".."), { recursive: true });
    writeFileSync(join(root, file), text);
  }
  return root;
}

const BOUNCY = "300 * (1 - (1 + 2.70158 * (p - 1) ** 3 + 1.70158 * (p - 1) ** 2))";
const LINEAR = "300 * (1 - p)";

const piece = (falls: readonly string[], extra = "", span = 600): string => `
export const durationMs = 1500;
${extra}
export const scene = (time: { progress: number; clock: { kind: string; elapsed?: number } }) => {
  const p = Math.min(1, (time.clock.elapsed ?? 0) / ${span});
  return { ${falls.map((fall, index) => `b${index}: { y: ${fall}, x: 300 * p }`).join(", ")} };
};
`;

const three = (...falls: string[]): readonly string[] => falls;

const reel = (): string =>
  localRoot({
    "reel/src/drop.ts": piece(three(BOUNCY, BOUNCY, BOUNCY)),
    "reel/src/mixed.ts": piece(three(BOUNCY, BOUNCY, LINEAR), "", 800),
  });

describe("gerak style", () => {
  it("measures the range of the lively share per field into a card file", async () => {
    const root = reel();
    const made = await measureStyle(root, "reel");
    expect(made.kind).toBe("written");
    if (made.kind !== "written") return;
    expect(made.file).toBe(join(root, "reel", "style.ts"));
    expect(made.card.qualities).toEqual({});
    expect(made.card.lively["y"]).toEqual([0.55, 1]);
    const { cards, problems } = await styleCards(root);
    expect(problems).toEqual([]);
    expect(cards.map((card) => card.name)).toEqual(["reel"]);
  });

  it("leaves out a field whose range comes out 0 to 1", async () => {
    const root = localRoot({
      "reel/src/all.ts": piece(three(BOUNCY, BOUNCY, BOUNCY)),
      "reel/src/none.ts": piece(three(LINEAR, LINEAR, LINEAR)),
    });
    const made = await measureStyle(root, "reel");
    expect(made.kind).toBe("written");
    if (made.kind === "written") expect(made.card.lively["y"]).toBeUndefined();
  });

  it("keeps a wide range that still refuses something", async () => {
    const root = localRoot({
      "reel/src/all.ts": piece(three(BOUNCY, BOUNCY, BOUNCY)),
      "reel/src/half.ts": piece(three(BOUNCY, LINEAR, LINEAR)),
    });
    const made = await measureStyle(root, "reel");
    expect(made.kind === "written" ? made.card.lively["y"] : undefined).toEqual([0.2, 1]);
  });

  it("passes a brief right after measuring it", async () => {
    const root = reel();
    await measureStyle(root, "reel");
    expect(await checkStyle(root, "reel")).toEqual([]);
  });

  it("reviews a soft piece of the brief itself under its card, with no style export", async () => {
    const root = reel();
    await measureStyle(root, "reel");
    writeFileSync(join(root, "reel", "src", "soft.ts"), piece(three(LINEAR, LINEAR, LINEAR)));
    const found = await checkStyle(root, "reel");
    expect(found).toHaveLength(1);
    expect(found[0]?.startsWith("reel/src/soft.ts: ")).toBe(true);
    expect(found[0]?.endsWith("(style)")).toBe(true);
  });

  it("reports a piece that throws on import or that exports a style but no scene", async () => {
    const root = reel();
    await measureStyle(root, "reel");
    writeFileSync(join(root, "reel", "src", "broken.ts"), 'throw new Error("boom");\n');
    writeFileSync(join(root, "reel", "src", "stray.ts"), 'export const style = "reel";\n');
    writeFileSync(join(root, "reel", "src", "helper.ts"), "export const x = 1;\n");
    const found = await checkStyle(root, "reel");
    expect(found).toHaveLength(2);
    expect(found).toContain("reel/src/broken.ts: could not be imported: boom");
    expect(
      found.some((line) => line.startsWith("reel/src/stray.ts: ") && line.includes("scene")),
    ).toBe(true);
  });

  it("refuses to measure a brief with a piece that throws on import", async () => {
    const root = reel();
    writeFileSync(join(root, "reel", "src", "broken.ts"), 'throw new Error("boom");\n');
    const made = await measureStyle(root, "reel");
    expect(made.kind).toBe("refused");
    if (made.kind === "refused") expect(made.message).toContain("broken.ts");
    expect(existsSync(join(root, "reel", "style.ts"))).toBe(false);
  });

  it("measures a field from the motions its design does not name", async () => {
    const design = 'export const design = { b3: { y: "calm" }, b4: { y: "calm" } };';
    const root = localRoot({
      "reel/src/named.ts": piece(three(BOUNCY, BOUNCY, BOUNCY, LINEAR, LINEAR), design),
    });
    const made = await measureStyle(root, "reel");
    expect(made.kind === "written" ? made.card.lively["y"] : undefined).toEqual([0.9, 1]);
  });

  it("does not count a finding that only mentions the brief as the brief's", async () => {
    const root = reel();
    await measureStyle(root, "reel");
    mkdirSync(join(root, "other", "src", "moves"), { recursive: true });
    writeFileSync(
      join(root, "other", "src", "moves", "m.ts"),
      'import { x } from "../../../reel/src/moves/x";\nexport const m = x;\n',
    );
    expect(await checkStyle(root, "reel")).toEqual([]);
  });

  it("finds a piece of another brief that follows the card and misses its share", async () => {
    const root = reel();
    await measureStyle(root, "reel");
    mkdirSync(join(root, "tour", "src"), { recursive: true });
    writeFileSync(
      join(root, "tour", "src", "flat.ts"),
      piece(three(LINEAR, LINEAR, LINEAR), 'export const style = "reel";'),
    );
    const found = await checkStyle(root, "reel");
    expect(found).toHaveLength(1);
    expect(found[0]?.startsWith("tour/src/flat.ts: ")).toBe(true);
    expect(found[0]?.endsWith("(style)")).toBe(true);
  });

  it("leaves a piece's own review findings to the piece, counting only the card's", async () => {
    const root = reel();
    await measureStyle(root, "reel");
    mkdirSync(join(root, "tour", "src"), { recursive: true });
    const short = piece(three(BOUNCY, BOUNCY, BOUNCY), 'export const style = "reel";').replace(
      "1500",
      "700",
    );
    writeFileSync(join(root, "tour", "src", "short.ts"), short);
    expect(await checkStyle(root, "reel")).toEqual([]);
  });

  it("refuses to measure twice and an unknown brief", async () => {
    const root = reel();
    await measureStyle(root, "reel");
    const again = await measureStyle(root, "reel");
    expect(again.kind).toBe("refused");
    if (again.kind === "refused") expect(again.message).toContain(join("reel", "style.ts"));
    expect((await measureStyle(root, "nope")).kind).toBe("refused");
    expect(existsSync(join(root, "nope"))).toBe(false);
  });

  it("finds a brief move that imports from another brief", async () => {
    const root = reel();
    await measureStyle(root, "reel");
    writeFileSync(join(root, "reel", "src", "stray.txt"), "");
    mkdirSync(join(root, "reel", "src", "moves"), { recursive: true });
    writeFileSync(
      join(root, "reel", "src", "moves", "stray.ts"),
      'import { x } from "../../../other/src/parts/envelope/x";\nexport const stray = x;\n',
    );
    const found = await checkStyle(root, "reel");
    expect(found).toContain(
      `${join("reel", "src", "moves", "stray.ts")} imports ../../../other/src/parts/envelope/x`,
    );
  });

  it("measures one shape per beat for a field that moves in both", async () => {
    const text = `
import { story } from "@gerak/stage";
export const durationMs = 1000;
export const beats = story(1000, { a: [0, 400], b: [600, 1000] });
export const cast = {};
export const skins = {};
export const scene = (time: { clock: { kind: string; elapsed?: number } }) => {
  const at = time.clock.elapsed ?? 0;
  const t = at < 500 ? Math.min(1, at / 400) : Math.min(1, Math.max(0, (at - 600) / 400));
  return { ball: { x: 100 * t } };
};
`;
    const root = localRoot({ "reel/src/two.ts": text });
    const shapes = measureShapes(await moduleOf(join(root, "reel", "src", "two.ts")));
    expect(shapes.filter((each) => each.field === "x").map((each) => each.beat)).toEqual([
      "a",
      "b",
    ]);
  });
});

async function moduleOf(file: string): Promise<Parameters<typeof measureShapes>[0]> {
  const { pathToFileURL } = await import("node:url");
  const read = readSceneModule(await import(pathToFileURL(file).href));
  if ("reason" in read) throw new Error(read.reason);
  return read;
}
