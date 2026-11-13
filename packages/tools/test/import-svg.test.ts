import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { afterAll, describe, expect, it } from "vitest";
import type { Cubic2d } from "@gerak/moves";
import { readStageModule, type StageModule } from "@gerak/stage";
import { importSvg, type ImportResult } from "../src/scene/import-svg";
import { readSceneModule } from "../src/scene/scene";
import { reviewSceneModule } from "../src/scene/review";
import { withPage } from "../src/page/page";

const fixtures = join(import.meta.dirname, "fixtures");
const folders: string[] = [];
afterAll(() => {
  for (const folder of folders) rmSync(folder, { recursive: true, force: true });
});

interface Imported {
  readonly result: Extract<ImportResult, { kind: "written" }>;
  readonly module: Record<string, unknown>;
  readonly css: string;
  readonly defs: string;
}

function stageOf(module: unknown): StageModule {
  const read = readStageModule(module);
  if ("reason" in read) throw new Error(read.reason);
  return read;
}

async function bring(svg: string, name: string): Promise<Imported> {
  const root = mkdtempSync(join(tmpdir(), "import-svg-test-"));
  folders.push(root);
  const result = await importSvg(svg, name, root);
  if (result.kind !== "written") throw new Error(result.message);
  const module: Record<string, unknown> = await import(pathToFileURL(result.file).href);
  const stage = stageOf(module);
  return { result, module, css: stage.skins.dom?.css ?? "", defs: stage.skins.dom?.defs ?? "" };
}

function cubicsOf(imported: Imported, name: string): readonly Cubic2d[] {
  const found = stageOf(imported.module).cast[name];
  if (found === undefined || found.kind !== "actor" || typeof found.path === "function")
    throw new Error(`no path member ${name}`);
  return found.path ?? [];
}

type Point = readonly [number, number];

function along(cubics: readonly Cubic2d[]): Point[] {
  const points: Point[] = [];
  for (const c of cubics)
    for (let step = 0; step <= 40; step += 1) {
      const t = step / 40;
      const u = 1 - t;
      points.push([
        u ** 3 * c.x0 + 3 * u * u * t * c.x1 + 3 * u * t * t * c.x2 + t ** 3 * c.x3,
        u ** 3 * c.y0 + 3 * u * u * t * c.y1 + 3 * u * t * t * c.y2 + t ** 3 * c.y3,
      ]);
    }
  return points;
}

function distanceToLine(point: Point, line: readonly Point[]): number {
  let best = Infinity;
  for (let at = 1; at < line.length; at += 1) {
    const [ax, ay] = line[at - 1] ?? [0, 0];
    const [bx, by] = line[at] ?? [0, 0];
    const dx = bx - ax;
    const dy = by - ay;
    const length = dx * dx + dy * dy;
    const t =
      length === 0
        ? 0
        : Math.max(0, Math.min(1, ((point[0] - ax) * dx + (point[1] - ay) * dy) / length));
    best = Math.min(best, Math.hypot(point[0] - (ax + t * dx), point[1] - (ay + t * dy)));
  }
  return best;
}

/** Each shape's outline as the browser draws it, by id, in px of an SVG shown at its own size. */
async function browserOutlines(folder: string, file: string): Promise<Record<string, Point[]>> {
  const { value } = await withPage(
    { page: file, width: 400, height: 300, source: { kind: "serve", root: folder } },
    ({ page }) =>
      page.evaluate(() => {
        const found: Record<string, [number, number][]> = {};
        for (const element of document.querySelectorAll(
          "path, rect, circle, ellipse, polygon, polyline, line",
        )) {
          if (!(element instanceof SVGGeometryElement)) continue;
          const matrix = element.getScreenCTM();
          if (matrix === null) continue;
          const total = element.getTotalLength();
          const points: [number, number][] = [];
          for (let step = 0; step <= 400; step += 1) {
            const point = element.getPointAtLength((total * step) / 400);
            points.push([
              matrix.a * point.x + matrix.c * point.y + matrix.e,
              matrix.b * point.x + matrix.d * point.y + matrix.f,
            ]);
          }
          found[element.id] = points;
        }
        return found;
      }),
  );
  return value;
}

