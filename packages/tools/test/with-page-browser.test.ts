import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { Browser } from "playwright-core";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { launchBrowser, withPage } from "../src/page/page";
import { removeTemp } from "../../../test/support/temp";

const dir = mkdtempSync(join(tmpdir(), "gerak-with-page-browser-"));
let browser: Browser;

beforeAll(async () => {
  writeFileSync(join(dir, "sample.html"), "<!doctype html><html><body><p>hi</p></body></html>");
  browser = await launchBrowser({ headless: true });
});

afterAll(async () => {
  await browser.close();
  removeTemp(dir);
});

describe("withPage with a given browser", () => {
  it("closes its own page and leaves the browser connected, visit after visit", async () => {
    for (let round = 0; round < 2; round += 1) {
      const { value } = await withPage(
        {
          page: "sample.html",
          width: 200,
          height: 100,
          source: { kind: "serve", root: dir },
          browser,
        },
        async ({ page, browser: used }) => ({ used, text: await page.textContent("p") }),
      );
      expect(value.used).toBe(browser);
      expect(value.text).toBe("hi");
      expect(browser.isConnected()).toBe(true);
      expect(browser.contexts().flatMap((context) => context.pages())).toEqual([]);
    }
  }, 60_000);
});
