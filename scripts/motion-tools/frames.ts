import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseNumbers } from "./sample";

export interface FramesRequest {
  readonly page: string;
  readonly at: readonly number[];
  readonly width: number;
  readonly height: number;
  readonly out?: string;
}

export type FramesArgs =
  | ({ readonly kind: "ok" } & FramesRequest)
  | { readonly kind: "usage"; readonly message: string };

export interface FramesResult {
  readonly kind: "captured";
  readonly frames: readonly { readonly at: number; readonly path: string }[];
  readonly sheet: string;
  readonly pageErrors: readonly string[];
}

const USAGE = "usage: motion:frames <page> --at ms,ms [--size 1280x720] [--out dir]";
const CHANNELS = ["chrome", "msedge", undefined] as const;
const FIRST_FRAME_MS = 17;
const SHEET_COLUMNS = 4;
const SHEET_CELL_WIDTH = 480;

export function parseFramesArgs(argv: readonly string[]): FramesArgs {
  const usage = (message: string): FramesArgs => ({
    kind: "usage",
    message: `${message} ${USAGE}`,
  });
  const positional: string[] = [];
  const flags = new Map<string, string | undefined>();
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]!;
    if (!arg.startsWith("--")) {
      positional.push(arg);
      continue;
    }
    if (arg !== "--at" && arg !== "--size" && arg !== "--out") return usage(`Unknown flag ${arg}.`);
    flags.set(arg, argv[i + 1]);
    i += 1;
  }
  const page = positional[0];
  if (page === undefined || positional.length !== 1) return usage("Expected one page path.");
  if (!/^[\w./-]+\.html$/.test(page) || page.startsWith("/") || page.includes(".."))
    return usage(`Page ${page} must be an .html path inside the app, like timing.html.`);
  const at = parseNumbers(flags.get("--at"));
  if (at === undefined) return usage("--at needs ascending non-negative numbers.");
  const size = /^(\d+)x(\d+)$/.exec(flags.get("--size") ?? "1280x720");
  if (size === null) return usage("--size needs WIDTHxHEIGHT.");
  const out = flags.get("--out");
  return {
    kind: "ok",
    page,
    at,
    width: Number(size[1]),
    height: Number(size[2]),
    ...(out === undefined ? {} : { out }),
  };
}

/** Lays captured frames into one labelled image, so a reader looks once instead of per frame. */
function sheetHtml(frames: readonly { readonly at: number; readonly path: string }[]): string {
  const cells = frames.map(({ at, path }) => {
    const data = readFileSync(path).toString("base64");
    return `<figure><img src="data:image/png;base64,${data}"><figcaption>${at} ms</figcaption></figure>`;
  });
  return `<style>
    body { margin: 0; display: grid; grid-template-columns: repeat(${SHEET_COLUMNS}, ${SHEET_CELL_WIDTH}px); gap: 4px; background: #fff; }
    figure { margin: 0; } img { width: 100%; display: block; }
    figcaption { font: 12px monospace; padding: 2px 4px; }
  </style>${cells.join("")}`;
}

/** Serves `apps/react-demo`, opens `page` under a paused fake clock, and captures it at each named time. */
export async function captureFrames(request: FramesRequest): Promise<FramesResult> {
  const { chromium } = await import("playwright-core");
  const { createServer } = await import("vite");
  const root = new URL("../../apps/react-demo/", import.meta.url).pathname.replace(
    /^\/(\w:)/,
    "$1",
  );
  const server = await createServer({ root, logLevel: "silent", server: { port: 5280 } });
  await server.listen();
  const base = server.resolvedUrls?.local[0];
  if (base === undefined) throw new Error("The frames server reported no local address.");

  const launch = async () => {
    const failures: string[] = [];
    for (const channel of CHANNELS) {
      try {
        return await chromium.launch(channel === undefined ? {} : { channel });
      } catch (error) {
        failures.push(`${channel ?? "playwright"}: ${String(error).split("\n")[0]}`);
      }
    }
    throw new Error(
      `No browser found. Install Chrome or Edge, or run npx playwright-core install chromium. ${failures.join(" ")}`,
    );
  };

  const browser = await launch();
  try {
    const page = await browser.newPage({
      viewport: { width: request.width, height: request.height },
    });
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    await page.clock.install({ time: 0 });
    await page.clock.pauseAt(1);
    await page.goto(new URL(request.page, base).href, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready.then(() => undefined));

    // Runs the first frame, whose elapsed time is zero, so `at` counts from the first published pose.
    await page.clock.runFor(FIRST_FRAME_MS);

    const out = request.out ?? mkdtempSync(join(tmpdir(), "motion-frames-"));
    mkdirSync(out, { recursive: true });
    const frames: { at: number; path: string }[] = [];
    let previous = 0;
    for (const at of request.at) {
      await page.clock.runFor(at - previous);
      previous = at;
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
    return { kind: "captured", frames, sheet, pageErrors };
  } finally {
    await browser.close();
    await server.close();
  }
}
