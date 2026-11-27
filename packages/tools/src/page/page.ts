import { resolve } from "node:path";
import type { Browser, CDPSession, Page } from "playwright-core";
import { parseActions, perform, type PageAction } from "./actions";
import { callerDir, piecesRoot } from "./root";
import { pageServerConfig } from "./server";
import { unreachable } from "./unreachable";

/** A viewport width and height in CSS px. */
export interface ViewportSize {
  readonly width: number;
  readonly height: number;
}

/** Formats `size` as `WIDTHxHEIGHT`. */
export function formatSize(size: ViewportSize): string {
  return `${size.width}x${size.height}`;
}

/** Parses `--sizes WIDTHxHEIGHT,...`, or returns why the value is malformed. */
export function parseSizes(text: string | undefined): readonly ViewportSize[] | string {
  if (text === undefined || text.trim() === "")
    return "--sizes needs one or more WIDTHxHEIGHT entries.";
  const seen = new Set<string>();
  const sizes: ViewportSize[] = [];
  for (const part of text.split(",")) {
    const trimmed = part.trim();
    const match = /^(\d+)x(\d+)$/.exec(trimmed);
    if (match === null) return `--sizes needs WIDTHxHEIGHT entries, not "${trimmed}".`;
    const width = Number(match[1]);
    const height = Number(match[2]);
    if (!(width > 0 && height > 0)) return `--sizes dimensions must be above 0, not "${trimmed}".`;
    const label = `${width}x${height}`;
    if (seen.has(label)) return `--sizes duplicate entry "${label}".`;
    seen.add(label);
    sizes.push({ width, height });
  }
  return sizes;
}

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
  /** "paused" (default) runs a fake clock the tool steps; "real" lets the page run on the machine's own clock. */
  readonly clock?: "paused" | "real";
  /** Opens a visible browser window instead of a headless one; false by default. */
  readonly show?: boolean;
  /** Runs on the new page before it loads, for init scripts. */
  readonly prepare?: (page: Page) => Promise<void>;
  /** An open browser to use; the tool closes only its own pages, never this browser. */
  readonly browser?: Browser;
}

