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

/**
 * What the simulated detector reports for one landmark before it is written in MediaPipe's shape:
 * where it was seen in the scene, its image position (normalised `[x, y, z]`, or `undefined` when it
 * cannot be imaged), its hip-centred world position in camera axes (metres), and its scores. A
 * dropped landmark has neither position, as MediaPipe has none for it. `geometry` is what the camera
 * could truly see of it, carried beside the scores and never changed by them, by corruption or by an
 * edit: the truth a reported confidence is judged against.
 */
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

/**
 * The simulated detector's confidence for every landmark, from the truth's geometry, behind a port
 * so the model that maps one to the other is replaceable without touching the measurement.
 */
export interface DetectorScores {
  score(geometry: readonly SyntheticVisibility[]): readonly LandmarkScore[];
}

const score = (visibility: number, presence: number): LandmarkScore =>
  Object.freeze({ visibility, presence });

/** A perfect detector: every landmark visible and present with MediaPipe's confident score. */
export const IDEAL_SCORES: DetectorScores = Object.freeze({
  score: (geometry: readonly SyntheticVisibility[]) => geometry.map(() => score(0.99, 0.99)),
});

/**
 * The score each geometric state gets from `GEOMETRIC_SCORES`, total over the union by its type. A
 * hidden landmark in frame is still estimated by MediaPipe, present but under the gap detector's
 * default threshold of 0.5; one off the stage is barely present; one behind the camera is not
 * imaged at all. Proposals shaped like MediaPipe's reports, not measurements of it.
 */
export const SCORE_PROFILE: Readonly<Record<VisibilityKind, LandmarkScore>> = Object.freeze({
  visible: score(0.98, 0.99),
  occluded: score(0.3, 0.9),
  "out-of-frame": score(0.05, 0.2),
  "behind-camera": score(0, 0),
});

/** A detector whose confidence follows what the camera could see. */
export const GEOMETRIC_SCORES: DetectorScores = Object.freeze({
  score: (geometry: readonly SyntheticVisibility[]) =>
    geometry.map((state) => SCORE_PROFILE[state.kind]),
});

/**
 * One hand edit of the detector's output, never of the truth: the person may make the detector
 * see something impossible (a teleport, a swap, a confident wrong score) to test the pipeline's
 * robustness, and the truth it is judged against stays where it was. A closed union applied in one
 * fixed order: `displace` moves where the landmark is seen (both spaces, through the camera),
 * `swap` exchanges it with its anatomical partner, `score` overrides its visibility and presence,
 * `drop` removes it.
 */
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

/** The order edits apply in, whatever order they were made: geometry, identity, scores, removal. */
export const EDIT_ORDER: readonly ObservationEditKind[] = ["displace", "swap", "score", "drop"];

/**
 * Where each landmark is seen: the truth, displaced by any `displace` edit. Edits are the
 * person's, applied to a copy; the truth is frozen and never written.
 */
function seenPoints(truth: ActorFrame, edits: readonly ObservationEdit[]): Vec3[] {
  const points = truth.landmarks.map((point) => point);
  for (const edit of edits)
    if (edit.kind === "displace") points[edit.landmark] = add3(points[edit.landmark]!, edit.delta);
  return points;
}

/** What one observation is made with, beyond the truth and the camera; every field defaults. */
export interface ObserveOptions {
  readonly scores?: DetectorScores;
  /** Occluders beside the body: the scene's props. */
  readonly props?: readonly Occluder[];
  readonly corruption?: CorruptionSpec;
  /** The camera frame's index, which keys the corruption. */
  readonly frameIndex?: number;
  readonly edits?: readonly ObservationEdit[];
}

/**
 * The detector's view of `truth` through `camera`, in the order the measurement happens: what the
 * camera could see (`classifyVisibility`, from the truth and the props), the scores that geometry
 * gets, where each landmark is seen (the truth, moved by any `displace` edit) projected into both
 * spaces, the detector's corruption at `frameIndex`, then the other edits in `EDIT_ORDER`, which
 * override the corrupted report. Image `x` and `y` are the pinhole projection normalised by the
 * stage; image `z` is the depth from the hips scaled as `x` is at the hips' depth, an approximation
 * of MediaPipe's learned relative depth, not a reproduction of it. World is hip-centred in camera
 * axes, centred on the hips as seen, as MediaPipe centres on its own hip estimate.
 */
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
  // The hip midpoint as seen: the observed hip landmarks, so a displaced hip moves the origin.
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
      next[edit.landmark] = observed[partner]!;
      next[partner] = current;
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

/** The observation in MediaPipe's raw shape, both spaces, for `writePoseResult`. */
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
