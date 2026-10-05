import type { Patch } from "@motion5/core";
import { createObject3dPatchAdapter } from "@motion5/three";
import {
  BoxGeometry,
  Group,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  SphereGeometry,
  Vector3,
  type Object3D,
} from "three";
import type { RawPose } from "../filler/adapter";
import { WORLD_UNITS_PER_METRE } from "../filler/adapter";
import type { BoneLengths } from "../filler/bone-length";
import { basis, type Basis } from "../filler/direction";
import { presentedPosition } from "../filler/frame";
import { LIMBS, type LimbId } from "../filler/landmarks";
import type { PipelineStep } from "../filler/pipeline";
import { unreachable } from "../filler/unreachable";
import { add, distance, scale, sub, unit, type Vec } from "../filler/vec";
import type { BodyRoot } from "../body/state";
import type { SolvedLimb } from "../rig/rig";
import { limbTracks, poseNodeId } from "../rig/tracks";
import { createPresentationHistory, type PresentationFreshness } from "./presentation-history";
import { createAvatarBodyController, setStale } from "./avatar-body";
import { avatarFrameSource } from "./avatar-frame-source";
import type { GltfParse } from "./gltf-avatar";

export type OrientationEvidence =
  | { readonly kind: "observed"; readonly basis: Basis }
  | { readonly kind: "neutral" };
export type AvatarProvenance = "measured" | "inferred" | "neutral";
export interface LimbResidual {
  readonly middleMm: number | undefined;
  readonly tipMm: number | undefined;
  readonly provenance: AvatarProvenance;
  readonly orientation: OrientationEvidence["kind"];
  readonly freshness: PresentationFreshness;
}

/** Proper rotation, not the playground's Y reflection: mm / camera axes to metres / Three axes. */
export function calibrateAvatarParent(parent: Group): void {
  parent.rotation.set(Math.PI, 0, 0);
  parent.scale.setScalar(1 / WORLD_UNITS_PER_METRE);
}

export function requireUniformScale(parent: Object3D): void {
  for (let current: Object3D | null = parent; current !== null; current = current.parent) {
    const { x, y, z } = current.scale;
    if (![x, y, z].every(Number.isFinite) || x <= 0 || x !== y || x !== z)
      throw new Error("Avatar parents require finite positive uniform scale.");
  }
}

/** Extra-slot evidence does not change the 12-joint trust/model topology or train lengths. */
export function extremityOrientation(
  limb: LimbId,
  pose: RawPose | undefined,
  threshold: number,
): OrientationEvidence {
  if (!Number.isFinite(threshold) || threshold < 0 || threshold > 1)
    throw new Error("Orientation threshold must be in [0, 1].");
  const left = limb.startsWith("left");
  const slots = limb.endsWith("arm")
    ? [left ? 15 : 16, left ? 19 : 20, left ? 17 : 18]
    : [left ? 27 : 28, left ? 31 : 32, left ? 29 : 30];
  const points = slots.map((index) => {
    const slot = pose?.[index];
    return slot === undefined ||
      !slot.slice(0, 3).every(Number.isFinite) ||
      !Number.isFinite(slot[3]) ||
      slot[3] < threshold ||
      (Number.isFinite(slot[4]) && slot[4] < threshold)
      ? undefined
      : slot.slice(0, 3).map((value) => value * WORLD_UNITS_PER_METRE);
  });
  const [root, forward, side] = points;
  if (
    root === undefined ||
    forward === undefined ||
    side === undefined ||
    !points.every((point) => point?.every(Number.isFinite))
  )
    return { kind: "neutral" };
  const frame = basis(sub(forward, root), sub(side, root));
  return frame === undefined ? { kind: "neutral" } : { kind: "observed", basis: frame };
}

const PALETTE: Readonly<Record<AvatarProvenance, number>> = {
  measured: 0x38bdf8,
  inferred: 0xfbbf24,
  neutral: 0x94a3b8,
};
const midpoint = (a: Vec, b: Vec) => scale(add(a, b), 0.5);
const vector = (point: Vec) => new Vector3(point[0]!, point[1]!, point[2]!);

/**
 * Persistent flat primitives. FK group origins are distal tips; boxes point backward on local -x.
 * No graph, filter, clock, topology rebuild or independent pose solve lives here.
 */