/** A path as the caller typed it, read from the folder they ran the command in, not the repo root. */
export function fromCaller(path: string): string {
  return resolve(callerDir(), path);
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
const MEDIA_SETTLE_TIMEOUT_MS = 5000;

/** Flags every page tool takes, beside its own. */
const SHARED_FLAGS = ["--size", "--root", "--url", "--action"];

/** Reads `<page> [--size WxH] [--root dir | --url address] [--action list]` plus the named flags, each with a value. */
export function readPageArgs(argv: readonly string[], allowed: readonly string[]): ReadArgs {
  const usage = (message: string): ReadArgs => ({ kind: "usage", message });
  const positional: string[] = [];
  const flags = new Map<string, string | undefined>();
  const rawActions: (string | undefined)[] = [];
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === undefined) continue;
    if (!arg.startsWith("--")) {
      positional.push(arg);
      continue;
    }
    if (![...SHARED_FLAGS, ...allowed].includes(arg)) return usage(`Unknown flag ${arg}.`);
    if (arg === "--action") rawActions.push(argv[i + 1]);
    else flags.set(arg, argv[i + 1]);
    i += 1;
  }
  const page = positional[0];
  if (page === undefined || positional.length !== 1) return usage("Expected one page path.");
  if (!/^[\w./-]+(?:\?[\w.=&-]+)?$/.test(page) || page.startsWith("/") || page.includes(".."))
    return usage(
      `Page ${page} must be a path inside the site, like timing.html or saved/saved.html.`,
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
  if (rawActions.some((entry) => entry === undefined || entry.trim() === ""))
    return usage("--action needs kind:target@ms.");
  const actionText =
    rawActions.length === 0
      ? undefined
      : rawActions.filter((entry) => entry !== undefined).join(",");
  if (actionText !== undefined) flags.set("--action", actionText);
  const actions = actionText === undefined ? [] : parseActions(actionText);
  if ("reason" in actions) return usage(actions.reason);
  if (rawActions.length > 0 && actions.length === 0) return usage("--action needs kind:target@ms.");
  let source: PageSource;
  if (url !== undefined) source = { kind: "url", base: url.endsWith("/") ? url : `${url}/` };
  else {
    const found = piecesRoot(callerDir(), root);
    if (found.kind === "missing") return usage(found.message);
    source = { kind: "serve", root: found.root };
  }
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

/** Steps held/hosted drivers and holds CSS and Web Animations on the document timeline at `ms`. */
function stepAndHoldAnimations(ms: number): void {
  const stepDriver: unknown = Reflect.get(globalThis, Symbol.for("@gerak/dom/tool-step"));
  if (typeof stepDriver === "function") Reflect.apply(stepDriver, undefined, [ms]);
  const step: unknown = Reflect.get(globalThis, Symbol.for("@gerak/dom/held-step"));
  if (typeof step === "function") Reflect.apply(step, undefined, []);
  const seen: unknown = Reflect.get(window, "__motionBorn");
  const born = seen instanceof WeakMap ? seen : new WeakMap<Animation, number>();
  Reflect.set(window, "__motionBorn", born);
  for (const animation of document.getAnimations()) {
    // Scroll-timeline animations follow scripted scroll directly rather than document time.
    if (animation.timeline !== document.timeline) continue;
    const start: unknown = born.get(animation);
    const from = typeof start === "number" ? start : ms;
    if (typeof start !== "number") born.set(animation, from);
    animation.pause();
    animation.currentTime = ms - from;
  }
}

interface PageCdp {
  readonly session: CDPSession;
  world: Promise<number> | undefined;
}

const pageCdps = new WeakMap<Page, Promise<PageCdp>>();

/** Returns the cached CDP session and isolated-world state for `page`. */
function pageCdp(page: Page): Promise<PageCdp> {
  let pending = pageCdps.get(page);
  if (pending === undefined) {
    pending = page
      .context()
      .newCDPSession(page)
      .then((session): PageCdp => ({ session, world: undefined }))
      .catch((error: unknown) => {
        pageCdps.delete(page);
        throw error;
      });
    pageCdps.set(page, pending);
  }
  return pending;
}

/** Waits for one real rendered frame through an isolated world unaffected by the held clock. */
async function waitForRealFrame(page: Page): Promise<void> {
  const entry = await pageCdp(page);
  if (entry.world === undefined) {
    entry.world = (async () => {
      const { frameTree } = await entry.session.send("Page.getFrameTree");
      const { executionContextId } = await entry.session.send("Page.createIsolatedWorld", {
        frameId: frameTree.frame.id,
        worldName: "gerak-frame",
      });
      return executionContextId;
    })().catch((error: unknown) => {
      entry.world = undefined;
      throw error;
    });
  }
  const contextId = await entry.world;
  const { exceptionDetails } = await entry.session.send("Runtime.evaluate", {
    contextId,
    awaitPromise: true,
    expression: "new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))",
  });
  if (exceptionDetails !== undefined) throw new Error(exceptionDetails.text);
}

/** Captures the viewport as a lossless PNG using Chromium's fast-encode path. */
export async function captureFrame(page: Page): Promise<Buffer> {
  const { session } = await pageCdp(page);
  const { data } = await session.send("Page.captureScreenshot", {
    format: "png",
    optimizeForSpeed: true,
  });
  return Buffer.from(data, "base64");
}

/** Opens one page, configures the clock, and runs frame 0. */
async function openPageSession(
  browser: Browser,
  base: string,
  target: PageTarget,
  opened: (page: Page) => void,
): Promise<{ readonly session: PageSession; readonly pageErrors: readonly string[] }> {
  const page = await browser.newPage({
    viewport: { width: target.width, height: target.height },
  });
  opened(page);
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.addInitScript(seedRandom);
  const real = target.clock === "real";
  if (target.prepare !== undefined) await target.prepare(page);
  if (!real) {
    // Keep gerak elements in the synchronous engine under HELD_CLOCK while stepping hosted live drivers deterministically.
    await page.addInitScript(() => {
      Reflect.set(globalThis, Symbol.for("@gerak/dom/held-clock"), true);
      let currentMs = 0;
      const listeners = new Set<() => void>();
      interface HeldEntry {
        readonly kind: "value" | "trigger";
        readonly name: string;
        readonly at: number;
        readonly value: number;
        readonly target?: string;
      }
      let entries: HeldEntry[] = [];
      const latestValues = new Map<string, number>();
      const insertEntry = (entry: HeldEntry): void => {
        let index = entries.length;
        while (index > 0 && (entries[index - 1]?.at ?? 0) > entry.at) index -= 1;
        entries = [...entries.slice(0, index), entry, ...entries.slice(index)];
      };
      const sharedDriver = {
        now: () => ({ progress: 0, clock: { kind: "live" as const, elapsed: currentMs } }),
        input: () => entries,
        set: (_contract: unknown, name: string, value: number, target?: string) => {
          const key = `${name}\0${target ?? ""}`;
          if (Object.is(latestValues.get(key), value)) return;
          latestValues.set(key, value);
          insertEntry({
            kind: "value",
            name,
            at: currentMs,
            value,
            ...(target === undefined ? {} : { target }),
          });
        },
        trigger: (_contract: unknown, name: string, value = 1, target?: string) => {
          insertEntry({
            kind: "trigger",
            name,
            at: currentMs,
            value,
            ...(target === undefined ? {} : { target }),
          });
        },
        subscribe(listener: () => void) {
          listeners.add(listener);
          return () => {
            listeners.delete(listener);
          };
        },
      };
      Reflect.set(globalThis, Symbol.for("@gerak/dom/driver"), () => sharedDriver);
      Reflect.set(globalThis, Symbol.for("@gerak/dom/tool-step"), (ms: number) => {
        currentMs = ms;
        for (const listener of [...listeners]) listener();
      });
    });
    await page.clock.install({ time: 0 });
    // A pause a second ahead outruns a busy machine; story time counts from the first frame, not from here.
    await page.clock.pauseAt(1000);
  }
  const url = new URL(target.page, base).href;
  // Chromium rejects `goto` on an error status with an empty body, so the status is read as it arrives.
  let answered: number | undefined;
  page.on("response", (reply) => {
    if (reply.url() === url && reply.request().isNavigationRequest()) answered = reply.status();
  });
  const response = await page.goto(url, { waitUntil: "load" }).catch((error: unknown) => {
    if (answered === undefined || answered < 400) throw error;
    return null;
  });
  const status = response === null ? answered : response.status();
  if (status === undefined || status >= 400)
    throw new Error(
      `Page ${target.page} answered ${status === undefined ? "no response" : status} from ${url}.`,
    );
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  // A page that loads its piece after the load event sets `window.__motionReady` to a promise.
  const readyError = await page.evaluate(async () => {
    try {
      await Promise.resolve(Reflect.get(window, "__motionReady"));
      return undefined;
    } catch (error) {
      return error instanceof Error ? error.message : String(error);
    }
  });
  if (readyError !== undefined && !pageErrors.includes(readyError)) pageErrors.push(readyError);
  let reportedMediaTimeout = false;
  const settleMedia = async (atMs: number): Promise<void> => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let timedOut = false;
    const settled = page.evaluate(async () => {
      const listed: unknown = Reflect.get(globalThis, Symbol.for("@gerak/dom/mounts"));
      if (!Array.isArray(listed) || listed.length === 0) return false;
      const pending: Promise<unknown>[] = [];
      let hasMedia = false;
      for (const mounted of listed) {
        if (mounted === null || typeof mounted !== "object") continue;
        const fn: unknown = Reflect.get(mounted, "settled");
        if (typeof fn === "function") {
          pending.push(Promise.resolve(Reflect.apply(fn, mounted, [])));
        }
        const media: unknown = Reflect.get(mounted, "media");
        if (typeof media === "function") {
          const items: unknown = Reflect.apply(media, mounted, []);
          if (Array.isArray(items) && items.length > 0) hasMedia = true;
        }
      }
      if (pending.length > 0) await Promise.all(pending);
      return hasMedia;
    });
    // Ignore rejections caused by closing the page after a settle timeout.
    const raced = settled.then(
      (hasMedia) => ({ kind: "settled" as const, hasMedia }),
      (error: unknown) => {
        if (timedOut) return { kind: "settled" as const, hasMedia: false };
        throw error;
      },
    );
    let hasMedia = false;
    try {
      const outcome = await Promise.race([
        raced,
        new Promise<{ readonly kind: "timeout" }>((resolve) => {
          timer = setTimeout(() => {
            timedOut = true;
            resolve({ kind: "timeout" });
          }, MEDIA_SETTLE_TIMEOUT_MS);
        }),
      ]);
      switch (outcome.kind) {
        case "timeout":
          if (!reportedMediaTimeout) {
            reportedMediaTimeout = true;
            pageErrors.push(`Media did not finish seeking at ${atMs} ms.`);
          }
          break;
        case "settled":
          hasMedia = outcome.hasMedia;
          break;
        default:
          return unreachable(outcome);
      }
    } finally {
      if (timer !== undefined) clearTimeout(timer);
    }
    if (hasMedia) await waitForRealFrame(page);
  };
  const runHeldTo = async (delta: number, atMs: number): Promise<void> => {
    await page.clock.runFor(delta);
    await page.evaluate(stepAndHoldAnimations, atMs);
  };
  // Runs the first frame, whose elapsed time is zero, so times count from the first published pose.
  if (!real) {
    await runHeldTo(FIRST_FRAME_MS, 0);
    await settleMedia(0);
  }
  const began = Date.now();
  let now = 0;
  const pending = [...(target.actions ?? [])];
  const session: PageSession = {
    page,
    browser,
    async advanceTo(ms) {
      if (ms < now) throw new Error(`Time ${ms} is before ${now}; times must ascend.`);
      if (real) {
        for (
          let action = pending[0];
          action !== undefined && action.at <= ms;
          action = pending[0]
        ) {
          pending.shift();
          await waitUntil(began + action.at);
          await perform(page, action, "real");
        }
        await waitUntil(began + ms);
        now = ms;
        return;
      }
      for (let action = pending[0]; action !== undefined && action.at <= ms; action = pending[0]) {
        pending.shift();
        await runHeldTo(action.at - now, action.at);
        await perform(page, action, "held");
        now = action.at;
      }
      await runHeldTo(ms - now, ms);
      now = ms;
      await settleMedia(ms);
    },
  };
  return { session, pageErrors };
}

