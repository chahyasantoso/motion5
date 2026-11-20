import { describe, expect, it } from "vitest";
import { manualDriver, play } from "@gerak/player";
import type { Pose2d, Pose3d } from "@gerak/core";
import { compileScene, formatStageError, frame, pose3dOf, poseOf } from "@gerak/stage";
import piece, { PLUSES, WORDS, durationMs } from "../dragon-intro/src/dragon-intro-scene";

const compiled = compileScene(piece);
if (!compiled.ok) throw new Error(compiled.errors.map(formatStageError).join("\n"));
const scene = compiled.stage;

function at(ms: number) {
  const driver = manualDriver({ durationMs });
  const player = play((time, events) => frame(scene, { time, events }).targets, driver, {
    cues: scene.cues,
  });
  driver.seek(ms / durationMs);
  const flat = (name: string): Pose2d => poseOf(player.values[name]) ?? {};
  const deep = (name: string): Pose3d => pose3dOf(player.values[name]) ?? {};
  return { flat, deep };
}

describe("dragon-intro scene", () => {
  it("turns the dragon to the viewer and opens the jaw while it talks", () => {
    expect(at(0).deep("dragon").rotationY).toBeCloseTo(-75, 3);
    expect(Math.abs(at(4000).deep("dragon").rotationY ?? 99)).toBeLessThan(3);
    const opens = [3000, 3400, 3800, 4200, 4600].map((ms) => at(ms).deep("Jaw").rotationX ?? 0);
    expect(Math.max(...opens)).toBeGreaterThan(1);
  });

  it("drops the props through physics: one object each, hidden until spawned", () => {
    expect(at(0).deep("p0").scale).toBe(0);
    expect(at(1500).deep("p0").scale).toBeUndefined();
    expect(at(1500).deep("p0").y).toBeLessThan(0);
  });

  it("pins the speech bubble once the talk starts and a +1 after a prop lands", () => {
    expect(at(0).flat("bubble").opacity).toBe(0);
    expect(at(4000).flat("bubble").opacity).toBeGreaterThan(0);
    let shown = 0;
    for (let ms = 0; ms <= durationMs; ms += 100)
      if ((at(ms).flat(PLUSES[0] ?? "").opacity ?? 0) > 0) shown += 1;
    expect(shown).toBeGreaterThan(0);
  });

  it("drops each title word in turn", () => {
    expect(WORDS).toHaveLength(3);
    expect(at(400).flat("word0").y).toBeGreaterThan(at(400).flat("word2").y ?? 0);
  });

  it("limits the 3D objects and none of the labels", () => {
    expect(Object.keys(scene.limits).sort()).toEqual(
      [
        "Head",
        "Jaw",
        "Neck",
        "camera",
        "dragon",
        "face",
        ...Array.from({ length: 8 }, (_, i) => `p${i}`),
      ].sort(),
    );
  });
});
