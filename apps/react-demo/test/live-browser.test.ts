import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { DEFAULT_ROOT, DEFAULT_SOURCE, withPage } from "@motion5/tools/page";

const TIMING_SCENE = join(DEFAULT_ROOT, "src/timing-scene.ts");
const PILE_SCENE = join(DEFAULT_ROOT, "src/pile-scene.ts");

describe("live editor in the browser", () => {
  it("drags the scrubber to 1500 ms, hot-swaps a scene edit at 1500 ms, and shows a syntax error in the banner without losing the stage", async () => {
    const original = readFileSync(TIMING_SCENE, "utf8");
    try {
      await withPage(
        {
          page: "live.html?scene=timing",
          width: 1280,
          height: 720,
          source: DEFAULT_SOURCE,
        },
        async ({ page }) => {
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

          writeFileSync(TIMING_SCENE, original.replace("height: 260", "height: 520"), "utf8");

          await expect
            .poll(async () => await readDotTransform(), { timeout: 10000 })
            .not.toBe(beforeTransform);
          expect(await readMs()).toBe("1500");
          const swappedTransform = await readDotTransform();

          writeFileSync(TIMING_SCENE, `${original}\nexport const broken = ;`, "utf8");

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
      writeFileSync(TIMING_SCENE, original, "utf8");
    }
  }, 30000);

  it("rebuilds a physics scene on a hot swap and replays to the same time", async () => {
    const original = readFileSync(PILE_SCENE, "utf8");
    try {
      await withPage(
        {
          page: "live.html?scene=pile",
          width: 1280,
          height: 720,
          source: DEFAULT_SOURCE,
        },
        async ({ page }) => {
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

          writeFileSync(PILE_SCENE, original.replace("seeded(5)", "seeded(9)"), "utf8");

          await expect
            .poll(async () => await readFirstLetter(), { timeout: 10000 })
            .not.toBe(before);
          expect(await readMs()).toBe("2100");
        },
      );
    } finally {
      writeFileSync(PILE_SCENE, original, "utf8");
    }
  }, 30000);

  it("drags 700 to 760 in the code panel and updates the scene file and stage", async () => {
    const original = readFileSync(TIMING_SCENE, "utf8");
    try {
      await withPage(
        {
          page: "live.html?scene=timing",
          width: 1280,
          height: 720,
          source: DEFAULT_SOURCE,
        },
        async ({ page }) => {
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
            .poll(() => readFileSync(TIMING_SCENE, "utf8"), { timeout: 10000 })
            .toContain("distance: 760");
          await expect
            .poll(async () => await readFirstGlyph(), { timeout: 10000 })
            .toContain("-760px");
        },
      );
    } finally {
      writeFileSync(TIMING_SCENE, original, "utf8");
    }
  }, 30000);
});
