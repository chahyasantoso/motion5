import { fileURLToPath } from "node:url";
import type { Page } from "playwright-core";
import { describe, expect, it } from "vitest";
import { withPage } from "@gerak/tools/page";

const PIECES = fileURLToPath(new URL("../../../apps/pieces/", import.meta.url));
const source = { kind: "serve", root: PIECES } as const;
const SCROLLED = ["#story-progress", "#story-step-1", "#story-step-2"];
const ENGINE = ["#drink", "#hero-aura"];
const POSITIONS = 50;

interface Seen {
  readonly selector: string;
  readonly x: number;
  readonly y: number;
  readonly scaleX: number;
  readonly opacity: number;
  readonly animations: number;
}

/** Each selector's drawn transform and opacity at 50 scroll positions across the page, after two frames. */
async function lookAcross(page: Page): Promise<readonly (readonly Seen[])[]> {
  return page.evaluate(
    async ({ selectors, positions }) => {
      const frame = () => new Promise<void>((done) => requestAnimationFrame(() => done()));
      const root = document.documentElement;
      const max = root.scrollHeight - root.clientHeight;
      const out: Seen[][] = [];
      for (let k = 0; k < positions; k += 1) {
        window.scrollTo({ top: (max * k) / (positions - 1), behavior: "instant" });
        await frame();
        await frame();
        out.push(
          selectors.map((selector) => {
            const node = document.querySelector(selector);
            if (node === null) throw new Error(`no ${selector}`);
            const style = getComputedStyle(node);
            const matrix = new DOMMatrix(style.transform === "none" ? "" : style.transform);
            return {
              selector,
              x: matrix.m41,
              y: matrix.m42,
              scaleX: Math.hypot(matrix.m11, matrix.m12),
              opacity: Number(style.opacity),
              animations: node.getAnimations().length,
            };
          }),
        );
      }
      return out;
    },
    { selectors: [...SCROLLED, ...ENGINE], positions: POSITIONS },
  );
}

const offEngine = (page: Page) =>
  page.addInitScript(() => {
    Reflect.set(globalThis, Symbol.for("@gerak/dom/compositor-off"), true);
  });
const noTimeline = (page: Page) =>
  page.addInitScript(() => {
    Reflect.deleteProperty(globalThis, "ScrollTimeline");
  });

async function run(
  width: number,
  height: number,
  prepare?: (page: Page) => Promise<void>,
  then?: (page: Page) => Promise<void>,
): Promise<readonly (readonly Seen[])[]> {
  const { value } = await withPage(
    {
      page: "yuzu/yuzu.html",
      width,
      height,
      source,
      clock: "real",
      ...(prepare === undefined ? {} : { prepare }),
    },
    async ({ page }) => {
      await page.waitForTimeout(1200);
      await then?.(page);
      return lookAcross(page);
    },
  );
  return value;
}

// Strings round what the browser draws; this is the slack beyond the sampling tolerance.
const SLACK = 0.002;

function expectMatch(played: readonly (readonly Seen[])[], engine: readonly (readonly Seen[])[]) {
  played.forEach((row, k) =>
    row.forEach((seen, j) => {
      const want = engine[k]?.[j];
      if (want === undefined || !SCROLLED.includes(seen.selector)) return;
      const where = `${seen.selector} at position ${k}`;
      expect(Math.abs(seen.x - want.x), where).toBeLessThanOrEqual(0.25 + SLACK);
      expect(Math.abs(seen.y - want.y), where).toBeLessThanOrEqual(0.25 + SLACK);
      expect(Math.abs(seen.scaleX - want.scaleX), where).toBeLessThanOrEqual(0.001 + SLACK);
      expect(Math.abs(seen.opacity - want.opacity), where).toBeLessThanOrEqual(0.005 + SLACK);
    }),
  );
}

function animated(rows: readonly (readonly Seen[])[], selector: string): number {
  return rows[0]?.find((seen) => seen.selector === selector)?.animations ?? -1;
}

describe("yuzu's scroll-driven elements on the browser's scroll timeline", () => {
  for (const [width, height] of [
    [1280, 720],
    [390, 844],
  ] as const)
    it(`match the engine at ${POSITIONS} scroll positions at ${width}x${height}`, async () => {
      const played = await run(width, height);
      const engine = await run(width, height, offEngine);
      for (const selector of SCROLLED) {
        expect(animated(played, selector), selector).toBe(1);
        expect(animated(engine, selector), selector).toBe(0);
      }
      for (const selector of ENGINE) expect(animated(played, selector), selector).toBe(0);
      const widths = engine.map((row) => row[0]?.scaleX ?? 0);
      expect(Math.max(...widths) - Math.min(...widths)).toBeGreaterThan(0.5);
      expectMatch(played, engine);
    }, 120000);

  it("rebuilds its keyframes when the page is measured again", async () => {
    const played = await run(1280, 720, undefined, async (page) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForTimeout(500);
    });
    const engine = await run(390, 844, offEngine);
    expectMatch(played, engine);
  }, 120000);

  it("leaves every element in the engine without ScrollTimeline", async () => {
    const rows = await run(1280, 720, noTimeline);
    for (const selector of [...SCROLLED, ...ENGINE]) expect(animated(rows, selector)).toBe(0);
  }, 120000);
});
