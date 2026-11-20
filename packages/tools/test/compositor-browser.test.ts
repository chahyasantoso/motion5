import { fileURLToPath } from "node:url";
import type { Page } from "playwright-core";
import { describe, expect, it } from "vitest";
import { withPage } from "@gerak/tools/page";

const PIECES = fileURLToPath(new URL("../../../apps/pieces/", import.meta.url));
const source = { kind: "serve", root: PIECES } as const;
const SCROLLED = ["#story-progress", "#story-step-1", "#story-step-2"];
const TRIGGERED = ["#features .feature-card", "#gallery .gallery-card"];
const ENGINE = ["#drink", "#hero-aura", "#hero-sub"];
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
    { selectors: [...SCROLLED, ...TRIGGERED, ...ENGINE], positions: POSITIONS },
  );
}

const offEngine = async (page: Page): Promise<void> => {
  await page.addInitScript(() => {
    Reflect.set(globalThis, Symbol.for("@gerak/dom/compositor-off"), true);
  });
};
const noTimeline = async (page: Page): Promise<void> => {
  await page.addInitScript(() => {
    Reflect.deleteProperty(globalThis, "ScrollTimeline");
  });
};

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
      for (const selector of TRIGGERED) {
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
    for (const selector of [...SCROLLED, ...TRIGGERED, ...ENGINE])
      expect(animated(rows, selector)).toBe(0);
  }, 120000);
});

const FIXTURES = fileURLToPath(new URL("./fixtures/compositor/", import.meta.url));
const CARDS = ["reverse", "stay", "replay"] as const;

interface Card {
  readonly y: number;
  readonly opacity: number;
  readonly animations: number;
}

/** Each card's drawn pose and the engine's pose for the same moment, read in one task. */
async function cardsNow(
  page: Page,
): Promise<{ readonly drawn: Record<string, Card>; readonly engine: Record<string, Card> }> {
  return page.evaluate((names) => {
    const expected: unknown = Reflect.apply(Reflect.get(window, "__expected"), window, []);
    const drawn: Record<string, Card> = {};
    for (const name of names) {
      const node = document.getElementById(name);
      if (node === null) throw new Error(`no #${name}`);
      const style = getComputedStyle(node);
      const matrix = new DOMMatrix(style.transform === "none" ? "" : style.transform);
      drawn[name] = {
        y: matrix.m42,
        opacity: Number(style.opacity),
        animations: node.getAnimations().length,
      };
    }
    const engine: Record<string, Card> = {};
    for (const name of names) {
      const pose: unknown = Reflect.get(Object(expected), name);
      engine[name] = {
        y: Number(Reflect.get(Object(pose), "y")),
        opacity: Number(Reflect.get(Object(pose), "opacity")),
        animations: 1,
      };
    }
    return { drawn, engine };
  }, CARDS);
}

async function scrollTo(page: Page, top: number): Promise<void> {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), top);
}

function expectCards(
  seen: { readonly drawn: Record<string, Card>; readonly engine: Record<string, Card> },
  px: number,
  opacity: number,
  when: string,
): void {
  for (const name of CARDS) {
    const drawn = seen.drawn[name];
    const engine = seen.engine[name];
    expect(drawn?.animations, `${name} ${when}`).toBe(1);
    expect(Math.abs((drawn?.y ?? NaN) - (engine?.y ?? NaN)), `${name} ${when}`).toBeLessThanOrEqual(
      px,
    );
    expect(
      Math.abs((drawn?.opacity ?? NaN) - (engine?.opacity ?? NaN)),
      `${name} ${when}`,
    ).toBeLessThanOrEqual(opacity);
  }
}

