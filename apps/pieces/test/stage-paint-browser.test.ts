import { readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Page } from "playwright-core";
import { createServer, type ViteDevServer } from "vite";
import { DEFAULT_ROOT, withPage } from "@gerak/tools/page";

const PREFIX = "stage-paint-scratch-";
const SRC = join(DEFAULT_ROOT, "src");
const STEP_TIMEOUT_MS = 8000;

/** Helpers every scratch piece writes first: a closed rectangle as four straight cubics. */
const SHAPES = `import { story } from "@gerak/stage";
const seg = (id: string, x0: number, y0: number, x3: number, y3: number) => ({
  id, x0, y0, x1: x0 + (x3 - x0) / 3, y1: y0 + (y3 - y0) / 3,
  x2: x0 + (2 * (x3 - x0)) / 3, y2: y0 + (2 * (y3 - y0)) / 3, x3, y3,
});
const rect = (x: number, y: number, w: number, h: number) => [
  seg("t", x, y, x + w, y), seg("r", x + w, y, x + w, y + h),
  seg("b", x + w, y + h, x, y + h), seg("l", x, y + h, x, y),
];
export const beats = story(1000, { go: [0, 1000] });
`;

const PIECES: Readonly<Record<string, string>> = {
  gradient: `${SHAPES}import { actor } from "@gerak/stage";
export const cast = {
  left: actor({ path: rect(100, 100, 200, 100), still: true }),
  right: actor({ path: rect(400, 100, 200, 100), still: true }),
};
export const skins = { dom: {
  defs: '<linearGradient id="belly" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff0000"/><stop offset="1" stop-color="#0000ff"/></linearGradient>',
  css: '[data-path="left"] { fill: url(#belly); stroke: none; } [data-path="right"] { fill: url(#belly); stroke: none; }',
} };
export const scene = () => ({});
`,
  line: `${SHAPES}import { actor } from "@gerak/stage";
export const cast = { flat: actor({ path: [seg("a", 100, 300, 500, 300)], still: true }) };
export const skins = { dom: { css: '[data-path="flat"] { stroke: #000; stroke-width: 4; }' } };
export const scene = () => ({});
`,
  squash: `${SHAPES}import { actor } from "@gerak/stage";
export const cast = { part: actor({ path: rect(200, 200, 100, 100), pivot: { x: 210, y: 210 } }) };
export const skins = { dom: { css: '[data-path="part"] { fill: #36c; stroke: none; }' } };
export const scene = () => ({ part: { scaleY: 0.5, anchor: "bottom" as const } });
`,
  turn: `${SHAPES}import { actor } from "@gerak/stage";
export const cast = { part: actor({ path: rect(200, 200, 100, 100), pivot: { x: 210, y: 210 } }) };
export const skins = { dom: { css: '[data-path="part"] { fill: #36c; stroke: none; }' } };
export const scene = () => ({ part: { rotation: 90 } });
`,
};

function removeLeftovers(): void {
  for (const file of readdirSync(SRC))
    if (file.startsWith(PREFIX)) rmSync(join(SRC, file), { force: true });
}

let server: ViteDevServer | undefined;
let base = "";

beforeAll(async () => {
  removeLeftovers();
  for (const [name, source] of Object.entries(PIECES))
    writeFileSync(join(SRC, `${PREFIX}${name}.ts`), source, "utf8");
  server = await createServer({ root: DEFAULT_ROOT, logLevel: "silent", server: { port: 5290 } });
  await server.listen();
  base = server.resolvedUrls?.local[0] ?? "";
  if (base === "") throw new Error("The page server reported no local address.");
}, 60000);

afterAll(async () => {
  await server?.close();
  removeLeftovers();
});

/** Opens `piece` in Chromium and hands the page over. */
async function inChromium(piece: string, visit: (page: Page) => Promise<void>): Promise<void> {
  await withPage(
    {
      page: `stage.html?piece=${PREFIX}${piece}`,
      width: 1280,
      height: 720,
      source: { kind: "url", base },
    },
    async ({ page, advanceTo }) => {
      page.setDefaultTimeout(STEP_TIMEOUT_MS);
      await page.locator('[data-stage="frame"]').waitFor();
      await advanceTo(200);
      await visit(page);
    },
  );
}

