import { describe, expect, it } from "vitest";
import {
  Bone,
  BufferGeometry,
  Euler,
  Float32BufferAttribute,
  Group,
  Skeleton,
  SkinnedMesh,
  Uint16BufferAttribute,
  Vector3,
} from "three";
import { MeshBasicMaterial } from "three";
import { bonesOf3d, chainThrough3d, fk3d, ik3d } from "@gerak/rig";
import { applyBones, captureSkeleton } from "@gerak/three/skeleton";

const DEG = Math.PI / 180;

function makeArmRig(withRestRolls: boolean) {
  const root = new Group();
  const hips = new Bone();
  hips.name = "hips";
  hips.position.set(0, 0.9, 0);

  const spine = new Bone();
  spine.name = "spine";
  spine.position.set(0, 0.35, 0);

  const shoulder = new Bone();
  shoulder.name = "shoulder";
  shoulder.position.set(0.25, 0.25, 0.1);

  const elbow = new Bone();
  elbow.name = "elbow";
  elbow.position.set(0.6, 0, 0);

  const hand = new Bone();
  hand.name = "hand";
  hand.position.set(0.5, 0, 0);

  if (withRestRolls) {
    hips.quaternion.setFromEuler(new Euler(15 * DEG, -25 * DEG, 10 * DEG, "ZXY"));
    spine.quaternion.setFromEuler(new Euler(-20 * DEG, 35 * DEG, 15 * DEG, "ZXY"));
    shoulder.quaternion.setFromEuler(new Euler(40 * DEG, -50 * DEG, 70 * DEG, "ZXY"));
    elbow.quaternion.setFromEuler(new Euler(-30 * DEG, 25 * DEG, -45 * DEG, "ZXY"));
    hand.quaternion.setFromEuler(new Euler(10 * DEG, -15 * DEG, 30 * DEG, "ZXY"));
  }

  root.add(hips);
  hips.add(spine);
  spine.add(shoulder);
  shoulder.add(elbow);
  elbow.add(hand);

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute([0, 0, 0], 3));
  geometry.setAttribute("skinIndex", new Uint16BufferAttribute([0, 0, 0, 0], 4));
  geometry.setAttribute("skinWeight", new Float32BufferAttribute([1, 0, 0, 0], 4));
  const skinned = new SkinnedMesh(geometry, new MeshBasicMaterial());
  const threeSkeleton = new Skeleton([hips, spine, shoulder, elbow, hand]);
  skinned.bind(threeSkeleton);
  root.add(skinned);

  return { root, hips, spine, shoulder, elbow, hand, skinned, threeSkeleton };
}

function worldPosition(bone: Bone): Vector3 {
  bone.updateWorldMatrix(true, true);
  return bone.getWorldPosition(new Vector3());
}

