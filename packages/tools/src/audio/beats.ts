import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { basename, dirname, extname, join } from "node:path";
import { fromCaller } from "../page/page";
import { decodeAudio } from "./decode";
import { beatCues, levelCues, type Cue } from "./levels";

const DEFAULT_THRESHOLD = 1.5;
const USAGE =
  "usage: gerak beats <audio.wav|mp3|m4a> [--out file.cues.json] [--threshold n] [--levels name@ms]";

/** Level sampling option parsed from `--levels name@ms`. */
export interface LevelOption {
  readonly name: string;
  readonly everyMs: number;
}

/** What `gerak beats` runs: the audio path, optional output path, onset threshold and level sampling. */
export interface BeatsRequest {
  readonly audio: string;
  readonly out?: string;
  readonly threshold: number;
  readonly levels?: LevelOption;
}

/** Parsed `gerak beats` arguments, or the usage text. */
export type BeatsArgs =
  | ({ readonly kind: "ok" } & BeatsRequest)
  | { readonly kind: "usage"; readonly message: string };

/** Result of `runBeats`: written file and cue counts, or `no-ffmpeg` when ffmpeg is missing. */
export type BeatsResult =
  | {
      readonly kind: "beats";
      readonly path: string;
      readonly beats: number;
      readonly levels: number;
    }
  | { readonly kind: "no-ffmpeg"; readonly message: string };

function parseLevels(raw: string): LevelOption | undefined {
  const match = /^([A-Za-z][\w-]*)@(\d+)$/.exec(raw);
  if (match === null) return undefined;
  const name = match[1];
  const everyMs = Number(match[2]);
  if (name === undefined || !Number.isSafeInteger(everyMs) || everyMs <= 0) return undefined;
  return { name, everyMs };
}

/** Parses `<audio> [--out file] [--threshold n] [--levels name@ms]`, or returns usage text. */
export function parseBeatsArgs(argv: readonly string[]): BeatsArgs {
  const usage = (message: string): BeatsArgs => ({
    kind: "usage",
    message: `${message} ${USAGE}`,
  });
  const positional: string[] = [];
  let out: string | undefined;
  let threshold = DEFAULT_THRESHOLD;
  let levels: LevelOption | undefined;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === undefined) continue;
    if (!arg.startsWith("--")) {
      positional.push(arg);
      continue;
    }
    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) {
      return usage(`${arg} needs a value.`);
    }
    i += 1;
    switch (arg) {
      case "--out":
        out = fromCaller(next);
        break;
      case "--threshold": {
        const parsed = Number(next);
        if (!Number.isFinite(parsed) || parsed <= 0) {
          return usage("--threshold needs a number above 0.");
        }
        threshold = parsed;
        break;
      }
      case "--levels": {
        const parsed = parseLevels(next);
        if (parsed === undefined) {
          return usage("--levels needs name@ms with a positive integer ms.");
        }
        levels = parsed;
        break;
      }
      default:
        return usage(`Unknown flag ${arg}.`);
    }
  }

  if (positional.length !== 1 || positional[0] === undefined) {
    return usage("Needs one audio file.");
  }

  return {
    kind: "ok",
    audio: fromCaller(positional[0]),
    threshold,
    ...(out === undefined ? {} : { out }),
    ...(levels === undefined ? {} : { levels }),
  };
}

function defaultOutPath(audioPath: string): string {
  return join(dirname(audioPath), `${basename(audioPath, extname(audioPath))}.cues.json`);
}

function sortCues(beats: readonly Cue[], levels: readonly Cue[]): readonly Cue[] {
  const tagged: { readonly cue: Cue; readonly isBeat: boolean }[] = [
    ...beats.map((cue) => ({ cue, isBeat: true })),
    ...levels.map((cue) => ({ cue, isBeat: false })),
  ];
  tagged.sort((a, b) => {
    if (a.cue.at !== b.cue.at) return a.cue.at - b.cue.at;
    if (a.isBeat !== b.isBeat) return a.isBeat ? -1 : 1;
    return 0;
  });
  return tagged.map((entry) => entry.cue);
}

/** Decodes `request.audio`, extracts beat and optional level cues, and writes them as JSON. */
export function runBeats(request: BeatsRequest): BeatsResult {
  if (spawnSync("ffmpeg", ["-version"]).status !== 0) {
    return {
      kind: "no-ffmpeg",
      message: "gerak beats needs ffmpeg on the PATH: https://ffmpeg.org/download.html",
    };
  }
  const decoded = decodeAudio(request.audio);
  const beats = beatCues(decoded.samples, decoded.sampleRate, request.threshold);
  const levels =
    request.levels === undefined
      ? []
      : levelCues(decoded.samples, decoded.sampleRate, request.levels.everyMs, request.levels.name);
  const cues = sortCues(beats, levels);
  const path = request.out ?? defaultOutPath(request.audio);
  writeFileSync(path, `${JSON.stringify(cues, null, 2)}\n`);
  return {
    kind: "beats",
    path,
    beats: beats.length,
    levels: levels.length,
  };
}
