import { callerPiecesRoot, withPage, type PageSession } from "@gerak/tools/page";
import { describe, expect, it } from "vitest";

const PIECES_SOURCE = { kind: "serve", root: callerPiecesRoot() } as const;

async function rectOf(page: PageSession["page"], selector: string) {
  return page.locator(selector).evaluate((el) => {
    const r = el.getBoundingClientRect();
    return {
      cx: r.left + r.width / 2,
      cy: r.top + r.height / 2,
      width: r.width,
      height: r.height,
      opacity: Number(getComputedStyle(el).opacity),
    };
  });
}

async function scrollPageTo(
  page: PageSession["page"],
  y: number,
  advanceTo: (ms: number) => Promise<void>,
  ms: number,
) {
  await page.evaluate((targetY) => {
    window.scrollTo(0, targetY);
    window.dispatchEvent(new Event("scroll"));
  }, y);
  await advanceTo(ms);
}

describe("yuzu landing page with travel and slots in Chromium", () => {
  it.each([
    { name: "desktop", width: 1280, height: 720 },
    { name: "mobile", width: 390, height: 844 },
  ])(
    "lands the drink on every slot and animates lines, features, sticky story, and gallery ($name)",
    async ({ width, height }) => {
      const { pageErrors } = await withPage(
        { page: "yuzu/yuzu.html", width, height, source: PIECES_SOURCE },
        async ({ page, advanceTo }) => {
          await advanceTo(800);

          // Headline splits words and wraps across multiple measured visual lines.
          const headline = await page
            .locator("#hero-headline [data-gerak-part]")
            .evaluateAll((els) => ({
              count: els.length,
              rows: new Set(els.map((el) => Math.round(el.getBoundingClientRect().top))).size,
            }));
          expect(headline.count).toBe(7);
          expect(headline.rows).toBeGreaterThanOrEqual(2);

          // 1. Hero slot alignment after intro settles.
          const drinkHero = await rectOf(page, "#drink");
          const slotHero = await rectOf(page, "#hero .slot");
          expect(drinkHero.opacity).toBeCloseTo(1, 2);
          expect(Math.abs(drinkHero.cx - slotHero.cx)).toBeLessThanOrEqual(2);
          expect(Math.abs(drinkHero.cy - slotHero.cy)).toBeLessThanOrEqual(2);
          expect(Math.abs(drinkHero.width - slotHero.width)).toBeLessThanOrEqual(2);
          expect(Math.abs(drinkHero.height - slotHero.height)).toBeLessThanOrEqual(2);

          // 2. Features slot + triggered feature cards reveal.
          const positions = await page.evaluate(() => {
            const topOf = (selector: string) => {
              const el = document.querySelector(selector);
              if (el === null) throw new Error(`Missing ${selector}`);
              return el.getBoundingClientRect().top + window.scrollY;
            };
            return {
              featuresTop: topOf("#features"),
              storyTop: topOf("#story"),
              galleryTop: topOf("#gallery"),
            };
          });
          await scrollPageTo(page, positions.featuresTop, advanceTo, 1600);
          const drinkFeat = await rectOf(page, "#drink");
          const slotFeat = await rectOf(page, "#features .slot");
          expect(Math.abs(drinkFeat.cx - slotFeat.cx)).toBeLessThanOrEqual(2);
          expect(Math.abs(drinkFeat.cy - slotFeat.cy)).toBeLessThanOrEqual(2);
          expect(Math.abs(drinkFeat.width - slotFeat.width)).toBeLessThanOrEqual(2);
          expect(Math.abs(drinkFeat.height - slotFeat.height)).toBeLessThanOrEqual(2);
          const featOpacities = await page
            .locator("#features .feature-card")
            .evaluateAll((els) => els.map((el) => Number(getComputedStyle(el).opacity)));
          for (const op of featOpacities) expect(op).toBeGreaterThan(0.95);

          // 3. Pinned story section at two pinned offsets: drink holds its slot while step 2 reveals.
          await scrollPageTo(page, positions.storyTop + 360, advanceTo, 1800);
          const drinkStoryA = await rectOf(page, "#drink");
          const slotStoryA = await rectOf(page, "#story .slot");
          expect(Math.abs(drinkStoryA.cx - slotStoryA.cx)).toBeLessThanOrEqual(2);
          expect(Math.abs(drinkStoryA.cy - slotStoryA.cy)).toBeLessThanOrEqual(2);
          expect(Math.abs(drinkStoryA.width - slotStoryA.width)).toBeLessThanOrEqual(2);
          expect((await rectOf(page, "#story-step-1")).opacity).toBeLessThan(0.05);
          expect((await rectOf(page, "#story-step-2")).opacity).toBeGreaterThan(0.95);

          await scrollPageTo(page, positions.storyTop + 560, advanceTo, 2000);
          const drinkStoryB = await rectOf(page, "#drink");
          const slotStoryB = await rectOf(page, "#story .slot");
          expect(Math.abs(drinkStoryB.cy - drinkStoryA.cy)).toBeLessThanOrEqual(2);
          expect(Math.abs(drinkStoryB.cy - slotStoryB.cy)).toBeLessThanOrEqual(2);

          // 4. Gallery reveal + drink unpins upward with the story slot.
          await scrollPageTo(page, positions.galleryTop, advanceTo, 2800);
          const galleryOpacities = await page
            .locator("#gallery .gallery-card")
            .evaluateAll((els) => els.map((el) => Number(getComputedStyle(el).opacity)));
          for (const op of galleryOpacities) expect(op).toBeGreaterThan(0.95);
          const drinkAtGallery = await rectOf(page, "#drink");
          expect(drinkAtGallery.cy).toBeLessThan(0);
        },
      );
      expect(pageErrors).toEqual([]);
    },
    30_000,
  );
});
