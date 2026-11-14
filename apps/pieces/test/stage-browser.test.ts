import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { DEFAULT_ROOT, DEFAULT_SOURCE, withPage } from "@gerak/tools/page";
import { scaffold } from "@gerak/tools/scene";

const PREFIX = "stage-scratch-";
const STEP_TIMEOUT_MS = 5000;
let copies = 0;

/** A stage module of one actor that slides in from the left over the whole piece. */
function fixture(distance: number): string {
  return `import { slide, type Time } from "@gerak/moves";
import { actor, story } from "@gerak/stage";

export const beats = story(2000, { go: [0, 2000] });
export const cast = { box: actor() };
export const skins = { dom: { css: '[data-cast="box"] { width: 40px; height: 40px; background: #36c }' } };
export const scene = (time: Time) => ({
  box: slide({ distance: ${distance}, from: "left" }, beats.go.of(time)),
});
`;
}

function removeLeftovers(): void {
  for (const folder of readdirSync(DEFAULT_ROOT))
    if (folder.startsWith(PREFIX))
      rmSync(join(DEFAULT_ROOT, folder), { recursive: true, force: true });
}

function scratch(distance: number): { readonly name: string; readonly file: string } {
  copies += 1;
  const name = `${PREFIX}${copies}`;
  const file = join(DEFAULT_ROOT, name, "src", `${name}.ts`);
  mkdirSync(join(DEFAULT_ROOT, name, "src"), { recursive: true });
  writeFileSync(file, fixture(distance), "utf8");
  return { name, file };
}

beforeAll(removeLeftovers);
afterAll(removeLeftovers);

describe("stage pages in the browser", () => {
  it("shows a stage module on stage.html, and a plain message for a name it lacks", async () => {
    const piece = scratch(300);
    await withPage(
      { page: `stage.html?piece=${piece.name}`, width: 640, height: 360, source: DEFAULT_SOURCE },
      async ({ page }) => {
        page.setDefaultTimeout(STEP_TIMEOUT_MS);
        await page.locator('[data-cast="box"]').waitFor();
        expect(await page.locator("[data-cast]").count()).toBe(1);
      },
    );
    await withPage(
      { page: "stage.html?piece=no-such-piece", width: 640, height: 360, source: DEFAULT_SOURCE },
      async ({ page }) => {
        page.setDefaultTimeout(STEP_TIMEOUT_MS);
        await expect
          .poll(() => page.locator("#root").textContent())
          .toContain('No stage piece named "no-such-piece"');
      },
    );
  }, 30000);

  it("mounts the module motion:new writes, with its one actor at rest", async () => {
    const name = `${PREFIX}new`;
    const result = scaffold(name, DEFAULT_ROOT);
    if (result.kind !== "written") throw new Error(result.message);
    await withPage(
      { page: `stage.html?piece=${name}`, width: 640, height: 360, source: DEFAULT_SOURCE },
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
      { page: `live.html?scene=${piece.name}`, width: 1280, height: 720, source: DEFAULT_SOURCE },
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
