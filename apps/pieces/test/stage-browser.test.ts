import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { callerPiecesRoot, withPage } from "@gerak/tools/page";
import { scaffold } from "@gerak/tools/scene";

const PIECES_ROOT = callerPiecesRoot();
const PIECES_SOURCE = { kind: "serve", root: PIECES_ROOT } as const;

const PREFIX = "stage-scratch-";
const STEP_TIMEOUT_MS = 5000;
let copies = 0;

/** A scene of one actor that slides in from the left over the whole piece. */
function fixture(distance: number): string {
  return `import { slide } from "@gerak/moves";
import { beat, box, scene } from "@gerak/stage";

const go = beat("go", 2000);

export default scene(box("box").moves(slide({ distance: ${distance}, from: "left" }).in(go)));
`;
}

const PAGE = (name: string): string => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${name}</title>
    <style>
      body { margin: 0; }
      #frame { width: 640px; height: 360px; }
      [data-cast="box"] { width: 40px; height: 40px; background: #36c; }
    </style>
  </head>
  <body>
    <div id="frame"><div data-cast="box"></div></div>
    <script type="module" src="/${name}/src/${name}-main.ts"></script>
  </body>
</html>
`;

const MAIN = (name: string): string => `import { mount } from "@gerak/dom";
import scene from "./${name}";

const root = document.getElementById("frame");
if (root === null) throw new Error("#frame not found");
mount(scene, { clock: "timed", frame: "fit", root });
`;

function removeLeftovers(): void {
  for (const folder of readdirSync(PIECES_ROOT))
    if (folder.startsWith(PREFIX))
      rmSync(join(PIECES_ROOT, folder), { recursive: true, force: true });
}

function scratch(distance: number): { readonly name: string; readonly file: string } {
  copies += 1;
  const name = `${PREFIX}${copies}`;
  const file = join(PIECES_ROOT, name, "src", `${name}.ts`);
  mkdirSync(join(PIECES_ROOT, name, "src"), { recursive: true });
  writeFileSync(file, fixture(distance), "utf8");
  writeFileSync(join(PIECES_ROOT, name, `${name}.html`), PAGE(name), "utf8");
  writeFileSync(join(PIECES_ROOT, name, "src", `${name}-main.ts`), MAIN(name), "utf8");
  return { name, file };
}

beforeAll(removeLeftovers);
afterAll(removeLeftovers);

describe("pieces in the browser", () => {
  it("mounts the piece gerak new writes over its own page, with its one actor at rest", async () => {
    const name = `${PREFIX}new`;
    const result = scaffold(name, PIECES_ROOT);
    if (result.kind !== "written") throw new Error(result.message);
    await withPage(
      { page: `${name}/${name}.html`, width: 640, height: 360, source: PIECES_SOURCE },
      async ({ page }) => {
        page.setDefaultTimeout(STEP_TIMEOUT_MS);
        const title = page.locator('[data-cast="title"]');
        await title.waitFor();
        expect(
          await title.evaluate((el) => (el instanceof HTMLElement ? el.style.transform : "")),
        ).toBe("");
      },
    );
  }, 30000);

  it("swaps a stage module's scene in place on a save, keeping its elements and its time", async () => {
    const piece = scratch(300);
    await withPage(
      { page: `live.html?scene=${piece.name}`, width: 1280, height: 720, source: PIECES_SOURCE },
      async ({ page }) => {
        page.setDefaultTimeout(STEP_TIMEOUT_MS);
        const scrubber = await page.locator("[data-live-scrubber]").boundingBox();
        if (scrubber === null) throw new Error("Scrubber not found");
        await page.mouse.move(scrubber.x + scrubber.width * 0.5, scrubber.y + scrubber.height / 2);
        await page.mouse.down();
        await page.mouse.up();
        const readMs = () => page.locator("[data-live-time]").getAttribute("data-ms");
        expect(await readMs()).toBe("1000");

        const box = page.locator('[data-cast="box"]');
        await box.evaluate((el) => Reflect.set(el, "marker", "same element"));
        const read = () =>
          box.evaluate((el) => (el instanceof HTMLElement ? el.style.transform : ""));
        const before = await read();
        expect(before).toContain("translate3d(");

        writeFileSync(piece.file, fixture(900), "utf8");

        await expect.poll(read, { timeout: 10000 }).not.toBe(before);
        expect(await readMs()).toBe("1000");
        expect(await box.evaluate((el) => Reflect.get(el, "marker"))).toBe("same element");
      },
    );
  }, 30000);
});
