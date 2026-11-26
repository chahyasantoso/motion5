import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { withPage } from "@gerak/tools/page";
import type { Frame, Page } from "playwright-core";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { startStudio } from "../src";
import { groupOf, type Card } from "../src/graph";

const pieces = fileURLToPath(new URL("../../../apps/pieces/", import.meta.url));
const gerak = join(pieces, ".gerak");
const hadGerak = existsSync(gerak);
const layoutFile = (piece: string): string => join(gerak, "canvas", `${piece}.json`);
const MOUNTS = "Symbol.for('@gerak/dom/mounts')";

let base = "";
let close: () => Promise<void> = async () => undefined;

beforeAll(async () => {
  const started = await startStudio({ root: pieces, piece: "reel", port: 0 });
  base = `${new URL(started.url).origin}/`;
  close = started.close;
});

afterAll(async () => {
  await close();
  if (!hadGerak) rmSync(gerak, { recursive: true, force: true });
  else rmSync(layoutFile("reel"), { force: true });
  for (const name of SCRATCH) rmSync(join(pieces, name), { recursive: true, force: true });
});

async function open<T>(
  piece: string,
  size: { readonly width: number; readonly height: number },
  visit: (page: Page) => Promise<T>,
): Promise<T> {
  const done = await withPage(
    {
      page: `__gerak/studio?piece=${piece}`,
      ...size,
      clock: "real",
      source: { kind: "url", base },
    },
    ({ page }) => visit(page),
  );
  return done.value;
}

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

/** The preview's frame once its page has mounted; a first load may reload once while Vite bundles a new dependency. */
async function frameOf(page: Page, attempts = 3): Promise<Frame> {
  const handle = await page.waitForSelector("iframe[data-preview]");
  const frame = await handle.contentFrame();
  if (frame === null) throw new Error("The preview has no frame.");
  try {
    await frame.waitForFunction(
      `(() => { const m = window[${MOUNTS}]; return Array.isArray(m) && m.length > 0; })()`,
      undefined,
      { timeout: 60000 },
    );
  } catch (error) {
    const detached = error instanceof Error && error.message.includes("detached");
    if (!detached || attempts <= 1) throw error;
    await page.waitForLoadState("load");
    return frameOf(page, attempts - 1);
  }
  return frame;
}

function elapsedIn(frame: Frame): Promise<number> {
  return frame.evaluate(`window[${MOUNTS}][0].driver.now().clock.elapsed`).then(Number);
}

async function layoutOf(piece: string): Promise<unknown> {
  return (await fetch(`${base}__gerak/layout?piece=${piece}`)).json();
}

function transformOf(page: Page, id: string): Promise<string> {
  return page.locator(`.react-flow__node[data-id="${id}"]`).evaluate((node) => {
    return node instanceof HTMLElement ? node.style.transform : "";
  });
}

async function dragHeader(page: Page, id: string, by: { x: number; y: number }): Promise<void> {
  const box = await page.locator(`[data-card-id="${id}"] .card-head`).boundingBox();
  if (box === null) throw new Error(`${id} has no header.`);
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + by.x, y + by.y, { steps: 8 });
  await page.mouse.up();
}

const SCRATCH = ["scratch-canvas-keeps"] as const;

function scratchPiece(name: (typeof SCRATCH)[number]): {
  readonly scene: string;
  readonly page: string;
  readonly good: string;
} {
  const dir = join(pieces, name);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(join(dir, "src"), { recursive: true });
  const source = join(pieces, "saved");
  const rename = (text: string): string => text.replaceAll("saved", name);
  const page = join(dir, `${name}.html`);
  writeFileSync(page, rename(readFileSync(join(source, "saved.html"), "utf8")));
  writeFileSync(
    join(dir, "src", `${name}-main.ts`),
    rename(readFileSync(join(source, "src", "saved-main.ts"), "utf8")),
  );
  const scene = join(dir, "src", `${name}.ts`);
  cpSync(join(source, "src", "saved.ts"), scene);
  return { scene, page, good: readFileSync(scene, "utf8") };
}

