import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { Browser, Page } from "playwright-core";
import { unreachable } from "@motion5/core/plugin-api";

/** Where a page comes from: a folder this tool serves, or a server already running. */
export type PageSource =
  | { readonly kind: "serve"; readonly root: string }
  | { readonly kind: "url"; readonly base: string };

export interface PageTarget {
  readonly page: string;
  readonly width: number;
  readonly height: number;
  readonly source: PageSource;
}

/** The demo app, served when no `--root` or `--url` is given. */
export const DEFAULT_ROOT = fileURLToPath(new URL("../../apps/react-demo/", import.meta.url));
export const DEFAULT_SOURCE: PageSource = Object.freeze({ kind: "serve", root: DEFAULT_ROOT });

/** A path as the caller typed it, read from the folder they ran `npm run` in, not the repo root. */
export function fromCaller(path: string): string {
  return resolve(process.env.INIT_CWD ?? process.cwd(), path);
}

export interface PageSession {
  readonly page: Page;
  readonly browser: Browser;
  /** Runs the fake clock forward to `ms` after the first published pose; times must not go back. */
  advanceTo(ms: number): Promise<void>;
}

export type ReadArgs =
  | {
      readonly kind: "ok";
      readonly target: PageTarget;
      readonly flags: ReadonlyMap<string, string | undefined>;
    }
  | { readonly kind: "usage"; readonly message: string };

const CHANNELS = ["chrome", "msedge", undefined] as const;
const FIRST_FRAME_MS = 17;

/** Reads `<page> [--size WxH] [--root dir | --url address]` plus the named flags, each taking one value. */
export function readPageArgs(argv: readonly string[], allowed: readonly string[]): ReadArgs {
  const usage = (message: string): ReadArgs => ({ kind: "usage", message });
  const positional: string[] = [];
  const flags = new Map<string, string | undefined>();
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]!;
    if (!arg.startsWith("--")) {
      positional.push(arg);
      continue;
    }
    if (arg !== "--size" && arg !== "--root" && arg !== "--url" && !allowed.includes(arg))
      return usage(`Unknown flag ${arg}.`);
    flags.set(arg, argv[i + 1]);
    i += 1;
  }
  const page = positional[0];
  if (page === undefined || positional.length !== 1) return usage("Expected one page path.");
  if (!/^[\w./-]+$/.test(page) || page.startsWith("/") || page.includes(".."))
    return usage(`Page ${page} must be a path inside the site, like timing.html.`);
  const size = /^(\d+)x(\d+)$/.exec(flags.get("--size") ?? "1280x720");
  if (size === null) return usage("--size needs WIDTHxHEIGHT.");
  const root = flags.get("--root");
  const url = flags.get("--url");
  if (flags.has("--root") && flags.has("--url")) return usage("Pass --root or --url, not both.");
  if (flags.has("--root") && (root === undefined || root === ""))
    return usage("--root needs a folder.");
  if (flags.has("--url") && (url === undefined || !/^https?:\/\/[^\s]+$/.test(url)))
    return usage("--url needs an http or https address.");
  const source: PageSource =
    url !== undefined
      ? { kind: "url", base: url.endsWith("/") ? url : `${url}/` }
      : root !== undefined
        ? { kind: "serve", root: fromCaller(root) }
        : DEFAULT_SOURCE;
  return {
    kind: "ok",
    target: { page, width: Number(size[1]), height: Number(size[2]), source },
    flags,
  };
}

/** Serves or reaches the page's site, opens the page under a paused fake clock, and hands it to `visit`. */
export async function withPage<T>(
  target: PageTarget,
  visit: (session: PageSession) => Promise<T>,
): Promise<{ readonly value: T; readonly pageErrors: readonly string[] }> {
  const { chromium } = await import("playwright-core");
  const site = await openSite(target.source);
  const base = site.base;

  const failures: string[] = [];
  let browser: Browser | undefined;
  for (const channel of CHANNELS) {
    try {
      browser = await chromium.launch(channel === undefined ? {} : { channel });
      break;
    } catch (error) {
      failures.push(`${channel ?? "playwright"}: ${String(error).split("\n")[0]}`);
    }
  }
  if (browser === undefined) {
    await site.close();
    throw new Error(
      `No browser found. Install Chrome or Edge, or run npx playwright-core install chromium. ${failures.join(" ")}`,
    );
  }
  try {
    const page = await browser.newPage({
      viewport: { width: target.width, height: target.height },
    });
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    await page.clock.install({ time: 0 });
    await page.clock.pauseAt(1);
    await page.goto(new URL(target.page, base).href, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready.then(() => undefined));
    // Runs the first frame, whose elapsed time is zero, so times count from the first published pose.
    await page.clock.runFor(FIRST_FRAME_MS);
    let now = 0;
    const session: PageSession = {
      page,
      browser,
      async advanceTo(ms) {
        if (ms < now) throw new Error(`Time ${ms} is before ${now}; times must ascend.`);
        await page.clock.runFor(ms - now);
        now = ms;
      },
    };
    const value = await visit(session);
    return { value, pageErrors };
  } finally {
    await browser.close();
    await site.close();
  }
}

/** A base address for the source, and how to release whatever was started for it. */
async function openSite(
  source: PageSource,
): Promise<{ readonly base: string; close(): Promise<void> }> {
  switch (source.kind) {
    case "url":
      return { base: source.base, close: async () => undefined };
    case "serve": {
      const { createServer } = await import("vite");
      const server = await createServer({
        root: source.root,
        logLevel: "silent",
        server: { port: 5280 },
      });
      await server.listen();
      const base = server.resolvedUrls?.local[0];
      if (base === undefined) {
        await server.close();
        throw new Error("The page server reported no local address.");
      }
      return { base, close: () => server.close() };
    }
    default:
      return unreachable(source);
  }
}
