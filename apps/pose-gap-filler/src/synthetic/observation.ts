import type { RawLandmark, RawPose } from "../filler/adapter";
import { partnerIndex } from "../body/attachments";
import { unreachable } from "../filler/unreachable";
import type { ActorFrame } from "./actor";
import type { Camera } from "./camera";
import { NO_CORRUPTION, corrupt, type CorruptionSpec } from "./corruption";
import {
  bodyOccluders,
  classifyVisibility,
  type Occluder,
  type SyntheticVisibility,
  type VisibilityKind,
} from "./occlusion";
import { add3, sub3, type Vec3 } from "./rotation";

/** One landmark as the simulated detector reports it: scene, image, world positions, scores.
 * `geometry` is what the camera could truly see, untouched by scores, corruption and edits. */
export interface ObservedLandmark {
  readonly scene: Vec3 | undefined;
  readonly image: Vec3 | undefined;
  readonly world: Vec3 | undefined;
  readonly visibility: number;
  readonly presence: number;
  readonly geometry: SyntheticVisibility;
}

export interface LandmarkScore {
  readonly visibility: number;
  readonly presence: number;
}

/** Simulated detector's confidence per landmark, from truth geometry; swappable behind this port. */
export interface DetectorScores {
  score(geometry: readonly SyntheticVisibility[]): readonly LandmarkScore[];
}

const score = (visibility: number, presence: number): LandmarkScore =>
  Object.freeze({ visibility, presence });

/** Perfect detector: every landmark visible and present at MediaPipe's confident score. */
export const IDEAL_SCORES: DetectorScores = Object.freeze({
  score: (geometry: readonly SyntheticVisibility[]) => geometry.map(() => score(0.99, 0.99)),
});

/** `GEOMETRIC_SCORES` per kind: hidden in frame still estimated under the 0.5 gap threshold.
 * Out-of-frame barely present; behind camera not imaged; shaped like reports, not measurements. */
export const SCORE_PROFILE: Readonly<Record<VisibilityKind, LandmarkScore>> = Object.freeze({
  visible: score(0.98, 0.99),
  occluded: score(0.3, 0.9),
  "out-of-frame": score(0.05, 0.2),
  "behind-camera": score(0, 0),
});

/** Detector whose confidence follows what the camera could see. */
export const GEOMETRIC_SCORES: DetectorScores = Object.freeze({
  score: (geometry: readonly SyntheticVisibility[]) =>
    geometry.map((state) => SCORE_PROFILE[state.kind]),
});

/** Hand edit of detector output, never truth; variants applied in `EDIT_ORDER`.
 * `displace` moves the seen point; `swap` trades partners; `score` overrides; `drop` removes. */
export type ObservationEdit =
  | { readonly kind: "displace"; readonly landmark: number; readonly delta: Vec3 }
  | { readonly kind: "swap"; readonly landmark: number }
  | {
      readonly kind: "score";
      readonly landmark: number;
      readonly visibility: number;
      readonly presence: number;
    }
  | { readonly kind: "drop"; readonly landmark: number };

export type ObservationEditKind = ObservationEdit["kind"];

/** Order edits apply in, whatever order they were made: geometry, identity, scores, removal. */
export const EDIT_ORDER: readonly ObservationEditKind[] = ["displace", "swap", "score", "drop"];

// Copy of truth; edits rewrite the copy, never `truth`.
function seenPoints(truth: ActorFrame, edits: readonly ObservationEdit[]): Vec3[] {
  const points = truth.landmarks.map((point) => point);
  for (const edit of edits)
    if (edit.kind === "displace") points[edit.landmark] = add3(points[edit.landmark]!, edit.delta);
  return points;
}

/** What one observation is made with beyond the truth and camera; every field defaults. */
export interface ObserveOptions {
  readonly scores?: DetectorScores;
  /** Scene props, occluding beside the body. */
  readonly props?: readonly Occluder[];
  readonly corruption?: CorruptionSpec;
  /** Camera frame index, keying the corruption. */
  readonly frameIndex?: number;
  readonly edits?: readonly ObservationEdit[];
}

/** Detector's view of `truth` through `camera`: visibility, scores, projections, corruption, edits.
 * Image: stage-normalised pinhole, `z` from hip depth. World: origin at seen hips; camera axes. */
export function observe(
  truth: ActorFrame,
  camera: Camera,
  options: ObserveOptions = {},
): readonly ObservedLandmark[] {
  const {
    scores = IDEAL_SCORES,
    props = [],
    corruption = NO_CORRUPTION,
    frameIndex = 0,
    edits = [],
  } = options;
  const { width, height } = camera.spec.stage;
  const geometry = classifyVisibility(truth, camera, [...bodyOccluders(truth), ...props]);
  const scored = scores.score(geometry);
  const seen = seenPoints(truth, edits);
  // Origin from seen hips: a displaced hip moves it.
  const hips = midpoint(seen[LEFT_HIP]!, seen[RIGHT_HIP]!);
  const hipCamera = camera.toCamera(hips);
  const measured: ObservedLandmark[] = seen.map((scene, index) => {
    const point = camera.toCamera(scene);
    const pixel = camera.pixel(point);
    const image: Vec3 | undefined =
      pixel === undefined
        ? undefined
        : [
            pixel[0] / width,
            pixel[1] / height,
            hipCamera[2] > 0
              ? ((point[2] - hipCamera[2]) * camera.focal) / (hipCamera[2] * width)
              : Number.NaN,
          ];
    const world = image === undefined ? undefined : sub3(point, hipCamera);
    return { scene, image, world, ...scored[index]!, geometry: geometry[index]! };
  });
  let observed = corrupt(measured, corruption, frameIndex, camera);
  for (const kind of EDIT_ORDER)
    for (const edit of edits) if (edit.kind === kind) observed = applyEdit(observed, edit);
  return observed;
}

function applyEdit(
  observed: readonly ObservedLandmark[],
  edit: ObservationEdit,
): readonly ObservedLandmark[] {
  const next = observed.slice();
  const current = observed[edit.landmark];
  if (current === undefined) throw new Error(`No landmark ${edit.landmark}.`);
  switch (edit.kind) {
    case "displace":
      return next;
    case "swap": {
      const partner = partnerIndex(edit.landmark);
      if (partner === undefined) return next;
      next[edit.landmark] = { ...observed[partner]!, geometry: current.geometry };
      next[partner] = { ...current, geometry: observed[partner]!.geometry };
      return next;
    }
    case "score":
      next[edit.landmark] = { ...current, visibility: edit.visibility, presence: edit.presence };
      return next;
    case "drop":
      next[edit.landmark] = { ...current, scene: undefined, image: undefined, world: undefined };
      return next;
    default:
      return unreachable(edit, "observation edit");
  }
}

const LEFT_HIP = 23;
const RIGHT_HIP = 24;

function midpoint(a: Vec3, b: Vec3): Vec3 {
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
}

const MISSING: Vec3 = [Number.NaN, Number.NaN, Number.NaN];

/** Observation in MediaPipe's raw shape, both spaces, for `writePoseResult`. */
export function rawPoses(observed: readonly ObservedLandmark[]): {
  readonly image: RawPose;
  readonly world: RawPose;
} {
  const raw = (pick: (landmark: ObservedLandmark) => Vec3 | undefined): RawPose =>
    observed.map((landmark): RawLandmark => {
      const [x, y, z] = pick(landmark) ?? MISSING;
      return [x, y, z, landmark.visibility, landmark.presence];
    });
  return { image: raw((landmark) => landmark.image), world: raw((landmark) => landmark.world) };
}
