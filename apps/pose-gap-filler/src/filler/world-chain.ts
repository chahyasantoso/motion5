import { presentedPosition, trustedPosition, type FilledJoint } from "./frame";
import type { GapFiller } from "./gap-filler";
import type { KalmanNoise } from "./chain-kalman";
import {
  basis,
  createDirectionFilter,
  continuedSegmentBasis,
  toLocal,
  toWorld,
  type Basis,
  type DirectionFilter,
} from "./direction";
import { createCvFilter, type CvFilter } from "./kalman";
import {
  BONES,
  BONE_IDS,
  LIMBS,
  jointRecord,
  type BoneId,
  type JointId,
  type LimbId,
} from "./landmarks";
import { add, scale, sub, unit, type Vec } from "./vec";
import { unreachable } from "./unreachable";

/** Direction noise is rad²; root noise is mm². Separate tuning, not pixel noise in millimetres. */
export const DEFAULT_WORLD_KALMAN_NOISE: KalmanNoise = {
  angle: { measurementVariance: 0.0025, accelerationVariance: 0.5 },
  position: { measurementVariance: 64, accelerationVariance: 40000 },
};

function direction(from: Vec | undefined, to: Vec | undefined): Vec | undefined {
  return from === undefined || to === undefined ? undefined : unit(sub(to, from));
}

