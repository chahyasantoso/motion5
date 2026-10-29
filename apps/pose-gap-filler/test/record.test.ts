import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
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
import {
  RECORD_BEGIN,
  RECORD_END,
  RECORD_PATH,
  RECORD_STILL,
  replaceRecordBlock,
  syntheticComparisonRecord,
  writeRecordBlock,
} from "./comparison-record";
import { fakePorts } from "./engine";

/** Prettier's `printWidth`, the owner of how wide a committed line may be, read, not copied. */
const PRINT_WIDTH: number = JSON.parse(
  readFileSync(new URL("../../../.prettierrc.json", import.meta.url), "utf8"),
).printWidth;
/**
 * GF-73's own movement and still takes: long enough that `chain-kalman` still leaves a measurable
 * image gap, short enough that its two builds stay well inside a shared CI runner's case timeout.
 * The committed record's full-length input is GF-74 and GF-75's.
 */
const SHORT_EXERCISE: SyntheticOptions = {
  motion: { kind: "exercise" },
  seed: 11,
  durationMs: 4000,
  fps: 30,
};
const SHORT_STILL: SyntheticOptions = { ...RECORD_STILL, durationMs: 4000 };

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
    // The bar says this record shows no gap, not that none exists: at 1.9 times the noise the call
    // is within noise, and a later filler at 1.0 times the noise still ranks as the better one.
    const noise = 10;
    const current = row("chain-kalman", [1.9 * noise]);
    const later = row("hold", [1.0 * noise]);
    expect(judgeGap([current], calibration(noise)).kind).toBe("within-noise");
    expect(bestFiller([current, later]).filler).toBe("hold");
    expect(judgeGap([current, later], calibration(noise))).toEqual({
      kind: "within-noise",
      best: { filler: "hold", errorMean: noise, lostFrames: 0 },
      referenceNoise: noise,
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
    const still = createSyntheticRecording(SHORT_STILL);
    const recording = createSyntheticRecording(SHORT_EXERCISE);
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

  it("GF-79 shares one frozen committed record, so no reader can change another's", () => {
    const record = syntheticComparisonRecord();
    expect(syntheticComparisonRecord()).toBe(record);
    const [image] = record.spaces;
    for (const value of [record, record.spaces, image, image!.filled, image!.filled[0]])
      expect(Object.isFrozen(value)).toBe(true);
    expect(Object.isFrozen(image!.filled[0]!.metrics.positionError)).toBe(true);
    expect(Object.isFrozen(image!.calibration!.detector)).toBe(true);
    expect(Object.isFrozen(record.inn)).toBe(true);
  });

  it("GF-75 the committed record is the regenerated record, byte for byte", () => {
    const generated = formatComparisonRecord(syntheticComparisonRecord());
    // Regenerate with POSE_COMPARISON_WRITE=1 after any change to a filler, the rig or the input.
    if (process.env.POSE_COMPARISON_WRITE === "1") writeRecordBlock(RECORD_PATH, generated);
    const document = readFileSync(RECORD_PATH, "utf8");
    expect(replaceRecordBlock(document, generated)).toBe(document);
  });

  it("GF-76 regenerates only between one begin and one end marker, through a renamed file", () => {
    const block = (body: string) => `${RECORD_BEGIN}\n\n${body}\n\n${RECORD_END}`;
    const document = `# Title\n\n${block("- old")}\n\n## After\n`;
    expect(replaceRecordBlock(document, "- new")).toBe(
      `# Title\n\n${block("- new")}\n\n## After\n`,
    );
    for (const broken of [
      "no markers",
      `${RECORD_BEGIN} only`,
      `${RECORD_END} only`,
      `${RECORD_END}\n${RECORD_BEGIN}`,
      `${block("- a")}\n${block("- b")}`,
      `${RECORD_BEGIN}\n${block("- a")}`,
    ])
      expect(() => replaceRecordBlock(broken, "- new")).toThrow(/marker/);
    const directory = mkdtempSync(join(tmpdir(), "gf-76-"));
    try {
      const path = join(directory, "record.md");
      writeFileSync(path, document);
      writeRecordBlock(path, "- new");
      expect(readFileSync(path, "utf8")).toBe(replaceRecordBlock(document, "- new"));
      expect(readdirSync(directory)).toEqual(["record.md"]);
      writeFileSync(path, "no markers");
      expect(() => writeRecordBlock(path, "- new")).toThrow(/marker/);
      expect(readFileSync(path, "utf8")).toBe("no markers");
      expect(readdirSync(directory)).toEqual(["record.md"]);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("GF-77 keeps any label, newline or overlong file name included, within print width", () => {
    const record = syntheticComparisonRecord();
    const name = `take-${"x".repeat(250)}.json`;
    const text = formatComparisonRecord({ ...record, label: `recording a\nb\r\n\tc ${name}` });
    const lines = text.split("\n");
    for (const line of lines) expect(line.length).toBeLessThanOrEqual(PRINT_WIDTH);
    // The newline in the label is a word break, so the input bullet is one bullet.
    expect(lines[0]).toBe("- Input: recording a b c");
    expect(lines[1]!.startsWith("  ")).toBe(true);
    expect(text.replace(/\n {2}/g, "")).toContain(name);
    const input = lines.slice(0, lines.indexOf(""));
    expect(input.filter((line) => line.startsWith("- "))).toHaveLength(1);
  });
});
