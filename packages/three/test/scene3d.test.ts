import { describe, expect, it } from "vitest";
import { BoxGeometry, Group, Mesh, MeshBasicMaterial, Object3D } from "three";
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

  it("exposes resize and measures local rest ObjectBounds3d ignoring live transforms and hidden children", () => {
    const root = new Object3D();
    const crate = new Group();
    crate.name = "crate";
    const child = new Mesh(new BoxGeometry(2, 4, 1), new MeshBasicMaterial());
    child.position.set(1, 0, 0);
    const secondChild = new Mesh(new BoxGeometry(1, 2, 3), new MeshBasicMaterial());
    secondChild.position.set(-1, 0, 0);
    const hidden = new Mesh(new BoxGeometry(40, 40, 40), new MeshBasicMaterial());
    hidden.visible = false;
    crate.add(child, secondChild, hidden);
    // Simulate a parked/scaled animated root transform that must not corrupt rest bounds.
    crate.position.set(10, -5, 15);
    crate.rotation.set(0.4, 1.1, 0.2);
    crate.scale.set(0, 0, 0);

    const empty = new Object3D();
    empty.name = "empty";
    root.add(crate, empty);

    let resizes = 0;
    const binder = threeBinder(root, {
      objects: { ghost: () => undefined },
      resize: () => {
        resizes += 1;
      },
    });
    binder.resize?.();
    expect(resizes).toBe(1);

    // Explicitly requested names work before start(), skipping writers and empty nodes.
    const measuredExplicit = binder.measure?.(["crate", "ghost", "empty"]);
    expect(measuredExplicit).toEqual({
      crate: { width: 3.5, height: 4, depth: 3 },
    });

    // After start(), calling measure() with no arguments measures bound Object3D members.
    const objScene = sceneBuilder({ length: 500 })
      .element(object("crate"))
      .motion(motion((): Pose3d => ({ scale: 0 })));
    const compiledObj = compileScene(objScene);
    if (!compiledObj.ok) throw new Error(compiledObj.errors.map(formatStageError).join("\n"));
    const driver = manualDriver({ durationMs: 500 });
    const player = play(
      (time, events) => frame(compiledObj.stage, { time, events }).targets,
      driver,
    );
    binder.start(player, compiledObj.stage);
    expect(binder.measure?.()).toEqual({
      crate: { width: 3.5, height: 4, depth: 3 },
    });

    // Prototype keys on `objects` are not claimed, and a 0-object started stage measures empty.
    expect(binder.claims("toString")).toBe(false);
    expect(binder.claims("constructor")).toBe(false);
    const zeroObjStage = compileScene(sceneBuilder({ length: 500 }).element(box("only")));
    if (!zeroObjStage.ok) throw new Error(zeroObjStage.errors.map(formatStageError).join("\n"));
    const zeroBinder = threeBinder(root);
    const zeroPlayer = play(
      (time, events) => frame(zeroObjStage.stage, { time, events }).targets,
      manualDriver({ durationMs: 500 }),
    );
    zeroBinder.start(zeroPlayer, zeroObjStage.stage);
    expect(zeroBinder.measure?.()).toEqual({});
  });
});
