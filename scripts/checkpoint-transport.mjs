#!/usr/bin/env node
// Checkpoint transport: plan, verify and localize the bytes a model carries into a contents-API
// write. Contract: ADR-104 and the transport rule in AGENTS.md.
// Tests: packages/core/test/unit/scripts/checkpoint-transport.test.ts.
// The core is pure; the CLI below it only reads files, prints, and sets the exit status.
import { lstat, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { blobSha } from "./automation-report.mjs";
import {
  CHECKPOINT_ROOT,
  HUNK_HEADER,
  checkpointDirectory,
  checkpointStore,
  parsePatch,
  patchDigest,
  reconcilePatch,
  sealedRequest,
} from "./checkpoint-policy.mjs";

/**
 * The closed set of transport hazards, in the order a line carrying several of them lists them.
 * Every kind is a byte shape a language model was measured normalising while re-emitting a file
 * into a JSON string argument, on #477 or in the issue that followed it, #478.
 */
export const HAZARD_KINDS = Object.freeze([
  "whitespace-only-line",
  "adjacent-to-hunk-header",
  "trailing-whitespace",
  "final-line",
  "non-ascii",
  "backtick-span",
]);

/** The closed set of answers `verify` gives for one path. */
export const VERDICT_KINDS = Object.freeze(["match", "mismatch", "absent", "stray", "unsealed"]);

const MANIFEST = "manifest.json";
const BLOB = /^[0-9a-f]{40}$/;
const WHITESPACE_ONLY = /^[ \t]+$/;
const TRAILING_WHITESPACE = /[ \t]+$/;
const NON_ASCII = /[^\x00-\x7f]/u;
const BACKTICK = "`";
const LF = 0x0a;
const CR = "\r";
// Fatal, so an invalid byte is refused rather than read as U+FFFD, which would hide it from the
// map and make two different bytes look alike. A BOM is kept, so it is mapped as non-ASCII.
const UTF8 = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true });
const USAGE = [
  "usage: node scripts/checkpoint-transport.mjs plan <store-dir>",
  "       node scripts/checkpoint-transport.mjs verify <store-dir> <path>=<blob-id>...",
  "       node scripts/checkpoint-transport.mjs localize <expected-file> <observed-file>",
].join("\n");

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

/**
 * The exhaustive sink for a closed union read by a switch. The declaration file types `value` as
 * `never` for a TypeScript caller; at run time it is reached only by a value that crossed the type
 * boundary, and it refuses that value by name instead of reading it as some other member.
 */
function unreachable(value, union) {
  throw new TypeError(`Unhandled ${union}: ${JSON.stringify(value)}`);
}

/** Lines as a reader numbers them: split on LF, and a terminating LF opens no further line. */
function lines(text) {
  if (text.length === 0) return [];
  const split = text.split("\n");
  if (text.endsWith("\n")) split.pop();
  return split;
}

function codePoints(line) {
  const seen = [];
  for (const character of line) {
    const point = character.codePointAt(0);
    if (point > 0x7f && !seen.includes(point)) seen.push(point);
  }
  return seen;
}

function backticks(line) {
  return line.split(BACKTICK).length - 1;
}

/**
 * A store file as the text its hazard map is read from. The map describes lines, so it is stated
 * only over bytes that are lines: invalid UTF-8 has no line a transcriber could be told about, and
 * a CR would let a CRLF line that is one space and a CR slip past every whitespace hazard. Both are
 * refused by name instead of being mapped wrongly. `file` names the subject in the refusal.
 */
function transportText(bytes, file) {
  let text;
  try {
    text = UTF8.decode(bytes);
  } catch {
    throw new Error(`${JSON.stringify(file)} is not valid UTF-8, so no line map can describe it`);
  }
  const at = text.indexOf(CR);
  ensure(
    at === -1,
    `${JSON.stringify(file)} carries a CR on line ${lines(text.slice(0, at + 1)).length}; ` +
      "a store file is LF text",
  );
  return text;
}