export function createWorldChainFiller(noise: KalmanNoise, coastMs: number): GapFiller {
  if (!Number.isFinite(coastMs) || coastMs < 0)
    throw new Error("Kalman coastMs must be finite and nonnegative.");
  const angles = new Map<BoneId, DirectionFilter>(
    BONE_IDS.map((id) => [id, createDirectionFilter(noise.angle)]),
  );
  const torsoX = createDirectionFilter(noise.angle);
  const torsoY = createDirectionFilter(noise.angle);
  const roots = new Map<JointId, readonly CvFilter[]>(
    LIMBS.map((limb) => [
      limb.root,
      [0, 1, 2].map(() => createCvFilter({ kind: "position" }, noise.position)),
    ]),
  );
  const lastTrusted = new Map<JointId, number>();
  const gaps = new Map<JointId, number>();
  const gauges = new Map<LimbId, { readonly local: Basis; readonly measuredMs: number }>();
  let previousMs: number | undefined;
  return {
    fill(frame, lengths) {
      switch (frame.space.kind) {
        case "world":
          break;
        case "image":
          throw new Error("World chain requires world space.");
        default:
          return unreachable(frame.space, "landmark space");
      }
      if (lengths === undefined) throw new Error("chain-kalman needs the bone-length estimator.");
      if (!Number.isFinite(frame.tMs) || (previousMs !== undefined && frame.tMs <= previousMs))
        throw new Error("chain-kalman timestamps must be finite and strictly increasing.");
      const measured = jointRecord((joint) => trustedPosition(frame.trust[joint]));
      // Validate the complete input before advancing any state.
      for (const joint of Object.values(frame.trust))
        switch (joint.kind) {
          case "trusted":
            if (joint.position.length !== 3 || !joint.position.every(Number.isFinite))
              throw new Error("World chain needs finite three-dimensional measurements.");
            if (!Number.isFinite(joint.visibility) || joint.visibility < 0 || joint.visibility > 1)
              throw new Error("World visibility must be finite and in [0, 1].");
            break;
          case "gap":
            break;
          default:
            return unreachable(joint, "joint trust");
        }
      previousMs = frame.tMs;
      const visibility = (joints: readonly JointId[]) =>
        Math.min(
          ...joints.map((joint) => {
            const trust = frame.trust[joint];
            return trust.kind === "trusted" ? trust.visibility : 0;
          }),
        );
      const fresh = (filter: { readonly state: { readonly measuredMs: number } | undefined }) =>
        filter.state !== undefined && frame.tMs - filter.state.measuredMs <= coastMs;
      const advance = (
        filter: DirectionFilter,
        value: Vec | undefined,
        joints: readonly JointId[],
      ) => {
        if (filter.state !== undefined && !fresh(filter)) filter.reset();
        filter.step(
          frame.tMs,
          value === undefined ? undefined : { direction: value, visibility: visibility(joints) },
        );
      };
      const torsoJoints: JointId[] = [];
      let transverse: Vec = [0, 0, 0];
      let vertical: Vec = [0, 0, 0];
      for (const [from, to] of [
        ["right-shoulder", "left-shoulder"],
        ["right-hip", "left-hip"],
      ] as const) {
        const dir = direction(measured[from], measured[to]);
        if (dir !== undefined) {
          transverse = add(transverse, dir);
          torsoJoints.push(from, to);
        }
      }
      for (const [from, to] of [
        ["left-shoulder", "left-hip"],
        ["right-shoulder", "right-hip"],
      ] as const) {
        const a = measured[from];
        const b = measured[to];
        if (a !== undefined && b !== undefined) {
          vertical = add(vertical, sub(b, a));
          torsoJoints.push(from, to);
        }
      }
      // Projecting the long axis off the width removes taper bias on a single trusted side.
      const torsoMeasured: Basis | undefined = basis(transverse, vertical);
      advance(torsoX, torsoMeasured?.x, torsoJoints);
      advance(torsoY, torsoMeasured?.y, torsoJoints);
      const torso =
        torsoMeasured ??
        (fresh(torsoX) && fresh(torsoY)
          ? basis(torsoX.state!.direction, torsoY.state!.direction)
          : undefined);
      const absolute = new Map(
        BONE_IDS.map((bone) => [
          bone,
          direction(measured[BONES[bone].from], measured[BONES[bone].to]),
        ]),
      );
      const measuredParents = new Map<LimbId, Basis>();
      for (const limb of LIMBS) {
        const old = gauges.get(limb.id);
        if (old !== undefined && frame.tMs - old.measuredMs > coastMs) gauges.delete(limb.id);
        const upper = absolute.get(limb.upper);
        if (torsoMeasured === undefined || upper === undefined) continue;
        const parent = continuedSegmentBasis(torsoMeasured, upper, gauges.get(limb.id)?.local);
        measuredParents.set(limb.id, parent);
        gauges.set(limb.id, {
          local: {
            x: toLocal(torsoMeasured, parent.x),
            y: toLocal(torsoMeasured, parent.y),
            z: toLocal(torsoMeasured, parent.z),
          },
          measuredMs: frame.tMs,
        });
      }
      for (const bone of BONE_IDS) {
        const limb = LIMBS.find((item) => item.lower === bone);
        const parent =
          torsoMeasured === undefined
            ? undefined
            : limb === undefined
              ? torsoMeasured
              : measuredParents.get(limb.id);
        const child = absolute.get(bone);
        const joints: JointId[] = [...torsoJoints, BONES[bone].from, BONES[bone].to];
        if (limb !== undefined) joints.push(limb.root);
        advance(
          angles.get(bone)!,
          parent === undefined || child === undefined ? undefined : toLocal(parent, child),
          joints,
        );
      }
      for (const [root, filters] of roots)
        filters.forEach((filter, axis) => {
          if (filter.state !== undefined && !fresh(filter)) filter.reset();
          const value = measured[root]?.[axis];
          filter.step(
            frame.tMs,
            value === undefined ? undefined : { value, visibility: visibility([root]) },
          );
        });
      const filled = jointRecord((joint): FilledJoint => {
        const trust = frame.trust[joint];
        switch (trust.kind) {
          case "trusted":
            lastTrusted.set(joint, frame.tMs);
            gaps.delete(joint);
            return { kind: "measured", position: trust.position };
          case "gap":
            if (!gaps.has(joint)) gaps.set(joint, frame.tMs);
            return { kind: "lost" };
          default:
            return unreachable(trust, "joint trust");
        }
      });
      const infer = (joint: JointId, position: Vec | undefined) => {
        const last = lastTrusted.get(joint);
        if (
          frame.trust[joint].kind === "gap" &&
          last !== undefined &&
          frame.tMs - last <= coastMs &&
          position !== undefined &&
          position.every(Number.isFinite)
        )
          filled[joint] = { kind: "inferred", position, sinceMs: gaps.get(joint)! };
      };
      const boneDirection = (bone: BoneId, parent: Basis | undefined) => {
        const filter = angles.get(bone)!;
        return parent === undefined || !fresh(filter)
          ? undefined
          : unit(toWorld(parent, filter.state!.direction));
      };
      const child = (bone: BoneId, parent: Vec | undefined, dir: Vec | undefined) => {
        const length = lengths.length(bone);
        return parent === undefined ||
          dir === undefined ||
          length === undefined ||
          !Number.isFinite(length) ||
          length <= 0
          ? undefined
          : add(parent, scale(dir, length));
      };
      for (const limb of LIMBS) {
        if (frame.trust[limb.root].kind !== "gap") continue;
        const canonical = boneDirection(limb.width, torsoMeasured);
        let position = child(
          limb.width,
          measured[limb.partner],
          canonical === undefined
            ? undefined
            : scale(canonical, BONES[limb.width].to === limb.root ? 1 : -1),
        );
        const filters = roots.get(limb.root)!;
        if (position === undefined && filters.every(fresh))
          position = filters.map((filter) => filter.state!.value);
        infer(limb.root, position);
      }
      for (const limb of LIMBS) {
        const root = presentedPosition(filled[limb.root]);
        infer(limb.middle, child(limb.upper, root, boneDirection(limb.upper, torso)));
        const middle = presentedPosition(filled[limb.middle]);
        const upper = direction(root, middle);
        const parent =
          torso === undefined || upper === undefined
            ? undefined
            : continuedSegmentBasis(torso, upper, gauges.get(limb.id)?.local);
        infer(limb.tip, child(limb.lower, middle, boneDirection(limb.lower, parent)));
      }
      return { tMs: frame.tMs, space: frame.space, joints: filled };
    },
    reset() {
      for (const filter of angles.values()) filter.reset();
      torsoX.reset();
      torsoY.reset();
      for (const filters of roots.values()) for (const filter of filters) filter.reset();
      lastTrusted.clear();
      gaps.clear();
      gauges.clear();
      previousMs = undefined;
    },
  };
}
