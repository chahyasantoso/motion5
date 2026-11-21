import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { cachePathOf, pageDigest, readMeasureCache } from "../src/page/measure-cache";
import { lookupCache, pageOfSceneFile, restOfCache } from "../src/scene/measure-cache";
import { loadSceneFile } from "../src/scene/scene";

const made: string[] = [];
afterEach(() => {
  for (const folder of made.splice(0)) rmSync(folder, { recursive: true, force: true });
});

/** A brief folder with a page and its scene file; returns their paths. */
function brief(): { readonly page: string; readonly scene: string } {
  const root = mkdtempSync(join(tmpdir(), "measure-cache-"));
  made.push(root);
  mkdirSync(join(root, "card", "src"), { recursive: true });
  const page = join(root, "card", "card.html");
  writeFileSync(page, '<div data-cast="card"></div>');
  const scene = join(root, "card", "src", "card.ts");
  writeFileSync(
    scene,
    'import { box, sceneBuilder } from "@gerak/stage";\nexport default sceneBuilder({ length: 500 }).element(box("card"));\n',
  );
  return { page, scene };
}

function cacheText(digest: string): string {
  return JSON.stringify({
    page: "card.html",
    digest,
    frame: { width: 800, height: 600 },
    rest: {
      card: { x: 50, y: 40, width: 100, height: 80, placement: { kind: "flow" } },
      pin: {
        x: 10,
        y: 10,
        width: 20,
        height: 20,
        placement: { kind: "sticky", minY: 0, maxY: 400, pinY: 10 },
      },
    },
    lines: {},
    parents: { pin: "card" },
  });
}

describe("the measure cache", () => {
  it("names a scene file's page and the cache beside it", () => {
    expect(pageOfSceneFile(join("p", "card", "src", "card-scene.ts"))).toBe(
      join("p", "card", "card.html"),
    );
    expect(pageOfSceneFile(join("p", "card", "card.ts"))).toBeUndefined();
    expect(cachePathOf(join("p", "card", "card.html"))).toBe(
      join("p", "card", "card.measure.json"),
    );
  });

  it("reads a cache and gives its boxes their placements back, and refuses a malformed one", () => {
    const read = readMeasureCache(cacheText("abc"));
    if ("reason" in read) throw new Error(read.reason);
    const rest = restOfCache(read);
    expect(rest.get("card")).toEqual({ x: 50, y: 40, width: 100, height: 80 });
    expect(rest.keys()).toEqual(["card", "pin"]);
    expect(readMeasureCache("{}")).toEqual({ reason: "`page` is not a string." });
    expect(
      readMeasureCache(cacheText("abc").replace('"kind":"flow"', '"kind":"floating"')),
    ).toEqual({ reason: 'the box of "card" is not a measured box.' });
  });

  it("refuses a builder scene whose page has no cache or changed, and reads a fresh one", async () => {
    const { page, scene } = brief();
    const missing = lookupCache(scene);
    expect(missing.kind).toBe("refused");
    expect(await loadSceneFile(scene)).toMatchObject({ reason: expect.stringMatching(/measure/) });

    writeFileSync(cachePathOf(page), cacheText(pageDigest(page)));
    expect(lookupCache(scene).kind).toBe("read");
    const module = await loadSceneFile(scene);
    if ("reason" in module) throw new Error(module.reason);
    expect(module.measured?.rest["card"]?.width).toBe(100);

    writeFileSync(page, '<div data-cast="card" class="wide"></div>');
    expect(lookupCache(scene)).toMatchObject({ kind: "refused", message: /changed/ });
    const before = pageDigest(page);
    writeFileSync(join(page, "..", "card.css"), "div { width: 9px }");
    expect(pageDigest(page)).not.toBe(before);
  });

  it("needs no cache for a scene file with no page", () => {
    const { page, scene } = brief();
    rmSync(page);
    expect(lookupCache(scene)).toEqual({ kind: "none" });
  });
});
