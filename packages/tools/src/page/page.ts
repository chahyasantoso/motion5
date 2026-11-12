import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { Browser, Page } from "playwright-core";
import { parseActions, perform, type PageAction } from "./actions";
import { unreachable } from "./unreachable";

/** Where a page comes from: a folder this tool serves, or a server already running. */
export type PageSource =
  | { readonly kind: "serve"; readonly root: string }
  | { readonly kind: "url"; readonly base: string };

/** The page a tool opens: its `page` path, stage size, `source` and the `actions` done to it at exact ms. */
export interface PageTarget {
  readonly page: string;
  readonly width: number;
  readonly height: number;
  readonly source: PageSource;
  /** What a person does to the page, and when; done with the real mouse at those exact ms. */
  readonly actions?: readonly PageAction[];
}

/** The demo app, served when no `--root` or `--url` is given. */
export const DEFAULT_ROOT = fileURLToPath(new URL("../../../../apps/pieces/", import.meta.url));
/** The page source when no `--root` or `--url` is given: the demo app folder, served. */
export const DEFAULT_SOURCE: PageSource = Object.freeze({ kind: "serve", root: DEFAULT_ROOT });

/** A path as the caller typed it, read from the folder they ran `npm run` in, not the repo root. */
export function fromCaller(path: string): string {
  return resolve(process.env.INIT_CWD ?? process.cwd(), path);
}

/** An open page and its `browser`; `advanceTo(ms)` runs the paused clock forward and must not go back. */
export interface PageSession {
  readonly page: Page;
  readonly browser: Browser;
  /** Runs the fake clock forward to `ms` after the first published pose; times must not go back. */
  advanceTo(ms: number): Promise<void>;
}

/** A page's target and the tool's own flags with their values, or the usage text. */
export type ReadArgs =
  | {
      readonly kind: "ok";
      readonly target: PageTarget;
      readonly flags: ReadonlyMap<string, string | undefined>;
    }
  | { readonly kind: "usage"; readonly message: string };

const CHANNELS = ["chrome", "msedge", undefined] as const;
const FIRST_FRAME_MS = 17;

/** Flags every page tool takes, beside its own. */
const SHARED_FLAGS = ["--size", "--root", "--url", "--action"];

/** Reads `<page> [--size WxH] [--root dir | --url address] [--action list]` plus the named flags, each with a value. */
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
    if (![...SHARED_FLAGS, ...allowed].includes(arg)) return usage(`Unknown flag ${arg}.`);
    flags.set(arg, argv[i + 1]);
    i += 1;
  }
  const page = positional[0];
  if (page === undefined || positional.length !== 1) return usage("Expected one page path.");
  if (!/^[\w./-]+(?:\?[\w.=&-]+)?$/.test(page) || page.startsWith("/") || page.includes(".."))
    return usage(
      `Page ${page} must be a path inside the site, like timing.html or stage.html?piece=saved.`,
    );
  const size = /^(\d+)x(\d+)$/.exec(flags.get("--size") ?? "1280x720");
  if (size === null) return usage("--size needs WIDTHxHEIGHT.");
  const root = flags.get("--root");
  const url = flags.get("--url");
  if (flags.has("--root") && flags.has("--url")) return usage("Pass --root or --url, not both.");
  if (flags.has("--root") && (root === undefined || root === ""))
    return usage("--root needs a folder.");
  if (flags.has("--url") && (url === undefined || !/^https?:\/\/[^\s]+$/.test(url)))
    return usage("--url needs an http or https address.");
  const actionText = flags.get("--action");
  const actions = actionText === undefined ? [] : parseActions(actionText);
  if ("reason" in actions) return usage(actions.reason);
  if (flags.has("--action") && actions.length === 0) return usage("--action needs kind:target@ms.");
  const source: PageSource =
    url !== undefined
      ? { kind: "url", base: url.endsWith("/") ? url : `${url}/` }
      : root !== undefined
        ? { kind: "serve", root: fromCaller(root) }
        : DEFAULT_SOURCE;
  return {
    kind: "ok",
    target: {
      page,
      width: Number(size[1]),
      height: Number(size[2]),
      source,
      ...(actions.length === 0 ? {} : { actions }),
    },
    flags,
  };
}

/** Replaces `Math.random` with a fixed-seed generator, so a page that scatters things scatters them alike every run. */
function seedRandom(): void {
  let state = 0x9e3779b9;
  Math.random = () => {
    state = (state + 0x6d2b79f5) | 0;
    let mixed = Math.imul(state ^ (state >>> 15), 1 | state);
    mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

/** Sets every CSS and Web Animations animation, which the fake clock skips, to the clock's time from when first seen. */
function holdAnimations(ms: number): void {
  const seen: unknown = Reflect.get(window, "__motionBorn");
  const born = seen instanceof WeakMap ? seen : new WeakMap<Animation, number>();
  Reflect.set(window, "__motionBorn", born);
  for (const animation of document.getAnimations()) {
    const start: unknown = born.get(animation);
    const from = typeof start === "number" ? start : ms;
    if (typeof start !== "number") born.set(animation, from);
    animation.pause();
    animation.currentTime = ms - from;
  }
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
    await page.addInitScript(seedRandom);
    await page.clock.install({ time: 0 });
    await page.clock.pauseAt(1);
    await page.goto(new URL(target.page, base).href, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready.then(() => undefined));
    // A page that loads its piece after the load event sets `window.__motionReady` to a promise.
    await page.evaluate(() =>
      Promise.resolve(Reflect.get(window, "__motionReady")).then(() => undefined),
    );
    // Runs the first frame, whose elapsed time is zero, so times count from the first published pose.
    await page.clock.runFor(FIRST_FRAME_MS);
    await page.evaluate(holdAnimations, 0);
    let now = 0;
    const pending = [...(target.actions ?? [])];
    const session: PageSession = {
      page,
      browser,
      async advanceTo(ms) {
        if (ms < now) throw new Error(`Time ${ms} is before ${now}; times must ascend.`);
        for (
          let action = pending[0];
          action !== undefined && action.at <= ms;
          action = pending[0]
        ) {
          pending.shift();
          await page.clock.runFor(action.at - now);
          await page.evaluate(holdAnimations, action.at);
          await perform(page, action);
          now = action.at;
        }
        await page.clock.runFor(ms - now);
        await page.evaluate(holdAnimations, ms);
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
