import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fromCaller, readPageArgs, withPage, type PageTarget } from "./page";
import type { Box } from "./frames";
import { decodePng, encodePng, type Picture } from "./png";

/** What `motion:compare` does: the page drawn at `at` ms against the SVG at `reference`, written to `out`. */
export interface CompareRequest extends PageTarget {
  readonly at: number;
  readonly reference: string;
  readonly out?: string;
}

/** Parsed `motion:compare` arguments, or the usage text. */
export type CompareArgs =
  | ({ readonly kind: "compare" } & CompareRequest)
  | { readonly kind: "usage"; readonly message: string };

/** How far one cast member's box is from the reference, as a mean out of 255. */
export interface MemberDifference {
  readonly name: string;
  readonly mean: number;
}

/** The whole frame's mean difference, each cast member's (worst first), what to know, and the folder written. */
export type CompareResult =
  | {
      readonly kind: "compared";
      readonly mean: number;
      readonly members: readonly MemberDifference[];
      readonly notes: readonly string[];
      readonly out: string;
    }
  | { readonly kind: "usage"; readonly message: string };

const USAGE = "usage: motion:compare <page> --reference <svg> [--at ms] [--size WxH] [--out dir]";
const FLAGS = ["--reference", "--at", "--out"];
const ASPECT_TOLERANCE = 0.01;
const GAP = 8;
const GAP_GREY = 128;

/** Reads `<page> --reference <svg> [--at ms] [--out dir]`, or answers the usage text. */
export function parseCompareArgs(argv: readonly string[]): CompareArgs {
  const usage = (message: string): CompareArgs => ({
    kind: "usage",
    message: `${message} ${USAGE}`,
  });
  const read = readPageArgs(argv, FLAGS);
  if (read.kind === "usage") return usage(read.message);
  const { target, flags } = read;
  const reference = flags.get("--reference");
  if (reference === undefined || reference === "" || reference.startsWith("--"))
    return usage("--reference needs an SVG file.");
  const atText = flags.get("--at") ?? "0";
  const at = Number(atText);
  if (!/^\d+(\.\d+)?$/.test(atText) || !Number.isFinite(at))
    return usage("--at needs one non-negative number of ms.");
  const outFlag = flags.get("--out");
  if (flags.has("--out") && (outFlag === undefined || outFlag.startsWith("--")))
    return usage("--out needs a folder.");
  return {
    kind: "compare",
    ...target,
    at,
    reference: fromCaller(reference),
    ...(outFlag === undefined ? {} : { out: fromCaller(outFlag) }),
  };
}

/** The mean absolute difference over R, G and B, out of 255, inside `box` (the whole picture when omitted),
 * clipped to the picture; an empty box is 0. */
export function meanDifference(a: Picture, b: Picture, box?: Box): number {
  if (a.width !== b.width || a.height !== b.height)
    throw new Error(
      `The pictures differ in size: ${a.width}x${a.height} and ${b.width}x${b.height}.`,
    );
  const x0 = Math.max(0, Math.floor(box?.x ?? 0));
  const y0 = Math.max(0, Math.floor(box?.y ?? 0));
  const x1 = Math.min(a.width, Math.ceil((box?.x ?? 0) + (box?.width ?? a.width)));
  const y1 = Math.min(a.height, Math.ceil((box?.y ?? 0) + (box?.height ?? a.height)));
  if (x1 <= x0 || y1 <= y0) return 0;
  let total = 0;
  for (let y = y0; y < y1; y += 1)
    for (let x = x0; x < x1; x += 1) total += nearestDifference(a, b, x, y);
  return total / ((x1 - x0) * (y1 - y0) * 3);
}

/** The summed RGB difference between `a` at (x, y) and the closest of `b`'s pixels within one of it, so
 * edges smoothed a sub-pixel differently count as the same drawing. */
export function nearestDifference(a: Picture, b: Picture, x: number, y: number): number {
  const at = (y * a.width + x) * 3;
  let best = Infinity;
  for (let dy = -1; dy <= 1; dy += 1)
    for (let dx = -1; dx <= 1; dx += 1) {
      const bx = x + dx;
      const by = y + dy;
      if (bx < 0 || by < 0 || bx >= b.width || by >= b.height) continue;
      const near = (by * b.width + bx) * 3;
      let sum = 0;
      for (let channel = 0; channel < 3; channel += 1)
        sum += Math.abs((a.rgb[at + channel] ?? 0) - (b.rgb[near + channel] ?? 0));
      if (sum < best) best = sum;
    }
  return best;
}

