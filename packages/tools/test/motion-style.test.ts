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

const piece = (fall: string, extra = "", span = 600): string => `
export const durationMs = 1500;
${extra}
export const scene = (time: { progress: number; clock: { kind: string; elapsed?: number } }) => {
  const p = Math.min(1, (time.clock.elapsed ?? 0) / ${span});
  return { ball: { y: ${fall}, x: 300 * p } };
};
`;

const reel = (): string =>
  localRoot({
    "reel/src/drop.ts": piece(BOUNCY),
    "reel/src/slow.ts": piece(BOUNCY, "", 800),
  });

describe("motion:style", () => {
  it("measures a brief's pieces into a card file", async () => {
    const root = reel();
    const made = await measureStyle(root, "reel");
    expect(made.kind).toBe("written");
    if (made.kind !== "written") return;
    expect(made.file).toBe(join(root, "reel", "style.ts"));
    expect(Object.keys(made.card.qualities).sort()).toEqual(["x", "y"]);
    expect(made.card.defaults).toEqual({ y: "reel/y", x: "reel/x" });
    const shape = measureShapes(await moduleOf(join(root, "reel", "src", "drop.ts"))).find(
      (each) => each.field === "y",
    );
    const range = made.card.qualities["y"]?.overshoot;
    expect(shape?.descriptors.overshoot).toBeGreaterThan(0);
    expect(range?.[0]).toBeLessThanOrEqual(shape?.descriptors.overshoot ?? NaN);
    expect(range?.[1]).toBeGreaterThanOrEqual(shape?.descriptors.overshoot ?? NaN);
    const { cards, problems } = await styleCards(root);
    expect(problems).toEqual([]);
    expect(cards.map((card) => card.name)).toEqual(["reel"]);
  });

  it("passes a brief right after measuring it", async () => {
    const root = reel();
    await measureStyle(root, "reel");
    expect(await checkStyle(root, "reel")).toEqual([]);
  });

  it("finds a piece of another brief that follows the card and misses it", async () => {
    const root = reel();
    await measureStyle(root, "reel");
    mkdirSync(join(root, "tour", "src"), { recursive: true });
    writeFileSync(
      join(root, "tour", "src", "flat.ts"),
      piece(LINEAR, 'export const style = "reel";'),
    );
    const found = await checkStyle(root, "reel");
    expect(found).toHaveLength(1);
    expect(found[0]?.startsWith("tour/src/flat.ts: ")).toBe(true);
    expect(found[0]?.endsWith("(style default)")).toBe(true);
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
    expect(found.join("\n")).toContain("../../../other/src/parts/envelope/x");
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
