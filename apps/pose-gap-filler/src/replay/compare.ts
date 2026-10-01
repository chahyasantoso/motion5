import { DEFAULT_DETECTOR, jointSpeed, type GapDetectorOptions } from "../filler/gap-detector";
import type { FillerKind, FillerSpec } from "../filler/gap-filler";
import { DEFAULT_KALMAN_NOISE, DEFAULT_COAST_MS } from "../filler/chain-kalman";
import { DEFAULT_WORLD_KALMAN_NOISE } from "../filler/world-chain";
import { unreachable } from "../filler/unreachable";
import { JOINTS, scaleBone } from "../filler/landmarks";
import { createGapPipeline } from "../filler/pipeline";
import { IMAGE_SPACE, spaceUnit, type LandmarkSpace } from "../filler/space";
import { NO_STABILIZER, type StabilizerSpec } from "../filler/stabilizer";
import type { RigSolver } from "../rig/solver";
import type { Mask } from "./mask";
import { measureReplay, quantile, type ReplayMetrics, type Summary } from "./metrics";
import { replayFrame, type PoseRecording } from "./recording";
import { runReplay } from "./replay";

export interface ComparisonOptions {
  readonly recording: PoseRecording;
  readonly space: LandmarkSpace;
  readonly fillers: readonly FillerSpec[];
  readonly masks?: readonly Mask[] | undefined;
  readonly detector?: GapDetectorOptions | undefined;
  readonly lengthWindow?: number | undefined;
  /** One stabilizer for every row, so rows differ only by filler; `none` by default. */
  readonly stabilizer?: StabilizerSpec | undefined;
  /** A fresh rig per filler, disposed after its run, so no run inherits another's solve. */
  readonly createSolver?: (() => RigSolver) | undefined;
}

/** Image-space comparison order: unfiltered reference, naive hold, relative-angle predictor. */
export const COMPARED_FILLERS: readonly FillerSpec[] = [
  { kind: "raw" },
  { kind: "hold" },
  { kind: "chain-kalman", noise: DEFAULT_KALMAN_NOISE, coastMs: DEFAULT_COAST_MS },
];

/** Same closed filler choices, explicitly tuned in their native units. */
export function comparedFillers(space: LandmarkSpace): readonly FillerSpec[] {
  switch (space.kind) {
    case "image":
      return COMPARED_FILLERS;
    case "world":
      return [
        { kind: "raw" },
        { kind: "hold" },
        { kind: "chain-kalman", noise: DEFAULT_WORLD_KALMAN_NOISE, coastMs: DEFAULT_COAST_MS },
      ];
    default:
      return unreachable(space, "comparison space");
  }
}

/**
 * The default replay masks: a half-second gap every three seconds at 30 fps on each tip and middle
 * joint, staggered so no two limbs lose a joint on the same frames.
 */
export const DEFAULT_MASKS: readonly Mask[] = [
  { kind: "periodic", joints: ["left-wrist"], every: 90, length: 15, offset: 30 },
  { kind: "periodic", joints: ["right-elbow"], every: 90, length: 15, offset: 52 },
  { kind: "periodic", joints: ["left-ankle"], every: 90, length: 15, offset: 74 },
  { kind: "periodic", joints: ["right-knee"], every: 90, length: 15, offset: 96 },
];

export interface ComparisonRow {
  readonly filler: FillerKind;
  readonly metrics: ReplayMetrics;
}

/** Every filler over the same recording, masks and detector: one row each, in the given order. */
export function compareFillers(options: ComparisonOptions): readonly ComparisonRow[] {
  return options.fillers.map((filler) => {
    const solver = options.createSolver?.();
    try {
      return {
        filler: filler.kind,
        metrics: measureReplay(runReplay({ ...options, filler, solver })),
      };
    } finally {
      solver?.dispose();
    }
  });
}

const cell = (value: number | undefined) => (value === undefined ? "–" : value.toFixed(1));
const summary = (value: Summary) => `${cell(value.mean)} / ${cell(value.p95)} / ${cell(value.max)}`;

