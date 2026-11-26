import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { inflateSync } from "node:zlib";
import { afterEach, describe, expect, it } from "vitest";
import { captureFrame, withPage } from "../src/page/page";
import { removeTemp } from "../../../test/support/temp";

const DIRS: string[] = [];

function tempSite(): string {
  const dir = mkdtempSync(join(tmpdir(), "gerak-capture-frame-"));
  DIRS.push(dir);
  return dir;
}

function decodeRgbaPng(bytes: Uint8Array): {
  readonly width: number;
  readonly height: number;
  readonly rgba: Uint8Array;
} {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let width = 0;
  let height = 0;
  let channels = 0;
  const parts: Uint8Array[] = [];
  let offset = 8;
  while (offset + 8 <= bytes.length) {
    const length = view.getUint32(offset);
    const type = String.fromCharCode(...bytes.subarray(offset + 4, offset + 8));
    const body = bytes.subarray(offset + 8, offset + 8 + length);
    if (type === "IHDR") {
      const ihdr = new DataView(body.buffer, body.byteOffset, body.byteLength);
      width = ihdr.getUint32(0);
      height = ihdr.getUint32(4);
      channels = body[9] === 6 ? 4 : 3;
    } else if (type === "IDAT") {
      parts.push(body);
    } else if (type === "IEND") {
      break;
    }
    offset += 12 + length;
  }
  const raw = inflateSync(Buffer.concat(parts));
  const stride = width * channels;
  const rows = new Uint8Array(stride * height);
  for (let y = 0; y < height; y += 1) {
    const filter = raw[y * (stride + 1)];
    const source = y * (stride + 1) + 1;
    const row = y * stride;
    for (let x = 0; x < stride; x += 1) {
      const left = x >= channels ? (rows[row + x - channels] ?? 0) : 0;
      const up = y > 0 ? (rows[row - stride + x] ?? 0) : 0;
      const upLeft = y > 0 && x >= channels ? (rows[row - stride + x - channels] ?? 0) : 0;
      let predicted = 0;
      if (filter === 1) predicted = left;
      else if (filter === 2) predicted = up;
      else if (filter === 3) predicted = (left + up) >> 1;
      else if (filter === 4) {
        const est = left + up - upLeft;
        const dl = Math.abs(est - left);
        const du = Math.abs(est - up);
        const dul = Math.abs(est - upLeft);
        predicted = dl <= du && dl <= dul ? left : du <= dul ? up : upLeft;
      }
      rows[row + x] = ((raw[source + x] ?? 0) + predicted) & 0xff;
    }
  }
  if (channels === 4) return { width, height, rgba: rows };
  const rgba = new Uint8Array(width * height * 4);
  for (let i = 0; i < width * height; i += 1) {
    rgba[i * 4] = rows[i * 3] ?? 0;
    rgba[i * 4 + 1] = rows[i * 3 + 1] ?? 0;
    rgba[i * 4 + 2] = rows[i * 3 + 2] ?? 0;
    rgba[i * 4 + 3] = 255;
  }
  return { width, height, rgba };
}

afterEach(() => {
  for (const dir of DIRS.splice(0)) {
    removeTemp(dir);
  }
});

describe("captureFrame in browser", () => {
  it("returns a PNG whose decoded RGBA pixels match page.screenshot()", async () => {
    const dir = tempSite();
    writeFileSync(
      join(dir, "sample.html"),
      `<!doctype html>
<html>
  <body style="margin:0;width:200px;height:160px;background:linear-gradient(135deg,#123456,#abcdef)">
    <div style="position:absolute;left:24px;top:24px;width:80px;height:60px;background:#ff5533;border-radius:12px"></div>
    <p style="position:absolute;left:24px;top:100px;margin:0;color:#fff;font:700 20px sans-serif">HELLO</p>
  </body>
</html>`,
    );

    const { value, pageErrors } = await withPage(
      { page: "sample.html", width: 200, height: 160, source: { kind: "serve", root: dir } },
      async ({ page, advanceTo }) => {
        await advanceTo(0);
        const expected = decodeRgbaPng(await page.screenshot());
        const actual = decodeRgbaPng(await captureFrame(page));
        return { expected, actual };
      },
    );

    expect(pageErrors).toEqual([]);
    expect(value.actual.width).toBe(value.expected.width);
    expect(value.actual.height).toBe(value.expected.height);
    expect(Buffer.from(value.actual.rgba).equals(Buffer.from(value.expected.rgba))).toBe(true);
  }, 60_000);
});
