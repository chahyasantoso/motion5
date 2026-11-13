import { mkdtempSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fromCaller, readPageArgs, withPage, type PageTarget } from "./page";
import { parseNumbers } from "./args";
import { decodePng } from "./png";

/** What `motion:frames` captures: the page, the times `at` in ms, a short `labels` entry per frame and the `out` folder. */
export interface FramesRequest extends PageTarget {
  readonly at: readonly number[];
  /** A short reason to print under each frame, in step with `at`. */
  readonly labels?: readonly string[];
  readonly out?: string;
  /** A folder of earlier frames to compare these against once they are written. */
  readonly compare?: string;
}

/** An onion capture: the element `select` drawn at each step from `from` to `to` ms every `every` ms
 * (at most 120 steps) on one frame. */
export interface OnionRequest extends PageTarget {
  readonly select: string;
  readonly from: number;
  readonly to: number;
  readonly every: number;
  readonly out?: string;
}

/** Parsed `motion:frames` arguments: frames at times, an onion, or the usage text. */
export type FramesArgs =
  | ({ readonly kind: "frames" } & FramesRequest)
  | ({ readonly kind: "onion" } & OnionRequest)
  | { readonly kind: "compare"; readonly here: string; readonly there: string }
  | { readonly kind: "usage"; readonly message: string };

/** A PNG path per time, the path of the labelled `sheet.png`, and the page's errors. */
export interface FramesResult {
  readonly kind: "captured";
  readonly frames: readonly { readonly at: number; readonly path: string }[];
  readonly sheet: string;
  readonly pageErrors: readonly string[];
  /** Present when `compare` was asked for. */
  readonly comparison?: Comparison;
  /** Why the comparison could not run; the captured frames stand. */
  readonly compareError?: string;
}

function compareSafely(
  here: string,
  there: string,
): { readonly comparison: Comparison } | { readonly compareError: string } {
  try {
    return { comparison: compareFrames(here, there) };
  } catch (error) {
    return { compareError: error instanceof Error ? error.message : String(error) };
  }
}

/** How far one frame is from its twin in the other folder. */
export interface FrameDifference {
  readonly at: number;
  /** The mean absolute difference over R, G and B, out of 255. */
  readonly mean: number;
  /** The percent of pixels whose mean channel difference is above 32. */
  readonly over32: number;
}

/** What two folders of `frame-*.png` hold: the differences, the frames one side lacks, the size mismatches. */
export interface Comparison {
  readonly here: string;
  readonly there: string;
  readonly differences: readonly FrameDifference[];
  readonly onlyHere: readonly string[];
  readonly onlyThere: readonly string[];
  readonly sizes: readonly {
    readonly name: string;
    readonly here: string;
    readonly there: string;
  }[];
}