/** Members rounded to 2 decimals and sorted worst first, equal ones by name. */
export function rankMembers(members: readonly MemberDifference[]): MemberDifference[] {
  return members
    .map(({ name, mean }) => ({ name, mean: Math.round(mean * 100) / 100 }))
    .sort((p, q) => q.mean - p.mean || (p.name < q.name ? -1 : p.name > q.name ? 1 : 0));
}

/** A note when the reference's aspect differs from the frame's by more than 1 percent, else nothing. */
export function aspectNote(
  view: { readonly width: number; readonly height: number },
  frame: { readonly width: number; readonly height: number },
): string | undefined {
  const viewAspect = view.width / view.height;
  const frameAspect = frame.width / frame.height;
  if (Math.abs(viewAspect / frameAspect - 1) <= ASPECT_TOLERANCE) return undefined;
  return `The reference's viewBox has aspect ${viewAspect.toFixed(2)} and the frame ${frameAspect.toFixed(2)}; it is fitted as its preserveAspectRatio says, not stretched.`;
}

/** The width and height of an SVG's root `viewBox`, or nothing when it has none. */
export function viewBoxOf(
  svg: string,
): { readonly width: number; readonly height: number } | undefined {
  const root = /<svg\b[^>]*>/i.exec(svg)?.[0];
  const text = root === undefined ? undefined : /\bviewBox\s*=\s*["']([^"']*)["']/.exec(root)?.[1];
  if (text === undefined) return undefined;
  const numbers = text
    .trim()
    .split(/[\s,]+/)
    .map(Number);
  const [, , width, height] = numbers;
  if (
    numbers.length !== 4 ||
    width === undefined ||
    height === undefined ||
    !numbers.every(Number.isFinite) ||
    width <= 0 ||
    height <= 0
  )
    return undefined;
  return { width, height };
}

/** The per-pixel absolute difference of two pictures of one size; brighter is more different. */
export function differencePicture(a: Picture, b: Picture): Picture {
  if (a.width !== b.width || a.height !== b.height)
    throw new Error(
      `The pictures differ in size: ${a.width}x${a.height} and ${b.width}x${b.height}.`,
    );
  const rgb = new Uint8Array(a.rgb.length);
  for (let y = 0; y < a.height; y += 1)
    for (let x = 0; x < a.width; x += 1) {
      const grey = Math.min(255, Math.round(nearestDifference(a, b, x, y) / 3));
      rgb.fill(grey, (y * a.width + x) * 3, (y * a.width + x) * 3 + 3);
    }
  return { width: a.width, height: a.height, rgb };
}

/** Two pictures of one height, left and right, with a grey gap between. */
export function sideBySide(left: Picture, right: Picture): Picture {
  if (left.height !== right.height) throw new Error("The pictures differ in height.");
  const width = left.width + GAP + right.width;
  const rgb = new Uint8Array(width * left.height * 3).fill(GAP_GREY);
  for (let y = 0; y < left.height; y += 1) {
    rgb.set(left.rgb.subarray(y * left.width * 3, (y + 1) * left.width * 3), y * width * 3);
    rgb.set(
      right.rgb.subarray(y * right.width * 3, (y + 1) * right.width * 3),
      (y * width + left.width + GAP) * 3,
    );
  }
  return { width, height: left.height, rgb };
}

interface StageRead {
  readonly width: number;
  readonly height: number;
}

interface StageBoxes {
  readonly frame: Box;
  readonly members: readonly { readonly name: string; readonly box: Box }[];
}

function readFrameSize(): StageRead | undefined {
  const frame = document
    .querySelector('[data-stage="host"]')
    ?.shadowRoot?.querySelector('[data-stage="frame"]');
  return frame instanceof HTMLElement
    ? { width: frame.offsetWidth, height: frame.offsetHeight }
    : undefined;
}

