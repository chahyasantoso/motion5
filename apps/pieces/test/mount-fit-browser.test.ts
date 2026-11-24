import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { callerPiecesRoot, withPage } from "@gerak/tools/page";

const PIECES_ROOT = callerPiecesRoot();
const PIECES_SOURCE = { kind: "serve", root: PIECES_ROOT } as const;
const PREFIX = "fit-scratch-";

function removeLeftovers(): void {
  for (const folder of readdirSync(PIECES_ROOT))
    if (folder.startsWith(PREFIX))
      rmSync(join(PIECES_ROOT, folder), { recursive: true, force: true });
}

/** A 400x200 frame holding one box at frame px (300, 100), mounted fitted inside a holder of `holder` px. */
function writeScratchPage(holder: { readonly width: number; readonly height: number }): string {
  const name = `${PREFIX}${holder.width}`;
  const dir = join(PIECES_ROOT, name);
  mkdirSync(join(dir, "src"), { recursive: true });
  writeFileSync(
    join(dir, `${name}.html`),
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <style>
      body { margin: 0; }
      #holder { width: ${holder.width}px; height: ${holder.height}px; }
      #frame { position: relative; width: 400px; height: 200px; background: #eee; }
      [data-cast="dot"] { position: absolute; left: 280px; top: 80px; width: 40px; height: 40px; background: #36c; }
    </style>
  </head>
  <body>
    <div id="holder"><div id="frame"><div data-cast="dot"></div></div></div>
    <script type="module" src="/${name}/src/main.ts"></script>
  </body>
</html>
`,
    "utf8",
  );
  writeFileSync(
    join(dir, "src", "main.ts"),
    `import { mount } from "@gerak/dom";
import { box, scene } from "@gerak/stage";

const root = document.getElementById("frame");
if (root === null) throw new Error("#frame not found");
const mounted = mount(scene({ length: 500 }, box("dot")), {
  clock: "timed",
  frame: "fit",
  root,
});
Reflect.set(window, "__rest", mounted.rest);
Reflect.set(window, "__frame", mounted.measure().frame);
`,
    "utf8",
  );
  return `${name}/${name}.html`;
}

beforeAll(removeLeftovers);
afterAll(removeLeftovers);

describe('mount with frame "fit"', () => {
  it("takes the root's CSS size as the frame, scales it to its parent's box, and measures in frame px", async () => {
    const page = writeScratchPage({ width: 200, height: 300 });
    await withPage(
      { page, width: 800, height: 600, source: PIECES_SOURCE },
      async ({ page: browser }) => {
        const seen = await browser.evaluate(() => {
          const frame = document.getElementById("frame");
          const dot = document.querySelector('[data-cast="dot"]');
          if (frame === null || dot === null) throw new Error("missing nodes");
          const drawn = frame.getBoundingClientRect();
          return {
            measured: Reflect.get(window, "__frame"),
            overflow: frame.style.overflow,
            drawnWidth: drawn.width,
            dotLeft: dot.getBoundingClientRect().left,
            rest: Reflect.get(window, "__rest"),
          };
        });
        expect(seen.measured).toEqual({ width: 400, height: 200 });
        expect(seen.overflow).toBe("hidden");
        expect(seen.drawnWidth).toBeCloseTo(200, 3);
        expect(seen.dotLeft).toBeCloseTo(140, 3);
        expect(seen.rest).toEqual({ dot: { x: 300, y: 100, width: 40, height: 40 } });
      },
    );
  });
});
