import { createDirectionFilter, basis, toLocal, toWorld, type Basis } from "../filler/direction";
import { createCvFilter, type CvFilter } from "../filler/kalman";
import type { KalmanNoise } from "../filler/chain-kalman";
import type { BoneLengths } from "../filler/bone-length";
import { trustedPosition, type FilledJoint, type TrustedFrame } from "../filler/frame";
import { LIMBS, type JointId } from "../filler/landmarks";
import { add, distance, norm, scale, sub, unit, type Vec } from "../filler/vec";

export const BODY_ROOTS = ["left-shoulder", "right-shoulder", "left-hip", "right-hip"] as const;
export type BodyRoot = (typeof BODY_ROOTS)[number];
export type BodyOrientation =
  | { readonly kind: "observed"; readonly basis: Basis; readonly measuredMs: number }
  | {
      readonly kind: "inferred";
      readonly basis: Basis;
      readonly measuredMs: number;
      readonly expiresMs: number;
    }
  | { readonly kind: "unavailable"; readonly reason: "missing" | "degenerate" | "expired" };

export interface BodyAnchor {
  readonly joint: FilledJoint;
  readonly expiresMs: number | undefined;
  readonly modelPosition: Vec | undefined;
  /** Observed minus calibrated body-model position in mm, never a trust decision. */
  readonly residualMm: number | undefined;
}

/** One immutable camera-relative body snapshot. No simulator truth or render state enters it. */
export interface BodyState {
  readonly tMs: number;
  readonly orientation: BodyOrientation;
  readonly origin: Vec | undefined;
  readonly anchors: Readonly<Record<BodyRoot, BodyAnchor>>;
  /** Person calibration in torso-local mm, distinct from anatomy and render scale. */
  readonly offsets: Readonly<Partial<Record<BodyRoot, Vec>>>;
}

const frozenVec = (value: Vec): Vec => Object.freeze([...value]);
const frozenBasis = (value: Basis): Basis =>
  Object.freeze({ x: frozenVec(value.x), y: frozenVec(value.y), z: frozenVec(value.z) });
const midpoint = (a: Vec, b: Vec) => scale(add(a, b), 0.5);

function torsoMeasurement(measured: Partial<Record<JointId, Vec>>) {
  let x: Vec = [0, 0, 0];
  let y: Vec = [0, 0, 0];
  let width = false;
  let height = false;
  for (const [a, b] of [
    ["right-shoulder", "left-shoulder"],
    ["right-hip", "left-hip"],
  ] as const) {
    if (measured[a] === undefined || measured[b] === undefined) continue;
    width = true;
    const dir = unit(sub(measured[b]!, measured[a]!));
    if (dir !== undefined) x = add(x, dir);
  }
  for (const [a, b] of [
    ["left-shoulder", "left-hip"],
    ["right-shoulder", "right-hip"],
  ] as const) {
    if (measured[a] === undefined || measured[b] === undefined) continue;
    height = true;
    y = add(y, sub(measured[b]!, measured[a]!));
  }
  return {
    basis: basis(x, y),
    degenerate:
      (width && unit(x) === undefined) || (height && unit(y) === undefined) || (width && height),
  };
}

