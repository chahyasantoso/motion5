import { describe, expect, it } from "vitest";
import { Object3D } from "three";
import { motion, type Pose3d, type Time } from "@gerak/core";
import { manualDriver, play } from "@gerak/player";
import {
  beat,
  box,
  compileScene,
  formatStageError,
  frame,
  object,
  sceneBuilder,
  type Stage,
} from "@gerak/stage";
import { bindScene3d } from "../src/index";

const spin = beat("spin", 1000);
const scene = sceneBuilder({ length: 2000 })
  .element(object("cube"))
  .motion(motion((t: Time): Pose3d => ({ x: 2 * t.progress, rotationY: 90 * t.progress })).in(spin))
  .show(spin)
  .element(box("label"));

function compiled(): Stage {
  const result = compileScene(scene);
  if (!result.ok) throw new Error(result.errors.map(formatStageError).join("\n"));
  return result.stage;
}

describe("bindScene3d", () => {
  it("writes each object's pose and visible on a step, then draws once", () => {
    const stage = compiled();
    const driver = manualDriver({ durationMs: 2000 });
    const player = play((time, events) => frame(stage, { time, events }).targets, driver);
    const cube = new Object3D();
    let draws = 0;
    const stop = bindScene3d(player, stage, { cube }, () => {
      draws += 1;
    });
    expect(draws).toBe(1);
    driver.seekMs(500);
    expect(draws).toBe(2);
    expect(cube.position.x).toBeCloseTo(1, 9);
    expect((cube.rotation.y * 180) / Math.PI).toBeCloseTo(45, 9);
    expect(cube.visible).toBe(true);
    driver.seekMs(1500);
    expect(draws).toBe(3);
    expect(cube.visible).toBe(false);
    stop();
    driver.seekMs(600);
    expect(draws).toBe(3);
  });

  it("names a scene's object that has no Object3D", () => {
    const stage = compiled();
    const player = play(
      (time, events) => frame(stage, { time, events }).targets,
      manualDriver({ durationMs: 2000 }),
    );
    expect(() => bindScene3d(player, scene, {}, () => undefined)).toThrow(/object "cube"/);
  });
});