/** Every hazard in one file, ordered by line and then by `HAZARD_KINDS`. */
export function transportHazards(bytes, file = "the file") {
  const text = transportText(Buffer.from(bytes), file);
  const numbered = lines(text);
  const hazards = [];
  numbered.forEach((content, index) => {
    const line = index + 1;
    const whitespaceOnly = WHITESPACE_ONLY.test(content);
    if (whitespaceOnly) hazards.push({ kind: "whitespace-only-line", line, bytes: content });
    if (index > 0 && HUNK_HEADER.test(numbered[index - 1] ?? ""))
      hazards.push({ kind: "adjacent-to-hunk-header", line });
    // A whitespace-only line is wholly trailing whitespace; naming it twice says less, not more.
    if (!whitespaceOnly && TRAILING_WHITESPACE.test(content))
      hazards.push({ kind: "trailing-whitespace", line });
    if (line === numbered.length)
      hazards.push({ kind: "final-line", line, bytes: content, newline: text.endsWith("\n") });
    if (NON_ASCII.test(content))
      hazards.push({ kind: "non-ascii", line, codePoints: codePoints(content) });
    const count = backticks(content);
    if (count > 0) hazards.push({ kind: "backtick-span", line, count });
  });
  return hazards;
}

/** One file as the transport has to carry it: where it goes and what it must hash to on arrival. */
export function transportFile(file, bytes) {
  const content = Buffer.from(bytes);
  return {
    path: file,
    size: content.length,
    blob: blobSha(content),
    sha256: patchDigest(content),
    hazards: transportHazards(content, file),
  };
}

function required(files, name) {
  const content = files.get(name);
  ensure(content !== undefined, `${JSON.stringify(name)} is declared but absent from the store`);
  return content;
}

/**
 * The push plan for a store whose manifest `sealedRequest` has already validated: the patches in
 * declared order and the manifest last, because the manifest is the seal and its push starts the
 * run. A patch whose bytes disagree with its declared digest, or that the preparation parser would
 * refuse or find disagreeing with its manifest entry, is refused here, since carrying it would only
 * move the same refusal to a preparation run and spend a round trip on the way.
 */
export function transportPlan(manifest, files) {
  const directory = checkpointDirectory(manifest);
  const planned = manifest.patches.map((patch) => {
    const content = required(files, patch.file);
    ensure(
      patchDigest(content) === patch.sha256,
      `${JSON.stringify(patch.file)} does not match its declared SHA-256; the local store is not ` +
        "the store its manifest seals, so repair it before transporting anything",
    );
    const file = `${directory}/${patch.file}`;
    reconcilePatch(parsePatch(transportText(content, file), manifest.allow), patch);
    return transportFile(file, content);
  });
  const seal = transportFile(`${directory}/${MANIFEST}`, required(files, MANIFEST));
  return { checkpoint: manifest.checkpoint, files: [...planned, seal] };
}

/** One hazard as one line of the plan, stated so a transcriber can check it without the source. */
export function renderHazard(hazard) {
  switch (hazard.kind) {
    case "whitespace-only-line":
      return `line ${hazard.line}: whitespace only, exactly ${JSON.stringify(hazard.bytes)}`;
    case "adjacent-to-hunk-header":
      return `line ${hazard.line}: follows a hunk header; its own line, never the header's tail`;
    case "trailing-whitespace":
      return `line ${hazard.line}: ends in whitespace that must survive`;
    case "final-line":
      return (
        `line ${hazard.line}: the final line, exactly ${JSON.stringify(hazard.bytes)}, ` +
        (hazard.newline ? "then exactly one LF and nothing after it" : "with no LF after it")
      );
    case "non-ascii":
      return `line ${hazard.line}: non-ASCII ${hazard.codePoints
        .map((point) => `U+${point.toString(16).toUpperCase().padStart(4, "0")}`)
        .join(" ")}`;
    case "backtick-span":
      return `line ${hazard.line}: ${hazard.count} backtick${hazard.count === 1 ? "" : "s"}`;
    default:
      return unreachable(hazard, "transport hazard");
  }
}

/**
 * The plan as markdown for a file outside the store. It is printed rather than written, because no
 * default location inside a mirror is safe: the store must hold exactly its manifest and patches,
 * and a stray file under `.ai/checkpoints/` refuses every later checkpoint.
 */
export function renderPlan(plan) {
  const out = [
    `# Transport plan for ${plan.checkpoint}`,
    "",
    "Push in this order, one file per `create_or_update_file` call, the manifest last. After every",
    "write, compare the returned `content.sha` with the blob id below. A mismatch stops the push:",
    "do not write the next file, do not push the manifest, and do not report success. Before the",
    "manifest, list the store at the branch head and run `verify` over every observed id.",
  ];
  plan.files.forEach((file, index) => {
    out.push("", `## ${index + 1}. ${file.path}`, "");
    out.push(`- Bytes: ${file.size}`, `- Git blob id: ${file.blob}`, `- SHA-256: ${file.sha256}`);
    out.push(`- Hazards: ${file.hazards.length}`);
    file.hazards.forEach((hazard, at) => out.push(`  ${at + 1}. ${renderHazard(hazard)}`));
  });
  return `${out.join("\n")}\n`;
}

