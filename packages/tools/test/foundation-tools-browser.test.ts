import { mkdirSync, mkdtempSync, rmdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { openSite, withPage } from "../src/page/page";
import { removeTemp } from "../../../test/support/temp";

const dirs: string[] = [];
const SCAFFOLD = join(process.cwd(), "apps/pieces/.scaffold");

function tempDir(prefix: string): string {
  mkdirSync(SCAFFOLD, { recursive: true });
  const dir = mkdtempSync(join(SCAFFOLD, prefix));
  dirs.push(dir);
  writeFileSync(join(dir, "vite.config.ts"), 'export { default } from "../../vite.config";\n');
  return dir;
}

afterEach(() => {
  for (const dir of dirs.splice(0)) removeTemp(dir);
  try {
    rmdirSync(SCAFFOLD);
  } catch {
    // Another test directory may still exist.
  }
});

describe("Slice 5 browser/server foundation: port 0 and DRIVER_HOOK in page tools", () => {
  it("opens concurrent static/Vite sites on distinct ephemeral port 0 endpoints", async () => {
    const dirA = tempDir("site-a-");
    const dirB = tempDir("site-b-");
    writeFileSync(join(dirA, "a.html"), "<!doctype html><html><body>A</body></html>");
    writeFileSync(join(dirB, "b.html"), "<!doctype html><html><body>B</body></html>");

    const siteA = await openSite({ kind: "serve", root: dirA });
    const siteB = await openSite({ kind: "serve", root: dirB });
    try {
      expect(new URL(siteA.base).port).not.toBe(new URL(siteB.base).port);
      expect(new URL(siteA.base).port).not.toBe("5280");
    } finally {
      await siteA.close();
      await siteB.close();
    }
  }, 60000);

  it("drives live mounts via DRIVER_HOOK while keeping held tools synchronous and non-held hosted drivers composited", async () => {
    const dir = tempDir("driver-hook-");
    writeFileSync(
      join(dir, "live.html"),
      `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body { margin: 0; height: 2400px; }
      [data-cast="card"] { position: fixed; left: 20px; top: 20px; width: 80px; height: 40px; background: #fff; }
    </style>
  </head>
  <body>
    <div data-cast="card"></div>
    <script type="module" src="/main.ts"></script>
  </body>
</html>`,
    );
    writeFileSync(
      join(dir, "main.ts"),
      `import { motion, type Pose2d } from "@gerak/core";
import { mount } from "@gerak/dom";
import { beat, box, scene, scrollPoint } from "@gerak/stage";
const range = beat("scroll", { scroll: [scrollPoint(0), scrollPoint(600)] });
const piece = scene(
  { length: 2000 },
  box("card").moves(motion((t): Pose2d => ({ x: 120 * t.progress })).in(range)),
);
mount(piece, { clock: "live" });
`,
    );

    const heldResult = await withPage(
      {
        page: "live.html",
        width: 800,
        height: 600,
        source: { kind: "serve", root: dir },
        actions: [{ kind: "scroll", target: { kind: "px", px: 300 }, at: 150 }],
      },
      async ({ page, advanceTo }) => {
        await advanceTo(300);
        return page.evaluate(() => {
          const mounts = Reflect.get(globalThis, Symbol.for("@gerak/dom/mounts"));
          const first = Array.isArray(mounts) ? mounts[0] : undefined;
          const driverObj: unknown = Reflect.get(Object(first), "driver");
          const nowFn: unknown = Reflect.get(Object(driverObj), "now");
          const nowVal: unknown =
            typeof nowFn === "function" ? Reflect.apply(nowFn, driverObj, []) : undefined;
          const clock: unknown = Reflect.get(Object(nowVal), "clock");
          const el = document.querySelector('[data-cast="card"]');
          const transform = el === null ? "none" : getComputedStyle(el).transform;
          return {
            clock,
            animations: el?.getAnimations().length ?? -1,
            x: new DOMMatrix(transform === "none" ? "" : transform).m41,
          };
        });
      },
    );

    expect(heldResult.pageErrors).toEqual([]);
    expect(heldResult.value.clock).toEqual({ kind: "live", elapsed: 300 });
    expect(heldResult.value.animations).toBe(0);
    expect(heldResult.value.x).toBeCloseTo(60, 4);

    const hostedRealResult = await withPage(
      {
        page: "live.html",
        width: 800,
        height: 600,
        source: { kind: "serve", root: dir },
        clock: "real",
        prepare: async (page) => {
          await page.addInitScript(() => {
            const driver = {
              now: () => ({ progress: 0, clock: { kind: "live" as const, elapsed: 0 } }),
              input: () => [],
              set: () => undefined,
              trigger: () => undefined,
              subscribe: () => () => undefined,
            };
            Reflect.set(globalThis, Symbol.for("@gerak/dom/driver"), () => driver);
          });
        },
      },
      async ({ page }) => {
        await page.waitForFunction(() => {
          const mounts = Reflect.get(globalThis, Symbol.for("@gerak/dom/mounts"));
          return Array.isArray(mounts) && mounts.length > 0;
        });
        await page.evaluate(
          () =>
            new Promise<void>((done) =>
              requestAnimationFrame(() => requestAnimationFrame(() => done())),
            ),
        );
        return page.evaluate(() => {
          const el = document.querySelector('[data-cast="card"]');
          return { animations: el?.getAnimations().length ?? 0 };
        });
      },
    );

    expect(hostedRealResult.pageErrors).toEqual([]);
    expect(hostedRealResult.value.animations).toBeGreaterThan(0);
  }, 60000);
});