describe("the canvas", () => {
  it("renders the cards of the graph, lists shots as rows, and solos one on click", async () => {
    const answer: unknown = await (await fetch(`${base}__gerak/graph?piece=reel`)).json();
    const cards: unknown = Reflect.get(Object(Reflect.get(Object(answer), "graph")), "cards");
    const expected = (Array.isArray(cards) ? cards : [])
      .map((card: unknown) => String(Reflect.get(Object(card), "id")))
      .sort();
    expect(expected.length).toBeGreaterThan(50);
    await open("reel", { width: 1440, height: 900 }, async (page) => {
      await ready(page);
      await expect
        .poll(
          () =>
            page.$$eval("[data-card-id]", (nodes) =>
              nodes.map((node) => node.getAttribute("data-card-id") ?? "").sort(),
            ),
          { message: "the canvas draws exactly the graph's cards", timeout: 20000 },
        )
        .toEqual(expected);
      expect(await page.locator('.card[data-kind="shot"]').count()).toBe(0);
      const row = page.locator('.scene-row[data-card-id="shot:hook"]');
      await row.click();
      await page.locator('.scene-row[data-card-id="shot:hook"].is-active').waitFor();
      await page.locator("[data-timeline] .is-soloed").first().waitFor();
      await row.click();
      await page.waitForSelector(".scene-row.is-active", { state: "detached" });
    });
  }, 60000);

  it("keeps a dragged card after a reload and prunes a stale id from the layout", async () => {
    mkdirSync(join(gerak, "canvas"), { recursive: true });
    writeFileSync(
      layoutFile("reel"),
      JSON.stringify({ cards: { "shot:gone": { x: 5, y: 5 }, "shot:cta": { x: 0, y: 0 } } }),
    );
    await open("reel", { width: 1440, height: 900 }, async (page) => {
      await ready(page);
      const before = await transformOf(page, "output:check");
      await dragHeader(page, "output:check", { x: 60, y: 40 });
      const moved = await transformOf(page, "output:check");
      expect(moved).not.toBe(before);
      await until(
        async () => JSON.stringify(await layoutOf("reel")).includes("output:check"),
        "the layout to be saved",
      );
      await page.reload();
      await ready(page);
      expect(await transformOf(page, "output:check")).toBe(moved);
    });
    const saved = readFileSync(layoutFile("reel"), "utf8");
    expect(saved).not.toContain("shot:gone");
    expect(saved).toContain("output:check");
  }, 60000);

  it("floats a wire to the facing sides when a card is dragged past its neighbour", async () => {
    rmSync(layoutFile("saved"), { force: true });
    const answer: unknown = await (await fetch(`${base}__gerak/graph?piece=saved`)).json();
    const graph = Object(Reflect.get(Object(answer), "graph"));
    const cards: readonly Card[] = Reflect.get(graph, "cards");
    const wires: readonly { from: string; to: string; id: string }[] = Reflect.get(graph, "wires");
    const group = (id: string) => {
      const card = cards.find((c) => c.id === id);
      return card === undefined ? undefined : groupOf(card.kind);
    };
    const wire = wires.find(
      (w) =>
        (group(w.from) === "cast" && group(w.to) === "move") ||
        (group(w.from) === "move" && group(w.to) === "cast"),
    );
    if (wire === undefined) throw new Error("saved has no cast and move wire.");
    const move = group(wire.from) === "move" ? wire.from : wire.to;
    const cast = move === wire.from ? wire.to : wire.from;
    await open("saved", { width: 1440, height: 900 }, async (page) => {
      await ready(page);
      const edge = page.locator(
        `.react-flow__edge[data-id="${wire.id}"] path.react-flow__edge-path`,
      );
      await edge.waitFor({ state: "attached" });
      const rect = async (id: string) => {
        const box = await page.locator(`[data-card-id="${id}"]`).boundingBox();
        if (box === null) throw new Error(`${id} has no box.`);
        return box;
      };
      const before = await rect(move);
      const castBox = await rect(cast);
      await dragHeader(page, cast, { x: before.x - castBox.x - 700, y: 0 });
      await expect
        .poll(
          async () => {
            const left = await rect(cast);
            return left.x + left.width < (await rect(move)).x;
          },
          { message: "the cast card sits left of the move card" },
        )
        .toBe(true);
      const moved = await rect(move);
      const pts = ((await edge.getAttribute("d")) ?? "").match(/-?[\d.]+/g)?.map(Number) ?? [];
      const startX = pts[0] ?? Number.NaN;
      const endX = pts[pts.length - 2] ?? Number.NaN;
      const wireX = move === wire.from ? startX : endX;
      const flow = await page.locator(".react-flow__viewport").boundingBox();
      if (flow === null) throw new Error("no viewport");
      const zoom = await page
        .locator(".react-flow__viewport")
        .evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).a);
      expect(wireX).toBeLessThanOrEqual((moved.x - flow.x) / zoom + 2);
    });
  }, 60000);

  it("runs cookie's rows and 3D canvas at desktop and mobile sizes", async () => {
    await open("cookie", { width: 1440, height: 900 }, async (page) => {
      await ready(page);
      const rows = page.locator('[data-card-id="scene:cookie"] .scene-row');
      await page.locator('[data-handleid="stage:scene:heroScene"]').waitFor({ state: "attached" });
      await expect.poll(() => rows.count(), { message: "cookie's five rows" }).toBe(5);
      const named = await rows.locator(".card-name").allTextContents();
      expect(named[0]).toBe("heroScene");
      expect(named[4]).toBe("closingScene");
      for (const row of await rows.all()) {
        const id = await row.getAttribute("data-card-id");
        expect(await row.locator(`.react-flow__handle[data-handleid="stage:${id}"]`).count()).toBe(
          1,
        );
        expect(await page.locator(`.card[data-card-id="${id}"]`).count()).toBe(0);
      }
      await rows.first().click();
      await page.locator(".scene-row.is-selected").waitFor();
      expect(await page.locator(".scene-row.is-selected").getAttribute("data-card-id")).toBe(
        "scene:heroScene",
      );
      const frame = await frameOf(page);
      const read = (): Promise<{ w: number; h: number; canvas: number }> =>
        frame.evaluate(() => ({
          w: window.innerWidth,
          h: window.innerHeight,
          canvas: document.querySelector('[data-cast="stageCanvas"]')?.clientWidth ?? 0,
        }));
      await page.selectOption('select[aria-label="Size preset"]', "desktop");
      await frame.waitForFunction("window.innerWidth === 1440");
      expect(await read()).toMatchObject({ w: 1440, h: 900 });
      expect((await read()).canvas).toBeGreaterThan(0);
      await page.selectOption('select[aria-label="Size preset"]', "mobile");
      await frame.waitForFunction("window.innerWidth === 390");
      expect(await read()).toMatchObject({ w: 390, h: 844 });
      expect((await read()).canvas).toBeGreaterThan(0);
    });
  }, 120000);

  it("scrubs the reel paused, seeks from the timeline, and sizes it with the tiktok overlay", async () => {
    await open("reel", { width: 1440, height: 900 }, async (page) => {
      await ready(page);
      const frame = await frameOf(page);
      const ruler = page.locator("[data-ruler]");
      const box = await ruler.boundingBox();
      const length = Number(await ruler.getAttribute("aria-valuemax"));
      if (box === null) throw new Error("The ruler has no box.");
      expect(length).toBeGreaterThan(3000);
      await page.evaluate(
        ({ x, y }) => {
          const pause = document.querySelector('button[aria-label="Pause"]');
          const bar = document.querySelector("[data-ruler]");
          if (!(pause instanceof HTMLElement) || bar === null) throw new Error("No controls.");
          pause.click();
          const at = { clientX: x, clientY: y, bubbles: true, pointerId: 1, isPrimary: true };
          bar.dispatchEvent(new PointerEvent("pointerdown", at));
          bar.dispatchEvent(new PointerEvent("pointerup", at));
        },
        { x: box.x + box.width * 0.25, y: box.y + box.height / 2 },
      );
      const first = await elapsedIn(frame);
      await frame.evaluate(
        "new Promise((done) => { let n = 0; const tick = () => (++n >= 12 ? done(0) : requestAnimationFrame(tick)); tick(); })",
      );
      expect(await elapsedIn(frame), "a pause and a scrub in one frame stay paused").toBe(first);
      await page.mouse.click(box.x + (3000 / length) * box.width, box.y + box.height / 2);
      await until(
        async () => Math.abs((await elapsedIn(frame)) - 3000) < 1,
        "the mount at 3000 ms",
      );
      expect(await page.locator("[data-timeline] [data-ms]").getAttribute("data-ms")).toBe("3000");
      await page.selectOption('select[aria-label="Size preset"]', "1080x1920");
      await page.check('input[aria-label="Safe zones"]');
      await page.selectOption('select[aria-label="Safe zone profile"]', "tiktok");
      await frame.waitForFunction("window.innerWidth === 1080 && window.innerHeight === 1920");
      await page.locator('[data-safe-zone="tiktok"]').waitFor();
      const whole = await page.locator(".preview-frame").boundingBox();
      const top = await page.locator(".safe-top").boundingBox();
      if (whole === null || top === null) throw new Error("The overlay has no box.");
      expect(top.height / whole.height).toBeCloseTo(220 / 1920, 2);
      await until(
        async () =>
          JSON.stringify(await layoutOf("reel")).includes(
            '"preset":"1080x1920","safeZone":"tiktok"',
          ),
        "the preview choice to be saved",
      );
    });
  }, 120000);

  it("shows a banner when an edit throws, and keeps time across a hot swap and a reload", async () => {
    const piece = scratchPiece("scratch-canvas-keeps");
    await open("scratch-canvas-keeps", { width: 1440, height: 900 }, async (page) => {
      await ready(page);
      const frame = await frameOf(page);
      await frame.evaluate("window.__marker = 1");
      expect(await page.locator("[data-banner]").count()).toBe(0);
      writeFileSync(
        piece.scene,
        `${piece.good}
throw new Error("boom in the scene");
`,
      );
      await page.locator("[data-banner]").waitFor({ timeout: 20000 });
      const banner = await page.locator("[data-banner]").innerText();
      expect(banner).toContain("boom in the scene");
      expect(banner).toContain("scratch-canvas-keeps.ts");
      expect(await frame.evaluate("window.__marker")).toBe(1);
      expect(await frame.evaluate(`window[${MOUNTS}].length`)).toBe(1);
      writeFileSync(piece.scene, piece.good);
      await page.locator("[data-banner]").waitFor({ state: "detached", timeout: 20000 });

      await page.getByRole("button", { name: "Pause" }).click();
      const ruler = page.locator("[data-ruler]");
      const box = await ruler.boundingBox();
      const length = Number(await ruler.getAttribute("aria-valuemax"));
      if (box === null) throw new Error("The ruler has no box.");
      await page.mouse.click(box.x + (800 / length) * box.width, box.y + box.height / 2);
      await until(async () => Math.abs((await elapsedIn(frame)) - 800) < 1, "the mount at 800 ms");
      await frame.evaluate(
        "window.__swaps = 0; window.addEventListener('motion:hot', () => { window.__swaps += 1; })",
      );
      writeFileSync(piece.scene, piece.good.replace("overshoot: 0.15", "overshoot: 0.3"));
      await until(
        async () => Number(await frame.evaluate("window.__swaps")) > 0,
        "the scene to hot swap",
      );
      expect(await frame.evaluate("window.__marker")).toBe(1);
      expect(Math.abs((await elapsedIn(frame)) - 800)).toBeLessThan(1);
      writeFileSync(
        piece.page,
        `${readFileSync(piece.page, "utf8")}
<!-- changed -->
`,
      );
      await until(
        async () => (await frame.evaluate("window.__marker")) !== 1,
        "the page to reload",
      );
      const reloaded = await frameOf(page);
      await until(
        async () => Math.abs((await elapsedIn(reloaded)) - 800) < 1,
        "the reloaded page at 800 ms",
      );
    });
  }, 120000);
});
