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

const CAST = ["box", "text", "shape", "object", "list"];

async function cardsOf(root: string, piece: string): Promise<readonly unknown[]> {
  const answer: unknown = await (await fetch(`${root}__gerak/graph?piece=${piece}`)).json();
  const graph: unknown = Reflect.get(Object(answer), "graph");
  const cards: unknown = Reflect.get(Object(graph), "cards");
  return Array.isArray(cards) ? cards : [];
}

const field = (card: unknown, key: string): unknown => Reflect.get(Object(card), key);

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

/** Resolves after `count` animation frames of the page, so a layout that animates has moved on. */
function frames(page: Page, count: number): Promise<unknown> {
  return page.evaluate(
    (n) =>
      new Promise((done) => {
        let left = n;
        const tick = (): void => {
          left -= 1;
          if (left <= 0) done(0);
          else requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }),
    count,
  );
}

/** Waits until the element's box stops moving across a few frames, such as after a fit-view animation. */
async function steady(page: Page, selector: string): Promise<void> {
  let last = "";
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const box = await page.locator(selector).first().boundingBox();
    const now = JSON.stringify(box);
    if (box !== null && now === last) return;
    last = now;
    await frames(page, 3);
  }
  throw new Error(`${selector} never stopped moving.`);
}

describe("several previews", () => {
  it("adds a preview and wires it, follows the clicked one, and scrolls inside the hero range", async () => {
    const cards = await cardsOf(base, "cookie");
    const names = cards
      .filter(
        (card) =>
          field(card, "parent") === "scene:heroScene" && CAST.includes(String(field(card, "kind"))),
      )
      .map((card) => String(field(card, "name")));
    const sceneMs = Number(
      field(
        field(
          cards.find((card) => field(card, "id") === "scene:cookie"),
          "span",
        ),
        "to",
      ),
    );
    expect(names.length).toBeGreaterThan(0);
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
        await steady(page, '[data-handleid="stage:scene:heroScene"]');
        await wireTo(page, "stage:scene:heroScene", "preview:2");
        await sourceSaved("preview:2", "scene:heroScene");
        const before = await page.locator("[data-card-id]").count();
        await page.locator('[data-card-id="scene:heroScene"]').click();
        await page.keyboard.press("Delete");
        await frames(page, 5);
        expect(await page.locator("[data-card-id]").count(), "a wired card is not deleted").toBe(
          before,
        );
        await page.reload();
        await ready(page);
        await page.waitForSelector(
          '[data-preview-card="preview:2"][data-source="scene:heroScene"]',
        );
        expect(await page.locator(".react-flow__edge.wire-source").count()).toBe(2);

        const first = await frameOfPreview(page, "output:preview");
        const second = await frameOfPreview(page, "preview:2");
        await page.keyboard.press("f");
        await page.locator('[data-card-id="preview:2"] .card-head').click();
        await page.waitForSelector('[data-preview-card="preview:2"][data-active="true"]');
        await page.getByRole("button", { name: "Play", exact: true }).click();
        await page.getByRole("button", { name: "Pause" }).waitFor();
        const held = await elapsedIn(first);
        const start = await elapsedIn(second);
        await until(async () => (await elapsedIn(second)) !== start, "the active preview to play");
        expect(await elapsedIn(first), "the other preview stays paused").toBe(held);
        await page.locator('[data-card-id="output:preview"] .card-head').click();
        await page.waitForSelector('[data-preview-card="output:preview"][data-active="true"]');
        const stopped = await elapsedIn(second);
        await frames(page, 10);
        expect(await elapsedIn(second), "the preview left behind is paused").toBe(stopped);

        await page.locator('[data-card-id="preview:2"] .card-head').click();
        await page.waitForSelector('[data-preview-card="preview:2"][data-active="true"]');
        const play = page.getByRole("button", { name: "Play", exact: true });
        if ((await play.count()) > 0) await play.click();
        await page.getByRole("button", { name: "Pause" }).waitFor();
        const read = await second.evaluate(`(() => {
          const rects = ${JSON.stringify(names)}
            .flatMap((n) => [...document.querySelectorAll('[data-cast="' + n + '"]')])
            .map((e) => e.getBoundingClientRect());
          return [
            Math.min(...rects.map((r) => r.top + scrollY)),
            Math.max(...rects.map((r) => r.bottom + scrollY)),
            document.documentElement.scrollHeight - innerHeight,
            innerHeight,
          ];
        })()`);
        const [top = 0, last = 0, max = 1, view = 0] = Array.isArray(read) ? read.map(Number) : [];
        const low = Math.max(0, top - view);
        const high = Math.min(max, last);
        const length = Math.max(sceneMs, max);
        for (let sample = 0; sample < 6; sample += 1) {
          await frames(page, 8);
          const y = Number(await second.evaluate("scrollY"));
          const ms = await elapsedIn(second);
          expect(y).toBeGreaterThanOrEqual(low - 2);
          expect(y).toBeLessThanOrEqual(high + 2);
          expect(ms).toBeGreaterThanOrEqual((low / max) * length - 5);
          expect(ms).toBeLessThanOrEqual((high / max) * length + 5);
        }
        return true;
      },
    );
    expect(done.value).toBe(true);
  }, 240000);
});

describe("a preview of a shot", () => {
  it("loops inside the shot's ms", async () => {
    const reelLayout = join(gerak, "canvas", "reel.json");
    rmSync(reelLayout, { force: true });
    const started = await startStudio({ root: pieces, piece: "reel", port: 0 });
    const reel = `${new URL(started.url).origin}/`;
    try {
      const shot = (await cardsOf(reel, "reel")).find(
        (card) => field(card, "id") === "shot:reveal",
      );
      const from = Number(field(field(shot, "span"), "from"));
      const to = Number(field(field(shot, "span"), "to"));
      const done = await withPage(
        {
          page: "__gerak/studio?piece=reel",
          width: 2400,
          height: 1000,
          clock: "real",
          source: { kind: "url", base: reel },
        },
        async ({ page }) => {
          await ready(page);
          await page.getByRole("button", { name: "Add preview" }).click();
          await page.waitForSelector('[data-preview-card="preview:2"]');
          await page.keyboard.press("f");
          await steady(page, '[data-handleid="stage:shot:reveal"]');
          await wireTo(page, "stage:shot:reveal", "preview:2");
          await page.waitForSelector('[data-preview-card="preview:2"][data-source="shot:reveal"]');
          const frame = await frameOfPreview(page, "preview:2");
          await page.locator('[data-card-id="preview:2"] .card-head').click();
          await page.waitForSelector('[data-preview-card="preview:2"][data-active="true"]');
          await page.getByRole("button", { name: "Play", exact: true }).click();
          await page.getByRole("button", { name: "Pause" }).waitFor();
          const seen: number[] = [];
          for (let sample = 0; sample < 2000; sample += 1) {
            await frames(page, 4);
            seen.push(await elapsedIn(frame));
            if (seen.some((ms, at) => at > 0 && ms < (seen[at - 1] ?? 0))) break;
          }
          expect(
            seen.some((ms, at) => at > 0 && ms < (seen[at - 1] ?? 0)),
            "the preview wraps back to the shot's start",
          ).toBe(true);
          expect(Math.min(...seen)).toBeGreaterThanOrEqual(from - 20);
          expect(Math.max(...seen)).toBeLessThanOrEqual(to + 20);
          return true;
        },
      );
      expect(done.value).toBe(true);
    } finally {
      await started.close();
      rmSync(reelLayout, { force: true });
    }
  }, 240000);
});
