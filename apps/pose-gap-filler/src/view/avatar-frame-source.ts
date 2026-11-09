import type { Patch } from "@motion5/core";
import { selectRecord, selectRow, unreachable } from "@motion5/core/plugin-api";
import type { FrameSource } from "@motion5/three/skeleton";
import { frameFromMatrix } from "@motion5/three";
import { Matrix4, Vector3 } from "three";
import type { Basis } from "../filler/direction";
import { presentedPosition } from "../filler/frame";
import { LIMBS, type LimbId } from "../filler/landmarks";
import type { PipelineStep } from "../filler/pipeline";
import type { Vec } from "../filler/vec";
import { limbTracks, poseNodeId } from "../rig/tracks";
import type { LimbResidual } from "./avatar";

/** Presentation-only sources the app adds beside published pose nodes. */
export const AVATAR_SOURCES = Object.freeze({
  torso: "app/torso",
  hipsMid: "app/hips-mid",
  shoulderMid: "app/shoulder-mid",
} as const);

function rowCells(value: unknown, id: string): Readonly<Record<string, unknown>> | undefined {
  const picked = selectRow(value, id);
  switch (picked.kind) {
    case "row":
      return picked.cells;
    case "missing-row":
    case "missing-output":
    case "wrong-kind":
      return undefined;
    default:
      return unreachable(picked);
  }
}

/** BodyState basis to published frame values, through the adapter's one convention owner. */
export function basisToFrame3d(position: Vec, basis: Basis): Readonly<Record<string, number>> {
  const vector = (value: Vec) => new Vector3().fromArray(value);
  const matrix = new Matrix4().makeBasis(vector(basis.x), vector(basis.y), vector(basis.z));
  return frameFromMatrix(matrix.setPosition(position[0]!, position[1]!, position[2]!));
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
    const rootPatch = readPatch?.(poseNodeId(ids.root));
    const root = selectRecord(rootPatch?.status === "ready" ? rootPatch.outputs.values : undefined);
    switch (root.kind) {
      case "record":
        sources.set(poseNodeId(ids.root), root.values);
        break;
      case "missing-output":
      case "wrong-kind":
        break;
      default:
        return unreachable(root);
    }
    const posePatch = readPatch?.(poseNodeId(ids.pose));
    for (const id of [ids.upper, ids.lower]) {
      const values =
        posePatch?.status === "ready" ? rowCells(posePatch.outputs.values, id) : undefined;
      if (values !== undefined) sources.set(poseNodeId(id), values);
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
      sources.set(AVATAR_SOURCES.torso, basisToFrame3d(hips, body.orientation.basis));
      sources.set(AVATAR_SOURCES.hipsMid, { x: hips[0], y: hips[1], z: hips[2] });
      sources.set(AVATAR_SOURCES.shoulderMid, {
        x: shoulders[0],
        y: shoulders[1],
        z: shoulders[2],
      });
    }
  }
  return (id) => sources.get(id);
}
