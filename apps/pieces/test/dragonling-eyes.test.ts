import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { Mesh } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import eyes from "../references/dragonling.eyes.json" with { type: "json" };

const IRIS = eyes.iris;

describe("dragonling.eyes.json", () => {
  it("holds the box of each iris, measured from the model's iris-coloured vertices", async () => {
    const bytes = readFileSync(new URL("../references/dragonling.glb", import.meta.url));
    const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
    const model = (await new GLTFLoader().parseAsync(buffer, "")).scene;
    const found = { left: [] as number[][], right: [] as number[][] };
    model.traverse((node) => {
      if (!(node instanceof Mesh)) return;
      const position = node.geometry.getAttribute("position");
      const colour = node.geometry.getAttribute("color");
      for (let i = 0; i < position.count; i += 1) {
        const rgb = [colour.getX(i), colour.getY(i), colour.getZ(i)];
        if (!rgb.every((value, k) => Math.abs(value - (IRIS[k] ?? 0)) < 0.01)) continue;
        const point = [position.getX(i), position.getY(i), position.getZ(i)];
        (point[0]! > 0 ? found.left : found.right).push(point);
      }
    });
    for (const side of ["left", "right"] as const) {
      const points = found[side];
      expect(points.length).toBeGreaterThan(0);
      const low = [0, 1, 2].map((k) => Math.min(...points.map((p) => p[k]!)));
      const high = [0, 1, 2].map((k) => Math.max(...points.map((p) => p[k]!)));
      const box = eyes.irises[side];
      expect((low[0]! + high[0]!) / 2).toBeCloseTo(box.x, 3);
      expect((low[1]! + high[1]!) / 2).toBeCloseTo(box.y, 3);
      expect((low[2]! + high[2]!) / 2).toBeCloseTo(box.z, 3);
      expect(high[0]! - low[0]!).toBeCloseTo(box.width, 3);
      expect(high[1]! - low[1]!).toBeCloseTo(box.height, 3);
      expect(high[2]! - low[2]!).toBeCloseTo(box.depth, 3);
    }
  });
});