/** Observed ids as `path=blob`; a bare file name is read as a file of the planned store. */
export function parseObservation(argument, checkpoint) {
  const at = typeof argument === "string" ? argument.lastIndexOf("=") : -1;
  ensure(at > 0, `${JSON.stringify(argument)} is not <path>=<blob-id>`);
  const named = argument.slice(0, at);
  const blob = argument.slice(at + 1);
  ensure(BLOB.test(blob), `${JSON.stringify(blob)} is not a full 40-character lowercase blob id`);
  const file = named.includes("/") ? named : `${CHECKPOINT_ROOT}/${checkpoint}/${named}`;
  return { path: file, blob };
}

/**
 * One verdict per planned path plus one per stray observation. The manifest is pushed last, so its
 * absence before the seal is `unsealed` rather than `absent`: the listing that gates the manifest
 * push is taken while it is legitimately missing, and calling that a failure would make the gate
 * unpassable at the only moment it is asked.
 */
export function transportVerdicts(plan, observations) {
  const observed = new Map();
  for (const observation of observations) {
    ensure(
      !observed.has(observation.path),
      `${JSON.stringify(observation.path)} is observed twice`,
    );
    observed.set(observation.path, observation.blob);
  }
  const verdicts = plan.files.map((file) => {
    const blob = observed.get(file.path);
    if (blob === undefined)
      return file.path.endsWith(`/${MANIFEST}`)
        ? { kind: "unsealed", path: file.path, expected: file.blob }
        : { kind: "absent", path: file.path, expected: file.blob };
    return blob === file.blob
      ? { kind: "match", path: file.path, blob }
      : { kind: "mismatch", path: file.path, expected: file.blob, observed: blob };
  });
  const planned = new Set(plan.files.map((file) => file.path));
  for (const [file, blob] of observed)
    if (!planned.has(file)) verdicts.push({ kind: "stray", path: file, observed: blob });
  return verdicts;
}

/** Whether a verdict lets the push continue. */
export function verdictPasses(verdict) {
  switch (verdict.kind) {
    case "match":
    case "unsealed":
      return true;
    case "mismatch":
    case "absent":
    case "stray":
      return false;
    default:
      return unreachable(verdict, "transport verdict");
  }
}

export function renderVerdict(verdict) {
  switch (verdict.kind) {
    case "match":
      return `match     ${verdict.path} ${verdict.blob}`;
    case "mismatch":
      return (
        `mismatch  ${verdict.path} expected ${verdict.expected}, observed ${verdict.observed}; ` +
        "re-write it and run localize against the remote bytes"
      );
    case "absent":
      return `absent    ${verdict.path} expected ${verdict.expected}; it has not been written`;
    case "stray":
      return `stray     ${verdict.path} ${verdict.observed}; the store refuses it, so delete it`;
    case "unsealed":
      return `unsealed  ${verdict.path} expected ${verdict.expected}; push it last`;
    default:
      return unreachable(verdict, "transport verdict");
  }
}

/** Lines with their terminators, as bytes, so a lost or extra final LF is itself a difference. */
function segments(bytes) {
  const out = [];
  let start = 0;
  for (let index = 0; index < bytes.length; index += 1)
    if (bytes[index] === LF) {
      out.push({ offset: start, bytes: bytes.subarray(start, index + 1) });
      start = index + 1;
    }
  if (start < bytes.length) out.push({ offset: start, bytes: bytes.subarray(start) });
  return out;
}

function shown(segment) {
  return segment === undefined ? null : Buffer.from(segment.bytes);
}

/** The first line on which two files differ, since "which line" is always the question. */
export function transportDifference(expected, observed) {
  const left = segments(Buffer.from(expected));
  const right = segments(Buffer.from(observed));
  for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
    const a = left[index];
    const b = right[index];
    if (a !== undefined && b !== undefined && a.bytes.equals(b.bytes)) continue;
    return {
      kind: "differs",
      line: index + 1,
      offset: (a ?? b).offset,
      expected: shown(a),
      observed: shown(b),
    };
  }
  return { kind: "identical" };
}

const ESCAPES = new Map([
  [0x22, '\\"'],
  [0x5c, "\\\\"],
  [0x09, "\\t"],
  [0x0a, "\\n"],
  [0x0d, "\\r"],
]);

const hex = (value, width) => value.toString(16).toUpperCase().padStart(width, "0");

