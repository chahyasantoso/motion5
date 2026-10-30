import type { FillerKind } from "../filler/gap-filler";
import { LANDMARK_SPACES, spaceUnit, type LandmarkSpace } from "../filler/space";
import { stabilizerFor, type StabilizerKind } from "../filler/stabilizer";
import { unreachable } from "../filler/unreachable";
import type { RigSolver } from "../rig/solver";
import {
  DEFAULT_MASKS,
  compareFillers,
  comparedFillers,
  type Calibration,
  type ComparisonRow,
} from "./compare";
import type { Mask } from "./mask";
import type { ReplayMetrics, Summary } from "./metrics";
import type { PoseRecording } from "./recording";

/**
 * Measurable gap: best filler's mean masked error exceeds this many times reference noise.
 * A perfect predictor still scores the reference's noise, so the bar is heuristic, not proof. */
export const MEASURABLE_GAP_FACTOR = 2;

/** Best filler under test in one space: the bar a later filler must beat. */
export interface BestFiller {
  readonly filler: FillerKind;
  /** Mean distance from reference over masked frames shown, in space units. */
  readonly errorMean: number;
  /** Masked frames with no output, uncounted by `errorMean`. */
  readonly lostFrames: number;
}

/**
 * Whether the best filler leaves a closable gap: `uncalibrated` with no still recording, or
 * `within-noise` inside `MEASURABLE_GAP_FACTOR` times noise, else `measurable` above it. */
export type GapVerdict =
  | { readonly kind: "uncalibrated"; readonly best: BestFiller }
  | { readonly kind: "within-noise"; readonly best: BestFiller; readonly referenceNoise: number }
  | {
      readonly kind: "measurable";
      readonly best: BestFiller;
      readonly referenceNoise: number;
      readonly gap: number;
    };

/**
 * What the comparison says about the INN: `open` on a measurable gap, `not-needed` when every
 * space is within noise, else `undecided`: some space has no still recording. */
export type InnDecision =
  | {
      readonly kind: "open";
      readonly targets: readonly { readonly space: LandmarkSpace; readonly best: BestFiller }[];
    }
  | { readonly kind: "not-needed" }
  | { readonly kind: "undecided"; readonly uncalibrated: readonly LandmarkSpace[] };

export interface SpaceRecord {
  readonly space: LandmarkSpace;
  /** Still calibration the detector and noise floor came from, when this space had one. */
  readonly calibration: Calibration | undefined;
  /** Filler output alone, no rig: where an untrusted joint is. The verdict reads these rows. */
  readonly filled: readonly ComparisonRow[];
  /** What the live page draws: rig-placed middles and tips, with the writer's bend-side hold. */
  readonly rig: readonly ComparisonRow[];
  readonly verdict: GapVerdict;
}

/** Every compared filler's metrics in both spaces, and the INN call. */
export interface ComparisonRecord {
  /** Replayed input in words, for the record's first line. */
  readonly label: string;
  readonly frameCount: number;
  readonly stabilizer: StabilizerKind;
  readonly spaces: readonly SpaceRecord[];
  readonly inn: InnDecision;
}

export interface ComparisonRecordInput {
  readonly label: string;
  /** Recording every filler is replayed over. */
  readonly recording: PoseRecording;
  /** One stabilizer kind for every row, tuned per space by `stabilizerFor`. */
  readonly stabilizer: StabilizerKind;
  /** Still calibration per space, `undefined` where there is none. */
  readonly calibrationFor: (space: LandmarkSpace) => Calibration | undefined;
  /** Fresh rig per rig row, so those rows measure what the live page draws. */
  readonly createSolver: (space: LandmarkSpace) => RigSolver;
  readonly masks?: readonly Mask[] | undefined;
}

/** Whether a filler is under test; `raw` is the reference every metric is judged against. */
function underTest(filler: FillerKind): boolean {
  switch (filler) {
    case "raw":
      return false;
    case "hold":
    case "chain-kalman":
      return true;
    default:
      return unreachable(filler, "filler kind");
  }
}

