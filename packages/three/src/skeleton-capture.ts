import { Bone, Object3D, Quaternion, Skeleton, Vector3 } from "three";
import { normalizeDirection } from "./skeleton-direction";

export interface SkeletonBindingOptions {
  /** Maps authored bone.name to rig key; an unmapped bone still joins the hierarchy. */
  readonly boneKeys: Readonly<Record<string, string>>;
  /**
   * Maps authored bone.name to the direct child name aimed at; a sole child is the default aim.
   * A branching bone needs an entry because child order is not stable. */
  readonly aimChildren?: Readonly<Record<string, string>>;
}

export interface CapturedBone {
  /** Stable live bone identity; Skeleton.bones may reorder without retargeting the binding. */
  readonly bone: Bone;
  readonly key: string | undefined;
  readonly index: number;
  readonly parent: number | undefined;
  readonly depth: number;
  readonly restPosition: Readonly<Vector3>;
  readonly restQuaternion: Readonly<Quaternion>;
  /**
   * restQuaternion applied to normalize(aim child restPosition), in parent space.
   * Undefined without one unambiguous, non-degenerate aim child; an aim drive then holds. */
  readonly restAim: Readonly<Vector3> | undefined;
}

export interface SkeletonBinding {
  readonly skeleton: Skeleton;
  readonly rootParent: Object3D;
  readonly bones: readonly CapturedBone[];
  /** Throws TypeError for an unknown key (programmer error). */
  boneOf(key: string): Bone;
}

/**
 * Bone scale tolerance: float32 Mixamo FBX lands ~2e-5 off unit, 0.002% of a bone length;
 * above it a bone is really scaled. */
export const SCALE_NOISE_TOLERANCE = 1e-3;

/**
 * Throws TypeError when rigid FK cannot represent bone scale or non-uniform ancestor scale.
 * Bone scale is absolute against 1; ancestor uniformity is relative to its own scale. */
export function assertSkeletonScale(bones: readonly Bone[], rootParent: Object3D): void {
  for (const bone of bones) {
    const scale = bone.scale.toArray();
    if (
      !scale.every(
        (value) => Number.isFinite(value) && Math.abs(value - 1) <= SCALE_NOISE_TOLERANCE,
      )
    )
      throw new TypeError(
        `Bone "${bone.name}" has scale [${scale.join(", ")}] but must be unit scale within ` +
          `${SCALE_NOISE_TOLERANCE}. Apply transforms and clear bone scale when exporting.`,
      );
  }
  for (let ancestor: Object3D | null = rootParent; ancestor !== null; ancestor = ancestor.parent) {
    const { x, y, z } = ancestor.scale;
    if (
      ![x, y, z].every(Number.isFinite) ||
      Math.abs(x) <= 1e-9 ||
      Math.abs(x - y) > SCALE_NOISE_TOLERANCE * Math.abs(x) ||
      Math.abs(x - z) > SCALE_NOISE_TOLERANCE * Math.abs(x)
    )
      throw new TypeError(
        `Skeleton ancestor "${ancestor.name}" has scale [${x}, ${y}, ${z}] but must be ` +
          `non-zero and uniform within ${SCALE_NOISE_TOLERANCE}.`,
      );
  }
}

/**
 * Unit-quaternion lengthSq tolerance: glTF float32 rotation lands up to ~1e-7 off in lengthSq;
 * 1e-6 keeps a 10x margin and still refuses a genuinely unnormalized rotation. */
export const ROTATION_NOISE_TOLERANCE = 1e-6;

function assertRestTransform(object: Object3D): void {
  if (
    !object.position.toArray().every(Number.isFinite) ||
    !object.quaternion.toArray().every(Number.isFinite) ||
    Math.abs(object.quaternion.lengthSq() - 1) > ROTATION_NOISE_TOLERANCE
  )
    throw new TypeError(`Object "${object.name}" must have a finite rigid rest transform.`);
}

/** Throws when hierarchy differs from captured topology; never drive the wrong bones. */
export function assertCapturedHierarchy(binding: SkeletonBinding): void {
  for (const captured of binding.bones) {
    const expectedParent =
      captured.parent === undefined ? binding.rootParent : binding.bones[captured.parent]!.bone;
    if (captured.bone.parent !== expectedParent)
      throw new TypeError("Captured skeleton hierarchy changed.");
  }
}

/** Reads rest data once without editing bind matrices, inverse binds or the live pose. */
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
    // Already validated; store exactly unit so the driver never re-applies noise.
    const restQuaternion = bone.quaternion.clone().normalize();
    const child = aimChildOf(bone);
    const direction = child?.position.clone();
    const restAim =
      direction !== undefined && normalizeDirection(direction)
        ? direction.applyQuaternion(restQuaternion)
        : undefined;
    return Object.freeze({
      bone,
      key: keys.get(bone),
      index,
      parent: parents[index],
      depth: depthOf(index),
      restPosition: Object.freeze(bone.position.clone()),
      restQuaternion: Object.freeze(restQuaternion),
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
