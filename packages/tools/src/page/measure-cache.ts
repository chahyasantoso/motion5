import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";

/** How the page places a measured box: in flow, fixed to the viewport, or sticky between two scroll offsets. */
export type MeasuredPlacement =
  | { readonly kind: "flow" }
  | { readonly kind: "fixed" }
  | {
      readonly kind: "sticky";
      readonly minY: number;
      readonly maxY: number;
      readonly pinY: number;
    };

/** A rest box in a cache: its centre and size in px, and its placement. */
export interface MeasuredBox {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly placement: MeasuredPlacement;
}

/** Measured local rest dimensions of a 3D object in world units. */
export interface MeasuredObjectBounds {
  readonly width: number;
  readonly height: number;
  readonly depth: number;
}

/** A page's measure cache: the page and its digest when measured, and what its mounts measured. */
export interface MeasureCache {
  readonly page: string;
  /** `pageDigest` of the page when it was measured. */
  readonly digest: string;
  readonly frame: { readonly width: number; readonly height: number };
  readonly rest: Readonly<Record<string, MeasuredBox>>;
  readonly lines: Readonly<Record<string, readonly number[]>>;
  readonly parents: Readonly<Record<string, string>>;
  readonly objects?: Readonly<Record<string, MeasuredObjectBounds>>;
  readonly counts?: Readonly<Record<string, number>>;
}

/** The cache file of a page `<dir>/<name>.html`: `<dir>/<name>.measure.json`. */
export function cachePathOf(page: string): string {
  return join(dirname(page), `${basename(page, ".html")}.measure.json`);
}

/** A digest of the page and every stylesheet beside it: what a measure depends on. */
export function pageDigest(page: string): string {
  const hash = createHash("sha256").update(readFileSync(page));
  const folder = dirname(page);
  for (const name of readdirSync(folder)
    .filter((file) => file.endsWith(".css"))
    .sort())
    hash.update(name).update(readFileSync(join(folder, name)));
  return hash.digest("hex").slice(0, 16);
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function placementFrom(value: unknown): MeasuredPlacement | undefined {
  if (!isRecord(value)) return undefined;
  switch (value["kind"]) {
    case "flow":
      return { kind: "flow" };
    case "fixed":
      return { kind: "fixed" };
    case "sticky": {
      const { minY, maxY, pinY } = value;
      return isNumber(minY) && isNumber(maxY) && isNumber(pinY)
        ? { kind: "sticky", minY, maxY, pinY }
        : undefined;
    }
    default:
      return undefined;
  }
}

function boxFrom(value: unknown): MeasuredBox | undefined {
  if (!isRecord(value)) return undefined;
  const { x, y, width, height } = value;
  const placement = placementFrom(value["placement"]);
  if (!isNumber(x) || !isNumber(y) || !isNumber(width) || !isNumber(height)) return undefined;
  return placement === undefined ? undefined : { x, y, width, height, placement };
}

function objectBoundsFrom(value: unknown): MeasuredObjectBounds | undefined {
  if (!isRecord(value)) return undefined;
  const { width, height, depth } = value;
  if (
    !isNumber(width) ||
    !isNumber(height) ||
    !isNumber(depth) ||
    width < 0 ||
    height < 0 ||
    depth < 0
  )
    return undefined;
  return { width, height, depth };
}

/** The cache a file's text holds, or why it is not one. */
export function readMeasureCache(text: string): MeasureCache | { readonly reason: string } {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch (error) {
    return { reason: `not JSON: ${String(error)}` };
  }
  if (!isRecord(raw)) return { reason: "not an object." };
  const { page, digest, frame, rest, lines, parents } = raw;
  if (typeof page !== "string") return { reason: "`page` is not a string." };
  if (typeof digest !== "string") return { reason: "`digest` is not a string." };
  if (!isRecord(frame) || !isNumber(frame["width"]) || !isNumber(frame["height"]))
    return { reason: "`frame` needs a width and height." };
  if (!isRecord(rest) || !isRecord(lines) || !isRecord(parents))
    return { reason: "`rest`, `lines` and `parents` must be objects." };
  const boxes: Record<string, MeasuredBox> = {};
  for (const [name, value] of Object.entries(rest)) {
    const box = boxFrom(value);
    if (box === undefined) return { reason: `the box of "${name}" is not a measured box.` };
    boxes[name] = box;
  }
  const lineOf: Record<string, readonly number[]> = {};
  for (const [name, value] of Object.entries(lines)) {
    if (!Array.isArray(value) || !value.every(isNumber))
      return { reason: `the lines of "${name}" are not numbers.` };
    lineOf[name] = value;
  }
  const parentOf: Record<string, string> = {};
  for (const [name, value] of Object.entries(parents)) {
    if (typeof value !== "string") return { reason: `the parent of "${name}" is not a name.` };
    parentOf[name] = value;
  }
  const rawObjects = raw["objects"];
  let objectOf: Record<string, MeasuredObjectBounds> | undefined;
  if (rawObjects !== undefined) {
    if (!isRecord(rawObjects)) return { reason: "`objects` must be an object." };
    objectOf = {};
    for (const [name, value] of Object.entries(rawObjects)) {
      const bounds = objectBoundsFrom(value);
      if (bounds === undefined)
        return { reason: `the bounds of object "${name}" are not a measured 3D box.` };
      objectOf[name] = bounds;
    }
  }
  const rawCounts = raw["counts"];
  let countOf: Record<string, number> | undefined;
  if (rawCounts !== undefined) {
    if (!isRecord(rawCounts)) return { reason: "`counts` must be an object." };
    countOf = {};
    for (const [name, value] of Object.entries(rawCounts)) {
      if (typeof value !== "number" || !Number.isInteger(value) || value < 0)
        return { reason: `the part count of "${name}" must be a non-negative integer.` };
      countOf[name] = value;
    }
  }
  return {
    page,
    digest,
    frame: { width: frame["width"], height: frame["height"] },
    rest: boxes,
    lines: lineOf,
    parents: parentOf,
    ...(objectOf !== undefined && Object.keys(objectOf).length > 0 ? { objects: objectOf } : {}),
    ...(countOf !== undefined && Object.keys(countOf).length > 0 ? { counts: countOf } : {}),
  };
}
