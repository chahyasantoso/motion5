import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { afterAll, describe, expect, it } from "vitest";
import type { Cubic2d } from "@gerak/moves";
import { readStageModule, type StageModule } from "@gerak/stage";
import { importSvg, importSvgInto, type ImportResult } from "../src/scene/import-svg";
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

async function bring(svg: string, name: string, margin?: number): Promise<Imported> {
  const root = mkdtempSync(join(tmpdir(), "import-svg-test-"));
  folders.push(root);
  const result = await importSvg(svg, name, root, margin === undefined ? {} : { margin });
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

  it("leaves a margin round the drawing, the frame grown and every point moved in by it", async () => {
    const plain = await bring(join(fixtures, "svg-transforms.svg"), "fixture");
    const roomy = await bring(join(fixtures, "svg-transforms.svg"), "fixture", 40);
    expect(roomy.result.frame).toEqual({ width: 280, height: 200 });
    const [first] = cubicsOf(plain, "tile");
    const [moved] = cubicsOf(roomy, "tile");
    expect(moved?.x0).toBeCloseTo((first?.x0 ?? Number.NaN) + 40, 6);
    expect(moved?.y0).toBeCloseTo((first?.y0 ?? Number.NaN) + 40, 6);
  }, 60000);
});

describe("motion:import-svg outlines to morph to", () => {
  it("makes <part>-shape<N> the Nth of its part's shapes, and lists what it cannot", async () => {
    const imported = await bring(join(fixtures, "svg-shapes.svg"), "fixture");
    expect(imported.result.members).toEqual(["beak", "lid", "eye"]);
    const beak = stageOf(imported.module).cast["beak"];
    if (beak === undefined || beak.kind !== "actor") throw new Error("no beak");
    const tips = (beak.shapes ?? []).map((outline) =>
      Math.max(...along(outline).map(([, y]) => y)),
    );
    expect(tips).toEqual([expect.closeTo(45, 3), expect.closeTo(60, 3)]);
    for (const name of ["lid", "eye"]) {
      const member = stageOf(imported.module).cast[name];
      expect(member?.kind === "actor" ? member.shapes : "missing").toBeUndefined();
    }
    const reasons = imported.result.leftOut.map(({ reason }) => reason).join("\n");
    expect(reasons).toMatch(/the shapes of "lid" must be numbered 1, 2, 3 in turn/);
    expect(reasons).toMatch(/"eye" cannot morph: its outlines have different numbers of pieces/);
    expect(reasons).toMatch(/an outline of "ghost", which no part is named/);
  }, 60000);
});

