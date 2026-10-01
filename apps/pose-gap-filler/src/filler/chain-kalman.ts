import type { BoneLengths } from "./bone-length";
import { trustedPosition, presentedPosition, type FilledJoint } from "./frame";
import type { GapFiller } from "./gap-filler";
import {
  createCvFilter,
  wrapAngle,
  type CvFilter,
  type ScalarMeasurement,
  type ScalarNoise,
} from "./kalman";
import { BONES, BONE_IDS, LIMBS, jointRecord, type BoneId, type JointId } from "./landmarks";
import { unreachable } from "./unreachable";
import { distance, type Vec } from "./vec";
import { createWorldChainFiller } from "./world-chain";

export interface KalmanNoise {
  readonly angle: ScalarNoise;
  readonly position: ScalarNoise;
}

/** Pixel-space defaults. `comparedFillers` selects a separate mm-space root noise preset. */
export const DEFAULT_KALMAN_NOISE: KalmanNoise = {
  angle: { measurementVariance: 0.0004, accelerationVariance: 0.5 },
  position: { measurementVariance: 9, accelerationVariance: 10000 },
};

export const DEFAULT_COAST_MS = 500;

function bearing(from: Vec | undefined, to: Vec | undefined): number | undefined {
  if (from === undefined || to === undefined || distance(from, to) <= 1e-9) return undefined;
  return Math.atan2(to[1]! - from[1]!, to[0]! - from[0]!);
}

function rebuild(parent: Vec, length: number, angle: number): Vec {
  return [parent[0]! + length * Math.cos(angle), parent[1]! + length * Math.sin(angle)];
}

/**
 * One relative-angle CV state per physical bone, including one per shared torso width.
 * The normal of measured torso widths is the parent frame of upper segments and widths; each lower
 * segment's parent is its upper segment. Inference follows the current parent's orientation.
 * No inferred coordinate is ever used as a filter measurement or bone-length sample.
 */
export function createChainKalmanFiller(noise: KalmanNoise, coastMs: number): GapFiller {
  const image = createImageChainFiller(noise, coastMs);
  const world = createWorldChainFiller(noise, coastMs);
  let space: "image" | "world" | undefined;
  return {
    fill(frame, lengths) {
      if (space !== undefined && space !== frame.space.kind)
        throw new Error("Reset chain-kalman before changing landmark space.");
      switch (frame.space.kind) {
        case "image": {
          const result = image.fill(frame, lengths);
          space = "image";
          return result;
        }
        case "world": {
          const result = world.fill(frame, lengths);
          space = "world";
          return result;
        }
        default:
          return unreachable(frame.space, "landmark space");
      }
    },
    reset() {
      image.reset();
      world.reset();
      space = undefined;
    },
  };
}

