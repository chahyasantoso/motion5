import { describe, expect, it } from "vitest";
import { callerPiecesRoot, withPage } from "@gerak/tools/page";

const PIECES_ROOT = callerPiecesRoot();

// The page is set in place, so a dev server reloading for another test cannot replace it; that `applyValue`
// writes `--gerak-tint` for `tint` is the DOM renderer's own test.
const PAGE = `<!doctype html>
<html>
  <head><meta charset="UTF-8" /><title>tint</title></head>
  <body>
    <div id="box" style="width: 40px; height: 40px; background: color-mix(in oklch, rgb(255 0 0), var(--gerak-tint-to, rgb(0 0 255)) calc(var(--gerak-tint, 0) * 100%))"></div>
  </body>
</html>
`;

function oklch(css: string): number[] {
  const found = /^oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)$/.exec(css);
  if (found === null) throw new Error(`Not an oklch colour: ${css}`);
  return found.slice(1).map(Number);
}

describe("the tint field on a styled element", () => {
  it("mixes from red to blue through the OKLCH middle at tint 0, 0.5 and 1", async () => {
    const { value, pageErrors } = await withPage(
      {
        page: "index.html",
        width: 200,
        height: 200,
        source: { kind: "serve", root: PIECES_ROOT },
        clock: "real",
      },
      async ({ page }) => {
        await page.setContent(PAGE);
        const colours: string[] = [];
        for (const tint of [0, 0.5, 1])
          colours.push(
            await page.evaluate((t) => {
              const box = document.getElementById("box");
              if (box === null) throw new Error("No box.");
              box.style.setProperty("--gerak-tint", String(t));
              return getComputedStyle(box).backgroundColor;
            }, tint),
          );
        return colours;
      },
    );
    expect(pageErrors).toEqual([]);
    const [red, middle, blue] = value.map(oklch);
    expect(red).toEqual([
      expect.closeTo(0.628, 2),
      expect.closeTo(0.258, 2),
      expect.closeTo(29.2, 0),
    ]);
    expect(blue).toEqual([
      expect.closeTo(0.452, 2),
      expect.closeTo(0.313, 2),
      expect.closeTo(264, 0),
    ]);
    // OKLCH mixes by the shorter hue arc, so red to blue passes through magenta near 327 degrees.
    expect(middle).toEqual([expect.closeTo(0.54, 1), expect.any(Number), expect.closeTo(327, -1)]);
  }, 90000);
});
