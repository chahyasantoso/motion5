import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { measureFps } from "../src/page/fps";
import { withPage } from "../src/page/page";

const COMPOSITOR_FIXTURES = fileURLToPath(new URL("./fixtures/compositor/", import.meta.url));

describe("measureFps with --action on a real clock", () => {
  it("executes real-clock actions at their scheduled times on the page", async () => {
    const { value, pageErrors } = await withPage(
      {
        page: "scroll.html",
        width: 800,
        height: 600,
        source: { kind: "serve", root: COMPOSITOR_FIXTURES },
        clock: "real",
        actions: [
          { kind: "scroll", target: { kind: "px", px: 700 }, at: 50 },
          { kind: "click", selector: "#bar", at: 150 },
        ],
      },
      async ({ page, advanceTo }) => {
        await page.evaluate(() => {
          let clicks = 0;
          document.querySelector("#bar")?.addEventListener("click", () => {
            clicks += 1;
            Reflect.set(globalThis, "__barClicks", clicks);
          });
        });
        await advanceTo(300);
        return page.evaluate(() => ({
          scrollY: window.scrollY,
          clicks: Number(Reflect.get(globalThis, "__barClicks") ?? 0),
        }));
      },
    );
    expect(pageErrors).toEqual([]);
    expect(value).toEqual({ scrollY: 700, clicks: 1 });
  }, 120000);

  it("runs actions during real-clock fps capture and rejects missing selectors", async () => {
    const report = await measureFps({
      kind: "fps",
      page: "scroll.html",
      width: 800,
      height: 600,
      source: { kind: "serve", root: COMPOSITOR_FIXTURES },
      to: 600,
      show: false,
      actions: [
        { kind: "scroll", target: { kind: "px", px: 700 }, at: 100 },
        { kind: "click", selector: "#bar", at: 250 },
      ],
    });
    expect(report.pageErrors).toEqual([]);
    expect(report.windows.length).toBeGreaterThan(0);

    await expect(
      measureFps({
        kind: "fps",
        page: "scroll.html",
        width: 800,
        height: 600,
        source: { kind: "serve", root: COMPOSITOR_FIXTURES },
        to: 300,
        show: false,
        actions: [{ kind: "click", selector: "#no-such-element", at: 50 }],
      }),
    ).rejects.toThrow(/#no-such-element/);
  }, 120000);
});
