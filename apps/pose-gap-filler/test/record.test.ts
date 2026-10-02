import { readFileSync, writeFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { measurementOf } from "../src/filler/frame";
import type { FillerKind } from "../src/filler/gap-filler";
import { JOINTS } from "../src/filler/landmarks";
import { stabilizerFor } from "../src/filler/stabilizer";
import { IMAGE_SPACE, LANDMARK_SPACES, WORLD_SPACE, type LandmarkSpace } from "../src/filler/space";
import { distance } from "../src/filler/vec";
import {
  DEFAULT_MASKS,
  calibrateDetector,
  compareFillers,
  comparedFillers,
  type Calibration,
  type ComparisonRow,
} from "../src/replay/compare";
import { summarize, type ReplayMetrics } from "../src/replay/metrics";
import {
  MEASURABLE_GAP_FACTOR,
  RECORD_WIDTH,
  bestFiller,
  buildComparisonRecord,
  decideInn,
  formatComparisonRecord,
  judgeGap,
  type ComparisonRecord,
  type GapVerdict,
  type SpaceRecord,
} from "../src/replay/record";
import { replayFrame } from "../src/replay/recording";
import { createSyntheticRecording, type SyntheticOptions } from "../src/replay/synthetic";
import { createRigSolver } from "../src/rig/solver";
import { RECORD_EXERCISE, RECORD_STILL, syntheticComparisonRecord } from "./comparison-record";
import { fakePorts } from "./engine";

/** Prettier's `printWidth`, the owner of how wide a committed line may be, read rather than copied. */
const PRINT_WIDTH: number = JSON.parse(
  readFileSync(new URL("../../../.prettierrc.json", import.meta.url), "utf8"),
).printWidth;
const RECORD_PATH = new URL("../../../docs/POSE-GAP-FILLER-COMPARISON.md", import.meta.url);
const BEGIN = "<!-- comparison-record:begin -->";
const END = "<!-- comparison-record:end -->";

/** Mean distance of each trusted reference sample from its noiseless twin, the true noise floor. */
function trueNoise(options: SyntheticOptions, space: LandmarkSpace): number {
  const noisy = createSyntheticRecording(options);
  const twin = createSyntheticRecording({ ...options, noiseScale: 0 });
  const distances: number[] = [];
  noisy.frames.forEach((frame, index) => {
    const measured = replayFrame(noisy, frame, space);
    const truth = replayFrame(twin, twin.frames[index]!, space);
    for (const joint of JOINTS) {
      const a = measurementOf(measured.joints[joint])?.position;
      const b = measurementOf(truth.joints[joint])?.position;
      if (a !== undefined && b !== undefined) distances.push(distance(a, b));
    }
  });
  return distances.reduce((total, value) => total + value, 0) / distances.length;
}

/** A row whose only populated metrics are the masked error samples and lost frames. */
function row(filler: FillerKind, errors: readonly number[], lostFrames = 0): ComparisonRow {
  const empty = summarize([]);
  const metrics: ReplayMetrics = {
    positionError: summarize(errors),
    lostFrames,
    boneLengthDeviation: empty,
    jitter: empty,
    lagMs: undefined,
    recoverySnap: empty,
  };
  return { filler, metrics };
}

function calibration(referenceNoise: number): Calibration {
  return {
    visibilityP01: 0.9,
    speedP999: 1,
    referenceNoise,
    detector: { threshold: 0.5, gate: 8 },
  };
}

function spaceRecord(space: LandmarkSpace, verdict: GapVerdict): SpaceRecord {
  const rows = [row("raw", [0]), row("hold", [verdict.best.errorMean])];
  return { space, calibration: undefined, filled: rows, rig: rows, verdict };
}

describe("comparison record (#530 phase 5)", () => {
  it("GF-70 estimates the reference's own noise from a still take, without truth, in both spaces", () => {
    for (const space of LANDMARK_SPACES)
      for (const noiseScale of [1, 3]) {
        const still = { ...RECORD_STILL, noiseScale };
        const estimate = calibrateDetector(createSyntheticRecording(still), space).referenceNoise;
        const truth = trueNoise(still, space);
        // Sway only adds to the step, so the estimate errs high, and never by more than a tenth.
        expect(estimate).toBeGreaterThan(0.95 * truth);
        expect(estimate).toBeLessThan(1.1 * truth);
      }
    const quiet = calibrateDetector(
      createSyntheticRecording({ ...RECORD_STILL, noiseScale: 0 }),
      IMAGE_SPACE,
    );
    // The noiseless twin still sways, and the estimate stays a small fraction of a pixel.
    expect(quiet.referenceNoise).toBeLessThan(0.2);
  });

  it("GF-71 judges the best filler under test, never raw, against twice the reference noise", () => {
    const rows = [row("raw", [0, 0]), row("hold", [4, 6]), row("chain-kalman", [5, 7], 2)];
    expect(bestFiller(rows)).toEqual({ filler: "hold", errorMean: 5, lostFrames: 0 });
    // Equal error: fewer lost frames wins.
    expect(bestFiller([row("chain-kalman", [5], 1), row("hold", [5], 0)]).filler).toBe("hold");
    expect(bestFiller([row("chain-kalman", [4], 3), row("hold", [5], 0)]).filler).toBe(
      "chain-kalman",
    );
    expect(() => bestFiller([row("raw", [0]), row("hold", [])])).toThrow(/filler under test/);
    const best = bestFiller(rows);
    expect(judgeGap(rows, undefined)).toEqual({ kind: "uncalibrated", best });
    expect(judgeGap(rows, calibration(5 / MEASURABLE_GAP_FACTOR))).toEqual({
      kind: "within-noise",
      best,
      referenceNoise: 2.5,
    });
    expect(judgeGap(rows, calibration(2))).toEqual({
      kind: "measurable",
      best,
      referenceNoise: 2,
      gap: 3,
    });
  });

  it("GF-72 opens the INN only on a measurable gap, and names the filler it must beat", () => {
    const hold = { filler: "hold" as const, errorMean: 30, lostFrames: 0 };
    const chain = { filler: "chain-kalman" as const, errorMean: 90, lostFrames: 2 };
    const measurable = (best: typeof hold | typeof chain): GapVerdict => ({
      kind: "measurable",
      best,
      referenceNoise: 2,
      gap: best.errorMean - 2,
    });
    const within: GapVerdict = { kind: "within-noise", best: hold, referenceNoise: 20 };
    const uncalibrated: GapVerdict = { kind: "uncalibrated", best: chain };
    expect(
      decideInn([spaceRecord(IMAGE_SPACE, within), spaceRecord(WORLD_SPACE, measurable(chain))]),
    ).toEqual({ kind: "open", targets: [{ space: WORLD_SPACE, best: chain }] });
    expect(
      decideInn([
        spaceRecord(IMAGE_SPACE, uncalibrated),
        spaceRecord(WORLD_SPACE, measurable(hold)),
      ]),
    ).toEqual({ kind: "open", targets: [{ space: WORLD_SPACE, best: hold }] });
    expect(
      decideInn([spaceRecord(IMAGE_SPACE, within), spaceRecord(WORLD_SPACE, uncalibrated)]),
    ).toEqual({ kind: "undecided", uncalibrated: [WORLD_SPACE] });
    expect(decideInn([spaceRecord(IMAGE_SPACE, within), spaceRecord(WORLD_SPACE, within)])).toEqual(
      { kind: "not-needed" },
    );
  });

  it("GF-73 compares every filler filler-only and on fresh rigs in both spaces, deterministically", () => {
    const still = createSyntheticRecording(RECORD_STILL);
    const recording = createSyntheticRecording(RECORD_EXERCISE);
    let created = 0;
    let disposed = 0;
    const input = {
      label: "synthetic",
      recording,
      stabilizer: "one-euro" as const,
      calibrationFor: (space: LandmarkSpace) =>
        space.kind === "image" ? calibrateDetector(still, space) : undefined,
      createSolver: (space: LandmarkSpace) => {
        created += 1;
        const solver = createRigSolver(fakePorts(), space);
        return {
          solve: solver.solve,
          dispose() {
            disposed += 1;
            solver.dispose();
          },
        };
      },
    };
    const record = buildComparisonRecord(input);
    expect(created).toBe(6);
    expect(disposed).toBe(6);
    expect(record.frameCount).toBe(recording.frames.length);
    expect(record.spaces.map(({ space }) => space.kind)).toEqual(["image", "world"]);
    for (const space of record.spaces) {
      for (const rows of [space.filled, space.rig])
        expect(rows.map(({ filler }) => filler)).toEqual(["raw", "hold", "chain-kalman"]);
      // Filler-only, raw shows the reference itself; the verdict reads those rows.
      expect(space.filled[0]!.metrics.positionError.max).toBe(0);
      expect(space.verdict.best).toEqual(bestFiller(space.filled));
    }
    const [image, world] = record.spaces;
    expect(image!.calibration).toBeDefined();
    expect(image!.verdict.kind).toBe("measurable");
    // World had no still take here: its detector is the default and it cannot be judged.
    expect(world!.calibration).toBeUndefined();
    expect(world!.verdict.kind).toBe("uncalibrated");
    expect(record.inn.kind).toBe("open");
    expect(buildComparisonRecord(input)).toEqual(record);
    // The rows are the replay harness's own, so the record adds no second measurement.
    expect(image!.filled).toEqual(
      compareFillers({
        recording,
        space: IMAGE_SPACE,
        fillers: comparedFillers(IMAGE_SPACE),
        masks: DEFAULT_MASKS,
        detector: image!.calibration!.detector,
        stabilizer: stabilizerFor("one-euro", IMAGE_SPACE),
      }),
    );
  });

  it("GF-74 formats every space, population, filler and verdict as bullets within the print width", () => {
    const record = syntheticComparisonRecord();
    const text = formatComparisonRecord(record);
    expect(RECORD_WIDTH).toBe(PRINT_WIDTH);
    const lines = text.split("\n");
    for (const line of lines) {
      expect(line.length).toBeLessThanOrEqual(PRINT_WIDTH);
      expect(line.startsWith("|")).toBe(false);
      expect(line.endsWith(" ")).toBe(false);
    }
    for (const heading of ["### image space (px)", "### world space (mm)"])
      expect(lines).toContain(heading);
    const flat = text.replace(/\n {2}/g, " ");
    for (const population of ["Filled", "Rig"])
      for (const filler of ["raw", "hold", "chain-kalman"])
        expect(flat).toContain(`- ${population} \`${filler}\`: position error`);
    for (const metric of ["lost frames", "bone-length deviation", "jitter", "lag", "recovery snap"])
      expect(flat).toContain(metric);
    const verdicts: readonly GapVerdict[] = [
      { kind: "uncalibrated", best: record.spaces[0]!.verdict.best },
      { kind: "within-noise", best: record.spaces[0]!.verdict.best, referenceNoise: 50 },
    ];
    const variants: ComparisonRecord[] = [
      { ...record, spaces: record.spaces.map((space, i) => ({ ...space, verdict: verdicts[i]! })) },
      { ...record, inn: { kind: "not-needed" } },
      { ...record, inn: { kind: "undecided", uncalibrated: [WORLD_SPACE] } },
    ];
    const rendered = variants.map((variant) =>
      formatComparisonRecord(variant).replace(/\n {2}/g, " "),
    );
    expect(rendered[0]).toContain("Verdict (filled rows): uncalibrated.");
    expect(rendered[0]).toContain("Verdict (filled rows): within noise.");
    expect(rendered[1]).toContain("INN: not needed.");
    expect(rendered[2]).toContain("INN: undecided.");
    expect(flat).toContain("INN: open.");
    expect(flat).toContain("never `raw`");
  });

  it("GF-75 the committed record is the regenerated record, byte for byte", () => {
    const generated = formatComparisonRecord(syntheticComparisonRecord());
    const document = readFileSync(RECORD_PATH, "utf8");
    const begin = document.indexOf(BEGIN);
    const end = document.indexOf(END);
    expect(begin).toBeGreaterThan(-1);
    expect(end).toBeGreaterThan(begin);
    const block = `${BEGIN}\n\n${generated}\n\n`;
    // Regenerate with POSE_COMPARISON_WRITE=1 after any change to a filler, the rig or the input.
    if (process.env.POSE_COMPARISON_WRITE === "1")
      writeFileSync(RECORD_PATH, document.slice(0, begin) + block + document.slice(end));
    else expect(document.slice(begin, end)).toBe(block);
  });
});
