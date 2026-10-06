import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../..", import.meta.url));
const sources = (dir: string): string[] =>
  (readdirSync(join(root, dir), { recursive: true }) as string[])
    .filter((file) => /\.tsx?$/.test(file))
    .map((file) => join(dir, file));

describe("lazy GLTFLoader chunk (#559 item 7)", () => {
  it("A15 three/addons is reached only through one dynamic import in gltf-avatar", () => {
    const files = ["apps/pose-gap-filler/src", "packages/three/src"].flatMap(sources);
    const reaches = files.flatMap((file) =>
      [...readFileSync(join(root, file), "utf8").matchAll(/^.*three\/addons.*$/gm)].map(
        ([line]) => `${file}: ${line.trim()}`,
      ),
    );
    expect(reaches).toEqual([
      'apps/pose-gap-filler/src/view/gltf-avatar.ts: const { GLTFLoader } = await import("three/addons/loaders/GLTFLoader.js");',
    ]);
  });
});
