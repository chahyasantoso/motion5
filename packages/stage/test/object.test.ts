import {
  aim,
  liveAt,
  motion,
  orbit,
  project3d,
  type Lens3d,
  type Pose2d,
  type Pose3d,
  type Time,
} from "@gerak/core";
import { describe, expect, it } from "vitest";
import {
  beat,
  box,
  check,
  compileScene,
  formatStageError,
  frame,
  object,
  pose3dOf,
  poseOf,
  sceneBuilder,
  travel,
  type SceneBuilder,
  type Stage,
} from "../src";

function compiled(scene: SceneBuilder): Stage {
  const result = compileScene(scene);
  if (!result.ok) throw new Error(result.errors.map(formatStageError).join("\n"));
  return result.stage;
}

const turn = motion((t: Time): Pose3d => ({ rotationY: 90 * t.progress, z: -2 * t.progress }));
const lift = motion((t: Time): Pose3d => ({ y: t.progress, z: 1 }));
const slide = motion((t: Time): Pose2d => ({ x: 100 * t.progress }));

describe("an object in a scene", () => {
  it("compiles with kind object beside a box, with no node and no content", () => {
    const stage = compiled(
      sceneBuilder()
        .element(object("cube"))
        .motion(turn.in(beat("spin", 1000)))
        .element(box("label"))
        .motion(slide.in(beat("spin", 1000))),
    );
    const cube = stage.members.find((member) => member.name === "cube");
    expect(cube?.kind).toBe("object");
    expect(cube !== undefined && "content" in cube).toBe(false);
    expect(cube?.node).toBeUndefined();
  });

  it("answers a Pose3d, layering by each field's rule and taking with take()", () => {
    const spin = beat("spin", 1000);
    const stage = compiled(
      sceneBuilder()
        .element(object("cube"))
        .motion(turn.in(spin), lift.in(spin))
        .element(object("taken"))
        .motion(turn.in(spin), lift.in(beat("late", 400, { at: 600 })).take()),
    );
    const at500 = frame(stage, { time: liveAt(500) }).targets;
    expect(poseOf(at500["cube"])).toEqual({ rotationY: 45, z: 0, y: 0.5 });
    expect(poseOf(at500["taken"])).toEqual({ rotationY: 45, z: -1 });
    const at800 = frame(stage, { time: liveAt(800) }).targets;
    expect(poseOf(at800["taken"])).toEqual({ rotationY: 72, z: 1, y: 0.5 });
    expect(check(stage, at800)).toEqual([]);
  });

  it("shows only in its .show windows", () => {
    const stage = compiled(
      sceneBuilder({ length: 2000 })
        .element(object("cube"))
        .motion(turn.in(beat("spin", 1000)))
        .show(beat("spin", 1000)),
    );
    expect(frame(stage, { time: liveAt(500) }).visible["cube"]).toBe(true);
    expect(frame(stage, { time: liveAt(1500) }).visible["cube"]).toBe(false);
  });

  it("needs no node in a page scene", () => {
    const result = compileScene(
      sceneBuilder()
        .element(object("cube"))
        .motion(turn.in(beat("spin", 1000)))
        .element(box("label"))
        .motion(slide.in(beat("spin", 1000))),
    );
    expect(result.ok).toBe(true);
  });

  it("refuses a 2D motion on an object and a 3D motion on a box, in types and at run time", () => {
    const scene = sceneBuilder().element(object("cube"));
    // @ts-expect-error: an object takes 3D motions.
    scene.motion(slide);
    // @ts-expect-error: a box takes 2D motions.
    sceneBuilder().element(box("label")).motion(turn);
    expect(() => scene.motion(turn)).not.toThrow();
  });

  it("types a plain function motion on an object from its context", () => {
    const stage = compiled(
      sceneBuilder({ length: 1000 })
        .element(object("cube"))
        .motion((time, context) => ({ y: time.progress + context.events.length })),
    );
    expect(pose3dOf(frame(stage, { time: liveAt(0) }).targets["cube"])).toEqual({ y: 0 });
  });

  it("refuses a read of an object's pose from an element", () => {
    const stage = compiled(
      sceneBuilder()
        .element(object("cube"))
        .motion(turn.in(beat("spin", 1000)))
        .element(box("label"))
        .motion((_t, context) => ({ x: context.read("cube").x ?? 0 })),
    );
    expect(() => frame(stage, { time: liveAt(100) })).toThrow(/is an object; its pose is 3D/);
  });
});

describe("travel on an object", () => {
  const eye = orbit({ target: { x: 0, y: 0, z: 0 }, radius: 8, azimuth: 20, elevation: 10 });
  const lens: Lens3d = { ...eye, ...aim(eye, { x: 0, y: 0, z: 0 }), fov: 40 };
  const canvas = box("gl");
  const slot = box("slot");
  // The canvas fills an 800x600 viewport; the slot sits right of centre and low.
  const rest = {
    gl: { x: 400, y: 300, width: 800, height: 600 },
    slot: { x: 620, y: 450, width: 80, height: 80 },
  };
  const go = beat("go", 1000);
  const start = motion((): Pose3d => ({ x: 0.5, y: 0.2, z: -0.4 }));

  it("lands on the slot's centre as the lens sees it, at the depth it starts from", () => {
    const stage = compiled(
      sceneBuilder({ rest })
        .element(object("drink", { view: { canvas, lens } }))
        .motion(start, travel({ to: slot }).in(go)),
    );
    const size = { width: 800, height: 600 };
    const from = project3d({ x: 0.5, y: 0.2, z: -0.4 }, lens, size);
    const landed = pose3dOf(frame(stage, { time: liveAt(1000) }).targets["drink"]);
    const seen = project3d(
      { x: landed?.x ?? NaN, y: landed?.y ?? NaN, z: landed?.z ?? NaN },
      lens,
      size,
    );
    expect(seen.x).toBeCloseTo(620, 6);
    expect(seen.y).toBeCloseTo(450, 6);
    expect(seen.depth).toBeCloseTo(from.depth, 6);
    const half = pose3dOf(frame(stage, { time: liveAt(500) }).targets["drink"]);
    expect(half?.x).toBeCloseTo((0.5 + (landed?.x ?? NaN)) / 2, 9);
  });

  it("refuses a travel on an object with no view, an arc or fit, and a take", () => {
    expect(() =>
      sceneBuilder({ rest })
        .element(object("bare"))
        .motion(travel({ to: slot }).in(go)),
    ).toThrow(/travels only with/);
    expect(() =>
      sceneBuilder({ rest })
        .element(object("bent", { view: { canvas, lens } }))
        .motion(travel({ to: slot, arc: 40 }).in(go)),
    ).toThrow(/travels straight/);
    expect(() =>
      sceneBuilder({ rest })
        .element(object("taking", { view: { canvas, lens } }))
        .motion(travel({ to: slot }).in(go).take()),
    ).toThrow(/travels as a layer/);
  });
});