/** The RGBA of each point of a screenshot, read back through a canvas in the page itself. */
async function pixels(
  page: Page,
  points: readonly (readonly [number, number])[],
): Promise<readonly (readonly number[])[]> {
  const shot = (await page.screenshot()).toString("base64");
  return page.evaluate(
    async ({ shot: png, points: at }) => {
      const image = new Image();
      image.src = `data:image/png;base64,${png}`;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext("2d");
      if (context === null) throw new Error("No canvas context.");
      context.drawImage(image, 0, 0);
      return at.map(([x, y]) => [...context.getImageData(Math.round(x), Math.round(y), 1, 1).data]);
    },
    { shot, points },
  );
}

/** A box on the page: the frame's origin and an element's rectangle in the frame's own px. */
async function inFrame(
  page: Page,
  name: string,
): Promise<{ left: number; top: number; right: number; bottom: number }> {
  const frame = await page.locator('[data-stage="frame"]').boundingBox();
  const box = await page.locator(`[data-cast="${name}"]`).evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom };
  });
  if (frame === null) throw new Error("No frame.");
  return {
    left: box.left - frame.x,
    top: box.top - frame.y,
    right: box.right - frame.x,
    bottom: box.bottom - frame.y,
  };
}

function run(piece: string, visit: (page: Page) => Promise<void>) {
  return () => inChromium(piece, visit);
}

describe("a stage's parts in the browser", () => {
  it(
    "paints two parts that share one gradient, each with its own colours",
    run("gradient", async (page) => {
      const frame = await page.locator('[data-stage="frame"]').boundingBox();
      if (frame === null) throw new Error("No frame.");
      const at = (x: number, y: number): [number, number] => [frame.x + x, frame.y + y];
      const [leftStart, leftEnd, rightStart, rightEnd] = await pixels(page, [
        at(110, 150),
        at(290, 150),
        at(410, 150),
        at(590, 150),
      ]);
      expect(leftStart?.[0]).toBeGreaterThan(180);
      expect(leftStart?.[2]).toBeLessThan(80);
      expect(leftEnd?.[2]).toBeGreaterThan(180);
      expect(leftEnd?.[0]).toBeLessThan(80);
      expect(rightStart?.[0]).toBeGreaterThan(180);
      expect(rightEnd?.[2]).toBeGreaterThan(180);
    }),
    40000,
  );

  it(
    "draws a 1 px horizontal line where its SVG puts it",
    run("line", async (page) => {
      const box = await inFrame(page, "flat");
      expect(box.bottom - box.top).toBeCloseTo(1, 1);
      expect((box.top + box.bottom) / 2).toBeCloseTo(300, 1);
      const frame = await page.locator('[data-stage="frame"]').boundingBox();
      if (frame === null) throw new Error("No frame.");
      const [on, above, below] = await pixels(page, [
        [frame.x + 300, frame.y + 300],
        [frame.x + 300, frame.y + 290],
        [frame.x + 300, frame.y + 310],
      ]);
      expect(on?.[0]).toBeLessThan(80);
      expect(above?.[0]).toBeGreaterThan(200);
      expect(below?.[0]).toBeGreaterThan(200);
    }),
    40000,
  );

  it(
    "keeps the bottom edge of an off-centre pivoted part squashed with an anchor of bottom",
    run("squash", async (page) => {
      const box = await inFrame(page, "part");
      expect(box.bottom).toBeCloseTo(300, 0);
      expect(box.bottom - box.top).toBeCloseTo(50, 0);
    }),
    40000,
  );

  it(
    "turns a part with no anchor about its pivot",
    run("turn", async (page) => {
      const box = await inFrame(page, "part");
      expect(box.left).toBeCloseTo(120, 0);
      expect(box.right).toBeCloseTo(220, 0);
      expect(box.top).toBeCloseTo(200, 0);
      expect(box.bottom).toBeCloseTo(300, 0);
    }),
    40000,
  );
});