/** One markdown table, units named per column, mean / p95 / max where a column summarises. */
export function formatComparison(rows: readonly ComparisonRow[], space: LandmarkSpace): string {
  const unit = spaceUnit(space);
  const header = [
    "filler",
    `position error ${unit}`,
    "lost frames",
    `bone-length deviation ${unit}`,
    `jitter ${unit}/s²`,
    "lag ms",
    `recovery snap ${unit}`,
  ];
  const lines = rows.map(({ filler, metrics }) => [
    filler,
    summary(metrics.positionError),
    String(metrics.lostFrames),
    summary(metrics.boneLengthDeviation),
    summary(metrics.jitter),
    cell(metrics.lagMs),
    summary(metrics.recoverySnap),
  ]);
  return [header, header.map(() => "---"), ...lines]
    .map((row) => `| ${row.join(" | ")} |`)
    .join("\n");
}

export interface Calibration {
  /** The lowest per-joint P01 among joints with at least two usable still samples. */
  readonly visibilityP01: number;
  /** The 99.9th percentile of frame-to-frame joint speed, in scale-bone lengths per second. */
  readonly speedP999: number;
  readonly detector: GapDetectorOptions;
}

/** Visibility headroom under a still person's worst frames; gate headroom over their noise. */
export const CALIBRATION_VISIBILITY_MARGIN = 0.05;
export const CALIBRATION_GATE_FACTOR = 4;

/**
 * Calibrates the detector from a recording of a still person, which fixes the noise floor and
 * nothing more: it cannot say how fast a person moves. So calibration only ever tightens the
 * threshold above the default floor and raises the gate above their noise; it never
 * loosens the threshold or lowers the gate below `DEFAULT_DETECTOR`.
 */
export function calibrateDetector(
  recording: PoseRecording,
  space: LandmarkSpace = IMAGE_SPACE,
): Calibration {
  const pipeline = createGapPipeline({
    filler: { kind: "raw" },
    detector: { threshold: DEFAULT_DETECTOR.threshold, gate: Infinity },
    // The gate measures raw speed, so its calibration must too: a denoised still take would set
    // a gate below the noise the live detector actually sees.
    stabilizer: NO_STABILIZER,
  });
  const visibilities = new Map<string, number[]>(JOINTS.map((joint) => [joint, []]));
  const speeds: number[] = [];
  let previous: ReturnType<typeof pipeline.step> | undefined;
  for (const recorded of recording.frames) {
    const step = pipeline.step(replayFrame(recording, recorded, space));
    for (const joint of JOINTS) {
      const now = step.trusted.trust[joint];
      if (now.kind !== "trusted") continue;
      visibilities.get(joint)!.push(now.visibility);
      const before = previous?.trusted.trust[joint];
      const scale = pipeline.lengths.length(scaleBone(joint));
      if (before?.kind !== "trusted" || scale === undefined || scale <= 0) continue;
      speeds.push(
        jointSpeed(
          { position: before.position, tMs: previous!.trusted.tMs },
          { position: now.position, tMs: step.trusted.tMs },
          scale,
        ),
      );
    }
    previous = step;
  }
  const jointFloors = [...visibilities.values()]
    .filter((values) => values.length >= 2)
    .map((values) =>
      quantile(
        values.sort((a, b) => a - b),
        0.01,
      ),
    );
  if (jointFloors.length === 0 || speeds.length === 0)
    throw new Error("Calibration needs a recording with at least two frames of trusted joints.");
  const visibilityP01 = Math.min(...jointFloors);
  const speedP999 = quantile(
    speeds.sort((a, b) => a - b),
    0.999,
  );
  return {
    visibilityP01,
    speedP999,
    detector: {
      threshold: Math.max(
        DEFAULT_DETECTOR.threshold,
        visibilityP01 - CALIBRATION_VISIBILITY_MARGIN,
      ),
      gate: Math.max(DEFAULT_DETECTOR.gate, CALIBRATION_GATE_FACTOR * speedP999),
    },
  };
}
