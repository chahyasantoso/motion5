import type { Pose3d } from "@gerak/moves";
import { jointOf, type Joint3d } from "@gerak/rig";
import { Bone, Euler, Quaternion, Skeleton, SkinnedMesh, Vector3, type Object3D } from "three";
import { setEulerDegrees } from "./pose3d";

const SCALE_TOLERANCE = 1e-3;

const scratchPos = new Vector3();
const scratchScale = new Vector3();
const scratchParentScale = new Vector3();
const scratchWorldQuat = new Quaternion();
const scratchParentQuat = new Quaternion();
const scratchInvParent = new Quaternion();
const scratchDelta = new Quaternion();
const scratchOffset = new Vector3();
const scratchEuler = new Euler(0, 0, 0, "ZXY");

/** A captured Three.js bone with its rest local and world transforms and its world rest joint. */
export type CapturedBone = {
  readonly name: string;
  readonly bone: Bone;
  readonly parent: CapturedBone | undefined;
  readonly restPosition: Readonly<Vector3>;
  readonly restQuaternion: Readonly<Quaternion>;
  readonly restWorldQuaternion: Readonly<Quaternion>;
  readonly restParentWorldQuaternion: Readonly<Quaternion>;
  readonly restParentWorldScale: Readonly<Vector3>;
  readonly joint: Joint3d;
};

/** A Three.js skeleton captured at rest: bones parent-before-child, lookup by name, and world rest joints. */
export type CapturedSkeleton = {
  readonly bones: readonly CapturedBone[];
  readonly byName: ReadonlyMap<string, CapturedBone>;
  readonly joints: Readonly<Record<string, Joint3d>>;
  joint<Name extends string>(name: Name): Joint3d<Name>;
};

function isFiniteVec3(v: Vector3): boolean {
  return Number.isFinite(v.x) && Number.isFinite(v.y) && Number.isFinite(v.z);
}

function isUnitScale(v: Vector3): boolean {
  return (
    Math.abs(v.x - 1) <= SCALE_TOLERANCE &&
    Math.abs(v.y - 1) <= SCALE_TOLERANCE &&
    Math.abs(v.z - 1) <= SCALE_TOLERANCE
  );
}

function isUniformPositiveScale(v: Vector3): boolean {
  return (
    Number.isFinite(v.x) &&
    Number.isFinite(v.y) &&
    Number.isFinite(v.z) &&
    v.x > SCALE_TOLERANCE &&
    Math.abs(v.x - v.y) <= SCALE_TOLERANCE * v.x &&
    Math.abs(v.x - v.z) <= SCALE_TOLERANCE * v.x
  );
}

function collectBones(source: Object3D | Skeleton): readonly Bone[] {
  const seen = new Set<Bone>();
  const collected: Bone[] = [];
  const add = (bone: Bone): void => {
    if (!seen.has(bone)) {
      seen.add(bone);
      collected.push(bone);
    }
  };
  if (source instanceof Skeleton) {
    for (const bone of source.bones) add(bone);
  } else {
    source.traverse((node) => {
      if (node instanceof Bone) add(node);
      if (node instanceof SkinnedMesh) for (const bone of node.skeleton.bones) add(bone);
    });
  }
  return collected;
}

function parentBoneOf(bone: Bone, memberSet: ReadonlySet<Bone>): Bone | undefined {
  let current = bone.parent;
  while (current !== null) {
    if (current instanceof Bone && memberSet.has(current)) return current;
    current = current.parent;
  }
  return undefined;
}

function topAncestorOf(object: Object3D): Object3D {
  let current = object;
  while (current.parent !== null) current = current.parent;
  return current;
}

