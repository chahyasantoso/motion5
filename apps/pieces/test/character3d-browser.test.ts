import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { withPage } from "@gerak/tools/page";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const BACKGROUND = [0x1b, 0x22, 0x36];

describe("the 3D character page in Chromium", () => {
  it("becomes ready without page errors and paints the character over the background", async () => {
    const { value, pageErrors } = await withPage(
      {
        page: "character3d/character3d.html",
        width: 1280,
        height: 720,
        source: { kind: "serve", root: ROOT },
      },
      async ({ page, advanceTo }) => {
        await advanceTo(1000);
        const shot = (await page.screenshot()).toString("base64");
        return page.evaluate(async (png) => {
          const image = new Image();
          image.src = `data:image/png;base64,${png}`;
          await image.decode();
          const canvas = document.createElement("canvas");
          canvas.width = image.width;
          canvas.height = image.height;
          const context = canvas.getContext("2d");
          if (context === null) throw new Error("No canvas context.");
          context.drawImage(image, 0, 0);
          return [...context.getImageData(640, 360, 1, 1).data];
        }, shot);
      },
    );
    expect(pageErrors).toEqual([]);
    expect(value.slice(0, 3)).not.toEqual(BACKGROUND);
  }, 30000);
});
