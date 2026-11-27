import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Browser, Page } from "playwright-core";
import { afterEach, describe, expect, it } from "vitest";
import { removeTemp } from "../../../test/support/temp";
import { comparePage } from "../src/page/compare";
import { captureFrames, captureOnion } from "../src/page/frames";
import { openSite, withPage, type SiteServer } from "../src/page/page";
import { encodePng } from "../src/page/png";

const FIXTURES = fileURLToPath(new URL("./fixtures/compare", import.meta.url));
const PNG = Buffer.from(encodePng({ width: 10, height: 10, rgb: new Uint8Array(10 * 10 * 3) }));
const URL_SOURCE = { kind: "url", base: "http://127.0.0.1/" } as const;

interface FakePageOptions {
  readonly evaluate?: (fn: unknown, arg?: unknown) => Promise<unknown>;
  readonly screenshot?: (options?: unknown) => Promise<Buffer>;
  readonly setContent?: (html: string, options?: unknown) => Promise<void>;
  readonly clockRunFor?: (ms: number) => Promise<void>;
}

interface FakeBrowser {
  readonly browser: Browser;
  readonly openPages: Set<number>;
  readonly closeErrors: Error[];
}

function makeFakeBrowser(
  configurePage?: (index: number) => FakePageOptions,
  closeBrowser?: () => Promise<void>,
): FakeBrowser {
  const openPages = new Set<number>();
  const closeErrors: Error[] = [];
  let nextId = 1;

  const browser = {
    async newPage(): Promise<Page> {
      const id = nextId;
      nextId += 1;
      openPages.add(id);
      const opts = configurePage?.(id) ?? {};
      const page = {
        on: () => page,
        addInitScript: async () => undefined,
        clock: {
          install: async () => undefined,
          pauseAt: async () => undefined,
          runFor: async (ms: number) => {
            if (opts.clockRunFor !== undefined) await opts.clockRunFor(ms);
          },
        },
        goto: async () => ({ status: () => 200 }),
        setViewportSize: async () => undefined,
        setContent: async (html: string, options?: unknown) => {
          if (opts.setContent !== undefined) await opts.setContent(html, options);
        },
        $$eval: async () => [{ x: 0, y: 0, width: 10, height: 10 }],
        evaluate: async (fn: unknown, arg?: unknown) => {
          if (opts.evaluate !== undefined) return await opts.evaluate(fn, arg);
          return false;
        },
        screenshot: async (options?: unknown) => {
          if (opts.screenshot !== undefined) return await opts.screenshot(options);
          return PNG;
        },
        context: () => ({
          newCDPSession: async () => ({
            send: async () => ({ data: PNG.toString("base64") }),
          }),
        }),
        close: async () => {
          openPages.delete(id);
        },
      };
      // Playwright's Page interface has over a hundred methods; this fake implements the subset page tools call.
      return page as unknown as Page;
    },
    async close(): Promise<void> {
      if (closeBrowser !== undefined) await closeBrowser();
    },
  };

  return { browser: browser as unknown as Browser, openPages, closeErrors };
}

const tempDirs: string[] = [];
function tempOut(): string {
  const dir = mkdtempSync(join(tmpdir(), "gerak-page-leaks-"));
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) removeTemp(dir);
});

