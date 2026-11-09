import { describe, expect, it } from "vitest";
import { readSceneModule } from "../src/scene/scene";
import {
  isSceneFile,
  parseSceneReviewArgs,
  reviewSceneModule,
  reviewValues,
  type SceneReviewResult,
} from "../src/scene/review";
import * as clean from "./fixtures/review-clean-scene";
import * as flawed from "./fixtures/review-flawed-scene";
import * as moving from "./fixtures/review-moving-scene";

const limits = { hold: 500, jump: 150, turn: 150, ratio: 1.5 };

function review(module: unknown, options: { to?: number } = {}): SceneReviewResult {
  const read = readSceneModule(module);
  if ("reason" in read) throw new Error(read.reason);
  return reviewSceneModule(read, { ...limits, ...options });
}

describe("motion:review on a scene file", () => {
  it("reads a path ending in .ts as a scene and takes the page check's flags and defaults", () => {
    expect(isSceneFile(["a/scene.ts"])).toBe(true);
    expect(isSceneFile(["page.html", "--watch", ".a"])).toBe(false);
    expect(parseSceneReviewArgs(["s.ts"])).toEqual({
      kind: "ok",
      file: "s.ts",
      hold: 500,
      jump: 150,
      turn: 150,
      ratio: 1.5,
    });
    expect(parseSceneReviewArgs(["s.ts", "--to", "900", "--hold", "100", "--jump", "9"])).toEqual({
      kind: "ok",
      file: "s.ts",
      to: 900,
      hold: 100,
      jump: 9,
      turn: 150,
      ratio: 1.5,
    });
    expect(parseSceneReviewArgs(["s.ts", "--jump", "-1"]).kind).toBe("usage");
  });

  it("holds positions, turns and ratios to their own limits", () => {
    const small = [0, 1].map((step, index) => ({
      at: index * 16,
      targets: { a: { x: step * 0.4, rotation: step * 10, scale: 1 + step * 0.2 } },
    }));
    const world = { hold: 0, jump: 0.5, turn: 150, ratio: 1.5 };
    expect(reviewValues(small, world).some((line) => line.includes("jumps"))).toBe(false);
    const tight = { hold: 0, jump: 0.5, turn: 5, ratio: 0.1 };
    expect(reviewValues(small, tight).filter((line) => line.includes("jumps"))).toEqual([
      "a.rotation jumps 10 at 16 ms",
      "a.scale jumps 0.2 at 16 ms",
    ]);
  });

  it("finds nothing in a clean scene", () => {
    expect(review(clean).findings).toEqual([]);
  });

  it("reports a planted jump, in a target and in a list of poses, and a short final hold", () => {
    const { findings } = review(flawed);
    expect(findings).toContain("ball.x jumps 400 at 608 ms");
    expect(findings).toContain("letters[1].x jumps 400 at 608 ms");
    expect(findings).toContain("the final pose holds only 192 ms");
  });

  it("reports a target still moving on the last frame", () => {
    expect(review(moving).findings).toEqual(["drift is still moving on the last frame"]);
  });

  it("stops at --to, and reads turn fields in degrees against the same limit", () => {
    expect(review(flawed, { to: 400 }).findings.some((line) => line.includes("jumps"))).toBe(false);
    const turning = readSceneModule({
      durationMs: 1000,
      scene: (time: { progress: number }) => ({ a: { rotationY: time.progress < 0.5 ? 0 : 200 } }),
    });
    if ("reason" in turning) throw new Error(turning.reason);
    expect(reviewSceneModule(turning, limits).findings[0]).toContain("a.rotationY jumps 160");
  });
  it("reads a turn through 180 degrees as the short step it is", () => {
    const turning = [179, -179, -177].map((rotation, index) => ({
      at: index * 16,
      targets: { a: { rotation } },
    }));
    expect(reviewValues(turning, limits).some((line) => line.includes("jumps"))).toBe(false);
    const flipped = [0, 0, 180].map((rotation, index) => ({
      at: index * 16,
      targets: { a: { rotation } },
    }));
    expect(reviewValues(flipped, limits).some((line) => line.includes("jumps"))).toBe(true);
  });
});
