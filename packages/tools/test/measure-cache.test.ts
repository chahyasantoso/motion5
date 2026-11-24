import { mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  castFilePathOf,
  formatCastModule,
  readCastFileObjects,
  scanHtmlCasts,
  syncHtmlCastFile,
} from "../src/page/cast-file";
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
    expect(rest.object("jar")).toBeUndefined();
    expect(readMeasureCache("{}")).toEqual({ reason: "`page` is not a string." });
    expect(
      readMeasureCache(cacheText("abc").replace('"kind":"flow"', '"kind":"floating"')),
    ).toEqual({ reason: 'the box of "card" is not a measured box.' });

    const withObjects = readMeasureCache(
      JSON.stringify({
        ...JSON.parse(cacheText("abc")),
        objects: { jar: { width: 1.2, height: 1.5, depth: 1.2 } },
      }),
    );
    if ("reason" in withObjects) throw new Error(withObjects.reason);
    expect(withObjects.objects).toEqual({ jar: { width: 1.2, height: 1.5, depth: 1.2 } });
    expect(restOfCache(withObjects).object("jar")).toEqual({ width: 1.2, height: 1.5, depth: 1.2 });

    expect(
      readMeasureCache(
        JSON.stringify({
          ...JSON.parse(cacheText("abc")),
          objects: { jar: { width: -1, height: 1, depth: 1 } },
        }),
      ),
    ).toEqual({ reason: 'the bounds of object "jar" are not a measured 3D box.' });

    const withCounts = readMeasureCache(
      JSON.stringify({
        ...JSON.parse(cacheText("abc")),
        counts: { crumbs: 12 },
      }),
    );
    if ("reason" in withCounts) throw new Error(withCounts.reason);
    expect(withCounts.counts).toEqual({ crumbs: 12 });

    expect(
      readMeasureCache(
        JSON.stringify({
          ...JSON.parse(cacheText("abc")),
          counts: { crumbs: -1 },
        }),
      ),
    ).toEqual({ reason: 'the part count of "crumbs" must be a non-negative integer.' });
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

  it("scans HTML casts, formats deterministic <name>.cast.ts modules, and syncs preserving objects", () => {
    expect(castFilePathOf(join("p", "card", "card.html"))).toBe(join("p", "card", "card.cast.ts"));
    expect(
      scanHtmlCasts(
        [
          '<!-- <div data-cast="commented"></div> -->',
          '<style>[data-cast="styled"] { color: red; }</style>',
          "<script>const x = '<div data-cast=\"scripted\"></div>';</script>",
          '<section data-cast="heroStage">',
          '  <article data-cast="cards">1</article>',
          '  <article data-cast="cards">2</article>',
          "  <span data-cast='singleNote'>ok</span>",
          '  <i data-cast=""></i>',
          "</section>",
        ].join("\n"),
      ),
    ).toEqual({
      heroStage: "single",
      cards: "list",
      singleNote: "single",
    });

    expect(formatCastModule({ dom: {}, objects: {} })).toBe(
      [
        "export const cast = {} as const;",
        "",
        "export type DomCast = never;",
        "export type ObjectCast = never;",
        "export type CastName = DomCast | ObjectCast;",
        "",
      ].join("\n"),
    );

    const formatted = formatCastModule({
      dom: { "hero-box": "single", cards: "list", jar: "single" },
      objects: { jar: "list", cookies: "list", lid: "single" },
    });
    expect(formatted).toBe(
      [
        'import { box, object } from "@gerak/stage";',
        "",
        "export const cast = {",
        '  cards: box("cards", { parts: true }),',
        '  cookies: object("cookies", { parts: true }),',
        '  "hero-box": box("hero-box"),',
        '  jar: box("jar"),',
        '  lid: object("lid"),',
        "} as const;",
        "",
        'export type DomCast = "cards" | "hero-box" | "jar";',
        'export type ObjectCast = "cookies" | "lid";',
        "export type CastName = DomCast | ObjectCast;",
        "",
      ].join("\n"),
    );
    expect(readCastFileObjects(formatted)).toEqual({
      cookies: "list",
      lid: "single",
    });

    const longDom: Record<string, "single"> = {};
    for (const key of [
      "heroStage",
      "heroHeadline",
      "heroSub",
      "heroCta",
      "spotlightStage",
      "spotlightTints",
      "craftStage",
      "craftCards",
    ])
      longDom[key] = "single";
    expect(formatCastModule({ dom: longDom, objects: {} })).toContain(
      [
        "export type DomCast =",
        '  | "craftCards"',
        '  | "craftStage"',
        '  | "heroCta"',
        '  | "heroHeadline"',
        '  | "heroStage"',
        '  | "heroSub"',
        '  | "spotlightStage"',
        '  | "spotlightTints";',
      ].join("\n"),
    );

    const { page } = brief();
    const castPath = castFilePathOf(page);
    writeFileSync(
      castPath,
      formatCastModule({ dom: { card: "single" }, objects: { jar: "single", crumbs: "list" } }),
    );
    writeFileSync(
      page,
      '<div data-cast="card"></div><span data-cast="dots"></span><span data-cast="dots"></span>',
    );
    expect(syncHtmlCastFile(page)).toBe(castPath);
    const written = readFileSync(castPath, "utf8");
    expect(written).toContain('card: box("card"),');
    expect(written).toContain('dots: box("dots", { parts: true }),');
    expect(written).toContain('jar: object("jar"),');
    expect(written).toContain('crumbs: object("crumbs", { parts: true }),');
    const writtenMtimeMs = statSync(castPath).mtimeMs;
    expect(syncHtmlCastFile(page)).toBe(castPath);
    expect(statSync(castPath).mtimeMs).toBe(writtenMtimeMs);

    // No-op when HTML without casts has no existing .cast.ts.
    const emptyRoot = mkdtempSync(join(tmpdir(), "cast-empty-"));
    made.push(emptyRoot);
    const plainHtml = join(emptyRoot, "plain.html");
    writeFileSync(plainHtml, "<div>Nothing</div>");
    expect(syncHtmlCastFile(plainHtml)).toBeUndefined();
  });
});
