import type { Patch } from "@motion5/core";
import type { FrameSource } from "@motion5/three/skeleton";
import { EULER_ORDER_3D } from "@motion5/three";
import { Euler, Matrix4, Vector3 } from "three";
import type { Basis } from "../filler/direction";
import { presentedPosition } from "../filler/frame";
import { LIMBS, type LimbId } from "../filler/landmarks";
import type { PipelineStep } from "../filler/pipeline";
import type { Vec } from "../filler/vec";
import { limbTracks, poseNodeId } from "../rig/tracks";
import type { LimbResidual } from "./avatar";

/** The sole BodyState basis to published-frame convention conversion. */
export function basisToFrame3d(position: Vec, basis: Basis): Readonly<Record<string, number>> {
  const vector = (value: Vec) => new Vector3().fromArray(value);
  const matrix = new Matrix4().makeBasis(vector(basis.x), vector(basis.y), vector(basis.z));
  const euler = new Euler().setFromRotationMatrix(matrix, EULER_ORDER_3D);
  const degrees = 180 / Math.PI;
  return {
    x: position[0]!,
    y: position[1]!,
    z: position[2]!,
    rotation: euler.z * degrees,
    rotationX: euler.x * degrees,
    rotationY: euler.y * degrees,
  };
}

/** Only this accepted world solve can supply points; old ready patches are not current evidence. */
export function avatarFrameSource(
  step: PipelineStep,
  residuals: ReadonlyMap<LimbId, LimbResidual>,
  readPatch: ((id: string) => Patch | undefined) | undefined,
): FrameSource {
  const sources = new Map<string, Readonly<Record<string, unknown>>>();
  if (step.filled.space.kind !== "world") return () => undefined;
  for (const limb of LIMBS) {
    if (residuals.get(limb.id)?.freshness.kind !== "current") continue;
    const ids = limbTracks(limb.id);
    for (const id of [ids.root, ids.upper, ids.lower]) {
      const nodeId = poseNodeId(id);
      const patch = readPatch?.(nodeId);
      if (patch?.status === "ready") sources.set(nodeId, patch.values);
    }
  }
  const body = step.filled.body;
  if (sources.size > 0 && body !== undefined && body.orientation.kind !== "unavailable") {
    const lh = presentedPosition(step.filled.joints["left-hip"]);
    const rh = presentedPosition(step.filled.joints["right-hip"]);
    const ls = presentedPosition(step.filled.joints["left-shoulder"]);
    const rs = presentedPosition(step.filled.joints["right-shoulder"]);
    if (lh !== undefined && rh !== undefined && ls !== undefined && rs !== undefined) {
      const midpoint = (a: Vec, b: Vec) => a.map((value, index) => (value + b[index]!) / 2);
      const hips = midpoint(lh, rh),
        shoulders = midpoint(ls, rs);
      sources.set("app/torso", basisToFrame3d(hips, body.orientation.basis));
      sources.set("app/hips-mid", { x: hips[0], y: hips[1], z: hips[2] });
      sources.set("app/shoulder-mid", { x: shoulders[0], y: shoulders[1], z: shoulders[2] });
    }
  }
  return (id) => sources.get(id);
}
