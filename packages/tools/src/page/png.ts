import { deflateSync, inflateSync } from "node:zlib";

/** A decoded picture: `width`, `height` and `rgb`, three bytes per pixel row by row (alpha dropped). */
export interface Picture {
  readonly width: number;
  readonly height: number;
  readonly rgb: Uint8Array;
}

const SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const COLOUR_RGB = 2;
const COLOUR_RGBA = 6;

function paeth(left: number, up: number, upLeft: number): number {
  const estimate = left + up - upLeft;
  const dLeft = Math.abs(estimate - left);
  const dUp = Math.abs(estimate - up);
  const dUpLeft = Math.abs(estimate - upLeft);
  if (dLeft <= dUp && dLeft <= dUpLeft) return left;
  return dUp <= dUpLeft ? up : upLeft;
}

/** Reads an 8-bit RGB or RGBA, non-interlaced PNG; any other kind throws an error saying what it is. */
export function decodePng(bytes: Uint8Array): Picture {
  if (bytes.length < 8 || SIGNATURE.some((value, index) => bytes[index] !== value))
    throw new Error("Not a PNG: the signature is wrong.");
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let width = 0;
  let height = 0;
  let channels = 0;
  let sawHeader = false;
  let ended = false;
  const parts: Uint8Array[] = [];
  let offset = 8;
  while (offset + 8 <= bytes.length && !ended) {
    const length = view.getUint32(offset);
    const type = String.fromCharCode(...bytes.subarray(offset + 4, offset + 8));
    const body = bytes.subarray(offset + 8, offset + 8 + length);
    if (body.length !== length) throw new Error(`The PNG is cut short in its ${type} chunk.`);
    if (type === "IHDR") {
      const bodyView = new DataView(body.buffer, body.byteOffset, body.byteLength);
      width = bodyView.getUint32(0);
      height = bodyView.getUint32(4);
      const depth = body[8];
      const colour = body[9];
      if (depth !== 8) throw new Error(`Only 8-bit PNGs are read, not ${depth}-bit.`);
      if (colour !== COLOUR_RGB && colour !== COLOUR_RGBA)
        throw new Error(`Only RGB and RGBA PNGs are read, not colour type ${colour}.`);
      if (body[12] !== 0) throw new Error("Interlaced PNGs are not read.");
      channels = colour === COLOUR_RGB ? 3 : 4;
      sawHeader = true;
    } else if (type === "IDAT") parts.push(body);
    else if (type === "IEND") ended = true;
    offset += 12 + length;
  }
  if (!sawHeader) throw new Error("The PNG has no IHDR chunk.");
  if (!ended) throw new Error("The PNG has no IEND chunk.");
  const raw = inflateSync(Buffer.concat(parts));
  const stride = width * channels;
  if (raw.length !== (stride + 1) * height)
    throw new Error("The PNG's pixel data is not the size its header gives.");
  const rows = new Uint8Array(stride * height);
  for (let y = 0; y < height; y += 1) {
    const filter = raw[y * (stride + 1)];
    const source = y * (stride + 1) + 1;
    const row = y * stride;
    for (let x = 0; x < stride; x += 1) {
      const value = raw[source + x] ?? 0;
      const left = x >= channels ? (rows[row + x - channels] ?? 0) : 0;
      const up = y > 0 ? (rows[row - stride + x] ?? 0) : 0;
      const upLeft = y > 0 && x >= channels ? (rows[row - stride + x - channels] ?? 0) : 0;
      let predicted: number;
      switch (filter) {
        case 0:
          predicted = 0;
          break;
        case 1:
          predicted = left;
          break;
        case 2:
          predicted = up;
          break;
        case 3:
          predicted = (left + up) >> 1;
          break;
        case 4:
          predicted = paeth(left, up, upLeft);
          break;
        default:
          throw new Error(`The PNG uses an unknown filter type ${filter}.`);
      }
      rows[row + x] = (value + predicted) & 0xff;
    }
  }
  if (channels === 3) return { width, height, rgb: rows };
  const rgb = new Uint8Array(width * height * 3);
  for (let pixel = 0; pixel < width * height; pixel += 1)
    for (let c = 0; c < 3; c += 1) rgb[pixel * 3 + c] = rows[pixel * 4 + c] ?? 0;
  return { width, height, rgb };
}

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (const byte of bytes) c = (CRC_TABLE[(c ^ byte) & 0xff] ?? 0) ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type: string, body: Uint8Array): Buffer {
  const out = Buffer.alloc(12 + body.length);
  out.writeUInt32BE(body.length, 0);
  out.write(type, 4, "latin1");
  out.set(body, 8);
  out.writeUInt32BE(crc32(out.subarray(4, 8 + body.length)), 8 + body.length);
  return out;
}

/** Writes a picture as an 8-bit RGB, non-interlaced PNG that `decodePng` and any viewer read back. */
export function encodePng(picture: Picture): Uint8Array {
  const { width, height, rgb } = picture;
  const stride = width * 3;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y += 1)
    raw.set(rgb.subarray(y * stride, (y + 1) * stride), y * (stride + 1) + 1);
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = COLOUR_RGB;
  return Buffer.concat([
    Buffer.from(SIGNATURE),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", new Uint8Array(0)),
  ]);
}
