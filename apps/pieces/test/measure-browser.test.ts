import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { callerPiecesRoot, measurePage, readMeasureCache } from "@gerak/tools/page";
import { lookupCache } from "@gerak/tools/scene";

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
    expect(lookupCache(join(dir, "src", `${NAME}.ts`)).kind).toBe("read");
  });
});
