import { unreachable } from "@motion5/core/plugin-api";
import { readFrame3d } from "@motion5/plugins/frame3d";
import { readRigValues } from "@motion5/plugins/rig";
import { Matrix4, Quaternion, Vector3, type Object3D } from "three";
import { frameToMatrix } from "./index";
import { normalizeDirection } from "./skeleton-direction";
import {
  assertCapturedHierarchy,
  assertSkeletonScale,
  type SkeletonBinding,
} from "./skeleton-capture";

/**
 * `frame`: the source is the bone's own world frame in source space (absolute).
 * `basis`: the source is a body basis in source space whose identity rotation means the bone's
 * rest orientation as placed under source space; its translation places the bone origin.
 * `aim`: swing the rest aim onto the source direction, keeping rest twist and position.
 */
export type BoneDrive =
  | { readonly kind: "frame"; readonly source: string }
  | { readonly kind: "basis"; readonly source: string }
  | { readonly kind: "aim"; readonly from: string; readonly to: string }
  | { readonly kind: "rest" };
export type BoneOutcome =
  | { readonly kind: "applied" }
  | {
      readonly kind: "held";
      readonly reason: "source-missing" | "degenerate-direction" | "no-rest-aim";
    }
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

const UNIT = Object.freeze(new Vector3(1, 1, 1));
const IDENTITY = Object.freeze(new Matrix4());
const APPLIED: BoneOutcome = Object.freeze({ kind: "applied" });
const REST: BoneOutcome = Object.freeze({ kind: "rest" });
const MISSING: BoneOutcome = Object.freeze({ kind: "held", reason: "source-missing" });
const DEGENERATE: BoneOutcome = Object.freeze({ kind: "held", reason: "degenerate-direction" });
const NO_REST_AIM: BoneOutcome = Object.freeze({ kind: "held", reason: "no-rest-aim" });

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
        case "no-rest-aim":
          return "Bone held: no unambiguous rest aim child.";
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
      case "basis":
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
  assertCapturedHierarchy(binding);
  assertSkeletonScale(
    binding.bones.map(({ bone }) => bone),
    binding.rootParent,
  );
  const ordered = [...binding.bones].sort((a, b) => a.depth - b.depth || a.index - b.index);
  // Rest transform of each basis-driven bone relative to rootParent, from captured data only.
  const restFromRoot = new Map<number, Matrix4>();
  for (const captured of binding.bones) {
    if (captured.key === undefined || drives.get(captured.key)?.kind !== "basis") continue;
    const rest = new Matrix4();
    const local = new Matrix4();
    for (let at: number | undefined = captured.index; at !== undefined; ) {
      const link = binding.bones[at]!;
      rest.premultiply(local.compose(link.restPosition, link.restQuaternion, UNIT));
      at = link.parent;
    }
    restFromRoot.set(captured.index, rest);
  }
  const matrix = new Matrix4();
  const parentFromSource = new Matrix4();
  const position = new Vector3();
  const scale = new Vector3();
  const quaternion = new Quaternion();
  const from = new Vector3();
  const to = new Vector3();
  const aim = new Vector3();
  const restRotation = new Matrix4();

  /** The rotation a source frame is composed with: none for `frame`, current rest for `basis`. */
  const sourceRestRotation = (
    index: number,
    drive: Extract<BoneDrive, { kind: "frame" | "basis" }>,
  ): Matrix4 => {
    switch (drive.kind) {
      case "frame":
        return IDENTITY;
      case "basis":
        // Rest orientation as currently placed under source space; ancestor scale is uniform.
        restRotation
          .copy(sourceSpace.matrixWorld)
          .invert()
          .multiply(binding.rootParent.matrixWorld)
          .multiply(restFromRoot.get(index)!)
          .decompose(position, quaternion, scale);
        return restRotation.makeRotationFromQuaternion(quaternion);
      default:
        return unreachable(drive);
    }
  };

  const writeRigid = (bone: Object3D, local: Matrix4): void => {
    local.decompose(position, quaternion, scale);
    if (!position.toArray().every(Number.isFinite) || !quaternion.toArray().every(Number.isFinite))
      throw new TypeError("Bone frame cannot be represented by a finite rigid transform.");
    bone.position.copy(position);
    bone.quaternion.copy(quaternion);
  };

  // Only frame and aim drives read source space; rest drives never pay for the inversion.
  const toParent = (bone: Object3D, target: Matrix4): Matrix4 =>
    target.copy(bone.parent!.matrixWorld).invert().multiply(sourceSpace.matrixWorld);

  return {
    apply(read) {
      assertCapturedHierarchy(binding);
      binding.rootParent.updateWorldMatrix(true, true);
      sourceSpace.updateWorldMatrix(true, false);
      const outcomes = new Map<string, BoneOutcome>();
      for (const captured of ordered) {
        if (captured.key === undefined) continue;
        const drive = drives.get(captured.key);
        if (drive === undefined) continue;
        const bone = captured.bone;
        switch (drive.kind) {
          case "frame":
          case "basis": {
            const values = read(drive.source);
            if (values === undefined) {
              outcomes.set(captured.key, MISSING);
              continue;
            }
            frameToMatrix(values, matrix);
            matrix.multiply(sourceRestRotation(captured.index, drive));
            writeRigid(bone, matrix.premultiply(toParent(bone, parentFromSource)));
            outcomes.set(captured.key, APPLIED);
            break;
          }
          case "aim": {
            if (captured.restAim === undefined) {
              outcomes.set(captured.key, NO_REST_AIM);
              continue;
            }
            const a = read(drive.from);
            const b = read(drive.to);
            if (a === undefined || b === undefined) {
              outcomes.set(captured.key, MISSING);
              continue;
            }
            toParent(bone, parentFromSource);
            const p = readFrame3d(a),
              q = readFrame3d(b);
            from.set(p.x, p.y, p.z).applyMatrix4(parentFromSource);
            to.set(q.x, q.y, q.z).applyMatrix4(parentFromSource).sub(from);
            if (!normalizeDirection(to)) {
              outcomes.set(captured.key, DEGENERATE);
              continue;
            }
            aim.copy(captured.restAim);
            // Preserve q0 bit-for-bit for an unchanged direction, including inversion roundoff.
            if (aim.distanceToSquared(to) <= 1e-24) quaternion.copy(captured.restQuaternion);
            else quaternion.setFromUnitVectors(aim, to).multiply(captured.restQuaternion);
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
      assertCapturedHierarchy(binding);
      binding.rootParent.updateWorldMatrix(true, false);
      for (const captured of ordered) {
        const bone = captured.bone;
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