/** Filler under test with lowest mean masked error; fewer lost frames break a tie. */
export function bestFiller(rows: readonly ComparisonRow[]): BestFiller {
  const ranked = rows
    .filter((row) => underTest(row.filler) && row.metrics.positionError.mean !== undefined)
    .map((row) => ({
      filler: row.filler,
      errorMean: row.metrics.positionError.mean!,
      lostFrames: row.metrics.lostFrames,
    }))
    .sort((a, b) => a.errorMean - b.errorMean || a.lostFrames - b.lostFrames);
  const best = ranked[0];
  if (best === undefined)
    throw new Error("A verdict needs a filler under test with at least one masked frame shown.");
  return best;
}

export function judgeGap(
  rows: readonly ComparisonRow[],
  calibration: Calibration | undefined,
): GapVerdict {
  const best = bestFiller(rows);
  if (calibration === undefined) return { kind: "uncalibrated", best };
  const referenceNoise = calibration.referenceNoise;
  if (best.errorMean <= MEASURABLE_GAP_FACTOR * referenceNoise)
    return { kind: "within-noise", best, referenceNoise };
  return { kind: "measurable", best, referenceNoise, gap: best.errorMean - referenceNoise };
}

export function decideInn(spaces: readonly SpaceRecord[]): InnDecision {
  const targets: { space: LandmarkSpace; best: BestFiller }[] = [];
  const uncalibrated: LandmarkSpace[] = [];
  for (const { space, verdict } of spaces)
    switch (verdict.kind) {
      case "measurable":
        targets.push({ space, best: verdict.best });
        break;
      case "uncalibrated":
        uncalibrated.push(space);
        break;
      case "within-noise":
        break;
      default:
        return unreachable(verdict, "gap verdict");
    }
  if (targets.length > 0) return { kind: "open", targets };
  if (uncalibrated.length > 0) return { kind: "undecided", uncalibrated };
  return { kind: "not-needed" };
}

/**
 * Replays one recording through every compared filler in both spaces, filler-only and on fresh
 * rigs, then judges the filler-only rows. The live page and the record both call this. */
export function buildComparisonRecord(input: ComparisonRecordInput): ComparisonRecord {
  const spaces = LANDMARK_SPACES.map((space): SpaceRecord => {
    const calibration = input.calibrationFor(space);
    const options = {
      recording: input.recording,
      space,
      fillers: comparedFillers(space),
      masks: input.masks ?? DEFAULT_MASKS,
      detector: calibration?.detector,
      stabilizer: stabilizerFor(input.stabilizer, space),
    };
    const filled = compareFillers(options);
    const rig = compareFillers({ ...options, createSolver: () => input.createSolver(space) });
    return { space, calibration, filled, rig, verdict: judgeGap(filled, calibration) };
  });
  return {
    label: input.label,
    frameCount: input.recording.frames.length,
    stabilizer: input.stabilizer,
    spaces,
    inn: decideInn(spaces),
  };
}

/** Widest line the formatter writes, Prettier's `printWidth`, keeping the record stable. */
export const RECORD_WIDTH = 100;

const number = (value: number | undefined, digits = 1) =>
  value === undefined ? "n/a" : value.toFixed(digits);
const summary = (value: Summary) =>
  `${number(value.mean)} / ${number(value.p95)} / ${number(value.max)}`;

/** Widest word after a bullet's two-column `- ` or continuation indent. */
const WORD_WIDTH = RECORD_WIDTH - 2;

/** Words of one bullet: whitespace runs split, any word wider than `WORD_WIDTH` cut into pieces. */
function words(text: string): string[] {
  return text
    .split(/\s+/)
    .filter((word) => word !== "")
    .flatMap((word) =>
      Array.from({ length: Math.ceil(word.length / WORD_WIDTH) }, (_, index) =>
        word.slice(index * WORD_WIDTH, (index + 1) * WORD_WIDTH),
      ),
    );
}

/** Greedy wrap: `- ` first line, two spaces on every continuation. */
function bullet(text: string): string[] {
  const lines: string[] = [];
  let line = "-";
  for (const word of words(text)) {
    if (line !== "-" && line.length + 1 + word.length > RECORD_WIDTH) {
      lines.push(line);
      line = " ";
    }
    line += ` ${word}`;
  }
  lines.push(line);
  return lines;
}

