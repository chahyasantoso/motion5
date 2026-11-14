import {
  Bone,
  BufferGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Vector3,
} from "three";
import { describe, expect, it } from "vitest";
import { manualDriver, play } from "@gerak/player";
import { applyPose3d, morphTargets } from "@gerak/three";
import { applyBones, captureSkeleton } from "@gerak/three/skeleton";
import {
  BALL_RADIUS,
  BALL_SPAWN,
  CHARACTER_FOCUS,
  PEDESTAL,
  REACH_TARGET,
  SKELETON_JOINTS,
  clock,
  durationMs,
  scene,
} from "../src/character3d-scene";

function at(ms: number) {
  const driver = manualDriver({ durationMs });
  const player = play(scene, driver);
  driver.seek(ms / durationMs);
  return player.values;
}

function buildTestArmHierarchy() {
  const root = new Group();
  const hips = new Bone();
  hips.name = "hips";
  hips.position.set(SKELETON_JOINTS.hips.x, SKELETON_JOINTS.hips.y, SKELETON_JOINTS.hips.z);

  const spine = new Bone();
  spine.name = "spine";
  spine.position.set(
    SKELETON_JOINTS.spine.x - SKELETON_JOINTS.hips.x,
    SKELETON_JOINTS.spine.y - SKELETON_JOINTS.hips.y,
    SKELETON_JOINTS.spine.z - SKELETON_JOINTS.hips.z,
  );

  const shoulder = new Bone();
  shoulder.name = "shoulder";
  shoulder.position.set(
    SKELETON_JOINTS.shoulder.x - SKELETON_JOINTS.spine.x,
    SKELETON_JOINTS.shoulder.y - SKELETON_JOINTS.spine.y,
    SKELETON_JOINTS.shoulder.z - SKELETON_JOINTS.spine.z,
  );

  const elbow = new Bone();
  elbow.name = "elbow";
  elbow.position.set(
    SKELETON_JOINTS.elbow.x - SKELETON_JOINTS.shoulder.x,
    SKELETON_JOINTS.elbow.y - SKELETON_JOINTS.shoulder.y,
    SKELETON_JOINTS.elbow.z - SKELETON_JOINTS.shoulder.z,
  );

  const hand = new Bone();
  hand.name = "hand";
  hand.position.set(
    SKELETON_JOINTS.hand.x - SKELETON_JOINTS.elbow.x,
    SKELETON_JOINTS.hand.y - SKELETON_JOINTS.elbow.y,
    SKELETON_JOINTS.hand.z - SKELETON_JOINTS.elbow.z,
  );

  root.add(hips);
  hips.add(spine);
  spine.add(shoulder);
  shoulder.add(elbow);
  elbow.add(hand);

  const head = new Mesh(new BufferGeometry(), new MeshBasicMaterial());
  head.morphTargetDictionary = { smile: 0, blink: 1 };
  head.morphTargetInfluences = [0, 0];
  spine.add(head);

  return { root, hand, head };
}

function flatNumbers(
  value: unknown,
  prefix = "",
  into = new Map<string, number>(),
): Map<string, number> {
  if (typeof value === "number") {
    into.set(prefix, value);
  } else if (value !== null && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      flatNumbers(item, prefix === "" ? key : `${prefix}.${key}`, into);
    }
  }
  return into;
}

describe("the 3D character example scene", () => {
  it("starts at rest with neutral morphs and elevated 3D physics ball", () => {
    const start = at(0);
    expect(start.bones).toEqual({ spine: {}, shoulder: {}, elbow: {} });
    expect(start.character.custom?.smile ?? 0).toBe(0);
    expect(start.character.custom?.blink ?? 0).toBe(0);
    expect(start.ball).toEqual({});
    expect(BALL_SPAWN.y).toBeGreaterThan(PEDESTAL.y + PEDESTAL.height / 2 + 0.5);
    const originalRaf = globalThis.requestAnimationFrame;
    const originalCancel = globalThis.cancelAnimationFrame;
    globalThis.requestAnimationFrame = () => 1;
    globalThis.cancelAnimationFrame = () => {};
    try {
      const driver = clock();
      expect(driver).toBeDefined();
      driver.dispose();
    } finally {
      globalThis.requestAnimationFrame = originalRaf;
      globalThis.cancelAnimationFrame = originalCancel;
    }
  });

  it("drives a Three.js skeleton arm in 3D via ik3d + bonesOf3d to the reach target", () => {
    const { root, hand } = buildTestArmHierarchy();
    const skeleton = captureSkeleton(root);
    const mid = at(2200);

    applyBones(skeleton, mid.bones);
    hand.updateWorldMatrix(true, true);
    const handPos = hand.getWorldPosition(new Vector3());

    expect(
      handPos.distanceTo(new Vector3(REACH_TARGET.x, REACH_TARGET.y, REACH_TARGET.z)),
    ).toBeLessThan(0.05);
  });

  it("drops and settles the 3D ball onto the pedestal and aims the orbiting camera", () => {
    const end = at(durationMs);
    const pedestalTop = PEDESTAL.y + PEDESTAL.height / 2;
    const settledY = BALL_SPAWN.y + (end.ball.y ?? 0);
    expect(Math.abs(settledY - (pedestalTop + BALL_RADIUS))).toBeLessThan(0.05);

    const lens = new PerspectiveCamera();
    applyPose3d(lens, end.camera);
    lens.updateMatrixWorld(true);
    const forward = lens.getWorldDirection(new Vector3());
    const wanted = new Vector3(
      CHARACTER_FOCUS.x - (end.camera.x ?? 0),
      CHARACTER_FOCUS.y - (end.camera.y ?? 0),
      CHARACTER_FOCUS.z - (end.camera.z ?? 0),
    ).normalize();
    expect(forward.distanceTo(wanted)).toBeLessThan(1e-5);
  });

  it("drives facial morph targets through applyPose3d and morphTargets", () => {
    const { root, head } = buildTestArmHierarchy();
    const writer = morphTargets(root);

    applyPose3d(root, at(1350).character, undefined, writer);
    expect(head.morphTargetInfluences?.[1] ?? 0).toBeGreaterThan(0.5);

    applyPose3d(root, at(durationMs).character, undefined, writer);
    expect(head.morphTargetInfluences?.[0] ?? 0).toBeGreaterThan(0.7);
    expect(head.morphTargetInfluences?.[1] ?? 0).toBeCloseTo(0, 5);
  });

  it("holds everything still for the last 600 ms", () => {
    const held = flatNumbers(at(durationMs - 600));
    for (const [key, value] of flatNumbers(at(durationMs))) {
      expect(held.get(key), key).toBeCloseTo(value, 3);
    }
  });
});