/** The length of the valid UTF-8 sequence starting at `at`, or 0 when the byte there starts none. */
function sequence(bytes, at) {
  const lead = bytes[at];
  const width = lead >= 0xf0 ? 4 : lead >= 0xe0 ? 3 : lead >= 0xc0 ? 2 : 1;
  if (lead >= 0x80 && width === 1) return 0;
  if (at + width > bytes.length) return 0;
  try {
    UTF8.decode(bytes.subarray(at, at + width));
    return width;
  } catch {
    return 0;
  }
}

/**
 * One side of a difference, quoted and byte-safe. Printable ASCII stands for itself; quote,
 * backslash, tab, LF and CR take their usual escapes; any other control byte and any byte that
 * starts no valid UTF-8 sequence is `\xNN`, so two different invalid bytes never render alike;
 * and a valid non-ASCII character is `\u{N}`, so a no-break space or a curly quote cannot pass for
 * the ASCII it resembles. A `\xNN` at or above 80 is therefore always an invalid byte.
 */
function escaped(side) {
  if (side === null) return "<end of file>";
  let out = "";
  let at = 0;
  while (at < side.length) {
    const byte = side[at];
    const width = sequence(side, at);
    if (width === 0) {
      out += `\\x${hex(byte, 2)}`;
      at += 1;
    } else if (width > 1) {
      out += `\\u{${hex(UTF8.decode(side.subarray(at, at + width)).codePointAt(0), 4)}}`;
      at += width;
    } else {
      out +=
        ESCAPES.get(byte) ??
        (byte < 0x20 || byte === 0x7f ? `\\x${hex(byte, 2)}` : String.fromCharCode(byte));
      at += 1;
    }
  }
  return `"${out}"`;
}

export function renderDifference(difference) {
  switch (difference.kind) {
    case "identical":
      return "identical";
    case "differs":
      return [
        `line ${difference.line} (byte ${difference.offset}) differs`,
        `  expected: ${escaped(difference.expected)}`,
        `  observed: ${escaped(difference.observed)}`,
      ].join("\n");
    default:
      return unreachable(difference, "transport difference");
  }
}

function entryType(stat) {
  if (stat.isFile()) return "blob";
  if (stat.isDirectory()) return "tree";
  return "other";
}

/**
 * Reads a local store through the same owner both verifiers use, so the file-name rule, the
 * regular-file rule, the per-file transport bound, and the exact manifest-plus-patches set cannot
 * drift between planning a push and refusing one.
 */
export async function readStore(directory) {
  const id = path.basename(path.resolve(directory));
  const names = (await readdir(directory)).sort();
  const entries = [];
  for (const name of names) {
    const stat = await lstat(path.join(directory, name));
    const executable = (stat.mode & 0o111) !== 0;
    entries.push({
      path: `${CHECKPOINT_ROOT}/${id}/${name}`,
      type: entryType(stat),
      mode: stat.isFile() && !executable ? "100644" : "100755",
      size: stat.size,
    });
  }
  const store = checkpointStore(entries);
  const files = new Map();
  for (const name of names) files.set(name, await readFile(path.join(directory, name)));
  let value;
  try {
    value = JSON.parse(required(files, MANIFEST).toString("utf8"));
  } catch (error) {
    throw new Error(`${MANIFEST} is not JSON: ${error.message}`);
  }
  return { manifest: sealedRequest(value, store), files };
}

async function planOf(directory) {
  const { manifest, files } = await readStore(directory);
  return transportPlan(manifest, files);
}

/** The CLI. Exit 0 is success, 1 is a transport failure, 2 is a refused invocation. */
export async function main(argv, io = console) {
  const [command, ...rest] = argv;
  try {
    switch (command) {
      case "plan": {
        ensure(rest.length === 1, USAGE);
        io.log(renderPlan(await planOf(rest[0])).trimEnd());
        return 0;
      }
      case "verify": {
        ensure(rest.length >= 2, USAGE);
        const plan = await planOf(rest[0]);
        const verdicts = transportVerdicts(
          plan,
          rest.slice(1).map((argument) => parseObservation(argument, plan.checkpoint)),
        );
        for (const verdict of verdicts) io.log(renderVerdict(verdict));
        return verdicts.every(verdictPasses) ? 0 : 1;
      }
      case "localize": {
        ensure(rest.length === 2, USAGE);
        const difference = transportDifference(await readFile(rest[0]), await readFile(rest[1]));
        io.log(renderDifference(difference));
        return difference.kind === "identical" ? 0 : 1;
      }
      default:
        throw new Error(USAGE);
    }
  } catch (error) {
    io.error(error.message);
    return 2;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url))
  process.exitCode = await main(process.argv.slice(2));
