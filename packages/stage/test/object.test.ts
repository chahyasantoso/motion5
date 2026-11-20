import { liveAt, motion, type Pose2d, type Pose3d, type Time } from "@gerak/core";
import { describe, expect, it } from "vitest";
import {
  beat,
  box,
  check,
  compileScene,
  formatStageError,
  frame,
  object,
  poseOf,
  sceneBuilder,
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
        .element(box("label", { node: { kind: "node", selector: "#label" } }))
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
