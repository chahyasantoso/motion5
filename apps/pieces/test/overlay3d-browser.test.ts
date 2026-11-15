import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { withPage } from "@gerak/tools/page";

const ROOT = fileURLToPath(new URL("../", import.meta.url));

describe("the overlay3d page in Chromium", () => {
  it("keeps the arm-tip callout's corner on the tip as drawn at 600, 2200 and 4000 ms", async () => {
    const { value, pageErrors } = await withPage(
      {
        page: "overlay3d/overlay3d.html",
        width: 1280,
        height: 720,
        source: { kind: "serve", root: ROOT },
      },
      async ({ page, advanceTo }) => {
        const found: { corner: [number, number]; tip: [number, number] }[] = [];
        for (const ms of [600, 2200, 4000]) {
          await advanceTo(ms);
          const corner = await page.evaluate(() => {
            const callout = document.querySelector(".callout-tip");
            const stage = document.querySelector(".stage");
            if (callout === null || stage === null) throw new Error("No stage or tip callout.");
            const at = callout.getBoundingClientRect();
            const origin = stage.getBoundingClientRect();
            for (const each of document.querySelectorAll(".callout"))
              if (each instanceof HTMLElement) each.style.visibility = "hidden";
            return [at.left - origin.left, at.top - origin.top] as [number, number];
          });
          const shot = (await page.screenshot()).toString("base64");
          const tip = await page.evaluate(async (png) => {
            const image = new Image();
            image.src = `data:image/png;base64,${png}`;
            await image.decode();
            const canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            const context = canvas.getContext("2d");
            if (context === null) throw new Error("No canvas context.");
            context.drawImage(image, 0, 0);
            const data = context.getImageData(0, 0, image.width, image.height).data;
            let sumX = 0;
            let sumY = 0;
            let count = 0;
            for (let y = 0; y < image.height; y++)
              for (let x = 0; x < image.width; x++) {
                const at = (y * image.width + x) * 4;
                if (
                  (data[at] ?? 0) > 235 &&
                  (data[at + 1] ?? 255) < 40 &&
                  (data[at + 2] ?? 0) > 235
                ) {
                  sumX += x + 0.5;
                  sumY += y + 0.5;
                  count += 1;
                }
              }
            if (count === 0) throw new Error("The tip marker is not drawn.");
            return [sumX / count, sumY / count] as [number, number];
          }, shot);
          await page.evaluate(() => {
            for (const each of document.querySelectorAll(".callout"))
              if (each instanceof HTMLElement) each.style.visibility = "";
          });
          found.push({ corner, tip });
        }
        return found;
      },
    );
    expect(pageErrors).toEqual([]);
    expect(value).toHaveLength(3);
    for (const { corner, tip } of value) {
      expect(Math.abs(corner[0] - tip[0])).toBeLessThan(1.5);
      expect(Math.abs(corner[1] - tip[1])).toBeLessThan(1.5);
    }
  }, 60000);
});