describe("skeleton capture and posing", () => {
  it("captures hierarchy parents-first and populates world rest joints", () => {
    const { root, threeSkeleton, elbow, hand } = makeArmRig(true);
    const fromRoot = captureSkeleton(root);
    expect(fromRoot.bones.map((entry) => entry.name)).toEqual([
      "hips",
      "spine",
      "shoulder",
      "elbow",
      "hand",
    ]);
    expect(fromRoot.byName.get("elbow")?.parent?.name).toBe("shoulder");

    const elbowWorld = worldPosition(elbow);
    const handWorld = worldPosition(hand);
    expect(fromRoot.joints.elbow).toEqual({
      id: "elbow",
      x: elbowWorld.x,
      y: elbowWorld.y,
      z: elbowWorld.z,
    });
    expect(fromRoot.joints.hand).toEqual({
      id: "hand",
      x: handWorld.x,
      y: handWorld.y,
      z: handWorld.z,
    });

    const fromSkeleton = captureSkeleton(threeSkeleton);
    expect(fromSkeleton.bones.map((entry) => entry.name)).toEqual(
      fromRoot.bones.map((entry) => entry.name),
    );
  });

  it("restores rest positions and quaternions bit-for-bit on an empty pose", () => {
    const { root, shoulder, elbow } = makeArmRig(true);
    const skeleton = captureSkeleton(root);
    const restShoulderPos = shoulder.position.clone();
    const restShoulderQuat = shoulder.quaternion.clone();
    const restElbowQuat = elbow.quaternion.clone();

    applyBones(skeleton, {
      hips: { x: 0.2, y: -0.1, z: 0.3, rotationY: 20 },
      shoulder: { rotation: 35, rotationX: -20 },
      elbow: { rotationY: 45 },
    });
    expect(shoulder.quaternion.angleTo(restShoulderQuat)).toBeGreaterThan(0.1);

    applyBones(skeleton, {});
    expect(shoulder.position.toArray()).toEqual(restShoulderPos.toArray());
    expect(shoulder.quaternion.toArray()).toEqual(restShoulderQuat.toArray());
    expect(elbow.quaternion.toArray()).toEqual(restElbowQuat.toArray());

    applyBones(skeleton, { shoulder: { rotation: 20 } });
    applyBones(skeleton, { shoulder: {}, elbow: {} });
    expect(shoulder.quaternion.toArray()).toEqual(restShoulderQuat.toArray());
    expect(elbow.quaternion.toArray()).toEqual(restElbowQuat.toArray());
  });

  it.each([false, true])(
    "matches fk3d world joint positions after ik3d (withRestRolls=%s)",
    (withRestRolls) => {
      const { root, elbow, hand } = makeArmRig(withRestRolls);
      const skeleton = captureSkeleton(root);
      const arm = chainThrough3d([
        { ...skeleton.joints.shoulder!, id: "shoulder" as const },
        { ...skeleton.joints.elbow!, id: "elbow" as const },
        { ...skeleton.joints.hand!, id: "hand" as const },
      ]);
      const solved = ik3d(arm, { elbow: { x: 0.4, y: 1.5, z: 0.5 } });
      const fkFrames = fk3d(arm, solved);

      applyBones(skeleton, bonesOf3d(arm, solved));

      const elbowPos = worldPosition(elbow);
      const handPos = worldPosition(hand);
      expect(elbowPos.x).toBeCloseTo(fkFrames.shoulder!.x, 5);
      expect(elbowPos.y).toBeCloseTo(fkFrames.shoulder!.y, 5);
      expect(elbowPos.z).toBeCloseTo(fkFrames.shoulder!.z, 5);
      expect(handPos.x).toBeCloseTo(fkFrames.elbow!.x, 5);
      expect(handPos.y).toBeCloseTo(fkFrames.elbow!.y, 5);
      expect(handPos.z).toBeCloseTo(fkFrames.elbow!.z, 5);
    },
  );

  it("writes bones parents-first regardless of pose key order", () => {
    const a = makeArmRig(true);
    const b = makeArmRig(true);
    const skelA = captureSkeleton(a.root);
    const skelB = captureSkeleton(b.root);

    applyBones(skelA, {
      shoulder: { rotationX: 40, rotationY: -15, rotation: 10 },
      elbow: { rotation: 25, rotationX: -12 },
    });
    applyBones(skelB, {
      elbow: { rotation: 25, rotationX: -12 },
      shoulder: { rotationX: 40, rotationY: -15, rotation: 10 },
    });

    expect(worldPosition(a.hand).distanceTo(worldPosition(b.hand))).toBeLessThan(1e-12);
    expect(a.elbow.quaternion.angleTo(b.elbow.quaternion)).toBeLessThan(1e-12);
  });

  it("translates root bones in world rest axes even under a rotated parent", () => {
    const { root, hips } = makeArmRig(true);
    root.rotation.y = Math.PI / 2;
    const skeleton = captureSkeleton(root);
    const before = worldPosition(hips);

    applyBones(skeleton, { hips: { x: 0.5, y: -0.2, z: 0.3 } });
    const after = worldPosition(hips);
    expect(after.x - before.x).toBeCloseTo(0.5, 6);
    expect(after.y - before.y).toBeCloseTo(-0.2, 6);
    expect(after.z - before.z).toBeCloseTo(0.3, 6);
  });

  it("throws on scaled bones at capture and unknown bone names on apply", () => {
    const scaled = makeArmRig(false);
    scaled.elbow.scale.set(1.2, 1, 1);
    expect(() => captureSkeleton(scaled.root)).toThrow(TypeError);
    expect(() => captureSkeleton(scaled.root)).toThrow(/elbow/);

    const valid = makeArmRig(false);
    const skeleton = captureSkeleton(valid.root);
    expect(() => applyBones(skeleton, { unknownBone: { rotation: 10 } })).toThrow(RangeError);
    expect(() => applyBones(skeleton, { unknownBone: { rotation: 10 } })).toThrow(/unknownBone/);
  });
});
