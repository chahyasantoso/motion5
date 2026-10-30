import type { JointId } from "./landmarks";
import type { LandmarkSpace } from "./space";
import { unreachable } from "./unreachable";
import type { Vec } from "./vec";
import type { BodyState } from "../body/state";

/** MediaPipe presence: probability a landmark is in scene at all; occlusion is `visibility`.
 * `unreported` = producer supplied none; never fabricated as confident 1. */
export type Presence =
  | { readonly kind: "reported"; readonly value: number }
  | { readonly kind: "unreported" };

export const UNREPORTED: Presence = Object.freeze({ kind: "unreported" });

/** What the adapter read for one joint. `absent` = missing landmark or non-finite coordinate,
 * refused rather than passed as NaN; `measured` carries presence, trust reads visibility only. */
export type JointObservation =
  | {
      readonly kind: "measured";
      readonly position: Vec;
      readonly visibility: number;
      readonly presence: Presence;
    }
  | { readonly kind: "absent" };

/** One adapted MediaPipe result; `tMs` is the only clock stateful modules read. */
export interface LandmarkFrame {
  readonly tMs: number;
  readonly space: LandmarkSpace;
  readonly joints: Readonly<Record<JointId, JointObservation>>;
}

/** Why a joint is not trusted: absent = adapter refusal, low-visibility = under threshold,
 * gate = excessive speed, innovation = implausible residual, invalid = malformed, forced = replay mask. */
export type GapReason = "absent" | "low-visibility" | "gate" | "forced" | "innovation" | "invalid";

/** Raw detector decision, in this frame's native px/mm units, before either filter. */
export type RejectionDiagnostic =
  | { readonly kind: "invalid" }
  | {
      readonly kind: "outlier";
      readonly reason: "innovation" | "speed";
      readonly innovation: number;
      readonly limit: number;
      readonly candidates: number;
    };

/** Gap detector's answer, sole owner of "is this joint trusted"; a trusted joint carries its
 * measurement, so trusted-without-position cannot be written down. */
export type JointTrust =
  | { readonly kind: "trusted"; readonly position: Vec; readonly visibility: number }
  | { readonly kind: "gap"; readonly reason: GapReason };

export interface TrustedFrame extends LandmarkFrame {
  readonly body?: BodyState;
  readonly trust: Readonly<Record<JointId, JointTrust>>;
  readonly rejections?: Readonly<Partial<Record<JointId, RejectionDiagnostic>>>;
}

/** Filler's answer for one joint. A filled joint is never a measurement: `inferred` carries
 * provenance by kind and `sinceMs`, and the overlay draws it differently. */
export type FilledJoint =
  | { readonly kind: "measured"; readonly position: Vec }
  | {
      readonly kind: "inferred";
      readonly position: Vec;
      readonly sinceMs: number;
      /** Absent on hold/legacy fills. Only the prediction owner may supply this evidence. */
      readonly prediction?: JointPrediction;
    }
  | { readonly kind: "lost" };

/** Prediction age = evidence age, not time the gap began. */
export type JointPrediction =
  | {
      readonly kind: "coast";
      readonly lastObservedTMs: number;
      readonly expiresTMs: number;
      /** Local tangent filter variance, not a calibrated detector accuracy claim. */
      readonly angularVarianceRad2: number;
    }
  | {
      readonly kind: "prior";
      readonly lastObservedTMs: number;
      readonly expiresTMs: number;
      readonly angularVarianceRad2: number;
      readonly uncertaintyCalibrated: boolean;
    };

export interface FilledFrame {
  readonly body?: BodyState;
  readonly tMs: number;
  readonly space: LandmarkSpace;
  readonly joints: Readonly<Record<JointId, FilledJoint>>;
}

/** Position a filled joint presents: measured or inferred; `undefined` when lost. */
export function presentedPosition(joint: FilledJoint): Vec | undefined {
  switch (joint.kind) {
    case "measured":
    case "inferred":
      return joint.position;
    case "lost":
      return undefined;
    default:
      return unreachable(joint, "filled joint");
  }
}

/** Measured position of a trusted joint; `undefined` for a gap. */
export function trustedPosition(trust: JointTrust): Vec | undefined {
  switch (trust.kind) {
    case "trusted":
      return trust.position;
    case "gap":
      return undefined;
    default:
      return unreachable(trust, "joint trust");
  }
}

/** What a measured observation carries. */
export interface Measurement {
  readonly position: Vec;
  readonly visibility: number;
}

/** Sole read of "did the adapter measure this joint": measurement, or `undefined` when absent.
 * Trust, raw reference and fixtures route here, so a new variant is decided once. */
export function measurementOf(observation: JointObservation): Measurement | undefined {
  switch (observation.kind) {
    case "measured":
      return observation;
    case "absent":
      return undefined;
    default:
      return unreachable(observation, "joint observation");
  }
}
