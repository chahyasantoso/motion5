import { Bone, Object3D, Quaternion, Skeleton, Vector3 } from "three";
import { normalizeDirection } from "./skeleton-direction";

export interface SkeletonBindingOptions {
  /** Authored bone.name to rig key. Unmapped bones still participate in the hierarchy. */
  readonly boneKeys: Readonly<Record<string, string>>;
  /**
   * Authored bone.name to the authored name of the direct child bone it aims at. A bone with
   * exactly one child bone aims at it by default; a branching bone has a rest aim only when named
   * here, because skeleton child order is not a stable choice.
   */
  readonly aimChildren?: Readonly<Record<string, string>>;
}

export interface CapturedBone {
  /** Stable live bone identity; Skeleton.bones may be reordered without retargeting the binding. */
  readonly bone: Bone;
  readonly key: string | undefined;
  readonly index: number;
  readonly parent: number | undefined;
  readonly depth: number;
  readonly restPosition: Readonly<Vector3>;
  readonly restQuaternion: Readonly<Quaternion>;
  /**
   * restQuaternion applied to normalize(aim child restPosition), in the bone's parent space.
   * Undefined for a bone with no unambiguous, non-degenerate aim child: an aim drive then holds.
   */
  readonly restAim: Readonly<Vector3> | undefined;
}

export interface SkeletonBinding {
  readonly skeleton: Skeleton;
  readonly rootParent: Object3D;
  readonly bones: readonly CapturedBone[];
  /** Throws TypeError for an unknown key (programmer error). */
  boneOf(key: string): Bone;
}

/** Rigid FK cannot represent bone scale or non-uniform ancestor scale. */
export function assertSkeletonScale(bones: readonly Bone[], rootParent: Object3D): void {
  for (const bone of bones) {
    if (
      !bone.scale.toArray().every((value) => Number.isFinite(value) && Math.abs(value - 1) <= 1e-6)
    )
      throw new TypeError(`Bone "${bone.name}" must have unit scale.`);
  }
  for (let ancestor: Object3D | null = rootParent; ancestor !== null; ancestor = ancestor.parent) {
    const { x, y, z } = ancestor.scale;
    if (
      ![x, y, z].every(Number.isFinite) ||
      Math.abs(x) <= 1e-9 ||
      Math.abs(x - y) > 1e-6 ||
      Math.abs(x - z) > 1e-6
    )
      throw new TypeError("Skeleton ancestors must have non-zero uniform scale.");
  }
}

function assertRestTransform(object: Object3D): void {
  if (
    !object.position.toArray().every(Number.isFinite) ||
    !object.quaternion.toArray().every(Number.isFinite) ||
    Math.abs(object.quaternion.lengthSq() - 1) > 1e-9
  )
    throw new TypeError(`Object "${object.name}" must have a finite rigid rest transform.`);
}

/** Changing the hierarchy invalidates captured topology; refuse rather than drive the wrong bones. */
export function assertCapturedHierarchy(binding: SkeletonBinding): void {
  for (const captured of binding.bones) {
    const expectedParent =
      captured.parent === undefined ? binding.rootParent : binding.bones[captured.parent]!.bone;
    if (captured.bone.parent !== expectedParent)
      throw new TypeError("Captured skeleton hierarchy changed.");
  }
}

/** Capture rest data once; never edits bind matrices, inverse binds or the live pose. */
export function captureSkeleton(
  skeleton: Skeleton,
  options: SkeletonBindingOptions,
): SkeletonBinding {
  const bones = [...skeleton.bones];
  if (bones.length === 0 || new Set(bones).size !== bones.length)
    throw new TypeError("Skeleton must contain distinct bones.");
  const indices = new Map(bones.map((bone, index) => [bone, index]));
  const parents = bones.map((bone) =>
    bone.parent instanceof Bone ? indices.get(bone.parent) : undefined,
  );
  const roots = bones.filter((_, index) => parents[index] === undefined);
  const rootParent = roots[0]?.parent;
  if (
    rootParent === undefined ||
    rootParent === null ||
    roots.some((bone) => bone.parent !== rootParent)
  )
    throw new TypeError("Skeleton roots must share one root parent.");
  assertSkeletonScale(bones, rootParent);
  for (const bone of bones) assertRestTransform(bone);
  for (let ancestor: Object3D | null = rootParent; ancestor !== null; ancestor = ancestor.parent)
    assertRestTransform(ancestor);

  const uniqueBone = (name: string): Bone => {
    const matches = bones.filter((bone) => bone.name === name);
    if (matches.length !== 1)
      throw new TypeError(`Bone name "${name}" must match exactly one bone.`);
    return matches[0]!;
  };
  const keys = new Map<Bone, string>();
  const mapped = new Map<string, Bone>();
  for (const [name, key] of Object.entries(options.boneKeys)) {
    const bone = uniqueBone(name);
    if (typeof key !== "string" || key.length === 0 || key.includes(":") || mapped.has(key))
      throw new TypeError(`Bone key "${key}" must be unique, non-empty and contain no ':'.`);
    keys.set(bone, key);
    mapped.set(key, bone);
  }
  const aimChildren = new Map<Bone, Bone>();
  for (const [name, childName] of Object.entries(options.aimChildren ?? {})) {
    const bone = uniqueBone(name);
    const child = uniqueBone(childName);
    if (child.parent !== bone)
      throw new TypeError(`Aim child "${childName}" must be a direct child of "${name}".`);
    aimChildren.set(bone, child);
  }
  const aimChildOf = (bone: Bone): Bone | undefined => {
    const named = aimChildren.get(bone);
    if (named !== undefined) return named;
    const children = bones.filter((child) => child.parent === bone);
    return children.length === 1 ? children[0] : undefined;
  };
  const depthOf = (index: number): number => {
    const seen = new Set<number>([index]);
    let depth = 0;
    let parent = parents[index];
    while (parent !== undefined) {
      if (seen.has(parent)) throw new TypeError("Skeleton hierarchy must be acyclic.");
      seen.add(parent);
      depth += 1;
      parent = parents[parent];
    }
    return depth;
  };
  const captured = bones.map((bone, index): CapturedBone => {
    const child = aimChildOf(bone);
    const direction = child?.position.clone();
    const restAim =
      direction !== undefined && normalizeDirection(direction)
        ? direction.applyQuaternion(bone.quaternion)
        : undefined;
    return Object.freeze({
      bone,
      key: keys.get(bone),
      index,
      parent: parents[index],
      depth: depthOf(index),
      restPosition: Object.freeze(bone.position.clone()),
      restQuaternion: Object.freeze(bone.quaternion.clone()),
      restAim: restAim === undefined ? undefined : Object.freeze(restAim),
    });
  });
  return Object.freeze({
    skeleton,
    rootParent,
    bones: Object.freeze(captured),
    boneOf(key: string) {
      const bone = mapped.get(key);
      if (bone === undefined) throw new TypeError(`Unknown skeleton bone key "${key}".`);
      return bone;
    },
  });
}