function readStageBoxes(): StageBoxes | undefined {
  const root = document.querySelector('[data-stage="host"]')?.shadowRoot;
  const frame = root?.querySelector('[data-stage="frame"]');
  if (root === undefined || root === null || !(frame instanceof HTMLElement)) return undefined;
  frame.style.transform = "";
  const here = frame.getBoundingClientRect();
  const scale = frame.offsetWidth === 0 ? 1 : here.width / frame.offsetWidth;
  const members: { name: string; box: Box }[] = [];
  for (const element of root.querySelectorAll("[data-cast]")) {
    const rect = element.getBoundingClientRect();
    members.push({
      name: element.getAttribute("data-cast") ?? "",
      box: {
        x: (rect.x - here.x) / scale,
        y: (rect.y - here.y) / scale,
        width: rect.width / scale,
        height: rect.height / scale,
      },
    });
  }
  return { frame: { x: here.x, y: here.y, width: here.width, height: here.height }, members };
}

function referenceHtml(svg: string, width: number, height: number): string {
  const src = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  return `<body style="margin:0;background:#fff"><img id="r" width="${width}" height="${height}" src="${src}" style="display:block"></body>`;
}

function outDir(out: string | undefined): string {
  const dir = out ?? mkdtempSync(join(tmpdir(), "motion-compare-"));
  mkdirSync(dir, { recursive: true });
  return dir;
}

/** Draws the page's stage frame at `at` ms and the reference SVG at the frame's size, writes the four
 * pictures, and scores the whole frame and each cast member's box. */
export async function comparePage(request: CompareRequest): Promise<CompareResult> {
  const usage = (message: string): CompareResult => ({ kind: "usage", message });
  if (!existsSync(request.reference))
    return usage(`The reference ${request.reference} does not exist. ${USAGE}`);
  const svg = readFileSync(request.reference, "utf8");
  const view = viewBoxOf(svg);
  if (view === undefined)
    return usage(`The reference ${request.reference} is not an SVG with a viewBox. ${USAGE}`);
  let run;
  try {
    run = await withPage(request, async ({ page, browser, advanceTo }) => {
      await advanceTo(request.at);
      const size = await page.evaluate(readFrameSize);
      if (size === undefined || size.width === 0 || size.height === 0)
        return usage(`The page ${request.page} shows no stage frame. ${USAGE}`);
      await page.setViewportSize(size);
      const stage = await page.evaluate(readStageBoxes);
      if (stage === undefined)
        return usage(`The page ${request.page} shows no stage frame. ${USAGE}`);
      const piece = decodePng(
        await page.screenshot({
          clip: {
            x: Math.round(stage.frame.x),
            y: Math.round(stage.frame.y),
            width: size.width,
            height: size.height,
          },
        }),
      );
      const sheet = await browser.newPage({ viewport: size });
      await sheet.setContent(referenceHtml(svg, size.width, size.height), { waitUntil: "load" });
      const decoded = await sheet.evaluate(() => {
        const image = document.getElementById("r");
        return image instanceof HTMLImageElement
          ? image.decode().then(
              () => true,
              () => false,
            )
          : false;
      });
      if (!decoded)
        return usage(`The reference ${request.reference} did not load as an image. ${USAGE}`);
      const reference = decodePng(await sheet.screenshot());
      return { piece, reference, stage, size };
    });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("page.goto:"))
      return usage(`The page ${request.page} did not load. ${USAGE}`);
    throw error;
  }
  const { value, pageErrors } = run;
  if ("kind" in value) return value;
  const out = outDir(request.out);
  const { piece, reference, stage, size } = value;
  const difference = differencePicture(piece, reference);
  writeFileSync(join(out, "piece.png"), encodePng(piece));
  writeFileSync(join(out, "reference.png"), encodePng(reference));
  writeFileSync(join(out, "side-by-side.png"), encodePng(sideBySide(piece, reference)));
  writeFileSync(join(out, "difference.png"), encodePng(difference));
  const notes: string[] = [];
  const aspect = aspectNote(view, size);
  if (aspect !== undefined) notes.push(aspect);
  for (const message of pageErrors) notes.push(`Page error: ${message}`);
  for (const { name, box } of stage.members)
    if (
      box.width <= 0 ||
      box.height <= 0 ||
      box.x >= size.width ||
      box.y >= size.height ||
      box.x + box.width <= 0 ||
      box.y + box.height <= 0
    )
      notes.push(`${name} has no box inside the frame at ${request.at} ms, so its mean is 0.`);
  return {
    kind: "compared",
    mean: Math.round(meanDifference(piece, reference) * 100) / 100,
    members: rankMembers(
      stage.members.map(({ name, box }) => ({ name, mean: meanDifference(piece, reference, box) })),
    ),
    notes,
    out,
  };
}