describe("page resource cleanup", () => {
  it("captureFrames closes scaler and sheetPage on success", async () => {
    const { browser, openPages } = makeFakeBrowser((id) => ({
      evaluate: async () => (id === 2 ? `data:image/png;base64,${PNG.toString("base64")}` : false),
    }));

    await captureFrames({
      page: "index.html",
      width: 100,
      height: 100,
      source: URL_SOURCE,
      browser,
      at: [0],
      crop: { x: 0, y: 0, width: 10, height: 10 },
      zoom: 2,
      out: tempOut(),
    });

    expect(openPages.size).toBe(0);
  });

  it("captureFrames closes scaler when enlarge throws", async () => {
    const { browser, openPages } = makeFakeBrowser((id) => ({
      evaluate: async () => {
        if (id === 2) throw new Error("enlarge boom");
        return false;
      },
    }));

    await expect(
      captureFrames({
        page: "index.html",
        width: 100,
        height: 100,
        source: URL_SOURCE,
        browser,
        at: [0],
        crop: { x: 0, y: 0, width: 10, height: 10 },
        zoom: 2,
        out: tempOut(),
      }),
    ).rejects.toThrow("enlarge boom");

    expect(openPages.size).toBe(0);
  });

  it("captureFrames closes sheetPage when screenshot throws", async () => {
    const { browser, openPages } = makeFakeBrowser((id) => ({
      screenshot: async () => {
        if (id === 2) throw new Error("sheet screenshot boom");
        return PNG;
      },
    }));

    await expect(
      captureFrames({
        page: "index.html",
        width: 100,
        height: 100,
        source: URL_SOURCE,
        browser,
        at: [0],
        out: tempOut(),
      }),
    ).rejects.toThrow("sheet screenshot boom");

    expect(openPages.size).toBe(0);
  });

  it("captureOnion closes canvasPage on success and on error", async () => {
    const ok = makeFakeBrowser((id) => ({
      evaluate: async () => (id === 2 ? `data:image/png;base64,${PNG.toString("base64")}` : false),
    }));

    await captureOnion({
      page: "index.html",
      width: 100,
      height: 100,
      source: URL_SOURCE,
      browser: ok.browser,
      select: ".dot",
      from: 0,
      to: 0,
      every: 16,
      out: tempOut(),
    });
    expect(ok.openPages.size).toBe(0);

    const failing = makeFakeBrowser((id) => ({
      evaluate: async () => {
        if (id === 2) throw new Error("onion evaluate boom");
        return false;
      },
    }));

    await expect(
      captureOnion({
        page: "index.html",
        width: 100,
        height: 100,
        source: URL_SOURCE,
        browser: failing.browser,
        select: ".dot",
        from: 0,
        to: 0,
        every: 16,
        out: tempOut(),
      }),
    ).rejects.toThrow("onion evaluate boom");
    expect(failing.openPages.size).toBe(0);
  });

  it("comparePage closes sheet on success, early usage return, and error", async () => {
    const makeCompareBrowser = (sheetOutcome: "ok" | "decode-fail" | "throw") => {
      return makeFakeBrowser((id) => ({
        evaluate: async (fn) => {
          if (id === 2) return sheetOutcome !== "decode-fail";
          if (typeof fn === "function" && fn.name === "readFrameSize")
            return { width: 10, height: 10 };
          if (typeof fn === "function" && fn.name === "readStageBoxes")
            return { frame: { x: 0, y: 0, width: 10, height: 10 }, members: [] };
          return false;
        },
        screenshot: async () => {
          if (id === 2 && sheetOutcome === "throw") throw new Error("compare screenshot boom");
          return PNG;
        },
      }));
    };

    const reference = join(FIXTURES, "same.svg");

    const ok = makeCompareBrowser("ok");
    const okResult = await comparePage({
      page: "stage.html",
      width: 100,
      height: 100,
      source: URL_SOURCE,
      browser: ok.browser,
      at: 0,
      reference,
      out: tempOut(),
    });
    expect(okResult.kind).toBe("compared");
    expect(ok.openPages.size).toBe(0);

    const early = makeCompareBrowser("decode-fail");
    const earlyResult = await comparePage({
      page: "stage.html",
      width: 100,
      height: 100,
      source: URL_SOURCE,
      browser: early.browser,
      at: 0,
      reference,
      out: tempOut(),
    });
    expect(earlyResult.kind).toBe("usage");
    expect(early.openPages.size).toBe(0);

    const failing = makeCompareBrowser("throw");
    await expect(
      comparePage({
        page: "stage.html",
        width: 100,
        height: 100,
        source: URL_SOURCE,
        browser: failing.browser,
        at: 0,
        reference,
        out: tempOut(),
      }),
    ).rejects.toThrow("compare screenshot boom");
    expect(failing.openPages.size).toBe(0);
  });

  it("openSite closes the server when listen throws", async () => {
    let closed = false;
    const server: SiteServer = {
      resolvedUrls: null,
      listen: async () => {
        throw new Error("listen boom");
      },
      close: async () => {
        closed = true;
      },
    };

    await expect(openSite({ kind: "serve", root: FIXTURES }, async () => server)).rejects.toThrow(
      "listen boom",
    );
    expect(closed).toBe(true);
  });

  it("withPage closes the site when browser.close() rejects, and rethrows that rejection", async () => {
    let siteClosed = false;
    const { browser } = makeFakeBrowser(undefined, async () => {
      throw new Error("browser close boom");
    });

    await expect(
      withPage(
        { page: "index.html", width: 100, height: 100, source: URL_SOURCE },
        async () => "ok",
        {
          openSite: async () => ({
            base: "http://127.0.0.1/",
            close: async () => {
              siteClosed = true;
            },
          }),
          launchBrowser: async () => browser,
        },
      ),
    ).rejects.toThrow("browser close boom");

    expect(siteClosed).toBe(true);
  });
});
