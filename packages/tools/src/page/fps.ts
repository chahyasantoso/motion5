import type { Page } from "playwright-core";
import { readPageArgs, withPage, type PageSource } from "./page";

const USAGE = "Usage: motion:fps <page> [--to ms] [--size WxH] [--show]";
const WINDOW_MS = 500;
const DEFAULT_TO = 10000;

/** What `motion:fps` measures: a page, how long to watch it in ms, and whether to show the window. */
export interface FpsRequest {
  readonly kind: "fps";
  readonly page: string;
  readonly width: number;
  readonly height: number;
  readonly source: PageSource;
  readonly to: number;
  readonly show: boolean;
}

/** The request read from the command line, or the usage text. */
export type FpsArgs = FpsRequest | { readonly kind: "usage"; readonly message: string };

/** Frames per second in one window of the run, from `from` to `to` ms. */
export interface FpsWindow {
  readonly from: number;
  readonly to: number;
  readonly fps: number;
}

/** One slow frame: `at` ms since the first frame, its gap `ms`, and the `scene` and `write` ms spent inside it. */
export interface SlowFrame {
  readonly at: number;
  readonly ms: number;
  readonly scene: number;
  readonly write: number;
  readonly rest: number;
}

/** The frame rate of a page run on a real clock. */
export interface FpsReport {
  readonly kind: "fps";
  readonly page: string;
  readonly to: number;
  readonly headless: boolean;
  /** True when the page is drawn at the display rate; headless it is false and frames run uncapped. */
  readonly vsync: boolean;
  /** The WebGL renderer the page drew with, or "none". */
  readonly renderer: string;
  /** True when the renderer is software (SwiftShader, llvmpipe or "Software"). */
  readonly software: boolean;
  readonly windows: readonly FpsWindow[];
  readonly over16: number;
  readonly over33: number;
  readonly worst: readonly SlowFrame[];
  readonly pageErrors: readonly string[];
}

/** Reads `<page> [--to ms] [--size WxH] [--root dir | --url address] [--show]`. */
export function parseFpsArgs(argv: readonly string[]): FpsArgs {
  const usage = (message: string): FpsArgs => ({ kind: "usage", message: `${message} ${USAGE}` });
  const show = argv.includes("--show");
  const read = readPageArgs(
    argv.filter((arg) => arg !== "--show"),
    ["--to"],
  );
  if (read.kind === "usage") return usage(read.message);
  const { target, flags } = read;
  if (target.actions !== undefined) return usage("--action does not go with motion:fps.");
  let to = DEFAULT_TO;
  if (flags.has("--to")) {
    const text = flags.get("--to");
    to = text === undefined || !/^\d+(?:\.\d+)?$/.test(text) ? Number.NaN : Number(text);
    if (!(to > 0)) return usage("--to needs a positive number of ms.");
  }
  return {
    kind: "fps",
    page: target.page,
    width: target.width,
    height: target.height,
    source: target.source,
    to,
    show,
  };
}

interface Recorded {
  readonly frames: number[];
  readonly scene: [number, number][];
  readonly write: [number, number][];
}

/** Installed before the page loads: records every frame's timestamp and every gerak measure. */
function record(): void {
  Reflect.set(globalThis, "__gerakTiming", true);
  const data: Recorded = { frames: [], scene: [], write: [] };
  Reflect.set(globalThis, "__fpsRecorded", data);
  const tick = (stamp: number): void => {
    data.frames.push(stamp);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === "gerak:scene") data.scene.push([entry.startTime, entry.duration]);
      if (entry.name === "gerak:write") data.write.push([entry.startTime, entry.duration]);
    }
  }).observe({ type: "measure", buffered: true });
}

