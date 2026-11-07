import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { readPageArgs, withPage, type PageTarget } from "./page";
import { parseNumbers } from "./sample";

export interface FramesRequest extends PageTarget {
  readonly at: readonly number[];
  readonly out?: string;
}

export interface OnionRequest extends PageTarget {
  readonly select: string;
  readonly from: number;
  readonly to: number;
  readonly every: number;
  readonly out?: string;
}

export type FramesArgs =
  | ({ readonly kind: "frames" } & FramesRequest)
  | ({ readonly kind: "onion" } & OnionRequest)
  | { readonly kind: "usage"; readonly message: string };

export interface FramesResult {
  readonly kind: "captured";
  readonly frames: readonly { readonly at: number; readonly path: string }[];
  readonly sheet: string;
  readonly pageErrors: readonly string[];
}

export interface Box {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface OnionResult {
  readonly kind: "onion";
  readonly path: string;
  readonly steps: readonly { readonly at: number; readonly boxes: readonly Box[] }[];
  readonly pageErrors: readonly string[];
}

const USAGE =
  "usage: motion:frames <page> (--at ms,ms | --onion selector --from ms --to ms --every ms) [--size WxH] [--out dir]";
const FLAGS = ["--at", "--out", "--onion", "--from", "--to", "--every"];
const SHEET_COLUMNS = 4;
const SHEET_CELL_WIDTH = 480;
const ONION_STEP_LIMIT = 120;

function nonNegative(text: string | undefined): number | undefined {
  const value = Number(text);
  return text !== undefined && text !== "" && Number.isFinite(value) && value >= 0
    ? value
    : undefined;
}

export function parseFramesArgs(argv: readonly string[]): FramesArgs {
  const usage = (message: string): FramesArgs => ({
    kind: "usage",
    message: `${message} ${USAGE}`,
  });
  const read = readPageArgs(argv, FLAGS);
  if (read.kind === "usage") return usage(read.message);
  const { target, flags } = read;
  const out = flags.get("--out");
  const outField = out === undefined ? {} : { out };
  if (flags.has("--onion") === flags.has("--at"))
    return usage("Pass exactly one of --at and --onion.");
  if (flags.has("--at")) {
    const at = parseNumbers(flags.get("--at"));
    if (at === undefined) return usage("--at needs ascending non-negative numbers.");
    return { kind: "frames", ...target, at, ...outField };
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
function sheetHtml(frames: readonly { readonly at: number; readonly path: string }[]): string {
  const cells = frames.map(
    ({ at, path }) =>
      `<figure><img src="${dataUrl(path)}"><figcaption>${at} ms</figcaption></figure>`,
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
    await sheetPage.setContent(sheetHtml(frames), { waitUntil: "load" });
    const sheet = join(out, "sheet.png");
    writeFileSync(sheet, await sheetPage.screenshot({ fullPage: true }));
    return { frames, sheet };
  });
  return { kind: "captured", ...value, pageErrors };
}

/**
 * Draws every match of `select` at each step onto the last frame, faded, with its centre path,
 * so spacing and arc read from one image.
 */
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