/** Serves or reaches the page's site, opens the page under a paused fake clock, and hands it to `visit`. */
export async function withPage<T>(
  target: PageTarget,
  visit: (session: PageSession) => Promise<T>,
): Promise<{ readonly value: T; readonly pageErrors: readonly string[] }> {
  const site = await openSite(target.source);
  const base = site.base;
  let browser: Browser;
  try {
    browser = target.browser ?? (await launchBrowser({ headless: target.show !== true }));
  } catch (error) {
    await site.close();
    throw error;
  }
  let opened: Page | undefined;
  try {
    const { session, pageErrors } = await openPageSession(browser, base, target, (page) => {
      opened = page;
    });
    const value = await visit(session);
    return { value, pageErrors };
  } finally {
    if (target.browser === undefined) await browser.close();
    else await closeQuietly(opened);
    await site.close();
  }
}

/** Closes `page` if there is one, ignoring a page that is already gone. */
async function closeQuietly(page: Page | undefined): Promise<void> {
  if (page === undefined) return;
  await page.close().catch(() => undefined);
}

/** Launches Chromium through Chrome, Edge, then Playwright's own build, and throws when none starts. */
export async function launchBrowser(options: { readonly headless: boolean }): Promise<Browser> {
  const { chromium } = await import("playwright-core");
  const { headless } = options;
  const failures: string[] = [];
  for (const channel of CHANNELS) {
    try {
      return await chromium.launch(channel === undefined ? { headless } : { channel, headless });
    } catch (error) {
      failures.push(`${channel ?? "playwright"}: ${String(error).split("\n")[0]}`);
    }
  }
  throw new Error(
    `No browser found. Install Chrome or Edge, or run npx playwright-core install chromium. ${failures.join(" ")}`,
  );
}

/** Waits in real time until the machine's clock reads `at` ms. */
async function waitUntil(at: number): Promise<void> {
  const left = at - Date.now();
  if (left > 0) await new Promise<void>((done) => setTimeout(done, left));
}

/** Starts an ephemeral local server for `source` when serving, returning its `base` URL and `close`. */
export async function openSite(
  source: PageSource,
): Promise<{ readonly base: string; close(): Promise<void> }> {
  switch (source.kind) {
    case "url":
      return { base: source.base, close: async () => undefined };
    case "serve": {
      const { createServer } = await import("vite");
      const added = await pageServerConfig(source.root);
      const server = await createServer({
        root: source.root,
        logLevel: "silent",
        appType: "mpa",
        plugins: added.plugins,
        optimizeDeps: added.optimizeDeps,
        server: { ...added.server, port: 0 },
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