export function createBodyStateOwner(noise: KalmanNoise, coastMs: number) {
  if (!Number.isFinite(coastMs) || coastMs < 0)
    throw new Error("Body coast must be finite and nonnegative.");
  const x = createDirectionFilter(noise.angle);
  const y = createDirectionFilter(noise.angle);
  const roots = new Map<BodyRoot, readonly CvFilter[]>(
    BODY_ROOTS.map((root) => [
      root,
      [0, 1, 2].map(() => createCvFilter({ kind: "position" }, noise.position)),
    ]),
  );
  const last = new Map<BodyRoot, number>();
  const gaps = new Map<BodyRoot, number>();
  let offsets: Partial<Record<BodyRoot, Vec>> = {};
  let measuredMs: number | undefined;
  let previousMs: number | undefined;
  return {
    step(frame: TrustedFrame, lengths: BoneLengths): BodyState {
      if (frame.space.kind !== "world") throw new Error("Body state needs world space.");
      if (!Number.isFinite(frame.tMs) || (previousMs !== undefined && frame.tMs <= previousMs))
        throw new Error("Body timestamps must be finite and strictly increasing.");
      const measured: Partial<Record<JointId, Vec>> = {};
      for (const [joint, trust] of Object.entries(frame.trust)) {
        const point = trustedPosition(trust);
        if (point === undefined) continue;
        if (
          point.length !== 3 ||
          !point.every(Number.isFinite) ||
          trust.kind !== "trusted" ||
          !Number.isFinite(trust.visibility) ||
          trust.visibility < 0 ||
          trust.visibility > 1
        )
          throw new Error("Body needs finite 3D measurements and visibility in [0, 1].");
        measured[joint as JointId] = point;
        if (!Number.isFinite(norm(point))) throw new Error("Body coordinate magnitude overflow.");
      }
      const restore = [
        x.checkpoint(),
        y.checkpoint(),
        ...[...roots.values()].flatMap((filters) => filters.map((filter) => filter.checkpoint())),
      ];
      const savedLast = new Map(last),
        savedGaps = new Map(gaps);
      const savedOffsets = offsets,
        savedMeasuredMs = measuredMs;
      try {
        const current = torsoMeasurement(measured);
        const fresh = (time: number | undefined) =>
          time !== undefined && frame.tMs - time <= coastMs;
        if (!fresh(measuredMs)) {
          x.reset();
          y.reset();
        }
        const confidence = Math.min(
          ...BODY_ROOTS.flatMap((root) => {
            const trust = frame.trust[root];
            return trust.kind === "trusted" ? [trust.visibility] : [];
          }),
        );
        x.step(
          frame.tMs,
          current.basis === undefined
            ? undefined
            : { direction: current.basis.x, visibility: confidence },
        );
        y.step(
          frame.tMs,
          current.basis === undefined
            ? undefined
            : { direction: current.basis.y, visibility: confidence },
        );
        let orientation: BodyOrientation;
        if (current.basis !== undefined) {
          measuredMs = frame.tMs;
          orientation = { kind: "observed", basis: frozenBasis(current.basis), measuredMs };
        } else if (current.degenerate) {
          orientation = { kind: "unavailable", reason: "degenerate" };
        } else {
          const held =
            fresh(measuredMs) && x.state !== undefined && y.state !== undefined
              ? basis(x.state.direction, y.state.direction)
              : undefined;
          orientation =
            held === undefined
              ? { kind: "unavailable", reason: measuredMs === undefined ? "missing" : "expired" }
              : {
                  kind: "inferred",
                  basis: frozenBasis(held),
                  measuredMs: measuredMs!,
                  expiresMs: measuredMs! + coastMs,
                };
        }
        const torso = orientation.kind === "unavailable" ? undefined : orientation.basis;
        // Only fully trusted, nondegenerate anchors calibrate the body model.
        if (
          Object.keys(offsets).length === 0 &&
          current.basis !== undefined &&
          BODY_ROOTS.every((root) => measured[root] !== undefined)
        ) {
          const origin = midpoint(measured["left-hip"]!, measured["right-hip"]!);
          offsets = Object.fromEntries(
            BODY_ROOTS.map((root) => [
              root,
              frozenVec(toLocal(current.basis!, sub(measured[root]!, origin))),
            ]),
          );
        }
        const originEntries =
          torso === undefined
            ? []
            : BODY_ROOTS.flatMap((root) => {
                const point = measured[root];
                const offset = offsets[root];
                return point === undefined || offset === undefined
                  ? []
                  : [{ root, position: sub(point, toWorld(torso, offset)) }];
              });
        const origins = originEntries.map((entry) => entry.position);
        const origin =
          origins.length === 0
            ? undefined
            : frozenVec(
                scale(
                  origins.reduce((sum, point) => add(sum, point), [0, 0, 0] as Vec),
                  1 / origins.length,
                ),
              );
        const anchors = {} as Record<BodyRoot, BodyAnchor>;
        for (const root of BODY_ROOTS) {
          const point = measured[root];
          if (point !== undefined) {
            last.set(root, frame.tMs);
            gaps.delete(root);
          } else if (!gaps.has(root)) gaps.set(root, frame.tMs);
          const filters = roots.get(root)!;
          filters.forEach((filter, axis) => {
            if (filter.state !== undefined && !fresh(filter.state.measuredMs)) filter.reset();
            const trust = frame.trust[root];
            filter.step(
              frame.tMs,
              point === undefined || trust.kind !== "trusted"
                ? undefined
                : { value: point[axis]!, visibility: trust.visibility },
            );
          });
          const offset = offsets[root];
          // A root cannot score its own origin fit: use other trusted anchors for a residual.
          // A single visible anchor establishes placement, but provides no independent residual.
          const otherOrigins = originEntries
            .filter((entry) => entry.root !== root)
            .map((entry) => entry.position);
          const diagnosticOrigin =
            point === undefined
              ? origin
              : otherOrigins.length === 0
                ? undefined
                : scale(
                    otherOrigins.reduce((sum, position) => add(sum, position), [0, 0, 0] as Vec),
                    1 / otherOrigins.length,
                  );
          const modelPosition =
            torso === undefined || diagnosticOrigin === undefined || offset === undefined
              ? undefined
              : frozenVec(add(diagnosticOrigin, toWorld(torso, offset)));
          if (modelPosition !== undefined && !modelPosition.every(Number.isFinite))
            throw new Error("Body model position overflow.");
          let inferred: Vec | undefined;
          if (point === undefined && fresh(last.get(root))) {
            const limb = LIMBS.find((item) => item.root === root)!;
            const partner = measured[limb.partner];
            const length = lengths.length(limb.width);
            const partnerOffset = offsets[limb.partner as BodyRoot];
            const localWidth =
              offset === undefined || partnerOffset === undefined
                ? undefined
                : unit(sub(offset, partnerOffset));
            if (
              partner !== undefined &&
              torso !== undefined &&
              localWidth !== undefined &&
              length !== undefined &&
              Number.isFinite(length) &&
              length > 0
            )
              inferred = add(partner, scale(toWorld(torso, localWidth), length));
            inferred ??= modelPosition;
            if (
              inferred === undefined &&
              filters.every(
                (filter) => filter.state !== undefined && fresh(filter.state.measuredMs),
              )
            )
              inferred = filters.map((filter) => filter.state!.value);
          }
          const joint: FilledJoint =
            point !== undefined
              ? Object.freeze({ kind: "measured", position: frozenVec(point) })
              : inferred !== undefined && inferred.every(Number.isFinite)
                ? Object.freeze({
                    kind: "inferred",
                    position: frozenVec(inferred),
                    sinceMs: gaps.get(root)!,
                  })
                : Object.freeze({ kind: "lost" });
          anchors[root] = Object.freeze({
            joint,
            modelPosition,
            expiresMs: joint.kind === "inferred" ? last.get(root)! + coastMs : undefined,
            residualMm:
              point === undefined || modelPosition === undefined
                ? undefined
                : distance(point, modelPosition),
          });
        }
        const result = Object.freeze({
          tMs: frame.tMs,
          orientation: Object.freeze(orientation),
          origin,
          anchors: Object.freeze(anchors),
          offsets: Object.freeze({ ...offsets }),
        });
        previousMs = frame.tMs;
        return result;
      } catch (error) {
        for (const rollback of restore) rollback();
        last.clear();
        for (const [root, time] of savedLast) last.set(root, time);
        gaps.clear();
        for (const [root, time] of savedGaps) gaps.set(root, time);
        offsets = savedOffsets;
        measuredMs = savedMeasuredMs;
        throw error;
      }
    },
    reset() {
      x.reset();
      y.reset();
      for (const filters of roots.values()) for (const filter of filters) filter.reset();
      last.clear();
      gaps.clear();
      offsets = {};
      measuredMs = undefined;
      previousMs = undefined;
    },
  };
}
