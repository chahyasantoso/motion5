import { unreachable } from "@motion5/core/plugin-api";
import { readFrame3d } from "@motion5/plugins/frame3d";
import { readRigValues } from "@motion5/plugins/rig";
import { Matrix4, Quaternion, Vector3, type Object3D } from "three";
import { frameToMatrix } from "./index";
import type { SkeletonBinding } from "./skeleton-capture";

export type BoneDrive =
  | { readonly kind: "frame"; readonly source: string }
  | { readonly kind: "aim"; readonly from: string; readonly to: string }
  | { readonly kind: "rest" };
export type BoneOutcome =
  | { readonly kind: "applied" }
  | { readonly kind: "held"; readonly reason: "source-missing" | "degenerate-direction" }
  | { readonly kind: "rest" };
export type FrameSource = (source: string) => Readonly<Record<string, unknown>> | undefined;
export interface SkeletonDriverOptions {
  readonly sourceSpace: Object3D;
  readonly drives: Readonly<Record<string, BoneDrive>>;
}
export interface SkeletonDriver {
  apply(read: FrameSource): { readonly bones: ReadonlyMap<string, BoneOutcome> };
  /** Restore every captured bone, including unmapped intermediate bones. */
  reset(): void;
}

const APPLIED: BoneOutcome = Object.freeze({ kind: "applied" });
const REST: BoneOutcome = Object.freeze({ kind: "rest" });
const MISSING: BoneOutcome = Object.freeze({ kind: "held", reason: "source-missing" });
const DEGENERATE: BoneOutcome = Object.freeze({ kind: "held", reason: "degenerate-direction" });

export function describeBoneOutcome(outcome: BoneOutcome): string {
  switch (outcome.kind) {
    case "applied":
      return "Bone transform applied.";
    case "rest":
      return "Bone restored to rest.";
    case "held":
      switch (outcome.reason) {
        case "source-missing":
          return "Bone held: source missing.";
        case "degenerate-direction":
          return "Bone held: degenerate direction.";
        default:
          return unreachable(outcome.reason);
      }
    default:
      return unreachable(outcome);
  }
}

/** Snapshot drives and fix parent-before-child order once, with all unit conversion in the scene. */
export function createSkeletonDriver(
  binding: SkeletonBinding,
  options: SkeletonDriverOptions,
): SkeletonDriver {
  const drives = new Map<string, BoneDrive>();
  const sourceName = (name: string): void => {
    if (typeof name !== "string" || name.length === 0)
      throw new TypeError("Bone drive sources must be non-empty strings.");
  };
  for (const [key, drive] of Object.entries(options.drives)) {
    binding.boneOf(key);
    switch (drive.kind) {
      case "frame":
        sourceName(drive.source);
        break;
      case "aim":
        sourceName(drive.from);
        sourceName(drive.to);
        break;
      case "rest":
        break;
      default:
        throw new TypeError("Unknown bone drive kind.");
    }
    drives.set(key, Object.freeze({ ...drive }));
  }
  const sourceSpace = options.sourceSpace;
  const ordered = [...binding.bones].sort((a, b) => a.depth - b.depth || a.index - b.index);
  const bones = [...binding.skeleton.bones];
  const matrix = new Matrix4();
  const parentFromSource = new Matrix4();
  const position = new Vector3();
  const scale = new Vector3();
  const quaternion = new Quaternion();
  const from = new Vector3();
  const to = new Vector3();
  const aim = new Vector3();

  return {
    apply(read) {
      binding.rootParent.updateWorldMatrix(true, true);
      sourceSpace.updateWorldMatrix(true, false);
      const outcomes = new Map<string, BoneOutcome>();
      for (const captured of ordered) {
        if (captured.key === undefined) continue;
        const drive = drives.get(captured.key);
        if (drive === undefined) continue;
        const bone = bones[captured.index]!;
        parentFromSource.copy(bone.parent!.matrixWorld).invert().multiply(sourceSpace.matrixWorld);
        switch (drive.kind) {
          case "frame": {
            const values = read(drive.source);
            if (values === undefined) {
              outcomes.set(captured.key, MISSING);
              continue;
            }
            matrix.multiplyMatrices(parentFromSource, frameToMatrix(values, matrix));
            matrix.decompose(position, quaternion, scale);
            bone.position.copy(position);
            bone.quaternion.copy(quaternion);
            outcomes.set(captured.key, APPLIED);
            break;
          }
          case "aim": {
            const a = read(drive.from);
            const b = read(drive.to);
            if (a === undefined || b === undefined) {
              outcomes.set(captured.key, MISSING);
              continue;
            }
            const p = readFrame3d(a),
              q = readFrame3d(b);
            from.set(p.x, p.y, p.z).applyMatrix4(parentFromSource);
            to.set(q.x, q.y, q.z).applyMatrix4(parentFromSource).sub(from);
            if (to.length() <= 1e-9 || captured.restAim === undefined) {
              outcomes.set(captured.key, DEGENERATE);
              continue;
            }
            aim.copy(captured.restAim);
            quaternion.setFromUnitVectors(aim, to.normalize()).multiply(captured.restQuaternion);
            bone.position.copy(captured.restPosition);
            bone.quaternion.copy(quaternion);
            outcomes.set(captured.key, APPLIED);
            break;
          }
          case "rest":
            bone.position.copy(captured.restPosition);
            bone.quaternion.copy(captured.restQuaternion);
            outcomes.set(captured.key, REST);
            break;
          default:
            return unreachable(drive);
        }
        bone.updateMatrixWorld(true);
      }
      return { bones: outcomes };
    },
    reset() {
      binding.rootParent.updateWorldMatrix(true, false);
      for (const captured of ordered) {
        const bone = bones[captured.index]!;
        bone.position.copy(captured.restPosition);
        bone.quaternion.copy(captured.restQuaternion);
        bone.updateMatrixWorld(true);
      }
    },
  };
}

/** Decode once; inherited names are never pose sources. */
export function rigFrameSource(rigValues: unknown): FrameSource {
  const { pose } = readRigValues(rigValues);
  return (source) => (Object.hasOwn(pose, source) ? pose[source] : undefined);
}