function createImageChainFiller(noise: KalmanNoise, coastMs: number): GapFiller {
  if (!Number.isFinite(coastMs) || coastMs < 0)
    throw new Error("Kalman coastMs must be finite and nonnegative.");
  const angleFilter = () => createCvFilter({ kind: "angle" }, noise.angle);
  const torso = angleFilter();
  const angles = new Map<BoneId, CvFilter>(BONE_IDS.map((bone) => [bone, angleFilter()]));
  const roots = new Map<JointId, readonly [CvFilter, CvFilter]>(
    LIMBS.map((limb) => [
      limb.root,
      [
        createCvFilter({ kind: "position" }, noise.position),
        createCvFilter({ kind: "position" }, noise.position),
      ],
    ]),
  );
  const lastTrusted = new Map<JointId, number>();
  const gaps = new Map<JointId, number>();
  let previousMs: number | undefined;

  return {
    fill(frame, lengths) {
      switch (frame.space.kind) {
        case "image":
          break;
        case "world":
          throw new Error("The image-angle filter requires image space.");
        default:
          return unreachable(frame.space, "landmark space");
      }
      if (lengths === undefined) throw new Error("chain-kalman needs the bone-length estimator.");
      if (!Number.isFinite(frame.tMs) || (previousMs !== undefined && frame.tMs <= previousMs))
        throw new Error("chain-kalman timestamps must be finite and strictly increasing.");
      previousMs = frame.tMs;
      const measured = jointRecord((joint) => trustedPosition(frame.trust[joint]));
      const visible = (joints: readonly JointId[]) =>
        Math.min(
          ...joints.map((joint) => {
            const trust = frame.trust[joint];
            return trust.kind === "trusted" ? trust.visibility : 0;
          }),
        );
      const observation = (
        value: number | undefined,
        joints: readonly JointId[],
      ): ScalarMeasurement | undefined =>
        value === undefined ? undefined : { value, visibility: visible(joints) };
      const advance = (filter: CvFilter, sample: ScalarMeasurement | undefined) => {
        // Discard expired states instead of extrapolating forever or fitting stale velocity.
        if (filter.state !== undefined && frame.tMs - filter.state.measuredMs > coastMs)
          filter.reset();
        return filter.step(frame.tMs, sample);
      };
      const fresh = (filter: CvFilter) =>
        filter.state !== undefined && frame.tMs - filter.state.measuredMs <= coastMs;

      // The torso frame is the downward normal of the trusted transverse torso segments.
      // A shoulder or hip width alone defines it when the other girdle is occluded; switching
      // sides cannot introduce the taper bias of a single shoulder→hip diagonal.
      let sx = 0;
      let sy = 0;
      const torsoJoints: JointId[] = [];
      for (const side of [
        ["right-shoulder", "left-shoulder"],
        ["right-hip", "left-hip"],
      ] as const) {
        const widthAngle = bearing(measured[side[0]], measured[side[1]]);
        if (widthAngle === undefined) continue;
        const angle = widthAngle + Math.PI / 2;
        sx += Math.cos(angle);
        sy += Math.sin(angle);
        torsoJoints.push(...side);
      }
      const torsoMeasured = Math.hypot(sx, sy) > 1e-9 ? Math.atan2(sy, sx) : undefined;
      advance(torso, observation(torsoMeasured, torsoJoints));
      const torsoAngle = torsoMeasured ?? (fresh(torso) ? torso.state!.value : undefined);

      const absolute = new Map<BoneId, number | undefined>();
      for (const bone of BONE_IDS) {
        const { from, to } = BONES[bone];
        absolute.set(bone, bearing(measured[from], measured[to]));
      }
      for (const bone of BONE_IDS) {
        const limb = LIMBS.find((candidate) => candidate.lower === bone);
        const parentMeasured = limb === undefined ? torsoMeasured : absolute.get(limb.upper);
        const childMeasured = absolute.get(bone);
        const relative =
          childMeasured === undefined || parentMeasured === undefined
            ? undefined
            : wrapAngle(childMeasured - parentMeasured);
        const joints: JointId[] = [BONES[bone].from, BONES[bone].to];
        if (limb === undefined) joints.push(...torsoJoints);
        else joints.push(limb.root);
        advance(angles.get(bone)!, observation(relative, joints));
      }
      for (const [root, filters] of roots)
        for (const axis of [0, 1] as const)
          advance(filters[axis], observation(measured[root]?.[axis], [root]));

      const filled = jointRecord((joint): FilledJoint => {
        switch (frame.trust[joint].kind) {
          case "trusted":
            lastTrusted.set(joint, frame.tMs);
            gaps.delete(joint);
            return { kind: "measured", position: measured[joint]! };
          case "gap":
            if (!gaps.has(joint)) gaps.set(joint, frame.tMs);
            return { kind: "lost" };
          default:
            return unreachable(frame.trust[joint], "joint trust");
        }
      });
      const mayCoast = (joint: JointId) => {
        const last = lastTrusted.get(joint);
        return last !== undefined && frame.tMs - last <= coastMs;
      };
      const infer = (joint: JointId, position: Vec | undefined) => {
        if (frame.trust[joint].kind !== "gap" || !mayCoast(joint) || position === undefined) return;
        if (!position.every(Number.isFinite)) return;
        filled[joint] = { kind: "inferred", position, sinceMs: gaps.get(joint)! };
      };
      const boneAngle = (bone: BoneId, parent: number | undefined) => {
        const filter = angles.get(bone)!;
        return parent === undefined || !fresh(filter) ? undefined : parent + filter.state!.value;
      };
      const child = (bone: BoneId, parent: Vec | undefined, angle: number | undefined) => {
        const length = lengths.length(bone);
        return parent === undefined ||
          angle === undefined ||
          length === undefined ||
          !Number.isFinite(length) ||
          length <= 0
          ? undefined
          : rebuild(parent, length, angle);
      };
      // Only a trusted opposite root anchors width reconstruction. Never infer roots recursively.
      for (const limb of LIMBS) {
        if (frame.trust[limb.root].kind !== "gap") continue;
        const canonical = boneAngle(limb.width, torsoMeasured);
        const angle =
          canonical === undefined
            ? undefined
            : canonical + (BONES[limb.width].to === limb.root ? 0 : Math.PI);
        let position = child(limb.width, measured[limb.partner], angle);
        if (position === undefined) {
          const filters = roots.get(limb.root)!;
          if (filters.every(fresh)) position = filters.map((filter) => filter.state!.value);
        }
        infer(limb.root, position);
      }
      for (const limb of LIMBS) {
        const root = presentedPosition(filled[limb.root]);
        const upperAngle = boneAngle(limb.upper, torsoAngle);
        infer(limb.middle, child(limb.upper, root, upperAngle));
        const middle = presentedPosition(filled[limb.middle]);
        const parentAngle = bearing(root, middle);
        infer(limb.tip, child(limb.lower, middle, boneAngle(limb.lower, parentAngle)));
      }
      return { tMs: frame.tMs, space: frame.space, joints: filled };
    },
    reset() {
      torso.reset();
      for (const filter of angles.values()) filter.reset();
      for (const filters of roots.values()) for (const filter of filters) filter.reset();
      lastTrusted.clear();
      gaps.clear();
      previousMs = undefined;
    },
  };
}
