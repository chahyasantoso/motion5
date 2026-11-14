import { readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { DEFAULT_ROOT, withPage } from "@gerak/tools/page";
import { scaffold } from "@gerak/tools/scene";

const NAME = "overlay-scratch-box";
const SRC = join(DEFAULT_ROOT, "src");

function removeScratch(): void {
  rmSync(join(DEFAULT_ROOT, `${NAME}.html`), { force: true });
  for (const file of readdirSync(SRC))
    if (file.startsWith(NAME)) rmSync(join(SRC, file), { force: true });
}

beforeAll(() => {
  removeScratch();
  const result = scaffold(NAME, DEFAULT_ROOT, { three: true });
  if (result.kind !== "written") throw new Error(JSON.stringify(result));
  const file = join(SRC, `${NAME}-scene.ts`);
  const source = readFileSync(file, "utf8");
  const moving = source
    .replace("const box: Pose3d = {};", MOVING_BOX)
    .replace("fov: 50", "fov: 35")
    .replace("z: 10", "z: 12");
  if (moving === source || !moving.includes("fov: 35") || !moving.includes("z: 12"))
    throw new Error("The scaffolded scene no longer has the lines this test rewrites.");
  writeFileSync(file, moving, "utf8");
});

afterAll(removeScratch);

const MOVING_BOX = `const along = Math.min(Math.max(time / 1000, 0), 1);
  const box: Pose3d = { x: 0.6 * along, y: -0.4 * along, rotation: 90 * along, rotationY: 30 * along };`;

describe("a scaffolded 3D page pins a label on the box", () => {
  it("keeps the label's corner on the box's drawn centre at 0, 500 and 1000 ms", async () => {
    const { value, pageErrors } = await withPage(
      {
        page: `${NAME}.html`,
        width: 1280,
        height: 720,
        source: { kind: "serve", root: DEFAULT_ROOT },
      },
      async ({ page, advanceTo }) => {
        const found: { label: [number, number]; centre: [number, number] }[] = [];
        for (const ms of [0, 500, 1000]) {
          await advanceTo(ms);
          const corner = await page.evaluate(() => {
            const label = document.querySelector(".label");
            const stage = document.querySelector(".stage");
            if (label === null || stage === null) throw new Error("No stage or label.");
            const at = label.getBoundingClientRect();
            const origin = stage.getBoundingClientRect();
            if (label instanceof HTMLElement) label.style.visibility = "hidden";
            return [at.left - origin.left, at.top - origin.top] as [number, number];
          });
          const shot = (await page.screenshot()).toString("base64");
          const centre = await page.evaluate(async (png) => {
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
            let left = image.width;
            let top = image.height;
            let right = -1;
            let bottom = -1;
            for (let y = 0; y < image.height; y++)
              for (let x = 0; x < image.width; x++) {
                const at = (y * image.width + x) * 4;
                if (Math.max(data[at] ?? 0, data[at + 1] ?? 0, data[at + 2] ?? 0) > 12) {
                  left = Math.min(left, x);
                  right = Math.max(right, x);
                  top = Math.min(top, y);
                  bottom = Math.max(bottom, y);
                }
              }
            return [(left + right + 1) / 2, (top + bottom + 1) / 2] as [number, number];
          }, shot);
          await page.evaluate(() => {
            const label = document.querySelector(".label");
            if (label instanceof HTMLElement) label.style.visibility = "";
          });
          found.push({ label: corner, centre });
        }
        return found;
      },
    );
    expect(pageErrors).toEqual([]);
    for (const { label, centre } of value) {
      expect(Math.abs(label[0] - centre[0])).toBeLessThan(1.5);
      expect(Math.abs(label[1] - centre[1])).toBeLessThan(1.5);
    }
  }, 60000);
});
