import { Bone, Group, Vector3 } from "three";
import { describe, expect, it } from "vitest";
import { manualDriver, play } from "@gerak/player";
import { project3d } from "@gerak/moves";
import { applyPose3d } from "@gerak/three";
import { applyBones, captureSkeleton } from "@gerak/three/skeleton";
import {
  ARM,
  CAPTION,
  cues,
  durationMs,
  fadeOf,
  lens,
  limits,
  scene,
  stage,
  wordsShown,
} from "../overlay3d/src/overlay3d-scene";

function at(ms: number) {
  const driver = manualDriver({ durationMs });
  const player = play(scene, driver, { cues });
  driver.seek(ms / durationMs);
  return player.values;
}

function buildArm() {
  const model = new Group();
  const bones = new Map<string, Bone>();
  for (const [name, joint] of Object.entries(ARM)) {
    const bone = new Bone();
    bone.name = name;
    const parent = joint.parent === null ? undefined : ARM[joint.parent];
    bone.position.set(
      joint.x - (parent?.x ?? 0),
      joint.y - (parent?.y ?? 0),
      joint.z - (parent?.z ?? 0),
    );
    const above = joint.parent === null ? model : bones.get(joint.parent);
    if (above === undefined) throw new Error(`No parent for ${name}.`);
    above.add(bone);
    bones.set(name, bone);
  }
  return { model, skeleton: captureSkeleton(model), tip: bones.get("tip") };
}

describe("overlay3d scene", () => {
  it("pins the arm-tip callout where Three.js puts the posed tip", () => {
    const { model, skeleton, tip } = buildArm();
    if (tip === undefined) throw new Error("No tip bone.");
    for (const ms of [600, 2200, 4000]) {
      const values = at(ms);
      applyPose3d(model, values.object);
      applyBones(skeleton, values.bones);
      model.updateMatrixWorld(true);
      const world = tip.getWorldPosition(new Vector3());
      const flat = project3d(world, lens, stage);
      expect(values.tip.x).toBeCloseTo(flat.x, 6);
      expect(values.tip.y).toBeCloseTo(flat.y, 6);
    }
  });

  it("moves the arm and turns the object", () => {
    expect(at(2200).bones.base.rotation).not.toBe(at(0).bones.base.rotation);
    expect(at(2200).object.rotationY).not.toBe(at(0).object.rotationY);
  });

  it("shows more of the caption as the cue samples arrive", () => {
    const shown = [0, 1400, 2200, 3000, 4800].map((ms) =>
      wordsShown(at(ms).caption.custom?.["words"] ?? 0),
    );
    expect(shown[0]).toBe(0);
    for (let index = 1; index < shown.length; index += 1)
      expect(shown[index]).toBeGreaterThan(shown[index - 1] ?? 0);
    expect(shown[shown.length - 1]).toBe(CAPTION.length);
  });

  it("fades a callout whose point is behind, or turned to the far side", () => {
    expect(fadeOf({ depth: 12, visible: true }, 10)).toBe(0);
    expect(fadeOf({ depth: 0, visible: false }, 10)).toBe(0);
    expect(fadeOf({ depth: 8, visible: true }, 10)).toBe(1);
    let behind = 0;
    for (let ms = 0; ms <= durationMs; ms += 100) if (at(ms).pin.opacity === 0) behind += 1;
    expect(behind).toBeGreaterThan(0);
    expect(at(0).pin.opacity).toBeGreaterThan(0);
  });

  it("limits the 3D targets and none of the callouts", () => {
    expect(Object.keys(limits).sort()).toEqual(["bones", "object"]);
  });
});
