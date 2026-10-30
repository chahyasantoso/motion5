import { LANDMARKS, partnerIndex } from "../body/attachments";
import type { Camera } from "./camera";
import type { ObservedLandmark } from "./observation";
import type { Vec3 } from "./rotation";
import { gaussianAt, uniformAt } from "./seeded";

/** Detector error rates per frame, all from `seed` and frame `k`, so any frame replays alone.
 * `jitter` is AR(1) per landmark and axis; swaps last `MIN_SWAP_FRAMES` to `MAX_SWAP_FRAMES`. */
export interface CorruptionSpec {
  readonly seed: number;
  readonly jitter: { readonly sigmaPx: number; readonly sigmaM: number; readonly rho: number };
  readonly falseHighRate: number;
  readonly swapRate: number;
  readonly outlierRate: number;
  readonly outlierPx: number;
  readonly dropRate: number;
  readonly timingJitterMs: number;
}

export const NO_CORRUPTION: CorruptionSpec = Object.freeze({
  seed: 0,
  jitter: Object.freeze({ sigmaPx: 0, sigmaM: 0, rho: 0 }),
  falseHighRate: 0,
  swapRate: 0,
  outlierRate: 0,
  outlierPx: 0,
  dropRate: 0,
  timingJitterMs: 0,
});

/** Page presets: `phone` proposes a midrange detector, not a measurement; `harsh` raises every rate tenfold. */
export const CORRUPTION_PRESETS = Object.freeze({
  none: NO_CORRUPTION,
  phone: Object.freeze({
    seed: 540,
    jitter: Object.freeze({ sigmaPx: 2.5, sigmaM: 0.012, rho: 0.8 }),
    falseHighRate: 0.05,
    swapRate: 0.004,
    outlierRate: 0.002,
    outlierPx: 60,
    dropRate: 0.02,
    timingJitterMs: 8,
  }),
  harsh: Object.freeze({
    seed: 541,
    jitter: Object.freeze({ sigmaPx: 6, sigmaM: 0.03, rho: 0.9 }),
    falseHighRate: 0.5,
    swapRate: 0.04,
    outlierRate: 0.02,
    outlierPx: 120,
    dropRate: 0.2,
    timingJitterMs: 25,
  }),
}) satisfies Readonly<Record<string, CorruptionSpec>>;

export type CorruptionPresetId = keyof typeof CORRUPTION_PRESETS;
export const CORRUPTION_PRESET_IDS = Object.keys(
  CORRUPTION_PRESETS,
) as readonly CorruptionPresetId[];

/** Longest swap episode, frames. */
export const MAX_SWAP_FRAMES = 8;
const MIN_SWAP_FRAMES = 2;
/** Visibility a false-high landmark reports: confidently wrong. */
export const FALSE_HIGH_VISIBILITY = 0.9;

/** One key stream per effect, so no two effects share a random value. */
const STREAM = Object.freeze({
  jitter: 1,
  falseHigh: 2,
  swapStart: 3,
  swapLength: 4,
  outlier: 5,
  outlierAngle: 6,
  drop: 7,
  timing: 8,
});

const rate = (value: number) => Number.isFinite(value) && value >= 0 && value <= 1;
const magnitude = (value: number) => Number.isFinite(value) && value >= 0;

/** Frame-independent validation, shared by direct and paced-simulator callers. */
export function validateCorruptionSpec(spec: CorruptionSpec): CorruptionSpec {
  const { jitter } = spec;
  if (!Number.isSafeInteger(spec.seed)) throw new Error("Corruption seed must be a safe integer.");
  if (
    !(magnitude(jitter.sigmaPx) && magnitude(jitter.sigmaM) && rate(jitter.rho) && jitter.rho < 1)
  )
    throw new Error("Jitter needs nonnegative sigmas and a correlation in [0, 1).");
  for (const value of [spec.falseHighRate, spec.swapRate, spec.outlierRate])
    if (!rate(value)) throw new Error("Corruption rates must be in [0, 1].");
  if (!(rate(spec.dropRate) && spec.dropRate < 1))
    throw new Error("A drop rate must be in [0, 1), or no frame would ever arrive.");
  if (!magnitude(spec.outlierPx))
    throw new Error("Outlier distance must be finite and nonnegative.");
  if (!magnitude(spec.timingJitterMs))
    throw new Error("Timing jitter must be finite and nonnegative.");
  return spec;
}

/** `spec` if every field is in range; a frame period also bounds timing jitter. */
export function validateCorruption(spec: CorruptionSpec, frameMs: number): CorruptionSpec {
  validateCorruptionSpec(spec);
  if (!(Number.isFinite(frameMs) && frameMs > 0))
    throw new Error("A frame period must be finite and positive.");
  if (!(spec.timingJitterMs < frameMs))
    throw new Error("Timing jitter must be under one frame period.");
  return spec;
}

function validateFrameIndex(k: number): void {
  if (!(Number.isSafeInteger(k) && k >= 0))
    throw new Error("Camera frame index must be nonnegative and safe.");
}

/** When frame `k` reaches the detector: `captured` with its time, or `dropped`. */
export type FrameTiming =
  | { readonly kind: "captured"; readonly tMs: number }
  | { readonly kind: "dropped" };

const DROPPED: FrameTiming = Object.freeze({ kind: "dropped" });

/** Frame `k`'s arrival: dropped at `dropRate`, else `k` periods plus seeded lateness. */
export function frameTiming(spec: CorruptionSpec, k: number, frameMs: number): FrameTiming {
  validateFrameIndex(k);
  validateCorruption(spec, frameMs);
  if (uniformAt(spec.seed, STREAM.drop, k) < spec.dropRate) return DROPPED;
  return {
    kind: "captured",
    tMs: k * frameMs + spec.timingJitterMs * uniformAt(spec.seed, STREAM.timing, k),
  };
}

