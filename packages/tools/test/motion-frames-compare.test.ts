import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { deflateSync } from "node:zlib";
import { afterEach, describe, expect, it } from "vitest";
import { compareFrames, comparisonLines, parseFramesArgs } from "../src/page/frames";
import { decodePng } from "../src/page/png";

type Rgb = [number, number, number];

function chunk(type: string, body: Buffer): Buffer {
  const head = Buffer.alloc(8);
  head.writeUInt32BE(body.length, 0);
  head.write(type, 4, "latin1");
  // The reader checks no CRC, so the test writes a zero one.
  return Buffer.concat([head, body, Buffer.alloc(4)]);
}

function guessFor(filter: number, left: number, up: number, upLeft: number): number {
  const estimate = left + up - upLeft;
  const dLeft = Math.abs(estimate - left);
  const dUp = Math.abs(estimate - up);
  const dUpLeft = Math.abs(estimate - upLeft);
  const paeth = dLeft <= dUp && dLeft <= dUpLeft ? left : dUp <= dUpLeft ? up : upLeft;
  return [0, left, up, (left + up) >> 1, paeth][filter] ?? 0;
}

/** A PNG from `pixel(x, y)`, of colour type 2 or 6, with the filter of each row cycling through `filters`. */
function png(
  width: number,
  height: number,
  pixel: (x: number, y: number) => Rgb,
  colour = 2,
  filters: readonly number[] = [0],
  depth = 8,
): Buffer {
  const channels = colour === 6 ? 4 : 3;
  const stride = width * channels;
  const lines: Buffer[] = [];
  let previous = Buffer.alloc(stride);
  for (let y = 0; y < height; y += 1) {
    const filter = filters[y % filters.length] ?? 0;
    const row = Buffer.alloc(stride);
    for (let x = 0; x < width; x += 1) {
      const [r, g, b] = pixel(x, y);
      row.set(channels === 4 ? [r, g, b, 255] : [r, g, b], x * channels);
    }
    const out = Buffer.alloc(stride + 1);
    out[0] = filter;
    for (let i = 0; i < stride; i += 1) {
      const left = i >= channels ? (row[i - channels] ?? 0) : 0;
      const up = previous[i] ?? 0;
      const upLeft = i >= channels ? (previous[i - channels] ?? 0) : 0;
      out[i + 1] = ((row[i] ?? 0) - guessFor(filter, left, up, upLeft)) & 0xff;
    }
    lines.push(out);
    previous = row;
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = depth;
  header[9] = colour;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(Buffer.concat(lines))),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const grey = (): Rgb => [100, 100, 100];
const dirs: string[] = [];

function folder(files: Record<string, Buffer>): string {
  const dir = mkdtempSync(join(tmpdir(), "frames-compare-"));
  dirs.push(dir);
  for (const [name, bytes] of Object.entries(files)) writeFileSync(join(dir, name), bytes);
  return dir;
}

afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe("decodePng", () => {
  it("undoes every filter type, in RGB and RGBA", () => {
    const pixel = (x: number, y: number): Rgb => [
      (x * 37 + y * 11) % 256,
      (x * 5 + y * 91) % 256,
      (x * y * 13) % 256,
    ];
    for (const colour of [2, 6]) {
      const decoded = decodePng(png(7, 6, pixel, colour, [0, 1, 2, 3, 4, 4]));
      expect(decoded.width).toBe(7);
      expect(decoded.height).toBe(6);
      for (let y = 0; y < 6; y += 1)
        for (let x = 0; x < 7; x += 1)
          expect([...decoded.rgb.subarray((y * 7 + x) * 3, (y * 7 + x) * 3 + 3)]).toEqual(
            pixel(x, y),
          );
    }
  });

  it("refuses what it does not read", () => {
    expect(() => decodePng(Buffer.from("not a png at all"))).toThrow(/signature/);
    expect(() => decodePng(png(2, 2, grey, 2, [0], 16))).toThrow(/8-bit/);
    expect(() => decodePng(png(2, 2, grey, 3))).toThrow(/colour type 3/);
  });
});

describe("compareFrames", () => {
  it("reads two identical frames as 0 and 0%", () => {
    const frame = png(4, 4, grey);
    const result = compareFrames(
      folder({ "frame-000100.png": frame }),
      folder({ "frame-000100.png": frame }),
    );
    expect(result.differences).toEqual([{ at: 100, mean: 0, over32: 0 }]);
    expect(comparisonLines(result)).toEqual(["100 ms  mean 0.000  over32 0.00%"]);
  });

  it("gives the mean and share for one changed pixel", () => {
    const changed = (x: number, y: number): Rgb =>
      x === 1 && y === 2 ? [190, 130, 100] : [100, 100, 100];
    const result = compareFrames(
      folder({ "frame-000000.png": png(4, 4, grey) }),
      folder({ "frame-000000.png": png(4, 4, changed, 6) }),
    );
    // One pixel of 16 differs by (90 + 30 + 0) / 3 = 40 on average.
    expect(result.differences[0]?.mean).toBeCloseTo(120 / 3 / 16, 10);
    expect(result.differences[0]?.over32).toBeCloseTo(100 / 16, 10);
  });

  it("names frames of different sizes and frames only one side has", () => {
    const here = folder({
      "frame-000100.png": png(4, 4, grey),
      "frame-000200.png": png(4, 4, grey),
    });
    const there = folder({
      "frame-000100.png": png(5, 4, grey),
      "frame-000300.png": png(4, 4, grey),
    });
    const result = compareFrames(here, there);
    expect(result.differences).toEqual([]);
    expect(comparisonLines(result)).toEqual([
      "frame-000100.png  not compared: 4x4 here, 5x4 there",
      `frame-000200.png  only in ${here}`,
      `frame-000300.png  only in ${there}`,
    ]);
  });
});

describe("parseFramesArgs --compare", () => {
  it("takes two folders alone", () => {
    expect(parseFramesArgs(["--compare", "a", "b"]).kind).toBe("compare");
    expect(parseFramesArgs(["--compare", "a"]).kind).toBe("usage");
    expect(parseFramesArgs(["--compare", "a", "b", "c"]).kind).toBe("usage");
  });

  it("takes one folder beside a page and --at, not --onion", () => {
    expect(parseFramesArgs(["a.html", "--at", "0", "--compare", "old"])).toMatchObject({
      kind: "frames",
      compare: expect.stringMatching(/old$/),
    });
    expect(parseFramesArgs(["a.html", "--at", "0", "--compare"]).kind).toBe("usage");
    const onion = ["a.html", "--onion", ".x", "--from", "0", "--to", "1", "--every", "1"];
    expect(parseFramesArgs([...onion, "--compare", "o"]).kind).toBe("usage");
  });
});
