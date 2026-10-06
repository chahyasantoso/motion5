import { describe, expect, it } from "vitest";
import { Bone, Group, Matrix4, Quaternion, Skeleton, Vector3 } from "three";
import { captureSkeleton, createSkeletonDriver } from "../src/skeleton";

/** Hips under an armature under the source space, with a chosen rest rotation. */
function hipsRig(rest: Quaternion, armature = new Quaternion()) {
  const source = new Group();
  const armatureNode = new Group();
  armatureNode.quaternion.copy(armature);
  armatureNode.scale.setScalar(1000);
  source.add(armatureNode);
  const hips = new Bone();
  hips.name = "Hips";
  hips.position.set(0, 0.9, 0);
  hips.quaternion.copy(rest);
  armatureNode.add(hips);
  source.updateMatrixWorld(true);
  const binding = captureSkeleton(new Skeleton([hips]), { boneKeys: { Hips: "hips" } });
  const driver = createSkeletonDriver(binding, {
    sourceSpace: source,
    drives: { hips: { kind: "basis", source: "torso" } },
  });
  return { source, hips, driver };
}

const worldQuaternion = (bone: Bone) => bone.getWorldQuaternion(new Quaternion());
const RX90 = new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), Math.PI / 2);

describe("basis drive (#559 item 4)", () => {
  it("D15 an identity basis keeps a rotated rest orientation and places the origin", () => {
    const rig = hipsRig(RX90);
    expect(rig.driver.apply(() => ({ x: 5, y: 900, z: -2 })).bones.get("hips")).toEqual({
      kind: "applied",
    });
    expect(rig.hips.quaternion.angleTo(RX90)).toBeLessThan(1e-9);
    const origin = rig.hips.getWorldPosition(new Vector3());
    expect(origin.distanceTo(new Vector3(5, 900, -2))).toBeLessThan(1e-6);
  });

  it("D16 a turned basis turns the rest world orientation in source space", () => {
    const rig = hipsRig(RX90, new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), Math.PI));
    const restWorld = worldQuaternion(rig.hips);
    rig.driver.apply(() => ({ rotationY: 30 }));
    const turn = new Quaternion().setFromRotationMatrix(new Matrix4().makeRotationY(Math.PI / 6));
    expect(worldQuaternion(rig.hips).angleTo(turn.multiply(restWorld))).toBeLessThan(1e-9);
  });

  it("D17 an identity basis under a flipped armature leaves identity-rest hips at rest", () => {
    const flip = new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), Math.PI);
    const rig = hipsRig(new Quaternion(), flip);
    rig.driver.apply(() => ({}));
    expect(rig.hips.quaternion.angleTo(new Quaternion())).toBeLessThan(1e-9);
  });
});