/** Truncated AR(1): finite kernel cut at 1% weight or 64 taps, normalised to unit variance. */
function ar1(
  seed: number,
  rho: number,
  k: number,
  landmark: number,
  axis: number,
  taps: number,
  normaliser: number,
): number {
  let sum = 0;
  let weight = 1;
  for (let lag = 0; lag < taps; lag += 1) {
    sum += weight * gaussianAt(seed, STREAM.jitter, k - lag, landmark, axis);
    weight *= rho;
  }
  return sum / normaliser;
}

const sided = (names: readonly string[]) =>
  LANDMARKS.filter((landmark) => names.some((name) => landmark.name === `left-${name}`)).map(
    (landmark) => landmark.index,
  );
/** Swaps move a whole limb chain at once: shoulder to fingers, hip to foot. */
const SWAP_GROUPS: readonly (readonly number[])[] = [
  sided(["shoulder", "elbow", "wrist", "pinky", "index", "thumb"]),
  sided(["hip", "knee", "ankle", "heel", "foot-index"]),
];

/** Whether swap group `group` swaps at frame `k`: an episode began within its length. */
export function swapActive(spec: CorruptionSpec, group: number, k: number): boolean {
  validateFrameIndex(k);
  validateCorruptionSpec(spec);
  if (!(Number.isInteger(group) && group >= 0 && group < SWAP_GROUPS.length))
    throw new Error("Unknown limb swap group.");
  if (spec.swapRate === 0) return false;
  for (let start = Math.max(0, k - MAX_SWAP_FRAMES + 1); start <= k; start += 1) {
    if (uniformAt(spec.seed, STREAM.swapStart, group, start) >= spec.swapRate) continue;
    const span = MAX_SWAP_FRAMES - MIN_SWAP_FRAMES + 1;
    const length =
      MIN_SWAP_FRAMES + Math.floor(span * uniformAt(spec.seed, STREAM.swapLength, group, start));
    if (k - start < length) return true;
  }
  return false;
}

/** Detector errors at frame `k`: jitter and outliers move what was imaged, false-high scores
 * contradict geometry, swaps exchange whole limbs; unimaged points and geometry stay untouched. */
export function corrupt(
  observed: readonly ObservedLandmark[],
  spec: CorruptionSpec,
  k: number,
  camera: Camera,
): readonly ObservedLandmark[] {
  validateFrameIndex(k);
  if (spec === NO_CORRUPTION) return observed;
  validateCorruptionSpec(spec);
  const { width, height } = camera.spec.stage;
  const { seed, jitter } = spec;
  // One kernel per frame, rather than repeating logarithms/powers for every landmark and axis.
  const taps =
    jitter.rho === 0 ? 1 : Math.min(64, Math.ceil(Math.log(0.01) / Math.log(jitter.rho)));
  const normaliser = Math.sqrt(
    jitter.rho === 0 ? 1 : (1 - jitter.rho ** (2 * taps)) / (1 - jitter.rho * jitter.rho),
  );
  const moved = observed.map((landmark, index): ObservedLandmark => {
    if (landmark.image === undefined || landmark.world === undefined) return landmark;
    const noise =
      jitter.sigmaPx === 0 && jitter.sigmaM === 0
        ? [0, 0, 0]
        : [0, 1, 2].map((axis) => ar1(seed, jitter.rho, k, index, axis, taps, normaliser));
    let [u, v] = [
      landmark.image[0] + (noise[0]! * jitter.sigmaPx) / width,
      landmark.image[1] + (noise[1]! * jitter.sigmaPx) / height,
    ];
    let world: Vec3 = [
      landmark.world[0] + noise[0]! * jitter.sigmaM,
      landmark.world[1] + noise[1]! * jitter.sigmaM,
      landmark.world[2] + noise[2]! * jitter.sigmaM,
    ];
    if (uniformAt(seed, STREAM.outlier, k, index) < spec.outlierRate) {
      const angle = 2 * Math.PI * uniformAt(seed, STREAM.outlierAngle, k, index);
      const [du, dv] = [Math.cos(angle) * spec.outlierPx, Math.sin(angle) * spec.outlierPx];
      u += du / width;
      v += dv / height;
      // The same jump in the world, at the landmark's depth, so both spaces see one outlier.
      const metresPerPx = Math.abs(camera.toCamera(landmark.scene!)[2]) / camera.focal;
      world = [world[0] + du * metresPerPx, world[1] + dv * metresPerPx, world[2]];
    }
    const hidden = landmark.geometry.kind !== "visible";
    const confident = hidden && uniformAt(seed, STREAM.falseHigh, k, index) < spec.falseHighRate;
    return {
      ...landmark,
      image: [u, v, landmark.image[2]],
      world,
      visibility: confident ? FALSE_HIGH_VISIBILITY : landmark.visibility,
    };
  });
  const swapped = moved.slice();
  SWAP_GROUPS.forEach((group, groupIndex) => {
    if (!swapActive(spec, groupIndex, k)) return;
    for (const left of group) {
      const right = partnerIndex(left)!;
      // Positions and scores swap; each slot keeps its own geometric truth.
      swapped[left] = { ...moved[right]!, geometry: moved[left]!.geometry };
      swapped[right] = { ...moved[left]!, geometry: moved[right]!.geometry };
    }
  });
  return swapped;
}
