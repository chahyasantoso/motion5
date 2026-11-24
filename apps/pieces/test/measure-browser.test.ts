import { mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { callerPiecesRoot, measurePage, readMeasureCache } from "@gerak/tools/page";
import { loadSceneFile, lookupCache, reviewSceneFile } from "@gerak/tools/scene";

const PIECES_ROOT = callerPiecesRoot();
const NAME = "measure-scratch";

function removeLeftovers(): void {
  for (const folder of readdirSync(PIECES_ROOT))
    if (folder.startsWith(NAME))
      rmSync(join(PIECES_ROOT, folder), { recursive: true, force: true });
}

beforeAll(removeLeftovers);
afterAll(removeLeftovers);

describe("gerak measure", () => {
  it("writes the cache of what the page's mount measured, which the scene tools then read", async () => {
    const dir = join(PIECES_ROOT, NAME);
    mkdirSync(join(dir, "src"), { recursive: true });
    writeFileSync(
      join(dir, `${NAME}.html`),
      `<!doctype html>
<html lang="en">
  <head>
    <style>
      body { margin: 0; }
      [data-cast="card"] { position: absolute; left: 100px; top: 50px; width: 200px; height: 120px; }
      [data-cast="title"] { margin: 10px; height: 20px; }
    </style>
  </head>
  <body>
    <div data-cast="card"><div data-cast="title">Hi</div></div>
    <script type="module" src="/${NAME}/src/main.ts"></script>
  </body>
</html>
`,
    );
    writeFileSync(
      join(dir, "src", `${NAME}.ts`),
      `import { box, sceneBuilder } from "@gerak/stage";
export default sceneBuilder({ length: 500 }).element(box("card")).element(box("title"));
`,
    );
    writeFileSync(
      join(dir, "src", "main.ts"),
      `import { mount } from "@gerak/dom";
import scene from "./${NAME}";
mount(scene, { clock: "live" });
`,
    );
    expect(lookupCache(join(dir, "src", `${NAME}.ts`)).kind).toBe("refused");

    const result = await measurePage({
      page: `${NAME}/${NAME}.html`,
      width: 800,
      height: 600,
      source: { kind: "serve", root: PIECES_ROOT },
    });
    expect(result).toMatchObject({ kind: "measured", names: ["card", "title"], pageErrors: [] });

    const cache = readMeasureCache(readFileSync(join(dir, `${NAME}.measure.json`), "utf8"));
    if ("reason" in cache) throw new Error(cache.reason);
    expect(cache.frame).toEqual({ width: 800, height: 600 });
    expect(cache.rest["card"]).toEqual({
      x: 200,
      y: 110,
      width: 200,
      height: 120,
      placement: { kind: "flow" },
    });
    expect(cache.rest["title"]).toEqual({
      x: 200,
      y: 70,
      width: 180,
      height: 20,
      placement: { kind: "flow" },
    });
    expect(cache.parents).toEqual({ title: "card" });
    expect(readFileSync(join(dir, `${NAME}.cast.ts`), "utf8")).toBe(
      [
        'import { box } from "@gerak/stage";',
        "",
        "export const cast = {",
        '  card: box("card"),',
        '  title: box("title"),',
        "} as const;",
        "",
        'export type DomCast = "card" | "title";',
        "export type ObjectCast = never;",
        "export type CastName = DomCast | ObjectCast;",
        "",
      ].join("\n"),
    );
    expect(lookupCache(join(dir, "src", `${NAME}.ts`)).kind).toBe("read");

    // Mutate HTML (adding an un-animated data-cast node) so cache becomes stale, then refresh via --measure.
    writeFileSync(
      join(dir, `${NAME}.html`),
      `<!doctype html>
<html lang="en">
  <head>
    <style>
      body { margin: 0; }
      [data-cast="card"] { position: absolute; left: 100px; top: 50px; width: 220px; height: 120px; }
      [data-cast="title"] { margin: 10px; height: 20px; }
    </style>
  </head>
  <body>
    <div data-cast="card"><div data-cast="title">Hi</div></div>
    <div data-cast="badge">New</div>
    <div data-cast="badge">New 2</div>
    <script type="module" src="/${NAME}/src/main.ts"></script>
  </body>
</html>
`,
    );
    writeFileSync(
      join(dir, "src", `${NAME}.ts`),
      `import { motion } from "@gerak/core";
import { beat, box, sceneBuilder, text } from "@gerak/stage";
const enter = beat("enter", 400);
export default sceneBuilder({ length: 1000 })
  .element(box("card"))
  .motion(motion((t) => ({ x: 40 * t.progress })).in(enter))
  .element(text("title", { split: "words" }))
  .motion(motion((t) => ({ y: 20 * t.progress })).in(enter));
`,
    );
    writeFileSync(
      join(dir, `${NAME}.html`),
      readFileSync(join(dir, `${NAME}.html`), "utf8").replace(">Hi<", ">Hi there<"),
    );
    const scenePath = join(dir, "src", `${NAME}.ts`);
    expect(lookupCache(scenePath).kind).toBe("refused");

    const reviewed = await reviewSceneFile({
      file: scenePath,
      hold: 500,
      jump: 150,
      turn: 150,
      ratio: 1.5,
      budget: 8,
      measure: true,
    });
    expect(reviewed).toEqual({ kind: "reviewed", findings: [] });
    const refreshedCast = readFileSync(join(dir, `${NAME}.cast.ts`), "utf8");
    expect(refreshedCast).toContain('badge: box("badge", { parts: true }),');
    expect(refreshedCast).toContain('title: box("title"),');
    expect(refreshedCast).toContain('export type DomCast = "badge" | "card" | "title";');
    const refreshedCache = readMeasureCache(
      readFileSync(join(dir, `${NAME}.measure.json`), "utf8"),
    );
    if ("reason" in refreshedCache) throw new Error(refreshedCache.reason);
    expect(refreshedCache.frame).toEqual({ width: 800, height: 600 });
    expect(refreshedCache.rest["card"]?.width).toBe(220);

    // Mutate HTML again and verify loadSceneFile(..., { measure: true }) refreshes stale cache.
    writeFileSync(
      join(dir, `${NAME}.html`),
      readFileSync(join(dir, `${NAME}.html`), "utf8").replace("width: 220px", "width: 240px"),
    );
    expect(lookupCache(scenePath).kind).toBe("refused");
    const loaded = await loadSceneFile(scenePath, { measure: true });
    if ("reason" in loaded) throw new Error(loaded.reason);
    expect(loaded.measured?.rest["card"]?.width).toBe(240);
    expect(loaded.measured?.frame).toEqual({ width: 800, height: 600 });

    // Skip re-measuring when both the cache and cast module are already fresh.
    const cacheFile = join(dir, `${NAME}.measure.json`);
    const castFile = join(dir, `${NAME}.cast.ts`);
    const beforeMtimeMs = statSync(cacheFile).mtimeMs;
    const cachedAgain = await loadSceneFile(scenePath, { measure: true });
    if ("reason" in cachedAgain) throw new Error(cachedAgain.reason);
    expect(statSync(cacheFile).mtimeMs).toBe(beforeMtimeMs);

    // Regenerate when the cast module is absent despite a fresh cache.
    rmSync(castFile);
    const regenerated = await loadSceneFile(scenePath, { measure: true });
    if ("reason" in regenerated) throw new Error(regenerated.reason);
    expect(readFileSync(castFile, "utf8")).toContain('badge: box("badge", { parts: true }),');

    // Rename a data-cast node so mount throws; measurePage refuses .measure.json yet still syncs .cast.ts.
    writeFileSync(
      join(dir, `${NAME}.html`),
      readFileSync(join(dir, `${NAME}.html`), "utf8").replaceAll(
        'data-cast="title"',
        'data-cast="heading"',
      ),
    );
    const broken = await measurePage({
      page: `${NAME}/${NAME}.html`,
      width: 800,
      height: 600,
      source: { kind: "serve", root: PIECES_ROOT },
    });
    expect(broken.kind).toBe("refused");
    expect(broken.pageErrors.length).toBeGreaterThan(0);
    expect(readFileSync(castFile, "utf8")).toContain('heading: box("heading"),');
    expect(readFileSync(castFile, "utf8")).not.toContain('title: box("title")');

    // Async bootstrap failure registered via ready(...) still refuses .measure.json and syncs .cast.ts.
    writeFileSync(
      join(dir, "src", "main.ts"),
      `import { mount, ready } from "@gerak/dom";
import scene from "./${NAME}";
ready((async () => {
  await Promise.resolve();
  mount(scene, { clock: "live" });
})());
`,
    );
    writeFileSync(
      join(dir, `${NAME}.html`),
      readFileSync(join(dir, `${NAME}.html`), "utf8").replaceAll(
        'data-cast="heading"',
        'data-cast="banner"',
      ),
    );
    const asyncBroken = await measurePage({
      page: `${NAME}/${NAME}.html`,
      width: 800,
      height: 600,
      source: { kind: "serve", root: PIECES_ROOT },
    });
    expect(asyncBroken.kind).toBe("refused");
    expect(asyncBroken.pageErrors.length).toBeGreaterThan(0);
    expect(readFileSync(castFile, "utf8")).toContain('banner: box("banner"),');
    expect(readFileSync(castFile, "utf8")).not.toContain('heading: box("heading")');
  });
});
