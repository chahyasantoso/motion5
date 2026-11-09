import { LANDMARKS } from "../body/attachments";
import type { Side } from "../body/skeleton";
import { unreachable } from "../filler/unreachable";
import { dot } from "../filler/vec";
import { segmentEnd, type ActorFrame } from "./actor";
import { NEAR_M, type Camera } from "./camera";
import { add3, scale3, sub3, type Vec3 } from "./rotation";

/** What can block a landmark from the camera: a capsule (points within `radius` of `a`-`b`) or a
 * box (`centre`±`half`, axis-aligned); `attached` names landmarks it never hides. */
export type Occluder =
  | {
      readonly kind: "capsule";
      readonly id: string;
      readonly a: Vec3;
      readonly b: Vec3;
      readonly radius: number;
      readonly attached: ReadonlySet<number>;
    }
  | {
      readonly kind: "box";
      readonly id: string;
      readonly centre: Vec3;
      readonly half: Vec3;
      readonly attached: ReadonlySet<number>;
    };

/** Where a landmark stands for the camera, from truth geometry alone (not detector confidence),
 * `behind-camera` → `out-of-frame` → `occluded` (nearest wins) → `visible`. */
export type SyntheticVisibility =
  | { readonly kind: "visible" }
  | { readonly kind: "occluded"; readonly occluderId: string }
  | { readonly kind: "out-of-frame" }
  | { readonly kind: "behind-camera" };

export type VisibilityKind = SyntheticVisibility["kind"];

/** How much nearer than the landmark, along the ray, a blocker must be to hide it; a surface
 * point grazing its own part stays visible, a part turned away still hides. */
export const SURFACE_TOLERANCE_M = 0.02;

const index = (name: string) => LANDMARKS.findIndex((landmark) => landmark.name === name);
const indices = (...names: readonly string[]) => new Set(names.map(index));
const NONE: ReadonlySet<number> = new Set();

/** Part radii in metres: a coarse adult, sized by the default proportions. */
export const PART_RADIUS_M = Object.freeze({
  torso: 0.12,
  chest: 0.08,
  pelvis: 0.09,
  upperArm: 0.045,
  forearm: 0.038,
  hand: 0.03,
  thigh: 0.07,
  shin: 0.05,
  foot: 0.035,
});

const capsule = (
  id: string,
  a: Vec3,
  b: Vec3,
  radius: number,
  attached: ReadonlySet<number>,
): Occluder =>
  Object.freeze({
    kind: "capsule",
    id,
    a: Object.freeze(a),
    b: Object.freeze(b),
    radius,
    attached,
  });

function limbOccluders(frame: ActorFrame, side: Side): Occluder[] {
  const at = (name: string) => frame.landmarks[index(`${side}-${name}`)]!;
  const r = PART_RADIUS_M;
  const hand = segmentEnd(frame, `${side}-hand`, frame.body.hand * 0.5);
  const handPoints = ["wrist", "pinky", "index", "thumb"].map((name) => `${side}-${name}`);
  const footPoints = ["ankle", "heel", "foot-index"].map((name) => `${side}-${name}`);
  return [
    capsule(
      `${side}-upper-arm`,
      at("shoulder"),
      at("elbow"),
      r.upperArm,
      indices(`${side}-shoulder`, `${side}-elbow`),
    ),
    capsule(
      `${side}-forearm`,
      at("elbow"),
      at("wrist"),
      r.forearm,
      indices(`${side}-elbow`, `${side}-wrist`),
    ),
    capsule(`${side}-hand`, at("wrist"), hand, r.hand, indices(...handPoints)),
    capsule(
      `${side}-thigh`,
      at("hip"),
      at("knee"),
      r.thigh,
      indices(`${side}-hip`, `${side}-knee`),
    ),
    capsule(
      `${side}-shin`,
      at("knee"),
      at("ankle"),
      r.shin,
      indices(`${side}-knee`, `${side}-ankle`),
    ),
    capsule(`${side}-foot`, at("heel"), at("foot-index"), r.foot, indices(...footPoints)),
  ];
}

/** The truth body as occluders, from its landmarks and segments. Torso, chest, pelvis, head
 * sphere, six capsules per side; the head hides its own face when turned away. */
export function bodyOccluders(frame: ActorFrame): readonly Occluder[] {
  const at = (name: string) => frame.landmarks[index(name)]!;
  const mid = (a: Vec3, b: Vec3) => scale3(add3(a, b), 0.5);
  const hips = mid(at("left-hip"), at("right-hip"));
  const shoulders = mid(at("left-shoulder"), at("right-shoulder"));
  const head = segmentEnd(frame, "head", -frame.body.neckToHeadCentre);
  const r = PART_RADIUS_M;
  return [
    capsule("torso", hips, shoulders, r.torso, NONE),
    capsule(
      "chest",
      at("left-shoulder"),
      at("right-shoulder"),
      r.chest,
      indices("left-shoulder", "right-shoulder"),
    ),
    capsule("pelvis", at("left-hip"), at("right-hip"), r.pelvis, indices("left-hip", "right-hip")),
    capsule("head", head, head, frame.body.headRadius, NONE),
    ...limbOccluders(frame, "left"),
    ...limbOccluders(frame, "right"),
  ];
}

/** Scene props, as external occluders in the actor's standing frame. */
export const PROPS = Object.freeze({
  none: Object.freeze([]) as readonly Occluder[],
  table: Object.freeze([
    Object.freeze({
      kind: "box",
      id: "table",
      centre: Object.freeze([0, 0.4, 0.6] as const),
      half: Object.freeze([0.6, 0.4, 0.3] as const),
      attached: NONE,
    }),
  ]) as readonly Occluder[],
  pillar: Object.freeze([
    capsule("pillar", [0.25, 0, 0.7], [0.25, 2.2, 0.7], 0.12, NONE),
  ]) as readonly Occluder[],
});

