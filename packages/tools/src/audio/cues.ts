import { readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join } from "node:path";
import { fromCaller } from "../page/page";
import { captionCues, parseCaptions, type CaptionFormat } from "./captions";

const DEFAULT_NAME = "word";
const NAME_PATTERN = /^[A-Za-z][\w-]*$/;
const USAGE =
  "usage: gerak cues <captions.srt|.vtt|whisper.json> [--out file.cues.json] [--name word]";

/** What `gerak cues` runs: input file, format, cue name and optional output path. */
export interface CuesRequest {
  readonly captions: string;
  readonly format: CaptionFormat;
  readonly name: string;
  readonly out?: string;
}

/** Parsed `gerak cues` arguments, or the usage text. */
export type CuesArgs =
  | ({ readonly kind: "ok" } & CuesRequest)
  | { readonly kind: "usage"; readonly message: string };

/** Result of `runCues`: written cue and word files, or an unreadable error. */
export type CuesResult =
  | {
      readonly kind: "cues";
      readonly path: string;
      readonly words: string;
      readonly count: number;
      readonly timing: "word" | "line";
    }
  | { readonly kind: "unreadable"; readonly message: string };

function formatForPath(filePath: string): CaptionFormat | undefined {
  switch (extname(filePath).toLowerCase()) {
    case ".srt":
      return "srt";
    case ".vtt":
      return "vtt";
    case ".json":
      return "whisper";
    default:
      return undefined;
  }
}

/** Parses `<captions> [--out file] [--name word]`, or returns usage text. */
export function parseCuesArgs(argv: readonly string[]): CuesArgs {
  const usage = (message: string): CuesArgs => ({
    kind: "usage",
    message: `${message} ${USAGE}`,
  });
  const positional: string[] = [];
  let out: string | undefined;
  let name = DEFAULT_NAME;

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
      case "--name":
        if (!NAME_PATTERN.test(next)) {
          return usage("--name must match ^[A-Za-z][\\w-]*$.");
        }
        name = next;
        break;
      default:
        return usage(`Unknown flag ${arg}.`);
    }
  }

  if (positional.length !== 1 || positional[0] === undefined) {
    return usage("Needs one captions file.");
  }

  const captions = fromCaller(positional[0]);
  const format = formatForPath(captions);
  if (format === undefined) {
    return usage("Captions file must end in .srt, .vtt, or .json.");
  }

  return {
    kind: "ok",
    captions,
    format,
    name,
    ...(out === undefined ? {} : { out }),
  };
}

function defaultOutPath(captionsPath: string): string {
  return join(dirname(captionsPath), `${basename(captionsPath, extname(captionsPath))}.cues.json`);
}

function wordsOutPath(cuesPath: string): string {
  if (cuesPath.endsWith(".cues.json")) {
    return `${cuesPath.slice(0, -".cues.json".length)}.words.json`;
  }
  return `${cuesPath}.words.json`;
}

/** Reads `request.captions`, parses it, and writes the cues and words JSON files. */
export function runCues(request: CuesRequest): CuesResult {
  let content: string;
  try {
    content = readFileSync(request.captions, "utf8");
  } catch (error) {
    return {
      kind: "unreadable",
      message: error instanceof Error ? error.message : String(error),
    };
  }

  const parsed = parseCaptions(request.format, content);
  if (parsed.kind === "unreadable") {
    return parsed;
  }

  const { cues, words } = captionCues(parsed.items, request.name);
  const path = request.out ?? defaultOutPath(request.captions);
  const wordsPath = wordsOutPath(path);
  writeFileSync(path, `${JSON.stringify(cues, null, 2)}\n`);
  writeFileSync(wordsPath, `${JSON.stringify(words, null, 2)}\n`);
  return {
    kind: "cues",
    path,
    words: wordsPath,
    count: cues.length,
    timing: parsed.timing,
  };
}