describe("motion:import-svg geometry", () => {
  for (const [file, ids] of [
    ["svg-transforms.svg", ["tile", "dot"]],
    ["svg-paths.svg", ["curve", "arcs", "tri", "zig", "bar", "ring"]],
    ["svg-strokes.svg", ["even", "uneven"]],
  ] as const) {
    it(`draws ${file} where the browser does, within half a pixel`, async () => {
      const imported = await bring(join(fixtures, file), "fixture");
      expect(imported.result.members).toEqual([...ids]);
      const browser = await browserOutlines(fixtures, file);
      for (const id of ids) {
        const mine = along(cubicsOf(imported, id));
        const theirs = browser[id] ?? [];
        expect(theirs.length).toBeGreaterThan(0);
        for (const point of theirs) expect(distanceToLine(point, mine)).toBeLessThan(0.5);
        for (const point of mine) expect(distanceToLine(point, theirs)).toBeLessThan(0.5);
      }
    }, 60000);
  }

  it("writes a module the stage reader accepts and the scene review finds nothing in", async () => {
    for (const file of [
      "svg-transforms.svg",
      "svg-paths.svg",
      "svg-strokes.svg",
      "svg-paint.svg",
    ]) {
      const imported = await bring(join(fixtures, file), "fixture");
      const read = readSceneModule(imported.module);
      if ("reason" in read) throw new Error(read.reason);
      expect(
        reviewSceneModule(read, { hold: 500, jump: 150, turn: 150, ratio: 1.5 }).findings,
      ).toEqual([]);
    }
  }, 60000);

  it("keeps parts flat in paint order, as the id and the module's frame say", async () => {
    const imported = await bring(join(fixtures, "svg-transforms.svg"), "fixture");
    expect(imported.result.frame).toEqual({ width: 200, height: 120 });
    expect(imported.module["frame"]).toEqual({ width: 200, height: 120 });
    expect(imported.module["brief"]).toBe("fixture");
    expect(imported.css).toContain('[data-cast="tile"] { z-index: 1; }');
    expect(imported.css).toContain('[data-cast="dot"] { z-index: 2; }');
    expect(imported.css).toContain(
      '[data-path="tile"] { fill: #336699; stroke: #112233; stroke-width: 3; }',
    );
    expect(imported.css).toContain('[data-path="dot"] { fill: #aa3322; stroke: none; }');
  }, 60000);
});

describe("motion:import-svg strokes", () => {
  it("scales a stroke under a uniform scale and lists one under an uneven scale", async () => {
    const imported = await bring(join(fixtures, "svg-strokes.svg"), "fixture");
    expect(imported.css).toContain(
      '[data-path="even"] { fill: none; stroke: #000000; stroke-width: 6; }',
    );
    expect(imported.css).toMatch(/\[data-path="uneven"\] \{[^}]*stroke-width: 4\.2426;/);
    expect(imported.result.leftOut).toEqual([
      { element: "path#uneven", reason: "stroke scaled unevenly" },
    ]);
  }, 60000);
});

describe("motion:import-svg paint", () => {
  it("puts gradients in the defs in frame px and lists what it cannot carry", async () => {
    const imported = await bring(join(fixtures, "svg-paint.svg"), "fixture");
    expect(imported.result.defs).toBe(2);
    expect(imported.css).toContain('[data-path="sun"] { fill: url(#glow); stroke: none; }');
    // The group's translate(10 10) is baked in after the gradient's own matrix(2 0 0 1 5 0).
    expect(imported.defs).toContain(
      '<radialGradient id="glow" gradientUnits="userSpaceOnUse" cx="20" cy="20" r="10" gradientTransform="matrix(2 0 0 1 15 10)">',
    );
    expect(imported.defs).toContain('<stop offset="0" stop-color="#ffff00"/>');
    // A bounding-box gradient becomes user-space through the shape's box, with its href chain's stops.
    expect(imported.defs).toContain(
      '<linearGradient id="ramp" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1" y2="0" gradientTransform="matrix(40 0 0 20 50 60)">',
    );
    expect(imported.defs).toContain('<stop offset="1" stop-color="#ffffff"/></linearGradient>');
    expect(imported.result.leftOut).toEqual(
      expect.arrayContaining([
        { element: "text#label", reason: "text is not carried" },
        { element: "foreignObject#private", reason: "foreignObject is not carried" },
      ]),
    );
    expect(imported.result.members).toEqual(["sun", "strip", "plain"]);
  }, 60000);
});

describe("motion:import-svg on the penguin", () => {
  it("writes its 21 paths with their gradients and lists the Illustrator foreignObject", async () => {
    const imported = await bring(
      join(import.meta.dirname, "../../../apps/pieces/references/penguin.svg"),
      "penguin",
    );
    expect(imported.result.members).toHaveLength(21);
    expect(imported.result.defs).toBeGreaterThan(0);
    expect(imported.result.frame.width).toBeCloseTo(454.57, 2);
    expect(imported.result.frame.height).toBeCloseTo(455.39, 2);
    expect(imported.result.leftOut.map(({ element }) => element)).toContain(
      "foreignObject#foreignObject5",
    );
    const source = readFileSync(imported.result.file, "utf8");
    for (const name of imported.result.members) {
      expect(source.match(new RegExp(`"${name}"`, "g"))?.length).toBe(3);
    }
    const read = readSceneModule(imported.module);
    if ("reason" in read) throw new Error(read.reason);
    expect(
      reviewSceneModule(read, { hold: 500, jump: 150, turn: 150, ratio: 1.5 }).findings,
    ).toEqual([]);
  }, 120000);

  it("refuses to overwrite a module without force", async () => {
    const root = mkdtempSync(join(tmpdir(), "import-svg-test-"));
    folders.push(root);
    const svg = join(fixtures, "svg-strokes.svg");
    expect((await importSvg(svg, "twice", root)).kind).toBe("written");
    expect((await importSvg(svg, "twice", root)).kind).toBe("refused");
    expect((await importSvg(svg, "twice", root, { force: true })).kind).toBe("written");
    expect((await importSvg(svg, "Bad Name", root)).kind).toBe("refused");
  }, 120000);
});
