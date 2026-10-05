import {
  Bone,
  BufferGeometry,
  Euler,
  Group,
  MeshBasicMaterial,
  Object3D,
  Skeleton,
  SkinnedMesh,
} from "three";

/** One texture-free, non-identity rest rig shared by skeleton and avatar tests. */
export function syntheticSkeleton() {
  const rootParent = new Object3D();
  rootParent.position.set(3, -2, 7);
  rootParent.rotation.set(0.2, -0.3, 0.4);
  rootParent.scale.setScalar(0.01);
  const root = new Bone();
  root.name = "hips";
  root.position.set(1, 2, 3);
  root.quaternion.setFromEuler(new Euler(0.3, -0.2, 0.5, "ZXY"));
  const middle = new Bone();
  middle.name = "middle";
  middle.position.set(2, 4, -1);
  middle.quaternion.setFromEuler(new Euler(-0.4, 0.2, -0.1, "ZXY"));
  const tip = new Bone();
  tip.name = "tip";
  tip.position.set(0, 5, 2);
  rootParent.add(root);
  root.add(middle);
  middle.add(tip);
  rootParent.updateMatrixWorld(true);
  // Deliberately not parent-first: drivers must sort by depth, not input order.
  const skeleton = new Skeleton([tip, root, middle]);
  return { skeleton, rootParent, root, middle, tip, boneKeys: { hips: "hips", tip: "hand" } };
}

/** A complete named humanoid, with terminal bones so lower limbs have a measurable rest aim. */
export function syntheticHumanoid(prefix = "mixamorig:") {
  const names = [
    "Hips",
    "LeftArm",
    "LeftForeArm",
    "LeftHand",
    "RightArm",
    "RightForeArm",
    "RightHand",
    "LeftUpLeg",
    "LeftLeg",
    "LeftFoot",
    "RightUpLeg",
    "RightLeg",
    "RightFoot",
  ];
  const parents = [-1, 0, 1, 2, 0, 4, 5, 0, 7, 8, 0, 10, 11];
  const positions = [
    [0, 0.9, 0],
    [0.2, 0.4, 0],
    [0.25, 0, 0],
    [0.25, 0, 0],
    [-0.2, 0.4, 0],
    [-0.25, 0, 0],
    [-0.25, 0, 0],
    [0.1, -0.1, 0],
    [0, -0.4, 0],
    [0, -0.4, 0],
    [-0.1, -0.1, 0],
    [0, -0.4, 0],
    [0, -0.4, 0],
  ];
  const scene = new Group();
  const bones = names.map((name, index) => {
    const bone = new Bone();
    bone.name = `${prefix}${name}`;
    bone.position.fromArray(positions[index]!);
    return bone;
  });
  bones.forEach((bone, index) => {
    const parent = parents[index]!;
    (parent < 0 ? scene : bones[parent]!).add(bone);
  });
  scene.updateMatrixWorld(true);
  const skeleton = new Skeleton(bones);
  const mesh = new SkinnedMesh(new BufferGeometry(), new MeshBasicMaterial());
  scene.add(mesh);
  mesh.bind(skeleton);
  return { scene, skeleton, mesh, bones };
}
