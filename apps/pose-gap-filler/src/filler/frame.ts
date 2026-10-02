import type { JointId } from "./landmarks";
import type { LandmarkSpace } from "./space";
import { unreachable } from "./unreachable";
import type { Vec } from "./vec";

/**
 * MediaPipe's presence score for one landmark: the probability it is in the scene at all, which
 * says nothing about whether it is occluded (that is `visibility`). `unreported` when the producer
 * supplied none (a v1 recording, a result without the field, the legacy synthetic subject): it is
 * never fabricated as a confident 1.
 */
export type Presence =
  | { readonly kind: "reported"; readonly value: number }
  | { readonly kind: "unreported" };

export const UNREPORTED: Presence = Object.freeze({ kind: "unreported" });

/**
 * What the adapter read for one joint. `absent` is a landmark missing from the result or carrying
 * a non-finite coordinate: the adapter refuses it rather than passing a NaN downstream. A measured
 * joint carries visibility and presence as reported; trust reads visibility only.
 */
export type JointObservation =
  | {
      readonly kind: "measured";
      readonly position: Vec;
      readonly visibility: number;
      readonly presence: Presence;
    }
  | { readonly kind: "absent" };

/** One adapted MediaPipe result. `tMs` is the only clock any stateful module reads. */
export interface LandmarkFrame {
  readonly tMs: number;
  readonly space: LandmarkSpace;
  readonly joints: Readonly<Record<JointId, JointObservation>>;
}

/**
 * Why a joint is not trusted. `absent` is the adapter's refusal; `low-visibility` is visibility
 * under the threshold; `gate` is a speed since the last trusted sample above the gate, in bone
 * lengths per second (a teleport or a left/right swap); `forced` is a hotkey or a replay mask.
 */
export type GapReason = "absent" | "low-visibility" | "gate" | "forced";

/**
 * The gap detector's answer, the one owner of "is this joint trusted". A trusted joint carries the
 * measurement it trusts, so a trusted joint without a position cannot be written down.
 */
export type JointTrust =
  | { readonly kind: "trusted"; readonly position: Vec; readonly visibility: number }
  | { readonly kind: "gap"; readonly reason: GapReason };

export interface TrustedFrame extends LandmarkFrame {
  readonly trust: Readonly<Record<JointId, JointTrust>>;
}

/**
 * A filler's answer for one joint. A filled joint is never presented as a measurement: `inferred`
 * carries its provenance by kind and the time its gap began, and the overlay draws it differently.
 */
export type FilledJoint =
  | { readonly kind: "measured"; readonly position: Vec }
  | { readonly kind: "inferred"; readonly position: Vec; readonly sinceMs: number }
  | { readonly kind: "lost" };

export interface FilledFrame {
  readonly tMs: number;
  readonly space: LandmarkSpace;
  readonly joints: Readonly<Record<JointId, FilledJoint>>;
}

/** The position a filled joint presents, measured or inferred, or `undefined` when lost. */
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

/** The measured position of a trusted joint, or `undefined` for a gap. */
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

/**
 * The one read of "did the adapter measure this joint": the measurement, or `undefined` for an
 * absent joint. Every consumer of an observation (trust, the raw reference, fixtures) reads it
 * through here, so a new observation variant is decided once.
 */
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
