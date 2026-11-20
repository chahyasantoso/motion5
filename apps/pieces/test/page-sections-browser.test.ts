import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { callerPiecesRoot, withPage } from "@gerak/tools/page";

const PIECES_ROOT = callerPiecesRoot();
const PIECES_SOURCE = { kind: "serve", root: PIECES_ROOT } as const;
const PREFIX = "sections-scratch-";
const STEP_TIMEOUT_MS = 5000;
let copies = 0;

function removeLeftovers(): void {
  for (const folder of readdirSync(PIECES_ROOT))
    if (folder.startsWith(PREFIX))
      rmSync(join(PIECES_ROOT, folder), { recursive: true, force: true });
}

function writeScratchPage(): { readonly html: string } {
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
    <title>section edges browser test</title>
    <style>
      body { margin: 0; }
      #hero { min-height: 100vh; background: #182026; }
      #features { min-height: 80vh; background: #293742; }
      #story { min-height: 220vh; position: relative; background: #394b59; }
      .story-sticky { position: sticky; top: 0; height: 100vh; }
      #badge { width: 80px; height: 80px; background: #ffb366; }
    </style>
  </head>
  <body>
    <section id="hero"></section>
    <section id="features"></section>
    <section id="story">
      <div class="story-sticky">
        <div id="badge"></div>
      </div>
    </section>
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
import { beat, box, el, restReader, sceneBuilder, section } from "@gerak/stage";

const hero = section("hero", el("#hero"));
const features = section("features", el("#features"));
const story = section("story", el("#story"));
const travelStory = beat("to-story", { scroll: [hero.top, story.top] });
const inFeatures = beat("in-features", { scroll: [features.top, features.end] });

const scene = sceneBuilder()
  .element(box("badge", { node: el("#badge") }))
  .motion(
    motion((t) => ({ x: 100 * t.progress })).in(travelStory),
    motion((t) => ({ y: 20 * t.progress })).in(inFeatures),
  );

const mounted = mountPage(scene);
Reflect.set(window, "__mountedPage", mounted);
Reflect.set(window, "__sections", { hero, features, story });
Reflect.set(window, "__restReader", restReader);
`,
    "utf8",
  );
  return { html: `${name}/${name}.html` };
}

beforeAll(removeLeftovers);
afterAll(removeLeftovers);

describe("section edges in the browser", () => {
  it("matches measured DOM boxes at two viewport sizes and drives scroll beats across resize", async () => {
    const scratch = writeScratchPage();
    await withPage(
      {
        page: scratch.html,
        width: 1280,
        height: 720,
        source: PIECES_SOURCE,
      },
      async (session) => {
        const { page } = session;
        page.setDefaultTimeout(STEP_TIMEOUT_MS);

        const readEdges = () =>
          page.evaluate(() => {
            const mounted = Reflect.get(window, "__mountedPage");
            const sectionsObj = Reflect.get(window, "__sections");
            const restReaderFn = Reflect.get(window, "__restReader");
            if (
              typeof mounted !== "object" ||
              mounted === null ||
              typeof sectionsObj !== "object" ||
              sectionsObj === null ||
              typeof restReaderFn !== "function"
            )
              throw new Error("missing globals");
            const reader = Reflect.apply(restReaderFn, undefined, [Reflect.get(mounted, "rest")]);
            const scrollY = window.scrollY;
            const out: Record<
              string,
              {
                readonly topEdge: number;
                readonly endEdge: number;
                readonly domTop: number;
                readonly domEnd: number;
              }
            > = {};
            for (const name of ["hero", "features", "story"]) {
              const sec = Reflect.get(sectionsObj, name);
              const topPoint = Reflect.get(sec, "top");
              const endPoint = Reflect.get(sec, "end");
              const topAt = Reflect.get(topPoint, "at");
              const endAt = Reflect.get(endPoint, "at");
              const elNode = document.querySelector(`#${name}`);
              if (!(elNode instanceof HTMLElement)) throw new Error(`missing #${name}`);
              const rect = elNode.getBoundingClientRect();
              out[name] = {
                topEdge: Number(Reflect.apply(topAt, topPoint, [reader])),
                endEdge: Number(Reflect.apply(endAt, endPoint, [reader])),
                domTop: rect.top + scrollY,
                domEnd: rect.bottom + scrollY,
              };
            }
            const badge = document.querySelector("#badge");
            return {
              edges: out,
              badgeTransform: badge instanceof HTMLElement ? badge.style.transform : "",
            };
          });

        const wide = await readEdges();
        expect(wide.edges["hero"]?.topEdge).toBeCloseTo(wide.edges["hero"]?.domTop ?? -1, 0);
        expect(wide.edges["hero"]?.endEdge).toBeCloseTo(wide.edges["hero"]?.domEnd ?? -1, 0);
        expect(wide.edges["features"]?.topEdge).toBeCloseTo(
          wide.edges["features"]?.domTop ?? -1,
          0,
        );
        expect(wide.edges["story"]?.topEdge).toBeCloseTo(wide.edges["story"]?.domTop ?? -1, 0);
        expect(wide.edges["story"]?.endEdge).toBeCloseTo(wide.edges["story"]?.domEnd ?? -1, 0);

        // Scroll to wide story.top -> to-story progress 1 (x = 100px), in-features 0 (y = 0px).
        await page.evaluate((y) => {
          scrollTo(0, y);
          document.dispatchEvent(new Event("scroll", { bubbles: true }));
        }, wide.edges["story"]?.topEdge ?? 0);
        await session.advanceTo(100);
        expect((await readEdges()).badgeTransform).toContain("translate3d(100px,");

        // Resize to taller viewport (768x900) so vh-based sections grow and shift story.top.
        await page.setViewportSize({ width: 768, height: 900 });
        await expect
          .poll(async () => (await readEdges()).edges["story"]?.topEdge ?? 0)
          .toBeGreaterThan((wide.edges["story"]?.topEdge ?? 0) + 100);

        const narrow = await readEdges();
        expect(narrow.edges["hero"]?.topEdge).toBeCloseTo(narrow.edges["hero"]?.domTop ?? -1, 0);
        expect(narrow.edges["hero"]?.endEdge).toBeCloseTo(narrow.edges["hero"]?.domEnd ?? -1, 0);
        expect(narrow.edges["features"]?.topEdge).toBeCloseTo(
          narrow.edges["features"]?.domTop ?? -1,
          0,
        );
        expect(narrow.edges["story"]?.topEdge).toBeCloseTo(narrow.edges["story"]?.domTop ?? -1, 0);
        expect(narrow.edges["story"]?.endEdge).toBeCloseTo(narrow.edges["story"]?.domEnd ?? -1, 0);
        expect(narrow.badgeTransform).not.toContain("translate3d(100px,");

        // Scroll to the new narrow story.top -> progress returns to 1 (x = 100px).
        await page.evaluate((y) => {
          scrollTo(0, y);
          document.dispatchEvent(new Event("scroll", { bubbles: true }));
        }, narrow.edges["story"]?.topEdge ?? 0);
        await session.advanceTo(200);
        expect((await readEdges()).badgeTransform).toContain("translate3d(100px,");
      },
    );
  }, 30000);
});