describe("motion:import-svg use of a symbol", () => {
  const extent = (imported: Imported, name: string) => {
    const points = along(cubicsOf(imported, name));
    const xs = points.map(([x]) => x);
    const ys = points.map(([, y]) => y);
    return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
  };
  const near = (corners: readonly number[]) => corners.map((value) => expect.closeTo(value, 3));

  it("places each use's copy of the symbol by its box, viewBox and preserveAspectRatio", async () => {
    const imported = await bring(join(fixtures, "svg-symbol.svg"), "fixture");
    expect(imported.result.members).toEqual(["part1", "part2", "part3", "part4"]);
    expect(imported.result.leftOut).toHaveLength(1);
    expect(JSON.stringify(imported.result.leftOut)).toMatch(/slices into its box/);
    // A 10x10 view in a 40x40 box at (20, 10) scales by 4: the 10x5 rect is 40x20.
    expect(extent(imported, "part1")).toEqual(near([20, 10, 60, 30]));
    // A 50x20 box meets at scale 2, centred across: x shifts by 15.
    expect(extent(imported, "part2")).toEqual(near([115, 10, 135, 20]));
    // preserveAspectRatio none stretches by 5 across and 3 down.
    expect(extent(imported, "part3")).toEqual(near([10, 60, 60, 75]));
    // A 40x20 box sliced at scale 4 and aligned to its bottom left lifts the rect by the 20 it overflows.
    expect(extent(imported, "part4")).toEqual(near([120, 40, 160, 60]));
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

  it("says when a translucent group's opacity goes on more than one part", async () => {
    const imported = await bring(join(fixtures, "svg-opacity.svg"), "fixture");
    const groups = imported.result.leftOut.filter(({ reason }) =>
      reason.startsWith("group opacity"),
    );
    expect(groups.map(({ element }) => element)).toEqual(["g#pair"]);
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

describe("motion:import-svg --into a piece", () => {
  const frameOf = (width: number, height: number): string =>
    `{ width: ${width}, height: ${height} }`;

  function scratch(frame = frameOf(300, 200)): string {
    const root = mkdtempSync(join(tmpdir(), "import-svg-into-"));
    folders.push(root);
    mkdirSync(join(root, "src"));
    writeFileSync(
      join(root, "src", "scratch.ts"),
      `import { actor, story } from "@gerak/stage";

export const brief = "scratch";

export const beats = story(1000, { show: [0, 1000] });

export const frame = ${frame};

export const cast = {
  "base": actor({ still: true, path: [{ id: "c0", x0: 1, y0: 1, x1: 2, y1: 2, x2: 3, y2: 3, x3: 4, y3: 4 }] }),
} as const;

export const skins = {
  dom: {
    css: \`
[data-cast="base"] { z-index: 1; }
[data-path="base"] { fill: url(#keep); stroke: none; }
\`,
    defs: \`<linearGradient id="keep"><stop offset="0" stop-color="#000"/></linearGradient>\`,
  },
};

export const scene = (_time: unknown) => ({});
`,
    );
    return root;
  }

  async function into(
    root: string,
    svg: string,
    options: { at?: { x: number; y: number }; scale?: number; prefix: string },
  ): Promise<ImportResult> {
    return importSvgInto(svg, "scratch", root, { at: options.at ?? { x: 0, y: 0 }, ...options });
  }

  async function read(root: string): Promise<Imported> {
    const file = join(root, "src", "scratch.ts");
    const module: Record<string, unknown> = await import(pathToFileURL(file).href);
    const stage = stageOf(module);
    return {
      result: {
        kind: "written",
        file,
        members: [],
        defs: 0,
        frame: { width: 0, height: 0 },
        leftOut: [],
        outside: [],
      },
      module,
      css: stage.skins.dom?.css ?? "",
      defs: stage.skins.dom?.defs ?? "",
    };
  }

  it("moves and scales points and stroke widths, and keeps what the piece had", async () => {
    const root = scratch();
    const before = readFileSync(join(root, "src", "scratch.ts"), "utf8");
    const result = await into(root, join(fixtures, "svg-strokes.svg"), {
      at: { x: 10, y: 20 },
      scale: 1.5,
      prefix: "art",
    });
    if (result.kind !== "written") throw new Error(result.message);
    expect(result.members).toEqual(["artEven", "artUneven"]);
    expect(result.frame).toEqual({ width: 300, height: 200 });
    expect(result.outside).toEqual([]);
    const imported = await read(root);
    // The drawing's (5, 5) is at (10 + 10 * 1.5, 20 + 10 * 1.5) and its (40, 40) at (130, 140).
    const even = cubicsOf(imported, "artEven");
    expect([even[0]?.x0, even[0]?.y0]).toEqual([25, 35]);
    expect([even.at(-1)?.x3, even.at(-1)?.y3]).toEqual([130, 140]);
    expect(imported.css).toContain(
      '[data-path="artEven"] { fill: none; stroke: #000000; stroke-width: 9; }',
    );
    const after = readFileSync(join(root, "src", "scratch.ts"), "utf8");
    expect(after.startsWith(before.slice(0, before.indexOf("} as const;")))).toBe(true);
    expect(after).toContain('[data-path="base"] { fill: url(#keep); stroke: none; }');
    expect(after).toContain(
      '<linearGradient id="keep"><stop offset="0" stop-color="#000"/></linearGradient>',
    );
    expect(cubicsOf(imported, "base")).toHaveLength(1);
  }, 60000);

  it("keeps two imports of one drawing apart by their prefixes", async () => {
    const root = scratch();
    for (const prefix of ["one", "two"]) {
      const result = await into(root, join(fixtures, "svg-paint.svg"), { prefix });
      expect(result.kind).toBe("written");
    }
    const imported = await read(root);
    expect(Object.keys(stageOf(imported.module).cast).sort()).toEqual(
      ["base", "oneStrip", "onePlain", "oneSun", "twoStrip", "twoPlain", "twoSun"].sort(),
    );
    const ids = [...imported.defs.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(expect.arrayContaining(["one-glow", "two-glow", "one-ramp", "two-ramp"]));
    const used = [...imported.css.matchAll(/url\(#([^)]+)\)/g)].map((match) => match[1]);
    expect(used).toEqual(expect.arrayContaining(["one-glow", "two-glow", "keep"]));
    for (const id of used) expect(ids.filter((known) => known === id)).toHaveLength(1);
    expect(imported.defs).not.toContain('id="glow"');
    const layer = (name: string) =>
      Number(new RegExp(`\\[data-cast="${name}"\\] \\{ z-index: (\\d+)`).exec(imported.css)?.[1]);
    const oneTop = Math.max(...["oneStrip", "onePlain", "oneSun"].map(layer));
    for (const name of ["twoStrip", "twoPlain", "twoSun"])
      expect(layer(name)).toBeGreaterThan(oneTop);
  }, 60000);

  it("refuses a clash of names, naming the member, and leaves the file as it was", async () => {
    const root = scratch();
    const svg = join(fixtures, "svg-strokes.svg");
    expect((await into(root, svg, { prefix: "art" })).kind).toBe("written");
    const before = readFileSync(join(root, "src", "scratch.ts"), "utf8");
    expect(await into(root, svg, { prefix: "art" })).toEqual({
      kind: "refused",
      message: expect.stringContaining('"artEven"'),
    });
    expect(readFileSync(join(root, "src", "scratch.ts"), "utf8")).toBe(before);
    const missing = await importSvgInto(svg, "nothing", root, {
      at: { x: 0, y: 0 },
      prefix: "art",
    });
    expect(missing.kind).toBe("refused");
  }, 60000);

  it("lists a part that falls partly outside the piece's frame", async () => {
    const root = scratch(frameOf(140, 150));
    const result = await into(root, join(fixtures, "svg-strokes.svg"), {
      at: { x: 10, y: 20 },
      scale: 1.5,
      prefix: "art",
    });
    if (result.kind !== "written") throw new Error(result.message);
    expect(result.outside).toEqual(["artUneven"]);
    expect(result.frame).toEqual({ width: 140, height: 150 });
  }, 60000);

  it("refuses a scale that is not above 0 and a prefix that is not a word", async () => {
    const root = scratch();
    const svg = join(fixtures, "svg-strokes.svg");
    expect((await into(root, svg, { scale: 0, prefix: "art" })).kind).toBe("refused");
    expect((await into(root, svg, { prefix: "Art" })).kind).toBe("refused");
  }, 60000);
});
