import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import { afterAll, describe, expect, it } from "vitest";
import {
  aspectNote,
  comparePage,
  differencePicture,
  meanDifference,
  parseCompareArgs,
  rankMembers,
  sideBySide,
  viewBoxOf,
} from "../src/page/compare";
import { decodePng, encodePng, type Picture } from "../src/page/png";

function solid(width: number, height: number, rgb: readonly [number, number, number]): Picture {
  const data = new Uint8Array(width * height * 3);
  for (let pixel = 0; pixel < width * height; pixel += 1) data.set(rgb, pixel * 3);
  return { width, height, rgb: data };
}

describe("motion:compare pure parts", () => {
  it("takes the mean absolute difference over a box, out of 255 over RGB", () => {
    const a = solid(4, 4, [0, 0, 0]);
    const b = solid(4, 4, [255, 255, 255]);
    expect(meanDifference(a, b)).toBe(255);
    expect(meanDifference(a, a)).toBe(0);
    const wrong = solid(8, 8, [0, 0, 0]);
    for (let y = 0; y < 4; y += 1)
      for (let x = 0; x < 4; x += 1) wrong.rgb.set([90, 0, 0], (y * 8 + x) * 3);
    const black = solid(8, 8, [0, 0, 0]);
    expect(meanDifference(black, wrong, { x: 0, y: 0, width: 3, height: 3 })).toBe(30);
    expect(meanDifference(black, wrong, { x: 5, y: 5, width: 3, height: 3 })).toBe(0);
  });

  it("forgives an edge smoothed or set one pixel off", () => {
    const edge = (at: number) => {
      const picture = solid(8, 4, [0, 0, 0]);
      for (let y = 0; y < 4; y += 1)
        for (let x = at; x < 8; x += 1) picture.rgb.set([255, 255, 255], (y * 8 + x) * 3);
      return picture;
    };
    expect(meanDifference(edge(4), edge(5))).toBe(0);
    expect(meanDifference(edge(4), edge(6))).toBeGreaterThan(0);
  });

  it("finds a one-pixel line missing from either picture", () => {
    const line = solid(6, 6, [238, 238, 238]);
    for (let x = 0; x < 6; x += 1) line.rgb.set([255, 0, 255], (3 * 6 + x) * 3);
    const blank = solid(6, 6, [238, 238, 238]);
    expect(meanDifference(blank, line)).toBeGreaterThan(0);
    expect(meanDifference(line, blank)).toBeGreaterThan(0);
    expect(meanDifference(blank, line, { x: 0, y: 2, width: 6, height: 3 })).toBeGreaterThan(8);
  });

  it("clips a box to the picture and calls an empty one zero", () => {
    const a = solid(4, 4, [0, 0, 0]);
    const b = solid(4, 4, [30, 30, 30]);
    expect(meanDifference(a, b, { x: 2, y: 2, width: 10, height: 10 })).toBe(30);
    expect(meanDifference(a, b, { x: 10, y: 10, width: 3, height: 3 })).toBe(0);
    expect(meanDifference(a, b, { x: -5, y: -5, width: 2, height: 2 })).toBe(0);
  });

  it("refuses pictures of different sizes", () => {
    expect(() => meanDifference(solid(2, 2, [0, 0, 0]), solid(3, 2, [0, 0, 0]))).toThrow(/size/);
  });

  it("sorts members worst first, rounds to 2 decimals and keeps ties by name", () => {
    expect(
      rankMembers([
        { name: "b", mean: 1.004 },
        { name: "a", mean: 1.004 },
        { name: "c", mean: 40.126 },
        { name: "d", mean: 0 },
      ]),
    ).toEqual([
      { name: "c", mean: 40.13 },
      { name: "a", mean: 1 },
      { name: "b", mean: 1 },
      { name: "d", mean: 0 },
    ]);
  });

  it("says so when the viewBox aspect differs from the frame by more than 1 percent", () => {
    expect(aspectNote({ width: 1280, height: 720 }, { width: 1280, height: 720 })).toBeUndefined();
    expect(aspectNote({ width: 1280, height: 721 }, { width: 1280, height: 720 })).toBeUndefined();
    expect(aspectNote({ width: 800, height: 800 }, { width: 1280, height: 720 })).toMatch(
      /aspect 1\.00.*1\.78/,
    );
  });

  it("reads a viewBox, and nothing from an SVG without one", () => {
    expect(viewBoxOf('<svg viewBox="0 0 200 100" xmlns="x"/>')).toEqual({
      width: 200,
      height: 100,
    });
    expect(viewBoxOf("<svg viewBox='10,20,300.5,150'></svg>")).toEqual({
      width: 300.5,
      height: 150,
    });
    expect(viewBoxOf('<svg width="10" height="10"/>')).toBeUndefined();
  });

  it("draws the difference within one pixel as grey, brighter where more different", () => {
    const a = solid(3, 3, [10, 200, 50]);
    const difference = differencePicture(a, solid(3, 3, [70, 110, 50]));
    expect([...difference.rgb.subarray(0, 3)]).toEqual([50, 50, 50]);
    expect([...differencePicture(a, a).rgb].every((value) => value === 0)).toBe(true);
  });

  it("puts two pictures side by side with a gap", () => {
    const both = sideBySide(solid(2, 2, [1, 2, 3]), solid(2, 2, [4, 5, 6]));
    expect(both.height).toBe(2);
    expect(both.width).toBeGreaterThan(4);
    expect([...both.rgb.subarray(0, 3)]).toEqual([1, 2, 3]);
    expect([...both.rgb.subarray((both.width - 1) * 3, both.width * 3)]).toEqual([4, 5, 6]);
  });

  it("encodes a picture as a PNG that reads back the same", () => {
    const picture = solid(5, 3, [0, 0, 0]);
    picture.rgb.set([255, 128, 7], 4 * 3);
    picture.rgb.set([9, 8, 7], 7 * 3);
    const back = decodePng(encodePng(picture));
    expect(back.width).toBe(5);
    expect(back.height).toBe(3);
    expect([...back.rgb]).toEqual([...picture.rgb]);
  });

  it("reads its arguments and refuses bad ones", () => {
    expect(parseCompareArgs(["stage.html?piece=a", "--reference", "a.svg"])).toMatchObject({
      kind: "compare",
      page: "stage.html?piece=a",
      at: 0,
    });
    expect(parseCompareArgs(["a.html", "--reference", "a.svg", "--at", "500"])).toMatchObject({
      at: 500,
    });
    expect(parseCompareArgs(["a.html"]).kind).toBe("usage");
    expect(parseCompareArgs(["a.html", "--reference", "a.svg", "--at", "-1"]).kind).toBe("usage");
    expect(parseCompareArgs(["a.html", "--reference", "a.svg", "--at", "1,2"]).kind).toBe("usage");
    expect(parseCompareArgs(["a.html", "--reference"]).kind).toBe("usage");
  });
});

