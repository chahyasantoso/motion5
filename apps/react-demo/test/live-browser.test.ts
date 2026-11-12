import { readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { DEFAULT_ROOT, DEFAULT_SOURCE, withPage } from "@gerak/tools/page";

const TIMING_SCENE = join(DEFAULT_ROOT, "src/timing-scene.ts");
const PILE_SCENE = join(DEFAULT_ROOT, "src/pile-scene.ts");
// Read once at load, so the last test can tell whether the suite changed them.
const TIMING_BEFORE = readFileSync(TIMING_SCENE, "utf8");
const PILE_BEFORE = readFileSync(PILE_SCENE, "utf8");
// A missing element fails its own step by name, well inside the test's time.
const STEP_TIMEOUT_MS = 5000;

interface Piece {
  readonly page: string;
  readonly component: string;
  readonly scene: string;
  /** The page's entry file, when the page runs without the live host. */
  readonly main?: string;
}

const TIMING: Piece = {
  page: "timing",
  component: "TimingBeat",
  scene: "timing-scene",
  main: "timing-main",
};
const PILE: Piece = { page: "pile", component: "Pile", scene: "pile-scene" };

interface Scratch {
  /** Opened as `live.html?scene=<name>`, or as the page `<name>.html`. */
  readonly name: string;
  readonly sceneFile: string;
  remove(): void;
}

const SCRATCH_PREFIX = "scratch-";
let copies = 0;

/** Removes whatever scratch copies a stopped run left behind. */
function removeLeftovers(): void {
  for (const dir of [DEFAULT_ROOT, join(DEFAULT_ROOT, "src")])
    for (const file of readdirSync(dir))
      if (file.startsWith(SCRATCH_PREFIX)) rmSync(join(dir, file), { force: true });
}

function readApp(file: string): string {
  return readFileSync(join(DEFAULT_ROOT, file), "utf8");
}

/** Copies a piece's page, component and scene to files named `scratch-*` that git ignores. */
function scratchOf(piece: Piece): Scratch {
  copies += 1;
  const name = `${SCRATCH_PREFIX}${piece.page}${copies}`;
  const pointed = (text: string, from: string, to: string): string => {
    const next = text.replaceAll(`"${from}"`, `"${to}"`);
    if (next === text) throw new Error(`No import of ${from} to point at ${to}.`);
    return next;
  };
  const files = new Map<string, string>([
    [`src/${name}-scene.ts`, readApp(`src/${piece.scene}.ts`)],
    [
      `src/${name}.tsx`,
      pointed(readApp(`src/${piece.component}.tsx`), `./${piece.scene}`, `./${name}-scene`),
    ],
  ]);
  const page = readApp(`${piece.page}.html`);
  if (piece.main === undefined) files.set(`${name}.html`, page);
  else {
    files.set(`${name}.html`, page.replace(`/src/${piece.main}.tsx`, `/src/${name}-main.tsx`));
    files.set(
      `src/${name}-main.tsx`,
      pointed(readApp(`src/${piece.main}.tsx`), `./${piece.component}`, `./${name}`),
    );
  }
  for (const [file, text] of files) writeFileSync(join(DEFAULT_ROOT, file), text, "utf8");
  return {
    name,
    sceneFile: join(DEFAULT_ROOT, `src/${name}-scene.ts`),
    remove() {
      for (const file of files.keys()) rmSync(join(DEFAULT_ROOT, file), { force: true });
    },
  };
}

beforeAll(removeLeftovers);
afterAll(removeLeftovers);

describe("live editor in the browser", () => {
  it("drags the scrubber to 1500 ms, hot-swaps a scene edit at 1500 ms, and shows a syntax error in the banner without losing the stage", async () => {
    const scratch = scratchOf(TIMING);
    const original = readFileSync(scratch.sceneFile, "utf8");
    try {
      await withPage(
        {
          page: `live.html?scene=${scratch.name}`,
          width: 1280,
          height: 720,
          source: DEFAULT_SOURCE,
        },
        async ({ page }) => {
          page.setDefaultTimeout(STEP_TIMEOUT_MS);
          const scrubber = await page.locator("[data-live-scrubber]").boundingBox();
          if (scrubber === null) throw new Error("Scrubber not found");

          await page.mouse.move(scrubber.x + 40, scrubber.y + scrubber.height / 2);
          await page.mouse.down();
          await page.mouse.move(
            scrubber.x + scrubber.width * 0.5,
            scrubber.y + scrubber.height / 2,
          );
          await page.mouse.up();

          const readMs = () => page.locator("[data-live-time]").getAttribute("data-ms");
          expect(await readMs()).toBe("1500");

          const readDotTransform = () =>
            page
              .locator(".beat-dot")
              .evaluate((el) => (el instanceof HTMLElement ? el.style.transform : ""));
          const beforeTransform = await readDotTransform();
          expect(beforeTransform).toContain("translate3d(");

          writeFileSync(scratch.sceneFile, original.replace("height: 260", "height: 520"), "utf8");

          await expect
            .poll(async () => await readDotTransform(), { timeout: 10000 })
            .not.toBe(beforeTransform);
          expect(await readMs()).toBe("1500");
          const swappedTransform = await readDotTransform();

          writeFileSync(scratch.sceneFile, `${original}\nexport const broken = ;`, "utf8");

          await expect
            .poll(async () => await page.locator("[data-live-error]").textContent(), {
              timeout: 10000,
            })
            .toBeTruthy();
          expect(await readDotTransform()).toBe(swappedTransform);
          expect(await readMs()).toBe("1500");
        },
      );
    } finally {
      scratch.remove();
    }
  }, 30000);

  it("keeps the banner when an older update finishes after a newer error", async () => {
    await withPage(
      { page: "live.html?scene=timing", width: 1280, height: 720, source: DEFAULT_SOURCE },
      async ({ page }) => {
        page.setDefaultTimeout(STEP_TIMEOUT_MS);
        await page.locator(".beat-dot").waitFor();
        const banners = () => page.locator("[data-live-error]").count();
        const finish = (stamp: number) =>
          page.evaluate(`(async () => {
            const module = await import("/src/TimingBeat.tsx");
            const detail = { ...module, __motionStamp: ${stamp} };
            window.dispatchEvent(new CustomEvent("motion:hot", { detail, cancelable: true }));
          })()`);
        await page.evaluate(() => {
          const detail = { err: { message: "a newer save does not compile" }, stamp: 200 };
          window.dispatchEvent(new CustomEvent("motion:error", { detail }));
        });
        expect(await banners()).toBe(1);
        await finish(100);
        expect(await banners()).toBe(1);
        await finish(300);
        expect(await banners()).toBe(0);
      },
    );
  }, 30000);

  it("rebuilds a physics scene on a hot swap and replays to the same time", async () => {
    const scratch = scratchOf(PILE);
    const original = readFileSync(scratch.sceneFile, "utf8");
    try {
      await withPage(
        {
          page: `live.html?scene=${scratch.name}`,
          width: 1280,
          height: 720,
          source: DEFAULT_SOURCE,
        },
        async ({ page }) => {
          page.setDefaultTimeout(STEP_TIMEOUT_MS);
          const scrubber = await page.locator("[data-live-scrubber]").boundingBox();
          if (scrubber === null) throw new Error("Scrubber not found");

          await page.mouse.move(
            scrubber.x + scrubber.width * 0.5,
            scrubber.y + scrubber.height / 2,
          );
          await page.mouse.down();
          await page.mouse.up();

          const readMs = () => page.locator("[data-live-time]").getAttribute("data-ms");
          expect(await readMs()).toBe("2100");

          const readFirstLetter = () =>
            page
              .locator(".pile-letter")
              .first()
              .evaluate((el) => (el instanceof HTMLElement ? el.style.transform : ""));
          const before = await readFirstLetter();
          expect(before).toContain("translate3d(");

          writeFileSync(scratch.sceneFile, original.replace("seeded(5)", "seeded(9)"), "utf8");

          await expect
            .poll(async () => await readFirstLetter(), { timeout: 10000 })
            .not.toBe(before);
          expect(await readMs()).toBe("2100");
        },
      );
    } finally {
      scratch.remove();
    }
  }, 30000);

  it("shows a saved scene edit on a page with no live host, by reloading it", async () => {
    const scratch = scratchOf(TIMING);
    const original = readFileSync(scratch.sceneFile, "utf8");
    try {
      await withPage(
        { page: `${scratch.name}.html`, width: 1280, height: 720, source: DEFAULT_SOURCE },
        async ({ page }) => {
          page.setDefaultTimeout(STEP_TIMEOUT_MS);
          await page.evaluate(() => Reflect.set(window, "motionMarker", "first load"));
          writeFileSync(
            scratch.sceneFile,
            original.replace("distance: 700", "distance: 640"),
            "utf8",
          );
          // The page's clock is paused, so the reload Vite schedules runs only as the clock is stepped.
          const stepped = async <T>(read: () => Promise<T>): Promise<T | "navigating"> => {
            try {
              await page.clock.runFor(100);
              return await read();
            } catch {
              return "navigating";
            }
          };
          await expect
            .poll(() => stepped(() => page.evaluate(() => Reflect.get(window, "motionMarker"))), {
              timeout: 10000,
            })
            .toBeUndefined();
          await page.locator(".beat-stage").click();
          const replayed = await page
            .locator(".beat-glyph")
            .first()
            .evaluate((el) => (el instanceof HTMLElement ? el.style.transform : ""));
          expect(replayed).toContain("-640px");
        },
      );
    } finally {
      scratch.remove();
    }
  }, 30000);

  it("drags 700 to 760 in the code panel and updates the scene file and stage", async () => {
    const scratch = scratchOf(TIMING);
    try {
      await withPage(
        {
          page: `live.html?scene=${scratch.name}`,
          width: 1280,
          height: 720,
          source: DEFAULT_SOURCE,
        },
        async ({ page }) => {
          page.setDefaultTimeout(STEP_TIMEOUT_MS);
          const readFirstGlyph = () =>
            page
              .locator(".beat-glyph")
              .first()
              .evaluate((el) => (el instanceof HTMLElement ? el.style.transform : ""));
          expect(await readFirstGlyph()).toContain("-700px");

          const numberSpan = page.locator('[data-live-number="700"]');
          await numberSpan.waitFor({ state: "visible", timeout: 10000 });
          const box = await numberSpan.boundingBox();
          if (box === null) throw new Error("Number 700 span not found");

          const startX = box.x + box.width / 2;
          const startY = box.y + box.height / 2;
          await page.mouse.move(startX, startY);
          await page.mouse.down();
          await page.mouse.move(startX + 60, startY, { steps: 3 });
          await page.mouse.up();

          await expect
            .poll(() => readFileSync(scratch.sceneFile, "utf8"), { timeout: 10000 })
            .toContain("distance: 760");
          await expect
            .poll(async () => await readFirstGlyph(), { timeout: 10000 })
            .toContain("-760px");
        },
      );
    } finally {
      scratch.remove();
    }
  }, 30000);

  it("leaves the tracked scenes as they were before the suite", () => {
    expect(readFileSync(TIMING_SCENE, "utf8")).toBe(TIMING_BEFORE);
    expect(readFileSync(PILE_SCENE, "utf8")).toBe(PILE_BEFORE);
  });
});