export function createAvatarScene(parent = new Group()) {
  calibrateAvatarParent(parent);
  requireUniformScale(parent);
  const box = new BoxGeometry(1, 1, 1);
  const sphere = new SphereGeometry(1, 10, 8);
  const materials = Object.fromEntries(
    Object.entries(PALETTE).map(([kind, colour]) => [
      kind,
      new MeshBasicMaterial({ color: colour, wireframe: kind === "inferred" }),
    ]),
  ) as Record<AvatarProvenance, MeshBasicMaterial>;
  const objects = new Map<string, Group>();
  const meshes = new Map<string, Mesh>();
  let disposed = false;
  let previousReader: ((id: string) => Patch | undefined) | undefined;
  const make = (id: string, rounded = false) => {
    const group = new Group();
    const mesh = new Mesh(rounded ? sphere : box, materials.neutral);
    group.add(mesh);
    group.visible = false;
    group.name = id;
    parent.add(group);
    objects.set(id, group);
    meshes.set(id, mesh);
    return group;
  };
  for (const limb of LIMBS) {
    const ids = limbTracks(limb.id);
    make(poseNodeId(ids.upper));
    make(poseNodeId(ids.lower));
    make(`${limb.id}-extremity`);
  }
  for (const id of ["pelvis", "trunk", "shoulders", "neck"]) make(id);
  make("head", true);
  const history = createPresentationHistory(objects);
  const staleMaterial = new MeshBasicMaterial({ color: 0x64748b, wireframe: true });
  const bodyController = createAvatarBodyController(parent, objects, staleMaterial);
  const adapter = createObject3dPatchAdapter((id) => objects.get(id));
  const style = (id: string, provenance: AvatarProvenance) => {
    objects.get(id)!.userData.provenance = provenance;
    meshes.get(id)!.material = materials[provenance];
    history.accept(id);
  };
  const segment = (id: string, from: Vec, to: Vec, width: number, provenance: AvatarProvenance) => {
    const delta = sub(to, from);
    const length = distance(from, to);
    const direction = unit(delta);
    if (direction === undefined || !Number.isFinite(length)) return;
    const group = objects.get(id)!;
    group.position.copy(vector(to));
    group.quaternion.setFromUnitVectors(new Vector3(1, 0, 0), vector(direction));
    const mesh = meshes.get(id)!;
    mesh.scale.set(length, width, width);
    mesh.position.set(-length / 2, 0, 0);
    group.visible = true;
    style(id, provenance);
  };
  return {
    parent,
    /** Exposed for read-only inspection/tests, not nested skeletal retargeting. */
    objects: objects as ReadonlyMap<string, Group>,
    get body() {
      return bodyController.body;
    },
    loadAvatar(data: ArrayBuffer | Promise<ArrayBuffer>, parse?: GltfParse) {
      return bodyController.load(data, parse);
    },
    usePrimitives() {
      bodyController.usePrimitives();
    },
    clear() {
      history.clear();
      bodyController.clear();
      for (const object of objects.values()) adapter.clear(object);
      previousReader = undefined;
    },
    update(
      step: PipelineStep,
      solved: ReadonlyMap<LimbId, SolvedLimb>,
      lengths: BoneLengths,
      readPatch: ((id: string) => Patch | undefined) | undefined,
      extraPose?: RawPose,
      threshold = 0.5,
    ): ReadonlyMap<LimbId, LimbResidual> {
      if (disposed) throw new Error("Avatar is disposed.");
      requireUniformScale(parent);
      if (readPatch !== previousReader) {
        for (const object of objects.values()) adapter.clear(object);
        history.clear();
        bodyController.clear();
        previousReader = readPatch;
      }
      const residuals = new Map<LimbId, LimbResidual>();
      if (step.filled.space.kind !== "world") {
        history.clear();
        bodyController.clear();
        return residuals;
      }
      history.begin(step.filled.tMs);
      const finish = () => {
        history.finish((id) => {
          setStale(objects.get(id)!, staleMaterial);
        });
        for (const limb of LIMBS) {
          const upper = objects.get(poseNodeId(limbTracks(limb.id).upper))!;
          const freshness = upper.userData.freshness as PresentationFreshness;
          if (freshness.kind !== "current")
            residuals.set(limb.id, {
              middleMm: undefined,
              tipMm: undefined,
              provenance: (upper.userData.provenance as AvatarProvenance | undefined) ?? "neutral",
              orientation: "neutral",
              freshness,
            });
        }
        bodyController.update(step.filled.tMs, avatarFrameSource(step, residuals, readPatch));
        return residuals;
      };
      for (const limb of LIMBS) {
        const chain = solved.get(limb.id);
        const root = presentedPosition(step.filled.joints[limb.root]);
        if (chain === undefined || root === undefined || readPatch === undefined) continue;
        const ids = limbTracks(limb.id);
        const entries = [
          [ids.upper, limb.upper],
          [ids.lower, limb.lower],
        ] as const;
        const publications = entries.map(([id, bone]) => ({
          id: poseNodeId(id),
          patch: readPatch(poseNodeId(id)),
          length: lengths.length(bone),
        }));
        if (
          publications.some(
            ({ patch, length }) =>
              patch?.status !== "ready" ||
              length === undefined ||
              !Number.isFinite(length) ||
              length <= 0,
          )
        )
          continue;
        const provenance = [limb.root, limb.middle, limb.tip].every(
          (joint) => step.filled.joints[joint].kind === "measured",
        )
          ? "measured"
          : "inferred";
        for (const { id, patch, length } of publications) {
          adapter.apply(patch!);
          const mesh = meshes.get(id)!;
          mesh.scale.set(length!, limb.id.endsWith("arm") ? 45 : 65, 45);
          mesh.position.set(-length! / 2, 0, 0);
          objects.get(id)!.visible = true;
          style(id, provenance);
        }
        const middle = step.trusted.trust[limb.middle];
        const tip = step.trusted.trust[limb.tip];
        // Coarse palm/foot plane only, not forearm twist or fingers. Never claim gap evidence.
        const orientation =
          tip.kind === "trusted" && step.filled.joints[limb.tip].kind === "measured"
            ? extremityOrientation(limb.id, extraPose, threshold)
            : { kind: "neutral" as const };
        const detail = objects.get(`${limb.id}-extremity`)!;
        detail.position.copy(vector(chain.tip));
        switch (orientation.kind) {
          case "observed": {
            const { x, y, z } = orientation.basis;
            detail.quaternion.setFromRotationMatrix(
              new Matrix4().makeBasis(vector(x), vector(y), vector(z)),
            );
            break;
          }
          case "neutral":
            detail.quaternion.copy(objects.get(poseNodeId(ids.lower))!.quaternion);
            break;
          default:
            unreachable(orientation, "extremity orientation");
        }
        const detailMesh = meshes.get(`${limb.id}-extremity`)!;
        const extent = limb.id.endsWith("arm") ? 90 : 150;
        detailMesh.scale.set(extent, 40, 65);
        detailMesh.position.set(extent / 2, 0, 0);
        detail.visible = true;
        detail.userData.orientation = orientation.kind;
        style(`${limb.id}-extremity`, orientation.kind === "neutral" ? "neutral" : provenance);
        residuals.set(limb.id, {
          middleMm: middle.kind === "trusted" ? distance(middle.position, chain.middle) : undefined,
          tipMm: tip.kind === "trusted" ? distance(tip.position, chain.tip) : undefined,
          provenance,
          orientation: orientation.kind,
          freshness: { kind: "current", tMs: step.filled.tMs },
        });
      }
      const body = step.filled.body;
      if (body === undefined) return finish();
      // Raw/hold ablations retain their own roots. Connect to this frame's actual chains,
      // never secretly substitute stabilized model anchors for the raw reference.
      const anchor = (id: BodyRoot) => presentedPosition(step.filled.joints[id]);
      const ls = anchor("left-shoulder"),
        rs = anchor("right-shoulder");
      const lh = anchor("left-hip"),
        rh = anchor("right-hip");
      const provenance = Object.keys(body.anchors).every(
        (id) => step.filled.joints[id as BodyRoot].kind === "measured",
      )
        ? "measured"
        : "inferred";
      if (lh !== undefined && rh !== undefined) segment("pelvis", rh, lh, 100, provenance);
      if (ls !== undefined && rs !== undefined) segment("shoulders", rs, ls, 60, provenance);
      if (ls !== undefined && rs !== undefined && lh !== undefined && rh !== undefined) {
        const hips = midpoint(lh, rh),
          shoulders = midpoint(ls, rs);
        segment("trunk", hips, shoulders, 110, provenance);
        if (body.orientation.kind !== "unavailable") {
          const height = distance(hips, shoulders);
          const head = objects.get("head")!;
          const centre = add(shoulders, scale(body.orientation.basis.y, -height * 0.3));
          segment("neck", shoulders, centre, 35, "neutral");
          head.position.copy(vector(centre));
          meshes.get("head")!.scale.setScalar(height * 0.18);
          head.visible = true;
          head.userData.orientation = "neutral";
          style("head", "neutral");
        }
      }
      return finish();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      bodyController.dispose();
      history.clear();
      for (const object of objects.values()) parent.remove(object);
      box.dispose();
      sphere.dispose();
      for (const material of Object.values(materials)) material.dispose();
      staleMaterial.dispose();
    },
  };
}
