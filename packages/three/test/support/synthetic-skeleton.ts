import { Bone, Euler, Object3D, Skeleton } from "three";

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
