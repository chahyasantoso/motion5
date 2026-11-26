import { mkdirSync, mkdtempSync, rmdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { withPage } from "../src/page/page";
import { removeTemp } from "../../../test/support/temp";

const DIRS: string[] = [];
const SCAFFOLD = join(process.cwd(), "apps/pieces/.scaffold");

function appRoot(): string {
  mkdirSync(SCAFFOLD, { recursive: true });
  const dir = mkdtempSync(join(SCAFFOLD, "held-"));
  DIRS.push(dir);
  writeFileSync(join(dir, "vite.config.ts"), 'export { default } from "../../vite.config";\n');
  return dir;
}

function writeMountedPage(
  dir: string,
  options: { readonly bodyCss: string; readonly frameCss: string },
): void {
  writeFileSync(
    join(dir, "page.html"),
    `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body { ${options.bodyCss} }
      #frame { ${options.frameCss} }
      [data-cast="card"] { position: absolute; left: 0; top: 0; width: 40px; height: 40px; background: #fff; }
    </style>
  </head>
  <body>
    <div id="frame">
      <div data-cast="card"></div>
    </div>
    <script type="module" src="/main.ts"></script>
  </body>
</html>`,
  );
  writeFileSync(
    join(dir, "main.ts"),
    `import { mount } from "@gerak/dom";
import { box, scene } from "@gerak/stage";
const piece = scene({ length: 2000 }, box("card"));
const root = document.getElementById("frame");
if (root === null) throw new Error("missing #frame");
mount(piece, { clock: "timed", frame: "fit", root });
`,
  );
}

afterEach(() => {
  for (const dir of DIRS.splice(0)) {
    removeTemp(dir);
  }
  try {
    rmdirSync(SCAFFOLD);
  } catch {
    // Another test directory may still sit inside the scaffold folder.
  }
});

describe("held frames and fitted body scaling in browser", () => {
  it("steps a timed mount to the exact requested ms", async () => {
    const dir = appRoot();
    writeMountedPage(dir, {
      bodyCss: "margin: 0;",
      frameCss: "position: relative; width: 200px; height: 200px;",
    });

    const times = [17, 33, 50, 67, 1000] as const;
    const { value: elapsedTimes, pageErrors } = await withPage(
      {
        page: "page.html",
        width: 200,
        height: 200,
        source: { kind: "serve", root: dir },
      },
      async ({ page, advanceTo }) => {
        const readElapsed = async (): Promise<number | undefined> =>
          page.evaluate(() => {
            const listed: unknown = Reflect.get(globalThis, Symbol.for("@gerak/dom/mounts"));
            if (!Array.isArray(listed) || listed.length === 0) return undefined;
            const player: unknown = Reflect.get(Object(listed[0]), "player");
            const time: unknown = Reflect.get(Object(player), "time");
            const clock: unknown = Reflect.get(Object(time), "clock");
            const elapsed: unknown = Reflect.get(Object(clock), "elapsed");
            return typeof elapsed === "number" ? elapsed : undefined;
          });
        const recorded: (number | undefined)[] = [];
        for (const ms of times) {
          await advanceTo(ms);
          recorded.push(await readElapsed());
        }
        return recorded;
      },
    );

    expect(pageErrors).toEqual([]);
    expect(elapsedTimes).toEqual([...times]);
  }, 60000);

  it("scales a fitted 1080x1920 root inside a grid-centered body to a 1280x720 viewport", async () => {
    const dir = appRoot();
    writeMountedPage(dir, {
      bodyCss: "margin: 0; display: grid; place-items: center;",
      frameCss: "position: relative; width: 1080px; height: 1920px;",
    });

    const { value: transform, pageErrors } = await withPage(
      {
        page: "page.html",
        width: 1280,
        height: 720,
        source: { kind: "serve", root: dir },
      },
      async ({ page, advanceTo }) => {
        await advanceTo(0);
        return page.evaluate(() => {
          const root = document.getElementById("frame");
          return root === null ? null : root.style.transform;
        });
      },
    );

    expect(pageErrors).toEqual([]);
    expect(transform).toBe("scale(0.375)");
  }, 60000);
});
