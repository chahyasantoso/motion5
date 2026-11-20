import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { callerPiecesRoot, withPage } from "@gerak/tools/page";

const PIECES_ROOT = callerPiecesRoot();
const PIECES_SOURCE = { kind: "serve", root: PIECES_ROOT } as const;
const PREFIX = "page-scratch-";
const STEP_TIMEOUT_MS = 5000;
let copies = 0;

function removeLeftovers(): void {
  for (const folder of readdirSync(PIECES_ROOT))
    if (folder.startsWith(PREFIX))
      rmSync(join(PIECES_ROOT, folder), { recursive: true, force: true });
}

function writeScratchPage(): { readonly name: string; readonly html: string } {
  copies += 1;
  const name = `${PREFIX}${copies}`;
  const dir = join(PIECES_ROOT, name);
  const srcDir = join(dir, "src");
  mkdirSync(srcDir, { recursive: true });
  writeFileSync(
    join(dir, `${name}.html`),
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>page mount browser test</title>
    <style>
      body { margin: 0; font: 28px/1.3 sans-serif; height: 2800px; }
      #headline-wrap { width: 200px; padding: 24px; }
      #headline { margin: 0; font-size: 28px; line-height: 1.3; }
      #card { width: 120px; height: 60px; margin-left: 24px; background: #225; }
      #pin-wrap { margin-top: 300px; height: 700px; position: relative; background: #eee; }
      #sticky-box { position: sticky; top: 60px; height: 200px; width: 200px; }
      #sticky-slot { margin-top: 20px; width: 50px; height: 50px; background: #c53; }
      #fixed-pin { position: fixed; right: 20px; top: 30px; width: 40px; height: 40px; background: #3a7; }
    </style>
  </head>
  <body>
    <div id="headline-wrap">
      <h1 id="headline">Fresh pressed citrus every morning</h1>
    </div>
    <div id="card"></div>
    <div id="pin-wrap">
      <div id="sticky-box">
        <div id="sticky-slot"></div>
      </div>
    </div>
    <div id="fixed-pin"></div>
    <script type="module" src="/${name}/src/main.ts"></script>
  </body>
</html>
`,
    "utf8",
  );
  writeFileSync(
    join(srcDir, "main.ts"),
    `import { motion } from "@gerak/core";
import { mountPage } from "@gerak/dom";
import { beat, box, el, sceneBuilder, scrollPoint, stagger, text } from "@gerak/stage";
import { boxInViewport } from "@gerak/stage/render";

const reveal = beat("reveal", { scroll: [scrollPoint(0), scrollPoint(400)] });
const headline = text("headline", "Fresh pressed citrus every morning", {
  split: "words",
  node: el("#headline"),
});
const card = box("card", { node: el("#card") });
const stickySlot = box("stickySlot", { node: el("#sticky-slot") });
const fixedPin = box("fixedPin", { node: el("#fixed-pin") });

const scene = sceneBuilder()
  .element(headline)
  .motion(stagger(motion((t) => ({ y: 20 * (1 - t.progress) })), { spread: 1, by: "line" }).in(reveal))
  .element(card)
  .motion(motion((t) => ({ x: 100 * t.progress })).in(reveal))
  .element(stickySlot)
  .element(fixedPin);

const mounted = mountPage(scene);
Reflect.set(window, "__mountedPage", mounted);
Reflect.set(window, "__boxInViewport", boxInViewport);
`,
    "utf8",
  );
  return { name, html: `${name}/${name}.html` };
}

beforeAll(removeLeftovers);
afterAll(removeLeftovers);

describe("mountPage in the browser", () => {
  it("measures word lines across resize without changing part count and animates existing nodes on scroll", async () => {
    const scratch = writeScratchPage();
    await withPage(
      {
        page: scratch.html,
        width: 800,
        height: 600,
        source: PIECES_SOURCE,
        actions: [{ kind: "scroll", px: 200, at: 200 }],
      },
      async (session) => {
        const { page } = session;
        page.setDefaultTimeout(STEP_TIMEOUT_MS);

        const initial = await page.evaluate(() => {
          const mounted = Reflect.get(window, "__mountedPage");
          const linesObj =
            typeof mounted === "object" && mounted !== null
              ? Reflect.get(mounted, "lines")
              : undefined;
          const headlineLines =
            typeof linesObj === "object" && linesObj !== null
              ? Reflect.get(linesObj, "headline")
              : undefined;
          const card = document.querySelector("#card");
          const shadowHosts = [...document.querySelectorAll("*")].filter((node) => node.shadowRoot);
          return {
            lines: Array.isArray(headlineLines) ? headlineLines.map(Number) : [],
            hasCard: card instanceof HTMLElement,
            shadowCount: shadowHosts.length,
          };
        });

        expect(initial.hasCard).toBe(true);
        expect(initial.shadowCount).toBe(0);
        expect(initial.lines.length).toBe(5);
        expect(new Set(initial.lines).size).toBeGreaterThanOrEqual(2);

        await session.advanceTo(300);

        const scrolled = await page.evaluate(() => {
          const card = document.querySelector<HTMLElement>("#card");
          const spans = [...document.querySelectorAll<HTMLElement>("#headline span")];
          return {
            cardTransform: card?.style.transform ?? "",
            ys: spans.map((span) => span.style.transform),
          };
        });
        expect(scrolled.cardTransform).toBe("translate3d(50px, 0px, 0px)");
        expect(scrolled.ys[0]).toBe("");
        expect(scrolled.ys[4]).not.toBe("");

        await page.evaluate(() => {
          const wrap = document.querySelector<HTMLElement>("#headline-wrap");
          if (wrap !== null) wrap.style.width = "760px";
        });

        await expect
          .poll(() =>
            page.evaluate(() => {
              const mounted = Reflect.get(window, "__mountedPage");
              const linesObj =
                typeof mounted === "object" && mounted !== null
                  ? Reflect.get(mounted, "lines")
                  : undefined;
              const headlineLines =
                typeof linesObj === "object" && linesObj !== null
                  ? Reflect.get(linesObj, "headline")
                  : undefined;
              return Array.isArray(headlineLines) ? headlineLines.map(Number) : [];
            }),
          )
          .toEqual([0, 0, 0, 0, 0]);

        // Verify sticky (with top: 60px) and fixed placements match real getBoundingClientRect() across scroll phases.
        for (const scrollTargetY of [0, 700, 1200]) {
          const check = await page.evaluate((scrollY) => {
            scrollTo(0, scrollY);
            const mounted = Reflect.get(window, "__mountedPage");
            const boxInViewportFn = Reflect.get(window, "__boxInViewport");
            const rest =
              typeof mounted === "object" && mounted !== null
                ? Reflect.get(mounted, "rest")
                : undefined;
            const stickyBox =
              typeof rest === "object" && rest !== null
                ? Reflect.get(rest, "stickySlot")
                : undefined;
            const fixedBox =
              typeof rest === "object" && rest !== null ? Reflect.get(rest, "fixedPin") : undefined;
            const slotEl = document.querySelector("#sticky-slot")?.getBoundingClientRect();
            const fixedEl = document.querySelector("#fixed-pin")?.getBoundingClientRect();
            const stickyVp =
              typeof boxInViewportFn === "function" && stickyBox !== undefined
                ? Reflect.apply(boxInViewportFn, undefined, [stickyBox, window.scrollY])
                : undefined;
            const fixedVp =
              typeof boxInViewportFn === "function" && fixedBox !== undefined
                ? Reflect.apply(boxInViewportFn, undefined, [fixedBox, window.scrollY])
                : undefined;
            return {
              stickyComputedY:
                typeof stickyVp === "object" && stickyVp !== null
                  ? Number(Reflect.get(stickyVp, "y"))
                  : -1,
              stickyActualY: slotEl ? slotEl.top + slotEl.height / 2 : -2,
              fixedComputedY:
                typeof fixedVp === "object" && fixedVp !== null
                  ? Number(Reflect.get(fixedVp, "y"))
                  : -1,
              fixedActualY: fixedEl ? fixedEl.top + fixedEl.height / 2 : -2,
            };
          }, scrollTargetY);
          expect(Math.abs(check.stickyComputedY - check.stickyActualY)).toBeLessThanOrEqual(1);
          expect(Math.abs(check.fixedComputedY - check.fixedActualY)).toBeLessThanOrEqual(1);
        }
      },
    );
  }, 30000);
});