/** A box in px: the top left corner `x`, `y`, and `width` and `height`. */
export interface Box {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

/** The onion frame's `path`, and the boxes the element had at each step. */
export interface OnionResult {
  readonly kind: "onion";
  readonly path: string;
  readonly steps: readonly { readonly at: number; readonly boxes: readonly Box[] }[];
  readonly pageErrors: readonly string[];
}

const USAGE =
  "usage: motion:frames <page> (--at ms,ms [--compare dir] | --onion selector --from ms --to ms --every ms) [--size WxH] [--out dir]; or motion:frames --compare dirA dirB";
const FLAGS = ["--at", "--out", "--onion", "--from", "--to", "--every", "--compare"];
const OVER_LEVEL = 32;
const FRAME_NAME = /^frame-(\d+)\.png$/;
const SHEET_COLUMNS = 4;
const SHEET_CELL_WIDTH = 480;
const ONION_STEP_LIMIT = 120;

function nonNegative(text: string | undefined): number | undefined {
  const value = Number(text);
  return text !== undefined && text !== "" && Number.isFinite(value) && value >= 0
    ? value
    : undefined;
}

/** Reads `<page>` with `--at ms,ms` or `--onion sel --from ms --to ms --every ms`, and `--out dir`; or
 * answers the usage text. */
export function parseFramesArgs(argv: readonly string[]): FramesArgs {
  const usage = (message: string): FramesArgs => ({
    kind: "usage",
    message: `${message} ${USAGE}`,
  });
  if (argv[0] === "--compare") {
    const [, here, there] = argv;
    if (argv.length !== 3 || here === undefined || there === undefined || there.startsWith("--"))
      return usage("--compare alone needs two folders.");
    return { kind: "compare", here: fromCaller(here), there: fromCaller(there) };
  }
  const read = readPageArgs(argv, FLAGS);
  if (read.kind === "usage") return usage(read.message);
  const { target, flags } = read;
  const outFlag = flags.get("--out");
  const out = outFlag === undefined ? undefined : fromCaller(outFlag);
  const outField = out === undefined ? {} : { out };
  const compareFlag = flags.get("--compare");
  if (flags.has("--compare") && (compareFlag === undefined || compareFlag.startsWith("--")))
    return usage("--compare needs a folder.");
  if (flags.has("--compare") && flags.has("--onion"))
    return usage("--compare goes with --at, not --onion.");
  const compareField = compareFlag === undefined ? {} : { compare: fromCaller(compareFlag) };
  if (flags.has("--onion") === flags.has("--at"))
    return usage("Pass exactly one of --at and --onion.");
  if (flags.has("--at")) {
    const at = parseNumbers(flags.get("--at"));
    if (at === undefined) return usage("--at needs ascending non-negative numbers.");
    return { kind: "frames", ...target, at, ...outField, ...compareField };
  }
  const select = flags.get("--onion");
  const from = nonNegative(flags.get("--from"));
  const to = nonNegative(flags.get("--to"));
  const every = nonNegative(flags.get("--every"));
  if (select === undefined || select === "") return usage("--onion needs a CSS selector.");
  if (from === undefined || to === undefined || every === undefined || every === 0 || to < from)
    return usage("--onion needs --from <= --to and a positive --every, in ms.");
  if ((to - from) / every + 1 > ONION_STEP_LIMIT)
    return usage(`--onion takes at most ${ONION_STEP_LIMIT} steps.`);
  return { kind: "onion", ...target, select, from, to, every, ...outField };
}

function outDir(out: string | undefined): string {
  const dir = out ?? mkdtempSync(join(tmpdir(), "motion-frames-"));
  mkdirSync(dir, { recursive: true });
  return dir;
}

function dataUrl(path: string): string {
  return `data:image/png;base64,${readFileSync(path).toString("base64")}`;
}

/** Lays captured frames into one labelled image, so a reader looks once instead of per frame. */
function sheetHtml(
  frames: readonly { readonly at: number; readonly path: string }[],
  labels: readonly string[],
): string {
  const cells = frames.map(
    ({ at, path }, index) =>
      `<figure><img src="${dataUrl(path)}"><figcaption>${at} ms${labels[index] === undefined ? "" : ` ${labels[index]}`}</figcaption></figure>`,
  );
  return `<style>
    body { margin: 0; display: grid; grid-template-columns: repeat(${SHEET_COLUMNS}, ${SHEET_CELL_WIDTH}px); gap: 4px; background: #fff; }
    figure { margin: 0; } img { width: 100%; display: block; }
    figcaption { font: 12px monospace; padding: 2px 4px; }
  </style>${cells.join("")}`;
}

/** Captures the page at each named time, plus one labelled sheet of every frame. */
export async function captureFrames(request: FramesRequest): Promise<FramesResult> {
  const out = outDir(request.out);
  const { value, pageErrors } = await withPage(request, async ({ page, browser, advanceTo }) => {
    const frames: { at: number; path: string }[] = [];
    for (const at of request.at) {
      await advanceTo(at);
      const path = join(out, `frame-${String(at).padStart(6, "0")}.png`);
      await page.screenshot({ path });
      frames.push({ at, path });
    }
    const sheetPage = await browser.newPage({
      viewport: { width: SHEET_COLUMNS * (SHEET_CELL_WIDTH + 4), height: 100 },
    });
    await sheetPage.setContent(sheetHtml(frames, request.labels ?? []), { waitUntil: "load" });
    const sheet = join(out, "sheet.png");
    writeFileSync(sheet, await sheetPage.screenshot({ fullPage: true }));
    return { frames, sheet };
  });
  const compared = request.compare === undefined ? undefined : compareSafely(out, request.compare);
  return { kind: "captured", ...value, pageErrors, ...(compared ?? {}) };
}

function frameNames(dir: string): string[] {
  return readdirSync(dir)
    .filter((name) => FRAME_NAME.test(name))
    .sort();
}

/** Compares every `frame-*.png` both folders hold; frames on one side only, or of different sizes, are named. */
export function compareFrames(here: string, there: string): Comparison {
  const hereNames = frameNames(here);
  const thereNames = frameNames(there);
  const differences: FrameDifference[] = [];
  const sizes: { name: string; here: string; there: string }[] = [];
  for (const name of hereNames.filter((candidate) => thereNames.includes(candidate))) {
    const a = decodePng(readFileSync(join(here, name)));
    const b = decodePng(readFileSync(join(there, name)));
    if (a.width !== b.width || a.height !== b.height) {
      sizes.push({ name, here: `${a.width}x${a.height}`, there: `${b.width}x${b.height}` });
      continue;
    }
    const pixels = a.width * a.height;
    let total = 0;
    let over = 0;
    for (let pixel = 0; pixel < pixels; pixel += 1) {
      const at = pixel * 3;
      const sum =
        Math.abs((a.rgb[at] ?? 0) - (b.rgb[at] ?? 0)) +
        Math.abs((a.rgb[at + 1] ?? 0) - (b.rgb[at + 1] ?? 0)) +
        Math.abs((a.rgb[at + 2] ?? 0) - (b.rgb[at + 2] ?? 0));
      total += sum;
      if (sum / 3 > OVER_LEVEL) over += 1;
    }
    const at = Number(FRAME_NAME.exec(name)?.[1]);
    differences.push({
      at,
      mean: pixels === 0 ? 0 : total / (pixels * 3),
      over32: pixels === 0 ? 0 : (over / pixels) * 100,
    });
  }
  return {
    here,
    there,
    differences,
    onlyHere: hereNames.filter((name) => !thereNames.includes(name)),
    onlyThere: thereNames.filter((name) => !hereNames.includes(name)),
    sizes,
  };
}

/** One line per compared frame, then a line per frame named for lacking a twin or for a different size. */
export function comparisonLines(comparison: Comparison): string[] {
  return [
    ...comparison.differences.map(
      ({ at, mean, over32 }) => `${at} ms  mean ${mean.toFixed(3)}  over32 ${over32.toFixed(2)}%`,
    ),
    ...comparison.sizes.map(
      ({ name, here, there }) => `${name}  not compared: ${here} here, ${there} there`,
    ),
    ...comparison.onlyHere.map((name) => `${name}  only in ${comparison.here}`),
    ...comparison.onlyThere.map((name) => `${name}  only in ${comparison.there}`),
  ];
}

/** Draws each match of `select` at every step onto the last frame, faded, with its centre path. */
export async function captureOnion(request: OnionRequest): Promise<OnionResult> {
  const out = outDir(request.out);
  const { value, pageErrors } = await withPage(request, async ({ page, browser, advanceTo }) => {
    const steps: {
      at: number;
      boxes: Box[];
      clips: { readonly src: string; readonly x: number; readonly y: number }[];
    }[] = [];
    for (let at = request.from; at <= request.to; at += request.every) {
      await advanceTo(at);
      const boxes = await page.$$eval(request.select, (elements) =>
        elements.map((element) => {
          const rect = element.getBoundingClientRect();
          return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
        }),
      );
      const clips: { readonly src: string; readonly x: number; readonly y: number }[] = [];
      for (const box of boxes) {
        // Only the part on the stage can be captured; an element wholly off it leaves no ghost.
        const x = Math.max(0, box.x);
        const y = Math.max(0, box.y);
        const width = Math.min(request.width, box.x + box.width) - x;
        const height = Math.min(request.height, box.y + box.height) - y;
        if (width < 1 || height < 1) continue;
        const clip = await page.screenshot({ clip: { x, y, width, height } });
        clips.push({ src: `data:image/png;base64,${clip.toString("base64")}`, x, y });
      }
      steps.push({ at, boxes, clips });
    }
    const base = await page.screenshot();
    const canvasPage = await browser.newPage({
      viewport: { width: request.width, height: request.height },
    });
    await canvasPage.setContent(
      `<canvas id="c" width="${request.width}" height="${request.height}">`,
    );
    const png = await canvasPage.evaluate(
      async ({ base, steps }) => {
        const load = async (src: string) => {
          const image = new Image();
          image.src = src;
          await image.decode();
          return image;
        };
        const canvas = document.getElementById("c");
        if (!(canvas instanceof HTMLCanvasElement)) throw new Error("The onion canvas is missing.");
        const context = canvas.getContext("2d");
        if (context === null) throw new Error("The onion canvas has no 2D context.");
        context.globalAlpha = 0.35;
        context.drawImage(await load(base), 0, 0);
        context.globalAlpha = 0.55;
        for (const step of steps)
          for (const clip of step.clips) context.drawImage(await load(clip.src), clip.x, clip.y);
        context.globalAlpha = 1;
        context.strokeStyle = "#00e5ff";
        context.fillStyle = "#00e5ff";
        context.lineWidth = 2;
        context.beginPath();
        steps.forEach((step, index) => {
          const box = step.boxes[0];
          if (box === undefined) return;
          const x = box.x + box.width / 2;
          const y = box.y + box.height / 2;
          if (index === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        });
        context.stroke();
        for (const step of steps) {
          const box = step.boxes[0];
          if (box === undefined) continue;
          context.fillRect(box.x + box.width / 2 - 2, box.y + box.height / 2 - 2, 4, 4);
        }
        return canvas.toDataURL("image/png");
      },
      { base: `data:image/png;base64,${base.toString("base64")}`, steps },
    );
    const path = join(out, "onion.png");
    writeFileSync(path, Buffer.from(png.split(",")[1] ?? "", "base64"));
    return { path, steps: steps.map(({ at, boxes }) => ({ at, boxes })) };
  });
  return { kind: "onion", ...value, pageErrors };
}
