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
import { threeBinder } from "../src/index";

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

describe("threeBinder", () => {
  it("claims an object element by the name of an Object3D under its root, or an entry that overrides it", () => {
    const root = new Object3D();
    const cube = new Object3D();
    cube.name = "cube";
    root.add(cube);
    expect(threeBinder(root).claims("cube")).toBe(true);
    expect(threeBinder(root).claims("ghost")).toBe(false);
    expect(
      threeBinder(new Object3D(), { objects: { ghost: () => undefined } }).claims("ghost"),
    ).toBe(true);
  });

  it("writes each object's pose and visible on a step, then draws once", () => {
    const stage = compiled();
    const driver = manualDriver({ durationMs: 2000 });
    const player = play((time, events) => frame(stage, { time, events }).targets, driver);
    const root = new Object3D();
    const cube = new Object3D();
    cube.name = "cube";
    root.add(cube);
    let draws = 0;
    const stop = threeBinder(root, {
      draw: () => {
        draws += 1;
      },
    }).start(player, stage);
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

  it("poses an override Object3D from its position when bound, and hands a writer the pose and visible", () => {
    const stage = compiled();
    const driver = manualDriver({ durationMs: 2000 });
    const player = play((time, events) => frame(stage, { time, events }).targets, driver);
    const placed = new Object3D();
    placed.position.set(0, 3, 0);
    threeBinder(new Object3D(), { objects: { cube: placed } }).start(player, stage);
    driver.seekMs(500);
    expect([placed.position.x, placed.position.y]).toEqual([1, 3]);
    const written: [Pose3d, boolean][] = [];
    threeBinder(new Object3D(), {
      objects: { cube: (pose, visible) => written.push([pose, visible]) },
    }).start(player, stage);
    driver.seekMs(1500);
    expect(written.at(-1)).toEqual([{ x: 2, rotationY: 90 }, false]);
  });

  it("draws once when the piece has no object", () => {
    const flat = sceneBuilder({ length: 500 }).element(box("only"));
    const result = compileScene(flat);
    if (!result.ok) throw new Error(result.errors.map(formatStageError).join("; "));
    const player = play(
      (time, events) => frame(result.stage, { time, events }).targets,
      manualDriver({ durationMs: 500 }),
    );
    let draws = 0;
    threeBinder(new Object3D(), {
      draw: () => {
        draws += 1;
      },
    }).start(player, result.stage);
    expect(draws).toBe(1);
  });
});