export type PropId = keyof typeof PROPS;
export const PROP_IDS = Object.keys(PROPS) as readonly PropId[];

/** Sphere entry along a finite ray, as a parameter from 0 to 1: 0 when the origin is already
 * inside, `undefined` on a miss. */
function sphereEntry(offset: Vec3, ray: Vec3, radius: number): number | undefined {
  const c = dot(offset, offset) - radius * radius;
  if (c <= 0) return 0;
  const a = dot(ray, ray);
  if (a === 0) return undefined;
  const b = dot(offset, ray);
  const discriminant = b * b - a * c;
  if (discriminant < 0) return undefined;
  const entry = (-b - Math.sqrt(discriminant)) / a;
  return entry >= 0 && entry <= 1 ? entry : undefined;
}

/** First contact of the ray with a capsule (cylinder plus two endpoint spheres), not closest
 * approach: closest misorders blockers whose radii differ. */
function capsuleEntry(from: Vec3, to: Vec3, a: Vec3, b: Vec3, radius: number): number | undefined {
  const ray = sub3(to, from);
  const axis = sub3(b, a);
  const length2 = dot(axis, axis);
  const offset = sub3(from, a);
  if (length2 <= 1e-12) return sphereEntry(offset, ray, radius);
  const axial = dot(offset, axis) / length2;
  const axialRay = dot(ray, axis) / length2;
  const radial = sub3(offset, scale3(axis, axial));
  const radialRay = sub3(ray, scale3(axis, axialRay));
  if (axial >= 0 && axial <= 1 && dot(radial, radial) <= radius * radius) return 0;
  let nearest: number | undefined;
  const consider = (entry: number | undefined) => {
    if (entry !== undefined && (nearest === undefined || entry < nearest)) nearest = entry;
  };
  consider(sphereEntry(offset, ray, radius));
  consider(sphereEntry(sub3(from, b), ray, radius));
  const qa = dot(radialRay, radialRay);
  const qb = dot(radial, radialRay);
  const qc = dot(radial, radial) - radius * radius;
  const discriminant = qb * qb - qa * qc;
  if (qa > 1e-12 && discriminant >= 0) {
    const root = Math.sqrt(discriminant);
    for (const entry of [(-qb - root) / qa, (-qb + root) / qa]) {
      const along = axial + entry * axialRay;
      if (entry >= 0 && entry <= 1 && along >= 0 && along <= 1) consider(entry);
    }
  }
  return nearest;
}

/** Parameter along `from -> to`, 0 to 1, where the occluder first blocks it; `undefined` if clear. */
function blocksAt(occluder: Occluder, from: Vec3, to: Vec3): number | undefined {
  switch (occluder.kind) {
    case "capsule": {
      return capsuleEntry(from, to, occluder.a, occluder.b, occluder.radius);
    }
    case "box": {
      // Slabs: clip the segment's parameter interval to each axis's pair of planes.
      let enter = 0;
      let exit = 1;
      for (let axis = 0; axis < 3; axis += 1) {
        const origin = from[axis]!;
        const span = to[axis]! - origin;
        const low = occluder.centre[axis]! - occluder.half[axis]!;
        const high = occluder.centre[axis]! + occluder.half[axis]!;
        if (Math.abs(span) < 1e-12) {
          if (origin < low || origin > high) return undefined;
          continue;
        }
        const a = (low - origin) / span;
        const b = (high - origin) / span;
        enter = Math.max(enter, Math.min(a, b));
        exit = Math.min(exit, Math.max(a, b));
        if (enter > exit) return undefined;
      }
      return enter;
    }
    default:
      return unreachable(occluder, "occluder");
  }
}

/** Every landmark's visibility through `camera` among `occluders`, from truth landmarks only,
 * never an observation: edits, corruption and the estimate cannot change it. */
export function classifyVisibility(
  truth: ActorFrame,
  camera: Camera,
  occluders: readonly Occluder[],
): readonly SyntheticVisibility[] {
  const { width, height } = camera.spec.stage;
  const eye = camera.spec.position;
  return truth.landmarks.map((point, landmark): SyntheticVisibility => {
    const inCamera = camera.toCamera(point);
    if (!(inCamera[2] > NEAR_M)) return BEHIND_CAMERA;
    const [u, v] = camera.pixel(inCamera)!;
    if (u < 0 || u > width || v < 0 || v > height) return OUT_OF_FRAME;
    const ray = sub3(point, eye);
    const length = Math.sqrt(dot(ray, ray));
    const stop = add3(eye, scale3(ray, Math.max(0, 1 - SURFACE_TOLERANCE_M / length)));
    let nearest: { id: string; at: number } | undefined;
    for (const occluder of occluders) {
      if (occluder.attached.has(landmark)) continue;
      const at = blocksAt(occluder, eye, stop);
      if (at !== undefined && (nearest === undefined || at < nearest.at))
        nearest = { id: occluder.id, at };
    }
    return nearest === undefined ? VISIBLE : { kind: "occluded", occluderId: nearest.id };
  });
}

const VISIBLE: SyntheticVisibility = Object.freeze({ kind: "visible" });
const OUT_OF_FRAME: SyntheticVisibility = Object.freeze({ kind: "out-of-frame" });
const BEHIND_CAMERA: SyntheticVisibility = Object.freeze({ kind: "behind-camera" });
