import type { Browser, Page } from "playwright-core";

export interface PageTarget {
  readonly page: string;
  readonly width: number;
  readonly height: number;
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

/** Reads `<page> [--size WxH]` plus the named flags, each taking one value. */
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
    if (arg !== "--size" && !allowed.includes(arg)) return usage(`Unknown flag ${arg}.`);
    flags.set(arg, argv[i + 1]);
    i += 1;
  }
  const page = positional[0];
  if (page === undefined || positional.length !== 1) return usage("Expected one page path.");
  if (!/^[\w./-]+\.html$/.test(page) || page.startsWith("/") || page.includes(".."))
    return usage(`Page ${page} must be an .html path inside the app, like timing.html.`);
  const size = /^(\d+)x(\d+)$/.exec(flags.get("--size") ?? "1280x720");
  if (size === null) return usage("--size needs WIDTHxHEIGHT.");
  return {
    kind: "ok",
    target: { page, width: Number(size[1]), height: Number(size[2]) },
    flags,
  };
}

/** Serves `apps/react-demo`, opens the page under a paused fake clock, and hands it to `visit`. */
export async function withPage<T>(
  target: PageTarget,
  visit: (session: PageSession) => Promise<T>,
): Promise<{ readonly value: T; readonly pageErrors: readonly string[] }> {
  const { chromium } = await import("playwright-core");
  const { createServer } = await import("vite");
  const root = new URL("../../apps/react-demo/", import.meta.url).pathname.replace(
    /^\/(\w:)/,
    "$1",
  );
  const server = await createServer({ root, logLevel: "silent", server: { port: 5280 } });
  await server.listen();
  const base = server.resolvedUrls?.local[0];
  if (base === undefined) throw new Error("The page server reported no local address.");

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
    await server.close();
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
    await server.close();
  }
}
