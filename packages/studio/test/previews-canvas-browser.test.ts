import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { withPage } from "@gerak/tools/page";
import type { Frame, Page } from "playwright-core";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { startStudio } from "../src";

const pieces = fileURLToPath(new URL("../../../apps/pieces/", import.meta.url));
const gerak = join(pieces, ".gerak");
const hadGerak = existsSync(gerak);
const layoutFile = join(gerak, "canvas", "cookie.json");
const MOUNTS = "Symbol.for('@gerak/dom/mounts')";

let base = "";
let close: () => Promise<void> = async () => undefined;

beforeAll(async () => {
  rmSync(layoutFile, { force: true });
  const started = await startStudio({ root: pieces, piece: "cookie", port: 0 });
  base = `${new URL(started.url).origin}/`;
  close = started.close;
});

afterAll(async () => {
  await close();
  if (!hadGerak) rmSync(gerak, { recursive: true, force: true });
  else rmSync(layoutFile, { force: true });
});

async function until(read: () => Promise<boolean>, what: string): Promise<void> {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (await read()) return;
    await new Promise((done) => setTimeout(done, 100));
  }
  throw new Error(`Timed out waiting for ${what}.`);
}

async function ready(page: Page): Promise<void> {
  await page.waitForSelector('.canvas-area[data-framed="true"] [data-card-id]');
}

async function previewsOf(): Promise<readonly { id: string; source: string }[]> {
  const layout: unknown = await (await fetch(`${base}__gerak/layout?piece=cookie`)).json();
  const listed: unknown = Reflect.get(Object(layout), "previews");
  return (Array.isArray(listed) ? listed : []).map((entry: unknown) => ({
    id: String(Reflect.get(Object(entry), "id")),
    source: String(Reflect.get(Object(entry), "source")),
  }));
}

async function sourceSaved(id: string, source: string): Promise<void> {
  await until(
    async () => (await previewsOf()).some((entry) => entry.id === id && entry.source === source),
    `${id} to be saved with source ${source}`,
  );
}

async function frameOfPreview(page: Page, id: string): Promise<Frame> {
  const handle = await page.waitForSelector(`iframe[data-preview-id="${id}"]`);
  const frame = await handle.contentFrame();
  if (frame === null) throw new Error(`${id} has no frame.`);
  await frame.waitForFunction(
    `(() => { const m = window[${MOUNTS}]; return Array.isArray(m) && m.length > 0; })()`,
    undefined,
    { timeout: 90000 },
  );
  return frame;
}

function elapsedIn(frame: Frame): Promise<number> {
  return frame.evaluate(`window[${MOUNTS}][0].driver.now().clock.elapsed`).then(Number);
}

async function centreOf(page: Page, selector: string): Promise<{ x: number; y: number }> {
  const box = await page.locator(selector).first().boundingBox();
  if (box === null) throw new Error(`${selector} has no box.`);
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

async function wireTo(page: Page, handle: string, target: string): Promise<void> {
  const from = await centreOf(page, `[data-handleid="${handle}"]`);
  const to = await centreOf(
    page,
    `.react-flow__node[data-id="${target}"] .react-flow__handle.target`,
  );
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move(to.x, to.y, { steps: 12 });
  await page.mouse.up();
}

describe("several previews", () => {
  it("adds a preview, wires it, keeps it, and refuses deletion", async () => {
    const done = await withPage(
      {
        page: "__gerak/studio?piece=cookie",
        width: 2400,
        height: 1000,
        clock: "real",
        source: { kind: "url", base },
      },
      async ({ page }) => {
        await ready(page);
        await page.getByRole("button", { name: "Add preview" }).click();
        await page.waitForSelector('[data-preview-card="preview:2"]');
        await page.keyboard.press("f");
        await until(
          async () => (await previewsOf()).some((entry) => entry.id === "preview:2"),
          "the new preview to be saved",
        );
        await page.waitForTimeout(300);
        await wireTo(page, "stage:scene:heroScene", "preview:2");
        await sourceSaved("preview:2", "scene:heroScene");
        const before = await page.locator("[data-card-id]").count();
        await page.locator('[data-card-id="scene:heroScene"]').click();
        await page.keyboard.press("Delete");
        await page.waitForTimeout(300);
        expect(await page.locator("[data-card-id]").count()).toBe(before);
        await page.reload();
        await ready(page);
        await page.waitForSelector(
          '[data-preview-card="preview:2"][data-source="scene:heroScene"]',
        );
        expect(await page.locator(".react-flow__edge.wire-source").count()).toBe(2);
        return true;
      },
    );
    expect(done.value).toBe(true);
  }, 180000);

  it("follows the preview last clicked and pauses the other", async () => {
    const done = await withPage(
      {
        page: "__gerak/studio?piece=cookie",
        width: 2400,
        height: 1000,
        clock: "real",
        source: { kind: "url", base },
      },
      async ({ page }) => {
        await ready(page);
        const first = await frameOfPreview(page, "output:preview");
        const second = await frameOfPreview(page, "preview:2");
        await page.keyboard.press("f");
        await page.locator('[data-card-id="preview:2"] .card-head').click();
        await page.waitForSelector('[data-preview-card="preview:2"][data-active="true"]');
        await page.getByRole("button", { name: "Play", exact: true }).click();
        await page.getByRole("button", { name: "Pause" }).waitFor();
        const held = await elapsedIn(first);
        const start = await elapsedIn(second);
        await page.waitForTimeout(600);
        expect(await elapsedIn(first)).toBe(held);
        expect(await elapsedIn(second)).toBeGreaterThan(start);
        await page.locator('[data-card-id="output:preview"] .card-head').click();
        await page.waitForSelector('[data-preview-card="output:preview"][data-active="true"]');
        const stopped = await elapsedIn(second);
        await page.waitForTimeout(400);
        expect(await elapsedIn(second)).toBe(stopped);
        return true;
      },
    );
    expect(done.value).toBe(true);
  }, 180000);
});
