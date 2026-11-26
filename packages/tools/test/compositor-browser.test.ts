import { fileURLToPath } from "node:url";
import type { Page } from "playwright-core";
import { describe, expect, it } from "vitest";
import { withPage } from "@gerak/tools/page";

const PIECES = fileURLToPath(new URL("../../../apps/pieces/", import.meta.url));
const source = { kind: "serve", root: PIECES } as const;
const SCROLLED = ["#story-progress", "#story-step-1", "#story-step-2"];
const TRIGGERED = ["#features .feature-card", "#gallery .gallery-card"];
const ENGINE = ["#drink", "#hero-aura", "#hero-sub"];
const POSITIONS = 11;

interface Seen {
  readonly selector: string;
  readonly x: number;
  readonly y: number;
  readonly scaleX: number;
  readonly opacity: number;
  readonly animations: number;
}

/** Each selector's drawn transform and opacity at evenly spaced scroll positions across the page, from the top to the bottom, after two frames. */
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

/** Waits until the page has mounted and drawn two frames, so the engine has attached what it will. */
async function ready(page: Page): Promise<void> {
  await page.waitForFunction(() => {
    const listed: unknown = Reflect.get(globalThis, Symbol.for("@gerak/dom/mounts"));
    return Array.isArray(listed) && listed.length > 0;
  });
  await frames(page, 2);
}

const frames = (page: Page, count: number): Promise<void> =>
  page.evaluate(async (n) => {
    for (let k = 0; k < n; k += 1)
      await new Promise<void>((done) => requestAnimationFrame(() => done()));
  }, count);

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
      await ready(page);
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
      await page.evaluate(() => {
        Reflect.set(
          window,
          "__before",
          document.querySelector("#story-progress")?.getAnimations()[0],
        );
      });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForFunction(() => {
        const now = document.querySelector("#story-progress")?.getAnimations()[0];
        return now !== undefined && now !== Reflect.get(window, "__before");
      });
      await frames(page, 2);
    });
    const engine = await run(390, 844, offEngine);
    expectMatch(played, engine);
  }, 120000);

  it("leaves every element in the engine without ScrollTimeline", async () => {
    const rows = await run(1280, 720, noTimeline);
    for (const selector of [...SCROLLED, ...TRIGGERED, ...ENGINE])
      expect(animated(rows, selector)).toBe(0);
  }, 120000);

  it("keeps existing compositor animations attached when a non-dependency cast element resizes", async () => {
    const { value, pageErrors } = await withPage(
      {
        page: "yuzu/yuzu.html",
        width: 1280,
        height: 720,
        source,
        clock: "real",
      },
      async ({ page }) => {
        await ready(page);
        return page.evaluate(async () => {
          const frame = () => new Promise<void>((done) => requestAnimationFrame(() => done()));
          const storyProgress = document.querySelector("#story-progress");
          const featureCard = document.querySelector("#features .feature-card");
          const heroAura = document.querySelector<HTMLElement>("#hero-aura");
          if (storyProgress === null || featureCard === null || heroAura === null) {
            throw new Error("missing expected yuzu cast nodes");
          }
          const initialScrollAnim = storyProgress.getAnimations()[0];
          const initialTriggerAnim = featureCard.getAnimations()[0];
          heroAura.style.width = "300px";
          heroAura.style.height = "300px";
          await frame();
          await frame();
          await frame();
          return {
            hasInitial: initialScrollAnim !== undefined && initialTriggerAnim !== undefined,
            sameScrollAnim: storyProgress.getAnimations()[0] === initialScrollAnim,
            sameTriggerAnim: featureCard.getAnimations()[0] === initialTriggerAnim,
            scrollCount: storyProgress.getAnimations().length,
            triggerCount: featureCard.getAnimations().length,
          };
        });
      },
    );
    expect(pageErrors).toEqual([]);
    expect(value).toEqual({
      hasInitial: true,
      sameScrollAnim: true,
      sameTriggerAnim: true,
      scrollCount: 1,
      triggerCount: 1,
    });
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
        const quiet = () =>
          page.waitForFunction(() =>
            ["reverse", "stay", "replay"].every((id) =>
              (document.getElementById(id)?.getAnimations() ?? []).every(
                (animation) => animation.playState !== "running",
              ),
            ),
          );
        const rest = async (when: string) => {
          await quiet();
          expectCards(await cardsNow(page), 0.25 + SLACK, 0.005 + SLACK, when);
        };
        const running = async (when: string) => {
          await frames(page, 3);
          expectCards(await cardsNow(page), 2, 0.05, when);
        };
        await ready(page);
        await rest("before crossing");
        await scrollTo(page, 600);
        await running("while revealing");
        await rest("revealed");
        await scrollTo(page, 0);
        await running("after crossing back");
        await rest("back at rest");
        await scrollTo(page, 600);
        await running("crossing again");
        await rest("revealed again");
        // Back and forth within one task: replay starts again with no frame between the two crossings.
        await page.evaluate(() => {
          for (const top of [0, 600]) {
            window.scrollTo({ top, behavior: "instant" });
            window.dispatchEvent(new Event("scroll"));
          }
        });
        await running("crossed back and forth in one task");
      },
    );
  }, 120000);
});

describe("the page tools while they hold the clock", () => {
  it("keep every gerak element in the engine, and leave a page's own scroll-timeline animation to the scripted scroll", async () => {
    const { value } = await withPage(
      {
        page: "scroll.html",
        width: 800,
        height: 600,
        source: { kind: "serve", root: FIXTURES },
        actions: [
          { kind: "scroll", target: { kind: "px", px: 700 }, at: 300 },
          { kind: "scroll", target: { kind: "px", px: 400 }, at: 1700 },
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
            const root = document.documentElement;
            const plainNode = document.getElementById("plain");
            const plainDrawn = plainNode === null ? "none" : getComputedStyle(plainNode).transform;
            return {
              bar: read("bar"),
              card: read("card"),
              plainX: new DOMMatrix(plainDrawn === "none" ? "" : plainDrawn).m41,
              plainWant: (240 * scrollY) / (root.scrollHeight - root.clientHeight),
            };
          });
        };
        await session.advanceTo(1600);
        const first = await look();
        await session.advanceTo(1900);
        return [first, await look()];
      },
    );
    const [first, second] = value;
    expect(first?.bar.animations).toBe(0);
    expect(first?.card.animations).toBe(0);
    expect(first?.bar.wantX).toBeCloseTo(150, 5);
    expect(second?.bar.wantX).toBeCloseTo(60, 5);
    for (const seen of [first, second]) {
      expect(Math.abs((seen?.plainX ?? NaN) - (seen?.plainWant ?? NaN))).toBeLessThanOrEqual(0.5);
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
