import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const SOURCE_UNDER_SRC = /(^|\/)src\/.*\.tsx?$/;
const BASELINE_PATH = "scripts/comment-baseline.json";
export const MAX_COMMENT_LINES = 3;
export const MAX_COMMENT_CHARS = 200;

/**
 * What a comment may not say, and how long it may be.
 *
 * `phase`, `slice` and `until` are spelled here as process references rather than as words. The
 * tree carries 129 comment lines saying `phase` and 51 saying `until`, and almost all of them
 * describe the runtime's own lifecycle or a temporal bound: only sixteen name a plan phase, and the
 * history form of `until` names the change that ended it, which the issue-number rule already
 * refuses. A rule that refuses the domain vocabulary gets routed around.
 */
export const RULES = [
  { id: "issue-number", pattern: /#\d+/, reason: "cites an issue or pull request" },
  { id: "decision-record", pattern: /ADR-\d+/, reason: "cites a decision record" },
  { id: "issue-word", pattern: /\bissue\b/i, reason: "names a process reference" },
  { id: "phase-label", pattern: /\bphase\s*\d+\b/i, reason: "names a plan phase" },
  {
    id: "slice-label",
    pattern: /\bslice\s*\d+\b|(?:this|that)\s+slice\b/i,
    reason: "names a plan slice",
  },
  {
    id: "history-word",
    pattern: /\b(?:previously|no longer)\b/i,
    reason: "records history rather than behaviour",
  },
];

/**
 * The comment blocks of one source, each with the line it starts on.
 *
 * Comment-only lines and block comments, so a string holding two slashes is never read as a
 * comment: telling that apart would mean lexing strings and regular expressions, and a comment
 * trailing a statement explains the statement it sits on.
 */
export function commentBlocks(source) {
  const lines = source.split("\n");
  const blocks = [];
  let run = null;
  let inBlock = false;
  const flush = () => {
    if (run !== null) blocks.push(run);
    run = null;
  };
  for (const [index, line] of lines.entries()) {
    const text = line.trim();
    if (inBlock) {
      run.lines.push(line);
      if (text.includes("*/")) {
        inBlock = false;
        flush();
      }
      continue;
    }
    if (text.startsWith("/*")) {
      run = { start: index + 1, lines: [line] };
      if (text.includes("*/")) flush();
      else inBlock = true;
      continue;
    }
    if (text.startsWith("//")) {
      if (run === null) run = { start: index + 1, lines: [] };
      run.lines.push(line);
      continue;
    }
    flush();
  }
  flush();
  return blocks;
}

/** How one block breaks the rules: at most one finding per rule, plus the two size bounds. */
export function blockViolations(block) {
  const found = [];
  if (block.lines.length > MAX_COMMENT_LINES)
    found.push(`${block.lines.length} lines, over the ${MAX_COMMENT_LINES} allowed`);
  const chars = block.lines.join("\n").length;
  if (chars > MAX_COMMENT_CHARS) found.push(`${chars} characters, over ${MAX_COMMENT_CHARS}`);
  for (const rule of RULES)
    if (block.lines.some((line) => rule.pattern.test(line))) found.push(rule.reason);
  return found;
}

export function violationsOf(source) {
  return commentBlocks(source).flatMap((block) =>
    blockViolations(block).map((detail) => `line ${block.start}: comment ${detail}`),
  );
}

export function readBaseline(scanRoot = root) {
  const text = readFileSync(join(scanRoot, BASELINE_PATH), "utf8");
  return new Map(JSON.parse(text).map((entry) => [entry.path, entry.count]));
}

/**
 * Whether the tree is inside its baseline, which may only ever be lower.
 *
 * A file over its count is a new violation. A file under it is a stale entry: a baseline nobody
 * corrects when the violations leave stops describing the tree and becomes the thing people route
 * around rather than the debt being paid down.
 */
export function checkBaseline(counts, baseline) {
  const violations = [];
  for (const [path, count] of counts) {
    const allowed = baseline.get(path);
    if (allowed === undefined) {
      if (count > 0) violations.push(`${path}: ${count} violations and no baseline entry`);
      continue;
    }
    if (count > allowed)
      violations.push(`${path}: ${count} violations is over its baseline of ${allowed}`);
    if (count < allowed)
      violations.push(`${path}: ${count} violations is under its baseline of ${allowed}, lower it`);
  }
  for (const [path, allowed] of baseline)
    if (!counts.has(path)) violations.push(`${path}: baseline entry of ${allowed} names no source`);
  return violations;
}

export function trackedSources(scanRoot = root) {
  const listed = spawnSync("git", ["ls-files"], { cwd: scanRoot, encoding: "utf8" });
  if (listed.status !== 0) return [];
  return listed.stdout.split(/\r?\n/).filter((path) => SOURCE_UNDER_SRC.test(path));
}

/**
 * Every finding the baseline does not already hold, with the detail of each file that crossed it.
 *
 * The baseline is what makes this a ratchet rather than a report: a violation inside a file's
 * recorded count is history being paid down elsewhere, and a count that crossed it is the new one.
 */
export function scan(scanRoot = root) {
  const found = new Map();
  for (const path of trackedSources(scanRoot))
    found.set(path, violationsOf(readFileSync(join(scanRoot, path), "utf8")));
  const counts = new Map([...found].map(([path, details]) => [path, details.length]));
  const violations = [];
  for (const message of checkBaseline(counts, readBaseline(scanRoot))) {
    const path = message.split(":")[0];
    violations.push(message, ...(found.get(path) ?? []));
  }
  const total = [...counts.values()].reduce((sum, count) => sum + count, 0);
  return { violations, total, files: [...counts.values()].filter((count) => count > 0).length };
}

export function main(scanRoot = root) {
  const { violations, total, files } = scan(scanRoot);
  if (violations.length > 0) {
    console.error(violations.join("\n"));
    return 1;
  }
  console.log(`comment scan passed: baseline holds ${total} violations across ${files} files`);
  return 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) process.exitCode = main();
