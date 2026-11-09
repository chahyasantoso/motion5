import { spawnSync } from "node:child_process";
import { existsSync, lstatSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
/** The one section that names what a cold reader has to open before editing anything. */
const READ_FIRST_HEADING = /^## Read these first, in this order[ \t]*$/m;
const LOCAL_MARKDOWN_LINK = /\]\((\.?\/?[\w./-]*\.md)(?:#[\w.-]+)?\)/g;
const UNDER_AN_SRC = /(^|\/)src\/.*\.tsx?$/;
const CACHE_PATH = "scripts/repo-metrics.test-output.json";
const TEST_COMMAND = "npm test";
const NEWLINE_BYTES = 1;
const MAX_LISTING = 64 * 1024 * 1024;
const CHECK_IGNORE_NONE_MATCHED = 1;

/** Bytes one file costs a reader, and zero when the tree does not hold it. */
export function bytesOf(path) {
  if (!existsSync(path)) return 0;
  return Buffer.byteLength(readFileSync(path, "utf8"));
}

/**
 * Every path a reader must open before they can edit, AGENTS.md first.
 *
 * Links outside the read-first section are on-demand reads and are deliberately absent, so this
 * falls when a mandatory doc becomes optional as well as when its prose is trimmed.
 */
export function alwaysReadPaths(agentsSource) {
  const start = agentsSource.search(READ_FIRST_HEADING);
  const section = start < 0 ? "" : agentsSource.slice(start).split("\n## ")[0];
  const paths = new Set(["AGENTS.md"]);
  for (const match of section.matchAll(LOCAL_MARKDOWN_LINK)) {
    const path = match[1].replace(/^\.\//, "");
    if (!path.includes("://")) paths.add(path);
  }
  return [...paths];
}

/**
 * Bytes spent on comments, counted per line rather than per token.
 *
 * A comment line is one that opens with two slashes, or one carried by an open block comment. A
 * comment trailing a statement is not counted, because finding one means lexing strings and
 * regular expressions to know whether the slashes opened a comment at all.
 */
export function commentBytes(source) {
  const lines = source.split("\n");
  let total = 0;
  let inBlock = false;
  for (const [index, line] of lines.entries()) {
    const text = line.trim();
    const opens = !inBlock && (text.startsWith("//") || text.startsWith("/*"));
    if (!inBlock && !opens) continue;
    if (opens) inBlock = text.startsWith("/*") && !text.includes("*/");
    const terminator = index + 1 < lines.length ? NEWLINE_BYTES : 0;
    total += Buffer.byteLength(line) + terminator;
    if (inBlock && text.includes("*/")) inBlock = false;
  }
  return total;
}

/** Tracked files, in the forward-slash form git reports and every metric below matches on. */
export function trackedFiles(repoRoot = root) {
  const listed = spawnSync("git", ["ls-files"], { cwd: repoRoot, encoding: "utf8" });
  if (listed.status !== 0) return [];
  return listed.stdout.split(/\r?\n/).filter((path) => path.length > 0);
}

function sumBytes(paths, repoRoot, sizeOf) {
  return paths.reduce((total, path) => total + sizeOf(join(repoRoot, path)), 0);
}

function git(args, repoRoot, input) {
  return spawnSync("git", args, { cwd: repoRoot, encoding: "utf8", input, maxBuffer: MAX_LISTING });
}

/** Paths a default ripgrep search opens: no dot paths, and nothing `.gitignore` or `.ignore` hides. */
export function searchablePaths(repoRoot = root) {
  const listed = git(["ls-files", "-z", "-c", "-o", "--exclude-standard"], repoRoot);
  if (listed.status !== 0) return [];
  const paths = [...new Set(listed.stdout.split("\0"))].filter(
    (path) => path.length > 0 && !path.split("/").some((part) => part.startsWith(".")),
  );
  const ignoreFile = join(repoRoot, ".ignore").replaceAll("\\", "/");
  const checked = git(
    ["-c", `core.excludesFile=${ignoreFile}`, "check-ignore", "-z", "--no-index", "--stdin"],
    repoRoot,
    paths.join("\0"),
  );
  if (checked.status !== 0 && checked.status !== CHECK_IGNORE_NONE_MATCHED) return [];
  const ignored = new Set(checked.stdout.split("\0"));
  return paths.filter((path) => !ignored.has(path));
}

/** Bytes a default search reads; a file holding a NUL counts as binary and costs nothing. */
export function searchBytes(repoRoot = root) {
  return sumBytes(searchablePaths(repoRoot), repoRoot, (path) => {
    if (!existsSync(path) || !lstatSync(path).isFile()) return 0;
    const contents = readFileSync(path);
    return contents.includes(0) ? 0 : contents.length;
  });
}

export function readCachedTestOutput(repoRoot = root) {
  const cache = join(repoRoot, CACHE_PATH);
  if (!existsSync(cache)) return undefined;
  return JSON.parse(readFileSync(cache, "utf8")).testOutputBytes;
}

/**
 * The five numbers, and why the test output is read rather than run.
 *
 * `npm test` costs tens of seconds, so a command worth running before and after every slice keeps
 * that one measurement in a committed cache and re-runs the suite only when asked with `--test`.
 */
export function measure(repoRoot = root) {
  const agentsPath = join(repoRoot, "AGENTS.md");
  const paths = existsSync(agentsPath) ? alwaysReadPaths(readFileSync(agentsPath, "utf8")) : [];
  const files = trackedFiles(repoRoot);
  return {
    alwaysReadBytes: sumBytes(paths, repoRoot, bytesOf),
    srcCommentBytes: sumBytes(
      files.filter((path) => UNDER_AN_SRC.test(path)),
      repoRoot,
      (path) => commentBytes(readFileSync(path, "utf8")),
    ),
    markdownBytes: sumBytes(
      files.filter((path) => path.endsWith(".md")),
      repoRoot,
      bytesOf,
    ),
    testOutputBytes: readCachedTestOutput(repoRoot),
    searchBytes: searchBytes(repoRoot),
  };
}

/** A mandatory read that names nothing under-reports metric one, which is the silent failure here. */
export function missingAlwaysRead(repoRoot = root) {
  const agentsPath = join(repoRoot, "AGENTS.md");
  if (!existsSync(agentsPath)) return ["AGENTS.md: not in the tree"];
  const agents = readFileSync(agentsPath, "utf8");
  return alwaysReadPaths(agents)
    .filter((path) => !existsSync(join(repoRoot, path)))
    .map((path) => `${path}: named by AGENTS.md and not in the tree`);
}

export function formatLine(metrics) {
  const { alwaysReadBytes, srcCommentBytes, markdownBytes, testOutputBytes } = metrics;
  const test = testOutputBytes === undefined ? "unmeasured" : testOutputBytes;
  const pairs = [
    ["always-read", alwaysReadBytes],
    ["src-comments", srcCommentBytes],
    ["markdown", markdownBytes],
    ["test-output", test],
    ["search-bytes", metrics.searchBytes],
  ];
  return pairs.map(([label, value]) => `${label} ${value}`).join("  ");
}

/** Runs the suite and caches the bytes it printed, refusing to store a red run. */
export function measureTestOutput(repoRoot = root) {
  // One command string through a shell: npm is a batch file on Windows, and arguments passed
  // alongside `shell` make Node print a deprecation over the very bytes being measured.
  const run = spawnSync(TEST_COMMAND, { cwd: repoRoot, encoding: "buffer", shell: true });
  if (run.status !== 0) return `${TEST_COMMAND}: ${run.error?.message ?? `exit ${run.status}`}`;
  const bytes = (run.stdout?.length ?? 0) + (run.stderr?.length ?? 0);
  const head = spawnSync("git", ["rev-parse", "--short", "HEAD"], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  const cache = { testOutputBytes: bytes, measuredAtRef: head.stdout?.trim() ?? "unknown" };
  writeFileSync(join(repoRoot, CACHE_PATH), `${JSON.stringify(cache, null, 2)}\n`, "utf8");
  return undefined;
}

/** Every reason to fail, each naming its own fix. */
export function scan(repoRoot = root) {
  const violations = missingAlwaysRead(repoRoot);
  const metrics = measure(repoRoot);
  if (metrics.alwaysReadBytes === 0) violations.push("always-read: nothing to sum");
  if (metrics.srcCommentBytes === 0)
    violations.push("src-comments: no tracked source under any src");
  if (metrics.markdownBytes === 0) violations.push("markdown: no tracked markdown in the tree");
  if (metrics.searchBytes === 0) violations.push("search-bytes: git listed nothing to search");
  if (metrics.testOutputBytes === undefined)
    violations.push(
      `test-output: no cache, run node ${CACHE_PATH.replace(".json", ".mjs")} --test`,
    );
  return violations;
}

export function main(argv = process.argv.slice(2), repoRoot = root) {
  if (argv.includes("--test")) {
    const failure = measureTestOutput(repoRoot);
    if (failure !== undefined) return fail([`test-output: ${failure}`]);
  }
  const violations = scan(repoRoot);
  if (violations.length > 0) return fail(violations);
  console.log(formatLine(measure(repoRoot)));
  return 0;
}

function fail(violations) {
  console.error(violations.join("\n"));
  return 1;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) process.exitCode = main();