/** Captures rest poses and world joints of a Three.js `Object3D` or `Skeleton`; throws on scaled or unnamed bones. */
export function captureSkeleton(source: Object3D | Skeleton): CapturedSkeleton {
  const raw = collectBones(source);
  if (raw.length === 0) throw new TypeError("captureSkeleton: no bones found.");

  const roots = new Set(raw.map(topAncestorOf));
  for (const root of roots) root.updateWorldMatrix(true, true);

  const memberSet = new Set(raw);
  const depthOf = (bone: Bone): number => {
    let depth = 0;
    let parent = parentBoneOf(bone, memberSet);
    while (parent !== undefined) {
      depth += 1;
      parent = parentBoneOf(parent, memberSet);
    }
    return depth;
  };

  const ordered = raw
    .map((bone, index) => ({ bone, index, depth: depthOf(bone) }))
    .sort((a, b) => a.depth - b.depth || a.index - b.index)
    .map(({ bone }) => bone);

  const bones: CapturedBone[] = [];
  const byName = new Map<string, CapturedBone>();
  const byBone = new Map<Bone, CapturedBone>();
  const joints: Record<string, Joint3d> = {};

  for (const bone of ordered) {
    if (bone.name.trim() === "") {
      throw new TypeError("captureSkeleton: every bone must have a non-empty name.");
    }
    if (byName.has(bone.name)) {
      throw new TypeError(`captureSkeleton: duplicate bone name "${bone.name}".`);
    }
    if (!isUnitScale(bone.scale)) {
      throw new TypeError(
        `captureSkeleton: bone "${bone.name}" has non-unit scale (${bone.scale.toArray().join(", ")}).`,
      );
    }
    bone.matrixWorld.decompose(scratchPos, scratchWorldQuat, scratchScale);
    if (!isFiniteVec3(bone.position) || !isFiniteVec3(scratchPos)) {
      throw new TypeError(`captureSkeleton: bone "${bone.name}" has non-finite position.`);
    }
    if (!isUniformPositiveScale(scratchScale)) {
      throw new TypeError(
        `captureSkeleton: bone "${bone.name}" has non-uniform or non-positive world scale (${scratchScale.toArray().join(", ")}).`,
      );
    }

    if (bone.parent === null) {
      scratchParentQuat.identity();
      scratchParentScale.set(1, 1, 1);
    } else {
      bone.parent.matrixWorld.decompose(scratchOffset, scratchParentQuat, scratchParentScale);
      scratchParentQuat.normalize();
      if (!isUniformPositiveScale(scratchParentScale)) {
        throw new TypeError(
          `captureSkeleton: parent of bone "${bone.name}" has non-uniform or non-positive world scale (${scratchParentScale.toArray().join(", ")}).`,
        );
      }
    }

    const parentBone = parentBoneOf(bone, memberSet);
    const parent = parentBone === undefined ? undefined : byBone.get(parentBone);
    const joint: Joint3d = Object.freeze({
      id: bone.name,
      x: scratchPos.x,
      y: scratchPos.y,
      z: scratchPos.z,
    });
    const entry: CapturedBone = Object.freeze({
      name: bone.name,
      bone,
      parent,
      restPosition: bone.position.clone(),
      restQuaternion: bone.quaternion.clone(),
      restWorldQuaternion: scratchWorldQuat.clone().normalize(),
      restParentWorldQuaternion: scratchParentQuat.clone(),
      restParentWorldScale: scratchParentScale.clone(),
      joint,
    });
    bones.push(entry);
    byName.set(entry.name, entry);
    byBone.set(bone, entry);
    joints[entry.name] = joint;
  }

  return Object.freeze({
    bones: Object.freeze(bones),
    byName,
    joints: Object.freeze(joints),
    joint<Name extends string>(name: Name): Joint3d<Name> {
      return jointOf(joints, name);
    },
  });
}

/** Applies per-bone `Pose3d` deltas (from `bonesOf3d` or hand-keyed) relative to rest, resetting omitted bones. */
export function applyBones(
  skeleton: CapturedSkeleton,
  poses: Readonly<Record<string, Pose3d>>,
): void {
  for (const name of Object.keys(poses)) {
    if (!skeleton.byName.has(name)) {
      throw new RangeError(`applyBones: unknown bone "${name}".`);
    }
  }

  for (const entry of skeleton.bones) {
    const pose = poses[entry.name];
    const dx = pose?.x ?? 0;
    const dy = pose?.y ?? 0;
    const dz = pose?.z ?? 0;
    if (dx === 0 && dy === 0 && dz === 0) {
      entry.bone.position.copy(entry.restPosition);
    } else {
      scratchInvParent.copy(entry.restParentWorldQuaternion).invert();
      scratchOffset
        .set(dx, dy, dz)
        .applyQuaternion(scratchInvParent)
        .divide(entry.restParentWorldScale);
      entry.bone.position.copy(entry.restPosition).add(scratchOffset);
    }

    const rz = pose?.rotation ?? 0;
    const rx = pose?.rotationX ?? 0;
    const ry = pose?.rotationY ?? 0;
    if (rz === 0 && rx === 0 && ry === 0) {
      entry.bone.quaternion.copy(entry.restQuaternion);
    } else {
      setEulerDegrees(scratchEuler, rz, rx, ry);
      scratchDelta.setFromEuler(scratchEuler);
      scratchInvParent.copy(entry.restParentWorldQuaternion).invert();
      entry.bone.quaternion
        .copy(scratchInvParent)
        .multiply(scratchDelta)
        .multiply(entry.restParentWorldQuaternion)
        .multiply(entry.restQuaternion)
        .normalize();
    }
  }

  for (const entry of skeleton.bones) {
    if (entry.parent === undefined) entry.bone.updateWorldMatrix(true, true);
  }
}