describe("triggered cards on the document timeline", () => {
  it("start once on crossing and follow reverse, stay and replay back as the engine does", async () => {
    await withPage(
      {
        page: "triggers.html",
        width: 800,
        height: 600,
        source: { kind: "serve", root: FIXTURES },
        clock: "real",
      },
      async ({ page }) => {
        // At rest the poses match within the sampling tolerance; while a card runs, a frame of skew.
        const rest = (when: string) => async () =>
          expectCards(await cardsNow(page), 0.25 + SLACK, 0.005 + SLACK, when);
        const running = (when: string) => async () =>
          expectCards(await cardsNow(page), 2, 0.05, when);
        await page.waitForTimeout(400);
        await rest("before crossing")();
        await scrollTo(page, 600);
        await page.waitForTimeout(400);
        await running("while revealing")();
        await page.waitForTimeout(1000);
        await rest("revealed")();
        await scrollTo(page, 0);
        await page.waitForTimeout(400);
        await running("after crossing back")();
        await page.waitForTimeout(1000);
        await rest("back at rest")();
        await scrollTo(page, 600);
        await page.waitForTimeout(400);
        await running("crossing again")();
        await page.waitForTimeout(1000);
        await rest("revealed again")();
        // Back and forth within one task: replay starts again with no frame between the two crossings.
        await page.evaluate(() => {
          for (const top of [0, 600]) {
            window.scrollTo({ top, behavior: "instant" });
            window.dispatchEvent(new Event("scroll"));
          }
        });
        await page.waitForTimeout(400);
        await running("crossed back and forth in one task")();
      },
    );
  }, 120000);
});

describe("the page tools on a page the browser plays", () => {
  it("show a scroll-timeline animation at the scripted scroll, and keep triggers in the engine", async () => {
    const { value } = await withPage(
      {
        page: "scroll.html",
        width: 800,
        height: 600,
        source: { kind: "serve", root: FIXTURES },
        actions: [
          { kind: "scroll", px: 700, at: 300 },
          { kind: "scroll", px: 400, at: 1700 },
        ],
      },
      async (session) => {
        // A screenshot draws a frame, as `gerak frames` does, so the scroll timeline has caught up.
        const look = async () => {
          await session.page.screenshot();
          return session.page.evaluate(() => {
            const expected: unknown = Reflect.apply(Reflect.get(window, "__expected"), window, []);
            const read = (name: string) => {
              const node = document.getElementById(name);
              if (node === null) throw new Error(`no #${name}`);
              const transform = getComputedStyle(node).transform;
              const matrix = new DOMMatrix(transform === "none" ? "" : transform);
              const pose: unknown = Reflect.get(Object(expected), name);
              return {
                x: matrix.m41,
                y: matrix.m42,
                wantX: Number(Reflect.get(Object(pose), "x")),
                wantY: Number(Reflect.get(Object(pose), "y")),
                animations: node.getAnimations().length,
              };
            };
            return { bar: read("bar"), card: read("card") };
          });
        };
        await session.advanceTo(1600);
        const first = await look();
        await session.advanceTo(1900);
        return [first, await look()];
      },
    );
    const [first, second] = value;
    expect(first?.bar.animations).toBe(1);
    expect(first?.card.animations).toBe(0);
    expect(first?.bar.wantX).toBeCloseTo(150, 5);
    expect(second?.bar.wantX).toBeCloseTo(60, 5);
    for (const seen of [first, second]) {
      expect(Math.abs((seen?.bar.x ?? NaN) - (seen?.bar.wantX ?? NaN))).toBeLessThanOrEqual(
        0.25 + SLACK,
      );
      expect(Math.abs((seen?.card.y ?? NaN) - (seen?.card.wantY ?? NaN))).toBeLessThanOrEqual(
        0.25 + SLACK,
      );
    }
  }, 120000);
});

describe("a motion that throws where the page has not scrolled", () => {
  it("leaves the mount working and the element in the engine", async () => {
    const { value, pageErrors } = await withPage(
      {
        page: "throws.html",
        width: 800,
        height: 600,
        source: { kind: "serve", root: FIXTURES },
        clock: "real",
      },
      ({ page }) =>
        page.evaluate(() => ({
          mounted: Reflect.get(window, "__mounted") === true,
          animations: document.getElementById("late")?.getAnimations().length ?? -1,
        })),
    );
    expect(pageErrors).toEqual([]);
    expect(value).toEqual({ mounted: true, animations: 0 });
  }, 120000);
});
