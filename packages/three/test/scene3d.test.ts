import { describe, expect, it } from "vitest";
import { BoxGeometry, Group, Mesh, MeshBasicMaterial, Object3D } from "three";
import { INPUT_EVENTS, motion, type Pose3d, type Time } from "@gerak/core";
import { manualDriver, play } from "@gerak/player";
import {
  beat,
  box,
  compileScene,
  formatStageError,
  frame,
  object,
  scene,
  scrollPoint,
  type Stage,
} from "@gerak/stage";
import { threeBinder } from "../src/index";

const spin = beat("spin", 1000);
const piece = scene(
  { length: 2000 },
  object("cube")
    .moves(
      motion((t: Time): Pose3d => ({ x: 2 * t.progress, rotationY: 90 * t.progress })).in(spin),
    )
    .shows(spin),
  box("label"),
);

function compiled(): Stage {
  const result = compileScene(piece);
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
    const flat = scene({ length: 500 }, box("only"));
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
    const objScene = scene(
      { length: 500 },
      object("crate").moves(motion((): Pose3d => ({ scale: 0 }))),
    );
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
    const zeroObjStage = compileScene(scene({ length: 500 }, box("only")));
    if (!zeroObjStage.ok) throw new Error(zeroObjStage.errors.map(formatStageError).join("\n"));
    const zeroBinder = threeBinder(root);
    const zeroPlayer = play(
      (time, events) => frame(zeroObjStage.stage, { time, events }).targets,
      manualDriver({ durationMs: 500 }),
    );
    zeroBinder.start(zeroPlayer, zeroObjStage.stage);
    expect(zeroBinder.measure?.()).toEqual({});
  });

  it("drives Object3D.visible from frame() scroll-window .show() without calling stage.visibleAt", () => {
    const scrollStageResult = compileScene(
      scene(
        { length: 1000 },
        object("orb")
          .moves(motion((): Pose3d => ({ y: 1 })))
          .shows([scrollPoint(100), scrollPoint(300)]),
      ),
    );
    if (!scrollStageResult.ok)
      throw new Error(scrollStageResult.errors.map(formatStageError).join("\n"));
    const stage = scrollStageResult.stage;

    let scrollY = 0;
    const listeners = new Set<() => void>();
    const driver = {
      now: (): Time => ({ progress: 0, clock: { kind: "live", elapsed: 0 } }),
      input: () =>
        scrollY === 0
          ? []
          : [{ kind: "value" as const, name: INPUT_EVENTS.scroll, at: 0, value: scrollY }],
      set: () => undefined,
      trigger: () => undefined,
      subscribe: (listener: () => void) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
    };
    const player = play((time, events) => frame(stage, { time, events }).targets, driver);
    const root = new Object3D();
    const orb = new Object3D();
    orb.name = "orb";
    root.add(orb);

    threeBinder(root).start(player, stage);
    expect(orb.visible).toBe(false);

    scrollY = 150;
    for (const listener of [...listeners]) listener();
    expect(orb.visible).toBe(true);

    scrollY = 300;
    for (const listener of [...listeners]) listener();
    expect(orb.visible).toBe(false);
  });

  it("binds 3D list objects to Object3D[] overrides and Group.children, reporting counts and per-part bounds", () => {
    const a = new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial());
    a.position.set(1, 0, 0);
    const b = new Mesh(new BoxGeometry(2, 2, 2), new MeshBasicMaterial());
    b.position.set(2, 0, 0);

    const trayGroup = new Group();
    trayGroup.name = "tray";
    const g0 = new Mesh(new BoxGeometry(0.5, 0.5, 0.5), new MeshBasicMaterial());
    const g1 = new Mesh(new BoxGeometry(1.5, 1.5, 1.5), new MeshBasicMaterial());
    trayGroup.add(g0, g1);

    const root = new Object3D();
    root.add(trayGroup);

    const listStageResult = compileScene(
      scene(
        { length: 1000 },
        object("arrayItems", { parts: true })
          .moves((_t, ctx) => ({ x: ((ctx.index ?? 0) + 1) * 0.5 }))
          .shows([scrollPoint(100), scrollPoint(400)]),
        object("tray", { parts: true }).moves((t, ctx) => ({ y: (ctx.index ?? 0) + t.progress })),
      ),
    );
    if (!listStageResult.ok)
      throw new Error(listStageResult.errors.map(formatStageError).join("\n"));
    const stage = listStageResult.stage;

    const binder = threeBinder(root, { objects: { arrayItems: [a, b] } });
    expect(binder.casts?.()).toEqual({ arrayItems: "list" });
    expect(binder.claims("arrayItems")).toBe(true);
    expect(binder.claims("tray")).toBe(true);
    expect(binder.counts?.(["arrayItems", "tray"])).toEqual({ arrayItems: 2, tray: 2 });
    expect(binder.counts?.()).toEqual({ arrayItems: 2 });

    let scrollY = 0;
    const listeners = new Set<() => void>();
    const driver = {
      now: (): Time => ({ progress: 0.5, clock: { kind: "live", elapsed: 0 } }),
      input: () =>
        scrollY === 0
          ? []
          : [{ kind: "value" as const, name: INPUT_EVENTS.scroll, at: 0, value: scrollY }],
      set: () => undefined,
      trigger: () => undefined,
      subscribe: (listener: () => void) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
    };
    const counts = binder.counts?.(["arrayItems", "tray"]);
    const player = play((time, events) => frame(stage, { time, events, counts }).targets, driver);
    binder.start(player, stage);
    expect(binder.counts?.()).toEqual({ arrayItems: 2, tray: 2 });
    expect(binder.casts?.()).toEqual({ arrayItems: "list", tray: "list" });

    expect(a.visible).toBe(false);
    expect(b.visible).toBe(false);
    expect(g0.visible).toBe(true);
    expect(g0.position.y).toBeCloseTo(0.5, 6);
    expect(g1.position.y).toBeCloseTo(1.5, 6);

    scrollY = 200;
    for (const listener of [...listeners]) listener();
    expect(a.visible).toBe(true);
    expect(b.visible).toBe(true);
    expect(a.position.x).toBeCloseTo(1.5, 6);
    expect(b.position.x).toBeCloseTo(3, 6);

    expect(binder.measure?.(["arrayItems", "tray"])).toEqual({
      "arrayItems.0": { width: 1, height: 1, depth: 1 },
      "arrayItems.1": { width: 2, height: 2, depth: 2 },
      arrayItems: { width: 1, height: 1, depth: 1 },
      "tray.0": { width: 0.5, height: 0.5, depth: 0.5 },
      "tray.1": { width: 1.5, height: 1.5, depth: 1.5 },
      tray: { width: 0.5, height: 0.5, depth: 0.5 },
    });

    // Refuses mismatched target shapes (array on non-parts object, writer on parts object).
    const singleStage = compileScene(
      scene(
        { length: 500 },
        object("arr").moves(() => ({ y: 0 })),
      ),
    );
    if (!singleStage.ok) throw new Error(singleStage.errors.map(formatStageError).join("\n"));
    const pSingle = play(
      (time, events) => frame(singleStage.stage, { time, events }).targets,
      manualDriver({ durationMs: 500 }),
    );
    expect(() =>
      threeBinder(new Object3D(), { objects: { arr: [new Object3D()] } }).start(
        pSingle,
        singleStage.stage,
      ),
    ).toThrow(TypeError);

    const partsStage = compileScene(
      scene(
        { length: 500 },
        object("fn", { parts: true }).moves(() => ({ y: 0 })),
      ),
    );
    if (!partsStage.ok) throw new Error(partsStage.errors.map(formatStageError).join("\n"));
    const pParts = play(
      (time, events) => frame(partsStage.stage, { time, events, counts: { fn: 1 } }).targets,
      manualDriver({ durationMs: 500 }),
    );
    expect(() =>
      threeBinder(new Object3D(), { objects: { fn: () => undefined } }).start(
        pParts,
        partsStage.stage,
      ),
    ).toThrow(TypeError);
  });
});
