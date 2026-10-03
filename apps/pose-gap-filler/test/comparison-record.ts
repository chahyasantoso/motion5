import { readFileSync, renameSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { calibrateSpaces } from "../src/replay/compare";
import { buildComparisonRecord, type ComparisonRecord } from "../src/replay/record";
import {
  SYNTHETIC_TAKES,
  createSyntheticRecording,
  type SyntheticOptions,
} from "../src/replay/synthetic";
import { createRigSolver } from "../src/rig/solver";
import { fakePorts } from "./engine";

/**
 * The committed record's input, the one owner of what `docs/POSE-GAP-FILLER-COMPARISON.md`
 * measured: a still take the detector and the noise floor are calibrated on, and an exercise take
 * every filler is replayed over. Both are `SYNTHETIC_TAKES`, which the live synthetic source plays.
 */
export const RECORD_STILL: SyntheticOptions = SYNTHETIC_TAKES.still;
export const RECORD_EXERCISE: SyntheticOptions = SYNTHETIC_TAKES.exercise;

export const RECORD_PATH = fileURLToPath(
  new URL("../../../docs/POSE-GAP-FILLER-COMPARISON.md", import.meta.url),
);
export const RECORD_BEGIN = "<!-- comparison-record:begin -->";
export const RECORD_END = "<!-- comparison-record:end -->";

const describeTake = (options: SyntheticOptions) =>
  `${options.motion.kind} seed ${options.seed}, ${options.durationMs} ms at ${options.fps} fps`;

let committed: ComparisonRecord | undefined;

/** Freezes `value` and everything it reaches, so a shared value cannot carry one reader's edit. */
function deepFreeze<T>(value: T): T {
  if (typeof value === "object" && value !== null && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}

/**
 * The committed record, regenerated: the live defaults, a fresh Engine rig per row. It is a pure
 * function of the frozen input above and the record is plain data, so one build per test module,
 * frozen deep so no reader can change another's, serves every reader; each build replays twelve
 * rows over 360 frames, which a shared CI runner cannot afford twice inside one case's timeout
 * (#538 run 36958413903, GF-73).
 */
export function syntheticComparisonRecord(): ComparisonRecord {
  if (committed !== undefined) return committed;
  const calibrations = calibrateSpaces(createSyntheticRecording(RECORD_STILL));
  const take = describeTake(RECORD_EXERCISE);
  const still = describeTake(RECORD_STILL);
  committed = deepFreeze(
    buildComparisonRecord({
      label: `synthetic ${take}, calibrated on synthetic ${still}`,
      recording: createSyntheticRecording(RECORD_EXERCISE),
      stabilizer: "one-euro",
      calibrationFor: (space) => calibrations[space.kind],
      createSolver: (space) => createRigSolver(fakePorts(), space),
    }),
  );
  return committed;
}

/** Index of the only occurrence of `marker` in `document`; anything but exactly one throws. */
function onlyIndex(document: string, marker: string): number {
  const index = document.indexOf(marker);
  if (index === -1 || document.indexOf(marker, index + 1) !== -1)
    throw new Error(`The record document needs exactly one ${marker} marker.`);
  return index;
}

/**
 * `document` with its generated block replaced by `generated`. Refuses, never guesses, unless the
 * document has exactly one begin marker followed by exactly one end marker.
 */
export function replaceRecordBlock(document: string, generated: string): string {
  const begin = onlyIndex(document, RECORD_BEGIN);
  const end = onlyIndex(document, RECORD_END);
  if (end < begin) throw new Error("The record's end marker precedes its begin marker.");
  return `${document.slice(0, begin)}${RECORD_BEGIN}\n\n${generated}\n\n${document.slice(end)}`;
}

/**
 * Regenerates the committed block in place, atomically: the whole document is written to a
 * sibling temporary file and renamed over the original, so an interrupted run leaves either the
 * old document or the new one, never a truncated record.
 */
export function writeRecordBlock(path: string, generated: string): void {
  const next = replaceRecordBlock(readFileSync(path, "utf8"), generated);
  const temporary = `${path}.${process.pid}.tmp`;
  writeFileSync(temporary, next);
  renameSync(temporary, path);
}
