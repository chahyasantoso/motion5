import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, extname, join, relative, resolve } from "node:path";

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

const SCRIPT_EXTENSIONS = [".ts", ".tsx", ".mts", ".cts", ".js", ".mjs"] as const;

function stripQueryHash(spec: string): string {
  return spec.split(/[?#]/, 1)[0] ?? "";
}

function isRemoteSpec(spec: string): boolean {
  return spec === "" || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(spec);
}

function isExistingFile(path: string): boolean {
  try {
    return existsSync(path) && statSync(path).isFile();
  } catch {
    return false;
  }
}

function resolvePageAsset(pageDir: string, spec: string): string | undefined {
  const clean = stripQueryHash(spec.trim());
  if (isRemoteSpec(clean)) return undefined;
  const rel = clean.startsWith("/") ? clean.slice(1) : clean;
  const fromPage = resolve(pageDir, rel);
  if (isExistingFile(fromPage)) return fromPage;
  if (clean.startsWith("/")) {
    const fromRoot = resolve(dirname(pageDir), rel);
    if (isExistingFile(fromRoot)) return fromRoot;
  }
  return undefined;
}

function resolveScriptModule(fromDir: string, spec: string): string | undefined {
  const clean = stripQueryHash(spec.trim());
  if (!clean.startsWith("./") && !clean.startsWith("../")) return undefined;
  const base = resolve(fromDir, clean);
  if (isExistingFile(base)) return base;
  const ext = extname(base);
  if (ext === ".js" || ext === ".mjs") {
    const stem = base.slice(0, -ext.length);
    for (const tsExt of [".ts", ".tsx", ".mts"]) {
      if (isExistingFile(`${stem}${tsExt}`)) return `${stem}${tsExt}`;
    }
  }
  if (ext === "") {
    for (const candidateExt of SCRIPT_EXTENSIONS) {
      if (isExistingFile(`${base}${candidateExt}`)) return `${base}${candidateExt}`;
    }
    for (const candidateExt of SCRIPT_EXTENSIONS) {
      const idx = resolve(base, `index${candidateExt}`);
      if (isExistingFile(idx)) return idx;
    }
  }
  return undefined;
}

function collectHtmlDeps(
  html: string,
  pageDir: string,
): { readonly css: string[]; readonly scripts: string[]; readonly assets: string[] } {
  const css: string[] = [];
  const scripts: string[] = [];
  const assets: string[] = [];
  for (const match of html.matchAll(/<link\b([^>]*)>/gi)) {
    const attrs = match[1] ?? "";
    const hrefMatch = /\bhref=["']([^"']+)["']/i.exec(attrs);
    const href = hrefMatch?.[1];
    if (href === undefined) continue;
    const relMatch = /\brel=["']([^"']+)["']/i.exec(attrs);
    const isStylesheet =
      relMatch?.[1]?.toLowerCase().split(/\s+/).includes("stylesheet") ||
      stripQueryHash(href).toLowerCase().endsWith(".css");
    if (!isStylesheet) continue;
    const found = resolvePageAsset(pageDir, href);
    if (found !== undefined) css.push(found);
  }
  for (const match of html.matchAll(/<script\b([^>]*)>/gi)) {
    const attrs = match[1] ?? "";
    const srcMatch = /\bsrc=["']([^"']+)["']/i.exec(attrs);
    const src = srcMatch?.[1];
    if (src === undefined) continue;
    const found = resolvePageAsset(pageDir, src);
    if (found !== undefined) scripts.push(found);
  }
  for (const match of html.matchAll(/["']([^"']+\.(?:glb|gltf)(?:[?#][^"']*)?)["']/gi)) {
    const spec = match[1];
    if (spec === undefined) continue;
    const found = resolvePageAsset(pageDir, spec);
    if (found !== undefined) assets.push(found);
  }
  return { css, scripts, assets };
}

/** A digest of the page and its linked styles, bootstrap scripts, local imports, and glTF assets. */
export function pageDigest(page: string): string {
  const htmlText = readFileSync(page, "utf8");
  const hash = createHash("sha256").update(htmlText);
  const folder = resolve(dirname(page));
  const stem = basename(page, ".html");
  const visitedFiles = new Set<string>([
    resolve(page),
    resolve(folder, "src", `${stem}.ts`),
    resolve(folder, "src", `${stem}.tsx`),
    resolve(folder, "src", `${stem}-scene.ts`),
    resolve(folder, "src", `${stem}-scene.tsx`),
  ]);
  const assets = new Set<string>();

  for (const name of readdirSync(folder)
    .filter((file) => file.endsWith(".css"))
    .sort()) {
    const cssPath = resolve(folder, name);
    visitedFiles.add(cssPath);
    hash.update(name).update(readFileSync(cssPath));
  }

  const { css, scripts, assets: htmlAssets } = collectHtmlDeps(htmlText, folder);
  for (const asset of htmlAssets) assets.add(asset);

  const cssQueue = [...css].sort();
  while (cssQueue.length > 0) {
    const cssPath = cssQueue.shift();
    if (cssPath === undefined || visitedFiles.has(cssPath)) continue;
    visitedFiles.add(cssPath);
    const cssText = readFileSync(cssPath, "utf8");
    hash.update(relative(folder, cssPath).replaceAll("\\", "/")).update(cssText);
    const cssDir = dirname(cssPath);
    for (const match of cssText.matchAll(/@import\s+(?:url\()?["']([^"']+)["']/g)) {
      const target = match[1];
      if (target === undefined) continue;
      const imported = resolvePageAsset(cssDir, target);
      if (imported !== undefined && !visitedFiles.has(imported)) cssQueue.push(imported);
    }
  }

  const scriptQueue = [...scripts].sort();
  while (scriptQueue.length > 0) {
    const scriptPath = scriptQueue.shift();
    if (scriptPath === undefined || visitedFiles.has(scriptPath)) continue;
    visitedFiles.add(scriptPath);
    const code = readFileSync(scriptPath, "utf8");
    hash.update(relative(folder, scriptPath).replaceAll("\\", "/")).update(code);
    const scriptDir = dirname(scriptPath);
    for (const match of code.matchAll(/(?:\bfrom|\bimport)\s*\(?["'](\.[^"']+)["']/g)) {
      const spec = match[1];
      if (spec === undefined) continue;
      const dep = resolveScriptModule(scriptDir, spec);
      if (dep !== undefined && !visitedFiles.has(dep)) scriptQueue.push(dep);
    }
    for (const match of code.matchAll(/["']([^"']+\.(?:glb|gltf)(?:[?#][^"']*)?)["']/gi)) {
      const spec = match[1];
      if (spec === undefined) continue;
      const clean = stripQueryHash(spec);
      if (isRemoteSpec(clean)) continue;
      const fromScript = resolve(scriptDir, clean.startsWith("/") ? clean.slice(1) : clean);
      if (isExistingFile(fromScript)) assets.add(fromScript);
      else {
        const fromHtml = resolvePageAsset(folder, spec);
        if (fromHtml !== undefined) assets.add(fromHtml);
      }
    }
  }

  for (const assetPath of [...assets].sort()) {
    hash.update(relative(folder, assetPath).replaceAll("\\", "/")).update(readFileSync(assetPath));
  }
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
