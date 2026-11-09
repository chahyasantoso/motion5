import { describe, expect, it } from "vitest";
import { readSceneModule } from "../src/scene/scene";
import {
  isSceneFile,
  parseSceneReviewArgs,
  reviewSceneModule,
  type SceneReviewResult,
} from "../src/scene/review";
import * as clean from "./fixtures/review-clean-scene";
import * as flawed from "./fixtures/review-flawed-scene";
import * as moving from "./fixtures/review-moving-scene";

const limits = { hold: 500, jump: 150 };

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
    });
    expect(parseSceneReviewArgs(["s.ts", "--to", "900", "--hold", "100", "--jump", "9"])).toEqual({
      kind: "ok",
      file: "s.ts",
      to: 900,
      hold: 100,
      jump: 9,
    });
    expect(parseSceneReviewArgs(["s.ts", "--jump", "-1"]).kind).toBe("usage");
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
    expect(reviewSceneModule(turning, limits).findings[0]).toContain("a.rotationY jumps 200");
  });
});
