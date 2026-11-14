import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { DEFAULT_ROOT, withPage } from "@gerak/tools/page";

const NAME = "scratch-colour-tint";
const DIR = join(DEFAULT_ROOT, NAME);

const PAGE = `<!doctype html>
<html>
  <head><meta charset="UTF-8" /><title>scratch</title></head>
  <body>
    <div id="box" style="width: 40px; height: 40px; background: color-mix(in oklch, rgb(255 0 0), var(--gerak-tint-to, rgb(0 0 255)) calc(var(--gerak-tint, 0) * 100%))"></div>
    <script type="module" src="./${NAME}.ts"></script>
  </body>
</html>
`;

const MODULE = `import { applyValue } from "@gerak/dom";
Reflect.set(window, "paint", (tint: number) => {
  const box = document.getElementById("box");
  if (box === null) throw new Error("No box.");
  applyValue(box, { tint });
  return getComputedStyle(box).backgroundColor;
});
`;

function removeScratch(): void {
  rmSync(DIR, { recursive: true, force: true });
}

beforeAll(() => {
  removeScratch();
  mkdirSync(DIR, { recursive: true });
  writeFileSync(join(DIR, `${NAME}.html`), PAGE, "utf8");
  writeFileSync(join(DIR, `${NAME}.ts`), MODULE, "utf8");
});

afterAll(removeScratch);

function oklch(css: string): number[] {
  const found = /^oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)$/.exec(css);
  if (found === null) throw new Error(`Not an oklch colour: ${css}`);
  return found.slice(1).map(Number);
}

describe("the tint field on a skinned element", () => {
  it("mixes from red to blue through the OKLCH middle at tint 0, 0.5 and 1", async () => {
    const { value, pageErrors } = await withPage(
      {
        page: `${NAME}/${NAME}.html`,
        width: 200,
        height: 200,
        source: { kind: "serve", root: DEFAULT_ROOT },
      },
      async ({ page }) => {
        await page.waitForFunction(() => Reflect.has(window, "paint"));
        const colours: string[] = [];
        for (const tint of [0, 0.5, 1])
          colours.push(await page.evaluate((t) => String(Reflect.get(window, "paint")(t)), tint));
        return colours;
      },
    );
    expect(pageErrors).toEqual([]);
    const [red, middle, blue] = value.map(oklch);
    expect(red).toEqual([
      expect.closeTo(0.628, 2),
      expect.closeTo(0.258, 2),
      expect.closeTo(29.2, 0),
    ]);
    expect(blue).toEqual([
      expect.closeTo(0.452, 2),
      expect.closeTo(0.313, 2),
      expect.closeTo(264, 0),
    ]);
    // OKLCH mixes by the shorter hue arc, so red to blue passes through magenta near 327 degrees.
    expect(middle).toEqual([expect.closeTo(0.54, 1), expect.any(Number), expect.closeTo(327, -1)]);
  });
});
