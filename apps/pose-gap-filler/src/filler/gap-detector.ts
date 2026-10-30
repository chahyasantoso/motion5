import type { BoneLengths } from "./bone-length";
import {
  measurementOf,
  type JointTrust,
  type LandmarkFrame,
  type TrustedFrame,
  type RejectionDiagnostic,
} from "./frame";
import { jointRecord, scaleBone, type JointId } from "./landmarks";
import { distance, type Vec } from "./vec";
import {
  DEFAULT_INNOVATION,
  innovationStep,
  validateInnovation,
  validProcessingPosition,
  type InnovationOptions,
  type InnovationState,
} from "./innovation-gate";

export interface GapDetectorOptions {
  /** Visibility below this is a `low-visibility` gap. In [0, 1]. */
  readonly threshold: number;
  /** Speed since the last trusted sample, in `scaleBone` lengths per second; above this, a `gate` gap. `Infinity` disables. */
  readonly gate: number;
  /** On by default; `false` disables innovation checks. */
  readonly innovation?: InnovationOptions | false;
}

/** MediaPipe's own pose presence confidence, and 20 scale-bone lengths per second. Calibration tightens `threshold` and raises `gate` only. */
export const DEFAULT_DETECTOR: GapDetectorOptions = Object.freeze({ threshold: 0.5, gate: 20 });

/** The one empty set every unforced frame shares. */
export const NO_FORCED: ReadonlySet<JointId> = new Set<JointId>();

export interface GapDetector {
  /** The one owner of "is this joint trusted", its reasons decided in a fixed order; `lengths` is read, never written. */
  detect(frame: LandmarkFrame, forced: ReadonlySet<JointId>, lengths: BoneLengths): TrustedFrame;
  reset(): void;
}

/** A joint's position at one frame time. */
export interface JointSample {
  readonly position: Vec;
  readonly tMs: number;
}

/** Speed from `from` to `to` in `scale` per second; no elapsed time is infinitely fast, standing still is 0. */
export function jointSpeed(from: JointSample, to: JointSample, scale: number): number {
  const moved = distance(to.position, from.position) / scale;
  const elapsedS = (to.tMs - from.tMs) / 1000;
  return elapsedS > 0 ? moved / elapsedS : moved > 0 ? Infinity : 0;
}

export function validateDetectorOptions(options: GapDetectorOptions): GapDetectorOptions {
  if (!(options.threshold >= 0 && options.threshold <= 1))
    throw new Error(`Gap threshold must be in [0, 1], got ${options.threshold}.`);
  if (!(options.gate > 0)) throw new Error(`Gap gate must be positive, got ${options.gate}.`);
  return options;
}

/** Detector-owned raw history, never a prediction: raw accepted scales decide admission, so smoother choice cannot change it. */
export function createGapDetector(options: GapDetectorOptions = DEFAULT_DETECTOR): GapDetector {
  const { threshold, gate } = validateDetectorOptions(options);
  const last = new Map<JointId, JointSample>();
  const optionsInnovation =
    options.innovation === false
      ? false
      : Object.freeze({ ...validateInnovation(options.innovation ?? DEFAULT_INNOVATION) });
  const innovations = new Map<JointId, InnovationState>();
  let lastMs = -Infinity;
  let space: LandmarkFrame["space"]["kind"] | undefined;
  return {
    detect(frame, forced, lengths) {
      if (
        !Number.isFinite(frame.tMs) ||
        frame.tMs <= lastMs ||
        (lastMs !== -Infinity && !Number.isFinite(frame.tMs - lastMs))
      )
        throw new Error("Detector frame time must be finite and strictly increasing.");
      if (space !== undefined && frame.space.kind !== space)
        throw new Error("Reset the detector before changing landmark space.");
      const rejections: Partial<Record<JointId, RejectionDiagnostic>> = {};
      const trust = jointRecord((joint): JointTrust => {
        const measurement = measurementOf(frame.joints[joint]);
        const gap = (reason: Extract<JointTrust, { kind: "gap" }>["reason"]): JointTrust => {
          const state = innovations.get(joint);
          if (state !== undefined) delete state.candidate;
          return { kind: "gap", reason };
        };
        if (measurement === undefined) return gap("absent");
        if (forced.has(joint)) return gap("forced");
        if (
          !validProcessingPosition(measurement.position, frame.space) ||
          !Number.isFinite(measurement.visibility) ||
          measurement.visibility < 0 ||
          measurement.visibility > 1
        ) {
          rejections[joint] = { kind: "invalid" };
          return gap("invalid");
        }
        if (measurement.visibility < threshold) return gap("low-visibility");
        const sample: JointSample = { position: measurement.position, tMs: frame.tMs };
        const previous = last.get(joint);
        const scale = lengths.length(scaleBone(joint));
        const speedRejected =
          previous !== undefined &&
          scale !== undefined &&
          Number.isFinite(scale) &&
          scale > 0 &&
          jointSpeed(previous, sample, scale) > gate;
        if (optionsInnovation !== false) {
          const state = innovations.get(joint) ?? {};
          innovations.set(joint, state);
          const decision = innovationStep(
            state,
            sample,
            frame.space,
            scale,
            speedRejected,
            optionsInnovation,
          );
          if (decision.kind === "rejected") {
            rejections[joint] = { ...decision, kind: "outlier" };
            return { kind: "gap", reason: decision.reason === "speed" ? "gate" : "innovation" };
          }
        } else if (speedRejected) return gap("gate");
        last.set(joint, { ...sample, position: [...sample.position] });
        return {
          kind: "trusted",
          position: [...measurement.position],
          visibility: measurement.visibility,
        };
      });
      lastMs = frame.tMs;
      space = frame.space.kind;
      return {
        ...frame,
        trust,
        rejections: Object.freeze(
          Object.fromEntries(
            Object.entries(rejections).map(([id, diagnostic]) => [id, Object.freeze(diagnostic)]),
          ),
        ),
      };
    },
    reset() {
      last.clear();
      innovations.clear();
      lastMs = -Infinity;
      space = undefined;
    },
  };
}