/** Adds a corner counter of the frames in the last second, updated every frame. */
function counter(): void {
  const box = document.createElement("div");
  box.style.cssText =
    "position:fixed;top:8px;right:8px;z-index:2147483647;padding:4px 8px;font:14px monospace;" +
    "background:#000c;color:#0f0;pointer-events:none";
  document.body.append(box);
  const stamps: number[] = [];
  const tick = (stamp: number): void => {
    stamps.push(stamp);
    while (stamps.length > 0 && stamp - (stamps[0] ?? stamp) > 1000) stamps.shift();
    box.textContent = `${stamps.length} fps`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function numbersOf(value: unknown): number[] {
  return Array.isArray(value)
    ? value.filter((item): item is number => typeof item === "number")
    : [];
}

function pairsOf(value: unknown): [number, number][] {
  const out: [number, number][] = [];
  if (Array.isArray(value))
    for (const item of value) {
      const [start, took] = numbersOf(item);
      if (start !== undefined && took !== undefined) out.push([start, took]);
    }
  return out;
}

/** The WebGL renderer this page draws with, or "none" when WebGL is unavailable. */
function rendererName(): string {
  const context = document.createElement("canvas").getContext("webgl");
  if (context === null) return "none";
  const info = context.getExtension("WEBGL_debug_renderer_info");
  const name: unknown =
    info === null
      ? context.getParameter(context.RENDERER)
      : context.getParameter(info.UNMASKED_RENDERER_WEBGL);
  return typeof name === "string" ? name : "none";
}

async function recordedOf(page: Page): Promise<Recorded> {
  const found: unknown = await page.evaluate(() => Reflect.get(globalThis, "__fpsRecorded"));
  if (typeof found !== "object" || found === null) throw new Error("No frames were recorded.");
  return {
    frames: numbersOf(Reflect.get(found, "frames")),
    scene: pairsOf(Reflect.get(found, "scene")),
    write: pairsOf(Reflect.get(found, "write")),
  };
}

/** The report from recorded frames and measures, counted from the first frame to `to` ms. */
export function summarize(
  data: Recorded,
  page: string,
  to: number,
  headless: boolean,
  renderer: string,
  pageErrors: readonly string[],
): FpsReport {
  const begun = data.scene[0]?.[0];
  const first = data.frames.find((stamp) => begun === undefined || stamp >= begun) ?? 0;
  const frames = data.frames.map((stamp) => stamp - first).filter((at) => at >= 0 && at <= to);
  // Each gap between frames belongs to the window it ends in, so a stall lowers the rate where it ends.
  const windows: FpsWindow[] = [];
  for (let from = 0; from < to; from += WINDOW_MS) {
    const end = Math.min(from + WINDOW_MS, to);
    let count = 0;
    let span = 0;
    for (let i = 1; i < frames.length; i += 1) {
      const high = frames[i] ?? 0;
      if (high < from || high >= end) continue;
      count += 1;
      span += high - (frames[i - 1] ?? 0);
    }
    const rate = span > 0 ? (count / span) * 1000 : 0;
    windows.push({ from, to: end, fps: Math.round(rate * 10) / 10 });
  }
  // A measure counts only for its part inside the gap, so a scene that outruns its frame is split.
  const sum = (list: readonly [number, number][], low: number, high: number): number =>
    list.reduce((total, [start, took]) => {
      const begin = Math.max(start - first, low);
      const finish = Math.min(start - first + took, high);
      return finish > begin ? total + finish - begin : total;
    }, 0);
  const gaps: SlowFrame[] = [];
  for (let i = 1; i < frames.length; i += 1) {
    const low = frames[i - 1] ?? 0;
    const high = frames[i] ?? 0;
    const ms = high - low;
    const scene = sum(data.scene, low, high);
    const write = sum(data.write, low, high);
    gaps.push({
      at: round(high),
      ms: round(ms),
      scene: round(scene),
      write: round(write),
      rest: round(Math.max(0, ms - scene - write)),
    });
  }
  return {
    kind: "fps",
    page,
    to,
    headless,
    vsync: !headless,
    renderer,
    software: /swiftshader|llvmpipe|software/i.test(renderer),
    windows,
    over16: gaps.filter((gap) => gap.ms > 16.7).length,
    over33: gaps.filter((gap) => gap.ms > 33.4).length,
    worst: [...gaps].sort((a, b) => b.ms - a.ms).slice(0, 5),
    pageErrors,
  };
}

function round(ms: number): number {
  return Math.round(ms * 10) / 10;
}

/** Opens the page on a real clock with step timing on, watches it for `to` ms, and reports its frame rate. */
export async function measureFps(request: FpsRequest): Promise<FpsReport> {
  const { value, pageErrors } = await withPage(
    {
      page: request.page,
      width: request.width,
      height: request.height,
      source: request.source,
      clock: "real",
      show: request.show,
      prepare: async (page) => {
        await page.addInitScript(record);
      },
    },
    async ({ page, advanceTo }) => {
      if (request.show) await page.evaluate(counter);
      await advanceTo(request.to);
      await page.waitForFunction(
        (to) => {
          const found: unknown = Reflect.get(globalThis, "__fpsRecorded");
          const frames: unknown =
            typeof found === "object" && found !== null ? Reflect.get(found, "frames") : [];
          if (!Array.isArray(frames) || frames.length === 0) return false;
          return Number(frames[frames.length - 1]) - Number(frames[0]) >= to;
        },
        request.to,
        { timeout: 5000 },
      );
      const recorded = await recordedOf(page);
      const renderer = await page.evaluate(rendererName);
      return { recorded, renderer };
    },
  );
  return summarize(
    value.recorded,
    request.page,
    request.to,
    !request.show,
    value.renderer,
    pageErrors,
  );
}