function metricsText(metrics: ReplayMetrics, unit: string): string {
  return [
    `position error ${summary(metrics.positionError)} ${unit},`,
    `lost frames ${metrics.lostFrames},`,
    `bone-length deviation ${summary(metrics.boneLengthDeviation)} ${unit},`,
    `jitter ${summary(metrics.jitter)} ${unit}/s²,`,
    `lag ${number(metrics.lagMs)} ms,`,
    `recovery snap ${summary(metrics.recoverySnap)} ${unit}.`,
  ].join(" ");
}

function bestText(best: BestFiller, unit: string): string {
  return `\`${best.filler}\` at ${number(best.errorMean)} ${unit} mean masked error with ${best.lostFrames} lost frames`;
}

function verdictText(verdict: GapVerdict, unit: string): string {
  switch (verdict.kind) {
    case "uncalibrated":
      return `Verdict (filled rows): uncalibrated. The best filler is ${bestText(verdict.best, unit)}, but without a still recording in this space there is no noise floor to judge it against.`;
    case "within-noise":
      return `Verdict (filled rows): within noise. The best filler is ${bestText(verdict.best, unit)}, inside ${MEASURABLE_GAP_FACTOR} times the reference noise of ${number(verdict.referenceNoise)} ${unit}.`;
    case "measurable":
      return `Verdict (filled rows): measurable gap. The best filler is ${bestText(verdict.best, unit)}, ${number(verdict.best.errorMean / verdict.referenceNoise)} times the reference noise of ${number(verdict.referenceNoise)} ${unit}, a gap of ${number(verdict.gap)} ${unit}.`;
    default:
      return unreachable(verdict, "gap verdict");
  }
}

function calibrationText(calibration: Calibration | undefined, unit: string): string {
  if (calibration === undefined)
    return "Detector: the default, because no still recording calibrated this space.";
  const { threshold, gate } = calibration.detector;
  return `Detector: calibrated on the still recording, visibility threshold ${number(threshold, 3)} and speed gate ${number(gate)} bone lengths/s; reference noise ${number(calibration.referenceNoise, 2)} ${unit}.`;
}

function innText(inn: InnDecision): string {
  switch (inn.kind) {
    case "open": {
      const targets = inn.targets.map(
        ({ space, best }) =>
          `\`${best.filler}\` in ${space.kind} space (${number(best.errorMean)} ${spaceUnit(space)}, ${best.lostFrames} lost frames)`,
      );
      return `INN: open. The best filler leaves a measurable gap, so the INN issue is warranted, and it must beat ${targets.join(" and ")} on mean masked error without losing more frames, never \`raw\`.`;
    }
    case "not-needed":
      return "INN: not needed. Every space's best filler is within the reference's noise, so no INN could be shown to beat it on this reference.";
    case "undecided":
      return `INN: undecided. No calibrated space shows a measurable gap, and ${inn.uncalibrated.map((space) => space.kind).join(" and ")} space has no still recording to judge it by.`;
    default:
      return unreachable(inn, "INN decision");
  }
}

/** Record as markdown bullets, never a table, every line within `RECORD_WIDTH`. */
export function formatComparisonRecord(record: ComparisonRecord): string {
  const out = bullet(
    `Input: ${record.label}, ${record.frameCount} frames, stabilizer \`${record.stabilizer}\`. Summaries are mean / p95 / max.`,
  );
  for (const { space, calibration, filled, rig, verdict } of record.spaces) {
    const unit = spaceUnit(space);
    out.push("", `### ${space.kind} space (${unit})`, "");
    out.push(...bullet(calibrationText(calibration, unit)));
    const rows = (population: string, compared: readonly ComparisonRow[]) => {
      for (const { filler, metrics } of compared)
        out.push(...bullet(`${population} \`${filler}\`: ${metricsText(metrics, unit)}`));
    };
    rows("Filled", filled);
    rows("Rig", rig);
    out.push(...bullet(verdictText(verdict, unit)));
  }
  out.push("", ...bullet(innText(record.inn)));
  return out.join("\n");
}