const fixtures = fileURLToPath(new URL("./fixtures/compare/", import.meta.url));
const source = { kind: "serve", root: fixtures } as const;
const dirs: string[] = [];

async function browserAvailable(): Promise<boolean> {
  for (const channel of ["chrome", "msedge", undefined]) {
    try {
      const browser = await chromium.launch(channel === undefined ? {} : { channel });
      await browser.close();
      return true;
    } catch {
      // Try the next browser.
    }
  }
  return false;
}

const hasBrowser = await browserAvailable();

afterAll(() => {
  for (const dir of dirs) rmSync(dir, { recursive: true, force: true });
});

describe.skipIf(!hasBrowser)("motion:compare in the browser", () => {
  const out = () => {
    const dir = mkdtempSync(join(tmpdir(), "compare-test-"));
    dirs.push(dir);
    return dir;
  };

  it("puts the member drawn another colour first and the rest near zero", async () => {
    const dir = out();
    const result = await comparePage({
      page: "stage.html",
      width: 640,
      height: 360,
      source,
      at: 0,
      reference: join(fixtures, "blue-wrong.svg"),
      out: dir,
    });
    if (result.kind !== "compared") throw new Error(result.message);
    expect(result.out).toBe(dir);
    expect(result.members.map((member) => member.name)).toEqual(
      expect.arrayContaining(["red", "green", "blue"]),
    );
    expect(result.members[0]?.name).toBe("blue");
    expect(result.members[0]?.mean).toBeGreaterThan(50);
    for (const member of result.members.slice(1)) expect(member.mean).toBeLessThan(1);
    expect(result.mean).toBeGreaterThan(1);
    expect(result.notes).toEqual([]);
    for (const name of ["piece.png", "reference.png", "side-by-side.png", "difference.png"])
      expect(readFileSync(join(dir, name)).length).toBeGreaterThan(0);
    const piece = decodePng(readFileSync(join(dir, "piece.png")));
    expect([piece.width, piece.height]).toEqual([200, 100]);
  }, 60000);

  it("scores a faithful reference near zero everywhere", async () => {
    const result = await comparePage({
      page: "stage.html",
      width: 640,
      height: 360,
      source,
      at: 0,
      reference: join(fixtures, "same.svg"),
      out: out(),
    });
    if (result.kind !== "compared") throw new Error(result.message);
    expect(result.mean).toBeLessThan(1);
    for (const member of result.members) expect(member.mean).toBeLessThan(1);
  }, 60000);

  it("answers usage for a reference that is missing or not an SVG", async () => {
    const missing = await comparePage({
      page: "stage.html",
      width: 640,
      height: 360,
      source,
      at: 0,
      reference: join(fixtures, "nothing.svg"),
    });
    expect(missing.kind).toBe("usage");
    const notSvg = await comparePage({
      page: "stage.html",
      width: 640,
      height: 360,
      source,
      at: 0,
      reference: join(fixtures, "stage.html"),
    });
    expect(notSvg.kind).toBe("usage");
  }, 60000);

  it("answers usage for a page with no stage frame", async () => {
    const result = await comparePage({
      page: "missing.html",
      width: 640,
      height: 360,
      source,
      at: 0,
      reference: join(fixtures, "same.svg"),
    });
    expect(result.kind).toBe("usage");
  }, 60000);
});
